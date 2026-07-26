import {useEffect, useRef, useState} from 'react';
import {speak, transcribe} from '../lib/api';
import {toWav} from '../voice/wav';

const TEST_SECONDS = 4;

interface Finding {
  label: string;
  value: string;
  ok: boolean;
}

type Half = 'hearing' | 'voice';

/**
 * Answers "why can't she hear me" and "why won't she talk" without guesswork.
 *
 * Each test runs the real chain end to end rather than reporting capabilities,
 * because every one of these has been the culprit at some point: an insecure
 * connection, a permission set to block, no input device, a browser refusing to
 * play audio nobody asked for.
 */
export function VoiceCheck({onClose}: {onClose: () => void}) {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [running, setRunning] = useState<Half | null>(null);
  const [result, setResult] = useState<Record<Half, string | null>>({
    hearing: null,
    voice: null,
  });
  const playbackRef = useRef<string | null>(null);

  const report = (half: Half, message: string) =>
    setResult((current) => ({...current, [half]: message}));

  useEffect(
    () => () => {
      if (playbackRef.current) URL.revokeObjectURL(playbackRef.current);
    },
    [],
  );

  /** Record, play it back so you can hear whether anything was captured at
   * all, then transcribe it and show the words. */
  const testHearing = async () => {
    setRunning('hearing');
    report('hearing', `Recording for ${TEST_SECONDS} seconds — say something.`);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);

      const recorded = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, {type: recorder.mimeType}));
      });

      recorder.start();
      await new Promise((resolve) => setTimeout(resolve, TEST_SECONDS * 1000));
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());

      const blob = await recorded;
      if (playbackRef.current) URL.revokeObjectURL(playbackRef.current);
      playbackRef.current = URL.createObjectURL(blob);

      report('hearing', 'Playing it back — silence here means nothing was captured.');
      await new Audio(playbackRef.current).play().catch(() => {});

      const audio = await toWav(blob);
      const text = await transcribe(audio.base64, audio.mimeType);
      report(
        'hearing',
        text
          ? `Heard: “${text}” — hearing works.`
          : 'The recording arrived, but no words were made out. Try again louder, or closer.',
      );
    } catch (cause) {
      report('hearing', `Failed: ${(cause as Error).message}`);
    } finally {
      setRunning(null);
    }
  };

  /** Generate a line of her real voice and play it. */
  const testVoice = async () => {
    setRunning('voice');
    report('voice', 'Asking for a line in her voice…');

    try {
      const spoken = await speak('Hearing me clearly? Good. Everything works.');
      const binary = atob(spoken.audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], {type: spoken.mimeType}));

      const element = new Audio(url);
      report('voice', 'Playing…');
      await element.play();
      await new Promise<void>((resolve) => {
        element.onended = () => resolve();
        element.onerror = () => resolve();
      });
      URL.revokeObjectURL(url);
      report('voice', 'Spoke that aloud. If you heard nothing, check the volume.');
    } catch (cause) {
      const message = (cause as Error).message;
      report(
        'voice',
        (cause as Error).name === 'NotAllowedError'
          ? 'The browser blocked the audio. Tap the page once, then try again.'
          : `Failed: ${message}`,
      );
    } finally {
      setRunning(null);
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
        const inputs = (devices ?? []).filter((device) => device.kind === 'audioinput');
        results.push({
          label: 'Microphones found',
          value: inputs.length === 0 ? 'none' : String(inputs.length),
          ok: inputs.length > 0,
        });
      } catch {
        results.push({label: 'Microphones found', value: 'could not check', ok: false});
      }

      const wake = Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
      results.push({
        label: 'Wake word available',
        value: wake ? 'yes' : 'no — press Speak instead, which always works',
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-mist/60">
          Sound check
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-mist transition hover:text-slate-200">
          Hide
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        {(
          [
            ['hearing', 'Test her hearing', testHearing],
            ['voice', 'Test her voice', testVoice],
          ] as const
        ).map(([half, label, run]) => (
          <div key={half}>
            <button
              type="button"
              onClick={() => void run()}
              disabled={running !== null}
              className="w-full rounded-lg border border-ice/40 bg-ice/15 px-3 py-2 text-sm text-ice transition hover:bg-ice/25 disabled:opacity-40">
              {running === half ? 'Testing…' : label}
            </button>
            {result[half] && (
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {result[half]}
              </p>
            )}
          </div>
        ))}
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
