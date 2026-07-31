import test from 'node:test';
import assert from 'node:assert/strict';

import { createWatch, isDue, dueWatches, describeChange, staleFindings, CADENCES, REVERIFY_AFTER_DAYS } from '../core/watches.js';
import { validateFinding } from '../core/schema.js';
import { applyEvidence } from '../core/evidence.js';

function finding(overrides = {}) {
  const base = {
    demand: { oneLine: 'Invoice chasing eats a day a week', whoHasIt: 'two-person plumbing firms in the UK', inTheirWords: [] },
    evidence: {
      paying: [{ what: 'template', price: 12, currency: 'GBP', url: 'https://a.com/1', via: 'etsy-api' }],
      complaints: [{ quote: 'no sync', url: 'https://a.com/1', aboutWhat: 'accounting sync', via: 'etsy-api' }],
      volume: { method: 'not established', confidence: 'low' },
    },
    incumbents: [],
    whatWouldWin: [],
    risks: [{ risk: 'saturation', severity: 'low' }],
    verdict: { score: 50, wouldBuild: true, reasoning: 'ok' },
    ...overrides,
  };
  return applyEvidence(validateFinding(base).value);
}

test('cadence decides what is due', () => {
  const w = createWatch({ name: 'x', topic: 'x', cadence: 'daily' });
  assert.equal(isDue(w, new Date().toISOString()), true, 'a watch that has never run is due');

  const justRan = { ...w, lastRunAt: new Date().toISOString() };
  assert.equal(isDue(justRan, new Date().toISOString()), false);

  const yesterday = { ...w, lastRunAt: new Date(Date.now() - CADENCES.daily.ms - 1000).toISOString() };
  assert.equal(isDue(yesterday, new Date().toISOString()), true);

  const paused = { ...yesterday, state: 'paused' };
  assert.equal(isDue(paused, new Date().toISOString()), false);

  const manual = { ...yesterday, cadence: 'manual' };
  assert.equal(isDue(manual, new Date().toISOString()), false, 'manual watches only run when asked');
});

test('dueWatches filters rather than throwing on rubbish', () => {
  assert.deepEqual(dueWatches(null), []);
  assert.deepEqual(dueWatches([]), []);
});

test('the same finding twice reports nothing — this is what stops a watch being muted', () => {
  const before = finding();
  const after = finding();
  assert.equal(describeChange(before, after), null);
});

test('a first sighting is reported as new', () => {
  const change = describeChange(null, finding());
  assert.equal(change.kind, 'new');
});

test('a new complaint is a change worth reporting', () => {
  const before = finding();
  const after = finding();
  after.evidence.complaints.push({ quote: 'also no export', url: 'https://b.com/2', aboutWhat: 'exporting', via: 'etsy-api' });
  applyEvidence(after);

  const change = describeChange(before, after);
  assert.ok(change);
  assert.ok(change.changes.some((c) => c.field === 'complaints'));
});

test('a price movement on a listing we already knew about is reported', () => {
  const before = finding();
  const after = finding();
  after.evidence.paying[0].price = 19;

  const change = describeChange(before, after);
  assert.ok(change.changes.some((c) => c.field === 'price'));
  assert.match(change.summary, /price/);
});

test('evidence getting stronger is reported, and says which direction', () => {
  const before = finding();
  const after = finding();
  after.evidence.paying.push({ what: 'another', price: 30, currency: 'GBP', url: 'https://c.com/3', via: 'etsy-api' });
  after.evidence.complaints.push(
    { quote: 'no sync either', url: 'https://c.com/3', aboutWhat: 'syncing accounts', via: 'etsy-api' },
    { quote: 'sync is broken', url: 'https://d.com/4', aboutWhat: 'account syncing', via: 'etsy-api' },
  );
  applyEvidence(after);

  const change = describeChange(before, after);
  const strength = change.changes.find((c) => c.field === 'strength');
  assert.ok(strength, 'a level change must be reported');
  assert.match(strength.text, /strengthened/);
});

test('buildability flipping is reported', () => {
  const before = finding();
  before.buildability = { verdict: 'unclear' };
  const after = finding();
  after.buildability = { verdict: 'jason-can-build' };

  const change = describeChange(before, after);
  assert.ok(change.changes.some((c) => c.field === 'buildability'));
});

test('stale findings are the ones that have not been checked in a month', () => {
  const fresh = finding();
  fresh.id = 'fresh';
  fresh.lastVerifiedAt = new Date().toISOString();

  const old = finding();
  old.id = 'old';
  old.lastVerifiedAt = new Date(Date.now() - (REVERIFY_AFTER_DAYS + 5) * 86_400_000).toISOString();

  const archived = finding();
  archived.id = 'archived';
  archived.status = 'archived';
  archived.lastVerifiedAt = old.lastVerifiedAt;

  const stale = staleFindings([fresh, old, archived]);
  assert.equal(stale.length, 1);
  assert.equal(stale[0].id, 'old', 'archived findings are not re-verified');
});

test('a watch starts with a sane shape whatever it is handed', () => {
  const w = createWatch({ name: 'x'.repeat(500), topic: 'y'.repeat(900), cadence: 'nonsense', depth: 'nonsense' });
  assert.ok(w.name.length <= 120);
  assert.ok(w.topic.length <= 400);
  assert.equal(w.cadence, 'daily', 'an unknown cadence falls back rather than breaking the scheduler');
  assert.equal(w.state, 'active');
  assert.equal(w.runCount, 0);
});
