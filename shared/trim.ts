/**
 * Cutting the dead air off the end of generated speech.
 *
 * A speech model does not hand back exactly the words. It pads — a beat of
 * silence at the start while the voice settles, and often the better part of a
 * second at the end. On one clip that is unnoticeable. A reply is spoken in
 * three or four clips, so it is three or four pauses, each landing exactly at a
 * full stop, which is precisely where a listener reads a pause as hesitation
 * rather than as the encoder finishing up.
 *
 * The audio is 16-bit PCM in a WAV container, which is the one format where
 * trimming is honest arithmetic rather than re-encoding: find the last sample
 * that is not silence, cut there, and correct the two length fields in the
 * header. Nothing is resampled and nothing is decoded.
 *
 * Kept in shared/ because it is pure and therefore testable, which matters more
 * here than usual — a wrong offset does not sound slightly off, it produces a
 * file no browser will play at all.
 */

/** Quieter than this is silence. About -46dBFS, safely under any room tone. */
const FLOOR = 150;

/** A breath of quiet left behind, so words do not end abruptly. */
const TAIL_MS = 60;

interface Wav {
  /** Byte offset of the first sample. */
  start: number;
  channels: number;
  rate: number;
  bits: number;
  /** Byte length of the sample data. */
  length: number;
}

/**
 * Find the data chunk.
 *
 * Walked rather than assumed at offset 44: a WAV may carry LIST or fact chunks
 * before the data, and generators differ about it. Assuming the canonical
 * layout works until the day something inserts a chunk, and then it silently
 * plays noise.
 */
function describe(bytes: Uint8Array): Wav | null {
  if (bytes.length < 12) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const tag = (at: number) => String.fromCharCode(...bytes.subarray(at, at + 4));
  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;

  let at = 12;
  let channels = 1;
  let rate = 24_000;
  let bits = 16;

  while (at + 8 <= bytes.length) {
    const id = tag(at);
    const size = view.getUint32(at + 4, true);
    const body = at + 8;

    if (id === 'fmt ' && body + 16 <= bytes.length) {
      channels = view.getUint16(body + 2, true) || 1;
      rate = view.getUint32(body + 4, true) || 24_000;
      bits = view.getUint16(body + 14, true) || 16;
    }

    if (id === 'data') {
      return {start: body, channels, rate, bits, length: Math.min(size, bytes.length - body)};
    }

    // Chunks are word-aligned; an odd size carries a pad byte.
    at = body + size + (size % 2);
  }

  return null;
}

/**
 * Trim silence from the end of a 16-bit PCM WAV.
 *
 * Returns the input untouched for anything it does not fully understand —
 * another bit depth, a malformed header, audio that is silent throughout.
 * Refusing to guess is the whole safety story here: the cost of being wrong is
 * a file that will not play.
 */
export function trimTrailingSilence(input: Uint8Array): Uint8Array {
  const wav = describe(input);
  if (!wav || wav.bits !== 16 || wav.length < 4) return input;

  const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
  const bytesPerFrame = 2 * wav.channels;
  const frames = Math.floor(wav.length / bytesPerFrame);
  if (frames === 0) return input;

  let lastLoud = -1;
  for (let frame = frames - 1; frame >= 0; frame -= 1) {
    let loudest = 0;
    for (let channel = 0; channel < wav.channels; channel += 1) {
      const at = wav.start + frame * bytesPerFrame + channel * 2;
      if (at + 2 > input.byteLength) continue;
      loudest = Math.max(loudest, Math.abs(view.getInt16(at, true)));
    }
    if (loudest > FLOOR) {
      lastLoud = frame;
      break;
    }
  }

  // Silent throughout: not something to "fix" by producing an empty file.
  if (lastLoud < 0) return input;

  const tail = Math.round((TAIL_MS / 1000) * wav.rate);
  const keepFrames = Math.min(frames, lastLoud + 1 + tail);
  if (keepFrames >= frames) return input;

  const keepBytes = keepFrames * bytesPerFrame;
  const output = input.slice(0, wav.start + keepBytes);

  // The two lengths a player actually reads. Left stale, every player either
  // reads past the end of the file or refuses it outright.
  const out = new DataView(output.buffer, output.byteOffset, output.byteLength);
  out.setUint32(4, output.byteLength - 8, true);
  out.setUint32(wav.start - 4, keepBytes, true);

  return output;
}
