import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  targetFromUrl,
  channelForUrl,
  maySend,
  footerFor,
  sendOne,
  sendBatch,
  outboxSummary,
  addSender,
  listSenders,
  removeSender,
  senderFor,
  SENDS_PER_FINDING,
} from '../core/outbox.js';
import { createStore } from '../core/store.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SECRET = 'x'.repeat(48);

const person = (over = {}) => ({
  id: 'who_1',
  handle: 'dave',
  url: 'https://community.n8n.io/t/chasing-invoices/12345',
  platform: 'n8n Community',
  reachability: 'reply',
  reply: 'welcome',
  ...over,
});

async function fixture() {
  const store = await createStore({});
  await addSender(store, { channel: 'discourse', host: 'community.n8n.io', username: 'me', token: 'k'.repeat(20) }, SECRET);
  return {
    store,
    sessionSecret: SECRET,
    fetchImpl: async () => new Response(JSON.stringify({ id: 9, topic_id: 12345, post_number: 4 }), { status: 200 }),
    deadline: { tooLateFor: () => false },
  };
}

test('nothing scheduled is allowed to send', () => {
  // The limit that matters most and the one most likely to be undone later by
  // somebody being helpful. An unattended pass reads, roams and hands over —
  // it must never talk to a stranger.
  for (const file of ['core/pass.js', 'api/cron.js', 'core/explore.js', 'core/research.js', 'core/watches.js']) {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.ok(
      !/from ['"]\.{1,2}\/(core\/)?outbox\.js['"]/.test(src),
      `${file} imports core/outbox.js. Nothing on a schedule may send: she reads unattended and writes only when you press the button.`,
    );
  }
});

test('a post URL is parsed, never guessed', () => {
  assert.deepEqual(targetFromUrl('https://community.n8n.io/t/slug/12345', 'discourse'), { topicId: 12345, postNumber: null });
  assert.deepEqual(targetFromUrl('https://community.n8n.io/t/slug/12345/6', 'discourse'), { topicId: 12345, postNumber: 6 });
  assert.deepEqual(targetFromUrl('https://lemmy.world/post/777', 'lemmy'), { postId: 777 });

  // Posting to a guessed topic id puts your words under a stranger's unrelated
  // question, so anything unparseable is null rather than a plausible number.
  for (const bad of ['https://community.n8n.io/', 'https://community.n8n.io/t/slug/', 'not a url', '', null, undefined]) {
    assert.equal(targetFromUrl(bad, 'discourse'), null, `${String(bad)} should not parse`);
  }
  assert.equal(targetFromUrl('https://news.ycombinator.com/item?id=1', 'discourse'), null);

  assert.equal(channelForUrl('https://community.make.com/t/x/1'), 'discourse');
  assert.equal(channelForUrl('https://lemmy.world/post/1'), 'lemmy');
  assert.equal(channelForUrl('https://news.ycombinator.com/item?id=1'), null, 'HN has no write API and must never resolve to a channel');
  assert.equal(channelForUrl('https://softwarerecs.stackexchange.com/questions/1'), null);
});

test('every reason not to send is checked, and says which one it is', () => {
  const senders = [{ id: 's1', channel: 'discourse', host: 'community.n8n.io' }];

  assert.equal(maySend({}, person(), { senders }).ok, true);

  // The ceiling.
  const full = Array.from({ length: SENDS_PER_FINDING }, (_, i) => ({ personId: `p${i}` }));
  assert.match(maySend({}, person(), { senders, alreadySent: full }).reason, /ceiling/);

  // Never twice, by id or by the post itself.
  assert.match(maySend({}, person(), { senders, alreadySent: [{ personId: 'who_1' }] }).reason, /already been written to/);
  assert.match(maySend({}, person(), { senders, alreadySent: [{ url: person().url }] }).reason, /already been written to/);

  // The platform rules from core/reach.js, enforced rather than displayed.
  assert.match(maySend({}, person({ reply: 'careful', platform: 'Stack Exchange' }), { senders }).reason, /flag and delete/);
  assert.match(maySend({}, person({ reply: 'unknown' }), { senders }).reason, /nobody has checked/);
  assert.match(maySend({}, person({ reachability: 'anonymous' }), { senders }).reason, /no route/);
  assert.match(maySend({}, person({ reachability: 'named-only' }), { senders }).reason, /no route/);

  // Hacker News, by name: the refusal that survived.
  const hn = maySend({}, person({ url: 'https://news.ycombinator.com/item?id=1', platform: 'Hacker News' }), { senders });
  assert.equal(hn.ok, false);
  assert.match(hn.reason, /no write API/);
  assert.match(hn.reason, /still refused/);

  // No credential for that forum.
  assert.match(maySend({}, person({ url: 'https://community.make.com/t/x/1' }), { senders }).reason, /no Discourse forum credential/);

  // Hostile input must refuse, not throw.
  for (const bad of [null, undefined, {}, { url: 'nonsense' }]) {
    assert.doesNotThrow(() => maySend({}, bad, { senders }));
    assert.equal(maySend({}, bad, { senders }).ok, false);
  }
});

test('the email footer says who it is from and how to stop it, always', () => {
  const f = footerFor({ fromName: 'Hamza', fromEmail: 'h@example.com' });
  assert.match(f, /Hamza/);
  assert.match(f, /no thanks/);
  // Appended by the sender, never left to the drafter remembering.
  assert.ok(footerFor({}).length > 20, 'a missing name must not produce an empty footer');
});

test('an attempt is written down before the request, so a timeout leaves a trace', async () => {
  const ctx = await fixture();
  const finding = { id: 'f1', outbox: [] };
  const writes = [];
  const realPut = ctx.store.putFinding.bind(ctx.store);
  ctx.store.putFinding = async (f) => {
    writes.push(JSON.parse(JSON.stringify(f.outbox)));
    return realPut(f);
  };
  // A request that never answers is exactly the case this protects against.
  ctx.fetchImpl = async () => {
    throw new Error('socket hang up');
  };

  const out = await sendOne(finding, person(), 'hello there', ctx);
  assert.equal(out.sent, false);
  assert.match(out.reason, /socket hang up/);

  assert.ok(writes.length >= 2, 'the attempt is stored, then the outcome');
  assert.equal(writes[0][0].outcome, 'attempted', 'the FIRST write happens before the network call');
  assert.equal(writes[writes.length - 1][0].outcome, 'failed');

  // An unanswered request is never reported as "did not send" — it may well
  // have arrived, and saying otherwise would be a guess.
  const summary = outboxSummary({ outbox: [{ outcome: 'attempted' }] });
  assert.equal(summary.unconfirmed, 1);
  assert.equal(summary.failed, 0);
  assert.match(summary.line, /unconfirmed/);
});

test('preview produces exactly what would go out and touches no network', async () => {
  const ctx = await fixture();
  let called = false;
  ctx.fetchImpl = async () => {
    called = true;
    throw new Error('preview must not send');
  };

  const out = await sendOne({ id: 'f1', outbox: [] }, person(), 'I saw you posted about chasing invoices.', ctx, { preview: true });
  assert.equal(called, false, 'preview made a network call');
  assert.equal(out.preview, true);
  assert.equal(out.sent, false);
  assert.equal(out.channel, 'discourse');
  assert.equal(out.as, 'me', 'it says which account would post');
  assert.match(out.text, /I saw you posted/);
});

test('a real send records where it landed, and the ceiling stops the batch', async () => {
  const ctx = await fixture();
  const people = Array.from({ length: 8 }, (_, i) => person({ id: `who_${i}`, url: `https://community.n8n.io/t/slug/${1000 + i}` }));
  const drafts = people.map((p) => ({ personId: p.id, text: `hello ${p.id}` }));

  const batch = await sendBatch({ id: 'f1', outbox: [] }, people, drafts, ctx, { gapMs: 0 });
  assert.equal(batch.sent, SENDS_PER_FINDING, `should stop at ${SENDS_PER_FINDING}`);
  assert.equal(batch.finding.outbox.filter((o) => o.outcome === 'sent').length, SENDS_PER_FINDING);
  assert.match(batch.results[batch.results.length - 1].reason, /ceiling/);

  const s = outboxSummary(batch.finding);
  assert.equal(s.sent, SENDS_PER_FINDING);
  assert.equal(s.left, 0);

  // And the posted URL is kept, so you can go and read your own reply.
  assert.match(batch.finding.outbox[0].postedUrl, /community\.n8n\.io\/t\/12345\/4/);
});

test('a 200 that is not JSON is a login wall, not a posted reply', async () => {
  const ctx = await fixture();
  ctx.fetchImpl = async () => new Response('<html><body>Sign in</body></html>', { status: 200 });
  const out = await sendOne({ id: 'f1', outbox: [] }, person(), 'hi', ctx);
  assert.equal(out.sent, false);
  assert.match(out.reason, /not JSON/);
});

test('credentials never leave, and removing one really removes it', async () => {
  const store = await createStore({});
  // The in-memory store is a documented PROCESS singleton, so it carries the
  // senders the earlier tests in this file added. Cleared rather than worked
  // around: a count assertion that silently counts another test's rows is a
  // test that passes for the wrong reason.
  await store.setKv('outboxSenders', []);

  const bad = await addSender(store, { channel: 'discourse', host: 'community.n8n.io', token: 'k'.repeat(20) }, SECRET);
  assert.equal(bad.ok, false, 'Discourse posts as an account, so it needs the username');
  assert.match(bad.error, /username/);

  assert.match((await addSender(store, { channel: 'email', token: 'k'.repeat(20), fromEmail: 'nope' }, SECRET)).error, /not an address/);
  assert.match((await addSender(store, { channel: 'nonsense', token: 'x' }, SECRET)).error, /Pick a channel/);
  assert.match((await addSender(store, { channel: 'email', token: '' }, SECRET)).error, /No key/);

  const good = await addSender(store, { channel: 'discourse', host: 'community.n8n.io', username: 'me', token: 'k'.repeat(20) }, SECRET);
  assert.equal(good.ok, true);
  assert.equal(good.sender.token, undefined, 'the token must never come back to a caller');
  assert.equal(good.sender.hasToken, true);

  const listed = await listSenders(store);
  assert.equal(listed.length, 1);
  assert.equal(listed[0].token, undefined, 'listSenders must never carry a token');

  const resolved = await senderFor(store, 'https://community.n8n.io/t/x/1', SECRET);
  assert.equal(resolved.token, 'k'.repeat(20), 'and the sender itself can still read it');

  // A wrong secret reports the key as unreadable rather than sending with a
  // broken one and getting a 401 next Tuesday.
  assert.equal((await senderFor(store, 'https://community.n8n.io/t/x/1', 'y'.repeat(48))).unreadable, true);

  await removeSender(store, good.sender.id);
  assert.equal((await listSenders(store)).length, 0);
  // Really gone: a retired credential is a liability, not an audit trail.
  const raw = (await store.getKv('outboxSenders')).find((s) => s.id === good.sender.id);
  assert.equal(raw.token, null);
  assert.ok(raw.removedAt);
});
