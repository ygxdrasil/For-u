#!/usr/bin/env node
/**
 * Stress round seven: what a year of use does to it.
 *
 *   node scripts/stress7.mjs
 *
 * The earlier rounds asked whether each piece works. This one asks what
 * happens when the same person uses it every day for a year: does approval
 * granted for one thing leak onto another, does a retry create a second copy
 * of a workflow, does the snapshot table grow without bound, does a month
 * boundary lose the spend, does one enormous documentation page eat a whole
 * turn's budget.
 *
 * None of these break anything today. All of them break something eventually,
 * quietly, and by then the cause is a fortnight in the past.
 */

import assert from 'node:assert/strict';

import { buildToolRegistry, APPROVAL_REQUIRED } from '../core/tools.js';
import { createN8nClient } from '../core/n8nClient.js';
import { createMemoryStore } from '../core/store.js';
import { createMeter } from '../core/meter.js';
import { assessReadiness } from '../core/readiness.js';
import { validateWorkflow } from '../core/validate.js';
import { run } from '../core/run.js';

let pass = 0;
const failures = [];
const notes = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n')[0] }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};
const section = (t) => process.stdout.write(`\n${t}\n  `);
const note = (t) => notes.push(t);

const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };

/** An n8n that keeps what it is given, like a real one. */
function fakeN8n({ workflows = {}, credentials = [] } = {}) {
  const state = new Map(Object.entries(workflows));
  const created = [];
  let nextId = 500;

  const impl = async (url, init) => {
    const path = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(init.body) : null;
    const reply = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });

    if (path === '/credentials') return reply({ data: credentials });
    if (path === '/tags') return reply({ data: [] });
    // The real list endpoint returns whole workflows, nodes included.
    if (method === 'GET' && path === '/workflows') return reply({ data: [...state.values()] });

    if (method === 'POST' && path === '/workflows') {
      const id = `wf${nextId++}`;
      const saved = { id, active: false, ...body };
      state.set(id, saved);
      created.push(saved);
      return reply(saved);
    }
    const match = path.match(/^\/workflows\/([^/]+)(\/.*)?$/);
    if (match) {
      const [, id, rest] = match;
      const existing = state.get(id);
      if (!existing) return reply({ message: 'not found' }, 404);
      if (rest === '/activate') { existing.active = true; return reply(existing); }
      if (rest === '/deactivate') { existing.active = false; return reply(existing); }
      if (method === 'PUT') { Object.assign(existing, body); return reply(existing); }
      return reply(existing);
    }
    return reply({ data: [] });
  };

  return { impl, state, created, client: createN8nClient({ baseUrl: 'https://n8n.invalid', apiKey: 'k', fetchImpl: impl }) };
}

const TRIGGER = { id: 't', name: 'Every morning', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: {} };
const SENDER = {
  id: 's', name: 'Email the list', type: 'n8n-nodes-base.emailSend', typeVersion: 2.1, position: [200, 0],
  parameters: { operation: 'send', toEmail: 'someone@real.example', subject: 'hi' },
};

/* ============================================ 1. an approval is for ONE thing */

section('1. An approval is for one thing');

await check('approving one activation does not activate a different workflow', async () => {
  // The gate is the whole point. If a yes for workflow A also lets B go live in
  // the same turn, the gate is decorative — and a model that has been told
  // "you may activate" will use it on whatever it is holding.
  const n8n = fakeN8n({
    workflows: {
      A: { id: 'A', name: 'The one you approved', nodes: [TRIGGER, SENDER], connections: {}, active: false },
      B: { id: 'B', name: 'A different one entirely', nodes: [TRIGGER, SENDER], connections: {}, active: false },
    },
  });

  const tools = buildToolRegistry({
    n8n: n8n.client, store: createMemoryStore(),
    // The shape a real approval arrives in: the user said yes to activating A.
    approvals: [{ action: APPROVAL_REQUIRED.ACTIVATE, target: 'A' }],
  });

  const activate = tools.find((t) => t.name === 'set_workflow_active');
  const onA = await activate.handler({ id: 'A', active: true });
  const onB = await activate.handler({ id: 'B', active: true });

  assert.equal(onA.ok, true, `the approved activation was refused: ${onA.error}`);
  assert.notEqual(onB.ok, true, 'a yes for one workflow switched on a different one');
  assert.equal(n8n.state.get('B').active, false, 'a workflow nobody approved is now live and sending email');
});

await check('the old unscoped approval shape still works, because people send it', async () => {
  // Backwards compatibility matters more than tidiness here: the browser sends
  // a bare string today, and a refusal that used to work would read as a
  // regression to whoever is looking at it.
  const n8n = fakeN8n({ workflows: { A: { id: 'A', name: 'X', nodes: [TRIGGER, SENDER], connections: {}, active: false } } });
  const tools = buildToolRegistry({ n8n: n8n.client, store: createMemoryStore(), approvals: [APPROVAL_REQUIRED.ACTIVATE] });
  const out = await tools.find((t) => t.name === 'set_workflow_active').handler({ id: 'A', active: true });
  assert.equal(out.ok, true, `a plain approval string stopped working: ${out.error}`);
});

await check('an approval says what it is for, so it can be shown before it is given', async () => {
  const n8n = fakeN8n({ workflows: { A: { id: 'A', name: 'Weekly digest', nodes: [TRIGGER, SENDER], connections: {}, active: false } } });
  const tools = buildToolRegistry({ n8n: n8n.client, store: createMemoryStore(), approvals: [] });
  const out = await tools.find((t) => t.name === 'set_workflow_active').handler({ id: 'A', active: true });
  assert.equal(out.needsApproval, APPROVAL_REQUIRED.ACTIVATE);
  assert.equal(out.approvalTarget, 'A', 'the request does not say WHICH workflow it is asking about');
  assert.match(out.error, /Weekly digest/);
});

/* ================================================ 2. the same thing, twice */

section('2. The same thing, twice');

await check('a retried save does not leave two copies of the workflow', async () => {
  // A turn times out after the save lands but before the answer arrives; the
  // model, resuming, saves again. Two identical workflows, one of which nobody
  // knows about — and this system never deletes, so it is there for good.
  const n8n = fakeN8n();
  const tools = buildToolRegistry({ n8n: n8n.client, store: createMemoryStore(), approvals: [] });
  const save = tools.find((t) => t.name === 'save_workflow');
  const workflow = {
    name: 'Halmstad scraper',
    nodes: [TRIGGER, { id: 'x', name: 'Step', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0], parameters: { mode: 'manual' } }],
    connections: { 'Every morning': { main: [[{ node: 'Step', type: 'main', index: 0 }]] } },
  };

  const first = await save.handler({ mode: 'create', workflow });
  const second = await save.handler({ mode: 'create', workflow });

  assert.equal(first.ok, true, first.error);
  assert.equal(
    n8n.created.length,
    1,
    `saving the same workflow twice created ${n8n.created.length} of them — and nothing here can delete the spare`,
  );
  assert.equal(second.id, first.id, 'the second save did not report the workflow that already exists');
});

await check('a genuinely different workflow with the same name is still created', async () => {
  const n8n = fakeN8n();
  const tools = buildToolRegistry({ n8n: n8n.client, store: createMemoryStore(), approvals: [] });
  const save = tools.find((t) => t.name === 'save_workflow');
  const step = { id: 'x', name: 'Step', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0], parameters: { mode: 'manual' } };
  await save.handler({ mode: 'create', workflow: { name: 'Scraper', nodes: [TRIGGER], connections: {} } });
  await save.handler({ mode: 'create', workflow: { name: 'Scraper', nodes: [TRIGGER, step], connections: { 'Every morning': { main: [[{ node: 'Step', type: 'main', index: 0 }]] } } } });
  assert.equal(n8n.created.length, 2, 'a real second version was mistaken for a duplicate and dropped');
});

/* ==================================================== 3. a year of history */

section('3. A year of history');

await check('saving the same workflow repeatedly does not store it repeatedly', async () => {
  // Pruning old snapshots is not an option: "never delete anything" does not
  // lapse because a table got big, and the snapshot is the safety net under
  // every overwrite. What CAN go is storing identical bytes over and over —
  // a save that changed nothing has nothing to recover.
  const store = createMemoryStore();
  const big = { name: 'Big', nodes: Array.from({ length: 60 }, (_, i) => ({ ...TRIGGER, id: `n${i}`, name: `Node ${i}` })), connections: {} };
  for (let i = 0; i < 200; i++) {
    await store.snapshot({ workflowId: 'wf1', name: 'Big', workflow: big, reason: `update ${i}` });
  }
  const report = await store.storageReport();
  note(`200 identical saves of a 60-node workflow: ${report.snapshots} snapshot(s), ${Math.round(report.approxBytes / 1024)}KB`);
  assert.equal(report.snapshots, 1, `${report.snapshots} copies of identical bytes, on a free tier of half a gigabyte`);
});

await check('every real change is still kept, in order, forever', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 40; i++) {
    await store.snapshot({ workflowId: 'wf1', name: 'X', workflow: { marker: i }, reason: `update ${i}` });
  }
  const kept = await store.listSnapshots('wf1');
  assert.equal(kept.length, 40, 'a real version was dropped — nothing here may delete a snapshot');
  assert.equal((await store.getSnapshot(kept.at(-1).id))?.workflow?.marker, 0, 'the oldest version is no longer recoverable');
});

await check('how much history is costing can be asked, not discovered', async () => {
  const store = createMemoryStore();
  await store.snapshot({ workflowId: 'wf1', name: 'X', workflow: { a: 1 }, reason: 'first' });
  const report = await store.storageReport();
  for (const field of ['snapshots', 'approxBytes', 'sessions', 'findings']) {
    assert.ok(field in report, `storageReport does not say anything about ${field}`);
  }
});

await check('spend from last month does not count against this month', async () => {
  const store = createMemoryStore();
  const lastMonth = new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString();
  await store.addSpend({ model: 'gemini-2.5-flash-lite', usd: 7.9, at: lastMonth });
  const meter = createMeter({ store, capUsd: 8 });
  await meter.assertCanSpend({ model: 'gemini-2.5-flash-lite', inputTokens: 1000, maxOutputTokens: 1000 });
  assert.equal(await store.getMonthlySpend(), 0, 'last month is still counting against this month');
});

await check('a conversation of 200 turns is still a sensible size', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 200; i++) {
    await store.appendSession('long', [{ role: 'user', parts: [{ text: `turn ${i} with realistic padding on the end of it` }] }], { limit: 40 });
  }
  const messages = (await store.getSession('long')).messages;
  assert.equal(messages.length, 40);
  assert.match(JSON.stringify(messages.at(-1)), /turn 199/, 'the newest turn was trimmed instead of the oldest');
});

/* ================================================== 4. what a turn costs */

section('4. What a turn costs');

await check('one enormous page cannot eat the whole turn', async () => {
  // A documentation page can be a megabyte. Everything a tool returns is billed
  // as input on every later step of the same turn, so one careless read is paid
  // for twenty times over.
  const huge = 'x'.repeat(2_000_000);
  const tools = buildToolRegistry({
    store: createMemoryStore(), n8n: null, approvals: [],
    fetchImpl: async () => new Response(huge, { status: 200, headers: { 'content-type': 'text/plain' } }),
    resolveHost: async () => [{ address: '93.184.216.34' }],
  });
  const out = await tools.find((t) => t.name === 'read_api').handler({ url: 'https://docs.example.org/everything' });
  assert.equal(out.ok, true, out.error);
  const size = JSON.stringify(out).length;
  assert.ok(size < 40_000, `one page came back as ${Math.round(size / 1000)}KB of tool result`);
  assert.equal(out.truncated, true, 'it was cut down without saying so');
});

await check('a turn that reads many pages is still bounded', async () => {
  const tools = buildToolRegistry({
    store: createMemoryStore(), n8n: null, approvals: [],
    fetchImpl: async () => new Response('y'.repeat(200_000), { status: 200, headers: { 'content-type': 'text/plain' } }),
    resolveHost: async () => [{ address: '93.184.216.34' }],
  });
  const read = tools.find((t) => t.name === 'read_api');
  let total = 0;
  for (let i = 0; i < 8; i++) {
    total += JSON.stringify(await read.handler({ url: `https://docs.example.org/page${i}` })).length;
  }
  note(`eight documentation reads in one turn: ${Math.round(total / 1000)}KB carried forward`);
  assert.ok(total < 200_000, `eight reads produced ${Math.round(total / 1000)}KB, all of it re-billed on every later step`);
});

/* ============================================== 5. readiness at real scale */

section('5. Readiness against the whole catalog');

await check('no node type in the catalog makes the readiness check throw', async () => {
  const { loadCatalog } = await import('../core/nodeIndex.js');
  const nodes = loadCatalog().nodes.slice(0, 517).map((n, i) => ({
    id: `n${i}`, name: `Node ${i}`, type: n.type, typeVersion: 1, position: [0, 0], parameters: {},
  }));
  const started = Date.now();
  const r = assessReadiness({ name: 'Everything', nodes: [TRIGGER, ...nodes], connections: {} }, { credentials: [] });
  const ms = Date.now() - started;
  note(`${nodes.length} node types assessed in ${ms}ms; ${r.blockers.length} would be blockers`);
  assert.ok(ms < 1500, `assessing every node type took ${ms}ms`);
});

await check('a 200-node workflow is assessed quickly', () => {
  const nodes = Array.from({ length: 200 }, (_, i) => ({
    id: `n${i}`, name: `Step ${i}`, type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [i * 40, 0],
    parameters: { mode: 'manual', values: { string: [{ name: 'a', value: `value ${i}` }] } },
  }));
  const started = Date.now();
  assessReadiness({ name: 'Big', nodes: [TRIGGER, ...nodes], connections: {} }, { credentials: [] });
  assert.ok(Date.now() - started < 500, 'assessing a large workflow is slow enough to notice');
});

await check('a workflow in another language is not told its values are placeholders', () => {
  const nodes = [
    TRIGGER,
    {
      id: 's', name: 'Skicka rapport', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0],
      parameters: { mode: 'manual', text: 'Rapport för Halmstad', arabic: 'تقرير يومي', chinese: '每日报告', emoji: '📊 daily' },
    },
  ];
  const r = assessReadiness({ name: 'X', nodes }, { credentials: [] });
  assert.deepEqual(r.blockers.filter((b) => b.kind === 'placeholder'), [], 'non-English text was called a placeholder');
});

/* ================================================ 6. the whole turn, hostile */

section('6. A turn where everything goes wrong at once');

await check('n8n down, model slow and a bad tool call still produce an answer', async () => {
  const store = createMemoryStore();
  const script = [
    { calls: [{ name: 'list_workflows', args: {} }] },
    { calls: [{ name: 'not_a_tool', args: {} }] },
    { text: 'n8n is unreachable, so I could not read anything. Nothing was changed.' },
  ];
  let i = 0;
  const model = () => ({ models: { generateContent: async () => {
    const step = script[Math.min(i++, script.length - 1)];
    return { text: step.text ?? '', functionCalls: step.calls ?? [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20 } };
  } } });

  const out = await run({
    text: 'what is running?',
    config: { ...cfg, n8nBaseUrl: 'https://n8n.invalid', n8nApiKey: 'k' },
    store,
    llmClientFactory: model,
    fetchImpl: async () => { throw new Error('ECONNREFUSED'); },
    deadlineMs: 20_000,
  }, {});

  assert.equal(out.status, 'ok', `everything going wrong produced ${out.status}: ${out.reply}`);
  assert.match(out.reply, /unreachable|could not/i);
  assert.ok(out.steps.length >= 2, 'the failed steps were not recorded');
});

await check('every tool called with junk still answers rather than throwing', async () => {
  const tools = buildToolRegistry({ store: createMemoryStore(), n8n: null, approvals: [] });
  const junk = [null, undefined, 0, '', [], { id: null }, { workflow: 'a string' }, { url: 123 }];
  const broken = [];
  for (const tool of tools) {
    for (const args of junk) {
      try {
        const out = await tool.handler(args);
        if (typeof out?.ok !== 'boolean') broken.push(`${tool.name} returned a non-result for ${JSON.stringify(args)}`);
      } catch (err) {
        broken.push(`${tool.name} THREW on ${JSON.stringify(args)}: ${err.message.slice(0, 60)}`);
      }
    }
  }
  assert.deepEqual(broken.slice(0, 5), [], broken.join(' | '));
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
if (notes.length) { console.log('\nNoted:'); for (const n of [...new Set(notes)]) console.log(`  · ${n}`); }
console.log('');
process.exit(failures.length ? 1 : 0);
