/**
 * Autonomy: her working while nobody is watching.
 *
 * Armed, she roams with no topic from you, stands her own watches, researches
 * them, files findings, and hands the very strongest to Jason — the whole
 * chain, unattended. That last step overrides the deliberate-handoff rule the
 * project started with. It was overridden on purpose and on the record, so it
 * is written down here rather than left as a surprise in the code.
 *
 * The trade for that reach is that everything below is a brake:
 *
 *   money      a reserve she cannot touch, so she can never spend the month
 *              before you have asked her anything
 *   evidence   she may only hand over level 5 — many paying, many complaining,
 *              complaints agreeing — never a hypothesis
 *   volume     a weekly ceiling on unattended handoffs
 *   silence    consecutive runs that find nothing slow her down by themselves
 *   errors     consecutive failures stop her entirely
 *   provenance a run that had claims deleted for citing something it never read
 *              files nothing at all
 *
 * Every one of those is a number in state, checked in code, and reported in
 * words. None of them is a prompt asking her nicely.
 *
 * The state is one KV record, and every write goes through a lock keyed by the
 * string 'autonomy'. Two sweeps overlapping would otherwise read the same
 * counters, both increment, and both write — losing one increment silently,
 * which for an error counter means the brake never trips.
 */

import { nowIso, clampNumber } from './util.js';
import { withLock } from './queue.js';

export const AUTONOMY_KEY = 'autonomy';

/** The lock is keyed by NAME, not by object identity. */
const LOCK = 'autonomy';

const WEEK_MS = 7 * 86_400_000;

/**
 * The settings, as chosen. Each is a number rather than a judgement call, so
 * "she went too far" is always answerable by pointing at one.
 */
export const DEFAULTS = {
  /** Off until you arm it. A deployment that starts spending on its own is a trap. */
  armed: false,
  /**
   * Held back from the monthly cap for you. With the default $10 cap she has
   * $8 and you always have $2 — enough that typing a command never returns
   * "there is no money left" because she used it all at 4am.
   */
  reserveUsd: 2,
  /** Only the top of the ladder may be handed over unattended. */
  handoffFloor: 5,
  /** However good a week is, Jason gets at most this many unattended. */
  handoffsPerWeek: 3,
  /** Consecutive quiet runs before she slows herself down. */
  quietRunsBeforeBackoff: 3,
  /** Consecutive failed runs before she stops and says so. */
  errorRunsBeforeStop: 3,
  /** How many watches she is allowed to be running for herself at once. */
  maxSelfWatches: 8,
};

const EMPTY = {
  ...DEFAULTS,
  armedAt: null,
  disarmedAt: null,
  /** 'you' or 'herself' — the difference matters when you come back to it. */
  disarmedBy: null,
  disarmReason: null,
  quietRuns: 0,
  errorRuns: 0,
  backedOff: false,
  lastRunAt: null,
  lastRunSummary: null,
  runCount: 0,
  handoffs: [],
};

/** Merge stored state over the defaults, clamping anything that came back odd. */
export function normalizeAutonomy(raw) {
  const s = { ...EMPTY, ...(raw && typeof raw === 'object' ? raw : {}) };
  return {
    ...s,
    // Strictly `true`, not merely truthy. Every other boolean in here can take
    // the ordinary reading, but this one decides whether she spends money
    // unattended, and `"no"` is a truthy string. A record that got mangled in
    // storage, or a caller that sent the string "false", must fall to off.
    armed: s.armed === true,
    backedOff: s.backedOff === true,
    reserveUsd: clampNumber(s.reserveUsd, 0, 1000, DEFAULTS.reserveUsd),
    handoffFloor: clampNumber(s.handoffFloor, 1, 5, DEFAULTS.handoffFloor),
    handoffsPerWeek: clampNumber(s.handoffsPerWeek, 0, 50, DEFAULTS.handoffsPerWeek),
    quietRunsBeforeBackoff: clampNumber(s.quietRunsBeforeBackoff, 1, 50, DEFAULTS.quietRunsBeforeBackoff),
    errorRunsBeforeStop: clampNumber(s.errorRunsBeforeStop, 1, 50, DEFAULTS.errorRunsBeforeStop),
    maxSelfWatches: clampNumber(s.maxSelfWatches, 1, 100, DEFAULTS.maxSelfWatches),
    quietRuns: clampNumber(s.quietRuns, 0, 1e6, 0),
    errorRuns: clampNumber(s.errorRuns, 0, 1e6, 0),
    runCount: clampNumber(s.runCount, 0, 1e9, 0),
    handoffs: Array.isArray(s.handoffs) ? s.handoffs.slice(-200) : [],
  };
}

export async function readAutonomy(store) {
  return normalizeAutonomy(await store.getKv(AUTONOMY_KEY));
}

/**
 * Read, apply, write — inside the lock, so a concurrent sweep cannot lose an
 * increment. `patch` may be an object or a function of the current state.
 */
export async function updateAutonomy(store, patch) {
  return withLock(LOCK, async () => {
    const current = normalizeAutonomy(await store.getKv(AUTONOMY_KEY));
    const next = normalizeAutonomy({ ...current, ...(typeof patch === 'function' ? patch(current) : patch) });
    await store.setKv(AUTONOMY_KEY, next);
    return next;
  });
}

export async function arm(store, { at = nowIso(), settings = {} } = {}) {
  const next = await updateAutonomy(store, {
    ...settings,
    armed: true,
    armedAt: at,
    disarmedAt: null,
    disarmedBy: null,
    disarmReason: null,
    // Arming clears the brakes: you have looked at whatever stopped her.
    quietRuns: 0,
    errorRuns: 0,
    backedOff: false,
  });
  await store.addActivity({ kind: 'autonomy', level: 'report', message: 'armed — she will now roam, watch, research and hand over on her own' });
  return next;
}

export async function disarm(store, { at = nowIso(), by = 'you', reason = null } = {}) {
  const next = await updateAutonomy(store, { armed: false, disarmedAt: at, disarmedBy: by, disarmReason: reason });
  await store.addActivity({
    kind: 'autonomy',
    level: by === 'herself' ? 'error' : 'report',
    message: by === 'herself' ? `stopped herself: ${reason}` : 'disarmed — she will not start anything on her own',
  });
  return next;
}

/**
 * What she is allowed to spend, as opposed to what the account is allowed to
 * spend. Always at least zero: a reserve larger than the cap means she has
 * nothing, not that she has a negative allowance.
 */
export function unattendedCeiling(autonomy, capUsd) {
  return Math.max(0, clampNumber(capUsd, 0, 1e6, 0) - autonomy.reserveUsd);
}

export function unattendedHeadroom(autonomy, { capUsd, spentUsd }) {
  return Math.max(0, unattendedCeiling(autonomy, capUsd) - clampNumber(spentUsd, 0, 1e6, 0));
}

export function handoffsInWindow(autonomy, at = nowIso()) {
  const since = Date.parse(at) - WEEK_MS;
  return autonomy.handoffs.filter((h) => Date.parse(h.at) >= since);
}

/**
 * May this finding go to Jason unattended?
 *
 * Every no carries the reason, because "she didn't send it" and "she couldn't
 * send it" are different problems and only one of them is yours to fix.
 */
export function mayHandOff(autonomy, finding, { at = nowIso() } = {}) {
  if (!autonomy.armed) return { ok: false, reason: 'she is not armed' };

  const strength = clampNumber(finding?.evidence?.strength, 0, 5, 0);
  if (strength < autonomy.handoffFloor) {
    return {
      ok: false,
      reason: `level ${strength}, and unattended handoff needs level ${autonomy.handoffFloor}`,
    };
  }
  if (finding?.evidence?.hypothesis) return { ok: false, reason: 'it is still a hypothesis' };
  if (finding?.handedToJasonAt) return { ok: false, reason: 'already handed over' };
  if (finding?.status && finding.status !== 'active') return { ok: false, reason: `it is ${finding.status}` };
  // A POSITIVE verdict is required, not merely the absence of a negative one.
  // A finding that was never classified is one nobody has checked he can build,
  // and unattended is exactly when there is nobody to notice. Attended you can
  // look at it and press send anyway; here she cannot.
  if (finding?.buildability?.verdict === 'jason-cannot-build') {
    return { ok: false, reason: `Jason cannot build it: ${finding.buildability.reasoning ?? 'no reason recorded'}` };
  }
  if (finding?.buildability?.verdict !== 'jason-can-build') {
    // This also blocks 'partly' and 'unclear', deliberately. Attended you can
    // read the classification and press send anyway; unattended there is
    // nobody to read it, and "he can build some of it" is a judgement call,
    // not a verdict. Any confidence of 'jason-can-build' is accepted, because
    // level 5 is already doing the heavy lifting on whether it is real.
    const verdict = finding?.buildability?.verdict ?? 'never classified';
    return { ok: false, reason: `buildability is "${verdict}", and unattended she only sends things classified as ones Jason can build` };
  }

  const used = handoffsInWindow(autonomy, at).length;
  if (used >= autonomy.handoffsPerWeek) {
    return { ok: false, reason: `${used} already sent this week, and the ceiling is ${autonomy.handoffsPerWeek}` };
  }

  return { ok: true, reason: `level ${strength}, ${used + 1} of ${autonomy.handoffsPerWeek} this week` };
}

export async function recordHandoff(store, { findingId, at = nowIso() }) {
  return updateAutonomy(store, (current) => ({
    // Trimmed to the last 200 so the record cannot grow without bound; the
    // window only ever looks back a week.
    handoffs: [...current.handoffs, { findingId, at }].slice(-200),
  }));
}

/**
 * Close out a pass. This is where the silence and error brakes actually move.
 *
 * `outcome` is what the pass did, not what it hoped to do:
 *   reported  did anything new or changed come out of it
 *   failed    did the pass itself fail (not: did one watch fail)
 */
export async function recordRun(store, { reported = 0, failed = false, note = null, at = nowIso() } = {}) {
  const next = await updateAutonomy(store, (current) => {
    const quietRuns = reported > 0 ? 0 : current.quietRuns + 1;
    const errorRuns = failed ? current.errorRuns + 1 : 0;
    return {
      quietRuns,
      errorRuns,
      // Backing off is sticky until something is actually found: a single
      // lucky run should not put her straight back to full speed.
      backedOff: reported > 0 ? false : quietRuns >= current.quietRunsBeforeBackoff,
      lastRunAt: at,
      lastRunSummary: note,
      runCount: current.runCount + 1,
    };
  });

  if (next.errorRuns >= next.errorRunsBeforeStop && next.armed) {
    return disarm(store, {
      at,
      by: 'herself',
      reason: `${next.errorRuns} runs in a row failed. Something is broken rather than quiet, and retrying on a schedule would spend the month finding that out.`,
    });
  }

  if (next.backedOff && next.quietRuns === next.quietRunsBeforeBackoff) {
    await store.addActivity({
      kind: 'autonomy',
      level: 'info',
      message: `${next.quietRuns} runs found nothing new, so she is roaming less often until something does. Still watching; just not re-reading the same posts every twelve hours.`,
    });
  }

  return next;
}

/**
 * Should this pass roam at all?
 *
 * Backed off means every other pass, keyed off the run count rather than a
 * timer — a timer would need a clock she does not control, and the run count
 * is already durable.
 */
export function shouldRoam(autonomy) {
  if (!autonomy.armed) return { roam: false, reason: 'not armed' };
  if (!autonomy.backedOff) return { roam: true, reason: null };
  const skip = autonomy.runCount % 2 === 1;
  return skip
    ? { roam: false, reason: `backed off after ${autonomy.quietRuns} quiet runs, so this pass only runs the watches` }
    : { roam: true, reason: `backed off, but this is the pass where she looks anyway` };
}

/**
 * A one-line, plain-words account of where she stands. The HUD renders this
 * verbatim; there is no second copy of the wording in the frontend.
 */
export function describeAutonomy(autonomy, { capUsd = 10, spentUsd = 0 } = {}) {
  if (!autonomy.armed) {
    if (autonomy.disarmedBy === 'herself') return `Stopped herself: ${autonomy.disarmReason}`;
    return 'Not armed. She does nothing unless you tell her to.';
  }
  const left = unattendedHeadroom(autonomy, { capUsd, spentUsd });
  const sent = handoffsInWindow(autonomy).length;
  const parts = [
    autonomy.backedOff ? 'Armed, roaming less often after a quiet spell' : 'Armed and roaming',
    `$${left.toFixed(2)} of her own allowance left`,
    `${sent}/${autonomy.handoffsPerWeek} handed to Jason this week`,
  ];
  return `${parts.join(' · ')}.`;
}
