import {GoogleGenAI} from '@google/genai';
import type {Content, GenerateContentConfig} from '@google/genai';
import * as budget from '../budget';
import {config} from '../config';
import {chosenVoice} from '../keys';
import type {
  GenerateRequest,
  LlmProvider,
  SpeakRequest,
  SpokenAudio,
  TranscribeRequest,
} from './types';

const TRANSCRIBE_PROMPT = `Write out what is said in this recording.

The speaker may have a strong accent, may not be a native English speaker, and may hesitate, restart, or use imperfect grammar. Transcribe them accurately and charitably:

- Write the words they meant, not a phonetic imitation of how they came out. If someone says "I go yesterday to the shop", write that — do not correct their grammar, but do not mangle it further either.
- Keep their own words and word order. You are transcribing, not translating and not rewriting.
- Drop pure disfluencies — "um", "uh", false starts abandoned mid-word — since they add nothing when read back.
- Proper nouns matter most and are the hardest to hear. Use the context below to recognise names of people, places, and things rather than guessing at similar-sounding words.
- If a stretch is genuinely unintelligible, leave it out rather than inventing something plausible. A short accurate transcript beats a complete invented one.
- If the speaker uses another language entirely, transcribe it in that language.

Return only the words spoken, with ordinary punctuation. No preamble, no quotes, no speaker labels, no description of the audio, no notes about audio quality. If there is no speech at all, return nothing.`;

/**
 * How many times she may act before answering.
 *
 * High enough for "add that, and what else is on my list", low enough that a
 * model stuck in a loop stops rather than running until the request times out.
 */
const MAX_TOOL_ROUNDS = 5;

/**
 * Bills a response against the monthly cap.
 *
 * Fire-and-forget: what she spent is worth knowing, but a failure to write it
 * down must never cost the user their answer.
 */
interface Usage {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  /** The slice of the prompt served from cache, billed at a quarter. */
  cachedContentTokenCount?: number;
}

function meter(model: string, usage: Usage | undefined): void {
  if (!usage) return;
  void budget
    .record(
      model,
      usage.promptTokenCount ?? 0,
      usage.candidatesTokenCount ?? 0,
      usage.cachedContentTokenCount ?? 0,
    )
    .catch(() => {});
}

/**
 * Which voice one utterance comes out in.
 *
 * The audition override wins, then the voice the user chose, then the default.
 * Exported bare so the self-test can prove the order — the first version of
 * the override was applied with a pattern that no longer matched this file,
 * silently changed nothing, and shipped: every audition played in the current
 * voice, and no test could have noticed because the logic lived inline.
 */
export function voiceFor(request: SpeakRequest): string {
  return request.voice || chosenVoice() || config.voice;
}

const SPEAK_DIRECTION =
  'Read the following aloud in a calm, warm, unhurried voice, the way a ' +
  'composed personal assistant would speak to someone they know well. Read ' +
  'only the text itself:';

/** Gemini labels its audio `audio/L16;codec=pcm;rate=24000`. */
function sampleRateOf(mimeType: string | undefined): number {
  const rate = Number(/rate=(\d+)/.exec(mimeType ?? '')?.[1]);
  return Number.isFinite(rate) && rate > 0 ? rate : 24_000;
}

/**
 * The speech model hands back headerless 16-bit PCM, which no browser will
 * play. Forty-four bytes of WAV header in front of it and every one will.
 */
function wrapPcmAsWav(base64Pcm: string, sampleRate: number): string {
  const pcm = Buffer.from(base64Pcm, 'base64');
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM header length
  header.writeUInt16LE(1, 20); // uncompressed
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // bytes per second
  header.writeUInt16LE(2, 32); // bytes per sample
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]).toString('base64');
}

export class GeminiProvider implements LlmProvider {
  readonly name = 'gemini';
  private client: GoogleGenAI;

  constructor(
    apiKey: string,
    readonly model: string,
  ) {
    this.client = new GoogleGenAI({apiKey});
  }

  async *stream(request: GenerateRequest): AsyncIterable<string> {
    await budget.requireBudget();
    let spoken = false;

    try {
      // The conversation grows as she acts: each round may end in tool calls,
      // whose results are appended and the whole thing asked again, until she
      // has nothing left to do and simply answers.
      const history: Content[] = request.turns.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{text: turn.text}],
      }));

      for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
        const response = await this.client.models.generateContentStream({
          ...this.params(request),
          contents: history,
        });

        const calls: {name: string; args: Record<string, unknown>}[] = [];
        // Usage is metered once, after the stream drains — never per chunk.
        // Gemini reports usageMetadata cumulatively on every chunk it sends,
        // so metering inside the loop billed a ten-chunk reply something like
        // ten times over. That single line was most of why she seemed to
        // spend so fast. The last chunk carries the final total; keep it.
        let usage: Usage | undefined;

        for await (const chunk of response) {
          if (chunk.candidates?.[0]?.groundingMetadata) request.onGrounded?.();
          if (chunk.usageMetadata) usage = chunk.usageMetadata;

          for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
            if (part.functionCall?.name) {
              calls.push({
                name: part.functionCall.name,
                args: (part.functionCall.args ?? {}) as Record<string, unknown>,
              });
            }
          }

          if (chunk.text) {
            spoken = true;
            yield chunk.text;
          }
        }

        meter(this.model, usage);

        // Nothing to do: that was her answer.
        if (calls.length === 0 || !request.onToolCall) return;

        history.push({
          role: 'model',
          parts: calls.map((call) => ({
            functionCall: {name: call.name, args: call.args},
          })),
        });

        const results = [];
        for (const call of calls) {
          const result = await request.onToolCall(call.name, call.args);
          request.onToolUsed?.(call.name, result);
          results.push({
            functionResponse: {name: call.name, response: {result}},
          });
        }
        history.push({role: 'user', parts: results});
      }

      return;
    } catch (error) {
      // The daily allowance for grounded prompts is smaller than the one for
      // ordinary ones, and it runs out mid-day rather than at a boundary. An
      // assistant who goes mute the moment she cannot search is worse than one
      // who answers from what she already knows and says so.
      if (!request.search || spoken) throw error;
      console.error(
        '[grace] search unavailable, answering without it:',
        (error as Error).message,
      );
      // Silently dropping to an ungrounded answer is how "she says she cannot
      // reach the web" goes undiagnosed for days.
      request.onSearchFailed?.((error as Error).message);
    }

    const response = await this.client.models.generateContentStream(
      this.params({...request, search: false}),
    );
    let usage: Usage | undefined;
    for await (const chunk of response) {
      if (chunk.usageMetadata) usage = chunk.usageMetadata;
      if (chunk.text) yield chunk.text;
    }
    meter(this.model, usage);
  }

  async complete(request: GenerateRequest): Promise<string> {
    await budget.requireBudget();
    const response = await this.client.models.generateContent(
      this.params(request),
    );
    meter(this.model, response.usageMetadata);
    return response.text ?? '';
  }

  async transcribe(request: TranscribeRequest): Promise<string> {
    await budget.requireBudget();
    const response = await this.client.models.generateContent({
      model: config.transcribeModel,
      contents: [
        {
          role: 'user',
          parts: [
            {inlineData: {mimeType: request.mimeType, data: request.audio}},
            {
              text: request.context
                ? `${TRANSCRIBE_PROMPT}\n\nContext for recognising names and topics:\n${request.context}`
                : TRANSCRIBE_PROMPT,
            },
          ],
        },
      ],
      config: {
        // Transcription is not a creative task; drifting off the audio is the
        // one failure mode that matters.
        temperature: 0,
        abortSignal: request.signal,
        thinkingConfig: {thinkingBudget: 0},
      },
    });

    meter(config.transcribeModel, response.usageMetadata);
    return (response.text ?? '').trim();
  }

  async speak(request: SpeakRequest): Promise<SpokenAudio> {
    await budget.requireBudget();
    const response = await this.client.models.generateContent({
      model: config.speechModel,
      // The instruction rides along with the words. The model reads the
      // direction and speaks only what follows it.
      contents: [
        {
          role: 'user',
          parts: [{text: `${SPEAK_DIRECTION}\n\n${request.text}`}],
        },
      ],
      config: {
        abortSignal: request.signal,
        responseModalities: ['AUDIO'],
        speechConfig: {
          // A pasted choice wins over the deploy-time default, like every key.
          voiceConfig: {prebuiltVoiceConfig: {voiceName: voiceFor(request)}},
        },
      },
    });

    meter(config.speechModel, response.usageMetadata);

    const part = response.candidates?.[0]?.content?.parts?.find(
      (candidate) => candidate.inlineData?.data,
    );
    const pcm = part?.inlineData?.data;
    if (!pcm) throw new Error('the speech model returned no audio');

    return {
      audio: wrapPcmAsWav(pcm, sampleRateOf(part.inlineData?.mimeType)),
      mimeType: 'audio/wav',
    };
  }

  /**
   * Public so the self-test can assert on the request that goes out, rather
   * than restating this logic and testing a copy of it.
   */
  params(request: GenerateRequest) {
    const config: GenerateContentConfig = {
      systemInstruction: request.system,
      temperature: request.temperature ?? 0.7,
      abortSignal: request.signal,
    };

    if (request.maxOutputTokens) {
      config.maxOutputTokens = request.maxOutputTokens;
    }

    if (request.json) {
      config.responseMimeType = 'application/json';
      config.responseSchema = request.json;
    } else if (request.tools?.length) {
      // Never both. Gemini rejects the combination outright — "Built-in tools
      // and Function Calling cannot be combined in the same request" — and
      // sending both once cost her the web the moment she was given hands.
      // Her own functions win, because searching is one of them.
      config.tools = [{functionDeclarations: request.tools}];
    } else if (request.search) {
      config.tools = [{googleSearch: {}}];
    }

    // Conversation should feel immediate; deliberation costs a beat of silence
    // that is far more noticeable when the reply is spoken aloud.
    //
    // Zero is only safe with no tool attached. Deciding to search *is*
    // deliberation, so zeroing the budget leaves the tool present and unused:
    // she answers from memory and then says, quite correctly, that she cannot
    // reach the web. But the default is dynamic, which on a plain "what's on
    // today" spends thousands of tokens working out that the answer is the
    // diary — seconds of silence for a decision that was never in doubt.
    //
    // A small budget is the middle: enough to pick a tool, not enough to
    // ruminate. It is the single largest thing between her and answering
    // quickly, now that she always has tools in hand.
    if (request.fast) {
      config.thinkingConfig = {thinkingBudget: config.tools ? 256 : 0};
    }

    return {
      model: this.model,
      contents: request.turns.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{text: turn.text}],
      })),
      config,
    };
  }
}
