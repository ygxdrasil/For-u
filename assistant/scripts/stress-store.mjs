#!/usr/bin/env node
/**
 * The two stores must behave identically.
 *
 *   npm install --no-save @electric-sql/pglite
 *   node scripts/stress-store.mjs
 *
 * Everything above core/store.js is written against one interface and tested
 * against the MEMORY implementation — while production runs entirely on the
 * Postgres one. That gap is the whole point of this file: it drives both
 * implementations through the same operations, against real SQL, and fails on
 * any difference a caller could notice.
 *
 * pglite is a dev-only convenience and deliberately not a dependency; without
 * it this script says so and exits rather than pretending to have checked.
 */

import assert from 'node:assert/strict';
import { createMemoryStore } from '../core/store.js';

let pglite = null;
try {
  pglite = await import('@electric-sql/pglite');
} catch {
  console.log('\nSKIPPED — @electric-sql/pglite is not installed, so the Postgres store was NOT tested.');
  console.log('Install it with:  npm install --no-save @electric-sql/pglite\n');
  process.exit(0);
}

let pass = 0;
const failures = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n').slice(0, 3).join(' ') }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};

/** A Neon-shaped tagged template over a real embedded Postgres. */
async function postgresStore() {
  const db = new pglite.PGlite();
  const sql = async (strings, ...values) => {
    const text = strings.reduce((acc, s, i) => acc + s + (i < values.length ? `$${i + 1}` : ''), '');
    const res = await db.query(text, values);
    return res.rows;
  };
  const { createNeonStore } = await import('../core/store.neon.js');
  return createNeonStore('postgres://test', { sqlImpl: sql });
}

const stores = async () => ({ memory: createMemoryStore(), postgres: await postgresStore() });

/** Run the same steps against both and compare what a caller would see. */
const bothMustAgree = async (label, steps, normalise = (x) => x) => {
  await check(label, async () => {
    const { memory, postgres } = await stores();
    const a = normalise(await steps(memory));
    const b = normalise(await steps(postgres));
    assert.deepEqual(b, a, `postgres behaved differently:\n  memory:   ${JSON.stringify(a)}\n  postgres: ${JSON.stringify(b)}`);
  });
};

process.stdout.write('\nBoth stores, identical operations\n  ');

/* ------------------------------------------------------------ key/value */

await bothMustAgree('key/value survives every shape it is asked to hold', async (s) => {
  const values = [
    { nested: { deep: [1, 2, { three: true }] } },
    ['array', 'of', 'strings'],
    'a plain string',
    42,
    true,
    null,
    { unicode: 'émoji 🔧 — ünïcode', quote: 'it\'s "quoted"', sql: "'; drop table app_kv; --" },
    { big: 'x'.repeat(50_000) },
  ];
  const out = [];
  for (const [i, v] of values.entries()) {
    await s.setKv(`k${i}`, v);
    out.push(await s.getKv(`k${i}`));
  }
  out.push(await s.getKv('never-written'));
  return out;
});

await bothMustAgree('overwriting a key replaces it rather than duplicating it', async (s) => {
  await s.setKv('same', { v: 1 });
  await s.setKv('same', { v: 2 });
  await s.setKv('same', { v: 3 });
  return s.getKv('same');
});

/* ---------------------------------------------------------------- spend */

await bothMustAgree('spend adds up the same way', async (s) => {
  await s.addSpend({ model: 'gemini-2.5-flash-lite', label: 'a', usd: 0.001234, inputTokens: 100, outputTokens: 50, at: new Date().toISOString() });
  await s.addSpend({ model: 'gemini-2.5-flash-lite', label: 'b', usd: 0.5, inputTokens: 1, outputTokens: 1, at: new Date().toISOString() });
  await s.addSpend({ model: 'gemini-2.5-pro', label: 'c', usd: 0, at: new Date().toISOString() });
  const total = await s.getMonthlySpend();
  return Number(total.toFixed(6));
});

await bothMustAgree('spend from a previous month is not counted in this one', async (s) => {
  await s.addSpend({ model: 'gemini-2.5-flash-lite', label: 'old', usd: 99, at: '2020-01-15T00:00:00.000Z' });
  await s.addSpend({ model: 'gemini-2.5-flash-lite', label: 'now', usd: 1, at: new Date().toISOString() });
  return Number((await s.getMonthlySpend()).toFixed(6));
});

await bothMustAgree('recent spend comes back newest first, with the amounts intact', async (s) => {
  for (let i = 0; i < 5; i++) {
    await s.addSpend({ model: 'm', label: `call${i}`, usd: i / 1000, at: new Date(Date.UTC(2030, 0, 1, 0, i)).toISOString() });
  }
  const rows = await s.recentSpend(3);
  return rows.map((r) => ({ label: r.label, usd: Number(r.usd) }));
});

/* ------------------------------------------------------------ snapshots */

await bothMustAgree('a snapshot round-trips with the workflow intact', async (s) => {
  const wf = { name: 'Leads', nodes: [{ name: 'Start', parameters: { text: 'ünicode ✅' } }], connections: {} };
  const snap = await s.snapshot({ workflowId: 'wf1', name: 'Leads', workflow: wf, reason: 'before update' });
  const back = await s.getSnapshot(snap.id);
  return { workflow: back.workflow, name: back.name, workflowId: back.workflowId, reason: back.reason };
});

await bothMustAgree('snapshots list newest first and filter by workflow', async (s) => {
  for (let i = 0; i < 3; i++) await s.snapshot({ workflowId: 'wf1', name: `v${i}`, workflow: { i }, reason: `r${i}` });
  await s.snapshot({ workflowId: 'wf2', name: 'other', workflow: {}, reason: 'x' });
  const mine = await s.listSnapshots('wf1');
  const all = await s.listSnapshots(null);
  return { mineCount: mine.length, allCount: all.length, mineNames: mine.map((x) => x.name), everyOneHasAnId: mine.every((x) => Boolean(x.id)) };
});

await bothMustAgree('a snapshot of nothing is still recorded rather than throwing', async (s) => {
  const snap = await s.snapshot({ workflowId: 'gone', name: null, workflow: null, reason: 'the workflow could not be read' });
  const back = await s.getSnapshot(snap.id);
  return { workflow: back.workflow, name: back.name };
});

/* ------------------------------------------------------------- findings */

await bothMustAgree('findings round-trip, list open ones and close', async (s) => {
  const a = await s.addFinding({ workflowId: 'wf1', workflowName: 'Leads', error: 'boom', failingNode: 'Slack' });
  await s.addFinding({ workflowId: 'wf2', workflowName: 'Other', error: 'bang' });
  const open = await s.listFindings({ status: 'open' });
  await s.updateFinding(a.id, { status: 'closed' });
  const stillOpen = await s.listFindings({ status: 'open' });
  return {
    openCount: open.length,
    afterClosing: stillOpen.length,
    fields: open.map((f) => ({ workflowId: f.workflowId, error: f.error, status: f.status })).sort((x, y) => String(x.workflowId).localeCompare(String(y.workflowId))),
  };
});

/* ----------------------------------------------------- jobs and sessions */

await bothMustAgree('a job round-trips so an unfinished turn can be resumed', async (s) => {
  const contents = [{ role: 'user', parts: [{ text: 'build it' }] }, { role: 'model', parts: [{ functionCall: { name: 'search_nodes', args: { query: 'slack' } } }] }];
  await s.saveJob({ id: 'job1', sessionId: 's1', contents, createdAt: new Date().toISOString(), status: 'paused' });
  const back = await s.getJob('job1');
  return { contents: back.contents, status: back.status, missing: await s.getJob('nope') };
});

await bothMustAgree('a session round-trips and an unknown one is empty, not missing', async (s) => {
  const empty = await s.getSession('never-seen');
  await s.saveSession({ id: 's1', messages: [{ role: 'user', parts: [{ text: 'hello' }] }] });
  await s.saveSession({ id: 's1', messages: [{ role: 'user', parts: [{ text: 'hello' }] }, { role: 'model', parts: [{ text: 'hi' }] }] });
  const back = await s.getSession('s1');
  return { emptyShape: empty, messageCount: back.messages.length, last: back.messages.at(-1) };
});

/* ---------------------------------------------------------------- tokens */

await bothMustAgree('tokens are found by hash, retired not removed, and never listed raw', async (s) => {
  await s.addToken({ id: 't1', label: 'agent', hash: 'hash-one', createdAt: new Date().toISOString() });
  await s.addToken({ id: 't2', label: 'other', hash: 'hash-two', createdAt: new Date().toISOString() });
  const found = await s.findTokenByHash('hash-one');
  await s.retireToken('t1');
  const afterRetiring = await s.findTokenByHash('hash-one');
  const listed = await s.listTokens();
  return {
    foundId: found?.id,
    afterRetiring,
    stillListed: listed.length,
    retiredIsMarked: Boolean(listed.find((t) => t.id === 't1')?.retiredAt),
    noHashesLeaked: !JSON.stringify(listed).includes('hash-one'),
  };
});

/* --------------------------------------------------------------- cursors */

await bothMustAgree('cursors round-trip', async (s) => {
  const before = await s.getCursor('sweep');
  await s.setCursor('sweep', { lastId: '42', at: '2030-01-01T00:00:00.000Z' });
  return { before, after: await s.getCursor('sweep') };
});

/* ------------------------------------------- the interface itself matches */

await check('both stores expose exactly the same interface', async () => {
  const { memory, postgres } = await stores();
  const shape = (s) => Object.entries(s).filter(([, v]) => typeof v === 'function').map(([k]) => k).sort();
  assert.deepEqual(shape(postgres), shape(memory), 'the two stores do not offer the same methods');
});

await check('nothing in the Postgres store deletes a row', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../core/store.neon.js', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/\bdelete\s+from\b/i.test(src), 'the Postgres store issues a DELETE');
  assert.ok(!/\bdrop\s+table\b/i.test(src), 'the Postgres store drops a table');
  assert.ok(!/\btruncate\b/i.test(src));
});

/* ------------------------------------------------- real work, real store */

await check('a full run works on Postgres, not just in memory', async () => {
  const { run } = await import('../core/run.js');
  const store = await postgresStore();
  const scripted = () => ({ models: { generateContent: async () => ({ text: 'done', functionCalls: [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20 } }) } });
  const r = await run({ text: 'what is running?', sessionId: 'live1', config: { geminiApiKey: 'k', monthlyCapUsd: 100 }, store, llmClientFactory: scripted }, {});
  assert.equal(r.status, 'ok', r.reply);
  assert.ok(r.spend.monthToDateUsd > 0, 'spend was not recorded to Postgres');
  assert.ok((await store.getSession('live1')).messages.length > 0, 'the session was not written to Postgres');
});

await check('a password and keys survive on Postgres', async () => {
  const store = await postgresStore();
  const { setupPassword, checkPassword, saveServerConfig, loadServerConfig, describeServerConfig, sessionSecret } = await import('../core/settings.js');
  await setupPassword(store, 'a-real-password');
  assert.equal(await checkPassword(store, 'a-real-password'), true);
  assert.equal(await checkPassword(store, 'wrong-password'), false);

  await saveServerConfig(store, { n8nBaseUrl: 'https://n8n.example', n8nApiKey: 'SECRET_KEY_VALUE', geminiApiKey: 'AIzaSECRET' });
  assert.equal((await loadServerConfig(store)).n8nApiKey, 'SECRET_KEY_VALUE');
  assert.doesNotMatch(JSON.stringify(await describeServerConfig(store)), /SECRET_KEY_VALUE|AIzaSECRET/);

  const a = await sessionSecret(store);
  assert.equal(a, await sessionSecret(store), 'the signing secret changed between reads — everyone would be signed out');
});

console.log(`\n\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
console.log('');
process.exit(failures.length ? 1 : 0);
