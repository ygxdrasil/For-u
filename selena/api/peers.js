/**
 * /api/peers — the other agents she can reach.
 *
 * GET                        list them, with what happened the last time each was tested
 * POST { action: 'add' }     { name, kind, url, token }
 * POST { action: 'test' }    send a harmless probe and report what came back
 * POST { action: 'send' }    send one message
 * POST { action: 'retire' }  stop using one; the record it existed is kept
 *
 * A test reports what the peer SAID, not whether the call returned 200. A 200
 * from a login page is still a 200, and "connected" is a claim that has to be
 * earned by something on the other end answering in the shape it promised.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { getSessionSecret } from '../core/password.js';
import { listPeers, addPeer, retirePeer, testPeer, sendToPeer, decryptToken, PEER_KINDS } from '../core/peers.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const ctx = await createContext({ budgetMs: 25_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error, needsLogin: gate.needsLogin });

  // The same secret that signs sessions also seals peer tokens, so there is
  // one thing to keep and one thing to lose.
  const secret = await getSessionSecret(ctx.store);

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      peers: await listPeers(ctx.store),
      kinds: Object.entries(PEER_KINDS).map(([id, k]) => ({ id, label: k.label, note: k.note, defaultPath: k.defaultPath })),
      // Env-configured Jason predates this page and still works; say so rather
      // than letting you wonder why handoffs go somewhere you never added.
      envJason: {
        endpoint: process.env.JASON_ENDPOINT ?? null,
        hasToken: Boolean(process.env.JASON_TOKEN),
      },
      context: contextStatus(ctx),
    });
  }

  const body = await readBody(req);
  const action = String(body.action ?? '').toLowerCase();

  if (action === 'add') {
    try {
      const peer = await addPeer(
        ctx.store,
        { name: body.name, kind: body.kind, url: body.url, token: body.token },
        secret,
      );
      await ctx.store.addActivity({ kind: 'peer', level: 'info', message: `connected to ${peer.name} (${peer.kind})` });
      return json(res, 201, { ok: true, peer, note: 'Stored. Nothing has been sent to it — press test when you want to prove the line works.' });
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
  }

  const id = String(body.id ?? '').trim();
  if (!id) return json(res, 400, { ok: false, error: 'Which peer? Send { "id": "..." }.' });

  const stored = ((await ctx.store.getKv('peers')) ?? []).find((p) => p.id === id && !p.retiredAt);
  if (!stored) return json(res, 404, { ok: false, error: 'No such peer.' });

  const peer = { ...stored, token: decryptToken(stored.token, secret) };
  if (stored.token && !peer.token) {
    return json(res, 409, {
      ok: false,
      error: 'That peer\'s token could not be decrypted — SESSION_SECRET has changed since it was stored. Add the peer again with its token.',
    });
  }

  if (action === 'test') {
    const result = await testPeer(peer, { secret, fetchImpl: ctx.fetchImpl, store: ctx.store });
    return json(res, 200, { ok: true, tested: true, result });
  }

  if (action === 'send') {
    const message = String(body.message ?? '').slice(0, 4000);
    if (!message) return json(res, 400, { ok: false, error: 'Send { "message": "..." }.' });
    const result = await sendToPeer(peer, message, { secret, fetchImpl: ctx.fetchImpl, store: ctx.store });
    await ctx.store.addActivity({
      kind: 'peer',
      level: result.ok ? 'info' : 'error',
      message: `sent to ${peer.name}: ${result.ok ? 'delivered' : `failed — ${String(result.detail).slice(0, 80)}`}`,
    });
    return json(res, 200, { ok: true, sent: true, result });
  }

  if (action === 'retire') {
    const peers = await retirePeer(ctx.store, id);
    return json(res, 200, { ok: true, peers, note: 'Retired, not deleted. The record that it existed is kept.' });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use add, test, send or retire.` });
});
