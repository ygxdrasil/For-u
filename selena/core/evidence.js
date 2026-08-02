/**
 * The evidence ladder, computed — never asked of the model.
 *
 * This is the whole point of the system. Anyone can list what is selling; the
 * value is in separating "someone mentioned it" from "people are paying for it
 * and saying the same thing is wrong with it". If the model were asked to
 * score its own findings it would learn to say 5, because 5 is the answer that
 * makes it look useful. So the model's job is only to extract quotes, prices
 * and URLs, and the level is arithmetic over what it extracted.
 *
 *   1  someone asks                                        weak
 *   2  asked repeatedly, or by several different people
 *   3  someone is PAYING: real price, real listing          strong
 *   4  paying AND complaining
 *   5  many paying, many complaining, complaints AGREE      what we hunt
 */

import { canonicalUrl, hostOf, normalizePhrase, subjectAgreement } from './util.js';

/** How similar two complaint subjects must be to count as the same complaint. */
export const AGREEMENT_THRESHOLD = 0.5;

/**
 * Reading a page beats being shown a snippet about it.
 *
 * `connector` belongs here and its absence was a real bug: a source you plugged
 * in is fetched by her, over HTTP, and returns the whole post or review — that
 * is a direct read by any reasonable definition, and a stronger one than a
 * search snippet. Leaving it out made every finding built from connected
 * sources look like it had never read anything, which held all of them at
 * level 4 for ever with the note "every source is a search snippet we never
 * actually read". The nine sources shipped in the starter set are all
 * connectors, so the cap was on essentially everything.
 */
const READ_VIA = new Set(['etsy-api', 'direct-fetch', 'connector']);

function distinct(values) {
  return [...new Set(values.filter(Boolean))];
}

/**
 * Group complaints by what they are actually about.
 *
 * Level 5 is not "three complaints exist" — it is "three complaints agree".
 * Three people unhappy about three different things is three small problems,
 * not one opening. Clustering is a greedy pass with a word-overlap similarity:
 * deterministic, explainable in the HUD, and free.
 */
export function clusterComplaints(complaints = []) {
  const clusters = [];
  for (const c of complaints) {
    const subject = c?.aboutWhat ?? '';
    if (!normalizePhrase(subject)) continue;
    const home = clusters.find((cl) => subjectAgreement(cl.subject, subject) >= AGREEMENT_THRESHOLD);
    if (home) {
      home.members.push(c);
      // Keep the shortest phrasing as the label: it is usually the clearest.
      if (subject.length < home.subject.length) home.subject = subject;
    } else {
      clusters.push({ subject, members: [c] });
    }
  }
  return clusters
    .map((cl) => ({
      subject: cl.subject,
      count: cl.members.length,
      sources: distinct(cl.members.map((m) => canonicalUrl(m.url))),
      hosts: distinct(cl.members.map((m) => hostOf(m.url))),
      members: cl.members,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * @returns {{strength:number, hypothesis:boolean, ladder:Array, agreement:object, readQuality:object}}
 */
export function computeEvidence(input = {}) {
  // A default parameter only covers `undefined`. `null` is a real value and
  // sails straight past it, so an evidence block that came back null from
  // storage used to throw here rather than scoring 1.
  const evidence = input && typeof input === 'object' && !Array.isArray(input) ? input : {};

  const words = Array.isArray(evidence.inTheirWords) ? evidence.inTheirWords : [];
  const paying = (Array.isArray(evidence.paying) ? evidence.paying : []).filter(
    (p) => p && typeof p === 'object' && canonicalUrl(p.url) && Number.isFinite(Number(p.price)),
  );
  const complaints = (Array.isArray(evidence.complaints) ? evidence.complaints : []).filter(
    (c) => c && typeof c === 'object' && canonicalUrl(c.url) && String(c.quote ?? '').trim(),
  );

  const asks = [...words, ...complaints];
  const askUrls = distinct(asks.map((a) => canonicalUrl(a.url)));
  const askHosts = distinct(asks.map((a) => hostOf(a.url)));

  const payingUrls = distinct(paying.map((p) => canonicalUrl(p.url)));
  const payingHosts = distinct(paying.map((p) => hostOf(p.url)));
  const complaintUrls = distinct(complaints.map((c) => canonicalUrl(c.url)));

  // Rungs 1 and 2 are about people expressing a want, and a live priced
  // listing IS that — expressed with a wallet rather than a post. Counting
  // only forum talk there meant a niche with two real listings and no quoted
  // chatter fell to level 1, below a niche where two people merely grumbled.
  // That inverts the hierarchy the whole system rests on, so paying evidence
  // satisfies the talk rungs too.
  const demandUrls = distinct([...askUrls, ...payingUrls]);
  const demandHosts = distinct([...askHosts, ...payingHosts]);
  const demandCount = asks.length + paying.length;

  const clusters = clusterComplaints(complaints);
  const top = clusters[0] ?? null;
  const agreeing = top && top.count >= 2 && top.sources.length >= 2 ? top : null;

  // Did we actually read anything, or were we only ever shown snippets?
  const allItems = [...words, ...paying, ...complaints];
  const readCount = allItems.filter((i) => READ_VIA.has(i?.via)).length;
  const readQuality = {
    total: allItems.length,
    read: readCount,
    snippetOnly: allItems.length - readCount,
    // A page fetched is not a page read, and a snippet is not a page fetched.
    thinRead: allItems.length > 0 && readCount === 0,
  };

  const ladder = [
    {
      level: 1,
      label: 'Someone asks',
      met: demandCount >= 1,
      why: asks.length
        ? `${asks.length} quoted ask${asks.length === 1 ? '' : 's'} with links`
        : paying.length
          ? `nobody is quoted, but ${paying.length} priced listing${paying.length === 1 ? '' : 's'} exist, which is the want expressed with a wallet`
          : 'nobody is quoted asking for this',
    },
    {
      level: 2,
      label: 'Asked repeatedly, or by several people',
      met: demandUrls.length >= 2,
      why:
        demandUrls.length >= 2
          ? `${demandUrls.length} distinct sources across ${demandHosts.length} site${demandHosts.length === 1 ? '' : 's'}`
          : 'only one source shows this want at all, so it is one person talking',
    },
    {
      level: 3,
      label: 'Someone is paying',
      met: paying.length >= 1,
      why: paying.length
        ? `${paying.length} live listing${paying.length === 1 ? '' : 's'} with a real price and a link`
        : 'no priced listing found, so nobody is demonstrably paying',
    },
    {
      level: 4,
      label: 'Paying and complaining',
      met: paying.length >= 1 && complaints.length >= 1,
      why:
        paying.length >= 1 && complaints.length >= 1
          ? `${paying.length} paying against ${complaintUrls.length} complaint source${complaintUrls.length === 1 ? '' : 's'}`
          : paying.length
            ? 'money is moving but nobody quoted is unhappy'
            : 'nothing is being paid for yet',
    },
    {
      level: 5,
      label: 'Many paying, many complaining, and the complaints agree',
      met:
        paying.length >= 2 &&
        payingUrls.length >= 2 &&
        complaints.length >= 3 &&
        Boolean(agreeing) &&
        !readQuality.thinRead,
      why: (() => {
        if (paying.length < 2 || payingUrls.length < 2) return `needs 2+ distinct paying listings, has ${payingUrls.length}`;
        if (complaints.length < 3) return `needs 3+ complaints, has ${complaints.length}`;
        if (!agreeing) {
          return top
            ? `complaints do not agree: the largest shared subject is "${top.subject}" with ${top.count} of ${complaints.length}`
            : 'complaints have no stated subject, so agreement cannot be tested';
        }
        if (readQuality.thinRead) {
          return `${agreeing.count} complaints agree on "${agreeing.subject}", but every source is a search snippet we never actually read — held at 4 until something is read directly`;
        }
        return `${agreeing.count} complaints across ${agreeing.sources.length} sources agree on "${agreeing.subject}"`;
      })(),
    },
  ];

  // The level is the highest rung whose test passes AND which has no gap
  // beneath it. A "5" sitting on top of a failed 3 is not a 5.
  let strength = 0;
  for (const rung of ladder) {
    if (!rung.met) break;
    strength = rung.level;
  }
  strength = Math.max(1, strength);

  return {
    strength,
    // Below 3 nothing has been paid for, so it is a guess with citations.
    hypothesis: strength < 3,
    ladder,
    agreement: agreeing
      ? { subject: agreeing.subject, count: agreeing.count, sources: agreeing.sources }
      : { subject: null, count: top?.count ?? 0, sources: top?.sources ?? [] },
    clusters: clusters.map(({ members, ...rest }) => rest),
    readQuality,
    counts: {
      asks: asks.length,
      askSources: askUrls.length,
      paying: paying.length,
      payingSources: payingUrls.length,
      complaints: complaints.length,
      complaintSources: complaintUrls.length,
    },
  };
}

/**
 * Applies the computed ladder onto a validated finding, in place of whatever
 * the model claimed.
 */
export function applyEvidence(finding) {
  // inTheirWords lives on `demand`, not on `evidence` — the schema puts it
  // with the demand it describes. Handing computeEvidence only `finding
  // .evidence` therefore passed it an empty list of quotes every single time,
  // so the thing the whole system collects — people saying what they need, in
  // their own words — counted for nothing in the final score.
  //
  // Two consequences, both silent. The talk rungs were computed from
  // complaints and prices alone. And readQuality saw only paying and
  // complaints, so a finding whose quotes were all read directly still
  // reported "every source is a search snippet we never actually read" and was
  // held at 4. research.js computes an interim score correctly and then
  // overwrote it with this one.
  const computed = computeEvidence({
    ...(finding.evidence ?? {}),
    inTheirWords: finding.demand?.inTheirWords ?? finding.evidence?.inTheirWords ?? [],
  });
  finding.evidence.strength = computed.strength;
  finding.evidence.hypothesis = computed.hypothesis;
  finding.evidence.ladder = computed.ladder;
  finding.evidence.agreement = computed.agreement;
  finding.evidence.clusters = computed.clusters;
  finding.evidence.readQuality = computed.readQuality;
  finding.evidence.counts = computed.counts;
  return finding;
}
