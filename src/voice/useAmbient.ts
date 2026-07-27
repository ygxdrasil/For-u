import {useCallback, useEffect, useRef, useState} from 'react';
import * as api from '../lib/api';
import {acquire, MicError, type MicLease} from './mic';
import {toWav} from './wav';
import {keepUpWith, wasYou, type GuardState} from './voiceprint';

/**
 * Always-on listening.
 *
 * The microphone stays open, speech is detected here on the machine, and
 * nothing leaves the room until someone has actually said something — at which
 * point the utterance is transcribed and checked for her name. Silence, typing,
 * traffic and television never travel anywhere.
 *
 * Deliberately not the browser's speech recognition: that streams continuously
 * to a remote service, holds the microphone against everything else that wants
 * it, and stops on its own schedule without saying so. This is the thing it was
 * pretending to be.
 *
 * The listening itself happens on the audio thread, in a worklet, and that is
 * the whole reason she can still hear you while you are reading something else.
 * This loop used to run on requestAnimationFrame, which every browser stops
 * dead for a tab you are not looking at — so the moment you opened another
 * site she went deaf, and came back the instant you returned, which is a very
 * confusing thing to experience. An AudioWorklet is driven by the soundcard
 * rather than the screen. It does not know or care whether anyone is watching.
 *
 * The limit that remains is real and worth being straight about: her tab has to
 * be open somewhere. A page that has been closed is not running, and no amount
 * of cleverness changes that — hearing you with the browser shut would need a
 * browser extension or a program installed on the machine.
 */

/**
 * The ear itself, as source text.
 *
 * Kept as a string and handed over as a blob rather than shipped as its own
 * file, because a worklet module is fetched by URL at runtime and a separate
 * asset is one more thing to get wrong in a build, a deploy, or a cache.
 *
 * All it does is measure loudness and post it back about twenty times a second.
 * Every decision stays on the main thread where the rest of this file can see
 * it; the audio thread is only there because it keeps running.
 */
const EARS = `
class Ears extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sum = 0;
    this.count = 0;
    this.frames = 0;
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) {
      let sum = 0;
      for (let i = 0; i < channel.length; i++) sum += channel[i] * channel[i];
      this.sum += sum;
      this.count += channel.length;
      this.frames += channel.length;
    }

    // Roughly every 50ms. Blocks are 128 frames, which would be 375 messages a
    // second — enough to make the main thread the bottleneck it was not.
    if (this.frames >= sampleRate * 0.05) {
      this.port.postMessage(this.count > 0 ? Math.sqrt(this.sum / this.count) : 0);
      this.sum = 0;
      this.count = 0;
      this.frames = 0;
    }

    return true;
  }
}
registerProcessor('grace-ears', Ears);
`;

/** "Grace", and the ways a transcriber writes her. */
const WAKE = /\b(grace|grayce|greys|grace's)\b[\s,.:;!?-]*/i;

const CALIBRATION_MS = 600;
const SPEECH_FLOOR = 0.012;
/** Silence that ends an utterance. Longer than press-to-talk: nobody pressed. */
const TRAILING_SILENCE_MS = 1100;
/** Anything shorter is a cough, a door, or a keyboard. */
const MIN_UTTERANCE_MS = 400;
/** Nobody speaks a single sentence for this long; stop and take what we have. */
const MAX_UTTERANCE_MS = 15_000;

/** How long she stays awake after being addressed, so follow-ups need no name. */
const STAYS_AWAKE_MS = 12_000;

export type AmbientState = 'off' | 'starting' | 'listening' | 'hearing' | 'working';

interface AmbientOptions {
  enabled: boolean;
  /** Deaf while she is thinking or talking, so she never answers herself. */
  paused: boolean;
  deviceId?: string;
  onRequest: (text: string) => void;
  /** Whose voice she answers to, when that has been set up. */
  guard?: GuardState | null;
}

export function useAmbient({
  enabled,
  paused,
  deviceId,
  onRequest,
  guard,
}: AmbientOptions) {
  const [state, setState] = useState<AmbientState>('off');
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [awake, setAwake] = useState(false);
  /** The last thing she heard, whether or not it was for her. */
  const [heard, setHeard] = useState('');
  /** Voices turned away in a row. Reset the moment she recognises you. */
  const [strangers, setStrangers] = useState(0);
  /** Which clock is driving detection, so a diagnosis needs no guesswork. */
  const [ear, setEar] = useState<'none' | 'worklet' | 'frames'>('none');
  /** The last speaker verdict, for the same reason. */
  const [lastScore, setLastScore] = useState<number | null>(null);

  const leaseRef = useRef<MicLease | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const earsRef = useRef<AudioWorkletNode | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const awakeUntilRef = useRef(0);
  const onRequestRef = useRef(onRequest);
  const pausedRef = useRef(paused);
  const runningRef = useRef(false);
  const guardRef = useRef<GuardState | null>(null);

  useEffect(() => {
    onRequestRef.current = onRequest;
  }, [onRequest]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  // Held in a ref for the same reason as the rest: `consider` is created once
  // and must see the current setting, not the one in force when it was made.
  useEffect(() => {
    guardRef.current = guard ?? null;
  }, [guard]);

  const stop = useCallback(() => {
    runningRef.current = false;
    window.cancelAnimationFrame(frameRef.current ?? 0);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    earsRef.current?.port.close();
    earsRef.current?.disconnect();
    earsRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    void contextRef.current?.close().catch(() => {});
    contextRef.current = null;
    leaseRef.current?.release();
    leaseRef.current = null;
    setState('off');
    setLevel(0);
    setAwake(false);
    setEar('none');
  }, []);

  /**
   * Decide what to do with something that was said.
   *
   * Her name anywhere in the sentence counts, because "sorry Grace, what time
   * is it" is how people actually talk. Once addressed she stays awake briefly,
   * so a follow-up needs no name at all.
   */
  const consider = useCallback(async (audio: Blob) => {
    setState('working');
    try {
      /*
       * Whose voice it was, decided here, before anything leaves the machine.
       *
       * Deliberately ahead of transcription rather than after it. Checking
       * afterwards would mean every word the television says is sent away and
       * paid for before being thrown out — this way somebody else's voice
       * costs nothing at all, which makes the guard cheaper than not having it.
       */
      const guarding = guardRef.current ?? {
        enrolment: null,
        on: false,
        strictness: 'normal' as const,
      };
      const speaker = await wasYou(guarding, audio);
      if (guarding.on && guarding.enrolment) setLastScore(speaker.score);
      if (!speaker.ok) {
        // Counted, not just noted. One refusal is the television; several in a
        // row is the owner being locked out of their own house, and the
        // interface has to be able to say so — the first version failed
        // silently, which left no way to tell the two apart.
        setStrangers((count) => count + 1);
        return;
      }
      setStrangers(0);
      void keepUpWith(guarding, audio);

      const wav = await toWav(audio);
      const text = (await api.transcribe(wav.base64, wav.mimeType)).trim();
      if (!text) return;

      setHeard(text);

      const match = WAKE.exec(text);
      const stillAwake = Date.now() < awakeUntilRef.current;

      if (!match && !stillAwake) return;

      const request = match
        ? `${text.slice(0, match.index)}${text.slice(match.index + match[0].length)}`.trim()
        : text;

      // Just her name and nothing else: she is being got, not asked.
      if (!request) {
        awakeUntilRef.current = Date.now() + STAYS_AWAKE_MS;
        setAwake(true);
        return;
      }

      awakeUntilRef.current = 0;
      setAwake(false);
      onRequestRef.current(request);
    } catch (cause) {
      // A failed transcription in the background is not worth interrupting
      // anyone over; it will be tried again on the next thing said.
      console.warn('[grace] ambient transcription failed:', (cause as Error).message);
    } finally {
      setState((current) => (current === 'working' ? 'listening' : current));
    }
  }, []);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setError(null);
    setState('starting');

    let lease: MicLease;
    try {
      lease = await acquire(deviceId);
    } catch (cause) {
      runningRef.current = false;
      setState('off');
      setError(cause instanceof MicError ? cause.message : (cause as Error).message);
      return;
    }
    leaseRef.current = lease;

    const context = new AudioContext();
    contextRef.current = context;
    if (context.state === 'suspended') await context.resume();

    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.1;
    sourceRef.current = context.createMediaStreamSource(lease.stream);
    sourceRef.current.connect(analyser);

    const samples = new Uint8Array(analyser.fftSize);
    /*
     * Set by the first reading, not by the clock.
     *
     * Loading the worklet module takes a moment, and calibration used to start
     * counting the instant the microphone opened — so on a slow load the whole
     * calibration window elapsed before a single reading arrived, leaving the
     * measured room floor at zero. It then never recalibrated, because the
     * window had passed.
     */
    let openedAt = 0;
    let floor = 0;
    let floorSamples = 0;
    let speakingSince = 0;
    let quietSince = 0;
    let chunks: BlobPart[] = [];
    /** Has any reading arrived at all? The watchdog below turns on this. */
    let heardSomething = false;

    setState('listening');

    const beginCapture = () => {
      chunks = [];
      const recorder = new MediaRecorder(lease.stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, {type: recorder.mimeType || 'audio/webm'});
        if (blob.size > 0) void consider(blob);
      };
      recorder.start();
      setState('hearing');
    };

    const endCapture = (keep: boolean) => {
      const recorder = recorderRef.current;
      recorderRef.current = null;
      if (!recorder || recorder.state === 'inactive') return;
      if (!keep) recorder.onstop = null;
      recorder.stop();
      if (!keep) setState('listening');
    };

    /**
     * One loudness reading, and everything that follows from it.
     *
     * Deliberately knows nothing about where the reading came from. That is
     * what lets the same judgement run from the audio thread, which never
     * stops, and from the frame clock, which does.
     */
    const onLevel = (rms: number) => {
      if (!runningRef.current) return;

      heardSomething = true;

      // Nobody is watching the meter on a tab nobody is looking at, and a
      // React render twenty times a second to move a bar that is not on screen
      // is the one part of this that genuinely wastes a laptop's battery.
      if (!document.hidden) setLevel(rms);

      const now = performance.now();
      if (openedAt === 0) openedAt = now;

      // Measure the room first, so a noisy one doesn't trigger constantly.
      if (now - openedAt < CALIBRATION_MS) {
        floor = (floor * floorSamples + rms) / (floorSamples + 1);
        floorSamples += 1;
        return;
      }

      // Her own voice must never wake her, or she talks to herself forever.
      if (pausedRef.current) {
        if (recorderRef.current) endCapture(false);
        return;
      }

      const threshold = Math.max(SPEECH_FLOOR, floor * 3);
      const loud = rms > threshold;

      if (loud) {
        quietSince = 0;
        if (!recorderRef.current) {
          speakingSince = now;
          beginCapture();
        } else if (now - speakingSince > MAX_UTTERANCE_MS) {
          endCapture(true);
        }
      } else if (recorderRef.current) {
        if (quietSince === 0) quietSince = now;
        else if (now - quietSince > TRAILING_SILENCE_MS) {
          const spoken = quietSince - speakingSince;
          endCapture(spoken > MIN_UTTERANCE_MS);
          quietSince = 0;
        }
      }

      if (awakeUntilRef.current > 0 && Date.now() > awakeUntilRef.current) {
        awakeUntilRef.current = 0;
        setAwake(false);
      }
    };

    /** The frame clock. Correct, and stops the moment you look away. */
    const watchOnScreen = () => {
      const tick = () => {
        if (!runningRef.current) return;
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) {
          const value = sample / 128 - 1;
          sum += value * value;
        }
        onLevel(Math.sqrt(sum / samples.length));
        frameRef.current = window.requestAnimationFrame(tick);
      };
      tick();
    };

    /**
     * The audio thread. Runs whether or not this tab is the one you are on.
     *
     * The worklet has to reach the destination or nothing pulls audio through
     * it and process() is never called — so it goes through a gain of zero,
     * which keeps the graph alive and puts not one sample into the speakers.
     */
    try {
      const url = URL.createObjectURL(new Blob([EARS], {type: 'text/javascript'}));
      try {
        await context.audioWorklet.addModule(url);
      } finally {
        URL.revokeObjectURL(url);
      }

      const ears = new AudioWorkletNode(context, 'grace-ears');
      earsRef.current = ears;
      ears.port.onmessage = (event: MessageEvent<number>) => onLevel(event.data);

      const silent = context.createGain();
      silent.gain.value = 0;
      sourceRef.current.connect(ears);
      ears.connect(silent);
      silent.connect(context.destination);
      setEar('worklet');

      /*
       * The watchdog, and the reason this exists is worth writing down.
       *
       * A worklet can load without objecting and then never be called — a
       * suspended context, an autoplay policy that will not let the graph
       * start, a browser that quietly declines to pull a node whose output
       * goes nowhere audible. Every one of those throws nothing and reports
       * nothing. She simply never hears anything, for ever, and the interface
       * shows a microphone that is on.
       *
       * So: if no reading has arrived in a second and a half, stop believing
       * it and use the frame clock instead. Listening only while the tab is
       * visible is a poor outcome; listening never is a broken one.
       */
      window.setTimeout(() => {
        if (!runningRef.current || heardSomething) return;
        console.warn('[grace] the audio thread produced nothing; falling back');
        void context.resume().catch(() => {});
        setEar('frames');
        watchOnScreen();
      }, 1500);
    } catch (cause) {
      // Every browser worth naming has had AudioWorklet for years, but a
      // failure here would mean she cannot hear at all, and hearing you only
      // while you are looking at her is enormously better than that.
      console.warn(
        '[grace] audio worklet unavailable, listening only while visible:',
        (cause as Error).message,
      );
      setEar('frames');
      watchOnScreen();
    }
  }, [consider, deviceId]);

  useEffect(() => {
    if (enabled) void start();
    else stop();
    return () => {
      if (!enabled) return;
      stop();
    };
  }, [enabled, start, stop]);

  return {state, level, error, awake, heard, strangers, ear, lastScore};
}
