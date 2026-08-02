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
 * Fallback chains, cheapest first. These are only the defaults and the
 * fallback order — the model actually used comes from preferences.
 */
export const TIERS = {
  /** Short conversational turns, status questions, formatting. */
  chat: {
    models: ['gemini-2.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'],
    maxOutputTokens: 4096,
    thinkingBudget: 0,
  },
  /** Designing, validating and repairing workflows. */
  design: {
    models: ['gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    maxOutputTokens: 16384,
    thinkingBudget: 2048,
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

    for (const model of spec.models) {
      // Hard stop BEFORE the request. Checking after means paying to find out.
      const approxInputTokens = Math.ceil(
        (systemInstruction.length + JSON.stringify(contents).length) / 4,
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
        if (!deadline) return client.models.generateContent({ model, contents, config: cfg });

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
          return await Promise.race([client.models.generateContent({ model, contents, config: { ...cfg, abortSignal: controller.signal } }), expired]);
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
          // than failing the whole request over a config field — and say which
          // happened rather than silently degrading.
          if (!/thinking|thought/i.test(String(err?.message ?? '')) || config.thinkingConfig === undefined) throw err;
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
        // Surface it as an explicit condition rather than an empty reply.
        const empty = !text.trim() && !calls.length;

        return {
          model,
          text,
          functionCalls: calls,
          finishReason,
          truncated,
          empty,
          emptyReason: empty
            ? finishReason && finishReason !== 'STOP'
              ? `${model} returned no text and no tool call, and stopped because of ${finishReason}. That is the model refusing or being cut off — not the thinking budget.`
              : `${model} returned no text and no tool call. Thinking tokens used: ${usage.thoughtsTokenCount ?? 0} of a ${spec.maxOutputTokens} output allowance.`
            : null,
          usage: priced,
          raw: res,
        };
      } catch (err) {
        tried.push({ model, error: err.message });
        if (!looksRetired(err)) throw err;
      }
    }

    throw new NoModelAvailableError(tried);
  }

  return { generate, tiers, modelFor: (tier) => tiers[tier].models[0] };
}
