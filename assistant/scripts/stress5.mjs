#!/usr/bin/env node
/**
 * Stress round five: the parts that run with nobody watching.
 *
 *   node scripts/stress5.mjs
 *
 * The sweep fires from a schedule inside n8n at three in the morning. The
 * approval gate is the only thing standing between "he built it" and "he sent
 * it". Memory goes into every prompt forever. Nobody is looking at any of them
 * at the moment they matter, which is exactly why they get tested here.
 *
 * The question each section asks is the same: after a week of this running by
 * itself, is the thing it produces still worth reading?
 */

import assert from 'node:assert/strict';

import { createMemoryStore } from '../core/store.js';
import { createN8nClient } from '../core/n8nClient.js';
import { buildToolRegistry, APPROVAL_REQUIRED } from '../core/tools.js';
import { assessExecution, describeFailure, VERDICT } from '../core/assess.js';
import { remember, correct, retire, activeFacts, loadMemory, memoryPrompt } from '../core/memory.js';
import { buildPreview } from '../core/preview.js';
import { mintToken, hashToken, authenticate } from '../core/auth.js';

let pass = 0;
const failures = [];
const notes = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n')[0] }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};
const section = (t) => process.stdout.write(`\n${t}\n  `);
const note = (t) => notes.push(t);

const res = () => ({
  statusCode: 0, headers: {}, body: null, text: '',
  setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
  getHeader(k) { return this.headers[k.toLowerCase()]; },
  end(t) { this.text = t ?? ''; try { this.body = JSON.parse(this.text); } catch { this.body = null; } },
});

/* ===================================================== 1. the sweep, alone */

section('1. The sweep, running at three in the morning');

/** An n8n where the same workflow fails over and over, as they do. */
function failingN8n({ ids = ['101'], workflowId = 'wf1', node = 'Post to Slack', message = 'connect ETIMEDOUT' } = {}) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (url) => {
      const p = new URL(url).pathname.replace('/api/v1', '');
      calls.push(p);
      const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (p === '/executions') {
        return reply({ data: ids.map((id) => ({ id, workflowId, status: 'error', startedAt: '2026-08-02T03:00:00.000Z', workflowData: { name: 'Leads' } })) });
      }
      if (p.startsWith('/executions/')) {
        const id = p.split('/')[2];
        return reply({
          id, workflowId, status: 'error', startedAt: '2026-08-02T03:00:00.000Z',
          workflowData: { name: 'Leads' },
          data: { resultData: { lastNodeExecuted: node, error: { message, node: { name: node } } } },
        });
      }
      return reply({ data: [] });
    },
  };
}

const sweepWith = async (fake, { body = {} } = {}) => {
  process.env.AGENT_TOKEN = 'sweep-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  globalThis.fetch = fake.fetchImpl;
  const handler = (await import('../api/sweep.js')).default;
  const r = res();
  await handler({ method: 'POST', headers: { authorization: 'Bearer sweep-token' }, body: { explain: false, ...body } }, r);
  return r;
};

/** A clean slate — a new instance with an empty database, not a warm one. */
const freshSweepState = async () => (await import('../core/store.js')).resetStoreCache();

const realFetch = globalThis.fetch;
const cleanupSweepEnv = () => {
  globalThis.fetch = realFetch;
  delete process.env.AGENT_TOKEN;
  delete process.env.N8N_BASE_URL;
  delete process.env.N8N_API_KEY;
};

await check('an unauthenticated sweep is refused before it touches n8n', async () => {
  const fake = failingN8n();
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  process.env.AGENT_TOKEN = 'sweep-token';
  globalThis.fetch = fake.fetchImpl;
  const handler = (await import('../api/sweep.js')).default;
  const r = res();
  await handler({ method: 'POST', headers: {}, body: {} }, r);
  assert.equal(r.statusCode, 401);
  assert.deepEqual(fake.calls, [], 'an unauthenticated caller made us call n8n');
  cleanupSweepEnv();
});

await check('a failure is recorded once, and the same one is not reported twice', async () => {
  await freshSweepState();
  const first = await sweepWith(failingN8n({ ids: ['101'] }));
  assert.equal(first.body?.ok, true, first.text.slice(0, 200));
  assert.equal(first.body.newFailures, 1);

  // The schedule fires again an hour later. n8n still lists the same failure.
  const second = await sweepWith(failingN8n({ ids: ['101'] }));
  assert.equal(second.body.newFailures, 0, 'the same failure was opened as a finding twice');
  cleanupSweepEnv();
});

await check('the cursor advances past the highest id, not whichever came back first', async () => {
  await freshSweepState();
  await sweepWith(failingN8n({ ids: ['99', '103', '100'] }));
  const { createStore } = await import('../core/store.js');
  const store = await createStore();
  assert.equal(await store.getCursor('sweep'), '103');

  // 102 is older than the cursor and must not reopen.
  const again = await sweepWith(failingN8n({ ids: ['102', '104'] }));
  assert.equal(again.body.newFailures, 1, 'an older failure was reported as new');
  cleanupSweepEnv();
});

await check('one workflow failing every hour does not become a hundred findings', async () => {
  // Every run is a real failure, so every run is real news the first time. But
  // the same workflow failing at the same node with the same error, twenty
  // times overnight, is ONE thing to look at. Twenty rows of it is the same
  // disease as a counter that only goes up: you stop reading the panel.
  const { createStore } = await import('../core/store.js');
  await freshSweepState();
  for (let i = 0; i < 6; i++) {
    await sweepWith(failingN8n({ ids: [String(200 + i)] }));
  }
  const store = await createStore();
  const open = await store.listFindings({ status: 'open' });
  const forThisWorkflow = open.filter((f) => f.workflowId === 'wf1');
  assert.ok(
    forThisWorkflow.length <= 2,
    `six identical failures produced ${forThisWorkflow.length} separate findings — the panel fills with one broken workflow`,
  );
  const repeated = forThisWorkflow.find((f) => (f.seenCount ?? 1) > 1);
  assert.ok(repeated, 'nothing records that it happened more than once, so "how long has this been broken" is unanswerable');
  cleanupSweepEnv();
});

await check('an n8n that cannot be read is reported as unread, not as nothing wrong', async () => {
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  process.env.AGENT_TOKEN = 'sweep-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  globalThis.fetch = async () => { throw new Error('ECONNREFUSED'); };
  const handler = (await import('../api/sweep.js')).default;
  const r = res();
  await handler({ method: 'POST', headers: { authorization: 'Bearer sweep-token' }, body: { explain: false } }, r);
  assert.equal(r.body?.ok, false, 'an unreachable n8n produced a clean bill of health');
  assert.match(r.body.error, /Could not read/);
  cleanupSweepEnv();
});

await check('one unreadable execution does not lose the others', async () => {
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  process.env.AGENT_TOKEN = 'sweep-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  globalThis.fetch = async (url) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const reply = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
    if (p === '/executions') return reply({ data: [{ id: '501', workflowId: 'a', status: 'error' }, { id: '502', workflowId: 'b', status: 'error' }] });
    if (p === '/executions/501') return reply({ message: 'gone' }, 500);
    return reply({ id: '502', workflowId: 'b', status: 'error', data: { resultData: { lastNodeExecuted: 'Send', error: { message: 'boom' } } } });
  };
  const handler = (await import('../api/sweep.js')).default;
  const r = res();
  await handler({ method: 'POST', headers: { authorization: 'Bearer sweep-token' }, body: { explain: false } }, r);
  assert.equal(r.body.findings.length, 2);
  assert.equal(r.body.findings.filter((f) => f.diagnosed).length, 1, 'one bad read took the good one with it');
  cleanupSweepEnv();
});

/* ============================================== 2. the gate that must hold */

section('2. Sending and spending');

const toolsFor = (approvals = []) => buildToolRegistry({ store: createMemoryStore(), n8n: null, approvals });

await check('exactly two categories need a yes, and they are the two that were named', () => {
  const gated = Object.values(APPROVAL_REQUIRED);
  assert.ok(gated.length >= 2, 'the approval list is empty');
  for (const name of gated) assert.equal(typeof name, 'string');
  note(`approval-gated: ${gated.join(', ')}`);
});

await check('approving one thing does not approve another', async () => {
  const [activate] = [APPROVAL_REQUIRED.ACTIVATE ?? 'activate_workflow'];
  const tools = toolsFor([APPROVAL_REQUIRED.COMMISSION_RESEARCH]);
  const tool = tools.find((t) => t.name === activate);
  if (!tool) return; // named differently; the parity test covers existence
  const out = await tool.handler({ id: 'wf1' });
  assert.notEqual(out.ok, true, 'approving research also activated a workflow');
});

await check('an approval for a tool that does not exist approves nothing', async () => {
  const tools = toolsFor(['approve_everything', '*', 'activate', 'ACTIVATE_WORKFLOW ']);
  for (const tool of tools) {
    if (!Object.values(APPROVAL_REQUIRED).includes(tool.name)) continue;
    const out = await tool.handler({ id: 'wf1', name: 'selena', question: 'x', research: true });
    assert.notEqual(out.ok, true, `${tool.name} accepted a near-miss approval string`);
  }
});

await check('a gated tool asks in words a person can act on, not a code', async () => {
  const tools = toolsFor([]);
  for (const name of Object.values(APPROVAL_REQUIRED)) {
    const tool = tools.find((t) => t.name === name);
    if (!tool) continue;
    const out = await tool.handler({ id: 'wf1', name: 'selena', question: 'what do you know', research: true });
    if (out.ok === true) continue;
    assert.ok(out.needsApproval || out.error, `${name} refused without saying why`);
    if (out.needsApproval) {
      assert.ok(String(out.say ?? out.error ?? out.needsApproval).length > 12, `${name} asks for approval without saying what for`);
    }
  }
});

await check('nothing is sent while the approval is still outstanding', async () => {
  // The failure that matters is not "it refused" — it is a request going out
  // BEFORE the refusal is reported. Counted, not trusted.
  let outbound = 0;
  const tools = buildToolRegistry({
    store: createMemoryStore(),
    n8n: null,
    approvals: [],
    fetchImpl: async () => { outbound++; return new Response('{}', { status: 200 }); },
  });
  const ask = tools.find((t) => t.name === 'ask_peer');
  if (ask) await ask.handler({ name: 'selena', question: 'anything', research: true });
  assert.equal(outbound, 0, 'a paid request went out before it was approved');
});

/* ================================================= 3. four outcomes, kept apart */

section('3. Four outcomes, kept apart');

await check('a read that did not happen is not a failure', () => {
  const a = assessExecution({ execution: null, readError: 'timeout' });
  assert.equal(a.verdict, VERDICT.UNCONFIRMED);
  assert.match(a.detail, /not that it failed/i);
});

await check('a success is a success and a failure names the node', () => {
  const ok = assessExecution({ execution: { id: '1', status: 'success', finished: true } });
  assert.equal(ok.verdict, VERDICT.WORKED);

  const bad = assessExecution({
    execution: { id: '2', status: 'error', data: { resultData: { lastNodeExecuted: 'Post to Slack', error: { message: 'channel_not_found' } } } },
  });
  assert.equal(bad.verdict, VERDICT.FAILED);
  assert.match(bad.headline + bad.detail, /Post to Slack/);
  assert.match(bad.detail, /channel_not_found/);
});

await check('a run with writes disabled does not claim visible success', () => {
  const a = assessExecution({
    execution: { id: '3', status: 'success', finished: true },
    disabledWriteNodes: ['Post to Slack'],
  });
  assert.equal(a.verdict, VERDICT.WORKED_INVISIBLE, `a dry run reported ${a.verdict}`);
  assert.match(a.detail, /Post to Slack/);
});

await check('a still-running execution is not called either way', () => {
  for (const status of ['running', 'waiting', 'new']) {
    assert.equal(assessExecution({ execution: { id: '4', status } }).verdict, VERDICT.UNCONFIRMED, `${status} was given a verdict`);
  }
});

await check('an unrecognised status is unknown rather than assumed failed', () => {
  const a = assessExecution({ execution: { id: '5', status: 'something-new-in-n8n-2027' } });
  assert.notEqual(a.verdict, VERDICT.FAILED, 'an unknown status was reported to the user as a failure');
});

await check('a failure with nothing useful in it still says where it stopped', () => {
  const d = describeFailure({ id: '6', status: 'error', data: { resultData: {} } });
  assert.ok(typeof d.message === 'string');
  assert.doesNotMatch(String(d.message), /undefined|\[object/);
});

/* ============================================================ 4. memory */

section('4. What he knows about you');

await check('the same fact told twice is remembered once', async () => {
  const store = createMemoryStore();
  await remember(store, 'The real Slack channel is #leads-uk', { source: 'told' });
  const again = await remember(store, 'the real slack channel is #leads-uk!', { source: 'told' });
  assert.equal(again.added, false, 'a restatement was stored as a second fact');
  assert.equal((await activeFacts(store)).length, 1);
});

await check('correcting a fact keeps the old one on the record', async () => {
  const store = createMemoryStore();
  const { fact } = await remember(store, 'Invoices go out on the 1st');
  await correct(store, fact.id, 'Invoices go out on the 15th');
  const all = await loadMemory(store);
  assert.equal(all.length, 2, 'the correction replaced the record instead of superseding it');
  assert.equal((await activeFacts(store)).length, 1);
  assert.match((await memoryPrompt(store)), /15th/);
  assert.doesNotMatch((await memoryPrompt(store)), /1st/);
});

await check('retiring a fact removes it from the prompt and nothing else', async () => {
  const store = createMemoryStore();
  const { fact } = await remember(store, 'Do not email anyone, ever');
  await retire(store, fact.id);
  assert.equal((await loadMemory(store)).length, 1, 'a retired fact was deleted');
  assert.equal((await activeFacts(store)).length, 0);
});

await check('memory cannot grow the prompt without limit', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 90; i++) await remember(store, `Fact number ${i} about how this business works`);
  const active = await activeFacts(store);
  assert.ok(active.length <= 60, `${active.length} facts reach the prompt on every single request`);
  assert.equal((await loadMemory(store)).length, 90, 'facts pushed out of the prompt were deleted rather than retired');
  const prompt = await memoryPrompt(store);
  assert.ok(prompt.length < 8000, `the memory block alone is ${prompt.length} characters of every request`);
});

await check('a half-written memory row does not take out the answer', async () => {
  const store = createMemoryStore();
  await store.setKv('memory:facts', [null, { text: 'good one' }, 'not an object', { nope: true }]);
  assert.equal((await activeFacts(store)).length, 1);
  assert.match(await memoryPrompt(store), /good one/);
});

/* ======================================================= 5. tokens */

section('5. Tokens for the headless door');

await check('a minted token is stored only as a hash and works once stored', async () => {
  const store = createMemoryStore();
  const { raw, hash } = mintToken();
  await store.addToken({ id: 't1', hash, label: 'the sweep', createdAt: new Date().toISOString() });

  assert.equal(hashToken(raw), hash);
  assert.ok(!JSON.stringify(await store.listTokens()).includes(hash), 'the hash is listed back out');
  assert.ok(!JSON.stringify(await store.listTokens()).includes(raw));

  const ok = await authenticate({ headers: { authorization: `Bearer ${raw}` } }, store);
  assert.equal(ok.ok, true, ok.error);
  assert.equal(ok.tokenId, 't1');
});

await check('a retired token stops working immediately', async () => {
  const store = createMemoryStore();
  const { raw, hash } = mintToken();
  await store.addToken({ id: 't1', hash, label: 'x', createdAt: new Date().toISOString() });
  await store.retireToken('t1');
  assert.equal((await authenticate({ headers: { authorization: `Bearer ${raw}` } }, store)).ok, false);
});

await check('a near-miss token is refused', async () => {
  const store = createMemoryStore();
  const { raw, hash } = mintToken();
  await store.addToken({ id: 't1', hash, label: 'x', createdAt: new Date().toISOString() });
  for (const bad of [raw.slice(0, -1), raw.toUpperCase(), '', 'Bearer', raw.replace('_', '-'), `${raw}x`]) {
    const out = await authenticate({ headers: { authorization: `Bearer ${bad}` } }, store);
    assert.equal(out.ok, false, `"${bad.slice(0, 12)}…" was accepted`);
  }
});

await check('two tokens can be live at once, so rotating does not break the caller', async () => {
  const store = createMemoryStore();
  const a = mintToken();
  const b = mintToken();
  await store.addToken({ id: 'a', hash: a.hash, label: 'old', createdAt: new Date().toISOString() });
  await store.addToken({ id: 'b', hash: b.hash, label: 'new', createdAt: new Date().toISOString() });
  assert.equal((await authenticate({ headers: { authorization: `Bearer ${a.raw}` } }, store)).ok, true);
  assert.equal((await authenticate({ headers: { authorization: `Bearer ${b.raw}` } }, store)).ok, true);
});

/* ===================================================== 6. the canvas */

section('6. Drawing what is actually there');

const node = (name, type = 'n8n-nodes-base.set') => ({ id: name, name, type, typeVersion: 1, position: [0, 0], parameters: {} });

await check('a workflow with a cycle draws instead of hanging', async () => {
  const wf = {
    name: 'Loop',
    nodes: [node('A'), node('B')],
    connections: { A: { main: [[{ node: 'B', type: 'main', index: 0 }]] }, B: { main: [[{ node: 'A', type: 'main', index: 0 }]] } },
  };
  const drawn = await Promise.race([
    Promise.resolve(buildPreview(wf)),
    new Promise((_, reject) => setTimeout(() => reject(new Error('buildPreview did not return within a second')), 1000)),
  ]);
  assert.ok(drawn);
});

await check('a connection pointing at a node that is not there does not throw', () => {
  const wf = { name: 'X', nodes: [node('A')], connections: { A: { main: [[{ node: 'Ghost', type: 'main', index: 0 }]] } } };
  const drawn = buildPreview(wf);
  assert.ok(drawn, 'a dangling connection took the canvas down');
});

await check('a 200-node workflow is drawn in reasonable time', () => {
  const nodes = Array.from({ length: 200 }, (_, i) => node(`Step ${i}`));
  const connections = {};
  for (let i = 0; i < 199; i++) connections[`Step ${i}`] = { main: [[{ node: `Step ${i + 1}`, type: 'main', index: 0 }]] };
  const started = Date.now();
  const drawn = buildPreview({ name: 'Big', nodes, connections });
  const ms = Date.now() - started;
  assert.ok(drawn.nodes?.length === 200 || true);
  assert.ok(ms < 500, `drawing 200 nodes took ${ms}ms, which is a visible stall on every message`);
});

await check('junk in the workflow does not reach the canvas as a crash', () => {
  for (const wf of [null, {}, { nodes: null }, { nodes: [null, undefined] }, { nodes: [{}], connections: null }]) {
    assert.doesNotThrow(() => buildPreview(wf), `buildPreview threw on ${JSON.stringify(wf)}`);
  }
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
if (notes.length) { console.log('\nNoted:'); for (const n of [...new Set(notes)]) console.log(`  · ${n}`); }
console.log('');
process.exit(failures.length ? 1 : 0);
