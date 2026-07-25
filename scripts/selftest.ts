/**
 * End-to-end check of Grace's pipeline with the model stubbed out.
 *
 * This covers everything a real conversation touches — SSE framing, memory
 * persistence, context assembly, profile extraction, compaction, and the
 * confirmation guardrails — without needing an API key. What it deliberately
 * does not prove is that the Gemini call itself succeeds; only a real key does
 * that.
 *
 * Run with: npm run selftest
 */

import assert from 'node:assert/strict';
import {rmSync} from 'node:fs';
import type {AddressInfo} from 'node:net';
import type {ChatEvent} from '../shared/types.ts';
import {createApi} from '../server/api.ts';
import {config} from '../server/config.ts';
import {setProvider} from '../server/llm/index.ts';
import type {GenerateRequest, LlmProvider, Turn} from '../server/llm/types.ts';
import {
  clearConversation,
  compactIfNeeded,
  getMessages,
  getProfile,
  getSummarizedThrough,
  getSummary,
  recentTurns,
} from '../server/memory.ts';

const REPLY_CHUNKS = ['Good morning. ', 'Nothing pressing today. ', 'Tea at four?'];
const REPLY = REPLY_CHUNKS.join('');
const LEARNED_FACT = 'Prefers tea in the afternoon';

/** Stands in for Gemini, and records what it was asked. */
class StubProvider implements LlmProvider {
  readonly name = 'stub';
  readonly model = 'stub-model';
  lastSystem = '';
  lastTurns: Turn[] = [];
  completions = 0;

  async *stream(request: GenerateRequest): AsyncIterable<string> {
    this.lastSystem = request.system;
    this.lastTurns = request.turns;
    for (const chunk of REPLY_CHUNKS) yield chunk;
  }

  async complete(request: GenerateRequest): Promise<string> {
    this.completions += 1;
    // The JSON-shaped request is profile extraction; the other is summarising.
    if (request.json) {
      return JSON.stringify({
        entries: [{kind: 'preference', text: LEARNED_FACT, source: 'stated'}],
      });
    }
    return 'Earlier, they discussed the day ahead and settled on tea at four.';
  }
}

const stub = new StubProvider();
setProvider(stub);

const checks: string[] = [];
function ok(label: string) {
  checks.push(label);
  console.log(`  ✓ ${label}`);
}

const server = createApi().listen(0);
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

/** Drives one chat request and collects the SSE events it produces. */
async function chat(text: string, via: 'voice' | 'text' = 'text') {
  const response = await fetch(`${base}/chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text, via}),
  });

  assert.equal(response.status, 200, 'chat should stream, not error');

  const body = await response.text();
  return body
    .split('\n\n')
    .filter((frame) => frame.trim().startsWith('data:'))
    .map((frame) => JSON.parse(frame.trim().slice(5)) as ChatEvent);
}

try {
  console.log('\nGrace self-test (model stubbed)\n');

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
  assert.equal(done.message.speaker, 'grace');
  assert.equal(done.message.via, 'voice', 'reply should inherit the input mode');
  ok('done event carries the finished message');

  const learned = events.find((e) => e.type === 'learned');
  assert.ok(learned && learned.type === 'learned', 'should report what it learned');
  assert.equal(learned.entries[0].text, LEARNED_FACT);
  ok('profile extraction ran and reported a new entry');

  // ---- persistence -------------------------------------------------------
  assert.equal(getMessages().length, 2, 'both sides of the exchange are stored');
  assert.equal(getMessages()[0].speaker, 'user');
  assert.equal(getProfile().entries[0].text, LEARNED_FACT);
  ok('conversation and profile persisted to disk');

  // ---- the model actually receives context -------------------------------
  await chat('And this afternoon?');
  assert.equal(stub.lastTurns.length, 3, 'prior turns should be replayed');
  assert.equal(stub.lastTurns[0].role, 'user');
  assert.equal(stub.lastTurns[1].role, 'assistant');
  assert.equal(stub.lastTurns[2].text, 'And this afternoon?');
  ok('prior turns replayed to the model in the right roles');

  assert.match(stub.lastSystem, /never send a message/i);
  assert.match(stub.lastSystem, /never spend money/i);
  ok('hard limits present in every system prompt');

  assert.match(stub.lastSystem, new RegExp(LEARNED_FACT, 'i'));
  ok('learned facts fed back into the system prompt');

  // ---- duplicate facts are not hoarded -----------------------------------
  const before = getProfile().entries.length;
  await chat('Tea again?');
  assert.equal(getProfile().entries.length, before, 'the same fact twice is one fact');
  ok('repeat facts deduplicated rather than stacking up');

  // ---- guardrails are structural, not advisory ---------------------------
  for (const category of ['communication', 'purchase']) {
    const locked = await fetch(`${base}/policies`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({category, policy: 'never'}),
    });
    assert.equal(locked.status, 409, `${category} must refuse to unlock`);
  }
  ok('locked categories reject attempts to relax them (409)');

  const unlocked = await fetch(`${base}/policies`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({category: 'home', policy: 'never'}),
  });
  assert.equal(unlocked.status, 200, 'unlocked categories should still be settable');
  ok('unlocked categories remain adjustable');

  // ---- bad input does not take the process down --------------------------
  const empty = await fetch(`${base}/chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text: '   '}),
  });
  assert.equal(empty.status, 400);
  assert.equal((await fetch(`${base}/health`)).status, 200, 'server survived');
  ok('malformed request rejected without killing the server');

  // ---- compaction, and the context gap it used to leave -------------------
  clearConversation();
  for (let i = 0; i < 21; i += 1) await chat(`Message number ${i}.`);
  assert.ok(getMessages().length > config.summarizeAfter, 'enough history to compact');

  await compactIfNeeded();
  assert.ok(getSummary(), 'older turns folded into a summary');
  ok(`compaction ran at ${getMessages().length} messages and wrote a summary`);

  // Everything the summary does not cover must still be replayed verbatim, or
  // those messages fall out of context entirely: too new for the summary, too
  // old for a fixed-depth window. Asserting an exact count rather than a floor,
  // because a floor of `verbatimTurns` is precisely what the bug satisfied.
  await chat('One more.');
  const replayed = recentTurns().map((turn) => turn.text);
  const total = getMessages().length;
  const summarised = getSummarizedThrough();
  const expected = total - summarised;

  assert.equal(
    replayed.length,
    expected,
    `every unsummarised message must be replayed: expected ${expected} ` +
      `(${total} total − ${summarised} summarised), got ${replayed.length}`,
  );
  assert.ok(
    replayed.includes('One more.'),
    'the newest message must be in the replayed window',
  );
  ok(
    `no gap between summary and window (${replayed.length} unsummarised of ` +
      `${total} total, all replayed)`,
  );

  console.log(`\n${checks.length} checks passed.\n`);
  console.log('Not covered: the real Gemini API call. That needs a live key.\n');
} finally {
  server.close();
  rmSync(config.dataDir, {recursive: true, force: true});
}
