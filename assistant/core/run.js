/**
 * THE pipeline. Request in, answer out.
 *
 * This function knows nothing about HTTP, browsers, SSE, React or Vercel. The
 * web UI is one caller of it, the token-authed JSON endpoint is another, the
 * scheduled sweep is a third. What varies between callers is only how the work
 * is watched — passed in as `hooks`, which are optional and have no effect on
 * what the assistant is able to do.
 *
 * If you are adding a second way in: call this. Do not copy this.
 */

import { createStore } from './store.js';
import { createMeter } from './meter.js';
import { createLlm, TIERS } from './llm.js';
import { createN8nClient } from './n8nClient.js';
import { buildToolRegistry } from './tools.js';
import { catalogMeta } from './nodeIndex.js';
import { BudgetExceededError } from './meter.js';

/** Serverless kills the request at its limit and returns NOTHING — not an
 *  error, not a partial response, nothing. Stop before that and report what we
 *  have. An answer about three of four things beats silence about all four. */
const DEFAULT_DEADLINE_MS = 50_000;
const MAX_STEPS = 24;

const NOOP_HOOKS = {
  onStatus: () => {},
  onToolStart: () => {},
  onToolEnd: () => {},
  onText: () => {},
};

/**
 * The system prompt is ordered by volatility so the stable prefix stays
 * byte-identical between requests and can be cached: rules that never change
 * first, index facts next, per-instance facts last. Nothing per-message goes
 * in here at all.
 */
const STATIC_RULES = `You are an n8n workflow contractor. You design, build, test and repair real workflows in the user's own n8n instance.

HOW YOU WORK

1. Search for the nodes you need with search_nodes. Note the resource/operation discriminators.
2. Call get_node_schema for EVERY node you plan to use. You may not write a parameter you have not seen in a schema. There is no exception to this, including for nodes you feel certain about.
3. Ground every picker value — channel ids, sheet tabs, model names, calendar ids — with ground_options against the real credential. Never invent an id, and never adapt one you saw somewhere else.
4. Call validate_workflow before save_workflow. If it reports errors, fix them and validate again.
5. Save. New workflows are always created inactive.
6. Test with dry_run_workflow, which disables every write-capable node and pins test data. Read the execution back.
7. Only then tell the user what happened.

WHAT YOU MAY NOT DO

- Never delete anything. There is no delete tool. To retire something, archive it.
- Never overwrite a workflow without save_workflow's snapshot, which is automatic — but never bypass it.
- Never activate a workflow that can send things without explicit approval. The tool will tell you when approval is needed; relay that to the user and stop.
- Never spend the user's money or send messages on their behalf without asking.

HOW YOU REPORT

Distinguish four outcomes and never collapse them:
- it worked — say so, with the execution id as evidence
- it worked but nothing is visible — say why (e.g. writes were disabled for the dry run)
- you could not confirm — say exactly that. "I couldn't check" is NOT "it's broken". Telling the user something is broken while they are looking at it working is worse than saying nothing.
- it genuinely failed — only this is a failure

If three things were attempted and one failed, name which worked and which did not. Never report a partial result as total failure.

Never claim an action succeeded without evidence you actually read back. A 200 response is not evidence.

Be brief. The user reads fast and types fast. Lead with the answer.`;

export async function run(input, hooks = {}) {
  const h = { ...NOOP_HOOKS, ...hooks };
  const startedAt = Date.now();
  const deadlineMs = input.deadlineMs ?? DEFAULT_DEADLINE_MS;
  const deadlineAt = startedAt + deadlineMs;
  const timeLeft = () => deadlineAt - Date.now();

  const config = input.config ?? {};
  const store = input.store ?? (await createStore());
  const meter = createMeter({ store, capUsd: Number(config.monthlyCapUsd ?? process.env.MONTHLY_USD_CAP ?? 8) });

  const steps = [];
  const result = (extra) => ({
    status: 'ok',
    reply: '',
    steps,
    elapsedMs: Date.now() - startedAt,
    spend: null,
    storeKind: store.kind,
    storeDurable: store.durable,
    ...extra,
  });

  // ---- preconditions, reported rather than thrown -------------------------
  const geminiKey = config.geminiApiKey ?? process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return result({
      status: 'not_configured',
      reply: 'I have no Gemini API key, so I cannot think. Paste one in Settings (or set GEMINI_API_KEY).',
    });
  }

  let n8n = null;
  let n8nStatus = { configured: false };
  if (config.n8nBaseUrl && config.n8nApiKey) {
    // fetchImpl is injectable so the self-test can run the whole pipeline
    // against a stubbed n8n without touching a real instance.
    n8n = createN8nClient({
      baseUrl: config.n8nBaseUrl,
      apiKey: config.n8nApiKey,
      ...(input.fetchImpl ? { fetchImpl: input.fetchImpl } : {}),
    });
    n8nStatus = { configured: true, baseUrl: n8n.baseUrl };
  }

  let llm;
  try {
    llm = createLlm({ apiKey: geminiKey, meter, clientFactory: input.llmClientFactory ?? null });
  } catch (err) {
    return result({ status: 'misconfigured', reply: `Model configuration is wrong and I stopped before spending anything: ${err.message}` });
  }

  const tools = buildToolRegistry({
    n8n,
    store,
    approvals: input.approvals ?? [],
    onStatus: (s) => h.onStatus(s),
  });
  const byName = new Map(tools.map((t) => [t.name, t]));
  const functionDeclarations = tools.map(({ name, description, parameters }) => ({ name, description, parameters }));

  // ---- prompt -------------------------------------------------------------
  const meta = catalogMeta();
  const systemInstruction = [
    STATIC_RULES,
    '',
    `NODE INDEX: ${meta.nodeCount} nodes, ${meta.operationCount} operations, generated from n8n-nodes-base ${meta.packages['n8n-nodes-base']} and @n8n/n8n-nodes-langchain ${meta.packages['@n8n/n8n-nodes-langchain']}. Schema files ${meta.schemasPresent ? 'are' : 'are NOT'} available.`,
    n8nStatus.configured
      ? `N8N: connected to ${n8nStatus.baseUrl}.`
      : 'N8N: not configured. You can still search nodes and design a workflow, but you cannot read, save, ground or test anything. Say so plainly rather than pretending.',
  ].join('\n');

  const session = input.sessionId ? await store.getSession(input.sessionId) : { id: null, messages: [] };
  const contents = [
    ...(session.messages ?? []),
    { role: 'user', parts: [{ text: input.text }] },
  ];

  // ---- the loop -----------------------------------------------------------
  let reply = '';
  let stoppedBecause = null;
  let tier = input.tier ?? pickTier(input.text);

  for (let step = 0; step < MAX_STEPS; step++) {
    if (timeLeft() < 8000) {
      stoppedBecause = 'deadline';
      break;
    }

    let response;
    try {
      h.onStatus(step === 0 ? 'Thinking…' : 'Working…');
      response = await llm.generate({ tier, contents, systemInstruction, functionDeclarations, label: `step${step}` });
    } catch (err) {
      if (err instanceof BudgetExceededError) {
        return result({ status: 'budget_exceeded', reply: err.message, spend: await meter.summary() });
      }
      return result({ status: 'model_error', reply: `The model call failed: ${err.message}`, spend: await meter.summary() });
    }

    if (response.empty) {
      // The silent-failure signature. Say what happened rather than returning
      // an empty bubble.
      return result({
        status: 'empty_response',
        reply: `The model returned nothing at all. ${response.emptyReason} This usually means the thinking budget ate the output allowance.`,
        spend: await meter.summary(),
      });
    }

    if (response.text) {
      reply += (reply ? '\n\n' : '') + response.text;
      h.onText(response.text);
    }

    const calls = response.functionCalls ?? [];
    if (!calls.length) {
      contents.push({ role: 'model', parts: [{ text: response.text }] });
      stoppedBecause = 'done';
      break;
    }

    contents.push({ role: 'model', parts: calls.map((c) => ({ functionCall: { name: c.name, args: c.args ?? {} } })) });

    const responseParts = [];
    for (const call of calls) {
      // Tool calls are run one at a time, not in a Promise.all. One failing
      // tool must never sink the others, and n8n drops rapid concurrent writes.
      const tool = byName.get(call.name);
      if (!tool) {
        responseParts.push(fnResponse(call, { ok: false, error: `No tool called "${call.name}".` }));
        continue;
      }

      if (timeLeft() < 4000) {
        responseParts.push(fnResponse(call, { ok: false, error: 'Out of time on this request; not starting new work.' }));
        stoppedBecause = 'deadline';
        break;
      }

      h.onToolStart({ name: call.name, args: call.args });
      let out;
      try {
        out = await tool.handler(call.args ?? {});
      } catch (err) {
        out = { ok: false, error: `${call.name} threw: ${err.message}` };
      }
      steps.push({ tool: call.name, args: call.args, ok: out.ok !== false, summary: summarise(out) });
      h.onToolEnd({ name: call.name, result: out });
      responseParts.push(fnResponse(call, out));

      // Once we've searched or fetched a schema, we are designing — move up a
      // tier. A one-line command needs almost no deliberation; a workflow
      // needs a lot, and one flat setting for both caps how good it can be.
      if (tier === 'chat' && (call.name === 'get_node_schema' || call.name === 'validate_workflow')) tier = 'design';
    }

    contents.push({ role: 'user', parts: responseParts });
    if (stoppedBecause === 'deadline') break;
  }

  if (stoppedBecause === 'deadline') {
    const jobId = `job_${Date.now().toString(36)}`;
    await store.saveJob({ id: jobId, sessionId: input.sessionId ?? null, contents, createdAt: new Date().toISOString(), status: 'paused' });
    return result({
      status: 'continuing',
      jobId,
      reply:
        (reply ? `${reply}\n\n` : '') +
        `I ran out of time on this request before finishing. Here is what I completed: ${steps.map((s) => s.tool).join(', ') || 'nothing yet'}. Ask me to continue and I will pick up from here.`,
      spend: await meter.summary(),
    });
  }

  if (input.sessionId) {
    await store.saveSession({ id: input.sessionId, messages: contents.slice(-40) });
  }

  return result({ status: 'ok', reply: reply || '(no answer produced)', spend: await meter.summary(), n8n: n8nStatus });
}

function fnResponse(call, out) {
  return { functionResponse: { name: call.name, response: out } };
}

/** Cheap turns should not pay for deliberation they do not need. */
function pickTier(text) {
  const t = String(text ?? '').toLowerCase();
  const designish = /\b(build|create|make|design|workflow|automat\w*|fix|repair|broke|failed|test|connect)\b/.test(t);
  return designish ? 'design' : 'chat';
}

function summarise(out) {
  if (out?.ok === false) return `failed: ${String(out.error).slice(0, 200)}`;
  const keys = Object.keys(out ?? {}).filter((k) => k !== 'ok');
  return keys.slice(0, 6).join(', ') || 'ok';
}

export { TIERS };
