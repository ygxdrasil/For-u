/**
 * POST /api/sweep — the scheduled check for workflows that broke.
 *
 * Driven by a schedule inside n8n rather than Vercel cron, because Vercel's
 * Hobby plan caps cron at once per DAY, and n8n is the thing that has to be up
 * anyway. Create a Schedule Trigger → HTTP Request workflow pointing here with
 * the bearer token.
 *
 * It diagnoses and PREPARES a repair. It does not apply one. Nothing in n8n
 * changes behaviour until you say so.
 */

import { run } from '../core/run.js';
import { createStore } from '../core/store.js';
import { authenticate } from '../core/auth.js';
import { createN8nClient } from '../core/n8nClient.js';
import { json, methodGuard, readBody, resolveConfig } from '../core/http.js';
import { describeFailure } from '../core/assess.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  const auth = await authenticate(req, store);
  if (!auth.ok) return json(res, 401, { ok: false, error: auth.error });

  req.body = await readBody(req);
  const config = await resolveConfig(req, store);

  if (!config.n8nBaseUrl || !config.n8nApiKey) {
    return json(res, 400, {
      ok: false,
      error: 'The sweep needs n8n credentials on the server (N8N_BASE_URL / N8N_API_KEY) — it has no browser to borrow them from.',
    });
  }

  const n8n = createN8nClient({ baseUrl: config.n8nBaseUrl, apiKey: config.n8nApiKey });
  const limit = Number(req.body.limit ?? 10);

  let failures;
  try {
    const list = await n8n.listExecutions({ status: 'error', limit });
    failures = list?.data ?? [];
  } catch (err) {
    return json(res, 502, { ok: false, error: `Could not read executions from n8n: ${err.message}` });
  }

  // n8n execution ids are numeric strings, and comparing them as TEXT means
  // "100" > "99" is false. Once ids gained a digit the cursor decided nothing
  // was ever new again and the watch went quietly dead — the worst possible
  // failure for a thing whose whole job is noticing.
  const newer = (a, b) => {
    const na = Number(a);
    const nb = Number(b);
    return Number.isFinite(na) && Number.isFinite(nb) ? na > nb : String(a) > String(b);
  };

  const cursor = (await store.getCursor('sweep')) ?? null;
  const fresh = cursor ? failures.filter((f) => newer(f.id, cursor)) : failures;

  if (!fresh.length) {
    return json(res, 200, { ok: true, checked: failures.length, newFailures: 0, findings: [], note: 'Nothing new has failed.' });
  }

  // Diagnose each one independently. One diagnosis blowing up must not lose
  // the others — this is the Promise.all mistake, deliberately not made.
  /**
   * The same breakage is one thing to look at, however many times it happens.
   *
   * A schedule that runs hourly on a workflow broken at 3am opens twenty
   * findings by morning — all the same workflow, the same node, the same
   * error. Twenty rows is the same disease as a counter that only goes up: it
   * stops being read, and the one genuinely new failure underneath them is
   * invisible. So a repeat updates the finding it repeats, and the count is
   * what turns "it broke" into "it has broken forty times since Tuesday",
   * which is a different sentence with a different urgency.
   *
   * Nothing is overwritten that matters: the first sighting keeps its time and
   * its execution id, and the latest one is recorded alongside.
   */
  const open = await store.listFindings({ status: 'open' });
  const sameBreakage = (finding, workflowId, node, error) =>
    finding.workflowId === workflowId && (finding.failingNode ?? null) === (node ?? null) && (finding.error ?? null) === (error ?? null);

  const findings = [];
  for (const failure of fresh) {
    try {
      const execution = await n8n.getExecution(failure.id);
      const detail = describeFailure(execution);
      const workflowName = failure.workflowData?.name ?? execution?.workflowData?.name ?? null;

      const existing = open.find((f) => sameBreakage(f, failure.workflowId, detail.node, detail.message));
      if (existing) {
        const updated = await store.updateFinding(existing.id, {
          seenCount: (existing.seenCount ?? 1) + 1,
          lastSeenAt: failure.startedAt ?? new Date().toISOString(),
          latestExecutionId: failure.id,
        });
        // Keep the in-memory copy current so several repeats in one sweep
        // count up rather than each finding the original again.
        if (updated) Object.assign(existing, updated);
        findings.push({ ...(updated ?? existing), diagnosed: true, repeat: true });
        continue;
      }

      const finding = await store.addFinding({
        executionId: failure.id,
        workflowId: failure.workflowId,
        workflowName,
        failingNode: detail.node,
        error: detail.message,
        seenCount: 1,
        at: failure.startedAt,
      });
      open.push(finding);
      findings.push({ ...finding, diagnosed: true });
    } catch (err) {
      findings.push({ executionId: failure.id, diagnosed: false, error: `Could not read this execution: ${err.message}` });
    }
  }

  // The highest id seen, not whichever happened to come back first — the API
  // does not promise an order, and taking the wrong one re-reports failures or
  // skips them.
  const highest = fresh.reduce((best, f) => (newer(f.id, best) ? f.id : best), cursor ?? fresh[0].id);
  await store.setCursor('sweep', String(highest));

  // Optionally have the assistant write the one-sentence explanation.
  let summary = null;
  if (req.body.explain !== false && config.geminiApiKey) {
    try {
      const described = findings
        .filter((f) => f.diagnosed)
        .map((f) => `- ${f.workflowName ?? f.workflowId}: node "${f.failingNode}" — ${f.error}`)
        .join('\n');
      const result = await run(
        {
          text: `These n8n executions just failed. For each, give one sentence on the likely cause. Do not change anything.\n\n${described}`,
          config,
          store,
          deadlineMs: 25_000,
        },
        {},
      );
      summary = result.reply;
    } catch (err) {
      summary = `Diagnosis text could not be generated (${err.message}), but the failures below were captured.`;
    }
  }

  return json(res, 200, {
    ok: true,
    checked: failures.length,
    newFailures: fresh.length,
    findings,
    summary,
    note: 'Repairs are prepared, never applied. Nothing in n8n was changed.',
  });
}
