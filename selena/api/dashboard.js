/**
 * GET /api/dashboard — everything the HUD shows, in one call.
 *
 * One request rather than six, because the HUD polls: six polling endpoints is
 * six times the function invocations for the same picture, and on a free plan
 * that is the difference between free and not.
 */

import { json, methodGuard, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { summarizeFinding } from '../core/schema.js';
import { isDue, CADENCES, staleFindings, REVERIFY_AFTER_DAYS } from '../core/watches.js';
import { sourceStatus } from '../core/sources.js';
import { clampNumber, nowIso, sumFinite } from '../core/util.js';
import { normalizeAutonomy, describeAutonomy, handoffsInWindow, unattendedHeadroom, AUTONOMY_KEY } from '../core/autonomy.js';
import BUILD from '../core/build.js';

/** Daily spend for the last 14 days, for the sparkline. Never NaN. */
function spendSeries(rows, days = 14, at = nowIso()) {
  const out = [];
  const end = Date.parse(at);
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(end - i * 86_400_000).toISOString().slice(0, 10);
    out.push({ day, usd: sumFinite(rows.filter((r) => String(r.at).startsWith(day)), 'usd') });
  }
  return out;
}

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const ctx = await createContext({ budgetMs: 15_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  const at = nowIso();

  // One dead panel must not blank the whole HUD, so every section is settled
  // independently and a failure is reported in place rather than thrown.
  const [watches, findings, counts, activity, runs, spend, meterSummary, byWatch, autonomyRaw] = await Promise.all([
    ctx.store.listWatches().catch(() => []),
    ctx.store.listFindings({ status: 'active', limit: 100 }).catch(() => []),
    ctx.store.countFindings().catch(() => ({ total: 0, active: 0, byStrength: {} })),
    ctx.store.recentActivity(50).catch(() => []),
    ctx.store.recentRuns(25).catch(() => []),
    ctx.store.recentSpend(400).catch(() => []),
    ctx.meter.summary().catch(() => null),
    ctx.store.spendByWatch().catch(() => []),
    ctx.store.getKv(AUTONOMY_KEY).catch(() => null),
  ]);

  const stale = staleFindings(findings, { at });

  // The sidebar renders this on every page, so it rides the one poll the HUD
  // already makes rather than adding a second endpoint to ask "is she on?".
  const autonomy = normalizeAutonomy(autonomyRaw);
  const capUsd = meterSummary?.capUsd ?? ctx.capUsd;
  const spentUsd = meterSummary?.monthToDateUsd ?? 0;

  json(res, 200, {
    ok: true,
    at,
    build: BUILD,
    context: contextStatus(ctx),
    openApi: gate.open ? gate.warning : null,

    autonomy: {
      armed: autonomy.armed,
      says: describeAutonomy(autonomy, { capUsd, spentUsd }),
      backedOff: autonomy.backedOff,
      disarmedBy: autonomy.disarmedBy,
      disarmReason: autonomy.disarmReason,
      lastRunAt: autonomy.lastRunAt,
      lastRunSummary: autonomy.lastRunSummary,
      runCount: autonomy.runCount,
      handoffFloor: autonomy.handoffFloor,
      handoffsPerWeek: autonomy.handoffsPerWeek,
      handoffsThisWeek: handoffsInWindow(autonomy, at).length,
      allowanceLeftUsd: unattendedHeadroom(autonomy, { capUsd, spentUsd }),
      reserveUsd: autonomy.reserveUsd,
      selfWatches: watches.filter((w) => w.standedBySelena).length,
      maxSelfWatches: autonomy.maxSelfWatches,
    },

    headline: {
      activeFindings: counts.active ?? 0,
      // The number that matters: paying and complaining, or better.
      realOpenings: findings.filter((f) => (f.evidence?.strength ?? 0) >= 4).length,
      hypotheses: findings.filter((f) => f.evidence?.hypothesis).length,
      buildable: findings.filter((f) => f.buildability?.verdict === 'jason-can-build').length,
      notBuildable: findings.filter((f) => f.buildability?.verdict === 'jason-cannot-build').length,
      handedToJason: counts.handedToJason ?? 0,
      staleCount: stale.length,
      watchesActive: watches.filter((w) => w.state === 'active').length,
      watchesDue: watches.filter((w) => isDue(w, at)).length,
    },

    money: {
      ...(meterSummary ?? {}),
      series: spendSeries(spend, 14, at),
      byWatch: byWatch.slice(0, 12).map((row) => {
        const watch = watches.find((w) => `watch:${w.id}` === row.label);
        return {
          label: row.label,
          watchId: watch?.id ?? null,
          name: watch?.name ?? row.label,
          usd: row.usd,
          runs: watch?.runCount ?? null,
          reports: watch?.reportedCount ?? null,
          // Cost per thing actually reported: the number that says whether a
          // watch earns its keep.
          usdPerReport: watch?.reportedCount ? row.usd / watch.reportedCount : null,
        };
      }),
    },

    strengthDistribution: [1, 2, 3, 4, 5].map((level) => ({
      level,
      count: findings.filter((f) => f.evidence?.strength === level).length,
    })),

    watches: watches.map((w) => ({
      id: w.id,
      name: w.name,
      topic: w.topic,
      state: w.state,
      cadence: w.cadence,
      cadenceLabel: CADENCES[w.cadence]?.label ?? w.cadence,
      due: isDue(w, at),
      lastRunAt: w.lastRunAt,
      runCount: clampNumber(w.runCount, 0, 1e9, 0),
      reportedCount: clampNumber(w.reportedCount, 0, 1e9, 0),
      lastStatus: w.lastStatus,
      costUsd: clampNumber(w.totalCostUsd, 0, 1e9, 0),
      roaming: Boolean(w.roaming),
    })),

    topFindings: findings.slice(0, 12).map(summarizeFinding),
    stale: stale.slice(0, 10).map(summarizeFinding),
    reverifyAfterDays: REVERIFY_AFTER_DAYS,

    activity,
    runs: runs.map((r) => ({
      id: r.id,
      at: r.at,
      topic: r.topic,
      status: r.status,
      depth: r.depth,
      depthReasoning: r.depthReasoning,
      costUsd: r.costUsd,
      sourcesRead: r.sourcesRead,
      searches: r.searches,
      stoppedEarly: r.stoppedEarly,
      elapsedMs: r.elapsedMs,
    })),

    sources: sourceStatus(),
  });
});
