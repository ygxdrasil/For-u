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

  json(res, 200, {
    ok: true,
    build: BUILD,
    nodeIndex: index,
    nodeIndexError: indexError,
    store: { kind: store.kind, durable: store.durable, note: store.note ?? null },
    models: { chat: TIERS.chat.models, design: TIERS.design.models, pricesCheckedOn: PRICES_CHECKED_ON },
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
