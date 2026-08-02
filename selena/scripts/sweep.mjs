#!/usr/bin/env node
/**
 * The sweep the scheduler runs.
 *
 * This lives in a real file rather than inside the workflow YAML, and that is
 * not a style preference. The first version embedded a multi-line Python block
 * in a `run: |` scalar; its lines sat at column zero, which terminated the
 * block scalar and made the whole workflow file invalid YAML. GitHub would
 * have rejected the workflow outright — the watches would never have run, and
 * nothing would have told me. Logic in a file can be executed locally against
 * a live server before it is trusted, which is the only reason I know this one
 * works.
 *
 * Usage (what the workflow does):
 *   SELENA_URL=... SELENA_TOKEN=... node scripts/sweep.mjs
 *
 * Options via env: PASSES (default 4), LIMIT (watches per pass, default 2).
 */

import fs from 'node:fs';

const URL_BASE = (process.env.SELENA_URL ?? '').replace(/\/+$/, '');
const TOKEN = process.env.SELENA_TOKEN ?? '';
const PASSES = Math.min(20, Math.max(1, Number(process.env.PASSES) || 4));
const LIMIT = Math.min(10, Math.max(1, Number(process.env.LIMIT) || 2));

if (!URL_BASE) {
  // Not a failure. A red cross every morning for a thing you have not set up
  // yet just teaches you to ignore red crosses.
  console.log('SELENA_URL is not set, so there is nothing to sweep. Add it as a repository secret when Selena is deployed.');
  process.exit(0);
}

const headers = { 'content-type': 'application/json', ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}) };

async function call(path, { method = 'GET', body = null } = {}) {
  const res = await fetch(`${URL_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    signal: AbortSignal.timeout(120_000),
  });
  const text = await res.text();
  if (!res.ok) {
    // Show what the server actually said. A bare status code sends you
    // guessing; the body usually names the problem outright.
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${method} ${path} returned something that is not JSON. First 200 characters: ${text.slice(0, 200)}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const summaryLines = [];
function summary(line) {
  summaryLines.push(line);
}

let exitCode = 0;
const reportedAll = [];
const stoodAll = [];
const handedAll = [];

try {
  const due = await call('/api/cron');
  console.log(`${due.due.length} watch(es) due, ${due.staleFindings.length} finding(s) needing a re-check`);
  for (const w of due.due) console.log(`  due: ${w.name} (${w.cadence}, last run ${w.lastRunAt ?? 'never'})`);
  if (due.autonomy) console.log(`autonomy: ${due.autonomy.says}`);

  if (!due.context?.store?.durable) {
    console.log('WARNING: storage is not durable, so watches cannot remember what they already reported. Set DATABASE_URL.');
  }

  let remaining = due.due.length;
  for (let pass = 1; pass <= PASSES && remaining > 0; pass += 1) {
    console.log(`--- pass ${pass} ---`);
    const result = await call('/api/cron', { method: 'POST', body: { limit: LIMIT } });

    for (const r of result.ran ?? []) {
      const detail = r.skipped ? `skipped — ${r.reason}` : `${r.status}${r.reported ? ' — REPORTED' : ''} (${r.reason ?? r.error ?? ''})`;
      console.log(`  ${r.name}: ${detail}`);
    }
    for (const r of result.reported ?? []) {
      console.log(`  NEW/CHANGED [level ${r.strength}] ${r.watch}: ${r.oneLine}`);
      reportedAll.push(r);
    }
    for (const r of result.rechecked ?? []) {
      console.log(`  re-checked ${r.id}: ${r.summary ?? r.error ?? 'no change'}`);
    }

    // What she did on her own authority. Kept separate from what the watches
    // found, because "she decided to do this" and "a watch you approved found
    // this" are different things and only one of them needs your judgement.
    for (const s of result.stood ?? []) {
      console.log(`  STOOD HER OWN WATCH: ${s.name} — ${s.why}`);
      stoodAll.push(s);
    }
    for (const h of result.handed ?? []) {
      console.log(`  HANDED TO JASON [level ${h.strength}] ${h.oneLine} — ${h.delivered ? 'delivered' : 'delivery failed'}`);
      handedAll.push(h);
    }
    for (const n of result.notes ?? []) console.log(`  note: ${n}`);
    if (result.says) console.log(`  ${result.says}`);
    if (result.outOfAllowance) break;

    remaining = Number(result.remainingDue) || 0;
    if (remaining > 0 && pass < PASSES) await sleep(5000);
  }

  if (remaining > 0) console.log(`${remaining} watch(es) still due after ${PASSES} passes; they stay due for the next run.`);

  const dash = await call('/api/dashboard');
  const h = dash.headline ?? {};
  const m = dash.money ?? {};

  summary('## Selena');
  summary('');
  if (reportedAll.length) {
    summary(`**${reportedAll.length} new or changed**`);
    summary('');
    for (const r of reportedAll) summary(`- **[level ${r.strength}]** ${r.watch} — ${r.oneLine}`);
  } else if ((h.watchesActive ?? 0) === 0 && !dash.autonomy?.armed) {
    // "Every watch looked and nothing had moved" is a lie when there are no
    // watches: nothing looked. Silence because there is nothing to run and
    // silence because there was nothing to find need different things doing
    // about them, and only one of them is the system working.
    summary('**Nothing ran, because nothing is set up to run.** There are no active watches and she is not armed, so this sweep had nothing to do.');
    summary('');
    summary('Stand a watch on the Watches page, or arm her with the switch in the sidebar.');
  } else {
    summary('Nothing new. Every watch looked and nothing had moved, which is the system working rather than failing.');
  }
  if (handedAll.length) {
    summary('');
    summary(`**${handedAll.length} sent to Jason on her own**`);
    summary('');
    for (const h of handedAll) summary(`- **[level ${h.strength}]** ${h.oneLine} — ${h.delivered ? 'delivered' : '**delivery failed**'}`);
  }
  if (stoodAll.length) {
    summary('');
    summary(`**${stoodAll.length} watch(es) she stood herself**`);
    summary('');
    for (const s of stoodAll) summary(`- ${s.name} — ${s.why}`);
  }

  summary('');
  summary('| | |');
  summary('| --- | --- |');
  if (dash.autonomy) summary(`| autonomy | ${dash.autonomy.armed ? 'armed' : 'not armed'} |`);
  summary(`| real openings (level 4+) | ${h.realOpenings ?? 0} |`);
  summary(`| active findings | ${h.activeFindings ?? 0} |`);
  summary(`| Jason can build | ${h.buildable ?? 0} |`);
  summary(`| spent this month | $${Number(m.monthToDateUsd ?? 0).toFixed(4)} of $${Number(m.capUsd ?? 0).toFixed(2)} |`);
  summary(`| free searches used today | ${m.searchesToday ?? 0} |`);
  if (!dash.context?.store?.durable) summary('| storage | **not durable — set DATABASE_URL** |');
  if (dash.openApi) summary('| auth | **open — set SELENA_TOKEN** |');

  console.log(`\nDone. ${reportedAll.length} thing(s) worth reading.`);
} catch (err) {
  console.error(`Sweep failed: ${err.message}`);
  summary('## Selena');
  summary('');
  summary(`Sweep failed: \`${err.message}\``);
  exitCode = 1;
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summaryLines.join('\n')}\n`);
} else {
  console.log(`\n--- step summary ---\n${summaryLines.join('\n')}`);
}

process.exit(exitCode);
