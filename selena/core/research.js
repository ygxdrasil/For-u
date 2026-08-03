/**
 * The pipeline: plan -> search -> read -> verify -> score -> record.
 *
 * This function knows nothing about HTTP, browsers, cron or React. Everything
 * it touches arrives as a dependency. That is deliberate and it is the main
 * structural rule of the project: the HUD is one caller, the token-authed
 * endpoint is another, the scheduler is a third, and there is exactly one
 * pipeline. A second entry point with its own copy would drift, and then there
 * are two researchers with different standards and nobody notices which one
 * produced the thing on the screen.
 *
 * Four outcomes, never two. A run reports itself as:
 *   'found'       — a finding that passed validation
 *   'nothing'     — read the material, there is genuinely nothing here
 *   'unverified'  — could not establish it either way, and says why
 *   'failed'      — something actually broke
 * Only the last is a failure. Telling the operator something is broken while
 * it is working teaches them to stop believing the status.
 */

import { createDeadline, nowIso, randomId, spacedSettled, clampNumber, balancedSample } from './util.js';
import { createLedger, enforceLedger } from './ledger.js';
import { validateFinding, dedupKeyFor } from './schema.js';
import { applyEvidence, computeEvidence } from './evidence.js';
import { classifyBuildability, mergeModelOpinion } from './buildability.js';
import { decideDepth, reconsiderDepth } from './depth.js';
import { systemPrompt, searchPrompt, extractionPrompt, EXTRACTION_SCHEMA, BUILDABILITY_SCHEMA } from './prompts.js';
import { BudgetExceededError } from './meter.js';

export const RUN_STATUS = ['found', 'nothing', 'unverified', 'failed'];

/**
 * The angles a deep pass works through, in order of what they contribute.
 * Depth decides how many of these get used, so the cheap runs still cover the
 * two questions that decide whether anything is here at all.
 */
export const ANGLES = [
  { id: 'pain', text: 'what people in this niche are asking for, struggling with, or complaining about, in their own words' },
  { id: 'paying', text: 'what is already being sold to these people and at what actual price — listings, gigs, products with real prices' },
  { id: 'reviews', text: 'reviews and complaints about those existing products: what specifically disappoints buyers' },
  { id: 'who', text: 'exactly who has this problem — what kind of business, what size, what they do day to day — and what they use today instead' },
  { id: 'cost', text: 'what the current workaround costs them in money or hours' },
  { id: 'size', text: 'how many of these businesses there are, and whether any published figure actually supports a number' },
  { id: 'switch', text: 'what would have to be true for one of them to switch away from what they use now' },
];

/**
 * How much of what she read reaches the model, and how much reaches the record.
 *
 * These were 12, 12 and 8, taken in arrival order. Measured against the real
 * sources, that meant a run read 360 posts from nine sources and showed the
 * model twelve — all twelve from the one forum that answered first. Every
 * review feed and every public-records source was fetched and discarded, and
 * those are the only sources that carry a price or a paying customer, so the
 * ladder could not reach level 3 however much evidence was out there.
 *
 * The numbers are bounded by cost, not by caution. At ~320 characters a line
 * this is roughly 15k input tokens on the extract tier — a fraction of a cent
 * per run. Reading was already free; this was throwing the reading away.
 */
export const COMMUNITY_SHOWN = 60;
export const CONNECTED_SHOWN = 90;
/** What the ladder counts as distinct voices. Eight was a ceiling on "how many". */
export const IN_THEIR_WORDS_KEPT = 40;

function log(deps, level, message, extra = {}) {
  // `now` is optional on deps — every other read of it falls back to nowIso,
  // and tracing must not be the one place that throws when it is absent.
  const at = (deps.now ?? nowIso)();
  deps.onEvent?.({ at, level, message, ...extra });
}

/**
 * @param {object} task
 * @param {string} task.topic
 * @param {'watch'|'question'|'reverify'} [task.kind]
 * @param {string} [task.watchId]
 * @param {'glance'|'check'|'dig'|'deep'} [task.requestedDepth]
 * @param {object|null} [task.priorFinding]
 *
 * @param {object} deps
 * @param {object} deps.store
 * @param {object} deps.meter
 * @param {object|null} deps.llm    null when no key is configured
 * @param {object|null} deps.etsy
 * @param {number} [deps.budgetMs]  wall-clock deadline, set inside the platform limit
 */
export async function runResearch(task, deps) {
  const now = deps.now ?? nowIso;
  const runId = randomId('run');
  const startedAt = now();
  // Serverless kills the request at its own limit and returns NOTHING — not an
  // error, not a partial body. So the pipeline holds its own deadline well
  // inside that and reports what it managed.
  const deadline = deps.deadline ?? createDeadline(deps.budgetMs ?? 50_000);
  // A fresh ledger per run unless one was injected. Provenance is per-run on
  // purpose: a URL read in March does not make a number quoted in September
  // true, and a shared ledger would let one run's sources vouch for another's.
  const ledger = deps.ledger ?? createLedger({ now });
  const notes = [];
  const readings = [];

  // Local, NOT on deps. The context object is shared across every run in a
  // scheduler sweep, so stashing evidence on it meant run two could merge
  // run one's Etsy listings if its own Etsy call failed — silently attributing
  // one topic's prices to another.
  let etsyEvidence = null;
  let communityAsks = null;
  let connectorAsks = null;

  // Declared before the first possible return. finish() is hoisted and reads
  // all three, so a `let` further down put them in the temporal dead zone and
  // any EARLY return — no API key, no topic — threw a ReferenceError instead of
  // returning the honest status it had just built. That is the missing-key
  // path, which is exactly the path a first deploy takes.
  let searchesDone = 0;
  let stoppedEarly = false;
  let stoppedReason = null;
  // Same reason: finish() reads depth, and the empty-topic return happens
  // before the real decision is made. A placeholder is honest — no depth was
  // chosen because there was nothing to research.
  let depth = { level: 'glance', reasoning: 'not decided — the run ended before planning', rank: 0, searches: 1 };
  // How many claims cited a source this run never read. Zero is the normal
  // case. It is reported rather than only logged because an unattended run
  // halts on it: when nobody is watching, a run that had to have claims
  // deleted is a run whose survivors have not earned the benefit of the doubt.
  let ledgerViolations = 0;

  const topic = typeof task?.topic === 'string' ? task.topic.trim() : '';
  if (!topic) {
    return finish('failed', null, ['no topic was given, so there was nothing to research']);
  }

  let spendBefore = 0;
  try {
    spendBefore = await deps.store.getMonthlySpend();
  } catch (err) {
    notes.push(`could not read current spend (${err.message}); proceeding, but the cost figure for this run may be wrong`);
  }

  const summary = await deps.meter.summary().catch(() => ({ headroomUsd: Infinity, capUsd: null }));
  const headroom = Number.isFinite(summary.headroomUsd) ? summary.headroomUsd : Infinity;

  const ageDays = task.priorFinding?.lastVerifiedAt
    ? (Date.parse(now()) - Date.parse(task.priorFinding.lastVerifiedAt)) / 86_400_000
    : null;

  depth = decideDepth({ task, headroomUsd: headroom, ageDays });
  log(deps, 'plan', `depth: ${depth.level} — ${depth.reasoning}`, { runId, topic });

  // Without a model Selena can still run, still show her state, and still be
  // honest. What she must not do is produce a finding, because every word of
  // it would be invented.
  if (!deps.llm) {
    return finish('unverified', null, [
      'No Gemini API key is configured, so nothing could be read. Selena will not produce a finding she cannot source — that is the one failure mode that makes an engine like this dangerous rather than useless.',
    ]);
  }

  // ---- search -----------------------------------------------------------
  const angles = ANGLES.slice(0, clampNumber(depth.searches, 1, ANGLES.length, 1));

  const runAngle = async (angle) => {
    const res = await deps.llm.generate({
      tier: 'search',
      systemInstruction: systemPrompt(),
      prompt: searchPrompt({
        topic,
        angle: angle.text,
        priorKnowledge: task.priorFinding
          ? `${task.priorFinding.demand?.oneLine} (strength ${task.priorFinding.evidence?.strength}, last verified ${task.priorFinding.lastVerifiedAt})`
          : null,
      }),
      label: task.watchId ? `watch:${task.watchId}` : `research:${task.kind ?? 'question'}`,
      timeoutMs: Math.min(40_000, Math.max(8_000, deadline.remainingMs - 8_000)),
    });

    for (const s of res.sources) {
      ledger.record({ url: s.url, status: 200, via: 'grounded-search', title: s.title, domain: s.domain });
    }
    if (res.text?.trim()) readings.push(`### ${angle.id}\n${res.text.trim()}`);
    if (res.empty) notes.push(`the ${angle.id} pass came back empty: ${res.emptyReason}`);
    searchesDone += 1;
    return res;
  };

  try {
    // First pass on its own, so depth can be reconsidered before spending the
    // rest of the budget on angles that may not be worth it.
    await runAngle(angles[0]);
    log(deps, 'search', `read ${ledger.size()} source${ledger.size() === 1 ? '' : 's'} on the first pass`, { runId });

    // ---- read the API source, where it applies --------------------------
    if (deps.etsy?.available && !deadline.tooLateFor(6_000)) {
      try {
        const etsy = await deps.etsy.gatherEvidence({ keywords: topic, listingLimit: depth.rank >= 2 ? 8 : 4 });
        if (etsy.available) {
          readings.push(
            `### etsy (read directly through the API)\n` +
              `${etsy.paying.length} priced listings, ${etsy.complaints.length} complaints from reviews, ${etsy.read} of ${etsy.attempted} listings' reviews read.\n` +
              etsy.paying
                .map((p) => `- ${p.what} — ${p.price} ${p.currency} — ${p.url} — sales signal: ${p.salesSignal ?? 'none available'}`)
                .join('\n') +
              (etsy.complaints.length
                ? `\nComplaints:\n${etsy.complaints.map((c) => `- about "${c.aboutWhat}": "${c.quote}" (${c.url})`).join('\n')}`
                : ''),
          );
          // Etsy evidence is carried structurally as well as in the prose, so
          // it survives even if the extraction model under-reports it.
          etsyEvidence = etsy;
          if (etsy.partial) notes.push(`Etsy: read ${etsy.read} of ${etsy.attempted} listings' reviews; the rest failed or ran out of time. That is a caveat, not a failure.`);
        } else {
          notes.push(etsy.reason);
        }
      } catch (err) {
        // One dead source must not sink the run.
        notes.push(`Etsy lookup failed (${err.message}); continuing with what the web gave us`);
      }
    } else if (deps.etsy && !deps.etsy.available) {
      notes.push('Etsy is dark (no ETSY_API_KEY), so the strongest evidence source was unavailable for this run.');
    }

    // ---- the free community sources -------------------------------------
    // No key, no quota to speak of, and full of people stating a need in their
    // own words with a permanent link. They only ever produce asks, so they
    // cannot inflate a finding past level 2 on their own.
    if (deps.community && !deadline.tooLateFor(6_000)) {
      try {
        // Reading is free. Depth decides how much MODEL work a run is worth,
        // not how much text she is allowed to look at first.
        const found = await deps.community.gatherAsks({ keywords: topic, hnLimit: 25, seLimit: 12 });
        communityAsks = found;
        for (const ask of found.asks) {
          ledger.record({ url: ask.url, status: 200, via: 'direct-fetch', title: ask.title, domain: null });
        }
        if (found.asks.length) {
          readings.push(
            `### community (read directly through free APIs)\n` +
              balancedSample(found.asks, COMMUNITY_SHOWN, (x) => x.platform ?? x.source ?? 'unknown')
                .map((x) => `- "${x.quote.slice(0, 320)}" — ${x.url}`)
                .join('\n'),
          );
        }
        if (found.partial) {
          notes.push(`community sources: read ${found.read} of ${found.attempted}; ${found.failures.map((f) => `${f.source} failed (${f.error})`).join('; ')}. A caveat, not a failure.`);
        }
      } catch (err) {
        notes.push(`community lookup failed (${err.message}); continuing with what the rest gave us`);
      }
    }

    // ---- the sources you connected yourself ------------------------------
    // These are the ones that know about barbers, letting agents and florists
    // rather than about software. They go through exactly the same ledger as
    // everything else: a pasted API buys reach, not trust.
    if (deps.connectors && !deadline.tooLateFor(8_000)) {
      try {
        const found = await deps.connectors.gather(topic, { ledger });
        if (found.asks.length) {
          connectorAsks = found;
          const shown = balancedSample(found.asks, CONNECTED_SHOWN, (x) => x.source ?? 'unknown');
          readings.push(
            `### your connected sources\n` +
              shown.map((x) => `- "${x.quote.slice(0, 320)}" — ${x.url} (via ${x.source})`).join('\n'),
          );
          log(deps, 'read', `${found.asks.length} post(s) from ${found.read} connected source(s), ${shown.length} shown`, { runId });
        }
        if (found.failures.length) {
          notes.push(`connected sources: ${found.failures.map((f) => `${f.name} did not answer (${f.detail})`).join('; ')}. A caveat, not a failure.`);
        }
      } catch (err) {
        notes.push(`your connected sources could not be read (${err.message}); continuing with what the rest gave us`);
      }
    }

    // ---- reconsider depth, out loud -------------------------------------
    const interim = computeEvidence({
      paying: etsyEvidence?.paying ?? [],
      complaints: etsyEvidence?.complaints ?? [],
      inTheirWords: communityAsks?.asks ?? [],
    });
    const reconsidered = reconsiderDepth({
      current: depth.level,
      signals: {
        payingCount: interim.counts.paying,
        complaintCount: interim.counts.complaints,
        agreementCount: interim.agreement.count,
        agreementSources: interim.agreement.sources.length,
      },
      headroomUsd: Number.isFinite(summary.headroomUsd) ? summary.headroomUsd : Infinity,
    });
    if (reconsidered.changed) {
      log(deps, 'plan', `${reconsidered.direction} to ${reconsidered.level}: ${reconsidered.reasoning}`, { runId });
      depth = { ...reconsidered, reasoning: `${depth.reasoning} — then ${reconsidered.direction}: ${reconsidered.reasoning}` };
    }

    // ---- remaining passes, spaced ---------------------------------------
    const remaining = ANGLES.slice(1, clampNumber(depth.searches, 1, ANGLES.length, 1));
    const results = await spacedSettled(remaining, runAngle, { gapMs: 700, deadline });
    for (const r of results) {
      if (!r.ok && !r.skipped) notes.push(`a search pass failed: ${r.error}`);
      if (r.skipped) {
        stoppedEarly = true;
        stoppedReason = 'ran out of time before every angle was covered';
      }
    }
  } catch (err) {
    if (err.name === 'BudgetExceededError') {
      stoppedEarly = true;
      stoppedReason = err.message;
      notes.push(`Stopped at the spend cap. ${err.message} Everything already verified is kept.`);
      log(deps, 'budget', err.message, { runId });
    } else {
      log(deps, 'error', `search failed: ${err.message}`, { runId });
      return finish('failed', null, [...notes, `search failed: ${err.message}`]);
    }
  }

  if (!readings.length && !etsyEvidence?.paying?.length && !communityAsks?.asks?.length && !connectorAsks?.asks?.length) {
    return finish('nothing', null, [...notes, 'nothing readable came back for this topic']);
  }

  // ---- extract ----------------------------------------------------------
  let extracted = null;
  try {
    if (deadline.tooLateFor(6_000)) {
      stoppedEarly = true;
      stoppedReason = stoppedReason ?? 'ran out of time before the material could be turned into a finding';
      return finish('unverified', null, [...notes, stoppedReason]);
    }

    const citable = ledger.citable();
    if (!citable.length) {
      return finish('unverified', null, [...notes, 'no citable source survived the run, so any finding would rest on nothing']);
    }

    const res = await deps.llm.generateJson({
      tier: 'extract',
      systemInstruction: systemPrompt(),
      prompt: extractionPrompt({ topic, readings: readings.join('\n\n'), citable }),
      responseSchema: EXTRACTION_SCHEMA,
      label: task.watchId ? `watch:${task.watchId}` : `research:${task.kind ?? 'question'}`,
      timeoutMs: Math.min(40_000, Math.max(8_000, deadline.remainingMs - 3_000)),
    });

    if (res.parseError) {
      // One diagnostic beats three hopeful retries: report what actually came
      // back rather than guessing at a fix.
      return finish('failed', null, [...notes, `the extraction model did not return usable JSON: ${res.parseError}`]);
    }
    extracted = res.json;
  } catch (err) {
    if (err.name === 'BudgetExceededError') {
      return finish('unverified', null, [...notes, `Stopped at the spend cap before extraction. ${err.message}`]);
    }
    return finish('failed', null, [...notes, `extraction failed: ${err.message}`]);
  }

  if (!extracted || extracted.found === false) {
    return finish('nothing', null, [...notes, extracted?.notFoundReason || 'read the material and there is genuinely nothing here']);
  }

  // ---- merge the API evidence in, then verify ---------------------------
  const merged = {
    ...extracted,
    watchId: task.watchId ?? null,
    demand: {
      ...(extracted.demand ?? {}),
      inTheirWords: [
        ...(extracted.demand?.inTheirWords ?? []),
        // Structural, not just in the prose: an extraction that under-reports
        // these would silently throw away quotes we genuinely read.
        // Balanced, and forty rather than eight. This list is what the ladder
        // counts as distinct voices, so taking the first eight in arrival
        // order capped how many people she could ever show wanted a thing —
        // and, because arrival order is grouped by source, took all eight from
        // whichever source happened to answer first.
        ...balancedSample(
          [...(communityAsks?.asks ?? []), ...(connectorAsks?.asks ?? [])],
          IN_THEIR_WORDS_KEPT,
          (x) => x.platform ?? x.source ?? 'unknown',
        ).map((x) => ({
          quote: x.quote,
          url: x.url,
          date: x.date ?? x.at ?? null,
          platform: x.platform ?? x.source ?? null,
          via: x.via,
        })),
      ],
    },
    evidence: {
      ...extracted.evidence,
      paying: [...(extracted.evidence?.paying ?? []), ...(etsyEvidence?.paying ?? [])],
      complaints: [...(extracted.evidence?.complaints ?? []), ...(etsyEvidence?.complaints ?? [])],
    },
    incumbents: [...(extracted.incumbents ?? []), ...(etsyEvidence?.incumbents ?? [])],
  };

  const validated = validateFinding(merged, { now });
  const finding = validated.value;
  if (!finding) return finish('failed', null, [...notes, 'the extraction could not be shaped into a finding at all']);

  // The ledger runs BEFORE the ladder, so strength is computed only from
  // claims that survived provenance. Otherwise an invented complaint could
  // push a finding to level 5 and then be quietly deleted afterwards.
  const enforcement = enforceLedger(finding, ledger);
  ledgerViolations = enforcement.violations.length;
  if (enforcement.violations.length) {
    notes.push(
      `${enforcement.violations.length} claim${enforcement.violations.length === 1 ? '' : 's'} cited a source this run never read and ${enforcement.violations.length === 1 ? 'was' : 'were'} deleted: ${enforcement.violations
        .map((v) => `${v.path} (${v.reason})`)
        .join('; ')}`,
    );
    log(deps, 'ledger', `deleted ${enforcement.violations.length} unsupported claim(s)`, { runId });
  }
  if (enforcement.dropped.length) {
    notes.push(`${enforcement.dropped.length} evidence item${enforcement.dropped.length === 1 ? '' : 's'} dropped for having no usable source at all`);
  }

  applyEvidence(finding);

  // Re-validate after enforcement: dropping claims can leave a finding that no
  // longer satisfies the schema, and that must not be stored.
  const revalidated = validateFinding(finding, { now });
  if (!revalidated.ok) {
    notes.push(
      `after unsupported claims were removed the finding no longer holds together: ${revalidated.errors.map((e) => `${e.path}: ${e.message}`).join('; ')}`,
    );
    return finish('unverified', null, notes);
  }
  const clean = applyEvidence(revalidated.value);
  clean.watchId = task.watchId ?? null;
  clean.dedupKey = dedupKeyFor(clean);
  clean.id = task.priorFinding?.id ?? clean.id;
  if (task.priorFinding) clean.foundAt = task.priorFinding.foundAt;
  clean.lastVerifiedAt = now();

  // ---- buildability -----------------------------------------------------
  let buildability = classifyBuildability(clean);
  if (buildability.needsModel && !deadline.tooLateFor(5_000)) {
    try {
      const res = await deps.llm.generateJson({
        tier: 'judge',
        systemInstruction: systemPrompt(),
        prompt: `Can Jason build something that serves this demand?\n\n${clean.demand.oneLine}\nWho: ${clean.demand.whoHasIt}\nWhat would win: ${clean.whatWouldWin.map((w) => w.requirement).join('; ') || 'not established'}\n\nThe rules could not decide. Say which side of the line this falls on and why, in one or two sentences.`,
        responseSchema: BUILDABILITY_SCHEMA,
        label: task.watchId ? `watch:${task.watchId}` : 'buildability',
        timeoutMs: 20_000,
      });
      if (res.json) buildability = mergeModelOpinion(buildability, res.json);
    } catch (err) {
      notes.push(`could not get a second opinion on buildability (${err.message}); the rule-based verdict stands`);
    }
  }
  clean.buildability = buildability;

  // A finding Jason cannot act on is never recommended, whatever it scores.
  if (buildability.verdict === 'jason-cannot-build') {
    clean.verdict.wouldBuild = false;
    clean.verdict.blockedBy = clean.verdict.blockedBy || buildability.blockers.map((b) => b.label).join('; ');
  }

  clean.depth = {
    level: depth.level,
    reasoning: depth.reasoning,
    costUsd: 0,
    tokensIn: 0,
    tokensOut: 0,
    searches: searchesDone,
    stoppedEarly,
    stoppedReason,
  };

  return finish(stoppedEarly ? 'found' : 'found', clean, notes);

  // -----------------------------------------------------------------------
  async function finish(status, finding, finalNotes) {
    let costUsd = 0;
    try {
      costUsd = Math.max(0, (await deps.store.getMonthlySpend()) - spendBefore);
    } catch {
      // A spend read failure must not turn a good run into a failed one.
    }

    if (finding) {
      finding.depth = {
        ...(finding.depth ?? {}),
        level: depth.level,
        reasoning: depth.reasoning,
        costUsd,
        searches: searchesDone,
        stoppedEarly,
        stoppedReason,
      };
    }

    const run = {
      id: runId,
      at: startedAt,
      finishedAt: now(),
      topic,
      kind: task.kind ?? 'question',
      watchId: task.watchId ?? null,
      status,
      depth: depth.level,
      depthReasoning: depth.reasoning,
      searches: searchesDone,
      sourcesRead: ledger.size(),
      costUsd,
      elapsedMs: deadline.elapsedMs,
      stoppedEarly,
      stoppedReason,
      notes: finalNotes,
      findingId: finding?.id ?? null,
      strength: finding?.evidence?.strength ?? null,
    };

    try {
      await deps.store.addRun(run);
      await deps.store.addActivity({
        kind: 'run',
        level: status === 'failed' ? 'error' : 'info',
        message:
          status === 'found'
            ? `${topic}: level ${finding.evidence.strength} finding${stoppedEarly ? ' (stopped early)' : ''}`
            : `${topic}: ${status}`,
        runId,
        costUsd,
        status,
      });
    } catch {
      // Logging must never be the reason a result is lost.
    }

    return {
      ok: status !== 'failed',
      status,
      runId,
      topic,
      finding,
      notes: finalNotes,
      depth: { level: depth.level, reasoning: depth.reasoning, searches: searchesDone },
      costUsd,
      sources: ledger.ok(),
      sourcesRead: ledger.size(),
      stoppedEarly,
      stoppedReason,
      elapsedMs: deadline.elapsedMs,
      ledgerViolations,
    };
  }
}

export { BudgetExceededError };
