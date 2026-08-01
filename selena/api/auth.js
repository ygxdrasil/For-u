/**
 * /api/auth — signing in, once.
 *
 * GET                          is a password set, and am I signed in?
 * POST { action: 'setup' }     create the first password
 * POST { action: 'login' }     sign in; sets a cookie that lasts 180 days
 * POST { action: 'logout' }    sign out this browser
 * POST { action: 'change' }    change it, which signs every other browser out
 *
 * The first-password problem is real: before one is set, whoever reaches this
 * endpoint first would own the deployment. Two defences. If SELENA_TOKEN is
 * set on the server, setup additionally requires it, so only you can claim it.
 * If it is not, setup is first-come — and the response says so plainly rather
 * than pretending otherwise.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createStore } from '../core/store.js';
import { extractToken } from '../core/auth.js';
import crypto from 'node:crypto';
import {
  PASSWORD_KEY,
  SESSION_COOKIE,
  SESSION_MAX_AGE_DAYS,
  MIN_PASSWORD_LENGTH,
  checkPasswordStrength,
  hashPassword,
  verifyPassword,
  getSessionSecret,
  mintSession,
  verifySession,
  parseCookies,
  sessionCookie,
  clearedSessionCookie,
  isSecureRequest,
  checkLockout,
  recordFailure,
  clearFailures,
  WeakPasswordError,
} from '../core/password.js';

function bootstrapMatches(req) {
  const expected = process.env.SELENA_TOKEN;
  if (!expected) return false;
  const presented = extractToken(req);
  if (!presented) return false;
  const a = Buffer.from(String(presented));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const store = await createStore();
  const secure = isSecureRequest(req);
  const record = await store.getKv(PASSWORD_KEY);
  const hasPassword = Boolean(record?.hash);

  // Signed-in state is worked out the same way for every action.
  let signedIn = false;
  let sessionProblem = null;
  if (hasPassword) {
    const presented = parseCookies(req)[SESSION_COOKIE];
    if (presented) {
      const secret = await getSessionSecret(store);
      const result = verifySession(presented, { secret, passwordVersion: record.version ?? 1 });
      signedIn = result.ok;
      sessionProblem = result.ok ? null : result.reason;
    }
  }

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      hasPassword,
      signedIn,
      sessionProblem,
      // What the setup screen needs to explain itself honestly.
      setupProtectedByToken: Boolean(process.env.SELENA_TOKEN),
      durable: store.durable,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      sessionDays: SESSION_MAX_AGE_DAYS,
      storeNote: store.durable ? null : store.note,
    });
  }

  const body = await readBody(req);
  const action = String(body.action ?? '').toLowerCase();

  // ---- create the first password ----------------------------------------
  if (action === 'setup') {
    if (hasPassword) {
      return json(res, 409, { ok: false, error: 'A password is already set. Use "change", or sign in first.' });
    }
    if (process.env.SELENA_TOKEN && !bootstrapMatches(req)) {
      return json(res, 401, {
        ok: false,
        error: 'SELENA_TOKEN is set on the server, so creating the first password needs it. Send it as Authorization: Bearer <token>, or paste it into the setup form.',
      });
    }

    let hashed;
    try {
      hashed = hashPassword(body.password);
    } catch (err) {
      if (err instanceof WeakPasswordError) return json(res, 400, { ok: false, error: err.message });
      throw err;
    }

    await store.setKv(PASSWORD_KEY, hashed);
    await clearFailures(store);

    const secret = await getSessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(mintSession({ secret, passwordVersion: hashed.version }), { secure }));
    await store.addActivity({ kind: 'auth', level: 'info', message: 'a password was set for the first time' });

    return json(res, 201, {
      ok: true,
      signedIn: true,
      durable: store.durable,
      warning: store.durable
        ? null
        : 'Storage is not durable, so this password is forgotten when the server sleeps. Set DATABASE_URL and set it again.',
    });
  }

  // ---- sign in -----------------------------------------------------------
  if (action === 'login') {
    if (!hasPassword) return json(res, 409, { ok: false, error: 'No password has been set yet.' });

    const lock = await checkLockout(store);
    if (lock.locked) {
      return json(res, 429, {
        ok: false,
        error: `Too many wrong attempts. Locked for another ${Math.ceil(lock.seconds / 60)} minute(s).`,
        lockedSeconds: lock.seconds,
      });
    }

    if (!verifyPassword(body.password, record)) {
      const state = await recordFailure(store);
      const left = Math.max(0, 10 - state.count);
      return json(res, 401, {
        ok: false,
        // Never "wrong password for that user" — there is one user, and
        // saying how wrong it was helps nobody but a guesser.
        error: left > 0 ? `That is not the password. ${left} attempt(s) before a lockout.` : 'That is not the password. Locked for 15 minutes.',
        attemptsLeft: left,
      });
    }

    await clearFailures(store);
    const secret = await getSessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(mintSession({ secret, passwordVersion: record.version ?? 1 }), { secure }));

    return json(res, 200, { ok: true, signedIn: true, sessionDays: SESSION_MAX_AGE_DAYS });
  }

  // ---- sign out ----------------------------------------------------------
  if (action === 'logout') {
    res.setHeader('Set-Cookie', clearedSessionCookie({ secure }));
    return json(res, 200, { ok: true, signedIn: false });
  }

  // ---- change it ---------------------------------------------------------
  if (action === 'change') {
    if (!hasPassword) return json(res, 409, { ok: false, error: 'No password is set, so there is nothing to change. Use "setup".' });

    // The current password, a live session, or the bootstrap token. Requiring
    // the current password even when already signed in is what stops someone
    // on a borrowed screen from locking you out of your own deployment.
    const provedIt = verifyPassword(body.currentPassword, record) || bootstrapMatches(req);
    if (!provedIt) {
      return json(res, 401, { ok: false, error: 'Enter your current password to change it.' });
    }

    const strength = checkPasswordStrength(body.newPassword);
    if (!strength.ok) return json(res, 400, { ok: false, error: strength.reason });

    const next = hashPassword(body.newPassword);
    next.version = Number(record.version ?? 1) + 1;
    await store.setKv(PASSWORD_KEY, next);
    await clearFailures(store);

    // This browser gets a session under the new version; every other browser
    // is signed out, because their signature no longer matches.
    const secret = await getSessionSecret(store);
    res.setHeader('Set-Cookie', sessionCookie(mintSession({ secret, passwordVersion: next.version }), { secure }));
    await store.addActivity({ kind: 'auth', level: 'info', message: 'the password was changed; other browsers were signed out' });

    return json(res, 200, { ok: true, signedIn: true, otherSessionsEnded: true });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use setup, login, logout or change.` });
});
