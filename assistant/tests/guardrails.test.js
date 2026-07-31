/**
 * The structural guarantees. Each of these fails the build if a rule that was
 * learned the expensive way gets quietly undone.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { buildToolRegistry } from '../core/tools.js';
import { createMemoryStore } from '../core/store.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_DIR = path.join(ROOT, 'api');
const CORE_DIR = path.join(ROOT, 'core');

/** Comments are stripped so these checks test the code, not the prose about it. */
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const readAll = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.js'))
    .map((e) => ({ name: e.name, source: stripComments(fs.readFileSync(path.join(dir, e.name), 'utf8')) }));

// ---------------------------------------------------------------------------

test('every API route is a single path segment', () => {
  // A Vercel catch-all serves /api/x and 404s /api/x/y — the handler never
  // runs and you find out in production.
  const nested = fs.readdirSync(API_DIR, { withFileTypes: true }).filter((e) => e.isDirectory());
  assert.deepEqual(
    nested.map((d) => d.name),
    [],
    `api/ must be flat. Found subdirectories: ${nested.map((d) => d.name).join(', ')}. A nested route 404s on Vercel.`,
  );
});

test('no entry point builds its own tools', () => {
  // The moment a second entry point constructs its own registry, the two
  // assistants start drifting and nobody notices until one does something the
  // other would have refused.
  for (const { name, source } of readAll(API_DIR)) {
    assert.ok(
      !source.includes('buildToolRegistry'),
      `api/${name} references buildToolRegistry directly. Entry points must call core/run.js, which is the only place tools are built.`,
    );
  }

  const runners = readAll(API_DIR).filter((f) => f.source.includes('core/run.js'));
  assert.ok(runners.length >= 2, 'Expected at least two entry points calling the shared pipeline (chat and agent).');
});

test('the tool registry is identical no matter who asks for it', () => {
  // Same tools, same schemas, regardless of caller context.
  const fingerprint = (ctx) => {
    const tools = buildToolRegistry(ctx);
    const shape = tools
      .map((t) => ({ name: t.name, parameters: t.parameters }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return crypto.createHash('sha256').update(JSON.stringify(shape)).digest('hex');
  };

  const browserish = fingerprint({ store: createMemoryStore(), n8n: null, approvals: [], onStatus: () => {} });
  const apiish = fingerprint({ store: createMemoryStore(), n8n: {}, approvals: ['activate_workflow'] });
  const sweepish = fingerprint({ store: createMemoryStore(), n8n: {} });

  assert.equal(browserish, apiish, 'The web UI and the JSON API were offered different tools.');
  assert.equal(apiish, sweepish, 'The sweep was offered different tools.');
});

test('a protocol adapter exposes the identical registry', async () => {
  // /api/mcp hands Jason's tools to other AIs. If it ever curated its own
  // list, an external agent could have powers the browser does not, or be
  // quietly denied ones it should have.
  const { toolsForProtocol } = await import('../core/protocol.js');
  const ctx = { store: createMemoryStore(), n8n: {}, approvals: [] };

  const shape = (tools) =>
    crypto
      .createHash('sha256')
      .update(JSON.stringify(tools.map((t) => ({ name: t.name, parameters: t.parameters, description: t.description })).sort((a, b) => a.name.localeCompare(b.name))))
      .digest('hex');

  assert.equal(shape(toolsForProtocol(ctx)), shape(buildToolRegistry(ctx)), 'the MCP adapter and the registry have diverged');
});

test('nothing can delete anything', () => {
  const tools = buildToolRegistry({ store: createMemoryStore(), n8n: {} });

  for (const tool of tools) {
    assert.ok(
      !/delete|destroy|remove_workflow|purge/i.test(tool.name),
      `Tool "${tool.name}" looks destructive. Retiring is archive + deactivate; nothing is ever deleted.`,
    );
  }

  const client = fs.readFileSync(path.join(CORE_DIR, 'n8nClient.js'), 'utf8');
  // This one deliberately reads the raw file: the tripwire assertion below
  // checks for a comment, so stripping comments would defeat it.
  // The only permitted mention is the guard that throws.
  const deleteCalls = [...client.matchAll(/request\(\s*'DELETE'/g)];
  assert.equal(deleteCalls.length, 0, 'core/n8nClient.js issues a DELETE request. It must not.');
  assert.ok(
    client.includes("method === 'DELETE'") && client.includes('never deletes'),
    'The DELETE tripwire in core/n8nClient.js has been removed.',
  );
});

test('updating a workflow without a snapshot is refused', async () => {
  const { createN8nClient } = await import('../core/n8nClient.js');
  const client = createN8nClient({
    baseUrl: 'https://example.invalid',
    apiKey: 'k',
    fetchImpl: async () => new Response('{}', { status: 200 }),
  });

  await assert.rejects(
    () => client.updateWorkflow('abc', { name: 'x', nodes: [], connections: {} }),
    /snapshotId/,
    'updateWorkflow must refuse to overwrite a workflow without a snapshot of the previous version.',
  );
});

test('every module and entry point parses and imports', async () => {
  // A syntax error in core/run.js once passed the whole unit suite, because
  // nothing imported it — only the self-test caught it. This closes that gap:
  // if a file cannot even be loaded, `npm test` fails.
  const dirs = ['core', 'api'];
  const failures = [];

  for (const dir of dirs) {
    for (const entry of fs.readdirSync(path.join(ROOT, dir))) {
      if (!entry.endsWith('.js')) continue;
      try {
        await import(new URL(`../${dir}/${entry}`, import.meta.url).href);
      } catch (err) {
        failures.push(`${dir}/${entry}: ${err.message.split('\n')[0]}`);
      }
    }
  }

  assert.deepEqual(failures, [], `modules failed to import:\n${failures.join('\n')}`);
});

test('memory supersedes rather than deletes, and refuses duplicates', async () => {
  const { remember, correct, retire, activeFacts, loadMemory, memoryPrompt } = await import('../core/memory.js');
  const store = createMemoryStore();

  await remember(store, 'The real Slack channel is #leads-uk');
  const dup = await remember(store, 'the real slack channel is #leads-uk!');
  assert.equal(dup.added, false, 'a restatement of the same fact must not be stored twice');

  const first = (await activeFacts(store))[0];
  await correct(store, first.id, 'The real Slack channel is #leads-eu');

  const active = await activeFacts(store);
  assert.equal(active.length, 1);
  assert.match(active[0].text, /leads-eu/);

  // The superseded fact is still on the record — nothing is destroyed.
  const all = await loadMemory(store);
  assert.equal(all.length, 2);
  assert.equal(all.find((f) => f.id === first.id).supersededBy, active[0].id);

  await retire(store, active[0].id);
  assert.equal((await activeFacts(store)).length, 0);
  assert.equal((await loadMemory(store)).length, 2, 'retiring keeps the record');
  assert.equal(await memoryPrompt(store), '', 'no active facts means nothing added to the prompt');
});
