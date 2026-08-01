/**
 * Structural rules that only ever break in production.
 *
 * Each of these encodes a failure that cost real time: a nested route that
 * 404s without the code running, a security header that exists on the CDN but
 * not on the function, a DELETE that appears in a refactor six months from now.
 * None of them can be caught by running the app locally, which is exactly why
 * they are tests.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SECURITY_HEADERS, vercelHeaderEntries } from '../core/headers.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, filter = () => true, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, acc);
    else if (filter(full)) acc.push(full);
  }
  return acc;
}

test('every API route is a single path segment', () => {
  // A Vercel function serves /api/x and 404s /api/x/y. The code never runs, and
  // nothing locally reproduces it, so this is the only place it gets caught.
  const apiDir = path.join(ROOT, 'api');
  const files = walk(apiDir, (f) => f.endsWith('.js'));
  assert.ok(files.length > 0, 'there should be routes to check');

  for (const file of files) {
    const relative = path.relative(apiDir, file);
    assert.ok(
      !relative.includes(path.sep),
      `api/${relative} is nested. Vercel serves /api/x but 404s /api/x/y — flatten it to a single segment and branch on an action in the body.`,
    );
  }
});

test('vercel.json headers match core/headers.js exactly', () => {
  // Two hand-maintained copies drift, and the drift is invisible: the page
  // keeps working and one half quietly stops being protected.
  const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const block = vercel.headers?.find((h) => h.source === '/(.*)');
  assert.ok(block, 'vercel.json must set headers on every path');

  const fromCode = vercelHeaderEntries();
  const fromJson = block.headers;

  assert.equal(fromJson.length, fromCode.length, 'the CDN and the function must declare the same number of headers');
  for (const expected of fromCode) {
    const actual = fromJson.find((h) => h.key === expected.key);
    assert.ok(actual, `vercel.json is missing ${expected.key}`);
    assert.equal(actual.value, expected.value, `${expected.key} differs between the CDN and the function`);
  }
});

test('the required security headers are all present', () => {
  for (const required of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
    assert.ok(SECURITY_HEADERS[required], `${required} is not declared`);
  }
});

test('every route applies the security headers to its responses', async () => {
  // The CDN block does not cover function responses, so json() applies them
  // too. This asserts json() is what every route actually uses.
  const { json } = await import('../core/http.js');
  const set = {};
  const res = {
    statusCode: 0,
    setHeader: (k, v) => {
      set[k] = v;
    },
    end: () => {},
  };
  json(res, 200, { ok: true });
  for (const key of Object.keys(SECURITY_HEADERS)) {
    assert.equal(set[key], SECURITY_HEADERS[key], `${key} is missing from function responses`);
  }
  assert.equal(set['Cache-Control'], 'no-store');
});

test('no source file contains a delete statement', () => {
  // "Never delete anything, ever." A rejected finding from March is evidence
  // when the same demand turns up in September. This is the guard that stops a
  // future refactor quietly introducing one.
  const files = walk(path.join(ROOT, 'core'), (f) => f.endsWith('.js')).concat(
    walk(path.join(ROOT, 'api'), (f) => f.endsWith('.js')),
  );

  const forbidden = [/\bDELETE\s+FROM\b/i, /\bDROP\s+TABLE\b/i, /\bTRUNCATE\b/i];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const pattern of forbidden) {
      assert.ok(
        !pattern.test(source),
        `${path.relative(ROOT, file)} contains ${pattern}. Findings are archived or superseded, never destroyed.`,
      );
    }
  }
});

test('the store interface is the same shape in memory and in Postgres', async () => {
  // Two implementations that drift is how a feature works locally and fails in
  // production. The Neon module is imported for its shape only; it never opens
  // a connection here.
  const { createMemoryStore } = await import('../core/store.js');
  const { createNeonStore } = await import('../core/store.neon.js');

  const memory = createMemoryStore();
  // A fake sql tag that records nothing and returns nothing, so the factory
  // can build its object without a database.
  const fakeSql = async () => [];
  const neon = await createNeonStore({ databaseUrl: 'postgres://fake', sqlFactory: () => fakeSql });

  const memoryMethods = Object.keys(memory).filter((k) => typeof memory[k] === 'function').sort();
  const neonMethods = Object.keys(neon).filter((k) => typeof neon[k] === 'function').sort();

  assert.deepEqual(neonMethods, memoryMethods, 'the two stores must expose exactly the same methods');
});

test('llm tiers cannot be configured into returning an empty string', async () => {
  // Thinking is billed out of maxOutputTokens. A budget at or above the
  // ceiling lets the model spend its whole allowance thinking and return an
  // empty string from a request that looks completely healthy.
  const { assertTierSanity, TIERS } = await import('../core/llm.js');
  assert.equal(assertTierSanity(), true);

  assert.throws(
    () => assertTierSanity({ bad: { models: ['gemini-2.5-flash'], maxOutputTokens: 1024, thinkingBudget: 1024 } }),
    /empty string/,
  );
  assert.throws(() => assertTierSanity({ bad: { models: ['made-up-model'], maxOutputTokens: 8192, thinkingBudget: 0 } }), /no price/);

  // A grounded tier must never carry a response schema — the API rejects it.
  assert.equal(TIERS.search.grounded, true);
  assert.equal(TIERS.extract.grounded, false);
});

test('the source policy blocks the hosts it says it blocks', async () => {
  const { assertFetchAllowed, ForbiddenSourceError, SOURCES } = await import('../core/sources.js');

  for (const host of ['https://www.fiverr.com/gigs/x', 'https://gumroad.com/l/x', 'https://www.reddit.com/r/x', 'https://www.instagram.com/p/x', 'https://www.facebook.com/groups/x', 'https://www.etsy.com/listing/1']) {
    assert.throws(() => assertFetchAllowed(host), ForbiddenSourceError, `${host} should be refused`);
  }

  // The Etsy API host is allowed; the Etsy storefront is not.
  assert.equal(assertFetchAllowed('https://api.etsy.com/v3/application/listings/active').ok, true);
  assert.equal(assertFetchAllowed('https://someforum.example.com/thread').ok, true);
  assert.throws(() => assertFetchAllowed('nonsense'), ForbiddenSourceError);

  // Every source must carry the reasoning, because the HUD renders it and the
  // prompts quote it.
  for (const s of SOURCES) {
    assert.ok(s.note && s.note.length > 40, `${s.id} needs a real explanation`);
    assert.ok(s.checkedOn, `${s.id} must say when it was last checked`);
  }
});

test('prompts are assembled from the live tables, not from a stale copy', async () => {
  const { systemPrompt } = await import('../core/prompts.js');
  const { SOURCES } = await import('../core/sources.js');
  const prompt = systemPrompt();

  for (const s of SOURCES) {
    assert.ok(prompt.includes(s.name), `the prompt must describe ${s.name}`);
  }
  assert.match(prompt, /Never invent a figure/);
  assert.match(prompt, /risks/i);
});

test('the scheduler workflow is valid YAML, with no script at column zero', () => {
  // The failure this reproduces, exactly: a multi-line Python block was
  // embedded in a `run: |` scalar with its lines at column zero. That
  // terminates the block scalar and makes the whole workflow file invalid,
  // so GitHub rejects it and the watches never run — silently, because
  // nothing local parses workflow YAML.
  //
  // A full YAML parser would be a dependency for one file, so this checks the
  // one rule that was actually broken: every line inside a block scalar must
  // be indented further than the key that opened it.
  const file = path.join(ROOT, '..', '.github', 'workflows', 'selena-watches.yml');
  assert.ok(fs.existsSync(file), 'the scheduler workflow must exist');

  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const indentOf = (line) => line.length - line.trimStart().length;

  let block = null;
  lines.forEach((line, i) => {
    if (block !== null) {
      if (line.trim() === '') return; // blank lines are always allowed
      if (indentOf(line) > block.indent) return; // still inside the block
      block = null; // dedented out of it
    }
    const opener = line.match(/^(\s*)[\w.-]+:\s*[|>][-+]?\s*$/);
    if (opener) block = { indent: opener[1].length, line: i + 1 };
  });

  // Anything at column zero that is not a top-level key or a comment means a
  // block scalar leaked, which is precisely the bug.
  const leaked = lines
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => line.length && !line.startsWith(' ') && !line.startsWith('#'))
    .filter(({ line }) => !/^[\w.-]+:/.test(line) && line.trim() !== '---');
  assert.deepEqual(leaked, [], `these lines sit at column zero and are not top-level keys: ${JSON.stringify(leaked)}`);

  const source = lines.join('\n');
  assert.match(source, /node scripts\/sweep\.mjs/, 'the workflow must call the tested script rather than inlining logic');
  assert.ok(fs.existsSync(path.join(ROOT, 'scripts', 'sweep.mjs')), 'scripts/sweep.mjs must exist');
});

test('every npm script points at a file that exists', () => {
  // "watch:run" pointed at scripts/run-watches.mjs, which was never written —
  // the script was renamed and the reference was not. Nothing would have found
  // that until someone ran it and got MODULE_NOT_FOUND.
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const [name, cmd] of Object.entries(pkg.scripts)) {
    for (const [, file] of String(cmd).matchAll(/node (?:--\S+ )*([\w./-]+\.(?:mjs|js))/g)) {
      // node_modules paths only exist after an install, so they are exempt.
      if (file.startsWith('node_modules')) continue;
      assert.ok(fs.existsSync(path.join(ROOT, file)), `script "${name}" runs ${file}, which does not exist`);
    }
  }
});
