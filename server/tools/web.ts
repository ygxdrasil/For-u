import {getProvider} from '../llm/index';
import type {Tool} from './types';

/**
 * The web, as something she chooses to reach for.
 *
 * Gemini refuses to accept its built-in search alongside function calling in
 * one request — "Built-in tools and Function Calling cannot be combined" — so
 * the moment she was given hands she lost the web. Attaching one or the other
 * per request would have meant guessing in advance which a sentence needed,
 * and getting it wrong on "what's the forecast, and remind me to take a coat".
 *
 * Searching is therefore a tool like any other, run as its own grounded
 * request. She can search and act in the same breath, the choice is hers
 * rather than a regex's, and the interface can say plainly that she went and
 * looked.
 */
export const webTools: Tool[] = [
  {
    name: 'search_web',
    description:
      'Look something up on the web. Use this whenever an answer depends on ' +
      'something current, specific, or outside what you already know — news, ' +
      'weather, prices, opening times, scores, recent events, anything that has ' +
      'changed since you were trained. Ask it a full question rather than ' +
      'keywords. Do not use it for things you already know.',
    category: 'research',
    parameters: {
      query: {
        type: 'string',
        description:
          'The question to answer, in full. Include any detail from the ' +
          'conversation that narrows it — a place, a date, a name.',
      },
    },
    required: ['query'],
    run: async (args) => {
      const query = String(args.query ?? '').trim();
      if (!query) return 'No question was given to look up.';

      // Its own request, with grounding and nothing else attached, which is
      // the only shape the provider accepts.
      const answer = await getProvider().complete({
        system:
          'Answer the question from current web sources. Be brief and factual. ' +
          'Give the figures, names and dates that were asked for. If the sources ' +
          'disagree or are thin, say so rather than picking one.',
        turns: [{role: 'user', text: query}],
        search: true,
        temperature: 0.2,
      });

      return answer.trim() || 'Nothing useful came back for that.';
    },
  },
];
