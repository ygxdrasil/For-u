/**
 * The HUD's only way to talk to the server.
 *
 * One place, so the token handling and the error shape are the same
 * everywhere. Every call returns { ok, data, error } rather than throwing:
 * a panel that fails should say so in its own corner, not blank the page.
 */

const TOKEN_KEY = 'selena.token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setToken(value) {
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Private browsing and locked-down storage both throw here. Losing the
    // token is survivable; throwing on a keystroke is not.
  }
}

async function call(path, { method = 'GET', body = null, signal = null, token = null } = {}) {
  const headers = {};
  // The session cookie is the normal way in and is sent automatically. A
  // bearer token is only used if one was deliberately stored — it exists for
  // people driving the API by hand, not for the HUD.
  const bearer = token ?? getToken();
  if (bearer) headers.authorization = `Bearer ${bearer}`;
  if (body) headers['content-type'] = 'application/json';

  try {
    // same-origin credentials are the default, but say so: the whole sign-in
    // design rests on this cookie being sent.
    const res = await fetch(path, { method, headers, credentials: 'same-origin', body: body ? JSON.stringify(body) : null, signal });
    const text = await res.text();

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // An HTML error page from the platform, not from us. Say which.
      return {
        ok: false,
        status: res.status,
        error: `The server returned ${res.status} with something that is not JSON. That usually means the function did not run at all — check the route is a single path segment and that the deploy succeeded.`,
        raw: text.slice(0, 300),
      };
    }

    if (!res.ok) return { ok: false, status: res.status, error: data?.error ?? `HTTP ${res.status}`, data };
    return { ok: true, status: res.status, data };
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, aborted: true, error: 'cancelled' };
    return { ok: false, error: `Could not reach the server: ${err.message}` };
  }
}

export const api = {
  health: () => call('/api/health'),

  authStatus: () => call('/api/auth'),
  authSetup: ({ password, token }) => call('/api/auth', { method: 'POST', body: { action: 'setup', password }, token }),
  authLogin: ({ password }) => call('/api/auth', { method: 'POST', body: { action: 'login', password } }),
  authLogout: () => call('/api/auth', { method: 'POST', body: { action: 'logout' } }),
  authChange: ({ currentPassword, newPassword }) =>
    call('/api/auth', { method: 'POST', body: { action: 'change', currentPassword, newPassword } }),

  dashboard: (signal) => call('/api/dashboard', { signal }),

  findings: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== null && v !== '' && v !== undefined));
    return call(`/api/findings${q.toString() ? `?${q}` : ''}`);
  },
  finding: (id) => call(`/api/findings?id=${encodeURIComponent(id)}`),
  findingAction: (action, payload) => call('/api/findings', { method: 'POST', body: { action, ...payload } }),

  watches: () => call('/api/watches'),
  watchAction: (action, payload) => call('/api/watches', { method: 'POST', body: { action, ...payload } }),

  research: (payload) => call('/api/research', { method: 'POST', body: payload }),
  ask: (payload) => call('/api/ask', { method: 'POST', body: payload }),

  handoffPreview: (id) => call(`/api/handoff?id=${encodeURIComponent(id)}`),
  handoff: (payload) => call('/api/handoff', { method: 'POST', body: payload }),

  cronStatus: () => call('/api/cron'),
  cronRun: (payload = {}) => call('/api/cron', { method: 'POST', body: payload }),

  tokens: () => call('/api/tokens'),
  tokenAction: (action, payload = {}) => call('/api/tokens', { method: 'POST', body: { action, ...payload } }),
};

export function money(usd, dp = 4) {
  const n = Number(usd);
  return Number.isFinite(n) ? `$${n.toFixed(dp)}` : '—';
}

export function ago(iso) {
  const t = Date.parse(iso ?? '');
  if (!Number.isFinite(t)) return 'never';
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function clock(iso) {
  const t = Date.parse(iso ?? '');
  if (!Number.isFinite(t)) return '--:--';
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
