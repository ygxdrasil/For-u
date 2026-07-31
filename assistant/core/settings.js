/**
 * Server-side settings: the password record, the session secret, and the API
 * keys, encrypted at rest.
 *
 * Keys kept here (rather than only in a browser) are what make the headless
 * endpoint and the scheduled sweep work without someone having a tab open.
 */

import {
  encryptionKey,
  newDbEncryptionKey,
  encryptSecret,
  decryptSecret,
  describeSecret,
  hashPassword,
  verifyPassword,
} from './secrets.js';
import crypto from 'node:crypto';

const KEY_AUTH = 'auth:owner';
const KEY_SESSION_SECRET = 'auth:session_secret';
const KEY_DB_ENC = 'auth:db_encryption_key';
const KEY_SETTINGS = 'settings:secrets';

const SECRET_FIELDS = ['n8nApiKey', 'geminiApiKey'];
const PLAIN_FIELDS = ['n8nBaseUrl', 'monthlyCapUsd'];

/** The session signing secret, created once and then stable. */
export async function sessionSecret(store) {
  const existing = await store.getKv(KEY_SESSION_SECRET);
  if (existing?.secret) return existing.secret;
  const secret = crypto.randomBytes(32).toString('hex');
  await store.setKv(KEY_SESSION_SECRET, { secret, createdAt: new Date().toISOString() });
  return secret;
}

async function resolveEncryption(store) {
  let dbKey = (await store.getKv(KEY_DB_ENC))?.key ?? null;
  let resolved = encryptionKey(dbKey);
  if (!resolved) {
    dbKey = newDbEncryptionKey();
    await store.setKv(KEY_DB_ENC, { key: dbKey, createdAt: new Date().toISOString() });
    resolved = encryptionKey(dbKey);
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// password

export async function isPasswordSet(store) {
  const rec = await store.getKv(KEY_AUTH);
  return Boolean(rec?.hash);
}

/**
 * First-run claim. Only works while no password exists, so it cannot be used
 * to overwrite one. Changing an existing password requires the current one.
 */
export async function setupPassword(store, password) {
  if (await isPasswordSet(store)) {
    throw new Error('A password is already set. Use change-password with the current one.');
  }
  const record = await hashPassword(password);
  await store.setKv(KEY_AUTH, { ...record, createdAt: new Date().toISOString() });
  return true;
}

export async function changePassword(store, currentPassword, newPassword) {
  const rec = await store.getKv(KEY_AUTH);
  if (!rec?.hash) throw new Error('No password is set yet.');
  if (!(await verifyPassword(currentPassword, rec))) throw new Error('Current password is wrong.');
  const record = await hashPassword(newPassword);
  await store.setKv(KEY_AUTH, { ...record, createdAt: rec.createdAt, changedAt: new Date().toISOString() });
  return true;
}

export async function checkPassword(store, password) {
  const rec = await store.getKv(KEY_AUTH);
  if (!rec?.hash) return false;
  return verifyPassword(password, rec);
}

// ---------------------------------------------------------------------------
// stored keys

/** Decrypted config for the pipeline. Never send this to a browser. */
export async function loadServerConfig(store) {
  const stored = (await store.getKv(KEY_SETTINGS)) ?? {};
  const { key } = await resolveEncryption(store);

  const out = {};
  for (const field of PLAIN_FIELDS) if (stored[field] !== undefined) out[field] = stored[field];
  for (const field of SECRET_FIELDS) {
    const dec = decryptSecret(key, stored[field]);
    if (dec) out[field] = dec;
  }
  return out;
}

export async function saveServerConfig(store, patch) {
  const stored = (await store.getKv(KEY_SETTINGS)) ?? {};
  const { key } = await resolveEncryption(store);

  const next = { ...stored };
  for (const field of PLAIN_FIELDS) {
    if (patch[field] !== undefined) next[field] = patch[field];
  }
  for (const field of SECRET_FIELDS) {
    if (patch[field] === undefined) continue;
    // An empty string means "clear this", which is different from "unchanged".
    next[field] = patch[field] === '' ? null : encryptSecret(key, patch[field]);
  }
  next.updatedAt = new Date().toISOString();
  await store.setKv(KEY_SETTINGS, next);
  return true;
}

/** What the browser is allowed to know: which keys are set, never their values. */
export async function describeServerConfig(store) {
  const config = await loadServerConfig(store);
  const { source } = await resolveEncryption(store);
  return {
    n8nBaseUrl: config.n8nBaseUrl ?? null,
    monthlyCapUsd: config.monthlyCapUsd ?? Number(process.env.MONTHLY_USD_CAP ?? 8),
    n8nApiKey: describeSecret(config.n8nApiKey),
    geminiApiKey: describeSecret(config.geminiApiKey),
    encryption: {
      source,
      note:
        source === 'env'
          ? 'Keys are encrypted with MASTER_KEY, which is held outside the database.'
          : 'Keys are encrypted with a key stored in the same database. That protects a leaked backup, but not someone who has the whole database. Set MASTER_KEY in Vercel for real separation.',
    },
  };
}
