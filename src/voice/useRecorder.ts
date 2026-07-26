import {useCallback, useEffect, useRef, useState} from 'react';
import {acquire, MicError, type MicLease} from './mic';
import {toWav, type EncodedAudio} from './wav';

/** Anything shorter than this is a mis-tap rather than a sentence. */
const MIN_SECONDS = 0.3;

/** Stop on our own terms rather than uploading a recording of an empty room. */
const MAX_SECONDS = 60;

/** Above this, someone is talking. Below it, room tone. */
const SPEECH_LEVEL = 0.06;

/** Silence this long after speech means the sentence is finished. */
const TRAILING_SILENCE_MS = 1400;

/** How long to wait for someone to start before giving up. */
const OPENING_PATIENCE_MS = 9000;

export type RecorderState = 'idle' | 'starting' | 'recording' | 'working';

interface RecorderOptions {
  onCaptured: (audio: EncodedAudio) => void;
  /** Which microphone to use. Undefined means whichever the system prefers. */
  deviceId?: string;
}

/**
 * Records from the microphone and hands back WAV audio.
 *
 * Built on getUserMedia and MediaRecorder, which exist in every current
 * browser — unlike speech recognition, which does not exist in Firefox or on
 * iOS at all. The level meter matters as much as the recording: it is the
 * difference between "she can't hear me" and knowing whether the microphone is
 * picking up sound in the first place.
 */
export function useRecorder({onCaptured, deviceId}: RecorderOptions) {
  const [state, setState] = useState<RecorderState>('idle');
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [heardSomething, setHeardSomething] = useState(false);

  const leaseRef = useRef<MicLease | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const stopTimerRef = useRef<number | undefined>(undefined);
  const onCapturedRef = useRef(onCaptured);
  const stopRef = useRef<() => void>(() => {});
  const spokeRef = useRef(false);

  useEffect(() => {
    onCapturedRef.current = onCaptured;
  }, [onCaptured]);

  const supported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined';

  const teardown = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current ?? 0);
    window.clearTimeout(stopTimerRef.current);
    void contextRef.current?.close().catch(() => {});
    contextRef.current = null;
    recorderRef.current = null;
    leaseRef.current?.release();
    leaseRef.current = null;
    setLevel(0);
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      teardown();
      setState('idle');
    }
  }, [teardown]);

  stopRef.current = stop;

  const start = useCallback(async () => {
    setError(null);
    setHeardSomething(false);
    spokeRef.current = false;
    setState('starting');

    let lease: MicLease;
    try {
      lease = await acquire(deviceId);
    } catch (cause) {
      setState('idle');
      setError(
        cause instanceof MicError
          ? cause.message
          : `The microphone could not start: ${(cause as Error).message}`,
      );
      return;
    }

    leaseRef.current = lease;
    const {stream} = lease;

    // A track that arrives already muted or ended is the classic silent
    // failure: permission was granted, but nothing is coming through.
    const track = stream.getAudioTracks()[0];
    if (!track || track.readyState === 'ended') {
      teardown();
      setState('idle');
      setError('The microphone opened but immediately closed. Try reloading the page.');
      return;
    }

    // Live level, so silence can be told apart from a dead microphone.
    try {
      const context = new AudioContext();
      contextRef.current = context;
      // Chrome can hand back a suspended context; an analyser on a suspended
      // context reads nothing but zeroes, which looks exactly like silence.
      if (context.state === 'suspended') await context.resume();

      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);

      const samples = new Uint8Array(analyser.frequencyBinCount);
      const openedAt = performance.now();
      let spokeAt = 0;

      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let peak = 0;
        for (const sample of samples) {
          peak = Math.max(peak, Math.abs(sample - 128) / 128);
        }
        setLevel(peak);
        if (peak > 0.04) {
          setHeardSomething(true);
          spokeRef.current = true;
        }

        // She closes the recording herself once you stop talking. Requiring a
        // second press is the single easiest thing to get wrong, and getting
        // it wrong looks exactly like an assistant who cannot hear you.
        const now = performance.now();
        if (peak > SPEECH_LEVEL) {
          spokeAt = now;
        } else if (spokeAt > 0 && now - spokeAt > TRAILING_SILENCE_MS) {
          stopRef.current();
          return;
        } else if (spokeAt === 0 && now - openedAt > OPENING_PATIENCE_MS) {
          stopRef.current();
          return;
        }

        frameRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Metering is a nicety; recording still works without it.
    }

    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onerror = () => {
      setError('The recording stopped unexpectedly.');
      teardown();
      setState('idle');
    };

    recorder.onstop = async () => {
      const recording = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      });
      const spoke = spokeRef.current;
      teardown();

      if (recording.size === 0) {
        setError('Nothing was recorded at all. Reload the page and try again.');
        setState('idle');
        return;
      }

      // Never send an empty room off to be transcribed: it costs a request and
      // comes back with nothing, which reads as her failing to understand you
      // rather than never having heard you.
      if (!spoke) {
        setError(
          'No sound reached me. Open Sound check and confirm the right microphone ' +
            'is selected — the level bar should move while you talk.',
        );
        setState('idle');
        return;
      }

      setState('working');
      try {
        const audio = await toWav(recording);
        if (audio.seconds < MIN_SECONDS) {
          setError('That was too short to make out. Hold it a little longer.');
          setState('idle');
          return;
        }
        onCapturedRef.current(audio);
      } catch (cause) {
        setError(`The recording could not be prepared: ${(cause as Error).message}`);
      } finally {
        setState('idle');
      }
    };

    // No timeslice: one blob at the end is all we want, and asking for periodic
    // chunks is a documented way to get zero-length data on some builds.
    recorder.start();
    setState('recording');
    stopTimerRef.current = window.setTimeout(() => stopRef.current(), MAX_SECONDS * 1000);
  }, [deviceId, teardown]);

  useEffect(() => teardown, [teardown]);

  return {supported, state, level, error, heardSomething, start, stop};
}
