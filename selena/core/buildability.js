/**
 * Can Jason build it?
 *
 * Jason turns findings into working n8n systems and digital products. That is
 * a real boundary, not a vague one: he can wire APIs together, run things on a
 * schedule, transform data, generate documents and ship a template. He cannot
 * make a physical object, cannot hold a professional licence, cannot be a
 * person doing the work, and cannot use a platform that forbids being used
 * this way.
 *
 * Selena's job is to say which side of that line a finding falls on, BEFORE it
 * reaches him — a beautiful opening he cannot act on is a waste of both our
 * time, and worse, it teaches him to distrust the queue.
 *
 * The classification is rule-first and free. The model is only consulted when
 * the rules are genuinely undecided, and its answer is recorded as a separate,
 * lower-confidence opinion rather than overwriting the rules.
 *
 * One table, derived everywhere. A second hand-typed copy of "what Jason can
 * do" would go stale and start advertising a capability that does not exist.
 */

export const BUILD_SHAPES = {
  workflow: 'an n8n workflow — triggers, API calls, transforms, schedules',
  document: 'a generated document, template or spreadsheet product',
  service: 'a small hosted service: form in, workflow behind, result out',
  data: 'a monitoring or reporting product built on data Jason can legally reach',
};

/**
 * Each rule matches on the plain text of a finding. `kind` decides the verdict
 * it argues for; `weight` is how strongly.
 */
export const CAPABILITY_RULES = [
  // ---- things Jason can build -------------------------------------------
  {
    id: 'automation',
    kind: 'can',
    weight: 3,
    shape: 'workflow',
    label: 'repetitive work that can be automated',
    patterns: [/\bautomat/i, /\bmanual(ly)?\b/i, /\bby hand\b/i, /\bcopy.?past/i, /\bre-?key(ing)?\b/i, /\bspreadsheet/i, /\bevery (day|week|month|morning)\b/i],
    why: 'this is repeated manual work, which is exactly what a workflow replaces',
  },
  {
    id: 'integration',
    kind: 'can',
    weight: 3,
    shape: 'workflow',
    label: 'two tools that do not talk to each other',
    patterns: [/\bintegrat/i, /\bsync(ing|hronis|hroniz)?\b/i, /\bconnect\b.*\bto\b/i, /\bapi\b/i, /\bwebhook/i, /\bzapier\b/i, /\bmake\.com\b/i, /\bexport (to|into)\b/i],
    why: 'a connector between systems is the most ordinary thing n8n does',
  },
  {
    id: 'notify',
    kind: 'can',
    weight: 2,
    shape: 'workflow',
    label: 'chasing, reminding or alerting',
    patterns: [/\bremind/i, /\bchas(e|ing)\b/i, /\bfollow.?up/i, /\balert/i, /\bnotif/i, /\bovedue|\boverdue\b/i, /\bunpaid\b/i],
    why: 'scheduled checks that send a message are a workflow with a timer',
  },
  {
    id: 'report',
    kind: 'can',
    weight: 2,
    shape: 'data',
    label: 'a recurring report someone assembles by hand',
    patterns: [/\breport(ing|s)?\b/i, /\bdashboard/i, /\bsummar(y|ise|ize)/i, /\bmonthly (figures|numbers|accounts)\b/i, /\btrack(ing)? (my|our|their)\b/i],
    why: 'pulling numbers on a schedule and formatting them is a workflow plus a template',
  },
  {
    id: 'template',
    kind: 'can',
    weight: 2,
    shape: 'document',
    label: 'a document, template or pack people keep rebuilding',
    patterns: [/\btemplate/i, /\bchecklist/i, /\bboilerplate/i, /\bcontract (template|pack)/i, /\bproposal/i, /\bquote (form|template)/i, /\binvoice (template|format)/i],
    why: 'a digital product Jason can generate and ship without a platform dependency',
  },
  {
    id: 'intake',
    kind: 'can',
    weight: 2,
    shape: 'service',
    label: 'taking details from a customer and doing something with them',
    patterns: [/\bintake\b/i, /\bonboard/i, /\bform\b/i, /\bbooking\b/i, /\benquir(y|ies)\b/i, /\blead(s)? (capture|routing)\b/i],
    why: 'form in, workflow behind, result out — a small hosted service',
  },
  {
    id: 'content-pipeline',
    kind: 'can',
    weight: 1,
    shape: 'workflow',
    label: 'producing or reformatting content repeatedly',
    patterns: [/\bcaption/i, /\bre-?purpose/i, /\bschedul(e|ing) posts?\b/i, /\bnewsletter/i, /\bdescriptions?\b.*\b(write|writing|generate)/i],
    why: 'a generation-and-publish pipeline, provided the destination platform allows posting via API',
  },

  // ---- things Jason cannot build ----------------------------------------
  {
    id: 'physical',
    kind: 'cannot',
    weight: 4,
    label: 'a physical object has to exist',
    patterns: [/\bship(ping|ped)?\b/i, /\bprint(ed|ing)?\b/i, /\bfabric/i, /\bhandmade\b/i, /\bpackag(e|ing)\b/i, /\bstock\b/i, /\bwarehous/i, /\bembroider/i, /\bwood(en)?\b/i, /\bmug(s)?\b/i, /\bt-?shirt/i],
    why: 'Jason writes software. Something has to be made and posted, and that is not him',
  },
  {
    id: 'licensed',
    kind: 'cannot',
    weight: 4,
    label: 'regulated or licensed advice',
    patterns: [/\blegal advice\b/i, /\bsolicitor\b/i, /\blawyer\b/i, /\bmedical\b/i, /\bdiagnos/i, /\bprescri/i, /\btax return\b.*\bfil(e|ing)\b/i, /\baudit(ed|or)\b/i, /\bfinancial advice\b/i, /\bregulated\b/i, /\blicen[cs]ed professional\b/i],
    why: 'the value is a qualified human signing their name to it, which software cannot do',
  },
  {
    id: 'human-labour',
    kind: 'cannot',
    weight: 3,
    label: 'the buyer is paying for a person',
    patterns: [/\b1.?(on|2).?1\b/i, /\bcoach(ing)?\b/i, /\bconsultan/i, /\bbespoke design\b/i, /\bhand.?drawn\b/i, /\bcustom illustration/i, /\bvirtual assistant\b/i, /\bdone.?for.?you\b.*\bservice\b/i],
    why: 'they are buying somebody’s time and judgement, not a system',
  },
  {
    id: 'forbidden-source',
    kind: 'cannot',
    weight: 4,
    label: 'it would need data a platform forbids taking',
    patterns: [/\bscrap(e|ing)\b/i, /\bcrawl(er|ing)\b/i, /\bbypass\b/i, /\bunofficial api\b/i, /\blogged.?in\b/i, /\bbehind (a )?login\b/i],
    why: 'building this means breaking a platform’s terms, which is not a business, it is a countdown',
  },
  {
    id: 'native-app',
    kind: 'cannot',
    weight: 3,
    label: 'a native mobile app or hardware',
    patterns: [/\bapp store\b/i, /\bios app\b/i, /\bandroid app\b/i, /\bnative app\b/i, /\bhardware\b/i, /\bdevice\b.*\bfirmware\b/i, /\bbluetooth\b/i],
    why: 'outside what an n8n-and-web builder ships, and the store review cycle alone kills the economics',
  },
  {
    id: 'payments-licence',
    kind: 'cannot',
    weight: 3,
    label: 'holding other people’s money',
    patterns: [/\bescrow\b/i, /\bhold(ing)? funds\b/i, /\bmarketplace payouts\b/i, /\bkyc\b/i, /\bmoney transmit/i, /\bbank(ing)? licen[cs]e\b/i],
    why: 'money transmission is a licensing problem long before it is an engineering one',
  },
];

/** Derived so the HUD and the prompts never re-type the list. */
export const CAN_RULES = CAPABILITY_RULES.filter((r) => r.kind === 'can');
export const CANNOT_RULES = CAPABILITY_RULES.filter((r) => r.kind === 'cannot');

export const BUILD_VERDICTS = ['jason-can-build', 'partly', 'jason-cannot-build', 'unclear'];

/**
 * Coerce to a string without ever throwing.
 *
 * Anything reaching here has passed through a model or a database, and a value
 * whose own toString throws would take the classifier down with it. Classifying
 * is not worth crashing a run over.
 */
function safe(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  try {
    return String(value);
  } catch {
    return '';
  }
}

/** All the prose in a finding that a rule should look at. */
function textOf(finding) {
  const parts = [
    finding?.demand?.oneLine,
    finding?.demand?.whoHasIt,
    ...(Array.isArray(finding?.demand?.inTheirWords) ? finding.demand.inTheirWords : []).map((q) => safe(q?.quote)),
    ...(Array.isArray(finding?.evidence?.paying) ? finding.evidence.paying : []).map((p) => safe(p?.what)),
    ...(Array.isArray(finding?.evidence?.complaints) ? finding.evidence.complaints : []).map((c) => `${safe(c?.aboutWhat)} ${safe(c?.quote)}`),
    ...(Array.isArray(finding?.incumbents) ? finding.incumbents : []).map((i) => `${safe(i?.name)} ${safe(i?.whatTheyGetWrong)}`),
    ...(Array.isArray(finding?.whatWouldWin) ? finding.whatWouldWin : []).map((w) => safe(w?.requirement)),
    ...(Array.isArray(finding?.risks) ? finding.risks : []).map((r) => safe(r?.risk)),
  ];
  return parts.map(safe).filter(Boolean).join('\n');
}

/**
 * @returns {{verdict:string, confidence:'low'|'medium'|'high', shape:string|null,
 *            can:Array, cannot:Array, blockers:Array, reasoning:string, needsModel:boolean}}
 */
export function classifyBuildability(finding) {
  const text = textOf(finding);

  const hits = (rules) =>
    rules
      .map((rule) => {
        const matched = rule.patterns.filter((p) => p.test(text));
        return matched.length ? { id: rule.id, label: rule.label, why: rule.why, weight: rule.weight, shape: rule.shape ?? null, matches: matched.length } : null;
      })
      .filter(Boolean);

  const can = hits(CAN_RULES);
  const cannot = hits(CANNOT_RULES);

  const canScore = can.reduce((t, h) => t + h.weight, 0);
  const cannotScore = cannot.reduce((t, h) => t + h.weight, 0);

  // The most common shape among the matching "can" rules, strongest first.
  const shape =
    can
      .slice()
      .sort((a, b) => b.weight - a.weight || b.matches - a.matches)
      .find((h) => h.shape)?.shape ?? null;

  let verdict;
  let confidence;
  let reasoning;

  if (!can.length && !cannot.length) {
    verdict = 'unclear';
    confidence = 'low';
    reasoning = 'Nothing in the finding matched a known capability or blocker either way. This one needs reading properly before it goes to Jason.';
  } else if (cannotScore >= 4 && cannotScore > canScore) {
    verdict = 'jason-cannot-build';
    confidence = cannotScore >= 6 ? 'high' : 'medium';
    reasoning = `Blocked by ${cannot.map((c) => c.label).join('; ')}. ${cannot[0].why}.`;
  } else if (cannot.length && can.length) {
    verdict = 'partly';
    confidence = 'medium';
    reasoning = `Jason can build ${can.map((c) => c.label).join('; ')}, but ${cannot.map((c) => c.label).join('; ')} sits outside what he ships. The buildable slice is worth taking on its own; the rest is not his.`;
  } else if (canScore >= 3) {
    verdict = 'jason-can-build';
    confidence = canScore >= 5 ? 'high' : 'medium';
    reasoning = `${can.map((c) => c.label).join('; ')}. ${can[0].why}.`;
  } else if (can.length) {
    verdict = 'jason-can-build';
    confidence = 'low';
    reasoning = `Weak signal only: ${can.map((c) => c.label).join('; ')}. Probably buildable, but the finding does not say enough to be sure.`;
  } else {
    verdict = 'unclear';
    confidence = 'low';
    reasoning = 'Signals conflict without a clear blocker.';
  }

  return {
    verdict,
    confidence,
    shape,
    shapeLabel: shape ? BUILD_SHAPES[shape] : null,
    can,
    cannot,
    blockers: cannot.map((c) => ({ id: c.id, label: c.label, why: c.why })),
    reasoning,
    // The model is worth asking only when the rules genuinely cannot decide.
    // Asking it every time would cost money to be told what we already knew.
    needsModel: verdict === 'unclear' || confidence === 'low',
    rulesVersion: CAPABILITY_RULES.length,
    decidedBy: 'rules',
  };
}

/**
 * Merge a model's second opinion in, without letting it overrule a hard
 * blocker. If the rules found a licensing or physical-goods problem, no amount
 * of model enthusiasm changes that.
 */
export function mergeModelOpinion(ruleResult, modelOpinion) {
  if (!modelOpinion || !BUILD_VERDICTS.includes(modelOpinion.verdict)) return ruleResult;

  const hardBlock = ruleResult.cannot.some((c) => c.weight >= 4);
  if (hardBlock) {
    return {
      ...ruleResult,
      modelOpinion: { ...modelOpinion, overridden: true, overriddenBecause: 'a hard blocker from the rules cannot be argued away' },
    };
  }

  if (ruleResult.verdict !== 'unclear' && ruleResult.confidence !== 'low') {
    return { ...ruleResult, modelOpinion: { ...modelOpinion, overridden: false } };
  }

  return {
    ...ruleResult,
    verdict: modelOpinion.verdict,
    confidence: modelOpinion.confidence === 'high' ? 'medium' : 'low',
    shape: modelOpinion.shape ?? ruleResult.shape,
    shapeLabel: modelOpinion.shape ? BUILD_SHAPES[modelOpinion.shape] ?? null : ruleResult.shapeLabel,
    reasoning: `${ruleResult.reasoning} Model read: ${modelOpinion.reasoning ?? 'no reasoning given'}`,
    decidedBy: 'rules+model',
    modelOpinion: { ...modelOpinion, overridden: false },
  };
}
