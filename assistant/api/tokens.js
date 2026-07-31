/**
 * POST /api/tokens — mint, list and retire tokens for /api/agent.
 *
 * The rotate button is built at the same time as the token, not later. Rotating
 * mints a new token and leaves the old one working until you retire it, so the
 * voice assistant never breaks mid-swap.
 *
 * Retiring marks a token retired. It does not delete the row.
 */

import { createStore } from '../core/store.js';
import { authenticateAdmin, mintToken } from '../core/auth.js';
import { json, methodGuard, readBody } from '../core/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const admin = authenticateAdmin(req);
  if (!admin.ok) return json(res, 401, { ok: false, error: admin.error });

  const store = await createStore();

  if (req.method === 'GET') {
    return json(res, 200, { ok: true, tokens: await store.listTokens(), durable: store.durable });
  }

  req.body = await readBody(req);
  const action = req.body.action ?? 'mint';

  if (action === 'mint') {
    const { raw, hash } = mintToken();
    const record = await store.addToken({
      id: `tok_${Date.now().toString(36)}`,
      hash,
      label: req.body.label ?? 'unnamed',
      createdAt: new Date().toISOString(),
      retiredAt: null,
    });
    return json(res, 200, {
      ok: true,
      // Shown exactly once. Only the hash is stored.
      token: raw,
      id: record.id,
      durable: store.durable,
      warning: store.durable
        ? null
        : 'This token lives in memory only and will stop working when the function cold-starts. Set DATABASE_URL for tokens that persist.',
    });
  }

  if (action === 'retire') {
    if (!req.body.id) return json(res, 400, { ok: false, error: 'Send { action: "retire", id }.' });
    const retired = await store.retireToken(req.body.id);
    return json(res, 200, { ok: Boolean(retired), retired, note: 'Marked retired. The record is kept.' });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use "mint" or "retire".` });
}
