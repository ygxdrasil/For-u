import {useCallback, useEffect, useRef, useState} from 'react';
import {toWav, type EncodedAudio} from './wav';

/** Anything shorter than this is a mis-tap rather than a sentence. */
const MIN_SECONDS = 0.3;

/** Stop on our own terms rather than uploading a recording of an empty room. */
const MAX_SECONDS = 60;

export type RecorderState = 'idle' | 'starting' | 'recording' | 'working';

interface RecorderOptions {
  onCaptured: (audio: EncodedAudio) => void;
}

/**
 * Records from the microphone and hands back WAV audio.
 *
 * Deliberately built on getUserMedia and MediaRecorder, which exist in every
 * current browser — unlike speech recognition, which does not exist in Firefox
 * or on iOS at all. The level meter matters as much as the recording: it is the
 * difference between "she can't hear me" and knowing whether the microphone is
 * picking up sound in the first place.
 */
export function useRecorder({onCaptured}: RecorderOptions) {
  const [state, setState] = useState<RecorderState>('idle');
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [heardSomething, setHeardSomething] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const stopTimerRef = useRef<number | undefined>(undefined);
  const onCapturedRef = useRef(onCaptured);

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
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void contextRef.current?.close().catch(() => {});
    contextRef.current = null;
    recorderRef.current = null;
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

  const start = useCallback(async () => {
    if (!supported) {
      setError(
        'This browser cannot record audio. Chrome, Edge, Firefox and Safari all can — ' +
          'if you are seeing this, the page may not be on a secure connection.',
      );
      return;
    }

    setError(null);
    setHeardSomething(false);
    setState('starting');

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {echoCancellation: true, noiseSuppression: true},
      });
    } catch (cause) {
      const name = (cause as Error).name;
      setState('idle');

      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setError(
          'The microphone was blocked. Click the padlock beside the web address, ' +
            'set Microphone to Allow, then reload the page.',
        );
      } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        setError('No microphone was found. Check one is plugged in and enabled.');
      } else if (name === 'NotReadableError') {
        setError(
          'Something else is using the microphone. Close other calls or recording ' +
            'apps and try again.',
        );
      } else {
        setError(`The microphone could not start: ${name || 'unknown error'}`);
      }
      return;
    }

    streamRef.current = stream;

    // Live level, so silence can be told apart from a dead microphone.
    try {
      const context = new AudioContext();
      contextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);

      const samples = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let peak = 0;
        for (const sample of samples) {
          peak = Math.max(peak, Math.abs(sample - 128) / 128);
        }
        setLevel(peak);
        if (peak > 0.04) setHeardSomething(true);
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
      teardown();

      if (recording.size === 0) {
        setError('Nothing was recorded.');
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

    recorder.start();
    setState('recording');
    stopTimerRef.current = window.setTimeout(stop, MAX_SECONDS * 1000);
  }, [supported, stop, teardown]);

  useEffect(() => teardown, [teardown]);

  return {supported, state, level, error, heardSomething, start, stop};
}
