/**
 * End-to-end check of Grace's pipeline with the model stubbed out.
 *
 * Covers everything a real conversation touches — SSE framing, the storage
 * layer, context assembly, profile extraction, compaction, login, and the
 * confirmation guardrails — without needing an API key. What it deliberately
 * does not prove is that the Gemini call itself succeeds; only a real key does
 * that.
 *
 * Run with: npm run selftest
 */

import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync, rmSync} from 'node:fs';
import type {AddressInfo} from 'node:net';
import type {ChatEvent, ProfileEntry} from '../shared/types';
import {createApi} from '../server/api';
import {config} from '../server/config';
import {GeminiProvider} from '../server/llm/gemini';
import {setProvider} from '../server/llm/index';
import type {
  GenerateRequest,
  LlmProvider,
  SpeakRequest,
  SpokenAudio,
  TranscribeRequest,
  Turn,
} from '../server/llm/types';
import {
  clearConversation,
  getMessages,
  getProfile,
  getSummarizedThrough,
  getSummary,
  recentTurns,
} from '../server/memory';
import {CHUNK_TARGET, chunkForSpeech} from '../shared/speech';
import {recentDeeds} from '../server/journal';
import {setMode} from '../server/modes';
import {pulse} from '../server/pulse';
import {setBackend} from '../server/store/index';
import {allTools, auditTools, declarations, runTool} from '../server/tools/index';
import {allReminders, outstanding} from '../server/tools/reminders';
import type {Backend} from '../server/store/types';

const REPLY_CHUNKS = ['Good morning. ', 'Nothing pressing today. ', 'Tea at four?'];
const REPLY = REPLY_CHUNKS.join('');
const LEARNED_FACT = 'Prefers tea in the afternoon';
const TRANSCRIBED = 'What is on today?';
/** A valid, empty WAV — enough for the route to be exercised end to end. */
const SPOKEN_AUDIO =
  'UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';

/** Stands in for Gemini, and records what it was asked. */
class StubProvider implements LlmProvider {
  readonly name = 'stub';
  readonly model = 'stub-model';
  lastSystem = '';
  lastTurns: Turn[] = [];

  lastSearch: boolean | undefined = undefined;
  lastTools: {name: string}[] | undefined = undefined;
  /** Set to make the next reply call a tool, as the real model would. */
  nextToolCall: {name: string; args: Record<string, unknown>} | null = null;

  async *stream(request: GenerateRequest): AsyncIterable<string> {
    this.lastSystem = request.system;
    this.lastTurns = request.turns;
    this.lastSearch = request.search;
    this.lastTools = request.tools as {name: string}[] | undefined;

    if (this.nextToolCall && request.onToolCall) {
      const {name, args} = this.nextToolCall;
      this.nextToolCall = null;
      // Exactly what the provider does: hand onToolUsed whatever onToolCall
      // returned. That is the seam the display summary used to fall through.
      const result = await request.onToolCall(name, args);
      request.onToolUsed?.(name, result);
    }

    for (const chunk of REPLY_CHUNKS) yield chunk;
  }

  async complete(request: GenerateRequest): Promise<string> {
    this.lastSearch = request.search;
    // The JSON-shaped request is profile extraction; the other is summarising.
    if (request.json) {
      return JSON.stringify({
        entries: [{kind: 'preference', text: LEARNED_FACT, source: 'stated'}],
      });
    }
    return 'Earlier, they discussed the day ahead and settled on tea at four.';
  }

  lastAudio: TranscribeRequest | null = null;

  async transcribe(request: TranscribeRequest): Promise<string> {
    this.lastAudio = request;
    return TRANSCRIBED;
  }

  lastSpoken: string | null = null;

  async speak(request: SpeakRequest): Promise<SpokenAudio> {
    this.lastSpoken = request.text;
    return {audio: SPOKEN_AUDIO, mimeType: 'audio/wav'};
  }
}

/** Stands in for Redis, so the cloud path is exercised without a network. */
class MemoryBackend implements Backend {
  readonly name = 'in-memory';
  private data = new Map<string, string>();
  readonly quarantined: string[] = [];

  async read(key: string) {
    return this.data.get(key) ?? null;
  }
  async write(key: string, value: string) {
    this.data.set(key, value);
  }
  async quarantine(key: string, value: string) {
    this.quarantined.push(key);
    this.data.delete(key);
    void value;
  }
}

/** Only ever used to inspect the request it would build. */
const provider = new GeminiProvider('unused', 'gemini-2.5-flash-lite');

const stub = new StubProvider();
setProvider(stub);

const backend = new MemoryBackend();
setBackend(backend);

const checks: string[] = [];
function ok(label: string) {
  checks.push(label);
  console.log(`  ✓ ${label}`);
}

const server = createApi().listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

/** Set once login succeeds, and sent on everything afterwards. */
let cookie = '';

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? {cookie} : {}),
      ...(init.headers ?? {}),
    },
  });
}

async function chat(text: string, via: 'voice' | 'text' = 'text') {
  const response = await call('/chat', {
    method: 'POST',
    body: JSON.stringify({text, via}),
  });
  assert.equal(response.status, 200, 'chat should stream, not error');

  return (await response.text())
    .split('\n\n')
    .filter((frame) => frame.trim().startsWith('data:'))
    .map((frame) => JSON.parse(frame.trim().slice(5)) as ChatEvent);
}

async function reflect(): Promise<ProfileEntry[]> {
  const response = await call('/reflect', {method: 'POST'});
  assert.equal(response.status, 200);
  return ((await response.json()) as {learned: ProfileEntry[]}).learned;
}

try {
  console.log('\nGrace self-test (model and storage stubbed)\n');

  // ---- deploy config points at files that exist --------------------------
  // A stale pattern here fails the build with "doesn't match any Serverless
  // Functions", which costs a whole deploy cycle to discover. It has happened.
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    functions?: Record<string, unknown>;
  };
  for (const pattern of Object.keys(vercel.functions ?? {})) {
    assert.ok(
      existsSync(pattern),
      `vercel.json declares "${pattern}", but no such file exists`,
    );
  }
  assert.ok(
    existsSync('api/[...path].js'),
    'the bundled function must be committed, not generated at deploy time',
  );
  ok('vercel.json function patterns match files that exist');

  // ---- the lock ----------------------------------------------------------
  assert.equal((await call('/state')).status, 401, 'locked before signing in');
  ok('closed to anyone without the password');

  const wrong = await call('/login', {
    method: 'POST',
    body: JSON.stringify({password: 'not-it'}),
  });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.headers.get('set-cookie'), null, 'no session on a bad password');
  ok('wrong password refused, and hands out no session');

  const right = await call('/login', {
    method: 'POST',
    body: JSON.stringify({password: process.env.GRACE_PASSWORD}),
  });
  assert.equal(right.status, 200);
  const issued = right.headers.get('set-cookie');
  assert.ok(issued, 'a session cookie should be issued');
  assert.match(issued, /HttpOnly/, 'the cookie must be out of reach of scripts');
  cookie = issued.split(';')[0];
  ok('correct password opens a HttpOnly session');

  const forged = await call('/state', {headers: {cookie: 'grace_session=9999999999999.deadbeef'}});
  assert.equal(forged.status, 401, 'a made-up signature must not pass');
  ok('forged session cookie rejected');

  assert.equal((await call('/state')).status, 200);
  ok('signed in, and she opens up');

  // ---- a single exchange, start to finish -------------------------------
  const events = await chat('Morning, Grace.', 'voice');

  const deltas = events.filter((e) => e.type === 'delta');
  assert.equal(
    deltas.map((e) => (e.type === 'delta' ? e.text : '')).join(''),
    REPLY,
    'streamed deltas should reassemble into the full reply',
  );
  ok(`reply streamed in ${deltas.length} pieces and reassembled intact`);

  const done = events.find((e) => e.type === 'done');
  assert.ok(done && done.type === 'done', 'a done event should close the stream');
  assert.equal(done.message.text, REPLY);
  assert.equal(done.message.via, 'voice', 'reply should inherit the input mode');
  ok('done event carries the finished message');

  // ---- reflection, as its own request ------------------------------------
  const learned = await reflect();
  assert.equal(learned[0]?.text, LEARNED_FACT);
  assert.equal((await getProfile()).entries[0].text, LEARNED_FACT);
  ok('reflect extracted a durable fact after the reply, not during it');

  assert.equal((await getMessages()).length, 2, 'both sides of the exchange stored');
  ok('conversation and profile persisted through the storage layer');

  // ---- the model actually receives context -------------------------------
  await chat('And this afternoon?');
  assert.equal(stub.lastTurns.length, 3, 'prior turns should be replayed');
  assert.equal(stub.lastTurns[1].role, 'assistant');
  assert.equal(stub.lastTurns[2].text, 'And this afternoon?');
  ok('prior turns replayed to the model in the right roles');

  assert.match(stub.lastSystem, /never send a message/i);
  assert.match(stub.lastSystem, /never spend money/i);
  ok('hard limits present in every system prompt');

  assert.match(stub.lastSystem, new RegExp(LEARNED_FACT, 'i'));
  ok('learned facts fed back into the system prompt');

  const before = (await getProfile()).entries.length;
  await chat('Tea again?');
  await reflect();
  assert.equal((await getProfile()).entries.length, before, 'same fact twice is one fact');
  ok('repeat facts deduplicated rather than stacking up');

  // ---- hearing -----------------------------------------------------------
  // The route that replaced the browser's own speech recognition, which does
  // not exist in Firefox or on iOS and failed silently everywhere else.
  const spoken = await call('/transcribe', {
    method: 'POST',
    body: JSON.stringify({audio: 'ZmFrZS13YXY=', mimeType: 'audio/wav'}),
  });
  assert.equal(spoken.status, 200);
  assert.equal(((await spoken.json()) as {text: string}).text, TRANSCRIBED);
  assert.equal(stub.lastAudio?.mimeType, 'audio/wav', 'audio reaches the model');
  ok('recorded speech is transcribed server-side');

  // Recognising a name is the difference between "tell Yusuf I'll be late" and
  // "tell you soon I'll be late", so what she already knows has to reach the
  // transcriber. Without this the hint could quietly stop being sent and only
  // show up as her mishearing people slightly more often.
  assert.match(
    stub.lastAudio?.context ?? '',
    new RegExp(LEARNED_FACT),
    'what she knows about the speaker must reach the transcriber',
  );
  assert.match(
    stub.lastAudio?.context ?? '',
    /The conversation so far:[\s\S]*Grace: /,
    'and so must the most recent turns, labelled by who said them',
  );
  ok('transcription is given names and topic to recognise');

  const noAudio = await call('/transcribe', {
    method: 'POST',
    body: JSON.stringify({mimeType: 'audio/wav'}),
  });
  assert.equal(noAudio.status, 400, 'an empty recording is rejected, not sent on');
  ok('empty recording refused with a reason');

  assert.equal(
    (await call('/transcribe', {method: 'POST', body: '{}'})).status,
    400,
    'transcription must require audio',
  );
  ok('transcription endpoint validates its input');

  // ---- her voice ---------------------------------------------------------
  // Generated here rather than by the browser, which has no speech synthesis
  // at all on some platforms and a different voice on every other.
  const voice = await call('/speak', {
    method: 'POST',
    body: JSON.stringify({text: 'Good morning.'}),
  });
  assert.equal(voice.status, 200);
  const voiceBody = (await voice.json()) as {audio: string; mimeType: string};
  assert.equal(voiceBody.mimeType, 'audio/wav', 'audio must be playable as-is');
  assert.equal(
    Buffer.from(voiceBody.audio, 'base64').subarray(0, 4).toString(),
    'RIFF',
    'the audio must actually be a WAV, header and all',
  );
  assert.equal(stub.lastSpoken, 'Good morning.', 'the words reach the model');
  ok('replies are spoken as server-generated audio');

  assert.equal(
    (await call('/speak', {method: 'POST', body: JSON.stringify({text: '  '})})).status,
    400,
    'speaking must require something to say',
  );
  ok('speech endpoint validates its input');

  // ---- the web -----------------------------------------------------------
  // Grounding has to be asked for on the chat call, and must never be asked
  // for alongside a forced JSON shape — providers reject the combination, and
  // that would take profile extraction down with it.
  // Searching is a tool now, not a mode on the conversation. Gemini rejects
  // its built-in search alongside function calling outright, so the request
  // that carries her tools must never also ask for grounding.
  await chat('What is the weather doing?');
  assert.notEqual(
    stub.lastSearch,
    true,
    'the conversation itself must not request grounding',
  );
  assert.ok(
    (stub.lastTools ?? []).some((tool) => tool.name === 'search_web'),
    'she should be given the web as something she can reach for',
  );
  ok('the web is a tool she chooses, not a mode on every request');

  // The bug this guards against cost her the web for days without an error
  // anywhere: the search tool was attached, deliberation was switched off, and
  // deciding to call a tool *is* deliberation — so she answered from memory
  // and then said, quite correctly, that she could not browse.
  const grounded = provider.params({
    system: 's',
    turns: [{role: 'user', text: 'what is the news?'}],
    fast: true,
    search: true,
  });
  assert.ok(grounded.config.tools, 'the search tool should be attached');

  // Gemini rejects the two together outright: "Built-in tools and Function
  // Calling cannot be combined in the same request." Shipping both meant that
  // the moment she was given hands, she lost the web. Searching is a function
  // now, so no request may ever carry both again.
  for (const req of [
    {system: 's', turns: [], search: true, tools: declarations()},
    {system: 's', turns: [], search: true},
    {system: 's', turns: [], tools: declarations()},
  ]) {
    const kinds = ((provider.params(req).config.tools ?? []) as Record<string, unknown>[])
      .map((entry) => Object.keys(entry)[0]);
    assert.ok(
      !(kinds.includes('googleSearch') && kinds.includes('functionDeclarations')),
      'built-in search and function calling must never be sent together',
    );
  }
  ok('search and function calling are never combined in one request');
  // Deciding to call a tool is itself deliberation, so a zero budget leaves
  // the tool present and unused — she answers from memory and then says she
  // cannot reach the web. It must be small, for the sake of the pause before
  // she speaks, and it must not be nothing.
  const budget = grounded.config.thinkingConfig?.thinkingBudget;
  assert.ok(
    budget === undefined || budget > 0,
    `thinking must not be switched off while a tool is attached, got ${budget}`,
  );
  assert.ok(
    budget === undefined || budget <= 1024,
    `and must stay small, or every reply waits on it — got ${budget}`,
  );

  const plain = provider.params({
    system: 's',
    turns: [{role: 'user', text: 'hello'}],
    fast: true,
  });
  assert.equal(
    plain.config.thinkingConfig?.thinkingBudget,
    0,
    'without a tool, deliberation should still be off for speed',
  );
  ok('deliberation stays on whenever a tool is attached');

  // ---- keys pasted in rather than set in the environment ------------------
  const keysBefore = (await (await call('/keys')).json()) as {gemini: {pasted: boolean}};
  assert.equal(keysBefore.gemini.pasted, false, 'nothing pasted yet');

  const saved = await call('/keys', {
    method: 'POST',
    body: JSON.stringify({name: 'gemini', value: 'AIzaTESTKEY1234'}),
  });
  assert.equal(saved.status, 200);
  const status = (await saved.json()) as {gemini: {pasted: boolean; hint: string}};
  assert.equal(status.gemini.pasted, true);
  assert.equal(status.gemini.hint, '••••1234', 'only the tail may be shown');

  // The whole point: a key must never come back out over the wire.
  const body = JSON.stringify(await (await call('/keys')).json());
  assert.doesNotMatch(body, /AIzaTESTKEY/, 'a stored key must never be returned');
  ok('keys can be pasted in, and are never handed back');

  assert.equal(
    (await call('/keys', {method: 'POST', body: JSON.stringify({name: 'nope'})})).status,
    400,
    'an unknown key name must be refused',
  );
  await call('/keys', {method: 'POST', body: JSON.stringify({name: 'gemini', value: ''})});
  ok('unknown key names refused');

  // ---- learning that accumulates -----------------------------------------
  const {currentBeliefs, noteStyle, remember, supersedeEntry} = await import(
    '../server/memory'
  );

  await remember([{kind: 'routine', text: 'Works early mornings', source: 'inferred'}]);
  await remember([{kind: 'routine', text: 'Works early mornings', source: 'stated'}]);
  const beliefs = await currentBeliefs();
  const habit = beliefs.find((entry) => entry.text === 'Works early mornings');
  assert.equal(habit?.timesSeen, 2, 'hearing it twice must count as twice');
  assert.equal(habit?.source, 'stated', 'being told outright promotes a guess');
  assert.equal(
    beliefs.filter((entry) => entry.text === 'Works early mornings').length,
    1,
    'and must not duplicate',
  );
  ok('repeated observations reinforce rather than pile up');

  assert.equal(await supersedeEntry('Works early mornings'), true);
  assert.ok(
    !(await currentBeliefs()).some((entry) => entry.text === 'Works early mornings'),
    'superseded facts drop out of what she believes',
  );
  assert.ok(
    (await getProfile()).entries.some((entry) => entry.text === 'Works early mornings'),
    'but are kept — that they used to be true is itself a fact',
  );
  ok('contradicted facts are superseded, never deleted');

  await noteStyle(['Stops reading after two sentences']);
  await noteStyle(['Stops reading after two sentences']);
  const style = (await getProfile()).style ?? [];
  assert.equal(style[0]?.timesSeen, 2, 'style notes accumulate evidence too');
  ok('she learns how to deal with you, not only facts about you');

  // ---- spending ----------------------------------------------------------
  // A cap that only tells you afterwards is not a cap, so it is checked before
  // the request goes out. Charged from reported token usage, not guessed.
  const {monthlyCap, record: bill, requireBudget, spend} = await import(
    '../server/budget'
  );
  const startingSpend = (await spend()).dollars;
  await bill('gemini-2.5-flash', 1_000_000, 1_000_000);
  const after = await spend();
  assert.ok(after.dollars > startingSpend, 'usage must be counted');
  assert.equal(
    Math.round((after.dollars - startingSpend) * 100) / 100,
    2.8,
    'charged at the published rate for that model',
  );
  ok('spending is counted from real token usage');

  await bill('gemini-2.5-flash', 20_000_000, 20_000_000);
  await assert.rejects(
    requireBudget(),
    /limit you set/,
    'past the cap, she must refuse before spending more',
  );
  assert.ok(monthlyCap() > 0);
  ok('she stops when the monthly cap is reached');

  // ---- attention modes ---------------------------------------------------
  // These are not decoration: the mode has to reach the model, or "Focus" is
  // a button that changes a colour and nothing else.
  const focused = await call('/mode', {
    method: 'POST',
    body: JSON.stringify({mode: 'focus'}),
  });
  assert.equal(focused.status, 200);
  assert.equal(((await focused.json()) as {mode: string}).mode, 'focus');

  await chat('Still there?');
  assert.match(stub.lastSystem, /Focus mode/, 'the mode must reach the model');
  assert.match(stub.lastSystem, /Volunteer nothing/, 'and bring its guidance with it');
  ok('attention mode reaches the system prompt');

  const state = (await (await call('/state')).json()) as {
    mode: {mode: string};
    storage: {backend: string; encrypted: boolean};
  };
  assert.equal(state.mode.mode, 'focus', 'the mode must survive a reload');
  assert.equal(state.storage.encrypted, true, 'the dashboard must report the truth');
  ok('dashboard readouts come from real state, not placeholders');

  for (const rejected of ['nap', 'toString', 'constructor', '__proto__', 'valueOf']) {
    assert.equal(
      (await call('/mode', {method: 'POST', body: JSON.stringify({mode: rejected})}))
        .status,
      400,
      `"${rejected}" must be refused as a mode`,
    );
  }
  ok('unknown modes rejected, including inherited property names');

  await call('/mode', {method: 'POST', body: JSON.stringify({mode: 'open'})});

  // ---- every route must be a single path segment -------------------------
  // Vercel answers /api/a/b with a 404 that never reaches the app, while the
  // same request works perfectly on a local machine. That divergence silently
  // broke forgetting a fact and clearing the conversation in production, and
  // nothing here noticed until someone probed the deployed server by hand.
  const routes = [
    ...readFileSync('server/api.ts', 'utf8').matchAll(
      /api\.(?:get|post|put|delete|patch)\(\s*'([^']+)'/g,
    ),
  ].map((match) => match[1]);

  assert.ok(routes.length > 15, 'the route scan should have found the routes');
  const nested = routes.filter((route) => route.split('/').filter(Boolean).length > 1);
  assert.deepEqual(nested, [], `these routes are unreachable once deployed: ${nested}`);
  ok(`all ${routes.length} routes are a single segment, so Vercel can reach them`);

  // ---- she can actually do things ----------------------------------------
  const openBefore = (await outstanding()).length;
  const added = await runTool({
    name: 'add_reminder',
    args: {text: 'ring the dentist', due: '2026-08-01T09:00:00Z'},
  });
  assert.ok(added.ok, `adding a reminder should work: ${added.result}`);
  assert.equal((await outstanding()).length, openBefore + 1, 'and should persist');
  ok('tools run and their effects last');

  const listed = await runTool({name: 'list_reminders', args: {}});
  assert.match(listed.result, /dentist/, 'the list should come back');

  const finished = await runTool({
    name: 'complete_reminder',
    args: {text: 'dentist'},
  });
  assert.ok(finished.ok);
  assert.equal(
    (await outstanding()).length,
    openBefore,
    'completing should take it off the outstanding list',
  );
  assert.equal(
    (await allReminders()).length,
    openBefore + 1,
    'but must not delete it — nothing is ever destroyed',
  );
  ok('completed items are marked, never deleted');

  const missing = await runTool({name: 'add_reminder', args: {}});
  assert.equal(missing.ok, false, 'a call with no text must not silently succeed');
  const unknown = await runTool({name: 'launch_missiles', args: {}});
  assert.equal(unknown.ok, false, 'an invented tool must not run');
  ok('malformed and invented tool calls refused');

  // The two hard limits, proved about the tool list itself rather than about
  // any particular call: there is no tool that sends, spends, or destroys, so
  // there is nothing to be talked past.
  assert.deepEqual(auditTools(), [], 'no tool may send, spend, or destroy');
  ok('no tool exists that could send, spend, or destroy anything');

  // ---- everything she does is on the record ------------------------------
  const deeds = await recentDeeds(50);
  assert.ok(
    deeds.some((deed) => /added to the list/i.test(deed.text)),
    'adding a reminder should appear in the journal',
  );
  assert.equal(deeds[0].at >= deeds[deeds.length - 1].at, true, 'newest first');
  ok('every action she takes lands in a record the user can read');

  // ---- the PlayStation, and the limit of it ------------------------------
  const console_ = allTools().find((tool) => tool.name === 'check_playstation');
  assert.ok(console_, 'she should be able to look at the console');
  assert.equal(console_.category, 'home');
  // Read-only is not a matter of intent here: there is no write to be had.
  // What matters is that she says so rather than implying she pressed
  // something, and that a missing credential is an explanation, not a crash.
  const looked = await runTool({name: 'check_playstation', args: {}});
  assert.ok(looked.ok, 'a missing PlayStation token must not throw');
  assert.match(
    looked.result,
    /not connected|paste/i,
    'with no token she must say it is not connected',
  );
  ok('she can look at the PlayStation, and says so when it is not connected');

  // ---- the rooms of the app ------------------------------------------------
  // A workspace is data rather than code, which is the whole reason the user
  // can add one without waiting for a deploy. Everything below is about it
  // staying data: found by name however it was said, saved, and hidden rather
  // than destroyed.
  const rooms = (await (await call('/workspaces')).json()) as {
    workspaces: {id: string; name: string; opens: string[]}[];
  };
  assert.ok(
    rooms.workspaces.some((one) => one.id === 'work'),
    'the default rooms should be there on a fresh install',
  );

  const switched = await runTool({name: 'open_workspace', args: {name: 'work mode'}});
  assert.ok(switched.ok);
  assert.match(switched.result, /Work/, 'a loosely spoken name should still land');

  const nowhere = await runTool({name: 'open_workspace', args: {name: 'atlantis'}});
  assert.match(nowhere.result, /no workspace by that name/i);

  // A bare word is a domain guess, which is what makes "open youtube" work.
  const opened = await runTool({name: 'open_pages', args: {urls: 'youtube'}});
  assert.match(opened.result, /youtube\.com/, 'a bare name should become an address');
  const nonsense = await runTool({name: 'open_pages', args: {urls: '!!!'}});
  assert.match(nonsense.result, /did not look like an address/i);

  const madeRoom = (await (
    await call('/workspace-save', {
      method: 'POST',
      body: JSON.stringify({
        id: 'study',
        name: 'Study',
        icon: 'sparkles',
        accent: 'rose',
        opens: ['https://example.com', 'not-a-url'],
        panels: ['needs'],
      }),
    })
  ).json()) as {workspaces: {id: string; opens: string[]}[]};

  const study = madeRoom.workspaces.find((one) => one.id === 'study');
  assert.ok(study, 'a room the user made should be saved');
  assert.deepEqual(
    study.opens,
    ['https://example.com'],
    'and anything that is not an address should be dropped rather than stored',
  );

  const hidden = (await (
    await call('/workspace-hide', {method: 'POST', body: JSON.stringify({id: 'study'})})
  ).json()) as {workspaces: {id: string}[]};
  assert.ok(
    !hidden.workspaces.some((one) => one.id === 'study'),
    'hiding should take it out of the rail',
  );
  const stillThere = (await (
    await call('/workspace-save', {
      method: 'POST',
      body: JSON.stringify({id: 'study', name: 'Study', panels: []}),
    })
  ).json()) as {workspaces: {id: string}[]};
  assert.ok(
    stillThere.workspaces.some((one) => one.id === 'study'),
    'and it must come back, because nothing here is ever destroyed',
  );
  ok('rooms are data: found by name, made by the user, hidden but never deleted');

  // ---- she says something when you walk in, but not every time -------------
  const hello = (await (await call('/greeting', {method: 'POST'})).json()) as {
    say: string | null;
  };
  assert.ok(hello.say, 'she should have something to say on the first open');
  const secondHello = (await (await call('/greeting', {method: 'POST'})).json()) as {
    say: string | null;
  };
  assert.equal(
    secondHello.say,
    null,
    'and nothing on the next — three greetings while you find the right tab is worse than none',
  );
  ok('she greets you when you walk in, and not again for hours');

  // ---- she can ask, with the answers laid out ------------------------------
  stub.nextToolCall = {
    name: 'ask_choice',
    args: {question: 'Tuesday or Thursday?', choices: 'Tuesday — sooner | Thursday'},
  };
  const question = await chat('Book the inspection.');
  const put = question.find((event) => event.type === 'asked');
  assert.ok(put && put.type === 'asked', 'the question should reach the interface');
  assert.equal(put.question, 'Tuesday or Thursday?');
  // Note the second has no detail at all rather than an empty one: it travels
  // as JSON, and an absent key is what arrives.
  assert.deepEqual(put.choices, [
    {label: 'Tuesday', detail: 'sooner'},
    {label: 'Thursday'},
  ]);

  // One button is not a choice, and must not render as though it were.
  const tooFew = await runTool({
    name: 'ask_choice',
    args: {question: 'Shall I?', choices: 'Yes'},
  });
  assert.match(tooFew.result, /at least two/i);
  ok('she can put a question on screen with the answers as buttons');

  // ---- what an action looks like on screen --------------------------------
  // The provider hands onToolUsed whatever onToolCall returned — the raw
  // result — so however carefully the tool layer worded its short summary, the
  // interface showed the wall of text instead. Checking the mail printed the
  // whole inbox under her reply, twice over, including the guidance meant only
  // for her. Asserted end to end, through the same seam that leaked.
  for (let index = 0; index < 12; index += 1) {
    await runTool({name: 'add_reminder', args: {text: `something to do ${index}`}});
  }
  const bulky = await runTool({name: 'list_reminders', args: {}});
  assert.ok(bulky.result.length > 200, 'the raw result should be genuinely long');

  stub.nextToolCall = {name: 'list_reminders', args: {}};
  const withAction = await chat('What is on my list?');
  const acted = withAction.find((event) => event.type === 'acted');
  assert.ok(acted && acted.type === 'acted', 'the action should reach the interface');
  assert.ok(
    acted.summary.length < 70 && !acted.summary.includes('\n'),
    `what is shown must be one short line, got ${acted.summary.length} characters`,
  );
  assert.ok(
    !acted.summary.includes('something to do'),
    'and must not be the tool output itself',
  );
  ok('an action reaches the screen as a short line, not the tool’s output');

  // ---- tool output is working material, not something to read out ---------
  // She was handed the inbox — senders, subjects and a preview of each — and
  // read the whole thing back, so asking her to check the mail buried her
  // answer under other people's marketing. The rule against it is structural
  // enough to be worth asserting.
  await chat('Check my mail.');
  assert.match(
    stub.lastSystem,
    /Never reproduce a list a tool handed you/,
    'she must be told that tool output is for her to read, not to pass on',
  );
  ok('she is told to report what a tool found, not to recite it');

  // ---- her voice does not stop mid-word -----------------------------------
  // A long answer used to be packed into batches that could overshoot what the
  // speech route accepts, and the route cut the overflow without a word. The
  // only symptom was her trailing off, which no test could see.
  const longWinded =
    'She had a great deal to say about it. '.repeat(60) +
    `And then one sentence with no full stop in it at all that simply keeps ${'going on '.repeat(200)}`;

  const pieces = chunkForSpeech(longWinded);
  assert.ok(pieces.length > 1, 'a long answer should be broken up');
  for (const piece of pieces) {
    assert.ok(
      piece.length <= CHUNK_TARGET,
      `every piece must fit what the route accepts, got ${piece.length}`,
    );
  }

  // Nothing may be dropped. Whitespace is renormalised, the words are not.
  const words = (text: string) => text.split(/\s+/).filter(Boolean);
  assert.deepEqual(
    words(pieces.join(' ')),
    words(longWinded),
    'every word must come out the other side — this is the whole point',
  );
  ok('a long reply is split without losing a word, and never cut mid-sentence');

  // ---- what the interface shows about an action ---------------------------
  // Checking the mail hands the model every subject line in the inbox. Showing
  // that to the user buried her actual reply under other people's email.
  const inbox = await runTool({name: 'check_mail', args: {}});
  assert.ok(
    inbox.summary.length < 70,
    `what the user sees must stay short, got ${inbox.summary.length} characters`,
  );
  assert.ok(
    !inbox.summary.includes('\n'),
    'and must be one line, not a list pasted under her reply',
  );
  ok('an action shows as a short line, not the tool’s whole output');

  // ---- the laptop bridge --------------------------------------------------
  // Grace hands out the bridge program herself, so getting it onto a locked-
  // down laptop needs no git, no installer and no administrator. That copy
  // has to be the same program, or she is serving something that has quietly
  // stopped matching what is tested here.
  assert.equal(
    readFileSync('public/bridge.mjs', 'utf8'),
    readFileSync('bridge/bridge.mjs', 'utf8'),
    'the downloadable bridge has drifted from the real one — run npm run sync:bridge',
  );
  ok('the bridge she hands out is the same program that is tested');

  // This is the only route that anything on the open internet can reach
  // without the password, so what it refuses matters more than what it does.
  const refused = await fetch(`${base}/bridge`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token: 'not-the-token', state: null}),
  });
  assert.equal(refused.status, 401, 'a wrong token must get nowhere');
  assert.equal(
    ((await refused.json()) as {error: string}).error,
    'no',
    'and must not be told anything about why',
  );
  ok('the bridge route refuses anything without the right token');

  const token = (
    (await (await call('/bridge-status')).json()) as {token: string; online: boolean}
  ).token;
  assert.ok(token.length > 20, 'a token should be generated on first ask');

  // With no laptop answering, she must say so rather than claim to have done
  // it. Reporting success about a console that never moved is the one failure
  // that would make this whole feature untrustworthy.
  const noBridge = await runTool({name: 'wake_playstation', args: {}});
  assert.match(
    noBridge.result,
    /not running|no way onto/i,
    'with no bridge she must say she cannot reach the console',
  );
  ok('with no laptop listening she says so, rather than claiming success');

  // Now stand in for the laptop: check in, take the instruction, report back.
  const asBridge = (body: unknown) =>
    fetch(`${base}/bridge`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });

  const consoleState = {
    found: true,
    status: 'STANDBY',
    name: 'PS5-1234',
    address: '192.168.1.20',
    at: new Date().toISOString(),
  };
  const firstCheckIn = (await (await asBridge({token, state: consoleState})).json()) as {
    commands: {id: string}[];
  };
  assert.deepEqual(firstCheckIn.commands, [], 'nothing queued yet');

  const woken = runTool({name: 'wake_playstation', args: {}});
  // Give the tool a moment to queue the instruction before the laptop looks.
  await new Promise((resolve) => setTimeout(resolve, 300));

  const collected = (await (await asBridge({token, state: consoleState})).json()) as {
    commands: {id: string; action: string}[];
  };
  assert.equal(collected.commands.length, 1, 'the laptop should be given the job');
  assert.equal(collected.commands[0].action, 'wake');

  const claimedAgain = (await (await asBridge({token, state: consoleState})).json()) as {
    commands: unknown[];
  };
  assert.deepEqual(
    claimedAgain.commands,
    [],
    'and must not be handed the same job twice — that is a console switched on twice',
  );

  await asBridge({
    token,
    state: consoleState,
    results: [{id: collected.commands[0].id, ok: true, detail: 'sent'}],
  });

  const said = await woken;
  assert.match(said.result, /coming on/i, 'she reports what the laptop actually did');
  ok('an instruction reaches the laptop once, and she reports back what happened');

  // She can look at the console, and she cannot operate it beyond on and off.
  assert.ok(
    !allTools().some((tool) => /launch|start_game|press|button/i.test(tool.name)),
    'nothing may claim to start a game — a PS5 will not accept it',
  );
  ok('she has switching on and off, and claims nothing beyond it');

  // ---- she can go back and look ------------------------------------------
  // Her working memory is the recent window and a short summary. Everything
  // older used to be unreachable, which meant "I don't remember" about things
  // sitting in the log — the same as being wrong.
  await chat('The flat in Porto has a leaking tap in the back bathroom.');
  for (let filler = 0; filler < 14; filler += 1) {
    await chat(`Something unrelated, number ${filler}.`);
  }

  const recalled = await runTool({name: 'search_memory', args: {about: 'Porto tap'}});
  assert.ok(recalled.ok);
  assert.match(recalled.result, /leaking tap/, 'she should find what was said');
  // It has to be far enough back to be a real search rather than a glance at
  // the last few turns, which is the only case that would have worked before.
  const log = await getMessages();
  const buried = log.findIndex((message) => /leaking tap/.test(message.text));
  assert.ok(
    log.length - buried > 20,
    `the hit should be well back in the log, not in the recent window (${
      log.length - buried
    } messages back)`,
  );

  const nothing = await runTool({name: 'search_memory', args: {about: 'submarines'}});
  assert.match(nothing.result, /nothing in the record/i, 'and not invent a hit');
  ok('she searches the whole record rather than claiming to have forgotten');

  // ---- reaching the phone ------------------------------------------------
  const keyed = (await (await call('/push-key')).json()) as {
    key: string;
    devices: number;
  };
  assert.ok(keyed.key.length > 20, 'a signing key should be generated on first ask');
  assert.equal(keyed.devices, 0, 'and no device is subscribed yet');
  assert.equal(
    ((await (await call('/push-key')).json()) as {key: string}).key,
    keyed.key,
    'the key must be stable — a new one on every request unsubscribes every phone',
  );

  const rubbish = await call('/push-subscribe', {
    method: 'POST',
    body: JSON.stringify({subscription: {endpoint: 'https://example.test/x'}}),
  });
  assert.equal(rubbish.status, 400, 'a subscription with no keys must be refused');

  const device = {
    endpoint: 'https://push.example.test/device-one',
    keys: {p256dh: 'BJxxxxx', auth: 'aaaa'},
  };
  const subscribed = (await (
    await call('/push-subscribe', {
      method: 'POST',
      body: JSON.stringify({subscription: device}),
    })
  ).json()) as {devices: number};
  assert.equal(subscribed.devices, 1);

  // Browsers rotate endpoints and re-subscribe constantly. Piling them up is
  // how one phone ends up buzzing six times for one reminder.
  const again = (await (
    await call('/push-subscribe', {
      method: 'POST',
      body: JSON.stringify({subscription: device}),
    })
  ).json()) as {devices: number};
  assert.equal(again.devices, 1, 're-subscribing the same device must not duplicate it');
  ok('a phone can be subscribed once, and re-subscribing does not double it');

  // ---- her own initiative ------------------------------------------------
  // Something due in the past, which is the plainest thing that wants a person.
  await runTool({
    name: 'add_reminder',
    args: {text: 'ring the landlord', due: new Date(Date.now() - 60_000).toISOString()},
  });

  const first = await pulse();
  assert.ok(
    first.concerns.some((concern) => /landlord/.test(concern.text)),
    'an overdue reminder should be noticed',
  );
  assert.ok(first.say, 'and she should have something to say about it');
  assert.ok(
    (await getMessages()).some((message) => message.text === first.say),
    'what she says unprompted must be in the conversation, or the next reply is lost',
  );
  ok('she notices what is overdue and says so without being asked');

  const second = await pulse();
  assert.deepEqual(
    second.concerns,
    [],
    'the same concern must never be raised twice — that is what makes it bearable',
  );
  assert.equal(second.say, null, 'and nothing is spent looking at nothing');
  ok('nothing is raised twice, and an uneventful look costs nothing');

  // Focus mode exists to be obeyed. An assistant who honours it except when
  // she has something interesting is one nobody leaves running.
  await setMode('focus');
  await runTool({
    name: 'add_reminder',
    args: {text: 'water the plants', due: new Date(Date.now() + 30 * 60_000).toISOString()},
  });
  const quiet = await pulse();
  assert.ok(quiet.concerns.length > 0, 'she still notices while you are heads-down');
  assert.equal(quiet.say, null, 'she simply does not interrupt with it');
  assert.ok(quiet.held, 'and says why she is holding it');
  await setMode('open');
  ok('in Focus she notices but holds her tongue');

  // She can act on mail and diary now, and the shape of that matters: a tool
  // that drafts is fine, a tool that sends is not, and the difference must be
  // visible in the list rather than trusted to the model.
  const names = allTools().map((tool) => tool.name);
  for (const expected of ['check_mail', 'read_mail', 'draft_reply', 'check_diary']) {
    assert.ok(names.includes(expected), `${expected} should exist`);
  }
  assert.ok(
    !names.some((name) => /send|delete|remove|trash/i.test(name)),
    'no tool may be named for sending or destroying',
  );
  ok('mail and diary tools exist, and none of them sends or destroys');

  // ---- she cannot send mail, as a matter of code -------------------------
  // Google publishes no draft-only scope, so gmail.compose carries the ability
  // to send whether we want it or not. The user's first hard limit therefore
  // cannot be enforced by scope, and is enforced here instead: if a send call
  // ever appears in this repository, this fails.
  const googleSources = readdirSync('server/google')
    .filter((name) => name.endsWith('.ts'))
    .map((name) => readFileSync(`server/google/${name}`, 'utf8'));

  for (const source of googleSources) {
    assert.doesNotMatch(
      source,
      /drafts\/[^'"`\s]*\/send|messages\/send|\.send\(/,
      'nothing in the Google layer may send mail',
    );
  }
  assert.ok(
    googleSources.some((source) => source.includes('drafts')),
    'the draft path should exist, or this check is proving nothing',
  );
  ok('no code path exists that sends mail on the user’s behalf');

  // ---- guardrails are structural, not advisory ---------------------------
  for (const category of ['communication', 'purchase']) {
    const locked = await call('/policies', {
      method: 'POST',
      body: JSON.stringify({category, policy: 'never'}),
    });
    assert.equal(locked.status, 409, `${category} must refuse to unlock`);
  }
  ok('locked categories reject attempts to relax them (409)');

  const unlocked = await call('/policies', {
    method: 'POST',
    body: JSON.stringify({category: 'home', policy: 'never'}),
  });
  assert.equal(unlocked.status, 200);
  ok('unlocked categories remain adjustable');

  // ---- bad input does not take the process down --------------------------
  const empty = await call('/chat', {method: 'POST', body: JSON.stringify({text: '   '})});
  assert.equal(empty.status, 400);
  assert.equal((await call('/health')).status, 200, 'server survived');
  ok('malformed request rejected without killing the server');

  // ---- encryption at rest ------------------------------------------------
  const stored = (await backend.read('conversation')) ?? '';
  assert.doesNotMatch(stored, /Morning, Grace/, 'plaintext must not be readable');
  assert.match(stored, /"encrypted":true/);
  ok('memory unreadable in the store without the secret');

  // ---- compaction, and the context gap it used to leave -------------------
  await clearConversation();
  // Two messages per exchange, and enough of them to be past the threshold
  // whatever that threshold is set to — the seeding used to be a bare number
  // and quietly stopped testing anything the moment the window was widened.
  const enough = Math.ceil(config.summarizeAfter / 2) + 2;
  for (let i = 0; i < enough; i += 1) await chat(`Message number ${i}.`);
  assert.ok((await getMessages()).length > config.summarizeAfter);

  const {compacted} = (await (
    await call('/reflect', {method: 'POST'})
  ).json()) as {compacted: boolean};
  assert.ok(compacted, 'compaction should have run');
  assert.ok(await getSummary(), 'older turns folded into a summary');
  ok(`compaction ran at ${(await getMessages()).length} messages and wrote a summary`);

  // Everything the summary does not cover must still be replayed verbatim, or
  // those messages fall out of context entirely: too new for the summary, too
  // old for a fixed-depth window. Asserting an exact count rather than a floor,
  // because a floor of `verbatimTurns` is precisely what the bug satisfied.
  await chat('One more.');
  const replayed = (await recentTurns()).map((turn) => turn.text);
  const total = (await getMessages()).length;
  const summarised = await getSummarizedThrough();
  const expected = total - summarised;

  assert.equal(
    replayed.length,
    expected,
    `every unsummarised message must be replayed: expected ${expected} ` +
      `(${total} total − ${summarised} summarised), got ${replayed.length}`,
  );
  assert.ok(replayed.includes('One more.'), 'the newest message must be replayed');
  ok(
    `no gap between summary and window (${replayed.length} unsummarised of ` +
      `${total} total, all replayed)`,
  );

  // ---- signing out actually closes the door ------------------------------
  await call('/logout', {method: 'POST'});
  cookie = '';
  assert.equal((await call('/state')).status, 401);
  ok('signing out closes the session');

  console.log(`\n${checks.length} checks passed.\n`);
  console.log('Not covered: the real Gemini API call. That needs a live key.\n');
} finally {
  server.close();
  rmSync(config.dataDir, {recursive: true, force: true});
}
