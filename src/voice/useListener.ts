import {useCallback, useEffect, useRef, useState} from 'react';
import {registerYielder} from './mic';

/** "Grace", plus whatever punctuation the transcriber tacks on after it. */
const WAKE_WORD = /\bgrace\b[\s,.:;!?-]*/i;

/** Give up on a request that never arrives after the wake word. */
const CAPTURE_TIMEOUT = 12_000;

interface ListenerOptions {
  /** Master microphone switch — must be turned on by a user gesture. */
  enabled: boolean;
  /** Temporarily deaf, so Grace doesn't transcribe her own voice. */
  paused: boolean;
  onRequest: (text: string) => void;
}

/**
 * Continuous listening with wake-word activation.
 *
 * Sits in a low-attention state until it hears "Grace", then captures the next
 * utterance as a request. Saying "Grace, what's on today" in one breath is
 * understood as a single request rather than two.
 */
export function useListener({enabled, paused, onRequest}: ListenerOptions) {
  const [supported] = useState(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition),
  );
  const [awake, setAwake] = useState(false);
  const [heard, setHeard] = useState('');
  const [error, setError] = useState<string | null>(null);
  /** Whether the browser is actually listening right now, not just asked to. */
  const [running, setRunning] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRunRef = useRef(false);
  /** Read inside callbacks, where the state value would be a render behind. */
  const runningRef = useRef(false);
  const awakeRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const onRequestRef = useRef(onRequest);

  useEffect(() => {
    onRequestRef.current = onRequest;
  }, [onRequest]);

  const sleep = useCallback(() => {
    awakeRef.current = false;
    setAwake(false);
    window.clearTimeout(timerRef.current);
  }, []);

  const wake = useCallback(() => {
    awakeRef.current = true;
    setAwake(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(sleep, CAPTURE_TIMEOUT);
  }, [sleep]);

  const handleFinal = useCallback(
    (text: string) => {
      const spoken = text.trim();
      if (!spoken) return;

      if (awakeRef.current) {
        sleep();
        onRequestRef.current(spoken);
        return;
      }

      const match = WAKE_WORD.exec(spoken);
      if (!match) return;

      const rest = spoken.slice(match.index + match[0].length).trim();
      const words = rest.split(/\s+/).filter(Boolean);

      // Enough words to be a request on its own; anything shorter is treated as
      // just getting her attention.
      if (words.length >= 2) {
        sleep();
        onRequestRef.current(rest);
      } else {
        wake();
      }
    },
    [sleep, wake],
  );

  useEffect(() => {
    if (!supported) return;

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new Recognition!();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) handleFinal(transcript);
        else interim += transcript;
      }
      setHeard(interim);
    };

    recognition.onstart = () => {
      runningRef.current = true;
      setRunning(true);
      setError(null);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldRunRef.current = false;
        setError(
          'Your browser blocked the microphone. Click the padlock beside the ' +
            'web address, allow the microphone, then reload.',
        );
        return;
      }

      if (event.error === 'network') {
        setError(
          'Speech recognition could not reach its service. It needs an internet ' +
            'connection, and some networks block it.',
        );
        return;
      }

      if (event.error === 'audio-capture') {
        setError('No microphone was found on this device.');
        return;
      }

      setError(`The microphone stopped: ${event.error}`);
    };

    // Browsers stop recognition on their own schedule; pick it straight back up.
    recognition.onend = () => {
      runningRef.current = false;
      setRunning(false);
      setHeard('');
      if (!shouldRunRef.current) return;
      try {
        recognition.start();
      } catch {
        // Already restarting — harmless.
      }
    };

    recognitionRef.current = recognition;

    // Hand the microphone over the moment anything else needs it. abort()
    // rather than stop(), because stop() finishes the current utterance first
    // and keeps the device meanwhile.
    const unregister = registerYielder(
      () =>
        new Promise<void>((resolve) => {
          // Order matters. Clearing the restart flag first is what stops
          // abort() from simply triggering our own onend handler and starting
          // the whole thing again — fighting our own wake word forever.
          shouldRunRef.current = false;

          if (!runningRef.current) {
            resolve();
            return;
          }

          // Chrome does not always fire 'end', so the wait is capped.
          const done = window.setTimeout(resolve, 600);
          recognition.addEventListener(
            'end',
            () => {
              window.clearTimeout(done);
              resolve();
            },
            {once: true},
          );
          recognition.abort();
        }),
    );

    return () => {
      unregister();
      shouldRunRef.current = false;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [supported, handleFinal]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const shouldRun = enabled && !paused;
    shouldRunRef.current = shouldRun;

    if (shouldRun) {
      setError(null);
      try {
        recognition.start();
      } catch {
        // start() throws if it is already running, which is fine.
      }
    } else {
      sleep();
      // abort(), not stop(): stop() lets the current utterance finish and holds
      // the microphone until it does, which is exactly the wrong thing when the
      // reason we are pausing is that something else wants the device.
      recognition.abort();
    }
  }, [enabled, paused, sleep]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return {supported, running, awake, heard, error, wake, sleep};
}
