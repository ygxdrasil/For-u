/**
 * The small sounds an instrument makes.
 *
 * Synthesised rather than loaded: three tones cost nothing to ship, work
 * offline, and can be tuned by changing a number instead of finding a new
 * file. Everything here is short, quiet, and low enough not to compete with
 * her voice.
 *
 * Browsers refuse audio until a real gesture has happened, which is fine —
 * these are all responses to gestures or to her, and a refused one simply
 * makes no sound rather than failing.
 */

let context: AudioContext | null = null;

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(hz: number, seconds: number, gain: number, type: OscillatorType = 'sine') {
  const audio = ensure();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const volume = audio.createGain();

  oscillator.type = type;
  oscillator.frequency.value = hz;

  // An abrupt start or stop is a click; the ramps are what make it a sound.
  const now = audio.currentTime;
  volume.gain.setValueAtTime(0, now);
  volume.gain.linearRampToValueAtTime(gain, now + 0.012);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + seconds);

  oscillator.connect(volume).connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + seconds + 0.02);
}

/** She has heard her name. Two notes, rising. */
export function chimeWake(): void {
  tone(660, 0.12, 0.05);
  window.setTimeout(() => tone(880, 0.16, 0.045), 90);
}

/** She has done something. One soft click. */
export function chimeAct(): void {
  tone(1320, 0.05, 0.02, 'triangle');
}

/** She has finished. One note, falling. */
export function chimeDone(): void {
  tone(520, 0.18, 0.035);
}
