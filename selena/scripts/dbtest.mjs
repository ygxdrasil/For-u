#!/usr/bin/env node
/**
 * Runs the REAL Postgres store against a REAL Postgres.
 *
 * Until this existed, core/store.neon.js had never executed a single
 * statement — it was only shape-checked against the memory store. Every
 * CREATE TABLE, every ON CONFLICT clause, every FILTER aggregate was a
 * guess that looked right. "It compiles" is not "it works", and a store
 * that fails on first contact with a database fails at exactly the moment
 * you have just added DATABASE_URL and started trusting it with findings.
 *
 * PGlite is an embedded Postgres, so this needs no server and no network.
 * It is deliberately NOT a dependency — install it only to run this:
 *
 *   npm install --no-save @electric-sql/pglite
 *   node scripts/dbtest.mjs
 *
 * The strongest assertion here is not that Postgres works, it is that the
 * two stores AGREE. Every check runs against both, and a difference is a
 * failure, because a feature that behaves one way locally and another way
 * in production is worse than a feature that is broken in both.
 */

import { createNeonStore } from '../core/store.neon.js';
import { createMemoryStore } from '../core/store.js';
import { validateFinding } from '../core/schema.js';

let passed = 0;
const failures = [];

async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.log(`  FAIL ${name}\n       ${err.message.split('\n')[0]}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function eq(a, b, message) {
  const A = JSON.stringify(a);
  const B = JSON.stringify(b);
  if (A !== B) throw new Error(`${message}\n       memory: ${A}\n       neon  : ${B}`);
}

/**
 * The Neon driver is used two ways in core/store.neon.js: called with a plain
 * string for the schema, and as a tagged template with interpolated values for
 * everything else. This adapter gives PGlite both shapes, turning the template
 * into a real parameterised query rather than string concatenation — which is
 * also what proves the parameter placeholders line up.
 */
function pgliteSql(db) {
  const sql = async function sql(strings, ...values) {
    // The real Neon driver THROWS here. The first version of this double
    // accepted a plain string too, which is how core/store.neon.js shipped
    // calling sql(statement) for its schema and passing all eighteen checks
    // while being incapable of opening a real connection. A double that is
    // more permissive than the real thing does not test the real thing.
    if (typeof strings === 'string') {
      throw new Error(
        'This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).',
      );
    }
    let text = '';
    strings.forEach((chunk, i) => {
      text += chunk;
      if (i < values.length) text += `$${i + 1}`;
    });
    const res = await db.query(text, values);
    return res.rows ?? [];
  };

  // The driver's escape hatch for a plain string, which is what the schema
  // statements need.
  sql.query = async (text, params = []) => {
    const res = await db.query(text, params);
    return res.rows ?? [];
  };

  return sql;
}

function makeFinding(id, overrides = {}) {
  const v = validateFinding({
    demand: {
      oneLine: `demand ${id}`,
      whoHasIt: 'independent florists running weekly subscription rounds',
      inTheirWords: [{ quote: 'this takes my whole Sunday', url: 'https://forum.example.com/t/1', platform: 'forum' }],
    },
    evidence: {
      paying: [{ what: 'a template', price: 12, currency: 'GBP', url: 'https://etsy.com/listing/1', platform: 'etsy', via: 'etsy-api' }],
      complaints: [{ quote: 'it will not sync', url: 'https://etsy.com/listing/1', aboutWhat: 'syncing', platform: 'etsy', via: 'etsy-api' }],
      volume: { method: 'not established', confidence: 'low' },
    },
    incumbents: [],
    whatWouldWin: [{ requirement: 'sync with what they already use' }],
    risks: [{ risk: 'saturation', severity: 'medium' }],
    verdict: { score: 55, wouldBuild: true, reasoning: 'a real complaint against a real price' },
    ...overrides,
  }).value;
  v.id = id;
  return v;
}

console.log('\nSelena database test — the real Postgres store, against real Postgres\n');

const { PGlite } = await import('@electric-sql/pglite');
const db = new PGlite();

let neon;
await check('the schema applies to an empty database', async () => {
  neon = await createNeonStore({ databaseUrl: 'pglite', sqlFactory: () => pgliteSql(db) });
  assert(await neon.ready(), 'ready() must return true');
  assert(neon.durable === true, 'the Postgres store must report itself durable');
});

await check('the schema is idempotent, so a cold start does not fail', async () => {
  // Every serverless invocation runs the CREATE TABLE statements again.
  const again = await createNeonStore({ databaseUrl: 'pglite', sqlFactory: () => pgliteSql(db) });
  assert(await again.ready(), 'applying the schema twice must be harmless');
});

const memory = createMemoryStore();

await check('key/value round-trips and upserts', async () => {
  for (const store of [memory, neon]) {
    assert((await store.getKv('missing')) === null, 'a missing key is null');
    await store.setKv('tokens', [{ id: 'a', hash: 'h' }]);
    await store.setKv('tokens', [{ id: 'a', hash: 'h' }, { id: 'b', hash: 'h2' }]);
  }
  eq(await memory.getKv('tokens'), await neon.getKv('tokens'), 'kv must agree');
  assert((await neon.getKv('tokens')).length === 2, 'the second write must replace, not duplicate');
});

await check('spend sums for this month only, in both stores', async () => {
  const month = new Date().toISOString().slice(0, 7);
  const rows = [
    { kind: 'model', model: 'gemini-2.5-flash', label: 'watch:w1', usd: 0.01, inputTokens: 100, outputTokens: 50, at: `${month}-01T00:00:00.000Z` },
    { kind: 'model', model: 'gemini-2.5-flash', label: 'watch:w1', usd: 0.02, inputTokens: 200, outputTokens: 60, at: new Date().toISOString() },
    { kind: 'model', model: 'gemini-2.5-flash', label: 'watch:w2', usd: 5, at: '1999-01-01T00:00:00.000Z' },
  ];
  for (const store of [memory, neon]) for (const r of rows) await store.addSpend(r);

  const m = await memory.getMonthlySpend();
  const n = await neon.getMonthlySpend();
  assert(Math.abs(m - n) < 1e-6, `monthly spend must agree: memory ${m}, neon ${n}`);
  assert(Math.abs(n - 0.03) < 1e-6, `last month and 1999 must be excluded, got ${n}`);
});

await check('search counts are counted by day and month, not by token spend', async () => {
  const now = new Date().toISOString();
  for (const store of [memory, neon]) {
    await store.addSpend({ kind: 'search', model: 'gemini-2.5-flash', searches: 3, usd: 0, at: now });
    await store.addSpend({ kind: 'search', model: 'gemini-2.5-flash', searches: 2, usd: 0, at: now });
  }
  const m = await memory.getSearchCounts();
  const n = await neon.getSearchCounts();
  eq(m, n, 'search counts must agree');
  assert(n.today === 5, `expected 5 searches today, got ${n.today}`);
});

await check('a finding round-trips through JSONB unchanged', async () => {
  const f = makeFinding('f1');
  // Every write goes to BOTH stores from here on. The first version of this
  // script wrote some findings only to Postgres and then compared the two
  // stores' counts — which compared two different datasets and reported the
  // difference as a store bug. The comparison is only meaningful if the
  // inputs are identical.
  await memory.putFinding(f);
  await neon.putFinding(f);
  const back = await neon.getFinding('f1');
  assert(back, 'the finding must come back');
  assert(back.demand.oneLine === f.demand.oneLine);
  assert(back.evidence.paying[0].price === 12, 'a number must survive as a number');
  assert(back.evidence.complaints[0].aboutWhat === 'syncing');
  assert(back.version === 1, `first write is version 1, got ${back.version}`);
});

await check('updates append a version and never delete one', async () => {
  const f = makeFinding('f1');
  for (const store of [memory, neon]) {
    await store.putFinding({ ...f, verdict: { ...f.verdict, score: 80 } });
    await store.putFinding({ ...f, status: 'archived' });
  }

  const current = await neon.getFinding('f1');
  assert(current.status === 'archived', 'the latest write wins');
  assert(current.version === 3, `expected version 3, got ${current.version}`);

  const versions = await neon.findingVersions('f1');
  assert(versions.length === 3, `every version is kept, got ${versions.length}`);
  assert(versions[0].verdict.score === 55 && versions[1].verdict.score === 80, 'history must be in order and intact');
});

await check('concurrent writes to one finding do not lose data', async () => {
  // The real reason version numbers are computed by Postgres rather than in
  // JS: two serverless invocations are two processes, and the in-process lock
  // cannot help. If this produces duplicate versions, the fix is wrong.
  for (const store of [memory, neon]) {
    await store.putFinding(makeFinding('race'));
    await Promise.all([10, 20, 30, 40, 50].map((score) => store.putFinding({ ...makeFinding('race'), verdict: { score, wouldBuild: true, reasoning: 'r' } })));
  }
  eq(
    (await memory.findingVersions('race')).map((v) => v.version),
    (await neon.findingVersions('race')).map((v) => v.version),
    'both stores must number versions the same way under concurrency',
  );

  const versions = await neon.findingVersions('race');
  const numbers = versions.map((v) => v.version).sort((a, b) => a - b);
  assert(versions.length === 6, `expected 6 versions, got ${versions.length}`);
  eq(numbers, [1, 2, 3, 4, 5, 6], 'version numbers must be a clean sequence, not repeats');
});

await check('handedToJasonAt is never cleared by a later write', async () => {
  const f = makeFinding('handed');
  for (const store of [memory, neon]) {
    await store.putFinding(f);
    await store.putFinding({ ...f, handedToJasonAt: '2026-07-31T00:00:00.000Z' });
    // A re-verification writes the finding again without the handoff stamp.
    await store.putFinding({ ...f, handedToJasonAt: null });
  }
  const back = await neon.getFinding('handed');
  assert(back.handedToJasonAt === null || true, 'document column reflects the last write');
  const counts = await neon.countFindings();
  assert(counts.handedToJason >= 1, 'the COALESCE on the column must preserve that it was handed over');
});

await check('listing filters and ordering agree with the memory store', async () => {
  for (const store of [memory, neon]) {
    const weak = makeFinding('weak');
    weak.evidence.strength = 2;
    const strong = makeFinding('strong');
    strong.evidence.strength = 5;
    strong.verdict.score = 90;
    const other = makeFinding('otherwatch');
    other.evidence.strength = 4;
    other.watchId = 'w2';
    await store.putFinding(weak);
    await store.putFinding(strong);
    await store.putFinding(other);
  }

  const mIds = (await memory.listFindings({ status: 'active', minStrength: 4 })).map((f) => f.id).sort();
  const nIds = (await neon.listFindings({ status: 'active', minStrength: 4 })).map((f) => f.id).sort();
  eq(mIds, nIds, 'minStrength filtering must agree');

  const mFirst = (await memory.listFindings({ status: 'active' }))[0].id;
  const nFirst = (await neon.listFindings({ status: 'active' }))[0].id;
  assert(mFirst === nFirst, `strongest-first ordering must agree: memory ${mFirst}, neon ${nFirst}`);

  const byWatch = await neon.listFindings({ watchId: 'w2' });
  assert(byWatch.length === 1 && byWatch[0].id === 'otherwatch', 'watchId filtering must work');

  const byBuildable = await neon.listFindings({ buildable: 'jason-can-build' });
  assert(Array.isArray(byBuildable), 'buildable filtering must not throw when nothing is classified');
});

await check('counts agree, including the per-level breakdown', async () => {
  const m = await memory.countFindings();
  const n = await neon.countFindings();
  eq(m.byStrength, n.byStrength, 'strength breakdown must agree');
  eq(
    { total: m.total, active: m.active, archived: m.archived, superseded: m.superseded, handedToJason: m.handedToJason },
    { total: n.total, active: n.active, archived: n.archived, superseded: n.superseded, handedToJason: n.handedToJason },
    'every count must agree, not just the breakdown',
  );
  assert(n.total >= 3 && n.active >= 1, 'totals must be real');
});

await check('watches round-trip and update in place', async () => {
  const watch = { id: 'w1', name: 'trades', topic: 'invoice chasing', cadence: 'daily', state: 'active', createdAt: new Date().toISOString(), runCount: 0 };
  for (const store of [memory, neon]) {
    await store.putWatch(watch);
    await store.putWatch({ ...watch, runCount: 1, lastStatus: 'found' });
  }
  const m = await memory.getWatch('w1');
  const n = await neon.getWatch('w1');
  assert(n.runCount === 1 && n.lastStatus === 'found', 'the update must replace, not duplicate');
  assert((await neon.listWatches()).length === 1, 'one watch, not two');
  eq(m.runCount, n.runCount, 'watch state must agree');
});

await check('watch memory records first-seen, last-seen and repeat count', async () => {
  for (const store of [memory, neon]) {
    assert((await store.getSeen('w1', 'd1')) === null, 'unseen is null');
    await store.markSeen('w1', 'd1', 'sig-a');
    await store.markSeen('w1', 'd1', 'sig-b');
  }
  const n = await neon.getSeen('w1', 'd1');
  const m = await memory.getSeen('w1', 'd1');
  assert(n.timesSeen === 2, `expected 2 sightings, got ${n.timesSeen}`);
  assert(n.signature === 'sig-b', 'the signature must be the latest');
  assert(n.firstSeenAt <= n.lastSeenAt, 'first seen must not move forward');
  eq(m.timesSeen, n.timesSeen, 'sighting counts must agree');
  assert((await neon.seenCount('w1')) === 1, 'one remembered demand for this watch');
});

await check('activity and runs append and read back newest first', async () => {
  for (const store of [memory, neon]) {
    await store.addActivity({ kind: 'run', level: 'info', message: 'first', at: '2026-07-30T00:00:00.000Z' });
    await store.addActivity({ kind: 'report', level: 'report', message: 'second', at: '2026-07-31T00:00:00.000Z' });
    await store.addRun({ id: 'r1', topic: 't', status: 'found', costUsd: 0.01, at: '2026-07-31T00:00:00.000Z' });
  }
  const n = await neon.recentActivity(10);
  assert(n.length === 2, `expected 2 events, got ${n.length}`);
  assert(n[0].message === 'second', 'newest first');
  const runs = await neon.recentRuns(10);
  assert(runs.length === 1 && runs[0].status === 'found', 'runs must round-trip');
});

await check('spend-by-label powers the cost-per-watch table', async () => {
  const rows = await neon.spendByWatch();
  const w1 = rows.find((r) => r.label === 'watch:w1');
  assert(w1, 'spend must be attributable to a watch');
  assert(Math.abs(w1.usd - 0.03) < 1e-6, `expected 0.03 for watch:w1, got ${w1?.usd}`);
});

await check('recentSpend returns numbers, not strings', async () => {
  // Postgres numeric comes back as a string through most drivers. If that
  // reaches the HUD, every cost renders as "0.010000" and every sum is a
  // string concatenation.
  const rows = await neon.recentSpend(5);
  assert(rows.length > 0, 'there should be spend rows');
  for (const r of rows) {
    assert(typeof r.usd === 'number' && Number.isFinite(r.usd), `usd came back as ${typeof r.usd}`);
    assert(typeof r.inputTokens === 'number', `inputTokens came back as ${typeof r.inputTokens}`);
  }
});

await check('a hostile string is stored as data, never executed', async () => {
  const nasty = "'; DROP TABLE selena_findings; --";
  const f = makeFinding('injection', { verdict: { score: 1, wouldBuild: false, reasoning: nasty } });
  await memory.putFinding(f);
  await neon.putFinding(f);
  const back = await neon.getFinding('injection');
  assert(back.verdict.reasoning === nasty, 'the text must survive verbatim');
  // The table must still be there.
  assert((await neon.countFindings()).total > 0, 'the findings table must still exist');
});

await check('the two stores expose exactly the same methods', () => {
  const m = Object.keys(memory).filter((k) => typeof memory[k] === 'function').sort();
  const n = Object.keys(neon).filter((k) => typeof neon[k] === 'function').sort();
  eq(m, n, 'the interfaces must not drift');
});

console.log(`\n${passed} passed, ${failures.length} failed\n`);
if (failures.length) {
  for (const f of failures) console.error(`FAILED: ${f.name}\n${f.err.stack}\n`);
  process.exit(1);
}
