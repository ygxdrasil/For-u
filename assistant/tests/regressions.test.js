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

test('no route waits longer than the platform will let it run', async () => {
  // A 25-second peer call inside a function capped at 15 seconds. Vercel killed
  // it and returned a bare 504 carrying no peer name and no reason — the exact
  // "serverless returns NOTHING at its limit" failure, self-inflicted.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = path.dirname(new URL('.', import.meta.url).pathname);
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const VERCEL_DEFAULT_MAX = 10;

  const tooSlow = [];
  for (const file of fs.readdirSync(path.join(root, 'api'))) {
    if (!file.endsWith('.js')) continue;
    const src = fs.readFileSync(path.join(root, 'api', file), 'utf8');
    const limitSec = vercel.functions?.[`api/${file}`]?.maxDuration ?? VERCEL_DEFAULT_MAX;

    for (const m of src.matchAll(/timeoutMs:\s*([\d_]+)/g)) {
      const waitSec = Number(m[1].replace(/_/g, '')) / 1000;
      // Room to answer as well as to wait.
      if (waitSec >= limitSec - 2) {
        tooSlow.push(`api/${file} waits ${waitSec}s inside a ${limitSec}s function`);
      }
    }
  }

  assert.deepEqual(tooSlow, [], tooSlow.join(' | '));
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

test('a login page answering 200 is not reported as a working n8n', async () => {
  // n8n behind Cloudflare Access, an SSO gateway or a company portal: every
  // request gets 200 and an HTML sign-in page, and n8n never sees the API key.
  // The body parsed to { raw: '<html…' }, so `data?.length` was undefined and
  // the answer came back as "you have no workflows" — a confident lie about
  // someone's own instance, which is the one thing this system may never do.
  const { createN8nClient } = await import('../core/n8nClient.js');
  const loginPage = async () =>
    new Response('<!doctype html><html><body>Sign in</body></html>', { status: 200, headers: { 'Content-Type': 'text/html' } });

  const probe = await createN8nClient({ baseUrl: 'https://n8n.invalid', apiKey: 'k', fetchImpl: loginPage }).ping();
  assert.equal(probe.ok, false, 'a sign-in page was reported as a healthy, authorised connection');
  assert.equal(probe.reachable, true, 'something did answer — reporting it as unreachable sends you to the wrong fix');
  assert.match(probe.error, /HTML|sign-in|JSON/i);
});

test('a stored key that cannot be decrypted is not reported as absent', async () => {
  // MASTER_KEY changed or removed in Vercel. The ciphertext is still there and
  // still correct; nothing can read it. Saying "not set" sends you looking for
  // a key you never lost, and hides the only thing that explains it.
  const { saveServerConfig, describeServerConfig } = await import('../core/settings.js');
  const store = createMemoryStore();

  process.env.MASTER_KEY = 'the original';
  await saveServerConfig(store, { n8nApiKey: 'n8n_live_key' });
  process.env.MASTER_KEY = 'a different one';
  const described = await describeServerConfig(store);
  delete process.env.MASTER_KEY;

  assert.equal(described.n8nApiKey.set, false, 'an unreadable key must not read as usable');
  assert.equal(described.n8nApiKey.unreadable, true, 'a key that is stored but unreadable was reported as never set');
  assert.match(described.n8nApiKey.note, /MASTER_KEY/);
});

test('two turns sent at the same moment do not erase each other', async () => {
  // Both read the same history, both appended to their own copy, and the
  // slower write won: the faster turn was answered on screen and gone on the
  // next reload, with no error anywhere. No merge written above the store can
  // fix that — both can read before either writes — so the append is the
  // store's job and is atomic there.
  const store = createMemoryStore();
  await Promise.all([
    run({ text: 'from the phone', sessionId: 'both', config: cfg, store, llmClientFactory: stubModel([{ text: 'one' }]) }, {}),
    run({ text: 'from the laptop', sessionId: 'both', config: cfg, store, llmClientFactory: stubModel([{ text: 'two' }]) }, {}),
  ]);
  const messages = JSON.stringify((await store.getSession('both')).messages);
  assert.match(messages, /from the phone/, 'one of two simultaneous turns vanished from the conversation');
  assert.match(messages, /from the laptop/);
});

test('an execution that failed with no message still produces a sentence', async () => {
  // n8n records the failure and nothing about why — a crashed worker, a killed
  // container, an execution truncated by pruning. describeFailure returned
  // null, and null printed into a sentence reads as our bug rather than a
  // missing record on their side.
  const { describeFailure } = await import('../core/assess.js');
  for (const execution of [{ data: { resultData: { lastNodeExecuted: 'Post to Slack' } } }, {}, null]) {
    const d = describeFailure(execution);
    assert.equal(typeof d.message, 'string');
    assert.doesNotMatch(d.message, /undefined|null|\[object/, 'a JavaScript value reached a sentence meant for a person');
  }
  assert.match(describeFailure({ data: { resultData: { lastNodeExecuted: 'Post to Slack' } } }).message, /Post to Slack/);
});

test('a half-built workflow does not take the canvas down', async () => {
  // The model streams a workflow into the canvas as it writes it, so the array
  // genuinely does contain holes for a moment. One of them threw, and the
  // error boundary caught a blank screen for a node that was never going to
  // draw anyway.
  const { buildPreview } = await import('../core/preview.js');
  for (const wf of [null, {}, { nodes: null }, { nodes: [null, undefined] }, { nodes: [{}], connections: null }]) {
    assert.doesNotThrow(() => buildPreview(wf), `buildPreview threw on ${JSON.stringify(wf)}`);
  }
});

test('the same breakage repeating does not open a second finding', async () => {
  // A workflow broken at 3am and retried hourly opened twenty findings by
  // morning — same workflow, same node, same error. Twenty rows is the same
  // disease as a counter that only goes up: you stop reading the panel, and
  // the one genuinely new failure underneath is invisible.
  const { resetStoreCache, createStore } = await import('../core/store.js');
  resetStoreCache();
  const realFetch = globalThis.fetch;
  process.env.AGENT_TOKEN = 'regression-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  globalThis.fetch = async (url) => {
    const path = new URL(url).pathname.replace('/api/v1', '');
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (path === '/executions') return reply({ data: [{ id: String(300 + hits), workflowId: 'wf1', status: 'error', workflowData: { name: 'Leads' } }] });
    return reply({ id: String(300 + hits), workflowId: 'wf1', status: 'error', data: { resultData: { lastNodeExecuted: 'Post to Slack', error: { message: 'connect ETIMEDOUT' } } } });
  };

  let hits = 0;
  const handler = (await import('../api/sweep.js')).default;
  const call = async () => {
    const res = { statusCode: 0, setHeader() {}, end(t) { this.body = JSON.parse(t); } };
    await handler({ method: 'POST', headers: { authorization: 'Bearer regression-token' }, body: { explain: false } }, res);
    hits++;
    return res.body;
  };
  for (let i = 0; i < 4; i++) await call();

  const open = await (await createStore()).listFindings({ status: 'open' });
  assert.ok(open.length <= 2, `four identical failures produced ${open.length} findings`);
  assert.ok(open.some((f) => (f.seenCount ?? 1) > 1), 'nothing recorded that it had happened more than once');

  globalThis.fetch = realFetch;
  delete process.env.AGENT_TOKEN;
  delete process.env.N8N_BASE_URL;
  delete process.env.N8N_API_KEY;
  resetStoreCache();
});

test('an answer cut off at the token ceiling is not reported as a finished one', async () => {
  // finishReason MAX_TOKENS. The text arrives, the request is 200, nothing
  // throws, and the sentence just stops — the only model failure that looks
  // exactly like success. Nothing read finishReason, so half an answer was
  // presented with a full stop implied.
  const store = createMemoryStore();
  const truncating = () => ({ models: { generateContent: async () => ({
    text: 'I built the trigger and the sheet read, and the third node needs the sheet id from',
    functionCalls: [],
    usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 4096 },
    candidates: [{ finishReason: 'MAX_TOKENS' }],
  }) } });

  const out = await run({ text: 'build it', config: cfg, store, llmClientFactory: truncating }, {});
  assert.notEqual(out.status, 'ok', 'a truncated answer got the same status as a complete one');
  assert.match(out.reply, /cut off/i);
  assert.ok(out.jobId, 'there is no way to ask him to carry on from where it stopped');
});

test('an empty reply that was blocked does not blame the thinking budget', async () => {
  // SAFETY and RECITATION produce an empty reply too. Blaming the budget sends
  // you to change a setting that was never the problem.
  const { createLlm } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async () => ({
      text: '', functionCalls: [], usageMetadata: { promptTokenCount: 10 }, candidates: [{ finishReason: 'SAFETY' }],
    }) } }),
  });
  const out = await llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x' });
  assert.equal(out.empty, true);
  assert.match(out.emptyReason, /SAFETY/);
  // It may mention the budget to rule it out — what it must not do is blame it.
  assert.doesNotMatch(out.emptyReason, /thinking tokens used/i);
});

test('a model call we abort ourselves is reported as running out of time', async () => {
  // Aborting makes the SDK reject as well, and that rejection can win the race.
  // It says "aborted", which is true and useless: the caller checks for
  // ModelTimeoutError to stop gracefully, and an ordinary error there produced
  // a bare "the model call failed" instead of what he had managed to do.
  const { createLlm, ModelTimeoutError } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: ({ config }) => new Promise((_, reject) => {
      config?.abortSignal?.addEventListener('abort', () => reject(new Error('Request was aborted.')));
    }) } }),
  });
  await assert.rejects(
    () => llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x', timeoutMs: 300 }),
    (err) => err instanceof ModelTimeoutError,
  );
});

test('neither project builds the other one s commits', async () => {
  // Two Vercel projects deploy from this one repo — Jason from assistant/ and
  // Selena from selena/ — so every push built both. Two builds per push
  // exhausted the Hobby plan's daily deployment limit in an afternoon, and
  // then nothing deployed at all for 24 hours: the work was written, tested,
  // committed, pushed, and not running, which is the same as not done.
  //
  // Vercel skips a build when ignoreCommand exits 0, which is what
  // `git diff --quiet` does when nothing in that directory changed.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const url = await import('node:url');
  const here = path.dirname(url.fileURLToPath(import.meta.url));

  for (const config of [path.join(here, '..', 'vercel.json'), path.join(here, '..', '..', 'selena', 'vercel.json')]) {
    if (!fs.existsSync(config)) continue; // the other project may not be checked out
    const parsed = JSON.parse(fs.readFileSync(config, 'utf8'));
    assert.match(
      String(parsed.ignoreCommand ?? ''),
      /git diff --quiet/,
      `${path.basename(path.dirname(config))}/vercel.json has no ignoreCommand, so it rebuilds on commits that do not touch it`,
    );
  }
});

test('a model that is merely busy falls through to the next one', async () => {
  // The real thing, verbatim from a live call:
  //   {"error":{"code":503,"message":"This model is currently experiencing high
  //   demand. Spikes in demand are usually temporary...","status":"UNAVAILABLE"}}
  // That is Google having a spike, not a fault in the request, the key, or
  // anything in the user's n8n — and there has been a fallback chain for
  // exactly this shape of problem the whole time. It was thrown instead, and
  // reported as "the model call failed", which reads like the opposite.
  const { createLlm, TIERS } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  const asked = [];
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async ({ model }) => {
      asked.push(model);
      if (model === TIERS.chat.models[0]) {
        throw new Error('{"error":{"code":503,"message":"This model is currently experiencing high demand.","status":"UNAVAILABLE"}}');
      }
      return { text: 'answered by the next model', functionCalls: [], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
    } } }),
  });

  const out = await llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x', timeoutMs: 30_000 });
  assert.equal(out.text, 'answered by the next model');
  assert.equal(asked[0], TIERS.chat.models[0]);
  assert.equal(asked[1], TIERS.chat.models[0], 'the busy model was abandoned without a second try — spikes are usually seconds');
  assert.equal(asked[2], TIERS.chat.models[1], 'it never moved on to the next model in the tier');
});

test('every model busy is said plainly, and is not called a failure', async () => {
  const { createLlm, ModelsBusyError } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  const busy = () => ({ models: { generateContent: async () => {
    throw new Error('{"error":{"code":503,"message":"This model is currently experiencing high demand.","status":"UNAVAILABLE"}}');
  } } });

  const llm = createLlm({ apiKey: 'k', meter: createMeter({ store: createMemoryStore(), capUsd: 100 }), clientFactory: busy });
  await assert.rejects(
    // A short deadline so the retry pauses are skipped and the test is quick.
    () => llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x', timeoutMs: 1000 }),
    (err) => {
      assert.ok(err instanceof ModelsBusyError, `threw ${err.name}`);
      assert.match(err.message, /busy|spike/i);
      assert.match(err.message, /not a fault in your setup/i);
      return true;
    },
  );

  // Enough budget that the model is actually reached — with a 3s deadline the
  // turn ends on time before it ever calls one, which is a different outcome.
  const out = await run({ text: 'what is running?', config: cfg, store: createMemoryStore(), llmClientFactory: busy, deadlineMs: 15_000 }, {});
  assert.equal(out.status, 'model_busy', `a busy model produced status ${out.status}`);
  assert.doesNotMatch(out.reply, /The model call failed/);
  assert.match(out.reply, /try again in a minute/i);
});

test('a busy model does not eat the deadline waiting to retry', async () => {
  // Sleeping through someone's remaining time is how a serverless request
  // returns nothing at all instead of returning something late.
  const { createLlm } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  let calls = 0;
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async () => { calls++; throw new Error('503 UNAVAILABLE'); } } }),
  });
  const started = Date.now();
  await assert.rejects(() => llm.generate({ tier: 'chat', contents: [], systemInstruction: 'x', timeoutMs: 900 }));
  assert.equal(calls, 3, 'with no time to spare it should try each model once and stop');
  assert.ok(Date.now() - started < 1500, `it waited ${Date.now() - started}ms with under a second of budget`);
});

test('the model s own turn is sent back exactly as it came, signature and all', async () => {
  // Gemini 3 attaches a thoughtSignature to functionCall parts and validates it
  // when the turn is sent back. The turn was being REBUILT from the parsed name
  // and args, which dropped it, so the second request of every build was
  // rejected:
  //
  //   400 INVALID_ARGUMENT: Function call is missing a thought_signature in
  //   functionCall parts ... function call `default_api:search_nodes`
  //
  // He searched for nodes and then stopped. Every build, at the first tool
  // call. Nothing may reconstruct a model turn — it is copied.
  const seen = [];
  const withSignature = () => {
    let step = 0;
    return { models: { generateContent: async ({ contents }) => {
      seen.push(structuredClone(contents));
      if (step++ === 0) {
        return {
          text: '',
          functionCalls: [{ name: 'search_nodes', args: { query: 'slack' } }],
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
          candidates: [{
            content: {
              role: 'model',
              parts: [{ functionCall: { name: 'search_nodes', args: { query: 'slack' } }, thoughtSignature: 'SIG-FROM-THE-MODEL' }],
            },
          }],
        };
      }
      return { text: 'done', functionCalls: [], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
    } } };
  };

  const out = await run({ text: 'find me a slack node', config: cfg, store: createMemoryStore(), llmClientFactory: withSignature }, {});
  assert.equal(out.status, 'ok', out.reply);
  assert.equal(seen.length, 2, 'the turn did not continue past the first tool call');
  assert.match(
    JSON.stringify(seen[1]),
    /SIG-FROM-THE-MODEL/,
    'the thought signature was dropped, so Gemini 3 rejects the next request and no workflow ever gets built',
  );
});

test('a conversation whose signatures are rejected is repaired, not abandoned', async () => {
  // Sessions saved before signatures were carried through still hold function
  // calls with none on them, and a signature cannot be invented after the
  // fact — so every future turn on that conversation would fail the same way
  // for good. Flattening the tool turns to text keeps the meaning and leaves
  // the validation nothing to reject.
  const bodies = [];
  const fussy = () => ({ models: { generateContent: async ({ contents }) => {
    bodies.push(structuredClone(contents));
    const hasStructuredCall = JSON.stringify(contents).includes('"functionCall"');
    if (hasStructuredCall) {
      throw new Error('400 INVALID_ARGUMENT: Function call is missing a thought_signature in functionCall parts, position 6');
    }
    return { text: 'carried on regardless', functionCalls: [], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
  } } });

  const store = createMemoryStore();
  await store.saveSession({
    id: 'poisoned',
    messages: [
      { role: 'user', parts: [{ text: 'build the lead pipeline' }] },
      { role: 'model', parts: [{ functionCall: { name: 'search_nodes', args: { query: 'slack' } } }] },
      { role: 'user', parts: [{ functionResponse: { name: 'search_nodes', response: { ok: true, nodes: [] } } }] },
    ],
  });

  const out = await run({ text: 'carry on', sessionId: 'poisoned', config: cfg, store, llmClientFactory: fussy }, {});
  assert.equal(out.status, 'ok', `a conversation that can be repaired was reported as ${out.status}: ${out.reply}`);
  assert.equal(out.reply, 'carried on regardless');
  assert.ok(bodies.length >= 2, 'it gave up without trying the repair');
  assert.equal(bodies.length, 2, `${bodies.length} requests were sent for one turn — the repair should be the second, not the third`);
  assert.match(JSON.stringify(bodies.at(-1)), /called search_nodes/, 'the repaired history lost what had already been done');
  assert.doesNotMatch(JSON.stringify(bodies.at(-1)), /"functionCall"/, 'the repair left a structured call in, which is the thing being rejected');
});

test('a repaired conversation stays repaired', async () => {
  // Fixing the request gets the turn through; keeping the fix is what stops
  // the next turn paying the same rejected round trip, out of the same
  // 50-second budget, forever.
  const attempts = [];
  const fussy = () => ({ models: { generateContent: async ({ contents }) => {
    attempts.push(structuredClone(contents));
    if (JSON.stringify(contents).includes('"functionCall"')) {
      throw new Error('400 INVALID_ARGUMENT: Function call is missing a thought_signature in functionCall parts');
    }
    return { text: 'fine', functionCalls: [], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
  } } });

  const store = createMemoryStore();
  await store.saveSession({
    id: 'poisoned',
    messages: [
      { role: 'user', parts: [{ text: 'build it' }] },
      { role: 'model', parts: [{ functionCall: { name: 'search_nodes', args: {} } }] },
      { role: 'user', parts: [{ functionResponse: { name: 'search_nodes', response: {} } }] },
    ],
  });

  await run({ text: 'first', sessionId: 'poisoned', config: cfg, store, llmClientFactory: fussy }, {});
  const after = await run({ text: 'second', sessionId: 'poisoned', config: cfg, store, llmClientFactory: fussy }, {});

  assert.equal(after.status, 'ok', after.reply);
  assert.equal(attempts.length, 3, `${attempts.length} requests for two turns — the second turn paid the rejection again`);
  assert.doesNotMatch(JSON.stringify(await store.getSession('poisoned')), /"functionCall"/, 'the stored conversation is still poisoned');
});

test('a model default you never chose follows the default when it improves', async () => {
  // Saving the theme wrote the whole preference block, models included, which
  // turned "the default" into "your choice" — so anyone who had ever touched a
  // setting was frozen on whatever model was cheapest the week they installed
  // it, with no way of knowing.
  const { loadPrefs, savePrefs, DEFAULT_PREFS } = await import('../core/settings.js');
  const store = createMemoryStore();

  await savePrefs(store, { theme: 'dark' });
  const after = await loadPrefs(store);
  assert.equal(after.theme, 'dark');
  assert.equal(after.designModel, DEFAULT_PREFS.designModel, 'a model nobody chose was pinned by saving an unrelated setting');
  // The budget is part of the same decision: raising the model and leaving the
  // old thinking budget behind is half an upgrade, and it is the half nobody
  // notices. This is what /api/health showed after shipping exactly that.
  assert.equal(after.thinkingBudget, DEFAULT_PREFS.thinkingBudget, 'the model moved up and the thinking budget stayed behind');

  // But an actual choice is honoured for good.
  await savePrefs(store, { designModel: 'gemini-2.5-flash-lite' });
  assert.equal((await loadPrefs(store)).designModel, 'gemini-2.5-flash-lite', 'a deliberately chosen model was overridden');
  await savePrefs(store, { theme: 'light' });
  assert.equal((await loadPrefs(store)).designModel, 'gemini-2.5-flash-lite');
});

test('an empty reply is retried and handed on, not reported as an answer', async () => {
  // "The model returned nothing at all" arrived with "this usually means the
  // thinking budget ate the output allowance" printed beside 625 thinking
  // tokens out of 16,384. Confidently wrong, in the one system that must not
  // be. Lite models return nothing intermittently; the fix is to ask again and
  // then ask a better model, not to blame a setting.
  const asked = [];
  const emptyThenFine = () => ({ models: { generateContent: async ({ model }) => {
    asked.push(model);
    if (asked.length < 3) {
      return { text: '', functionCalls: [], usageMetadata: { promptTokenCount: 100, thoughtsTokenCount: 625 }, candidates: [{ finishReason: 'STOP' }] };
    }
    return { text: 'built it', functionCalls: [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50 } };
  } } });

  const out = await run({ text: 'build the thing', config: cfg, store: createMemoryStore(), llmClientFactory: emptyThenFine }, {});
  assert.equal(out.status, 'ok', out.reply);
  assert.equal(out.reply, 'built it');
  assert.equal(asked[0], asked[1], 'the same model was not asked a second time');
  assert.notEqual(asked[2], asked[0], 'it never moved on to another model');
});

test('nothing blames the thinking budget when the numbers say otherwise', async () => {
  const { createLlm } = await import('../core/llm.js');
  const { createMeter } = await import('../core/meter.js');
  const alwaysEmpty = () => ({ models: { generateContent: async () => ({
    text: '', functionCalls: [], usageMetadata: { promptTokenCount: 100, thoughtsTokenCount: 625 }, candidates: [{ finishReason: 'STOP' }],
  }) } });

  const llm = createLlm({ apiKey: 'k', meter: createMeter({ store: createMemoryStore(), capUsd: 100 }), clientFactory: alwaysEmpty });
  const out = await llm.generate({ tier: 'design', contents: [], systemInstruction: 'x', timeoutMs: 3000 });
  assert.equal(out.empty, true);
  assert.doesNotMatch(out.emptyReason, /thinking budget ate|Lower the thinking budget/i, '625 of 16384 is not the budget running out');
  assert.match(out.emptyReason, /budget is not what did it|usually temporary/i);
});

test('the fallback is never the model you would least want', async () => {
  // The chains were ordered cheapest-first, so whatever you chose, the FIRST
  // fallback was gemini-2.5-flash-lite — the weakest model on the list and the
  // one that returns an empty reply most often. Falling back to the thing you
  // fell back from is not a fallback.
  const { TIERS } = await import('../core/llm.js');
  const { PRICES } = await import('../core/meter.js');
  const cheapest = Object.entries(PRICES).sort((a, b) => a[1].output - b[1].output)[0][0];

  assert.notEqual(TIERS.design.models[0], cheapest, 'the design tier still leads with the cheapest model there is');
  assert.ok(!TIERS.design.models.includes(cheapest), 'the weakest model is still in the design fallback chain');
  assert.notEqual(TIERS.chat.models[0], cheapest);
});

test('health reports the model that is running, not the chain it came from', async () => {
  // It reported the fallback chains alone, so it went on naming a model that
  // had not been the one running for some time. A status endpoint that is
  // confidently out of date is worse than one that says nothing.
  const { resetStoreCache, createStore } = await import('../core/store.js');
  const { savePrefs } = await import('../core/settings.js');
  resetStoreCache();
  await savePrefs(await createStore(), { designModel: 'gemini-2.5-pro' });

  const handler = (await import('../api/health.js')).default;
  const res = { statusCode: 0, setHeader() {}, end(t) { this.body = JSON.parse(t); } };
  await handler({ method: 'GET', headers: {} }, res);

  assert.equal(res.body.models.design, 'gemini-2.5-pro', 'health named a model that is not the one in use');
  assert.ok(Array.isArray(res.body.models.fallbacks.design), 'the chain is still worth knowing, alongside');
  resetStoreCache();
});

test('running out of time answers every call, not just the ones it reached', async () => {
  // The model's turn holds N function calls and Gemini requires N responses
  // immediately after it. Running out of time answered the current call and
  // broke out of the loop, leaving the rest unanswered — which poisons the
  // conversation for good:
  //
  //   400: Please ensure that function response turn comes immediately after
  //   a function call turn.
  //
  // Every later message then failed identically. "The model call failed",
  // twice in a row, on a conversation that could never recover.
  const { repairHistory } = await import('../core/run.js');
  const store = createMemoryStore();

  const threeCallsThenSlow = () => {
    let step = 0;
    return { models: { generateContent: async () => {
      if (step++ === 0) {
        return {
          text: '',
          functionCalls: [
            { name: 'search_nodes', args: { query: 'slack' } },
            { name: 'search_nodes', args: { query: 'sheets' } },
            { name: 'search_nodes', args: { query: 'gmail' } },
          ],
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
        };
      }
      return { text: 'done', functionCalls: [], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 } };
    } } };
  };

  // A deadline that expires while the calls are being worked through.
  await run({ text: 'find three things', sessionId: 's', config: cfg, store, llmClientFactory: threeCallsThenSlow, deadlineMs: 11_000 }, {});

  const saved = (await store.getSession('s')).messages;
  const callTurns = saved.filter((t) => (t.parts ?? []).some((p) => p.functionCall));
  for (const turn of callTurns) {
    const i = saved.indexOf(turn);
    const answers = saved[i + 1];
    if (!answers) continue; // an unanswered call at the very end is answered next turn
    const calls = turn.parts.filter((p) => p.functionCall).length;
    const responses = (answers.parts ?? []).filter((p) => p.functionResponse).length;
    assert.equal(responses, calls, `${calls} calls were answered with ${responses} responses — Gemini rejects that for good`);
  }
  assert.equal(repairHistory(saved).repaired, false, 'the saved conversation violates the pairing rule');
});

test('a conversation that already violates the pairing rule is repaired before it is sent', async () => {
  const { repairHistory } = await import('../core/run.js');

  // An orphan response, from a window that was trimmed between a call and its
  // answer — which slicing the last 40 messages does whenever it lands there.
  const orphaned = [
    { role: 'user', parts: [{ functionResponse: { name: 'search_nodes', response: { ok: true } } }] },
    { role: 'user', parts: [{ text: 'carry on' }] },
  ];
  const fixed = repairHistory(orphaned);
  assert.equal(fixed.repaired, true, 'an orphan function response was left in place');
  assert.doesNotMatch(JSON.stringify(fixed.contents), /"functionResponse"/);
  assert.match(JSON.stringify(fixed.contents), /result of search_nodes/, 'the repair threw away what had happened');

  // A mismatched count: two calls, one answer.
  const mismatched = [
    { role: 'model', parts: [{ functionCall: { name: 'a', args: {} } }, { functionCall: { name: 'b', args: {} } }] },
    { role: 'user', parts: [{ functionResponse: { name: 'a', response: {} } }] },
  ];
  assert.equal(repairHistory(mismatched).repaired, true, 'two calls answered once was accepted');

  // A healthy conversation is left completely alone.
  const healthy = [
    { role: 'user', parts: [{ text: 'build it' }] },
    { role: 'model', parts: [{ functionCall: { name: 'a', args: {} } }] },
    { role: 'user', parts: [{ functionResponse: { name: 'a', response: {} } }] },
    { role: 'model', parts: [{ text: 'done' }] },
  ];
  const untouched = repairHistory(healthy);
  assert.equal(untouched.repaired, false, 'a valid conversation was needlessly rewritten');
  assert.equal(untouched.contents, healthy);
});

test('a connections block of any shape does not throw', async () => {
  // "(branchList ?? []) is not iterable", from a workflow that already exists
  // in the user's n8n and opens perfectly well in the n8n editor. `?? []`
  // catches null and undefined and nothing else, so a number, a string or a
  // bare object where a list belongs took the whole turn down.
  const { buildPreview } = await import('../core/preview.js');
  const { validateWorkflow, eachLink } = await import('../core/validate.js');

  const nodes = [
    { id: 'a', name: 'A', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
    { id: 'b', name: 'B', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0], parameters: { mode: 'manual' } },
  ];

  const shapes = [
    { A: { main: 0 } },
    { A: { main: 'nonsense' } },
    { A: { main: {} } },
    { A: { main: [0, 'x', null, undefined] } },
    { A: { main: [[null, 5, 'x']] } },
    { A: { main: [[{ node: 'B' }]], index: 0 },  },
    { A: 7 },
    { A: null },
    { A: [] },
    { A: { ai_tool: [[{ node: 'B', type: 'ai_tool', index: 0 }]] } },
  ];

  for (const connections of shapes) {
    const where = JSON.stringify(connections);
    assert.doesNotThrow(() => buildPreview({ name: 'X', nodes, connections }), `the canvas threw on ${where}`);
    assert.doesNotThrow(() => [...eachLink(connections)], `the walker threw on ${where}`);
    await assert.doesNotReject(() => validateWorkflow({ name: 'X', nodes, connections }), `the validator threw on ${where}`);
  }

  // And the shapes that ARE valid still produce their links.
  assert.deepEqual(
    [...eachLink({ A: { main: [[{ node: 'B', type: 'main', index: 0 }]] } })].map((l) => `${l.from}->${l.to}`),
    ['A->B'],
  );
});

test('a workflow that will not draw does not stop the work', async () => {
  // The preview was built in the one place that sits OUTSIDE the tool's own
  // try, so a canvas that threw took the entire turn with it — and a workflow
  // that merely would not DRAW looked like one that would not build.
  const store = createMemoryStore();
  const exploding = () => ({ models: { generateContent: async () => ({
    text: '', functionCalls: [{ name: 'validate_workflow', args: { workflow: { nodes: [{ nope: true }] } } }],
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
  }) } });

  // previewFrom is handed deliberately hostile args; the turn must survive it.
  const out = await run({ text: 'check this', config: cfg, store, llmClientFactory: exploding, deadlineMs: 20_000 }, {});
  assert.notEqual(out.status, 'model_error', out.reply);
  assert.ok(['ok', 'continuing'].includes(out.status), `a preview problem produced status ${out.status}: ${out.reply}`);
});
