import {Check, Fingerprint, Mic, Trash2} from 'lucide-react';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {Strictness} from '../../shared/voiceprint';
import {acquire, MicError, type MicLease} from '../voice/mic';
import {enrolmentFrom, type GuardState} from '../voice/voiceprint';

/**
 * Teaching her your voice, and deciding how sure she has to be.
 *
 * Three takes rather than one, and they matter for two separate reasons. Any
 * single recording carries the room and the moment as much as it carries you,
 * so averaging three is what makes the print about the speaker. And the
 * *disagreement* between them is what sets the bar afterwards — how alike your
 * own takes were, in your room, on your microphone, is the only honest
 * yardstick for how alike someone else's has to be. A fixed number tuned
 * anywhere else would either lock you out or let the room in.
 */

/**
 * Five phrases, chosen for coverage rather than for meaning.
 *
 * Between them they run through the vowels a voice actually differs on — the
 * open ones, the close ones, the rounded ones — and each ends up long enough
 * to hold four or five seconds of real speech. The old three were short and
 * sounded alike, which produced a print that described one narrow way of
 * talking and then refused every other way, including the owner's.
 *
 * The last one is deliberately awkward to say. Speaking carefully and speaking
 * naturally are different voices, and a print built only from careful speech
 * will not know you when you are being ordinary.
 */
const PHRASES = [
  'Grace, are you listening to me right now',
  'What have I got on today, and is any of it urgent',
  'Put the kettle on and tell me the news from this morning',
  'Turn the lights down low, it is getting late here',
  'Honestly, I have no idea where I put those keys again',
];

const TAKE_SECONDS = 6;

const STRICTNESS_SAYS: {id: Strictness; label: string; blurb: string}[] = [
  {id: 'lenient', label: 'Forgiving', blurb: 'Rarely refuses you. May answer someone similar'},
  {id: 'normal', label: 'Balanced', blurb: 'What most people want'},
  {id: 'strict', label: 'Strict', blurb: 'Only you. Will refuse you with a cold'},
];

interface Props {
  guard: GuardState | null;
  deviceId: string | undefined;
  onSave: (patch: {enrolment?: unknown; on?: boolean; strictness?: Strictness}) => Promise<void>;
  onForget: () => Promise<void>;
  onClose: () => void;
}

export function VoiceLock({guard, deviceId, onSave, onForget, onClose}: Props) {
  const [takes, setTakes] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  /** Re-recording over an existing print, which is otherwise indistinguishable
      from having none. */
  const [redo, setRedo] = useState(false);
  const leaseRef = useRef<MicLease | null>(null);

  useEffect(() => () => leaseRef.current?.release(), []);

  const recordOne = useCallback(async () => {
    if (recording) return;
    setError(null);
    setRecording(true);

    let lease: MicLease;
    try {
      lease = await acquire(deviceId);
    } catch (cause) {
      setRecording(false);
      setError(cause instanceof MicError ? cause.message : (cause as Error).message);
      return;
    }
    leaseRef.current = lease;

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(lease.stream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      lease.release();
      leaseRef.current = null;
      setRecording(false);
      setCountdown(0);
      const blob = new Blob(chunks, {type: recorder.mimeType || 'audio/webm'});
      if (blob.size > 0) setTakes((current) => [...current, blob]);
    };

    recorder.start();
    setCountdown(TAKE_SECONDS);
    const tick = window.setInterval(() => setCountdown((left) => left - 1), 1000);
    window.setTimeout(() => {
      window.clearInterval(tick);
      if (recorder.state !== 'inactive') recorder.stop();
    }, TAKE_SECONDS * 1000);
  }, [deviceId, recording]);

  const finish = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const enrolment = await enrolmentFrom(takes);
      if (!enrolment) {
        setError(
          'Those takes had too little speech in them to tell your voice from anything. Try again, closer to the microphone.',
        );
        return;
      }
      if (enrolment.tightness < 0.5) {
        setError(
          'Those three did not sound enough like each other to be a useful print — usually background noise. Somewhere quieter, and say the whole phrase each time.',
        );
        return;
      }
      await onSave({enrolment, on: true});
      setTakes([]);
      setRedo(false);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setSaving(false);
    }
  }, [onSave, takes]);

  const enrolled = guard?.enrolment ?? null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-void/85 p-4 backdrop-blur">
      <div className="glass w-full max-w-md p-5">
        <div className="mb-3 flex items-center gap-2">
          <Fingerprint size={16} className="accent" />
          <h2 className="text-sm text-slate-100">Only answer to me</h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xs text-mist/60 hover:text-slate-200">
            Close
          </button>
        </div>

        {enrolled && !redo ? (
          <>
            <p className="flex items-center gap-2 rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs text-slate-300">
              <Check size={12} className="accent shrink-0" />
              She knows your voice — taken from {enrolled.samples} recordings on{' '}
              {new Date(enrolled.at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
              })}
              .
            </p>

            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={guard?.on ?? false}
                onChange={(event) => void onSave({on: event.target.checked})}
                className="accent-violet-400"
              />
              Ignore voices that are not mine
            </label>

            <div className="mt-3">
              <p className="label mb-1.5">How sure she has to be</p>
              <div className="grid grid-cols-3 gap-1.5">
                {STRICTNESS_SAYS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    title={option.blurb}
                    onClick={() => void onSave({strictness: option.id})}
                    aria-pressed={guard?.strictness === option.id}
                    className={`rounded-lg border px-2 py-2 text-left transition ${
                      guard?.strictness === option.id
                        ? 'border-ice/40 bg-ice/15 text-ice'
                        : 'border-edge bg-surface/40 text-mist hover:border-ice/30'
                    }`}>
                    <span className="block text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTakes([]);
                  setRedo(true);
                }}
                className="rounded-full border border-ice/40 bg-ice/15 px-3 py-1 text-xs text-ice hover:bg-ice/25">
                Record again
              </button>
              <button
                type="button"
                onClick={() => void onForget()}
                className="ml-auto flex items-center gap-1.5 rounded-full border border-edge px-3 py-1 text-xs text-mist hover:border-rose-400/40 hover:text-rose-300">
                <Trash2 size={11} /> Forget my voice
              </button>
            </div>

            {/* The one thing in this app that is genuinely erased rather than
                filed, and it should say so plainly, because a promise that you
                can take it back has to actually mean gone. */}
            <p className="mt-2 text-[0.65rem] leading-relaxed text-mist/45">
              Forgetting removes the print entirely and stops the guard. Nothing you
              said was ever stored — only two dozen numbers describing the shape of
              your voice, which cannot be turned back into sound.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs leading-relaxed text-mist/75">
              Say each line out loud, in your ordinary voice, from where you normally
              sit. Five of them, six seconds each — and don’t try to sound the same
              every time. How much your voice moves is exactly what sets how much
              movement she allows, so a careful, identical reading is what makes her
              refuse you on an ordinary day.
            </p>

            <ol className="mt-3 space-y-1.5">
              {PHRASES.map((phrase, index) => {
                const done = index < takes.length;
                const now = index === takes.length;
                return (
                  <li
                    key={phrase}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                      done
                        ? 'border-ice/30 bg-ice/10 text-ice'
                        : now
                          ? 'border-edge bg-surface/40 text-slate-200'
                          : 'border-edge/50 bg-surface/20 text-mist/45'
                    }`}>
                    {done ? <Check size={12} /> : <Mic size={12} />}
                    <span className="flex-1">“{phrase}”</span>
                  </li>
                );
              })}
            </ol>

            {takes.length < PHRASES.length ? (
              <button
                type="button"
                onClick={() => void recordOne()}
                disabled={recording}
                className="mt-3 w-full rounded-full border border-ice/40 bg-ice/15 px-3 py-2 text-xs text-ice transition hover:bg-ice/25 disabled:opacity-50">
                {recording
                  ? `Listening… ${countdown}`
                  : `Record take ${takes.length + 1} of ${PHRASES.length}`}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void finish()}
                disabled={saving}
                className="mt-3 w-full rounded-full border border-ice/40 bg-ice/25 px-3 py-2 text-xs text-ice transition hover:bg-ice/35 disabled:opacity-50">
                {saving ? 'Working it out…' : 'Teach her my voice'}
              </button>
            )}

            {takes.length > 0 && !recording && (
              <button
                type="button"
                onClick={() => setTakes([])}
                className="mt-2 w-full text-[0.65rem] text-mist/50 hover:text-mist">
                Start over
              </button>
            )}
          </>
        )}

        {error && (
          <p className="mt-3 rounded-lg border border-ember/25 bg-ember/10 px-3 py-2 text-xs leading-relaxed text-ember/90">
            {error}
          </p>
        )}

        {/* Said here rather than in a footnote, because overselling this is the
            one way it could actually do harm. */}
        <p className="mt-3 border-t border-edge/60 pt-3 text-[0.65rem] leading-relaxed text-mist/45">
          This is a doorbell that knows your footsteps, not a fingerprint reader. It
          keeps out the television and most other people in the room. It will not stop
          someone deliberately imitating you, or a recording of you — so it guards who
          she listens to, and never what the password protects.
        </p>
      </div>
    </div>
  );
}
