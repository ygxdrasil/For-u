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
import {
  listConnectors,
  addConnector,
  updateConnector,
  retireConnector,
  getConnector,
  testConnector,
  mcpListTools,
  CONNECTOR_KINDS,
} from '../core/connectors.js';
import { SOURCES } from '../core/sources.js';
import { STARTERS, DEFAULT_SET, GROUPS, starterById, connectorInputFor, STARTERS_CHECKED_ON } from '../core/starters.js';

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
      // The sources you plugged in yourself, and the catalogue of places worth
      // plugging in. Same route as peers because Vercel's Hobby plan stops at
      // twelve functions and this deploy is at eleven.
      connectors: await listConnectors(ctx.store),
      connectorKinds: Object.entries(CONNECTOR_KINDS).map(([id, k]) => ({ id, ...k })),
      // Verified against the live APIs on the date below — URL, field map and
      // link template all probed, not written from documentation.
      starters: STARTERS.map(({ id, group, name, why, verified, gives, searchable }) => ({ id, group, name, why, verified, gives, searchable })),
      defaultSet: DEFAULT_SET,
      groups: GROUPS,
      startersCheckedOn: STARTERS_CHECKED_ON,
      catalogue: SOURCES.filter((s) => s.connectable).map((s) => ({
        id: s.id,
        name: s.name,
        access: s.access,
        gives: s.gives,
        docs: s.docs,
        endpoints: s.endpoints ?? [],
        note: s.note,
        checkedOn: s.checkedOn,
      })),
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

  // ---- connected sources -------------------------------------------------

  if (action === 'add-source') {
    const result = await addConnector(ctx.store, body, secret);
    if (!result.ok) return json(res, 400, result);
    await ctx.store.addActivity({ kind: 'source', level: 'info', message: `connected a source: ${result.connector.name} (${result.connector.kind})` });
    return json(res, 201, { ...result, connectors: await listConnectors(ctx.store), note: 'Saved. Nothing has been read from it yet — press test.' });
  }

  if (action === 'add-starters') {
    // One press rather than six forms. Each one is already known-good, so the
    // only thing that can go wrong here is adding the same source twice —
    // which is checked rather than left to produce duplicate reads.
    const wanted = Array.isArray(body.ids) && body.ids.length ? body.ids : DEFAULT_SET;
    const existing = await listConnectors(ctx.store);
    const added = [];
    const skipped = [];

    for (const id of wanted.slice(0, 20)) {
      const starter = starterById(id);
      if (!starter) {
        skipped.push({ id, why: 'no such source' });
        continue;
      }
      if (existing.some((c) => c.starterId === id || c.url === starter.url)) {
        skipped.push({ id, name: starter.name, why: 'already connected' });
        continue;
      }
      const result = await addConnector(ctx.store, connectorInputFor(starter), secret);
      if (result.ok) added.push(result.connector);
      else skipped.push({ id, name: starter.name, why: result.error });
    }

    if (added.length) {
      await ctx.store.addActivity({
        kind: 'source',
        level: 'report',
        message: `connected ${added.length} verified source(s): ${added.map((a) => a.name).join(', ')}`,
      });
    }

    return json(res, 201, {
      ok: true,
      added,
      skipped,
      connectors: await listConnectors(ctx.store),
      note: added.length
        ? `${added.length} connected. Press test on any of them to see the posts it returns right now.`
        : 'Nothing new to add — they were already connected.',
    });
  }

  if (action === 'mcp-tools') {
    // Listing before adding, so you can see what a server offers and pick the
    // tool rather than guessing its name.
    const url = String(body.url ?? '').trim();
    if (!/^https:\/\//i.test(url)) return json(res, 400, { ok: false, error: 'Give the MCP server URL, starting with https://.' });
    const listed = await mcpListTools(url, { token: body.token || null, fetchImpl: ctx.fetchImpl });
    return json(res, 200, {
      ok: listed.ok,
      dialect: listed.dialect,
      serverInfo: listed.serverInfo ?? null,
      error: listed.ok ? null : listed.detail,
      tools: (listed.tools ?? []).map((t) => ({
        name: t.name,
        description: String(t.description ?? '').slice(0, 400),
        // The argument names, so the query field can be chosen rather than typed.
        args: Object.keys(t.inputSchema?.properties ?? t.input_schema?.properties ?? {}),
      })),
    });
  }

  if (action === 'test-source' || action === 'retire-source' || action === 'toggle-source' || action === 'edit-source') {
    const sourceId = String(body.id ?? '').trim();
    if (!sourceId) return json(res, 400, { ok: false, error: 'Which source? Send { "id": "..." }.' });
    const connector = await getConnector(ctx.store, sourceId, secret);
    if (!connector) return json(res, 404, { ok: false, error: 'No such source.' });

    if (action === 'retire-source') {
      await retireConnector(ctx.store, sourceId);
      return json(res, 200, { ok: true, connectors: await listConnectors(ctx.store), note: 'Retired, not deleted. The record it existed is kept.' });
    }

    if (action === 'toggle-source') {
      await updateConnector(ctx.store, sourceId, { enabled: body.enabled !== false }, secret);
      return json(res, 200, { ok: true, connectors: await listConnectors(ctx.store) });
    }

    if (action === 'edit-source') {
      const patch = {};
      for (const key of ['name', 'url', 'tool', 'queryArg', 'authStyle', 'authName', 'method', 'bodyTemplate', 'testQuery']) if (body[key] !== undefined) patch[key] = body[key];
      if (body.token !== undefined && body.token !== '') patch.token = body.token;
      const map = {};
      for (const key of ['itemsPath', 'textPath', 'urlPath', 'urlTemplate', 'titlePath', 'datePath', 'weightPath']) if (body[key] !== undefined) map[key] = body[key] || null;
      if (Object.keys(map).length) patch.map = map;
      const result = await updateConnector(ctx.store, sourceId, patch, secret);
      if (!result.ok) return json(res, 400, result);
      return json(res, 200, { ok: true, connectors: await listConnectors(ctx.store) });
    }

    const result = await testConnector(connector, {
      secret,
      fetchImpl: ctx.fetchImpl,
      // Null rather than a default, so the connector's own known-good term is
      // used when it has one.
      query: String(body.query ?? '').trim() || null,
    });
    // Remembering the dialect turns the probe into a one-off rather than a
    // cost paid on every single run.
    await updateConnector(ctx.store, sourceId, { lastTestedAt: result.testedAt, lastResult: result, ...(result.dialect ? { dialect: result.dialect } : {}) }, secret);
    return json(res, 200, { ok: true, tested: true, result, connectors: await listConnectors(ctx.store) });
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

  return json(res, 400, {
    ok: false,
    error: `Unknown action "${action}". Use add, test, send, retire, add-source, test-source, edit-source, toggle-source, retire-source or mcp-tools.`,
  });
});
