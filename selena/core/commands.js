/**
 * The command bar. Selena takes orders, not questions.
 *
 * Rules first, model second. The half-dozen things you actually type — "watch
 * bookkeeping for UK trades daily", "dig into invoice chasing", "run" — are
 * matched by pattern: free, instant, and identical every time. Only a phrasing
 * no rule recognises is worth paying a model to interpret, and even then the
 * model may only choose among these same verbs and fill in their fields. It
 * cannot invent an action.
 *
 * Two rules that matter more than the parsing:
 *
 * 1. A misreading never acts. Every parse produces a plain-English sentence of
 *    what was understood, and anything that would spend money waits for a
 *    second confirmation. A typo costs you a keystroke, not a dig.
 *
 * 2. Nothing here executes anything. This module turns text into an intention.
 *    api/command.js decides whether to carry it out, using the same pipeline
 *    every other caller uses.
 */

import { LEVELS, LEVEL_NAMES } from './depth.js';
import { CADENCES } from './watches.js';
import { clampNumber } from './util.js';

/** Every verb she has. Derived into the help text and the model's option list. */
export const VERBS = {
  watch: {
    summary: 'stand a new watch on a topic',
    examples: ['watch bookkeeping for UK tradespeople daily', 'keep an eye on wedding stationery weekly'],
    spends: false,
  },
  research: {
    summary: 'go and research something now',
    examples: ['research invoice chasing for trades', 'dig into seating chart tools, deep'],
    spends: true,
    consequential: true,
  },
  run: {
    summary: 'run watches that are due, or one by name',
    examples: ['run', 'run due watches', 'run the invoice watch'],
    spends: true,
    consequential: true,
  },
  pause: { summary: 'pause a watch', examples: ['pause the invoice watch'], spends: false },
  resume: { summary: 'resume a paused watch', examples: ['resume invoice chasing'], spends: false },
  stop: { summary: 'stop watches running for now', examples: ['stop', 'stop everything'], spends: false, consequential: true },
  show: {
    summary: 'filter what you are looking at',
    examples: ['show level 5', 'show what Jason can build', 'show hypotheses', 'show costs'],
    spends: false,
  },
  open: { summary: 'open a finding by name', examples: ['open the invoice one'], spends: false },
  send: { summary: 'hand a finding to Jason', examples: ['send the invoice finding to Jason'], spends: false, consequential: true },
  archive: { summary: 'archive a finding', examples: ['archive the seating chart one'], spends: false, consequential: true },
  explore: {
    summary: 'go looking on her own and propose things to watch',
    examples: ['explore', 'go looking', 'find me something'],
    spends: true,
    consequential: true,
  },
  arm: {
    summary: 'set her working on her own, or stand her down',
    examples: ['arm', 'work on your own', 'stand down', 'stop working on your own'],
    spends: false,
    // Consequential rather than spending: arming does not itself cost anything,
    // but it is the switch that lets everything else cost something without
    // you there. It gets the second press.
    consequential: true,
  },
  help: { summary: 'list what she understands', examples: ['help', '?'], spends: false },
};

export const VERB_NAMES = Object.keys(VERBS);

const clean = (s) => String(s ?? '').trim().replace(/\s+/g, ' ');
const strip = (s) => clean(s).replace(/^[,\-–—:\s]+|[,.!\s]+$/g, '');

/** "daily", "every day", "each week" -> a cadence the watch model knows. */
function findCadence(text) {
  const t = text.toLowerCase();
  if (/\b(hourly|every hour|each hour)\b/.test(t)) return { cadence: 'hourly', matched: /\b(hourly|every hour|each hour)\b/ };
  if (/\b(daily|every day|each day|each morning|every morning)\b/.test(t)) return { cadence: 'daily', matched: /\b(daily|every day|each day|each morning|every morning)\b/ };
  if (/\b(weekly|every week|each week)\b/.test(t)) return { cadence: 'weekly', matched: /\b(weekly|every week|each week)\b/ };
  if (/\b(manually|manual|only when i ask|when i ask)\b/.test(t)) return { cadence: 'manual', matched: /\b(manually|manual|only when i ask|when i ask)\b/ };
  return null;
}

/** "deep", "quick look", "properly" -> a depth level. */
function findDepth(text) {
  const t = text.toLowerCase();
  if (/\b(deep|deeply|properly|thoroughly|in depth|everything)\b/.test(t)) return { depth: 'deep', matched: /\b(deep|deeply|properly|thoroughly|in depth|everything)\b/ };
  if (/\b(dig|dig into|serious|detailed)\b/.test(t)) return { depth: 'dig', matched: /\b(dig into|dig|serious|detailed)\b/ };
  if (/\b(glance|quick|quickly|briefly|just check|skim)\b/.test(t)) return { depth: 'glance', matched: /\b(glance|quickly|quick|briefly|just check|skim)\b/ };
  if (/\b(check|confirm)\b/.test(t)) return { depth: 'check', matched: /\b(check|confirm)\b/ };
  return null;
}

/** Remove the cadence and depth words from a topic so they do not become part of it. */
function tidyTopic(raw, ...matchers) {
  let topic = clean(raw);
  for (const m of matchers) {
    if (m?.matched) topic = topic.replace(new RegExp(m.matched.source, 'gi'), ' ');
  }
  return strip(topic.replace(/\b(on|about|into|for me|please|now)\b\s*$/i, ''));
}

/**
 * The rule table. Order matters: the first match wins, so the more specific
 * patterns come first.
 */
const RULES = [
  // ---- help -------------------------------------------------------------
  {
    verb: 'help',
    test: /^\s*(\?|help|what can you do|commands)\s*\??\s*$/i,
    build: () => ({ verb: 'help', args: {} }),
  },

  // ---- send to Jason (before "show", which also starts with s) -----------
  {
    verb: 'send',
    test: /^(?:send|hand|give|pass)\s+(.+?)\s+(?:over\s+)?to\s+jason\b/i,
    build: (m) => ({ verb: 'send', args: { target: strip(m[1].replace(/^(the|that)\s+/i, '')) } }),
  },
  {
    // Jason must be named. An earlier version matched "build|make ANYTHING",
    // which turned "make me a cup of tea" into "hand the finding matching
    // 'me a cup of tea' to Jason" — a confident misreading of a sentence that
    // was not a command at all.
    verb: 'send',
    test: /^(?:get|have|ask)\s+jason\s+to\s+(?:build|make)\s+(.+)$/i,
    build: (m) => ({ verb: 'send', args: { target: strip(m[1].replace(/^(the|that)\s+/i, '')) } }),
  },

  // ---- archive ----------------------------------------------------------
  {
    verb: 'archive',
    test: /^(?:archive|shelve|put away|hide)\s+(.+)$/i,
    build: (m) => ({ verb: 'archive', args: { target: strip(m[1].replace(/^(the|that)\s+/i, '')) } }),
  },

  // ---- arm / stand down -------------------------------------------------
  // Before the stop rule. "stop working on your own" must disarm her, not
  // pause every watch — those are different amounts of damage to undo, and the
  // sentence plainly names the one she should do.
  {
    verb: 'arm',
    test: /^(?:stand\s*down|disarm|stop\s+(?:working|looking|searching)\s+on\s+your\s+own|stop\s+(?:working|running)\s+by\s+yourself)\s*$/i,
    build: () => ({ verb: 'arm', args: { on: false } }),
  },
  {
    verb: 'arm',
    test: /^(?:arm|arm\s+yourself|go\s+(?:to\s+)?work|work\s+on\s+your\s+own|search\s+on\s+your\s+own|look\s+on\s+your\s+own|run\s+by\s+yourself|off\s+you\s+go)\s*$/i,
    build: () => ({ verb: 'arm', args: { on: true } }),
  },

  // ---- stop everything (before per-watch pause, or it swallows it) ------
  {
    verb: 'stop',
    // "pause" on its own is excluded deliberately: it is far likelier to be an
    // unfinished "pause the X watch" than a decision to halt everything, and
    // acting on the difference would stop work you wanted running.
    test: /^(?:stop\s*(?:everything|all|all watches|the watches)?|pause\s+(?:everything|all|all watches|the watches))\s*$/i,
    build: () => ({ verb: 'stop', args: {} }),
  },

  // ---- pause / resume ---------------------------------------------------
  {
    verb: 'pause',
    test: /^(?:pause|halt|suspend)\s+(?:the\s+)?(.+?)(?:\s+watch)?$/i,
    build: (m) => ({ verb: 'pause', args: { target: strip(m[1]) } }),
  },
  {
    verb: 'resume',
    test: /^(?:resume|restart|unpause|continue)\s+(?:the\s+)?(.+?)(?:\s+watch)?$/i,
    build: (m) => ({ verb: 'resume', args: { target: strip(m[1]) } }),
  },

  // ---- explore (before run, or "go" is swallowed by the sweep) ----------
  {
    verb: 'explore',
    test: /^(?:explore|go looking|look around|find me something|surprise me|what am i missing)\s*$/i,
    build: () => ({ verb: 'explore', args: {} }),
  },

  // ---- run --------------------------------------------------------------
  {
    verb: 'run',
    test: /^(?:run|sweep|go)(?:\s+(?:the\s+)?(?:due\s+)?watches?)?\s*$/i,
    build: () => ({ verb: 'run', args: { which: 'due' } }),
  },
  {
    verb: 'run',
    test: /^(?:run|sweep)\s+(?:the\s+)?(.+?)(?:\s+watch)?$/i,
    build: (m) => {
      const target = strip(m[1]);
      if (/^(due|all|everything|due watches)$/i.test(target)) return { verb: 'run', args: { which: 'due' } };
      return { verb: 'run', args: { which: 'named', target } };
    },
  },

  // ---- show / find ------------------------------------------------------
  {
    verb: 'show',
    test: /^(?:show|list|filter|find|display)\s+(?:me\s+)?(.+)$/i,
    build: (m) => ({ verb: 'show', args: interpretFilter(m[1]) }),
  },
  {
    verb: 'open',
    test: /^(?:open|go to|jump to)\s+(?:the\s+)?(.+?)(?:\s+one)?$/i,
    build: (m) => ({ verb: 'open', args: { target: strip(m[1]) } }),
  },

  // ---- watch ------------------------------------------------------------
  {
    verb: 'watch',
    test: /^(?:watch|keep an eye on|monitor|track|follow)\s+(.+)$/i,
    build: (m) => {
      const cadence = findCadence(m[1]);
      const depth = findDepth(m[1]);
      return {
        verb: 'watch',
        args: {
          topic: tidyTopic(m[1], cadence, depth),
          cadence: cadence?.cadence ?? 'daily',
          cadenceWasStated: Boolean(cadence),
          depth: depth?.depth ?? null,
        },
      };
    },
  },

  // ---- research ---------------------------------------------------------
  {
    verb: 'research',
    test: /^(?:research|dig into|dig|look into|investigate|study|explore|check)\s+(.+)$/i,
    build: (m, raw) => {
      const depth = findDepth(raw);
      return {
        verb: 'research',
        args: {
          topic: tidyTopic(m[1], depth),
          depth: depth?.depth ?? 'dig',
          depthWasStated: Boolean(depth),
        },
      };
    },
  },
];

/** "level 5", "what Jason can build", "hypotheses", "costs" -> a filter. */
export function interpretFilter(text) {
  const t = clean(text).toLowerCase();

  const level = t.match(/\blevel\s*([1-5])\b/) ?? t.match(/\b([1-5])\s*\+?\s*(?:and (?:above|up)|or (?:above|better))\b/);
  if (level) return { page: 'findings', minStrength: Number(level[1]) };

  if (/\b(jason can build|buildable|what jason can build|for jason)\b/.test(t)) return { page: 'findings', buildable: 'jason-can-build' };
  if (/\b(not for jason|cannot build|unbuildable)\b/.test(t)) return { page: 'findings', buildable: 'jason-cannot-build' };
  if (/\b(hypothes[ie]s|maybes|unproven)\b/.test(t)) return { page: 'findings', maxStrength: 2 };
  if (/\b(real openings?|openings?|strongest|best)\b/.test(t)) return { page: 'findings', minStrength: 4 };
  if (/\b(archived?)\b/.test(t)) return { page: 'findings', status: 'archived' };
  if (/\b(stale|old|needs? re-?check)\b/.test(t)) return { page: 'findings', stale: true };
  if (/\b(costs?|spend(ing)?|money|bill)\b/.test(t)) return { page: 'costs' };
  if (/\b(watch(es)?)\b/.test(t)) return { page: 'watches' };
  if (/\b(sources?|where|platforms?)\b/.test(t)) return { page: 'sources' };
  if (/\b(activity|log|what happened)\b/.test(t)) return { page: 'dashboard' };
  if (/\b(everything|all|findings?)\b/.test(t)) return { page: 'findings' };

  // Anything else is a text search over findings.
  return { page: 'findings', search: strip(text) };
}

/** What a command will cost before it runs. Never guessed: taken from the depth table. */
export function estimateFor(parsed) {
  if (!parsed?.verb) return 0;
  if (parsed.verb === 'research') return LEVELS[parsed.args.depth]?.estUsd ?? LEVELS.dig.estUsd;
  // A sweep runs at most a couple of watches, each deciding its own depth.
  if (parsed.verb === 'run') return LEVELS.check.estUsd * 2;
  // Exploring reads for free and pays for exactly one judgement call.
  if (parsed.verb === 'explore') return LEVELS.glance.estUsd;
  return 0;
}

/** The sentence shown back to you: "I read that as …". */
export function describe(parsed) {
  if (!parsed?.verb) return 'nothing I recognise';
  const a = parsed.args ?? {};
  switch (parsed.verb) {
    case 'watch':
      return `stand a watch on "${a.topic}", running ${CADENCES[a.cadence]?.label ?? a.cadence}${
        a.depth ? ` at ${a.depth} depth` : ' (she picks the depth each time)'
      }`;
    case 'research':
      return `research "${a.topic}" now, at ${a.depth} depth${a.depthWasStated ? '' : ' (my default for a direct order)'}`;
    case 'run':
      return a.which === 'due' ? 'run every watch that is due' : `run the "${a.target}" watch now`;
    case 'pause':
      return `pause the "${a.target}" watch`;
    case 'resume':
      return `resume the "${a.target}" watch`;
    case 'stop':
      return 'pause every active watch';
    case 'show':
      return `show ${describeFilter(a)}`;
    case 'open':
      return `open the finding matching "${a.target}"`;
    case 'send':
      return `hand the finding matching "${a.target}" to Jason`;
    case 'archive':
      return `archive the finding matching "${a.target}"`;
    case 'explore':
      return 'go looking on your own and propose things worth watching — reading is free, one cheap model call to find the pattern';
    case 'arm':
      return a.on
        ? 'work on your own from now on: roam, stand your own watches, research them, and hand level-5 findings to Jason without asking'
        : 'stand down — no roaming, no watches on a schedule, nothing sent to Jason unless I say so';
    case 'help':
      return 'list what you can tell me';
    default:
      return parsed.verb;
  }
}

function describeFilter(a) {
  if (a.page && a.page !== 'findings') return `the ${a.page} page`;
  const bits = [];
  if (a.minStrength) bits.push(`findings at level ${a.minStrength} and above`);
  if (a.maxStrength) bits.push('hypotheses only');
  if (a.buildable === 'jason-can-build') bits.push('findings Jason can build');
  if (a.buildable === 'jason-cannot-build') bits.push('findings Jason cannot build');
  if (a.status) bits.push(`${a.status} findings`);
  if (a.stale) bits.push('findings due a re-check');
  if (a.search) bits.push(`findings matching "${a.search}"`);
  return bits.length ? bits.join(', ') : 'all active findings';
}

/**
 * Turn text into an intention. Never executes, never guesses silently.
 *
 * @returns {{ok:boolean, verb:string|null, args:object, understood:string,
 *            spends:boolean, estimateUsd:number, source:'rules'|'none',
 *            problem:string|null, suggestions:string[]}}
 */
export function parseCommand(input) {
  const raw = clean(input);
  if (!raw) {
    return {
      ok: false,
      verb: null,
      args: {},
      understood: 'nothing — you have not typed anything',
      spends: false,
      estimateUsd: 0,
      source: 'none',
      problem: 'empty',
      suggestions: [],
    };
  }

  for (const rule of RULES) {
    const m = raw.match(rule.test);
    if (!m) continue;
    const built = rule.build(m, raw);

    // A rule can match on shape but produce nothing usable — "watch " with no
    // topic. Better to say so than to stand a watch on an empty string.
    const missing = missingField(built);
    if (missing) {
      return {
        ok: false,
        verb: built.verb,
        args: built.args,
        understood: `${built.verb}, but ${missing}`,
        spends: false,
        estimateUsd: 0,
        source: 'rules',
        problem: missing,
        suggestions: VERBS[built.verb]?.examples ?? [],
      };
    }

    const spends = VERBS[built.verb]?.spends ?? false;
    return {
      ok: true,
      verb: built.verb,
      args: built.args,
      understood: describe(built),
      spends,
      // Money is not the only consequence. Handing something to Jason is
      // outward-facing; archiving and stopping change state. All of them wait
      // for a second keystroke.
      needsConfirm: spends || Boolean(VERBS[built.verb]?.consequential),
      estimateUsd: spends ? estimateFor(built) : 0,
      source: 'rules',
      problem: null,
      suggestions: [],
    };
  }

  return {
    ok: false,
    verb: null,
    args: {},
    understood: `nothing I recognise in "${raw.slice(0, 80)}"`,
    spends: false,
    estimateUsd: 0,
    source: 'none',
    problem: 'no matching verb',
    // Never guess at what was meant. Show what she does understand instead.
    suggestions: Object.entries(VERBS)
      .filter(([name]) => name !== 'help')
      .map(([, v]) => v.examples[0]),
  };
}

function missingField(built) {
  const a = built.args ?? {};
  if (built.verb === 'watch' && !a.topic) return 'you did not say what to watch';
  if (built.verb === 'research' && !a.topic) return 'you did not say what to research';
  if (['pause', 'resume', 'open', 'send', 'archive'].includes(built.verb) && !a.target) return 'you did not say which one';
  if (built.verb === 'run' && a.which === 'named' && !a.target) return 'you did not say which watch';
  return null;
}

/**
 * The prompt used only when no rule matched. The model may choose a verb and
 * fill its fields; it cannot invent an action, and whatever it returns goes
 * back through the same confirmation as a rule-parsed command.
 */
export function fallbackPrompt(text) {
  return `Someone typed a command to a research agent. Work out which single action they meant, from this list and no other:

${Object.entries(VERBS)
  .map(([name, v]) => `- ${name}: ${v.summary}. e.g. "${v.examples[0]}"`)
  .join('\n')}

If it does not clearly match one of these, say so rather than choosing the closest. Acting on a misreading is worse than admitting you did not understand.

They typed: "${text}"`;
}

export const FALLBACK_SCHEMA = {
  type: 'OBJECT',
  properties: {
    understood: { type: 'BOOLEAN', description: 'False if it does not clearly match one of the listed verbs.' },
    verb: { type: 'STRING', enum: VERB_NAMES },
    topic: { type: 'STRING', description: 'For watch and research.' },
    target: { type: 'STRING', description: 'For pause, resume, open, send, archive, and a named run.' },
    cadence: { type: 'STRING', enum: Object.keys(CADENCES) },
    depth: { type: 'STRING', enum: LEVEL_NAMES },
    reasoning: { type: 'STRING' },
  },
  required: ['understood', 'reasoning'],
};

/** Shape a model's answer into the same structure a rule produces. */
export function fromModel(json) {
  if (!json || json.understood !== true || !VERB_NAMES.includes(json.verb)) {
    return {
      ok: false,
      verb: null,
      args: {},
      understood: json?.reasoning ? `not a command I have: ${json.reasoning}` : 'nothing I recognise',
      spends: false,
      estimateUsd: 0,
      source: 'model',
      problem: 'no matching verb',
      suggestions: Object.values(VERBS).map((v) => v.examples[0]),
    };
  }

  const args = {};
  if (json.topic) args.topic = strip(json.topic);
  if (json.target) args.target = strip(json.target);
  if (json.verb === 'watch') {
    args.cadence = CADENCES[json.cadence] ? json.cadence : 'daily';
    args.depth = LEVEL_NAMES.includes(json.depth) ? json.depth : null;
  }
  if (json.verb === 'research') {
    args.depth = LEVEL_NAMES.includes(json.depth) ? json.depth : 'dig';
    args.depthWasStated = LEVEL_NAMES.includes(json.depth);
  }
  if (json.verb === 'run') args.which = args.target ? 'named' : 'due';

  const built = { verb: json.verb, args };
  const missing = missingField(built);
  if (missing) {
    return { ok: false, verb: json.verb, args, understood: `${json.verb}, but ${missing}`, spends: false, estimateUsd: 0, source: 'model', problem: missing, suggestions: VERBS[json.verb]?.examples ?? [] };
  }

  const spends = VERBS[json.verb]?.spends ?? false;
  return {
    ok: true,
    verb: json.verb,
    args,
    understood: describe(built),
    spends,
    // A command she had to interpret always confirms, whatever the verb.
    needsConfirm: true,
    estimateUsd: spends ? estimateFor(built) : 0,
    // Flagged so the HUD can say she had to interpret it, which is worth
    // knowing before you confirm something that spends.
    source: 'model',
    problem: null,
    suggestions: [],
  };
}

/**
 * Re-price "run" once the number of due watches is actually known.
 *
 * The parse-time estimate assumes two watches, because at parse time the store
 * is not open and nobody knows. Since `run` stopped stopping at a fixed three,
 * that guess is the difference between quoting for two and spending for nine —
 * so the estimate is corrected here, BEFORE the confirmation line is priced.
 *
 * Kept out of the route so it can be tested without an HTTP server: the bug it
 * exists to prevent is invisible from the outside, because both the wrong
 * number and the right one look like a perfectly ordinary quote.
 */
export function priceDueRun(parsed, dueCount) {
  const n = clampNumber(dueCount, 0, 500, 0);
  return {
    ...parsed,
    estimateUsd: (clampNumber(parsed?.estimateUsd, 0, 1000, 0) / 2) * Math.max(1, n),
    dueCount: n,
    understood: n ? `run all ${n} watch(es) that are due` : 'run every watch that is due — none are, so this will do nothing',
  };
}

/** Clamp any number that reaches the confirmation line. */
export function affordability(estimateUsd, headroomUsd) {
  const cost = clampNumber(estimateUsd, 0, 1000, 0);
  const left = clampNumber(headroomUsd, 0, 1e6, 0);
  return { cost, left, affordable: cost <= left };
}
