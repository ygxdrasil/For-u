/**
 * Does the speaker check actually separate two voices?
 *
 * Run on its own during development — the self-test calls the same assertions.
 * Synthetic voices rather than recordings: a real one would mean committing
 * audio of someone to the repository, and a synthesised vowel with a known
 * fundamental and known formants is a far better test anyway, because when it
 * fails you know exactly which property it failed on.
 */

import assertions from 'node:assert/strict';
import {
  combine,
  printOf,
  STRICTNESS,
  tightnessOf,
  verify,
  type Enrolment,
} from '../shared/voiceprint';

const RATE = 16_000;

/**
 * A second of a sung vowel.
 *
 * A glottal source is a buzz rich in harmonics, shaped by resonances in the
 * throat and mouth — the formants — which are what make one person's "ah"
 * sound unlike another's at the same pitch. So: harmonics of the fundamental,
 * each weighted by how close it sits to one of three formants.
 */
export function vowel(
  fundamental: number,
  formants: [number, number, number],
  seconds = 1.2,
): Float32Array {
  const samples = new Float32Array(Math.floor(RATE * seconds));

  for (let i = 0; i < samples.length; i += 1) {
    const t = i / RATE;
    let value = 0;

    for (let harmonic = 1; harmonic * fundamental < 5000; harmonic += 1) {
      const hz = harmonic * fundamental;
      // Resonance: each formant lifts the harmonics near it and leaves the
      // rest alone. Plus the natural roll-off of a glottal source.
      let gain = 0.08 / harmonic;
      for (const formant of formants) {
        const width = formant * 0.18;
        gain += (0.9 / harmonic ** 0.5) * Math.exp(-(((hz - formant) / width) ** 2));
      }
      value += gain * Math.sin(2 * Math.PI * hz * t);
    }

    // A slow envelope, so it is speech-shaped rather than a test tone.
    samples[i] = value * 0.25 * (0.75 + 0.25 * Math.sin(2 * Math.PI * 3 * t));
  }

  return samples;
}

/** Deterministic noise, so a run that passes passes for everyone. */
function scramble(samples: Float32Array, amount: number, seed = 1): Float32Array {
  const out = new Float32Array(samples.length);
  let state = seed;
  for (let i = 0; i < samples.length; i += 1) {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    out[i] = samples[i] + ((state / 4_294_967_296) * 2 - 1) * amount;
  }
  return out;
}

export function voiceChecks(assert: typeof import('node:assert/strict')) {
  // Three takes of the same voice, as an enrolment would be: the same person,
  // never identical twice. Every probe below carries the same amount of noise,
  // so what is being compared is the voice and not the recording quality.
  const takes = [
    printOf(scramble(vowel(118, [700, 1200, 2500]), 0.01, 3), RATE),
    printOf(scramble(vowel(122, [690, 1220, 2450]), 0.01, 7), RATE),
    printOf(scramble(vowel(115, [710, 1180, 2550]), 0.01, 99), RATE),
  ];
  const print = combine(takes);
  const mine: Enrolment = {
    print,
    samples: takes.length,
    tightness: tightnessOf(takes, print),
    at: '2026-01-01T00:00:00.000Z',
  };

  const probe = (fundamental: number, formants: [number, number, number], seed: number) =>
    printOf(scramble(vowel(fundamental, formants), 0.01, seed), RATE);

  // Me again, on another day.
  const meAgain = verify(mine, probe(120, [705, 1210, 2480], 31));
  // Someone else in the room: higher voice, different mouth.
  const other = verify(mine, probe(210, [520, 1900, 2900], 53));
  // And someone in roughly my register — the hard case, and the one worth
  // being honest about. This is where a cheap check earns or loses.
  const nearby = verify(mine, probe(132, [560, 1650, 2700], 71));

  assert.ok(mine.tightness > 0.8, 'takes of one voice should agree closely');
  assert.ok(
    meAgain.ok,
    `my own voice should pass, scored ${meAgain.score.toFixed(2)} against ${meAgain.needed.toFixed(2)}`,
  );
  assert.equal(other.ok, false, `a different voice must not pass (${other.score.toFixed(2)})`);
  assert.equal(nearby.ok, false, `nor one in my register (${nearby.score.toFixed(2)})`);
  assert.ok(
    meAgain.score - nearby.score > 0.15,
    `the gap should be decisive, was ${(meAgain.score - nearby.score).toFixed(2)}`,
  );

  // Strictness has to actually mean something, in the right direction.
  assert.ok(
    verify(mine, probe(132, [560, 1650, 2700], 71), 'lenient').score ===
      nearby.score,
    'strictness changes the bar, never the score',
  );
  assert.ok(
    verify(mine, probe(120, [705, 1210, 2480], 31), 'strict').needed >
      verify(mine, probe(120, [705, 1210, 2480], 31), 'lenient').needed,
    'strict must demand more than lenient',
  );

  // Silence is not a voice, and must never match — otherwise a quiet room
  // is indistinguishable from you speaking.
  const nothing = printOf(new Float32Array(RATE), RATE);
  assert.equal(nothing.voiced, 0);
  assert.equal(verify(mine, nothing).ok, false, 'silence must never match anyone');

  // And with nothing enrolled she answers everybody, rather than nobody. A
  // failure here would lock the owner out of their own assistant.
  assert.equal(verify(null, probe(210, [520, 1900, 2900], 53)).ok, true);

  return {
    tightness: mine.tightness,
    mineScore: meAgain.score,
    otherScore: other.score,
    similarScore: nearby.score,
    needed: meAgain.needed,
  };
}

// Run directly for a readable report while tuning.
if (process.argv[1]?.endsWith('voicecheck.ts')) {
  const scores = voiceChecks(assertions);
  console.log('\n  enrolment tightness :', scores.tightness.toFixed(3));
  console.log('  bar to clear        :', scores.needed.toFixed(3));
  console.log('\n  me, another day :', scores.mineScore.toFixed(3));
  console.log('  a nearby voice  :', scores.similarScore.toFixed(3));
  console.log('  someone else    :', scores.otherScore.toFixed(3));
  console.log('\n  thresholds      :', STRICTNESS, '\n');
}
