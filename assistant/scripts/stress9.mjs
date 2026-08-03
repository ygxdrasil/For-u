#!/usr/bin/env node
/**
 * Stress round nine: is "reversible" actually true?
 *
 *   node scripts/stress9.mjs
 *
 * The whole design rests on one claim. Nothing is ever deleted, every update
 * is snapshotted first, retiring means archiving — so anything he does can be
 * undone. That claim is what makes it safe to let him touch a live instance.
 *
 * A claim like that is worth checking rather than repeating. Three questions:
 * can a snapshot actually be put back, can something archived come out again,
 * and does an update overwrite an edit somebody made in the n8n editor while
 * he was working?
 *
 * The last one is the quiet one. Reading a workflow, thinking for forty
 * seconds and writing it back is a lost update if anyone touched it in
 * between — and their work goes into a snapshot they do not know exists.
 */

import assert from 'node:assert/strict';

import { buildToolRegistry } from '../core/tools.js';
import { createN8nClient } from '../core/n8nClient.js';
import { createMemoryStore } from '../core/store.js';

let pass = 0;
const failures = [];
const notes = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n')[0] }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};
const section = (t) => process.stdout.write(`\n${t}\n  `);
const note = (t) => notes.push(t);

const TRIGGER = { id: 't', name: 'Every morning', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: {} };
const step = (name) => ({ id: name, name, type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0], parameters: { mode: 'manual' } });

/** An n8n that versions its workflows, as the real one does. */
function versionedN8n(initial) {
  const state = new Map(Object.entries(initial));
  const writes = [];

  const impl = async (url, init) => {
    const path = new URL(url).pathname.replace('/api/v1', '');
    const method = init?.method ?? 'GET';
    const reply = (b, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });

    if (path === '/credentials' || path === '/tags') return reply({ data: [] });
    if (method === 'GET' && path === '/workflows') return reply({ data: [...state.values()] });
    if (method === 'POST' && path === '/workflows') {
      const id = `new${state.size}`;
      state.set(id, { id, versionId: 'v1', active: false, ...JSON.parse(init.body) });
      return reply(state.get(id));
    }

    const m = path.match(/^\/workflows\/([^/]+)(\/.*)?$/);
    if (m) {
      const [, id, rest] = m;
      const wf = state.get(id);
      if (!wf) return reply({ message: 'not found' }, 404);
      if (rest === '/archive') { wf.isArchived = true; return reply(wf); }
      if (rest === '/unarchive') { wf.isArchived = false; return reply(wf); }
      if (rest === '/activate') { wf.active = true; return reply(wf); }
      if (rest === '/deactivate') { wf.active = false; return reply(wf); }
      if (method === 'PUT') {
        writes.push({ id, body: JSON.parse(init.body) });
        // Every write bumps the version, exactly like n8n.
        Object.assign(wf, JSON.parse(init.body), { versionId: `v${Number(String(wf.versionId).slice(1)) + 1}` });
        return reply(wf);
      }
      return reply(wf);
    }
    return reply({ data: [] });
  };

  return { impl, state, writes, client: createN8nClient({ baseUrl: 'https://n8n.invalid', apiKey: 'k', fetchImpl: impl }) };
}

const registryFor = (n8n, store) => buildToolRegistry({ n8n: n8n.client, store, approvals: [] });

/* ============================================ 1. a snapshot you can put back */

section('1. A snapshot you can actually put back');

await check('there is a way to restore a previous version', async () => {
  // list_snapshots says they exist "so a change can be reviewed or rolled
  // back". Rolling one back was not something any tool could do — the safety
  // net could be READ and not used, which is not a safety net.
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v1', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('The good version')] },
  });
  const tools = registryFor(n8n, store);
  const names = tools.map((t) => t.name);
  assert.ok(
    names.some((n) => /restore|roll.?back|revert/i.test(n)),
    `nothing can restore a snapshot. Tools: ${names.join(', ')}`,
  );
});

await check('restoring puts the old version back, exactly', async () => {
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v1', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('The good version')] },
  });
  const tools = registryFor(n8n, store);
  const save = tools.find((t) => t.name === 'save_workflow');

  // A change that turns out to be wrong.
  const bad = { name: 'Leads', nodes: [TRIGGER, step('The regrettable version')], connections: {} };
  const changed = await save.handler({ mode: 'update', id: 'wf1', workflow: bad, reason: 'a change I will regret' });
  assert.equal(changed.ok, true, changed.error);
  assert.equal(n8n.state.get('wf1').nodes[1].name, 'The regrettable version');

  const restore = tools.find((t) => /restore|roll.?back|revert/i.test(t.name));
  assert.ok(restore, 'no restore tool');
  const out = await restore.handler({ snapshotId: changed.snapshotId });
  assert.equal(out.ok, true, out.error);
  assert.equal(n8n.state.get('wf1').nodes[1].name, 'The good version', 'the old version did not actually come back');
});

await check('restoring is itself reversible', async () => {
  // Undo that cannot be undone is just another one-way door.
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v1', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('Original')] },
  });
  const tools = registryFor(n8n, store);
  const save = tools.find((t) => t.name === 'save_workflow');
  const restore = tools.find((t) => /restore|roll.?back|revert/i.test(t.name));

  const changed = await save.handler({ mode: 'update', id: 'wf1', workflow: { name: 'Leads', nodes: [TRIGGER, step('Second')], connections: {} }, reason: 'change' });
  const undo = await restore.handler({ snapshotId: changed.snapshotId });
  assert.ok(undo.snapshotId, 'restoring did not snapshot what it replaced, so the restore cannot be undone');

  const redo = await restore.handler({ snapshotId: undo.snapshotId });
  assert.equal(redo.ok, true, redo.error);
  assert.equal(n8n.state.get('wf1').nodes[1].name, 'Second', 'the version the restore replaced could not be recovered');
});

await check('restoring something that never existed says so rather than doing damage', async () => {
  const store = createMemoryStore();
  const n8n = versionedN8n({ wf1: { id: 'wf1', versionId: 'v1', name: 'X', nodes: [TRIGGER], connections: {} } });
  const tools = registryFor(n8n, store);
  const restore = tools.find((t) => /restore|roll.?back|revert/i.test(t.name));
  const out = await restore.handler({ snapshotId: 'snap_nope' });
  assert.equal(out.ok, false);
  assert.match(out.error, /snap_nope/);
  assert.equal(n8n.writes.length, 0, 'a failed restore still wrote something');
});

/* ================================================ 2. archiving comes back */

section('2. Archiving is a door that opens both ways');

await check('something archived can be brought back', async () => {
  // "Never delete, archive instead" is only true if archive is reversible.
  // A one-way archive is deletion with a nicer name.
  const store = createMemoryStore();
  const n8n = versionedN8n({ wf1: { id: 'wf1', versionId: 'v1', name: 'Old thing', nodes: [TRIGGER], connections: {}, isArchived: false } });
  const tools = registryFor(n8n, store);

  await tools.find((t) => t.name === 'archive_workflow').handler({ id: 'wf1' });
  assert.equal(n8n.state.get('wf1').isArchived, true);

  const bringBack = tools.find((t) => /unarchive|restore_workflow/i.test(t.name));
  assert.ok(bringBack, `nothing can bring an archived workflow back. Tools: ${tools.map((t) => t.name).join(', ')}`);
  const out = await bringBack.handler({ id: 'wf1' });
  assert.equal(out.ok, true, out.error);
  assert.equal(n8n.state.get('wf1').isArchived, false, 'it stayed archived');
});

await check('bringing one back does not switch it on', async () => {
  const store = createMemoryStore();
  const n8n = versionedN8n({ wf1: { id: 'wf1', versionId: 'v1', name: 'Old', nodes: [TRIGGER], connections: {}, isArchived: true, active: false } });
  const tools = registryFor(n8n, store);
  const bringBack = tools.find((t) => /unarchive|restore_workflow/i.test(t.name));
  await bringBack.handler({ id: 'wf1' });
  assert.equal(n8n.state.get('wf1').active, false, 'unarchiving started it running, which nobody asked for');
});

/* ======================================== 3. an edit made while he worked */

section('3. An edit made in n8n while he was working');

await check('an update does not silently overwrite a change made in the editor', async () => {
  // He reads a workflow, thinks for forty seconds, and writes it back. If
  // somebody opened n8n and changed it in between, their work is gone —
  // into a snapshot they do not know exists. Nothing is deleted, technically,
  // and the effect is that their change vanished.
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v7', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('As he read it')] },
  });
  const tools = registryFor(n8n, store);

  // What he read at the start of the turn.
  const asRead = await tools.find((t) => t.name === 'get_workflow').handler({ id: 'wf1' });
  assert.equal(asRead.workflow.versionId, 'v7');

  // Somebody edits it in the n8n editor while he is thinking.
  const live = n8n.state.get('wf1');
  live.nodes = [TRIGGER, step('Edited by hand in n8n')];
  live.versionId = 'v8';

  const out = await tools.find((t) => t.name === 'save_workflow').handler({
    mode: 'update', id: 'wf1',
    workflow: { ...asRead.workflow, nodes: [TRIGGER, step('His version')] },
    reason: 'the change he was asked for',
  });

  assert.notEqual(out.ok, true, "somebody's hand-edit was overwritten without a word");
  assert.match(String(out.error), /changed|editor|since/i, `the refusal does not explain what happened: ${out.error}`);
  assert.equal(n8n.state.get('wf1').nodes[1].name, 'Edited by hand in n8n', 'the hand edit was overwritten anyway');
});

await check('an ordinary update, with nobody else editing, still just works', async () => {
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v7', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('Before')] },
  });
  const tools = registryFor(n8n, store);
  const asRead = await tools.find((t) => t.name === 'get_workflow').handler({ id: 'wf1' });
  const out = await tools.find((t) => t.name === 'save_workflow').handler({
    mode: 'update', id: 'wf1', workflow: { ...asRead.workflow, nodes: [TRIGGER, step('After')] }, reason: 'asked for',
  });
  assert.equal(out.ok, true, `a normal update was refused: ${out.error}`);
  assert.equal(n8n.state.get('wf1').nodes[1].name, 'After');
});

await check('a workflow written without having read one is not blocked', async () => {
  // Building something from scratch and saving it over an id carries no
  // version to compare, and refusing that would break ordinary work to
  // protect against a race that cannot have happened.
  const store = createMemoryStore();
  const n8n = versionedN8n({ wf1: { id: 'wf1', versionId: 'v7', name: 'Leads', nodes: [TRIGGER], connections: {} } });
  const tools = registryFor(n8n, store);
  const out = await tools.find((t) => t.name === 'save_workflow').handler({
    mode: 'update', id: 'wf1', workflow: { name: 'Leads', nodes: [TRIGGER, step('Fresh')], connections: {} }, reason: 'rebuilt',
  });
  assert.equal(out.ok, true, `a from-scratch update was refused: ${out.error}`);
});

await check('the overwrite can be done on purpose, once it is a decision', async () => {
  const store = createMemoryStore();
  const n8n = versionedN8n({
    wf1: { id: 'wf1', versionId: 'v7', name: 'Leads', active: false, connections: {}, nodes: [TRIGGER, step('Before')] },
  });
  const tools = registryFor(n8n, store);
  const asRead = await tools.find((t) => t.name === 'get_workflow').handler({ id: 'wf1' });
  n8n.state.get('wf1').versionId = 'v8';

  const out = await tools.find((t) => t.name === 'save_workflow').handler({
    mode: 'update', id: 'wf1',
    workflow: { ...asRead.workflow, nodes: [TRIGGER, step('Mine')] },
    reason: 'the user said to go ahead anyway',
    overwriteChangesSince: 'v7',
  });
  assert.equal(out.ok, true, `an explicit overwrite was still refused: ${out.error}`);
  assert.ok(out.snapshotId, 'the overwrite did not snapshot what it replaced');
  const snap = await store.getSnapshot(out.snapshotId);
  assert.equal(snap.workflow.nodes[1].name, 'Before', "the snapshot does not hold the version that was overwritten");
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
if (notes.length) { console.log('\nNoted:'); for (const n of [...new Set(notes)]) console.log(`  · ${n}`); }
console.log('');
process.exit(failures.length ? 1 : 0);
