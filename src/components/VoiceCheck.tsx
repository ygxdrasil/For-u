import {useCallback, useEffect, useRef, useState} from 'react';
import {speak, transcribe, webCheck} from '../lib/api';
import {
  acquire,
  diagnostics,
  listDevices,
  MicError,
  type MicDevice,
  type MicLease,
} from '../voice/mic';
import {toWav} from '../voice/wav';

const TEST_SECONDS = 4;

interface Finding {
  label: string;
  value: string;
  ok: boolean;
}

type Half = 'hearing' | 'voice';

interface VoiceCheckProps {
  onClose: () => void;
  deviceId: string | undefined;
  onPickDevice: (deviceId: string | undefined) => void;
}

/**
 * Answers "why can't she hear me" and "why won't she talk" without guesswork.
 *
 * The live level meter is the centrepiece. Every other reading here is a
 * capability check, and capability checks have never once found the real
 * problem — whereas a bar that does not move while you talk identifies it in a
 * second, and a bar that does move rules the microphone out entirely.
 */
export function VoiceCheck({onClose, deviceId, onPickDevice}: VoiceCheckProps) {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [devices, setDevices] = useState<MicDevice[]>([]);
  const [running, setRunning] = useState<Half | null>(null);
  const [result, setResult] = useState<Record<Half, string | null>>({
    hearing: null,
    voice: null,
  });

  const [monitoring, setMonitoring] = useState(false);
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [monitorError, setMonitorError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [web, setWeb] = useState<string | null>(null);

  const leaseRef = useRef<MicLease | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const playbackRef = useRef<string | null>(null);

  const report = (half: Half, message: string) =>
    setResult((current) => ({...current, [half]: message}));

  const stopMonitor = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current ?? 0);
    void contextRef.current?.close().catch(() => {});
    contextRef.current = null;
    leaseRef.current?.release();
    leaseRef.current = null;
    setMonitoring(false);
    setLevel(0);
  }, []);

  useEffect(
    () => () => {
      stopMonitor();
      if (playbackRef.current) URL.revokeObjectURL(playbackRef.current);
    },
    [stopMonitor],
  );

  /** Open the microphone and just show what is arriving, continuously. */
  const startMonitor = useCallback(async () => {
    setMonitorError(null);
    setPeak(0);

    try {
      const lease = await acquire(deviceId);
      leaseRef.current = lease;

      const context = new AudioContext();
      contextRef.current = context;
      if (context.state === 'suspended') await context.resume();

      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(lease.stream).connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);

      setMonitoring(true);
      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let loudest = 0;
        for (const sample of samples) {
          loudest = Math.max(loudest, Math.abs(sample - 128) / 128);
        }
        setLevel(loudest);
        setPeak((highest) => Math.max(highest, loudest));
        frameRef.current = window.requestAnimationFrame(tick);
      };
      tick();

      // Refresh labels: they are blank until permission has been granted once.
      setDevices(await listDevices());
    } catch (cause) {
      stopMonitor();
      setMonitorError(
        cause instanceof MicError ? cause.message : (cause as Error).message,
      );
    }
  }, [deviceId, stopMonitor]);

  /** Record, play it back, then transcribe it and show the words. */
  const testHearing = async () => {
    setRunning('hearing');
    report('hearing', `Recording for ${TEST_SECONDS} seconds — say something.`);
    stopMonitor();

    let lease: MicLease | null = null;
    try {
      lease = await acquire(deviceId);
      const recorder = new MediaRecorder(lease.stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);

      const recorded = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, {type: recorder.mimeType}));
      });

      recorder.start();
      await new Promise((resolve) => setTimeout(resolve, TEST_SECONDS * 1000));
      recorder.stop();

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
      report(
        'hearing',
        cause instanceof MicError ? cause.message : `Failed: ${(cause as Error).message}`,
      );
    } finally {
      lease?.release();
      setRunning(null);
    }
  };

  /** Generate a line in her real voice and play it. */
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
      const failure = cause as Error & {detail?: string};
      report(
        'voice',
        failure.name === 'NotAllowedError'
          ? 'The browser blocked the audio. Tap the page once, then try again.'
          : `Failed: ${failure.message}${failure.detail ? ` — ${failure.detail}` : ''}`,
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

      let permission = 'not reported by this browser';
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

      const found = await listDevices().catch(() => []);
      if (!cancelled) setDevices(found);
      results.push({
        label: 'Microphones found',
        value: found.length === 0 ? 'none' : String(found.length),
        ok: found.length > 0,
      });

      results.push({
        label: 'Always-on listening',
        value: canRecord
          ? 'available — turn on the microphone to say “Grace”'
          : 'needs a working microphone',
        ok: canRecord,
      });

      if (!cancelled) setFindings(results);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const verdict =
    peak > 0.15
      ? {text: 'Sound is definitely reaching her.', tone: 'text-ice'}
      : peak > 0.02
        ? {text: 'Something is arriving, but it is very quiet.', tone: 'text-amber-300'}
        : {text: 'Nothing at all is arriving from this microphone.', tone: 'text-rose-300'};

  return (
    <div className="max-h-[65vh] overflow-y-auto border-t border-edge/70 bg-surface/80 px-5 py-4">
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

      {/* The live meter. Everything else on this panel is secondary to it. */}
      <div className="mb-4 rounded-xl border border-edge/70 bg-black/20 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-300">Live microphone level</span>
          <button
            type="button"
            onClick={() => (monitoring ? stopMonitor() : void startMonitor())}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              monitoring
                ? 'border-ice/50 bg-ice/20 text-ice'
                : 'border-edge bg-surface text-mist hover:text-slate-200'
            }`}>
            {monitoring ? 'Stop' : 'Start listening'}
          </button>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-edge">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ice/60 to-ice transition-[width] duration-75"
            style={{width: `${Math.min(100, level * 180)}%`}}
          />
        </div>

        {monitoring && (
          <p className={`mt-2 text-xs ${verdict.tone}`}>
            {verdict.text} Talk normally — the bar should jump.
          </p>
        )}
        {monitorError && <p className="mt-2 text-xs text-rose-300">{monitorError}</p>}
      </div>

      {devices.length > 0 && (
        <label className="mb-4 block">
          <span className="mb-1 block text-[0.62rem] uppercase tracking-[0.12em] text-mist/50">
            Which microphone
          </span>
          <select
            value={deviceId ?? ''}
            onChange={(event) => {
              stopMonitor();
              onPickDevice(event.target.value || undefined);
            }}
            className="w-full rounded-lg border border-edge bg-surface px-3 py-2 text-xs text-slate-200 focus:border-ice/40 focus:outline-none">
            <option value="">System default</option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
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

      {/* Whether she can reach the web, and whether she bothers to. */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            setWeb('Asking her to look something up…');
            void webCheck().then(
              (result) => setWeb(JSON.stringify(result, null, 2)),
              (cause: Error) => setWeb(`Failed: ${cause.message}`),
            );
          }}
          className="w-full rounded-lg border border-edge bg-surface px-3 py-2 text-xs text-mist transition hover:border-ice/40 hover:text-ice">
          Test the web
        </button>
        {web && (
          <pre className="scroll-thin mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-edge/70 bg-black/40 p-2.5 font-mono text-[0.65rem] leading-relaxed text-slate-300">
            {web}
          </pre>
        )}
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            setDiagnosis('Gathering…');
            void diagnostics(deviceId).then(setDiagnosis, (cause: Error) =>
              setDiagnosis(`Failed: ${cause.message}`),
            );
          }}
          className="w-full rounded-lg border border-edge bg-surface px-3 py-2 text-xs text-mist transition hover:border-ice/40 hover:text-ice">
          Full diagnosis
        </button>
        {diagnosis && (
          <>
            <pre className="scroll-thin mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-edge/70 bg-black/40 p-2.5 font-mono text-[0.65rem] leading-relaxed text-slate-300">
              {diagnosis}
            </pre>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(diagnosis)}
              className="mt-1.5 text-[0.65rem] text-mist underline underline-offset-2 hover:text-ice">
              Copy this
            </button>
          </>
        )}
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
