/**
 * Gemini adapter.
 *
 * Model IDs and prices were read from ai.google.dev on 2026-07-31 rather than
 * recalled — model retirements are dated and sometimes early, and a model ID
 * from training data is a coin flip.
 *
 * Two tiers, because one setting for both halves of the job is a ceiling on
 * how good it can be at the hard half. A one-line "is it running?" needs no
 * deliberation; designing a twelve-node workflow needs a lot.
 *
 * Fallbacks exist so a retired model degrades the answer instead of removing
 * the capability.
 */

import { GoogleGenAI } from '@google/genai';
import { PRICES } from './meter.js';

/**
 * Fallback chains, ordered by what you would actually want NEXT.
 *
 * The model in use comes from preferences and goes at the front of the chain;
 * everything here is what happens when that one is retired, busy, or returns
 * nothing. They were ordered cheapest-first, which meant the first fallback
 * from any choice was gemini-2.5-flash-lite — the weakest model on the list,
 * and the one that returns an empty reply most often. Falling back TO the
 * thing you fell back FROM is not a fallback.
 */
export const TIERS = {
  /** Short conversational turns, status questions, formatting. */
  chat: {
    models: ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite'],
    maxOutputTokens: 4096,
    thinkingBudget: 0,
  },
  /** Designing, validating and repairing workflows. */
  design: {
    models: ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    maxOutputTokens: 16384,
    thinkingBudget: 6144,
  },
};

/**
 * Thinking tokens are billed out of the output allowance on these models. Set
 * a budget at or above maxOutputTokens and the model can spend its entire
 * allowance thinking and return an EMPTY STRING from a request that looks
 * completely healthy — no error, no warning, just nothing. Assert the
 * relationship at startup so that failure can never reach production.
 */
export function assertThinkingBudgets(tiers = TIERS) {
  for (const [name, tier] of Object.entries(tiers)) {
    if (tier.thinkingBudget >= tier.maxOutputTokens) {
      throw new Error(
        `Tier "${name}" has thinkingBudget ${tier.thinkingBudget} >= maxOutputTokens ${tier.maxOutputTokens}. ` +
          'Thinking is billed out of the output allowance, so this returns an empty string with no error. ' +
          'Keep the budget well below the ceiling.',
      );
    }
    for (const model of tier.models) {
      if (!PRICES[model]) {
        throw new Error(`Tier "${name}" lists model "${model}" which has no price in core/meter.js.`);
      }
    }
  }
  return true;
}

export class ModelTimeoutError extends Error {
  constructor(model, ms) {
    super(`${model} did not answer within ${Math.round(ms / 1000)}s, so I stopped waiting rather than letting the request die silently.`);
    this.name = 'ModelTimeoutError';
    this.model = model;
    this.timeoutMs = ms;
  }
}

export class NoModelAvailableError extends Error {
  constructor(tried) {
    super(`Every model in this tier failed: ${tried.map((t) => `${t.model} (${t.error})`).join('; ')}`);
    this.name = 'NoModelAvailableError';
    this.tried = tried;
  }
}

/**
 * A model call is a retirement risk on every request, so the fallback chain is
 * walked on 404/NOT_FOUND-shaped errors. Anything else (a bad request, a
 * safety block) is a real error about THIS call and is not masked by silently
 * trying a different model.
 */
function looksRetired(err) {
  const m = String(err?.message ?? err).toLowerCase();
  return m.includes('not found') || m.includes('404') || m.includes('is not supported') || m.includes('deprecated');
}

/**
 * Busy is not broken.
 *
 * "This model is currently experiencing high demand" — 503 UNAVAILABLE — is
 * Google having a spike, not a fault in the request, the key, or anything in
 * the user's n8n. Reported as "the model call failed" it reads like the latter,
 * and there is nothing to do about it except be told to wait.
 *
 * There is already a fallback chain for exactly this shape of problem, and a
 * demand spike on one model is rarely a spike on all of them. So an overloaded
 * model is retried once after a pause, then handed to the next model in the
 * tier, and only if every one is busy does it become an answer.
 */
function looksOverloaded(err) {
  const m = String(err?.message ?? err).toLowerCase();
  return (
    m.includes('503') ||
    m.includes('unavailable') ||
    m.includes('overloaded') ||
    m.includes('high demand') ||
    m.includes('429') ||
    m.includes('resource_exhausted') ||
    m.includes('too many requests')
  );
}

/**
 * A conversation whose history the model will no longer accept.
 *
 * Sessions saved before signatures were carried through still hold function
 * calls with no signature on them, and they cannot be given one after the
 * fact — so every future turn on that conversation fails the same way, for
 * good. The same happens when a turn escalates from the chat model to the
 * design model: the signature belongs to the model that produced it.
 *
 * Rather than tell someone their conversation is permanently broken, the
 * history is flattened once — the structured calls become plain text saying
 * what was called and what came back — and the request is sent again. The
 * meaning survives, the validation has nothing left to reject, and the turn
 * completes.
 */
function looksLikeSignatureProblem(err) {
  const m = String(err?.message ?? err).toLowerCase();
  return (
    m.includes('thought_signature') ||
    m.includes('thoughtsignature') ||
    // The other way a history is refused: a turn of function RESPONSES that
    // does not sit immediately after its turn of function CALLS, or a count
    // that does not match. Same cause — a conversation whose structure is no
    // longer valid — and the same repair.
    m.includes('function response turn') ||
    m.includes('function call turn') ||
    (m.includes('functionresponse') && m.includes('functioncall'))
  );
}

function flattenToolTurns(contents) {
  const described = (part) => {
    if (part?.functionCall) {
      return { text: `[called ${part.functionCall.name} with ${JSON.stringify(part.functionCall.args ?? {}).slice(0, 2000)}]` };
    }
    if (part?.functionResponse) {
      return { text: `[result of ${part.functionResponse.name}: ${JSON.stringify(part.functionResponse.response ?? {}).slice(0, 4000)}]` };
    }
    return part;
  };
  return (contents ?? []).map((turn) => ({
    ...turn,
    parts: (turn.parts ?? []).map(described),
  }));
}

export class ModelsBusyError extends Error {
  constructor(tried) {
    super(
      `Every model I can use is busy right now — Google is refusing new requests for them, which is a spike at their end and not a fault in your setup or your workflows. Nothing was changed. Try again in a minute. (Tried: ${tried.map((t) => t.model).join(', ')}.)`,
    );
    this.name = 'ModelsBusyError';
    this.tried = tried;
  }
}

/**
 * Why nothing came back — without naming a cause the numbers contradict.
 *
 * The thinking budget IS a real way to get an empty reply, but only when the
 * thinking actually consumed the allowance. Saying so next to 625 tokens of a
 * 16,384 ceiling sent someone to change a setting that was working fine.
 */
function explainEmpty({ model, finishReason, usage, spec, tried }) {
  const thoughts = usage?.thoughtsTokenCount ?? 0;
  const attempts = tried.filter((t) => t.error === 'returned nothing').length;

  if (finishReason && finishReason !== 'STOP') {
    return `${model} returned nothing and stopped because of ${finishReason}. That is the model refusing or being cut off — not a setting.`;
  }
  if (thoughts > spec.maxOutputTokens * 0.6) {
    return `${model} spent ${thoughts} of its ${spec.maxOutputTokens} output allowance on thinking and had nothing left to answer with. Lower the thinking budget in Settings.`;
  }
  return `${model} returned nothing at all — no text, no tool call, no reason given, after ${attempts || 1} attempt${attempts === 1 ? '' : 's'}${
    tried.length > 1 ? ` across ${new Set(tried.map((t) => t.model)).size} models` : ''
  }. Only ${thoughts} of a ${spec.maxOutputTokens} allowance went on thinking, so the budget is not what did it. This is the model itself, and it is usually temporary.`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** One pause before giving up on a busy model. Spikes are usually seconds. */
const BUSY_RETRY_MS = 1500;

export function createLlm({ apiKey, meter, tiers = TIERS, clientFactory = null }) {
  if (!apiKey) throw new Error('Gemini API key is required');
  assertThinkingBudgets(tiers);

  const client = clientFactory ? clientFactory(apiKey) : new GoogleGenAI({ apiKey });

  /**
   * One request. Returns text, any function calls, and real metered usage.
   *
   * @param {object} opts
   * @param {'chat'|'design'} opts.tier
   * @param {object[]} opts.contents  Gemini `contents` array
   * @param {string} opts.systemInstruction
   * @param {object[]} [opts.functionDeclarations]
   */
  async function generate({ tier = 'chat', contents, systemInstruction, functionDeclarations = null, label = null, timeoutMs = null }) {
    const spec = tiers[tier];
    if (!spec) throw new Error(`Unknown tier "${tier}"`);

    const tried = [];
    let busy = false;

    // The history actually sent. Replaced once, for the rest of this call, if
    // the model rejects the signatures in it.
    let history = contents;
    let repairedHistory = false;

    for (const model of spec.models) {
      let retriedThisModel = false;
      let retriedEmpty = false;

      // Retried in place when the model is merely busy; `break` moves to the
      // next model in the tier, `continue` tries this one again.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Hard stop BEFORE the request. Checking after means paying to find out.
        // Re-checked on a retry too: a retry is a second billable request.
        const approxInputTokens = Math.ceil(
          (systemInstruction.length + JSON.stringify(history).length) / 4,
        );
        await meter.assertCanSpend({ model, inputTokens: approxInputTokens, maxOutputTokens: spec.maxOutputTokens });

        const config = {
          systemInstruction,
          maxOutputTokens: spec.maxOutputTokens,
          // A thinking budget of 0 disables it; -1 would hand the model an
          // automatic budget, which is exactly the unbounded spend we don't want.
          thinkingConfig: { thinkingBudget: spec.thinkingBudget },
        };

        if (functionDeclarations?.length) {
          // Built-in search and function calling cannot be sent together — the
          // request is rejected outright — so this adapter never offers search.
          config.tools = [{ functionDeclarations }];
        }

        // A model call with no time limit is the serverless killer: the platform
        // stops the function at ITS limit and returns nothing at all — no error,
        // no partial answer, nothing. Bounding the call here means a slow model
        // costs a truthful "I ran out of time" instead of silence.
        const deadline = timeoutMs && timeoutMs > 0 ? timeoutMs : null;
        const callModel = async (cfg) => {
          if (!deadline) return client.models.generateContent({ model, contents: history, config: cfg });

          const controller = new AbortController();
          let timer;
          let timedOut = false;
          const expired = new Promise((_, reject) => {
            timer = setTimeout(() => {
              timedOut = true;
              controller.abort();
              reject(new ModelTimeoutError(model, deadline));
            }, deadline);
          });
          try {
            // The signal is passed as well as raced: aborting stops us waiting,
            // but the request itself is still billed, so the race is what
            // guarantees we return in time.
            return await Promise.race([client.models.generateContent({ model, contents: history, config: { ...cfg, abortSignal: controller.signal } }), expired]);
          } catch (err) {
            // Aborting makes the SDK reject too, and that rejection can win the
            // race. It says "aborted", which is true and useless: the caller
            // checks for ModelTimeoutError to stop gracefully and say what it
            // managed to do, and an ordinary error there produces a bare "the
            // model call failed" instead. Whatever the abort threw, if we are the
            // ones who aborted it, this is a timeout.
            if (timedOut && !(err instanceof ModelTimeoutError)) throw new ModelTimeoutError(model, deadline);
            throw err;
          } finally {
            clearTimeout(timer);
          }
        };

        try {
          let res;
          try {
            res = await callModel(config);
          } catch (err) {
            // Not every model accepts a thinking budget, and the cheapest tiers
            // are the most likely to reject one. Retry once without it rather
            // than failing the whole request over a config field.
            //
            // Matched on the whole phrase, not on "thought": a missing
            // thought_signature also contains that word, and this branch was
            // catching it — spending a second request re-sending the same
            // rejected history with the thinking config stripped, which was
            // never the problem. Substring matching, again.
            const complaint = String(err?.message ?? '');
            const aboutTheBudget = /thinking budget|thinkingbudget|thinking_budget|thinkingconfig|thinking config/i.test(complaint);
            if (!aboutTheBudget || looksLikeSignatureProblem(err) || config.thinkingConfig === undefined) throw err;
            const { thinkingConfig, ...withoutThinking } = config;
            res = await callModel(withoutThinking);
          }

          const usage = res.usageMetadata ?? {};
          const priced = await meter.record({ model, usage, label: label ?? tier });

          const text = res.text ?? '';
          const calls = res.functionCalls ?? [];

          /**
           * WHY the model stopped, which the happy path never has to ask.
           *
           * MAX_TOKENS is the dangerous one: the reply arrives, the request is
           * 200, nothing throws, and the last sentence simply stops. Presented as
           * a finished answer it is indistinguishable from one — the only failure
           * in this adapter that looks exactly like success. SAFETY and RECITATION
           * matter for a different reason: they produce an empty reply that used
           * to be blamed on the thinking budget, sending anyone reading it to
           * change a setting that was never the problem.
           */
          const finishReason = res.candidates?.[0]?.finishReason ?? null;
          const truncated = finishReason === 'MAX_TOKENS';

          // An empty answer with no tool call is the silent-failure signature.
          const empty = !text.trim() && !calls.length;

          /**
           * Nothing came back. That is usually the model, not the request.
           *
           * The lite models do it intermittently on the same input that worked
           * a second earlier, and the old message asserted a cause the numbers
           * flatly contradicted — "the thinking budget ate the output
           * allowance" printed next to 625 thinking tokens out of 16,384.
           * Wrong, confidently, in a system whose whole point is not doing
           * that.
           *
           * So: ask again, and if it is still empty, hand the turn to the next
           * model in the tier rather than reporting silence as an answer. An
           * empty reply bills for the input and almost no output, so a second
           * attempt is close to free — much cheaper than a wasted turn.
           */
          if (empty) {
            tried.push({ model, error: 'returned nothing' });
            if (!retriedEmpty && (!deadline || deadline > 4000)) {
              retriedEmpty = true;
              continue;
            }
            if (model !== spec.models[spec.models.length - 1]) break; // next model
          }

          return {
            model,
            text,
            functionCalls: calls,
            /**
             * The model's turn EXACTLY as it came back, to be pushed into the
             * next request's history unchanged.
             *
             * Gemini 3 attaches a thoughtSignature to functionCall parts and
             * validates it when that turn is sent back. Rebuilding the turn
             * from the parsed name and args — which is the obvious thing to do,
             * and what this did — drops the signature, and the NEXT request is
             * rejected outright:
             *
             *   400 INVALID_ARGUMENT: Function call is missing a
             *   thought_signature in functionCall parts
             *
             * So the whole build stops after the first tool call. Nothing here
             * may reconstruct a model turn; it is copied.
             */
            modelContent: res.candidates?.[0]?.content ?? null,
            /**
             * The flattened history, when one had to be used, so the caller can
             * keep it. Repairing inside this function fixes the request; giving
             * it back fixes the CONVERSATION. Without it, a session saved before
             * signatures were carried through pays a rejected round trip on
             * every future turn, forever — quietly, out of a 50-second budget.
             */
            repairedHistory: repairedHistory ? history : null,
            finishReason,
            truncated,
            empty,
            emptyReason: empty ? explainEmpty({ model, finishReason, usage, spec, tried }) : null,
            usage: priced,
            raw: res,
          };
        } catch (err) {
          tried.push({ model, error: err.message });

          if (looksOverloaded(err)) {
            busy = true;
            // One short pause and the same model again — but only if the caller
            // has time to spare. Spending someone's deadline sitting in a sleep
            // is how a request returns nothing at all instead of something.
            if (!retriedThisModel && (!deadline || deadline > BUSY_RETRY_MS * 3)) {
              retriedThisModel = true;
              await wait(BUSY_RETRY_MS);
              continue;
            }
            break; // next model in the chain
          }

          // A history the model will not accept is repaired once and retried
          // on the same model. Nothing else can fix it: a signature cannot be
          // invented after the fact, so without this the conversation is dead
          // for good rather than for one turn.
          if (looksLikeSignatureProblem(err) && !repairedHistory) {
            repairedHistory = true;
            history = flattenToolTurns(history);
            continue;
          }

          if (looksRetired(err)) break; // next model in the chain
          throw err;
        }
      }
    }

    // Every model busy is a different sentence from every model gone. One says
    // wait a minute; the other says the chain needs updating.
    if (busy) throw new ModelsBusyError(tried);
    throw new NoModelAvailableError(tried);
  }

  return { generate, tiers, modelFor: (tier) => tiers[tier].models[0] };
}
