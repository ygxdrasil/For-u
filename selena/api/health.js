/**
 * GET /api/health — proves which build is actually running.
 *
 * A server-side change leaves the frontend bundle byte-identical, so there is
 * otherwise no way to tell a live server from a stale one. The id here and the
 * one in the static /build.json are stamped from the same value in the same
 * run: if they disagree, one half of the deploy is stale.
 *
 * Open on purpose — it is the thing you curl to find out whether a deploy
 * worked, and needing a token for that is how you end up guessing instead.
 */

import { json, methodGuard, guard } from '../core/http.js';
import { createStore } from '../core/store.js';
import { PRICES_CHECKED_ON, SEARCH_PRICING } from '../core/meter.js';
import { TIERS } from '../core/llm.js';
import { sourceStatus } from '../core/sources.js';
import BUILD from '../core/build.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET'])) return;

  const store = await createStore();
  let storeReady = null;
  let storeError = null;
  try {
    storeReady = await store.ready();
  } catch (err) {
    storeError = err.message;
  }

  json(res, 200, {
    ok: true,
    name: 'selena',
    build: BUILD,
    store: { kind: store.kind, durable: store.durable, ready: storeReady, note: store.note ?? null, error: storeError, degraded: Boolean(store.degraded) },
    models: {
      search: TIERS.search.models,
      extract: TIERS.extract.models,
      judge: TIERS.judge.models,
      pricesCheckedOn: PRICES_CHECKED_ON,
      freeSearchAllowance: SEARCH_PRICING,
    },
    sources: sourceStatus().map((s) => ({ id: s.id, access: s.access, live: s.live })),
    // What the server has configured. The values are never echoed back.
    serverEnv: {
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasEtsyKey: Boolean(process.env.ETSY_API_KEY),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasSelenaToken: Boolean(process.env.SELENA_TOKEN),
      hasJasonEndpoint: Boolean(process.env.JASON_ENDPOINT),
      monthlyCapUsd: Number(process.env.MONTHLY_USD_CAP ?? 10),
    },
    openApi: !process.env.SELENA_TOKEN,
  });
});
