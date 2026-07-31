/**
 * Security headers, declared exactly once.
 *
 * They have to be applied in two places that Vercel treats independently:
 *
 *   - the CDN, via the `headers` block in vercel.json, which covers static
 *     assets and any path the function never sees
 *   - the function itself, via applySecurityHeaders(), which covers every
 *     /api/* response
 *
 * Two hand-maintained copies drift, and the drift is invisible: the page keeps
 * working and one half quietly stops being protected. So this file is the
 * source of truth and tests/headers.test.js fails the build if vercel.json
 * does not match it byte for byte.
 */

export const SECURITY_HEADERS = {
  // No inline script is used anywhere in the HUD — Vite emits external modules
  // — so script-src stays tight. style-src needs 'unsafe-inline' because React
  // sets a handful of computed inline styles (bar widths, sparkline paths).
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    // The HUD only ever talks to its own API. Selena's outbound calls happen
    // server-side, so the browser never needs to reach another origin.
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "object-src 'none'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  // Selena reads and writes. She has no use for any of this hardware, and
  // saying so explicitly is cheaper than explaining later why she could.
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
};

/** Applied to every function response, so /api/* is covered too. */
export function applySecurityHeaders(res) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
  return res;
}

/** The shape vercel.json needs. Generated, never typed twice. */
export function vercelHeaderEntries() {
  return Object.entries(SECURITY_HEADERS).map(([key, value]) => ({ key, value }));
}
