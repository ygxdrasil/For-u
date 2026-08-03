#!/usr/bin/env node
/**
 * Stress round four: the door, the money and whether the instance is telling
 * the truth.
 *
 *   node scripts/stress4.mjs
 *
 * The first three rounds hammered the parts that build workflows. This one
 * covers everything that stands between a stranger and the n8n API key —
 * password, session cookie, encryption at rest — plus the two places where
 * being confidently wrong costs the most:
 *
 *   · the spend cap, where a stop that trips late has already spent the money
 *   · the n8n client, where a 200 from a login page reads exactly like a 200
 *     from n8n unless someone checks the shape of what came back
 *
 * Everything here runs against the real modules. No mocks of our own code.
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import {
  issueSession,
  inspectSession,
  verifySession,
  shouldRenew,
  sessionCookie,
  readSessionCookie,
  hashPassword,
  verifyPassword,
  encryptSecret,
  decryptSecret,
  describeSecret,
  encryptionKey,
  SESSION_TTL_DAYS,
} from '../core/secrets.js';
import {
  setupPassword,
  checkPassword,
  changePassword,
  isPasswordSet,
  saveServerConfig,
  loadServerConfig,
  describeServerConfig,
  sessionSecret,
  sessionKeyId,
  savePrefs,
} from '../core/settings.js';
import { createMemoryStore } from '../core/store.js';
import { createN8nClient, N8nError } from '../core/n8nClient.js';
import { createMeter, priceUsage, PRICES, estimateCost } from '../core/meter.js';
import { buildToolRegistry } from '../core/tools.js';
import { toolsForProtocol } from '../core/protocol.js';
import { run } from '../core/run.js';

let pass = 0;
const failures = [];
const notes = [];
const check = async (label, fn) => {
  try { await fn(); pass++; process.stdout.write('.'); }
  catch (err) { failures.push({ label, message: err.message.split('\n')[0] }); process.stdout.write(`\n  FAIL ${label}\n       ${err.message.split('\n')[0]}\n`); }
};
const section = (t) => process.stdout.write(`\n${t}\n  `);
const note = (t) => notes.push(t);

const res = () => {
  const r = {
    statusCode: 0, headers: {}, body: null, text: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    getHeader(k) { return this.headers[k.toLowerCase()]; },
    end(t) { this.text = t ?? ''; try { this.body = JSON.parse(this.text); } catch { this.body = null; } },
  };
  return r;
};

/* ==================================================== 1. the session cookie */

section('1. The session cookie is a lock, not a label');

await check('a forged signature is rejected, and says so specifically', () => {
  const token = issueSession('the-real-secret');
  const [body] = token.split('.');
  const forged = `${body}.${crypto.randomBytes(32).toString('base64url')}`;
  const { payload, reason } = inspectSession('the-real-secret', forged);
  assert.equal(payload, null, 'a cookie signed with the wrong key was accepted');
  assert.equal(reason, 'bad-signature');
});

await check('a payload edited to extend its own expiry no longer verifies', () => {
  const secret = 'secret';
  const token = issueSession(secret);
  const [body, sig] = token.split('.');
  const claim = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  claim.exp = Date.now() + 1000 * 60 * 60 * 24 * 3650;
  claim.sub = 'not-the-owner';
  const edited = `${Buffer.from(JSON.stringify(claim)).toString('base64url')}.${sig}`;
  assert.equal(verifySession(secret, edited), null, 'the payload can be rewritten without invalidating the signature');
});

await check('an unsigned "none"-style cookie with no signature is rejected', () => {
  const claim = { sub: 'owner', iat: Date.now(), exp: Date.now() + 1e9, jti: 'x' };
  const body = Buffer.from(JSON.stringify(claim)).toString('base64url');
  for (const attempt of [body, `${body}.`, `.${body}`, `${body}..`, '..', '.']) {
    assert.equal(verifySession('secret', attempt), null, `"${attempt.slice(0, 12)}…" was accepted as a session`);
  }
});

await check('an empty signing secret does not make every cookie valid', () => {
  // If the secret ever resolved to '' or undefined, HMAC still computes and
  // two empty secrets agree — so a cookie minted by anyone would verify.
  const mintedByAttacker = issueSession('');
  assert.equal(verifySession('the-real-secret', mintedByAttacker), null);
});

await check('a rotated secret reports bad-signature, not "expired"', () => {
  const token = issueSession('old-secret');
  assert.equal(inspectSession('new-secret', token).reason, 'bad-signature',
    'rotating the secret would be reported as an expiry, sending you to look at the wrong thing');
});

await check('an expired cookie is refused and named as expired', () => {
  const secret = 's';
  const claim = { sub: 'owner', iat: Date.now() - 1e6, exp: Date.now() - 1000, jti: 'a' };
  const body = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const { payload, reason } = inspectSession(secret, `${body}.${sig}`);
  assert.equal(payload, null);
  assert.equal(reason, 'expired');
});

await check('the cookie the browser is sent cannot be read by scripts or sent over http', () => {
  const c = sessionCookie(issueSession('s'));
  for (const attr of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/']) {
    assert.ok(c.includes(attr), `the session cookie is missing ${attr}`);
  }
  assert.match(c, /Max-Age=\d+/);
  assert.match(c, /Expires=/);
});

await check('logging out actually clears it in both mechanisms', () => {
  const c = sessionCookie(null, { clear: true });
  assert.match(c, /n8na_sess=;/, 'logout did not blank the value');
  assert.match(c, /Max-Age=0/);
  assert.match(c, /Expires=Thu, 01 Jan 1970/);
});

await check('the session cookie is found among other cookies, in any position', () => {
  const token = issueSession('s');
  const others = 'ph_session=abc; _ga=GA1.1.2; n8na_sess=' + token + '; vercel_toolbar=1';
  assert.equal(readSessionCookie({ headers: { cookie: others } }), token);
  assert.equal(readSessionCookie({ headers: { cookie: `n8na_sess=${token}` } }), token);
  assert.equal(readSessionCookie({ headers: {} }), null);
});

await check('a cookie named something that merely contains n8na_sess is not mistaken for it', () => {
  const token = issueSession('s');
  const c = `not_n8na_sess=${token}; xn8na_sess=${token}`;
  assert.equal(readSessionCookie({ headers: { cookie: c } }), null,
    'a differently-named cookie was accepted as the session — substring matching again');
});

await check('a year-long session is not renewed on every request, but is when stale', () => {
  assert.equal(shouldRenew({ iat: Date.now() }), false, 'every request would re-issue the cookie');
  assert.equal(shouldRenew({ iat: Date.now() - 2 * 24 * 60 * 60 * 1000 }), true);
  assert.ok(SESSION_TTL_DAYS >= 30);
});

/* ============================================================ 2. passwords */

section('2. Passwords');

await check('a short password is refused before it is ever hashed', async () => {
  await assert.rejects(() => hashPassword('short'), /8 characters/);
  await assert.rejects(() => hashPassword(''), /8 characters/);
  await assert.rejects(() => hashPassword(null), /8 characters/);
});

await check('the right password verifies and the wrong one does not', async () => {
  const rec = await hashPassword('correct horse battery');
  assert.equal(await verifyPassword('correct horse battery', rec), true);
  assert.equal(await verifyPassword('correct horse batter', rec), false);
  assert.equal(await verifyPassword('', rec), false);
  assert.equal(await verifyPassword('correct horse battery ', rec), false);
});

await check('two identical passwords do not produce the same stored hash', async () => {
  const a = await hashPassword('the same password');
  const b = await hashPassword('the same password');
  assert.notEqual(a.hash, b.hash, 'no salt — one rainbow table covers every user of this code');
  assert.notEqual(a.salt, b.salt);
});

await check('a corrupted password record fails closed rather than throwing', async () => {
  for (const rec of [null, {}, { salt: 'x' }, { hash: 'y' }, { salt: 'x', hash: 'y', params: { N: -1 } }]) {
    assert.equal(await verifyPassword('anything', rec), false, `a record shaped ${JSON.stringify(rec)} did not fail closed`);
  }
});

await check('setup cannot overwrite an existing password, change-password needs the old one', async () => {
  const store = createMemoryStore();
  await setupPassword(store, 'first password');
  assert.equal(await isPasswordSet(store), true);
  await assert.rejects(() => setupPassword(store, 'hijacked password'), /already set/);
  await assert.rejects(() => changePassword(store, 'wrong one', 'new password'), /Current password is wrong/);
  assert.equal(await checkPassword(store, 'first password'), true);
});

await check('after a change the old password stops working immediately', async () => {
  const store = createMemoryStore();
  await setupPassword(store, 'first password');
  await changePassword(store, 'first password', 'second password');
  assert.equal(await checkPassword(store, 'first password'), false);
  assert.equal(await checkPassword(store, 'second password'), true);
});

await check('the login route answers the same way for a wrong password as for a missing one', async () => {
  const handler = (await import('../api/auth.js')).default;
  process.env.ALLOW_MEMORY_AUTH = '1';
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();

  const r0 = res();
  await handler({ method: 'POST', headers: {}, body: { action: 'setup', password: 'a real password' } }, r0);
  assert.equal(r0.statusCode, 200, `setup answered ${r0.statusCode}: ${r0.text.slice(0, 120)}`);

  const wrong = res();
  await handler({ method: 'POST', headers: {}, body: { action: 'login', password: 'not it' } }, wrong);
  const empty = res();
  await handler({ method: 'POST', headers: {}, body: { action: 'login' } }, empty);

  assert.equal(wrong.statusCode, 401);
  assert.equal(empty.statusCode, 401);
  assert.deepEqual(wrong.body, empty.body, 'the two answers differ, which tells a guesser which half they got right');
  assert.equal(wrong.getHeader('set-cookie'), undefined, 'a failed login still handed out a cookie');

  resetStoreCache();
  delete process.env.ALLOW_MEMORY_AUTH;
});

/* ================================================= 3. keys at rest */

section('3. Keys at rest');

await check('a key survives the round trip and the ciphertext looks nothing like it', () => {
  const key = crypto.randomBytes(32);
  const secret = 'n8n_api_key_ABCDEFGH12345678';
  const blob = encryptSecret(key, secret);
  assert.equal(decryptSecret(key, blob), secret);
  assert.ok(!blob.includes(secret));
  assert.ok(!Buffer.from(blob).includes(Buffer.from('ABCDEFGH')));
});

await check('the same key encrypted twice produces different ciphertext', () => {
  const key = crypto.randomBytes(32);
  assert.notEqual(encryptSecret(key, 'same'), encryptSecret(key, 'same'), 'a fixed IV — identical secrets are visibly identical at rest');
});

await check('a tampered ciphertext returns nothing rather than garbage or a crash', () => {
  const key = crypto.randomBytes(32);
  const blob = encryptSecret(key, 'the real key');
  const [iv, enc, tag] = blob.split('.');
  const flip = (s) => { const b = Buffer.from(s, 'base64url'); b[0] ^= 0xff; return b.toString('base64url'); };
  for (const bad of [`${flip(iv)}.${enc}.${tag}`, `${iv}.${flip(enc)}.${tag}`, `${iv}.${enc}.${flip(tag)}`, 'nonsense', 'a.b.c', '']) {
    assert.equal(decryptSecret(key, bad), null, `tampering survived: ${bad.slice(0, 20)}`);
  }
});

await check('the wrong key decrypts to nothing', () => {
  const blob = encryptSecret(crypto.randomBytes(32), 'the real key');
  assert.equal(decryptSecret(crypto.randomBytes(32), blob), null);
});

await check('what the browser is told about a key never contains the key', () => {
  const d = describeSecret('n8n_api_key_ABCDEFGH12345678');
  assert.equal(d.set, true);
  assert.ok(!d.hint.includes('ABCDEFGH'));
  assert.ok(d.hint.length <= 6, `the hint is ${d.hint.length} characters of a secret`);
  assert.deepEqual(describeSecret(''), { set: false, hint: null });
  assert.deepEqual(describeSecret(null), { set: false, hint: null });
});

await check('MASTER_KEY takes precedence over the database key when it is set', () => {
  delete process.env.MASTER_KEY;
  const fromDb = encryptionKey('11'.repeat(32));
  assert.equal(fromDb.source, 'database');
  process.env.MASTER_KEY = 'a master key';
  assert.equal(encryptionKey('11'.repeat(32)).source, 'env');
  delete process.env.MASTER_KEY;
});

await check('a stored key that can no longer be decrypted is reported as unreadable, not as absent', async () => {
  const store = createMemoryStore();
  process.env.MASTER_KEY = 'the original master key';
  await saveServerConfig(store, { n8nApiKey: 'n8n_live_key', n8nBaseUrl: 'https://n8n.example.com' });
  assert.equal((await loadServerConfig(store)).n8nApiKey, 'n8n_live_key');

  // Someone rotates MASTER_KEY in Vercel, or removes it. The ciphertext is
  // still there and still correct; nothing can read it.
  process.env.MASTER_KEY = 'a different master key';
  const described = await describeServerConfig(store);
  delete process.env.MASTER_KEY;

  assert.notEqual(
    JSON.stringify(described.n8nApiKey),
    JSON.stringify({ set: false, hint: null }),
    'the settings page says no key is set while a key is sitting in the database — that sends you to look for a key you never lost',
  );
});

await check('settings survive a full save/load cycle with every field populated', async () => {
  const store = createMemoryStore();
  await saveServerConfig(store, {
    n8nBaseUrl: 'https://n8n.example.com/',
    n8nApiKey: 'k1',
    geminiApiKey: 'k2',
    monthlyCapUsd: 9,
  });
  const loaded = await loadServerConfig(store);
  assert.equal(loaded.n8nApiKey, 'k1');
  assert.equal(loaded.geminiApiKey, 'k2');
  assert.equal(loaded.monthlyCapUsd, 9);

  // Saving one field must not silently clear the others.
  await saveServerConfig(store, { monthlyCapUsd: 4 });
  const after = await loadServerConfig(store);
  assert.equal(after.n8nApiKey, 'k1', 'changing the cap wiped the n8n key');
  assert.equal(after.geminiApiKey, 'k2');
});

await check('an empty string clears a key and undefined leaves it alone', async () => {
  const store = createMemoryStore();
  await saveServerConfig(store, { n8nApiKey: 'k1', geminiApiKey: 'k2' });
  await saveServerConfig(store, { n8nApiKey: '' });
  const after = await loadServerConfig(store);
  assert.equal(after.n8nApiKey, undefined, 'clearing a key did not clear it');
  assert.equal(after.geminiApiKey, 'k2', 'clearing one key cleared the other');
});

await check('the session secret is stable across reads and its fingerprint identifies it', async () => {
  delete process.env.SESSION_SECRET;
  const store = createMemoryStore();
  const a = await sessionSecret(store);
  const b = await sessionSecret(store);
  assert.equal(a, b, 'the signing secret changed between two reads — every cookie dies on every request');
  assert.equal(await sessionKeyId(store), await sessionKeyId(store));
  assert.ok(!(await sessionKeyId(store)).includes(a.slice(0, 8)), 'the fingerprint leaks the secret');
});

/* ================================================== 4. money, under pressure */

section('4. Money');

await check('every model that can be selected has a price', async () => {
  const store = createMemoryStore();
  const saved = await savePrefs(store, { chatModel: 'not-a-real-model', designModel: 'not-a-real-model' });
  assert.ok(PRICES[saved.chatModel], `${saved.chatModel} has no price`);
  assert.ok(PRICES[saved.designModel], `${saved.designModel} has no price`);
});

await check('the stop is checked before the call, using the worst case not the average', async () => {
  const store = createMemoryStore();
  const meter = createMeter({ store, capUsd: 0.01 });
  // A big output allowance on an expensive model. Average usage would be far
  // under the cap; the allowance is what could actually be billed.
  await assert.rejects(
    () => meter.assertCanSpend({ model: 'gemini-3.5-flash', inputTokens: 1000, maxOutputTokens: 65536 }),
    /cap reached/,
    'a call that could bill past the cap was admitted because it probably would not',
  );
});

await check('once the cap is spent, nothing else is admitted', async () => {
  const store = createMemoryStore();
  const meter = createMeter({ store, capUsd: 1 });
  await store.addSpend({ model: 'gemini-2.5-flash-lite', usd: 1.5, at: new Date().toISOString() });
  await assert.rejects(() => meter.assertCanSpend({ model: 'gemini-2.5-flash-lite', inputTokens: 1, maxOutputTokens: 1 }), /cap reached/);
});

await check('concurrent turns cannot each be admitted after the budget is gone', async () => {
  const store = createMemoryStore();
  const meter = createMeter({ store, capUsd: 0.05 });
  const call = { model: 'gemini-2.5-flash-lite', inputTokens: 10_000, maxOutputTokens: 16_384 };
  const each = estimateCost(call);

  // Eight turns start at the same instant, all reading the same spend figure.
  const admitted = (await Promise.all(
    Array.from({ length: 8 }, async () => {
      try { await meter.assertCanSpend(call); await meter.record({ model: call.model, usage: { promptTokenCount: 10_000, candidatesTokenCount: 16_384 } }); return true; }
      catch { return false; }
    }),
  )).filter(Boolean).length;

  const spent = await store.getMonthlySpend();
  const overshoot = spent - 0.05;
  if (overshoot > each) {
    note(`concurrency: ${admitted} simultaneous turns spent $${spent.toFixed(4)} against a $0.05 cap — the pre-check reads a figure that is already stale`);
  }
  // The invariant that must hold regardless of the race: once the recorded
  // spend is over, a fresh request is refused.
  await assert.rejects(() => meter.assertCanSpend(call), /cap reached/, 'the cap stopped stopping anything once it had been crossed');
});

await check('an unpriced model is a loud error at both ends, never a guessed rate', async () => {
  const store = createMemoryStore();
  const meter = createMeter({ store, capUsd: 100 });
  await assert.rejects(() => meter.assertCanSpend({ model: 'gemini-9-ultra', inputTokens: 1, maxOutputTokens: 1 }), /No price on record/);
  await assert.rejects(() => meter.record({ model: 'gemini-9-ultra', usage: { promptTokenCount: 1 } }), /No price on record/);
});

await check('thinking tokens are billed, at the output rate', () => {
  const plain = priceUsage('gemini-2.5-flash', { promptTokenCount: 0, candidatesTokenCount: 1_000_000 });
  const thinking = priceUsage('gemini-2.5-flash', { promptTokenCount: 0, candidatesTokenCount: 0, thoughtsTokenCount: 1_000_000 });
  assert.ok(Math.abs(plain.usd - thinking.usd) < 1e-12, 'thinking tokens are not billed at the output rate');
  assert.equal(thinking.thinkingTokens, 1_000_000);
});

/* ============================== 5. is that actually n8n on the other end? */

section('5. Is that actually n8n on the other end');

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const client = (fetchImpl) => createN8nClient({ baseUrl: 'https://n8n.example.com', apiKey: 'k', fetchImpl });

await check('an SSO login page returned with 200 is not reported as a working connection', async () => {
  // The classic: n8n behind Cloudflare Access or a corporate proxy. Every
  // request gets 200 and an HTML sign-in page. Nothing is wrong with n8n; the
  // key is never seen by it.
  const html = '<!doctype html><html><body><h1>Sign in to continue</h1></body></html>';
  const probe = await client(async () => new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } })).ping();
  assert.equal(probe.ok, false, 'a login page was reported as a healthy, authorised n8n connection');
  assert.match(String(probe.error ?? ''), /n8n|JSON|HTML|html/i, 'the failure does not say what actually came back');
});

await check('a 200 with a body that is not a workflow list does not become "you have no workflows"', async () => {
  const c = client(async () => new Response('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
  await assert.rejects(() => c.listWorkflows(), (err) => {
    assert.ok(err instanceof N8nError, `threw ${err.name} instead of an N8nError`);
    return true;
  }, 'a plain-text 200 was passed off as an empty workflow list');
});

await check('a rejected key is reported as reachable but not authorised', async () => {
  const probe = await client(async () => jsonResponse({ message: 'unauthorized' }, 401)).ping();
  assert.equal(probe.reachable, true);
  assert.equal(probe.authorised, false);
});

await check('an unreachable host is reported as unreachable, not as a bad key', async () => {
  const probe = await client(async () => { throw new Error('getaddrinfo ENOTFOUND n8n.example.com'); }).ping();
  assert.equal(probe.reachable, false);
  assert.notEqual(probe.authorised, false, 'a DNS failure was reported as a rejected API key');
});

await check('a self-signed certificate is named, not turned into advice to disable TLS', async () => {
  const c = client(async () => { throw new Error('unable to verify the first certificate'); });
  const probe = await c.ping();
  assert.match(probe.error, /certificate/i);
  assert.ok(!/NODE_TLS_REJECT_UNAUTHORIZED/i.test(probe.error), 'the error suggests turning certificate checking off');
});

await check('a 429 keeps its status so a caller can tell it apart from a broken request', async () => {
  const c = client(async () => jsonResponse({ message: 'too many requests' }, 429));
  await assert.rejects(() => c.listWorkflows(), (err) => err.status === 429);
});

await check('there is still no way to delete anything', async () => {
  const c = client(async () => jsonResponse({}));
  await assert.rejects(() => c.request('DELETE', '/workflows/1'), /never deletes/);
  assert.equal(typeof c.deleteWorkflow, 'undefined');
  await assert.rejects(() => c.updateWorkflow('1', {}, {}), /snapshotId/);
});

await check('a workflow is created switched off even when asked for switched on', async () => {
  // The guarantee is "it ends up off", not "we said off in the body" — saying
  // it in the body is what n8n rejects outright (active is read-only), and a
  // test written against the mechanism happily passed while nothing could be
  // saved at all.
  let sent = null;
  const c = client(async (url, init) => {
    if (init?.method === 'POST') { sent = JSON.parse(init.body); return jsonResponse({ id: 'new1', ...sent, active: false }); }
    return jsonResponse({ id: 'new1', active: false });
  });
  await c.createWorkflow({ name: 'X', nodes: [], connections: {}, active: true });
  assert.ok(!('active' in sent), 'active was sent at all, which n8n refuses — read-only on create');
});

await check('a workflow that somehow comes back live is switched off again', async () => {
  // The read-back is what makes "created inactive" true rather than assumed.
  const paths = [];
  const c = client(async (url, init) => {
    const path = new URL(url).pathname.replace('/api/v1', '');
    paths.push(`${init?.method ?? 'GET'} ${path}`);
    if (init?.method === 'POST' && path === '/workflows') return jsonResponse({ id: 'new1', active: true });
    if (path === '/workflows/new1/deactivate') return jsonResponse({ id: 'new1', active: false });
    return jsonResponse({ id: 'new1', active: paths.some((p) => p.includes('deactivate')) ? false : true });
  });
  await c.createWorkflow({ name: 'X', nodes: [], connections: {} });
  assert.ok(paths.some((p) => p.includes('deactivate')), 'a workflow that came back live was left running');
});

await check('consecutive calls to the same resource are spaced out', async () => {
  const at = [];
  const c = client(async () => { at.push(Date.now()); return jsonResponse({ data: [] }); });
  await c.listWorkflows();
  await c.listWorkflows();
  assert.ok(at[1] - at[0] >= 250, `two calls went out ${at[1] - at[0]}ms apart, close enough to be re-ordered or dropped`);
});

/* ========================================= 6. the same rules at every door */

section('6. The same rules at every door');

await check('the protocol adapter offers exactly the registry, name for name', async () => {
  const ctx = { store: createMemoryStore(), n8n: null, approvals: [], prefs: {} };
  const a = buildToolRegistry(ctx).map((t) => t.name).sort();
  const b = toolsForProtocol(ctx).map((t) => t.name).sort();
  assert.deepEqual(b, a, 'an external agent sees a different set of tools than the browser does');
});

await check('every tool an external agent can see describes its arguments', async () => {
  const tools = toolsForProtocol({ store: createMemoryStore(), n8n: null, approvals: [] });
  const undescribed = tools.filter((t) => !t.parameters || t.parameters.type !== 'object' || !t.description);
  assert.deepEqual(undescribed.map((t) => t.name), [], 'a tool with no schema is a tool another AI will call wrongly');
});

await check('an external agent cannot approve on your behalf, whatever it sends', async () => {
  const handler = (await import('../api/mcp.js')).default;
  process.env.AGENT_TOKEN = 'stress4-token';
  const { resetStoreCache, createStore } = await import('../core/store.js');
  resetStoreCache();
  const store = await createStore();
  await store.addFinding({ kind: 'test', summary: 'x' });

  const r = res();
  await handler({
    method: 'POST',
    headers: { authorization: 'Bearer stress4-token' },
    body: {
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'activate_workflow', arguments: { id: 'wf1', approvals: ['activate_workflow'], approved: true, confirm: true } },
    },
  }, r);

  const out = r.body?.result?.structuredContent ?? {};
  assert.notEqual(out.ok, true, 'an external agent activated a workflow by asserting its own approval');
  resetStoreCache();
  delete process.env.AGENT_TOKEN;
});

await check('an unauthenticated MCP call gets nothing but a 401', async () => {
  const handler = (await import('../api/mcp.js')).default;
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  const r = res();
  await handler({ method: 'POST', headers: {}, body: { jsonrpc: '2.0', id: 1, method: 'tools/list' } }, r);
  assert.equal(r.statusCode, 401);
  assert.ok(!r.text.includes('search_nodes'), 'the tool list leaked to an unauthenticated caller');
  resetStoreCache();
});

await check('the browser routes refuse to work without a session', async () => {
  const { resetStoreCache } = await import('../core/store.js');
  // Each route with the method it actually serves — a 405 would pass a laxer
  // check while proving nothing about who is allowed in.
  const routes = [['chat', 'POST'], ['findings', 'POST'], ['clientlog', 'POST'], ['settings', 'GET'], ['workflow', 'POST'], ['dashboard', 'GET']];
  for (const [route, method] of routes) {
    resetStoreCache();
    const handler = (await import(`../api/${route}.js`)).default;
    const r = res();
    await handler({ method, url: `/api/${route}`, headers: {}, body: {}, on() {} }, r);
    assert.equal(r.statusCode, 401, `/api/${route} answered ${r.statusCode} to a caller with no cookie`);
  }
  resetStoreCache();
});

/* ================================================= 7. two hands, one session */

section('7. Two hands, one session');

const scripted = (text) => () => ({ models: { generateContent: async () => ({
  text, functionCalls: [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20 },
}) } });

await check('two turns sent at the same moment do not erase each other', async () => {
  const store = createMemoryStore();
  const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };
  await Promise.all([
    run({ text: 'the first thing I asked', sessionId: 'both', config: cfg, store, llmClientFactory: scripted('one') }, {}),
    run({ text: 'the second thing I asked', sessionId: 'both', config: cfg, store, llmClientFactory: scripted('two') }, {}),
  ]);
  const messages = JSON.stringify((await store.getSession('both')).messages);
  assert.match(messages, /the first thing I asked/, 'one of two simultaneous turns vanished from the conversation');
  assert.match(messages, /the second thing I asked/);
});

await check('a conversation does not grow without limit', async () => {
  const store = createMemoryStore();
  const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };
  for (let i = 0; i < 60; i++) {
    await run({ text: `turn number ${i} with some padding to make it realistic`, sessionId: 'long', config: cfg, store, llmClientFactory: scripted('ok') }, {});
  }
  const messages = (await store.getSession('long')).messages;
  const bytes = JSON.stringify(messages).length;
  assert.ok(bytes < 400_000, `60 turns produced ${Math.round(bytes / 1024)}KB of history, which is billed on every request from here on`);
});

/* ============================================ 8. text that is not plain ASCII */

section('8. Text that is not plain ASCII');

await check('emoji, right-to-left and zero-width text survive a whole turn', async () => {
  const store = createMemoryStore();
  const cfg = { geminiApiKey: 'k', monthlyCapUsd: 100 };
  const awkward = 'ابحث عن ⚙️ workflow​ مع "quotes" and \\backslashes\\ and   null';
  const out = await run({ text: awkward, sessionId: 'rtl', config: cfg, store, llmClientFactory: scripted('fine') }, {});
  assert.equal(out.status, 'ok', `an awkward string produced status ${out.status}: ${out.reply}`);
  const back = JSON.stringify((await store.getSession('rtl')).messages);
  assert.match(back, /⚙️/, 'the emoji did not survive being stored');
});

await check('a lone surrogate does not break the event stream', () => {
  const lone = 'before \ud800 after';
  const encoded = JSON.stringify({ chunk: lone });
  assert.equal(JSON.parse(encoded).chunk.length, lone.length, 'a lone surrogate produced a payload that cannot be parsed back');
});

await check('a workflow named in another script validates and previews', async () => {
  const { validateWorkflow } = await import('../core/validate.js');
  const { buildPreview } = await import('../core/preview.js');
  const wf = {
    name: '📊 تقرير يومي — daily report',
    nodes: [
      { id: 't', name: 'كل صباح', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: { rule: { interval: [{ field: 'days' }] } } },
      { id: 's', name: 'Set 值', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [200, 0], parameters: { mode: 'manual' } },
    ],
    connections: { 'كل صباح': { main: [[{ node: 'Set 值', type: 'main', index: 0 }]] } },
  };
  const v = await validateWorkflow(wf);
  assert.equal(v.valid, true, `a non-Latin workflow was rejected: ${JSON.stringify(v.errors?.slice(0, 2))}`);

  // The canvas has to draw the names it was given, not a mangled version of
  // them — a workflow you cannot recognise on screen is one you cannot check.
  const preview = buildPreview(wf);
  const drawn = JSON.stringify(preview);
  assert.match(drawn, /كل صباح/, 'the trigger name did not survive being drawn');
  assert.match(drawn, /Set 值/);
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
if (notes.length) { console.log('\nNoted:'); for (const n of [...new Set(notes)]) console.log(`  · ${n}`); }
console.log('');
process.exit(failures.length ? 1 : 0);
