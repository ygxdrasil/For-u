import test from 'node:test';
import assert from 'node:assert/strict';

import { validateFinding, dedupKeyFor, summarizeFinding } from '../core/schema.js';

/** A finding that passes, so each test can break exactly one thing. */
function good(overrides = {}) {
  return {
    demand: {
      oneLine: 'Chasing unpaid invoices eats a day a week',
      whoHasIt: 'UK plumbers and electricians running one-to-three person firms',
      inTheirWords: [{ quote: 'I spend every Friday chasing money', url: 'https://forum.example.com/t/2', platform: 'forum' }],
    },
    evidence: {
      paying: [
        { what: 'Invoice chaser template', price: 12, currency: 'GBP', url: 'https://etsy.com/listing/1', platform: 'etsy', salesSignal: '4 reviews', signalMethod: 'counted from the reviews endpoint' },
      ],
      complaints: [{ quote: 'It never syncs with my accounting', url: 'https://etsy.com/listing/1', aboutWhat: 'accounting sync', platform: 'etsy' }],
      volume: { estimate: null, method: 'no published figure found for firms of this size', confidence: 'low' },
    },
    incumbents: [{ name: 'Thing', url: 'https://etsy.com/listing/1', price: 12, whatTheyGetWrong: 'no sync' }],
    whatWouldWin: [{ requirement: 'One-click Xero connection' }],
    risks: [{ risk: 'Xero could ship this themselves', severity: 'high' }],
    verdict: { score: 71, wouldBuild: true, reasoning: 'complaints agree on sync' },
    ...overrides,
  };
}

test('a complete finding validates', () => {
  const r = validateFinding(good());
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.equal(r.value.demand.oneLine, 'Chasing unpaid invoices eats a day a week');
});

test('risks are required — an engine that only finds opportunities is useless', () => {
  const r = validateFinding(good({ risks: [] }));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.path === 'risks'));
});

test('"small businesses" is rejected as an answer to who has it', () => {
  for (const vague of ['small businesses', 'Businesses', 'freelancers', 'everyone', 'SMBs']) {
    const r = validateFinding(good({ demand: { ...good().demand, whoHasIt: vague } }));
    assert.equal(r.ok, false, `"${vague}" should be rejected`);
    assert.ok(r.errors.some((e) => e.path === 'demand.whoHasIt'));
  }
});

test('a quote with no URL is not evidence', () => {
  const g = good();
  g.demand.inTheirWords[0].url = 'not-a-url';
  const r = validateFinding(g);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.path.startsWith('demand.inTheirWords')));
});

test('a price with no currency, or a non-numeric price, is refused', () => {
  const noCurrency = good();
  noCurrency.evidence.paying[0].currency = 'pounds';
  assert.equal(validateFinding(noCurrency).ok, false);

  const badPrice = good();
  badPrice.evidence.paying[0].price = 'about a tenner';
  assert.equal(validateFinding(badPrice).ok, false);
});

test('a sales signal without a method is refused — that is how a guess becomes a fact', () => {
  const g = good();
  g.evidence.paying[0].signalMethod = '';
  const r = validateFinding(g);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /signalMethod/.test(e.message)));
});

test('a volume estimate with no method is refused', () => {
  const g = good();
  g.evidence.volume = { estimate: 45000, method: '', confidence: 'high' };
  const r = validateFinding(g);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.path === 'evidence.volume.method'));
});

test('a complaint with no subject is refused, because agreement cannot be tested', () => {
  const g = good();
  g.evidence.complaints[0].aboutWhat = '';
  assert.equal(validateFinding(g).ok, false);
});

test('the model cannot set its own evidence strength', () => {
  const r = validateFinding(good({ evidence: { ...good().evidence, strength: 5, hypothesis: false } }));
  // Always reset to the floor here; core/evidence.js computes the real value.
  assert.equal(r.value.evidence.strength, 1);
  assert.equal(r.value.evidence.hypothesis, true);
});

test('scores are clamped and NaN never reaches storage', () => {
  const r = validateFinding(good({ verdict: { score: NaN, wouldBuild: true, reasoning: 'x' } }));
  assert.equal(r.value.verdict.score, 0);
  assert.ok(!Number.isNaN(r.value.verdict.score));

  const over = validateFinding(good({ verdict: { score: 5000, wouldBuild: 'yes', reasoning: 'x' } }));
  assert.equal(over.value.verdict.score, 100);
  assert.equal(over.value.verdict.wouldBuild, false, 'only a real boolean true counts');
});

test('rubbish input produces an error, not a crash', () => {
  for (const junk of [null, undefined, 'a string', 42, []]) {
    const r = validateFinding(junk);
    assert.equal(r.ok, false);
  }
});

test('dedup key ignores wording and word order', () => {
  const a = dedupKeyFor({ demand: { oneLine: 'Chasing unpaid invoices eats a day a week' } });
  const b = dedupKeyFor({ demand: { oneLine: 'chasing, unpaid INVOICES eat a day a week!' } });
  assert.equal(a, b);
  const c = dedupKeyFor({ demand: { oneLine: 'Wedding seating charts are painful to build' } });
  assert.notEqual(a, c);
});

test('summarize gives the HUD what it needs without the bulk', () => {
  const f = validateFinding(good()).value;
  const s = summarizeFinding(f);
  assert.equal(s.oneLine, f.demand.oneLine);
  assert.equal(s.payingCount, 1);
  assert.equal(typeof s.strength, 'number');
  assert.equal(s.inTheirWords, undefined, 'the summary must stay small');
});
