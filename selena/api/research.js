/**
 * POST /api/research — the seam Jason plugs into.
 *
 * Takes a question, returns the finding schema. This is one caller of
 * runResearch(); the HUD and the scheduler are the others, and all three go
 * through the same function. There is deliberately no second copy of the
 * pipeline here — two researchers with different standards is exactly the
 * failure this project is arranged to avoid.
 *
 * Body: { topic, depth?, save?, watchId? }
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { runResearch } from '../core/research.js';
import { summarizeFinding } from '../core/schema.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  // A little under the 60s function ceiling, so the pipeline stops itself and
  // reports what it managed rather than being killed and returning nothing.
  const ctx = await createContext({ budgetMs: 50_000 });

  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  const body = await readBody(req);
  const topic = String(body.topic ?? body.question ?? '').trim();
  if (!topic) {
    return json(res, 400, { ok: false, error: 'Send { "topic": "..." } — the thing you want researched.' });
  }

  const result = await runResearch(
    {
      topic,
      kind: body.kind === 'watch' ? 'watch' : 'question',
      watchId: body.watchId ?? null,
      requestedDepth: body.depth ?? null,
    },
    ctx,
  );

  // Saving is opt-in: Jason asking a one-off question should not silently fill
  // the archive with half-formed records.
  let saved = false;
  if (result.finding && body.save !== false) {
    await ctx.store.putFinding(result.finding);
    saved = true;
  }

  json(res, result.ok ? 200 : 422, {
    ok: result.ok,
    status: result.status,
    runId: result.runId,
    saved,
    finding: result.finding,
    summary: result.finding ? summarizeFinding(result.finding) : null,
    notes: result.notes,
    depth: result.depth,
    costUsd: result.costUsd,
    sourcesRead: result.sourcesRead,
    stoppedEarly: result.stoppedEarly,
    stoppedReason: result.stoppedReason,
    elapsedMs: result.elapsedMs,
    context: contextStatus(ctx),
    openApi: gate.open ? gate.warning : undefined,
  });
});
