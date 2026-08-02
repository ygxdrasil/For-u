/**
 * The unattended pass: what she actually does when nobody is there.
 *
 * One function, four phases, in this order and for these reasons:
 *
 *   1. run the watches you already have   — known ground first; the topics you
 *                                            or she already judged worth it
 *   2. roam for new ground                — only with time and money left over
 *   3. stand watches on what she found    — her own, capped, marked as hers
 *   4. hand the very strongest to Jason   — level 5 only, weekly ceiling
 *
 * Roaming comes after watching on purpose. Finding new things is the exciting
 * part and it is the part that should be starved first: a watch you approved
 * has already earned its money, and a new subject has not.
 *
 * Every phase checks the clock and the reserve before it starts. A serverless
 * function killed at its timeout returns nothing at all — not a partial result,
 * nothing — so the pass stops itself early and reports what it did rather than
 * being stopped and reporting nothing.
 */

import { runWatch, dueWatches, createWatch } from './watches.js';
import { explore, saveProposals } from './explore.js';
import { handToJason } from './jason.js';
import { clampNumber, nowIso } from './util.js';
import { readAutonomy, recordRun, recordHandoff, mayHandOff, shouldRoam, unattendedHeadroom, updateAutonomy } from './autonomy.js';

/** Below this, roaming is not worth starting: it cannot finish and be useful. */
const ROAM_MS = 20_000;
const WATCH_MS = 12_000;
const HANDOFF_MS = 8_000;

/**
 * Run one unattended pass.
 *
 * @returns a plain account of what happened, suitable for printing into a
 *   GitHub step summary and for the HUD to render without interpretation.
 */
export async function runPass(ctx, { limit = 2, at = nowIso() } = {}) {
  const autonomy = await readAutonomy(ctx.store);
  const notes = [];
  const ran = [];
  const reported = [];
  const handed = [];
  let proposals = [];
  let roamed = null;

  if (!autonomy.armed) {
    return { ok: true, armed: false, ran, reported, handed, proposals, notes: ['she is not armed, so nothing ran on its own'], autonomy };
  }

  const summary = await ctx.meter.summary().catch(() => ({ monthToDateUsd: 0, capUsd: ctx.capUsd }));
  const headroom = unattendedHeadroom(autonomy, { capUsd: summary.capUsd ?? ctx.capUsd, spentUsd: summary.monthToDateUsd ?? 0 });

  if (headroom <= 0) {
    // Not an error and not a reason to disarm: the money comes back on the
    // first of the month, and disarming would mean silently never restarting.
    const note = `her own allowance is spent ($${Number(summary.monthToDateUsd ?? 0).toFixed(2)} of $${Number(summary.capUsd ?? 0).toFixed(2)}, with $${autonomy.reserveUsd.toFixed(2)} held back for you). Nothing ran. It resumes when the month rolls over, or if you raise the cap.`;
    await ctx.store.addActivity({ kind: 'autonomy', level: 'info', message: `paused: ${note}` });
    return { ok: true, armed: true, outOfAllowance: true, ran, reported, handed, proposals, notes: [note], autonomy };
  }

  // ---- 1. the watches you already have -----------------------------------
  const watches = await ctx.store.listWatches();
  const due = dueWatches(watches, at);

  for (const watch of due.slice(0, clampNumber(limit, 1, 10, 2))) {
    if (ctx.deadline.tooLateFor(WATCH_MS)) {
      notes.push('ran out of time before every due watch ran; the rest stay due');
      break;
    }
    try {
      // The provenance brake is on for every unattended watch run.
      const outcome = await runWatch(watch, ctx, { haltOnUnsourced: true });
      ran.push({
        name: watch.name,
        status: outcome.result.status,
        reported: outcome.reported,
        reason: outcome.reason,
        costUsd: outcome.result.costUsd,
      });
      if (outcome.reported) {
        reported.push({
          watch: watch.name,
          findingId: outcome.result.finding.id,
          oneLine: outcome.result.finding.demand.oneLine,
          strength: outcome.result.finding.evidence.strength,
          kind: outcome.change?.kind ?? 'new',
        });
      }
    } catch (err) {
      ran.push({ name: watch.name, status: 'failed', error: err.message });
      await ctx.store.addActivity({ kind: 'watch', level: 'error', message: `${watch.name} failed: ${err.message}`, watchId: watch.id });
    }
  }

  // ---- 2. roam -----------------------------------------------------------
  const roam = shouldRoam(autonomy);
  if (!roam.roam) {
    if (roam.reason) notes.push(roam.reason);
  } else if (ctx.deadline.tooLateFor(ROAM_MS)) {
    notes.push('no time left to go looking this pass; the watches came first');
  } else {
    try {
      roamed = await explore({}, ctx);
      notes.push(...roamed.notes);
      if (roamed.proposals.length) proposals = await saveProposals(ctx.store, roamed.proposals);
    } catch (err) {
      notes.push(`roaming failed (${err.message})`);
    }
  }

  // ---- 3. stand her own watches -----------------------------------------
  // She stands watches herself now, which is the part that makes this
  // autonomous rather than a suggestion box. Two limits: only proposals she
  // was reasonably sure of, and never more than her ceiling of live watches.
  const stood = [];
  if (proposals.length) {
    const mine = watches.filter((w) => w.standedBySelena && w.state === 'active').length;
    let room = Math.max(0, autonomy.maxSelfWatches - mine);
    if (room === 0) {
      notes.push(`she already has ${mine} watches of her own, which is her ceiling, so ${proposals.length} proposal(s) are waiting for you instead`);
    }
    for (const proposal of proposals) {
      if (room <= 0) break;
      if (proposal.confidence === 'low') {
        notes.push(`"${proposal.topic}" is a low-confidence guess, so it waits for you rather than standing itself`);
        continue;
      }
      const watch = createWatch({ name: proposal.topic, topic: proposal.topic, cadence: 'weekly', roaming: true });
      watch.standedBySelena = true;
      watch.why = proposal.why;
      watch.proposalId = proposal.id;
      await ctx.store.putWatch(watch);
      stood.push({ name: watch.name, why: proposal.why, confidence: proposal.confidence });
      room -= 1;
      await ctx.store.addActivity({
        kind: 'autonomy',
        level: 'report',
        // Why she looked there, in her words, because that is the thing you
        // asked to be able to audit instead of fencing her in.
        message: `stood her own watch on "${watch.topic}" — ${proposal.why}`,
        watchId: watch.id,
      });
    }
  }

  // ---- 4. hand the strongest to Jason ------------------------------------
  const endpoint = ctx.env?.JASON_ENDPOINT ?? null;
  const candidates = (await ctx.store.listFindings({ status: 'active', limit: 200 }))
    .filter((f) => !f.handedToJasonAt)
    .sort((a, b) => (b.evidence?.strength ?? 0) - (a.evidence?.strength ?? 0));

  for (const finding of candidates) {
    if (ctx.deadline.tooLateFor(HANDOFF_MS)) break;
    // Re-read each time: the weekly counter moves as this loop runs, and a
    // stale copy would let the ceiling be passed inside a single pass.
    const current = await readAutonomy(ctx.store);
    const verdict = mayHandOff(current, finding, { at });
    if (!verdict.ok) {
      // Only worth a note when it was close. "Level 2" is not news.
      if ((finding.evidence?.strength ?? 0) >= current.handoffFloor) notes.push(`not handing "${finding.demand.oneLine}" over: ${verdict.reason}`);
      continue;
    }
    try {
      const outcome = await handToJason(finding, {
        store: ctx.store,
        note: 'Handed over automatically: level 5, and she was armed.',
        endpoint,
        token: ctx.env?.JASON_TOKEN ?? null,
        fetchImpl: ctx.fetchImpl,
      });
      await recordHandoff(ctx.store, { findingId: finding.id, at });
      handed.push({
        findingId: finding.id,
        oneLine: finding.demand.oneLine,
        strength: finding.evidence.strength,
        delivered: outcome.delivery.ok === true,
        detail: outcome.delivery.detail,
      });
    } catch (err) {
      notes.push(`handing "${finding.demand.oneLine}" to Jason failed: ${err.message}`);
    }
  }

  // ---- close out ---------------------------------------------------------
  // A pass "failed" only when it did nothing AND something threw. Watches that
  // legitimately found nothing are the system working, and must never trip the
  // error brake — that is the difference between quiet and broken.
  const failed = ran.length > 0 && ran.every((r) => r.status === 'failed');
  const after = await recordRun(ctx.store, {
    reported: reported.length + stood.length + handed.length,
    failed,
    note: `${ran.length} watch(es), ${reported.length} new, ${stood.length} stood, ${handed.length} handed over`,
    at,
  });

  return { ok: true, armed: true, ran, reported, stood, handed, proposals, roamed, notes, autonomy: after };
}

/** Stop everything, from anywhere: disarm, and pause every running watch. */
export async function stopEverything(store, { at = nowIso() } = {}) {
  const watches = await store.listWatches();
  const active = watches.filter((w) => w.state === 'active');
  for (const w of active) await store.putWatch({ ...w, state: 'paused' });
  const autonomy = await updateAutonomy(store, { armed: false, disarmedAt: at, disarmedBy: 'you', disarmReason: 'you pressed stop everything' });
  await store.addActivity({
    kind: 'autonomy',
    level: 'report',
    message: `stop everything: disarmed and paused ${active.length} watch(es). Nothing runs on a schedule until you start it again.`,
  });
  return { paused: active.map((w) => w.name), autonomy };
}
