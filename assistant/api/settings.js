/**
 * GET/POST /api/settings — the keys, stored server-side so they stay.
 *
 * Requires a session. GET never returns a secret value, only whether it is set
 * and its last four characters, so the page can show you which key is in place
 * without the key itself ever travelling back over the wire.
 */

import { createStore } from '../core/store.js';
import { json, methodGuard, readBody } from '../core/http.js';
import { describeServerConfig, saveServerConfig, savePrefs } from '../core/settings.js';
import { activeFacts, remember, correct, retire } from '../core/memory.js';
import { listPeers, savePeer, removePeer } from '../core/peers.js';
import { requireSession } from './auth.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      settings: await describeServerConfig(store),
      memory: await activeFacts(store),
      peers: await listPeers(store),
      durable: store.durable,
      storeNote: store.note ?? null,
    });
  }

  req.body = await readBody(req);

  // Only the fields actually present are touched, so saving the n8n URL does
  // not silently wipe a key you did not retype.
  const patch = {};
  for (const field of ['n8nBaseUrl', 'n8nApiKey', 'geminiApiKey', 'monthlyCapUsd']) {
    if (req.body[field] !== undefined) patch[field] = req.body[field];
  }

  // Memory actions. Correcting supersedes; retiring keeps the record. There is
  // no path here that destroys a fact.
  if (req.body.memory) {
    const m = req.body.memory;
    try {
      if (m.action === 'add') await remember(store, m.text, { source: 'told' });
      else if (m.action === 'correct') await correct(store, m.id, m.text);
      else if (m.action === 'retire') await retire(store, m.id);
      else return json(res, 400, { ok: false, error: `Unknown memory action "${m.action}".` });
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
    return json(res, 200, { ok: true, memory: await activeFacts(store) });
  }

  // Peers: the other AIs Jason may ask when a specification is incomplete.
  if (req.body.peer) {
    const p = req.body.peer;
    try {
      const peers = p.action === 'remove' ? await removePeer(store, p.name) : await savePeer(store, p);
      return json(res, 200, { ok: true, peers });
    } catch (err) {
      return json(res, 400, { ok: false, error: err.message });
    }
  }

  const hasPrefs = req.body.prefs && typeof req.body.prefs === 'object';

  if (!Object.keys(patch).length && !hasPrefs) {
    return json(res, 400, { ok: false, error: 'Nothing to save.' });
  }

  try {
    if (Object.keys(patch).length) await saveServerConfig(store, patch);
    // Clamped on the way in, so a bad value can never reach the running system.
    if (hasPrefs) await savePrefs(store, req.body.prefs);
  } catch (err) {
    return json(res, 500, { ok: false, error: `Could not save settings: ${err.message}` });
  }

  return json(res, 200, {
    ok: true,
    saved: Object.keys(patch),
    settings: await describeServerConfig(store),
    durable: store.durable,
    warning: store.durable ? null : 'Saved to memory only — a cold start will lose these. Set DATABASE_URL.',
  });
}
