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

const readAll = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.js'))
    .map((e) => ({ name: e.name, source: fs.readFileSync(path.join(dir, e.name), 'utf8') }));

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

test('nothing can delete anything', () => {
  const tools = buildToolRegistry({ store: createMemoryStore(), n8n: {} });

  for (const tool of tools) {
    assert.ok(
      !/delete|destroy|remove_workflow|purge/i.test(tool.name),
      `Tool "${tool.name}" looks destructive. Retiring is archive + deactivate; nothing is ever deleted.`,
    );
  }

  const client = fs.readFileSync(path.join(CORE_DIR, 'n8nClient.js'), 'utf8');
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
