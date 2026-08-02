/**
 * Connected sources.
 *
 * The failure mode that matters here is not a crash. It is a connection that
 * looks fine, returns 200, and silently reads nothing — because the field map
 * pointed at the wrong key, or because the server speaks the other MCP
 * dialect. Every test below is a way that could happen quietly.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStore, resetMemorySingleton } from '../core/store.js';
import {
  readPath,
  mapItems,
  addConnector,
  listConnectors,
  getConnector,
  retireConnector,
  readConnector,
  testConnector,
  gatherFromConnectors,
  mcpListTools,
  mcpCallTool,
  payloadFromToolResult,
  MCP_VERSIONS,
} from '../core/connectors.js';

const SECRET = 'a-test-secret-that-is-long-enough';

function freshStore() {
  resetMemorySingleton();
  return createMemoryStore();
}

test('the path language reads what it says it reads', () => {
  const payload = { data: { items: [{ t: 'one', u: 'a' }, { t: 'two', u: 'b' }] }, single: { t: 'lone' } };

  assert.deepEqual(readPath(payload, 'data.items[].t'), ['one', 'two']);
  assert.equal(readPath(payload, 'single.t'), 'lone');
  assert.equal(readPath(payload, 'nothing.here'), undefined);
  assert.deepEqual(readPath(payload, 'data.items[].missing'), []);

  // A field the map calls a list but which is a single object: taken as a list
  // of one, because dropping it would mean silently reading nothing from a
  // source that answered perfectly well.
  assert.deepEqual(readPath({ items: { t: 'solo' } }, 'items[].t'), 'solo');

  // Nothing here may throw, whatever it is handed.
  for (const junk of [null, undefined, 42, 'string', [], {}]) {
    assert.doesNotThrow(() => readPath(junk, 'a.b[].c'));
  }
  assert.equal(readPath(payload, ''), undefined);
});

test('an item with no usable link is dropped, never kept with a placeholder', () => {
  const payload = {
    results: [
      { body: 'I need a booking tool for my barbershop', link: 'https://forum.example.com/t/1' },
      { body: 'this one has words but no link at all' },
      { body: 'this one has a link that is not a link', link: 'javascript:alert(1)' },
      { link: 'https://forum.example.com/t/4' },
    ],
  };

  const mapped = mapItems(payload, { itemsPath: 'results[]', textPath: 'body', urlPath: 'link' });

  assert.equal(mapped.asks.length, 1, 'only the complete one survives');
  assert.equal(mapped.asks[0].url, 'https://forum.example.com/t/1');
  assert.equal(mapped.missingUrl, 2, 'the no-link and the bad-link ones are counted, not hidden');
  assert.equal(mapped.seen, 4);

  // A javascript: URL must never make it into a citation.
  assert.ok(!mapped.asks.some((a) => /javascript:/i.test(a.url)));
});

test('alternative paths are tried in order until one yields', () => {
  const payload = { items: [{ selftext: '', title: 'the title', permalink: 'https://x.example.com/p' }] };
  const mapped = mapItems(payload, { itemsPath: 'items[]', textPath: 'body|selftext|title', urlPath: 'url|permalink' });
  assert.equal(mapped.asks.length, 1);
  assert.equal(mapped.asks[0].quote, 'the title', 'empty fields are skipped, not accepted');
  assert.equal(mapped.asks[0].url, 'https://x.example.com/p');
});

test('a source with a blocked host is refused even though you pasted it yourself', async () => {
  const store = freshStore();
  // The policy is the policy. Pasting a URL on a settings page does not change
  // what a platform's own terms say.
  const blocked = await addConnector(store, { kind: 'rest', name: 'reddit', url: 'https://www.reddit.com/search.json?q={query}' }, SECRET);
  assert.equal(blocked.ok, false);
  assert.match(blocked.error, /Refusing to fetch/);

  // Plain http would send the key in the clear.
  const insecure = await addConnector(store, { kind: 'rest', name: 'x', url: 'http://api.example.com/s?q={query}' }, SECRET);
  assert.equal(insecure.ok, false);
  assert.match(insecure.error, /https/);

  // An allowed host goes through.
  const fine = await addConnector(store, { kind: 'rest', name: 'ok', url: 'https://api.example.com/s?q={query}' }, SECRET);
  assert.equal(fine.ok, true);
});

test('the key is encrypted at rest and never returned to the browser', async () => {
  const store = freshStore();
  await addConnector(store, { kind: 'rest', name: 'keyed', url: 'https://api.example.com/s?q={query}', token: 'super-secret-key' }, SECRET);

  const raw = await store.getKv('connectors');
  assert.ok(raw[0].token, 'a token is stored');
  assert.ok(!String(raw[0].token).includes('super-secret-key'), 'and it is not stored in the clear');

  const listed = await listConnectors(store);
  assert.equal(listed[0].hasToken, true);
  assert.equal(listed[0].token, undefined, 'the list must never carry the key to the browser');

  const opened = await getConnector(store, listed[0].id, SECRET);
  assert.equal(opened.token, 'super-secret-key', 'and it decrypts with the right secret');

  const wrong = await getConnector(store, listed[0].id, 'a-different-secret-entirely');
  assert.equal(wrong.token, null, 'a changed secret must fail closed, not throw');
});

test('a REST source is read, and its posts land in the ledger', async () => {
  const store = freshStore();
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, headers: init.headers });
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ results: [{ body: 'still doing this on paper', link: 'https://forum.example.com/t/9' }] }),
    };
  };

  const added = await addConnector(
    store,
    { kind: 'rest', name: 'trade forum', url: 'https://forum.example.com/api?q={query}', token: 'k', authStyle: 'bearer', itemsPath: 'results[]', textPath: 'body', urlPath: 'link' },
    SECRET,
  );
  const connector = await getConnector(store, added.connector.id, SECRET);

  const read = [];
  const ledger = { read: (url) => read.push(url) };
  const outcome = await readConnector(connector, 'invoice chasing', { secret: SECRET, fetchImpl, ledger });

  assert.equal(outcome.ok, true);
  assert.equal(outcome.asks.length, 1);
  assert.equal(outcome.asks[0].source, 'trade forum');
  assert.deepEqual(read, ['https://forum.example.com/t/9'], 'what she read must be recorded, or claims citing it get deleted');

  // The term is substituted and encoded, and the key rides in the header.
  assert.equal(calls[0].url, 'https://forum.example.com/api?q=invoice%20chasing');
  assert.equal(calls[0].headers.authorization, 'Bearer k');
});

test('the four outcomes of a test are told apart', async () => {
  const store = freshStore();
  const make = async (over) => {
    const added = await addConnector(store, { kind: 'rest', name: 'x', url: 'https://api.example.com/s?q={query}', itemsPath: 'results[]', textPath: 'body', urlPath: 'link', ...over }, SECRET);
    return getConnector(store, added.connector.id, SECRET);
  };
  const answering = (status, body) => async () => ({ ok: status < 400, status, text: async () => body });

  const c = await make({});

  const refused = await testConnector(c, { secret: SECRET, fetchImpl: answering(401, 'bad key') });
  assert.equal(refused.ok, false);
  assert.match(refused.verdict, /refused the key/);

  const notJson = await testConnector(c, { secret: SECRET, fetchImpl: answering(200, '<html>hello</html>') });
  assert.equal(notJson.ok, false);
  assert.match(notJson.detail, /not with JSON/);

  const empty = await testConnector(c, { secret: SECRET, fetchImpl: answering(200, JSON.stringify({ results: [] })) });
  assert.equal(empty.ok, false);
  assert.match(empty.verdict, /no items/);

  // Answered fine, but the map points at nothing — the quiet failure this is
  // all here to catch.
  const mismatched = await testConnector(c, { secret: SECRET, fetchImpl: answering(200, JSON.stringify({ results: [{ wrongField: 'hi', href: 'https://a.example.com' }] })) });
  assert.equal(mismatched.ok, false);
  assert.match(mismatched.verdict, /field map found nothing/);

  const working = await testConnector(c, {
    secret: SECRET,
    fetchImpl: answering(200, JSON.stringify({ results: [{ body: 'I need a tool', link: 'https://a.example.com/1' }] })),
  });
  assert.equal(working.ok, true);
  assert.equal(working.sampled, 1);
  assert.equal(working.sample[0].url, 'https://a.example.com/1', 'the proof is the posts, not the status code');
});

test('MCP: the current stateless spec is spoken, with the headers it requires', async () => {
  const seen = [];
  const fetchImpl = async (url, init) => {
    seen.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    return {
      ok: true,
      status: 200,
      headers: { get: () => null },
      text: async () => JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'search', description: 'search posts', inputSchema: { properties: { q: {} } } }] } }),
    };
  };

  const listed = await mcpListTools('https://mcp.example.com/mcp', { fetchImpl });

  assert.equal(listed.ok, true);
  assert.equal(listed.dialect, 'stateless');
  assert.equal(listed.tools[0].name, 'search');
  assert.equal(seen.length, 1, 'the stateless dialect needs exactly one request — no handshake');
  assert.equal(seen[0].headers['MCP-Protocol-Version'], MCP_VERSIONS.stateless);
  assert.equal(seen[0].headers['Mcp-Method'], 'tools/list', 'the July 2026 revision requires this so gateways can route without parsing the body');
  assert.equal(seen[0].body.method, 'tools/list');
});

test('MCP: a server that still wants the old handshake is met where it is', async () => {
  const methods = [];
  const fetchImpl = async (url, init) => {
    const body = JSON.parse(init.body);
    methods.push(body.method);
    const headers = { get: (k) => (k.toLowerCase() === 'mcp-session-id' ? 'sess-1' : null) };

    // Refuses the stateless probe the way a session-based server does.
    if (body.method === 'tools/list' && init.headers['Mcp-Method']) {
      return { ok: false, status: 400, headers, text: async () => JSON.stringify({ jsonrpc: '2.0', error: { code: -32600, message: 'server not initialized' } }) };
    }
    if (body.method === 'initialize') {
      return { ok: true, status: 200, headers, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 1, result: { serverInfo: { name: 'old', version: '0.9' } } }) };
    }
    return { ok: true, status: 200, headers, text: async () => JSON.stringify({ jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'find', inputSchema: { properties: {} } }] } }) };
  };

  const listed = await mcpListTools('https://mcp.example.com/mcp', { fetchImpl });

  assert.equal(listed.ok, true, 'falling back is the whole point — half the servers out there are on this side of the break');
  assert.equal(listed.dialect, 'session');
  assert.equal(listed.serverInfo.name, 'old');
  assert.ok(methods.includes('initialize'), 'it must actually do the handshake');
  assert.equal(listed.sessionId, 'sess-1');
});

test('MCP: an answer arriving as a stream is read, not treated as garbage', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    headers: { get: (k) => (k.toLowerCase() === 'content-type' ? 'text/event-stream' : null) },
    text: async () => 'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"tools":[{"name":"s"}]}}\n\n',
  });

  const listed = await mcpListTools('https://mcp.example.com/mcp', { fetchImpl });
  assert.equal(listed.ok, true, 'both JSON and SSE are legal; understanding only one fails against half of them');
  assert.equal(listed.tools[0].name, 's');
});

test('MCP: a tool that ran and failed is not reported as success', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    headers: { get: () => null },
    text: async () => JSON.stringify({ jsonrpc: '2.0', id: 1, result: { isError: true, content: [{ type: 'text', text: 'rate limited' }] } }),
  });

  const called = await mcpCallTool('https://mcp.example.com/mcp', 'search', { query: 'x' }, { fetchImpl, dialect: 'stateless' });
  assert.equal(called.ok, false, 'HTTP 200 with isError is a failure, and reading it as success is exactly the trap');
  assert.match(called.detail, /rate limited/);
});

test('a tool result is unwrapped whether it is structured, JSON text, or prose', () => {
  assert.deepEqual(payloadFromToolResult({ structuredContent: { results: [1] } }), { results: [1] });
  assert.deepEqual(payloadFromToolResult({ content: [{ type: 'text', text: '{"results":[2]}' }] }), { results: [2] });
  assert.deepEqual(payloadFromToolResult({ content: [{ type: 'text', text: 'just words' }] }), { text: 'just words' });
  assert.equal(payloadFromToolResult({}), null);
});

test('one broken source does not stop the others being read', async () => {
  const store = freshStore();
  await addConnector(store, { kind: 'rest', name: 'good', url: 'https://good.example.com/s?q={query}', itemsPath: 'r[]', textPath: 'b', urlPath: 'u' }, SECRET);
  await addConnector(store, { kind: 'rest', name: 'broken', url: 'https://broken.example.com/s?q={query}', itemsPath: 'r[]', textPath: 'b', urlPath: 'u' }, SECRET);

  const fetchImpl = async (url) => {
    if (url.includes('broken')) throw new Error('connection reset');
    return { ok: true, status: 200, text: async () => JSON.stringify({ r: [{ b: 'a real ask', u: 'https://good.example.com/1' }] }) };
  };

  const out = await gatherFromConnectors(store, 'anything', { secret: SECRET, fetchImpl, gapMs: 0 });

  assert.equal(out.asks.length, 1, 'the working one still delivers');
  assert.equal(out.failures.length, 1);
  assert.equal(out.failures[0].name, 'broken');
  assert.equal(out.partial, true, 'and the run knows it was partial');
  assert.equal(out.read, 1);
});

test('a stored key survives the round trip to a real request, both ways in', async () => {
  // The bug this pins: a connector arrives either with its key still sealed
  // (straight from the store, in a sweep) or already decrypted (via
  // getConnector, when you press test). Guessing between them meant every
  // keyed source failed on one of the two paths while passing on the other.
  const store = freshStore();
  const sent = [];
  const fetchImpl = async (url, init) => {
    sent.push(init.headers.authorization);
    return { ok: true, status: 200, text: async () => JSON.stringify({ r: [{ b: 'an ask', u: 'https://a.example.com/1' }] }) };
  };

  const added = await addConnector(
    store,
    { kind: 'rest', name: 'keyed', url: 'https://a.example.com/s?q={query}', token: 'the-real-key', authStyle: 'bearer', itemsPath: 'r[]', textPath: 'b', urlPath: 'u' },
    SECRET,
  );

  // Path one: through the sweep, sealed.
  const swept = await gatherFromConnectors(store, 'x', { secret: SECRET, fetchImpl, gapMs: 0 });
  assert.equal(swept.asks.length, 1, 'the sweep path must decrypt the key and read');

  // Path two: through the test button, already decrypted.
  const opened = await getConnector(store, added.connector.id, SECRET);
  const tested = await testConnector(opened, { secret: SECRET, fetchImpl });
  assert.equal(tested.ok, true, 'the test-button path must not decrypt a second time');

  assert.deepEqual(sent, ['Bearer the-real-key', 'Bearer the-real-key'], 'and both must send the same real key');
});

test('a retired or paused source is not read, and is not destroyed either', async () => {
  const store = freshStore();
  const added = await addConnector(store, { kind: 'rest', name: 'one', url: 'https://a.example.com/s?q={query}' }, SECRET);
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return { ok: true, status: 200, text: async () => JSON.stringify({}) };
  };

  await retireConnector(store, added.connector.id);
  const out = await gatherFromConnectors(store, 'x', { secret: SECRET, fetchImpl, gapMs: 0 });
  assert.equal(calls, 0, 'a retired source must not be called');
  assert.equal(out.connected, 0);

  // Retired, not deleted. Nothing in this system is ever destroyed.
  const all = await store.getKv('connectors');
  assert.equal(all.length, 1);
  assert.ok(all[0].retiredAt);
  assert.equal((await listConnectors(store)).length, 0);
  assert.equal((await listConnectors(store, { includeRetired: true })).length, 1);
});

test('a POST source sends the body it was given, with the term safely escaped', async () => {
  // Found by probing rather than reasoned about: USAspending's award search is
  // POST-only and answers 405 to a GET, so a GET-only connector would silently
  // exclude every search API built that way.
  const store = freshStore();
  const sent = [];
  const fetchImpl = async (url, init) => {
    sent.push({ method: init.method, body: init.body, type: init.headers['content-type'] });
    return { ok: true, status: 200, text: async () => JSON.stringify({ results: [{ Description: 'HVAC replacement', id: 'X1' }] }) };
  };

  const added = await addConnector(
    store,
    {
      kind: 'rest',
      name: 'awards',
      url: 'https://api.usaspending.gov/api/v2/search/spending_by_award/',
      method: 'POST',
      bodyTemplate: '{"filters":{"keywords":["{query}"]}}',
      itemsPath: 'results[]',
      textPath: 'Description',
      urlTemplate: 'https://www.usaspending.gov/award/{id}',
    },
    SECRET,
  );
  const connector = await getConnector(store, added.connector.id, SECRET);

  const outcome = await readConnector(connector, 'air conditioning', { secret: SECRET, fetchImpl });
  assert.equal(outcome.ok, true);
  assert.equal(sent[0].method, 'POST');
  assert.equal(sent[0].type, 'application/json');
  assert.deepEqual(JSON.parse(sent[0].body), { filters: { keywords: ['air conditioning'] } });
  // canonicalUrl drops the www. so that two spellings of one page dedupe to a
  // single citation. The link still resolves; this pins the behaviour so a
  // future change to canonicalUrl cannot quietly alter stored citations.
  assert.equal(outcome.asks[0].url, 'https://usaspending.gov/award/X1', 'and the link is built from the id');

  // A term containing quotes must not produce a body that fails to parse.
  await readConnector(connector, 'say "no" \\ then', { secret: SECRET, fetchImpl });
  assert.doesNotThrow(() => JSON.parse(sent[1].body), 'the term has to be escaped into the template, not pasted into it');
  assert.equal(JSON.parse(sent[1].body).filters.keywords[0], 'say "no" \\ then');
});

test('a link template with a missing field yields no link rather than a broken one', () => {
  // A half-filled template looks like a citation and is not one, which is
  // worse than having no link at all.
  const mapped = mapItems(
    { r: [{ t: 'has both', slug: 'a', id: 1 }, { t: 'missing the id', slug: 'b' }] },
    { itemsPath: 'r[]', textPath: 't', urlTemplate: 'https://f.example.com/t/{slug}/{id}' },
  );
  assert.equal(mapped.asks.length, 1);
  assert.equal(mapped.asks[0].url, 'https://f.example.com/t/a/1');
  assert.equal(mapped.missingUrl, 1);
});
