import {
  combine,
  printOf,
  tightnessOf,
  verify,
  type Enrolment,
  type Strictness,
  type Verdict,
  type Voiceprint,
} from '../../shared/voiceprint';

/**
 * The browser's half of the speaker check.
 *
 * All this does is turn a recorded blob into samples and hand them to the
 * shared maths. Kept apart from that maths so the maths stays testable in
 * Node — decoding audio needs a browser, and a check nobody can run in CI is a
 * check nobody runs.
 */

export interface GuardState {
  enrolment: Enrolment | null;
  on: boolean;
  strictness: Strictness;
}

/** One AudioContext for decoding, rather than one per utterance. */
let decoder: AudioContext | null = null;

/**
 * Recorded audio as mono samples.
 *
 * Mixed down rather than taking the first channel: a laptop with stereo
 * capture puts most of a voice in one side depending on where you sit, and
 * "which side of the machine were you on" is not a property of your voice.
 */
export async function samplesOf(
  audio: Blob,
): Promise<{samples: Float32Array; rate: number}> {
  const Ctor = window.AudioContext ?? (window as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
  if (!decoder) decoder = new Ctor();

  const buffer = await decoder.decodeAudioData(await audio.arrayBuffer());
  if (buffer.numberOfChannels === 1) {
    return {samples: buffer.getChannelData(0), rate: buffer.sampleRate};
  }

  const mixed = new Float32Array(buffer.length);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < buffer.length; i += 1) {
      mixed[i] += data[i] / buffer.numberOfChannels;
    }
  }
  return {samples: mixed, rate: buffer.sampleRate};
}

export async function printFrom(audio: Blob): Promise<Voiceprint> {
  const {samples, rate} = await samplesOf(audio);
  return printOf(samples, rate);
}

/** Several takes into the enrolment that gets stored. */
export async function enrolmentFrom(clips: Blob[]): Promise<Enrolment | null> {
  const prints = (await Promise.all(clips.map(printFrom))).filter(
    (print) => print.voiced > 0,
  );
  if (prints.length < 2) return null;

  const print = combine(prints);
  return {
    print,
    samples: prints.length,
    tightness: tightnessOf(prints, print),
    at: new Date().toISOString(),
  };
}

/**
 * Was that you?
 *
 * Answers yes when the guard is off or nothing is enrolled, because the
 * failure that matters here is not letting a stranger through — it is locking
 * the owner out of their own assistant.
 */
export async function wasYou(guard: GuardState, audio: Blob): Promise<Verdict> {
  if (!guard.on || !guard.enrolment) return {ok: true, score: 1, needed: 0};
  try {
    return verify(guard.enrolment, await printFrom(audio), guard.strictness);
  } catch {
    // Undecodable audio is a broken recording, not an impostor.
    return {ok: true, score: 1, needed: 0};
  }
}
