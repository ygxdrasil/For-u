/**
 * The terminal's write path, /api/workflow.
 *
 * The point of these tests is that editing by hand is NOT a way around the
 * safety net. Same validator, same snapshot before overwriting, same refusal to
 * serve anyone who isn't signed in. If someone ever "simplifies" this route by
 * skipping validation or the snapshot, these fail.
 *
 * The real handler is driven end to end with a fake request and a stubbed n8n,
 * because the bug that mattered most in this project — a store that returned a
 * new instance per call — was invisible to unit tests and only showed up when
 * the actual handlers ran.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import handler from '../api/workflow.js';
import { createStore, resetStoreCache } from '../core/store.js';
import { sessionSecret } from '../core/settings.js';
import { issueSession, sessionCookie } from '../core/secrets.js';

/** A minimal node-http-shaped response that records what was written. */
function fakeRes() {
  const res = {
    statusCode: 0,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(payload) { this.body = payload ? JSON.parse(payload) : null; },
  };
  return res;
}

async function signedInReq(body) {
  const store = await createStore({ databaseUrl: null });
  const token = issueSession(await sessionSecret(store));
  // Built by the real cookie writer rather than a hand-typed name, so renaming
  // the cookie cannot leave these tests passing against a route nobody can use.
  return { method: 'POST', headers: { cookie: sessionCookie(token).split(';')[0] }, body };
}

const trigger = { id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} };

const workflowWith = (parameters) => ({
  name: 'Hand edited',
  nodes: [
    trigger,
    { id: '2', name: 'Notify', type: 'n8n-nodes-base.slack', typeVersion: 2.4, position: [200, 0], parameters },
  ],
  connections: { Start: { main: [[{ node: 'Notify', type: 'main', index: 0 }]] } },
});

const good = { resource: 'message', operation: 'post', select: 'channel', channelId: { __rl: true, mode: 'id', value: 'C0123456789' }, text: 'hi' };

test('an unsigned request gets nothing', async () => {
  resetStoreCache();
  const res = fakeRes();
  await handler({ method: 'POST', headers: {}, body: { action: 'check', workflow: workflowWith(good) } }, res);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.ok, false);
});

test('a hand-written workflow goes through the same validator', async () => {
  resetStoreCache();
  const res = fakeRes();
  // "channel" and "messageText" are the plausible-looking names that n8n's own
  // Zod schemas silently strip. The catalog layer is what catches them, and the
  // manual path must not skip it.
  await handler(await signedInReq({ action: 'check', workflow: workflowWith({ resource: 'message', operation: 'post', channel: '#general', messageText: 'hi' }) }), res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.validation.valid, false);
  const invented = res.body.validation.errors.filter((e) => e.code === 'INVENTED_PARAMETER');
  assert.ok(invented.length, 'the manual path accepted an invented parameter name');
  assert.match(JSON.stringify(invented), /channelId/, 'the real parameter name should be suggested');
});

test('checking needs no n8n connection and draws the workflow', async () => {
  resetStoreCache();
  const res = fakeRes();
  await handler(await signedInReq({ action: 'check', workflow: workflowWith(good) }), res);

  assert.equal(res.body.ok, true);
  assert.equal(res.body.validation.valid, true, JSON.stringify(res.body.validation.errors));
  // You can validate an edit with the instance unreachable — that is the point
  // of doing it locally.
  assert.equal(res.body.preview.nodes.length, 2);
  assert.equal(res.body.preview.nodes[0].depth, 0);
  assert.equal(res.body.preview.nodes[1].depth, 1);
});

test('a workflow that does not validate is never sent to n8n', async () => {
  resetStoreCache();
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';
  const realFetch = globalThis.fetch;
  let touched = false;
  globalThis.fetch = async () => { touched = true; return new Response('{}', { status: 200 }); };

  try {
    const res = fakeRes();
    await handler(await signedInReq({ action: 'save', id: 'wf1', workflow: workflowWith({ resource: 'message', operation: 'post', channel: '#general' }) }), res);
    // 200 with ok:false — the request was served and refused on its merits, not
    // rejected at the door. A 401 here would pass the "never touched n8n" check
    // for entirely the wrong reason.
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, false);
    assert.equal(touched, false, 'an invalid workflow reached the instance');
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.N8N_BASE_URL;
    delete process.env.N8N_API_KEY;
  }
});

test('saving by hand snapshots the previous version first', async () => {
  resetStoreCache();
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';

  const existing = { id: 'wf1', name: 'Before the edit', nodes: [trigger], connections: {}, active: false };
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push(`${init.method} ${new URL(url).pathname}`);
    return new Response(JSON.stringify(existing), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    const res = fakeRes();
    await handler(await signedInReq({ action: 'save', id: 'wf1', workflow: workflowWith(good) }), res);

    assert.equal(res.body.ok, true, res.body.error);
    assert.ok(res.body.snapshotId, 'no snapshot id came back — the previous version is not recoverable');
    assert.match(res.body.note, /Previous version kept/);

    // The order is the guarantee: read the current version, then overwrite.
    assert.equal(calls[0], 'GET /api/v1/workflows/wf1');
    assert.ok(calls.includes('PUT /api/v1/workflows/wf1'));
    assert.ok(calls.indexOf('PUT /api/v1/workflows/wf1') > 0, 'the overwrite happened before the read-back of the old version');

    const store = await createStore({ databaseUrl: null });
    const snaps = await store.listSnapshots('wf1');
    assert.equal(snaps.length, 1);
    assert.equal(snaps[0].name, 'Before the edit');
    assert.match(snaps[0].reason, /hand/);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.N8N_BASE_URL;
    delete process.env.N8N_API_KEY;
  }
});

test('a workflow created by hand arrives switched off', async () => {
  resetStoreCache();
  process.env.N8N_BASE_URL = 'https://n8n.invalid';
  process.env.N8N_API_KEY = 'k';

  let sent = null;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (init.method === 'POST') sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'new1', name: 'Hand edited' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    const res = fakeRes();
    await handler(await signedInReq({ action: 'save', workflow: workflowWith(good) }), res);

    assert.equal(res.body.ok, true, res.body.error);
    assert.match(res.body.note, /switched off/);
    // Turning something on is its own explicit step; creating never does it.
    assert.ok(!sent.active, 'a created workflow must not be sent as active');
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.N8N_BASE_URL;
    delete process.env.N8N_API_KEY;
  }
});

test('there is no action that removes anything', async () => {
  resetStoreCache();
  for (const action of ['delete', 'remove', 'destroy']) {
    const res = fakeRes();
    await handler(await signedInReq({ action, id: 'wf1' }), res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /Unknown action/);
  }
});
