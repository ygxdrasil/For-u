import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hashPassword,
  verifyPassword,
  checkPasswordStrength,
  mintSession,
  verifySession,
  parseCookies,
  sessionCookie,
  clearedSessionCookie,
  isSecureRequest,
  getSessionSecret,
  checkLockout,
  recordFailure,
  clearFailures,
  LOCKOUT,
  SESSION_COOKIE,
  WeakPasswordError,
} from '../core/password.js';
import { createMemoryStore } from '../core/store.js';

test('a password is never stored, only a salted hash of it', () => {
  const record = hashPassword('a-perfectly-fine-password');
  assert.equal(record.algorithm, 'scrypt');
  assert.ok(record.salt && record.hash);
  assert.ok(!JSON.stringify(record).includes('a-perfectly-fine-password'), 'the password must not appear anywhere in the record');
});

test('the same password hashes differently every time', () => {
  // Without a per-password salt, two people with the same password have the
  // same hash, and one cracked hash cracks both.
  const a = hashPassword('a-perfectly-fine-password');
  const b = hashPassword('a-perfectly-fine-password');
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.hash, b.hash);
  assert.ok(verifyPassword('a-perfectly-fine-password', a));
  assert.ok(verifyPassword('a-perfectly-fine-password', b));
});

test('verification accepts the right password and nothing else', () => {
  const record = hashPassword('correct-horse-battery');
  assert.equal(verifyPassword('correct-horse-battery', record), true);
  assert.equal(verifyPassword('correct-horse-batterY', record), false);
  assert.equal(verifyPassword('', record), false);
  assert.equal(verifyPassword(null, record), false);
  assert.equal(verifyPassword('correct-horse-battery', null), false);
  assert.equal(verifyPassword('correct-horse-battery', { hash: 'nonsense' }), false);
});

test('obviously weak passwords are refused, with a reason', () => {
  for (const weak of ['short', '', 'aaaaaaaa', 'password', '12345678']) {
    const check = checkPasswordStrength(weak);
    assert.equal(check.ok, false, `"${weak}" should be refused`);
    assert.ok(check.reason.length > 10, 'the refusal must say why');
    assert.throws(() => hashPassword(weak), WeakPasswordError);
  }
  assert.equal(checkPasswordStrength('a-perfectly-fine-password').ok, true);
});

test('a session survives, and a forged one does not', () => {
  const secret = 'secret-a';
  const token = mintSession({ secret, passwordVersion: 1 });

  assert.equal(verifySession(token, { secret, passwordVersion: 1 }).ok, true);

  // Signed with a different secret — someone else's server.
  assert.equal(verifySession(token, { secret: 'secret-b', passwordVersion: 1 }).ok, false);
  // Tampered payload.
  assert.equal(verifySession(token.replace('v1.', 'v1.9'), { secret, passwordVersion: 1 }).ok, false);
  for (const junk of ['', 'nonsense', 'v1.a.b', null, undefined, 'v2.1.1.abc']) {
    assert.equal(verifySession(junk, { secret, passwordVersion: 1 }).ok, false);
  }
});

test('changing the password signs other browsers out', () => {
  // This is the only thing that makes "change my password" mean anything: a
  // session minted under the old password must stop working.
  const secret = 'secret-a';
  const old = mintSession({ secret, passwordVersion: 1 });

  const result = verifySession(old, { secret, passwordVersion: 2 });
  assert.equal(result.ok, false);
  assert.match(result.reason, /password has changed/);

  const fresh = mintSession({ secret, passwordVersion: 2 });
  assert.equal(verifySession(fresh, { secret, passwordVersion: 2 }).ok, true);
});

test('a session expires eventually', () => {
  const secret = 'secret-a';
  const issuedAt = Date.now() - 200 * 86_400_000;
  const token = mintSession({ secret, passwordVersion: 1, issuedAt });
  const result = verifySession(token, { secret, passwordVersion: 1 });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'expired');
});

test('the signing secret is stable across calls, or every cold start signs you out', async () => {
  const store = createMemoryStore();
  const first = await getSessionSecret(store, {});
  const second = await getSessionSecret(store, {});
  assert.equal(first, second, 'a regenerated secret would invalidate every session on every boot');
  assert.ok(first.length >= 32);

  // An explicit env secret wins, so it can be shared or rotated deliberately.
  assert.equal(await getSessionSecret(store, { SESSION_SECRET: 'from-env' }), 'from-env');
});

test('the cookie is HttpOnly, SameSite and Secure', () => {
  const cookie = sessionCookie('abc');
  assert.match(cookie, /HttpOnly/, 'no script may read the session');
  assert.match(cookie, /SameSite=Lax/, 'another site must not be able to post with it');
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Max-Age=\d+/);

  // Over plain http a Secure cookie is silently dropped, which looks exactly
  // like a broken login for no visible reason.
  assert.ok(!sessionCookie('abc', { secure: false }).includes('Secure'));
  assert.match(clearedSessionCookie(), /Max-Age=0/);
});

test('secure is decided by the real protocol, not guessed', () => {
  assert.equal(isSecureRequest({ headers: { 'x-forwarded-proto': 'https' } }), true);
  assert.equal(isSecureRequest({ headers: { 'x-forwarded-proto': 'http' } }), false);
  assert.equal(isSecureRequest({ headers: { host: 'localhost:3101' } }), false);
  assert.equal(isSecureRequest({ headers: { host: '127.0.0.1:3101' } }), false);
  assert.equal(isSecureRequest({ headers: { host: 'selena.vercel.app' } }), true);
});

test('cookie parsing copes with whatever a browser sends', () => {
  assert.deepEqual(parseCookies({ headers: { cookie: 'a=1; b=2' } }), { a: '1', b: '2' });
  assert.deepEqual(parseCookies({ headers: {} }), {});
  assert.deepEqual(parseCookies({}), {});
  assert.deepEqual(parseCookies({ headers: { cookie: '  ; =x; broken; c=3 ' } }), { c: '3' });
  const parsed = parseCookies({ headers: { cookie: `${SESSION_COOKIE}=v1.123.1.abc` } });
  assert.equal(parsed[SESSION_COOKIE], 'v1.123.1.abc');
});

test('repeated wrong guesses lock the door for a while', async () => {
  const store = createMemoryStore();
  assert.equal((await checkLockout(store)).locked, false);

  for (let i = 0; i < LOCKOUT.attempts - 1; i += 1) await recordFailure(store);
  assert.equal((await checkLockout(store)).locked, false, 'one attempt short must still be allowed');

  await recordFailure(store);
  const locked = await checkLockout(store);
  assert.equal(locked.locked, true);
  assert.ok(locked.seconds > 0);

  // And the lock lifts on its own.
  const later = await checkLockout(store, Date.now() + LOCKOUT.lockMs + 1000);
  assert.equal(later.locked, false);

  await clearFailures(store);
  assert.equal((await checkLockout(store)).locked, false);
});

test('a successful sign-in forgives earlier failures', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 5; i += 1) await recordFailure(store);
  await clearFailures(store);
  assert.equal((await checkLockout(store)).remaining, LOCKOUT.attempts);
});
