/**
 * The finding schema, and the validator that stands between a model's output
 * and anything Jason will ever read.
 *
 * This is deliberately hand-written rather than a JSON-schema library: the
 * rules that matter here are not "is this a string", they are "does this
 * number have a URL behind it", and those want real code and real error
 * messages. A finding that fails validation is never stored with a warning —
 * it is rejected or downgraded, because a warning on a record nobody re-reads
 * is the same as no check at all.
 */

import { clampNumber, canonicalUrl, stableId, normalizePhrase } from './util.js';

export const SCHEMA_VERSION = 3;

/** Every platform Selena is allowed to attribute evidence to. */
export const PLATFORMS = [
  'etsy',
  'reddit',
  'facebook',
  'instagram',
  'gumroad',
  'fiverr',
  'upwork',
  'forum',
  'blog',
  'youtube',
  'linkedin',
  'tiktok',
  'x',
  'news',
  'web',
];

export const EVIDENCE_STRENGTHS = {
  1: 'Someone asked for it once. Talk is cheap.',
  2: 'Asked repeatedly, or by several different people.',
  3: 'Someone is paying: a live listing, gig or product with a real price.',
  4: 'Paying and complaining: money is moving and the buyer is unhappy.',
  5: 'Many paying, many complaining, and the complaints agree.',
};

export const CONFIDENCE = ['low', 'medium', 'high'];
export const FINDING_STATUS = ['active', 'superseded', 'archived'];

/**
 * How a fact reached us. This is what separates a claim we can stand behind
 * from one we cannot: `etsy-api` means we called an authorised API and read
 * the response; `grounded-search` means a search index showed it to us and we
 * never fetched the page ourselves.
 *
 * `connector` was missing, and because anything unrecognised falls back to
 * `grounded-search`, every fact from a source you plugged in was relabelled as
 * a snippet nobody read. That in turn made readQuality.thinRead true on those
 * findings and held every one of them at level 4 for ever — a silent cap on
 * essentially everything, since the whole starter set is connectors. A
 * connector is her own HTTP request returning the whole post: a direct read.
 */
export const VIA = ['etsy-api', 'grounded-search', 'direct-fetch', 'operator', 'connector'];

class Problems {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }
  error(path, message) {
    this.errors.push({ path, message });
  }
  warn(path, message) {
    this.warnings.push({ path, message });
  }
  get ok() {
    return this.errors.length === 0;
  }
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v.trim() : '');
const arr = (v) => (Array.isArray(v) ? v : []);

/**
 * A quote must be somebody's actual words, with somewhere to go and check.
 * Paraphrase is the enemy here: "sellers find it frustrating" is an opinion
 * about people, "I've rewritten this listing four times and it still doesn't
 * show up" is evidence.
 */
function normalizeQuote(raw, path, problems) {
  const quote = str(raw?.quote);
  const url = canonicalUrl(raw?.url);
  if (!quote) problems.error(path, 'quote is empty');
  if (quote.length > 1200) problems.warn(path, 'quote is very long; it may be a paraphrase of a whole page rather than someone speaking');
  if (!url) problems.error(path, `quote has no usable URL (got ${JSON.stringify(raw?.url ?? null)}) — a quote with no link cannot be checked, so it is not evidence`);

  const platform = str(raw?.platform).toLowerCase();
  if (platform && !PLATFORMS.includes(platform)) problems.warn(path, `unknown platform "${platform}"`);

  return {
    quote,
    url,
    date: str(raw?.date) || null,
    platform: PLATFORMS.includes(platform) ? platform : 'web',
    via: VIA.includes(str(raw?.via)) ? str(raw.via) : 'grounded-search',
    // Who said it, where the source gave a handle. Optional everywhere: a
    // quote without one is still perfectly good evidence, it just cannot be
    // followed up. Only ever the public handle and the public profile link —
    // the same two strings printed next to the post on a page anyone can open.
    author: raw?.author?.handle
      ? {
          handle: str(raw.author.handle).slice(0, 80),
          profile: canonicalUrl(raw.author.profile) ?? null,
          // Only an address the person published on their own public profile.
          // Validated here rather than at the point of sending, because a
          // malformed one that survives this far becomes a message to nobody
          // or, worse, to somebody else.
          email: /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(str(raw.author.email)) ? str(raw.author.email).slice(0, 200) : null,
        }
      : null,
  };
}

function normalizePaying(raw, path, problems) {
  const what = str(raw?.what);
  const url = canonicalUrl(raw?.url);
  const price = Number(raw?.price);

  if (!what) problems.error(path, 'paying entry has no description of what is being bought');
  if (!url) problems.error(path, 'paying entry has no URL — an unlinked price is a guess');
  if (!Number.isFinite(price) || price < 0) {
    problems.error(path, `price must be a real number, got ${JSON.stringify(raw?.price ?? null)}`);
  }

  const currency = str(raw?.currency).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) problems.error(path, `currency must be a 3-letter ISO code, got ${JSON.stringify(raw?.currency ?? null)}`);

  // salesSignal is the difference between "this exists" and "this sells".
  // It is allowed to be absent, but then it must say so rather than imply zero.
  const salesSignal = str(raw?.salesSignal) || null;
  const signalMethod = str(raw?.signalMethod) || null;
  if (salesSignal && !signalMethod) {
    problems.error(path, 'salesSignal is set but signalMethod is empty — say how the number was arrived at, or drop the signal');
  }

  return {
    what,
    price: Number.isFinite(price) ? price : null,
    currency: /^[A-Z]{3}$/.test(currency) ? currency : null,
    platform: PLATFORMS.includes(str(raw?.platform).toLowerCase()) ? str(raw.platform).toLowerCase() : 'web',
    url,
    salesSignal,
    signalMethod,
    via: VIA.includes(str(raw?.via)) ? str(raw.via) : 'grounded-search',
  };
}

function normalizeComplaint(raw, path, problems) {
  const base = normalizeQuote(raw, path, problems);
  const aboutWhat = str(raw?.aboutWhat);
  if (!aboutWhat) {
    problems.error(path, 'complaint does not say what it is about — without that, complaints cannot be checked for agreement, which is the whole level-5 test');
  }
  return { ...base, aboutWhat };
}

function normalizeVolume(raw, problems) {
  if (!isObj(raw)) {
    return { estimate: null, method: 'not established', confidence: 'low', asOf: null };
  }
  const method = str(raw.method);
  const confidence = CONFIDENCE.includes(str(raw.confidence)) ? str(raw.confidence) : 'low';
  const estimateRaw = raw.estimate;
  const estimate = estimateRaw === null || estimateRaw === undefined || estimateRaw === '' ? null : Number(estimateRaw);

  if (estimate !== null && !Number.isFinite(estimate)) {
    problems.error('evidence.volume.estimate', `estimate must be a number or null, got ${JSON.stringify(estimateRaw)}`);
  }
  if (estimate !== null && !method) {
    problems.error('evidence.volume.method', 'a volume estimate with no method is a fabricated market size — state how it was derived or set estimate to null');
  }
  if (estimate !== null && confidence === 'high' && !/\bcount(ed)?\b|\bsum\b|\bapi\b|\bexact\b/i.test(method)) {
    problems.warn('evidence.volume.confidence', 'high confidence claimed without a counting method; downgrade unless the number was actually counted');
  }

  return {
    estimate: Number.isFinite(estimate) ? estimate : null,
    method: method || 'not established',
    confidence,
    asOf: str(raw.asOf) || null,
  };
}

function normalizeSupported(raw, path, problems, field) {
  const text = str(raw?.[field]);
  const evidenceUrl = canonicalUrl(raw?.evidenceUrl);
  if (!text) problems.error(path, `${field} is empty`);
  return {
    [field]: text,
    whyItMatters: str(raw?.whyItMatters) || null,
    evidenceUrl,
  };
}

/**
 * Normalise and validate. Always returns a value — a rejected finding is still
 * returned so it can be shown and argued with, but `ok` is false and nothing
 * downstream is allowed to store or hand it on.
 */
export function validateFinding(input, { now = () => new Date().toISOString() } = {}) {
  const problems = new Problems();
  if (!isObj(input)) {
    problems.error('', 'finding is not an object');
    return { ok: false, errors: problems.errors, warnings: problems.warnings, value: null };
  }

  const demandIn = isObj(input.demand) ? input.demand : {};
  const oneLine = str(demandIn.oneLine);
  const whoHasIt = str(demandIn.whoHasIt);

  if (!oneLine) problems.error('demand.oneLine', 'a finding with no one-line demand is not a finding');
  if (!whoHasIt) {
    problems.error('demand.whoHasIt', 'say who exactly has this problem');
  } else if (/^(small businesses|businesses|freelancers|people|everyone|smbs?)\.?$/i.test(whoHasIt)) {
    problems.error(
      'demand.whoHasIt',
      `"${whoHasIt}" is not an answer — which ones, doing what? A description that fits everybody cannot be sold to.`,
    );
  }

  const evidenceIn = isObj(input.evidence) ? input.evidence : {};

  const inTheirWords = arr(demandIn.inTheirWords).map((q, i) => normalizeQuote(q, `demand.inTheirWords[${i}]`, problems));
  const paying = arr(evidenceIn.paying).map((p, i) => normalizePaying(p, `evidence.paying[${i}]`, problems));
  const complaints = arr(evidenceIn.complaints).map((c, i) => normalizeComplaint(c, `evidence.complaints[${i}]`, problems));
  const volume = normalizeVolume(evidenceIn.volume, problems);

  const incumbents = arr(input.incumbents).map((inc, i) => {
    const name = str(inc?.name);
    if (!name) problems.error(`incumbents[${i}].name`, 'incumbent has no name');
    const price = inc?.price === null || inc?.price === undefined || inc?.price === '' ? null : Number(inc.price);
    if (price !== null && !Number.isFinite(price)) {
      problems.error(`incumbents[${i}].price`, `price must be a number or null, got ${JSON.stringify(inc?.price)}`);
    }
    return {
      name,
      url: canonicalUrl(inc?.url),
      price: Number.isFinite(price) ? price : null,
      currency: /^[A-Z]{3}$/.test(str(inc?.currency).toUpperCase()) ? str(inc.currency).toUpperCase() : null,
      whatTheyGetWrong: str(inc?.whatTheyGetWrong),
      evidenceUrl: canonicalUrl(inc?.evidenceUrl),
    };
  });

  const whatWouldWin = arr(input.whatWouldWin).map((w, i) =>
    normalizeSupported(w, `whatWouldWin[${i}]`, problems, 'requirement'),
  );

  const risks = arr(input.risks).map((r, i) => {
    const risk = str(r?.risk);
    if (!risk) problems.error(`risks[${i}].risk`, 'risk is empty');
    const severity = ['low', 'medium', 'high'].includes(str(r?.severity)) ? str(r.severity) : 'medium';
    return { risk, severity, reasoning: str(r?.reasoning) || null, evidenceUrl: canonicalUrl(r?.evidenceUrl) };
  });

  // Not optional, and not negotiable. An engine that only ever finds
  // opportunities is an expensive way to be told what you want to hear.
  if (!risks.length) {
    problems.error('risks', 'no risks listed. Every real opening has a way it goes wrong — saturation, a platform that can close it overnight, a buyer who will not pay. Say it plainly.');
  }

  const sources = arr(input.sources)
    .map((s) => ({
      url: canonicalUrl(isObj(s) ? s.url : s),
      fetchedAt: str(isObj(s) ? s.fetchedAt : '') || null,
      status: Number.isFinite(Number(s?.status)) ? Number(s.status) : null,
      hash: str(s?.hash) || null,
      via: VIA.includes(str(s?.via)) ? str(s.via) : 'grounded-search',
      title: str(s?.title) || null,
    }))
    .filter((s) => s.url);

  const verdictIn = isObj(input.verdict) ? input.verdict : {};
  const depthIn = isObj(input.depth) ? input.depth : {};

  const value = {
    schemaVersion: SCHEMA_VERSION,
    id: str(input.id) || stableId('f', oneLine, whoHasIt),
    watchId: str(input.watchId) || null,
    foundAt: str(input.foundAt) || now(),
    lastVerifiedAt: str(input.lastVerifiedAt) || now(),
    status: FINDING_STATUS.includes(str(input.status)) ? str(input.status) : 'active',
    supersededBy: str(input.supersededBy) || null,

    demand: { oneLine, whoHasIt, inTheirWords },
    evidence: {
      // Never taken from input: computed in core/evidence.js from the facts
      // above, so "strength: 5" can never be flattery.
      strength: 1,
      hypothesis: true,
      ladder: null,
      paying,
      complaints,
      volume,
    },
    incumbents,
    // What people said when they were asked directly.
    //
    // A sibling of `evidence`, never a member of it, and the placement is the
    // whole point. "I would pay £30 a month" is the most useful sentence you
    // can get about a market and it is not proof that anyone paid anything.
    // core/evidence.js is handed `finding.evidence` and cannot see this from
    // there; tests/evidence.test.js fails if that ever stops being true.
    conversations: arr(input.conversations).filter((c) => c && typeof c === 'object'),
    whatWouldWin,
    risks,
    buildability: isObj(input.buildability) ? input.buildability : null,
    verdict: {
      score: clampNumber(verdictIn.score, 0, 100, 0),
      wouldBuild: verdictIn.wouldBuild === true,
      reasoning: str(verdictIn.reasoning),
      blockedBy: str(verdictIn.blockedBy) || null,
    },
    depth: {
      level: ['glance', 'check', 'dig', 'deep'].includes(str(depthIn.level)) ? str(depthIn.level) : 'check',
      reasoning: str(depthIn.reasoning) || null,
      costUsd: clampNumber(depthIn.costUsd, 0, 1_000, 0),
      tokensIn: clampNumber(depthIn.tokensIn, 0, 1e9, 0),
      tokensOut: clampNumber(depthIn.tokensOut, 0, 1e9, 0),
      searches: clampNumber(depthIn.searches, 0, 10_000, 0),
      stoppedEarly: input.depth?.stoppedEarly === true,
      stoppedReason: str(depthIn.stoppedReason) || null,
    },
    sources,
    // Set by the dedup layer; kept on the record so the HUD can explain why
    // something was or was not re-reported.
    dedupKey: str(input.dedupKey) || dedupKeyFor({ demand: { oneLine } }),
    handedToJasonAt: str(input.handedToJasonAt) || null,
  };

  if (!value.verdict.reasoning) problems.error('verdict.reasoning', 'a verdict with no reasoning cannot be argued with');

  return { ok: problems.ok, errors: problems.errors, warnings: problems.warnings, value };
}

/**
 * The identity of a demand, for "have I already told him this?".
 *
 * Deliberately based on the normalised one-liner alone. Including URLs would
 * make the same demand look new every time it turned up on a different
 * listing, which is precisely the repetition that gets a watch muted.
 */
export function dedupKeyFor(finding) {
  return stableId('d', normalizePhrase(finding?.demand?.oneLine ?? ''));
}

/** Everything the HUD and Jason need, without the bulk. */
export function summarizeFinding(f) {
  return {
    id: f.id,
    watchId: f.watchId,
    status: f.status,
    foundAt: f.foundAt,
    lastVerifiedAt: f.lastVerifiedAt,
    oneLine: f.demand.oneLine,
    whoHasIt: f.demand.whoHasIt,
    strength: f.evidence.strength,
    hypothesis: f.evidence.hypothesis,
    payingCount: f.evidence.paying.length,
    complaintCount: f.evidence.complaints.length,
    score: f.verdict.score,
    wouldBuild: f.verdict.wouldBuild,
    buildable: f.buildability?.verdict ?? null,
    costUsd: f.depth.costUsd,
    depth: f.depth.level,
    handedToJasonAt: f.handedToJasonAt,
    sourceCount: f.sources.length,
  };
}
