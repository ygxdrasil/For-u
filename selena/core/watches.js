/**
 * Watches — Selena's main job. She stands watches; answering questions is the
 * exception, not the point.
 *
 * The rule that makes or breaks this: ONLY SURFACE WHAT IS NEW OR CHANGED. A
 * watch that re-reports the same finding every morning gets muted within a
 * week, and a muted watch may as well not exist. So every watch carries a
 * memory of what it has already told you, keyed by the demand itself rather
 * than by the URL it happened to turn up on — otherwise the same demand looks
 * brand new every time it appears on a different listing.
 *
 * Re-verification runs on a slower cycle, because demand decays. Something
 * true in March may be crowded by June, and a stale finding handed to Jason is
 * worse than none at all.
 */

import { clampNumber, nowIso, randomId, phraseSimilarity } from './util.js';
import { findingSignature } from './store.js';
import { runResearch } from './research.js';
import { dedupKeyFor } from './schema.js';

export const CADENCES = {
  hourly: { ms: 3_600_000, label: 'every hour' },
  daily: { ms: 86_400_000, label: 'once a day' },
  weekly: { ms: 604_800_000, label: 'once a week' },
  manual: { ms: null, label: 'only when asked' },
};

export const WATCH_STATES = ['active', 'paused', 'proposed'];

/** How long a finding may go unchecked before it is treated as stale. */
export const REVERIFY_AFTER_DAYS = 30;

export function createWatch({ name, topic, cadence = 'daily', depth = null, platforms = [], state = 'active', roaming = false, now = nowIso }) {
  const at = now();
  return {
    id: randomId('w'),
    name: String(name ?? topic ?? '').slice(0, 120),
    topic: String(topic ?? '').slice(0, 400),
    platforms: Array.isArray(platforms) ? platforms : [],
    cadence: CADENCES[cadence] ? cadence : 'daily',
    depth: depth ?? null,
    state: WATCH_STATES.includes(state) ? state : 'active',
    roaming: Boolean(roaming),
    createdAt: at,
    lastRunAt: null,
    nextRunAt: at,
    runCount: 0,
    reportedCount: 0,
    lastStatus: null,
    lastError: null,
    totalCostUsd: 0,
  };
}

export function isDue(watch, at = nowIso()) {
  if (watch.state !== 'active') return false;
  const spec = CADENCES[watch.cadence];
  if (!spec?.ms) return false;
  if (!watch.lastRunAt) return true;
  return Date.parse(at) - Date.parse(watch.lastRunAt) >= spec.ms;
}

export function dueWatches(watches, at = nowIso()) {
  return (watches ?? []).filter((w) => isDue(w, at));
}

/**
 * What changed between what we already told you and what we just found.
 *
 * Returns null when nothing worth saying has changed — which is the common
 * case and the whole reason the watch stays useful.
 */
export function describeChange(previous, current) {
  if (!previous) return { kind: 'new', summary: 'first time this has come up', changes: [] };

  // A stored record can be any shape — an older schema version, a half-written
  // row, a field that came back null. Comparing must never throw, because the
  // consequence is a watch that silently stops reporting.
  const list = (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);
  const prevEv = previous?.evidence && typeof previous.evidence === 'object' ? previous.evidence : {};
  const nextEv = current?.evidence && typeof current.evidence === 'object' ? current.evidence : {};

  const changes = [];
  const prevStrength = Number(prevEv.strength) || 0;
  const nextStrength = Number(nextEv.strength) || 0;
  if (nextStrength !== prevStrength) {
    changes.push({
      field: 'strength',
      from: prevStrength,
      to: nextStrength,
      text: `evidence ${nextStrength > prevStrength ? 'strengthened' : 'weakened'} from ${prevStrength} to ${nextStrength}`,
    });
  }

  const prevPaying = new Set(list(prevEv.paying).map((p) => p.url));
  const newPaying = list(nextEv.paying).filter((p) => !prevPaying.has(p.url));
  if (newPaying.length) {
    changes.push({ field: 'paying', text: `${newPaying.length} new priced listing${newPaying.length === 1 ? '' : 's'}`, items: newPaying.map((p) => p.url) });
  }

  const complaintKey = (c) => `${c.url}${String(c.quote ?? '').slice(0, 40)}`;
  const prevComplaints = new Set(list(prevEv.complaints).map(complaintKey));
  const newComplaints = list(nextEv.complaints).filter((c) => !prevComplaints.has(complaintKey(c)));
  if (newComplaints.length) {
    changes.push({ field: 'complaints', text: `${newComplaints.length} new complaint${newComplaints.length === 1 ? '' : 's'}`, items: newComplaints.map((c) => c.aboutWhat) });
  }

  const prevSubject = prevEv.agreement?.subject ?? null;
  const nextSubject = nextEv.agreement?.subject ?? null;
  if (nextSubject && nextSubject !== prevSubject) {
    changes.push({ field: 'agreement', from: prevSubject, to: nextSubject, text: `complaints now agree on "${nextSubject}"` });
  }

  const prevBuild = previous?.buildability?.verdict ?? null;
  const nextBuild = current?.buildability?.verdict ?? null;
  if (nextBuild && nextBuild !== prevBuild) {
    changes.push({ field: 'buildability', from: prevBuild, to: nextBuild, text: `buildability changed to ${nextBuild}` });
  }

  // Price movement on a listing we already knew about is a real signal: it
  // says the market is repricing, which is the kind of change worth a mention.
  const prevPrices = new Map(list(prevEv.paying).map((p) => [p.url, p.price]));
  const moved = list(nextEv.paying).filter((p) => prevPrices.has(p.url) && prevPrices.get(p.url) !== p.price);
  if (moved.length) {
    changes.push({
      field: 'price',
      text: `${moved.length} price${moved.length === 1 ? '' : 's'} moved`,
      items: moved.map((p) => `${p.what}: ${prevPrices.get(p.url)} → ${p.price} ${p.currency ?? ''}`),
    });
  }

  if (!changes.length) return null;
  return { kind: 'changed', summary: changes.map((c) => c.text).join('; '), changes };
}

/**
 * Run one watch and decide whether it is worth saying anything.
 *
 * @returns {{watch, result, reported:boolean, change:object|null, reason:string}}
 */
export async function runWatch(watch, deps) {
  const now = deps.now ?? nowIso;
  const store = deps.store;

  // What we already know about this watch, so the run looks for change rather
  // than starting cold every time.
  const existing = await store.listFindings({ watchId: watch.id, status: 'active', limit: 50 });

  const result = await runResearch(
    {
      topic: watch.topic,
      kind: 'watch',
      watchId: watch.id,
      requestedDepth: watch.depth ?? null,
      priorFinding: existing[0] ?? null,
    },
    deps,
  );

  const updated = {
    ...watch,
    lastRunAt: now(),
    runCount: clampNumber(watch.runCount, 0, 1e9, 0) + 1,
    lastStatus: result.status,
    lastError: result.status === 'failed' ? result.notes.join('; ') : null,
    totalCostUsd: clampNumber(watch.totalCostUsd, 0, 1e9, 0) + clampNumber(result.costUsd, 0, 1e6, 0),
  };

  if (!result.finding) {
    await store.putWatch(updated);
    return { watch: updated, result, reported: false, change: null, reason: `nothing to report (${result.status})` };
  }

  const finding = result.finding;
  const dedupKey = finding.dedupKey ?? dedupKeyFor(finding);

  // Does this match something this watch already reported, even loosely? An
  // exact key match is the common case; the similarity pass catches rewordings
  // of the same demand, which is what stops the morning repeat.
  let previous = existing.find((f) => f.dedupKey === dedupKey) ?? null;
  if (!previous) {
    previous = existing.find((f) => phraseSimilarity(f.demand?.oneLine, finding.demand.oneLine) >= 0.7) ?? null;
    if (previous) finding.id = previous.id; // same demand, same record
  }

  const seen = await store.getSeen(watch.id, dedupKey);
  const signature = findingSignature(finding);
  const change = describeChange(previous, finding);

  const isNew = !seen && !previous;
  const isChanged = Boolean(change && change.kind === 'changed');
  const reported = isNew || isChanged;

  if (previous) {
    finding.foundAt = previous.foundAt;
    // Never destroyed: the previous version is already in the version history,
    // and the current row is updated in place with a fresh verification time.
  }

  await store.putFinding(finding);
  await store.markSeen(watch.id, dedupKey, signature);

  if (reported) {
    updated.reportedCount = clampNumber(watch.reportedCount, 0, 1e9, 0) + 1;
    await store.addActivity({
      kind: 'report',
      level: 'report',
      message: `${watch.name}: ${isNew ? 'new' : 'changed'} — ${finding.demand.oneLine}`,
      watchId: watch.id,
      findingId: finding.id,
      strength: finding.evidence.strength,
    });
  } else {
    await store.addActivity({
      kind: 'quiet',
      level: 'debug',
      message: `${watch.name}: nothing new (${finding.demand.oneLine.slice(0, 60)})`,
      watchId: watch.id,
      findingId: finding.id,
    });
  }

  await store.putWatch(updated);

  return {
    watch: updated,
    result,
    reported,
    change: change ?? (isNew ? { kind: 'new', summary: 'first time this has come up', changes: [] } : null),
    reason: reported
      ? isNew
        ? 'new demand this watch has not reported before'
        : `changed: ${change.summary}`
      : 'already reported and nothing has moved — deliberately staying quiet',
  };
}

/**
 * Findings old enough to need checking again. Demand decays; that is what
 * lastVerifiedAt is for.
 */
export function staleFindings(findings, { at = nowIso(), afterDays = REVERIFY_AFTER_DAYS } = {}) {
  const cutoff = Date.parse(at) - afterDays * 86_400_000;
  return (findings ?? [])
    .filter((f) => f.status === 'active')
    .filter((f) => {
      const t = Date.parse(f.lastVerifiedAt ?? f.foundAt ?? '');
      return Number.isFinite(t) && t < cutoff;
    })
    .sort((a, b) => Date.parse(a.lastVerifiedAt ?? 0) - Date.parse(b.lastVerifiedAt ?? 0));
}

/** Re-check one finding cheaply, and record that it was checked either way. */
export async function reverifyFinding(finding, deps) {
  const now = deps.now ?? nowIso;
  const result = await runResearch(
    { topic: finding.demand.oneLine, kind: 'reverify', watchId: finding.watchId, priorFinding: finding },
    deps,
  );

  if (!result.finding) {
    // Could not confirm is not the same as gone. The record keeps its old
    // evidence and gains an honest note about the failed check.
    const touched = {
      ...finding,
      lastVerifiedAt: now(),
      reverification: { at: now(), status: result.status, notes: result.notes },
    };
    await deps.store.putFinding(touched);
    return { finding: touched, change: null, result };
  }

  const change = describeChange(finding, result.finding);
  const merged = { ...result.finding, id: finding.id, foundAt: finding.foundAt, lastVerifiedAt: now() };
  await deps.store.putFinding(merged);

  if (change) {
    await deps.store.addActivity({
      kind: 'reverify',
      level: 'report',
      message: `re-checked "${finding.demand.oneLine.slice(0, 60)}": ${change.summary}`,
      findingId: merged.id,
    });
  }

  return { finding: merged, change, result };
}
