/**
 * /api/cron — the scheduler's entry point.
 *
 * Called by GitHub Actions rather than Vercel Cron, because a deep dig is many
 * round trips and does not fit inside a 60s function. The Action calls this
 * once per due watch, so each invocation stays comfortably inside the limit
 * and a single slow watch cannot take the rest of the sweep down with it.
 *
 * GET  — what is due right now, without running anything. Safe to poll.
 * POST { limit?, reverify? } — run the due watches, oldest first.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { dueWatches, runWatch, staleFindings, reverifyFinding } from '../core/watches.js';
import { clampNumber, nowIso } from '../core/util.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const ctx = await createContext({ budgetMs: 50_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  const at = nowIso();
  const watches = await ctx.store.listWatches();
  const due = dueWatches(watches, at);
  const findings = await ctx.store.listFindings({ status: 'active', limit: 200 });
  const stale = staleFindings(findings, { at });

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      at,
      due: due.map((w) => ({ id: w.id, name: w.name, cadence: w.cadence, lastRunAt: w.lastRunAt })),
      staleFindings: stale.slice(0, 20).map((f) => ({ id: f.id, oneLine: f.demand.oneLine, lastVerifiedAt: f.lastVerifiedAt })),
      context: contextStatus(ctx),
    });
  }

  const body = await readBody(req);
  const limit = clampNumber(body.limit, 1, 10, 2);

  const ran = [];
  const reported = [];

  for (const watch of due.slice(0, limit)) {
    // Stop before the platform does, and say what was left rather than being
    // killed mid-watch and returning nothing at all.
    if (ctx.deadline.tooLateFor(12_000)) {
      ran.push({ id: watch.id, name: watch.name, skipped: true, reason: 'not enough time left in this invocation; it stays due for the next one' });
      continue;
    }
    try {
      const outcome = await runWatch(watch, ctx);
      ran.push({
        id: watch.id,
        name: watch.name,
        status: outcome.result.status,
        reported: outcome.reported,
        reason: outcome.reason,
        costUsd: outcome.result.costUsd,
        depth: outcome.result.depth?.level,
        stoppedEarly: outcome.result.stoppedEarly,
      });
      if (outcome.reported) {
        reported.push({
          watch: watch.name,
          findingId: outcome.result.finding.id,
          oneLine: outcome.result.finding.demand.oneLine,
          strength: outcome.result.finding.evidence.strength,
          kind: outcome.change?.kind ?? 'new',
          summary: outcome.change?.summary ?? null,
        });
      }
    } catch (err) {
      // One watch failing is one watch failing. The sweep continues.
      ran.push({ id: watch.id, name: watch.name, status: 'failed', error: err.message });
      await ctx.store.addActivity({ kind: 'watch', level: 'error', message: `${watch.name} failed: ${err.message}`, watchId: watch.id });
    }
  }

  // Re-verification is the slow cycle, and it only runs when there is time and
  // budget left over from the watches. Freshness matters, but not more than
  // finding new things.
  const rechecked = [];
  if (body.reverify !== false) {
    for (const finding of stale.slice(0, 1)) {
      if (ctx.deadline.tooLateFor(15_000)) break;
      try {
        const outcome = await reverifyFinding(finding, ctx);
        rechecked.push({ id: finding.id, changed: Boolean(outcome.change), summary: outcome.change?.summary ?? 'nothing moved' });
      } catch (err) {
        rechecked.push({ id: finding.id, error: err.message });
      }
    }
  }

  json(res, 200, {
    ok: true,
    at,
    dueCount: due.length,
    ran,
    // The only thing a human needs to read: what is new or changed.
    reported,
    rechecked,
    remainingDue: Math.max(0, due.length - ran.filter((r) => !r.skipped).length),
    elapsedMs: ctx.deadline.elapsedMs,
    context: contextStatus(ctx),
  });
});
