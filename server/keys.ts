import {config} from './config';
import {Document} from './store/index';

/**
 * Keys pasted into Grace rather than set in the hosting environment.
 *
 * Changing an environment variable on Vercel means finding the dashboard, the
 * right project, the right variable, and then waiting out a redeploy. Pasting
 * a key into the thing that needs it takes ten seconds, works from a phone,
 * and takes effect immediately.
 *
 * They are stored through the same encrypted document layer as her memory, and
 * are never sent back to the browser — the interface is told only whether a key
 * is present and how it ends, which is enough to tell one from another without
 * putting it back on the wire.
 */

export interface StoredKeys {
  gemini?: string;
  govee?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  /** Only this Google account may connect. */
  ownerEmail?: string;
  /** PlayStation's NPSSO cookie. Read-only access to PSN, nothing more. */
  psn?: string;
  /** GitHub personal access token. She only ever reads. */
  github?: string;
  /** n8n API key, for reporting on workflows. */
  n8n?: string;
  /** The n8n instance address, since cloud accounts each have their own. */
  n8nUrl?: string;
  /** Which prebuilt voice she speaks in. Not a secret, but lives with keys. */
  voice?: string;
}

export type KeyName = keyof StoredKeys;

const store = new Document<StoredKeys>('keys', () => ({}));

/**
 * Cached because it is read on every request and a serverless instance is
 * short-lived anyway; a cold start simply reads it once more.
 */
let cached: StoredKeys | null = null;

export async function loadKeys(): Promise<StoredKeys> {
  if (!cached) cached = await store.read();
  return cached;
}

export async function setKey(name: KeyName, value: string): Promise<void> {
  const current = await store.read();
  const trimmed = value.trim();
  // An empty value clears it, which is how you fall back to the environment.
  const next = {...current, [name]: trimmed || undefined};
  await store.write(next);
  cached = next;
}

/**
 * The key to use for Gemini.
 *
 * A pasted key wins over the environment: someone who has just typed one in is
 * expressing a preference, and the usual reason is that the old one ran out.
 */
export function geminiKey(): string {
  return cached?.gemini || config.apiKey;
}

export function goveeKey(): string {
  return cached?.govee ?? '';
}

export function psnToken(): string {
  return cached?.psn || process.env.PSN_NPSSO || '';
}

export function githubToken(): string {
  return cached?.github || process.env.GITHUB_TOKEN || '';
}

export function n8nAccess(): {key: string; url: string} {
  return {
    key: cached?.n8n || process.env.N8N_API_KEY || '',
    url: (cached?.n8nUrl || process.env.N8N_URL || '').replace(/\/+$/, ''),
  };
}

export function chosenVoice(): string {
  return cached?.voice || '';
}

export function googleClient(): {id: string; secret: string; owner: string} {
  return {
    id: cached?.googleClientId || process.env.GOOGLE_CLIENT_ID || '',
    secret: cached?.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET || '',
    owner: cached?.ownerEmail || process.env.GRACE_OWNER_EMAIL || '',
  };
}

/** Enough to recognise a key without revealing it. */
function tail(value: string | undefined): string | null {
  if (!value) return null;
  return value.length <= 4 ? '••••' : `••••${value.slice(-4)}`;
}

export async function keyStatus() {
  const keys = await loadKeys();
  const google = googleClient();
  return {
    googleClientId: {
      set: Boolean(google.id),
      pasted: Boolean(keys.googleClientId),
      hint: tail(keys.googleClientId) ?? (google.id ? 'from the environment' : null),
    },
    googleClientSecret: {
      set: Boolean(google.secret),
      pasted: Boolean(keys.googleClientSecret),
      hint:
        tail(keys.googleClientSecret) ?? (google.secret ? 'from the environment' : null),
    },
    ownerEmail: {
      set: Boolean(google.owner),
      pasted: Boolean(keys.ownerEmail),
      // Not a secret, so it is worth showing in full — it is the thing most
      // likely to be typed wrong.
      hint: google.owner || null,
    },
    gemini: {
      set: Boolean(keys.gemini || config.apiKey),
      pasted: Boolean(keys.gemini),
      hint: tail(keys.gemini) ?? (config.apiKey ? 'from the environment' : null),
    },
    govee: {
      set: Boolean(keys.govee),
      pasted: Boolean(keys.govee),
      hint: tail(keys.govee),
    },
    psn: {
      set: Boolean(psnToken()),
      pasted: Boolean(keys.psn),
      hint: tail(keys.psn) ?? (process.env.PSN_NPSSO ? 'from the environment' : null),
    },
    github: {
      set: Boolean(githubToken()),
      pasted: Boolean(keys.github),
      hint: tail(keys.github) ?? (process.env.GITHUB_TOKEN ? 'from the environment' : null),
    },
    n8n: {
      set: Boolean(n8nAccess().key),
      pasted: Boolean(keys.n8n),
      hint: tail(keys.n8n),
    },
    n8nUrl: {
      set: Boolean(n8nAccess().url),
      pasted: Boolean(keys.n8nUrl),
      // An address, not a secret — showing it whole is what catches typos.
      hint: n8nAccess().url || null,
    },
  };
}
