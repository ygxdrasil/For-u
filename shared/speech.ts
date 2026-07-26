/**
 * Cutting a reply into pieces her voice can actually carry.
 *
 * Shared rather than tucked into the speech hook so the self-test can prove
 * it: the failure it prevents — a long answer stopping mid-word with no error
 * anywhere — is invisible from the outside and was only ever noticed by the
 * person listening.
 */

const SENTENCE_END = /(?<=[.!?\u2026])\s+/;

/** Comfortably inside what the speech route accepts in one request. */
export const CHUNK_TARGET = 1500;

/**
 * Break text into pieces that will each survive the trip.
 *
 * The old version packed sentences up to a target and then added one more,
 * so a single long sentence — a list read aloud, a paragraph with no full
 * stop in it — could sail past the limit. The route then quietly cut it and
 * she stopped mid-word.
 *
 * Nothing here may exceed the limit. Sentences are packed while they fit, and
 * a sentence too long to fit alone is split between words rather than through
 * one. Every character of the original comes out the other side.
 */
export function chunkForSpeech(text: string, limit = CHUNK_TARGET): string[] {
  const chunks: string[] = [];
  let batch = '';

  const put = (piece: string) => {
    const trimmed = piece.trim();
    if (trimmed) chunks.push(trimmed);
  };

  for (const sentence of text.split(SENTENCE_END)) {
    if (sentence.length > limit) {
      // Too long by itself. Flush what is held, then break it on spaces.
      put(batch);
      batch = '';

      let rest = sentence;
      while (rest.length > limit) {
        const space = rest.lastIndexOf(' ', limit);
        // A "word" longer than the whole limit is not prose — a URL, or a
        // wall of characters. Cut it squarely rather than loop for ever.
        const at = space > limit / 2 ? space : limit;
        put(rest.slice(0, at));
        rest = rest.slice(at).trimStart();
      }
      batch = rest ? `${rest} ` : '';
      continue;
    }

    if (batch.length + sentence.length + 1 > limit) {
      put(batch);
      batch = '';
    }
    batch += `${sentence} `;
  }

  put(batch);
  return chunks;
}
