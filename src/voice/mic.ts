/**
 * The one place that opens the microphone.
 *
 * Grace previously had two independent consumers: the wake-word listener,
 * which holds the device for as long as it runs, and the recorder, which asked
 * for its own stream. On desktop Chrome that is a fight, and the recorder
 * loses quietly — no error, no audio, an assistant that appears deaf. Every
 * request now goes through here, reference-counted, so there is only ever one
 * open stream and everyone can see whose it is.
 */

export interface MicLease {
  stream: MediaStream;
  release: () => void;
}

export interface MicDevice {
  deviceId: string;
  label: string;
}

let current: {stream: MediaStream; deviceId: string | undefined; leases: number} | null =
  null;

/**
 * Things that hold the microphone by other means and must let go first.
 *
 * Speech recognition is the one that matters: it keeps the device for as long
 * as it runs, and React state alone cannot guarantee it has stopped before the
 * recorder asks. Yielding is therefore explicit and awaited, not hoped for.
 */
const yielders = new Set<() => void | Promise<void>>();

export function registerYielder(release: () => void | Promise<void>): () => void {
  yielders.add(release);
  return () => yielders.delete(release);
}

/** A dismissed permission prompt hangs forever; this is the way out. */
const PROMPT_PATIENCE_MS = 12_000;

export function micSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

/**
 * Plain `audio: true` unless a specific device was chosen.
 *
 * Naming constraints like echoCancellation makes the whole request fail on any
 * device that does not offer them, which is indistinguishable from a broken
 * microphone. An exact deviceId is worth the risk because the user picked it.
 */
function constraintsFor(deviceId: string | undefined): MediaStreamConstraints {
  return {audio: deviceId ? {deviceId: {exact: deviceId}} : true};
}

export class MicError extends Error {
  constructor(
    message: string,
    readonly kind: 'blocked' | 'missing' | 'busy' | 'unsupported' | 'unknown',
  ) {
    super(message);
    this.name = 'MicError';
  }
}

function explain(cause: Error): MicError {
  switch (cause.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return new MicError(
        'The microphone is blocked. Click the padlock beside the web address, ' +
          'set Microphone to Allow, then reload the page.',
        'blocked',
      );
    case 'NotFoundError':
    case 'OverconstrainedError':
      return new MicError(
        'No microphone was found. If you just plugged one in, reload the page.',
        'missing',
      );
    case 'NotReadableError':
    case 'AbortError':
      return new MicError(
        'Another program is holding the microphone. Close any call, recorder or ' +
          'meeting app and try again.',
        'busy',
      );
    default:
      return new MicError(
        `The microphone could not start: ${cause.name || cause.message}`,
        'unknown',
      );
  }
}

/**
 * Open the microphone, or join the stream that is already open.
 *
 * Asking for a different device than the one currently open closes the old one
 * first — two live captures of two devices is never what anyone wanted.
 */
export async function acquire(deviceId?: string): Promise<MicLease> {
  if (!micSupported()) {
    throw new MicError(
      'This browser cannot record audio, or the page is not on a secure connection.',
      'unsupported',
    );
  }

  // Anything else holding the device lets go first, and we wait for it. A
  // beat afterwards, because Chrome frees the capture asynchronously.
  if (yielders.size > 0) {
    await Promise.all([...yielders].map((release) => release()));
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }

  if (current && current.deviceId !== deviceId) {
    current.stream.getTracks().forEach((track) => track.stop());
    current = null;
  }

  if (!current) {
    let stream: MediaStream;
    try {
      // getUserMedia is documented as able to neither resolve nor reject: if
      // the permission prompt is dismissed rather than answered, it hangs for
      // good. Without this the button simply stops working until a reload,
      // with no error anywhere — which is exactly what "nothing happens" is.
      stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraintsFor(deviceId)),
        new Promise<never>((_, reject) =>
          window.setTimeout(
            () =>
              reject(
                new MicError(
                  'The microphone request went unanswered. If a permission prompt ' +
                    'appeared, choose Allow; if it did not, click the padlock beside ' +
                    'the web address and allow the microphone, then reload.',
                  'blocked',
                ),
              ),
            PROMPT_PATIENCE_MS,
          ),
        ),
      ]);
    } catch (cause) {
      throw cause instanceof MicError ? cause : explain(cause as Error);
    }
    current = {stream, deviceId, leases: 0};
  }

  const open = current;
  open.leases += 1;
  let released = false;

  return {
    stream: open.stream,
    release: () => {
      if (released) return;
      released = true;
      open.leases -= 1;
      // Left open a moment: back-to-back recordings are common, and reopening
      // costs a device handshake and, on some machines, a visible click.
      if (open.leases <= 0) {
        window.setTimeout(() => {
          if (open.leases <= 0 && current === open) {
            open.stream.getTracks().forEach((track) => track.stop());
            current = null;
          }
        }, 1500);
      }
    },
  };
}

/** Close everything, now. Used when handing the device to something else. */
export function releaseAll(): void {
  if (!current) return;
  current.stream.getTracks().forEach((track) => track.stop());
  current = null;
}

/**
 * Everything worth knowing about why the microphone might not work, as text.
 *
 * On desktop Chrome the answer is nearly always one of three things: the page
 * is not on a secure origin, permission is set to denied so no prompt will
 * ever appear again, or the device Chrome actually opened is a virtual one
 * with nothing routed into it. All three are visible here and invisible
 * otherwise.
 */
export async function diagnostics(deviceId?: string): Promise<string> {
  const lines: string[] = [];
  const add = (label: string, value: unknown) => lines.push(`${label}: ${String(value)}`);

  add('page', window.location.origin);
  add('secure context', window.isSecureContext);
  add('in an iframe', window.self !== window.top);
  add('mediaDevices present', Boolean(navigator.mediaDevices?.getUserMedia));
  add('MediaRecorder present', typeof MediaRecorder !== 'undefined');
  add('user agent', navigator.userAgent);

  try {
    const status = await navigator.permissions?.query({
      name: 'microphone' as PermissionName,
    });
    add('permission', status?.state ?? 'not reported');
  } catch {
    add('permission', 'not reported');
  }

  if (typeof MediaRecorder !== 'undefined') {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/ogg;codecs=opus',
    ];
    add(
      'recording formats',
      types.filter((type) => MediaRecorder.isTypeSupported(type)).join(', ') || 'none',
    );
  }

  try {
    for (const device of await listDevices()) {
      add('input', `${device.label} [${device.deviceId.slice(0, 12)}]`);
    }
  } catch (cause) {
    add('inputs', `could not list: ${(cause as Error).message}`);
  }

  // The live check. Everything above is capability; this is reality.
  try {
    const lease = await acquire(deviceId);
    const track = lease.stream.getAudioTracks()[0];
    add('opened device', track?.label || 'unnamed');
    add('track state', `${track?.readyState}, muted=${track?.muted}, enabled=${track?.enabled}`);
    add('settings', JSON.stringify(track?.getSettings() ?? {}));
    const peak = await sampleLevel(lease.stream, 900);
    add('peak level over 0.9s', peak.toFixed(4));
    add(
      'verdict',
      peak > 0.02
        ? 'sound is arriving'
        : 'NOTHING is arriving from this device — wrong microphone, muted, or a virtual device with no input',
    );
    lease.release();
  } catch (cause) {
    add('opening the microphone', `FAILED — ${(cause as Error).message}`);
  }

  return lines.join('\n');
}

export async function listDevices(): Promise<MicDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === 'audioinput')
    .map((device, index) => ({
      deviceId: device.deviceId,
      // Labels are empty until permission has been granted at least once.
      label: device.label || `Microphone ${index + 1}`,
    }));
}

/**
 * Reads the loudest sample in a stream over a short window.
 *
 * Used to answer the only question that matters when someone says she cannot
 * hear them: is any sound at all arriving from this device?
 */
export async function sampleLevel(stream: MediaStream, ms = 1200): Promise<number> {
  const context = new AudioContext();
  try {
    // A suspended context runs no graph at all, so every reading is zero and
    // a perfectly good microphone is reported as silent.
    if (context.state === 'suspended') await context.resume();

    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    context.createMediaStreamSource(stream).connect(analyser);
    const samples = new Uint8Array(analyser.frequencyBinCount);

    let peak = 0;
    const until = performance.now() + ms;
    while (performance.now() < until) {
      analyser.getByteTimeDomainData(samples);
      for (const sample of samples) {
        peak = Math.max(peak, Math.abs(sample - 128) / 128);
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }
    return peak;
  } finally {
    await context.close().catch(() => {});
  }
}
