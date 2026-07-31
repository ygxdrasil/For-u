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

const KEY_PREFS = 'settings:prefs';

const SECRET_FIELDS = ['n8nApiKey', 'geminiApiKey'];
const PLAIN_FIELDS = ['n8nBaseUrl', 'monthlyCapUsd'];

/**
 * Preferences that actually change behaviour. Every one is clamped on save, so
 * a bad value in the database can never put the running system into a state
 * the code does not expect — particularly the thinking budget, where a value
 * above the output ceiling returns an empty string from a healthy-looking
 * request.
 */
export const DEFAULT_PREFS = {
  // Model. Both tiers default to the cheapest priced model — $0.10 in /
  // $0.40 out per million. Design work will be noticeably weaker than on a
  // flash-class model; both are one dropdown away in Settings.
  chatModel: 'gemini-2.5-flash-lite',
  designModel: 'gemini-2.5-flash-lite',
  thinkingBudget: 2048,
  maxOutputTokens: 16384,

  // pipeline
  deadlineMs: 50000,
  maxSteps: 24,

  // behaviour
  allowProbes: true, // read-only probe workflows for grounding picker values
  dryRunDisablesWrites: true, // never negotiable by accident
  autoApplySafeFixes: false, // repairs are prepared, not applied
  testTagPrefix: 'assistant',

  // monitoring
  sweepLimit: 10,

  // interface
  theme: 'light', // light | dark | auto
  accent: 'cyan', // cyan | violet | amber | green | magenta
  refreshSeconds: 30,
  density: 'compact', // compact | roomy
  motion: true,
  showToolStream: true,
};

const CLAMP = {
  thinkingBudget: [0, 24576],
  maxOutputTokens: [1024, 65536],
  deadlineMs: [10000, 55000],
  maxSteps: [4, 60],
  sweepLimit: [1, 50],
  refreshSeconds: [10, 600],
  monthlyCapUsd: [0, 1000],
};

const ENUMS = {
  theme: ['light', 'dark', 'auto'],
  accent: ['cyan', 'violet', 'amber', 'green', 'magenta'],
  density: ['compact', 'roomy'],
};

function clampPrefs(input) {
  const out = { ...DEFAULT_PREFS };
  for (const [k, v] of Object.entries(input ?? {})) {
    if (!(k in DEFAULT_PREFS)) continue;
    if (typeof DEFAULT_PREFS[k] === 'boolean') {
      out[k] = Boolean(v);
    } else if (typeof DEFAULT_PREFS[k] === 'number') {
      const n = Number(v);
      if (!Number.isFinite(n)) continue;
      const [lo, hi] = CLAMP[k] ?? [-Infinity, Infinity];
      out[k] = Math.min(hi, Math.max(lo, n));
    } else if (ENUMS[k]) {
      if (ENUMS[k].includes(v)) out[k] = v;
    } else if (typeof v === 'string') {
      out[k] = v.slice(0, 64);
    }
  }

  // The invariant that matters: thinking is billed out of the output
  // allowance, so a budget at or above the ceiling returns an empty string
  // from a request that reads as entirely healthy. Enforced here rather than
  // trusted to whoever edits the settings page.
  if (out.thinkingBudget >= out.maxOutputTokens) {
    out.thinkingBudget = Math.max(0, Math.floor(out.maxOutputTokens / 2));
  }
  return out;
}

export async function loadPrefs(store) {
  return clampPrefs((await store.getKv(KEY_PREFS)) ?? {});
}

export async function savePrefs(store, patch) {
  const current = await loadPrefs(store);
  const next = clampPrefs({ ...current, ...patch });
  await store.setKv(KEY_PREFS, next);
  return next;
}

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
    prefs: await loadPrefs(store),
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
