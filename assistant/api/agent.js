/**
 * POST /api/agent — text in, JSON out, token authed.
 *
 * This is the seam the voice assistant plugs into: she sends the sentence and
 * reads the answer aloud herself. It exists from day one even before anything
 * calls it, because retrofitting a second entry point is how you end up with
 * two assistants that have drifted apart.
 *
 * It calls exactly the same core/run.js as the web UI, with the same tools.
 * The only difference is that nobody is watching the work, so the hooks are
 * no-ops and it waits for the finished result.
 *
 *   curl -X POST https://<host>/api/agent \
 *     -H "Authorization: Bearer $AGENT_TOKEN" \
 *     -H "Content-Type: application/json" \
 *     -d '{"text":"is anything broken?"}'
 */

import { run } from '../core/run.js';
import { createStore } from '../core/store.js';
import { authenticate } from '../core/auth.js';
import { json, methodGuard, readBody, resolveConfig } from '../core/http.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  const auth = await authenticate(req, store);
  if (!auth.ok) return json(res, 401, { ok: false, error: auth.error });

  req.body = await readBody(req);
  const text = req.body?.text ?? req.body?.message;
  if (!text || typeof text !== 'string') {
    return json(res, 400, { ok: false, error: 'Send { "text": "..." }.' });
  }

  try {
    const result = await run(
      {
        text,
        sessionId: req.body.sessionId ?? null,
        approvals: req.body.approvals ?? [],
        config: await resolveConfig(req, store),
        store,
        // Leave headroom under the 60s function limit so this returns an
        // answer rather than being killed and returning nothing at all.
        deadlineMs: Number(req.body.deadlineMs ?? 45_000),
      },
      {},
    );

    return json(res, 200, {
      ok: result.status === 'ok',
      status: result.status,
      reply: result.reply,
      jobId: result.jobId ?? null,
      steps: result.steps.map((s) => ({ tool: s.tool, ok: s.ok, summary: s.summary })),
      spend: result.spend,
      elapsedMs: result.elapsedMs,
      // Say plainly when state is not durable rather than letting a caller
      // assume its session will be remembered.
      storeDurable: result.storeDurable,
    });
  } catch (err) {
    return json(res, 500, { ok: false, status: 'error', error: err.message });
  }
}
