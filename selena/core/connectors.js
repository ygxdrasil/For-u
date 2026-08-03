/**
 * Connectors: the sources YOU plug in.
 *
 * core/sources.js is the fixed policy — what she may read and what she may
 * not, decided in advance and enforced in code. This is the other half: a
 * place to paste an API you have a key for, or an MCP server, and have her
 * actually read it.
 *
 * Two kinds, because those are the two things that exist:
 *
 *   rest  a URL with {query} in it, an optional auth header, and a short map
 *         saying which fields in the response are the text and the link
 *   mcp   a Model Context Protocol server: she lists its tools, you pick one,
 *         and she calls it
 *
 * Three rules carried over from everything else here:
 *
 *   - A connection is not "working" because it returned 200. It is working
 *     when text and a URL came back. The test says which.
 *   - Credentials are encrypted at rest with the same secret that signs your
 *     sign-in. A database dump must not be a working key to somebody's API.
 *   - Whatever a connector returns is evidence like any other: it goes into
 *     the run's ledger, and a claim citing a URL she did not read is deleted.
 *     A pasted API does not get to bypass provenance.
 */

import { encryptToken, decryptToken } from './peers.js';
import { assertFetchAllowed } from './sources.js';
import { nowIso, randomId, clampNumber, canonicalUrl } from './util.js';

export const CONNECTORS_KEY = 'connectors';

/** Anything longer and it is a page, not a post. */
const MAX_QUOTE = 600;

export const CONNECTOR_KINDS = {
  rest: {
    label: 'An API (REST or JSON)',
    note:
      'A URL with {query} where the search term goes. She substitutes the term, GETs it, and reads the fields you name below. Works with anything that answers JSON.',
    example: 'https://api.example.com/v1/search?q={query}&limit=25',
  },
  mcp: {
    label: 'An MCP server',
    note:
      'A Model Context Protocol endpoint. She lists its tools, you say which one searches, and she calls it. Both the current spec and the older handshake are handled — she works out which the server speaks and remembers.',
    example: 'https://mcp.example.com/mcp',
  },
};

export const CONNECTOR_KIND_NAMES = Object.keys(CONNECTOR_KINDS);

// ---------------------------------------------------------------------------
// Reading a value out of an arbitrary response
// ---------------------------------------------------------------------------

/**
 * A deliberately small path language: dots for keys, [] for "every item".
 * "data.items[].title" is the whole vocabulary anyone needs here, and a real
 * JSONPath dependency for that would be weight with no payoff.
 */
export function readPath(value, path) {
  if (!path) return undefined;
  let current = [value];
  // Once a path has gone through a [], the answer is a list — including when
  // it is an empty one. Returning undefined for "the list existed and none of
  // them had this field" would make an empty result indistinguishable from a
  // typo in the path.
  let wentThroughList = false;
  for (const rawSegment of String(path).split('.')) {
    if (!rawSegment) continue;
    const isList = rawSegment.endsWith('[]');
    if (isList) wentThroughList = true;
    const key = isList ? rawSegment.slice(0, -2) : rawSegment;
    const next = [];
    for (const item of current) {
      if (item === null || item === undefined) continue;
      const got = key ? item[key] : item;
      if (got === undefined || got === null) continue;
      if (isList) {
        if (Array.isArray(got)) next.push(...got);
        // A field the map says is a list but is not: take it as a list of one
        // rather than dropping it, because the alternative is silently
        // reading nothing from a source that answered perfectly well.
        else next.push(got);
      } else {
        next.push(got);
      }
    }
    current = next;
    if (!current.length) return wentThroughList ? [] : undefined;
  }
  return current.length === 1 ? current[0] : current;
}

/**
 * A URL fit to show a human and write into an error.
 *
 * A key can ride in a query string, and this string ends up on screen, in the
 * activity feed and in a GitHub Actions log. The value of anything that looks
 * like a credential is replaced rather than trusted to be absent.
 */
export function safeUrl(url) {
  try {
    const u = new URL(url);
    for (const key of [...u.searchParams.keys()]) {
      if (/key|token|secret|auth|password|sig/i.test(key)) u.searchParams.set(key, '…');
    }
    return u.toString();
  } catch {
    return String(url).slice(0, 200);
  }
}

/** The first path that actually yields something, so a map can offer alternatives. */
function firstOf(item, paths) {
  for (const path of String(paths ?? '').split('|').map((p) => p.trim()).filter(Boolean)) {
    const got = readPath(item, path);
    if (typeof got === 'string' && got.trim()) return got.trim();
    if (typeof got === 'number') return String(got);
    if (Array.isArray(got) && got.length && typeof got[0] === 'string') return got[0].trim();
  }
  return null;
}

/**
 * Turn whatever came back into the same shape everything else produces.
 *
 * An item with no URL is dropped rather than kept with a placeholder. The
 * whole system rests on every claim carrying a source, and an ask with no link
 * is an ask that cannot be cited — so it is not evidence, it is noise.
 */
/**
 * Build a link out of fields when the source does not hand you one.
 *
 * This is not a nicety. Probing the real APIs found that Discourse returns a
 * slug and an id but no URL, and a procurement award returns an internal id —
 * both answer 200 with fifty perfectly good items and produce zero citable
 * asks. Without this, the two best sources in the catalogue read as broken.
 *
 * "https://forum.example.com/t/{slug}/{id}" with an item is all it does.
 */
export function fillTemplate(template, item) {
  let missing = false;
  const filled = String(template).replace(/\{([\w.[\]]+)\}/g, (_, path) => {
    const value = readPath(item, path);
    const flat = Array.isArray(value) ? value[0] : value;
    if (flat === undefined || flat === null || flat === '') {
      missing = true;
      return '';
    }
    return String(flat);
  });
  // A template with a hole in it produces a broken link, and a broken link is
  // worse than no link: it looks like a citation and is not one.
  return missing ? null : filled;
}

export function mapItems(payload, map, { source = 'connector', at = nowIso() } = {}) {
  const list = map.itemsPath ? readPath(payload, map.itemsPath) : payload;
  const items = Array.isArray(list) ? list : list ? [list] : [];
  const asks = [];
  let missingUrl = 0;

  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const text = firstOf(item, map.textPath);
    // A template wins when set: it is only ever set because the source does
    // not give a usable link on its own.
    const url = map.urlTemplate ? fillTemplate(map.urlTemplate, item) : firstOf(item, map.urlPath);
    if (!text) continue;
    if (!url) {
      missingUrl += 1;
      continue;
    }
    const canonical = canonicalUrl(url);
    if (!canonical || !/^https?:/i.test(canonical)) {
      missingUrl += 1;
      continue;
    }
    asks.push({
      source,
      url: canonical,
      quote: text.slice(0, MAX_QUOTE),
      title: (firstOf(item, map.titlePath) ?? text).slice(0, 200),
      at: firstOf(item, map.datePath) ?? at,
      via: 'connector',
      weight: clampNumber(Number(firstOf(item, map.weightPath)), -1e6, 1e6, 0),
      // Optional. Most sources give a display name at best, and a review feed
      // gives one with no route to the person behind it — which core/reach.js
      // reports honestly as "named, but not contactable" rather than pretending
      // a name is a way to reach someone.
      author: (() => {
        const handle = map.authorPath ? firstOf(item, map.authorPath) : null;
        if (!handle) return null;
        const profile = map.authorUrlTemplate ? fillTemplate(map.authorUrlTemplate, item) : null;
        return { handle: String(handle).slice(0, 80), profile: profile ? String(profile).slice(0, 300) : null };
      })(),
    });
  }

  return { asks, missingUrl, seen: items.length };
}

// ---------------------------------------------------------------------------
// MCP, both dialects
// ---------------------------------------------------------------------------

/**
 * The July 2026 revision removed the initialize handshake and the session id,
 * and requires MCP-Protocol-Version and Mcp-Method headers on every request.
 * It is a breaking change, so servers in the wild are on both sides of it.
 *
 * Rather than making you know which your server speaks, she tries the newer
 * stateless shape first — one request — and falls back to the handshake when
 * the server says it needs one. Whichever worked is remembered, so the probe
 * is paid once and not on every run.
 */
export const MCP_VERSIONS = { stateless: '2026-07-28', session: '2025-06-18' };

function mcpHeaders({ dialect, method, name = null, token, sessionId = null }) {
  const headers = {
    'content-type': 'application/json',
    // Servers may stream; both are accepted so neither dialect 406s.
    accept: 'application/json, text/event-stream',
  };
  if (token) headers.authorization = `Bearer ${token}`;
  if (dialect === 'stateless') {
    headers['MCP-Protocol-Version'] = MCP_VERSIONS.stateless;
    headers['Mcp-Method'] = method;
    if (name) headers['Mcp-Name'] = name;
  } else {
    headers['MCP-Protocol-Version'] = MCP_VERSIONS.session;
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
  }
  return headers;
}

/**
 * A response may be JSON or an SSE stream carrying JSON in `data:` lines. Both
 * are legal, and a client that only understands one silently fails against
 * half the servers out there.
 */
async function readRpc(res) {
  const text = await res.text();
  const type = res.headers?.get?.('content-type') ?? '';
  if (type.includes('text/event-stream') || text.startsWith('event:') || text.startsWith('data:')) {
    for (const line of text.split('\n')) {
      if (!line.startsWith('data:')) continue;
      try {
        const parsed = JSON.parse(line.slice(5).trim());
        if (parsed.result || parsed.error) return { parsed, raw: text };
      } catch {
        // Keep looking: a stream can carry keep-alives and progress notices
        // before the answer.
      }
    }
    return { parsed: null, raw: text };
  }
  try {
    return { parsed: JSON.parse(text), raw: text };
  } catch {
    return { parsed: null, raw: text };
  }
}

let rpcId = 0;

async function mcpCall(url, { dialect, method, name = null, params = {}, token, sessionId = null, fetchImpl, timeoutMs = 20_000 }) {
  rpcId += 1;
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: mcpHeaders({ dialect, method, name, token, sessionId }),
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: rpcId,
      method,
      params: dialect === 'stateless' ? { ...params, _meta: { 'io.modelcontextprotocol/client': { name: 'selena', version: '1' } } } : params,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const { parsed, raw } = await readRpc(res);
  return { status: res.status, ok: res.ok, parsed, raw, sessionId: res.headers?.get?.('mcp-session-id') ?? sessionId };
}

/** Open a session the old way. Only used when the stateless probe was refused. */
async function mcpHandshake(url, { token, fetchImpl, timeoutMs }) {
  const init = await mcpCall(url, {
    dialect: 'session',
    method: 'initialize',
    params: {
      protocolVersion: MCP_VERSIONS.session,
      capabilities: {},
      clientInfo: { name: 'selena', version: '1' },
    },
    token,
    fetchImpl,
    timeoutMs,
  });
  if (!init.parsed?.result) return { ok: false, detail: init.parsed?.error?.message ?? init.raw?.slice(0, 300) ?? `HTTP ${init.status}` };

  // The notification is fire-and-forget; a server that ignores it is fine, and
  // a failure here must not sink an otherwise working session.
  try {
    await mcpCall(url, { dialect: 'session', method: 'notifications/initialized', params: {}, token, sessionId: init.sessionId, fetchImpl, timeoutMs: 6_000 });
  } catch {
    /* not fatal */
  }
  return { ok: true, sessionId: init.sessionId, serverInfo: init.parsed.result.serverInfo ?? null };
}

/**
 * List what a server can do, working out its dialect on the way.
 *
 * @returns {{ok, tools, dialect, sessionId, serverInfo, detail, status}}
 */
export async function mcpListTools(url, { token = null, fetchImpl = globalThis.fetch, timeoutMs = 20_000, dialect = null } = {}) {
  const order = dialect ? [dialect] : ['stateless', 'session'];
  let last = null;

  for (const attempt of order) {
    try {
      if (attempt === 'session') {
        const opened = await mcpHandshake(url, { token, fetchImpl, timeoutMs });
        if (!opened.ok) {
          last = { ok: false, detail: `the handshake was refused: ${opened.detail}` };
          continue;
        }
        const listed = await mcpCall(url, { dialect: 'session', method: 'tools/list', params: {}, token, sessionId: opened.sessionId, fetchImpl, timeoutMs });
        const tools = listed.parsed?.result?.tools;
        if (Array.isArray(tools)) return { ok: true, tools, dialect: 'session', sessionId: opened.sessionId, serverInfo: opened.serverInfo, status: listed.status };
        last = { ok: false, status: listed.status, detail: listed.parsed?.error?.message ?? listed.raw?.slice(0, 300) ?? 'no tools came back' };
        continue;
      }

      const listed = await mcpCall(url, { dialect: 'stateless', method: 'tools/list', params: {}, token, fetchImpl, timeoutMs });
      const tools = listed.parsed?.result?.tools;
      if (Array.isArray(tools)) return { ok: true, tools, dialect: 'stateless', sessionId: null, serverInfo: null, status: listed.status };
      last = { ok: false, status: listed.status, detail: listed.parsed?.error?.message ?? listed.raw?.slice(0, 300) ?? `HTTP ${listed.status}` };
    } catch (err) {
      last = { ok: false, detail: err.name === 'TimeoutError' ? `no answer within ${Math.round(timeoutMs / 1000)}s` : err.message };
    }
  }

  return { ok: false, tools: [], dialect: null, ...last };
}

/** Call one tool and hand back whatever it returned, unshaped. */
export async function mcpCallTool(url, toolName, args, { token = null, fetchImpl = globalThis.fetch, timeoutMs = 25_000, dialect = null } = {}) {
  let use = dialect;
  let sessionId = null;

  if (!use || use === 'session') {
    if (use === 'session') {
      const opened = await mcpHandshake(url, { token, fetchImpl, timeoutMs });
      if (!opened.ok) return { ok: false, detail: opened.detail };
      sessionId = opened.sessionId;
    } else {
      const probe = await mcpListTools(url, { token, fetchImpl, timeoutMs });
      if (!probe.ok) return { ok: false, detail: probe.detail };
      use = probe.dialect;
      sessionId = probe.sessionId;
    }
  }

  const called = await mcpCall(url, {
    dialect: use,
    method: 'tools/call',
    name: toolName,
    params: { name: toolName, arguments: args ?? {} },
    token,
    sessionId,
    fetchImpl,
    timeoutMs,
  });

  const result = called.parsed?.result;
  if (!result) {
    return { ok: false, status: called.status, detail: called.parsed?.error?.message ?? called.raw?.slice(0, 300) ?? `HTTP ${called.status}` };
  }
  // isError is the protocol's own way of saying "the tool ran and failed",
  // which is not the same as the call failing and must not read as success.
  if (result.isError) return { ok: false, status: called.status, detail: flattenContent(result).slice(0, 400), toolFailed: true };

  return { ok: true, status: called.status, result, dialect: use };
}

/**
 * MCP tools answer with a content array, and increasingly with structured
 * content beside it. Prefer the structured form — it is already objects — and
 * fall back to parsing JSON out of the text, then to the text itself.
 */
export function flattenContent(result) {
  const parts = Array.isArray(result?.content) ? result.content : [];
  return parts
    .map((c) => (typeof c === 'string' ? c : c?.text ?? ''))
    .filter(Boolean)
    .join('\n');
}

export function payloadFromToolResult(result) {
  if (result?.structuredContent && typeof result.structuredContent === 'object') return result.structuredContent;
  const text = flattenContent(result);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    // Not JSON. Hand back the text as a single item so a map can still name a
    // field on it, rather than reporting nothing from a server that answered.
    return { text };
  }
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

function publicView(c) {
  const { token, ...rest } = c;
  return { ...rest, hasToken: Boolean(token) };
}

export async function listConnectors(store, { includeRetired = false } = {}) {
  const all = (await store.getKv(CONNECTORS_KEY)) ?? [];
  return all.filter((c) => c && (includeRetired || !c.retiredAt)).map(publicView);
}

export async function getConnector(store, id, secret) {
  const all = (await store.getKv(CONNECTORS_KEY)) ?? [];
  const found = all.find((c) => c?.id === id && !c.retiredAt);
  if (!found) return null;
  // Decrypted here, so `sealed: false` — readConnector must not try to decrypt
  // it a second time.
  return { ...found, token: found.token ? decryptToken(found.token, secret) : null, sealed: false };
}

export async function addConnector(store, input, secret) {
  const all = (await store.getKv(CONNECTORS_KEY)) ?? [];
  const kind = CONNECTOR_KIND_NAMES.includes(input.kind) ? input.kind : 'rest';
  const url = String(input.url ?? '').trim();
  if (!/^https:\/\//i.test(url)) {
    // Plain http would send the key you just pasted in the clear.
    return { ok: false, error: 'The URL has to start with https:// — anything else sends the key you just pasted across the network in the clear.' };
  }

  // A pasted connection does not get to bypass the source policy. The blocked
  // hosts are blocked because their own terms forbid this, and that does not
  // stop being true because the request came from a box on a settings page.
  // The API hostnames are not on that list, so a real key still works: it is
  // etsy.com that is refused, not api.etsy.com.
  try {
    assertFetchAllowed(url);
  } catch (err) {
    return { ok: false, error: err.message };
  }

  const connector = {
    id: randomId('conn'),
    kind,
    name: String(input.name ?? '').slice(0, 80) || new URL(url).hostname,
    url,
    // Held encrypted, and only ever decrypted in the moment a request is made.
    token: input.token ? encryptToken(String(input.token), secret) : null,
    authStyle: ['bearer', 'header', 'query', 'none'].includes(input.authStyle) ? input.authStyle : input.token ? 'bearer' : 'none',
    authName: String(input.authName ?? '').slice(0, 60) || null,
    tool: String(input.tool ?? '').slice(0, 120) || null,
    queryArg: String(input.queryArg ?? '').slice(0, 60) || 'query',
    // Probing the real APIs found this is not optional: USAspending's search
    // is POST-only and answers 405 to a GET. A connector that could only GET
    // would quietly exclude every search API built that way.
    method: String(input.method ?? '').toUpperCase() === 'POST' ? 'POST' : 'GET',
    // A review feed names one app and always returns its most recent reviews.
    // It is a standing corpus, not a search, so no term is bolted onto it and
    // the HUD can say what it actually does instead of implying it looks for
    // your topic.
    searchable: input.searchable !== false,
    testQuery: input.testQuery ?? null,
    starterId: input.starterId ?? null,
    bodyTemplate: String(input.bodyTemplate ?? '').slice(0, 2000) || null,
    map: {
      itemsPath: String(input.itemsPath ?? '').slice(0, 200) || null,
      textPath: String(input.textPath ?? '').slice(0, 200) || 'text|body|description|content|selftext|title',
      urlPath: String(input.urlPath ?? '').slice(0, 200) || 'url|link|permalink|html_url|webUrl',
      // For sources that answer with an id or a slug instead of a link — which,
      // on the evidence of probing the real ones, is most of them.
      urlTemplate: String(input.urlTemplate ?? '').slice(0, 300) || null,
      titlePath: String(input.titlePath ?? '').slice(0, 200) || 'title|name|subject',
      datePath: String(input.datePath ?? '').slice(0, 200) || null,
      weightPath: String(input.weightPath ?? '').slice(0, 200) || null,
      // Who posted it, where the source says. Not defaulted to a guess list
      // the way textPath is: a wrong author is worse than no author, because
      // it puts a real person's name against words they did not write.
      authorPath: String(input.authorPath ?? '').slice(0, 200) || null,
      authorUrlTemplate: String(input.authorUrlTemplate ?? '').slice(0, 300) || null,
    },
    // What it gives, in the ladder's terms. She has to know whether this is
    // people asking or people paying, or the ladder means nothing.
    gives: Array.isArray(input.gives) && input.gives.length ? input.gives.filter((g) => ['asks', 'complaints', 'paying', 'incumbents'].includes(g)) : ['asks'],
    enabled: input.enabled !== false,
    dialect: null,
    addedAt: nowIso(),
    lastTestedAt: null,
    lastResult: null,
    lastUsedAt: null,
    useCount: 0,
    retiredAt: null,
  };

  await store.setKv(CONNECTORS_KEY, [...all, connector]);
  return { ok: true, connector: publicView(connector) };
}

/** Patch one in place. Never destroys: retiring sets a date, it does not remove. */
export async function updateConnector(store, id, patch, secret = null) {
  const all = (await store.getKv(CONNECTORS_KEY)) ?? [];
  let updated = null;
  const next = all.map((c) => {
    if (c?.id !== id) return c;
    updated = {
      ...c,
      ...patch,
      // A token in a patch is plaintext and must be sealed before it lands.
      token: patch.token === undefined ? c.token : patch.token ? encryptToken(String(patch.token), secret) : null,
      map: patch.map ? { ...c.map, ...patch.map } : c.map,
    };
    return updated;
  });
  if (!updated) return { ok: false, error: 'no such connection' };
  await store.setKv(CONNECTORS_KEY, next);
  return { ok: true, connector: publicView(updated) };
}

export async function retireConnector(store, id) {
  return updateConnector(store, id, { retiredAt: nowIso(), enabled: false });
}

// ---------------------------------------------------------------------------
// Using one
// ---------------------------------------------------------------------------

function restUrlFor(connector, query, token) {
  const encoded = encodeURIComponent(query);
  let url;
  if (connector.url.includes('{query}')) {
    url = connector.url.replaceAll('{query}', encoded);
  } else if (connector.searchable === false) {
    // Nothing to substitute and nothing to append: the URL is the whole query.
    url = connector.url;
  } else if (connector.method === 'POST') {
    // The term goes in the body for a POST. Bolting ?q= on as well sends the
    // search twice, in two places, and some APIs reject an unknown parameter
    // outright — a request that fails for a reason nothing on screen explains.
    url = connector.url;
  } else {
    url = `${connector.url}${connector.url.includes('?') ? '&' : '?'}q=${encoded}`;
  }
  if (token && connector.authStyle === 'query') {
    const param = connector.authName || 'api_key';
    url += `${url.includes('?') ? '&' : '?'}${param}=${encodeURIComponent(token)}`;
  }
  return url;
}

/**
 * Read one connector for one search term.
 *
 * Never throws. A connection that has stopped working must degrade to "this
 * one did not answer" alongside everything that did, not take the run down.
 */
export async function readConnector(connector, query, { secret, fetchImpl = globalThis.fetch, timeoutMs = 20_000, ledger = null } = {}) {
  // A connector arrives here in one of two states, and guessing between them
  // was a real bug: getConnector hands back a decrypted token, gatherFrom-
  // Connectors reads straight from the store and hands back a sealed one. The
  // `sealed` flag says which, and is set by whoever built the object rather
  // than inferred from the shape of the string.
  const token = connector.token ? (connector.sealed === false ? connector.token : decryptToken(connector.token, secret)) : null;
  if (connector.token && !token) {
    return { ok: false, asks: [], detail: 'its key could not be decrypted — SESSION_SECRET has changed since it was saved, so paste the key again' };
  }

  try {
    // Checked again at read time, not only at add time: the policy table can
    // gain a host after a connection was saved, and the newer answer wins.
    assertFetchAllowed(connector.url);

    if (connector.kind === 'mcp') {
      const called = await mcpCallTool(connector.url, connector.tool, { [connector.queryArg || 'query']: query }, {
        token,
        fetchImpl,
        timeoutMs,
        dialect: connector.dialect,
      });
      if (!called.ok) {
        return { ok: false, asks: [], status: called.status, requested: safeUrl(connector.url), detail: `${safeUrl(connector.url)} (tool "${connector.tool}"): ${called.detail}` };
      }
      const payload = payloadFromToolResult(called.result);
      const mapped = mapItems(payload, connector.map, { source: connector.name });
      // record(), not read(). The real ledger has no read() — a test double
      // that accepted one meant every connected source threw in a live run
      // while passing every test. The same class of bug as the database driver
      // that only failed on first contact with a real connection.
      if (ledger) for (const a of mapped.asks) ledger.record({ url: a.url, status: 200, via: 'direct-fetch', title: a.title, domain: null });
      return { ok: true, asks: mapped.asks, seen: mapped.seen, missingUrl: mapped.missingUrl, dialect: called.dialect };
    }

    const headers = { accept: 'application/json' };
    if (token && connector.authStyle === 'bearer') headers.authorization = `Bearer ${token}`;
    if (token && connector.authStyle === 'header') headers[connector.authName || 'x-api-key'] = token;

    const post = connector.method === 'POST';
    let body = null;
    if (post) {
      headers['content-type'] = 'application/json';
      // JSON.stringify on the term first, then strip its quotes: that escapes
      // quotes and backslashes properly, so a search for `say "no"` produces
      // valid JSON instead of a body that fails to parse at the far end.
      const escaped = JSON.stringify(String(query)).slice(1, -1);
      body = connector.bodyTemplate ? connector.bodyTemplate.replaceAll('{query}', escaped) : JSON.stringify({ query });
    }

    const requested = restUrlFor(connector, query, token);
    const res = await fetchImpl(requested, {
      method: post ? 'POST' : 'GET',
      headers,
      ...(body ? { body } : {}),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await res.text();
    if (!res.ok) {
      // Say what was ASKED FOR, not just what came back. A bare "HTTP 404" and
      // a server's own error page tells you a source is broken and nothing
      // about why; the method and URL usually make it obvious in one glance —
      // wrong path, wrong host, a placeholder never filled in. Never guess
      // twice: instrument.
      return {
        ok: false,
        asks: [],
        status: res.status,
        requested: safeUrl(requested),
        detail: `${post ? 'POST' : 'GET'} ${safeUrl(requested)} answered HTTP ${res.status}: ${text.slice(0, 200)}`,
      };
    }
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      return {
        ok: false,
        asks: [],
        status: res.status,
        requested: safeUrl(requested),
        detail: `${safeUrl(requested)} answered ${res.status}, but not with JSON. First 200 characters: ${text.slice(0, 200)}`,
      };
    }
    const mapped = mapItems(payload, connector.map, { source: connector.name });
    if (ledger) for (const a of mapped.asks) ledger.record({ url: a.url, status: 200, via: 'direct-fetch', title: a.title, domain: null });
    return { ok: true, asks: mapped.asks, seen: mapped.seen, missingUrl: mapped.missingUrl, status: res.status };
  } catch (err) {
    return { ok: false, asks: [], detail: err.name === 'TimeoutError' ? `no answer within ${Math.round(timeoutMs / 1000)}s` : err.message };
  }
}

/**
 * Test one, and say what actually happened in words.
 *
 * The four outcomes are kept apart deliberately, because "it worked",
 * "it answered but gave nothing usable", "it refused you" and "it did not
 * answer" need four different things doing about them.
 */
export async function testConnector(connector, { secret, fetchImpl = globalThis.fetch, query = null, timeoutMs = 20_000 } = {}) {
  // The source's own term wins when it has one: a database of public
  // contracts genuinely has nothing matching "is there a tool that", and
  // reporting that truthfully still looks exactly like a broken connection.
  const term = query ?? connector.testQuery ?? 'is there a tool that';
  const outcome = await readConnector(connector, term, { secret, fetchImpl, timeoutMs });

  if (!outcome.ok) {
    const refused = outcome.status === 401 || outcome.status === 403;
    return {
      ok: false,
      verdict: refused ? 'it refused the key' : outcome.status ? `it answered ${outcome.status}, not with results` : 'no usable answer',
      detail: outcome.detail,
      status: outcome.status ?? null,
      sampled: 0,
      testedAt: nowIso(),
    };
  }

  if (!outcome.asks.length) {
    return {
      ok: false,
      verdict: outcome.seen ? 'it answered, but the field map found nothing in it' : 'it answered with no items',
      detail: outcome.seen
        ? `${outcome.seen} item(s) came back and none produced both text and a link${outcome.missingUrl ? `; ${outcome.missingUrl} had text but no usable URL` : ''}. Check the paths — an ask with no link cannot be cited, so it is not kept.`
        : `Nothing came back for "${term}". It may simply have no results for that term rather than being broken — try again with one you know is there.`,
      status: outcome.status ?? null,
      sampled: 0,
      testedAt: nowIso(),
    };
  }

  return {
    ok: true,
    verdict: `working — ${outcome.asks.length} usable post(s)`,
    detail: `${outcome.seen} item(s) came back, ${outcome.asks.length} had both text and a link.${outcome.missingUrl ? ` ${outcome.missingUrl} were dropped for having no usable URL.` : ''}`,
    status: outcome.status ?? null,
    sampled: outcome.asks.length,
    dialect: outcome.dialect ?? null,
    sample: outcome.asks.slice(0, 3).map((a) => ({ quote: a.quote.slice(0, 200), url: a.url })),
    testedAt: nowIso(),
  };
}

/**
 * Every enabled connector, read one after another for one term.
 *
 * Sequential rather than parallel: these are other people's APIs, several of
 * them are rate-limited by the minute, and a burst of eight simultaneous
 * requests is the thing that gets a key suspended.
 */
export async function gatherFromConnectors(store, query, { secret, fetchImpl = globalThis.fetch, ledger = null, deadline = null, gapMs = 300, limit = 12, timeoutMs = 20_000 } = {}) {
  const all = (await store.getKv(CONNECTORS_KEY)) ?? [];
  const enabled = all.filter((c) => c && !c.retiredAt && c.enabled !== false);
  const live = enabled.slice(0, limit);

  const asks = [];
  const failures = [];
  let attempted = 0;

  // Never a silent cap. Connecting eleven sources and having six read is a
  // finding that rests on less than you think it does, and the only honest
  // version of that is saying which ones were left out.
  const truncated = enabled.length - live.length;
  const notices = [];
  if (truncated > 0) {
    notices.push({
      name: `${truncated} more connected source(s)`,
      detail: `not read this run: the per-run ceiling is ${limit}. Pause the ones you care about least, or raise the ceiling.`,
      skipped: true,
    });
  }

  /**
   * By host, in parallel; within a host, one at a time with a gap.
   *
   * Nine sources read strictly one after another measured 17.9 seconds — a
   * third of a serverless function's whole budget spent waiting on other
   * people's servers, and enough that later sources were being cut off by the
   * deadline rather than read. They are nine DIFFERENT hosts, so waiting for
   * each before starting the next buys politeness nobody asked for.
   *
   * Two hosts are never hit at once from this loop, which is the part that
   * actually matters: the gap exists so one server is not hammered, not so
   * the run is slow.
   */
  const byHost = new Map();
  for (const connector of live) {
    let host;
    try {
      host = new URL(connector.url).host;
    } catch {
      host = connector.id;
    }
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(connector);
  }

  const results = await Promise.all(
    [...byHost.values()].map(async (group) => {
      const out = { asks: [], failures: [], attempted: 0 };
      for (const connector of group) {
        if (deadline?.tooLateFor(6_000)) {
          out.failures.push({ name: connector.name, detail: 'skipped — not enough time left in this run', skipped: true });
          continue;
        }
        out.attempted += 1;
        // Straight from the store, so the token is still sealed.
        const outcome = await readConnector({ ...connector, sealed: true }, query, { secret, fetchImpl, ledger, timeoutMs });
        if (outcome.ok) out.asks.push(...outcome.asks);
        else out.failures.push({ name: connector.name, detail: outcome.detail, status: outcome.status ?? null });
        // Only worth waiting when this host has another request coming.
        if (gapMs && group.length > 1) await new Promise((r) => setTimeout(r, gapMs));
      }
      return out;
    }),
  );

  for (const r of results) {
    asks.push(...r.asks);
    // A source skipped for lack of time has not failed either; it belongs with
    // the notices so "read 6 of 9" does not read as six broken sources.
    for (const f of r.failures) (f.skipped ? notices : failures).push(f);
    attempted += r.attempted;
  }

  // `failures` are sources that were asked and did not answer. `notices` are
  // things you should know that are not failures — a source never asked
  // because of the ceiling has not failed at anything. Keeping them apart is
  // what stops "read 6 of 9" turning into "3 sources are broken".
  return {
    asks,
    failures: [...failures, ...notices],
    partial: failures.length > 0 || notices.length > 0,
    attempted,
    read: attempted - failures.length,
    connected: enabled.length,
    truncated,
  };
}
