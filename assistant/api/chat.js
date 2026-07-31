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

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  send('open', { at: new Date().toISOString() });

  try {
    const result = await run(
      {
        text,
        sessionId: req.body.sessionId ?? null,
        approvals: req.body.approvals ?? [],
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
          }),
        onText: (chunk) => send('text', { chunk }),
      },
    );

    send('done', {
      status: result.status,
      reply: result.reply,
      jobId: result.jobId ?? null,
      steps: result.steps,
      spend: result.spend,
      elapsedMs: result.elapsedMs,
      storeDurable: result.storeDurable,
      storeKind: result.storeKind,
    });
  } catch (err) {
    send('error', { error: err.message });
  } finally {
    res.end();
  }
}
