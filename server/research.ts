import {addFile} from './files';
import {noteDeed} from './journal';
import {getProvider} from './llm/index';

/**
 * Looking something up properly.
 *
 * Ordinary search inside a conversation is one query and a sentence back,
 * which is right for "what's the weather" and useless for "is this worth
 * buying" — a question with several parts, where the parts disagree, and where
 * the answer is a page rather than a line.
 *
 * So this is three passes: work out what actually needs asking, ask all of it
 * at once, then write it up. The middle pass is where the money goes and it is
 * the one that parallelises, which is also why the whole thing takes about as
 * long as one slow answer rather than five.
 *
 * The result is kept as a document rather than said aloud. Findings that
 * scroll past in a conversation are findings you cannot come back to, and this
 * is precisely the kind of work nobody wants to commission twice.
 */

/** Enough to be worth calling research; few enough to survive the budget. */
const STRANDS = 4;

export interface Researched {
  title: string;
  report: string;
  strands: string[];
}

export async function research(topic: string): Promise<Researched> {
  const asked = topic.trim().slice(0, 400);
  if (asked.length < 3) throw new Error('there is no question there');

  /*
   * What actually needs asking.
   *
   * Straight to search with the user's words would ask one question four
   * times. A question worth researching decomposes — "is this laptop any good"
   * is really battery life, build quality, what owners say after a year, and
   * what it costs now — and finding those four is cheap, while asking the
   * wrong four is not.
   */
  const plan = await getProvider().complete({
    system:
      'You break a question into the separate things that must be looked up to ' +
      'answer it well. Return only a JSON array of strings, each a short search ' +
      `query, at most ${STRANDS} of them. No commentary.`,
    turns: [{role: 'user', text: asked}],
    temperature: 0.4,
    maxOutputTokens: 300,
    // A schema rather than a plea. Asking politely for JSON returns prose with
    // JSON in it often enough that the parse below would be the common path.
    json: {
      type: 'ARRAY',
      items: {type: 'STRING'},
    },
    fast: true,
  });

  let strands: string[] = [];
  try {
    const parsed = JSON.parse(plan) as unknown;
    if (Array.isArray(parsed)) {
      strands = parsed
        .filter((one): one is string => typeof one === 'string')
        .map((one) => one.trim())
        .filter(Boolean)
        .slice(0, STRANDS);
    }
  } catch {
    // A model that would not produce a list is not a reason to abandon the
    // job; the original question is a perfectly good single strand.
  }
  if (strands.length === 0) strands = [asked];

  /*
   * All of them at once.
   *
   * In sequence this is four round trips of a second or two each, one after
   * another, for no reason — no strand depends on any other. Together it costs
   * the slowest one.
   */
  const findings = await Promise.all(
    strands.map(async (strand) => {
      const found = await getProvider()
        .complete({
          system:
            'Answer from a web search, in plain prose. Include specifics — ' +
            'numbers, dates, names, prices — and say plainly when sources ' +
            'disagree or when you could not find something. No preamble.',
          turns: [{role: 'user', text: strand}],
          temperature: 0.3,
          maxOutputTokens: 700,
          search: true,
        })
        .catch(() => '');
      return {strand, found};
    }),
  );

  const usable = findings.filter((one) => one.found.trim().length > 0);
  if (usable.length === 0) {
    throw new Error('the web was unreachable for all of it');
  }

  const report = await getProvider().complete({
    system:
      'You write up research for one person who asked a question and wants an ' +
      'answer, not a literature review. Lead with what they should conclude, ' +
      'then the reasoning, then anything that would change the conclusion. ' +
      'Plain prose in short paragraphs — no markdown headings, no bullet ' +
      'salad. Say what is uncertain rather than smoothing it over. Where the ' +
      'findings disagree, say so and say which is better supported.',
    turns: [
      {
        role: 'user',
        text:
          `The question: ${asked}\n\n` +
          usable
            .map((one) => `Looked up "${one.strand}":\n${one.found}`)
            .join('\n\n'),
      },
    ],
    temperature: 0.5,
    maxOutputTokens: 1800,
  });

  const title = `Research — ${asked.slice(0, 60)}`;
  // Kept before it is returned, so a browser that closes mid-answer has not
  // thrown away the expensive part.
  await addFile(title, report).catch(() => {});
  await noteDeed('acted', `Researched ${asked.slice(0, 50)}`).catch(() => {});

  return {title, report, strands: usable.map((one) => one.strand)};
}
