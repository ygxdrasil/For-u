import {useEffect, useState} from 'react';

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
