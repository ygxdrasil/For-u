/**
 * GET /api/health — proves which build is actually running.
 *
 * A server-side change leaves the frontend bundle byte-identical, so there is
 * otherwise no way to tell a live server from a stale one. The build id here
 * and the one in the static /build.json are stamped from the same source at
 * build time: if they disagree, you are looking at a stale deployment.
 */

import { catalogMeta } from '../core/nodeIndex.js';
import { createStore } from '../core/store.js';
import { json, methodGuard } from '../core/http.js';
import { PRICES_CHECKED_ON } from '../core/meter.js';
import { TIERS } from '../core/llm.js';
import { loadPrefs } from '../core/settings.js';

import BUILD from '../core/build.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  let index = null;
  let indexError = null;
  try {
    index = catalogMeta();
  } catch (err) {
    indexError = err.message;
  }

  const store = await createStore();

  // A settings read must never take the health check down — it is the one
  // route you reach for when something else is already wrong.
  let prefs = null;
  try {
    prefs = await loadPrefs(store);
  } catch {
    prefs = null;
  }

  json(res, 200, {
    ok: true,
    build: BUILD,
    nodeIndex: index,
    nodeIndexError: indexError,
    store: { kind: store.kind, durable: store.durable, note: store.note ?? null },
    // What is actually in use, not just what the fallback chains contain. This
    // reported the chains alone, so it went on naming a model that had not been
    // the one running for some time — a status endpoint that is confidently out
    // of date is worse than one that says nothing.
    models: {
      chat: prefs?.chatModel ?? TIERS.chat.models[0],
      design: prefs?.designModel ?? TIERS.design.models[0],
      thinkingBudget: prefs?.thinkingBudget ?? TIERS.design.thinkingBudget,
      fallbacks: { chat: TIERS.chat.models, design: TIERS.design.models },
      pricesCheckedOn: PRICES_CHECKED_ON,
    },
    // What the server itself has configured. Never echo the values back.
    serverEnv: {
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasN8nUrl: Boolean(process.env.N8N_BASE_URL),
      hasN8nKey: Boolean(process.env.N8N_API_KEY),
      hasAgentToken: Boolean(process.env.AGENT_TOKEN),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      monthlyCapUsd: Number(process.env.MONTHLY_USD_CAP ?? 8),
    },
  });
}
