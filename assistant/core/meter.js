/**
 * Spend metering and the hard stop.
 *
 * Two rules from the last project are encoded here:
 *
 * - The stop is checked BEFORE the request, not after. Checking after means
 *   you find out you went over by paying to find out.
 * - An unpriced model is a loud error, never a fallback rate. A fallback rate
 *   makes the meter wrong in both directions: it under-reports expensive
 *   models and over-reports cheap ones, and you stop trusting the number.
 */

/**
 * Prices in USD per million tokens, from ai.google.dev/gemini-api/docs/pricing
 * (checked 2026-07-31 against the official docs, not from memory).
 *
 * `thinking` is not a separate line: thinking tokens are billed at the OUTPUT
 * rate and are reported separately as thoughtsTokenCount, so the meter adds
 * candidates + thoughts before multiplying.
 */
export const PRICES = {
  'gemini-3.6-flash': { input: 1.5, output: 7.5, cachedInput: 0.15 },
  'gemini-3.5-flash': { input: 1.5, output: 9.0, cachedInput: 0.15 },
  'gemini-3.5-flash-lite': { input: 0.3, output: 2.5, cachedInput: 0.03 },
  'gemini-3.1-flash-lite': { input: 0.25, output: 1.5, cachedInput: 0.025 },
  'gemini-3.1-pro-preview': { input: 2.0, output: 12.0, cachedInput: 0.2 },
  'gemini-2.5-flash': { input: 0.3, output: 2.5, cachedInput: 0.03 },
  'gemini-2.5-flash-lite': { input: 0.1, output: 0.4, cachedInput: 0.01 },
  'gemini-2.5-pro': { input: 1.25, output: 10.0, cachedInput: 0.125 },
};

export const PRICES_CHECKED_ON = '2026-07-31';

export class UnpricedModelError extends Error {
  constructor(model) {
    super(
      `No price on record for model "${model}". Refusing to meter it at a guessed rate — add it to PRICES in core/meter.js with the current published price. An unpriced model makes every spend figure a lie.`,
    );
    this.name = 'UnpricedModelError';
    this.model = model;
  }
}

export class BudgetExceededError extends Error {
  constructor({ spent, cap, model }) {
    super(
      `Monthly spend cap reached: $${spent.toFixed(4)} of $${cap.toFixed(2)}. Refusing to call ${model}. Raise MONTHLY_USD_CAP or wait for the month to roll over.`,
    );
    this.name = 'BudgetExceededError';
    this.spent = spent;
    this.cap = cap;
  }
}

/**
 * @param {object} usage  usageMetadata from @google/genai
 * @returns {{inputTokens:number, outputTokens:number, thinkingTokens:number, cachedTokens:number, usd:number}}
 */
export function priceUsage(model, usage) {
  const price = PRICES[model];
  if (!price) throw new UnpricedModelError(model);

  const cached = usage?.cachedContentTokenCount ?? 0;
  const promptTotal = usage?.promptTokenCount ?? 0;
  // promptTokenCount includes the cached portion; the cached part bills lower.
  const freshInput = Math.max(0, promptTotal - cached);
  const candidates = usage?.candidatesTokenCount ?? 0;
  const thoughts = usage?.thoughtsTokenCount ?? 0;

  const usd =
    (freshInput / 1e6) * price.input +
    (cached / 1e6) * price.cachedInput +
    ((candidates + thoughts) / 1e6) * price.output;

  return {
    inputTokens: freshInput,
    cachedTokens: cached,
    outputTokens: candidates,
    thinkingTokens: thoughts,
    usd,
  };
}

/**
 * Estimate the cost of a call we have not made yet, so the hard stop can be
 * checked before spending. Deliberately pessimistic: it assumes the full
 * output allowance is used, because a stop that only trips on average cost
 * lets the expensive call through.
 */
export function estimateCost({ model, inputTokens, maxOutputTokens }) {
  const price = PRICES[model];
  if (!price) throw new UnpricedModelError(model);
  return (inputTokens / 1e6) * price.input + (maxOutputTokens / 1e6) * price.output;
}

export function createMeter({ store, capUsd = 8 }) {
  return {
    capUsd,

    /** Called before every model request. Throws rather than overspending. */
    async assertCanSpend({ model, inputTokens = 0, maxOutputTokens = 0 }) {
      const spent = await store.getMonthlySpend();
      const projected = spent + estimateCost({ model, inputTokens, maxOutputTokens });
      if (projected > capUsd) {
        throw new BudgetExceededError({ spent, cap: capUsd, model });
      }
      return { spent, cap: capUsd, headroom: capUsd - spent };
    },

    /** Called after every model request, with the real reported usage. */
    async record({ model, usage, label = null }) {
      const priced = priceUsage(model, usage);
      await store.addSpend({ model, label, ...priced, at: new Date().toISOString() });
      return priced;
    },

    async summary() {
      const spent = await store.getMonthlySpend();
      return {
        monthToDateUsd: spent,
        capUsd,
        headroomUsd: Math.max(0, capUsd - spent),
        pricesCheckedOn: PRICES_CHECKED_ON,
      };
    },
  };
}
