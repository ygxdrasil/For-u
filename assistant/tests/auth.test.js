/**
 * The lock on the front door. This runs on a public URL and, once configured,
 * holds an n8n API key with full read/write on every workflow — so these are
 * the tests that matter most for anything reaching it.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  hashPassword,
  verifyPassword,
  issueSession,
  verifySession,
  sessionCookie,
  readSessionCookie,
  encryptSecret,
  decryptSecret,
  describeSecret,
} from '../core/secrets.js';
import { createMemoryStore } from '../core/store.js';
import { setupPassword, checkPassword, changePassword, isPasswordSet, saveServerConfig, loadServerConfig, describeServerConfig, sessionSecret } from '../core/settings.js';

test('a password is stored hashed and salted, never in the clear', async () => {
  const record = await hashPassword('correct horse battery staple');
  assert.ok(record.salt && record.hash);
  assert.doesNotMatch(JSON.stringify(record), /correct horse/, 'the password itself must never appear in the record');
  assert.equal(await verifyPassword('correct horse battery staple', record), true);
  assert.equal(await verifyPassword('wrong', record), false);
});

test('the same password hashes differently every time', async () => {
  const a = await hashPassword('the same password');
  const b = await hashPassword('the same password');
  assert.notEqual(a.hash, b.hash, 'without a per-password salt, identical passwords share a hash');
});

test('short passwords are refused', async () => {
  await assert.rejects(() => hashPassword('short'), /at least 8/);
});

test('a session cookie cannot be forged or tampered with', () => {
  const token = issueSession('secret-one');
  assert.ok(verifySession('secret-one', token), 'a genuine token must verify');
  assert.equal(verifySession('secret-two', token), null, 'a different secret must not verify');

  const [body, sig] = token.split('.');
  const tampered = `${Buffer.from(JSON.stringify({ sub: 'owner', exp: Date.now() + 1e9 })).toString('base64url')}.${sig}`;
  assert.equal(verifySession('secret-one', tampered), null, 'swapping the payload must invalidate the signature');
  assert.equal(verifySession('secret-one', 'nonsense'), null);
  assert.equal(verifySession('secret-one', ''), null);
});

test('an expired session is rejected', () => {
  const secret = 'sekrit';
  const token = issueSession(secret);
  const [body] = token.split('.');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  assert.ok(payload.exp > Date.now());

  // Rebuild with an expiry in the past, signed correctly — so the only thing
  // rejecting it can be the expiry check, not a bad signature.
  const expiredBody = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() - 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(expiredBody).digest('base64url');
  assert.equal(verifySession(secret, `${expiredBody}.${sig}`), null);
});

test('the session cookie is HttpOnly, Secure and SameSite', () => {
  const cookie = sessionCookie('abc');
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Lax/);
  assert.equal(readSessionCookie({ headers: { cookie: cookie.split(';')[0] } }), 'abc');
});

test('stored API keys round-trip through encryption and fail closed on a wrong key', () => {
  const key = Buffer.alloc(32, 7);
  const blob = encryptSecret(key, 'n8n_api_supersecret');
  assert.doesNotMatch(blob, /supersecret/, 'the plaintext must not survive in the ciphertext');
  assert.equal(decryptSecret(key, blob), 'n8n_api_supersecret');

  const wrong = Buffer.alloc(32, 9);
  assert.equal(decryptSecret(wrong, blob), null, 'a wrong key must return null, not throw or leak');
  assert.equal(decryptSecret(key, 'garbage'), null);
});

test('a secret is described to the browser without its value', () => {
  const d = describeSecret('n8n_api_abcdefghijkl');
  assert.equal(d.set, true);
  assert.equal(d.hint, '…ijkl');
  assert.doesNotMatch(JSON.stringify(d), /abcdefgh/);
  assert.deepEqual(describeSecret(null), { set: false, hint: null });
});

test('the first password can be claimed once, and never overwritten without the current one', async () => {
  const store = createMemoryStore();
  assert.equal(await isPasswordSet(store), false);

  await setupPassword(store, 'first-password');
  assert.equal(await isPasswordSet(store), true);
  assert.equal(await checkPassword(store, 'first-password'), true);

  // The claim path must not double as a reset path.
  await assert.rejects(() => setupPassword(store, 'attacker-password'), /already set/);
  assert.equal(await checkPassword(store, 'attacker-password'), false);

  await assert.rejects(() => changePassword(store, 'wrong-current', 'new-password'), /Current password is wrong/);
  await changePassword(store, 'first-password', 'second-password');
  assert.equal(await checkPassword(store, 'second-password'), true);
  assert.equal(await checkPassword(store, 'first-password'), false);
});

test('saved keys survive a reload and are never returned to the browser', async () => {
  const store = createMemoryStore();

  await saveServerConfig(store, { n8nBaseUrl: 'https://n8n.example.com', n8nApiKey: 'n8n_api_secret_value', geminiApiKey: 'AIzaSecret' });

  const loaded = await loadServerConfig(store);
  assert.equal(loaded.n8nApiKey, 'n8n_api_secret_value', 'the pipeline must get the real key back');
  assert.equal(loaded.geminiApiKey, 'AIzaSecret');

  const described = await describeServerConfig(store);
  const asJson = JSON.stringify(described);
  assert.doesNotMatch(asJson, /n8n_api_secret_value/, 'the browser payload must not contain the key');
  assert.doesNotMatch(asJson, /AIzaSecret/);
  assert.equal(described.n8nApiKey.set, true);
  assert.equal(described.n8nBaseUrl, 'https://n8n.example.com');
});

test('a partial save does not wipe the keys you did not retype', async () => {
  const store = createMemoryStore();
  await saveServerConfig(store, { n8nApiKey: 'keep-me', geminiApiKey: 'keep-me-too' });
  await saveServerConfig(store, { n8nBaseUrl: 'https://new.example.com' });

  const loaded = await loadServerConfig(store);
  assert.equal(loaded.n8nApiKey, 'keep-me');
  assert.equal(loaded.geminiApiKey, 'keep-me-too');
  assert.equal(loaded.n8nBaseUrl, 'https://new.example.com');
});

test('an empty string clears a key, which is different from leaving it out', async () => {
  const store = createMemoryStore();
  await saveServerConfig(store, { n8nApiKey: 'to-be-cleared' });
  await saveServerConfig(store, { n8nApiKey: '' });
  assert.equal((await loadServerConfig(store)).n8nApiKey, undefined);
});

test('createStore returns the same instance across calls', async () => {
  // The bug this reproduces: createStore() built a fresh memory store on every
  // call, so a password set by one request was gone by the next one and
  // signing in reported "no password set yet" immediately after setup.
  const { createStore, resetStoreCache } = await import('../core/store.js');
  resetStoreCache();

  const a = await createStore({ databaseUrl: null });
  const b = await createStore({ databaseUrl: null });
  assert.equal(a, b, 'two calls returned different stores — state cannot survive between requests');

  await a.setKv('probe', { value: 1 });
  assert.deepEqual(await b.getKv('probe'), { value: 1 }, 'a write through one handle must be visible through the other');

  resetStoreCache();
  const c = await createStore({ databaseUrl: null });
  assert.notEqual(a, c, 'resetStoreCache must actually drop the cached instance');
});

test('the session secret is created once and then stays stable', async () => {
  const store = createMemoryStore();
  const a = await sessionSecret(store);
  const b = await sessionSecret(store);
  assert.equal(a, b, 'a changing secret would sign everyone out on every request');
  assert.ok(a.length >= 32);
});
