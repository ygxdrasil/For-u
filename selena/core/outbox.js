/**
 * Sending. The one place in this system that speaks to a stranger.
 *
 * Everything else Selena does is reading. This module writes, to real people,
 * under your name — so it is built the way you build the part that can embarrass
 * you rather than the part that can waste a penny.
 *
 * The limit set at the start said she never sends messages on your behalf. That
 * was relaxed deliberately, in words, for three channels and no others. What
 * did NOT get relaxed is the reason behind it, so the shape here is:
 *
 *   credentials are ISSUED BY YOU, never taken
 *     A Discourse User API Key and a Lemmy token are things you generate for
 *     your own account and can revoke in one click. That is a different act
 *     from storing your password and logging in as you, which is still refused
 *     and is why Hacker News is not here: it has no write API at all, so the
 *     only way to post is to drive the web form with your session cookie.
 *
 *   nothing sends itself
 *     No scheduled path calls into this module. The unattended pass reads,
 *     roams, and hands findings over; it does not talk to anyone. A test
 *     asserts core/pass.js does not import this file, because that is the kind
 *     of thing that gets added later by someone being helpful.
 *
 *   five, then stop
 *     Per finding. Five personalised messages from a person doing research is
 *     research; fifty is a bot, and the account that gets banned is yours.
 *
 *   the same person is never messaged twice
 *     Enforced on the record, not on the caller remembering.
 *
 *   every attempt is written down before it is made
 *     A serverless function killed at its timeout returns nothing at all. If
 *     the record were written after the send, a timeout would produce a message
 *     that went out with no trace of it — the worst possible failure here.
 */

import { nowIso, randomId, hostOf, clampNumber, sleep } from './util.js';
import { encryptToken, decryptToken } from './peers.js';
import { assertFetchAllowed } from './sources.js';

export const SENDERS_KEY = 'outboxSenders';

/** Per finding, then she stops and waits for you. */
export const SENDS_PER_FINDING = 5;
/** Never faster than this, whatever the caller asks for. */
export const GAP_MS = 1500;

export const CHANNELS = {
  email: {
    label: 'Email',
    needs: ['token', 'fromEmail'],
    where: 'resend.com/api-keys',
    note: 'A Resend API key and a from-address on a domain you have verified. Nobody is impersonated: the key is hers, not a login to your inbox.',
  },
  discourse: {
    label: 'Discourse forum',
    needs: ['token', 'username', 'host'],
    where: 'your forum profile → Preferences → Security → API Keys',
    note: 'A User API Key you generate for your own account on that forum, and can revoke there in one click. Posts appear under your name.',
  },
  lemmy: {
    label: 'Lemmy',
    needs: ['token', 'host'],
    where: 'your Lemmy instance, via the login API',
    note: 'A JWT for your own account. Community rules still apply per community and several ban solicitation outright.',
  },
};

export const CHANNEL_NAMES = Object.keys(CHANNELS);

// ---------------------------------------------------------------------------
// Which post, on which forum
// ---------------------------------------------------------------------------

/**
 * Pull the thing to reply to out of a post URL.
 *
 * Parsed rather than guessed, and returns null rather than a plausible number:
 * posting to the wrong topic id puts your words under a stranger's unrelated
 * question, which is worse than not posting.
 */
export function targetFromUrl(url, channel) {
  const raw = String(url ?? '');
  if (channel === 'discourse') {
    // /t/some-slug/12345 or /t/some-slug/12345/6
    const m = raw.match(/\/t\/[^/]+\/(\d+)(?:\/(\d+))?/);
    if (!m) return null;
    return { topicId: Number(m[1]), postNumber: m[2] ? Number(m[2]) : null };
  }
  if (channel === 'lemmy') {
    const m = raw.match(/\/post\/(\d+)/);
    if (!m) return null;
    return { postId: Number(m[1]) };
  }
  return null;
}

/**
 * Which channel a URL belongs to, or null if we cannot post there at all.
 *
 * Matched on the HOST and the path shape together. The first version tested
 * `/\/t\//` against the whole URL and `/lemmy/` against the host, which made
 * `twitter.com/t/foo` a Discourse forum and `notlemmy.example` a Lemmy
 * instance. Neither could actually send — no credential would match the host —
 * but a channel guessed from a substring is the kind of thing that becomes a
 * misrouted post the moment somebody adds a wildcard.
 */
export function hostMatches(host, senderHost) {
  // Coerced, not trusted: hostOf can return null and a stored record can hold
  // anything. A comparison that throws here becomes a send that never happens
  // with no reason given.
  const a = typeof host === 'string' ? host.toLowerCase() : '';
  const b = typeof senderHost === 'string' ? senderHost.toLowerCase() : '';
  if (!a || !b) return false;
  // Exact, or a subdomain of it. Never a substring: "lemmy.world.evil.example"
  // must not match a credential for "lemmy.world".
  return a === b || a.endsWith(`.${b}`);
}

export function channelForUrl(url, senders = []) {
  const host = hostOf(url);
  if (!host) return null;

  // The credential is the authority, not the URL. You said what this host was
  // when you added the token, and no amount of pattern-matching on a hostname
  // beats being told. This also removes a whole class of guess: the first
  // version read `/t/` anywhere in the URL as Discourse and any host with
  // "lemmy" in it as Lemmy, which made twitter.com/t/foo a forum.
  const known = (Array.isArray(senders) ? senders : []).find((s) => s.host && hostMatches(host, s.host));
  if (known) return known.channel;

  // No credential. The shape is only used so the refusal can name the channel
  // you would need, and it is required to look like the real thing rather than
  // merely contain the right characters.
  const path = (() => {
    try {
      return new URL(String(url)).pathname;
    } catch {
      return '';
    }
  })();
  if (/^(community|forum|discuss|meta)\./i.test(host) && /^\/t\/[^/]+\/\d+/.test(path)) return 'discourse';
  if (/^\/post\/\d+/.test(path) && /^lemmy\.[^.]+$/i.test(host)) return 'lemmy';
  return null;
}

// ---------------------------------------------------------------------------
// Credentials you issued
// ---------------------------------------------------------------------------

const publicView = (s) => ({
  id: s.id,
  channel: s.channel,
  host: s.host,
  username: s.username,
  fromEmail: s.fromEmail,
  fromName: s.fromName,
  addedAt: s.addedAt,
  lastUsedAt: s.lastUsedAt,
  sends: s.sends ?? 0,
  // Never the token, in any form, to any caller.
  hasToken: Boolean(s.token),
});

export async function listSenders(store) {
  return ((await store.getKv(SENDERS_KEY)) ?? []).filter((s) => !s.removedAt).map(publicView);
}

export async function addSender(store, input, secret) {
  const channel = CHANNEL_NAMES.includes(input?.channel) ? input.channel : null;
  if (!channel) return { ok: false, error: `Pick a channel: ${CHANNEL_NAMES.join(', ')}.` };

  const token = String(input?.token ?? '').trim();
  if (!token) return { ok: false, error: 'No key or token was given.' };

  const spec = CHANNELS[channel];
  let host = null;
  if (spec.needs.includes('host')) {
    host = hostOf(input?.host?.startsWith('http') ? input.host : `https://${input?.host ?? ''}`);
    if (!host) return { ok: false, error: 'That forum address is not a hostname I can read. Give it as community.example.com.' };
    // Same policy as reading. A host we refuse to fetch is a host we refuse to
    // post to, and for the same reason.
    try {
      assertFetchAllowed(`https://${host}/`);
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
  if (spec.needs.includes('username') && !String(input?.username ?? '').trim()) {
    return { ok: false, error: 'Discourse needs the username the key belongs to — it posts as that account.' };
  }
  if (spec.needs.includes('fromEmail')) {
    const from = String(input?.fromEmail ?? '').trim();
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(from)) return { ok: false, error: 'That is not an address email will send from.' };
  }

  const all = (await store.getKv(SENDERS_KEY)) ?? [];
  const sender = {
    id: randomId('send'),
    channel,
    host,
    username: String(input?.username ?? '').slice(0, 80) || null,
    fromEmail: String(input?.fromEmail ?? '').slice(0, 200) || null,
    fromName: String(input?.fromName ?? '').slice(0, 80) || null,
    token: encryptToken(token, secret),
    addedAt: nowIso(),
    lastUsedAt: null,
    sends: 0,
    removedAt: null,
  };
  await store.setKv(SENDERS_KEY, [...all, sender]);
  return { ok: true, sender: publicView(sender) };
}

/**
 * Forget one.
 *
 * Really removed, like a cleared API key and unlike a finding: a credential you
 * have retired is a liability rather than a record. What is kept is that it
 * existed and when it went.
 */
export async function removeSender(store, id) {
  const all = (await store.getKv(SENDERS_KEY)) ?? [];
  const found = all.find((s) => s.id === id);
  if (!found) return { ok: true, removed: false };
  await store.setKv(
    SENDERS_KEY,
    all.map((s) => (s.id === id ? { id: s.id, channel: s.channel, host: s.host, removedAt: nowIso(), token: null } : s)),
  );
  return { ok: true, removed: true };
}

/** The credential that can post to this URL, if you have issued one. */
export async function senderFor(store, url, secret, { channel = null } = {}) {
  const want = channel ?? channelForUrl(url) ?? 'email';
  const host = hostOf(url);
  const all = ((await store.getKv(SENDERS_KEY)) ?? []).filter((s) => !s.removedAt && s.channel === want);
  const match = want === 'email' ? all[0] : all.find((s) => hostMatches(host, s.host));
  if (!match) return null;
  const token = match.token ? decryptToken(match.token, secret) : null;
  if (!token) return { ...publicView(match), token: null, unreadable: true };
  return { ...publicView(match), token };
}

// ---------------------------------------------------------------------------
// May we send this, at all
// ---------------------------------------------------------------------------

/**
 * Every reason not to send, checked before anything leaves.
 *
 * Returns the reason in words rather than a boolean, because "she did not send
 * it" and "she did not send it because you have already asked this person" are
 * different facts and only one of them is a problem.
 */
export function maySend(finding, person, { senders = [], alreadySent = [] } = {}) {
  const sent = Array.isArray(alreadySent) ? alreadySent : [];

  if (sent.length >= SENDS_PER_FINDING) {
    return { ok: false, reason: `${sent.length} messages have already gone out for this finding, which is her ceiling. Read the replies before sending more.` };
  }
  if (sent.some((s) => s.personId === person?.id || (s.url && s.url === person?.url))) {
    return { ok: false, reason: 'this person has already been written to about this finding' };
  }
  if (!person?.url) {
    return { ok: false, reason: 'there is no post to reply to' };
  }

  // The platform's own rules, from core/reach.js, enforced rather than shown.
  if (person.reachability === 'anonymous' || person.reachability === 'named-only') {
    return { ok: false, reason: 'there is no route to this person — a display name on a review is not a way to reach anybody' };
  }
  if (person.reply === 'careful') {
    return { ok: false, reason: `${person.platform} treats an off-topic comment as something to flag and delete. Use their profile instead; she will not post it for you.` };
  }
  if (person.reply === 'unknown') {
    return { ok: false, reason: 'nobody has checked what this site allows, and she will not be the one to find out with your account' };
  }

  const channel = channelForUrl(person.url, senders);
  if (!channel) {
    return { ok: false, reason: `there is no write API for ${person.platform}. Posting there would mean driving the website as you, which is the thing that is still refused.` };
  }
  const sender = senders.find((s) => s.channel === channel && (!s.host || hostMatches(hostOf(person.url), s.host)));
  if (!sender) {
    return { ok: false, reason: `no ${CHANNELS[channel].label} credential has been added for ${hostOf(person.url)}` };
  }
  if (!targetFromUrl(person.url, channel)) {
    return { ok: false, reason: 'that link does not name a specific post, so there is nothing to reply to' };
  }

  return { ok: true, channel, senderId: sender.id };
}

// ---------------------------------------------------------------------------
// The footer, which is not optional
// ---------------------------------------------------------------------------

/**
 * Who this is from and how to make it stop.
 *
 * Required on email and appended whether the drafter remembered it or not.
 * Contacting a business for genuine research is generally defensible; doing it
 * without saying who you are is not, and "the model was supposed to include
 * it" is not a control.
 */
export function footerFor({ fromName, fromEmail }) {
  const who = fromName || fromEmail || 'the sender';
  return `\n\n—\n${who}. I'm researching this properly rather than selling anything; reply "no thanks" and I won't write again.`;
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

async function postDiscourse(sender, person, text, fetchImpl, timeoutMs) {
  const target = targetFromUrl(person.url, 'discourse');
  const url = `https://${sender.host}/posts.json`;
  assertFetchAllowed(url);
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Api-Key': sender.token,
      'Api-Username': sender.username,
    },
    body: JSON.stringify({ topic_id: target.topicId, raw: text }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${sender.host} answered ${res.status}: ${body.slice(0, 240)}`);
  let json = null;
  try {
    json = JSON.parse(body);
  } catch {
    // A 200 that is not JSON is a login wall or a proxy, not a posted reply.
    throw new Error(`${sender.host} answered 200 with something that is not JSON, which usually means a login page rather than a posted reply`);
  }
  return { id: json?.id ?? null, url: json?.post_number && json?.topic_id ? `https://${sender.host}/t/${json.topic_id}/${json.post_number}` : person.url };
}

async function postLemmy(sender, person, text, fetchImpl, timeoutMs) {
  const target = targetFromUrl(person.url, 'lemmy');
  const url = `https://${sender.host}/api/v3/comment`;
  assertFetchAllowed(url);
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${sender.token}` },
    body: JSON.stringify({ post_id: target.postId, content: text }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${sender.host} answered ${res.status}: ${body.slice(0, 240)}`);
  let json = null;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(`${sender.host} answered 200 with something that is not JSON`);
  }
  return { id: json?.comment_view?.comment?.id ?? null, url: json?.comment_view?.comment?.ap_id ?? person.url };
}

async function postEmail(sender, person, text, subject, fetchImpl, timeoutMs) {
  const url = 'https://api.resend.com/emails';
  assertFetchAllowed(url);
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${sender.token}` },
    body: JSON.stringify({
      from: sender.fromName ? `${sender.fromName} <${sender.fromEmail}>` : sender.fromEmail,
      to: [person.email],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`the mail API answered ${res.status}: ${body.slice(0, 240)}`);
  let json = null;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error('the mail API answered 200 with something that is not JSON');
  }
  return { id: json?.id ?? null, url: null };
}

/**
 * Send one message.
 *
 * `preview: true` returns exactly what would go out, byte for byte, and touches
 * no network. That is the only honest way to check a message before it is
 * irreversible, and it is what the interface calls first.
 */
export async function sendOne(finding, person, draftText, ctx, { preview = false, subject = null, timeoutMs = 20_000 } = {}) {
  // Resolved here rather than demanded from the caller. createContext does not
  // put the session secret on ctx — the connectors facade looks it up the same
  // lazy way — and requiring it would have meant every call site remembering,
  // which is how one of them ends up not remembering.
  const secret =
    ctx.sessionSecret ??
    (await (async () => {
      const { getSessionSecret } = await import('./password.js');
      return getSessionSecret(ctx.store, ctx.env ?? process.env);
    })());

  const senders = await listSenders(ctx.store);
  const outbox = Array.isArray(finding?.outbox) ? finding.outbox : [];

  const hasEmail = Boolean(person?.email);
  const gate = hasEmail
    ? // Email does not go through the forum-policy gate: an address someone
      // published IS the route, and there is no thread to be off-topic in.
      (() => {
        if (outbox.length >= SENDS_PER_FINDING) return { ok: false, reason: `${outbox.length} messages have already gone out for this finding, which is her ceiling.` };
        if (outbox.some((s) => s.personId === person.id || s.to === person.email)) return { ok: false, reason: 'this person has already been written to about this finding' };
        const s = senders.find((x) => x.channel === 'email');
        return s ? { ok: true, channel: 'email', senderId: s.id } : { ok: false, reason: 'no sending address has been added' };
      })()
    : maySend(finding, person, { senders, alreadySent: outbox });

  if (!gate.ok) return { ok: false, sent: false, reason: gate.reason };

  const sender = await senderFor(ctx.store, person.url, secret, { channel: gate.channel });
  if (!sender) return { ok: false, sent: false, reason: 'the credential for that channel could not be found' };
  if (!sender.token) return { ok: false, sent: false, reason: 'its key could not be decrypted — SESSION_SECRET has changed since it was saved, so add the key again' };

  const line = gate.channel === 'email' ? `${draftText}${footerFor(sender)}` : draftText;
  const subjectLine = subject || `About your post on ${person.platform}`;

  if (preview) {
    return {
      ok: true,
      sent: false,
      preview: true,
      channel: gate.channel,
      as: gate.channel === 'email' ? sender.fromEmail : sender.username,
      to: person.email ?? person.handle,
      where: person.url,
      subject: gate.channel === 'email' ? subjectLine : null,
      text: line,
    };
  }

  // Written down BEFORE the request. A function killed at its timeout returns
  // nothing at all — if the record were written after, a timeout would leave a
  // message that went out with no trace of it, which is the one outcome here
  // that cannot be recovered from.
  const attempt = {
    id: randomId('out'),
    personId: person.id ?? null,
    handle: person.handle ?? null,
    to: person.email ?? null,
    url: person.url ?? null,
    channel: gate.channel,
    text: line.slice(0, 4000),
    attemptedAt: nowIso(),
    // Four outcomes, not two. "attempted" is the honest state for a request
    // that was made and whose answer was never seen.
    outcome: 'attempted',
    detail: null,
    postedUrl: null,
  };
  const withAttempt = { ...finding, outbox: [...outbox, attempt] };
  await ctx.store.putFinding(withAttempt);

  let result = null;
  let error = null;
  try {
    if (gate.channel === 'discourse') result = await postDiscourse(sender, person, line, ctx.fetchImpl, timeoutMs);
    else if (gate.channel === 'lemmy') result = await postLemmy(sender, person, line, ctx.fetchImpl, timeoutMs);
    else result = await postEmail(sender, person, line, subjectLine, ctx.fetchImpl, timeoutMs);
  } catch (err) {
    error = err.message;
  }

  const settled = {
    ...attempt,
    outcome: error ? 'failed' : 'sent',
    detail: error,
    postedUrl: result?.url ?? null,
    settledAt: nowIso(),
  };
  const finalFinding = {
    ...withAttempt,
    outbox: withAttempt.outbox.map((o) => (o.id === attempt.id ? settled : o)),
  };
  await ctx.store.putFinding(finalFinding);

  // Counted on the credential itself. These two fields existed from the start,
  // were shown in Settings, and were never once written — a number that can
  // only ever read zero is worse than no number, because it looks like an
  // answer. For a credential that posts under your name, "12 messages, last
  // used three days ago" is worth knowing.
  if (!error) {
    try {
      const all = (await ctx.store.getKv(SENDERS_KEY)) ?? [];
      await ctx.store.setKv(
        SENDERS_KEY,
        all.map((s) => (s.id === sender.id ? { ...s, sends: clampNumber(s.sends, 0, 1e9, 0) + 1, lastUsedAt: nowIso() } : s)),
      );
    } catch {
      // A counter that cannot be written must never be the reason a message
      // that already went out is reported as failed.
    }
  }

  await ctx.store.addActivity({
    kind: 'finding',
    level: error ? 'error' : 'report',
    message: error
      ? `could not send to ${person.handle ?? person.email ?? 'them'}: ${error}`
      : `sent to ${person.handle ?? person.email} on ${gate.channel}`,
    findingId: finding.id,
  });

  return { ok: !error, sent: !error, reason: error, channel: gate.channel, postedUrl: result?.url ?? null, finding: finalFinding, left: SENDS_PER_FINDING - finalFinding.outbox.length };
}

/**
 * Several, one after another, stopping at the ceiling.
 *
 * Sequential with a gap on purpose. A burst of five posts in two seconds from
 * one account is what a forum's rate limiter is looking for, and being caught
 * by one costs the account rather than the request.
 */
export async function sendBatch(finding, people, drafts, ctx, { limit = SENDS_PER_FINDING, gapMs = GAP_MS, preview = false } = {}) {
  const results = [];
  let current = finding;
  const max = clampNumber(limit, 1, SENDS_PER_FINDING, SENDS_PER_FINDING);

  for (const person of people ?? []) {
    if (results.filter((r) => r.sent).length >= max) {
      results.push({ personId: person?.id, ok: false, sent: false, reason: 'her ceiling for this finding was reached' });
      break;
    }
    if (ctx.deadline?.tooLateFor(8_000)) {
      results.push({ personId: person?.id, ok: false, sent: false, reason: 'ran out of time; nothing further was attempted' });
      break;
    }
    const draft = (drafts ?? []).find((d) => d.personId === person?.id);
    if (!draft?.text) {
      results.push({ personId: person?.id, ok: false, sent: false, reason: 'no draft was written for this person' });
      continue;
    }
    const out = await sendOne(current, person, draft.text, ctx, { preview });
    if (out.finding) current = out.finding;
    results.push({ personId: person?.id, handle: person?.handle, ...out, finding: undefined });
    if (!preview && out.sent) await sleep(gapMs);
  }

  return { results, finding: current, sent: results.filter((r) => r.sent).length };
}

/** What has gone out, for the finding page and for Jason's packet. */
export function outboxSummary(finding) {
  const all = Array.isArray(finding?.outbox) ? finding.outbox : [];
  if (!all.length) return { sent: 0, failed: 0, left: SENDS_PER_FINDING, line: 'Nothing has been sent.' };
  const sent = all.filter((o) => o.outcome === 'sent');
  const failed = all.filter((o) => o.outcome === 'failed');
  const unknown = all.filter((o) => o.outcome === 'attempted');
  return {
    sent: sent.length,
    failed: failed.length,
    // Never folded into "failed". A request whose answer was never seen may
    // well have arrived, and saying it did not would be a guess.
    unconfirmed: unknown.length,
    left: Math.max(0, SENDS_PER_FINDING - all.length),
    line: [
      `${sent.length} sent`,
      failed.length ? `${failed.length} failed` : null,
      unknown.length ? `${unknown.length} unconfirmed — the request was made and the answer never came back` : null,
      `${Math.max(0, SENDS_PER_FINDING - all.length)} left before she stops`,
    ]
      .filter(Boolean)
      .join(', ') + '.',
  };
}
