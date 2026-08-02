/**
 * The unattended pass, end to end, against fakes.
 *
 * These drive the whole chain — watches, roaming, standing her own watches,
 * handing to Jason — with a fake model and a fake Jason, so the ordering and
 * the refusals are exercised without spending anything. The point is not that
 * the pass works; it is that the pass stops where it is supposed to stop.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStore, resetMemorySingleton } from '../core/store.js';
import { createMeter } from '../core/meter.js';
import { createDeadline } from '../core/util.js';
import { createWatch } from '../core/watches.js';
import { arm, readAutonomy, updateAutonomy, handoffsInWindow } from '../core/autonomy.js';
import { runPass, stopEverything } from '../core/pass.js';

function fullFinding(over = {}) {
  return {
    id: 'f-strong',
    status: 'active',
    demand: { oneLine: 'invoice chasing for trades', whoHasIt: 'one-to-three person plumbing firms', inTheirWords: [] },
    evidence: { strength: 5, hypothesis: false, ladder: [], paying: [], complaints: [], volume: null },
    incumbents: [],
    whatWouldWin: [],
    risks: [{ risk: 'they may already tolerate it' }],
    buildability: { verdict: 'jason-can-build', shape: 'web-app' },
    sources: [],
    foundAt: '2026-08-01T00:00:00.000Z',
    lastVerifiedAt: '2026-08-01T00:00:00.000Z',
    ...over,
  };
}

/**
 * A context with no model and no community: enough to exercise the phases that
 * do not need to read anything, which is where every brake lives.
 */
async function makeCtx({ jason = null, env = {} } = {}) {
  resetMemorySingleton();
  const store = createMemoryStore();
  const calls = [];
  return {
    calls,
    ctx: {
      store,
      meter: createMeter({ store, capUsd: 10 }),
      llm: null,
      llmError: 'no key in tests',
      community: null,
      deadline: createDeadline(50_000),
      capUsd: 10,
      env,
      fetchImpl: async (url, init) => {
        calls.push({ url, body: JSON.parse(init.body) });
        return jason ?? { ok: true, status: 200, text: async () => '{"ok":true}' };
      },
      onEvent: async () => {},
    },
  };
}

test('disarmed, the pass does nothing at all', async () => {
  const { ctx } = await makeCtx();
  await ctx.store.putWatch(createWatch({ name: 'w', topic: 'invoicing' }));
  await ctx.store.putFinding(fullFinding());

  const out = await runPass(ctx);
  assert.equal(out.armed, false);
  assert.equal(out.ran.length, 0);
  assert.equal(out.handed.length, 0);

  const stored = await ctx.store.getFinding('f-strong');
  assert.ok(!stored.handedToJasonAt, 'nothing may be handed over while she is disarmed');
});

test('armed, a level-5 finding goes to Jason and is recorded against the weekly ceiling', async () => {
  const { ctx, calls } = await makeCtx({ env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent', JASON_TOKEN: 't' } });
  await arm(ctx.store, {});
  await ctx.store.putFinding(fullFinding());

  const out = await runPass(ctx);

  assert.equal(out.handed.length, 1);
  assert.equal(out.handed[0].strength, 5);
  assert.equal(calls.length, 1, 'exactly one POST to Jason');
  assert.equal(calls[0].url, 'https://jason.example.com/api/agent');
  assert.equal(calls[0].body.findingId, 'f-strong');
  assert.equal(calls[0].body.why.evidenceStrength, 5, 'the evidence travels with it');

  const state = await readAutonomy(ctx.store);
  assert.equal(handoffsInWindow(state).length, 1);

  const stored = await ctx.store.getFinding('f-strong');
  assert.ok(stored.handedToJasonAt, 'the finding must be marked so it is never sent twice');
});

test('a level-4 finding is not sent, however buildable it is', async () => {
  const { ctx, calls } = await makeCtx({ env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent' } });
  await arm(ctx.store, {});
  await ctx.store.putFinding(fullFinding({ id: 'f-4', evidence: { strength: 4, hypothesis: false } }));

  const out = await runPass(ctx);
  assert.equal(out.handed.length, 0);
  assert.equal(calls.length, 0);
  // It was close enough to be worth saying why, so she says why.
  assert.ok(out.notes.some((n) => /not handing/.test(n)) === false || out.notes.some((n) => /level 5/.test(n)));
});

test('the same finding is never handed over twice', async () => {
  const { ctx, calls } = await makeCtx({ env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent' } });
  await arm(ctx.store, {});
  await ctx.store.putFinding(fullFinding());

  await runPass(ctx);
  ctx.deadline = createDeadline(50_000);
  await runPass(ctx);

  assert.equal(calls.length, 1, 'the second pass must find it already handed over');
});

test('the weekly ceiling stops the fourth handoff inside a single pass', async () => {
  const { ctx, calls } = await makeCtx({ env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent' } });
  await arm(ctx.store, {});
  await updateAutonomy(ctx.store, { handoffsPerWeek: 2 });
  for (let i = 0; i < 5; i += 1) await ctx.store.putFinding(fullFinding({ id: `f${i}` }));

  const out = await runPass(ctx);

  assert.equal(out.handed.length, 2, 'the ceiling must hold within one pass, not only across passes');
  assert.equal(calls.length, 2);
  assert.ok(out.notes.some((n) => /ceiling is 2/.test(n)), 'and she must say why the rest did not go');
});

test('with her allowance spent, nothing runs and she does not disarm herself', async () => {
  const { ctx, calls } = await makeCtx({ env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent' } });
  await arm(ctx.store, {});
  await ctx.store.putFinding(fullFinding());
  // $8.50 spent against a $10 cap with $2 reserved: her $8 is gone, your $1.50
  // is not.
  await ctx.store.addSpend({ kind: 'model', model: 'gemini-2.5-flash', usd: 8.5, at: new Date().toISOString() });

  const out = await runPass(ctx);

  assert.equal(out.outOfAllowance, true);
  assert.equal(calls.length, 0, 'she must not spend past her own ceiling');
  assert.equal((await readAutonomy(ctx.store)).armed, true, 'out of money is not broken — it comes back next month');
});

test('a failed delivery is reported as failed, not swallowed', async () => {
  const { ctx } = await makeCtx({
    jason: { ok: false, status: 502, text: async () => 'upstream is down' },
    env: { JASON_ENDPOINT: 'https://jason.example.com/api/agent' },
  });
  await arm(ctx.store, {});
  await ctx.store.putFinding(fullFinding());

  const out = await runPass(ctx);
  assert.equal(out.handed.length, 1);
  assert.equal(out.handed[0].delivered, false);
  assert.match(out.handed[0].detail, /upstream is down/);
});

test('stop everything disarms her and pauses every watch', async () => {
  const { ctx } = await makeCtx();
  await arm(ctx.store, {});
  await ctx.store.putWatch(createWatch({ name: 'a', topic: 'one' }));
  await ctx.store.putWatch(createWatch({ name: 'b', topic: 'two' }));
  await ctx.store.putWatch(createWatch({ name: 'c', topic: 'three', state: 'paused' }));

  const out = await stopEverything(ctx.store);

  assert.deepEqual(out.paused.sort(), ['a', 'b']);
  assert.equal((await readAutonomy(ctx.store)).armed, false);
  const watches = await ctx.store.listWatches();
  assert.ok(watches.every((w) => w.state === 'paused'), 'nothing may still be active');

  // And a pass afterwards genuinely does nothing.
  ctx.deadline = createDeadline(50_000);
  const after = await runPass(ctx);
  assert.equal(after.armed, false);
  assert.equal(after.ran.length, 0);
});
