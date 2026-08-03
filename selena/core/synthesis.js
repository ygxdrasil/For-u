/**
 * Seeing that two findings are one demand.
 *
 * The ladder is computed per finding. Demand does not respect that boundary.
 *
 * A watch on bookkeeping for trades finds "invoice chasing is still manual" and
 * scores it level 2. A watch on salon software finds "chasing payments eats my
 * Fridays" and scores that level 2. A roam turns up a CFPB complaint about the
 * same thing and scores it 3. Three records, three separate ladders, each
 * computed over a third of the evidence — and the union is level 4 or 5.
 *
 * Nothing in the system could see that, because deduplication is scoped to one
 * watch (`listFindings({ watchId })`). So she was systematically UNDERRATING
 * every demand that shows up in more than one place, which is precisely the
 * demand worth building for: a need that appears in one forum is a niche, and a
 * need that appears in three unrelated ones is a market.
 *
 * Same shape of fault as the reading funnel — the evidence was all there and
 * the structure stopped it being seen together — except this one hides the
 * strongest signals rather than a random slice.
 *
 * Two rules, both the same ones the rest of the system runs on.
 *
 * IT PROPOSES, IT DOES NOT MERGE. A wrong merge is worse than a missed one: it
 * invents a level-5 finding out of two unrelated level-2s and sends it to
 * Jason. So this offers, shows its reasoning and the evidence it is reasoning
 * from, and waits.
 *
 * NOTHING IS ASKED OF A MODEL. Clustering is by shared source URLs, phrase
 * similarity and complaint agreement — all computed. A model asked "are these
 * the same demand?" will say yes far too often, and its yes would be
 * indistinguishable from a real one.
 */

import { canonicalUrl, phraseSimilarity, subjectAgreement, nowIso, stableId, clampNumber } from './util.js';
import { computeEvidence, applyEvidence } from './evidence.js';

/**
 * How sure we have to be before two findings are offered as one.
 *
 * Lower than it looks, because `sameness` refuses outright unless the two
 * findings cite a source in common — so nothing can reach this number on
 * wording alone. The cost of missing a merge is a finding that stays at the
 * level its own evidence supports, which is honest. The cost of a wrong one is
 * a fabricated level 5 indistinguishable from a real one.
 */
export const SAME_DEMAND = 0.45;

/** Every URL a finding rests on, canonical, so two records can be compared. */
export function sourcesOf(finding) {
  const urls = [
    ...(finding?.demand?.inTheirWords ?? []),
    ...(finding?.evidence?.paying ?? []),
    ...(finding?.evidence?.complaints ?? []),
    ...(finding?.incumbents ?? []),
  ]
    .map((x) => canonicalUrl(x?.url))
    .filter(Boolean);
  return new Set(urls);
}

function overlap(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const url of a) if (b.has(url)) shared += 1;
  // Against the SMALLER set: a thin finding whose every source also appears in
  // a thick one is entirely contained by it, and dividing by the union would
  // score that as weak when it is the strongest possible signal.
  return shared / Math.min(a.size, b.size);
}

function complaintAgreement(a, b) {
  const subjectsA = (a?.evidence?.complaints ?? []).map((c) => c?.aboutWhat).filter(Boolean);
  const subjectsB = (b?.evidence?.complaints ?? []).map((c) => c?.aboutWhat).filter(Boolean);
  if (!subjectsA.length || !subjectsB.length) return 0;
  let best = 0;
  for (const x of subjectsA) for (const y of subjectsB) best = Math.max(best, subjectAgreement(x, y));
  return best;
}

/**
 * How much two findings look like the same underlying demand.
 *
 * @returns {{score:number, why:string[], sharedUrls:string[]}}
 */
export function sameness(a, b) {
  const srcA = sourcesOf(a);
  const srcB = sourcesOf(b);
  const shared = [...srcA].filter((u) => srcB.has(u));

  // SHARED EVIDENCE IS NECESSARY, and this is the rule the whole thing rests
  // on rather than a heavy weight among several.
  //
  // Merging on wording alone is the dangerous case: "invoice software for
  // plumbers" and "invoice software for salons" read almost identically and
  // are two different markets. Fold those together and you have manufactured a
  // level-5 finding out of two unrelated level-2s, and it looks exactly like a
  // real one all the way to Jason.
  //
  // Two findings that cite the same post, meanwhile, are resting on the same
  // person's words. Nobody lands on the same URL twice by coincidence — the
  // corpus is millions of posts wide.
  //
  // So: no shared source, no proposal, whatever the words say.
  if (!shared.length) {
    return { score: 0, why: [], sharedUrls: [], gatedBy: 'no source is cited by both', bySource: 0, byPhrase: 0, byWho: 0, byComplaint: 0 };
  }

  const ratio = overlap(srcA, srcB);
  // One shared citation already counts for a lot, so a thin overlap between two
  // thick findings does not score near zero. Ratio wins when it is higher: a
  // finding entirely contained by another is the strongest signal there is.
  const byCount = Math.min(1, 0.5 + (shared.length - 1) * 0.25);
  const bySource = Math.max(ratio, byCount);

  const byPhrase = phraseSimilarity(a?.demand?.oneLine, b?.demand?.oneLine);
  const byWho = phraseSimilarity(a?.demand?.whoHasIt, b?.demand?.whoHasIt);
  const byComplaint = complaintAgreement(a, b);

  // Evidence dominates; the words only break ties among pairs that already
  // share sources. The numbers were fixed against the worked cases in
  // tests/synthesis.test.js rather than chosen in the abstract, and the gate
  // above is what makes them safe to be approximate.
  const score = 0.7 * bySource + 0.15 * byPhrase + 0.1 * byWho + 0.05 * byComplaint;

  const why = [`${shared.length} source${shared.length === 1 ? '' : 's'} cited by both`];
  if (byPhrase >= 0.5) why.push('the same need, described in nearly the same words');
  if (byWho >= 0.5) why.push('the same kind of business');
  if (byComplaint >= 0.6) why.push('their complaints are about the same thing');

  return { score, why, sharedUrls: shared.slice(0, 8), bySource, byPhrase, byWho, byComplaint };
}

/**
 * The union of two or more findings' evidence, with duplicates removed by URL.
 *
 * Never mutates its inputs. The point is to answer "what would the ladder say
 * if these were one record" without becoming one record.
 */
export function unionEvidence(findings) {
  const list = Array.isArray(findings) ? findings.filter(Boolean) : [];
  const pick = (get) => {
    const seen = new Set();
    const out = [];
    for (const f of list) {
      for (const item of get(f) ?? []) {
        const key = canonicalUrl(item?.url);
        // An item with no URL cannot be de-duplicated and cannot be checked;
        // it is kept only if nothing else claims that slot.
        const k = key ?? `${item?.quote ?? item?.what ?? ''}`.slice(0, 80);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        out.push(item);
      }
    }
    return out;
  };

  return {
    inTheirWords: pick((f) => f?.demand?.inTheirWords),
    paying: pick((f) => f?.evidence?.paying),
    complaints: pick((f) => f?.evidence?.complaints),
    incumbents: pick((f) => f?.incumbents),
  };
}

/**
 * What the ladder would say over the union, and how that compares.
 *
 * The whole product is the last line: "each of these is level 2; together they
 * are level 4". That sentence is the thing the system could not say before.
 */
export function combinedEvidence(findings) {
  const union = unionEvidence(findings);
  const evidence = computeEvidence({
    inTheirWords: union.inTheirWords,
    paying: union.paying,
    complaints: union.complaints,
  });

  const levels = findings.map((f) => clampNumber(f?.evidence?.strength, 0, 5, 0));
  const best = Math.max(0, ...levels);

  return {
    union,
    strength: evidence.strength,
    hypothesis: evidence.hypothesis,
    ladder: evidence.ladder,
    agreement: evidence.agreement ?? null,
    readQuality: evidence.readQuality ?? null,
    bestAlone: best,
    // The only number anyone will read. Positive means the split was costing
    // you a real finding.
    lift: evidence.strength - best,
  };
}

/**
 * Every group of findings that look like one demand.
 *
 * Single-link clustering: A joins B's group if it matches ANY member, because
 * a demand seen from three angles often has a weak middle — the trades finding
 * and the salon finding may not resemble each other much, while both plainly
 * match the one about chasing payments.
 *
 * O(n²) on purpose. A few hundred findings is nothing, and the alternative is
 * an index that can be subtly wrong in a way nobody would notice.
 */
export function clusterFindings(findings, { threshold = SAME_DEMAND } = {}) {
  const list = (Array.isArray(findings) ? findings : []).filter((f) => f && f.status === 'active');
  const groups = [];
  const placed = new Map();

  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i];
      const b = list[j];
      // Already the same record. Nothing to propose.
      if (a.id === b.id) continue;
      const s = sameness(a, b);
      if (s.score < threshold) continue;

      const gA = placed.get(a.id);
      const gB = placed.get(b.id);
      if (gA != null && gB != null) {
        if (gA === gB) {
          groups[gA].links.push({ a: a.id, b: b.id, ...s });
          continue;
        }
        // Two groups joined by this pair: fold the later into the earlier.
        const [keep, drop] = gA < gB ? [gA, gB] : [gB, gA];
        groups[keep].members.push(...groups[drop].members);
        groups[keep].links.push(...groups[drop].links, { a: a.id, b: b.id, ...s });
        for (const m of groups[drop].members) placed.set(m.id, keep);
        groups[drop] = null;
        continue;
      }
      if (gA != null) {
        groups[gA].members.push(b);
        groups[gA].links.push({ a: a.id, b: b.id, ...s });
        placed.set(b.id, gA);
        continue;
      }
      if (gB != null) {
        groups[gB].members.push(a);
        groups[gB].links.push({ a: a.id, b: b.id, ...s });
        placed.set(a.id, gB);
        continue;
      }
      groups.push({ members: [a, b], links: [{ a: a.id, b: b.id, ...s }] });
      placed.set(a.id, groups.length - 1);
      placed.set(b.id, groups.length - 1);
    }
  }

  return groups
    .filter(Boolean)
    .map((g) => {
      const combined = combinedEvidence(g.members);
      // Stable across runs, so "you dismissed this one" can stick.
      const id = stableId('cl', ...g.members.map((m) => m.id).sort());
      return {
        id,
        members: g.members.map((m) => ({
          id: m.id,
          oneLine: m.demand?.oneLine ?? null,
          whoHasIt: m.demand?.whoHasIt ?? null,
          strength: m.evidence?.strength ?? 0,
          watchId: m.watchId ?? null,
          sources: sourcesOf(m).size,
        })),
        links: g.links,
        why: [...new Set(g.links.flatMap((l) => l.why))],
        sharedUrls: [...new Set(g.links.flatMap((l) => l.sharedUrls))].slice(0, 10),
        confidence: Math.min(1, g.links.reduce((m, l) => Math.max(m, l.score), 0)),
        ...combined,
        line: describeLift(g.members, combined),
      };
    })
    .sort((a, b) => b.lift - a.lift || b.strength - a.strength);
}

function describeLift(members, combined) {
  const n = members.length;
  const each = members.map((m) => m.evidence?.strength ?? 0);
  const same = each.every((l) => l === each[0]);
  const alone = same ? `each at level ${each[0]}` : `at levels ${each.join(', ')}`;

  if (combined.lift > 0) {
    return `${n} findings, ${alone}. Together the same evidence reaches level ${combined.strength} — the split was costing you ${combined.lift} level${combined.lift === 1 ? '' : 's'}.`;
  }
  if (combined.lift < 0) {
    // Not reachable on any input found by a 4,000-case search, and said out
    // loud anyway: "no change" in front of a drop is the kind of quiet wrong
    // sentence this whole system is arranged against.
    return `${n} findings, ${alone}. Merging them would LOWER the level to ${combined.strength} — the combined complaints no longer agree. Probably leave these apart.`;
  }
  if (combined.lift === 0 && combined.strength > 0) {
    return `${n} findings, ${alone}. Merging them would not change the level, but it would stop you reading the same demand ${n === 2 ? 'twice' : `${n} times`}.`;
  }
  return `${n} findings that look like one demand, ${alone}.`;
}

/**
 * Carry a merge forward across a re-run.
 *
 * The bug this exists to stop, found by running it rather than reading it:
 *
 *   merge three findings, and the next run of the watch that produced the
 *   survivor silently destroys the merge
 *
 * A finding's id is derived from its one-liner and who has it, so a watch that
 * finds the same demand again produces the SAME id. putFinding then overwrites
 * the survivor with a record built from one run's evidence — the absorbed
 * quotes, prices and complaints are gone, `mergedFrom` is gone, and the
 * partners stay superseded, so that evidence is lost from the active record
 * permanently. Nothing is reported, because runWatch only announces things it
 * considers new.
 *
 * A re-verification legitimately REPLACES a finding's own evidence: it is a
 * fresh read of the same question. What it must not do is discard evidence
 * that came from somewhere this run was never going to look.
 *
 * @param {object} incoming the freshly researched record
 * @param {object|null} existing whatever is already stored under that id
 */
export function carryMergeForward(incoming, existing) {
  if (!incoming) return incoming;
  const previouslyMerged = Array.isArray(existing?.mergedFrom) ? existing.mergedFrom : [];
  if (!previouslyMerged.length) return incoming;

  // Union with what is already there, incoming first so a fresh read of the
  // same URL wins over the stored copy.
  const union = unionEvidence([incoming, existing]);
  return applyEvidence({
    ...incoming,
    demand: { ...incoming.demand, inTheirWords: union.inTheirWords },
    evidence: { ...incoming.evidence, paying: union.paying, complaints: union.complaints },
    incumbents: union.incumbents,
    mergedFrom: previouslyMerged,
    // These belong to the people, not to the run that happened to write last.
    conversations: existing.conversations ?? incoming.conversations ?? [],
    outbox: existing.outbox ?? incoming.outbox ?? [],
  });
}

/**
 * The only way a freshly researched finding may be written.
 *
 * Four different paths produce one — a watch run, a re-verification, a direct
 * research call and the `research` command — and every one of them would
 * otherwise have to remember the rule above. tests/structure.test.js fails if a
 * new one calls store.putFinding directly, because "remember to call the
 * helper" has already failed three times in this codebase: the ledger method,
 * the session secret, and the re-score after a merge.
 */
export async function saveResearchedFinding(store, finding) {
  const existing = await store.getFinding(finding.id).catch(() => null);
  const carried = carryMergeForward(finding, existing);
  await store.putFinding(carried);
  return carried;
}

/**
 * Fold a cluster into one record.
 *
 * The best-evidenced member survives and absorbs the union; the others are
 * SUPERSEDED, pointing at it. Nothing is deleted, every original keeps its own
 * history, and the merge is reversible by restoring them — which matters,
 * because the one thing this feature can get badly wrong is deciding two
 * different demands are the same.
 *
 * @returns {{survivor:object, superseded:object[]}}
 */
export function mergeCluster(members, { now = nowIso } = {}) {
  const list = (Array.isArray(members) ? members : []).filter(Boolean);
  if (list.length < 2) return { survivor: list[0] ?? null, superseded: [] };

  // Most distinct sources wins — it is the best-evidenced record and the one
  // whose narrative was built from the most. Ties go to the oldest, so the
  // result does not depend on the order they came out of the database.
  const survivor = [...list].sort((a, b) => {
    const d = sourcesOf(b).size - sourcesOf(a).size;
    if (d !== 0) return d;
    return String(a.foundAt ?? '').localeCompare(String(b.foundAt ?? ''));
  })[0];

  const others = list.filter((f) => f.id !== survivor.id);
  const union = unionEvidence(list);
  const at = now();

  const merged = {
    ...survivor,
    demand: { ...survivor.demand, inTheirWords: union.inTheirWords },
    evidence: { ...survivor.evidence, paying: union.paying, complaints: union.complaints },
    incumbents: union.incumbents,
    // Everything that was folded in, by id, so the record says where it came
    // from rather than quietly containing more than it used to.
    mergedFrom: [...(survivor.mergedFrom ?? []), ...others.map((o) => ({ id: o.id, oneLine: o.demand?.oneLine ?? null, at }))],
    // Risks are never dropped in a merge. The reasons not to build something
    // are the first thing an optimistic process loses.
    risks: [
      ...(survivor.risks ?? []),
      ...others.flatMap((o) => o.risks ?? []).filter((r) => !(survivor.risks ?? []).some((s) => phraseSimilarity(s?.risk ?? s, r?.risk ?? r) >= 0.8)),
    ],
    // Conversations and sent messages travel too — they belong to the people,
    // not to whichever record happened to find them.
    conversations: list.flatMap((f) => f.conversations ?? []),
    outbox: list.flatMap((f) => f.outbox ?? []),
    lastVerifiedAt: at,
  };

  const superseded = others.map((o) => ({
    ...o,
    status: 'superseded',
    supersededBy: survivor.id,
    supersededAt: at,
  }));

  // Re-scored HERE rather than by each caller.
  //
  // The union is the entire point — a survivor carrying three findings' worth
  // of evidence and the level one of them had would be the bug this module
  // exists to fix, reintroduced at the last step. Left to the caller it works
  // in whichever call site was written first and silently does not in the next
  // one, which is exactly how the ledger and the session secret went wrong.
  return { survivor: applyEvidence(merged), superseded };
}
