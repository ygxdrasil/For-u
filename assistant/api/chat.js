/**
 * POST /api/chat — the browser's way in. Server-sent events, so the user can
 * watch the work instead of staring at a spinner.
 *
 * Same core/run.js, same tools, same everything. The ONLY difference from
 * /api/agent is that hooks are wired to push events down the wire as they
 * happen. If you ever find yourself adding capability here, it belongs in
 * core/tools.js instead.
 */

import { run } from '../core/run.js';
import { createStore } from '../core/store.js';
import { readBody, resolveConfig } from '../core/http.js';
import { requireSession } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Use POST.');
  }

  // The browser entry point is behind the password. The site is public and
  // this route can read and write every workflow in the n8n instance.
  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, error: 'Not signed in.' }));
  }

  req.body = await readBody(req);
  const text = req.body?.text;
  if (!text) {
    res.statusCode = 400;
    return res.end('Send { "text": "..." }.');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Once the browser is gone every write throws, and an uncaught one takes the
  // whole function down mid-answer — closing a tab is not an error condition.
  // The work finishes and is recorded; only the narration stops.
  let clientGone = false;
  const send = (event, data) => {
    if (clientGone) return;
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      clientGone = true;
    }
  };
  req.on?.('close', () => { clientGone = true; });

  send('open', { at: new Date().toISOString() });

  try {
    const result = await run(
      {
        text,
        sessionId: req.body.sessionId ?? null,
        approvals: req.body.approvals ?? [],
        // Handed back as jobId when a turn runs out of road; passing it picks the
        // work up where it stopped rather than starting again.
        resumeJobId: req.body.resumeJobId ?? null,
        config: await resolveConfig(req, store),
        store,
        deadlineMs: Number(req.body.deadlineMs ?? 50_000),
      },
      {
        onStatus: (status) => send('status', { status }),
        onToolStart: ({ name, args, say }) => send('tool_start', { name, args, say }),
        onToolEnd: ({ name, say, result: r, preview }) =>
          send('tool_end', {
            name,
            say,
            preview,
            ok: r?.ok !== false,
            // Full tool payloads can be large; the UI shows a summary and the
            // model gets the whole thing regardless.
            error: r?.ok === false ? String(r.error).slice(0, 400) : null,
            needsApproval: r?.needsApproval ?? null,
            // Which workflow, peer or host the approval is about. Without it
            // the browser can only say yes to a category, and a yes to a
            // category is a yes to everything in it.
            approvalTarget: r?.approvalTarget ?? null,
            detail: detailFor(r),
          }),
        onText: (chunk) => send('text', { chunk }),
      },
    );

    send('done', {
      status: result.status,
      reply: result.reply,
      jobId: result.jobId ?? null,
      resumedFrom: result.resumedFrom ?? null,
      steps: result.steps,
      spend: result.spend,
      elapsedMs: result.elapsedMs,
      storeDurable: result.storeDurable,
      storeKind: result.storeKind,
    });
  } catch (err) {
    send('error', { error: err.message });
  } finally {
    try {
      res.end();
    } catch {
      // Already closed by the client. Nothing to report to nobody.
    }
  }
}

/**
 * The part of a tool result worth putting on screen.
 *
 * The terminal shows what actually came back per node, which is the difference
 * between "it ran" and "it ran and here is what came out of step three". The
 * model still receives the whole result — this is a view, not a filter on the
 * pipeline.
 */
function detailFor(r) {
  if (!r || typeof r !== 'object') return null;
  const detail = {};
  if (r.execution) detail.execution = r.execution;
  if (r.assessment) detail.assessment = r.assessment;
  if (r.validation) detail.validation = r.validation;
  if (Array.isArray(r.disabledWriteNodes) && r.disabledWriteNodes.length) detail.disabledWriteNodes = r.disabledWriteNodes;
  if (r.values) detail.values = r.values.slice(0, 25);
  if (r.id) detail.id = r.id;
  return Object.keys(detail).length ? detail : null;
}
