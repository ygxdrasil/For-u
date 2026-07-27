import {Document} from './store/index';
import {BANDS, type Enrolment, type Strictness} from '../shared/voiceprint';

/**
 * Whose voice she answers to.
 *
 * The print itself is two dozen numbers describing the shape of a voice. It is
 * not a recording, nothing said is stored, and the numbers cannot be turned
 * back into audio — but it identifies a person, so it lives in the same
 * encrypted document layer as everything else she knows and is never handed to
 * anything outside this app.
 *
 * The comparison happens in the browser, on audio it already has. That is
 * partly speed and mostly restraint: sending every sound in the room to a
 * server to ask whether it was you would be a far worse bargain than the
 * problem it solves.
 */

export interface VoiceGuard {
  enrolment: Enrolment | null;
  /** Off by default. Enrolling does not silently start refusing people. */
  on: boolean;
  strictness: Strictness;
}

const EMPTY: VoiceGuard = {enrolment: null, on: false, strictness: 'normal'};

const store = new Document<VoiceGuard>('voiceguard', () => EMPTY);

export function voiceGuard(): Promise<VoiceGuard> {
  return store.read();
}

/** Numbers arriving from a browser, treated as untrusted until proven shaped. */
export function isEnrolment(value: unknown): value is Enrolment {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Enrolment>;
  const print = candidate.print;

  return (
    Boolean(print) &&
    Array.isArray(print?.bands) &&
    print.bands.length === BANDS &&
    print.bands.every((band) => typeof band === 'number' && Number.isFinite(band)) &&
    typeof print.pitch === 'number' &&
    Number.isFinite(print.pitch) &&
    typeof print.voiced === 'number' &&
    print.voiced > 0 &&
    typeof candidate.tightness === 'number' &&
    candidate.tightness > 0 &&
    candidate.tightness <= 1 &&
    typeof candidate.samples === 'number' &&
    candidate.samples > 0
  );
}

export async function enrol(enrolment: Enrolment): Promise<VoiceGuard> {
  const current = await store.read();
  const next: VoiceGuard = {
    ...current,
    enrolment: {...enrolment, at: new Date().toISOString()},
  };
  await store.write(next);
  return next;
}

export async function setGuard(patch: {
  on?: boolean;
  strictness?: Strictness;
}): Promise<VoiceGuard> {
  const current = await store.read();
  const next: VoiceGuard = {
    ...current,
    ...(patch.strictness ? {strictness: patch.strictness} : {}),
    // Refusing everyone because nothing is enrolled would be a lockout, so
    // turning it on without a print is quietly a no.
    ...(patch.on !== undefined ? {on: patch.on && Boolean(current.enrolment)} : {}),
  };
  await store.write(next);
  return next;
}

/**
 * Forget the voice, and stop guarding.
 *
 * The one place in this app where something really is removed rather than
 * filed. The standing instruction against deleting protects the user's
 * records; this is not a record of theirs, it is a measurement of their body,
 * and "you can take it back" has to mean it is gone.
 */
export async function forgetVoice(): Promise<VoiceGuard> {
  await store.write(EMPTY);
  return EMPTY;
}
