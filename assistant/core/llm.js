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

export const TIERS = {
  /** Short conversational turns, status questions, formatting. */
  chat: {
    models: ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite'],
    maxOutputTokens: 4096,
    thinkingBudget: 0,
  },
  /** Designing, validating and repairing workflows. Earns its keep here. */
  design: {
    models: ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-pro'],
    maxOutputTokens: 32768,
    thinkingBudget: 8192,
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
  async function generate({ tier = 'chat', contents, systemInstruction, functionDeclarations = null, label = null }) {
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

      try {
        const res = await client.models.generateContent({ model, contents, config });

        const usage = res.usageMetadata ?? {};
        const priced = await meter.record({ model, usage, label: label ?? tier });

        const text = res.text ?? '';
        const calls = res.functionCalls ?? [];

        // An empty answer with no tool call is the silent-failure signature.
        // Surface it as an explicit condition rather than an empty reply.
        const empty = !text.trim() && !calls.length;

        return {
          model,
          text,
          functionCalls: calls,
          empty,
          emptyReason: empty
            ? `${model} returned no text and no tool call. Thinking tokens used: ${usage.thoughtsTokenCount ?? 0} of a ${spec.maxOutputTokens} output allowance.`
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
