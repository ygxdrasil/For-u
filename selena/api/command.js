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
import { parseCommand, fromModel, fallbackPrompt, FALLBACK_SCHEMA, affordability, VERBS } from '../core/commands.js';
import { runResearch } from '../core/research.js';
import { createWatch, runWatch } from '../core/watches.js';
import { handToJason } from '../core/jason.js';
import { explore, saveProposals } from '../core/explore.js';
import { summarizeFinding } from '../core/schema.js';
import { phraseSimilarity } from '../core/util.js';

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
  const money = affordability(parsed.estimateUsd, summary.headroomUsd);

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

  // ---- confirm -----------------------------------------------------------
  if (parsed.needsConfirm && body.confirm !== true) {
    return json(res, 200, {
      ok: true,
      executed: false,
      awaitingConfirmation: true,
      understood: parsed.understood,
      interpreted: parsed.source === 'model',
      spends: parsed.spends,
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
      for (const watch of due.slice(0, 3)) {
        if (ctx.deadline.tooLateFor(12_000)) break;
        try {
          const outcome = await runWatch(watch, ctx);
          ran.push({ name: watch.name, status: outcome.result.status, reported: outcome.reported, reason: outcome.reason, costUsd: outcome.result.costUsd });
        } catch (err) {
          ran.push({ name: watch.name, status: 'failed', error: err.message });
        }
      }
      const reported = ran.filter((r) => r.reported);
      return done({
        ran,
        message: reported.length
          ? `${reported.length} watch(es) had something new.`
          : `Ran ${ran.length} watch(es); nothing had moved. That is her working, not failing.`,
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

    case 'stop': {
      const watches = await ctx.store.listWatches();
      const active = watches.filter((w) => w.state === 'active');
      for (const w of active) await ctx.store.putWatch({ ...w, state: 'paused' });
      return done({ paused: active.map((w) => w.name), message: `Paused ${active.length} watch(es). Nothing will run on a schedule until you resume them.` });
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
        const outcome = await handToJason(found.match, {
          store: ctx.store,
          endpoint: process.env.JASON_ENDPOINT ?? null,
          token: process.env.JASON_TOKEN ?? null,
          fetchImpl: ctx.fetchImpl,
          force: body.force === true,
        });
        return done({
          delivery: outcome.delivery,
          message: outcome.delivery.attempted
            ? outcome.delivery.ok
              ? `Sent to Jason. He said: ${String(outcome.delivery.detail).slice(0, 120)}`
              : `Marked as handed, but delivery failed: ${outcome.delivery.detail}`
            : 'Packet prepared and recorded. No JASON_ENDPOINT is set, so it was not sent anywhere.',
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
