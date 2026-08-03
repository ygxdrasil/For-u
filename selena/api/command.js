/**
 * POST /api/command — the command bar's one endpoint.
 *
 * Two phases, always. The first call parses and answers with what she
 * understood plus what it would cost; the second, carrying `confirm: true`,
 * carries it out. Anything that spends money or changes something outward
 * waits for that second call, so a typo costs a keystroke rather than a dig.
 *
 * Execution goes through the same functions every other caller uses —
 * runResearch, runWatch, handToJason. There is no second copy of the pipeline
 * behind the command bar, because that is exactly how two researchers with
 * different standards appear.
 *
 * Body: { text, confirm?, parsed? }
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { parseCommand, fromModel, fallbackPrompt, FALLBACK_SCHEMA, affordability, priceDueRun, VERBS } from '../core/commands.js';
import { runResearch } from '../core/research.js';
import { createWatch, runWatch, isDue } from '../core/watches.js';
import { handToJason, resolveJasonTarget } from '../core/jason.js';
import { explore, saveProposals } from '../core/explore.js';
import { arm as armHer, disarm, readAutonomy, describeAutonomy } from '../core/autonomy.js';
import { stopEverything } from '../core/pass.js';
import { summarizeFinding } from '../core/schema.js';
import { phraseSimilarity, nowIso } from '../core/util.js';

/**
 * Find the one watch or finding a target names.
 *
 * Returns the match, or every candidate when it is genuinely ambiguous —
 * because "pause the invoice watch" with two invoice watches must ask which,
 * not pick the first and leave the other running.
 */
function matchOne(candidates, target, labelOf) {
  const needle = String(target ?? '').toLowerCase().trim();
  if (!needle) return { match: null, ambiguous: [], reason: 'nothing named' };

  const scored = candidates
    .map((c) => {
      const label = String(labelOf(c) ?? '').toLowerCase();
      const contains = label.includes(needle) || needle.includes(label);
      return { item: c, label, score: contains ? 1 : phraseSimilarity(label, needle) };
    })
    .filter((s) => s.score >= 0.34)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return { match: null, ambiguous: [], reason: 'nothing matches that' };

  const best = scored[0];
  const rivals = scored.filter((s) => s.score >= best.score - 0.001);
  if (rivals.length > 1) return { match: null, ambiguous: rivals.map((r) => r.item), reason: 'more than one thing matches that' };

  return { match: best.item, ambiguous: [], reason: null };
}

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const ctx = await createContext({ budgetMs: 50_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error, needsLogin: gate.needsLogin });

  const body = await readBody(req);
  const text = String(body.text ?? '').slice(0, 2000);

  // ---- parse -------------------------------------------------------------
  let parsed = parseCommand(text);

  // Only pay a model when no rule recognised it, and only to choose among the
  // verbs she already has.
  if (!parsed.ok && parsed.problem === 'no matching verb' && ctx.llm && text.trim()) {
    try {
      const res2 = await ctx.llm.generateJson({
        tier: 'chat',
        systemInstruction: 'You map a typed instruction onto one of a fixed list of actions. You never invent an action, and you say so when nothing fits.',
        prompt: fallbackPrompt(text),
        responseSchema: FALLBACK_SCHEMA,
        label: 'command',
        timeoutMs: 12_000,
      });
      if (res2.json) parsed = fromModel(res2.json);
    } catch {
      // A failed interpretation is not a failed request; the rules' answer
      // stands and she says she did not understand.
    }
  }

  const summary = await ctx.meter.summary().catch(() => ({ headroomUsd: 0, capUsd: ctx.capUsd }));

  if (!parsed.ok) {
    return json(res, 200, {
      ok: false,
      executed: false,
      understood: parsed.understood,
      problem: parsed.problem,
      suggestions: parsed.suggestions,
      verbs: Object.entries(VERBS).map(([name, v]) => ({ name, summary: v.summary, example: v.examples[0] })),
    });
  }

  // `run` no longer stops at a fixed three, so its parse-time estimate — which
  // assumed two — would quote for two and spend for eight. The count is only
  // knowable here, with the store open, so the estimate is corrected before it
  // is shown rather than after it is spent.
  if (parsed.verb === 'run' && parsed.args?.which === 'due') {
    const dueNow = (await ctx.store.listWatches().catch(() => [])).filter((w) => w.state === 'active' && isDue(w, nowIso()));
    parsed = priceDueRun(parsed, dueNow.length);
  }

  // Priced AFTER that correction, never before: quoting the two-watch estimate
  // and then running nine is the exact dishonesty the correction exists to
  // prevent.
  const money = affordability(parsed.estimateUsd, summary.headroomUsd);

  // ---- confirm -----------------------------------------------------------
  if (parsed.needsConfirm && body.confirm !== true) {
    return json(res, 200, {
      ok: true,
      executed: false,
      awaitingConfirmation: true,
      understood: parsed.understood,
      interpreted: parsed.source === 'model',
      spends: parsed.spends,
      dueCount: parsed.dueCount,
      estimateUsd: money.cost,
      headroomUsd: money.left,
      affordable: money.affordable,
      parsed: { verb: parsed.verb, args: parsed.args },
    });
  }

  if (parsed.spends && !money.affordable) {
    return json(res, 200, {
      ok: false,
      executed: false,
      understood: parsed.understood,
      problem: `that would cost about $${money.cost.toFixed(3)} and only $${money.left.toFixed(3)} is left this month`,
    });
  }

  // ---- carry it out ------------------------------------------------------
  const a = parsed.args ?? {};
  const done = (payload) => json(res, 200, { ok: true, executed: true, verb: parsed.verb, understood: parsed.understood, ...payload, context: contextStatus(ctx) });

  await ctx.store.addActivity({ kind: 'command', level: 'info', message: `command: ${parsed.understood}` });

  switch (parsed.verb) {
    case 'help':
      return done({ verbs: Object.entries(VERBS).map(([name, v]) => ({ name, summary: v.summary, examples: v.examples })) });

    case 'show':
      // Nothing to run: this is navigation, answered so the HUD can move.
      return done({ navigate: a });

    case 'explore': {
      const found = await explore({}, ctx);
      const fresh = found.proposals.length ? await saveProposals(ctx.store, found.proposals) : [];
      return done({
        proposals: fresh,
        read: found.read,
        notes: found.notes,
        costUsd: found.costUsd,
        message: fresh.length
          ? `Read ${found.read} posts and found ${fresh.length} thing(s) worth watching. Nothing is watched until you approve it.`
          : `Read ${found.read} posts and found nothing worth a watch. ${found.notes.join(' ')}`,
      });
    }

    case 'watch': {
      const watch = createWatch({ name: a.topic, topic: a.topic, cadence: a.cadence, depth: a.depth });
      await ctx.store.putWatch(watch);
      return done({ watch, message: `Standing watch on "${watch.topic}", ${a.cadence}. It has not run yet.` });
    }

    case 'research': {
      const result = await runResearch({ topic: a.topic, kind: 'question', requestedDepth: a.depth }, ctx);
      if (result.finding) await ctx.store.putFinding(result.finding);
      return done({
        status: result.status,
        finding: result.finding,
        summary: result.finding ? summarizeFinding(result.finding) : null,
        notes: result.notes,
        costUsd: result.costUsd,
        depth: result.depth,
        stoppedEarly: result.stoppedEarly,
        message: result.finding
          ? `Level ${result.finding.evidence.strength}: ${result.finding.demand.oneLine}`
          : `Nothing to report. ${result.notes.join(' ')}`,
      });
    }

    case 'run': {
      const watches = await ctx.store.listWatches();
      if (a.which === 'named') {
        const found = matchOne(watches, a.target, (w) => `${w.name} ${w.topic}`);
        if (!found.match) return done({ executed: false, problem: found.reason, candidates: found.ambiguous.map((w) => w.name) });
        const outcome = await runWatch(found.match, ctx);
        return done({
          reported: outcome.reported,
          status: outcome.result.status,
          costUsd: outcome.result.costUsd,
          finding: outcome.result.finding,
          message: outcome.reported ? outcome.reason : `${found.match.name}: ${outcome.reason}`,
        });
      }

      const due = watches.filter((w) => w.state === 'active');
      if (!due.length) return done({ executed: false, message: 'No active watches to run.' });

      const ran = [];
      // As many as the clock allows rather than three. The loop already stops
      // when there is not enough time left for another, and says how many were
      // left — a fixed three was capping a sweep that had plenty of budget.
      for (const watch of due) {
        if (ctx.deadline.tooLateFor(12_000)) break;
        try {
          const outcome = await runWatch(watch, ctx);
          ran.push({ name: watch.name, status: outcome.result.status, reported: outcome.reported, reason: outcome.reason, costUsd: outcome.result.costUsd });
        } catch (err) {
          ran.push({ name: watch.name, status: 'failed', error: err.message });
        }
      }
      const reported = ran.filter((r) => r.reported);
      const left = due.length - ran.length;
      const leftNote = left > 0 ? ` ${left} more were due but there was not time in one request — say run again.` : '';
      return done({
        ran,
        remainingDue: Math.max(0, left),
        message: reported.length
          ? `${reported.length} of ${ran.length} watch(es) had something new.${leftNote}`
          : `Ran ${ran.length} watch(es); nothing had moved. That is her working, not failing.${leftNote}`,
      });
    }

    case 'pause':
    case 'resume': {
      const watches = await ctx.store.listWatches();
      const found = matchOne(watches, a.target, (w) => `${w.name} ${w.topic}`);
      if (!found.match) return done({ executed: false, problem: found.reason, candidates: found.ambiguous.map((w) => w.name) });
      const updated = { ...found.match, state: parsed.verb === 'pause' ? 'paused' : 'active' };
      await ctx.store.putWatch(updated);
      return done({ watch: updated, message: `"${updated.name}" is now ${updated.state}.` });
    }

    case 'arm': {
      if (a.on) {
        // The same two refusals as the switch in the rail. Arming her to fail
        // on a schedule is worse than not arming her, because it looks like it
        // worked.
        if (!ctx.llm) return done({ executed: false, problem: `I cannot read anything without a model key, so working on my own would just schedule failures. ${ctx.llmError}` });
        if (!ctx.store.durable) {
          return done({
            executed: false,
            problem:
              'Storage is in memory, so I would forget what I already reported between cold starts and report the same thing every run — and my own brakes would reset with it. Set DATABASE_URL first.',
          });
        }
        const state = await armHer(ctx.store, {});
        const money = await ctx.meter.summary().catch(() => ({ capUsd: ctx.capUsd, monthToDateUsd: 0 }));
        return done({
          autonomy: { armed: true },
          message: `Working on my own from now on. ${describeAutonomy(state, { capUsd: money.capUsd, spentUsd: money.monthToDateUsd })} Only level 5 goes to Jason, and stop everything is in the sidebar.`,
        });
      }
      await disarm(ctx.store, { by: 'you' });
      return done({ autonomy: { armed: false }, message: 'Stood down. Your watches still run on their schedule; I will not go looking or send anything on my own.' });
    }

    case 'stop': {
      // "stop everything" means everything: the watches AND her working alone.
      // Pausing the watches while leaving her armed to roam and hand things
      // over would be the most dangerous possible reading of the words.
      const outcome = await stopEverything(ctx.store);
      const was = await readAutonomy(ctx.store);
      return done({
        paused: outcome.paused,
        autonomy: { armed: was.armed },
        message: `Paused ${outcome.paused.length} watch(es) and stood down. Nothing runs on a schedule, and nothing goes to Jason, until you say so.`,
      });
    }

    case 'open':
    case 'send':
    case 'archive': {
      const findings = await ctx.store.listFindings({ status: 'active', limit: 200 });
      const found = matchOne(findings, a.target, (f) => `${f.demand?.oneLine} ${f.demand?.whoHasIt}`);
      if (!found.match) {
        return done({ executed: false, problem: found.reason, candidates: found.ambiguous.map((f) => f.demand.oneLine) });
      }

      if (parsed.verb === 'open') return done({ navigate: { page: 'findings', id: found.match.id }, message: found.match.demand.oneLine });

      if (parsed.verb === 'archive') {
        await ctx.store.putFinding({ ...found.match, status: 'archived' });
        return done({ message: `Archived "${found.match.demand.oneLine}". Archived, not deleted — every version is still on record.` });
      }

      try {
        const { getSessionSecret } = await import('../core/password.js');
        const target = await resolveJasonTarget({
          env: process.env,
          store: ctx.store,
          secret: await getSessionSecret(ctx.store).catch(() => null),
        });
        const outcome = await handToJason(found.match, {
          store: ctx.store,
          endpoint: target.endpoint,
          token: target.token,
          fetchImpl: ctx.fetchImpl,
          force: body.force === true,
        });
        return done({
          delivery: outcome.delivery,
          via: target.via,
          message: outcome.delivery.attempted
            ? outcome.delivery.ok
              ? `Sent to Jason${target.via === 'connections' ? ` (${target.name}, from Connections)` : ''}. He said: ${String(outcome.delivery.detail).slice(0, 120)}`
              : `Marked as handed, but delivery failed: ${outcome.delivery.detail}`
            : 'Packet prepared and recorded. Jason is not connected — set JASON_ENDPOINT, or add him as a builder on Connections — so it was not sent anywhere.',
        });
      } catch (err) {
        if (err.name === 'NotBuildableError') {
          return done({ executed: false, problem: err.message, canForce: true });
        }
        throw err;
      }
    }

    default:
      return done({ executed: false, problem: `no handler for "${parsed.verb}"` });
  }
});
