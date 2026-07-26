import {GoogleGenAI} from '@google/genai';
import type {GenerateContentConfig} from '@google/genai';
import {config} from '../config';
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
    let spoken = false;

    try {
      const response = await this.client.models.generateContentStream(
        this.params(request),
      );
      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.groundingMetadata) request.onGrounded?.();
        if (chunk.text) {
          spoken = true;
          yield chunk.text;
        }
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
    }

    const response = await this.client.models.generateContentStream(
      this.params({...request, search: false}),
    );
    for await (const chunk of response) {
      if (chunk.text) yield chunk.text;
    }
  }

  async complete(request: GenerateRequest): Promise<string> {
    const response = await this.client.models.generateContent(
      this.params(request),
    );
    return response.text ?? '';
  }

  async transcribe(request: TranscribeRequest): Promise<string> {
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

    return (response.text ?? '').trim();
  }

  async speak(request: SpeakRequest): Promise<SpokenAudio> {
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
          voiceConfig: {prebuiltVoiceConfig: {voiceName: config.voice}},
        },
      },
    });

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

  private params(request: GenerateRequest) {
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
    } else if (request.search) {
      // Grounding is a tool, not a mode: she searches when the answer needs
      // something she cannot know, and doesn't when it doesn't.
      config.tools = [{googleSearch: {}}];
    }

    // Conversation should feel immediate; deliberation costs a beat of silence
    // that is far more noticeable when the reply is spoken aloud.
    if (request.fast) {
      config.thinkingConfig = {thinkingBudget: 0};
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
