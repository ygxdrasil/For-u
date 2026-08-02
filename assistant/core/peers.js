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
  return (await loadRaw(store)).map(({ token, ...rest }) => ({ ...rest, hasToken: Boolean(token) }));
}

async function loadRaw(store) {
  const raw = (await store.getKv(KEY_PEERS)) ?? [];
  // Entries as well as the container: a null left by a half-written row used to
  // break listing entirely, which reads as "no peers configured" — and a peer
  // he cannot see is a question he does not ask.
  return Array.isArray(raw) ? raw.filter((p) => p && typeof p === 'object' && typeof p.name === 'string') : [];
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
export async function askPeer(store, { name, question, fetchImpl = globalThis.fetch, timeoutMs = TIMEOUT_MS, extra = null }) {
  const peers = await loadRaw(store);
  const peer = name ? peers.find((p) => p.name === name) : peers[0];
  if (!peer) {
    return { ok: false, error: name ? `No peer called "${name}".` : 'No research peer is configured. Ask the user instead.' };
  }

  const q = String(question ?? '').trim().slice(0, MAX_QUESTION);
  if (!q) return { ok: false, error: 'The question was empty.' };

  // The caller sets this, because the caller knows which serverless function it
  // is inside. A peer call that outlives its function is killed by the platform
  // and returns a bare 504 carrying nothing — no peer name, no reason, nothing
  // to act on. Better to give up first and be able to say why.
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);

  const headers = { 'Content-Type': 'application/json' };
  if (peer.token) headers.Authorization = `Bearer ${peer.token}`;

  // There is no standard for "a question in, an answer out" over plain JSON, so
  // the question goes under every name anyone actually uses. Sending one and
  // guessing wrong produces a 400 that reads like a broken peer rather than a
  // vocabulary mismatch — which is exactly what it cost the first time.
  const body =
    peer.protocol === 'mcp'
      ? { jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name: peer.tool || 'ask', arguments: { question: q } } }
      : { question: q, text: q, q, askedBy: 'jason', ...(extra ?? {}) };

  let res;
  try {
    res = await fetchImpl(peer.url, { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (timedOut) {
      return {
        ok: false,
        peer: peer.name,
        timedOut: true,
        error: `${peer.name} did not answer within ${Math.round(timeoutMs / 1000)}s. She may be doing something slow — reaching her is not the problem, waiting for her is.`,
      };
    }
    return { ok: false, error: `Could not reach ${peer.name}: ${err.message}`, peer: peer.name };
  }
  clearTimeout(timer);

  const text = await res.text();

  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    // A peer that refuses often says something worth relaying — "I could not
    // establish that" is an answer, and it is more use than a status code. Its
    // own words go first, and it is still reported as a failure, because a
    // refusal must never be passed off as knowledge.
    const said = parsed?.error ?? parsed?.answer ?? parsed?.reply ?? parsed?.message ?? null;
    const hint =
      res.status === 405
        ? ' That address does not accept a POST — it is probably the wrong path. Ask for the endpoint that takes questions.'
        : res.status === 404
          ? ' Nothing is listening at that path.'
          : res.status === 401 || res.status === 403
            ? ' The token was refused.'
            : '';
    return {
      ok: false,
      error: `${peer.name} returned ${res.status}: ${String(said ?? text).slice(0, 300)}${hint}`,
      peer: peer.name,
      status: res.status,
    };
  }

  if (!parsed) return { ok: true, peer: peer.name, answer: text.slice(0, 4000) };

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
