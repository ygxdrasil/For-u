/**
 * Deciding whether someone said her name.
 *
 * Harder than it looks, and the reason is worth stating: nothing here ever sees
 * the word "Grace". It sees a transcriber's guess at a word, made from a
 * second of speech in a room, from someone who may have an accent, may be
 * across the room, and may be halfway through a sentence. "Grace" comes back as
 * Grace, Gracie, Greys, Grays, Grease, Race, Gray, Bres, and at least a dozen
 * other things.
 *
 * The old test was a literal match against four spellings. Anything else was
 * silently not-for-her — which looks, from the other side of the room, exactly
 * like her hearing you and ignoring you, and is what "I have to repeat myself"
 * actually was.
 *
 * So the test is now: does any word in this sentence sound close enough to her
 * name. Bounded so it stays predictable — one edit for a short word, two for a
 * longer one, and a small list of the mishearings that come up often enough to
 * be worth naming outright.
 */

const NAME = 'grace';

/** Heard often enough to be worth accepting without arithmetic. */
const KNOWN = new Set([
  'grace',
  'graces',
  'gracie',
  'gracy',
  'grayce',
  'grays',
  'greys',
  'grase',
  'grece',
  'griis',
  'krays',
  'kraes',
  'race',
  'rays',
  'gray',
  'grey',
  'greece',
  'grease',
  'creys',
  'crase',
]);

/** Words that sound close but are common enough that accepting them would hurt. */
const NEVER = new Set(['great', 'grade', 'grate', 'brace', 'trace', 'place', 'space', 'graph']);

/**
 * Levenshtein distance, stopped early.
 *
 * Bounded because an unbounded distance on a long word is both slower and
 * useless here — anything three edits from "grace" is not "grace".
 */
function distance(word: string, limit: number): number {
  if (Math.abs(word.length - NAME.length) > limit) return limit + 1;

  let previous = Array.from({length: NAME.length + 1}, (_, i) => i);

  for (let i = 1; i <= word.length; i += 1) {
    const current = [i];
    let best = i;

    for (let j = 1; j <= NAME.length; j += 1) {
      const cost = word[i - 1] === NAME[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
      best = Math.min(best, current[j]);
    }

    // Every remaining row can only get worse; give up now.
    if (best > limit) return limit + 1;
    previous = current;
  }

  return previous[NAME.length];
}

function sounds(word: string): boolean {
  if (KNOWN.has(word)) return true;
  if (NEVER.has(word)) return false;
  // Short words are accepted on one edit only; the longer the word, the less
  // likely a single letter is doing all the work of telling them apart.
  const limit = word.length <= 4 ? 1 : 2;
  return distance(word, limit) <= limit;
}

/**
 * Being told to leave it.
 *
 * Matched here rather than by asking the model, for two reasons. It has to be
 * instant — "go to sleep" followed by a considered paragraph about going to
 * sleep is a joke at her expense — and it has to work when she is being told
 * to stop *because* something has gone wrong, which is exactly when a round
 * trip to a model is the least reliable thing to depend on.
 *
 * Deliberately a short list of unambiguous phrases. "Sleep" on its own is not
 * here: "did you sleep well" and "set a sleep timer" both contain it, and
 * going silent when someone was making conversation is a worse failure than
 * not catching one phrasing.
 */
const SLEEP =
  /^(go(ing)? (to|back to) sleep|goodnight|good night|stop listening|that('?s| is) (all|it)|nothing else|leave me( alone)?|be quiet|shut up|dismissed|stand down)\b/i;

export function toldToSleep(request: string): boolean {
  return SLEEP.test(request.trim());
}

/**
 * Things a transcriber says when it was given nothing.
 *
 * Not a quirk of one model — every speech model trained on captioned video
 * does this. Handed a second of room tone it does not answer "nothing"; it
 * answers with whatever phrase most often accompanied silence in its training
 * data, with complete confidence. Which is why the phrases are so oddly
 * specific: they are the end-credits of a million videos.
 *
 * The list is matched against the *whole* utterance, never a part of it, so
 * "thank you" said to her is still heard while a lone "Thank you." out of an
 * empty room is not. That distinction is the only thing keeping this from
 * being a filter that deafens her to politeness.
 */
const PHANTOMS = new Set([
  'i created',
  'i created a',
  'thank you',
  'thanks',
  'thank you very much',
  'thanks for watching',
  'thank you for watching',
  'subtitles by the amaraorg community',
  'subscribe',
  'please subscribe',
  'bye',
  'bye bye',
  'you',
  'the',
  'so',
  'okay',
  'oh',
  'mm',
  'hmm',
  'uh',
  'um',
  'yeah',
  'silence',
  'music',
  'applause',
  'transcription by castingwordscom',
  'transcribed by httpsotterai',
]);

/**
 * Was that a real thing said, or the transcriber filling a silence?
 *
 * Deliberately whole-utterance only. Anything longer than a few words is
 * treated as real regardless — the phantoms are always short, and refusing a
 * genuine sentence because it happens to start with "so" would be a far worse
 * failure than occasionally letting one through.
 */
export function isPhantom(text: string): boolean {
  const bare = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!bare) return true;
  if (bare.split(' ').length > 5) return false;
  return PHANTOMS.has(bare);
}

export interface Heard {
  /** Whether her name was in it at all. */
  called: boolean;
  /** What is left once her name is taken out — the actual request. */
  request: string;
}

/**
 * Was she called, and what was asked.
 *
 * Her name anywhere counts, because "sorry Grace, what time is it" is how
 * people talk. It is removed from the request afterwards so she is not asked
 * about her own name.
 */
export function heardName(text: string): Heard {
  const words = text.split(/(\s+)/);
  let called = false;

  const kept = words.filter((part) => {
    if (/^\s+$/.test(part)) return true;
    const bare = part.toLowerCase().replace(/[^a-z']/g, '');
    if (!bare) return true;
    if (!called && sounds(bare.replace(/'s$/, ''))) {
      called = true;
      return false;
    }
    return true;
  });

  return {
    called,
    // Leading punctuation and doubled spaces are what is left where the name
    // was; a request beginning ", what time is it" reads as a transcription
    // fault to the model and gets remarked upon.
    request: kept.join('').replace(/\s+/g, ' ').replace(/^[\s,.:;!?-]+/, '').trim(),
  };
}
