/**
 * Money. An unpriced model makes the meter lie in both directions, and a
 * thinking budget above the output ceiling returns an empty string from a
 * request that reads as entirely healthy.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceUsage, estimateCost, createMeter, UnpricedModelError, BudgetExceededError, PRICES } from '../core/meter.js';
import { assertThinkingBudgets, TIERS } from '../core/llm.js';
import { createMemoryStore } from '../core/store.js';

test('an unpriced model is a loud error, never a fallback rate', () => {
  assert.throws(() => priceUsage('gemini-made-up', { promptTokenCount: 10 }), UnpricedModelError);
});

test('thinking tokens are billed at the output rate', () => {
  const priced = priceUsage('gemini-3.6-flash', {
    promptTokenCount: 1_000_000,
    candidatesTokenCount: 1_000_000,
    thoughtsTokenCount: 1_000_000,
  });
  // 1M input at $1.50 + 2M output-billed tokens at $7.50 = $16.50
  assert.equal(Math.round(priced.usd * 100) / 100, 16.5);
  assert.equal(priced.thinkingTokens, 1_000_000);
});

test('cached input is billed at the cached rate, not the full one', () => {
  const priced = priceUsage('gemini-3.6-flash', { promptTokenCount: 1_000_000, cachedContentTokenCount: 1_000_000 });
  assert.equal(Math.round(priced.usd * 1000) / 1000, 0.15);
  assert.equal(priced.inputTokens, 0);
});

test('the spend cap is checked BEFORE the request, not after', async () => {
  const store = createMemoryStore();
  const meter = createMeter({ store, capUsd: 0.01 });

  // Nothing spent yet, but the projected cost of this call exceeds the cap, so
  // it must refuse before any money is spent.
  await assert.rejects(
    () => meter.assertCanSpend({ model: 'gemini-3.6-flash', inputTokens: 100_000, maxOutputTokens: 32_768 }),
    BudgetExceededError,
  );

  const spend = await store.getMonthlySpend();
  assert.equal(spend, 0, 'refusing a call must not record spend');
});

test('every model offered by a tier has a price', () => {
  for (const tier of Object.values(TIERS)) {
    for (const model of tier.models) {
      assert.ok(PRICES[model], `tier model ${model} has no price`);
    }
  }
});

test('a thinking budget at or above the output ceiling is rejected at startup', () => {
  // Get this wrong and the model spends its whole allowance thinking and
  // returns an empty string with no error at all.
  assert.throws(
    () => assertThinkingBudgets({ bad: { models: ['gemini-3.6-flash'], maxOutputTokens: 4096, thinkingBudget: 4096 } }),
    /thinkingBudget/,
  );
  assert.equal(assertThinkingBudgets(TIERS), true);
});

test('estimated cost is pessimistic so the stop trips before the spend', () => {
  const est = estimateCost({ model: 'gemini-3.6-flash', inputTokens: 0, maxOutputTokens: 1_000_000 });
  assert.equal(est, 7.5);
});
