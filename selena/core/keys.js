/**
 * Keys you can paste, instead of keys you have to redeploy for.
 *
 * Every key started life as an environment variable, which is the right place
 * for them and a genuinely bad place to *change* them: getting an Etsy
 * keystring approved and then having to open the Vercel dashboard, add a
 * variable and wait for a rebuild is three steps too many, and none of them
 * happens where you are standing when the key arrives.
 *
 * So a key may now live in two places, and the rule between them is fixed:
 *
 *   the environment ALWAYS wins when it is set
 *
 * A deploy-time setting beating something typed into a page is the same rule
 * as Jason's endpoint, for the same reason — when the two disagree you want the
 * answer to be the one you can see in your deploy config, not the one somebody
 * clicked. The HUD says which is in force so the two can never quietly differ.
 *
 * Stored keys are encrypted with the same secret that signs your sign-in, and
 * their VALUES never leave the server: the status endpoint reports whether a
 * key is set, where it came from, and the last four characters. Nothing else.
 */

import { encryptToken, decryptToken } from './peers.js';
import { nowIso } from './util.js';

export const KEYS_KEY = 'apikeys';

/**
 * The keys that can be pasted rather than deployed.
 *
 * Deliberately not everything. DATABASE_URL is not here: it is read before the
 * store exists, so a stored copy could never be read in time, and offering a
 * box that silently does nothing is worse than offering no box. SESSION_SECRET
 * is not here either — it is what decrypts this table, so storing it inside
 * itself is a circle.
 */
export const MANAGED_KEYS = {
  ETSY_API_KEY: {
    label: 'Etsy',
    format: 'keystring:shared_secret',
    why: 'The strongest evidence source there is: priced listings prove someone is paying, and the reviews on them prove whether they are happy. Needs a Personal Access app, which Etsy approves by hand.',
    // Etsy refuses a keystring on its own — "Shared secret is required in
    // x-api-key header" — so the value is BOTH parts joined by a colon. That
    // is checked when you paste it, because a 403 a week later is a bad way to
    // find out.
    looksRight: (v) => /^[A-Za-z0-9]{8,}:[A-Za-z0-9]{6,}$/.test(v),
    hint: 'Both halves, joined by a colon — Etsy refuses the keystring on its own.',
    where: 'etsy.com/developers/your-apps',
  },
  GEMINI_API_KEY: {
    label: 'Gemini',
    format: 'a single key',
    why: 'Without it she can show her state and answer from the record, but she cannot read anything, and she will not invent a finding in place of reading one.',
    looksRight: (v) => v.length >= 20 && !v.includes(' '),
    hint: 'One long string, no spaces.',
    where: 'aistudio.google.com/apikey',
  },
  JASON_TOKEN: {
    label: "Jason's token",
    format: 'a bearer token',
    why: 'Sent as a bearer token when a finding is handed over. Only needed if his endpoint is set in the environment; a builder added on Connections carries its own.',
    looksRight: (v) => v.length >= 8,
    hint: 'Whatever Jason expects after "Bearer ".',
    where: null,
  },
};

export const MANAGED_KEY_NAMES = Object.keys(MANAGED_KEYS);

/** Enough to recognise a key without being able to use it. */
export function fingerprint(value) {
  const v = String(value ?? '');
  if (!v) return null;
  return v.length <= 4 ? '…' : `…${v.slice(-4)}`;
}

/**
 * One key, from wherever it actually lives.
 *
 * @returns {{value:string|null, source:'environment'|'stored'|null}}
 */
export async function resolveKey(store, name, env = process.env, secret = null) {
  if (env?.[name]) return { value: env[name], source: 'environment' };
  if (!store || !secret) return { value: null, source: null };
  try {
    const all = (await store.getKv(KEYS_KEY)) ?? {};
    const sealed = all?.[name]?.value;
    if (!sealed) return { value: null, source: null };
    const value = decryptToken(sealed, secret);
    // A key that cannot be decrypted is reported as absent rather than as a
    // broken string, so the caller's "no key" path runs instead of a 401 from
    // whichever API it was for.
    return value ? { value, source: 'stored' } : { value: null, source: null, unreadable: true };
  } catch {
    return { value: null, source: null };
  }
}

/**
 * Every managed key in one pass.
 *
 * The store is only read when at least one key is missing from the
 * environment. A fully env-configured deployment therefore pays nothing for
 * this on any request, which matters because createContext runs on every one.
 */
export async function resolveKeys(store, env = process.env, secretFor = null) {
  const out = {};
  const missing = MANAGED_KEY_NAMES.filter((name) => !env?.[name]);
  for (const name of MANAGED_KEY_NAMES) {
    if (env?.[name]) out[name] = { value: env[name], source: 'environment' };
  }
  if (!missing.length || !store || !secretFor) {
    for (const name of missing) out[name] = { value: null, source: null };
    return out;
  }

  let secret = null;
  try {
    secret = await secretFor();
  } catch {
    // No secret means no stored keys can be read. Everything still runs; the
    // HUD already says what it cannot do without each one.
  }

  const all = secret ? ((await store.getKv(KEYS_KEY).catch(() => ({}))) ?? {}) : {};
  for (const name of missing) {
    const sealed = all?.[name]?.value;
    const value = sealed && secret ? decryptToken(sealed, secret) : null;
    out[name] = sealed && !value ? { value: null, source: null, unreadable: true } : { value, source: value ? 'stored' : null };
  }
  return out;
}

/** Paste one in. Rejects a value that plainly is not the right shape. */
export async function setKey(store, name, value, secret) {
  const spec = MANAGED_KEYS[name];
  if (!spec) return { ok: false, error: `"${name}" is not a key Selena manages.` };

  const trimmed = String(value ?? '').trim();
  if (!trimmed) return { ok: false, error: 'Nothing was pasted.' };
  if (!spec.looksRight(trimmed)) {
    // Checked here rather than on first use: a 403 next Tuesday is a terrible
    // way to learn you pasted half of it.
    // Phrased without an article, so it does not read "a Etsy key".
    return { ok: false, error: `${spec.label} keys look like ${spec.format}. ${spec.hint}` };
  }

  const all = (await store.getKv(KEYS_KEY)) ?? {};
  await store.setKv(KEYS_KEY, {
    ...all,
    [name]: { value: encryptToken(trimmed, secret), setAt: nowIso(), fingerprint: fingerprint(trimmed) },
  });
  return { ok: true, name, fingerprint: fingerprint(trimmed) };
}

/**
 * Forget one.
 *
 * The only place in this system where something really is removed, and
 * deliberately: "never delete anything" is about evidence and findings, which
 * are the record. A revoked credential is not a record — keeping a copy of a
 * key you have retired is a liability, not an audit trail. What is kept is the
 * fact that it was cleared and when.
 */
export async function clearKey(store, name) {
  const all = (await store.getKv(KEYS_KEY)) ?? {};
  if (!all[name]) return { ok: true, cleared: false };
  const { [name]: _gone, ...rest } = all;
  await store.setKv(KEYS_KEY, { ...rest, [`${name}__clearedAt`]: nowIso() });
  return { ok: true, cleared: true };
}

/**
 * What the HUD may know: whether each key is set, where it came from, and four
 * characters. Never a value.
 */
export async function keyStatus(store, env = process.env, secret = null) {
  const all = secret ? ((await store.getKv(KEYS_KEY).catch(() => ({}))) ?? {}) : {};
  return MANAGED_KEY_NAMES.map((name) => {
    const spec = MANAGED_KEYS[name];
    const stored = all?.[name] ?? null;
    const fromEnv = Boolean(env?.[name]);
    return {
      name,
      label: spec.label,
      format: spec.format,
      why: spec.why,
      hint: spec.hint,
      where: spec.where,
      set: fromEnv || Boolean(stored),
      source: fromEnv ? 'environment' : stored ? 'stored' : null,
      // Both present is not an error, but it IS confusing, and the one that
      // loses should be visible rather than silently ignored.
      alsoStored: fromEnv && Boolean(stored),
      fingerprint: fromEnv ? fingerprint(env[name]) : (stored?.fingerprint ?? null),
      setAt: fromEnv ? null : (stored?.setAt ?? null),
      clearedAt: all?.[`${name}__clearedAt`] ?? null,
    };
  });
}
