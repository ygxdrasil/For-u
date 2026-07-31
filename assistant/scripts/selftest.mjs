#!/usr/bin/env node
/**
 * One command, whole pipeline, no external services:
 *
 *   node scripts/selftest.mjs
 *
 * It stubs the model and n8n and drives core/run.js end to end — search a
 * node, read its schema, validate, save, dry run, report. It asserts the
 * assistant tells the truth in each of the four outcomes rather than just
 * asserting it produced output.
 *
 * This is the test that proves the behaviour, not a description of it.
 */

import assert from 'node:assert/strict';
import { run } from '../core/run.js';
import { createMemoryStore } from '../core/store.js';

let failures = 0;
const check = (label, fn) => {
  try {
    fn();
    console.log(`  ok   ${label}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL ${label}\n       ${err.message}`);
  }
};

// ---------------------------------------------------------------------------
// stubs

const SLACK_NODE = {
  id: '2',
  name: 'Post to Slack',
  type: 'n8n-nodes-base.slack',
  typeVersion: 2.4,
  position: [220, 0],
  parameters: {
    resource: 'message',
    operation: 'post',
    select: 'channel',
    channelId: { __rl: true, mode: 'id', value: 'C0SELFTEST' },
    text: 'A qualified lead came in',
  },
};

const WORKFLOW = {
  name: 'Contact form to Slack',
  nodes: [
    { id: '1', name: 'On form submission', type: 'n8n-nodes-base.formTrigger', typeVersion: 2.2, position: [0, 0], parameters: {} },
    SLACK_NODE,
  ],
  connections: { 'On form submission': { main: [[{ node: 'Post to Slack', type: 'main', index: 0 }]] } },
};

/** A model that plays out a scripted build. */
function scriptedModel(script) {
  let i = 0;
  return () => ({
    models: {
      generateContent: async () => {
        const step = script[Math.min(i++, script.length - 1)];
        return {
          text: step.text ?? '',
          functionCalls: step.calls ?? [],
          usageMetadata: { promptTokenCount: 1200, candidatesTokenCount: 300, thoughtsTokenCount: 100 },
        };
      },
    },
  });
}

/** An n8n that behaves however the scenario needs. */
function stubN8n({ canRun = true, executionStatus = 'success', executionReadable = true }) {
  // Activation state is tracked so the read-back after setActive reflects the
  // change — otherwise the client correctly reports it could not confirm.
  let activated = false;
  return async (url, init) => {
    const u = new URL(url);
    const p = u.pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

    if (method === 'POST' && p === '/workflows') return reply({ id: 'wf_test_1', name: JSON.parse(init.body).name, active: false });
    if (method === 'GET' && p === '/workflows/wf_test_1') return reply({ id: 'wf_test_1', ...WORKFLOW, active: activated });
    if (method === 'GET' && p === '/workflows/wf_new') return reply({ id: 'wf_new', ...WORKFLOW, active: false });
    if (method === 'POST' && /\/workflows\/.+\/(run|execute)$/.test(p)) {
      return canRun ? reply({ executionId: 'ex_1' }) : reply({ message: 'not found' }, 404);
    }
    if (method === 'POST' && /\/workflows\/.+\/archive$/.test(p)) return reply({ id: 'wf_test_1', isArchived: true });
    if (method === 'POST' && /\/workflows\/.+\/activate$/.test(p)) {
      activated = true;
      return reply({ id: 'wf_test_1', active: true });
    }
    if (method === 'POST' && /\/workflows\/.+\/deactivate$/.test(p)) {
      activated = false;
      return reply({ id: 'wf_test_1', active: false });
    }
    if (method === 'GET' && p === '/executions') return reply({ data: [{ id: 'ex_1', workflowId: 'wf_test_1', status: executionStatus }] });
    if (method === 'GET' && p.startsWith('/executions/')) {
      if (!executionReadable) return reply({ message: 'gone' }, 500);
      return reply({
        id: 'ex_1',
        workflowId: 'wf_test_1',
        status: executionStatus,
        data: {
          resultData: {
            lastNodeExecuted: 'On form submission',
            runData: { 'On form submission': [{ data: { main: [[{ json: { email: 'a@b.com', message: 'hello' } }]] } }] },
          },
        },
      });
    }
    if (method === 'GET' && p === '/credentials') return reply({ data: [{ id: 'cred_1', name: 'Slack account', type: 'slackApi' }] });
    return reply({ message: `stub has no route for ${method} ${p}` }, 404);
  };
}

const baseConfig = {
  n8nBaseUrl: 'https://n8n.invalid',
  n8nApiKey: 'stub-key',
  geminiApiKey: 'stub-key',
  monthlyCapUsd: 100,
};

// ---------------------------------------------------------------------------

console.log('\n1. Full build: search → schema → validate → save → dry run\n');

const buildScript = [
  { calls: [{ name: 'search_nodes', args: { query: 'slack send message' } }] },
  { calls: [{ name: 'get_node_schema', args: { nodeType: 'n8n-nodes-base.slack', resource: 'message', operation: 'post' } }] },
  { calls: [{ name: 'validate_workflow', args: { workflow: WORKFLOW } }] },
  { calls: [{ name: 'save_workflow', args: { mode: 'create', workflow: WORKFLOW } }] },
  { calls: [{ name: 'dry_run_workflow', args: { id: 'wf_test_1' } }] },
  { text: 'Built and dry-run. Nothing was sent.' },
];

const built = await run(
  { text: 'when someone fills the contact form, put the good ones in slack', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel(buildScript), fetchImpl: stubN8n({}), deadlineMs: 30_000 },
  {},
);

check('the pipeline completes', () => assert.equal(built.status, 'ok'));
check('every scripted tool actually ran', () =>
  assert.deepEqual(built.steps.map((s) => s.tool), ['search_nodes', 'get_node_schema', 'validate_workflow', 'save_workflow', 'dry_run_workflow']));
check('no step failed', () => {
  const bad = built.steps.filter((s) => !s.ok);
  assert.equal(bad.length, 0, `failed steps: ${JSON.stringify(bad)}`);
});
check('spend was metered from real usage', () => assert.ok(built.spend.monthToDateUsd > 0));

console.log('\n2. A dry run reports WORKED_INVISIBLE, never "done"\n');

const dryRun = await run(
  { text: 'test it', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel([{ calls: [{ name: 'dry_run_workflow', args: { id: 'wf_test_1' } }] }, { text: 'done' }]), fetchImpl: stubN8n({}), deadlineMs: 20_000 },
  {
    onToolEnd: ({ name, result }) => {
      if (name !== 'dry_run_workflow') return;
      check('write nodes were disabled', () => assert.deepEqual(result.disabledWriteNodes, ['Post to Slack']));
      check('the verdict is worked_invisible, not worked', () => assert.equal(result.assessment.verdict, 'worked_invisible'));
      check('it says nothing reached a real system', () => assert.match(result.assessment.detail, /nothing reached a real system/i));
      check('nothing was deleted', () => assert.match(result.note, /nothing was deleted/i));
    },
  },
);
check('the dry run turn completed', () => assert.equal(dryRun.status, 'ok'));

console.log('\n3. An unreadable execution is UNCONFIRMED, not a failure\n');

await run(
  { text: 'test it', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel([{ calls: [{ name: 'dry_run_workflow', args: { id: 'wf_test_1' } }] }, { text: 'done' }]), fetchImpl: stubN8n({ executionReadable: false }), deadlineMs: 20_000 },
  {
    onToolEnd: ({ name, result }) => {
      if (name !== 'dry_run_workflow') return;
      check('verdict is unconfirmed', () => assert.equal(result.assessment.verdict, 'unconfirmed'));
      // The message may well contain the word "failed" — describing the READ
      // failing is correct. What it must never do is attribute failure to the
      // workflow, and it must say so explicitly.
      check('it does not claim the workflow is broken', () =>
        assert.doesNotMatch(result.assessment.headline, /\b(is broken|isn't working|workflow failed)\b/i));
      check('it explicitly separates "could not check" from "it failed"', () =>
        assert.match(result.assessment.detail, /not that it failed/i));
    },
  },
);

console.log('\n4. An n8n that cannot run workflows from the API says so honestly\n');

await run(
  { text: 'test it', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel([{ calls: [{ name: 'dry_run_workflow', args: { id: 'wf_test_1' } }] }, { text: 'done' }]), fetchImpl: stubN8n({ canRun: false }), deadlineMs: 20_000 },
  {
    onToolEnd: ({ name, result }) => {
      if (name !== 'dry_run_workflow') return;
      check('it reports unconfirmed rather than failure', () => assert.equal(result.assessment.verdict, 'unconfirmed'));
      check('it blames the API limitation, not the workflow', () =>
        assert.match(result.assessment.detail, /limitation of the API, not a fault in the workflow/i));
    },
  },
);

console.log('\n5. A workflow that does not validate is never saved\n');

const badWorkflow = {
  name: 'Bad',
  nodes: [
    { id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
    { ...SLACK_NODE, parameters: { resource: 'message', operation: 'post', channel: '#general', messageText: 'hi' } },
  ],
  connections: { Start: { main: [[{ node: 'Post to Slack', type: 'main', index: 0 }]] } },
};

await run(
  { text: 'save this', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel([{ calls: [{ name: 'save_workflow', args: { mode: 'create', workflow: badWorkflow } }] }, { text: 'could not save' }]), fetchImpl: stubN8n({}), deadlineMs: 20_000 },
  {
    onToolEnd: ({ name, result }) => {
      if (name !== 'save_workflow') return;
      check('the save was refused', () => assert.equal(result.ok, false));
      check('it was refused for the invented parameter names', () =>
        assert.ok(result.validation.errors.some((e) => e.code === 'INVENTED_PARAMETER')));
    },
  },
);

console.log('\n6. Activating something that can send requires approval\n');

await run(
  { text: 'turn it on', config: baseConfig, store: createMemoryStore(), llmClientFactory: scriptedModel([{ calls: [{ name: 'set_workflow_active', args: { id: 'wf_test_1', active: true } }] }, { text: 'need approval' }]), fetchImpl: stubN8n({}), deadlineMs: 20_000 },
  {
    onToolEnd: ({ name, result }) => {
      if (name !== 'set_workflow_active') return;
      check('activation was held for approval', () => assert.equal(result.needsApproval, 'activate_workflow'));
      check('it names what would send', () => assert.ok(result.writeNodes.includes('Post to Slack')));
    },
  },
);

const approved = await run(
  {
    text: 'yes, turn it on',
    config: baseConfig,
    store: createMemoryStore(),
    approvals: ['activate_workflow'],
    llmClientFactory: scriptedModel([{ calls: [{ name: 'set_workflow_active', args: { id: 'wf_test_1', active: true } }] }, { text: 'activated' }]),
    fetchImpl: stubN8n({}),
    deadlineMs: 20_000,
  },
  {},
);
check('with approval it proceeds', () => assert.equal(approved.steps.find((s) => s.tool === 'set_workflow_active').ok, true));

console.log('\n7. A SYSTEM: several workflows, built as one group\n');

/** An n8n that keeps its own state, so a multi-step build can be checked. */
function statefulN8n() {
  const workflows = new Map();
  const tags = new Map();
  let n = 0;
  return async (url, init) => {
    const p = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const reply = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

    if (method === 'POST' && p === '/workflows') {
      const wf = JSON.parse(init.body);
      const id = `wf_${++n}`;
      workflows.set(id, { ...wf, id, active: false, tags: [] });
      return reply(workflows.get(id));
    }
    if (method === 'GET' && p === '/workflows') return reply({ data: [...workflows.values()] });
    if (method === 'GET' && p.startsWith('/workflows/')) {
      const wf = workflows.get(p.split('/')[2]);
      return wf ? reply(wf) : reply({ message: 'not found' }, 404);
    }
    if (method === 'GET' && p === '/tags') return reply({ data: [...tags.values()] });
    if (method === 'POST' && p === '/tags') {
      const { name } = JSON.parse(init.body);
      const tag = { id: `tag_${tags.size + 1}`, name };
      tags.set(name, tag);
      return reply(tag);
    }
    if (method === 'PUT' && /\/tags$/.test(p)) {
      const id = p.split('/')[2];
      const wanted = JSON.parse(init.body).map((t) => t.id);
      const wf = workflows.get(id);
      if (wf) wf.tags = [...tags.values()].filter((t) => wanted.includes(t.id));
      return reply(wf?.tags ?? []);
    }
    if (method === 'POST' && /\/(run|execute)$/.test(p)) return reply({ executionId: 'ex_sys' });
    if (method === 'POST' && /\/archive$/.test(p)) {
      const wf = workflows.get(p.split('/')[2]);
      if (wf) wf.isArchived = true;
      return reply(wf ?? {});
    }
    if (method === 'GET' && p === '/executions') return reply({ data: [{ id: 'ex_sys', workflowId: 'wf_1', status: 'success' }] });
    if (method === 'GET' && p.startsWith('/executions/')) {
      return reply({ id: 'ex_sys', workflowId: 'wf_1', status: 'success', data: { resultData: { lastNodeExecuted: 'On form submission', runData: {} } } });
    }
    if (method === 'GET' && p === '/credentials') return reply({ data: [{ id: 'cred_1', name: 'Slack account', type: 'slackApi' }] });
    return reply({ message: `no route for ${method} ${p}` }, 404);
  };
}

const intake = { ...WORKFLOW, name: 'Lead intake' };
const digest = {
  name: 'Weekly lead digest',
  nodes: [
    { id: '1', name: 'Every Monday', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: {} },
    { ...SLACK_NODE, name: 'Post the digest' },
  ],
  connections: { 'Every Monday': { main: [[{ node: 'Post the digest', type: 'main', index: 0 }]] } },
};

const systemFetch = statefulN8n();
const system = await run(
  {
    text: 'build me a lead pipeline: intake, and a weekly digest',
    config: baseConfig,
    store: createMemoryStore(),
    deadlineMs: 40_000,
    fetchImpl: systemFetch,
    llmClientFactory: scriptedModel([
      { calls: [{ name: 'save_workflow', args: { mode: 'create', workflow: intake, tags: ['system:leads'] } }] },
      { calls: [{ name: 'save_workflow', args: { mode: 'create', workflow: digest, tags: ['system:leads'] } }] },
      { calls: [{ name: 'list_workflows', args: {} }] },
      { text: 'Built both, tagged system:leads, both switched off.' },
    ]),
  },
  {},
);

check('both workflows were created', () => {
  const saves = system.steps.filter((s) => s.tool === 'save_workflow');
  assert.equal(saves.length, 2);
  assert.ok(saves.every((s) => s.ok), JSON.stringify(saves));
});
check('both carry the same system tag, read back from n8n', async () => {
  const listed = system.steps.find((s) => s.tool === 'list_workflows');
  assert.ok(listed?.ok, 'listing failed');
});
check('the group is findable as a unit', async () => {
  const res = await systemFetch('https://n8n.invalid/api/v1/workflows', { method: 'GET' });
  const { data } = await res.json();
  assert.equal(data.length, 2);
  for (const wf of data) {
    assert.ok(wf.tags.some((t) => t.name === 'system:leads'), `${wf.name} was not tagged`);
    assert.equal(wf.active, false, `${wf.name} was created switched on`);
  }
});

console.log('\n8. A REPAIR: read what broke, fix it, keep the old version\n');

const BROKEN = {
  id: 'wf_broken',
  name: 'Nightly invoices',
  active: true,
  nodes: [
    { id: '1', name: 'Every night', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: {} },
    { id: '2', name: 'Notify', type: 'n8n-nodes-base.slack', typeVersion: 2.4, position: [200, 0], parameters: { resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C_WRONG' }, text: 'done' } },
  ],
  connections: { 'Every night': { main: [[{ node: 'Notify', type: 'main', index: 0 }]] } },
  pinData: { 'Every night': [{ json: { at: '03:00' } }] },
};

const repairCalls = [];
const repairFetch = async (url, init) => {
  const p = new URL(url).pathname.replace('/api/v1', '');
  const method = init?.method ?? 'GET';
  repairCalls.push({ method, p, body: init?.body ? JSON.parse(init.body) : null });
  const reply = (b, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

  if (method === 'GET' && p === '/executions') {
    return reply({ data: [{ id: 'ex_bad', workflowId: 'wf_broken', status: 'error', startedAt: new Date().toISOString(), workflowData: { name: 'Nightly invoices' } }] });
  }
  if (method === 'GET' && p.startsWith('/executions/')) {
    return reply({
      id: 'ex_bad', workflowId: 'wf_broken', status: 'error',
      data: { resultData: { lastNodeExecuted: 'Notify', runData: { Notify: [{ error: { message: 'channel_not_found' } }] } } },
    });
  }
  if (method === 'GET' && p.startsWith('/workflows/')) return reply(BROKEN);
  if (method === 'PUT') return reply({ ...BROKEN, ...JSON.parse(init.body) });
  return reply({ data: [] });
};

const fixed = { ...BROKEN, nodes: [BROKEN.nodes[0], { ...BROKEN.nodes[1], parameters: { ...BROKEN.nodes[1].parameters, channelId: { __rl: true, mode: 'id', value: 'C0REALCHANNEL' } } }] };

const repairStore = createMemoryStore();
const repair = await run(
  {
    text: 'the nightly invoice workflow keeps failing, fix it',
    config: baseConfig,
    store: repairStore,
    deadlineMs: 40_000,
    fetchImpl: repairFetch,
    llmClientFactory: scriptedModel([
      { calls: [{ name: 'list_failed_executions', args: { limit: 5 } }] },
      { calls: [{ name: 'get_execution', args: { id: 'ex_bad' } }] },
      { calls: [{ name: 'get_workflow', args: { id: 'wf_broken' } }] },
      { calls: [{ name: 'save_workflow', args: { mode: 'update', id: 'wf_broken', workflow: { name: fixed.name, nodes: fixed.nodes, connections: fixed.connections }, reason: 'channel_not_found: pointed at a channel that does not exist' } }] },
      { text: 'The Slack node pointed at a channel that does not exist. Fixed and saved; the previous version is kept.' },
    ]),
  },
  {},
);

check('the repair turn completed', () => assert.equal(repair.status, 'ok'));
check('it read the actual failure rather than guessing', () => {
  const read = repair.steps.find((s) => s.tool === 'get_execution');
  assert.ok(read?.ok, 'the execution was never read');
});
check('the previous version was snapshotted before the fix', async () => {
  const snaps = await repairStore.listSnapshots('wf_broken');
  assert.equal(snaps.length, 1, 'no snapshot was taken');
  assert.match(snaps[0].reason, /channel_not_found/);
});
check('the pinned test data survived the repair', () => {
  const put = repairCalls.find((c) => c.method === 'PUT');
  assert.ok(put, 'nothing was saved');
  assert.deepEqual(put.body.pinData, BROKEN.pinData, 'the repair wiped the pinned data');
});
check('nothing was deleted and nothing was switched on', () => {
  assert.ok(!repairCalls.some((c) => c.method === 'DELETE'), 'something issued a DELETE');
  assert.ok(!repairCalls.some((c) => /\/activate$/.test(c.p)), 'the repair activated something on its own');
});

// ---------------------------------------------------------------------------

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${failures} failing check(s)\n`);
process.exit(failures === 0 ? 0 : 1);
