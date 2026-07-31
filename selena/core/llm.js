/**
 * The model seam. Gemini today, swappable tomorrow.
 *
 * Model IDs and prices were read from ai.google.dev on 2026-07-31 rather than
 * recalled. Retirements are dated and sometimes early, so a model ID from
 * training data is a coin flip — hence the fallback chain, so a retired model
 * degrades an answer instead of removing a capability.
 *
 * Three hard-won constraints are encoded here:
 *
 * 1. Thinking tokens are billed out of maxOutputTokens. Set a thinking budget
 *    at or above the ceiling and the model can spend its whole allowance
 *    thinking and return an EMPTY STRING from a request that looks completely
 *    healthy. assertTierSanity() makes that unshippable.
 *
 * 2. Built-in search and function calling cannot be sent together, and neither
 *    can search and a response schema. That is why research is two calls: one
 *    grounded call that reads the web, then one plain call that turns what it
 *    read into structured JSON. Trying to do both at once fails at request
 *    time, not at review time.
 *
 * 3. Prompt caching needs byte-identical prefixes, so system instructions are
 *    ordered by volatility — the fixed rules first, the task last — and the
 *    tool list never varies per message within a tier.
 *
 * @google/genai is imported dynamically so the core, the tests and the stress
 * suite all run with no node_modules at all. A test that needs an SDK
 * installed is a test that quietly stops being run.
 */

import { PRICES, searchGenerationOf } from './meter.js';
import { clampNumber } from './util.js';

export const TIERS = {
  /** Reads the live web. Grounded, so no schema and no function calls. */
  search: {
    models: ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'],
    maxOutputTokens: 8192,
    thinkingBudget: 0,
    grounded: true,
  },
  /** Turns what was read into the finding schema. Cheapest model that can hold a format. */
  extract: {
    models: ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'],
    maxOutputTokens: 8192,
    thinkingBudget: 0,
    grounded: false,
  },
  /** Scores, argues with itself, writes the verdict. Worth a little thinking. */
  judge: {
    models: ['gemini-2.5-flash', 'gemini-3.6-flash'],
    maxOutputTokens: 4096,
    thinkingBudget: 1024,
    grounded: false,
  },
  /** Answering Jason's questions and short status turns. */
  chat: {
    models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
    maxOutputTokens: 4096,
    thinkingBudget: 512,
    grounded: false,
  },
};

export function assertTierSanity(tiers = TIERS) {
  for (const [name, tier] of Object.entries(tiers)) {
    if (tier.thinkingBudget >= tier.maxOutputTokens) {
      throw new Error(
        `Tier "${name}" has thinkingBudget ${tier.thinkingBudget} >= maxOutputTokens ${tier.maxOutputTokens}. ` +
          'Thinking bills out of the output allowance, so this returns an empty string with no error at all.',
      );
    }
    for (const model of tier.models) {
      if (!PRICES[model]) throw new Error(`Tier "${name}" lists "${model}", which has no price in core/meter.js.`);
    }
  }
  return true;
}

export class ModelTimeoutError extends Error {
  constructor(model, ms) {
    super(`${model} did not answer within ${Math.round(ms / 1000)}s, so I stopped waiting rather than letting the whole request die silently.`);
    this.name = 'ModelTimeoutError';
    this.model = model;
  }
}

export class NoModelAvailableError extends Error {
  constructor(tried) {
    super(`Every model in this tier failed: ${tried.map((t) => `${t.model} (${t.error})`).join('; ')}`);
    this.name = 'NoModelAvailableError';
    this.tried = tried;
  }
}

export class NoKeyError extends Error {
  constructor() {
    super('No Gemini API key is configured, so Selena cannot read anything. She will still run, show her state and explain what she would have done — but every finding would be invented, and inventing findings is the one thing she must never do.');
    this.name = 'NoKeyError';
  }
}

/** A retirement is worth falling back on; a bad request is not, and must not be masked. */
function looksRetired(err) {
  const m = String(err?.message ?? err).toLowerCase();
  return m.includes('not found') || m.includes('404') || m.includes('is not supported') || m.includes('deprecated') || m.includes('has been retired');
}

/**
 * Pull real source URLs out of grounding metadata.
 *
 * Google hands back redirect URLs on its own host plus a title that is usually
 * the publisher's domain. We record exactly that and label it honestly rather
 * than pretending we hold the publisher's own URL.
 */
export function groundingSources(response) {
  const out = [];
  for (const candidate of response?.candidates ?? []) {
    for (const chunk of candidate?.groundingMetadata?.groundingChunks ?? []) {
      const web = chunk?.web;
      if (!web?.uri) continue;
      out.push({ url: web.uri, title: web.title ?? null, domain: web.domain ?? web.title ?? null });
    }
  }
  return out;
}

export function groundingQueries(response) {
  const queries = [];
  for (const candidate of response?.candidates ?? []) {
    for (const q of candidate?.groundingMetadata?.webSearchQueries ?? []) queries.push(q);
  }
  return [...new Set(queries)];
}

export function createLlm({ apiKey, meter, tiers = TIERS, clientFactory = null, defaultTimeoutMs = 45_000 }) {
  if (!apiKey && !clientFactory) throw new NoKeyError();
  assertTierSanity(tiers);

  let clientPromise = null;
  async function getClient() {
    if (clientFactory) return clientFactory(apiKey);
    if (!clientPromise) {
      clientPromise = import('@google/genai').then(({ GoogleGenAI }) => new GoogleGenAI({ apiKey }));
    }
    return clientPromise;
  }

  /**
   * @param {object} opts
   * @param {'search'|'extract'|'judge'|'chat'} opts.tier
   * @param {string} opts.prompt          the task — goes LAST, after the stable rules
   * @param {string} opts.systemInstruction  stable prefix, ordered by volatility for cache hits
   * @param {object} [opts.responseSchema]   structured output; illegal on a grounded tier
   */
  async function generate({ tier = 'chat', prompt, systemInstruction = '', responseSchema = null, label = null, timeoutMs = null }) {
    const spec = tiers[tier];
    if (!spec) throw new Error(`Unknown tier "${tier}"`);
    if (spec.grounded && responseSchema) {
      throw new Error(
        `Tier "${tier}" is grounded, so it cannot also carry a response schema — the request is rejected outright. Read with the grounded tier, then shape the result with the extract tier.`,
      );
    }

    const client = await getClient();
    const contents = [{ role: 'user', parts: [{ text: String(prompt ?? '') }] }];
    const tried = [];

    for (const model of spec.models) {
      const approxInputTokens = Math.ceil((String(systemInstruction).length + String(prompt ?? '').length) / 4);

      // The stop is checked BEFORE the request, every time.
      await meter.assertCanSpend({ model, inputTokens: approxInputTokens, maxOutputTokens: spec.maxOutputTokens, what: label ?? tier });

      let searchBudget = null;
      if (spec.grounded) searchBudget = await meter.assertCanSearch({ model });

      const config = {
        systemInstruction: String(systemInstruction),
        maxOutputTokens: spec.maxOutputTokens,
        // 0 disables thinking. -1 would hand the model an automatic budget,
        // which is exactly the unbounded spend a watching agent must not have.
        thinkingConfig: { thinkingBudget: clampNumber(spec.thinkingBudget, 0, spec.maxOutputTokens - 1, 0) },
      };
      if (spec.grounded) config.tools = [{ googleSearch: {} }];
      if (responseSchema) {
        config.responseMimeType = 'application/json';
        config.responseSchema = responseSchema;
      }

      const budgetMs = timeoutMs ?? defaultTimeoutMs;
      const callModel = async (cfg) => {
        const controller = new AbortController();
        let timer;
        const expired = new Promise((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new ModelTimeoutError(model, budgetMs));
          }, budgetMs);
        });
        try {
          // Aborting stops us waiting; the race is what guarantees we return
          // in time, because the request itself is still billed either way.
          return await Promise.race([
            client.models.generateContent({ model, contents, config: { ...cfg, abortSignal: controller.signal } }),
            expired,
          ]);
        } finally {
          clearTimeout(timer);
        }
      };

      try {
        let res;
        try {
          res = await callModel(config);
        } catch (err) {
          // The cheapest models are the likeliest to reject a thinking budget.
          // Retry once without it rather than losing the request over a config
          // field — and say which happened rather than silently degrading.
          if (!/thinking|thought/i.test(String(err?.message ?? ''))) throw err;
          const { thinkingConfig, ...withoutThinking } = config;
          res = await callModel(withoutThinking);
        }

        const usage = res.usageMetadata ?? {};
        const priced = await meter.recordUsage({ model, usage, label: label ?? tier });

        let searchCost = { usd: 0, queries: 0 };
        const sources = spec.grounded ? groundingSources(res) : [];
        const queries = spec.grounded ? groundingQueries(res) : [];
        if (spec.grounded) {
          searchCost = await meter.recordSearch({
            model,
            label: label ?? tier,
            unitUsd: searchBudget?.unitUsd ?? 0,
            // Bill for what the model actually searched, not for the call.
            queries: Math.max(1, queries.length),
          });
        }

        const text = res.text ?? '';
        const empty = !String(text).trim();

        return {
          model,
          generation: searchGenerationOf(model),
          text,
          empty,
          emptyReason: empty
            ? `${model} returned no text. Thinking tokens used: ${usage.thoughtsTokenCount ?? 0} of a ${spec.maxOutputTokens} output allowance — if those numbers are close, the thinking budget ate the answer.`
            : null,
          sources,
          queries,
          usage: priced,
          searchCost,
          raw: res,
        };
      } catch (err) {
        tried.push({ model, error: err.message });
        // A budget stop is a decision, not a model failure. Do not burn the
        // rest of the fallback chain discovering the same thing three times.
        if (err.name === 'BudgetExceededError') throw err;
        if (!looksRetired(err)) throw err;
      }
    }

    throw new NoModelAvailableError(tried);
  }

  /** JSON with a schema, parsed defensively — a model can still return prose. */
  async function generateJson(opts) {
    const res = await generate(opts);
    if (res.empty) return { ...res, json: null, parseError: res.emptyReason };
    const raw = String(res.text).trim();
    // Strip a markdown fence if one appears despite responseMimeType.
    const body = raw.startsWith('```') ? raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '') : raw;
    try {
      return { ...res, json: JSON.parse(body), parseError: null };
    } catch (err) {
      return { ...res, json: null, parseError: `${err.message}. First 200 characters: ${body.slice(0, 200)}` };
    }
  }

  return { generate, generateJson, tiers, modelFor: (tier) => tiers[tier].models[0] };
}
