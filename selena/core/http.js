/**
 * Shared HTTP plumbing.
 *
 * Every file in api/ is a SINGLE path segment. A Vercel function serves
 * /api/x and 404s /api/x/y — the code never runs and you find out in
 * production, because nothing local reproduces it.
 * tests/routes.test.js fails the build if a nested route is ever added.
 */

import { applySecurityHeaders } from './headers.js';

export function json(res, status, payload) {
  applySecurityHeaders(res);
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

/**
 * Always an ordinary object.
 *
 * `JSON.parse("null")` is null, and every route then reads `body.topic` off it
 * and throws — which in a serverless function is an unhandled 500 with a stack
 * trace instead of "I didn't understand that". Same for a bare array or
 * number. Rubbish in, empty object out.
 */
const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

export async function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try {
        return asObject(JSON.parse(req.body));
      } catch {
        return {};
      }
    }
    return asObject(req.body);
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return asObject(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch {
    return {};
  }
}

/** Wraps a handler so an unexpected throw is a truthful 500, not silence. */
export function guard(handler) {
  return async function wrapped(req, res) {
    try {
      await handler(req, res);
    } catch (err) {
      if (!res.headersSent) {
        json(res, 500, {
          ok: false,
          error: err?.message ?? String(err),
          kind: err?.name ?? 'Error',
          // Enough to act on without dumping the stack to a public endpoint.
          hint: 'This is an unhandled error inside Selena, not a bad request. The detail above is what actually threw.',
        });
      }
    }
  };
}
