#!/usr/bin/env node
/**
 * End-to-end self-test with the network stubbed.
 *
 * This drives the REAL pipeline — the same runResearch() the HUD, the endpoint
 * and the scheduler all call — against a fake Gemini client and a fake Etsy.
 * It proves behaviour, not shape: that a fabricated citation is deleted, that
 * a repeat run stays quiet, that a budget stop keeps what it verified.
 *
 * Run: node scripts/selftest.mjs
 */

import assert from 'node:assert/strict';

import { createMemoryStore } from '../core/store.js';
import { createMeter } from '../core/meter.js';
import { createLlm } from '../core/llm.js';
import { createEtsy } from '../core/etsy.js';
import { createLedger } from '../core/ledger.js';
import { runResearch } from '../core/research.js';
import { runWatch, createWatch } from '../core/watches.js';
import { answerQuestion } from '../core/ask.js';
import { packageForJason, handToJason } from '../core/jason.js';
import { createDeadline } from '../core/util.js';

let passed = 0;
const failures = [];

/** Keeps going after a failure and reports every one. */
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.log(`  FAIL ${name}\n       ${err.message.split('\n').join('\n       ')}`);
  }
}

// ---------------------------------------------------------------------------
// The fakes
// ---------------------------------------------------------------------------

const GROUNDED_SOURCES = [
  { web: { uri: 'https://vertexaisearch.example/redirect/aaa', title: 'plumbersforum.example' } },
  { web: { uri: 'https://vertexaisearch.example/redirect/bbb', title: 'tradesmantalk.example' } },
];

/**
 * A Gemini stand-in. It answers a grounded call with prose plus grounding
 * chunks, and an extraction call with whatever JSON the scenario wants.
 */
function fakeGemini({ extraction, empty = false, failAfter = Infinity, sources = GROUNDED_SOURCES }) {
  let calls = 0;
  return () => ({
    models: {
      generateContent: async ({ config }) => {
        calls += 1;
        if (calls > failAfter) throw new Error('simulated upstream failure');

        const usageMetadata = { promptTokenCount: 900, candidatesTokenCount: 300, thoughtsTokenCount: 0, cachedContentTokenCount: 0 };

        // Grounded call: prose and sources, never a schema.
        if (config.tools) {
          assert.ok(!config.responseSchema, 'a grounded call must never carry a response schema');
          return {
            text: empty ? '' : 'Plumbers repeatedly say invoice chasing eats a day a week. Templates sell for around £12.',
            usageMetadata,
            candidates: [{ groundingMetadata: { groundingChunks: sources, webSearchQueries: ['invoice chasing plumbers'] } }],
          };
        }

        // Extraction / judge call.
        return { text: JSON.stringify(typeof extraction === 'function' ? extraction() : extraction), usageMetadata, candidates: [] };
      },
    },
  });
}

const ETSY_LISTINGS = {
  results: [
    {
      listing_id: 101,
      shop_id: 9,
      title: 'Invoice chaser spreadsheet for trades',
      description: 'A spreadsheet',
      url: 'https://www.etsy.com/listing/101/invoice-chaser',
      price: { amount: 1200, divisor: 100, currency_code: 'GBP' },
      quantity: 999,
      num_favorers: 42,
      tags: ['invoice'],
    },
    {
      listing_id: 102,
      shop_id: 10,
      title: 'Late payment reminder pack',
      description: 'Templates',
      url: 'https://www.etsy.com/listing/102/reminder-pack',
      price: { amount: 1800, divisor: 100, currency_code: 'GBP' },
      quantity: 12,
      num_favorers: 8,
      tags: ['reminders'],
    },
  ],
};

const ETSY_REVIEWS = {
  101: [
    { listing_id: 101, shop_id: 9, rating: 2, review: 'It never syncs with my accounting software', created_timestamp: 1750000000 },
    { listing_id: 101, shop_id: 9, rating: 5, review: 'Perfect, thanks', created_timestamp: 1750000000 },
  ],
  // Three unhappy reviews across two listings, two of which are about the same
  // thing. That is what level 5 requires, so the fixture has to contain it or
  // the end-to-end test can never exercise the top rung.
  102: [
    { listing_id: 102, shop_id: 10, rating: 3, review: 'Will not connect to my accounts package at all', created_timestamp: 1750000000 },
    { listing_id: 102, shop_id: 10, rating: 1, review: 'No syncing with accounting software, so I still type everything twice', created_timestamp: 1750000000 },
  ],
};

function fakeEtsyFetch({ failListing = null } = {}) {
  return async (url) => {
    const headers = new Map([
      ['x-limit-per-second', '10'],
      ['x-limit-per-day', '10000'],
      ['x-remaining-today', '9998'],
    ]);
    const respond = (status, body) => ({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: (k) => headers.get(k) ?? null },
      text: async () => JSON.stringify(body),
    });

    if (url.includes('/listings/active')) return respond(200, ETSY_LISTINGS);

    const m = url.match(/\/listings\/(\d+)\/reviews/);
    if (m) {
      const id = Number(m[1]);
      if (failListing === id) return respond(500, { error: 'simulated Etsy outage' });
      return respond(200, { count: ETSY_REVIEWS[id]?.length ?? 0, results: ETSY_REVIEWS[id] ?? [] });
    }
    return respond(404, { error: 'not found' });
  };
}

/** A well-formed extraction that cites only real grounding URLs. */
const HONEST_EXTRACTION = {
  found: true,
  demand: {
    oneLine: 'Chasing unpaid invoices eats a day a week',
    whoHasIt: 'UK plumbers and electricians running one-to-three person firms',
    inTheirWords: [
      { quote: 'I spend every Friday chasing money instead of working', url: 'https://vertexaisearch.example/redirect/aaa', platform: 'forum', date: '2026-05-02' },
      { quote: 'Half my week is invoices, not pipes', url: 'https://vertexaisearch.example/redirect/bbb', platform: 'forum', date: '2026-06-11' },
    ],
  },
  evidence: {
    paying: [],
    complaints: [],
    volume: { method: 'no published count of one-to-three person trade firms was found in what was read', confidence: 'low' },
  },
  incumbents: [],
  whatWouldWin: [{ requirement: 'It must connect to the accounting package they already use' }],
  risks: [{ risk: 'Accounting packages could ship this themselves', severity: 'high', reasoning: 'it is an obvious adjacency for them' }],
  verdict: { score: 68, wouldBuild: true, reasoning: 'Two independent complaints agree the sync is the problem, and money is already moving on Etsy.' },
};

function buildDeps({ gemini, etsyFetch = fakeEtsyFetch(), capUsd = 10, store = createMemoryStore() }) {
  const meter = createMeter({ store, capUsd });
  const ledger = createLedger();
  return {
    store,
    meter,
    llm: gemini ? createLlm({ apiKey: 'test', meter, clientFactory: gemini }) : null,
    etsy: createEtsy({ apiKey: 'test-key', ledger, fetchImpl: etsyFetch, gapMs: 0 }),
    ledger,
    budgetMs: 20_000,
    onEvent: () => {},
  };
}

// ---------------------------------------------------------------------------

console.log('\nSelena self-test — real pipeline, stubbed network\n');

await check('a healthy run produces a valid, sourced finding', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);

  assert.equal(result.status, 'found', `expected a finding, got ${result.status}: ${result.notes.join('; ')}`);
  const f = result.finding;
  assert.ok(f.demand.oneLine);
  assert.ok(f.risks.length, 'risks are required');
  assert.ok(f.sources.length >= 2, 'sources must come from the ledger');
  assert.ok(f.evidence.strength >= 4, `Etsy evidence should push this to 4+, got ${f.evidence.strength}`);
});

await check('Etsy prices and review complaints reach the finding', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);
  const f = result.finding;

  const prices = f.evidence.paying.map((p) => p.price).sort((a, b) => a - b);
  assert.deepEqual(prices, [12, 18], 'both listing prices should be carried through, divided by their divisor');
  assert.ok(f.evidence.paying.every((p) => p.currency === 'GBP'));
  assert.ok(f.evidence.paying.every((p) => p.via === 'etsy-api'));
  assert.ok(f.evidence.complaints.length >= 2, 'two- and three-star reviews are complaints');
  assert.ok(!f.evidence.complaints.some((c) => /Perfect, thanks/.test(c.quote)), 'a five-star review is not a complaint');
});

await check('complaints that agree push it to level 5', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'dig' }, deps);
  const f = result.finding;
  assert.equal(f.evidence.strength, 5, `expected 5, got ${f.evidence.strength}: ${f.evidence.ladder[4].why}`);
  assert.ok(f.evidence.agreement.subject, 'the agreed subject must be named');
});

await check('a fabricated citation is deleted and the level falls with it', async () => {
  const lying = structuredClone(HONEST_EXTRACTION);
  lying.evidence.complaints = [
    { quote: 'invented complaint', url: 'https://madeup.example/never-read', aboutWhat: 'accounting sync', platform: 'web' },
    { quote: 'another invented one', url: 'https://alsofake.example/nope', aboutWhat: 'syncing accounts', platform: 'web' },
  ];
  lying.evidence.paying = [
    { what: 'Imaginary product', price: 99, currency: 'GBP', url: 'https://madeup.example/product', platform: 'web' },
  ];

  const deps = buildDeps({ gemini: fakeGemini({ extraction: lying }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);
  const f = result.finding;

  const urls = [...f.evidence.complaints, ...f.evidence.paying].map((x) => x.url);
  assert.ok(!urls.some((u) => /madeup|alsofake/.test(u)), `fabricated URLs survived: ${urls.join(', ')}`);
  assert.ok(result.notes.some((n) => /never read/.test(n)), 'the deletion must be reported, not silent');
});

await check('an invented market size is discarded with an honest method', async () => {
  const inflated = structuredClone(HONEST_EXTRACTION);
  inflated.evidence.volume = { estimate: 250000, method: 'industry knowledge', confidence: 'high' };

  const deps = buildDeps({ gemini: fakeGemini({ extraction: inflated }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);

  assert.equal(result.finding.evidence.volume.estimate, null, 'a fabricated market size must never reach Jason');
  assert.equal(result.finding.evidence.volume.confidence, 'low');
  assert.match(result.finding.evidence.volume.method, /not established/);
});

await check('a partial Etsy failure is a caveat, not a failed run', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), etsyFetch: fakeEtsyFetch({ failListing: 102 }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);

  assert.equal(result.status, 'found', 'one dead listing must not sink the run');
  assert.ok(result.notes.some((n) => /read 1 of 2/.test(n)), `expected a partial-read note, got: ${result.notes.join('; ')}`);
  assert.ok(result.finding.evidence.paying.length >= 1);
});

await check('no model key means no finding, and says so plainly', async () => {
  const deps = buildDeps({ gemini: null });
  const result = await runResearch({ topic: 'anything at all', kind: 'question' }, deps);

  assert.equal(result.status, 'unverified');
  assert.equal(result.finding, null, 'she must not invent a finding she cannot source');
  assert.match(result.notes.join(' '), /No Gemini API key/);
});

await check('an empty model response is reported, not returned as a finding', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION, empty: true }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'glance' }, deps);
  // Etsy still returns evidence, so the run continues — but the empty search
  // pass must be visible rather than silently treated as "nothing found".
  assert.ok(result.notes.some((n) => /came back empty/.test(n)), `expected an empty-pass note, got: ${result.notes.join('; ')}`);
});

await check('the spend cap stops the run before it spends, and keeps what it had', async () => {
  const store = createMemoryStore();
  // Already over the cap before the run starts.
  await store.addSpend({ kind: 'model', usd: 9.999, at: new Date().toISOString() });

  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store, capUsd: 10 });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'deep' }, deps);

  assert.notEqual(result.status, 'found');
  assert.ok(
    result.notes.join(' ').includes('cap') || result.notes.join(' ').includes('Monthly'),
    `expected a budget note, got: ${result.notes.join('; ')}`,
  );
});

await check('a run that runs out of time reports what it managed', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }) });
  // A deadline already in the past: the pipeline must return an honest status
  // rather than being killed by the platform and returning nothing at all.
  deps.deadline = createDeadline(-1);
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'deep' }, deps);

  assert.ok(['unverified', 'nothing', 'found'].includes(result.status));
  assert.ok(result.ok, 'running out of time is not a failure');
});

await check('a watch reports the first time and stays quiet the second', async () => {
  const store = createMemoryStore();
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store });
  const watch = createWatch({ name: 'trades', topic: 'invoice chasing for trades', cadence: 'daily', depth: 'check' });
  await store.putWatch(watch);

  const first = await runWatch(watch, deps);
  assert.equal(first.reported, true, 'the first sighting is news');
  assert.equal(first.change.kind, 'new');

  const second = await runWatch(first.watch, buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store }));
  assert.equal(second.reported, false, 'the same finding twice is exactly what gets a watch muted');
  assert.match(second.reason, /nothing has moved/i);

  // And it must not have created a second record for the same demand.
  const all = await store.listFindings({ status: 'active' });
  assert.equal(all.length, 1, `expected one record, got ${all.length}`);
});

await check('a watch speaks again when something actually changes', async () => {
  const store = createMemoryStore();
  const watch = createWatch({ name: 'trades', topic: 'invoice chasing for trades', cadence: 'daily', depth: 'check' });
  await store.putWatch(watch);

  const first = await runWatch(watch, buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store }));
  assert.equal(first.reported, true);

  // A price moves on a listing we already knew about.
  const moved = structuredClone(ETSY_LISTINGS);
  moved.results[0].price.amount = 2400;
  const movedFetch = async (url) => {
    if (url.includes('/listings/active')) {
      return { ok: true, status: 200, headers: { get: () => null }, text: async () => JSON.stringify(moved) };
    }
    return fakeEtsyFetch()(url);
  };

  const second = await runWatch(first.watch, buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store, etsyFetch: movedFetch }));
  assert.equal(second.reported, true, 'a price movement is worth saying');
  assert.match(second.change.summary, /price/);
});

await check('Jason gets the evidence and the risks in the same packet', async () => {
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }) });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);
  const packet = packageForJason(result.finding);

  assert.ok(packet.build.what);
  assert.ok(packet.build.priceAnchors.length, 'he needs to know what they already pay');
  assert.ok(packet.risks.length, 'the reasons not to build must travel with the reasons to');
  assert.ok(packet.why.ladder, 'he should be able to see why this is level 4 or 5 without asking');
  assert.ok(packet.provenance.sources.length);
});

await check('handoff marks the finding and reports delivery separately from success', async () => {
  const store = createMemoryStore();
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);
  await store.putFinding(result.finding);

  const sent = [];
  const outcome = await handToJason(result.finding, {
    store,
    endpoint: 'https://jason.example/api/build',
    token: 'tok',
    fetchImpl: async (url, init) => {
      sent.push({ url, body: JSON.parse(init.body) });
      return { ok: true, status: 200, text: async () => 'queued' };
    },
  });

  assert.equal(sent.length, 1);
  assert.equal(sent[0].body.build.what, result.finding.demand.oneLine);
  assert.equal(outcome.delivery.ok, true);
  assert.equal(outcome.delivery.detail, 'queued', 'what Jason actually said is kept, because a 200 is not proof');

  const stored = await store.getFinding(result.finding.id);
  assert.ok(stored.handedToJasonAt);
});

await check('a delivery failure still records the handoff, and says it failed', async () => {
  const store = createMemoryStore();
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store });
  const result = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);

  const outcome = await handToJason(result.finding, {
    store,
    endpoint: 'https://jason.example/api/build',
    fetchImpl: async () => {
      throw new Error('connection refused');
    },
  });

  assert.equal(outcome.delivery.ok, false);
  assert.match(outcome.delivery.detail, /connection refused/);
  assert.ok(outcome.finding.handedToJasonAt, 'the attempt is still on the record');
});

await check('asking from the record costs nothing and cites only what was read', async () => {
  const store = createMemoryStore();
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store });
  const research = await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'check' }, deps);
  await store.putFinding(research.finding);

  const answerDeps = buildDeps({
    gemini: fakeGemini({
      extraction: {
        answer: 'They pay £12 to £18 for spreadsheet templates today.',
        confidence: 'medium',
        basedOn: ['https://www.etsy.com/listing/101/invoice-chaser', 'https://totally-invented.example/page'],
        unknowns: [],
      },
    }),
    store,
  });

  const answer = await answerQuestion({ question: 'what do trades pay for invoice chasing tools', mode: 'stored' }, answerDeps);
  assert.equal(answer.route, 'stored');
  assert.ok(!answer.basedOn.some((u) => /totally-invented/.test(u)), 'an invented citation must be dropped from the answer too');
  assert.equal(answer.rejectedCitations.length, 1);
});

await check('spend is metered and stays under the cap', async () => {
  const store = createMemoryStore();
  const deps = buildDeps({ gemini: fakeGemini({ extraction: HONEST_EXTRACTION }), store });
  await runResearch({ topic: 'invoice chasing for trades', kind: 'question', requestedDepth: 'dig' }, deps);

  const summary = await deps.meter.summary();
  assert.ok(summary.monthToDateUsd > 0, 'the run must have been billed');
  assert.ok(summary.monthToDateUsd < 10, 'and must be nowhere near the cap');
  assert.ok(summary.searchesThisMonth > 0, 'grounded searches are counted separately from tokens');
});

console.log(`\n${passed} passed, ${failures.length} failed\n`);
if (failures.length) {
  for (const f of failures) console.error(`FAILED: ${f.name}\n${f.err.stack}\n`);
  process.exit(1);
}
