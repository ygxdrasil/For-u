/**
 * Keys you paste rather than deploy.
 *
 * A key is the one thing in this system that must travel in exactly one
 * direction. Every test here is a way it could come back out, or a way the
 * wrong one could quietly be the one in force.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStore, resetMemorySingleton } from '../core/store.js';
import { resolveKey, resolveKeys, setKey, clearKey, keyStatus, fingerprint, MANAGED_KEYS, KEYS_KEY } from '../core/keys.js';

const SECRET = 'a-secret-long-enough-to-be-real';
// A fake in the right SHAPE. Never a real credential: a test fixture lives in
// the repository for ever, and a repository is not a place for a live key.
const ETSY = 'aaaabbbbccccddddeeeeffff:gggghhhh';

function fresh() {
  resetMemorySingleton();
  return createMemoryStore();
}

test('a stored key is encrypted, and its value never appears in status', async () => {
  const store = fresh();
  await setKey(store, 'ETSY_API_KEY', ETSY, SECRET);

  const raw = JSON.stringify(await store.getKv(KEYS_KEY));
  assert.ok(!raw.includes(ETSY), 'the key must not be stored in the clear');
  assert.ok(!raw.includes('gggghhhh'), 'nor either half of it');

  const status = JSON.stringify(await keyStatus(store, {}, SECRET));
  assert.ok(!status.includes(ETSY), 'status must never carry the value');
  assert.ok(!status.includes('aaaabbbbccccddddeeeeffff'));
  assert.ok(status.includes('…hhhh'), 'only the last four characters, so you can tell which key it is');
});

test('the environment always wins, and the loser is reported rather than hidden', async () => {
  const store = fresh();
  // Alphanumeric on both sides: the format check rejects a hyphen, correctly.
  await setKey(store, 'ETSY_API_KEY', 'storedkey123456:secret1', SECRET);

  const resolved = await resolveKey(store, 'ETSY_API_KEY', { ETSY_API_KEY: 'envkey123456:secret2' }, SECRET);
  assert.equal(resolved.value, 'envkey123456:secret2');
  assert.equal(resolved.source, 'environment');

  // Both set is not an error, but it must be visible: a stored key silently
  // doing nothing is the worst kind of setting.
  const [etsy] = await keyStatus(store, { ETSY_API_KEY: 'envkey123456:secret2' }, SECRET);
  assert.equal(etsy.source, 'environment');
  assert.equal(etsy.alsoStored, true);
});

test('a key that cannot be decrypted reads as absent, not as a broken string', async () => {
  const store = fresh();
  await setKey(store, 'ETSY_API_KEY', ETSY, SECRET);

  const wrong = await resolveKey(store, 'ETSY_API_KEY', {}, 'a-completely-different-secret');
  assert.equal(wrong.value, null, 'a garbled key must never be sent to an API');
  assert.equal(wrong.unreadable, true, 'and the reason must be knowable');
});

test('a key of the wrong shape is refused before it is stored', async () => {
  const store = fresh();

  // The exact mistake Etsy invites: their dashboard shows the keystring and
  // the shared secret in separate columns, and the API refuses the keystring
  // on its own with "Shared secret is required in x-api-key header".
  const half = await setKey(store, 'ETSY_API_KEY', 'aaaabbbbccccddddeeeeffff', SECRET);
  assert.equal(half.ok, false);
  assert.match(half.error, /keystring:shared_secret/);
  const afterRefusal = await store.getKv(KEYS_KEY);
  assert.ok(!afterRefusal || Object.keys(afterRefusal).length === 0, 'nothing may be stored when it is refused');

  assert.equal((await setKey(store, 'ETSY_API_KEY', '   ', SECRET)).ok, false);
  assert.equal((await setKey(store, 'GEMINI_API_KEY', 'short', SECRET)).ok, false);
  assert.equal((await setKey(store, 'DATABASE_URL', 'postgres://x', SECRET)).ok, false, 'only managed keys may be set');

  assert.equal((await setKey(store, 'ETSY_API_KEY', ETSY, SECRET)).ok, true);
});

test('clearing a key really removes it, and records that it was cleared', async () => {
  const store = fresh();
  await setKey(store, 'ETSY_API_KEY', ETSY, SECRET);
  await clearKey(store, 'ETSY_API_KEY');

  const raw = JSON.stringify(await store.getKv(KEYS_KEY));
  assert.ok(!raw.includes('aaaabbbbccccddddeeeeffff'), 'a revoked credential is a liability, not an audit trail');
  assert.match(raw, /clearedAt/, 'but the fact it was cleared is kept');
  assert.equal((await resolveKey(store, 'ETSY_API_KEY', {}, SECRET)).value, null);
});

test('resolving every key at once does not read the store when the environment has them all', async () => {
  const store = fresh();
  let reads = 0;
  const counting = { ...store, getKv: async (k) => { reads += 1; return store.getKv(k); } };
  const env = Object.fromEntries(Object.keys(MANAGED_KEYS).map((n) => [n, `value-for-${n}`]));

  const out = await resolveKeys(counting, env, async () => SECRET);
  assert.equal(reads, 0, 'createContext runs on every request; this must cost nothing when fully configured');
  for (const name of Object.keys(MANAGED_KEYS)) assert.equal(out[name].source, 'environment');
});

test('a missing key resolves to null rather than undefined or a throw', async () => {
  const store = fresh();
  const out = await resolveKeys(store, {}, async () => SECRET);
  for (const name of Object.keys(MANAGED_KEYS)) {
    assert.equal(out[name].value, null, `${name} should be null`);
    assert.equal(out[name].source, null);
  }
  // And with no secret available at all, it still answers rather than throwing.
  assert.doesNotThrow(async () => resolveKeys(store, {}, async () => { throw new Error('no secret'); }));
});

test('a fingerprint identifies a key without being usable as one', () => {
  assert.equal(fingerprint(ETSY), '…hhhh');
  assert.equal(fingerprint('abc'), '…');
  assert.equal(fingerprint(''), null);
  assert.equal(fingerprint(null), null);
});

test('the source table reports a pasted key as making the source live', async () => {
  const { sourceStatus } = await import('../core/sources.js');

  const dark = sourceStatus({}, null).find((s) => s.id === 'etsy');
  assert.equal(dark.live, false);
  assert.match(dark.blockedReason, /Settings page/);

  // The bug this pins: Etsy was reported dark while she was happily calling it
  // with a key pasted on the Settings page, because the status only ever
  // looked at process.env.
  const lit = sourceStatus({}, { ETSY_API_KEY: { value: ETSY, source: 'stored' } }).find((s) => s.id === 'etsy');
  assert.equal(lit.live, true);
  assert.equal(lit.keySource, 'stored');
  assert.equal(lit.blockedReason, null);
});
