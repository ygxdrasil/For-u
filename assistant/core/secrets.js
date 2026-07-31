/**
 * Passwords, sessions and encryption for stored credentials.
 *
 * The site is on a public URL and holds an n8n API key that can read and write
 * every workflow in the instance. So the door is real: scrypt-hashed password,
 * constant-time comparison, signed HttpOnly session cookies, and API keys
 * encrypted at rest with AES-256-GCM.
 */

import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);

// Deliberately slow. The whole point is that guessing costs something.
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export const SESSION_TTL_DAYS = 30;

// ---------------------------------------------------------------------------
// password

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, SCRYPT.keylen, SCRYPT);
  return { salt, hash: derived.toString('hex'), algo: 'scrypt', params: SCRYPT };
}

export async function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash) return false;
  const params = record.params ?? SCRYPT;
  let derived;
  try {
    derived = await scrypt(String(password), record.salt, params.keylen ?? 64, params);
  } catch {
    return false;
  }
  const a = Buffer.from(derived.toString('hex'));
  const b = Buffer.from(record.hash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// sessions

/**
 * Signed cookie, no server-side session table. The payload carries the issue
 * time so a secret rotation or an expiry invalidates it without a lookup.
 */
export function issueSession(secret, { subject = 'owner' } = {}) {
  const payload = {
    sub: subject,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    jti: crypto.randomBytes(8).toString('hex'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(secret, token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

const COOKIE_NAME = 'n8na_sess';

export function sessionCookie(token, { clear = false } = {}) {
  const attrs = [
    `${COOKIE_NAME}=${clear ? '' : token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    clear ? 'Max-Age=0' : `Max-Age=${SESSION_TTL_DAYS * 24 * 60 * 60}`,
  ];
  return attrs.join('; ');
}

export function readSessionCookie(req) {
  const raw = req.headers?.cookie ?? '';
  for (const part of String(raw).split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE_NAME) return v.join('=');
  }
  return null;
}

// ---------------------------------------------------------------------------
// encryption of stored API keys

/**
 * The encryption key comes from MASTER_KEY when it is set, which keeps it
 * outside the database that holds the ciphertext. When it is not set we fall
 * back to a key stored in the database itself — that protects against a
 * leaked backup or a careless SELECT, but not against someone who has the
 * whole database. The UI says which of the two is in force rather than
 * implying a guarantee that isn't there.
 */
export function encryptionKey(dbKeyHex) {
  const fromEnv = process.env.MASTER_KEY;
  if (fromEnv) {
    return { key: crypto.createHash('sha256').update(fromEnv).digest(), source: 'env' };
  }
  if (dbKeyHex) {
    return { key: Buffer.from(dbKeyHex, 'hex'), source: 'database' };
  }
  return null;
}

export function newDbEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

export function encryptSecret(key, plaintext) {
  if (plaintext === null || plaintext === undefined || plaintext === '') return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64url')}.${enc.toString('base64url')}.${tag.toString('base64url')}`;
}

export function decryptSecret(key, blob) {
  if (!blob) return null;
  const [ivB, encB, tagB] = String(blob).split('.');
  if (!ivB || !encB || !tagB) return null;
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivB, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagB, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(encB, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    // Wrong key, or tampered ciphertext. Return null rather than throwing so
    // one unreadable secret does not take the whole settings page down.
    return null;
  }
}

/** Never send a secret back to the browser — only whether it is set. */
export function describeSecret(value) {
  if (!value) return { set: false, hint: null };
  const s = String(value);
  return { set: true, hint: s.length > 8 ? `…${s.slice(-4)}` : '…' };
}
