/**
 * /api/auth — signing in, once.
 *
 * GET                          is a password set, and am I signed in?
 * POST { action: 'setup' }     create the first password
 * POST { action: 'login' }     sign in; sets a cookie that lasts 180 days
 * POST { action: 'logout' }    sign out this browser
 * POST { action: 'change' }    change it, which signs every other browser out
 * POST { action: 'mint-token' | 'retire-token' | 'list-tokens' }
 *                              Jason's bearer credentials, admin-only
 *
 * The token actions live here rather than in their own route because Vercel's
 * Hobby plan allows twelve serverless functions per deployment and there are
 * reports of it failing at eleven. Credentials are one subject; two routes for
 * them was a slot spent on tidiness.
 *
 * The first-password problem is real: before one is set, whoever reaches this
 * endpoint first would own the deployment. Two defences. If SELENA_TOKEN is
 * set on the server, setup additionally requires it, so only you can claim it.
 * If it is not, setup is first-come — and the response says so plainly rather
 * than pretending otherwise.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { keyStatus, setKey, clearKey, MANAGED_KEYS } from '../core/keys.js';
import { createStore } from '../core/store.js';
import { extractToken, authenticateAdmin, rotateToken, retireToken, listTokens } from '../core/auth.js';
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

/** Status only. This function is the reason a key value can never leak. */
async function keysFor(store) {
  return keyStatus(store, process.env, await getSessionSecret(store).catch(() => null));
}

/**
 * Prove a pasted key before trusting it.
 *
 * One read-only call to the service it belongs to, made with the value you
 * just typed and BEFORE it is stored. A key that is going to 403 should do it
 * while you are looking at the box, not silently in a sweep next Tuesday.
 *
 * Etsy is the reason this exists: it refuses a keystring on its own with
 * "Shared secret is required in x-api-key header", and pasting only the
 * keystring is the obvious mistake to make from their dashboard, which shows
 * the two in separate columns.
 */
async function probeKey(name, value, store) {
  if (!value) return { ok: false, verdict: 'nothing to test', detail: 'Paste the key first.' };
  const timeout = AbortSignal.timeout(12_000);

  try {
    if (name === 'ETSY_API_KEY') {
      const res = await fetch('https://openapi.etsy.com/v3/application/listings/active?keywords=test&limit=1', {
        headers: { 'x-api-key': value, accept: 'application/json' },
        signal: timeout,
      });
      const body = await res.text();
      if (res.ok) {
        let count = null;
        try {
          count = JSON.parse(body)?.count ?? null;
        } catch {
          /* the status is the answer; the count is a bonus */
        }
        return { ok: true, verdict: 'working', detail: count === null ? 'Etsy accepted it.' : `Etsy accepted it — ${count} listings matched a test search.` };
      }
      return {
        ok: false,
        verdict: res.status === 403 ? 'Etsy refused it' : `Etsy answered ${res.status}`,
        detail: /shared secret/i.test(body)
          ? 'Etsy needs BOTH halves, joined by a colon: keystring:shared_secret. The dashboard shows them in separate columns.'
          : body.slice(0, 220),
      };
    }

    if (name === 'GEMINI_API_KEY') {
      // Listing models costs nothing and needs no tokens, so a test never
      // shows up on the bill.
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(value)}`, { signal: timeout });
      const body = await res.text();
      if (res.ok) return { ok: true, verdict: 'working', detail: 'Google accepted it. Listing models costs nothing, so this test is free.' };
      return { ok: false, verdict: `Google answered ${res.status}`, detail: body.slice(0, 220) };
    }

    if (name === 'JASON_TOKEN') {
      // There is nothing to call it against from here without also knowing
      // where he lives, and saying "looks fine" would be a guess.
      return {
        ok: null,
        verdict: 'cannot be tested from here',
        detail: 'A token only means anything against an endpoint. Press Test on the Connections page instead — that sends one real line to Jason and shows what he said.',
      };
    }
  } catch (err) {
    return { ok: false, verdict: err.name === 'TimeoutError' ? 'no answer in 12 seconds' : 'could not reach the service', detail: err.message };
  }

  return { ok: null, verdict: 'no test available', detail: null };
}

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
      // Which keys are set and where each came from. Never a value — only
      // whether, from where, and the last four characters.
      keys: signedIn ? await keysFor(store) : undefined,
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

  // ---- Jason's bearer tokens --------------------------------------------
  // Always the bootstrap token, even when signed in and even in open mode: an
  // API that can mint its own credentials is not protected, it is decorative.
  // ---- keys you paste rather than deploy ---------------------------------
  // Behind the session, not behind the bootstrap token: pasting a key is a
  // thing the owner does from the page they are already signed in to. Reading
  // one back is impossible by design, so a session is the right bar.
  if (action === 'set-key' || action === 'clear-key' || action === 'test-key') {
    if (!signedIn) {
      return json(res, 401, { ok: false, error: 'Sign in first — keys are managed from the Settings page.' });
    }

    const name = String(body.name ?? '').trim().toUpperCase();
    if (!MANAGED_KEYS[name]) {
      return json(res, 400, { ok: false, error: `"${name}" is not a key Selena manages. Use one of: ${Object.keys(MANAGED_KEYS).join(', ')}.` });
    }
    if (process.env[name] && action !== 'test-key') {
      // Storing one that the environment overrides would look like it worked
      // and change nothing, which is the worst kind of setting.
      return json(res, 409, {
        ok: false,
        error: `${name} is set in the environment, which always wins. Remove it there first, or change it there instead — a key stored here would be ignored.`,
      });
    }

    if (action === 'clear-key') {
      await clearKey(store, name);
      await store.addActivity({ kind: 'auth', level: 'info', message: `${name} was cleared` });
      return json(res, 200, { ok: true, keys: await keysFor(store) });
    }

    if (action === 'test-key') {
      const result = await probeKey(name, String(body.value ?? '').trim(), store);
      return json(res, 200, { ok: true, result });
    }

    const secret = await getSessionSecret(store);
    const saved = await setKey(store, name, body.value, secret);
    if (!saved.ok) return json(res, 400, saved);
    await store.addActivity({ kind: 'auth', level: 'info', message: `${name} was set (${saved.fingerprint})` });
    return json(res, 201, { ok: true, ...saved, keys: await keysFor(store) });
  }

  if (action === 'mint-token' || action === 'retire-token' || action === 'list-tokens') {
    const admin = authenticateAdmin(req);
    if (!admin.ok) return json(res, 401, { ok: false, error: admin.error });

    if (action === 'list-tokens') return json(res, 200, { ok: true, tokens: await listTokens(store), durable: store.durable });

    if (action === 'mint-token') {
      const minted = await rotateToken(store, { label: body.label ? String(body.label).slice(0, 60) : null });
      return json(res, 201, {
        ok: true,
        id: minted.id,
        token: minted.raw,
        note: 'This is the only time the value is shown. The old tokens are still live — retire them once Jason is moved across.',
        durable: store.durable,
        warning: store.durable ? null : 'The store is in memory, so this token disappears on the next cold start. Set DATABASE_URL first.',
      });
    }

    const id = String(body.id ?? '').trim();
    if (!id) return json(res, 400, { ok: false, error: 'Which token? Send { "id": "..." }.' });
    const remaining = await retireToken(store, id);
    return json(res, 200, { ok: true, liveTokens: remaining, note: 'Retired, not deleted — the record that it existed is part of the audit trail.' });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use setup, login, logout, change, mint-token, retire-token or list-tokens.` });
});
