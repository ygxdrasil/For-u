import test from 'node:test';
import assert from 'node:assert/strict';

import { computeEvidence, applyEvidence, clusterComplaints, AGREEMENT_THRESHOLD } from '../core/evidence.js';
import { validateFinding } from '../core/schema.js';

const paying = (n, via = 'etsy-api') =>
  Array.from({ length: n }, (_, i) => ({ what: `thing ${i}`, price: 10 + i, currency: 'GBP', url: `https://shop${i}.com/p`, via }));

const complaint = (subject, i, via = 'etsy-api') => ({
  quote: `it is bad because of ${subject}`,
  url: `https://site${i}.com/r`,
  aboutWhat: subject,
  via,
});

test('one person asking is level 1', () => {
  const e = computeEvidence({ inTheirWords: [{ quote: 'I wish this existed', url: 'https://a.com/1' }] });
  assert.equal(e.strength, 1);
  assert.equal(e.hypothesis, true);
});

test('several people asking is level 2 and still a hypothesis', () => {
  const e = computeEvidence({
    inTheirWords: [
      { quote: 'a', url: 'https://a.com/1' },
      { quote: 'b', url: 'https://b.com/2' },
    ],
  });
  assert.equal(e.strength, 2);
  assert.equal(e.hypothesis, true, 'nothing is being paid for, so it is not a finding');
});

test('a real price makes it level 3 and no longer a hypothesis', () => {
  const e = computeEvidence({ inTheirWords: [{ quote: 'a', url: 'https://a.com/1' }, { quote: 'b', url: 'https://b.com/2' }], paying: paying(1) });
  assert.equal(e.strength, 3);
  assert.equal(e.hypothesis, false);
});

test('paying plus complaining is level 4', () => {
  const e = computeEvidence({
    inTheirWords: [{ quote: 'a', url: 'https://a.com/1' }, { quote: 'b', url: 'https://b.com/2' }],
    paying: paying(1),
    complaints: [complaint('delivery time', 1)],
  });
  assert.equal(e.strength, 4);
});

test('level 5 needs many paying, many complaining, AND agreement', () => {
  const agreeing = computeEvidence({
    paying: paying(2),
    complaints: [complaint('accounting sync', 1), complaint('syncing with accounts', 2), complaint('will not sync to my accounts', 3)],
  });
  assert.equal(agreeing.strength, 5);
  assert.equal(agreeing.agreement.count, 3);

  // Three unhappy people about three different things is three small problems,
  // not one opening.
  const scattered = computeEvidence({
    paying: paying(2),
    complaints: [complaint('delivery time', 1), complaint('ugly font', 2), complaint('missing instructions', 3)],
  });
  assert.equal(scattered.strength, 4);
  assert.match(scattered.ladder[4].why, /do not agree/);
});

test('a gap lower down caps the level even when a higher rung passes', () => {
  // Three complaints that agree across three sites — the level-5 test on its
  // own — but nothing is being paid for. Rung 3 fails, so the ladder stops at
  // 2 rather than crediting the agreement.
  const e = computeEvidence({
    paying: [],
    complaints: [complaint('accounting sync', 1), complaint('syncing with accounts', 2), complaint('will not sync to accounts', 3)],
  });
  assert.equal(e.strength, 2);
  assert.equal(e.hypothesis, true);
  assert.equal(e.ladder[4].met, false);
});

test('a priced listing satisfies the talk rungs — money outranks chatter', () => {
  // Two real listings and nobody quoted must not score below two people
  // merely grumbling. That would invert the hierarchy the system rests on.
  const withMoney = computeEvidence({ paying: paying(2), complaints: [], inTheirWords: [] });
  const withTalk = computeEvidence({
    inTheirWords: [
      { quote: 'a', url: 'https://a.com/1' },
      { quote: 'b', url: 'https://b.com/2' },
    ],
  });
  assert.equal(withMoney.strength, 3);
  assert.equal(withTalk.strength, 2);
  assert.ok(withMoney.strength > withTalk.strength);
});

test('snippet-only evidence is held at 4 however well it agrees', () => {
  const e = computeEvidence({
    paying: paying(2, 'grounded-search'),
    complaints: [
      complaint('accounting sync', 1, 'grounded-search'),
      complaint('syncing with accounts', 2, 'grounded-search'),
      complaint('will not sync to accounts', 3, 'grounded-search'),
    ],
  });
  assert.equal(e.strength, 4);
  assert.equal(e.readQuality.thinRead, true);
  assert.match(e.ladder[4].why, /never actually read/);
});

test('claims with no URL are not counted at all', () => {
  const e = computeEvidence({
    paying: [{ what: 'x', price: 10, currency: 'GBP', url: null }],
    complaints: [{ quote: 'bad', url: '', aboutWhat: 'thing' }],
  });
  assert.equal(e.counts.paying, 0);
  assert.equal(e.counts.complaints, 0);
  assert.equal(e.strength, 1);
});

test('a price that is not a number is not a price', () => {
  const e = computeEvidence({ paying: [{ what: 'x', price: 'ten pounds', url: 'https://a.com/1' }] });
  assert.equal(e.counts.paying, 0);
});

test('complaints from the same page do not count as agreement across sources', () => {
  const e = computeEvidence({
    paying: paying(2),
    complaints: [
      { ...complaint('sync', 1), url: 'https://same.com/one' },
      { ...complaint('syncing', 2), url: 'https://same.com/one' },
      { ...complaint('sync issue', 3), url: 'https://same.com/one' },
    ],
  });
  assert.equal(e.strength, 4, 'three complaints on one page is one unhappy customer base, not independent agreement');
});

test('clustering is stable and reports its members', () => {
  const clusters = clusterComplaints([complaint('shipping delays', 1), complaint('delayed shipping', 2), complaint('ugly font', 3)]);
  assert.equal(clusters.length, 2);
  assert.equal(clusters[0].count, 2);
  assert.ok(AGREEMENT_THRESHOLD > 0 && AGREEMENT_THRESHOLD < 1);
});

test('empty evidence is level 1, not a crash', () => {
  for (const junk of [{}, { paying: null, complaints: 'no' }, undefined]) {
    const e = computeEvidence(junk);
    assert.equal(e.strength, 1);
  }
});

test('the quotes she read count toward the score, not just the complaints', () => {
  // The bug: inTheirWords lives on finding.demand, and applyEvidence handed
  // computeEvidence only finding.evidence — so the quotes counted for nothing.
  // Silently: the talk rungs were computed from complaints and prices alone,
  // and readQuality saw no quotes at all, so a finding whose sources were ALL
  // read directly still reported "every source is a search snippet" and stuck
  // at level 4. research.js computed an interim score correctly and then
  // overwrote it with this one.
  const finding = {
    demand: {
      oneLine: 'barbers charged for clients they already had',
      whoHasIt: 'one-to-three chair barbershops',
      inTheirWords: [
        { quote: 'they charged me for a client that was already mine', url: 'https://a.example.com/1', via: 'connector' },
        { quote: 'random payments come out your account', url: 'https://b.example.com/2', via: 'connector' },
      ],
    },
    evidence: {
      paying: [
        { what: 'Booksy', price: 29, currency: 'GBP', url: 'https://a.example.com/1' },
        { what: 'Fresha', price: 20, currency: 'GBP', url: 'https://b.example.com/2' },
      ],
      complaints: [
        { quote: 'charged for existing clients', aboutWhat: 'charged for existing clients', url: 'https://a.example.com/1' },
        { quote: 'fees appear with no breakdown', aboutWhat: 'charged for existing clients', url: 'https://b.example.com/2' },
        { quote: 'cannot see which booking caused it', aboutWhat: 'charged for existing clients', url: 'https://a.example.com/1' },
      ],
    },
  };

  applyEvidence(finding);

  assert.equal(finding.evidence.readQuality.total, 7, 'the two quotes must be part of the total');
  assert.equal(finding.evidence.readQuality.read, 2, 'and must be counted as read');
  assert.equal(finding.evidence.readQuality.thinRead, false);
  assert.equal(finding.evidence.strength, 5, 'two paying, three agreeing complaints, read directly — that is a 5');
});

test('a source you plugged in counts as read, not as a snippet', () => {
  // `connector` was missing from both the schema's allowed provenance values
  // and the read-quality allowlist. Anything unrecognised falls back to
  // "grounded-search", so every fact from a connected source was relabelled a
  // snippet nobody read — and the entire shipped starter set is connectors,
  // so the cap was on essentially everything.
  const viaConnector = {
    demand: {
      oneLine: 'x',
      whoHasIt: 'y',
      inTheirWords: [{ quote: 'read directly through a connected API', url: 'https://a.example.com/1', via: 'connector' }],
    },
    evidence: { paying: [], complaints: [] },
  };
  applyEvidence(viaConnector);
  assert.equal(viaConnector.evidence.readQuality.read, 1);
  assert.equal(viaConnector.evidence.readQuality.thinRead, false);

  // A snippet is still a snippet.
  const viaSnippet = JSON.parse(JSON.stringify(viaConnector));
  viaSnippet.demand.inTheirWords[0].via = 'grounded-search';
  delete viaSnippet.evidence.readQuality;
  applyEvidence(viaSnippet);
  assert.equal(viaSnippet.evidence.readQuality.read, 0);
  assert.equal(viaSnippet.evidence.readQuality.thinRead, true);
});

test('a conversation can never move the evidence level, however good it sounds', async () => {
  const { recordConversation, conversationSummary } = await import('../core/reach.js');

  // One quoted ask and nothing else: level 1, hypothesis.
  const base = validateFinding({
    demand: {
      oneLine: 'invoice chasing for small trade firms',
      whoHasIt: 'one-to-three person plumbing and electrical firms',
      inTheirWords: [{ quote: 'I spend every Friday chasing unpaid invoices', url: 'https://news.ycombinator.com/item?id=1', via: 'direct-fetch' }],
    },
    evidence: { paying: [], complaints: [] },
  }).value;

  const before = applyEvidence(base);
  assert.equal(before.evidence.strength, 1);

  // Now ask five people and have every one of them say yes, enthusiastically,
  // with a number. This is exactly the input that would tempt a system into
  // calling something proven.
  let after = before;
  for (let i = 0; i < 5; i += 1) {
    after = recordConversation(after, {
      personId: `who_${i}`,
      handle: `person${i}`,
      url: `https://news.ycombinator.com/item?id=${i}`,
      verdict: 'would-pay',
      said: 'Yes, absolutely, I would pay for this tomorrow.',
      theySaidTheyWouldPayUsd: 40,
    });
  }

  const scored = applyEvidence(after);
  assert.equal(scored.evidence.strength, 1, 'five people saying they would pay is still nobody paying');
  assert.equal(scored.evidence.hypothesis, true);
  assert.equal(scored.conversations.length, 5, 'and the conversations are kept, not discarded');

  // The summary reports them, so the information is not lost — it is just not
  // laundered into the ladder.
  const summary = conversationSummary(scored);
  assert.equal(summary.replied, 5);
  assert.equal(summary.wouldPay, 5);

  // Structural, not just behavioural: computeEvidence is handed `evidence`,
  // and if conversations ever migrate inside it this fails loudly.
  assert.equal(scored.evidence.conversations, undefined, 'conversations must never live inside evidence');

  // And the refusals count too — a tool that only tallied enthusiasm would be
  // a machine for talking you into things.
  const rejected = recordConversation(base, { verdict: 'not-interested', said: 'No, I just use a spreadsheet and it is fine.' });
  assert.match(conversationSummary(rejected).line, /1 said no/);
});
