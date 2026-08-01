/**
 * Tokens for the headless endpoints.
 *
 * The rotate path is built at the same time as the token, because anything you
 * have to be perfect about later, you will not be. Two tokens can be live at
 * once so Jason never breaks mid-swap.
 *
 * There is always an env-var bootstrap token that works even when the database
 * is empty or absent, so you cannot lock yourself out of your own agent.
 */

import crypto from 'node:crypto';
import { nowIso, randomId } from './util.js';

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function mintToken(prefix = 'sel') {
  const raw = `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
  return { id: randomId('tok'), raw, hash: hashToken(raw), createdAt: nowIso() };
}

/** Constant-time compare, so checking a token leaks neither length nor content. */
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function extractToken(req) {
  const header = req.headers?.authorization ?? req.headers?.Authorization ?? '';
  const m = String(header).match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();
  const alt = req.headers?.['x-selena-token'];
  return alt ? String(alt).trim() : null;
}

/**
 * @returns {Promise<{ok:boolean, via?:string, tokenId?:string, error?:string}>}
 */
export async function authenticate(req, store) {
  const presented = extractToken(req);
  if (!presented) return { ok: false, error: 'No token. Send Authorization: Bearer <token>.' };

  const bootstrap = process.env.SELENA_TOKEN;
  if (bootstrap && safeEqual(presented, bootstrap)) return { ok: true, via: 'bootstrap' };

  const tokens = (await store.getKv('tokens')) ?? [];
  const hash = hashToken(presented);
  const found = tokens.find((t) => t.hash === hash && !t.retiredAt);
  if (found) return { ok: true, via: 'store', tokenId: found.id };

  return { ok: false, error: 'That token is not valid or has been retired.' };
}

/** Minting and retiring need the bootstrap token specifically. */
export function authenticateAdmin(req) {
  const presented = extractToken(req);
  const bootstrap = process.env.SELENA_TOKEN;
  if (!bootstrap) {
    return { ok: false, error: 'SELENA_TOKEN is not set on the server, so there is no admin credential to check against. Set it in the Vercel environment variables.' };
  }
  if (!presented || !safeEqual(presented, bootstrap)) {
    return { ok: false, error: 'Admin operations need the bootstrap SELENA_TOKEN.' };
  }
  return { ok: true };
}

/**
 * The gate every route calls. Three ways in, checked in this order:
 *
 *   1. A bearer token — Jason, the scheduler, curl.
 *   2. A session cookie — you, in a browser, having signed in once.
 *   3. Open, and ONLY when neither a password nor SELENA_TOKEN exists.
 *
 * Open mode exists so a first deploy with no configuration at all still comes
 * up and shows you it is working, which is how you find out the deploy is
 * healthy. It is not a safe resting state, so it is reported on every response
 * and the HUD shows a banner. Setting a password ends it — that is the point
 * of setting one, and it takes effect without redeploying anything.
 */
export async function gateRequest(req, store) {
  // A presented token is a deliberate claim; judge it on its own merits rather
  // than falling through to a cookie, or a wrong token would be masked by a
  // browser session and you would never learn Jason's credential is stale.
  if (extractToken(req)) {
    const result = await authenticate(req, store);
    return { ...result, open: false, via: result.via ?? 'token' };
  }

  const { PASSWORD_KEY, SESSION_COOKIE, parseCookies, verifySession, getSessionSecret } = await import('./password.js');

  const record = await store.getKv(PASSWORD_KEY);
  if (record?.hash) {
    const presented = parseCookies(req)[SESSION_COOKIE];
    if (!presented) {
      return { ok: false, open: false, needsLogin: true, error: 'Sign in to use Selena.' };
    }
    const secret = await getSessionSecret(store);
    const result = verifySession(presented, { secret, passwordVersion: record.version ?? 1 });
    if (result.ok) return { ok: true, open: false, via: 'session' };
    return { ok: false, open: false, needsLogin: true, error: `That sign-in is no longer valid: ${result.reason}. Sign in again.` };
  }

  if (!process.env.SELENA_TOKEN) {
    return {
      ok: true,
      open: true,
      warning: 'No password is set and SELENA_TOKEN is empty, so this API is answering anyone who finds the URL. Set a password on the sign-in screen — it takes effect immediately, with no redeploy.',
    };
  }

  return { ok: false, open: false, error: 'No token. Send Authorization: Bearer <token>, or set a password and sign in.' };
}

/** Rotation, built with the token rather than after it. */
export async function rotateToken(store, { label = null } = {}) {
  const tokens = (await store.getKv('tokens')) ?? [];
  const minted = mintToken();
  // The old token stays live until it is explicitly retired, so a caller
  // mid-request never sees a 401 because of housekeeping.
  const next = [...tokens, { id: minted.id, hash: minted.hash, label, createdAt: minted.createdAt, retiredAt: null }];
  await store.setKv('tokens', next);
  return { id: minted.id, raw: minted.raw, createdAt: minted.createdAt };
}

export async function retireToken(store, id) {
  const tokens = (await store.getKv('tokens')) ?? [];
  // Retired, not removed. The record of what existed is part of the audit
  // trail, and nothing in this system deletes.
  const next = tokens.map((t) => (t.id === id ? { ...t, retiredAt: nowIso() } : t));
  await store.setKv('tokens', next);
  return next.filter((t) => !t.retiredAt).length;
}

export async function listTokens(store) {
  const tokens = (await store.getKv('tokens')) ?? [];
  // Never the hash, never the raw value.
  return tokens.map((t) => ({ id: t.id, label: t.label, createdAt: t.createdAt, retiredAt: t.retiredAt ?? null, live: !t.retiredAt }));
}
