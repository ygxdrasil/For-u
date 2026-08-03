/**
 * The guard on reading the open web.
 *
 * A URL-fetching tool running on a server that holds an n8n API key is a way
 * to read things only that server can reach. Cloud metadata at 169.254.169.254
 * hands out credentials to anything that asks; a private address reaches
 * whatever is behind the firewall. And the instruction to fetch one can arrive
 * inside a page he is reading or a workflow someone else wrote, so "he would
 * not do that" is not a control.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { assertPublicUrl, fetchPublicUrl, readableText, BlockedUrlError } from '../core/web.js';

/** A resolver that answers whatever the test needs, without touching DNS. */
const resolvesTo = (ip) => async () => [{ address: ip }];

test('the addresses that must never be fetched are not fetched', async () => {
  const forbidden = [
    'http://169.254.169.254/latest/meta-data/',      // AWS/GCP metadata
    'http://metadata.google.internal/computeMetadata/v1/',
    'http://127.0.0.1:5678/api/v1/workflows',        // n8n on the same host
    'http://localhost/admin',
    'http://10.0.0.5/',
    'http://192.168.1.1/',
    'http://172.16.4.4/',
    'http://[::1]/',
    'http://0.0.0.0/',
    'http://100.64.0.1/',
  ];
  for (const url of forbidden) {
    await assert.rejects(() => assertPublicUrl(url, resolvesTo('93.184.216.34')), BlockedUrlError, `${url} was allowed`);
  }
});

test('a public name that resolves inward is refused, which is the whole trick', async () => {
  // The oldest bypass there is: a name anyone can register, pointed at
  // 127.0.0.1. Checking the string tells you nothing.
  await assert.rejects(
    () => assertPublicUrl('https://totally-fine.example.com/', resolvesTo('127.0.0.1')),
    (err) => {
      assert.ok(err instanceof BlockedUrlError);
      assert.match(err.message, /resolves to 127\.0\.0\.1/);
      return true;
    },
  );
  await assert.rejects(() => assertPublicUrl('https://fine.example.com/', resolvesTo('169.254.169.254')), BlockedUrlError);
  await assert.rejects(() => assertPublicUrl('https://fine.example.com/', resolvesTo('::ffff:127.0.0.1')), BlockedUrlError);
});

test('only http and https, never a scheme that reads the machine', async () => {
  for (const url of ['file:///etc/passwd', 'ftp://example.com/', 'gopher://example.com/', 'data:text/html,hi']) {
    await assert.rejects(() => assertPublicUrl(url, resolvesTo('93.184.216.34')), BlockedUrlError, `${url} was allowed`);
  }
  await assert.rejects(() => assertPublicUrl('not a url at all', resolvesTo('93.184.216.34')), BlockedUrlError);
});

test('an ordinary public URL is allowed', async () => {
  const url = await assertPublicUrl('https://maps.googleapis.com/maps/api/place/textsearch/json?query=x', resolvesTo('142.250.187.238'));
  assert.equal(url.hostname, 'maps.googleapis.com');
});

test('a redirect into a private address is caught, not followed', async () => {
  // A public URL that 302s inward passes any check made only at the start,
  // which is why every hop is checked and redirects are followed by hand.
  let hops = 0;
  const fetchImpl = async () => {
    hops++;
    return new Response('', { status: 302, headers: { location: 'http://169.254.169.254/latest/meta-data/' } });
  };
  await assert.rejects(
    () => fetchPublicUrl('https://ok.example.com/start', { fetchImpl, resolve: async (host) => [{ address: host === 'ok.example.com' ? '93.184.216.34' : '169.254.169.254' }] }),
    BlockedUrlError,
  );
  assert.equal(hops, 1, 'it followed the redirect before checking where it went');
});

test('a redirect loop stops rather than going round forever', async () => {
  const fetchImpl = async () => new Response('', { status: 302, headers: { location: 'https://ok.example.com/again' } });
  await assert.rejects(
    () => fetchPublicUrl('https://ok.example.com/start', { fetchImpl, resolve: resolvesTo('93.184.216.34'), maxHops: 3 }),
    /redirected more than 3 times/,
  );
});

test('JSON comes back parsed and HTML comes back readable', async () => {
  const asJson = async () => new Response(JSON.stringify({ results: [{ name: 'A Cafe' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  const out = await fetchPublicUrl('https://api.example.com/x', { fetchImpl: asJson, resolve: resolvesTo('93.184.216.34') });
  assert.deepEqual(out.json.results[0].name, 'A Cafe');
  assert.equal(out.text, null, 'JSON was also returned as a wall of text, doubling what it costs to read');

  const asHtml = async () => new Response('<html><head><style>b{}</style><script>var x=1</script></head><body><h1>Places API</h1><p>Use&nbsp;<code>textsearch</code>.</p></body></html>', { status: 200, headers: { 'content-type': 'text/html' } });
  const page = await fetchPublicUrl('https://docs.example.com/', { fetchImpl: asHtml, resolve: resolvesTo('93.184.216.34') });
  assert.match(page.text, /Places API/);
  assert.match(page.text, /textsearch/);
  assert.doesNotMatch(page.text, /<h1>|var x|b\{\}/, 'the markup and scripts came through as content');
});

test('a page that never answers gives up rather than hanging the turn', async () => {
  const never = (url, init) => new Promise((_, reject) => {
    init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  });
  const started = Date.now();
  await assert.rejects(
    () => fetchPublicUrl('https://slow.example.com/', { fetchImpl: never, resolve: resolvesTo('93.184.216.34'), timeoutMs: 300 }),
    /no answer within/,
  );
  assert.ok(Date.now() - started < 2000);
});

test('readable text survives entities and collapses whitespace', () => {
  assert.equal(readableText('<p>a &amp; b</p>\n\n\n\n<p>c</p>'), 'a & b\n\nc');
});

/* ---- the tool, as the model actually reaches it ---- */

test('reading is free and sending is not', async () => {
  const { buildToolRegistry, APPROVAL_REQUIRED } = await import('../core/tools.js');
  const { createMemoryStore } = await import('../core/store.js');

  let sent = 0;
  const fetchImpl = async () => { sent++; return new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } }); };
  // Resolution is injected so the check under test is the approval gate, not
  // whether this machine has DNS.
  const resolveHost = async () => [{ address: '93.184.216.34' }];
  const toolsFor = (approvals) => buildToolRegistry({ store: createMemoryStore(), n8n: null, approvals, fetchImpl, resolveHost });
  const read = (tools) => tools.find((t) => t.name === 'read_api');

  // A GET goes without asking.
  const got = await read(toolsFor([])).handler({ url: 'https://maps.googleapis.com/maps/api/place/textsearch/json' });
  assert.equal(got.ok, true, got.error);
  assert.equal(sent, 1);

  // A POST does not, and — the part that matters — nothing leaves before the
  // refusal. Counted, not trusted.
  const before = sent;
  const posted = await read(toolsFor([])).handler({ url: 'https://api.example.com/send', method: 'POST', body: '{}' });
  assert.equal(posted.ok, false);
  assert.equal(posted.needsApproval, APPROVAL_REQUIRED.SEND_REQUEST);
  assert.equal(sent, before, 'the request went out before it was approved');

  // With the yes, it goes.
  const approved = await read(toolsFor([APPROVAL_REQUIRED.SEND_REQUEST])).handler({ url: 'https://api.example.com/send', method: 'POST', body: '{}' });
  assert.equal(approved.ok, true, approved.error);
  assert.equal(sent, before + 1);
});

test('the tool refuses an inward URL in words, without throwing', async () => {
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createMemoryStore } = await import('../core/store.js');
  let sent = 0;
  const tools = buildToolRegistry({
    store: createMemoryStore(), n8n: null, approvals: [],
    fetchImpl: async () => { sent++; return new Response('{}', { status: 200 }); },
    resolveHost: async () => [{ address: '93.184.216.34' }],
  });
  const out = await tools.find((t) => t.name === 'read_api').handler({ url: 'http://169.254.169.254/latest/meta-data/' });
  assert.equal(out.ok, false);
  assert.equal(out.blocked, true);
  assert.equal(sent, 0, 'it fetched the metadata endpoint and then complained about it');
});

test('the credential schema is offered without ever asking for the secret', async () => {
  const { buildToolRegistry } = await import('../core/tools.js');
  const { createMemoryStore } = await import('../core/store.js');
  const { createN8nClient } = await import('../core/n8nClient.js');

  const n8n = createN8nClient({
    baseUrl: 'https://n8n.invalid', apiKey: 'k',
    fetchImpl: async (url) => {
      assert.match(String(url), /\/credentials\/schema\/httpQueryAuth$/);
      return new Response(JSON.stringify({
        required: ['name', 'value'],
        properties: { name: { displayName: 'Name' }, value: { displayName: 'Value', typeOptions: { password: true } } },
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    },
  });

  const tools = buildToolRegistry({ store: createMemoryStore(), n8n, approvals: [] });
  const out = await tools.find((t) => t.name === 'get_credential_schema').handler({ type: 'httpQueryAuth' });
  assert.equal(out.ok, true, out.error);
  assert.deepEqual(out.fields.map((f) => f.name), ['name', 'value']);
  assert.equal(out.fields[1].secret, true);
  assert.match(out.howToCreate, /Do not paste the secret to me/);
});
