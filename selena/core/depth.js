/**
 * How hard to dig, decided per task and written down.
 *
 * "Is this niche still alive?" and "is this opening real?" are different jobs.
 * Spending the same effort on both is wrong in both directions: the first
 * wastes money, the second gets a shallow answer that reads like a confident
 * one. So depth is chosen, and — this is the part that matters — the reason is
 * recorded on the finding. "Went deep because three independent complaints
 * agreed" is useful. A silent decision is not.
 *
 * Depth is decided twice: once from the task before anything is read, and once
 * after the first pass, when there are actual signals to react to. Escalation
 * is the interesting one, because that is where the agent notices something.
 */

import { clampNumber } from './util.js';

export const LEVELS = {
  glance: {
    rank: 0,
    searches: 1,
    extractions: 1,
    verifyComplaints: false,
    label: 'glance',
    description: 'One look. Is there anything here at all?',
    estUsd: 0.002,
  },
  check: {
    rank: 1,
    searches: 2,
    extractions: 1,
    verifyComplaints: false,
    label: 'check',
    description: 'Confirm the demand exists and somebody is charging for it.',
    estUsd: 0.006,
  },
  dig: {
    rank: 2,
    searches: 4,
    extractions: 2,
    verifyComplaints: true,
    label: 'dig',
    description: 'Establish who has it, what they pay, and what the incumbents get wrong.',
    estUsd: 0.02,
  },
  deep: {
    rank: 3,
    searches: 7,
    extractions: 3,
    verifyComplaints: true,
    label: 'deep',
    description: 'Everything: verbatim quotes, prices, complaint agreement, incumbents, risks, and a verdict that can be argued with.',
    estUsd: 0.05,
  },
};

export const LEVEL_NAMES = Object.keys(LEVELS);

function levelAtRank(rank) {
  const clamped = clampNumber(rank, 0, LEVEL_NAMES.length - 1, 0);
  return LEVEL_NAMES.find((name) => LEVELS[name].rank === clamped) ?? 'check';
}

/**
 * The opening decision, before anything has been read.
 *
 * @param {object} task
 * @param {'glance'|'check'|'dig'|'deep'|null} task.requestedDepth  an explicit instruction wins
 * @param {'watch'|'question'|'reverify'} task.kind
 * @param {object|null} task.priorFinding  what we already know, if anything
 * @param {number} headroomUsd  what is left in the month
 */
export function decideDepth({ task = {}, headroomUsd = Infinity, ageDays = null } = {}) {
  const reasons = [];
  let level;

  if (task.requestedDepth && LEVELS[task.requestedDepth]) {
    level = task.requestedDepth;
    reasons.push(`asked for a ${level}`);
  } else if (task.kind === 'reverify') {
    // Re-verification is a freshness question, not a research question. It only
    // becomes research if something has moved.
    level = 'glance';
    reasons.push('re-verification only needs to know whether anything moved');
    if (ageDays !== null && ageDays > 90) {
      level = 'check';
      reasons.push(`the finding is ${Math.round(ageDays)} days old, which is long enough for a niche to have been crowded`);
    }
  } else if (task.kind === 'question') {
    level = 'dig';
    reasons.push('a direct question deserves an answer that stands up without a second round');
  } else if (task.priorFinding) {
    level = 'check';
    reasons.push('we already have a finding here, so this run is looking for change rather than starting cold');
  } else {
    level = 'check';
    reasons.push('new ground, so start with a cheap confirmation before spending on depth');
  }

  // The budget is a ceiling on ambition, not a suggestion. Stepping down is
  // reported rather than done quietly.
  let capped = false;
  while (LEVELS[level].estUsd > headroomUsd && LEVELS[level].rank > 0) {
    level = levelAtRank(LEVELS[level].rank - 1);
    capped = true;
  }
  if (capped) reasons.push(`stepped down to ${level} because only $${headroomUsd.toFixed(4)} is left this month`);

  return {
    level,
    ...LEVELS[level],
    reasoning: reasons.join('; '),
    capped,
  };
}

/**
 * After the first pass. This is where Selena is allowed to notice something
 * and decide it is worth more money.
 *
 * @param {object} signals
 * @param {number} signals.payingCount
 * @param {number} signals.complaintCount
 * @param {number} signals.agreementCount   complaints sharing one subject
 * @param {number} signals.agreementSources distinct sources in that agreement
 */
export function reconsiderDepth({ current, signals = {}, headroomUsd = Infinity }) {
  const paying = clampNumber(signals.payingCount, 0, 1e6, 0);
  const complaints = clampNumber(signals.complaintCount, 0, 1e6, 0);
  const agreeing = clampNumber(signals.agreementCount, 0, 1e6, 0);
  const agreeingSources = clampNumber(signals.agreementSources, 0, 1e6, 0);

  const reasons = [];
  let target = current;

  if (agreeing >= 3 && agreeingSources >= 2) {
    target = 'deep';
    reasons.push(`${agreeing} complaints from ${agreeingSources} independent sources agree on the same thing — that is the whole shape we hunt for, so it is worth the money`);
  } else if (paying >= 2 && complaints >= 1) {
    target = LEVELS[current].rank >= LEVELS.dig.rank ? current : 'dig';
    reasons.push('money is moving and at least one buyer is unhappy, which is the point at which the details start to matter');
  } else if (paying === 0 && complaints === 0) {
    target = LEVELS[current].rank <= LEVELS.glance.rank ? current : 'glance';
    reasons.push('nothing found is being paid for and nobody is complaining, so spending more here would be buying a longer way to say "no"');
  } else {
    reasons.push('signals are ordinary, so the opening judgement stands');
  }

  let capped = false;
  while (LEVELS[target].estUsd > headroomUsd && LEVELS[target].rank > 0) {
    target = levelAtRank(LEVELS[target].rank - 1);
    capped = true;
  }
  if (capped) reasons.push(`held at ${target} by the remaining budget`);

  const changed = target !== current;
  return {
    level: target,
    ...LEVELS[target],
    changed,
    direction: !changed ? 'held' : LEVELS[target].rank > LEVELS[current].rank ? 'escalated' : 'stepped down',
    reasoning: reasons.join('; '),
    capped,
  };
}
