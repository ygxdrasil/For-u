/**
 * Answering questions — mostly Jason's.
 *
 * When he is part-way through building something and needs to know what the
 * buyer actually pays, or whether anyone has said the thing he is about to
 * assume, he asks here. The same rules apply as to a finding: every claim
 * carries a source that was really read this session, and "I could not
 * establish that" is a complete and acceptable answer.
 *
 * Two modes, because most of his questions are about work Selena has already
 * done and re-searching for those would be paying twice:
 *
 *   stored    — answered from findings already on record. Free.
 *   research  — goes and reads. Costs money, so it is chosen deliberately.
 *
 * `auto` picks between them by looking for the question's subject in what is
 * already stored, and says which route it took.
 */

import { createLedger } from './ledger.js';
import { createDeadline, nowIso, normalizePhrase, clampNumber, canonicalUrl } from './util.js';
import { systemPrompt, ANSWER_SCHEMA } from './prompts.js';
import { runResearch } from './research.js';

export const ASK_MODES = ['auto', 'stored', 'research'];

/** How much of the question a stored finding must cover to count as relevant. */
export const RELEVANCE_THRESHOLD = 0.25;

/**
 * How much of the question this finding actually covers.
 *
 * Containment, not Jaccard. A short question against a long finding scores
 * badly on Jaccard purely because the finding has more words in it — so a
 * finding that genuinely answered the question was judged irrelevant and
 * Selena went off and paid to research something she already knew.
 */
export function relevanceOf(finding, question) {
  const against = [
    finding?.demand?.oneLine,
    finding?.demand?.whoHasIt,
    ...(finding?.whatWouldWin ?? []).map((w) => w.requirement),
    ...(finding?.evidence?.paying ?? []).map((p) => p.what),
    ...(finding?.evidence?.complaints ?? []).map((c) => c.aboutWhat),
  ]
    .filter(Boolean)
    .join(' ');

  const questionWords = new Set(normalizePhrase(question).split(' ').filter(Boolean));
  if (!questionWords.size) return 0;
  const findingWords = new Set(normalizePhrase(against).split(' ').filter(Boolean));

  let shared = 0;
  for (const w of questionWords) if (findingWords.has(w)) shared += 1;
  return shared / questionWords.size;
}

export function rankFindings(findings, question, limit = 6) {
  return (findings ?? [])
    .map((f) => ({ finding: f, relevance: relevanceOf(f, question) }))
    .filter((r) => r.relevance >= RELEVANCE_THRESHOLD)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, clampNumber(limit, 1, 20, 6));
}

/** Everything a stored finding can tell an answering model, with its sources. */
function briefFor(finding) {
  const lines = [
    `DEMAND: ${finding.demand.oneLine}`,
    `WHO: ${finding.demand.whoHasIt}`,
    `EVIDENCE STRENGTH: ${finding.evidence.strength}/5${finding.evidence.hypothesis ? ' (hypothesis — nothing is being paid for yet)' : ''}`,
    `LAST VERIFIED: ${finding.lastVerifiedAt}`,
  ];
  if (finding.evidence.paying.length) {
    lines.push(
      `PRICES BEING PAID:\n${finding.evidence.paying.map((p) => `  - ${p.what}: ${p.price} ${p.currency} — ${p.url}${p.salesSignal ? ` (${p.salesSignal}; ${p.signalMethod})` : ''}`).join('\n')}`,
    );
  }
  if (finding.evidence.complaints.length) {
    lines.push(
      `COMPLAINTS:\n${finding.evidence.complaints.map((c) => `  - about "${c.aboutWhat}": "${c.quote}" — ${c.url}`).join('\n')}`,
    );
  }
  if (finding.evidence.agreement?.subject) {
    lines.push(`COMPLAINTS AGREE ON: ${finding.evidence.agreement.subject} (${finding.evidence.agreement.count} of them)`);
  }
  if (finding.incumbents.length) {
    lines.push(`INCUMBENTS:\n${finding.incumbents.map((i) => `  - ${i.name}${i.price ? ` at ${i.price}` : ''}: ${i.whatTheyGetWrong} — ${i.url ?? 'no link'}`).join('\n')}`);
  }
  if (finding.whatWouldWin.length) lines.push(`WHAT WOULD WIN:\n${finding.whatWouldWin.map((w) => `  - ${w.requirement}`).join('\n')}`);
  if (finding.risks.length) lines.push(`RISKS:\n${finding.risks.map((r) => `  - [${r.severity}] ${r.risk}`).join('\n')}`);
  if (finding.evidence.volume) {
    lines.push(
      `HOW MANY: ${finding.evidence.volume.estimate ?? 'not established'} (${finding.evidence.volume.confidence} confidence — ${finding.evidence.volume.method})`,
    );
  }
  return lines.join('\n');
}

/**
 * @param {object} q
 * @param {string} q.question
 * @param {'auto'|'stored'|'research'} [q.mode]
 * @param {string} [q.askedBy]  'jason' | 'operator'
 */
export async function answerQuestion({ question, mode = 'auto', askedBy = 'jason', requestedDepth = null }, deps) {
  const now = deps.now ?? nowIso;
  const text = String(question ?? '').trim();
  if (!text) {
    // Every branch returns the same shape, so a caller never reads undefined
    // off a field that happens to exist only on the path it did not take.
    return { ok: false, route: 'none', answer: 'No question was asked.', confidence: 'low', basedOn: [], rejectedCitations: [], unknowns: [], costUsd: 0 };
  }

  const stored = await deps.store.listFindings({ status: 'active', limit: 200 });
  const relevant = rankFindings(stored, text);

  const route = mode === 'auto' ? (relevant.length ? 'stored' : 'research') : mode;

  await deps.store.addActivity({
    kind: 'question',
    level: 'info',
    message: `${askedBy} asked: ${text.slice(0, 120)}`,
    route,
  });

  if (route === 'research') {
    // A question deserves an answer that stands up without a second round, so
    // the pipeline is asked for a proper dig unless told otherwise.
    const result = await runResearch({ topic: text, kind: 'question', requestedDepth }, deps);
    const f = result.finding;
    return {
      ok: result.ok,
      route: 'research',
      question: text,
      answer: f
        ? `${f.demand.oneLine} — ${f.verdict.reasoning}`
        : `I could not establish that. ${result.notes.join(' ')}`,
      confidence: f ? (f.evidence.strength >= 4 ? 'high' : f.evidence.strength >= 3 ? 'medium' : 'low') : 'low',
      basedOn: (result.sources ?? []).map((s) => s.url),
      rejectedCitations: [],
      unknowns: f ? [] : result.notes,
      finding: f,
      status: result.status,
      costUsd: result.costUsd,
      answeredAt: now(),
    };
  }

  if (!relevant.length) {
    return {
      ok: true,
      route: 'stored',
      question: text,
      answer: 'Nothing on record touches that. Ask again with mode "research" and I will go and read — that costs money, so I am not doing it on a guess.',
      confidence: 'low',
      basedOn: [],
      rejectedCitations: [],
      unknowns: ['no stored finding is relevant to this question'],
      costUsd: 0,
      answeredAt: now(),
    };
  }

  // Answering from the record still goes through the ledger: the model may
  // only cite URLs that appear on the findings it was actually shown.
  const ledger = createLedger({ now });
  for (const { finding } of relevant) {
    for (const s of finding.sources ?? []) {
      ledger.record({ url: s.url, status: s.status ?? 200, via: s.via ?? 'grounded-search', title: s.title, domain: s.domain });
    }
    for (const p of finding.evidence.paying ?? []) ledger.record({ url: p.url, status: 200, via: p.via ?? 'grounded-search' });
    for (const c of finding.evidence.complaints ?? []) ledger.record({ url: c.url, status: 200, via: c.via ?? 'grounded-search' });
  }

  if (!deps.llm) {
    // No key: hand back the record itself rather than nothing. It is less
    // convenient than prose and completely honest.
    return {
      ok: true,
      route: 'stored',
      question: text,
      answer: relevant.map(({ finding }) => briefFor(finding)).join('\n\n---\n\n'),
      confidence: 'medium',
      basedOn: ledger.ok().map((e) => e.url),
      rejectedCitations: [],
      unknowns: ['no model is configured, so this is the raw record rather than an answer'],
      findings: relevant.map((r) => r.finding.id),
      costUsd: 0,
      answeredAt: now(),
    };
  }

  const deadline = deps.deadline ?? createDeadline(deps.budgetMs ?? 25_000);
  const res = await deps.llm.generateJson({
    tier: 'chat',
    systemInstruction: systemPrompt(
      'You are answering a question from Jason about work you have already done. Answer from the record below and nothing else. If the record does not answer it, say so — do not fill the gap.',
    ),
    prompt: `QUESTION: ${text}

WHAT IS ON RECORD
${relevant.map(({ finding, relevance }) => `--- (relevance ${relevance.toFixed(2)})\n${briefFor(finding)}`).join('\n\n')}

CITABLE URLS — cite these and nothing else:
${ledger
  .citable()
  .map((c, i) => `[${i + 1}] ${c.url}`)
  .join('\n')}`,
    responseSchema: ANSWER_SCHEMA,
    label: 'ask',
    timeoutMs: Math.max(8_000, deadline.remainingMs - 2_000),
  });

  if (res.parseError || !res.json) {
    return {
      ok: false,
      route: 'stored',
      question: text,
      answer: `I could not put an answer together. ${res.parseError ?? 'the model returned nothing'}`,
      confidence: 'low',
      basedOn: [],
      rejectedCitations: [],
      unknowns: ['the answering model failed'],
      costUsd: res.usage?.usd ?? 0,
      answeredAt: now(),
    };
  }

  // Same enforcement as a finding: a citation we never read is deleted.
  const claimed = Array.isArray(res.json.basedOn) ? res.json.basedOn : [];
  const kept = claimed.filter((u) => ledger.has(u)).map((u) => canonicalUrl(u));
  const rejected = claimed.filter((u) => !ledger.has(u));

  return {
    ok: true,
    route: 'stored',
    question: text,
    answer: String(res.json.answer ?? ''),
    confidence: ['low', 'medium', 'high'].includes(res.json.confidence) ? res.json.confidence : 'low',
    basedOn: kept,
    rejectedCitations: rejected,
    unknowns: Array.isArray(res.json.unknowns) ? res.json.unknowns : [],
    findings: relevant.map((r) => r.finding.id),
    costUsd: res.usage?.usd ?? 0,
    answeredAt: now(),
  };
}
