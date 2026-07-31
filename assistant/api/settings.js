/**
 * GET/POST /api/settings — the keys, stored server-side so they stay.
 *
 * Requires a session. GET never returns a secret value, only whether it is set
 * and its last four characters, so the page can show you which key is in place
 * without the key itself ever travelling back over the wire.
 */

import { createStore } from '../core/store.js';
import { json, methodGuard, readBody } from '../core/http.js';
import { describeServerConfig, saveServerConfig } from '../core/settings.js';
import { requireSession } from './auth.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const store = await createStore();
  const session = await requireSession(req, store);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      settings: await describeServerConfig(store),
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

  if (!Object.keys(patch).length) {
    return json(res, 400, { ok: false, error: 'Nothing to save.' });
  }

  try {
    await saveServerConfig(store, patch);
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
