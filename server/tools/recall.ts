import {getMessages, getProfile} from '../memory';
import type {Tool} from './types';

/**
 * Going back and looking, rather than trying to remember.
 *
 * Her working memory is the recent window plus a three-hundred-word summary of
 * everything before it. That is enough to hold a conversation and nowhere near
 * enough to answer "what did we decide about the flights". The whole log is
 * kept — it always was — but nothing could reach into it.
 *
 * This is deliberately a search over words rather than anything cleverer.
 * Embeddings would mean a model call per message stored, which on a ten dollar
 * budget is the wrong trade for a log this size; matching on the words people
 * actually used finds "the flights" perfectly well and costs nothing.
 */

/** Words too common to be evidence of anything. */
const NOISE = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'of', 'to', 'in', 'on', 'at',
  'for', 'with', 'about', 'i', 'you', 'we', 'it', 'is', 'was', 'are', 'were',
  'be', 'been', 'do', 'did', 'does', 'what', 'when', 'where', 'who', 'how',
  'my', 'me', 'your', 'that', 'this', 'said', 'say', 'tell', 'told', 'again',
]);

function terms(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !NOISE.has(word));
}

function score(haystack: string, needles: string[]): number {
  const text = haystack.toLowerCase();
  let hits = 0;
  for (const needle of needles) {
    if (text.includes(needle)) hits += 1;
  }
  return hits;
}

function stamp(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return 'at some point';
  return at.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export const recallTools: Tool[] = [
  {
    name: 'search_memory',
    description:
      'Search everything the user has ever said to you, and everything you ' +
      'know about them, for a word or subject. Use it whenever they refer to ' +
      'something from an earlier conversation you cannot see any more — "what ' +
      'did we decide about", "the thing I mentioned last week", a name or a ' +
      'place you half recognise. Search before saying you do not remember.',
    category: 'research',
    parameters: {
      about: {
        type: 'string',
        description:
          'The subject to look for — a name, place, or a few words of what was ' +
          'said. Not a full question.',
      },
    },
    required: ['about'],
    run: async (args) => {
      const about = String(args.about ?? '').trim();
      const needles = terms(about);
      if (needles.length === 0) return 'That is too vague to search for.';

      const [log, profile] = await Promise.all([getMessages(), getProfile()]);

      const known = profile.entries
        .filter((entry) => !entry.supersededAt && score(entry.text, needles) > 0)
        .map((entry) => `- ${entry.text}`);

      const hits = log
        .map((message, index) => ({message, index, hits: score(message.text, needles)}))
        .filter((row) => row.hits > 0)
        .sort((left, right) =>
          right.hits === left.hits ? right.index - left.index : right.hits - left.hits,
        )
        .slice(0, 6)
        // Read back in the order things were said, which is the order they
        // make sense in.
        .sort((left, right) => left.index - right.index);

      if (known.length === 0 && hits.length === 0) {
        return `Nothing in the record mentions ${about}.`;
      }

      const lines: string[] = [];
      if (known.length > 0) {
        lines.push(`What you already know about this:\n${known.join('\n')}`);
      }

      if (hits.length > 0) {
        lines.push('From earlier conversations:');
        for (const {message, index} of hits) {
          // The reply is usually where the substance is, so a hit on a question
          // is worth little without what followed it.
          const answer = log[index + 1];
          const who = message.speaker === 'grace' ? 'You said' : 'They said';
          lines.push(`- ${stamp(message.at)}, ${who}: "${message.text.slice(0, 300)}"`);
          if (answer && answer.speaker !== message.speaker) {
            lines.push(`  and the reply was: "${answer.text.slice(0, 300)}"`);
          }
        }
      }

      return lines.join('\n');
    },
  },
];
