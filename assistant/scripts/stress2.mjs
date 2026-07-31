#!/usr/bin/env node
/**
 * Stress round two: the tool handlers, the n8n client and the protocol layer,
 * against an n8n that misbehaves in every way a real one can.
 *
 *   node scripts/stress2.mjs
 *
 * Round one covered the index, the validator, money, timing and the HTTP
 * surface. This covers what happens when the instance on the other end is
 * slow, rude, out of date, or lying — which is the normal condition of a real
 * server, not an edge case.
 */

import assert from 'node:assert/strict';

import { buildToolRegistry } from '../core/tools.js';
import { createN8nClient } from '../core/n8nClient.js';
import { createMemoryStore } from '../core/store.js';
import { run } from '../core/run.js';

let pass = 0;
const failures = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n')[0] }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};
const section = (t) => process.stdout.write(`\n${t}\n  `);

/* ---------------------------------------------------------------- fake n8n */

const WORKFLOW = {
  id: 'wf1',
  name: 'Leads',
  active: false,
  nodes: [
    { id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
    { id: '2', name: 'Post to Slack', type: 'n8n-nodes-base.slack', typeVersion: 2.4, position: [200, 0], parameters: { resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C1' }, text: 'hi' } },
  ],
  connections: { Start: { main: [[{ node: 'Post to Slack', type: 'main', index: 0 }]] } },
};

/**
 * A configurable n8n. `behaviour` decides how it misbehaves; `log` records
 * every call so tests can assert on what was actually done, not what was
 * reported.
 */
function fakeN8n(behaviour = {}) {
  const log = [];
  const created = new Map();
  const archived = new Set();
  let nextId = 100;

  const impl = async (url, init) => {
    const u = new URL(url);
    const p = u.pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    log.push(`${method} ${p}`);

    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

    if (behaviour.hang) return new Promise(() => {});
    if (behaviour.status) return new Response(behaviour.bodyText ?? JSON.stringify({ message: 'nope' }), { status: behaviour.status });
    if (behaviour.html) return new Response('<html><body>502 Bad Gateway</body></html>', { status: 502, headers: { 'Content-Type': 'text/html' } });
    if (behaviour.emptyBody) return new Response('', { status: 200 });
    if (behaviour.networkError) throw new Error('getaddrinfo ENOTFOUND n8n.invalid');

    if (method === 'POST' && p === '/workflows') {
      const wf = JSON.parse(init.body);
      if (behaviour.createReturnsNoId) return reply({ name: wf.name });
      const id = `new${nextId++}`;
      created.set(id, { ...wf, id, active: false });
      return reply({ ...wf, id, active: false });
    }
    if (method === 'GET' && p.startsWith('/workflows/')) {
      const id = decodeURIComponent(p.split('/')[2]);
      if (id === 'wf1') return reply(WORKFLOW);
      if (created.has(id)) return reply({ ...created.get(id), isArchived: archived.has(id) });
      return reply({ message: 'not found' }, 404);
    }
    if (method === 'GET' && p === '/workflows') return reply({ data: [WORKFLOW], nextCursor: behaviour.cursor ?? null });
    if (method === 'PUT' && p.startsWith('/workflows/')) return reply({ ...WORKFLOW, ...JSON.parse(init.body) });
    if (method === 'POST' && /\/archive$/.test(p)) {
      archived.add(decodeURIComponent(p.split('/')[2]));
      return reply({ id: p.split('/')[2], isArchived: true });
    }
    if (method === 'POST' && /\/(activate|deactivate)$/.test(p)) return reply({ ...WORKFLOW, active: p.endsWith('activate') });
    if (method === 'POST' && /\/(run|execute)$/.test(p)) {
      if (behaviour.cannotRun) return reply({ message: 'not found' }, 404);
      return reply({ executionId: 'ex1' });
    }
    if (method === 'GET' && p === '/executions') return reply({ data: [{ id: 'ex1', workflowId: 'wf1', status: 'error', startedAt: '2030-01-01T00:00:00.000Z' }], nextCursor: behaviour.cursor ?? null });
    if (method === 'GET' && p.startsWith('/executions/')) {
      return reply({
        id: 'ex1', workflowId: 'wf1', status: 'success',
        data: { resultData: { lastNodeExecuted: 'Start', runData: { List: [{ data: { main: [[{ json: { id: 'C0REAL', name: 'general' } }]] } }] } } },
      });
    }
    if (method === 'GET' && p === '/credentials') return reply({ data: [{ id: 'cred1', name: 'Slack', type: 'slackApi' }] });
    if (method === 'GET' && p === '/tags') return reply({ data: [{ id: 'tag1', name: 'existing' }] });
    if (method === 'POST' && p === '/tags') { const t = JSON.parse(init.body); return reply({ id: `tag_${t.name}`, name: t.name }); }
    if (method === 'PUT' && /\/tags$/.test(p)) return reply([{ id: 'tag_system:leads', name: 'system:leads' }]);
    return reply({ message: `no route for ${method} ${p}` }, 404);
  };

  return { impl, log, created, archived };
}

const registryFor = (fake, extra = {}) => {
  const store = createMemoryStore();
  const n8n = fake ? createN8nClient({ baseUrl: 'https://n8n.invalid', apiKey: 'k', fetchImpl: fake.impl }) : null;
  const tools = buildToolRegistry({ n8n, store, approvals: extra.approvals ?? [], prefs: extra.prefs ?? {}, onStatus: () => {} });
  return { tools, store, byName: (n) => tools.find((t) => t.name === n) };
};

const ARGS_BY_TOOL = {
  search_nodes: { query: 'slack' },
  get_node_schema: { nodeType: 'n8n-nodes-base.slack', resource: 'message', operation: 'post' },
  list_credentials: {},
  list_workflows: {},
  get_workflow: { id: 'wf1' },
  validate_workflow: { workflow: WORKFLOW },
  ground_options: { nodeType: 'n8n-nodes-base.slack', resource: 'channel', operation: 'getAll', credentialType: 'slackApi', credentialId: 'cred1' },
  save_workflow: { mode: 'create', workflow: WORKFLOW },
  dry_run_workflow: { id: 'wf1' },
  list_failed_executions: {},
  get_execution: { id: 'ex1' },
  set_workflow_active: { id: 'wf1', active: false },
  archive_workflow: { id: 'wf1' },
  list_snapshots: {},
  remember: { fact: 'The real channel is #leads' },
  ask_peer: { question: 'which channel?' },
  list_peers: {},
  recall: {},
};

/* ============================================ 1. every tool, hostile n8n */

section('1. Every tool against an n8n that misbehaves');

const BEHAVIOURS = [
  ['500 with a message', { status: 500, bodyText: JSON.stringify({ message: 'internal error' }) }],
  ['429 rate limited', { status: 429, bodyText: JSON.stringify({ message: 'too many requests' }) }],
  ['401 bad key', { status: 401, bodyText: JSON.stringify({ message: 'unauthorized' }) }],
  ['an HTML error page', { html: true }],
  ['an empty body', { emptyBody: true }],
  ['a network failure', { networkError: true }],
  ['create returning no id', { createReturnsNoId: true }],
  ['no run endpoint', { cannotRun: true }],
];

for (const [label, behaviour] of BEHAVIOURS) {
  const fake = fakeN8n(behaviour);
  const { tools, byName } = registryFor(fake);
  const broken = [];
  for (const tool of tools) {
    try {
      const out = await tool.handler(ARGS_BY_TOOL[tool.name] ?? {});
      if (typeof out?.ok !== 'boolean') broken.push(`${tool.name} returned ${JSON.stringify(out)?.slice(0, 60)}`);
      if (out?.ok === false && !out.error) broken.push(`${tool.name} failed with no message`);
      if (out?.ok === false && /undefined|\[object Object\]/.test(String(out.error))) broken.push(`${tool.name}: unreadable error "${String(out.error).slice(0, 80)}"`);
    } catch (err) {
      broken.push(`${tool.name} THREW: ${err.message.slice(0, 80)}`);
    }
  }
  await check(`every tool copes with ${label}`, () => assert.deepEqual(broken, [], broken.join(' | ')));
}

await check('every tool copes with no n8n configured at all', async () => {
  const { tools } = registryFor(null);
  const broken = [];
  for (const tool of tools) {
    try {
      const out = await tool.handler(ARGS_BY_TOOL[tool.name] ?? {});
      if (typeof out?.ok !== 'boolean') broken.push(`${tool.name} returned a non-result`);
    } catch (err) { broken.push(`${tool.name} THREW: ${err.message.slice(0, 60)}`); }
  }
  assert.deepEqual(broken, [], broken.join(' | '));
});

await check('every tool copes with missing and junk arguments', async () => {
  const fake = fakeN8n();
  const { tools } = registryFor(fake);
  const broken = [];
  for (const tool of tools) {
    for (const args of [{}, { id: null }, { id: '' }, { workflow: null }, { workflow: 'text' }, { id: { nested: true } }, { limit: -1 }, { query: 42 }]) {
      try {
        const out = await tool.handler(args);
        if (typeof out?.ok !== 'boolean') broken.push(`${tool.name}(${JSON.stringify(args)}) returned a non-result`);
      } catch (err) { broken.push(`${tool.name}(${JSON.stringify(args)}) THREW: ${err.message.slice(0, 60)}`); }
    }
  }
  assert.deepEqual(broken, [], broken.slice(0, 4).join(' | '));
});

/* ================================================ 2. what tools leave behind */

section('2. What a test leaves behind in your instance');

await check('a dry run does not leave a permanent copy cluttering the workflow list', async () => {
  const fake = fakeN8n();
  const { byName } = registryFor(fake);
  const out = await byName('dry_run_workflow').handler({ id: 'wf1' });
  assert.equal(out.ok, true, out.error);
  const id = out.testWorkflowId;
  assert.ok(id, 'no test workflow id came back');
  assert.ok(
    fake.archived.has(id),
    `the test copy ${id} was left visible in the instance. Every dry run adds one, so after twenty builds the workflow list is twenty junk copies.`,
  );
});

await check('a dry run still tells you where the test copy went', async () => {
  const fake = fakeN8n();
  const { byName } = registryFor(fake);
  const out = await byName('dry_run_workflow').handler({ id: 'wf1' });
  assert.match(out.note, /archiv/i, `the note does not say what happened to the copy: "${out.note}"`);
  assert.match(out.note, /nothing was deleted/i, 'it must still say plainly that nothing was destroyed');
  // "Nothing was deleted" is right; claiming to have deleted anything is not.
  assert.doesNotMatch(out.note, /\bI deleted\b|\bhas been deleted\b|\bremoved it\b/i);
});

await check('a probe archives itself even when the run fails', async () => {
  const fake = fakeN8n({ cannotRun: true });
  const { byName } = registryFor(fake);
  const out = await byName('ground_options').handler(ARGS_BY_TOOL.ground_options);
  assert.equal(out.ok, false, 'a probe that could not run must not report values');
  assert.ok(out.probeWorkflowId, 'no probe id reported');
  assert.ok(fake.archived.has(out.probeWorkflowId), 'the probe was left behind');
});

await check('a probe refuses a write operation outright', async () => {
  const { byName } = registryFor(fakeN8n());
  const out = await byName('ground_options').handler({ ...ARGS_BY_TOOL.ground_options, resource: 'message', operation: 'post' });
  assert.equal(out.ok, false);
  assert.match(out.error, /read-only/i);
});

await check('a workflow created with no id back does not produce a request to /workflows/undefined', async () => {
  const fake = fakeN8n({ createReturnsNoId: true });
  const { byName } = registryFor(fake);
  const out = await byName('dry_run_workflow').handler({ id: 'wf1' });
  assert.equal(out.ok, false, 'it reported success without knowing what it created');
  assert.ok(!fake.log.some((l) => /undefined/.test(l)), `it called ${fake.log.filter((l) => /undefined/.test(l)).join(', ')}`);
});

/* ================================ 2b. the guarantee that a test never sends */

section('2b. Nothing that sends survives a dry run');

const { isWriteOperation, isOpaqueNode } = await import('../core/nodeIndex.js');
const { writeNodesIn, opaqueNodesIn } = await import('../core/tools.js');

// Real senders. Every one of these must be switched off in a dry run, and the
// failure mode of getting it wrong is a real message to a real person.
const SENDERS = [
  ['n8n-nodes-base.gmail', { resource: 'message', operation: 'send' }],
  ['n8n-nodes-base.slack', { resource: 'message', operation: 'post' }],
  ['n8n-nodes-base.telegram', { resource: 'message', operation: 'sendMessage' }],
  ['n8n-nodes-base.discord', { resource: 'message', operation: 'send' }],
  ['n8n-nodes-base.twilio', { resource: 'sms', operation: 'send' }],
  ['n8n-nodes-base.awsSes', { resource: 'email', operation: 'send' }],
  ['n8n-nodes-base.googleSheets', { resource: 'sheet', operation: 'append' }],
  ['n8n-nodes-base.airtable', { operation: 'create' }],
  ['n8n-nodes-base.stripe', { resource: 'charge', operation: 'create' }],
  ['n8n-nodes-base.hubspot', { resource: 'contact', operation: 'upsert' }],
  ['n8n-nodes-base.notion', { resource: 'databasePage', operation: 'create' }],
  ['n8n-nodes-base.emailSend', {}],
  ['n8n-nodes-base.httpRequest', { method: 'POST', url: 'https://api.example.com/charge' }],
  ['n8n-nodes-base.httpRequest', { method: 'DELETE', url: 'https://api.example.com/thing' }],
  ['n8n-nodes-base.httpRequest', { method: 'PUT', url: 'https://api.example.com/thing' }],
  ['n8n-nodes-base.httpRequest', { method: 'PATCH', url: 'https://api.example.com/thing' }],
  ['n8n-nodes-base.ftp', { operation: 'upload' }],
  ['n8n-nodes-base.s3', { resource: 'file', operation: 'upload' }],
  ['n8n-nodes-base.executeWorkflow', {}],
  ['n8n-nodes-base.respondToWebhook', {}],
];

const missed = [];
for (const [type, parameters] of SENDERS) {
  const detected = isWriteOperation({
    type,
    resource: parameters.resource ?? null,
    operation: parameters.operation ?? null,
    parameters,
  });
  if (!detected) missed.push(`${type} ${JSON.stringify(parameters).slice(0, 44)}`);
}
await check(`all ${SENDERS.length} known senders are recognised as sending`, () => {
  assert.deepEqual(missed, [], `NOT disabled in a dry run: ${missed.join(' | ')}`);
});

// The other direction: reads must stay on, or a dry run proves nothing.
const READS = [
  ['n8n-nodes-base.slack', { resource: 'message', operation: 'search' }],
  ['n8n-nodes-base.gmail', { resource: 'message', operation: 'getAll' }],
  ['n8n-nodes-base.googleSheets', { resource: 'sheet', operation: 'read' }],
  ['n8n-nodes-base.httpRequest', { method: 'GET', url: 'https://api.example.com/list' }],
  ['n8n-nodes-base.if', {}],
  ['n8n-nodes-base.merge', {}],
  ['n8n-nodes-base.filter', {}],
  ['n8n-nodes-base.splitInBatches', {}],
  ['n8n-nodes-base.manualTrigger', {}],
  ['n8n-nodes-base.scheduleTrigger', {}],
];
const overDisabled = [];
for (const [type, parameters] of READS) {
  if (isWriteOperation({ type, resource: parameters.resource ?? null, operation: parameters.operation ?? null, parameters })) {
    overDisabled.push(`${type} ${JSON.stringify(parameters).slice(0, 40)}`);
  }
}
await check('reads and plumbing stay switched on, so a dry run still proves something', () => {
  assert.deepEqual(overDisabled, [], `disabled unnecessarily: ${overDisabled.join(' | ')}`);
});

await check('a dry run actually disables the sending nodes in the copy it runs', async () => {
  const fake = fakeN8n();
  const sending = {
    ...WORKFLOW,
    nodes: [
      WORKFLOW.nodes[0],
      { id: '2', name: 'Email the lead', type: 'n8n-nodes-base.emailSend', typeVersion: 2, position: [200, 0], parameters: { toEmail: 'someone@real.com' } },
      { id: '3', name: 'Charge the card', type: 'n8n-nodes-base.httpRequest', typeVersion: 4, position: [400, 0], parameters: { method: 'POST', url: 'https://api.stripe.com/v1/charges' } },
      { id: '4', name: 'Read the sheet', type: 'n8n-nodes-base.googleSheets', typeVersion: 4, position: [600, 0], parameters: { resource: 'sheet', operation: 'read' } },
    ],
  };
  const writers = writeNodesIn(sending);
  assert.ok(writers.includes('Email the lead'), 'the Send Email node would have sent a real email during a test');
  assert.ok(writers.includes('Charge the card'), 'the POST would have gone through during a test');
  assert.ok(!writers.includes('Read the sheet'), 'a read was disabled needlessly');
});

await check('a node whose reach cannot be inspected is named, not silently assumed safe', () => {
  const wf = { nodes: [{ name: 'Do something clever', type: 'n8n-nodes-base.code', parameters: {} }, { name: 'Post', type: 'n8n-nodes-base.slack', parameters: { resource: 'message', operation: 'post' } }] };
  const opaque = opaqueNodesIn(wf);
  assert.ok(opaque.includes('Do something clever'), 'a Code node was treated as inspectable');
  assert.ok(isOpaqueNode('n8n-nodes-base.code'));
});

await check('the dry run report says what it could not be certain about', async () => {
  const fake = fakeN8n();
  const { byName } = registryFor(fake);
  const out = await byName('dry_run_workflow').handler({ id: 'wf1' });
  assert.equal(out.ok, true);
  assert.ok('couldNotBeCertainAbout' in out, 'the report has no place to say what it could not verify');
});

/* =========================================== 3. the promise to carry on */

section('3. The promise to carry on');

const scripted = (script) => {
  let i = 0;
  return () => ({ models: { generateContent: async ({ config }) => {
    const s = script[Math.min(i++, script.length - 1)];
    if (s.delayMs) await new Promise((resolve, reject) => {
      const t = setTimeout(resolve, s.delayMs);
      config?.abortSignal?.addEventListener('abort', () => { clearTimeout(t); reject(new Error('aborted')); });
    });
    return { text: s.text ?? '', functionCalls: s.calls ?? [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 50 } };
  } } });
};
const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };

await check('an unfinished turn keeps the conversation, so "carry on" actually can', async () => {
  const store = createMemoryStore();
  const first = await run(
    { text: 'build the lead pipeline', sessionId: 's1', config: cfg, store, deadlineMs: 40_000, llmClientFactory: scripted([{ calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.equal(first.status, 'continuing');

  const session = await store.getSession('s1');
  assert.ok(
    (session.messages ?? []).length > 0,
    'the unfinished turn saved nothing to the session, so asking him to carry on starts from scratch — he repeats the work and has no record of what he already did',
  );
  assert.ok(JSON.stringify(session.messages).includes('search_nodes'), 'the work already done is not in the carried context');
});

await check('a saved job can actually be resumed', async () => {
  const store = createMemoryStore();
  const first = await run(
    { text: 'build it', config: cfg, store, deadlineMs: 40_000, llmClientFactory: scripted([{ calls: [{ name: 'search_nodes', args: { query: 'slack' } }] }]) },
    {},
  );
  assert.ok(first.jobId);
  const second = await run(
    { text: 'carry on', resumeJobId: first.jobId, config: cfg, store, deadlineMs: 20_000, llmClientFactory: scripted([{ text: 'finished it' }]) },
    {},
  );
  assert.equal(second.status, 'ok', `resuming gave ${second.status}`);
  assert.equal(second.resumedFrom, first.jobId, 'the job id was returned to the caller but nothing can be done with it');
});

/* ==================================================== 4. the MCP door */

section('4. The MCP door');

const mcpCall = async (body, { token = null } = {}) => {
  const handler = (await import('../api/mcp.js')).default;
  const chunks = [];
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    write(c) { chunks.push(String(c)); },
    end(c) { if (c) chunks.push(String(c)); this.text = chunks.join(''); },
    get body() { try { return JSON.parse(this.text ?? ''); } catch { return null; } },
  };
  await handler({ method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {}, body }, res);
  return res;
};

process.env.AGENT_TOKEN = 'stress-agent-token';

await check('an unknown JSON-RPC method gets a proper error, not a crash', async () => {
  const res = await mcpCall({ jsonrpc: '2.0', id: 1, method: 'nonsense/method' }, { token: 'stress-agent-token' });
  assert.equal(res.body.error.code, -32601);
});

await check('malformed JSON-RPC does not take the door off its hinges', async () => {
  for (const body of [{}, { method: null }, { method: 123 }, { jsonrpc: '2.0', id: 1 }, { method: 'tools/call' }, { method: 'tools/call', params: {} }, { method: 'tools/call', params: { name: 'nope' } }]) {
    const res = await mcpCall(body, { token: 'stress-agent-token' });
    assert.ok(res.statusCode >= 200, `no response for ${JSON.stringify(body)}`);
    assert.ok(res.body !== null || res.statusCode === 202, `unparseable response for ${JSON.stringify(body)}`);
  }
});

await check('an external agent cannot approve on your behalf', async () => {
  const res = await mcpCall({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'set_workflow_active', arguments: { id: 'wf1', active: true, approvals: ['activate_workflow'] } } }, { token: 'stress-agent-token' });
  const out = res.body.result?.structuredContent;
  assert.ok(out, 'no structured result');
  assert.notEqual(out.ok, true, 'an external agent activated a workflow by passing its own approval');
});

await check('tools/list exposes every tool with a usable schema', async () => {
  const res = await mcpCall({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, { token: 'stress-agent-token' });
  const tools = res.body.result.tools;
  assert.ok(tools.length >= 15, `only ${tools.length} tools exposed`);
  for (const t of tools) {
    assert.equal(t.inputSchema.type, 'object', `${t.name} has no object schema`);
    assert.ok(!/delete|destroy|purge/i.test(t.name));
  }
});

await check('a tool that throws inside MCP comes back as an error result, not a 500', async () => {
  const res = await mcpCall({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'validate_workflow', arguments: { workflow: { nodes: [null] } } } }, { token: 'stress-agent-token' });
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.result);
});

/* =============================== 4b. what actually ships to each function */

section('4b. What ships with each function');

const fsMod = await import('node:fs');
const pathMod = await import('node:path');
const { fileURLToPath } = await import('node:url');
const ROOT = pathMod.resolve(pathMod.dirname(fileURLToPath(import.meta.url)), '..');

/** Follow the imports out of a route and see whether it reaches the node index. */
function reachesNodeIndex(entryFile) {
  const seen = new Set();
  const stack = [entryFile];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file) || !fsMod.existsSync(file)) continue;
    seen.add(file);
    if (file.endsWith('nodeIndex.js')) return true;
    const src = fsMod.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/from\s+'(\.[^']+)'/g)) {
      stack.push(pathMod.resolve(pathMod.dirname(file), m[1]));
    }
    for (const m of src.matchAll(/import\(\s*'(\.[^']+)'\s*\)/g)) {
      stack.push(pathMod.resolve(pathMod.dirname(file), m[1]));
    }
  }
  return false;
}

await check('every route that reads the node index has it bundled with it', () => {
  const vercel = JSON.parse(fsMod.readFileSync(pathMod.join(ROOT, 'vercel.json'), 'utf8'));
  const missing = [];
  for (const file of fsMod.readdirSync(pathMod.join(ROOT, 'api'))) {
    if (!file.endsWith('.js')) continue;
    if (!reachesNodeIndex(pathMod.join(ROOT, 'api', file))) continue;
    const entry = vercel.functions?.[`api/${file}`];
    if (!entry?.includeFiles) {
      // The route 401s before it reaches the index, so an unauthenticated probe
      // of production says nothing about whether this works.
      missing.push(`api/${file} reads the node index but has no includeFiles in vercel.json — the files are read at runtime, so Vercel's tracer never sees them and the route fails only once someone is actually signed in`);
    }
  }
  assert.deepEqual(missing, [], missing.join(' | '));
});

await check('every route in vercel.json exists on disk', () => {
  const vercel = JSON.parse(fsMod.readFileSync(pathMod.join(ROOT, 'vercel.json'), 'utf8'));
  for (const route of Object.keys(vercel.functions ?? {})) {
    assert.ok(fsMod.existsSync(pathMod.join(ROOT, route)), `vercel.json configures ${route}, which does not exist`);
  }
});

/* ================================================== 5. two at once */

section('5. Two things at once');

await check('two runs sharing a store do not corrupt each other', async () => {
  const store = createMemoryStore();
  const [a, b] = await Promise.all([
    run({ text: 'first', sessionId: 'sa', config: cfg, store, llmClientFactory: scripted([{ text: 'A' }]) }, {}),
    run({ text: 'second', sessionId: 'sb', config: cfg, store, llmClientFactory: scripted([{ text: 'B' }]) }, {}),
  ]);
  assert.equal(a.reply, 'A');
  assert.equal(b.reply, 'B');
  assert.match(JSON.stringify(await store.getSession('sa')), /first/);
  assert.match(JSON.stringify(await store.getSession('sb')), /second/);
  assert.doesNotMatch(JSON.stringify(await store.getSession('sa')), /second/);
});

await check('spend from concurrent runs is all recorded', async () => {
  const store = createMemoryStore();
  await Promise.all(Array.from({ length: 8 }, (_, i) =>
    run({ text: `turn ${i}`, config: cfg, store, llmClientFactory: scripted([{ text: 'x' }]) }, {})));
  const spend = await store.recentSpend(50);
  assert.equal(spend.length, 8, `${spend.length} of 8 calls were metered`);
});

/* ============================== 6. a database with rubbish in it */

section('6. Corrupted state');

const { loadPrefs, describeServerConfig, loadServerConfig, isPasswordSet, checkPassword } = await import('../core/settings.js');
const { loadMemory, activeFacts, memoryPrompt } = await import('../core/memory.js');
const { listPeers } = await import('../core/peers.js');

const CORRUPTIONS = ['a string', 42, [], null, { unexpected: true }, [null, null], 'null', { prefs: 'nested wrongly' }];

await check('corrupted preferences fall back to defaults instead of taking him down', async () => {
  for (const junk of CORRUPTIONS) {
    const store = createMemoryStore();
    await store.setKv('settings:prefs', junk);
    const prefs = await loadPrefs(store);
    assert.equal(typeof prefs.maxSteps, 'number', `loadPrefs returned nonsense for ${JSON.stringify(junk)}`);
    assert.ok(prefs.chatModel, 'no model after corruption');
  }
});

await check('corrupted memory does not stop him answering', async () => {
  for (const junk of CORRUPTIONS) {
    const store = createMemoryStore();
    await store.setKv('memory:facts', junk);
    assert.ok(Array.isArray(await loadMemory(store)), `loadMemory broke on ${JSON.stringify(junk)}`);
    assert.ok(Array.isArray(await activeFacts(store)));
    assert.equal(typeof (await memoryPrompt(store)), 'string');
  }
});

await check('corrupted peers do not stop him asking', async () => {
  for (const junk of CORRUPTIONS) {
    const store = createMemoryStore();
    await store.setKv('settings:peers', junk);
    assert.ok(Array.isArray(await listPeers(store)), `listPeers broke on ${JSON.stringify(junk)}`);
  }
});

await check('a corrupted password record refuses entry rather than throwing', async () => {
  for (const junk of CORRUPTIONS) {
    const store = createMemoryStore();
    await store.setKv('auth:owner', junk);
    assert.equal(typeof (await isPasswordSet(store)), 'boolean');
    assert.equal(await checkPassword(store, 'anything'), false, `a corrupted record let "anything" in for ${JSON.stringify(junk)}`);
  }
});

await check('corrupted stored keys are reported as unset, not crashed on', async () => {
  for (const junk of ['not encrypted', { blob: 'nonsense' }, 42, []]) {
    const store = createMemoryStore();
    await store.setKv('settings:secrets', junk);
    const described = await describeServerConfig(store);
    assert.ok(described, 'describeServerConfig returned nothing');
    const loaded = await loadServerConfig(store);
    assert.equal(typeof loaded, 'object');
  }
});

await check('a whole run survives a store full of rubbish', async () => {
  const store = createMemoryStore();
  for (const key of ['settings:prefs', 'memory:facts', 'settings:peers', 'settings:secrets']) await store.setKv(key, 'corrupted');
  const r = await run({ text: 'what is running?', config: cfg, store, llmClientFactory: scripted([{ text: 'an answer' }]) }, {});
  assert.equal(r.status, 'ok', `status ${r.status}: ${r.reply?.slice(0, 90)}`);
});

/* ============================== 7. tokens and the scheduled sweep */

section('7. Tokens and the sweep');

const { authenticate } = await import('../core/auth.js');

await check('a retired token stops working', async () => {
  const { mintToken } = await import('../core/auth.js');
  const store = createMemoryStore();
  const minted = mintToken('stress');
  await store.addToken({ id: 't1', label: 'stress', hash: minted.hash, createdAt: new Date().toISOString() });

  const before = await authenticate({ headers: { authorization: `Bearer ${minted.raw}` } }, store);
  assert.equal(before.ok, true, 'a freshly minted token did not work');

  await store.retireToken('t1');
  const after = await authenticate({ headers: { authorization: `Bearer ${minted.raw}` } }, store);
  assert.equal(after.ok, false, 'a retired token still works');
});

await check('a token is compared in constant time and never stored in the clear', async () => {
  const { mintToken, hashToken } = await import('../core/auth.js');
  const store = createMemoryStore();
  const minted = mintToken('stress');
  await store.addToken({ id: 't1', label: 'x', hash: minted.hash, createdAt: new Date().toISOString() });
  assert.doesNotMatch(JSON.stringify(await store.listTokens()), new RegExp(minted.raw.slice(-12)), 'the raw token is recoverable from storage');
  assert.notEqual(minted.hash, minted.raw);
  assert.equal(hashToken(minted.raw), minted.hash);
});

await check('a wrong, empty or malformed token is refused every time', async () => {
  const store = createMemoryStore();
  for (const header of [undefined, '', 'Bearer', 'Bearer ', 'Bearer wrong', 'Basic abc', 'Bearer ' + 'x'.repeat(5000), 'bearer lowercase']) {
    const res = await authenticate({ headers: header === undefined ? {} : { authorization: header } }, store);
    assert.equal(res.ok, false, `"${String(header).slice(0, 30)}" was accepted`);
  }
});

await check('the sweep runs without a browser and reports rather than throwing', async () => {
  process.env.AGENT_TOKEN = 'stress-agent-token';
  const handler = (await import('../api/sweep.js')).default;
  const chunks = [];
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(c) { if (c) chunks.push(String(c)); this.text = chunks.join(''); },
    get body() { try { return JSON.parse(this.text ?? ''); } catch { return null; } },
  };
  await handler({ method: 'POST', headers: { authorization: 'Bearer stress-agent-token' }, body: {} }, res);
  assert.ok(res.body, `the sweep returned unparseable output: ${res.text?.slice(0, 80)}`);
  assert.equal(typeof res.body.ok, 'boolean');
});

/* ============================== 8. the browser hangs up mid-answer */

section('8. The browser hangs up mid-answer');

await check('a client that disconnects mid-stream does not crash the function', async () => {
  const handler = (await import('../api/chat.js')).default;
  const { createStore, resetStoreCache } = await import('../core/store.js');
  const { setupPassword, sessionSecret } = await import('../core/settings.js');
  const { issueSession, sessionCookie } = await import('../core/secrets.js');

  process.env.ALLOW_MEMORY_AUTH = '1';
  resetStoreCache();
  const store = await createStore({ databaseUrl: null });
  await setupPassword(store, 'stress-test-password');
  const cookie = sessionCookie(issueSession(await sessionSecret(store))).split(';')[0];

  // The socket is gone: every write throws, exactly as Node does after a
  // client disconnect.
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    write() { throw new Error('write after end'); },
    end() {},
  };

  let threw = null;
  try {
    await handler({ method: 'POST', headers: { cookie }, body: { text: 'hello' } }, res);
  } catch (err) {
    threw = err.message;
  }
  assert.equal(threw, null, `the handler threw after the client left: ${threw}`);
});

/* ============================== 9. the watch keeps watching */

section('9. The watch, and what it does not tell you');

const sweepRes = async (body, store, executions) => {
  const handler = (await import('../api/sweep.js')).default;
  const chunks = [];
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(c) { if (c) chunks.push(String(c)); this.text = chunks.join(''); },
    get body() { try { return JSON.parse(this.text ?? ''); } catch { return null; } },
  };
  process.env.AGENT_TOKEN = 'stress-agent-token';
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (p === '/executions') return reply({ data: executions });
    if (p.startsWith('/executions/')) {
      const id = p.split('/')[2];
      return reply({ id, workflowId: 'wf1', status: 'error', data: { resultData: { lastNodeExecuted: 'Slack', runData: { Slack: [{ error: { message: 'boom' } }] } } } });
    }
    return reply({});
  };
  try {
    await handler({ method: 'POST', headers: { authorization: 'Bearer stress-agent-token' }, body: { explain: false, ...body }, __store: store }, res);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.N8N_BASE_URL;
    delete process.env.N8N_API_KEY;
  }
  return res;
};

await check('the sweep keeps noticing failures after execution ids gain a digit', async () => {
  const { createStore, resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  const store = await createStore({ databaseUrl: null });

  // Ids climb past a digit boundary, which is where a string comparison quietly
  // decides nothing is new ever again: "100" > "99" is false.
  const first = await sweepRes({}, store, [{ id: '99', workflowId: 'wf1', startedAt: new Date().toISOString() }]);
  assert.equal(first.body.newFailures, 1, 'the first failure was not picked up');

  const second = await sweepRes({}, store, [{ id: '100', workflowId: 'wf1', startedAt: new Date().toISOString() }]);
  assert.equal(
    second.body.newFailures,
    1,
    'execution 100 was treated as older than 99, so the watch stopped reporting anything new — silently, forever',
  );
});

await check('the sweep does not report the same failure twice', async () => {
  const { createStore, resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  const store = await createStore({ databaseUrl: null });
  const executions = [{ id: '500', workflowId: 'wf1', startedAt: new Date().toISOString() }];
  await sweepRes({}, store, executions);
  const again = await sweepRes({}, store, executions);
  assert.equal(again.body.newFailures, 0, 'the same failure was reported twice');
});

await check('a truncated list says so instead of implying that is everything', async () => {
  // "You have 30 workflows" is confidently wrong on an instance with 200, and
  // nothing in the answer hints that a limit was applied.
  const fake = fakeN8n({ cursor: 'next-page-token' });
  const { byName } = registryFor(fake);

  const workflows = await byName('list_workflows').handler({ limit: 1 });
  assert.equal(workflows.ok, true);
  assert.ok(
    workflows.more === true || /more|truncat|only the first/i.test(JSON.stringify(workflows.note ?? '')),
    'the workflow list was cut short with nothing saying so',
  );

  const failures = await byName('list_failed_executions').handler({ limit: 1 });
  assert.ok(
    failures.more === true || /more|truncat|only the first/i.test(JSON.stringify(failures.note ?? '')),
    'the failure list was cut short with nothing saying so',
  );
});

/* ============================== 10. the client's manners */

section('10. How he treats your instance');

await check('consecutive calls are spaced rather than fired all at once', async () => {
  const times = [];
  const client = createN8nClient({
    baseUrl: 'https://n8n.invalid', apiKey: 'k',
    fetchImpl: async () => { times.push(Date.now()); return new Response(JSON.stringify({ id: 'wf1' }), { status: 200, headers: { 'Content-Type': 'application/json' } }); },
  });
  for (let i = 0; i < 4; i++) await client.getWorkflow('wf1');
  const gaps = times.slice(1).map((t, i) => t - times[i]);
  assert.ok(gaps.every((g) => g >= 250), `calls went out ${gaps.join('ms, ')}ms apart — n8n drops rapid consecutive writes`);
});

await check('a read-back that disagrees is retried once before it is believed', async () => {
  // A single disagreeing read is more often a race than a real failure.
  let reads = 0;
  const client = createN8nClient({
    baseUrl: 'https://n8n.invalid', apiKey: 'k',
    fetchImpl: async (url, init) => {
      const p = new URL(url).pathname;
      const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
      if ((init?.method ?? 'GET') === 'POST') return reply({ ok: true });
      reads++;
      // First read still says inactive; the second catches up.
      return reply({ id: 'wf1', active: reads > 1 });
    },
  });
  const res = await client.setActive('wf1', true);
  assert.ok(reads >= 2, 'it believed the first disagreeing read');
  assert.equal(res.confirmed, true, 'the retry did not change the verdict');
});

await check('a read-back that still disagrees is reported as unconfirmed, never as done', async () => {
  const client = createN8nClient({
    baseUrl: 'https://n8n.invalid', apiKey: 'k',
    fetchImpl: async (url, init) => {
      const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
      return (init?.method ?? 'GET') === 'POST' ? reply({ ok: true }) : reply({ id: 'wf1', active: false });
    },
  });
  const res = await client.setActive('wf1', true);
  assert.equal(res.confirmed, false);
  assert.equal(res.actual, false, 'it reported what was asked for rather than what came back');
});

await check('every shape of n8n failure is read for the node that broke', async () => {
  const { describeFailure } = await import('../core/assess.js');
  const shapes = [
    [{ data: { resultData: { error: { message: 'top level boom' }, lastNodeExecuted: 'Slack' } } }, 'Slack', 'top level boom'],
    [{ data: { resultData: { runData: { Sheets: [{ error: { message: 'per node boom' } }] } } } }, 'Sheets', 'per node boom'],
    [{ data: { executionData: { resultData: { error: { message: 'nested boom' }, lastNodeExecuted: 'Gmail' } } } }, 'Gmail', 'nested boom'],
    [{ data: { resultData: { lastNodeExecuted: 'Only this' } } }, 'Only this', null],
    [{}, null, null],
    [null, null, null],
  ];
  for (const [execution, node, message] of shapes) {
    const d = describeFailure(execution);
    assert.equal(d.node, node, `wrong node for ${JSON.stringify(execution)?.slice(0, 50)}`);
    assert.equal(d.message, message);
  }
});

/* ============================== 11. the settings and token routes */

section('11. Settings and tokens, for real');

const callRoute = async (route, req) => {
  const handler = (await import(`../api/${route}`)).default;
  const chunks = [];
  const res = {
    statusCode: 0, headers: {},
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(c) { if (c) chunks.push(String(c)); this.text = chunks.join(''); },
    get body() { try { return JSON.parse(this.text ?? ''); } catch { return null; } },
  };
  await handler(req, res);
  return res;
};

await check('preferences saved through the route come back applied', async () => {
  const { createStore, resetStoreCache } = await import('../core/store.js');
  const { setupPassword, sessionSecret, loadPrefs } = await import('../core/settings.js');
  const { issueSession, sessionCookie } = await import('../core/secrets.js');
  process.env.ALLOW_MEMORY_AUTH = '1';
  resetStoreCache();
  const store = await createStore({ databaseUrl: null });
  await setupPassword(store, 'stress-test-password');
  const cookie = sessionCookie(issueSession(await sessionSecret(store))).split(';')[0];

  const res = await callRoute('settings.js', { method: 'POST', headers: { cookie }, body: { prefs: { accent: 'violet', maxSteps: 12 } } });
  assert.equal(res.body.ok, true, res.body?.error);
  const prefs = await loadPrefs(store);
  assert.equal(prefs.accent, 'violet');
  assert.equal(prefs.maxSteps, 12);
});

await check('a fact told through the route is remembered, and forgetting keeps the record', async () => {
  const { createStore } = await import('../core/store.js');
  const { sessionSecret } = await import('../core/settings.js');
  const { issueSession, sessionCookie } = await import('../core/secrets.js');
  const store = await createStore({ databaseUrl: null });
  const cookie = sessionCookie(issueSession(await sessionSecret(store))).split(';')[0];

  const added = await callRoute('settings.js', { method: 'POST', headers: { cookie }, body: { memory: { action: 'add', text: 'The real channel is #leads-uk' } } });
  assert.equal(added.body.ok, true, added.body?.error);
  assert.ok(added.body.memory.some((f) => /leads-uk/.test(f.text)));

  const id = added.body.memory.find((f) => /leads-uk/.test(f.text)).id;
  const retired = await callRoute('settings.js', { method: 'POST', headers: { cookie }, body: { memory: { action: 'retire', id } } });
  assert.ok(!retired.body.memory.some((f) => f.id === id), 'the fact is still active after being forgotten');

  const { loadMemory } = await import('../core/memory.js');
  assert.ok((await loadMemory(store)).some((f) => f.id === id), 'forgetting destroyed the record instead of retiring it');
});

await check('a minted token works once and is never shown again', async () => {
  const { createStore } = await import('../core/store.js');
  process.env.AGENT_TOKEN = 'stress-agent-token';
  const store = await createStore({ databaseUrl: null });

  const minted = await callRoute('tokens.js', { method: 'POST', headers: { authorization: 'Bearer stress-agent-token' }, body: { action: 'mint', label: 'another ai' } });
  assert.equal(minted.body.ok, true, minted.body?.error);
  const token = minted.body.token;
  assert.ok(token, 'no token came back');

  const { authenticate } = await import('../core/auth.js');
  assert.equal((await authenticate({ headers: { authorization: `Bearer ${token}` } }, store)).ok, true, 'the minted token does not work');

  const listed = await callRoute('tokens.js', { method: 'GET', headers: { authorization: 'Bearer stress-agent-token' } });
  assert.equal(listed.body.ok, true, listed.body?.error);
  assert.doesNotMatch(JSON.stringify(listed.body), new RegExp(token.slice(-14)), 'the token is retrievable after minting');

  const id = (listed.body.tokens ?? []).find((t) => t.label === 'another ai')?.id;
  await callRoute('tokens.js', { method: 'POST', headers: { authorization: 'Bearer stress-agent-token' }, body: { action: 'retire', id } });
  assert.equal((await authenticate({ headers: { authorization: `Bearer ${token}` } }, store)).ok, false, 'a retired token still works');
});

/* ============================== 12. promises the tools have to keep */

section('12. Promises the tools have to keep');

await check('he can actually do the system tagging he is told to do', async () => {
  // The prompt tells him to tag every workflow in a group with the same
  // "system:<name>" tag so they stay findable as a unit. If no tool can do
  // that, the instruction produces either a silent omission or a claim that
  // is not true.
  const { tools } = registryFor(fakeN8n());
  const saveWorkflow = tools.find((t) => t.name === 'save_workflow');
  const canTag =
    tools.some((t) => /tag/i.test(t.name)) ||
    Object.keys(saveWorkflow.parameters.properties ?? {}).includes('tags');
  assert.ok(canTag, 'nothing in the registry can set a tag, but the prompt instructs him to tag every workflow in a system');
});

await check('a tag asked for is actually applied to the workflow', async () => {
  const fake = fakeN8n();
  const { byName } = registryFor(fake);
  const out = await byName('save_workflow').handler({ mode: 'create', workflow: { ...WORKFLOW, id: undefined }, tags: ['system:leads'] });
  assert.equal(out.ok, true, out.error);
  assert.ok(
    fake.log.some((l) => /\/tags/.test(l)),
    `no tag call was made, so the tag was silently dropped. Calls: ${fake.log.join(', ')}`,
  );
});

await check('updating a workflow does not silently throw away its pinned data', async () => {
  // n8n's PUT replaces the whole workflow. Sending it back without pinData
  // wipes the test data someone pinned, without a word about it.
  const withPins = {
    ...WORKFLOW,
    pinData: { Start: [{ json: { email: 'sam@example.com' } }] },
    staticData: { lastRun: '2030-01-01' },
  };
  let sent = null;
  const fetchImpl = async (url, init) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const reply = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (method === 'PUT') { sent = JSON.parse(init.body); return reply(withPins); }
    if (method === 'GET' && p.startsWith('/workflows/')) return reply(withPins);
    return reply({ data: [] });
  };
  const store = createMemoryStore();
  const n8n = createN8nClient({ baseUrl: 'https://n8n.invalid', apiKey: 'k', fetchImpl });
  const tools = buildToolRegistry({ n8n, store, approvals: [], prefs: {}, onStatus: () => {} });

  const out = await tools.find((t) => t.name === 'save_workflow').handler({ mode: 'update', id: 'wf1', workflow: { name: 'Leads', nodes: WORKFLOW.nodes, connections: WORKFLOW.connections } });
  assert.equal(out.ok, true, out.error);
  assert.ok(sent, 'nothing was sent');
  assert.deepEqual(sent.pinData, withPins.pinData, 'the pinned test data was wiped by the update');
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
console.log('');
process.exit(failures.length ? 1 : 0);
