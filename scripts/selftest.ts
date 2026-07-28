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
import {labelMail} from '../server/google/gmail';
import {getMode, setMode} from '../server/modes';
import {workspaces} from '../server/workspaces';
import {buildSystemPrompt} from '../server/persona';
import {BANDS} from '../shared/voiceprint';
import {trimTrailingSilence} from '../shared/trim';
import {heardName, isPhantom, toldToSleep} from '../shared/wake';
import {parseCommand, suggest} from '../shared/commands';
import {logKey, metaKey} from '../server/chats';
import {Document} from '../server/store/index';
import {voiceChecks} from './voicecheck';
import {pulse} from '../server/pulse';
import {setBackend} from '../server/store/index';
import {allTools, auditTools, declarations, runTool} from '../server/tools/index';
import {worthLearningFrom} from '../server/learn';
import {record as bill, spend as readSpend} from '../server/budget';
import {parseDuration} from '../server/tools/timers';
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
  const events = await chat('Morning Grace. I always take my tea in the afternoon.', 'voice');

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

  // The gate that keeps most turns from paying for a learning call at all.
  assert.equal(worthLearningFrom('ok thanks'), false, 'trivia teaches nothing');
  assert.equal(worthLearningFrom('open work'), false, 'a bare command teaches nothing');
  assert.equal(worthLearningFrom('what is the weather'), false, 'a passing question either');
  assert.ok(worthLearningFrom('I moved to Berlin last month'), 'but a personal fact does');
  assert.ok(worthLearningFrom('anything', true), 'and a sweep always runs');
  ok('the learning gate spends a model call only when there is something to learn');

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

  // ---- an audition is heard in the voice being auditioned ------------------
  // The override was once applied with a pattern that no longer matched the
  // file: the edit silently changed nothing, shipped, and every audition
  // played in the current voice. The resolution order is now a bare function
  // precisely so this can be proved without a network.
  const {voiceFor} = await import('../server/llm/gemini');
  assert.equal(
    voiceFor({text: 'sample', voice: 'Aoede'}),
    'Aoede',
    'a sample must come out in the voice being auditioned',
  );
  assert.ok(
    voiceFor({text: 'sample'}).length > 0,
    'and with no override she still has a voice to fall back to',
  );
  ok('auditioning a voice is heard in that voice, not the current one');

  // ---- filler words never hide a page or a situation -----------------------
  // "my Berlin" is asking for Berlin; "the govee order" should settle
  // "Govee order EU641959". Both once returned nothing, because the asked-side
  // filler was never dropped before the whole-word check.
  await runTool({name: 'write_note', args: {title: 'Berlin trip', text: 'Packing list started'}});
  const askedWithMy = await runTool({name: 'read_note', args: {title: 'my Berlin'}});
  assert.match(askedWithMy.result, /Packing list/, '"my Berlin" finds the Berlin trip');

  await runTool({
    name: 'track_situation',
    args: {title: 'Govee order EU641959', update: 'Shipped from the EU warehouse.'},
  });
  const settledLoose = await runTool({
    name: 'resolve_situation',
    args: {title: 'the govee order'},
  });
  assert.match(settledLoose.result, /resolved/i, '"the govee order" settles it');
  ok('filler words never hide a note or keep a situation open');

  // ---- a near-miss title is a new page, never a wrong merge ----------------
  // Substring matching used to file "Oscar plans" into a note called "car",
  // because "oscar" contains "car" — and a wrong merge is invisible in a way
  // a second question is not. Exact titles only, for notes and situations.
  await runTool({name: 'write_note', args: {title: 'car', text: 'MOT booked'}});
  await runTool({name: 'write_note', args: {title: 'Oscar plans', text: 'dinner Friday'}});
  const {liveNotes: liveN} = await import('../server/notes');
  const titles = (await liveN()).map((note) => note.title);
  assert.ok(
    titles.includes('car') && titles.includes('Oscar plans'),
    `"Oscar plans" must be its own note, not merged into "car" — got ${titles.join(', ')}`,
  );

  await runTool({name: 'track_situation', args: {title: 'PS5', update: 'bought'}});
  await runTool({name: 'track_situation', args: {title: 'PS5 bridge', update: 'pairing'}});
  const {allSituations: allBySub} = await import('../server/situations');
  const sitTitles = (await allBySub()).map((one) => one.title);
  assert.ok(
    sitTitles.includes('PS5') && sitTitles.includes('PS5 bridge'),
    `"PS5 bridge" must be its own situation — got ${sitTitles.join(', ')}`,
  );
  // Left open they would leak into the "Nothing open" assertion below; a test
  // that dirties shared state is a test of nothing.
  await runTool({name: 'resolve_situation', args: {title: 'PS5'}});
  await runTool({name: 'resolve_situation', args: {title: 'PS5 bridge'}});
  ok('near-miss titles start their own note and situation, never a wrong merge');

  // ---- notes, situations, timers, watches ----------------------------------
  // The keeping tools: everything appends or files; nothing destroys.
  const noted = await runTool({
    name: 'write_note',
    args: {title: 'Berlin trip', text: 'Flights are booked for March.'},
  });
  assert.match(noted.result, /Berlin trip/);
  await runTool({
    name: 'write_note',
    args: {title: 'berlin trip', text: 'Hotel shortlist is down to two.'},
  });
  const readBack = await runTool({name: 'read_note', args: {title: 'Berlin'}});
  assert.match(readBack.result, /Flights are booked/, 'first entry kept');
  assert.match(readBack.result, /Hotel shortlist/, 'and the second appended');
  const wrongNote = await runTool({name: 'read_note', args: {title: 'Mars base'}});
  assert.match(wrongNote.result, /No note called that/);
  ok('a note is one page per topic, appended to, matched loosely by title');

  await runTool({
    name: 'track_situation',
    args: {title: 'the deposit dispute', update: 'Letter sent to the landlord.'},
  });
  await runTool({
    name: 'track_situation',
    args: {title: 'deposit dispute', update: 'They replied offering half.'},
  });
  const open_ = await runTool({name: 'list_situations', args: {}});
  assert.match(open_.result, /offering half/, 'the latest development is the status');
  const settled = await runTool({
    name: 'resolve_situation',
    args: {title: 'deposit'},
  });
  assert.match(settled.result, /resolved/i);
  assert.match(
    (await runTool({name: 'list_situations', args: {}})).result,
    /Nothing open/,
    'resolved means off the open list',
  );
  const {allSituations: allSit} = await import('../server/situations');
  const depositFiled = (await allSit()).find((one) => /deposit/.test(one.title));
  assert.ok(depositFiled, 'but filed, never deleted');
  assert.equal(depositFiled.status, 'resolved');
  ok('a situation carries its history, resolves, and is never destroyed');

  const timed = await runTool({
    name: 'set_timer',
    args: {duration: '20 minutes', label: 'pasta'},
  });
  assert.match(timed.result, /pasta, 20 minutes/);
  assert.equal(parseDuration('1h30m'), 90 * 60_000);
  assert.equal(parseDuration('90 seconds'), 90_000);
  assert.equal(parseDuration('20'), 20 * 60_000, 'a bare number means minutes');
  assert.equal(parseDuration('yesterday'), null);
  const ticking = (await (await call('/timers')).json()) as {timers: {id: string}[]};
  assert.equal(ticking.timers.length, 1, 'the client can see it to ring it');
  await call('/timer-fired', {
    method: 'POST',
    body: JSON.stringify({id: ticking.timers[0].id}),
  });
  assert.equal(
    ((await (await call('/timers')).json()) as {timers: unknown[]}).timers.length,
    0,
    'and a fired timer never rings twice',
  );
  ok('timers parse spoken durations, surface to the client, and fire once');

  const badWatch = await runTool({
    name: 'start_watch',
    args: {what: 'nothing', url: 'not-a-url'},
  });
  assert.equal(badWatch.ok, false, 'a watch without a real address is refused');
  await runTool({
    name: 'start_watch',
    args: {what: 'the restock', url: 'https://example.com/x', keyword: 'in stock'},
  });
  assert.match(
    (await runTool({name: 'list_watches', args: {}})).result,
    /the restock.*in stock/,
  );
  const stopped = await runTool({name: 'stop_watch', args: {what: 'restock'}});
  assert.match(stopped.result, /Stopped/);
  ok('watches want a keyword, list honestly, and stop by filing');

  // Read-only integrations degrade to a sentence, not a stack trace.
  const noGithub = await runTool({name: 'check_github', args: {}});
  assert.match(noGithub.result, /not connected/i);
  const noN8n = await runTool({name: 'check_workflows', args: {}});
  assert.match(noN8n.result, /not connected/i);
  ok('github and n8n say what is missing rather than guessing');

  // ---- billing: cached tokens cost a quarter, and nothing double-counts -----
  // The meter-once fix lives in the real provider, which the stub can't
  // exercise; the cost maths it feeds, though, is exact and worth pinning.
  const spent0 = (await readSpend()).dollars;
  await bill('gemini-2.5-flash', 1_000_000, 0, 0);
  const full = (await readSpend()).dollars - spent0;
  await bill('gemini-2.5-flash', 1_000_000, 0, 1_000_000);
  const cached = (await readSpend()).dollars - spent0 - full;
  assert.ok(Math.abs(full - 0.3) < 1e-6, 'a million fresh input tokens is thirty cents');
  assert.ok(
    Math.abs(cached - 0.075) < 1e-6,
    'the same million served from cache is a quarter of that',
  );
  ok('cached input is billed at a quarter, and usage is counted once');

  // ---- correcting and editing what she keeps -------------------------------
  // The user's hand on her memory: supersede a fact without deleting it, and
  // fix a note she wrote.
  await runTool({
    name: 'write_note',
    args: {title: 'Flat', text: 'Landlord is fixing the boiler.'},
  });
  const notesNow = (await (await call('/notes')).json()) as {
    notes: {id: string; title: string; body: string}[];
  };
  assert.ok(notesNow.notes.length >= 1, 'the note is visible to the interface');
  const edited = (await (
    await call('/note-save', {
      method: 'POST',
      body: JSON.stringify({
        id: notesNow.notes[0].id,
        title: notesNow.notes[0].title,
        body: 'Corrected by the user.',
      }),
    })
  ).json()) as {notes: {body: string}[]};
  assert.match(edited.notes[0].body, /Corrected by the user/, 'the user can fix a note');
  ok('notes are visible and the user can correct what she wrote');

  // Files: text kept, searchable, listed without the body, and capped.
  await call('/file-add', {
    method: 'POST',
    body: JSON.stringify({name: 'lease.txt', text: 'The notice period is two months.'}),
  });
  const filed = (await (await call('/files')).json()) as {
    files: {name: string; chars: number}[];
  };
  assert.ok(filed.files.some((f) => f.name === 'lease.txt'), 'the file is kept');
  assert.ok(
    !JSON.stringify(filed.files).includes('notice period'),
    'but the list never ships the body back',
  );
  const found = await runTool({name: 'search_files', args: {about: 'notice period'}});
  assert.match(found.result, /two months/, 'and she can search the text');
  const emptyAdd = await call('/file-add', {
    method: 'POST',
    body: JSON.stringify({name: 'blank.txt', text: '   '}),
  });
  assert.equal(emptyAdd.status, 400, 'an empty document is refused, not stored');
  ok('documents are kept as text, searchable, and never handed back wholesale');

  const weather = (await (await call('/weather')).json()) as {line: string | null};
  assert.equal(weather.line, null, 'no location fact means no invented forecast');
  ok('weather stays silent rather than guess a city it was never given');

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

  // The bridge now opens pages on the laptop's own screen, which makes what it
  // will accept an address a security question rather than a tidiness one:
  // file:// reaches local documents and the shell schemes start programs.
  const bridgeSource = readFileSync('bridge/bridge.mjs', 'utf8');
  assert.match(
    bridgeSource,
    /protocol !== 'http:' && address\.protocol !== 'https:'/,
    'the bridge must open web addresses and nothing else',
  );
  assert.doesNotMatch(
    bridgeSource,
    // Quoted, so the comment explaining why cmd is avoided does not itself
    // fail the check that cmd is avoided.
    /shell: true|['"]cmd\.exe['"]/,
    'nothing on the laptop may go through a shell',
  );
  ok('the bridge opens web addresses only, and never through a shell');

  // ---- she keeps listening while you are reading something else ----------
  // The detection loop ran on requestAnimationFrame, which every browser stops
  // for a tab nobody is looking at — so she went deaf the moment another site
  // was opened and could hear again the instant you came back. An AudioWorklet
  // is driven by the soundcard and does not know whether anyone is watching.
  const ambient = readFileSync('src/voice/useAmbient.ts', 'utf8');
  assert.match(ambient, /audioWorklet\.addModule/, 'listening must run on the audio thread');
  assert.match(
    ambient,
    /registerProcessor\('grace-ears'/,
    'the worklet itself has to be there, not merely referenced',
  );
  // The worklet is only pulled if it reaches the destination; unconnected, its
  // process() is never called and she is silently deaf everywhere.
  assert.match(ambient, /silent\.connect\(context\.destination\)/);
  // The frame clock still exists and must stay strictly a fallback. Two ways
  // to reach it now, and both are failures: the worklet refusing to load, and
  // the worklet loading but never being called — which is silent, and is
  // exactly how she ended up hearing nothing at all while appearing to listen.
  assert.equal(ambient.split('const watchOnScreen').length - 1, 1);
  assert.equal(
    ambient.split('watchOnScreen();').length - 1,
    2,
    'the frame clock is reached only from the two failure paths',
  );
  assert.ok(
    ambient.indexOf('audioWorklet.addModule') < ambient.indexOf('watchOnScreen()'),
    'the worklet is tried first; the frame clock only when it fails',
  );
  // The watchdog is the whole point of the second path, so it is asserted
  // rather than left to survive at the mercy of a future tidy-up.
  assert.match(
    ambient,
    /if \(!runningRef\.current \|\| heardSomething\) return;/,
    'a worklet that loads and then never runs must still be caught',
  );
  // Calibration has to start from the first reading. Started from the clock,
  // a slow worklet load consumed the whole window and left the room floor at
  // zero, with no way back because the window had passed.
  assert.match(ambient, /if \(openedAt === 0\) \{\s*\n\s*openedAt = now;/);
  // And the floor has to keep tracking the room rather than being fixed by
  // whatever happened during the first six hundred milliseconds.
  assert.match(ambient, /floor = rms < floor \? floor \* 0\.9/);
  assert.match(
    ambient,
    /if \(!collected\) \{/,
    'the floor must not be learned from someone talking',
  );
  ok('listening falls back rather than failing silently, and calibrates late');

  // ---- she should not pause at every full stop ---------------------------
  // The speech model pads the end of every clip with silence. One clip, nobody
  // notices; a reply is three or four clips, so it is three or four pauses,
  // each landing exactly on a full stop — which a listener hears as her
  // hesitating rather than as an encoder finishing up.
  const wavOf = (frames: number[]) => {
    const bytes = new Uint8Array(44 + frames.length * 2);
    const view = new DataView(bytes.buffer);
    const put = (at: number, text: string) => {
      for (let i = 0; i < text.length; i += 1) bytes[at + i] = text.charCodeAt(i);
    };
    put(0, 'RIFF');
    view.setUint32(4, bytes.length - 8, true);
    put(8, 'WAVE');
    put(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 24_000, true);
    view.setUint32(28, 48_000, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    put(36, 'data');
    view.setUint32(40, frames.length * 2, true);
    frames.forEach((value, i) => view.setInt16(44 + i * 2, value, true));
    return bytes;
  };

  // Half a second of speech, then a full second of the encoder's padding.
  const speech = Array.from({length: 12_000}, (_, i) => Math.round(8000 * Math.sin(i / 4)));
  const padded = wavOf([...speech, ...new Array(24_000).fill(0)]);
  const tightened = trimTrailingSilence(padded);

  assert.ok(tightened.byteLength < padded.byteLength, 'the padding should come off');
  assert.ok(
    tightened.byteLength > 44 + speech.length * 2,
    'and the words themselves must survive it',
  );

  // The two length fields a player actually reads. Left stale, every player
  // either reads past the end of the file or refuses it outright — which is
  // why this is trimmed by arithmetic and asserted rather than eyeballed.
  const check = new DataView(
    tightened.buffer,
    tightened.byteOffset,
    tightened.byteLength,
  );
  assert.equal(check.getUint32(4, true), tightened.byteLength - 8, 'RIFF size');
  assert.equal(check.getUint32(40, true), tightened.byteLength - 44, 'data size');

  // Anything it does not fully understand comes back untouched, because the
  // cost of guessing here is a file that will not play at all.
  assert.equal(trimTrailingSilence(wavOf(new Array(2000).fill(0))).byteLength,
    wavOf(new Array(2000).fill(0)).byteLength, 'silence throughout is left alone');
  const garbage = new Uint8Array([1, 2, 3, 4, 5]);
  assert.equal(trimTrailingSilence(garbage), garbage, 'a non-WAV is left alone');
  ok('trailing silence is cut from her speech, and only when it is understood');

  // ---- did somebody say her name -----------------------------------------
  // Nothing here ever sees the word "Grace". It sees a transcriber's guess at
  // a word, from a second of speech in a room, from someone who may have an
  // accent and may be across it. The old test was a literal match against four
  // spellings, and everything else was silently not-for-her — which from the
  // other side of the room looks exactly like being heard and ignored.
  for (const said of [
    'Grace, what time is it',
    'grace whats on today',
    'sorry Grace, one more thing',
    'Gracie turn the lights off',
    'greys put the kettle on',
    'Race, what is the weather',
    'okay grays lights out',
    'Grease, open my mail',
  ]) {
    assert.equal(heardName(said).called, true, `"${said}" should reach her`);
  }

  // And the words that must not, because they turn up in ordinary speech and
  // waking on them would be worse than missing one call.
  for (const said of [
    'that was a great idea',
    'the grade came back',
    'brace yourself',
    'leave a space there',
    'trace it back to Tuesday',
  ]) {
    assert.equal(heardName(said).called, false, `"${said}" must not wake her`);
  }

  // Her name comes out of the request, and takes its punctuation with it —
  // a request that begins ", what time is it" reads to the model as a
  // transcription fault and gets remarked upon instead of answered.
  assert.equal(heardName('Grace, what time is it').request, 'what time is it');
  assert.equal(heardName('sorry Grace, one more thing').request, 'sorry one more thing');
  assert.equal(heardName('Grace').request, '', 'her name alone is not a request');
  assert.equal(heardName('Grace!').request, '');
  ok('her name is recognised however it was transcribed, and only her name');

  // Being told to leave it. Decided here rather than by the model, because
  // "go to sleep" followed by a thoughtful paragraph about going to sleep is a
  // joke at her expense, and it has to work at the moment something has gone
  // wrong — which is when a round trip is the least dependable thing there is.
  for (const said of [
    'go to sleep',
    'goodnight',
    'stop listening',
    "that's all",
    'be quiet',
    'stand down',
  ]) {
    assert.equal(toldToSleep(said), true, `"${said}" should send her to sleep`);
  }
  // "Sleep" alone is deliberately not enough: going silent when someone was
  // making conversation is worse than missing one phrasing of the instruction.
  for (const said of [
    'did you sleep well',
    'set a sleep timer for twenty minutes',
    'what time did I go to sleep last night',
    'all of the lights',
  ]) {
    assert.equal(toldToSleep(said), false, `"${said}" must not silence her`);
  }
  ok('she can be told to leave it, and only when she was actually told');

  // ---- what a transcriber says when it was given nothing -----------------
  // Every speech model trained on captioned video does this: handed a second
  // of room tone it does not answer "nothing", it answers with whatever phrase
  // most often accompanied silence in its training data, confidently. Which is
  // why they are so oddly specific — they are the end-credits of a million
  // videos, and "I created" was arriving from an empty room.
  for (const phantom of [
    'I created',
    'Thank you.',
    'Thanks for watching!',
    'you',
    'Subtitles by the Amara.org community',
    '  ',
    'Okay.',
  ]) {
    assert.equal(isPhantom(phantom), true, `"${phantom}" is the model filling a gap`);
  }

  // The whole point is that this must not deafen her to real speech. Anything
  // longer than a few words is real regardless, and a phantom phrase inside a
  // real sentence is real too.
  for (const real of [
    'thank you for sorting that out',
    'okay do it',
    'you were right about the invoice',
    'I created a new workflow yesterday, remind me to check it',
    'lights off',
  ]) {
    assert.equal(isPhantom(real), false, `"${real}" is somebody talking`);
  }
  ok('a transcriber inventing words into a silence is caught, and speech is not');

  // ---- typed commands ----------------------------------------------------
  // A slash counts only in front of a name she has. Someone typing a path, a
  // fraction or a date is not issuing an instruction, and treating "/usr/bin"
  // as a failed command rather than a message is the kind of cleverness that
  // makes an input box feel hostile.
  assert.deepEqual(parseCommand('/compact'), {name: 'compact', rest: ''});
  assert.deepEqual(parseCommand('/research is the M4 worth it'), {
    name: 'research',
    rest: 'is the M4 worth it',
  });
  for (const typed of ['/usr/local/bin', '1/2 of the way', '/nonsense', 'compact', '']) {
    assert.equal(parseCommand(typed), null, `"${typed}" is not a command`);
  }
  // The menu narrows as you type and vanishes once there is an argument,
  // because by then you know what you are doing.
  assert.ok(suggest('/').length >= 5);
  assert.deepEqual(
    suggest('/re').map((one) => one.name),
    ['research'],
  );
  assert.deepEqual(suggest('/research something'), []);
  ok('typed commands are recognised, and only when they were typed');

  // ---- more than one conversation ----------------------------------------
  // The riskiest change in a while: the message log went from one document to
  // one per conversation. The first conversation deliberately keeps the keys
  // the single one always used, so there is no migration step and no moment
  // where a running install has to be upgraded — an existing log simply *is*
  // the first chat. If that ever stops being true, a week of conversation
  // becomes unreachable, which is why it is asserted rather than assumed.
  assert.equal(logKey('main'), 'conversation');
  assert.equal(metaKey('main'), 'meta');
  assert.notEqual(logKey('abc123'), 'conversation');

  const wasHolding = (await getMessages()).length;
  assert.ok(wasHolding > 0, 'there should be a conversation to carry over');

  const started = await call('/chat-new', {method: 'POST'});
  const madeChat = (await started.json()) as {current: string; chats: {id: string}[]};
  assert.notEqual(madeChat.current, 'main', 'a new conversation is a new one');
  assert.equal((await getMessages()).length, 0, 'and it starts empty');

  // Everything she knows about the user is deliberately *not* split. An
  // assistant who forgot your name because you opened a new conversation
  // would be worse than the one that could only hold a single thread.
  assert.ok(
    (await getProfile()).entries.length > 0,
    'what she knows about you follows you between conversations',
  );

  await call('/chat-open', {method: 'POST', body: JSON.stringify({id: 'main'})});
  assert.equal(
    (await getMessages()).length,
    wasHolding,
    'and going back finds the first one exactly as it was',
  );

  // Put away, never removed — this is the record of everything either of you
  // said, and the standing instruction applies here more than anywhere.
  await call('/chat-archive', {
    method: 'POST',
    body: JSON.stringify({id: madeChat.current}),
  });
  const chatList = (await (await call('/chats')).json()) as {chats: {id: string}[]};
  assert.ok(
    !chatList.chats.some((chat) => chat.id === madeChat.current),
    'an archived conversation leaves the list',
  );
  assert.equal(
    (await new Document<unknown[]>(logKey(madeChat.current), () => []).read()).length,
    0,
    'and its messages are left exactly where they were',
  );

  // The first one cannot be put away, because something has to be current.
  await call('/chat-archive', {method: 'POST', body: JSON.stringify({id: 'main'})});
  assert.ok(
    ((await (await call('/chats')).json()) as {chats: {id: string}[]}).chats.some(
      (chat) => chat.id === 'main',
    ),
    'the first conversation stays, or there is nothing to be in',
  );
  ok('conversations are separate, the first is preserved, and none are removed');
  ok('listening runs on the audio thread, so a hidden tab still hears');

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

  // ---- she cannot destroy mail either, now that she can move it ----------
  // gmail.modify is what lets her file and label. It also carries the ability
  // to bin, which the user has forbidden outright, so the same style of proof
  // applies: no endpoint that destroys, and no request that applies the two
  // labels which amount to destroying.
  for (const source of googleSources) {
    assert.doesNotMatch(
      source,
      /messages\/[^'"`\s]*\/trash|messages\/[^'"`\s]*\/untrash|method: 'DELETE'/,
      'nothing in the Google layer may bin mail or remove a diary entry',
    );
  }
  assert.ok(
    googleSources.some((source) => source.includes('/modify')),
    'the modify path should exist, or this check is proving nothing',
  );
  // And the refusal is real rather than an absence: asked outright to apply
  // Gmail's bin label, the one function that changes labels says no, before it
  // reaches the network.
  await assert.rejects(
    () => labelMail('any-message', 'TRASH'),
    /not hers to touch/,
    'the bin must be refused at the seam, not merely never asked for',
  );
  await assert.rejects(() => labelMail('any-message', 'spam'), /not hers to touch/);
  ok('she can file and label mail, and cannot bin it by any route');

  // ---- the tools she points at herself -----------------------------------
  const heldBefore = (await getProfile()).entries.length;
  const kept = await runTool({
    name: 'remember_this',
    args: {fact: 'The user keeps a standing desk at the window', kind: 'fact'},
  });
  assert.equal(kept.ok, true);
  assert.equal((await getProfile()).entries.length, heldBefore + 1, 'it should be held');

  const corrected = await runTool({
    name: 'correct_memory',
    args: {old: 'The user keeps a standing desk at the window'},
  });
  assert.equal(corrected.ok, true);
  const entry = (await getProfile()).entries.find((one) =>
    one.text.includes('standing desk'),
  );
  assert.ok(entry?.supersededAt, 'a correction marks it overtaken');
  assert.equal(
    (await getProfile()).entries.length,
    heldBefore + 1,
    'and keeps it — that it used to be true is itself a fact',
  );
  ok('she can commit something to memory and correct it, losing nothing');

  const unmatched = await runTool({name: 'correct_memory', args: {old: 'utter invention'}});
  assert.match(
    unmatched.result,
    /Do not claim you changed anything/,
    'correcting nothing must not read to the model as a success',
  );
  ok('a correction that matched nothing says so rather than claiming a change');

  await runTool({name: 'set_attention', args: {mode: 'work'}});
  assert.equal((await getMode()).mode, 'work', 'she can change her own mode');
  const badMode = await runTool({name: 'set_attention', args: {mode: 'sleepy'}});
  assert.match(badMode.result, /no "sleepy" mode/);
  assert.equal((await getMode()).mode, 'work', 'and an invented one changes nothing');
  await runTool({name: 'set_attention', args: {mode: 'open'}});
  ok('she can move herself between attention modes, and refuses invented ones');

  const built = await runTool({
    name: 'make_room',
    args: {name: 'Gym', panels: 'day, weather', accent: 'rose'},
  });
  assert.equal(built.ok, true);
  const gym = (await workspaces()).find((room) => room.name === 'Gym');
  assert.ok(gym, 'the room should be in the rail');
  assert.deepEqual(gym.panels, ['day', 'weather']);

  // Saying the same name again edits that room rather than making a second one
  // called Gym, which is what "add the weather to my gym room" has to mean.
  await runTool({name: 'make_room', args: {name: 'Gym', panels: 'day, weather, notes'}});
  const gyms = (await workspaces()).filter((room) => room.name === 'Gym');
  assert.equal(gyms.length, 1, 'a second room of the same name is never right');
  assert.deepEqual(gyms[0].panels, ['day', 'weather', 'notes']);
  ok('she can build a room by voice, and naming it again edits it');

  // ---- she is only offered what is plugged in ----------------------------
  // Every declaration is paid for on every request, so a tool for a service
  // with no key is a standing charge for something that can only answer "not
  // connected". Nothing is offered here, which is this account's actual state.
  const unplugged = {
    google: false,
    github: false,
    n8n: false,
    playstation: false,
    room: false,
    phone: false,
    lights: false,
  };
  const offeredBare = declarations(unplugged).map((tool) => tool.name);
  const offeredAll = declarations().map((tool) => tool.name);

  for (const gated of ['check_mail', 'check_github', 'pause_workflow', 'lock_laptop', 'set_lights']) {
    assert.ok(offeredAll.includes(gated), `${gated} should exist at all`);
    assert.ok(!offeredBare.includes(gated), `${gated} needs a key and must not be offered`);
  }
  for (const always of ['search_web', 'add_reminder', 'remember_this', 'ask_choice']) {
    assert.ok(offeredBare.includes(always), `${always} depends on unplugged and must stay`);
  }
  assert.ok(
    JSON.stringify(declarations(unplugged)).length <
      JSON.stringify(declarations()).length * 0.8,
    'gating should be worth doing — a fifth of the payload at least',
  );

  // Two calls with the same picture must be byte-identical, or the prompt
  // prefix changes between messages and Gemini's cache discount is lost —
  // which would cost more than the tools left out.
  assert.equal(
    JSON.stringify(declarations(unplugged)),
    JSON.stringify(declarations({...unplugged})),
    'the offered list must be stable for the same set of connections',
  );
  ok('only connected tools are offered, and the offer is stable enough to cache');

  // The prompt narrows on the same picture, for a reason beyond the tokens: a
  // paragraph teaching her to pause a failing n8n workflow, on an account with
  // no n8n and therefore no pause_workflow, can only teach her to promise
  // something she has no way to do.
  const wholeSelf = buildSystemPrompt({
    profile: await getProfile(),
    summary: null,
    policies: [],
    via: 'text',
    now: new Date(),
    mode: 'open',
  });
  const thisAccount = buildSystemPrompt({
    profile: await getProfile(),
    summary: null,
    policies: [],
    via: 'text',
    now: new Date(),
    mode: 'open',
    available: unplugged,
  });
  assert.match(wholeSelf, /pause_workflow/, 'the whole of her still describes it');
  assert.doesNotMatch(
    thisAccount,
    /pause_workflow|wake_playstation|open_on_laptop|notify_phone/,
    'nothing unconnected may be described',
  );
  // The rules that hold whatever is plugged in must survive the narrowing.
  for (const rule of ['never send', 'search_web', 'ask_choice', 'remember_this']) {
    assert.ok(thisAccount.includes(rule), `"${rule}" is not conditional on anything`);
  }
  assert.ok(
    thisAccount.length < wholeSelf.length * 0.9,
    'and the narrowing should be worth doing',
  );
  ok('the prompt describes only the powers she actually has');

  // Lights are the one gated thing that has to say something when it is
  // absent: "I can't do that" is a worse answer than "that needs a key".
  assert.match(thisAccount, /Govee API key/, 'unconnected lights explain themselves');
  assert.doesNotMatch(thisAccount, /dim_lights/, 'without saying she can work them');
  ok('a power she has not got yet explains how to give it to her');

  // ---- whose voice she answers to ----------------------------------------
  // The maths, proved against synthesised voices with known fundamentals and
  // known formants. A recording of a real person would be worse on every
  // count: it would commit someone's voice to the repository, and when it
  // failed nobody could say which property had failed.
  voiceChecks(assert);
  ok('the speaker check separates one voice from another, and refuses silence');

  const fresh = await call('/voice-guard');
  assert.equal(fresh.status, 200);
  const atFirst = (await fresh.json()) as {enrolment: unknown; on: boolean};
  assert.equal(atFirst.enrolment, null, 'nothing enrolled to begin with');
  assert.equal(atFirst.on, false, 'and never guarding by default');

  // Turning the guard on with no print would mean refusing every voice
  // including the owner's — a lockout, so it is quietly refused.
  const premature = await call('/voice-set', {
    method: 'POST',
    body: JSON.stringify({on: true}),
  });
  assert.equal(((await premature.json()) as {on: boolean}).on, false);
  ok('she cannot be set to refuse everyone, which is what a lockout would be');

  // A print is numbers arriving from a browser, so it is checked rather than
  // trusted: wrong length, missing pitch, and impossible tightness all bounce.
  for (const bad of [
    {print: {bands: [1, 2, 3], pitch: 120, voiced: 1}, samples: 3, tightness: 0.9},
    {print: {bands: new Array(BANDS).fill(0), pitch: 120, voiced: 0}, samples: 3, tightness: 0.9},
    {print: {bands: new Array(BANDS).fill(0), pitch: 120, voiced: 1}, samples: 3, tightness: 5},
    'not an object',
  ]) {
    const refused = await call('/voice-enrol', {
      method: 'POST',
      body: JSON.stringify({enrolment: bad}),
    });
    assert.equal(refused.status, 400, 'a malformed print must not be stored');
  }

  const good = {
    print: {bands: new Array(BANDS).fill(0.1), pitch: 118, voiced: 0.9},
    samples: 3,
    tightness: 0.94,
    spread: new Array(BANDS).fill(0.2),
    at: '2026-01-01T00:00:00.000Z',
  };
  const enrolled = await call('/voice-enrol', {
    method: 'POST',
    body: JSON.stringify({enrolment: good}),
  });
  assert.equal(enrolled.status, 200);
  const guarded = await call('/voice-set', {
    method: 'POST',
    body: JSON.stringify({on: true, strictness: 'strict'}),
  });
  const settings = (await guarded.json()) as {on: boolean; strictness: string};
  assert.equal(settings.on, true, 'with a print, the guard can be turned on');
  assert.equal(settings.strictness, 'strict');
  ok('a voiceprint is validated atFirst it is stored, and then it can guard');

  // The only thing in this app that is really erased rather than filed. That
  // asymmetry is deliberate: the standing instruction protects the user's
  // records, and this is not a record — it is a measurement of their body.
  const forgotten = (await (
    await call('/voice-forget', {method: 'POST'})
  ).json()) as {enrolment: unknown; on: boolean};
  assert.equal(forgotten.enrolment, null, 'forgetting a voice really removes it');
  assert.equal(forgotten.on, false, 'and stops the guard with it');
  ok('a voice can be taken back, and taking it back means gone');

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
