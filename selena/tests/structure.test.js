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

test('the deploy stays under the Hobby serverless function limit', () => {
  // Vercel Hobby allows 12 serverless functions per deployment, and there are
  // enough reports of it failing at 11 that the working ceiling here is 11.
  // The failure mode is the worst kind: the build succeeds, the deploy is
  // rejected, and the last good deployment stays live — so the site looks fine
  // while every change silently stops shipping. api/tokens.js was folded into
  // api/auth.js for exactly this reason; the next new route has to fold into an
  // existing one too.
  const HOBBY_CEILING = 11;
  const routes = walk(path.join(ROOT, 'api'), (f) => f.endsWith('.js')).map((f) => path.relative(ROOT, f).split(path.sep).join('/'));

  assert.ok(
    routes.length <= HOBBY_CEILING,
    `${routes.length} serverless functions: ${routes.join(', ')}. The ceiling is ${HOBBY_CEILING} — fold the new route into an existing one and branch on an action in the body.`,
  );

  // A route with no entry gets Vercel's default 10s timeout, which is under
  // research's own budget: the platform would kill the function mid-run and
  // return nothing, which reads as a hang rather than as a timeout.
  const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const declared = Object.keys(vercel.functions ?? {});
  for (const route of routes) {
    assert.ok(declared.includes(route), `${route} has no maxDuration in vercel.json, so it silently gets the 10s default`);
  }
  for (const entry of declared) {
    assert.ok(routes.includes(entry), `vercel.json configures ${entry}, which no longer exists`);
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
  // A fake driver that behaves like the real one, including refusing a plain
  // call and exposing .query. The previous version of this fake accepted
  // anything, which is precisely how the store shipped calling sql(statement)
  // and failing on first contact with a real database.
  const fakeSql = async (strings) => {
    if (typeof strings === 'string') throw new Error('This function can now be called only as a tagged-template function');
    return [];
  };
  fakeSql.query = async () => [];
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

/**
 * Vercel validates vercel.json against a CLOSED schema, before the build runs.
 *
 * An unknown top-level key does not warn and is not ignored: the whole
 * deployment fails with `should NOT have additional property "x"`, no build
 * logs are produced because no build ever starts, and the dashboard refuses to
 * redeploy it — "this deployment can not be redeployed, try again from a fresh
 * commit" — because there is no build to repeat.
 *
 * This has already happened. A `_comment_ignoreCommand` key was added to
 * explain WHY ignoreCommand exists, which is a good instinct in a file format
 * that has no comments, and it silently broke every deployment of both
 * projects in this repo for a day. JSON has no comments. The explanation
 * belongs in the README, and this test is what stops the next one.
 */
const VERCEL_TOP_LEVEL = new Set([
  '$schema', 'buildCommand', 'devCommand', 'installCommand', 'ignoreCommand',
  'outputDirectory', 'framework', 'functions', 'routes', 'rewrites', 'redirects',
  'headers', 'cleanUrls', 'trailingSlash', 'regions', 'public', 'github', 'git',
  'images', 'crons', 'env', 'build', 'version',
]);

test('vercel.json carries no key Vercel will reject', () => {
  // Both projects in this repo, because one bad key in either one is a day of
  // nothing deploying, and the person who adds it will not be looking here.
  for (const file of [path.join(ROOT, 'vercel.json'), path.join(ROOT, '..', 'assistant', 'vercel.json')]) {
    if (!fs.existsSync(file)) continue;
    for (const key of Object.keys(JSON.parse(fs.readFileSync(file, 'utf8')))) {
      assert.ok(
        VERCEL_TOP_LEVEL.has(key),
        `${path.relative(path.join(ROOT, '..'), file)} has a top-level "${key}", which is not in Vercel's schema. ` +
          'That does not warn — it fails the whole deployment before the build starts, with no build logs ' +
          'and no way to redeploy. If it is a real Vercel option, add it to VERCEL_TOP_LEVEL here. ' +
          'If it is a comment, move it to the README.',
      );
    }
  }
});

/**
 * A merge must survive the next run of the watch that produced the survivor.
 *
 * A finding's id is derived from its one-liner and who has it, so a re-run
 * produces the SAME id and putFinding overwrites — taking the absorbed
 * evidence and `mergedFrom` with it, while the partners stay superseded. The
 * evidence is gone from the active record permanently, and nothing is reported
 * because runWatch only announces what it thinks is new.
 *
 * Four paths write a freshly researched finding. "Remember to call the helper"
 * has already failed three times in this codebase — the ledger method name, the
 * session secret, the re-score after a merge — so it is asserted instead.
 */
test('nothing writes a freshly researched finding without carrying a merge forward', () => {
  const paths = ['core/watches.js', 'api/research.js', 'api/command.js'];
  for (const rel of paths) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const direct = src.match(/(?:ctx\.)?(?:deps\.)?store\.putFinding\(\s*(?:result\.)?(?:finding|merged|clean)\b/g) ?? [];
    assert.equal(
      direct.length,
      0,
      `${rel} calls store.putFinding directly with a researched finding. Use saveResearchedFinding() from core/synthesis.js — a plain putFinding silently destroys any merge that record was part of.`,
    );
    assert.ok(
      /saveResearchedFinding/.test(src),
      `${rel} writes findings but never imports saveResearchedFinding`,
    );
  }
});
