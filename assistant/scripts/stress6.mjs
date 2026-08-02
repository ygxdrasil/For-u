#!/usr/bin/env node
/**
 * Stress round six: what the model actually sends back.
 *
 *   node scripts/stress6.mjs
 *
 * Every other round tests our code against our own inputs. This one tests the
 * one boundary nothing else covers: a reply from Gemini that is not the happy
 * shape. Truncated at the token ceiling, blocked, empty, calling a tool that
 * does not exist, calling one with arguments that are not an object, reporting
 * no usage at all.
 *
 * The one that matters most is truncation, because it is the only failure here
 * that looks EXACTLY like success: text arrives, the request is 200, nothing
 * errors, and the last sentence just stops. Half an answer presented as a whole
 * one is the same class of wrong as a workflow that saves and does nothing.
 */

import assert from 'node:assert/strict';

import { createLlm, TIERS, assertThinkingBudgets, NoModelAvailableError, ModelTimeoutError } from '../core/llm.js';
import { createMeter, PRICES } from '../core/meter.js';
import { createMemoryStore } from '../core/store.js';
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

const cfg = { geminiApiKey: 'stub', monthlyCapUsd: 100 };

/** A Gemini that returns exactly what you tell it to. */
const replies = (...responses) => {
  let i = 0;
  return () => ({ models: { generateContent: async () => responses[Math.min(i++, responses.length - 1)] } });
};

const usage = { promptTokenCount: 100, candidatesTokenCount: 50 };

const llmWith = (factory, store = createMemoryStore()) =>
  createLlm({ apiKey: 'k', meter: createMeter({ store, capUsd: 100 }), clientFactory: factory });

const generate = (llm, extra = {}) =>
  llm.generate({ tier: 'chat', contents: [{ role: 'user', parts: [{ text: 'hi' }] }], systemInstruction: 'be brief', ...extra });

/* ============================================ 1. an answer that stops halfway */

section('1. An answer that stops halfway');

await check('a reply cut off at the token ceiling is not presented as a finished one', async () => {
  // finishReason MAX_TOKENS. Text arrives, the call is 200, nothing throws,
  // and the sentence just stops. This is the only failure in this file that
  // looks exactly like success.
  const llm = llmWith(replies({
    text: 'Here is what I built: a schedule trigger, then a Google Sheets read, then an IF that checks whether the row was added since the la',
    functionCalls: [],
    usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 4096 },
    candidates: [{ finishReason: 'MAX_TOKENS' }],
  }));
  const out = await generate(llm);
  assert.equal(out.truncated, true, 'a truncated answer came back indistinguishable from a complete one');
  assert.ok(out.finishReason, 'the reason the model stopped is not carried out of the adapter');
});

await check('the pipeline says an answer was cut off rather than ending mid-sentence', async () => {
  const store = createMemoryStore();
  const out = await run({
    text: 'build me the lead pipeline',
    config: cfg,
    store,
    llmClientFactory: replies({
      text: 'I built the first two nodes and then the third one is a Google Sheets append which needs the sheet id from',
      functionCalls: [],
      usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 4096 },
      candidates: [{ finishReason: 'MAX_TOKENS' }],
    }),
  }, {});
  assert.match(out.reply, /cut off|ran out of room|truncat|incomplete/i, `the half answer was reported as complete: ${out.reply.slice(-80)}`);
  assert.notEqual(out.status, 'ok', 'a truncated answer was reported with the same status as a finished one');
});

await check('a normal answer is not accused of being truncated', async () => {
  const llm = llmWith(replies({ text: 'Nothing has failed this week.', functionCalls: [], usageMetadata: usage, candidates: [{ finishReason: 'STOP' }] }));
  const out = await generate(llm);
  assert.notEqual(out.truncated, true);
  const noReason = await generate(llmWith(replies({ text: 'fine', functionCalls: [], usageMetadata: usage })));
  assert.notEqual(noReason.truncated, true, 'a reply with no finishReason at all was treated as truncated');
});

/* ==================================================== 2. blocked and empty */

section('2. Blocked, and empty');

await check('a blocked reply says it was blocked, not that the budget ate it', async () => {
  const llm = llmWith(replies({
    text: '', functionCalls: [], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 0 },
    candidates: [{ finishReason: 'SAFETY' }],
  }));
  const out = await generate(llm);
  assert.equal(out.empty, true);
  assert.match(out.emptyReason, /SAFETY/i, `an empty reply blamed the thinking budget: ${out.emptyReason}`);
});

await check('an empty reply with no reason still says what it knows', async () => {
  const llm = llmWith(replies({ text: '', functionCalls: [], usageMetadata: { promptTokenCount: 100, thoughtsTokenCount: 4000 } }));
  const out = await generate(llm);
  assert.equal(out.empty, true);
  assert.match(out.emptyReason, /4000|thinking/i);
});

await check('whitespace is not an answer', async () => {
  const out = await generate(llmWith(replies({ text: '   \n\t ', functionCalls: [], usageMetadata: usage })));
  assert.equal(out.empty, true, 'a reply of nothing but whitespace was passed on as an answer');
});

/* ================================================ 3. tool calls, malformed */

section('3. Tool calls that are not what they should be');

await check('a call to a tool that does not exist is reported to the model, not thrown', async () => {
  const out = await run({
    text: 'do the thing',
    config: cfg,
    store: createMemoryStore(),
    llmClientFactory: replies(
      { text: '', functionCalls: [{ name: 'delete_everything', args: {} }], usageMetadata: usage },
      { text: 'There is no such tool.', functionCalls: [], usageMetadata: usage },
    ),
  }, {});
  assert.equal(out.status, 'ok', out.reply);
  assert.match(JSON.stringify(out.steps), /delete_everything/);
});

await check('a call with no name at all does not take the turn down', async () => {
  const out = await run({
    text: 'do the thing',
    config: cfg,
    store: createMemoryStore(),
    llmClientFactory: replies(
      { text: '', functionCalls: [{ args: { id: 'wf1' } }, { name: null, args: {} }], usageMetadata: usage },
      { text: 'Recovered.', functionCalls: [], usageMetadata: usage },
    ),
  }, {});
  assert.notEqual(out.status, 'model_error', out.reply);
});

await check('arguments that are not an object do not reach a tool as one', async () => {
  for (const args of [null, undefined, 'a string', 42, [1, 2, 3]]) {
    const out = await run({
      text: 'search',
      config: cfg,
      store: createMemoryStore(),
      llmClientFactory: replies(
        { text: '', functionCalls: [{ name: 'search_nodes', args }], usageMetadata: usage },
        { text: 'done', functionCalls: [], usageMetadata: usage },
      ),
    }, {});
    assert.notEqual(out.status, 'model_error', `args ${JSON.stringify(args)} took the turn down: ${out.reply}`);
  }
});

await check('the same tool called twice in one reply runs twice, in order', async () => {
  const ran = [];
  const out = await run({
    text: 'two searches',
    config: cfg,
    store: createMemoryStore(),
    llmClientFactory: replies(
      { text: '', functionCalls: [{ name: 'search_nodes', args: { query: 'slack' } }, { name: 'search_nodes', args: { query: 'sheets' } }], usageMetadata: usage },
      { text: 'both done', functionCalls: [], usageMetadata: usage },
    ),
  }, { onToolStart: ({ args }) => ran.push(args?.query) });
  assert.deepEqual(ran, ['slack', 'sheets'], `parallel calls were not both run in order: ${JSON.stringify(ran)}`);
  assert.equal(out.status, 'ok');
});

/* ===================================================== 4. money and models */

section('4. Money and models');

await check('a reply with no usage at all is metered as zero, not as a guess', async () => {
  const store = createMemoryStore();
  const llm = llmWith(replies({ text: 'hello', functionCalls: [] }), store);
  const out = await generate(llm);
  assert.equal(out.usage.usd, 0);
  assert.equal(await store.getMonthlySpend(), 0, 'a call with no reported usage was billed at a guessed rate');
  note('a reply with no usageMetadata meters as $0 — real spend would be under-reported if Gemini ever stops sending it');
});

await check('a retired model falls through to the next one and says it did', async () => {
  let asked = [];
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async ({ model }) => {
      asked.push(model);
      if (asked.length === 1) throw new Error('models/gemini-2.5-flash-lite is not found for API version v1');
      return { text: 'answered by the fallback', functionCalls: [], usageMetadata: usage };
    } } }),
  });
  const out = await generate(llm);
  assert.equal(asked.length, 2, 'a retired model did not fall through');
  assert.equal(out.model, TIERS.chat.models[1]);
});

await check('a bad request is not masked by trying a different model', async () => {
  let calls = 0;
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async () => { calls++; throw new Error('400 INVALID_ARGUMENT: contents is required'); } } }),
  });
  await assert.rejects(() => generate(llm), /INVALID_ARGUMENT/);
  assert.equal(calls, 1, 'a request error was retried against every model in the tier, tripling the cost of a bug');
});

await check('every model in every tier is priced, and thinking never eats the whole allowance', () => {
  assert.equal(assertThinkingBudgets(TIERS), true);
  for (const tier of Object.values(TIERS)) {
    for (const model of tier.models) assert.ok(PRICES[model], `${model} has no price`);
    assert.ok(tier.thinkingBudget < tier.maxOutputTokens);
  }
});

await check('a model that never answers is stopped rather than allowed to kill the request', async () => {
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: ({ config }) => new Promise((_, reject) => {
      config?.abortSignal?.addEventListener('abort', () => reject(new Error('aborted')));
    }) } }),
  });
  const started = Date.now();
  await assert.rejects(() => generate(llm, { timeoutMs: 400 }), (err) => err instanceof ModelTimeoutError);
  assert.ok(Date.now() - started < 2000, 'the timeout did not actually stop the wait');
});

await check('every model in the tier failing is one clear error, not a stack trace', async () => {
  const llm = createLlm({
    apiKey: 'k',
    meter: createMeter({ store: createMemoryStore(), capUsd: 100 }),
    clientFactory: () => ({ models: { generateContent: async () => { throw new Error('404 not found'); } } }),
  });
  await assert.rejects(() => generate(llm), (err) => {
    assert.ok(err instanceof NoModelAvailableError);
    assert.match(err.message, /404/);
    return true;
  });
});

/* ============================================ 5. the hand-editing terminal */

section('5. The terminal, with your hands on the keyboard');

const callWorkflow = async (body) => {
  const { resetStoreCache } = await import('../core/store.js');
  resetStoreCache();
  const handler = (await import('../api/workflow.js')).default;
  const r = {
    statusCode: 0, headers: {}, body: null, text: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(t) { this.text = t ?? ''; try { this.body = JSON.parse(this.text); } catch { this.body = null; } },
  };
  // Signed in, as the terminal always is.
  const { sessionSecret } = await import('../core/settings.js');
  const { createStore } = await import('../core/store.js');
  const { issueSession } = await import('../core/secrets.js');
  const secret = await sessionSecret(await createStore());
  await handler({ method: 'POST', headers: { cookie: `n8na_sess=${issueSession(secret)}` }, body }, r);
  return r;
};

await check('checking a hand-edit needs no n8n connection at all', async () => {
  const r = await callWorkflow({
    action: 'check',
    workflow: {
      name: 'By hand',
      nodes: [{ id: 't', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }],
      connections: {},
    },
  });
  assert.equal(r.statusCode, 200, r.text.slice(0, 150));
  assert.equal(r.body.ok, true);
  assert.ok(r.body.validation, 'checking produced no validation');
});

await check('the terminal refuses a delete by name, connected or not', async () => {
  for (const action of ['delete', 'remove', 'destroy', 'purge']) {
    const r = await callWorkflow({ action, id: 'wf1' });
    assert.equal(r.body.ok, false);
    assert.match(r.body.error, new RegExp(action, 'i'), `"${action}" was not named in the refusal`);
    assert.doesNotMatch(r.body.error, /no n8n connection/i, 'refusing a delete read as "connect one and it will work"');
  }
});

await check('an invalid hand-edit is refused and not saved', async () => {
  const r = await callWorkflow({
    action: 'check',
    workflow: {
      name: 'Invented',
      nodes: [
        { id: 't', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
        { id: 's', name: 'Slack', type: 'n8n-nodes-base.slack', typeVersion: 2.4, position: [1, 0], parameters: { resource: 'message', operation: 'post', channelName: '#general' } },
      ],
      connections: { Start: { main: [[{ node: 'Slack', type: 'main', index: 0 }]] } },
    },
  });
  assert.equal(r.body.validation.valid, false, 'an invented parameter name passed the check');
  assert.match(JSON.stringify(r.body.validation.errors), /channelName/);
});

await check('junk sent to the terminal is answered, not crashed on', async () => {
  for (const body of [{}, { action: 'check' }, { action: 'check', workflow: null }, { action: 'check', workflow: 'a string' }, { action: 'save' }]) {
    const r = await callWorkflow(body);
    assert.ok([200, 400].includes(r.statusCode), `${JSON.stringify(body)} produced ${r.statusCode}`);
    assert.ok(r.body, `${JSON.stringify(body)} produced no JSON at all`);
  }
});

/* ============================================================ report */

process.stdout.write('\n');
console.log(`\n${'-'.repeat(62)}`);
console.log(`${failures.length === 0 ? 'PASS' : 'FAIL'} — ${pass} checks passed, ${failures.length} failed`);
for (const f of failures) console.log(`  · ${f.label}\n      ${f.message}`);
if (notes.length) { console.log('\nNoted:'); for (const n of [...new Set(notes)]) console.log(`  · ${n}`); }
console.log('');
process.exit(failures.length ? 1 : 0);
