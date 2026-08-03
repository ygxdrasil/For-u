/**
 * Reaching the people behind the quotes.
 *
 * Everything else in this system establishes that a demand is real: people ask
 * for it, and someone is paying SOMEBODY for a bad version. What none of it can
 * establish is the question that decides whether to build: what would they pay
 * YOU, and would they switch.
 *
 * That answer does not exist in any API. It only exists in a reply from a
 * person. So this module does the part a machine can do — work out who is
 * reachable, where a message is welcome, and what to say — and stops at the
 * point where a message would be sent.
 *
 * SHE DOES NOT SEND. That is one of the four limits set at the start and
 * described then as never negotiable. Every draft here ends up in front of you
 * with a copy button; nothing here has a network call in it. If that changes
 * it will change because it was asked for in words, not because a send seam
 * quietly appeared next to a draft.
 *
 * The second rule is about the ladder. A reply saying "I'd pay £30 a month" is
 * the most valuable sentence in this system and it is NOT evidence of payment.
 * Stated intent and revealed behaviour differ, reliably and in one direction:
 * people say yes and then do not pay. So conversations are recorded beside the
 * ladder and never inside it. computeEvidence cannot see them, which is
 * enforced by a test rather than by everyone remembering.
 */

import { nowIso, randomId, hostOf, clampNumber } from './util.js';

/**
 * What each platform allows, in its own terms rather than in ours.
 *
 * `reply` means posting in the public thread the quote came from — the normal
 * way to talk to someone on a forum, visible to everyone, and what these sites
 * are for. `dm` is a private message, which most of them either forbid for
 * unsolicited contact or do not offer at all.
 *
 * Checked against each platform's published rules. Where a route is refused
 * the reason is carried with it, because "you cannot" and "you cannot, because
 * their terms say unsolicited pitches get you banned" lead to different
 * decisions.
 */
export const CONTACT_POLICY = {
  'news.ycombinator.com': {
    label: 'Hacker News',
    reply: 'welcome',
    dm: 'none',
    note: 'Replying in the thread is normal. There is no private message feature at all; some users put an email in their profile, which is an invitation to use it.',
    profileMayHaveEmail: true,
  },
  'stackexchange.com': {
    label: 'Stack Exchange',
    reply: 'careful',
    dm: 'none',
    note: 'Comments must help answer the question. A comment that is really a research request will be flagged and deleted, and the account takes the hit. Prefer their profile, which often carries a website or email.',
    profileMayHaveEmail: true,
  },
  'stackoverflow.com': {
    label: 'Stack Overflow',
    reply: 'careful',
    dm: 'none',
    note: 'Same rules as the rest of the network: comments are for improving the question, not for reaching its author.',
    profileMayHaveEmail: true,
  },
  'lemmy.world': {
    label: 'Lemmy',
    reply: 'welcome',
    dm: 'allowed',
    note: 'Public reply is normal, and Lemmy does have private messages. Instance rules vary — the community sidebar is where a no-solicitation rule would be stated.',
    profileMayHaveEmail: false,
  },
  'community.shopify.com': {
    label: 'Shopify Community',
    reply: 'welcome',
    dm: 'allowed',
    note: 'A merchant forum where asking a merchant about their workflow is on-topic. Do not pitch a product in the thread; ask about what they do.',
    profileMayHaveEmail: false,
  },
  'community.n8n.io': {
    label: 'n8n Community',
    reply: 'welcome',
    dm: 'allowed',
    note: 'Discourse forum, technical audience, generally willing to talk about their own setup.',
    profileMayHaveEmail: false,
  },
  'community.make.com': {
    label: 'Make Community',
    reply: 'welcome',
    dm: 'allowed',
    note: 'Discourse forum. Same shape as n8n.',
    profileMayHaveEmail: false,
  },
  'github.com': {
    label: 'GitHub',
    reply: 'welcome',
    dm: 'none',
    note: 'Commenting on the issue is normal and public. Many profiles list an email, which GitHub publishes deliberately.',
    profileMayHaveEmail: true,
  },
};

/**
 * Sources that name a person but give no way to reach them.
 *
 * This is the uncomfortable part and it is stated rather than hidden: the
 * review feeds are the STRONGEST evidence in the system — they are people who
 * already pay, saying what is wrong — and they are the least contactable. A
 * review display name is not a route to anybody.
 */
export const NO_ROUTE = {
  'consumerfinance.gov': 'CFPB complaints are published with the complainant removed. There is no person here to reach, by design.',
  'apps.apple.com': 'App Store reviews carry a display name and no contact route of any kind.',
  'play.google.com': 'Play Store reviews carry a display name and no contact route of any kind.',
  'usaspending.gov': 'The award names a company rather than a person. That company is contactable through its own public details — this is the one records source where a real conversation is possible, but you find the route yourself.',
};

export const REACHABILITY = ['reply', 'profile', 'named-only', 'anonymous'];

/** What each host allows, falling back to "we do not know" rather than "yes". */
export function policyFor(url) {
  const host = hostOf(url);
  if (!host) return null;
  if (CONTACT_POLICY[host]) return { host, ...CONTACT_POLICY[host] };
  // Stack Exchange runs dozens of hostnames off one rulebook.
  const se = Object.keys(CONTACT_POLICY).find((k) => host === k || host.endsWith(`.${k}`));
  if (se) return { host, ...CONTACT_POLICY[se] };
  if (NO_ROUTE[host]) return { host, label: host, reply: 'none', dm: 'none', note: NO_ROUTE[host], profileMayHaveEmail: false };
  return {
    host,
    label: host,
    reply: 'unknown',
    dm: 'unknown',
    // Never "probably fine". An unknown platform is one whose rules nobody has
    // read, and guessing on someone else's behalf is how an account gets
    // banned for a message they did not write.
    note: 'Nobody has checked what this site allows. Read its rules before posting anything — an unsolicited message on the wrong forum costs you the account, not her.',
    profileMayHaveEmail: false,
  };
}

/**
 * Turn a finding's quotes into a list of people you could actually talk to.
 *
 * Ordered by how reachable they are, because a sheet that opens with four
 * anonymous review snippets reads as "nobody is contactable" even when six
 * named forum posters are further down.
 */
export function contactSheet(finding, { limit = 25 } = {}) {
  const words = Array.isArray(finding?.demand?.inTheirWords) ? finding.demand.inTheirWords : [];
  const seen = new Set();
  const people = [];

  for (const w of words) {
    if (!w?.url || seen.has(w.url)) continue;
    seen.add(w.url);
    const policy = policyFor(w.url);
    const handle = w.author?.handle ?? null;
    const profile = w.author?.profile ?? null;

    let reachability = 'anonymous';
    if (handle && policy?.reply === 'welcome') reachability = 'reply';
    else if (handle && profile) reachability = 'profile';
    else if (handle) reachability = 'named-only';

    people.push({
      id: randomId('who'),
      handle,
      profile,
      quote: String(w.quote ?? '').slice(0, 600),
      url: w.url,
      date: w.date ?? null,
      platform: policy?.label ?? w.platform ?? 'unknown',
      reachability,
      reply: policy?.reply ?? 'unknown',
      dm: policy?.dm ?? 'unknown',
      note: policy?.note ?? null,
      profileMayHaveEmail: Boolean(policy?.profileMayHaveEmail && profile),
    });
  }

  const rank = { reply: 0, profile: 1, 'named-only': 2, anonymous: 3 };
  people.sort((a, b) => rank[a.reachability] - rank[b.reachability]);

  const counts = people.reduce((m, p) => ({ ...m, [p.reachability]: (m[p.reachability] ?? 0) + 1 }), {});
  const contactable = people.filter((p) => p.reachability === 'reply' || p.reachability === 'profile').length;

  return {
    people: people.slice(0, clampNumber(limit, 1, 200, 25)),
    total: people.length,
    contactable,
    counts,
    // Said plainly, because "0 of 14 reachable" is a real answer about a
    // finding and it should not have to be counted off the screen.
    summary: contactable
      ? `${contactable} of ${people.length} can be reached where they posted.`
      : people.length
        ? `None of these ${people.length} can be reached: they are reviews and complaint records, which name people without giving any route to them.`
        : 'Nothing quoted on this finding carries an author, so there is nobody to reach.',
  };
}

/** The one thing worth asking, in the order that gets it answered. */
export const OPENER_GUIDANCE = `Write a short message to ONE person, to be sent by the person you are writing it for — never by you.

It must:
- Open by referring to what they actually said, quoting or paraphrasing their own words, so it is obvious this is not a mass message. Something in the shape of "I saw you posted about how annoying it is to <the specific thing they described>".
- Ask what they do about it TODAY, and what that costs them in money or in hours.
- Be three or four sentences. Nobody reads more from a stranger.

It must NOT:
- Pitch anything, name a product, or mention that something is being built.
- Name a price or ask whether they would pay a number. That question gets a polite lie; what they already spend is worth more than what they say they would spend.
- Flatter them, or open with "I hope this finds you well".
- Promise anything in return.

Sound like one person who read their post and got curious, because that is what is true.`;

export const OPENER_SCHEMA = {
  type: 'OBJECT',
  properties: {
    messages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          personId: { type: 'STRING', description: 'The id of the person this is for, copied exactly from the list given.' },
          opening: { type: 'STRING', description: 'The first sentence, referring to what they actually said.' },
          body: { type: 'STRING', description: 'The rest. Three or four sentences in total including the opening.' },
        },
        required: ['personId', 'opening', 'body'],
      },
    },
  },
  required: ['messages'],
};

function draftPrompt(people, finding) {
  return `A finding: ${finding?.demand?.oneLine ?? 'an unmet need'}
Who seems to have it: ${finding?.demand?.whoHasIt ?? 'unclear'}

Write one message per person below. Refer to what each of them specifically said — they are different people with different complaints, and a message that would fit any of them will be ignored by all of them.

${people
  .map(
    (p) => `--- personId: ${p.id}
posted on: ${p.platform}${p.handle ? ` as ${p.handle}` : ''}
what they said: "${p.quote.slice(0, 500)}"`,
  )
  .join('\n\n')}`;
}

/**
 * Draft one opener per person.
 *
 * Returns drafts, never sends them. The return shape deliberately has no
 * `sent` field and no endpoint: there is nothing here for a later change to
 * accidentally wire up.
 */
export async function draftOpeners(finding, people, deps) {
  const list = (Array.isArray(people) ? people : []).filter((p) => p?.id && p?.quote).slice(0, 10);
  if (!list.length) return { ok: false, drafts: [], note: 'nobody on this sheet can be written to' };
  if (!deps?.llm) {
    return { ok: false, drafts: [], note: 'no model is configured, so nothing is drafted. She will not paste a template with a blank in it and call it a message.' };
  }

  let json = null;
  try {
    const res = await deps.llm.generateJson({
      tier: 'judge',
      systemInstruction: OPENER_GUIDANCE,
      prompt: draftPrompt(list, finding),
      responseSchema: OPENER_SCHEMA,
      label: 'openers',
      timeoutMs: 30_000,
    });
    json = res.json;
  } catch (err) {
    return { ok: false, drafts: [], note: `could not draft (${err.message})` };
  }

  const byId = new Map(list.map((p) => [p.id, p]));
  const drafts = (json?.messages ?? [])
    .map((m) => {
      const person = byId.get(m.personId);
      if (!person) return null;
      const text = [m.opening, m.body].filter(Boolean).join(' ').trim();
      if (!text) return null;
      return {
        personId: person.id,
        handle: person.handle,
        url: person.url,
        platform: person.platform,
        // How to send it is the person's decision and the platform's rules,
        // both stated next to the words rather than assumed.
        how: person.reply === 'welcome' ? 'reply in the thread' : person.profile ? 'through their profile' : 'no clear route',
        caution: person.reply === 'careful' || person.reply === 'unknown' ? person.note : null,
        text: text.slice(0, 1200),
      };
    })
    .filter(Boolean);

  return { ok: drafts.length > 0, drafts, note: drafts.length ? null : 'the model returned nothing usable' };
}

// ---------------------------------------------------------------------------
// What came back
// ---------------------------------------------------------------------------

export const REPLY_VERDICTS = ['would-pay', 'interested-no-price', 'already-paying', 'not-interested', 'no-reply'];

/**
 * Record what a person actually said back.
 *
 * Stored on the finding under `conversations`, which is deliberately OUTSIDE
 * `evidence`. computeEvidence never reads it and there is a test that fails if
 * it ever does. A stated price is the best single piece of information you can
 * get about a market and it is still not proof that money moved.
 *
 * `already-paying` is the exception worth noticing: someone telling you what
 * they currently pay for an existing tool IS revealed behaviour, and belongs in
 * `evidence.paying` — but only with the URL of the thing they pay for, which is
 * why it is not promoted automatically here.
 */
export function recordConversation(finding, input, { now = nowIso } = {}) {
  const verdict = REPLY_VERDICTS.includes(input?.verdict) ? input.verdict : 'no-reply';
  const priceRaw = Number(input?.theyPayNowUsd);
  const entry = {
    id: randomId('conv'),
    personId: input?.personId ? String(input.personId).slice(0, 60) : null,
    handle: input?.handle ? String(input.handle).slice(0, 80) : null,
    url: input?.url ? String(input.url).slice(0, 500) : null,
    verdict,
    // What they said, in their words, held to the same standard as every other
    // quote in this system.
    said: String(input?.said ?? '').slice(0, 2000),
    // Two different numbers, never merged: what they pay today is a fact about
    // the world, what they say they would pay is a fact about a conversation.
    theyPayNowUsd: Number.isFinite(priceRaw) && priceRaw >= 0 ? Math.min(priceRaw, 1e6) : null,
    theySaidTheyWouldPayUsd: (() => {
      const n = Number(input?.theySaidTheyWouldPayUsd);
      return Number.isFinite(n) && n >= 0 ? Math.min(n, 1e6) : null;
    })(),
    askedAt: input?.askedAt ? String(input.askedAt).slice(0, 40) : now(),
    recordedAt: now(),
  };

  const existing = Array.isArray(finding?.conversations) ? finding.conversations : [];
  return { ...finding, conversations: [...existing, entry] };
}

/**
 * What the conversations add up to, for the finding and for Jason's packet.
 *
 * Never a level and never a score — a count and the actual numbers, so nobody
 * downstream can mistake it for the ladder.
 */
export function conversationSummary(finding) {
  const all = Array.isArray(finding?.conversations) ? finding.conversations : [];
  if (!all.length) return { asked: 0, replied: 0, line: 'Nobody has been asked yet.' };

  const replied = all.filter((c) => c.verdict !== 'no-reply');
  const wouldPay = replied.filter((c) => c.verdict === 'would-pay');
  const alreadyPaying = replied.filter((c) => c.verdict === 'already-paying');
  const no = replied.filter((c) => c.verdict === 'not-interested');
  const prices = replied.map((c) => c.theyPayNowUsd).filter((n) => Number.isFinite(n));

  return {
    asked: all.length,
    replied: replied.length,
    wouldPay: wouldPay.length,
    alreadyPaying: alreadyPaying.length,
    notInterested: no.length,
    paysNowUsd: prices.length ? { low: Math.min(...prices), high: Math.max(...prices), n: prices.length } : null,
    // The refusals are reported as loudly as the yeses. A tool that only
    // counted enthusiasm would be a machine for talking you into things.
    line: [
      `${replied.length} of ${all.length} asked replied`,
      wouldPay.length ? `${wouldPay.length} said they would pay` : null,
      alreadyPaying.length ? `${alreadyPaying.length} already pay for something` : null,
      no.length ? `${no.length} said no` : null,
      prices.length ? `they currently pay $${Math.min(...prices)}–$${Math.max(...prices)}` : null,
    ]
      .filter(Boolean)
      .join('. ') + '.',
  };
}
