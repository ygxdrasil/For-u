import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { searchHackerNews, searchStackExchange, createCommunity, decodeEntities, CommunityError } from '../core/community.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * These fixtures are REAL responses, captured from the live APIs on
 * 2026-08-01, not written by hand. A fixture I invent proves my adapter can
 * parse my own imagination; a captured one proves it can parse what the
 * service actually sends.
 */
const load = (name) => JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', name), 'utf8'));
const stub = (payload, status = 200) => async () => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(payload),
});

test('Hacker News: a real response becomes quotes with checkable links', async () => {
  const asks = await searchHackerNews({ keywords: 'invoice chasing', fetchImpl: stub(load('hackernews.json')) });
  assert.ok(asks.length > 0, 'the captured response has hits, so the adapter must produce asks');

  for (const a of asks) {
    assert.ok(a.quote.length > 20, 'a quote must be substantial enough to be evidence');
    // The link must go where a human would look, not to the search index.
    assert.match(a.url, /^https:\/\/news\.ycombinator\.com\/item\?id=\d+$/, `bad link: ${a.url}`);
    assert.equal(a.via, 'direct-fetch', 'this was read through an API, not shown in a snippet');
    assert.ok(Number.isFinite(a.weight));
  }
});

test('Stack Exchange: a real response becomes quotes, and reports its quota', async () => {
  const result = await searchStackExchange({ keywords: 'invoicing', fetchImpl: stub(load('stackexchange-softwarerecs.json')) });

  assert.ok(result.asks.length > 0);
  assert.ok(Number.isFinite(result.quotaRemaining), 'the remaining daily allowance must be read, not assumed');

  for (const a of result.asks) {
    assert.match(a.url, /^https:\/\/softwarerecs\.stackexchange\.com\//, `bad link: ${a.url}`);
    assert.equal(a.platform, 'forum');
    assert.equal(a.via, 'direct-fetch');
  }
});

test('quotes come out verbatim, not HTML-escaped', () => {
  // "I&#x27;m looking for" is not what anybody typed, and a quote that is not
  // verbatim is not evidence.
  assert.equal(decodeEntities('I&#x27;m looking'), "I'm looking");
  assert.equal(decodeEntities('a &amp; b'), 'a & b');
  assert.equal(decodeEntities('caf&#233;'), 'café');
  assert.equal(decodeEntities('nothing to do here'), 'nothing to do here');
  assert.equal(decodeEntities(null), '');
});

test('no HTML tag survives into a quote', async () => {
  const asks = await searchStackExchange({ keywords: 'x', fetchImpl: stub(load('stackexchange-softwarerecs.json')) });
  for (const a of asks.asks) {
    assert.ok(!/<[a-z/][^>]*>/i.test(a.quote), `a tag survived: ${a.quote.slice(0, 80)}`);
    assert.ok(!/&#?\w+;/.test(a.quote), `an entity survived: ${a.quote.slice(0, 80)}`);
  }
});

test('one dead source is a caveat, never a lost run', async () => {
  // Stack Exchange down, Hacker News fine: the run must keep everything HN gave
  // it and say plainly what it could not read.
  const fetchImpl = async (url) => {
    if (String(url).includes('stackexchange')) return { ok: false, status: 503, text: async () => 'upstream down' };
    return { ok: true, status: 200, text: async () => JSON.stringify(load('hackernews.json')) };
  };
  const community = createCommunity({ fetchImpl, gapMs: 0 });
  const out = await community.gatherAsks({ keywords: 'invoicing' });

  assert.ok(out.asks.length > 0, 'what one source gave must survive another failing');
  assert.equal(out.partial, true);
  assert.ok(out.failures.length >= 1);
  assert.match(out.failures[0].error, /503/);
  assert.ok(out.read < out.attempted, 'the count must reflect what was actually read');
});

test('every source failing is still a result, not a throw', async () => {
  const community = createCommunity({ fetchImpl: async () => ({ ok: false, status: 500, text: async () => 'boom' }), gapMs: 0 });
  const out = await community.gatherAsks({ keywords: 'x' });
  assert.deepEqual(out.asks, []);
  assert.equal(out.partial, true);
  assert.equal(out.read, 0);
});

test('malformed responses degrade instead of throwing rubbish into a finding', async () => {
  const shapes = [
    { hits: null },
    { hits: [null, 'string', 42, {}] },
    { items: null },
    { items: [{}, null, { body: '', link: '' }] },
    {},
  ];
  for (const payload of shapes) {
    const hn = await searchHackerNews({ keywords: 'x', fetchImpl: stub(payload) });
    assert.ok(Array.isArray(hn), 'always an array');
    const se = await searchStackExchange({ keywords: 'x', fetchImpl: stub(payload) });
    assert.ok(Array.isArray(se.asks));
  }
});

test('a non-JSON response is a clear error, not a TypeError', async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, text: async () => '<html>rate limited</html>' });
  await assert.rejects(() => searchHackerNews({ keywords: 'x', fetchImpl }), CommunityError);
});

test('these sources give asks, never proof of payment', async () => {
  // The whole reason they cannot inflate a finding: nothing here is a price.
  const community = createCommunity({
    fetchImpl: stub(load('hackernews.json')),
    gapMs: 0,
    seSites: [],
  });
  const out = await community.gatherAsks({ keywords: 'x', sites: [] });
  for (const a of out.asks) {
    assert.equal(a.price, undefined, 'a community ask must never carry a price');
    assert.ok(a.quote && a.url, 'but it must always carry a quote and a link');
  }
});

test('the strongest signal is ordered first', async () => {
  const community = createCommunity({ fetchImpl: stub(load('hackernews.json')), gapMs: 0, seSites: [] });
  const out = await community.gatherAsks({ keywords: 'x', sites: [] });
  const weights = out.asks.map((a) => a.weight);
  assert.deepEqual(weights, [...weights].sort((a, b) => b - a), 'many upvotes is many people saying "me too" without typing it');
});
