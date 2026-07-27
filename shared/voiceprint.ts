/**
 * Telling your voice from anyone else's.
 *
 * What this is: a cheap, honest speaker check that runs entirely in the
 * browser, on audio she has already recorded, costing nothing and sending
 * nothing anywhere. It compares the shape of a voice — where its energy sits
 * across the spectrum, and how low or high it is — against a print taken from
 * you when you enrolled.
 *
 * What this is not, and must never be sold as: Face ID. Real speaker
 * verification uses a neural embedding trained on thousands of speakers, and
 * that means either a model download of tens of megabytes or a paid API, and
 * neither fits a thing running on ten dollars a month. This is closer to
 * recognising someone by their footsteps: it reliably tells you apart from a
 * television, from a housemate whose voice sits elsewhere, and from most people
 * who happen to be in the room. It will not stop somebody deliberately
 * imitating you, and it will not stop a recording of you.
 *
 * That is still worth having, because the actual problem is not an impostor —
 * it is the television saying her name, and the other person in the room being
 * answered as though they were you.
 *
 * Everything here is pure and dependency-free so the self-test can prove it
 * separates two voices rather than taking it on faith.
 */

/** How many mel-spaced bands the spectrum is reduced to. */
export const BANDS = 24;

export interface Voiceprint {
  /** Mean log energy per mel band, mean-normalised. The timbre of the voice. */
  bands: number[];
  /** Median fundamental frequency in Hz. The single strongest cheap feature. */
  pitch: number;
  /** How much of the sample was actually voiced, 0 to 1. Quality, not identity. */
  voiced: number;
}

export interface Enrolment {
  print: Voiceprint;
  /** How many samples went into it. More is steadier. */
  samples: number;
  /**
   * How closely your own takes agreed with each other, 0 to 1.
   *
   * This is what makes a fixed threshold unnecessary, and fixed thresholds are
   * the reason cheap voice checks are usually useless. What counts as a high
   * score depends entirely on the microphone, the room and the person — a
   * number tuned on one setup rejects the owner on another. Measuring the
   * spread of your own enrolment takes gives a baseline in your conditions,
   * and everything after is judged as a fraction of it.
   */
  tightness: number;
  at: string;
}

/* ------------------------------------------------------------------------ */
/* Signal handling                                                           */
/* ------------------------------------------------------------------------ */

/**
 * Radix-2 FFT, in place, on separate real and imaginary arrays.
 *
 * Written out rather than pulled in: this is the only transform needed
 * anywhere, a dependency would be shipped to the browser for it, and the
 * algorithm has not changed since 1965.
 */
function fft(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  if (n <= 1) return;

  // Bit reversal.
  for (let i = 1, j = 0; i < n; i += 1) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const angle = (-2 * Math.PI) / len;
    const wReal = Math.cos(angle);
    const wImag = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let curReal = 1;
      let curImag = 0;
      for (let j = 0; j < len / 2; j += 1) {
        const aReal = real[i + j];
        const aImag = imag[i + j];
        const bReal = real[i + j + len / 2] * curReal - imag[i + j + len / 2] * curImag;
        const bImag = real[i + j + len / 2] * curImag + imag[i + j + len / 2] * curReal;

        real[i + j] = aReal + bReal;
        imag[i + j] = aImag + bImag;
        real[i + j + len / 2] = aReal - bReal;
        imag[i + j + len / 2] = aImag - bImag;

        const nextReal = curReal * wReal - curImag * wImag;
        curImag = curReal * wImag + curImag * wReal;
        curReal = nextReal;
      }
    }
  }
}

const melOf = (hz: number) => 2595 * Math.log10(1 + hz / 700);
const hzOf = (mel: number) => 700 * (10 ** (mel / 2595) - 1);

/**
 * Edges of the mel filterbank.
 *
 * Mel spacing rather than linear because that is how hearing works and, more
 * to the point here, because it puts most of the resolution where a voice
 * actually differs from another voice — the low formants — instead of spending
 * half the vector on sibilance.
 */
function melEdges(low: number, high: number, count: number): number[] {
  const lowMel = melOf(low);
  const highMel = melOf(high);
  const edges: number[] = [];
  for (let i = 0; i <= count + 1; i += 1) {
    edges.push(hzOf(lowMel + ((highMel - lowMel) * i) / (count + 1)));
  }
  return edges;
}

/**
 * Fundamental frequency of one frame, by autocorrelation.
 *
 * Bounded to 60–400Hz, which spans essentially every adult speaking voice and
 * excludes both the mains hum below it and the harmonics above. Returns 0 when
 * the frame has no clear period — silence, a consonant, a door closing.
 */
function pitchOf(frame: Float32Array, rate: number): number {
  const minLag = Math.floor(rate / 400);
  const maxLag = Math.floor(rate / 60);
  if (maxLag >= frame.length) return 0;

  let bestLag = 0;
  let best = 0;
  let energy = 0;
  for (const sample of frame) energy += sample * sample;
  if (energy < 1e-6) return 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let sum = 0;
    for (let i = 0; i < frame.length - lag; i += 1) sum += frame[i] * frame[i + lag];
    const score = sum / (frame.length - lag);
    if (score > best) {
      best = score;
      bestLag = lag;
    }
  }

  // A weak peak means the frame was not periodic, whatever the best lag was.
  if (bestLag === 0 || best < energy / frame.length * 0.3) return 0;
  return rate / bestLag;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/* ------------------------------------------------------------------------ */
/* The print                                                                 */
/* ------------------------------------------------------------------------ */

const FRAME = 1024;
const HOP = 512;

/**
 * Reduce a piece of speech to a print.
 *
 * Only frames with enough energy count, so silence between words does not
 * dilute the answer towards the shape of the room. The band vector then has its
 * own mean subtracted, which is the standard trick for cancelling out whatever
 * the microphone and the room did to the sound: a different mic changes every
 * band by roughly the same amount, and subtracting the mean removes exactly
 * that. Without it, the same person on a headset and on a laptop mic look like
 * two different people.
 */
export function printOf(samples: Float32Array, rate: number): Voiceprint {
  const edges = melEdges(80, Math.min(8000, rate / 2 - 100), BANDS);
  const totals = new Array<number>(BANDS).fill(0);
  const pitches: number[] = [];

  let frames = 0;
  let loudFrames = 0;

  const real = new Float32Array(FRAME);
  const imag = new Float32Array(FRAME);
  const magnitude = new Float32Array(FRAME / 2);

  for (let start = 0; start + FRAME <= samples.length; start += HOP) {
    frames += 1;
    const frame = samples.subarray(start, start + FRAME);

    let energy = 0;
    for (const sample of frame) energy += sample * sample;
    const rms = Math.sqrt(energy / FRAME);
    if (rms < 0.008) continue;
    loudFrames += 1;

    // Hann window, or the frame edges ring across the whole spectrum.
    for (let i = 0; i < FRAME; i += 1) {
      real[i] = frame[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FRAME - 1)));
      imag[i] = 0;
    }
    fft(real, imag);

    for (let i = 0; i < FRAME / 2; i += 1) {
      magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
    }

    // Triangular filters, as the filterbank has been built since the 1980s.
    for (let band = 0; band < BANDS; band += 1) {
      const low = edges[band];
      const centre = edges[band + 1];
      const high = edges[band + 2];
      let sum = 0;
      for (let bin = 0; bin < FRAME / 2; bin += 1) {
        const hz = (bin * rate) / FRAME;
        if (hz <= low || hz >= high) continue;
        const weight =
          hz <= centre ? (hz - low) / (centre - low) : (high - hz) / (high - centre);
        sum += magnitude[bin] * weight;
      }
      totals[band] += Math.log(sum + 1e-8);
    }

    const pitch = pitchOf(frame, rate);
    if (pitch > 0) pitches.push(pitch);
  }

  if (loudFrames === 0) {
    return {bands: new Array<number>(BANDS).fill(0), pitch: 0, voiced: 0};
  }

  const bands = totals.map((total) => total / loudFrames);
  const mean = bands.reduce((sum, value) => sum + value, 0) / BANDS;

  return {
    bands: bands.map((value) => value - mean),
    pitch: median(pitches),
    voiced: frames > 0 ? loudFrames / frames : 0,
  };
}

/** Average several prints into one, which is what enrolling actually is. */
export function combine(prints: Voiceprint[]): Voiceprint {
  const usable = prints.filter((print) => print.voiced > 0);
  if (usable.length === 0) {
    return {bands: new Array<number>(BANDS).fill(0), pitch: 0, voiced: 0};
  }

  const bands = new Array<number>(BANDS).fill(0);
  for (const print of usable) {
    for (let i = 0; i < BANDS; i += 1) bands[i] += print.bands[i] / usable.length;
  }

  return {
    bands,
    // Median rather than mean: one sample where the pitch tracker latched onto
    // a harmonic should not drag the whole enrolment an octave up.
    pitch: median(usable.map((print) => print.pitch).filter((hz) => hz > 0)),
    voiced: usable.reduce((sum, print) => sum + print.voiced, 0) / usable.length,
  };
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let leftSize = 0;
  let rightSize = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    leftSize += a[i] * a[i];
    rightSize += b[i] * b[i];
  }
  if (leftSize === 0 || rightSize === 0) return 0;
  return dot / Math.sqrt(leftSize * rightSize);
}

/**
 * How much this sounds like the enrolled voice, from 0 to 1.
 *
 * Two thirds timbre, one third pitch. Pitch alone is far too crude — it would
 * hand the house to anyone in the same register — and timbre alone is
 * surprisingly forgiving between voices of different registers, so the
 * combination separates far better than either.
 *
 * Pitch distance is measured in octaves rather than hertz. Thirty hertz is an
 * enormous difference at the bottom of a voice and nothing at the top, and
 * treating those the same is how a scorer ends up biased by register.
 */
export function similarity(enrolled: Voiceprint, heard: Voiceprint): number {
  if (enrolled.voiced === 0 || heard.voiced === 0) return 0;

  /*
   * Every human voice is broadly voice-shaped, so cosine between any two of
   * them lands somewhere above 0.9 and all the information lives in the last
   * few percent. Read raw, two strangers score 0.95 and look like a match.
   * Stretching the top of the range is what turns a number that is technically
   * correct into one that can be thresholded.
   */
  const raw = cosine(enrolled.bands, heard.bands);
  const timbre = Math.min(1, Math.max(0, (raw - 0.85) / 0.15));

  let pitch = 0.5;
  if (enrolled.pitch > 0 && heard.pitch > 0) {
    const octaves = Math.abs(Math.log2(heard.pitch / enrolled.pitch));
    // A quarter of an octave apart is a different person far more often than
    // it is you with a cold, which is where the falloff is centred.
    pitch = Math.max(0, 1 - octaves / 0.5);
  }

  return timbre * 0.65 + pitch * 0.35;
}

/**
 * How sure she has to be, as a fraction of how consistent you were.
 *
 * Not absolute scores. An absolute threshold is the mistake that makes these
 * things either useless or infuriating, because the number that works on a
 * headset in a quiet room locks you out on a laptop in a kitchen. These are
 * multipliers on your own enrolment tightness, so they mean the same thing
 * everywhere: "as like you as your own takes were", give or take.
 *
 * Deliberately not shown as numbers either. "0.88" means nothing to anyone;
 * "she occasionally answers someone else" is a decision a person can make.
 */
export const STRICTNESS = {
  lenient: 0.78,
  normal: 0.88,
  strict: 0.94,
} as const;

export type Strictness = keyof typeof STRICTNESS;

/** How alike your own enrolment takes were. The baseline everything else uses. */
export function tightnessOf(prints: Voiceprint[], combined: Voiceprint): number {
  const usable = prints.filter((print) => print.voiced > 0);
  if (usable.length === 0) return 0;
  const scores = usable.map((print) => similarity(combined, print));
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export interface Verdict {
  ok: boolean;
  score: number;
  /** What it had to beat, so the interface can be specific rather than coy. */
  needed: number;
}

/**
 * Is this you?
 *
 * Never answers yes to silence, and never answers yes when there is nothing
 * enrolled to compare against — an unenrolled account should fall back to
 * answering everyone, not to answering no one.
 */
export function verify(
  enrolment: Enrolment | null,
  heard: Voiceprint,
  strictness: Strictness = 'normal',
): Verdict {
  if (!enrolment || enrolment.tightness <= 0) return {ok: true, score: 1, needed: 0};

  const needed = enrolment.tightness * STRICTNESS[strictness];
  const score = similarity(enrolment.print, heard);
  return {ok: score >= needed, score, needed};
}
