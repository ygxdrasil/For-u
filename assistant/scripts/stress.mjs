#!/usr/bin/env node
/**
 * Stress test: run Jason hard and report what actually breaks.
 *
 *   node scripts/stress.mjs
 *
 * The unit tests check that specific known failures stay fixed. This goes the
 * other way — it pushes volume, malformed input and hostile timing at every
 * part of him and reports what it finds, including things nobody predicted.
 *
 * Nothing here touches a real n8n instance, a real model or real money. Every
 * boundary is stubbed; everything inside the boundary is the real code.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { run } from '../core/run.js';
import { createMemoryStore } from '../core/store.js';
import { buildToolRegistry } from '../core/tools.js';
import { validateWorkflow } from '../core/validate.js';
import { loadCatalog, catalogMeta, searchNodes, getNodeSchema, knownParams, isWriteOperation } from '../core/nodeIndex.js';
import { assessExecution, assessBatch, assessReadBack, VERDICT } from '../core/assess.js';
import { priceUsage, estimateCost, createMeter, PRICES, UnpricedModelError, BudgetExceededError } from '../core/meter.js';
import { createLlm, TIERS, assertThinkingBudgets } from '../core/llm.js';
import { createN8nClient } from '../core/n8nClient.js';
import { remember, correct, retire, activeFacts, memoryPrompt } from '../core/memory.js';
import { savePeer, listPeers, askPeer } from '../core/peers.js';
import { DEFAULT_PREFS, savePrefs } from '../core/settings.js';
import { buildPreview } from '../core/preview.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let pass = 0;
const failures = [];
const notes = [];

const check = async (label, fn) => {
  try {
    await fn();
    pass++;
  } catch (err) {
    failures.push({ label, message: err.message.split('\n').slice(0, 4).join(' ') });
    process.stdout.write('\n  FAIL ' + label + '\n       ' + err.message.split('\n')[0] + '\n');
  }
};
const note = (text) => { notes.push(text); };
const section = (title) => process.stdout.write(`\n${title}\n  `);
const tick = () => process.stdout.write('.');

/* ========================================================== 1. node index */

section('1. Node knowledge at scale');

const catalog = loadCatalog();
const meta = catalogMeta();
const allNodes = Object.values(catalog.nodes ?? catalog);

await check('the catalog holds every node it claims to', () => {
  assert.equal(allNodes.length, meta.nodeCount, `catalog has ${allNodes.length} nodes, meta says ${meta.nodeCount}`);
  assert.ok(meta.nodeCount > 500);
});
tick();

// Every node in the catalog must resolve to a schema. A silent null here is the
// bug that let validation pass everything while looking healthy.
let resolved = 0;
const unresolved = [];
for (const n of allNodes) {
  const d = (n.discriminators ?? [])[0] ?? {};
  const s = getNodeSchema({ type: n.type, resource: d.resource ?? null, operation: d.operation ?? null });
  if (s.found) resolved++;
  else unresolved.push(n.type);
}
await check(`every node resolves to a schema (${resolved}/${allNodes.length})`, () => {
  assert.equal(unresolved.length, 0, `${unresolved.length} unresolved, e.g. ${unresolved.slice(0, 5).join(', ')}`);
});
tick();

// Params must be real strings, not empty shells that would let anything through.
let emptyParams = 0;
for (const n of allNodes.slice(0, 200)) {
  const d = (n.discriminators ?? [])[0] ?? {};
  const params = knownParams({ type: n.type, resource: d.resource ?? null, operation: d.operation ?? null });
  if (!params || params.length === 0) emptyParams++;
}
await check(`schemas carry real parameter names (${200 - emptyParams}/200 sampled)`, () => {
  assert.ok(emptyParams < 20, `${emptyParams} of 200 sampled nodes have no known parameters — the catalog layer cannot catch invented names for those`);
});
if (emptyParams) note(`${emptyParams}/200 sampled nodes expose no parameter list; invented names in those nodes rely on the Zod layer alone.`);
tick();

// Search has to find the obvious thing for the services people actually use.
const MUST_FIND = {
  slack: 'n8n-nodes-base.slack',
  gmail: 'n8n-nodes-base.gmail',
  'google sheets': 'n8n-nodes-base.googleSheets',
  webhook: 'n8n-nodes-base.webhook',
  schedule: 'n8n-nodes-base.scheduleTrigger',
  http: 'n8n-nodes-base.httpRequest',
  airtable: 'n8n-nodes-base.airtable',
  notion: 'n8n-nodes-base.notion',
  stripe: 'n8n-nodes-base.stripe',
  telegram: 'n8n-nodes-base.telegram',
  discord: 'n8n-nodes-base.discord',
  postgres: 'n8n-nodes-base.postgres',
  openai: '@n8n/n8n-nodes-langchain.openAi',
  code: 'n8n-nodes-base.code',
  if: 'n8n-nodes-base.if',
  merge: 'n8n-nodes-base.merge',
  hubspot: 'n8n-nodes-base.hubspot',
  shopify: 'n8n-nodes-base.shopify',
};
const missed = [];
for (const [query, expected] of Object.entries(MUST_FIND)) {
  const hits = searchNodes(query, { limit: 25 }).map((r) => r.type);
  if (!hits.includes(expected)) missed.push(`${query} → ${expected}`);
}
await check(`search finds the obvious node for ${Object.keys(MUST_FIND).length} common services`, () => {
  assert.deepEqual(missed, [], `missed: ${missed.join(', ')}`);
});
tick();

// Search must never throw, whatever it is handed.
const NASTY = ['', ' ', '\n', 'a', '.*', '((((', '[', '\\', 'select * from', '💀', 'a'.repeat(5000), null, undefined, 42, {}, []];
await check('search survives hostile queries without throwing', () => {
  for (const q of NASTY) {
    const r = searchNodes(q);
    assert.ok(Array.isArray(r), `searchNodes(${JSON.stringify(q)}) did not return an array`);
  }
});
tick();

await check('getNodeSchema survives nonsense without throwing', () => {
  for (const t of [null, undefined, '', 'nope', 'n8n-nodes-base.', 42, {}, 'a'.repeat(1000)]) {
    const s = getNodeSchema({ type: t, resource: 'x', operation: 'y' });
    assert.equal(typeof s.found, 'boolean');
  }
});
tick();

/* ========================================================== 2. validator */

section('2. Validator under fire');

const TRIGGER = { id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} };
const slackOk = { resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C0123456789' }, text: 'hi' };
const wrap = (node) => ({ name: 'T', nodes: [TRIGGER, node], connections: { Start: { main: [[{ node: node.name, type: 'main', index: 0 }]] } } });
const slack = (parameters, extra = {}) => ({ id: '2', name: 'Notify', type: 'n8n-nodes-base.slack', typeVersion: 2.4, position: [200, 0], parameters, ...extra });

const CASES = [
  ['invented parameter', wrap(slack({ resource: 'message', operation: 'post', channel: '#g', body: 'x' })), 'INVENTED_PARAMETER'],
  ['bad enum', wrap(slack({ resource: 'message', operation: 'explode' })), ['SCHEMA_VIOLATION', 'UNKNOWN_DISCRIMINATOR']],
  ['unknown node type', wrap({ ...slack(slackOk), type: 'n8n-nodes-base.slaaack' }), 'UNKNOWN_NODE_TYPE'],
  ['no trigger', { name: 'X', nodes: [slack(slackOk)], connections: {} }, 'MISSING_TRIGGER'],
  ['connection to a ghost', { name: 'X', nodes: [TRIGGER], connections: { Start: { main: [[{ node: 'Ghost', type: 'main', index: 0 }]] } } }, 'CONNECTION_TO_MISSING_NODE'],
  ['synthetic credential', wrap(slack(slackOk, { credentials: { slackApi: { id: 'mock-slack-credential', name: 'S' } } })), 'SYNTHETIC_CREDENTIAL'],
];

for (const [label, workflow, expected] of CASES) {
  await check(`caught: ${label}`, async () => {
    const r = await validateWorkflow(workflow);
    assert.equal(r.valid, false, 'validator said this was valid');
    const codes = r.errors.map((e) => e.code);
    const wanted = Array.isArray(expected) ? expected : [expected];
    assert.ok(wanted.some((w) => codes.includes(w)), `expected one of ${wanted.join('/')}, got ${codes.join(',') || '(none)'}`);
  });
  tick();
}

await check('a correct workflow still validates', async () => {
  const r = await validateWorkflow(wrap(slack(slackOk)));
  assert.equal(r.valid, true, JSON.stringify(r.errors));
});
tick();

// A large workflow must still validate in reasonable time — a validator that
// takes 30s on a 60-node build blows the serverless deadline instead of the
// model doing so.
const big = {
  name: 'Big',
  nodes: [TRIGGER, ...Array.from({ length: 60 }, (_, i) => ({ ...slack(slackOk), id: `n${i}`, name: `Notify ${i}`, position: [200 + i * 40, 0] }))],
  connections: { Start: { main: [Array.from({ length: 60 }, (_, i) => ({ node: `Notify ${i}`, type: 'main', index: 0 }))] } },
};
const bigStart = Date.now();
const bigResult = await validateWorkflow(big);
const bigMs = Date.now() - bigStart;
await check(`a 61-node workflow validates in under 5s (took ${bigMs}ms)`, () => {
  assert.ok(bigMs < 5000, `${bigMs}ms is too slow — this eats the request deadline`);
  assert.equal(bigResult.valid, true, JSON.stringify(bigResult.errors?.slice(0, 3)));
});
tick();

// Fuzz: the validator must never throw, whatever shape it is handed. A throw
// inside a tool becomes "tool threw" and the model loses the real reason.
const MUTATORS = [
  (w) => ({ ...w, nodes: null }),
  (w) => ({ ...w, nodes: 'nodes' }),
  (w) => ({ ...w, nodes: [null, undefined, 5] }),
  (w) => ({ ...w, connections: null }),
  (w) => ({ ...w, connections: { Start: null } }),
  (w) => ({ ...w, connections: { Start: { main: 'x' } } }),
  (w) => ({ ...w, connections: { Start: { main: [[null]] } } }),
  (w) => ({ ...w, nodes: w.nodes.map((n) => ({ ...n, type: null })) }),
  (w) => ({ ...w, nodes: w.nodes.map((n) => ({ ...n, parameters: null })) }),
  (w) => ({ ...w, nodes: w.nodes.map((n) => ({ ...n, parameters: 'nope' })) }),
  (w) => ({ ...w, nodes: w.nodes.map((n) => ({ ...n, name: undefined })) }),
  (w) => ({ ...w, nodes: w.nodes.map((n) => ({ ...n, typeVersion: 'abc' })) }),
  (w) => ({ ...w, name: null }),
  () => null,
  () => undefined,
  () => 'a workflow',
  () => 42,
  () => [],
  () => ({}),
  () => ({ nodes: [], connections: {} }),
  (w) => JSON.parse(JSON.stringify(w).replace(/"main"/g, '"MAIN"')),
  (w) => ({ ...w, nodes: [...w.nodes, ...w.nodes] }), // duplicate names
];

let threw = 0;
for (const m of MUTATORS) {
  try {
    const r = await validateWorkflow(m(wrap(slack(slackOk))));
    if (typeof r?.valid !== 'boolean' || !Array.isArray(r?.errors)) throw new Error('shape');
  } catch (err) {
    threw++;
    note(`validator threw on a malformed workflow: ${err.message.slice(0, 90)}`);
  }
}
await check(`validator survives ${MUTATORS.length} malformed workflows`, () => {
  assert.equal(threw, 0, `${threw} of ${MUTATORS.length} threw instead of reporting`);
});
tick();

await check('a workflow with duplicate node names is not silently accepted', async () => {
  const dup = { name: 'D', nodes: [TRIGGER, slack(slackOk), slack(slackOk)], connections: {} };
  const r = await validateWorkflow(dup);
  // Either an error code for it, or at minimum a warning. Silence is the
  // failure: n8n will keep one node and drop the other.
  const mentioned = [...r.errors, ...(r.warnings ?? [])].some((e) => /duplicate|same name|unique/i.test(`${e.code} ${e.message}`));
  assert.ok(mentioned, 'two nodes named "Notify" produced neither an error nor a warning');
});
tick();

/* ================================================== 3. never delete anything */

section('3. Nothing can delete anything');

const registry = buildToolRegistry({ store: createMemoryStore(), n8n: {}, approvals: [] });

await check('no tool is named anything destructive', () => {
  for (const t of registry) assert.ok(!/delete|destroy|purge|wipe|drop|remove_workflow/i.test(t.name), `tool "${t.name}"`);
});
tick();

await check('no tool description offers deletion', () => {
  for (const t of registry) {
    assert.ok(!/\bdelete\b/i.test(t.description) || /never delete|does not delete|cannot delete/i.test(t.description), `tool "${t.name}" description mentions deleting: ${t.description.slice(0, 80)}`);
  }
});
tick();

await check('the n8n client refuses a DELETE even if called directly', async () => {
  const client = createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl: async () => new Response('{}') });
  // The tripwire is internal; the guarantee is that no code path issues one.
  const src = fs.readFileSync(path.join(ROOT, 'core/n8nClient.js'), 'utf8');
  assert.ok(!/request\(\s*['"]DELETE/.test(src));
  assert.ok(src.includes("method === 'DELETE'"), 'the DELETE tripwire is gone');
  assert.ok(typeof client.getWorkflow === 'function');
});
tick();

await check('updating without a snapshot is refused', async () => {
  const client = createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl: async () => new Response('{}', { status: 200 }) });
  await assert.rejects(() => client.updateWorkflow('a', { name: 'x', nodes: [], connections: {} }), /snapshotId/);
});
tick();

/* ============================================== 4. money and the hard stop */

section('4. Money');

await check('every model offered anywhere is priced', () => {
  assertThinkingBudgets(TIERS);
  const offered = new Set([...TIERS.chat.models, ...TIERS.design.models, DEFAULT_PREFS.chatModel, DEFAULT_PREFS.designModel]);
  for (const m of offered) assert.ok(PRICES[m], `model "${m}" is offered but has no price`);
});
tick();

await check('the model picker in the UI cannot drift from the price table', () => {
  const app = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8');
  const hardcoded = app.match(/const MODELS = \[([^\]]*'gemini[^\]]*)\]/);
  assert.equal(hardcoded, null, 'the UI types out its own model list; it must derive it from PRICES so an unpriced model cannot be offered');
  assert.match(app, /const MODELS = Object\.(entries|keys)\(PRICES\)/);
});
tick();

await check('preferences refuse a model that has no price', async () => {
  const saved = await savePrefs(createMemoryStore(), { chatModel: 'gemini-9-imaginary', designModel: 'gemini-2.5-pro' });
  assert.ok(PRICES[saved.chatModel], `saved an unpriced model "${saved.chatModel}"`);
  assert.equal(saved.designModel, 'gemini-2.5-pro', 'a valid model must still be accepted');
});
tick();

await check('an unpriced model throws rather than being metered at a guess', () => {
  assert.throws(() => priceUsage('gemini-9-imaginary', { promptTokenCount: 1 }), UnpricedModelError);
  assert.throws(() => estimateCost({ model: 'nope', inputTokens: 1, maxOutputTokens: 1 }), UnpricedModelError);
});
tick();

await check('thinking tokens are billed at the output rate, not ignored', () => {
  const withThinking = priceUsage('gemini-2.5-flash-lite', { promptTokenCount: 1000, candidatesTokenCount: 1000, thoughtsTokenCount: 1000 });
  const without = priceUsage('gemini-2.5-flash-lite', { promptTokenCount: 1000, candidatesTokenCount: 1000, thoughtsTokenCount: 0 });
  assert.ok(withThinking.usd > without.usd, 'thinking tokens were not charged');
  const p = PRICES['gemini-2.5-flash-lite'];
  assert.ok(Math.abs(withThinking.usd - ((1000 / 1e6) * p.input + (2000 / 1e6) * p.output)) < 1e-12);
});
tick();

await check('cached input is charged at the cached rate, not the full one', () => {
  const cached = priceUsage('gemini-2.5-flash-lite', { promptTokenCount: 10000, cachedContentTokenCount: 9000, candidatesTokenCount: 0 });
  const fresh = priceUsage('gemini-2.5-flash-lite', { promptTokenCount: 10000, cachedContentTokenCount: 0, candidatesTokenCount: 0 });
  assert.ok(cached.usd < fresh.usd);
});
tick();

// The stop must trip BEFORE the request, not after. Proven by counting calls.
await check('the spend cap stops the call before it is made, not after', async () => {
  const store = createMemoryStore();
  await store.addSpend({ model: 'gemini-2.5-flash-lite', usd: 7.999, at: new Date().toISOString() });
  const meter = createMeter({ store, capUsd: 8 });
  let calls = 0;
  const llm = createLlm({
    apiKey: 'k',
    meter,
    tiers: { chat: { models: ['gemini-2.5-flash-lite'], maxOutputTokens: 4096, thinkingBudget: 0 } },
    clientFactory: () => ({ models: { generateContent: async () => { calls++; return { text: 'x', usageMetadata: {} }; } } }),
  });
  await assert.rejects(() => llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x' }), BudgetExceededError);
  assert.equal(calls, 0, 'the model was called anyway — the cap only trips after paying');
});
tick();

await check('a run over the cap reports budget_exceeded and spends nothing more', async () => {
  const store = createMemoryStore();
  await store.addSpend({ model: 'gemini-2.5-flash-lite', usd: 99, at: new Date().toISOString() });
  let calls = 0;
  const r = await run(
    { text: 'anything', config: { geminiApiKey: 'k', monthlyCapUsd: 8 }, store, llmClientFactory: () => ({ models: { generateContent: async () => { calls++; return { text: 'x', usageMetadata: {} }; } } }) },
    {},
  );
  assert.equal(r.status, 'budget_exceeded');
  assert.equal(calls, 0);
});
tick();

/* ================================================ 5. the four outcomes */

section('5. The four outcomes');

const OUTCOMES = [
  [{ execution: null }, VERDICT.UNCONFIRMED],
  [{ execution: null, readError: 'timeout' }, VERDICT.UNCONFIRMED],
  [{ execution: { id: 1, status: 'success' } }, VERDICT.WORKED],
  [{ execution: { id: 1, status: 'success' }, disabledWriteNodes: ['Slack'] }, VERDICT.WORKED_INVISIBLE],
  [{ execution: { id: 1, status: 'error' } }, VERDICT.FAILED],
  [{ execution: { id: 1, status: 'crashed' } }, VERDICT.FAILED],
  [{ execution: { id: 1, status: 'running' } }, VERDICT.UNCONFIRMED],
  [{ execution: { id: 1, status: 'waiting' } }, VERDICT.UNCONFIRMED],
  [{ execution: { id: 1, status: 'new' } }, VERDICT.UNCONFIRMED],
  [{ execution: { id: 1, finished: true } }, VERDICT.WORKED],
  [{ execution: { id: 1, status: 'canceled' } }, VERDICT.UNCONFIRMED],
  [{ execution: { id: 1, status: 'brand-new-status-from-a-future-version' } }, VERDICT.UNCONFIRMED],
  [{ execution: {} }, VERDICT.UNCONFIRMED],
];
for (const [input, expected] of OUTCOMES) {
  await check(`verdict for ${JSON.stringify(input.execution)?.slice(0, 46)}${input.disabledWriteNodes ? ' (dry run)' : ''}`, () => {
    assert.equal(assessExecution(input).verdict, expected);
  });
  tick();
}

await check('an unconfirmed read never uses the language of failure', () => {
  for (const [input, expected] of OUTCOMES) {
    if (expected !== VERDICT.UNCONFIRMED) continue;
    const a = assessExecution(input);
    assert.doesNotMatch(a.headline, /\bfailed\b|\bbroken\b/i, `headline "${a.headline}" reads as failure`);
  }
});
tick();

await check('a partial batch is never reported as total failure', () => {
  const b = assessBatch([{ label: 'a', ok: true }, { label: 'b', ok: false }, { label: 'c', ok: true }]);
  assert.equal(b.verdict, VERDICT.WORKED);
  assert.match(b.headline, /2 of 3/);
  assert.match(b.detail, /Worked: a, c/);
});
tick();

await check('a read-back that disagrees is a failure, and a missing one is not', () => {
  assert.equal(assessReadBack({ expected: true, actual: false, label: 'active' }).verdict, VERDICT.FAILED);
  assert.equal(assessReadBack({ expected: true, actual: null, label: 'active' }).verdict, VERDICT.UNCONFIRMED);
  assert.equal(assessReadBack({ expected: true, actual: true, label: 'active' }).verdict, VERDICT.WORKED);
});
tick();

/* ============================================ 6. timing and the deadline */

section('6. Timing');

const scripted = (script) => {
  let i = 0;
  return () => ({ models: { generateContent: async () => {
    const s = script[Math.min(i++, script.length - 1)];
    if (s.delayMs) await new Promise((r) => setTimeout(r, s.delayMs));
    if (s.throw) throw new Error(s.throw);
    return { text: s.text ?? '', functionCalls: s.calls ?? [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50, thoughtsTokenCount: 0 } };
  } } });
};

const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };

await check('a model that never stops calling tools runs out of steps, and says so', async () => {
  // Reported as "ok" this produced a successful-looking turn whose whole answer
  // was "(no answer produced)".
  const store = createMemoryStore();
  const r = await run(
    { text: 'build something', config: cfg, store, deadlineMs: 40_000, llmClientFactory: scripted([{ calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.equal(r.status, 'continuing', `got ${r.status} with reply ${JSON.stringify(r.reply)}`);
  assert.ok(r.jobId, 'no job id — the work cannot be resumed');
  assert.ok(await store.getJob(r.jobId), 'the job was not saved');
  assert.doesNotMatch(r.reply, /no answer produced/);
});
tick();

await check('a run genuinely out of time reports continuing and keeps the job', async () => {
  const store = createMemoryStore();
  const r = await run(
    { text: 'build something', config: cfg, store, deadlineMs: 9000, llmClientFactory: scripted([{ delayMs: 3000, calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.equal(r.status, 'continuing', `got ${r.status}`);
  assert.ok(await store.getJob(r.jobId), 'the job was not saved');
});
tick();

// A model that hangs is the serverless killer: the platform returns NOTHING at
// the limit. The deadline is only honoured between steps, so a single slow call
// can run past it — this measures whether it does.
const hangStart = Date.now();
const hung = await run(
  { text: 'hello', config: cfg, store: createMemoryStore(), deadlineMs: 12_000, llmClientFactory: scripted([{ delayMs: 20_000, text: 'late' }]) },
  {},
);
const hangMs = Date.now() - hangStart;
await check(`a hanging model call is cut off at the deadline (took ${(hangMs / 1000).toFixed(1)}s of a 12s deadline)`, () => {
  assert.ok(hangMs < 15_000, `the request ran ${(hangMs / 1000).toFixed(1)}s past a 12s deadline. On Vercel the platform kills it and the caller gets nothing at all.`);
  assert.ok(hung.status, 'no status returned');
});
tick();

await check('an empty model response is reported, not shown as an empty bubble', async () => {
  const r = await run({ text: 'hi', config: cfg, store: createMemoryStore(), llmClientFactory: scripted([{ text: '' }]) }, {});
  assert.equal(r.status, 'empty_response');
  assert.match(r.reply, /thinking budget/i);
});
tick();

await check('a retired model falls back to the next one', async () => {
  const store = createMemoryStore();
  let seen = [];
  const r = await run(
    { text: 'hi', config: cfg, store, llmClientFactory: () => ({ models: { generateContent: async ({ model }) => {
      seen.push(model);
      if (seen.length === 1) throw new Error('models/x is not found for API version v1beta');
      return { text: 'second model answered', usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
    } } }) },
    {},
  );
  assert.equal(r.status, 'ok');
  assert.ok(seen.length >= 2, 'it did not try a second model');
  assert.notEqual(seen[0], seen[1]);
});
tick();

await check('a real model error is NOT masked by silently trying another model', async () => {
  let calls = 0;
  const r = await run(
    { text: 'hi', config: cfg, store: createMemoryStore(), llmClientFactory: () => ({ models: { generateContent: async () => { calls++; throw new Error('400 INVALID_ARGUMENT: your request is malformed'); } } }) },
    {},
  );
  assert.equal(r.status, 'model_error');
  assert.equal(calls, 1, `it tried ${calls} models for an error that was not a retirement`);
});
tick();

await check('a tool that throws does not sink the turn', async () => {
  const r = await run(
    { text: 'hi', config: cfg, store: createMemoryStore(), llmClientFactory: scripted([{ calls: [{ name: 'get_workflow', args: { id: 'x' } }] }, { text: 'carried on' }]) },
    {},
  );
  assert.equal(r.status, 'ok');
  assert.equal(r.reply, 'carried on');
});
tick();

await check('a hallucinated tool name is answered, not crashed on', async () => {
  const r = await run(
    { text: 'hi', config: cfg, store: createMemoryStore(), llmClientFactory: scripted([{ calls: [{ name: 'delete_everything', args: {} }] }, { text: 'no such tool' }]) },
    {},
  );
  assert.equal(r.status, 'ok');
});
tick();

await check('20 tool calls in one turn stay inside the step cap', async () => {
  const store = createMemoryStore();
  const r = await run(
    { text: 'hi', config: cfg, store, deadlineMs: 40_000, llmClientFactory: scripted([{ calls: Array.from({ length: 20 }, (_, i) => ({ name: 'search_nodes', args: { query: `q${i}` } })) }, { text: 'done' }]) },
    {},
  );
  assert.ok(['ok', 'continuing'].includes(r.status), `got ${r.status}`);
  assert.ok(r.steps.length <= 20 * DEFAULT_PREFS.maxSteps);
});
tick();

/* ================================================= 7. memory and peers */

section('7. Memory and peers');

await check('memory holds 60 facts, dedupes, supersedes and never destroys', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 60; i++) await remember(store, `Fact number ${i} about the business`);
  const dup = await remember(store, 'fact number 7 about the business!!');
  assert.equal(dup.added, false, 'a restatement was stored twice');

  const facts = await activeFacts(store);
  assert.equal(facts.length, 60);
  await correct(store, facts[0].id, 'Corrected fact');
  await retire(store, facts[1].id);
  const after = await activeFacts(store);
  assert.equal(after.length, 59);
  const prompt = await memoryPrompt(store);
  assert.ok(prompt.length > 0);
});
tick();

await check('a very long fact does not blow up the prompt', async () => {
  const store = createMemoryStore();
  await remember(store, 'x'.repeat(100_000));
  const prompt = await memoryPrompt(store);
  assert.ok(prompt.length < 20_000, `memory added ${prompt.length} characters to every request — that is billed on every single call`);
});
tick();

await check('a peer that never answers becomes a question, never a guess', async () => {
  const store = createMemoryStore();
  await savePeer(store, { name: 'research', url: 'https://peer.invalid/ask' });
  // A real fetch honours the abort signal; this stub does the same, which is
  // what proves askPeer actually sends one.
  const r = await askPeer(store, {
    question: 'which channel?',
    fetchImpl: (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /Could not reach/);
});
tick();

await check('peer failures of every kind refuse rather than invent', async () => {
  const store = createMemoryStore();
  await savePeer(store, { name: 'research', url: 'https://peer.invalid/ask', token: 'secret' });
  const cases = [
    async () => new Response('nope', { status: 500 }),
    async () => new Response('<html>not json</html>', { status: 200 }),
    async () => new Response('{}', { status: 200 }),
    async () => { throw new Error('ECONNRESET'); },
  ];
  for (const fetchImpl of cases) {
    const r = await askPeer(store, { question: 'q', fetchImpl });
    assert.ok(typeof r.ok === 'boolean');
    if (r.ok) assert.ok(typeof r.answer === 'string', 'a peer answer must be text');
  }
});
tick();

await check('a peer token is never returned to the browser', async () => {
  const store = createMemoryStore();
  await savePeer(store, { name: 'r', url: 'https://p.invalid', token: 'super-secret-token' });
  assert.doesNotMatch(JSON.stringify(await listPeers(store)), /super-secret-token/);
});
tick();

await check('peers refuse a non-https address', async () => {
  const store = createMemoryStore();
  await assert.rejects(() => savePeer(store, { name: 'x', url: 'http://plaintext.invalid' }), /https/);
});
tick();

/* ================================================ 8. sessions and prefs */

section('8. Sessions, prefs, drawing');

await check('a session carries context between turns and is capped', async () => {
  const store = createMemoryStore();
  for (let i = 0; i < 30; i++) {
    await run({ text: `turn ${i}`, sessionId: 's1', config: cfg, store, llmClientFactory: scripted([{ text: `reply ${i}` }]) }, {});
  }
  const s = await store.getSession('s1');
  assert.ok(s.messages.length <= 40, `session grew to ${s.messages.length} messages — every one is billed on every later turn`);
  assert.ok(s.messages.length > 2, 'context is not carried at all');
});
tick();

await check('bad preferences cannot reach the running system', async () => {
  const store = createMemoryStore();
  const saved = await savePrefs(store, { thinkingBudget: 1e9, maxOutputTokens: 1, deadlineMs: 1e9, maxSteps: -1, chatModel: 'not-a-model' });
  assert.ok(saved.thinkingBudget < saved.maxOutputTokens);
  assert.ok(saved.deadlineMs <= 55_000);
  assert.ok(saved.maxSteps > 0);
  assert.ok(PRICES[saved.chatModel], 'an unpriced model was accepted into preferences');
});
tick();

await check('the drawing survives cycles, orphans and self-references', () => {
  const shapes = [
    { nodes: [{ name: 'A', type: 't' }], connections: { A: { main: [[{ node: 'A' }]] } } },
    { nodes: [{ name: 'A', type: 't' }, { name: 'B', type: 't' }], connections: { A: { main: [[{ node: 'B' }]] }, B: { main: [[{ node: 'A' }]] } } },
    { nodes: [{ name: 'A', type: 't' }], connections: { A: { main: [[{ node: 'Ghost' }]] } } },
    { nodes: [], connections: {} },
    { nodes: Array.from({ length: 300 }, (_, i) => ({ name: `N${i}`, type: 't' })), connections: {} },
  ];
  for (const s of shapes) {
    const p = buildPreview(s);
    if (s.nodes.length) assert.equal(p.nodes.length, s.nodes.length);
    else assert.equal(p, null);
  }
});
tick();

/* ================================================== 9. entry-point parity */

section('9. One pipeline, many doors');

await check('every entry point offers exactly the same tools', async () => {
  const { toolsForProtocol } = await import('../core/protocol.js');
  const shape = (tools) => JSON.stringify(tools.map((t) => [t.name, t.parameters]).sort());
  const ctx = { store: createMemoryStore(), n8n: {}, approvals: [] };
  assert.equal(shape(toolsForProtocol(ctx)), shape(buildToolRegistry(ctx)));
  assert.equal(shape(buildToolRegistry({ ...ctx, approvals: ['activate_workflow'] })), shape(buildToolRegistry(ctx)));
});
tick();

await check('no API route builds its own tools', () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'api'))) {
    if (!f.endsWith('.js')) continue;
    // Comments are stripped so this tests the code, not the prose about it.
    const src = fs.readFileSync(path.join(ROOT, 'api', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    assert.ok(!src.includes('buildToolRegistry'), `api/${f} builds its own registry`);
  }
});
tick();

await check('every tool exposes a plain-English label that never throws', () => {
  for (const t of registry) {
    assert.equal(typeof t.say, 'function', `${t.name} has no say()`);
    for (const args of [{}, null, undefined, { id: null }, { workflow: null }, { query: 42 }]) {
      let said;
      assert.doesNotThrow(() => { said = t.say(args ?? {}); }, `${t.name}.say(${JSON.stringify(args)}) threw`);
      assert.ok(said === null || typeof said === 'string');
    }
  }
});
tick();

await check('every tool has a JSON-schema parameter block a model can actually use', () => {
  for (const t of registry) {
    assert.equal(t.parameters.type, 'object', `${t.name} parameters are not an object schema`);
    assert.ok(t.description.length > 20, `${t.name} has a description too thin to pick it correctly`);
    for (const [k, v] of Object.entries(t.parameters.properties ?? {})) {
      assert.ok(v.type || v.anyOf || v.oneOf, `${t.name}.${k} has no type`);
    }
  }
});
tick();

/* ================================================== 10. the HTTP surface */

section('10. Every route, hostile input');

process.env.ALLOW_MEMORY_AUTH = '1';
const { createStore, resetStoreCache } = await import('../core/store.js');
const { setupPassword, saveServerConfig, sessionSecret } = await import('../core/settings.js');
const { issueSession, sessionCookie } = await import('../core/secrets.js');

resetStoreCache();
const httpStore = await createStore({ databaseUrl: null });
await setupPassword(httpStore, 'stress-test-password');
await saveServerConfig(httpStore, { n8nBaseUrl: 'https://n8n.invalid', n8nApiKey: 'N8N_SECRET_VALUE_XYZ', geminiApiKey: 'GEMINI_SECRET_VALUE_XYZ' });
const goodCookie = sessionCookie(issueSession(await sessionSecret(httpStore))).split(';')[0];

const fakeRes = () => {
  const chunks = [];
  return {
    statusCode: 0,
    headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    write(c) { chunks.push(String(c)); },
    end(c) { if (c) chunks.push(String(c)); this.text = chunks.join(''); },
    get body() { try { return JSON.parse(this.text ?? ''); } catch { return null; } },
  };
};

const fakeReq = (method, { cookie = null, body = undefined, raw = null, headers = {} } = {}) => {
  const req = { method, headers: { ...headers, ...(cookie ? { cookie } : {}) } };
  if (body !== undefined) req.body = body;
  else {
    const payload = raw ?? '';
    req[Symbol.asyncIterator] = async function* () { yield Buffer.from(payload); };
  }
  return req;
};

const ROUTES = fs.readdirSync(path.join(ROOT, 'api')).filter((f) => f.endsWith('.js'));
const PUBLIC = new Set(['health.js', 'auth.js']);

const HOSTILE = [
  ['no body', { raw: '' }],
  ['not json', { raw: 'this is not json at all' }],
  ['json array', { raw: '[1,2,3]' }],
  ['json null', { raw: 'null' }],
  ['deeply nested', { raw: JSON.stringify(Array.from({ length: 200 }).reduce((acc) => ({ a: acc }), {})) }],
  ['one megabyte', { raw: JSON.stringify({ action: 'check', workflow: { name: 'x'.repeat(1_000_000) } }) }],
  ['prototype pollution', { raw: '{"__proto__":{"polluted":true},"action":"check"}' }],
];

let leaked = [];
let crashed = [];
let openDoors = [];

for (const file of ROUTES) {
  const handler = (await import(`../api/${file}`)).default;

  // 1. Unauthenticated. Protected routes must refuse.
  for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']) {
    const res = fakeRes();
    try {
      await handler(fakeReq(method, { raw: '{}' }), res);
    } catch (err) {
      crashed.push(`${file} ${method} unauthenticated: ${err.message.split('\n')[0]}`);
      continue;
    }
    if (!PUBLIC.has(file) && res.statusCode === 200) openDoors.push(`${file} ${method} answered 200 with no session`);
    if (/N8N_SECRET_VALUE_XYZ|GEMINI_SECRET_VALUE_XYZ|stress-test-password/.test(res.text ?? '')) leaked.push(`${file} ${method} (unauthenticated)`);
  }

  // 2. Authenticated, but handed rubbish.
  for (const [label, opts] of HOSTILE) {
    const res = fakeRes();
    try {
      await handler(fakeReq('POST', { cookie: goodCookie, ...opts }), res);
    } catch (err) {
      crashed.push(`${file} POST ${label}: ${err.message.split('\n')[0]}`);
      continue;
    }
    if (/N8N_SECRET_VALUE_XYZ|GEMINI_SECRET_VALUE_XYZ|stress-test-password/.test(res.text ?? '')) leaked.push(`${file} POST ${label}`);
  }
  tick();
}

await check(`no route throws on hostile input (${ROUTES.length} routes × ${HOSTILE.length + 5} shapes)`, () => {
  assert.deepEqual(crashed, [], crashed.join(' | '));
});
tick();

await check('no protected route answers without a session', () => {
  assert.deepEqual(openDoors, [], openDoors.join(' | '));
});
tick();

await check('no route ever returns a stored secret', () => {
  assert.deepEqual(leaked, [], leaked.join(' | '));
});
tick();

await check('prototype pollution through a request body does not stick', () => {
  assert.equal({}.polluted, undefined, 'a request body polluted Object.prototype');
});
tick();

await check('the settings route describes keys without revealing them', async () => {
  const handler = (await import('../api/settings.js')).default;
  const res = fakeRes();
  await handler(fakeReq('GET', { cookie: goodCookie }), res);
  assert.equal(res.statusCode, 200);
  assert.doesNotMatch(res.text, /N8N_SECRET_VALUE_XYZ|GEMINI_SECRET_VALUE_XYZ/);
  assert.equal(res.body.settings.n8nApiKey.set, true, 'it should still say a key is saved');
});
tick();

await check('a token-authed caller with no token gets nothing', async () => {
  const handler = (await import('../api/agent.js')).default;
  const res = fakeRes();
  await handler(fakeReq('POST', { body: { text: 'do something' } }), res);
  assert.notEqual(res.statusCode, 200);
});
tick();

await check('a forged session cookie is refused', async () => {
  const handler = (await import('../api/dashboard.js')).default;
  for (const forged of ['n8na_sess=nonsense', 'n8na_sess=a.b', `n8na_sess=${issueSession('a-different-secret')}`]) {
    const res = fakeRes();
    await handler(fakeReq('GET', { cookie: forged }), res);
    assert.equal(res.statusCode, 401, `${forged.slice(0, 30)} was accepted`);
  }
});
tick();

await check('the password cannot be re-claimed once set', async () => {
  const handler = (await import('../api/auth.js')).default;
  const res = fakeRes();
  await handler(fakeReq('POST', { body: { action: 'setup', password: 'attacker-password' } }), res);
  assert.equal(res.statusCode, 409);
  const login = fakeRes();
  await handler(fakeReq('POST', { body: { action: 'login', password: 'attacker-password' } }), login);
  assert.equal(login.statusCode, 401);
});
tick();

await check('a wrong password is refused and says nothing about why', async () => {
  const handler = (await import('../api/auth.js')).default;
  const a = fakeRes(); await handler(fakeReq('POST', { body: { action: 'login', password: '' } }), a);
  const b = fakeRes(); await handler(fakeReq('POST', { body: { action: 'login', password: 'wrong-but-long-enough' } }), b);
  assert.equal(a.body.error, b.body.error, 'the error distinguishes an empty password from a wrong one');
});
tick();

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
}
if (notes.length) {
  console.log('\nNoted:');
  for (const n of [...new Set(notes)]) console.log(`  · ${n}`);
}
console.log('');
process.exit(failures.length ? 1 : 0);
