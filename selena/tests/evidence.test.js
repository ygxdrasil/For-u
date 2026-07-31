import test from 'node:test';
import assert from 'node:assert/strict';

import { computeEvidence, clusterComplaints, AGREEMENT_THRESHOLD } from '../core/evidence.js';

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
