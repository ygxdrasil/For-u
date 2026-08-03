import test from 'node:test';
import assert from 'node:assert/strict';

import { policyFor, contactSheet, draftOpeners, recordConversation, conversationSummary, CONTACT_POLICY, NO_ROUTE } from '../core/reach.js';

const quote = (url, handle = null, profile = null) => ({
  quote: 'I spend every Friday chasing unpaid invoices and it is killing me',
  url,
  via: 'direct-fetch',
  author: handle ? { handle, profile } : null,
});

test('a platform nobody has checked is never reported as safe to post on', () => {
  const unknown = policyFor('https://some-random-forum.example/thread/12');
  assert.equal(unknown.reply, 'unknown');
  assert.equal(unknown.dm, 'unknown');
  // The failure mode being prevented: a cheerful default that gets someone's
  // account banned for a message they did not write.
  assert.match(unknown.note, /Read its rules/i);

  // A known one carries its real rules, not a thumbs up.
  const se = policyFor('https://softwarerecs.stackexchange.com/questions/1');
  assert.equal(se.reply, 'careful', 'Stack Exchange comments are not a research channel');
  assert.match(se.note, /flagged and deleted/);

  // And the sources with no person behind them say so.
  const cfpb = policyFor('https://www.consumerfinance.gov/complaint/123');
  assert.equal(cfpb.reply, 'none');
  assert.match(cfpb.note, /complainant removed/);

  // Garbage in must not throw.
  for (const bad of [null, undefined, '', 'not a url', 42, {}]) {
    assert.doesNotThrow(() => policyFor(bad));
  }
});

test('the contact sheet leads with who can actually be reached', () => {
  const finding = {
    demand: {
      inTheirWords: [
        quote('https://www.consumerfinance.gov/c/1'),
        quote('https://apps.apple.com/review/2'),
        quote('https://news.ycombinator.com/item?id=3', 'bob', 'https://news.ycombinator.com/user?id=bob'),
        quote('https://softwarerecs.stackexchange.com/questions/4', 'carol', 'https://softwarerecs.stackexchange.com/users/9'),
      ],
    },
  };

  const sheet = contactSheet(finding);
  assert.equal(sheet.total, 4);
  assert.equal(sheet.contactable, 2, 'two named forum posters, two anonymous records');

  // Reachable people first — a sheet opening with two anonymous reviews reads
  // as "nobody is contactable" even when somebody is.
  assert.equal(sheet.people[0].handle, 'bob');
  assert.equal(sheet.people[0].reachability, 'reply');
  assert.equal(sheet.people[1].handle, 'carol');
  assert.equal(sheet.people[1].reachability, 'profile', 'Stack Exchange is careful, so the profile is the route, not the thread');
  assert.equal(sheet.people[3].reachability, 'anonymous');

  assert.match(sheet.summary, /2 of 4/);
});

test('a finding full of review evidence says plainly that nobody can be reached', () => {
  // The uncomfortable case, and the one most likely to be papered over: review
  // feeds are the STRONGEST evidence in the system and carry no route at all.
  const sheet = contactSheet({
    demand: { inTheirWords: [quote('https://apps.apple.com/r/1'), quote('https://play.google.com/r/2'), quote('https://www.consumerfinance.gov/c/3')] },
  });
  assert.equal(sheet.contactable, 0);
  assert.match(sheet.summary, /None of these 3 can be reached/);

  // And an empty finding does not claim anything either way.
  assert.match(contactSheet({}).summary, /nobody to reach/);
  assert.equal(contactSheet(null).total, 0);
});

test('duplicate quotes are one person, and a hostile finding does not throw', () => {
  const dupes = contactSheet({
    demand: {
      inTheirWords: [
        quote('https://news.ycombinator.com/item?id=1', 'bob'),
        quote('https://news.ycombinator.com/item?id=1', 'bob'),
        { quote: 'no url here' },
        null,
        { url: 'https://news.ycombinator.com/item?id=2' },
      ],
    },
  });
  assert.equal(dupes.total, 2, 'the same URL twice is one person');

  for (const bad of [null, undefined, 42, 'x', { demand: null }, { demand: { inTheirWords: 'not an array' } }]) {
    assert.doesNotThrow(() => contactSheet(bad), `contactSheet(${JSON.stringify(bad)}) threw`);
  }
});

test('drafting never sends, and refuses rather than pasting a template with a blank in it', async () => {
  const sheet = contactSheet({
    demand: { inTheirWords: [quote('https://news.ycombinator.com/item?id=3', 'bob', 'https://news.ycombinator.com/user?id=bob')] },
  });

  // No model: she says so rather than producing "Hi {name}".
  const none = await draftOpeners({}, sheet.people, {});
  assert.equal(none.ok, false);
  assert.match(none.note, /no model is configured/);

  let seenPrompt = null;
  const deps = {
    llm: {
      generateJson: async ({ prompt, systemInstruction }) => {
        seenPrompt = { prompt, systemInstruction };
        return { json: { messages: [{ personId: sheet.people[0].id, opening: 'I saw you posted about chasing unpaid invoices every Friday.', body: 'What do you do about it at the moment, and roughly what does that cost you in time or money?' }] } };
      },
    },
  };

  const out = await draftOpeners({ demand: { oneLine: 'invoice chasing' } }, sheet.people, deps);
  assert.equal(out.ok, true);
  assert.equal(out.drafts.length, 1);
  assert.equal(out.drafts[0].how, 'reply in the thread');
  assert.match(out.drafts[0].text, /I saw you posted about/);

  // The instruction must forbid the two things that ruin this: a pitch, and a
  // price question that gets a polite lie.
  assert.match(seenPrompt.systemInstruction, /NOT[\s\S]*Pitch anything/);
  assert.match(seenPrompt.systemInstruction, /Name a price/);
  assert.match(seenPrompt.systemInstruction, /never by you/);

  // Their actual words have to reach the drafter, or it cannot refer to them.
  assert.match(seenPrompt.prompt, /chasing unpaid invoices/);

  // Nothing in the result is a send. This is the limit that was set as
  // non-negotiable, so it is asserted rather than trusted.
  for (const d of out.drafts) {
    assert.equal(d.sent, undefined);
    assert.equal(d.endpoint, undefined);
    assert.equal(d.deliver, undefined);
  }

  // A draft for somebody not on the sheet is discarded, not shown against a
  // stranger's name.
  const wrong = await draftOpeners({}, sheet.people, {
    llm: { generateJson: async () => ({ json: { messages: [{ personId: 'who_nobody', opening: 'x', body: 'y' }] } }) },
  });
  assert.equal(wrong.drafts.length, 0);
});

test('what someone pays now and what they say they would pay are never the same number', () => {
  let f = { conversations: [] };
  f = recordConversation(f, { verdict: 'already-paying', said: 'I pay 45 a month for Tradify', theyPayNowUsd: 45 });
  f = recordConversation(f, { verdict: 'would-pay', said: 'I would pay about 30', theySaidTheyWouldPayUsd: 30 });
  f = recordConversation(f, { verdict: 'not-interested', said: 'A spreadsheet is fine' });
  f = recordConversation(f, { verdict: 'no-reply' });

  assert.equal(f.conversations.length, 4);
  assert.equal(f.conversations[0].theyPayNowUsd, 45);
  assert.equal(f.conversations[0].theySaidTheyWouldPayUsd, null, 'a real payment must not be copied into the stated-intent field');
  assert.equal(f.conversations[1].theyPayNowUsd, null, 'and a stated intent must not be copied into the real-payment field');

  const s = conversationSummary(f);
  assert.equal(s.asked, 4);
  assert.equal(s.replied, 3);
  assert.equal(s.notInterested, 1);
  assert.deepEqual(s.paysNowUsd, { low: 45, high: 45, n: 1 });
  assert.match(s.line, /1 said no/, 'refusals are reported as loudly as the yeses');

  // Hostile numbers stay numbers.
  for (const bad of [NaN, -5, Infinity, '30', null, undefined, {}]) {
    const one = recordConversation({}, { verdict: 'would-pay', theyPayNowUsd: bad, theySaidTheyWouldPayUsd: bad });
    const c = one.conversations[0];
    assert.ok(c.theyPayNowUsd === null || Number.isFinite(c.theyPayNowUsd), `theyPayNowUsd for ${String(bad)}`);
    assert.ok(c.theySaidTheyWouldPayUsd === null || Number.isFinite(c.theySaidTheyWouldPayUsd), `wouldPay for ${String(bad)}`);
  }

  // An unknown verdict is not invented into an optimistic one.
  assert.equal(recordConversation({}, { verdict: 'definitely-buying' }).conversations[0].verdict, 'no-reply');
});

test('every policy entry is complete, because a half-written one reads as permission', () => {
  for (const [host, p] of Object.entries(CONTACT_POLICY)) {
    assert.ok(p.label, `${host} has no label`);
    assert.ok(['welcome', 'careful', 'none', 'unknown'].includes(p.reply), `${host} reply="${p.reply}"`);
    assert.ok(['allowed', 'none', 'unknown'].includes(p.dm), `${host} dm="${p.dm}"`);
    assert.ok(p.note && p.note.length > 30, `${host} needs a note saying what the rules actually are`);
  }
  for (const [host, note] of Object.entries(NO_ROUTE)) {
    assert.ok(note.length > 30, `${host} needs to say why there is no route`);
  }
});
