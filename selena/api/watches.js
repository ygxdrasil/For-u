/**
 * /api/watches — the standing watches.
 *
 * GET                       list them, with cost and cadence
 * POST { action: 'create' } add one
 * POST { action: 'run' }    run one now
 * POST { action: 'pause' | 'resume' | 'approve' }
 *
 * One file, one path segment: a nested route like /api/watches/run would 404
 * on Vercel without the code ever executing.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { createWatch, runWatch, isDue, CADENCES, WATCH_STATES } from '../core/watches.js';
import { LEVEL_NAMES } from '../core/depth.js';
import { summarizeFinding } from '../core/schema.js';
import { nowIso } from '../core/util.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const ctx = await createContext({ budgetMs: 50_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  const spendByLabel = await ctx.store.spendByWatch().catch(() => []);
  const costOf = (id) => spendByLabel.find((s) => s.label === `watch:${id}`)?.usd ?? 0;

  if (req.method === 'GET') {
    const watches = await ctx.store.listWatches();
    return json(res, 200, {
      ok: true,
      watches: await Promise.all(
        watches.map(async (w) => ({
          ...w,
          due: isDue(w, nowIso()),
          cadenceLabel: CADENCES[w.cadence]?.label ?? w.cadence,
          // Cost per watch, so the expensive useless ones can be killed.
          costUsd: costOf(w.id),
          rememberedCount: await ctx.store.seenCount(w.id).catch(() => 0),
        })),
      ),
      cadences: Object.entries(CADENCES).map(([id, c]) => ({ id, label: c.label })),
      depths: LEVEL_NAMES,
      states: WATCH_STATES,
      context: contextStatus(ctx),
      openApi: gate.open ? gate.warning : undefined,
    });
  }

  const body = await readBody(req);
  const action = String(body.action ?? '').toLowerCase();

  if (action === 'create') {
    const topic = String(body.topic ?? '').trim();
    if (!topic) return json(res, 400, { ok: false, error: 'A watch needs a topic.' });
    const watch = createWatch({
      name: body.name ?? topic,
      topic,
      cadence: body.cadence,
      depth: LEVEL_NAMES.includes(body.depth) ? body.depth : null,
      platforms: body.platforms,
      state: body.state,
      roaming: body.roaming,
    });
    await ctx.store.putWatch(watch);
    await ctx.store.addActivity({ kind: 'watch', level: 'info', message: `watch created: ${watch.name}`, watchId: watch.id });
    return json(res, 201, { ok: true, watch });
  }

  const id = String(body.id ?? '').trim();
  if (!id) return json(res, 400, { ok: false, error: 'Which watch? Send { "id": "..." }.' });
  const watch = await ctx.store.getWatch(id);
  if (!watch) return json(res, 404, { ok: false, error: `No watch with id ${id}.` });

  if (action === 'pause' || action === 'resume' || action === 'approve') {
    const state = action === 'pause' ? 'paused' : 'active';
    const updated = { ...watch, state };
    await ctx.store.putWatch(updated);
    return json(res, 200, { ok: true, watch: updated });
  }

  if (action === 'run') {
    const outcome = await runWatch(watch, ctx);
    return json(res, 200, {
      ok: true,
      watch: outcome.watch,
      reported: outcome.reported,
      reason: outcome.reason,
      change: outcome.change,
      status: outcome.result.status,
      notes: outcome.result.notes,
      depth: outcome.result.depth,
      costUsd: outcome.result.costUsd,
      stoppedEarly: outcome.result.stoppedEarly,
      finding: outcome.result.finding,
      summary: outcome.result.finding ? summarizeFinding(outcome.result.finding) : null,
      context: contextStatus(ctx),
    });
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}". Use create, run, pause, resume or approve.` });
});
