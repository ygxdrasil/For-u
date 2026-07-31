/**
 * Tokens for the headless endpoint.
 *
 * The rotate path is built at the same time as the token itself, because
 * anything you have to be perfect about, you won't be. Two tokens can be live
 * at once so a caller (the voice assistant) never breaks mid-swap.
 *
 * There is always an env-var bootstrap token that works even when the database
 * is empty or absent, so you cannot lock yourself out of your own assistant.
 */

import crypto from 'node:crypto';

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function mintToken(prefix = 'n8na') {
  const raw = `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
  return { raw, hash: hashToken(raw) };
}

/** Constant-time compare so token checking does not leak length or content. */
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
  const alt = req.headers?.['x-assistant-token'];
  return alt ? String(alt).trim() : null;
}

/**
 * @returns {Promise<{ok:boolean, via?:string, tokenId?:string, error?:string}>}
 */
export async function authenticate(req, store) {
  const presented = extractToken(req);
  if (!presented) return { ok: false, error: 'No token. Send Authorization: Bearer <token>.' };

  const bootstrap = process.env.AGENT_TOKEN;
  if (bootstrap && safeEqual(presented, bootstrap)) {
    return { ok: true, via: 'bootstrap' };
  }

  const found = await store.findTokenByHash(hashToken(presented));
  if (found) return { ok: true, via: 'store', tokenId: found.id };

  return { ok: false, error: 'That token is not valid or has been retired.' };
}

/** Admin operations (minting, retiring) need the bootstrap token specifically. */
export function authenticateAdmin(req) {
  const presented = extractToken(req);
  const bootstrap = process.env.AGENT_TOKEN;
  if (!bootstrap) {
    return { ok: false, error: 'AGENT_TOKEN is not set on the server, so there is no admin credential to check against. Set it in Vercel env vars.' };
  }
  if (!presented || !safeEqual(presented, bootstrap)) {
    return { ok: false, error: 'Admin operations need the bootstrap AGENT_TOKEN.' };
  }
  return { ok: true };
}
