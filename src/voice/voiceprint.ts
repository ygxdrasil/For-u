import {
  blend,
  combine,
  printOf,
  spreadOf,
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
    // Which parts of this voice hold still and which wander. Measured here
    // because it can only be measured across takes, and this is the only
    // moment several takes of the same voice exist together.
    spread: spreadOf(prints),
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
/**
 * Let the print follow the voice as it drifts.
 *
 * A cold comes on over three days, a microphone gets replaced, a room changes.
 * Without this, an enrolment made once slowly stops describing the person who
 * made it, and the first thing they notice is being refused.
 *
 * Throttled hard, and only on comfortable matches, so this is a slow correction
 * rather than a thing that learns whoever spoke last. Failures are swallowed:
 * an assistant that stops listening because a background save went wrong would
 * be worse than one that never adapted at all.
 */
let lastBlend = 0;

export async function keepUpWith(guard: GuardState, audio: Blob): Promise<void> {
  if (!guard.on || !guard.enrolment) return;
  try {
    await keepUpWithPrint(guard, await printFrom(audio));
  } catch {
    // Nothing here is worth interrupting anyone over.
  }
}

async function keepUpWithPrint(guard: GuardState, print: Voiceprint): Promise<void> {
  if (!guard.enrolment) return;
  if (Date.now() - lastBlend < 10 * 60_000) return;

  const moved = blend(guard.enrolment, print);
  if (!moved) return;
  lastBlend = Date.now();
  await fetch('/api/voice-enrol', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({enrolment: moved}),
  });
}

/**
 * The same two jobs, on raw samples.
 *
 * The ambient path holds actual audio rather than an encoded blob, so it can
 * skip decoding entirely — which is not merely tidier. Decoding was an await
 * in the middle of deciding whether to answer, and the whole point of checking
 * the speaker before transcribing was to make an unrecognised voice cost
 * nothing. Cost nothing, and take no time.
 */
export function wasYouSamples(
  guard: GuardState,
  samples: Float32Array,
  rate: number,
): Verdict {
  if (!guard.on || !guard.enrolment) return {ok: true, score: 1, needed: 0};
  try {
    return verify(guard.enrolment, printOf(samples, rate), guard.strictness);
  } catch {
    // A broken recording is not an impostor.
    return {ok: true, score: 1, needed: 0};
  }
}

export function keepUpWithSamples(
  guard: GuardState,
  samples: Float32Array,
  rate: number,
): void {
  if (!guard.on || !guard.enrolment) return;
  void keepUpWithPrint(guard, printOf(samples, rate)).catch(() => {});
}

export async function wasYou(guard: GuardState, audio: Blob): Promise<Verdict> {
  if (!guard.on || !guard.enrolment) return {ok: true, score: 1, needed: 0};
  try {
    return verify(guard.enrolment, await printFrom(audio), guard.strictness);
  } catch {
    // Undecodable audio is a broken recording, not an impostor.
    return {ok: true, score: 1, needed: 0};
  }
}
