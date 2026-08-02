/**
 * /api/watches — the standing watches.
 *
 * GET                       list them, with cost and cadence
 * POST { action: 'create' } add one
 * POST { action: 'run' }    run one now
 * POST { action: 'pause' | 'resume' | 'approve' }
 * POST { action: 'arm' | 'disarm' | 'stop-everything' | 'settings' }
 *
 * One file, one path segment: a nested route like /api/watches/run would 404
 * on Vercel without the code ever executing. Arming lives here rather than in
 * its own route for the same reason api/tokens.js folded into api/auth.js —
 * Vercel's Hobby plan stops at twelve functions and this deploy is at eleven.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { createWatch, runWatch, isDue, CADENCES, WATCH_STATES } from '../core/watches.js';
import { LEVEL_NAMES } from '../core/depth.js';
import { summarizeFinding } from '../core/schema.js';
import { nowIso } from '../core/util.js';
import { listProposals, approveProposal, dismissProposal } from '../core/explore.js';
import { readAutonomy, updateAutonomy, arm, disarm, describeAutonomy, handoffsInWindow, unattendedHeadroom, DEFAULTS } from '../core/autonomy.js';
import { stopEverything } from '../core/pass.js';

/**
 * Everything the HUD needs to render her autonomy without doing arithmetic of
 * its own. The sentence is built here so there is exactly one copy of the
 * wording, and the numbers next to it are the ones it was built from.
 */
async function autonomyView(ctx) {
  const state = await readAutonomy(ctx.store);
  const money = await ctx.meter.summary().catch(() => ({ monthToDateUsd: 0, capUsd: ctx.capUsd }));
  return {
    armed: state.armed,
    says: describeAutonomy(state, { capUsd: money.capUsd, spentUsd: money.monthToDateUsd }),
    disarmedBy: state.disarmedBy,
    disarmReason: state.disarmReason,
    backedOff: state.backedOff,
    quietRuns: state.quietRuns,
    errorRuns: state.errorRuns,
    runCount: state.runCount,
    lastRunAt: state.lastRunAt,
    lastRunSummary: state.lastRunSummary,
    handoffFloor: state.handoffFloor,
    handoffsPerWeek: state.handoffsPerWeek,
    handoffsThisWeek: handoffsInWindow(state).length,
    reserveUsd: state.reserveUsd,
    maxSelfWatches: state.maxSelfWatches,
    allowanceLeftUsd: unattendedHeadroom(state, { capUsd: money.capUsd, spentUsd: money.monthToDateUsd }),
    capUsd: money.capUsd,
    spentUsd: money.monthToDateUsd,
    defaults: DEFAULTS,
  };
}

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
      // What she found on her own, waiting for your approval. Nothing here is
      // being watched or costing anything yet.
      proposals: await listProposals(ctx.store).catch(() => []),
      autonomy: await autonomyView(ctx),
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

  // ---- autonomy: none of these takes a watch id --------------------------

  if (action === 'arm') {
    // Arming with no model key would be arming her to do nothing at a cost of
    // nothing, which reads as broken rather than as unconfigured.
    if (!ctx.llm) {
      return json(res, 400, { ok: false, error: `She cannot read anything without a model key, so arming her would just schedule failures. ${ctx.llmError}` });
    }
    if (!ctx.store.durable) {
      return json(res, 400, {
        ok: false,
        error:
          'Storage is in memory, so she would forget what she already reported between cold starts and re-report the same finding every run — and her own brake counters would reset with it. Set DATABASE_URL before arming her.',
      });
    }
    const state = await arm(ctx.store, { settings: pickSettings(body) });
    return json(res, 200, { ok: true, autonomy: await autonomyView(ctx), armed: state.armed });
  }

  if (action === 'disarm') {
    await disarm(ctx.store, { by: 'you', reason: body.reason ? String(body.reason).slice(0, 200) : null });
    return json(res, 200, { ok: true, autonomy: await autonomyView(ctx) });
  }

  if (action === 'stop-everything') {
    const outcome = await stopEverything(ctx.store);
    return json(res, 200, {
      ok: true,
      paused: outcome.paused,
      autonomy: await autonomyView(ctx),
      message: `Disarmed, and paused ${outcome.paused.length} watch(es). Nothing runs on a schedule until you start it again.`,
    });
  }

  if (action === 'settings') {
    await updateAutonomy(ctx.store, pickSettings(body));
    return json(res, 200, { ok: true, autonomy: await autonomyView(ctx) });
  }

  if (action === 'approve-proposal' || action === 'dismiss-proposal') {
    const proposalId = String(body.id ?? '').trim();
    if (!proposalId) return json(res, 400, { ok: false, error: 'Which proposal? Send { "id": "..." }.' });
    const result =
      action === 'approve-proposal'
        ? await approveProposal(ctx.store, proposalId, { cadence: body.cadence ?? 'weekly' })
        : await dismissProposal(ctx.store, proposalId);
    if (!result.ok) return json(res, 404, { ok: false, error: result.error });
    return json(res, 200, { ok: true, ...result, proposals: await listProposals(ctx.store) });
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

  return json(res, 400, {
    ok: false,
    error: `Unknown action "${action}". Use create, run, pause, resume, approve, arm, disarm, stop-everything or settings.`,
  });
});

/**
 * Only the settings she is allowed to be told, and only when they were
 * actually sent. Spreading the whole body would let a stray field overwrite
 * her counters — quietRuns and handoffs are hers to move, not the caller's.
 */
function pickSettings(body) {
  const out = {};
  for (const key of ['reserveUsd', 'handoffFloor', 'handoffsPerWeek', 'quietRunsBeforeBackoff', 'errorRunsBeforeStop', 'maxSelfWatches']) {
    if (body[key] !== undefined && body[key] !== null && body[key] !== '') out[key] = Number(body[key]);
  }
  return out;
}
