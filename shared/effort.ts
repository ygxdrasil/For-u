/**
 * How hard to think about this one.
 *
 * She had a single deliberation budget — 256 tokens — applied to every
 * sentence anyone said to her. That number was chosen when the worry was
 * latency: enough to decide to reach for a tool, not enough to sit there
 * ruminating over "what's on today". It did that job well and it is why she
 * answers quickly.
 *
 * It is also, now, the ceiling on how clever she is allowed to be. A question
 * that genuinely needs working through gets exactly as much thought as "turn
 * the light off", which is 256 tokens, which is roughly one paragraph of
 * reasoning. Asked why something happened, or which of two things is better,
 * or to plan anything, she has to answer almost immediately — so she answers
 * with the first thing that comes to mind, every time.
 *
 * The fix is not a bigger number. A bigger number everywhere means a beat of
 * silence before "lights off" and a bill that grows on the turns that needed
 * nothing. The fix is spending it where it buys something: almost none on a
 * command, a little on conversation, a great deal on the handful of questions
 * a day that actually deserve it.
 *
 * Deliberately a heuristic and not a model call. Asking a model how hard the
 * question is costs a round trip and its own tokens, on every single turn,
 * to answer something a dozen words of pattern-matching gets right most of
 * the time — and when it is wrong the cost is a slightly slower or slightly
 * shallower answer, not a wrong one. It also cannot fail, which a network
 * call in front of every reply certainly can.
 *
 * Kept in shared/ and pure so the self-test can hold it to real sentences.
 */

export type Effort = 'reflex' | 'ordinary' | 'hard';

/**
 * Thinking tokens allowed at each level.
 *
 * `reflex` is the old flat value, unchanged. It is proven: it is enough for
 * her to decide to call a tool, and dropping below it is the failure where she
 * holds a working search tool and announces she cannot reach the internet.
 * That bug cost days to find once and is not worth re-opening to save a
 * hundred tokens on a light switch.
 */
export const THINKING: Record<Effort, number> = {
  reflex: 256,
  ordinary: 1024,
  hard: 4096,
};

/**
 * Lower temperature where the answer is a matter of fact rather than of
 * phrasing. Reasoning wants to converge; conversation wants some air.
 */
export const WARMTH: Record<Effort, number> = {
  reflex: 0.3,
  ordinary: 0.7,
  hard: 0.4,
};

export interface Deliberation {
  effort: Effort;
  think: number;
  temperature: number;
  /** Which rule fired, so a surprising choice can be read rather than guessed. */
  because: string;
}

/**
 * Things that are done, not pondered.
 *
 * All imperatives, and all about the house or her own state. The test is not
 * the verb alone — "set out the case for solar panels" is not a light switch —
 * so shortness and the absence of a question are required as well.
 */
const DOING =
  /^(turn|switch|set|dim|brighten|put|play|pause|stop|resume|skip|mute|unmute|open|close|lock|unlock|wake|sleep|start|add|remind|note|jot|cancel|snooze|call it|make (?:the|my|it)|lights?\b|goodnight|good night)\b/i;

/**
 * Questions with a shape that rewards thinking.
 *
 * Every one of these is a request for judgement rather than for a fact:
 * causes, comparisons, plans, decisions. "What time is my meeting" is a
 * lookup and belongs nowhere near this list.
 */
const WEIGHING = [
  /\bwhy\b/i,
  /\bhow come\b/i,
  /\bcompare\b|\bcomparison\b/i,
  /\bdifference between\b/i,
  /\b(?:versus|vs\.?)\b/i,
  /\bpros and cons\b|\btrade[- ]?offs?\b/i,
  /\bshould i\b|\bshould we\b/i,
  // "worth it", "worth the trouble", "worth switching the whole thing over" —
  // the last of which is the shape people actually use, and the one a list of
  // fixed phrases misses.
  /\bworth (?:it\b|the\b|\w+ing\b)/i,
  /\bexplain\b|\bwalk me through\b|\bbreak (?:it|this) down\b/i,
  /\bfigure out\b|\bwork out\b|\bthink through\b/i,
  /\bplan\b|\bstrategy\b|\bapproach\b/i,
  /\bbest way\b|\bwhich is better\b|\bbetter to\b/i,
  /\bwhat if\b|\bhelp me decide\b|\bmake sense\b/i,
  /\banaly[sz]e\b|\banalysis\b|\bdiagnose\b|\broot cause\b/i,
  /\bwhat.s wrong with\b|\bwhy (?:isn.t|doesn.t|won.t|can.t)\b/i,
];

/** Long enough that it is carrying more than one idea. */
const LONG_ENOUGH = 28;

export function effortFor(text: string): Deliberation {
  const said = text.trim();
  const words = said.split(/\s+/).filter(Boolean).length;

  const at = (effort: Effort, because: string): Deliberation => ({
    effort,
    think: THINKING[effort],
    temperature: WARMTH[effort],
    because,
  });

  const weighing = WEIGHING.find((pattern) => pattern.test(said));
  if (weighing) return at('hard', `asks for judgement (${weighing.source})`);

  // A long sentence is usually several sentences, and several sentences is
  // usually more than one thing to hold in mind at once.
  if (words > LONG_ENOUGH) return at('hard', `${words} words is more than one idea`);

  // Two questions in one breath is a question with a follow-up built in.
  if ((said.match(/\?/g) ?? []).length > 1) return at('hard', 'more than one question');

  // Order matters: a short imperative is only a reflex once nothing above has
  // claimed it. "Explain the plan" starts with no doing-verb but is not one,
  // and "why did you turn the lights off" starts with why and is not one either.
  if (words <= 9 && !said.includes('?') && DOING.test(said)) {
    return at('reflex', 'a short instruction, not a question');
  }

  return at('ordinary', 'ordinary conversation');
}
