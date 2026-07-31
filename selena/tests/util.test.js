import test from 'node:test';
import assert from 'node:assert/strict';

import { clampNumber, canonicalUrl, phraseSimilarity, subjectAgreement, createDeadline, spacedSettled, sumFinite, stemWord } from '../core/util.js';
import { withLock } from '../core/queue.js';

test('clampNumber survives NaN rather than propagating it', () => {
  // Math.max(0, NaN) is NaN, and a NaN written to Postgres comes back null,
  // which corrupts the record silently. This is the whole reason the helper
  // exists, so it is the first thing asserted.
  assert.equal(clampNumber(NaN, 0, 100, 7), 7);
  assert.equal(clampNumber(undefined, 0, 100, 7), 7);
  assert.equal(clampNumber('nonsense', 0, 100, 7), 7);
  assert.equal(clampNumber(Infinity, 0, 100, 7), 7);
  assert.equal(clampNumber(null, 0, 100, 7), 7);
  assert.equal(clampNumber('42', 0, 100, 7), 42);
  assert.equal(clampNumber(-5, 0, 100, 7), 0);
  assert.equal(clampNumber(500, 0, 100, 7), 100);
  assert.ok(!Number.isNaN(clampNumber(NaN, 0, 100)));
});

test('sumFinite ignores rubbish rows instead of returning NaN', () => {
  assert.equal(sumFinite([{ usd: 1 }, { usd: 'x' }, { usd: null }, { usd: 2 }], 'usd'), 3);
  assert.equal(sumFinite([]), 0);
  assert.equal(sumFinite(null), 0);
});

test('canonicalUrl strips tracking and normalises so dedup actually matches', () => {
  assert.equal(canonicalUrl('https://www.Etsy.com/listing/1/?utm_source=a&b=2'), 'https://etsy.com/listing/1?b=2');
  assert.equal(canonicalUrl('http://example.com/a/'), 'https://example.com/a');
  assert.equal(canonicalUrl('https://example.com/'), 'https://example.com/');
  // Query order must not change identity.
  assert.equal(canonicalUrl('https://e.com/x?b=1&a=2'), canonicalUrl('https://e.com/x?a=2&b=1'));
  assert.equal(canonicalUrl('not a url'), null);
  assert.equal(canonicalUrl('javascript:alert(1)'), null);
  assert.equal(canonicalUrl(''), null);
  assert.equal(canonicalUrl(null), null);
});

test('stemming lets differently-worded complaints match', () => {
  assert.equal(stemWord('accounting'), 'account');
  assert.equal(stemWord('accounts'), 'account');
  assert.equal(stemWord('shipping'), 'ship');
  assert.equal(stemWord('business'), 'business'); // must not become "busines"
  assert.equal(stemWord('is'), 'is');
});

test('subjectAgreement is looser than phraseSimilarity, and only where intended', () => {
  const a = 'accounting sync';
  const b = 'will not sync to my accounts software';
  assert.ok(subjectAgreement(a, b) >= 0.5, 'complaints about the same thing should cluster');
  // De-duplication must stay strict: merging two different demands into one
  // record is a far more expensive mistake than keeping two.
  assert.ok(phraseSimilarity(a, b) < 0.5);
  assert.equal(phraseSimilarity('', 'anything'), 0);
});

test('deadline reports remaining time and refuses work it cannot finish', () => {
  let clock = 1000;
  const d = createDeadline(500, () => clock);
  assert.equal(d.expired(), false);
  assert.equal(d.tooLateFor(600), true, 'a step longer than the remaining budget must not be started');
  clock = 1600;
  assert.equal(d.expired(), true);
  assert.equal(d.remainingMs, 0);
});

test('spacedSettled keeps going after a failure and reports every outcome', async () => {
  // Never let one failed fetch in a batch sink the rest: five of eight read is
  // a finding with a caveat, not an error.
  const results = await spacedSettled(
    [1, 2, 3, 4],
    async (n) => {
      if (n === 2) throw new Error('boom');
      return n * 10;
    },
    { gapMs: 0 },
  );
  assert.equal(results.length, 4);
  assert.deepEqual(
    results.map((r) => r.ok),
    [true, false, true, true],
  );
  assert.equal(results[1].error, 'boom');
  assert.equal(results[3].value, 40);
});

test('spacedSettled stops starting work once the deadline passes', async () => {
  let clock = 0;
  const d = createDeadline(10, () => clock);
  const results = await spacedSettled(
    [1, 2, 3],
    async (n) => {
      clock += 20; // the first item overruns the whole budget
      return n;
    },
    { gapMs: 0, deadline: d },
  );
  assert.equal(results[0].ok, true);
  assert.equal(results[1].skipped, true);
  assert.equal(results[2].skipped, true);
});

test('withLock serialises by key name so concurrent updates cannot interleave', async () => {
  // The failure this reproduces: two callers read, both append, one write is
  // lost with no error anywhere.
  let shared = [];
  const readModifyWrite = async (value) => {
    const snapshot = shared;
    await new Promise((r) => setTimeout(r, 5));
    shared = [...snapshot, value];
  };

  await Promise.all([1, 2, 3, 4].map((v) => withLock('finding:same', () => readModifyWrite(v))));
  assert.equal(shared.length, 4, 'every update must survive');

  // Different keys are free to run at once.
  shared = [];
  await Promise.all([withLock('a', () => readModifyWrite(1)), withLock('b', () => readModifyWrite(2))]);
  assert.ok(shared.length >= 1);
});

test('withLock does not poison the chain when one caller throws', async () => {
  await assert.rejects(() => withLock('k', async () => { throw new Error('first fails'); }));
  // If the rejection became the next caller's `previous`, every later write
  // for this key would fail forever.
  const after = await withLock('k', async () => 'second still works');
  assert.equal(after, 'second still works');
});

test('withLock refuses a non-string key, because object identity protects nothing', () => {
  assert.throws(() => withLock({}, async () => 1), /stable string key/);
});
