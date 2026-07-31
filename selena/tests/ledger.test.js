import test from 'node:test';
import assert from 'node:assert/strict';

import { createLedger, enforceLedger } from '../core/ledger.js';
import { validateFinding } from '../core/schema.js';
import { computeEvidence } from '../core/evidence.js';

function ledgerWith(...urls) {
  const l = createLedger();
  for (const u of urls) l.record({ url: u, status: 200, via: 'grounded-search' });
  return l;
}

function finding(overrides = {}) {
  return validateFinding({
    demand: {
      oneLine: 'Seating charts take a whole evening to redo',
      whoHasIt: 'independent wedding stationers with under ten orders a month',
      inTheirWords: [{ quote: 'redoing the chart took my whole evening', url: 'https://real.com/thread', platform: 'forum' }],
    },
    evidence: {
      // Read through the API, so readQuality is not "snippets only" and the
      // ladder is free to reach 5. Otherwise this fixture would be capped at 4
      // for a reason unrelated to what the test is about.
      paying: [{ what: 'Seating chart template', price: 18, currency: 'GBP', url: 'https://real.com/listing', platform: 'etsy', via: 'etsy-api' }],
      complaints: [{ quote: 'the template breaks when I add a table', url: 'https://real.com/listing', aboutWhat: 'breaks on edit', via: 'etsy-api' }],
      volume: { estimate: null, method: 'no published count of independent stationers found', confidence: 'low' },
    },
    incumbents: [{ name: 'A template', url: 'https://real.com/listing', whatTheyGetWrong: 'breaks on edit' }],
    whatWouldWin: [{ requirement: 'Adding a table should not break the layout' }],
    risks: [{ risk: 'Etsy could surface a first-party tool', severity: 'medium' }],
    verdict: { score: 60, wouldBuild: true, reasoning: 'agreed complaint, real price' },
    ...overrides,
  }).value;
}

test('a citation the run never read is deleted, not flagged', () => {
  const f = finding();
  f.demand.inTheirWords.push({ quote: 'invented', url: 'https://madeup.com/page', platform: 'forum' });

  const result = enforceLedger(f, ledgerWith('https://real.com/thread', 'https://real.com/listing'));

  assert.equal(result.violations.length, 1);
  assert.equal(result.violations[0].url, 'https://madeup.com/page');
  assert.equal(f.demand.inTheirWords.length, 1, 'the fabricated quote must be gone, not marked');
  assert.equal(f.demand.inTheirWords[0].url, 'https://real.com/thread');
});

test('canonicalisation means a tracking parameter does not look like a different page', () => {
  const l = ledgerWith('https://real.com/listing');
  assert.equal(l.has('https://www.real.com/listing/?utm_source=x'), true);
  assert.equal(l.has('https://real.com/other'), false);
});

test('an invented complaint cannot inflate the level, because the ledger runs first', () => {
  const f = finding();
  // Three agreeing complaints would be level 5 — but two of them are invented.
  f.evidence.complaints.push(
    { quote: 'also breaks on edit', url: 'https://fake1.com/r', aboutWhat: 'breaks on edit', platform: 'web' },
    { quote: 'breaks when edited', url: 'https://fake2.com/r', aboutWhat: 'breaks when edited', platform: 'web' },
  );
  f.evidence.paying.push({ what: 'another', price: 22, currency: 'GBP', url: 'https://fake1.com/p', platform: 'etsy' });

  const before = computeEvidence(f.evidence);
  assert.equal(before.strength, 5, 'this is what it would score if the citations were believed');

  enforceLedger(f, ledgerWith('https://real.com/thread', 'https://real.com/listing'));
  const after = computeEvidence(f.evidence);

  assert.ok(after.strength < 5, 'once unsupported claims are removed the level must fall');
  assert.equal(f.evidence.complaints.length, 1);
});

test('a volume estimate with a thin method is discarded and says so', () => {
  const f = finding();
  f.evidence.volume = { estimate: 40000, method: 'industry knowledge', confidence: 'high' };

  const result = enforceLedger(f, ledgerWith('https://real.com/listing'));

  assert.equal(f.evidence.volume.estimate, null);
  assert.equal(f.evidence.volume.confidence, 'low');
  assert.match(f.evidence.volume.method, /not established/);
  assert.ok(result.violations.some((v) => v.path === 'evidence.volume.estimate'));
});

test('a volume estimate with a real derivation and a read source survives', () => {
  const f = finding();
  f.evidence.volume = {
    estimate: 1200,
    method: 'counted active listings returned by the Etsy search endpoint for this taxonomy on the date shown',
    confidence: 'medium',
  };
  enforceLedger(f, ledgerWith('https://real.com/listing'));
  assert.equal(f.evidence.volume.estimate, 1200);
});

test('sources are rewritten from the ledger, never trusted from the model', () => {
  const f = finding();
  f.sources = [{ url: 'https://model-imagined-this.com/', status: 200 }];

  enforceLedger(f, ledgerWith('https://real.com/thread', 'https://real.com/listing'));

  const urls = f.sources.map((s) => s.url);
  assert.equal(urls.length, 2);
  assert.ok(!urls.some((u) => u.includes('model-imagined')));
  assert.ok(urls.some((u) => u.includes('real.com/thread')));
});

test('a failed fetch is not citable even though it is in the ledger', () => {
  const l = createLedger();
  l.record({ url: 'https://dead.com/page', status: 503, via: 'direct-fetch' });
  l.record({ url: 'https://alive.com/page', status: 200, via: 'direct-fetch' });

  assert.equal(l.size(), 2);
  assert.equal(l.ok().length, 1);
  assert.equal(l.citable().length, 1);
  assert.equal(l.citable()[0].url, 'https://alive.com/page');
});

test('a clean finding produces no violations at all', () => {
  const f = finding();
  const result = enforceLedger(f, ledgerWith('https://real.com/thread', 'https://real.com/listing'));
  assert.equal(result.ok, true);
  assert.equal(result.violations.length, 0);
  assert.equal(result.dropped.length, 0);
});
