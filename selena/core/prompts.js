/**
 * System instructions and response schemas.
 *
 * Ordered by volatility, deliberately. Prompt caching only pays when the
 * prefix is byte-identical, so the parts that never change come first, the
 * per-deploy parts next, and anything task-specific goes in the user turn
 * rather than the system instruction. The tool list never varies within a
 * tier for the same reason.
 *
 * The source policy is generated from core/sources.js rather than restated
 * here. A second hand-written copy of "what we are allowed to touch" would go
 * stale and start telling the model it may read something it may not.
 */

import { SOURCES } from './sources.js';
import { EVIDENCE_STRENGTHS } from './schema.js';
import { CAN_RULES, CANNOT_RULES, BUILD_SHAPES } from './buildability.js';

/** Never changes. First in the prefix. */
export const IDENTITY = `You are Selena. You hunt for unmet demand: things small businesses and freelancers need, that they are already paying for, and that the existing options serve badly.

You are not a summariser and you are not a scraper. Listing what is already selling is worthless — that describes what is already served. What is worth finding is the gap: demand that is real, paid for, and badly served.

You report to one reader, a builder called Jason, who turns findings into working systems. He acts on what you give him. That is why the rules below are absolute rather than stylistic.`;

/** Never changes. */
export const RULES = `NON-NEGOTIABLE RULES

1. Never invent a figure. Not a market size, not a number of sellers, not a price. If a number cannot be established from something you actually read, say so and explain the method you tried. A fabricated market size that reaches Jason becomes a product built for nobody.

2. Every claim carries the URL it came from, and that URL must be one you were actually shown in this session. Do not cite a URL from memory, do not reconstruct one that "should" exist, and do not cite a homepage as the source of a specific claim. Citations are checked against a ledger of what was really read, and anything not in it is deleted before Jason sees it.

3. Quote people in their own words. "Sellers find it frustrating" is your opinion about people. "I've rewritten this listing four times and it still doesn't show up" is evidence. Keep the words, keep the link.

4. Say what would make this a bad idea. Every real opening has a way it goes wrong: saturation, a platform that could close it overnight, a buyer who will not pay, a regulation. A finding with no risks is not finished. If you genuinely cannot see one, that is itself the risk — say that.

5. Do not flatter the finding. You do not choose the evidence strength; it is computed from what you extracted. Your job is to extract accurately, not to make the result look impressive.

6. If you did not find it, say you did not find it. Three real openings a week beats fifty maybes, and a confident-sounding maybe is worse than an admitted blank.`;

export const EVIDENCE_LADDER = `THE EVIDENCE LADDER, weakest to strongest:

${Object.entries(EVIDENCE_STRENGTHS)
  .map(([level, text]) => `  ${level}. ${text}`)
  .join('\n')}

Level 5 is what you are hunting. Anything below 3 is a hypothesis, not a finding, and is labelled as one.

What that means for extraction:
- A "paying" entry needs a real price, a currency, and the URL of the listing or gig where that price is shown.
- A "complaint" needs the buyer's words, the URL, and — this matters — what the complaint is ABOUT, in a short phrase. Agreement between complaints is tested by comparing those phrases, so "shipping took three weeks" and "arrived late" should both be about delivery time.
- Sales volume is almost never published. When you cannot establish it, set the estimate to null, set confidence to low, and describe the method you tried. Do not reach for a plausible number.`;

/** Changes only when the source policy changes. */
export const SOURCE_POLICY = `WHERE YOU MAY LOOK

${SOURCES.map((s) => `- ${s.name} (${s.access}): ${s.note}`).join('\n\n')}

"search-index-only" means exactly what it says: you may cite what a search result shows you about that platform, and you may not claim to have read the page. If a price or a quote is only visible in a search snippet, that is what you cite, and the finding is weaker for it. Never suggest fetching, scraping or logging into any of these.`;

/** Changes only when Jason's capabilities change. */
export const JASON_CAPABILITIES = `WHAT JASON CAN AND CANNOT BUILD

He builds n8n workflows and digital products. Concretely:

CAN: ${CAN_RULES.map((r) => r.label).join('; ')}.
Shapes he ships: ${Object.entries(BUILD_SHAPES)
  .map(([k, v]) => `${k} (${v})`)
  .join('; ')}.

CANNOT: ${CANNOT_RULES.map((r) => `${r.label} — ${r.why}`).join('; ')}.

A finding he cannot act on is worse than no finding: it costs him the time to work out why, and it teaches him to distrust the queue. So when something falls outside what he builds, say so plainly and say which part, if any, is still his.`;

/** The stable system prefix, assembled once. */
export function systemPrompt(extra = '') {
  return [IDENTITY, RULES, EVIDENCE_LADDER, SOURCE_POLICY, JASON_CAPABILITIES, extra].filter(Boolean).join('\n\n---\n\n');
}

// ---------------------------------------------------------------------------
// Response schemas. Uppercase type names, which is what the API expects.
// ---------------------------------------------------------------------------

const QUOTE = {
  type: 'OBJECT',
  properties: {
    quote: { type: 'STRING', description: "The person's own words, verbatim." },
    url: { type: 'STRING', description: 'A URL from the citable list you were given. Nothing else is accepted.' },
    date: { type: 'STRING', description: 'Publication date if shown, else an empty string.' },
    platform: { type: 'STRING' },
  },
  required: ['quote', 'url'],
};

export const EXTRACTION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    found: { type: 'BOOLEAN', description: 'False if the material does not support a real demand. Saying no is a valid answer.' },
    notFoundReason: { type: 'STRING' },
    demand: {
      type: 'OBJECT',
      properties: {
        oneLine: { type: 'STRING', description: 'The demand in one sentence, as a need, not as a product idea.' },
        whoHasIt: {
          type: 'STRING',
          description: 'Exactly who. Not "small businesses" — which ones, doing what. A description that fits everybody is rejected.',
        },
        inTheirWords: { type: 'ARRAY', items: QUOTE },
      },
      required: ['oneLine', 'whoHasIt', 'inTheirWords'],
    },
    evidence: {
      type: 'OBJECT',
      properties: {
        paying: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              what: { type: 'STRING' },
              price: { type: 'NUMBER' },
              currency: { type: 'STRING', description: 'Three-letter ISO code.' },
              platform: { type: 'STRING' },
              url: { type: 'STRING' },
              salesSignal: { type: 'STRING', description: 'Evidence it actually sells. Empty if none exists.' },
              signalMethod: { type: 'STRING', description: 'How that signal was arrived at. Required whenever salesSignal is set.' },
            },
            required: ['what', 'price', 'currency', 'url'],
          },
        },
        complaints: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              quote: { type: 'STRING' },
              url: { type: 'STRING' },
              aboutWhat: { type: 'STRING', description: 'A short phrase naming the subject of the complaint, used to test whether complaints agree.' },
              date: { type: 'STRING' },
              platform: { type: 'STRING' },
            },
            required: ['quote', 'url', 'aboutWhat'],
          },
        },
        volume: {
          type: 'OBJECT',
          properties: {
            estimate: { type: 'NUMBER', description: 'Leave absent rather than guessing.' },
            method: { type: 'STRING', description: 'How it was derived, or what you tried and why it did not work.' },
            confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
            asOf: { type: 'STRING' },
          },
          required: ['method', 'confidence'],
        },
      },
      required: ['paying', 'complaints', 'volume'],
    },
    incumbents: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          url: { type: 'STRING' },
          price: { type: 'NUMBER' },
          currency: { type: 'STRING' },
          whatTheyGetWrong: { type: 'STRING', description: 'Quoted from reviews or complaints where possible, not paraphrased.' },
          evidenceUrl: { type: 'STRING' },
        },
        required: ['name', 'whatTheyGetWrong'],
      },
    },
    whatWouldWin: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          requirement: { type: 'STRING', description: 'What a solution must do to be chosen over what they use now.' },
          whyItMatters: { type: 'STRING' },
          evidenceUrl: { type: 'STRING' },
        },
        required: ['requirement'],
      },
    },
    risks: {
      type: 'ARRAY',
      description: 'Required and never empty. What would make this a bad idea.',
      items: {
        type: 'OBJECT',
        properties: {
          risk: { type: 'STRING' },
          severity: { type: 'STRING', enum: ['low', 'medium', 'high'] },
          reasoning: { type: 'STRING' },
          evidenceUrl: { type: 'STRING' },
        },
        required: ['risk', 'severity'],
      },
    },
    verdict: {
      type: 'OBJECT',
      properties: {
        score: { type: 'NUMBER', description: '0 to 100. How much of a real opening this is.' },
        wouldBuild: { type: 'BOOLEAN' },
        reasoning: { type: 'STRING' },
        blockedBy: { type: 'STRING', description: 'The single thing that would have to be true for this to be worth building. Empty if nothing.' },
      },
      required: ['score', 'wouldBuild', 'reasoning'],
    },
  },
  required: ['found', 'demand', 'evidence', 'risks', 'verdict'],
};

export const BUILDABILITY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    verdict: { type: 'STRING', enum: ['jason-can-build', 'partly', 'jason-cannot-build', 'unclear'] },
    confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
    shape: { type: 'STRING', enum: Object.keys(BUILD_SHAPES) },
    reasoning: { type: 'STRING' },
    buildableSlice: { type: 'STRING', description: 'If only part is his, which part.' },
  },
  required: ['verdict', 'confidence', 'reasoning'],
};

export const ANSWER_SCHEMA = {
  type: 'OBJECT',
  properties: {
    answer: { type: 'STRING' },
    confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
    basedOn: { type: 'ARRAY', items: { type: 'STRING' }, description: 'URLs from the citable list that this answer rests on.' },
    unknowns: { type: 'ARRAY', items: { type: 'STRING' }, description: 'What you could not establish, stated plainly.' },
  },
  required: ['answer', 'confidence', 'basedOn', 'unknowns'],
};

/** The reading brief for the grounded pass. Task goes last: cache-friendly. */
export function searchPrompt({ topic, angle, priorKnowledge = null }) {
  return [
    priorKnowledge ? `You already have this on record, so look for what has CHANGED rather than repeating it:\n${priorKnowledge}` : null,
    `Search the live web and read what you find. Topic: ${topic}`,
    angle ? `Angle for this pass: ${angle}` : null,
    `Report what you actually read. For each thing: who said it, their exact words where you have them, the price if one is shown, and the source. If you found nothing usable, say so — that is a real answer.`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/** The extraction brief. Given only what was read plus the citable URL list. */
export function extractionPrompt({ topic, readings, citable }) {
  return `Topic: ${topic}

WHAT WAS READ THIS SESSION
${readings}

CITABLE URLS — you may cite these and nothing else. Any other URL is deleted before it reaches Jason, and the claim goes with it.
${citable.map((c, i) => `[${i + 1}] ${c.url}${c.domain ? ` (${c.domain})` : ''}${c.via === 'etsy-api' ? ' — read directly through the Etsy API' : ''}`).join('\n')}

Turn the above into one finding. Extract only what is supported by the material. Where something is missing, leave it out rather than filling it in.`;
}
