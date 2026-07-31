/**
 * Other AIs Jason can ask.
 *
 * He is a builder, not a designer. When a specification is incomplete he does
 * not fill the gap with a plausible guess — he asks. If a research peer is
 * configured he asks it; if not, he asks you. Guessing is the one thing he may
 * never do, because a guessed channel id or a guessed field name produces a
 * workflow that saves fine, looks right, and fails at 3am.
 *
 * Two protocols, because the AIs you build later may not all speak the same
 * one: MCP (JSON-RPC tools/call) and plain JSON in / JSON out.
 */

const KEY_PEERS = 'settings:peers';
const MAX_QUESTION = 2000;
const TIMEOUT_MS = 25000;

/** @returns {Promise<Array<{name,url,protocol,tool,description,hasToken}>>} */
export async function listPeers(store) {
  const raw = (await store.getKv(KEY_PEERS)) ?? [];
  return (Array.isArray(raw) ? raw : []).map(({ token, ...rest }) => ({ ...rest, hasToken: Boolean(token) }));
}

async function loadRaw(store) {
  const raw = (await store.getKv(KEY_PEERS)) ?? [];
  return Array.isArray(raw) ? raw : [];
}

export async function savePeer(store, peer) {
  const name = String(peer.name ?? '').trim().slice(0, 40);
  if (!name) throw new Error('A peer needs a name.');
  if (!/^https:\/\//i.test(peer.url ?? '')) throw new Error('A peer URL must be https.');

  const peers = await loadRaw(store);
  const existing = peers.find((p) => p.name === name);
  const next = {
    name,
    url: peer.url.trim(),
    protocol: peer.protocol === 'mcp' ? 'mcp' : 'json',
    tool: (peer.tool ?? '').trim() || null,
    description: String(peer.description ?? '').slice(0, 200),
    // Blank means "keep the existing token", so saving a description does not
    // silently wipe the credential.
    token: peer.token ? String(peer.token) : existing?.token ?? null,
  };

  const merged = existing ? peers.map((p) => (p.name === name ? next : p)) : [...peers, next];
  await store.setKv(KEY_PEERS, merged);
  return listPeers(store);
}

/** Retiring keeps nothing secret behind — but it also destroys nothing else. */
export async function removePeer(store, name) {
  const peers = await loadRaw(store);
  await store.setKv(KEY_PEERS, peers.filter((p) => p.name !== name));
  return listPeers(store);
}

/**
 * Ask a peer a question and return its answer as text.
 *
 * Deliberately narrow: a question in, an answer out. Jason cannot make a peer
 * run tools, spend money or touch anything — he is asking, not delegating.
 */
export async function askPeer(store, { name, question, fetchImpl = globalThis.fetch }) {
  const peers = await loadRaw(store);
  const peer = name ? peers.find((p) => p.name === name) : peers[0];
  if (!peer) {
    return { ok: false, error: name ? `No peer called "${name}".` : 'No research peer is configured. Ask the user instead.' };
  }

  const q = String(question ?? '').trim().slice(0, MAX_QUESTION);
  if (!q) return { ok: false, error: 'The question was empty.' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers = { 'Content-Type': 'application/json' };
  if (peer.token) headers.Authorization = `Bearer ${peer.token}`;

  const body =
    peer.protocol === 'mcp'
      ? { jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name: peer.tool || 'ask', arguments: { question: q } } }
      : { text: q };

  let res;
  try {
    res = await fetchImpl(peer.url, { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, error: `Could not reach ${peer.name}: ${err.message}`, peer: peer.name };
  }
  clearTimeout(timer);

  const text = await res.text();
  if (!res.ok) return { ok: false, error: `${peer.name} returned ${res.status}: ${text.slice(0, 200)}`, peer: peer.name };

  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: true, peer: peer.name, answer: text.slice(0, 4000) };
  }

  // Pull the answer out of whichever shape came back, rather than assuming one.
  const answer =
    parsed?.result?.content?.[0]?.text ??
    parsed?.result?.structuredContent?.reply ??
    parsed?.reply ??
    parsed?.answer ??
    parsed?.text ??
    (typeof parsed === 'string' ? parsed : JSON.stringify(parsed).slice(0, 4000));

  return { ok: true, peer: peer.name, answer };
}
