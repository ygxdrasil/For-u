/**
 * The validator. These are the failures that "save fine, look plausible, and
 * die at runtime" — the whole reason the node index exists.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkflow } from '../core/validate.js';
import { searchNodes, getNodeSchema, isWriteOperation } from '../core/nodeIndex.js';

const trigger = {
  id: '1',
  name: 'Start',
  type: 'n8n-nodes-base.manualTrigger',
  typeVersion: 1,
  position: [0, 0],
  parameters: {},
};

const wrap = (node) => ({
  name: 'T',
  nodes: [trigger, node],
  connections: { Start: { main: [[{ node: node.name, type: 'main', index: 0 }]] } },
});

const slack = (parameters) => ({
  id: '2',
  name: 'Notify',
  type: 'n8n-nodes-base.slack',
  typeVersion: 2.4,
  position: [200, 0],
  parameters,
});

test('a correct workflow validates', async () => {
  const r = await validateWorkflow(
    wrap(slack({ resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C0123456789' }, text: 'hi' })),
  );
  assert.equal(r.valid, true, `expected valid, got: ${JSON.stringify(r.errors)}`);
});

test('an invented parameter name is rejected and a real one suggested', async () => {
  // n8n's own Zod schemas STRIP unknown keys rather than erroring, so this
  // passes their validator. The catalog layer is what catches it.
  const r = await validateWorkflow(wrap(slack({ resource: 'message', operation: 'post', channel: '#general', messageText: 'hi' })));
  assert.equal(r.valid, false);
  const invented = r.errors.filter((e) => e.code === 'INVENTED_PARAMETER');
  assert.equal(invented.length, 2);
  assert.match(invented[0].message, /channelId/, 'the error should suggest the real parameter name');
});

test('an invalid enum value is rejected by n8n own schemas', async () => {
  const r = await validateWorkflow(wrap(slack({ resource: 'message', operation: 'explode' })));
  assert.equal(r.valid, false);
  assert.ok(
    r.errors.some((e) => e.code === 'SCHEMA_VIOLATION' || e.code === 'UNKNOWN_DISCRIMINATOR'),
    `expected a schema violation, got ${JSON.stringify(r.errors.map((e) => e.code))}`,
  );
});

test('a node type that does not exist is rejected', async () => {
  const r = await validateWorkflow(wrap({ ...slack({}), type: 'n8n-nodes-base.slackk' }));
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.code === 'UNKNOWN_NODE_TYPE'));
});

test('a workflow with no trigger is rejected', async () => {
  const r = await validateWorkflow({
    name: 'X',
    nodes: [{ id: '1', name: 'Only', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [0, 0], parameters: { mode: 'manual' } }],
    connections: {},
  });
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.code === 'MISSING_TRIGGER'));
});

test('a connection to a node that is not there is rejected', async () => {
  const r = await validateWorkflow({
    name: 'X',
    nodes: [trigger],
    connections: { Start: { main: [[{ node: 'Ghost', type: 'main', index: 0 }]] } },
  });
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.code === 'CONNECTION_TO_MISSING_NODE'));
});

test('a guessed picker value is flagged rather than silently accepted', async () => {
  const r = await validateWorkflow(
    wrap(slack({ resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'list', value: 'your-channel-id' }, text: 'hi' })),
  );
  assert.ok(r.warnings.some((w) => w.code === 'UNGROUNDED_PICKER'), 'a placeholder channel id must be flagged');
});

test('a made-up credential id is rejected', async () => {
  const node = slack({ resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C1' }, text: 'hi' });
  node.credentials = { slackApi: { id: 'mock-slack-credential', name: 'Slack' } };
  const r = await validateWorkflow(wrap(node));
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.code === 'SYNTHETIC_CREDENTIAL'));
});

test('node search matches whole words, not substrings', () => {
  // "day" inside "today" is the bug that nearly set the lights to daylight at
  // midnight. Searching for a short word must not match it inside longer ones.
  const results = searchNodes('slack');
  assert.ok(results.some((r) => r.type === 'n8n-nodes-base.slack'), 'searching "slack" should find the Slack node');

  const forms = searchNodes('form', { limit: 40 });
  const formTypes = forms.map((r) => r.type);

  assert.ok(formTypes.includes('n8n-nodes-base.formTrigger'), 'searching "form" should find the Form Trigger');

  // The actual substring trap: these contain "form" inside "information" and
  // "transform" and must not be returned for a search on the word "form".
  for (const substringOnly of ['@n8n/n8n-nodes-langchain.informationExtractor', 'n8n-nodes-base.aiTransform']) {
    assert.ok(
      !formTypes.includes(substringOnly),
      `searching "form" returned ${substringOnly}, which only contains "form" as a substring`,
    );
  }

  // Every result must match "form" as a whole word somewhere real — including
  // in its resource/operation names, which is why nodes like ConvertKit (which
  // genuinely has a "form" resource) legitimately appear.
  for (const r of forms) {
    const haystack = [r.displayName, r.type, r.description ?? '', JSON.stringify(r.discriminators)]
      .join(' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    assert.match(haystack, /\bform/i, `${r.type} matched "form" without containing it as a word`);
  }
});

test('the schema for a node carries real parameter names and grounding requirements', () => {
  const schema = getNodeSchema({ type: 'n8n-nodes-base.slack', resource: 'message', operation: 'post' });
  assert.equal(schema.found, true);
  const op = schema.operations[0];
  assert.ok(op.params.includes('channelId'), 'channelId should be a real parameter');
  assert.ok(op.needsGrounding.some((g) => g.param === 'channelId'), 'the channel picker must be marked as needing grounding');
  assert.ok(op.typeDefinition?.includes('channelId'), 'the type definition text should be available to show the model');
});

test('write-capable operations are recognised so dry runs can disable them', () => {
  assert.equal(isWriteOperation({ type: 'n8n-nodes-base.slack', resource: 'message', operation: 'post' }), true);
  assert.equal(isWriteOperation({ type: 'n8n-nodes-base.slack', resource: 'message', operation: 'search' }), false);
});

test('the canvas drawing places nodes by distance from the trigger', async () => {
  const { buildPreview, previewFrom } = await import('../core/preview.js');

  const wf = {
    name: 'Leads',
    nodes: [
      { name: 'On form submission', type: 'n8n-nodes-base.formTrigger' },
      { name: 'Qualify', type: 'n8n-nodes-base.if' },
      { name: 'Post to Slack', type: 'n8n-nodes-base.slack' },
    ],
    connections: {
      'On form submission': { main: [[{ node: 'Qualify', type: 'main', index: 0 }]] },
      Qualify: { main: [[{ node: 'Post to Slack', type: 'main', index: 0 }]] },
    },
  };

  const p = buildPreview(wf, { disabledNodes: ['Post to Slack'] });
  const byName = Object.fromEntries(p.nodes.map((n) => [n.name, n]));

  assert.equal(byName['On form submission'].depth, 0);
  assert.equal(byName['On form submission'].trigger, true);
  assert.equal(byName.Qualify.depth, 1);
  assert.equal(byName['Post to Slack'].depth, 2);

  // A node switched off for the dry run is drawn differently, so "nothing was
  // sent" is visible rather than only stated.
  assert.equal(byName['Post to Slack'].muted, true);
  assert.equal(byName.Qualify.muted, false);
  assert.equal(byName['Post to Slack'].short, 'Slack');

  assert.equal(previewFrom({ workflow: wf }, {}).nodes.length, 3);
  assert.equal(previewFrom({}, {}), null, 'a tool with no workflow draws nothing');
});

test('a peer answers, and refuses to let a missing peer become a guess', async () => {
  const { savePeer, listPeers, askPeer, removePeer } = await import('../core/peers.js');
  const { createMemoryStore } = await import('../core/store.js');
  const store = createMemoryStore();

  // With nothing configured, the answer must push back to the user — never a
  // shrug that lets the model invent the requirement itself.
  const none = await askPeer(store, { question: 'what counts as qualified?' });
  assert.equal(none.ok, false);
  assert.match(none.error, /Ask the user|No research peer/i);

  await savePeer(store, { name: 'research', url: 'https://peer.invalid/ask', protocol: 'json', token: 'secret-token' });

  const peers = await listPeers(store);
  assert.equal(peers.length, 1);
  assert.equal(peers[0].hasToken, true);
  assert.equal(peers[0].token, undefined, 'a peer token must never be listed back');

  let sentAuth = null;
  const res = await askPeer(store, {
    question: 'what counts as qualified?',
    fetchImpl: async (url, init) => {
      sentAuth = init.headers.Authorization;
      return new Response(JSON.stringify({ reply: 'budget over 10k' }), { status: 200 });
    },
  });
  assert.equal(res.ok, true);
  assert.equal(res.answer, 'budget over 10k');
  assert.equal(sentAuth, 'Bearer secret-token');

  // Saving again without a token keeps the existing one.
  await savePeer(store, { name: 'research', url: 'https://peer.invalid/ask', protocol: 'json', description: 'the idea one' });
  assert.equal((await listPeers(store))[0].hasToken, true);

  assert.equal((await removePeer(store, 'research')).length, 0);
});

test('a peer that cannot be reached still refuses to become a guess', async () => {
  const { savePeer, askPeer } = await import('../core/peers.js');
  const { createMemoryStore } = await import('../core/store.js');
  const store = createMemoryStore();
  await savePeer(store, { name: 'research', url: 'https://peer.invalid/ask' });

  const res = await askPeer(store, {
    question: 'which channel?',
    fetchImpl: async () => { throw new Error('getaddrinfo ENOTFOUND'); },
  });
  assert.equal(res.ok, false);
  assert.match(res.error, /Could not reach research/);
});
