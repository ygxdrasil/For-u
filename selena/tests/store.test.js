import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStore, findingSignature } from '../core/store.js';
import { validateFinding } from '../core/schema.js';

function makeFinding(id, overrides = {}) {
  const v = validateFinding({
    demand: { oneLine: `demand ${id}`, whoHasIt: 'independent florists doing weekly subscriptions', inTheirWords: [] },
    evidence: {
      paying: [{ what: 'x', price: 10, currency: 'GBP', url: 'https://a.com/1' }],
      complaints: [],
      volume: { method: 'not established', confidence: 'low' },
    },
    incumbents: [],
    whatWouldWin: [],
    risks: [{ risk: 'saturation', severity: 'medium' }],
    verdict: { score: 50, wouldBuild: true, reasoning: 'ok' },
    ...overrides,
  }).value;
  v.id = id;
  return v;
}

test('nothing in the store deletes: updates append a version', async () => {
  const store = createMemoryStore();
  const f = makeFinding('f1');

  await store.putFinding(f);
  await store.putFinding({ ...f, verdict: { ...f.verdict, score: 80 } });
  await store.putFinding({ ...f, status: 'archived' });

  const current = await store.getFinding('f1');
  assert.equal(current.status, 'archived');
  assert.equal(current.version, 3);

  const versions = await store.findingVersions('f1');
  assert.equal(versions.length, 3, 'every prior version is kept — a rejected finding is evidence later');
  assert.equal(versions[0].verdict.score, 50);
  assert.equal(versions[1].verdict.score, 80);
});

test('the store has no delete method at all', () => {
  const store = createMemoryStore();
  for (const name of ['delete', 'deleteFinding', 'removeFinding', 'remove', 'destroy', 'purge', 'clear', 'drop']) {
    assert.equal(typeof store[name], 'undefined', `store must not expose ${name}()`);
  }
});

test('concurrent writes to the same finding do not lose data', async () => {
  const store = createMemoryStore();
  await store.putFinding(makeFinding('race'));

  // The failure this reproduces: both callers read version 1, both write
  // version 2, and one update vanishes with no error anywhere.
  await Promise.all(
    [80, 85, 90, 95].map((score) =>
      store.putFinding({ ...makeFinding('race'), verdict: { score, wouldBuild: true, reasoning: 'r' } }),
    ),
  );

  const versions = await store.findingVersions('race');
  assert.equal(versions.length, 5);
  const numbers = versions.map((v) => v.version);
  assert.deepEqual(numbers, [1, 2, 3, 4, 5], 'versions must be a clean sequence, not four copies of 2');
});

test('the store hands out copies, so a caller cannot rewrite it by accident', async () => {
  const store = createMemoryStore();
  await store.putFinding(makeFinding('copy'));

  const first = await store.getFinding('copy');
  first.demand.oneLine = 'mutated by the caller';

  const second = await store.getFinding('copy');
  assert.equal(second.demand.oneLine, 'demand copy');
});

test('spend is summed for the current month and never returns NaN', async () => {
  const store = createMemoryStore();
  const month = new Date().toISOString().slice(0, 7);
  await store.addSpend({ kind: 'model', usd: 0.01, at: `${month}-01T00:00:00.000Z` });
  await store.addSpend({ kind: 'model', usd: 'rubbish', at: `${month}-02T00:00:00.000Z` });
  await store.addSpend({ kind: 'model', usd: 0.02, at: '1999-01-01T00:00:00.000Z' });

  const total = await store.getMonthlySpend();
  assert.ok(Math.abs(total - 0.01) < 1e-9, `expected 0.01, got ${total}`);
  assert.ok(!Number.isNaN(total));
});

test('search counts are tracked separately from token spend', async () => {
  const store = createMemoryStore();
  const today = new Date().toISOString().slice(0, 10);
  await store.addSpend({ kind: 'search', usd: 0, searches: 3, at: `${today}T10:00:00.000Z` });
  await store.addSpend({ kind: 'model', usd: 0.05, searches: 0, at: `${today}T10:00:00.000Z` });

  const counts = await store.getSearchCounts();
  assert.equal(counts.today, 3);
  assert.equal(counts.month, 3);
});

test('watch memory remembers what was reported, and counts repeats', async () => {
  const store = createMemoryStore();
  assert.equal(await store.getSeen('w1', 'd1'), null);

  const first = await store.markSeen('w1', 'd1', 'sig-a');
  assert.equal(first.timesSeen, 1);

  const second = await store.markSeen('w1', 'd1', 'sig-b');
  assert.equal(second.timesSeen, 2);
  assert.equal(second.signature, 'sig-b');
  assert.equal(second.firstSeenAt, first.firstSeenAt, 'first seen must not move');

  assert.equal(await store.seenCount('w1'), 1);
});

test('findings are listed strongest first', async () => {
  const store = createMemoryStore();
  const weak = makeFinding('weak');
  weak.evidence.strength = 2;
  const strong = makeFinding('strong');
  strong.evidence.strength = 5;
  await store.putFinding(weak);
  await store.putFinding(strong);

  const list = await store.listFindings({ status: 'active' });
  assert.equal(list[0].id, 'strong');

  const filtered = await store.listFindings({ minStrength: 4 });
  assert.equal(filtered.length, 1);
});

test('signatures change when the evidence changes, and not otherwise', () => {
  const a = makeFinding('sig');
  const b = makeFinding('sig');
  assert.equal(findingSignature(a), findingSignature(b));

  b.evidence.paying[0].price = 99;
  assert.notEqual(findingSignature(a), findingSignature(b));

  const c = makeFinding('sig');
  c.foundAt = 'a totally different timestamp';
  assert.equal(findingSignature(a), findingSignature(c), 'a new timestamp alone is not a change worth reporting');
});

test('the memory store is shared across calls, or nothing survives a request', async () => {
  // Found by running the API rather than by unit-testing it: every route calls
  // createStore() per request, so a fresh memory store each time meant you
  // could create a watch and the very next call would say it did not exist.
  // With no DATABASE_URL — which is how a first deploy runs — the whole thing
  // looked broken rather than merely non-durable.
  const { createStore, resetMemorySingleton } = await import('../core/store.js');
  resetMemorySingleton();

  const first = await createStore({ databaseUrl: null });
  await first.putWatch({ id: 'w1', name: 'persists', createdAt: new Date().toISOString() });

  const second = await createStore({ databaseUrl: null });
  const found = await second.getWatch('w1');

  assert.ok(found, 'a second createStore() call must see what the first one wrote');
  assert.equal(found.name, 'persists');
  assert.equal(second.durable, false, 'it is still honest about not being durable');

  resetMemorySingleton();
  const third = await createStore({ databaseUrl: null });
  assert.equal(await third.getWatch('w1'), null, 'and a reset really does clear it');
});

test('createMemoryStore() itself stays isolated, so tests do not leak into each other', () => {
  const a = createMemoryStore();
  const b = createMemoryStore();
  assert.notEqual(a, b);
});
