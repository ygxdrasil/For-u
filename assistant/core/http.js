/**
 * Shared HTTP plumbing for the entry points.
 *
 * Every route file in api/ is a SINGLE path segment. A Vercel catch-all
 * function serves /api/x and 404s /api/x/y — the code never runs, and you find
 * out in production. tests/routes-single-segment.test.js fails the build if a
 * nested route is ever introduced.
 */

/**
 * The config the pipeline should run with, in increasing order of precedence:
 *
 *   1. server environment variables
 *   2. keys saved in the database (what the Settings page writes)
 *   3. anything supplied on the request itself
 *
 * The database layer is what lets /api/agent and /api/sweep work with nobody's
 * browser open, which is the whole point of storing them server-side.
 */
export async function resolveConfig(req, store) {
  const fromRequest = readConfig(req);
  let fromStore = {};
  try {
    const { loadServerConfig } = await import('./settings.js');
    fromStore = await loadServerConfig(store);
  } catch {
    // A settings read failure must not take the request down; the request may
    // well carry everything it needs.
    fromStore = {};
  }

  const pick = (...values) => values.find((v) => v !== null && v !== undefined && v !== '') ?? null;

  return {
    n8nBaseUrl: pick(fromRequest.n8nBaseUrlExplicit, fromStore.n8nBaseUrl, fromRequest.n8nBaseUrl),
    n8nApiKey: pick(fromRequest.n8nApiKeyExplicit, fromStore.n8nApiKey, fromRequest.n8nApiKey),
    geminiApiKey: pick(fromRequest.geminiApiKeyExplicit, fromStore.geminiApiKey, fromRequest.geminiApiKey),
    monthlyCapUsd: pick(fromRequest.monthlyCapUsdExplicit, fromStore.monthlyCapUsd, fromRequest.monthlyCapUsd, 8),
  };
}

export function readConfig(req) {
  // Keys can come from the browser (pasted in Settings, held locally) or from
  // server env. Browser-supplied wins, so a caller can use their own instance
  // without redeploying.
  const body = req.body ?? {};
  const h = req.headers ?? {};
  return {
    // What this specific request asked for, kept separate so it can take
    // precedence over stored settings without env vars shadowing it.
    n8nBaseUrlExplicit: body.config?.n8nBaseUrl ?? h['x-n8n-base-url'] ?? null,
    n8nApiKeyExplicit: body.config?.n8nApiKey ?? h['x-n8n-api-key'] ?? null,
    geminiApiKeyExplicit: body.config?.geminiApiKey ?? h['x-gemini-api-key'] ?? null,
    monthlyCapUsdExplicit: body.config?.monthlyCapUsd ?? null,

    n8nBaseUrl: process.env.N8N_BASE_URL ?? null,
    n8nApiKey: process.env.N8N_API_KEY ?? null,
    geminiApiKey: process.env.GEMINI_API_KEY ?? null,
    monthlyCapUsd: process.env.MONTHLY_USD_CAP ?? 8,
  };
}

export function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export function methodGuard(req, res, allowed) {
  if (allowed.includes(req.method)) return true;
  json(res, 405, { ok: false, error: `Use ${allowed.join(' or ')}.` });
  return false;
}

/** Body parsing, for runtimes that do not do it for us. */
export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}
