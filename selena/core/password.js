/**
 * A password you set once, and a session that keeps you signed in.
 *
 * Three decisions worth writing down:
 *
 * 1. The password is never stored. A scrypt hash with a per-password salt is,
 *    and scrypt is deliberately slow — the whole point is that guessing costs
 *    the attacker real time. Comparison is constant-time so a wrong answer
 *    leaks nothing about how wrong it was.
 *
 * 2. The session is a signed value, not a random one looked up in a table.
 *    That means signing in survives a cold start and needs no database read on
 *    every request. The signature covers when it was issued AND which password
 *    issued it, so changing the password signs every other browser out —
 *    which is the only thing that makes "change my password" mean anything.
 *
 * 3. The signing secret must outlive the process, or every cold start signs
 *    you out. It comes from SESSION_SECRET if set, and otherwise is generated
 *    once and kept in the store. Generated-and-stored is only as durable as
 *    the store, which is one more reason DATABASE_URL matters.
 */

import crypto from 'node:crypto';
import { nowIso, clampNumber } from './util.js';

/** Cost parameters. Slow on purpose; ~100ms per attempt on a small function. */
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export const MIN_PASSWORD_LENGTH = 8;

/** How long a signed-in browser stays signed in. */
export const SESSION_MAX_AGE_DAYS = 180;

export const SESSION_COOKIE = 'selena_session';

export class WeakPasswordError extends Error {
  constructor(reason) {
    super(reason);
    this.name = 'WeakPasswordError';
  }
}

export function checkPasswordStrength(password) {
  const value = String(password ?? '');
  if (value.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: `Needs at least ${MIN_PASSWORD_LENGTH} characters. This URL is on the public internet.` };
  }
  if (/^(.)\1+$/.test(value)) return { ok: false, reason: 'That is one character repeated.' };
  if (['password', '12345678', 'selena123', 'qwertyui'].includes(value.toLowerCase())) {
    return { ok: false, reason: 'That is one of the first things anyone would try.' };
  }
  return { ok: true, reason: null };
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const strength = checkPasswordStrength(password);
  if (!strength.ok) throw new WeakPasswordError(strength.reason);

  const hash = crypto
    .scryptSync(String(password), salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p })
    .toString('hex');

  return {
    algorithm: 'scrypt',
    salt,
    hash,
    params: { ...SCRYPT },
    // Bumped on every change, and covered by the session signature, so
    // changing the password invalidates sessions issued under the old one.
    version: 1,
    updatedAt: nowIso(),
  };
}

export function verifyPassword(password, record) {
  if (!record?.hash || !record?.salt) return false;
  const params = record.params ?? SCRYPT;
  let candidate;
  try {
    candidate = crypto.scryptSync(String(password ?? ''), record.salt, params.keylen ?? 64, {
      N: params.N ?? SCRYPT.N,
      r: params.r ?? SCRYPT.r,
      p: params.p ?? SCRYPT.p,
    });
  } catch {
    return false;
  }
  const known = Buffer.from(record.hash, 'hex');
  if (known.length !== candidate.length) return false;
  return crypto.timingSafeEqual(known, candidate);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

const SESSION_KEY = 'sessionSecret';
export const PASSWORD_KEY = 'password';

/**
 * A secret that survives cold starts. Env first, then the store, and only
 * generated as a last resort — a secret that changes on every boot signs
 * everybody out on every boot.
 */
export async function getSessionSecret(store, env = process.env) {
  if (env.SESSION_SECRET) return String(env.SESSION_SECRET);

  const existing = await store.getKv(SESSION_KEY);
  if (existing?.secret) return existing.secret;

  const secret = crypto.randomBytes(32).toString('hex');
  await store.setKv(SESSION_KEY, { secret, createdAt: nowIso() });
  return secret;
}

function sign(secret, payload) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function mintSession({ secret, passwordVersion = 1, issuedAt = Date.now() }) {
  const payload = `${issuedAt}.${passwordVersion}`;
  return `v1.${payload}.${sign(secret, payload)}`;
}

/**
 * @returns {{ok:boolean, reason?:string, issuedAt?:number}}
 */
export function verifySession(token, { secret, passwordVersion = 1, maxAgeMs = SESSION_MAX_AGE_DAYS * 86_400_000, now = Date.now() }) {
  const parts = String(token ?? '').split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return { ok: false, reason: 'malformed' };

  const [, issuedAtRaw, versionRaw, presented] = parts;
  const payload = `${issuedAtRaw}.${versionRaw}`;
  const expected = sign(secret, payload);

  const a = Buffer.from(expected);
  const b = Buffer.from(presented);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, reason: 'bad signature' };

  if (Number(versionRaw) !== Number(passwordVersion)) {
    return { ok: false, reason: 'the password has changed since this session was issued' };
  }

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return { ok: false, reason: 'malformed' };
  if (now - issuedAt > maxAgeMs) return { ok: false, reason: 'expired' };

  return { ok: true, issuedAt };
}

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

export function parseCookies(req) {
  const header = req?.headers?.cookie ?? '';
  const out = {};
  for (const part of String(header).split(';')) {
    const idx = part.indexOf('=');
    if (idx < 1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!name) continue;
    try {
      out[name] = decodeURIComponent(value);
    } catch {
      out[name] = value;
    }
  }
  return out;
}

/**
 * HttpOnly so no script can read it, SameSite=Lax so it is not sent from
 * another site's form post, and Secure everywhere except plain-http localhost —
 * a Secure cookie is silently dropped over http, which would make local
 * development look like a broken login for no visible reason.
 */
export function sessionCookie(value, { maxAgeDays = SESSION_MAX_AGE_DAYS, secure = true } = {}) {
  const maxAge = Math.round(clampNumber(maxAgeDays, 0, 400, SESSION_MAX_AGE_DAYS) * 86_400);
  const bits = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (secure) bits.push('Secure');
  return bits.join('; ');
}

export function clearedSessionCookie({ secure = true } = {}) {
  const bits = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (secure) bits.push('Secure');
  return bits.join('; ');
}

/** Local http needs the cookie without Secure, or it never arrives. */
export function isSecureRequest(req) {
  const proto = req?.headers?.['x-forwarded-proto'];
  if (proto) return String(proto).split(',')[0].trim() === 'https';
  const host = String(req?.headers?.host ?? '');
  return !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host);
}

// ---------------------------------------------------------------------------
// Brute-force resistance
// ---------------------------------------------------------------------------

export const LOCKOUT = { attempts: 10, windowMs: 15 * 60_000, lockMs: 15 * 60_000 };
const ATTEMPTS_KEY = 'loginAttempts';

/**
 * The URL is public, so the login form is reachable by anyone who finds it.
 * scrypt already makes each guess expensive; this makes a long run of them
 * pointless. Counting is deliberately global rather than per-IP: there is one
 * user, and a per-IP counter is trivially defeated.
 */
export async function checkLockout(store, now = Date.now()) {
  const state = (await store.getKv(ATTEMPTS_KEY)) ?? null;
  if (!state) return { locked: false, remaining: LOCKOUT.attempts };

  if (state.lockedUntil && now < state.lockedUntil) {
    return { locked: true, until: state.lockedUntil, seconds: Math.ceil((state.lockedUntil - now) / 1000), remaining: 0 };
  }
  if (state.firstAt && now - state.firstAt > LOCKOUT.windowMs) {
    return { locked: false, remaining: LOCKOUT.attempts };
  }
  return { locked: false, remaining: Math.max(0, LOCKOUT.attempts - (state.count ?? 0)) };
}

export async function recordFailure(store, now = Date.now()) {
  const state = (await store.getKv(ATTEMPTS_KEY)) ?? {};
  const withinWindow = state.firstAt && now - state.firstAt <= LOCKOUT.windowMs;
  const count = (withinWindow ? state.count ?? 0 : 0) + 1;
  const next = {
    count,
    firstAt: withinWindow ? state.firstAt : now,
    lockedUntil: count >= LOCKOUT.attempts ? now + LOCKOUT.lockMs : null,
  };
  await store.setKv(ATTEMPTS_KEY, next);
  return next;
}

export async function clearFailures(store) {
  await store.setKv(ATTEMPTS_KEY, { count: 0, firstAt: null, lockedUntil: null });
}
