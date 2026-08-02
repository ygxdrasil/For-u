/**
 * One place where the pipeline's dependencies are assembled.
 *
 * Every entry point — the HUD, the token-authed endpoint, the scheduler —
 * calls this and then calls the same pipeline. If a route ever built its own
 * store or its own model client, that route would quietly develop different
 * standards, and the whole point of the headless core would be gone.
 *
 * Missing keys are not errors. Selena runs without a Gemini key and without an
 * Etsy key: she just says clearly what she cannot do, and refuses to produce
 * findings she cannot source.
 */

import { createStore } from './store.js';
import { createMeter } from './meter.js';
import { createLlm } from './llm.js';
import { createEtsy } from './etsy.js';
import { createCommunity } from './community.js';
import { createLedger } from './ledger.js';
import { createDeadline, nowIso } from './util.js';

/** Vercel kills the function at maxDuration; stop well before and report. */
export const DEFAULT_BUDGET_MS = 50_000;

export async function createContext({
  env = process.env,
  budgetMs = DEFAULT_BUDGET_MS,
  now = nowIso,
  fetchImpl = globalThis.fetch,
  clientFactory = null,
  storeOverride = null,
} = {}) {
  const store = storeOverride ?? (await createStore({ databaseUrl: env.DATABASE_URL, now }));

  // Keys may be pasted on the Settings page instead of deployed. The
  // environment always wins where it is set, and the store is only read for
  // the ones missing from it — so a fully env-configured deployment pays
  // nothing for this on any request.
  const { resolveKeys } = await import('./keys.js');
  const keys = await resolveKeys(store, env, async () => {
    const { getSessionSecret } = await import('./password.js');
    return getSessionSecret(store, env);
  });
  const keyOf = (name) => keys[name]?.value ?? null;

  const capUsd = Number.isFinite(Number(env.MONTHLY_USD_CAP)) ? Number(env.MONTHLY_USD_CAP) : 10;
  const meter = createMeter({ store, capUsd, now });

  let llm = null;
  let llmError = null;
  try {
    if (keyOf('GEMINI_API_KEY') || clientFactory) {
      llm = createLlm({ apiKey: keyOf('GEMINI_API_KEY') ?? 'test', meter, clientFactory });
    } else {
      llmError = keys.GEMINI_API_KEY?.unreadable
        ? 'A Gemini key is stored but cannot be decrypted — SESSION_SECRET has changed since it was saved. Paste it again on the Settings page.'
        : 'No Gemini key is set. Selena can show her state and answer from the record, but she cannot read the web, and she will not invent a finding in place of reading one. Paste one on the Settings page or set GEMINI_API_KEY.';
    }
  } catch (err) {
    llmError = err.message;
  }

  const ledger = createLedger({ now });
  const etsy = createEtsy({ apiKey: keyOf('ETSY_API_KEY'), ledger, fetchImpl });
  // Hacker News and Stack Exchange need no key, so they are always available.
  // They give asks, never proof of payment, and the ladder knows the difference.
  const community = createCommunity({ fetchImpl });

  const deadline = createDeadline(budgetMs);

  // Whatever you plugged in on the Sources page. Assembled lazily and behind a
  // tiny facade so the pipeline never has to know about secrets: it asks for
  // asks and gets asks, exactly as it does from the built-in sources.
  const connectors = {
    async gather(query, { ledger: withLedger = null } = {}) {
      const { gatherFromConnectors } = await import('./connectors.js');
      const { getSessionSecret } = await import('./password.js');
      const secret = await getSessionSecret(store, env);
      return gatherFromConnectors(store, query, { secret, fetchImpl, ledger: withLedger, deadline });
    },
  };

  return {
    store,
    meter,
    llm,
    llmError,
    etsy,
    community,
    connectors,
    ledger,
    deadline,
    budgetMs,
    now,
    fetchImpl,
    env,
    keys,
    capUsd,
    /** Written into the activity feed by the pipeline as it goes. */
    onEvent: async (event) => {
      try {
        await store.addActivity({ kind: 'trace', ...event });
      } catch {
        // Tracing must never be the reason a run fails.
      }
    },
  };
}

/** What every route reports about its own health, without echoing secrets. */
export function contextStatus(ctx) {
  return {
    store: { kind: ctx.store.kind, durable: ctx.store.durable, note: ctx.store.note ?? null, degraded: Boolean(ctx.store.degraded) },
    model: { configured: Boolean(ctx.llm), error: ctx.llmError },
    etsy: { configured: ctx.etsy.available, keySource: ctx.keys?.ETSY_API_KEY?.source ?? null },
    keySources: Object.fromEntries(Object.entries(ctx.keys ?? {}).map(([k, v]) => [k, v.source])),
    community: { configured: Boolean(ctx.community) },
    capUsd: ctx.capUsd,
  };
}
