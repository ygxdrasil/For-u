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
import { PRICES } from './meter.js';
import crypto from 'node:crypto';

/** The only models that may be selected: the ones we can actually price. */
export const PRICEABLE_MODELS = Object.keys(PRICES);

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
  // Model. The cheapest model in the table is gemini-2.5-flash-lite, and it was
  // the default for both tiers — where it produced exactly what you would
  // expect: a builder that stops at the first thing it has not seen before,
  // and intermittently returns nothing at all. Capability IS the product here.
  //
  // Design runs on gemini-3.5-flash-lite: 0.30 in / 2.50 out per million,
  // about three times the old cost per turn and a different class of thinking.
  // On the measured ~$0.018 turn that is ~$0.05, so roughly 150 design turns
  // inside an $8 cap. gemini-3.6-flash is stronger again and about five times
  // that — one dropdown away when a build is worth it.
  //
  // The thinking budget goes up with it. Thinking is billed at the output
  // rate, so 6144 tokens costs about a penny and a half per turn on this
  // model, and it is the cheapest capability there is.
  chatModel: 'gemini-3.1-flash-lite',
  designModel: 'gemini-3.5-flash-lite',
  // False until you actually move one of the model controls in Settings. A
  // default you never chose should follow the default when it improves —
  // otherwise the first person to save any setting at all is frozen on
  // whatever was cheapest that week, and has no way of knowing it.
  //
  // It covers the thinking budget as well as the two models, because they are
  // one decision: the budget is what the chosen model is allowed to think
  // with, and raising the model while leaving the old budget behind is half an
  // upgrade. Caught by reading /api/health after shipping exactly that.
  modelsPickedByYou: false,
  thinkingBudget: 6144,
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
  // Derived from the price table, never typed out again. Saving a model with
  // no price used to be accepted, and the next request then refused to run at
  // all — the meter will not guess a rate, and it is right not to.
  chatModel: PRICEABLE_MODELS,
  designModel: PRICEABLE_MODELS,
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
  const prefs = clampPrefs((await store.getKv(KEY_PREFS)) ?? {});

  // Saving the theme used to write the whole preference block, models
  // included, which quietly turned "the default" into "your choice" — so a
  // better default could never reach anyone who had ever touched a setting.
  if (!prefs.modelsPickedByYou) {
    prefs.chatModel = DEFAULT_PREFS.chatModel;
    prefs.designModel = DEFAULT_PREFS.designModel;
    prefs.thinkingBudget = DEFAULT_PREFS.thinkingBudget;
  }
  return prefs;
}

export async function savePrefs(store, patch) {
  const current = await loadPrefs(store);
  const next = clampPrefs({ ...current, ...patch });

  // Choosing a model — actually choosing it, in the dropdown — is what makes
  // it yours. From then on nothing here overrides it.
  if (patch?.chatModel !== undefined || patch?.designModel !== undefined || patch?.thinkingBudget !== undefined) {
    next.modelsPickedByYou = true;
  }

  await store.setKv(KEY_PREFS, next);
  return next;
}

/**
 * The session signing secret. It must be identical on every request forever:
 * if it changes, every cookie ever issued stops verifying at once and you are
 * asked for the password again with nothing to explain why.
 *
 * SESSION_SECRET in the environment wins when set, because that is stable by
 * construction and survives anything happening to the database. Otherwise it
 * is created once and read back from storage.
 */
export async function sessionSecret(store) {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;

  const existing = await store.getKv(KEY_SESSION_SECRET);
  if (existing?.secret) return existing.secret;

  const secret = crypto.randomBytes(32).toString('hex');
  await store.setKv(KEY_SESSION_SECRET, { secret, createdAt: new Date().toISOString() });

  // Read back rather than trusting the write. If storage silently dropped it,
  // the next request mints a different secret and every session dies — so it
  // is better to know that here than to be puzzled by it later.
  const readBack = await store.getKv(KEY_SESSION_SECRET);
  if (readBack?.secret !== secret) {
    console.error('[auth] session secret did not survive a write/read round trip — sessions will not persist');
  }
  return secret;
}

/**
 * A short, non-reversible fingerprint of the signing secret. Safe to expose:
 * it identifies WHICH secret is in force without revealing it, so a changing
 * fingerprint between requests proves the secret is unstable.
 */
export async function sessionKeyId(store) {
  const secret = await sessionSecret(store);
  return crypto.createHash('sha256').update(secret).digest('hex').slice(0, 12);
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

/**
 * What the browser is allowed to know: which keys are set, never their values.
 *
 * There is a third state between set and not set, and it used to be reported as
 * "not set": a key that is stored but can no longer be decrypted. That happens
 * when MASTER_KEY is changed or removed in Vercel — the ciphertext is intact
 * and the key is exactly where you left it, but nothing can read it. Saying
 * "not set" sends you looking for a key you never lost, and hides the one thing
 * that would explain it. So it is named, along with the cause.
 */
export async function describeServerConfig(store) {
  const stored = (await store.getKv(KEY_SETTINGS)) ?? {};
  const config = await loadServerConfig(store);
  const { source } = await resolveEncryption(store);

  const describeField = (field) => {
    if (config[field]) return describeSecret(config[field]);
    if (stored[field]) {
      return {
        set: false,
        unreadable: true,
        hint: null,
        note:
          source === 'env'
            ? 'A key is stored, but it cannot be decrypted with the current MASTER_KEY. If MASTER_KEY was changed or re-generated, put the old value back — or paste the key again to re-encrypt it under the new one.'
            : 'A key is stored, but it cannot be decrypted with the key held in the database. Paste it again to replace it.',
      };
    }
    return describeSecret(null);
  };

  return {
    prefs: await loadPrefs(store),
    n8nBaseUrl: config.n8nBaseUrl ?? null,
    monthlyCapUsd: config.monthlyCapUsd ?? Number(process.env.MONTHLY_USD_CAP ?? 8),
    n8nApiKey: describeField('n8nApiKey'),
    geminiApiKey: describeField('geminiApiKey'),
    encryption: {
      source,
      note:
        source === 'env'
          ? 'Keys are encrypted with MASTER_KEY, which is held outside the database.'
          : 'Keys are encrypted with a key stored in the same database. That protects a leaked backup, but not someone who has the whole database. Set MASTER_KEY in Vercel for real separation.',
    },
  };
}
