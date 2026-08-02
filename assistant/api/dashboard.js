/**
 * GET /api/dashboard — everything the HUD shows, in one authenticated read.
 *
 * Two rules shape this file:
 *
 * 1. It never calls the model. The dashboard refreshes on a timer, and a timer
 *    that spends money is a bill you did not agree to. Everything here is a
 *    free read: your own n8n instance and your own database.
 *
 * 2. Every section is gathered independently and reports its own outcome. One
 *    dead call must not blank the page — if n8n is unreachable but the spend
 *    meter is fine, you see the spend meter and an honest note about n8n,
 *    not an error screen.
 */

import { createStore } from '../core/store.js';
import { createN8nClient } from '../core/n8nClient.js';
import { json, methodGuard, resolveConfig } from '../core/http.js';
import { describeServerConfig, loadPrefs } from '../core/settings.js';
import { catalogMeta } from '../core/nodeIndex.js';
import { TIERS } from '../core/llm.js';
import { PRICES_CHECKED_ON } from '../core/meter.js';
import { requireSession } from './auth.js';
import BUILD from '../core/build.js';

/** Wrap a section so its failure is data, not an exception. */
async function section(name, fn) {
  try {
    return { name, ok: true, data: await fn() };
  } catch (err) {
    return { name, ok: false, error: err.message, data: null };
  }
}

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  // The conversation on screen belongs to the same authenticated read as
  // everything else it shows. Without this a refresh leaves the page blank
  // while he still remembers, which reads as him having forgotten.
  const askedFor = (() => {
    try { return new URL(req.url, 'http://local').searchParams.get('sessionId'); } catch { return null; }
  })();

  const config = await resolveConfig(req, store);
  const prefs = await loadPrefs(store);
  const n8n = config.n8nBaseUrl && config.n8nApiKey ? createN8nClient({ baseUrl: config.n8nBaseUrl, apiKey: config.n8nApiKey }) : null;

  // Gathered by NAME, not by position. Inserting a section into a positional
  // destructure silently shifts every later one — spend quietly held the
  // conversation, and nothing about the response looked wrong.
  const gathered = await Promise.all([
    section('settings', () => describeServerConfig(store)),

    section('workflows', async () => {
      if (!n8n) return null;
      const res = await n8n.listWorkflows({ limit: 30 });
      return (res?.data ?? []).map((w) => ({
        id: w.id,
        name: w.name,
        active: w.active,
        isArchived: w.isArchived ?? false,
        updatedAt: w.updatedAt,
        tags: (w.tags ?? []).map((t) => t.name ?? t),
        // The node chain, for the card. Drawn from the JSON we already have,
        // so it costs nothing extra.
        chain: (w.nodes ?? [])
          .filter((n) => !n.disabled)
          .slice(0, 8)
          .map((n) => ({ name: n.name, type: n.type, short: shortType(n.type) })),
        nodeCount: (w.nodes ?? []).length,
      }));
    }),

    section('executions', async () => {
      if (!n8n) return null;
      const res = await n8n.listExecutions({ limit: 60 });
      return (res?.data ?? []).map((e) => ({
        id: e.id,
        workflowId: e.workflowId,
        workflowName: e.workflowData?.name ?? null,
        status: e.status,
        startedAt: e.startedAt,
        stoppedAt: e.stoppedAt,
      }));
    }),

    section('findings', () => store.listFindings({ status: 'open' })),

    section('conversation', async () => {
      if (!askedFor) return null;
      const stored = await store.getSession(askedFor);
      // Only the spoken turns. Tool calls and their results are machinery: they
      // belong in the terminal while they happen, not replayed as dialogue.
      return (stored?.messages ?? [])
        .map((m) => ({ role: m.role === 'model' ? 'jason' : 'user', text: (m.parts ?? []).map((p) => p.text).filter(Boolean).join('\n') }))
        .filter((m) => m.text.trim())
        .slice(-24);
    }),
    section('spend', async () => ({
      monthToDateUsd: await store.getMonthlySpend(),
      capUsd: Number(config.monthlyCapUsd ?? 8),
      recent: (await store.recentSpend(30)) ?? [],
      pricesCheckedOn: PRICES_CHECKED_ON,
    })),
    section('snapshots', () => store.listSnapshots(null)),
  ]);

  const sections = Object.fromEntries(gathered.map((s) => [s.name, s]));
  const { settings, workflows, executions, spend } = sections;

  // Jason's own vitals. This is how a stale deploy or a drifted node index gets
  // caught before it produces a confidently wrong answer, rather than after.
  let index = null;
  let indexError = null;
  try {
    index = catalogMeta();
  } catch (err) {
    indexError = err.message;
  }

  const reachability = n8n
    ? await section('n8n', () => n8n.ping())
    : { name: 'n8n', ok: false, error: 'No n8n URL or API key saved yet.', data: null };

  json(res, 200, {
    ok: true,
    vitals: {
      build: BUILD,
      store: { kind: store.kind, durable: store.durable, degraded: Boolean(store.degraded), note: store.note ?? null },
      nodeIndex: index,
      nodeIndexError: indexError,
      // The public n8n API exposes no version endpoint, so this is genuinely
      // unknown rather than assumed to match. Said plainly instead of implied.
      instanceVersion: null,
      instanceVersionNote: "n8n's public API does not report its version, so I cannot confirm the node index matches your instance.",
      // The models actually in use, from preferences — not the tier defaults.
      // Reporting the default here would keep showing the old model after you
      // changed it, which is the opposite of what a vitals panel is for.
      models: { chat: prefs.chatModel, design: prefs.designModel, fallbacks: { chat: TIERS.chat.models, design: TIERS.design.models } },
      encryption: settings.data?.encryption ?? null,
      n8n: { configured: Boolean(n8n), reachable: reachability.data?.reachable ?? false, authorised: reachability.data?.authorised ?? null, error: reachability.error ?? reachability.data?.error ?? null },
    },
    sections,
  });
}

/** "n8n-nodes-base.googleSheets" -> "Google Sheets", for the chain pills. */
function shortType(type) {
  const tail = String(type ?? '').split('.').pop() ?? '';
  return tail
    .replace(/Trigger$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}
