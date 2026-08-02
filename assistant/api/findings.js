/**
 * POST /api/findings — mark something you have dealt with as dealt with.
 *
 * The sweep opens a finding when a workflow fails. Nothing closed them, so the
 * count in the panel only ever went up: you could fix the workflow, watch it
 * run clean, and still be told it needed a look. A number that cannot go down
 * stops being read, which makes it worse than no number at all.
 *
 * Closing is explicit and reversible, and it keeps the record. Nothing here
 * deletes a finding — resolved is a status, not an erasure, so the history of
 * what broke and when survives.
 */

import { createStore } from '../core/store.js';
import { json, methodGuard, readBody } from '../core/http.js';
import { requireSession } from './auth.js';

const ACTIONS = ['resolve', 'reopen'];

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  const body = await readBody(req);
  const action = body.action ?? 'resolve';

  if (!ACTIONS.includes(action)) {
    return json(res, 400, { ok: false, error: `Unknown action "${action}". This route resolves and reopens — it never removes.` });
  }
  if (!body.id) return json(res, 400, { ok: false, error: 'Which finding?' });

  const updated = await store.updateFinding(body.id, {
    status: action === 'resolve' ? 'resolved' : 'open',
    resolvedAt: action === 'resolve' ? new Date().toISOString() : null,
    resolvedBy: action === 'resolve' ? 'you' : null,
  });

  if (!updated) return json(res, 404, { ok: false, error: `No finding with id ${body.id}.` });

  return json(res, 200, {
    ok: true,
    finding: updated,
    open: await store.listFindings({ status: 'open' }),
    note: action === 'resolve' ? 'Marked as dealt with. The record is kept — it can be reopened.' : 'Back on the list.',
  });
}
