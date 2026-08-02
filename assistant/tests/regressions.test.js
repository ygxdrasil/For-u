/**
 * Defects found by scripts/stress.mjs, each reproduced here so `npm test`
 * catches it if it comes back. Every one of these was live in a version that
 * passed the whole suite and looked completely healthy.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { searchNodes } from '../core/nodeIndex.js';
import { validateWorkflow } from '../core/validate.js';
import { savePrefs } from '../core/settings.js';
import { readBody } from '../core/http.js';
import { createMemoryStore } from '../core/store.js';
import { run } from '../core/run.js';
import { PRICES } from '../core/meter.js';

const stubModel = (script) => {
  let i = 0;
  return () => ({ models: { generateContent: async ({ config }) => {
    const step = script[Math.min(i++, script.length - 1)];
    if (step.delayMs) {
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, step.delayMs);
        config?.abortSignal?.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('aborted')); });
      });
    }
    return { text: step.text ?? '', functionCalls: step.calls ?? [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50 } };
  } } });
};

const cfg = { geminiApiKey: 'stub', monthlyCapUsd: 100 };

test('searching a run-together name finds the node', () => {
  // "openAi" splits to "open ai", so whole-word matching on "openai" returned
  // NOTHING from an index containing five OpenAI nodes.
  for (const [query, expected] of [
    ['openai', '@n8n/n8n-nodes-langchain.openAi'],
    ['googlesheets', 'n8n-nodes-base.googleSheets'],
    ['langchain', '@n8n/n8n-nodes-langchain.agent'],
  ]) {
    const hits = searchNodes(query, { limit: 25 }).map((r) => r.type);
    assert.ok(hits.includes(expected), `searching "${query}" did not find ${expected}`);
  }

  // And the substring trap must still be closed.
  const forms = searchNodes('form', { limit: 40 }).map((r) => r.type);
  assert.ok(!forms.includes('n8n-nodes-base.aiTransform'), 'run-together matching reintroduced substring matching');
});

test('junk in the nodes list is reported, not thrown', async () => {
  // A model returning `nodes: [null]` made the validator throw, so the model
  // was told "validate_workflow threw" instead of what was wrong.
  for (const nodes of [[null], [undefined], [5], ['a node'], [null, { id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }]]) {
    const r = await validateWorkflow({ name: 'X', nodes, connections: {} });
    assert.equal(typeof r.valid, 'boolean');
    assert.ok(r.errors.some((e) => e.code === 'NOT_A_NODE'), `no NOT_A_NODE error for ${JSON.stringify(nodes)}`);
  }
});

test('a body of literal null does not take a route down', async () => {
  // JSON.parse("null") is null, and every route then read .action off it —
  // an unhandled 500 with a stack trace instead of "I did not understand that".
  const asStream = (payload) => ({ [Symbol.asyncIterator]: async function* () { yield Buffer.from(payload); } });
  for (const payload of ['null', '[1,2,3]', '42', '"text"', 'not json at all', '']) {
    const body = await readBody(asStream(payload));
    assert.equal(typeof body, 'object');
    assert.ok(body !== null && !Array.isArray(body), `readBody(${payload}) returned ${JSON.stringify(body)}`);
    assert.doesNotThrow(() => body.action);
  }
});

test('a model that will not stop calling tools is reported, not passed off as done', async () => {
  // Running out of steps returned status "ok" whose entire answer was
  // "(no answer produced)" — a successful-looking turn that said nothing.
  const store = createMemoryStore();
  const r = await run(
    { text: 'build something', config: cfg, store, deadlineMs: 40_000, llmClientFactory: stubModel([{ calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.equal(r.status, 'continuing');
  assert.doesNotMatch(r.reply, /no answer produced/);
  assert.ok(await store.getJob(r.jobId), 'the unfinished work was not saved to resume');
});

test('a model that hangs is cut off before the platform kills the request', async () => {
  // Serverless returns NOTHING at its limit — no error, no partial answer. An
  // unbounded model call meant a slow model produced silence.
  const started = Date.now();
  const r = await run(
    { text: 'hello', config: cfg, store: createMemoryStore(), deadlineMs: 11_000, llmClientFactory: stubModel([{ delayMs: 60_000, text: 'far too late' }]) },
    {},
  );
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 14_000, `ran ${(elapsed / 1000).toFixed(1)}s past an 11s deadline`);
  assert.equal(r.status, 'continuing');
});

test('the nodes that actually send are the ones a dry run switches off', async () => {
  // The Send Email node and an HTTP Request doing POST were both classified as
  // reads and left switched ON through every dry run. "Tests never send" is the
  // guarantee everything else rests on.
  const { isWriteOperation } = await import('../core/nodeIndex.js');
  const { writeNodesIn } = await import('../core/tools.js');

  const mustBeOff = [
    ['n8n-nodes-base.emailSend', {}],
    ['n8n-nodes-base.httpRequest', { method: 'POST' }],
    ['n8n-nodes-base.httpRequest', { method: 'DELETE' }],
    ['n8n-nodes-base.ftp', { operation: 'upload' }],
    ['n8n-nodes-base.gmail', { resource: 'message', operation: 'send' }],
    ['n8n-nodes-base.slack', { resource: 'message', operation: 'post' }],
  ];
  for (const [type, parameters] of mustBeOff) {
    assert.equal(
      isWriteOperation({ type, resource: parameters.resource ?? null, operation: parameters.operation ?? null, parameters }),
      true,
      `${type} ${JSON.stringify(parameters)} would have sent for real during a test`,
    );
  }

  // And the opposite mistake: switching off the trigger leaves a dry run with
  // nothing to run, which looks like a pass and proves nothing.
  const mustStayOn = [
    ['n8n-nodes-base.manualTrigger', {}],
    ['n8n-nodes-base.scheduleTrigger', {}],
    ['n8n-nodes-base.httpRequest', { method: 'GET' }],
    ['n8n-nodes-base.slack', { resource: 'message', operation: 'search' }],
    ['n8n-nodes-base.if', {}],
  ];
  for (const [type, parameters] of mustStayOn) {
    assert.equal(
      isWriteOperation({ type, resource: parameters.resource ?? null, operation: parameters.operation ?? null, parameters }),
      false,
      `${type} was disabled needlessly`,
    );
  }

  const writers = writeNodesIn({
    nodes: [
      { name: 'Start', type: 'n8n-nodes-base.manualTrigger', parameters: {} },
      { name: 'Email them', type: 'n8n-nodes-base.emailSend', parameters: {} },
      { name: 'Charge them', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST' } },
    ],
  });
  assert.deepEqual(writers.sort(), ['Charge them', 'Email them']);
});

test('a dry run puts its test copy away instead of piling them up', async () => {
  // Left visible, every dry run added another "[assistant test]" workflow to
  // the real instance.
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createN8nClient } = await import('../core/n8nClient.js');
  const { createMemoryStore: mem } = await import('../core/store.js');

  const archived = new Set();
  const wf = { id: 'wf1', name: 'Leads', nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }], connections: {} };
  const fetchImpl = async (url, init) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (method === 'POST' && p === '/workflows') return reply({ ...wf, id: 'copy1' });
    if (method === 'POST' && /\/archive$/.test(p)) { archived.add(p.split('/')[2]); return reply({ isArchived: true }); }
    if (method === 'POST' && /\/(run|execute)$/.test(p)) return reply({ executionId: 'e1' });
    if (method === 'GET' && p === '/executions') return reply({ data: [{ id: 'e1', status: 'success' }] });
    if (method === 'GET' && p.startsWith('/executions/')) return reply({ id: 'e1', status: 'success', data: { resultData: { runData: {} } } });
    if (method === 'GET' && p === '/workflows/copy1') return reply({ ...wf, id: 'copy1', isArchived: archived.has('copy1') });
    return reply(wf);
  };

  const tools = buildToolRegistry({ n8n: createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl }), store: mem(), approvals: [] });
  const out = await tools.find((t) => t.name === 'dry_run_workflow').handler({ id: 'wf1' });

  assert.equal(out.ok, true, out.error);
  assert.ok(archived.has('copy1'), 'the test copy was left in the workflow list');
  assert.match(out.note, /archiv/i);
  assert.match(out.note, /nothing was deleted/i);
});

test('an unfinished turn leaves the conversation where he can pick it up', async () => {
  // "Ask me to carry on and I will pick up from here" was not something the
  // code could do: nothing was saved, so the next message started from before.
  const store = createMemoryStore();
  const first = await run(
    { text: 'build it', sessionId: 's1', config: cfg, store, deadlineMs: 40_000, llmClientFactory: stubModel([{ calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.equal(first.status, 'continuing');
  const session = await store.getSession('s1');
  assert.ok(session.messages.length > 0, 'nothing was carried, so he would start again from scratch');
  assert.match(JSON.stringify(session.messages), /search_nodes/);

  // And a headless caller can hand the job id straight back.
  const resumed = await run(
    { text: 'carry on', resumeJobId: first.jobId, config: cfg, store, llmClientFactory: stubModel([{ text: 'finished' }]) },
    {},
  );
  assert.equal(resumed.resumedFrom, first.jobId);
});

test('a store with rubbish in it does not stop him answering', async () => {
  const store = createMemoryStore();
  for (const key of ['settings:prefs', 'memory:facts', 'settings:peers', 'settings:secrets']) await store.setKv(key, 'corrupted');
  const r = await run({ text: 'what is running?', config: cfg, store, llmClientFactory: stubModel([{ text: 'an answer' }]) }, {});
  assert.equal(r.status, 'ok', r.reply);
});

test('the memory store hands out copies, not its own live objects', async () => {
  // listFindings returned the internal objects, so a later update mutated a
  // result the caller was already holding — something Postgres cannot do, which
  // meant the two stores behaved differently.
  const store = createMemoryStore();
  const added = await store.addFinding({ workflowId: 'wf1', error: 'boom' });
  const open = await store.listFindings({ status: 'open' });
  await store.updateFinding(added.id, { status: 'closed' });
  assert.equal(open[0].status, 'open', 'a result already returned changed underneath the caller');

  open[0].workflowId = 'tampered';
  assert.equal((await store.listFindings({}))[0].workflowId, 'wf1', 'editing a returned object rewrote the store');
});

test('every route that reads the node index has it bundled with it', async () => {
  // /api/workflow and /api/mcp read the index at runtime, which Vercel's tracer
  // cannot see. Both 401 before reaching it, so probing production proved
  // nothing — they would have failed only once someone was signed in.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = path.dirname(new URL('.', import.meta.url).pathname);
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

  const reaches = (file, seen = new Set()) => {
    if (seen.has(file) || !fs.existsSync(file)) return false;
    seen.add(file);
    if (file.endsWith('nodeIndex.js')) return true;
    const src = fs.readFileSync(file, 'utf8');
    return [...src.matchAll(/from\s+'(\.[^']+)'/g), ...src.matchAll(/import\(\s*'(\.[^']+)'\s*\)/g)]
      .some((m) => reaches(path.resolve(path.dirname(file), m[1]), seen));
  };

  for (const file of fs.readdirSync(path.join(root, 'api'))) {
    if (!file.endsWith('.js') || !reaches(path.join(root, 'api', file))) continue;
    assert.ok(vercel.functions?.[`api/${file}`]?.includeFiles, `api/${file} reads the node index but ships without it`);
  }
});

test('the watch keeps watching after execution ids gain a digit', async () => {
  // The cursor compared ids as TEXT, and "100" > "99" is false. Once ids gained
  // a digit the sweep decided nothing was ever new again and went quietly dead
  // — the worst possible failure for the thing whose job is noticing.
  const handler = (await import('../api/sweep.js')).default;
  const { createStore, resetStoreCache } = await import('../core/store.js');

  process.env.AGENT_TOKEN = 'regression-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  resetStoreCache();
  await createStore({ databaseUrl: null });

  const sweep = async (executionId) => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const p = new URL(url).pathname.replace('/api/v1', '');
      const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if (p === '/executions') return reply({ data: [{ id: executionId, workflowId: 'wf1', startedAt: new Date().toISOString() }] });
      if (p.startsWith('/executions/')) return reply({ id: executionId, status: 'error', data: { resultData: { lastNodeExecuted: 'Slack', runData: { Slack: [{ error: { message: 'boom' } }] } } } });
      return reply({});
    };
    const chunks = [];
    const res = { statusCode: 0, setHeader() {}, end(c) { if (c) chunks.push(String(c)); }, get body() { try { return JSON.parse(chunks.join('')); } catch { return null; } } };
    try {
      await handler({ method: 'POST', headers: { authorization: 'Bearer regression-token' }, body: { explain: false } }, res);
    } finally { globalThis.fetch = realFetch; }
    return res.body;
  };

  assert.equal((await sweep('99')).newFailures, 1);
  assert.equal((await sweep('100')).newFailures, 1, 'execution 100 was treated as older than 99');
  assert.equal((await sweep('100')).newFailures, 0, 'the same failure was reported twice');

  delete process.env.N8N_BASE_URL;
  delete process.env.N8N_API_KEY;
});

test('a list that was cut short says so', async () => {
  // "You have 30 workflows" is confidently wrong on an instance with 200.
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createN8nClient } = await import('../core/n8nClient.js');

  const fetchImpl = async (url) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const body = p === '/workflows'
      ? { data: [{ id: '1', name: 'One', active: true, nodes: [] }], nextCursor: 'more-to-come' }
      : { data: [{ id: 'e1', workflowId: '1', status: 'error' }], nextCursor: 'more-to-come' };
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  const tools = buildToolRegistry({ n8n: createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl }), store: createMemoryStore(), approvals: [] });

  for (const name of ['list_workflows', 'list_failed_executions']) {
    const out = await tools.find((t) => t.name === name).handler({ limit: 1 });
    assert.equal(out.more, true, `${name} did not report that there is more`);
    assert.match(out.note, /more|only/i, `${name} gave the model nothing to pass on`);
  }
});

test('no effect hands React a value it will try to call as cleanup', async () => {
  // This is the one that produced "g is not a function" and a white screen on a
  // real phone. React treats ANY non-undefined return from useEffect as the
  // cleanup function and calls it on the next run. An arrow with an implicit
  // return quietly hands over whatever the last expression evaluated to —
  // scrollIntoView returns undefined in Chromium, which is why it passed every
  // test I had, and a Promise in Safari and in every smooth-scroll polyfill.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const src = path.dirname(new URL('.', import.meta.url).pathname) + '/src';

  const offenders = [];
  for (const file of fs.readdirSync(src)) {
    if (!/\.jsx?$/.test(file)) continue;
    const text = fs.readFileSync(path.join(src, file), 'utf8');
    text.split('\n').forEach((line, i) => {
      // An effect whose arrow body is an expression rather than a block.
      const m = line.match(/useEffect\(\s*\(\s*\)\s*=>\s*(.)/);
      if (m && m[1] !== '{') offenders.push(`${file}:${i + 1} ${line.trim().slice(0, 90)}`);
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `these effects return a value to React, which will call it as a cleanup:\n${offenders.join('\n')}`,
  );
});

test('he can do the system tagging he is instructed to do', async () => {
  // The prompt tells him to tag every workflow in a system with the same
  // "system:<name>" tag. Nothing could set a tag, so that instruction produced
  // either a silent omission or a claim that was not true.
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createN8nClient } = await import('../core/n8nClient.js');

  const calls = [];
  const fetchImpl = async (url, init) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    calls.push(`${method} ${p}`);
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (method === 'GET' && p === '/tags') return reply({ data: [] });
    if (method === 'POST' && p === '/tags') return reply({ id: 'tag1', name: JSON.parse(init.body).name });
    if (method === 'POST' && p === '/workflows') return reply({ id: 'new1', name: 'Leads' });
    if (method === 'GET' && p.startsWith('/workflows/')) return reply({ id: 'new1', name: 'Leads', tags: [{ name: 'system:leads' }] });
    return reply({});
  };

  const tools = buildToolRegistry({ n8n: createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl }), store: createMemoryStore(), approvals: [] });
  const save = tools.find((t) => t.name === 'save_workflow');
  assert.ok(Object.keys(save.parameters.properties).includes('tags'), 'save_workflow cannot be given a tag');

  const wf = { name: 'Leads', nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }], connections: {} };
  const out = await save.handler({ mode: 'create', workflow: wf, tags: ['system:leads'] });
  assert.equal(out.ok, true, out.error);
  assert.equal(out.tagged.confirmed, true, 'the tag was not read back on the workflow');
  assert.ok(calls.some((c) => c.startsWith('PUT') && c.endsWith('/tags')), 'no tag was ever applied');
});

test('updating a workflow keeps the pinned data it did not resend', async () => {
  // n8n's PUT replaces the whole workflow, so anything not resent is gone.
  // Losing someone's pinned test data is a quiet way of deleting something.
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createN8nClient } = await import('../core/n8nClient.js');

  const existing = {
    id: 'wf1', name: 'Leads',
    nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }],
    connections: {},
    pinData: { Start: [{ json: { email: 'sam@example.com' } }] },
    staticData: { lastRun: '2030-01-01' },
  };

  let sent = null;
  const fetchImpl = async (url, init) => {
    const method = init?.method ?? 'GET';
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (method === 'PUT') { sent = JSON.parse(init.body); return reply(existing); }
    return reply(existing);
  };

  const tools = buildToolRegistry({ n8n: createN8nClient({ baseUrl: 'https://x.invalid', apiKey: 'k', fetchImpl }), store: createMemoryStore(), approvals: [] });
  const out = await tools.find((t) => t.name === 'save_workflow').handler({
    mode: 'update', id: 'wf1',
    workflow: { name: 'Leads renamed', nodes: existing.nodes, connections: {} },
  });

  assert.equal(out.ok, true, out.error);
  assert.deepEqual(sent.pinData, existing.pinData, 'the pinned test data was wiped');
  assert.deepEqual(sent.staticData, existing.staticData, 'stored state was wiped');
  assert.deepEqual(out.keptFromPreviousVersion.sort(), ['pinData', 'staticData']);
});

test('a model with no price cannot be saved as a preference', async () => {
  // It saved happily and the next request then refused to run at all, because
  // the meter will not guess a rate — correctly, but the trap was set on save.
  const saved = await savePrefs(createMemoryStore(), { chatModel: 'gemini-9-imaginary', designModel: 'gemini-2.5-pro' });
  assert.ok(PRICES[saved.chatModel], `an unpriced model "${saved.chatModel}" was accepted`);
  assert.equal(saved.designModel, 'gemini-2.5-pro', 'a priced model must still be accepted');
});
