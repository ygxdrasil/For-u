/**
 * Peers: the other agents Selena can reach.
 *
 * Jason builds what she finds. Grace is the voice assistant. Both are separate
 * deployments with their own tokens, so "connect her to them" means: store
 * where they are, store a credential, prove it works, and give her one way to
 * send something.
 *
 * Three decisions worth stating:
 *
 * 1. Tokens are encrypted at rest. They are somebody else's credential sitting
 *    in your database, and a database dump should not be a set of working keys
 *    to two other systems. AES-256-GCM under a key derived from the same
 *    secret that signs sessions.
 *
 * 2. A test reports what the peer actually SAID, not whether the call returned
 *    200. A 200 from a login page is still a 200. The body comes back so you
 *    can see you reached the thing you meant to reach.
 *
 * 3. Nothing is ever sent automatically. Selena reads and writes; reaching
 *    another system is an outward action and it happens when you press
 *    something, or when a command you confirmed says so.
 */

import crypto from 'node:crypto';
import { nowIso, randomId, canonicalUrl } from './util.js';

export const PEERS_KEY = 'peers';

/**
 * What each kind of peer expects. Jason's is read from his own source: he
 * takes { text } on /api/agent with a bearer token and answers { ok, reply }.
 */
export const PEER_KINDS = {
  builder: {
    label: 'Builder (Jason)',
    defaultPath: '/api/agent',
    bodyFor: (message) => ({ text: message }),
    replyFrom: (json) => json?.reply ?? json?.message ?? null,
    probe: 'Selena here, checking the line. Reply with anything.',
    note: 'Jason takes { "text": "…" } on /api/agent with a bearer token and answers { ok, reply }. Findings handed over use the richer handoff packet instead.',
  },
  assistant: {
    label: 'Assistant (Grace)',
    defaultPath: '/api/agent',
    bodyFor: (message) => ({ text: message }),
    replyFrom: (json) => json?.reply ?? json?.answer ?? json?.message ?? null,
    probe: 'Selena here, checking the line. Reply with anything.',
    note: 'Assumes the same shape as Jason: { "text": "…" } in, { reply } out. If Grace expects something else, use a generic peer and say so.',
  },
  generic: {
    label: 'Something else',
    defaultPath: '',
    bodyFor: (message) => ({ text: message, from: 'selena' }),
    replyFrom: (json) => json?.reply ?? json?.message ?? null,
    probe: 'Selena here, checking the line.',
    note: 'POSTs { "text": "…", "from": "selena" } to the URL exactly as given.',
  },
};

export const PEER_KIND_NAMES = Object.keys(PEER_KINDS);

// ---------------------------------------------------------------------------
// Token encryption
// ---------------------------------------------------------------------------

/**
 * Derived keys, cached for the life of the process.
 *
 * scrypt is deliberately slow — measured at ~60ms here — which is the whole
 * point when it is guarding a password, and pure waste when the same
 * deployment secret is stretched into the same key over and over. The
 * dashboard polls every twelve seconds; without this, that is 60ms of CPU
 * burned per poll to answer a question whose input never changes.
 *
 * A Map keyed by the secret, in memory only, never persisted. It lives exactly
 * as long as the warm function instance does.
 */
const keyCache = new Map();

function keyFrom(secret) {
  const id = String(secret);
  const cached = keyCache.get(id);
  if (cached) return cached;
  // A fixed salt is fine here: the secret is already high-entropy and unique
  // per deployment, and a random salt would need storing beside the ciphertext
  // for no gain.
  const derived = crypto.scryptSync(id, 'selena-peer-tokens', 32);
  // Bounded so a pathological caller cannot grow it without limit; in practice
  // there is one secret per deployment and this never evicts.
  if (keyCache.size > 8) keyCache.clear();
  keyCache.set(id, derived);
  return derived;
}

export function encryptToken(plain, secret) {
  if (!plain) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFrom(secret), iv);
  const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  return `v1.${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${enc.toString('base64url')}`;
}

export function decryptToken(sealed, secret) {
  if (!sealed) return null;
  const parts = String(sealed).split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return null;
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyFrom(secret), Buffer.from(parts[1], 'base64url'));
    decipher.setAuthTag(Buffer.from(parts[2], 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(parts[3], 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    // A wrong key or tampered ciphertext lands here. Null, never a throw: a
    // peer with an unreadable token is a peer that needs its token setting
    // again, not a broken page.
    return null;
  }
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export async function listPeers(store, { withTokens = false, secret = null } = {}) {
  const peers = (await store.getKv(PEERS_KEY)) ?? [];
  return peers
    .filter((p) => p && !p.retiredAt)
    .map((p) => ({
      ...p,
      // Never leave the server unless explicitly asked for by code that needs it.
      token: withTokens && secret ? decryptToken(p.token, secret) : undefined,
      hasToken: Boolean(p.token),
    }));
}

export async function addPeer(store, { name, kind, url, token }, secret) {
  const clean = canonicalUrl(url);
  if (!clean) throw new Error(`"${url}" is not a usable https URL.`);
  if (!PEER_KINDS[kind]) throw new Error(`Unknown peer kind "${kind}".`);

  const peers = (await store.getKv(PEERS_KEY)) ?? [];
  const peer = {
    id: randomId('peer'),
    name: String(name ?? kind).slice(0, 60),
    kind,
    url: clean,
    token: token ? encryptToken(token, secret) : null,
    addedAt: nowIso(),
    retiredAt: null,
    lastTestedAt: null,
    lastResult: null,
  };
  await store.setKv(PEERS_KEY, [...peers, peer]);
  return { ...peer, token: undefined, hasToken: Boolean(peer.token) };
}

/** Retired, not removed. The record that it existed is part of the audit trail. */
export async function retirePeer(store, id) {
  const peers = (await store.getKv(PEERS_KEY)) ?? [];
  await store.setKv(
    PEERS_KEY,
    peers.map((p) => (p.id === id ? { ...p, retiredAt: nowIso() } : p)),
  );
  return listPeers(store);
}

async function recordResult(store, id, result) {
  const peers = (await store.getKv(PEERS_KEY)) ?? [];
  await store.setKv(
    PEERS_KEY,
    peers.map((p) => (p.id === id ? { ...p, lastTestedAt: nowIso(), lastResult: result } : p)),
  );
}

// ---------------------------------------------------------------------------
// Talking to them
// ---------------------------------------------------------------------------

/**
 * Send one message to a peer and report exactly what came back.
 *
 * @returns {{ok:boolean, status:number|null, reply:string|null, detail:string, reachedSomething:boolean}}
 */
export async function sendToPeer(peer, message, { secret, fetchImpl = globalThis.fetch, timeoutMs = 20_000, store = null }) {
  const spec = PEER_KINDS[peer.kind] ?? PEER_KINDS.generic;
  const token = peer.token ?? decryptToken(peer.tokenSealed ?? peer.token, secret);

  const base = String(peer.url).replace(/\/+$/, '');
  const target = spec.defaultPath && !base.includes('/api/') ? `${base}${spec.defaultPath}` : base;

  let outcome;
  try {
    const res = await fetchImpl(target, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(spec.bodyFor(message)),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const raw = await res.text();
    let json = null;
    try {
      json = JSON.parse(raw);
    } catch {
      // HTML back from a JSON endpoint almost always means you reached a login
      // page or the wrong path, and that is worth saying rather than "failed".
    }

    outcome = {
      ok: res.ok && Boolean(json),
      status: res.status,
      target,
      reply: json ? spec.replyFrom(json) : null,
      // A 200 is not proof. What it said is.
      detail: json ? JSON.stringify(json).slice(0, 400) : raw.slice(0, 300),
      reachedSomething: true,
      lookedLikeHtml: !json && /^\s*</.test(raw),
    };
  } catch (err) {
    outcome = {
      ok: false,
      status: null,
      target,
      reply: null,
      detail: err.name === 'TimeoutError' ? `no answer within ${Math.round(timeoutMs / 1000)}s` : err.message,
      reachedSomething: false,
      lookedLikeHtml: false,
    };
  }

  if (store && peer.id) await recordResult(store, peer.id, outcome);
  return outcome;
}

/** A harmless probe, so "is this connected?" costs nothing but a round trip. */
export async function testPeer(peer, opts) {
  const spec = PEER_KINDS[peer.kind] ?? PEER_KINDS.generic;
  const result = await sendToPeer(peer, spec.probe, opts);
  return {
    ...result,
    verdict: result.ok
      ? 'connected'
      : result.lookedLikeHtml
        ? 'reached a web page rather than an API — check the URL and the path'
        : result.status === 401 || result.status === 403
          ? 'reached it, but the token was refused'
          : result.reachedSomething
            ? `reached it, but it answered ${result.status} with something unusable`
            : 'could not reach it at all',
  };
}
