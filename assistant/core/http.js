/**
 * Shared HTTP plumbing for the entry points.
 *
 * Every route file in api/ is a SINGLE path segment. A Vercel catch-all
 * function serves /api/x and 404s /api/x/y — the code never runs, and you find
 * out in production. tests/routes-single-segment.test.js fails the build if a
 * nested route is ever introduced.
 */

export function readConfig(req) {
  // Keys can come from the browser (pasted in Settings, held locally) or from
  // server env. Browser-supplied wins, so a caller can use their own instance
  // without redeploying.
  const body = req.body ?? {};
  const h = req.headers ?? {};
  return {
    n8nBaseUrl: body.config?.n8nBaseUrl ?? h['x-n8n-base-url'] ?? process.env.N8N_BASE_URL ?? null,
    n8nApiKey: body.config?.n8nApiKey ?? h['x-n8n-api-key'] ?? process.env.N8N_API_KEY ?? null,
    geminiApiKey: body.config?.geminiApiKey ?? h['x-gemini-api-key'] ?? process.env.GEMINI_API_KEY ?? null,
    monthlyCapUsd: body.config?.monthlyCapUsd ?? process.env.MONTHLY_USD_CAP ?? 8,
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
