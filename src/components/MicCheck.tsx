import {useEffect, useRef, useState} from 'react';
import {transcribe} from '../lib/api';
import {toWav} from '../voice/wav';

const TEST_SECONDS = 4;

interface Finding {
  label: string;
  value: string;
  ok: boolean;
}

/**
 * Answers "why can't she hear me" without guesswork.
 *
 * Every line here is something that has actually caused silence: an insecure
 * connection, a browser with no recording support, a permission set to block,
 * no input device attached. Reading it beats another round of trial and error.
 */
export function MicCheck({onClose}: {onClose: () => void}) {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const playbackRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (playbackRef.current) URL.revokeObjectURL(playbackRef.current);
    },
    [],
  );

  /**
   * The whole chain, end to end, on demand: record, play it back so you can
   * hear for yourself whether anything was captured, then transcribe it. Far
   * more use than a list of capabilities when the complaint is "she can't
   * hear me".
   */
  const runTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);

      const recorded = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, {type: recorder.mimeType}));
      });

      recorder.start();
      setResult(`Recording for ${TEST_SECONDS} seconds — say something.`);
      await new Promise((r) => setTimeout(r, TEST_SECONDS * 1000));
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());

      const blob = await recorded;
      if (playbackRef.current) URL.revokeObjectURL(playbackRef.current);
      playbackRef.current = URL.createObjectURL(blob);

      setResult('Playing it back — if you hear nothing, the microphone captured nothing.');
      await new Audio(playbackRef.current).play().catch(() => {});

      const audio = await toWav(blob);
      const text = await transcribe(audio.base64, audio.mimeType);
      setResult(
        text
          ? `Heard: “${text}”  — hearing works.`
          : 'The recording arrived, but no words were made out. Try again louder, or closer.',
      );
    } catch (cause) {
      setResult(`Failed: ${(cause as Error).message}`);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const results: Finding[] = [];

      results.push({
        label: 'Secure connection',
        value: window.isSecureContext ? 'yes' : 'no — microphones are blocked without it',
        ok: window.isSecureContext,
      });

      const canRecord = Boolean(navigator.mediaDevices?.getUserMedia);
      results.push({
        label: 'Browser can record',
        value: canRecord ? 'yes' : 'no',
        ok: canRecord,
      });

      results.push({
        label: 'Recording format support',
        value: typeof MediaRecorder !== 'undefined' ? 'available' : 'missing',
        ok: typeof MediaRecorder !== 'undefined',
      });

      let permission = 'could not be read';
      let permissionOk = true;
      try {
        const status = await navigator.permissions?.query({
          name: 'microphone' as PermissionName,
        });
        if (status) {
          permission = status.state;
          permissionOk = status.state !== 'denied';
        }
      } catch {
        // Firefox and Safari don't expose this. Not a fault in itself.
      }
      results.push({label: 'Microphone permission', value: permission, ok: permissionOk});

      try {
        const devices = await navigator.mediaDevices?.enumerateDevices();
        const inputs = (devices ?? []).filter((d) => d.kind === 'audioinput');
        results.push({
          label: 'Microphones found',
          value: inputs.length === 0 ? 'none' : String(inputs.length),
          ok: inputs.length > 0,
        });
      } catch {
        results.push({label: 'Microphones found', value: 'could not check', ok: false});
      }

      const speech = Boolean(
        window.SpeechRecognition ?? window.webkitSpeechRecognition,
      );
      results.push({
        label: 'Wake word available',
        value: speech ? 'yes' : 'no — press Speak instead, which always works',
        ok: true,
      });

      if (!cancelled) setFindings(results);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="border-t border-edge/70 bg-surface/70 px-5 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-mist/60">
          Microphone check
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-mist transition hover:text-slate-200">
          Hide
        </button>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void runTest()}
          disabled={testing}
          className="rounded-full border border-ice/40 bg-ice/15 px-3 py-1.5 text-xs text-ice transition hover:bg-ice/25 disabled:opacity-40">
          {testing ? 'Testing…' : 'Test my microphone'}
        </button>
        {result && <span className="text-xs text-slate-300">{result}</span>}
      </div>

      {findings === null ? (
        <p className="text-xs text-mist/60">Checking…</p>
      ) : (
        <ul className="space-y-1">
          {findings.map((finding) => (
            <li key={finding.label} className="flex items-baseline gap-2 text-xs">
              <span className={finding.ok ? 'text-ice/80' : 'text-rose-300'}>
                {finding.ok ? '✓' : '✗'}
              </span>
              <span className="text-mist/70">{finding.label}:</span>
              <span className={finding.ok ? 'text-slate-300' : 'text-rose-300'}>
                {finding.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
