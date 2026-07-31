/**
 * /api/tokens — credentials that can be replaced in one click.
 *
 * Built with the token rather than after it. Two tokens can be live at once,
 * so Jason can be moved onto a new one and the old one retired afterwards,
 * with no window where he is broken.
 *
 * Retiring marks a token dead; it does not remove the record that it existed.
 *
 * GET                         list live and retired tokens (never the values)
 * POST { action: 'mint' }     returns the raw token ONCE
 * POST { action: 'retire', id }
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createStore } from '../core/store.js';
import { authenticateAdmin, rotateToken, retireToken, listTokens } from '../core/auth.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  // Minting always needs the bootstrap token specifically, even in open mode:
  // an open API that can mint its own credentials is not open, it is broken.
  const admin = authenticateAdmin(req);
  if (!admin.ok) return json(res, 401, { ok: false, error: admin.error });

  const store = await createStore();

  if (req.method === 'GET') {
    return json(res, 200, { ok: true, tokens: await listTokens(store), durable: store.durable });
  }

  const body = await readBody(req);
  const action = String(body.action ?? '').toLowerCase();

  if (action === 'mint') {
    const minted = await rotateToken(store, { label: body.label ? String(body.label).slice(0, 60) : null });
    return json(res, 201, {
      ok: true,
      id: minted.id,
      token: minted.raw,
      note: 'This is the only time the value is shown. The old tokens are still live — retire them once Jason is moved across.',
      durable: store.durable,
      warning: store.durable ? null : 'The store is in memory, so this token disappears on the next cold start. Set DATABASE_URL first.',
    });
  }

  if (action === 'retire') {
    const id = String(body.id ?? '').trim();
    if (!id) return json(res, 400, { ok: false, error: 'Which token? Send { "id": "..." }.' });
    const remaining = await retireToken(store, id);
    return json(res, 200, { ok: true, liveTokens: remaining, note: 'Retired, not deleted — the record that it existed is part of the audit trail.' });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use mint or retire.` });
});
