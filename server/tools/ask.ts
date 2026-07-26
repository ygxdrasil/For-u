import type {Tool} from './types';

/**
 * Her asking a question with the answers already laid out.
 *
 * An assistant who needs something from you and can only say so in prose puts
 * the work back on you: read the sentence, work out what the options were,
 * type one. Two or three buttons is the same question with the work taken out,
 * and it is how a person hands someone a choice — not "what would you like to
 * do about the inspection" but "Tuesday or Thursday?".
 *
 * The tool does not wait for an answer. It cannot: she is mid-reply, and the
 * answer arrives as the next thing the user says. What it does is put the
 * choices on screen and tell her to stop talking, which is the honest shape of
 * asking someone something.
 */

interface Choice {
  label: string;
  detail?: string;
}

/** Parsed from a simple "label — what it means" line, which models get right. */
function parseChoices(raw: string): Choice[] {
  return raw
    .split(/\s*\|\s*|\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(/\s+[—-]{1,2}\s+/);
      return {
        label: label.trim().slice(0, 48),
        detail: rest.join(' — ').trim().slice(0, 120) || undefined,
      };
    })
    .slice(0, 4);
}

/**
 * Filled in by the chat route before the reply streams, so the question can be
 * put on the wire the moment she asks it.
 */
let deliver: ((question: string, choices: Choice[]) => void) | null = null;

export function onAsk(handler: typeof deliver): void {
  deliver = handler;
}

export const askTools: Tool[] = [
  {
    name: 'ask_choice',
    description:
      'Ask the user a question and give them buttons to answer with, instead ' +
      'of making them type. Use it whenever you need a decision from them and ' +
      'the sensible answers are a short list: which of two times, whether to ' +
      'go ahead, which of three options they prefer. Ask the question in your ' +
      'reply as well, in your own words — the buttons are how they answer, not ' +
      'a substitute for asking. Do not use it for open questions, and do not ' +
      'use it more than once in a reply.',
    category: 'research',
    parameters: {
      question: {
        type: 'string',
        description: 'The question itself, short and plain.',
      },
      choices: {
        type: 'string',
        description:
          'Two to four answers, separated by | — each optionally "Label — what ' +
          'it means". For example: "Tuesday — before the weekend | Thursday — ' +
          'gives you more time".',
      },
    },
    required: ['question', 'choices'],
    run: async (args) => {
      const question = String(args.question ?? '').trim();
      const choices = parseChoices(String(args.choices ?? ''));

      if (choices.length < 2) {
        return 'That needs at least two answers to choose between. Just ask them in words instead.';
      }

      deliver?.(question, choices);

      // She is told what happened rather than being made to wait. Waiting here
      // would hold a serverless request open for as long as the user takes to
      // decide, which is a request that times out and a question nobody ever
      // gets to answer.
      return (
        `The buttons are on their screen. Ask the question in your reply too, ` +
        `in one short sentence, then stop — do not guess which they will pick, ` +
        `and do not carry on as though they had already answered.`
      );
    },
  },
];
