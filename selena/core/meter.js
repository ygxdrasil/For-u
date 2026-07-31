/**
 * Spend metering and the hard stop.
 *
 * Selena bills while you are asleep, so this matters more here than in a thing
 * you sit in front of. Two rules are encoded:
 *
 * - The stop is checked BEFORE the request. Checking after means you find out
 *   you went over by paying to find out.
 * - An unpriced model or an unpriced action is a loud error, never a guessed
 *   rate. A fallback rate makes the meter wrong in both directions and you
 *   stop believing the number, which is worse than having no number.
 *
 * Grounded search is metered as its own line, because it is billed per REQUEST
 * and not per token. Counting it in tokens would make the cheapest part of the
 * job look free right up until the free allowance ran out.
 */

import { clampNumber, monthKey, nowIso, sumFinite } from './util.js';

/**
 * USD per million tokens. Read from ai.google.dev/gemini-api/docs/pricing on
 * 2026-07-31 — checked, not recalled. Model retirements are dated and
 * sometimes early, so a model ID from training data is a coin flip.
 */
export const PRICES = {
  'gemini-2.5-flash': { input: 0.3, output: 2.5, cachedInput: 0.03 },
  'gemini-2.5-flash-lite': { input: 0.1, output: 0.4, cachedInput: 0.01 },
  'gemini-2.5-pro': { input: 1.25, output: 10.0, cachedInput: 0.125 },
  'gemini-3.1-flash-lite': { input: 0.25, output: 1.5, cachedInput: 0.025 },
  'gemini-3.5-flash-lite': { input: 0.3, output: 2.5, cachedInput: 0.03 },
  'gemini-3.5-flash': { input: 1.5, output: 9.0, cachedInput: 0.15 },
  'gemini-3.6-flash': { input: 1.5, output: 7.5, cachedInput: 0.15 },
};

/**
 * Grounding with Google Search is billed per request, with a free allowance
 * that differs by model generation:
 *
 *   2.5 models  1,500 free requests per DAY,   then $35 per 1,000
 *   3.x models  5,000 free requests per MONTH, then $14 per 1,000
 *
 * The whole budget works because of the 2.5 daily allowance, which is why
 * that is the default generation. Same source, same date as PRICES.
 */
export const SEARCH_PRICING = {
  '2.5': { freePerDay: 1500, freePerMonth: null, usdPer1000: 35 },
  '3.x': { freePerDay: null, freePerMonth: 5000, usdPer1000: 14 },
};

export const PRICES_CHECKED_ON = '2026-07-31';

export function searchGenerationOf(model) {
  return String(model).startsWith('gemini-2.5') ? '2.5' : '3.x';
}

export class UnpricedModelError extends Error {
  constructor(model) {
    super(
      `No price on record for "${model}". Refusing to meter it at a guessed rate — add it to PRICES in core/meter.js with the current published price. An unpriced model makes every spend figure a lie.`,
    );
    this.name = 'UnpricedModelError';
    this.model = model;
  }
}

export class BudgetExceededError extends Error {
  constructor({ spent, cap, what }) {
    super(
      `Monthly cap reached: $${spent.toFixed(4)} of $${cap.toFixed(2)}. Refusing to spend on ${what}. Raise MONTHLY_USD_CAP or wait for the month to roll over.`,
    );
    this.name = 'BudgetExceededError';
    this.spent = spent;
    this.cap = cap;
    this.what = what;
  }
}

export function priceUsage(model, usage) {
  const price = PRICES[model];
  if (!price) throw new UnpricedModelError(model);

  const cached = clampNumber(usage?.cachedContentTokenCount, 0, 1e9, 0);
  const promptTotal = clampNumber(usage?.promptTokenCount, 0, 1e9, 0);
  // promptTokenCount includes the cached portion; the cached part bills lower.
  const freshInput = Math.max(0, promptTotal - cached);
  const candidates = clampNumber(usage?.candidatesTokenCount, 0, 1e9, 0);
  // Thinking is billed at the OUTPUT rate and reported separately.
  const thoughts = clampNumber(usage?.thoughtsTokenCount, 0, 1e9, 0);

  const usd =
    (freshInput / 1e6) * price.input +
    (cached / 1e6) * price.cachedInput +
    ((candidates + thoughts) / 1e6) * price.output;

  return {
    inputTokens: freshInput,
    cachedTokens: cached,
    outputTokens: candidates,
    thinkingTokens: thoughts,
    usd: clampNumber(usd, 0, 1e6, 0),
  };
}

/**
 * Pessimistic on purpose: assumes the whole output allowance is used. A stop
 * that only trips on average cost lets the expensive call through, which is
 * the only call that mattered.
 */
export function estimateCost({ model, inputTokens = 0, maxOutputTokens = 0 }) {
  const price = PRICES[model];
  if (!price) throw new UnpricedModelError(model);
  return (clampNumber(inputTokens, 0, 1e9, 0) / 1e6) * price.input + (clampNumber(maxOutputTokens, 0, 1e9, 0) / 1e6) * price.output;
}

/**
 * What the next grounded search will cost, given how many have already been
 * made inside the relevant free window.
 */
export function estimateSearchCost({ model, usedToday = 0, usedThisMonth = 0 }) {
  const gen = searchGenerationOf(model);
  const plan = SEARCH_PRICING[gen];
  const used = plan.freePerDay !== null ? usedToday : usedThisMonth;
  const free = plan.freePerDay ?? plan.freePerMonth;
  if (clampNumber(used, 0, 1e9, 0) < free) return 0;
  return plan.usdPer1000 / 1000;
}

export function createMeter({ store, capUsd = 10, now = nowIso }) {
  const cap = clampNumber(capUsd, 0, 10_000, 10);

  return {
    capUsd: cap,

    /** Before every model request. Throws rather than overspending. */
    async assertCanSpend({ model, inputTokens = 0, maxOutputTokens = 0, what = null }) {
      const spent = await store.getMonthlySpend();
      const projected = spent + estimateCost({ model, inputTokens, maxOutputTokens });
      if (projected > cap) throw new BudgetExceededError({ spent, cap, what: what ?? model });
      return { spent, cap, headroom: cap - spent };
    },

    /** Before every grounded search. Free ones still get counted. */
    async assertCanSearch({ model }) {
      const counts = await store.getSearchCounts();
      const unit = estimateSearchCost({ model, usedToday: counts.today, usedThisMonth: counts.month });
      if (unit === 0) return { spent: await store.getMonthlySpend(), cap, unitUsd: 0, free: true, counts };
      const spent = await store.getMonthlySpend();
      if (spent + unit > cap) throw new BudgetExceededError({ spent, cap, what: 'a grounded search' });
      return { spent, cap, unitUsd: unit, free: false, counts };
    },

    async recordUsage({ model, usage, label = null }) {
      const priced = priceUsage(model, usage);
      await store.addSpend({ kind: 'model', model, label, ...priced, at: now() });
      return priced;
    },

    async recordSearch({ model, label = null, unitUsd = 0, queries = 1 }) {
      const usd = clampNumber(unitUsd, 0, 100, 0) * clampNumber(queries, 0, 1000, 1);
      await store.addSpend({
        kind: 'search',
        model,
        label,
        inputTokens: 0,
        outputTokens: 0,
        thinkingTokens: 0,
        cachedTokens: 0,
        searches: queries,
        usd,
        at: now(),
      });
      return { usd, queries };
    },

    async summary() {
      const spent = await store.getMonthlySpend();
      const counts = await store.getSearchCounts();
      return {
        month: monthKey(now()),
        monthToDateUsd: spent,
        capUsd: cap,
        headroomUsd: Math.max(0, cap - spent),
        searchesToday: counts.today,
        searchesThisMonth: counts.month,
        freeSearchAllowance: SEARCH_PRICING,
        pricesCheckedOn: PRICES_CHECKED_ON,
      };
    },
  };
}

/** Total a list of spend rows without letting one bad row produce NaN. */
export function totalSpend(rows) {
  return sumFinite(rows, 'usd');
}
