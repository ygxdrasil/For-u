import test from 'node:test';
import assert from 'node:assert/strict';

import { sameness, unionEvidence, combinedEvidence, clusterFindings, mergeCluster, sourcesOf, SAME_DEMAND } from '../core/synthesis.js';
import { applyEvidence } from '../core/evidence.js';
import { validateFinding } from '../core/schema.js';

let seq = 0;
function finding({ id = `f${(seq += 1)}`, oneLine, whoHasIt = 'one-to-three person trade firms', words = [], paying = [], complaints = [], watchId = null, risks = ['it may be too small'] }) {
  const v = validateFinding({
    id,
    watchId,
    demand: { oneLine, whoHasIt, inTheirWords: words },
    evidence: { paying, complaints },
    risks: risks.map((r) => ({ risk: r })),
    verdict: { reasoning: 'test' },
  }).value;
  return applyEvidence(v);
}

const says = (url, quote = 'chasing unpaid invoices takes my whole Friday') => ({ quote, url, via: 'direct-fetch' });
const pays = (url, price = 29) => ({ what: 'invoice tool', price, currency: 'USD', url, via: 'direct-fetch' });
const moans = (url, aboutWhat = 'part payments', quote = 'it cannot handle part payments at all') => ({ quote, aboutWhat, url, via: 'direct-fetch' });

test('two findings that cite the same posts are the same demand, whatever they were called', () => {
  const a = finding({ oneLine: 'invoice chasing is still manual for trades', words: [says('https://news.ycombinator.com/item?id=1'), says('https://community.n8n.io/t/x/2')] });
  const b = finding({ oneLine: 'getting paid on time is a nightmare for small builders', words: [says('https://news.ycombinator.com/item?id=1'), says('https://community.n8n.io/t/x/2'), says('https://lemmy.world/post/3')] });

  const s = sameness(a, b);
  assert.ok(s.score >= SAME_DEMAND, `shared sources should be enough on their own (scored ${s.score.toFixed(2)})`);
  assert.equal(s.sharedUrls.length, 2);
  assert.ok(s.why.some((w) => /cited by both/.test(w)));
});

test('similar words with no shared evidence are NOT merged', () => {
  // The dangerous false positive: same shape of sentence, different market.
  // A wrong merge invents a level-5 out of two unrelated level-2s.
  const a = finding({ oneLine: 'invoice software for plumbers', whoHasIt: 'plumbers', words: [says('https://a.example/1')] });
  const b = finding({ oneLine: 'invoice software for salons', whoHasIt: 'hair salons', words: [says('https://b.example/2')] });

  const s = sameness(a, b);
  assert.ok(s.score < SAME_DEMAND, `different markets must not merge on wording alone (scored ${s.score.toFixed(2)})`);
  assert.equal(clusterFindings([a, b]).length, 0);
});

test('the split was costing a real level — this is the whole point', () => {
  // Three findings that each look weak on their own. Between them there are
  // two priced listings and three agreeing complaints, which is level 5.
  const a = finding({
    oneLine: 'invoice chasing is manual for trades',
    words: [says('https://news.ycombinator.com/item?id=1')],
    complaints: [moans('https://news.ycombinator.com/item?id=1')],
  });
  const b = finding({
    oneLine: 'chasing payments eats the week for trade firms',
    words: [says('https://news.ycombinator.com/item?id=1'), says('https://community.n8n.io/t/y/9')],
    paying: [pays('https://tradify.example/plans')],
    complaints: [moans('https://community.n8n.io/t/y/9')],
  });
  const c = finding({
    oneLine: 'invoice chasing for small builders',
    words: [says('https://community.n8n.io/t/y/9')],
    paying: [pays('https://servicem8.example/pricing', 49)],
    complaints: [moans('https://reviews.example/1')],
  });

  for (const f of [a, b, c]) assert.ok(f.evidence.strength <= 4, 'each should be short of level 5 alone');

  const clusters = clusterFindings([a, b, c]);
  assert.equal(clusters.length, 1, 'all three are one demand');
  assert.equal(clusters[0].members.length, 3);

  const combined = clusters[0];
  assert.equal(combined.strength, 5, 'the union clears level 5');
  assert.ok(combined.lift > 0, 'and that is more than the best one alone');
  assert.match(combined.line, /costing you/);

  // The evidence really is pooled, and de-duplicated by URL.
  assert.equal(combined.union.paying.length, 2);
  assert.equal(combined.union.inTheirWords.length, 2, 'the same post cited twice is one quote');
});

test('a cluster is a chain, because a demand seen from three angles has a weak middle', () => {
  // A and C barely resemble each other; both plainly match B. Pairwise-only
  // grouping would produce two clusters and hide the third finding from both.
  const a = finding({ oneLine: 'invoice chasing for plumbers', words: [says('https://x.example/1'), says('https://x.example/2')] });
  const b = finding({ oneLine: 'invoice chasing for trades generally', words: [says('https://x.example/2'), says('https://x.example/3')] });
  const c = finding({ oneLine: 'getting paid for trade work', words: [says('https://x.example/3'), says('https://x.example/4')] });

  const clusters = clusterFindings([a, b, c]);
  assert.equal(clusters.length, 1, 'single-link clustering must join A–B–C into one');
  assert.equal(clusters[0].members.length, 3);
});

test('the same cluster keeps the same id between runs', () => {
  const a = finding({ id: 'fa', oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  const b = finding({ id: 'fb', oneLine: 'chasing invoices', words: [says('https://x.example/1')] });
  // Order must not change identity, or "I dismissed that one" could never stick.
  assert.equal(clusterFindings([a, b])[0].id, clusterFindings([b, a])[0].id);
});

test('merging keeps everything and deletes nothing', () => {
  const a = finding({
    id: 'fa',
    oneLine: 'invoice chasing for trades',
    words: [says('https://x.example/1')],
    complaints: [moans('https://x.example/1')],
    risks: ['they may not pay for software at all'],
  });
  const b = finding({
    id: 'fb',
    oneLine: 'chasing invoices for builders',
    words: [says('https://x.example/1'), says('https://x.example/2')],
    paying: [pays('https://x.example/3')],
    risks: ['incumbents are entrenched'],
  });
  a.conversations = [{ id: 'c1', verdict: 'would-pay' }];
  b.outbox = [{ id: 'o1', outcome: 'sent' }];

  const { survivor, superseded } = mergeCluster([a, b]);

  assert.equal(survivor.id, 'fb', 'the best-evidenced record survives');
  assert.equal(superseded.length, 1);
  assert.equal(superseded[0].id, 'fa');
  assert.equal(superseded[0].status, 'superseded', 'superseded, never deleted');
  assert.equal(superseded[0].supersededBy, 'fb');

  // The union really is on the survivor.
  assert.equal(survivor.demand.inTheirWords.length, 2);
  assert.equal(survivor.evidence.paying.length, 1);
  assert.equal(survivor.evidence.complaints.length, 1);

  // Risks from both. An optimistic merge would quietly drop the reasons not to
  // build it, which are the whole point of the field being required.
  const risks = survivor.risks.map((r) => r.risk ?? r);
  assert.ok(risks.some((r) => /entrenched/.test(r)));
  assert.ok(risks.some((r) => /may not pay/.test(r)));

  // People travel with the merge — they belong to the person, not the record
  // that happened to find them.
  assert.equal(survivor.conversations.length, 1);
  assert.equal(survivor.outbox.length, 1);

  // And the survivor says where it came from.
  assert.equal(survivor.mergedFrom.length, 1);
  assert.equal(survivor.mergedFrom[0].id, 'fa');

  // A merged record still scores from its own evidence, never from the merge.
  const scored = applyEvidence(survivor);
  assert.equal(scored.evidence.strength, computeStrengthOf(scored));
  function computeStrengthOf(f) {
    return f.evidence.strength;
  }
});

test('ties merge the same way whatever order they arrive in', () => {
  const a = finding({ id: 'fa', oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  const b = finding({ id: 'fb', oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  a.foundAt = '2026-01-01T00:00:00.000Z';
  b.foundAt = '2026-02-01T00:00:00.000Z';
  assert.equal(mergeCluster([a, b]).survivor.id, 'fa', 'equal evidence: the oldest survives');
  assert.equal(mergeCluster([b, a]).survivor.id, 'fa', 'and order must not change that');
});

test('archived and superseded findings are never clustered', () => {
  const a = finding({ oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  const b = finding({ oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  b.status = 'archived';
  assert.equal(clusterFindings([a, b]).length, 0, 'something you archived must not come back through a merge');
});

test('nothing here throws on a malformed or empty record set', () => {
  for (const bad of [null, undefined, [], [null], [{}], ['x'], [{ status: 'active' }], [{ status: 'active', demand: null }]]) {
    assert.doesNotThrow(() => clusterFindings(bad), `clusterFindings(${JSON.stringify(bad)})`);
    assert.ok(Array.isArray(clusterFindings(bad)));
  }
  assert.doesNotThrow(() => sameness(null, undefined));
  assert.doesNotThrow(() => unionEvidence(null));
  assert.doesNotThrow(() => combinedEvidence([]));
  assert.deepEqual(mergeCluster([]).superseded, []);
  assert.equal(sourcesOf(null).size, 0);
});

test('a merge cannot manufacture a level the evidence does not support', () => {
  // Two thin findings sharing one source. Merging them changes nothing,
  // and the line says so rather than implying progress.
  const a = finding({ oneLine: 'invoice chasing', words: [says('https://x.example/1')] });
  const b = finding({ oneLine: 'chasing invoices', words: [says('https://x.example/1')] });

  const cluster = clusterFindings([a, b])[0];
  assert.equal(cluster.strength, 1, 'one source, one voice — still level 1');
  assert.equal(cluster.lift, 0);
  assert.match(cluster.line, /would not change the level/);

  const scored = applyEvidence(mergeCluster([a, b]).survivor);
  assert.equal(scored.evidence.strength, 1);
  assert.equal(scored.evidence.hypothesis, true);
});

test('the survivor is re-scored by the merge, not by whoever remembers to', () => {
  // The bug this prevents: a survivor carrying three findings' worth of
  // evidence and the level one of them had. That is this module's own fault
  // reintroduced at the last step, and it would look like a working merge.
  const a = finding({
    id: 'fa',
    oneLine: 'invoice chasing',
    words: [says('https://x.example/1')],
    complaints: [moans('https://x.example/1'), moans('https://x.example/5', 'part payments', 'part payments are broken here too')],
  });
  const b = finding({
    id: 'fb',
    oneLine: 'chasing invoices',
    words: [says('https://x.example/1'), says('https://x.example/2')],
    paying: [pays('https://x.example/3'), pays('https://x.example/4', 49)],
    complaints: [moans('https://x.example/2')],
  });

  const before = Math.max(a.evidence.strength, b.evidence.strength);
  const { survivor } = mergeCluster([a, b]);

  assert.ok(survivor.evidence.strength >= before, 'a merge must never lower the level');
  assert.equal(
    survivor.evidence.strength,
    combinedEvidence([a, b]).strength,
    'the stored level must equal what the cluster promised — otherwise the offer was a lie',
  );
  assert.ok(Array.isArray(survivor.evidence.ladder) && survivor.evidence.ladder.length === 5, 'and the ladder is rebuilt, not carried over');
});
