import {useCallback, useEffect, useRef, useState} from 'react';
import * as api from '../lib/api';

/**
 * Grace's voice.
 *
 * She speaks with audio generated on the server, so she sounds the same in
 * every browser and on every phone. The browser's own speech synthesis is kept
 * only as a fallback for when that fails — it is absent on some platforms,
 * mute on others, and a different voice on every machine, which is why it is no
 * longer the thing she depends on.
 */

/** A real, if empty, WAV file. Used to get playback permission out of the way. */
const SILENCE =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';

const SENTENCE_END = /(?<=[.!?…])\s+/;

/** Comfortably inside what the speech route accepts in one go. */
const CHUNK_TARGET = 1500;

export type VoiceSource = 'grace' | 'browser';

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], {type: mimeType});
}

/** Rough preference order for a calm female voice, for the fallback only. */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  if (voice.lang.startsWith('en-GB')) score += 40;
  else if (voice.lang.startsWith('en')) score += 20;
  else return -1;

  if (/female|serena|kate|sonia|libby|amelie|fiona|samantha|karen|moira/.test(name)) {
    score += 30;
  }
  if (/male|daniel|arthur|oliver|george|fred|alex/.test(name)) score -= 30;
  if (/google|natural|premium|enhanced/.test(name)) score += 15;

  return score;
}

export function useSpeech(enabled: boolean) {
  const [speaking, setSpeaking] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [source, setSource] = useState<VoiceSource>('grace');
  const [error, setError] = useState<string | null>(null);

  // Always true now: the fallback is a fallback, not a requirement.
  const supported = true;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bufferRef = useRef('');
  const queueRef = useRef<string[]>([]);
  const pumpingRef = useRef(false);
  const startedRef = useRef(false);
  /** Bumped on cancel, so work already in flight knows to abandon itself. */
  const runRef = useRef(0);
  const synthVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  /**
   * Whether her own voice is worth asking for. Null until we've tried once.
   *
   * The speech model is not on Gemini's free tier, so on a free key the first
   * request fails and every later one would too. Latching this after one
   * attempt means the failure costs a single round trip rather than a pause in
   * front of every sentence she says for the rest of the day.
   */
  const serverVoiceRef = useRef<boolean | null>(null);
  /** Settles the audio currently playing, so cancelling never strands it. */
  const settleRef = useRef<(() => void) | null>(null);
  /** Which run the live pump belongs to. */
  const pumpRunRef = useRef(-1);
  /** Whether this reply's opening sentence has already been sent to be said. */
  const openedRef = useRef(false);

  const hasSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!hasSynth) return;

    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      const best = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
      if (scoreVoice(best) > 0) synthVoiceRef.current = best;
    };

    pick();
    window.speechSynthesis.addEventListener('voiceschanged', pick);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pick);
  }, [hasSynth]);

  // Chrome pauses synthesis part way through anything long unless it is nudged.
  useEffect(() => {
    if (!speaking || !hasSynth) return;
    const nudge = window.setInterval(() => window.speechSynthesis.resume(), 8000);
    return () => window.clearInterval(nudge);
  }, [speaking, hasSynth]);

  /**
   * Phones and most desktop browsers refuse to play audio that no one asked
   * for. Playing a moment of silence during a real click buys the permission,
   * so her first actual sentence isn't the one that gets swallowed.
   */
  const unlock = useCallback(() => {
    if (!audioRef.current) {
      const element = new Audio();
      element.preload = 'auto';
      audioRef.current = element;
    }

    const element = audioRef.current;
    if (!startedRef.current) {
      startedRef.current = true;
      element.src = SILENCE;
      element.play().then(
        () => setBlocked(false),
        () => {
          // Not fatal — she may still be allowed once there's a gesture.
        },
      );

      if (hasSynth) {
        const primer = new SpeechSynthesisUtterance(' ');
        primer.volume = 0;
        window.speechSynthesis.speak(primer);
      }
    }
  }, [hasSynth]);

  /** The fallback. Resolves when the browser stops talking, however it stops. */
  const speakInBrowser = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (!hasSynth) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (synthVoiceRef.current) utterance.voice = synthVoiceRef.current;
        utterance.lang = synthVoiceRef.current?.lang ?? 'en-GB';
        utterance.rate = 1.02;

        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          resolve();
        };

        utterance.onend = finish;
        utterance.onerror = (event) => {
          const reason = (event as SpeechSynthesisErrorEvent).error;
          if (reason === 'not-allowed' || reason === 'audio-busy') setBlocked(true);
          finish();
        };

        window.speechSynthesis.speak(utterance);
        // Some browsers never fire either event. Roughly a word every 350ms,
        // plus slack, so a stuck utterance can't wedge the queue forever.
        const guard = window.setTimeout(finish, 4000 + text.length * 90);
        utterance.addEventListener('end', () => window.clearTimeout(guard), {once: true});
      }),
    [hasSynth],
  );

  const playAudio = useCallback(
    (blob: Blob) =>
      new Promise<void>((resolve, reject) => {
        const element = audioRef.current ?? new Audio();
        audioRef.current = element;

        const url = URL.createObjectURL(blob);
        let settled = false;
        const done = (failure?: Error) => {
          if (settled) return;
          settled = true;
          settleRef.current = null;
          URL.revokeObjectURL(url);
          element.onended = null;
          element.onerror = null;
          if (failure) reject(failure);
          else resolve();
        };

        element.onended = () => done();
        element.onerror = () => done(new Error('the audio would not play'));
        // pause() fires neither event, so without this a cancel would leave
        // the blob URL un-revoked and the pump awaiting a promise forever.
        settleRef.current = () => done(new Error('cancelled'));
        element.src = url;
        element.play().then(
          () => setBlocked(false),
          (cause: Error) => {
            if (cause.name === 'NotAllowedError') setBlocked(true);
            done(cause);
          },
        );
      }),
    [],
  );

  /**
   * Works through the queue in order: ask the server for the audio, play it,
   * move on. Anything that goes wrong drops that line to the browser's own
   * voice rather than losing it.
   */
  const pump = useCallback(async () => {
    if (pumpingRef.current) return;
    pumpingRef.current = true;
    const run = runRef.current;
    pumpRunRef.current = run;

    try {
      while (queueRef.current.length > 0 && run === runRef.current) {
        const text = queueRef.current.shift() as string;
        setSpeaking(true);

        if (serverVoiceRef.current === false) {
          await speakInBrowser(text);
          continue;
        }

        try {
          const spoken = await api.speak(text);
          if (run !== runRef.current) return;
          await playAudio(base64ToBlob(spoken.audio, spoken.mimeType));
          serverVoiceRef.current = true;
          setSource('grace');
          setError(null);
        } catch (cause) {
          if (run !== runRef.current) return;
          const failure = cause as Error;
          // A browser that won't play audio is a separate problem, and one a
          // tap on the page fixes; don't write her own voice off over it.
          if (failure.name !== 'NotAllowedError') serverVoiceRef.current = false;
          // Say the words regardless, and say why once.
          setSource('browser');
          setError(failure.message);
          await speakInBrowser(text);
        }
      }
    } finally {
      // Only the pump that is still current may release the flag. A cancelled
      // pump unwinding late would otherwise clear it for the pump that
      // replaced it, and two loops would then share one queue and one audio
      // element — overlapping, out-of-order speech.
      if (pumpRunRef.current === run) {
        pumpingRef.current = false;
        if (run === runRef.current && queueRef.current.length === 0) {
          setSpeaking(false);
        }
      }
    }
  }, [playAudio, speakInBrowser]);

  const enqueue = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      queueRef.current.push(clean);
      void pump();
    },
    [pump],
  );

  /**
   * Collect the reply as it streams. Nothing is spoken yet.
   *
   * Speaking sentence by sentence starts her talking sooner, but costs a
   * request per sentence, and the free allowance for the speech model is
   * counted in requests per day rather than words. One request per reply is
   * the difference between her having a voice all day and losing it by
   * mid-morning, and since she answers in two or three sentences the wait is
   * about a second.
   */
  const push = useCallback(
    (delta: string) => {
      if (!enabled) return;
      bufferRef.current += delta;

      // Her first sentence goes out the moment it is complete, rather than
      // waiting for the whole reply to arrive and then a round trip to make
      // the audio. That is the difference between answering and appearing to
      // think about it. Everything after it is batched, so a reply still costs
      // two requests rather than one per sentence.
      if (openedRef.current) return;

      const parts = bufferRef.current.split(SENTENCE_END);
      if (parts.length < 2) return;

      const opener = parts.shift() as string;
      // Too short to be worth its own request, and clipped-sounding besides.
      if (opener.trim().length < 12) return;

      openedRef.current = true;
      bufferRef.current = parts.join(' ');
      enqueue(opener);
    },
    [enabled, enqueue],
  );

  /** The reply is complete. Say whatever is left. */
  const flush = useCallback(() => {
    openedRef.current = false;
    if (!enabled) return;
    const whole = bufferRef.current.trim();
    bufferRef.current = '';
    if (!whole) return;

    // Only a long reply is broken up, and then on sentence boundaries, since
    // the server won't take more than a couple of thousand characters at once.
    if (whole.length <= CHUNK_TARGET) {
      enqueue(whole);
      return;
    }

    let batch = '';
    for (const sentence of whole.split(SENTENCE_END)) {
      if (batch && batch.length + sentence.length > CHUNK_TARGET) {
        enqueue(batch);
        batch = '';
      }
      batch += `${sentence} `;
    }
    enqueue(batch);
  }, [enabled, enqueue]);

  /** Say one thing right now, outside any stream. */
  const say = useCallback(
    (text: string) => {
      unlock();
      enqueue(text);
    },
    [enqueue, unlock],
  );

  const cancel = useCallback(() => {
    runRef.current += 1;
    settleRef.current?.();
    settleRef.current = null;
    pumpingRef.current = false;
    openedRef.current = false;
    bufferRef.current = '';
    queueRef.current = [];
    pumpingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }
    if (hasSynth) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [hasSynth]);

  useEffect(() => cancel, [cancel]);

  return {speaking, supported, blocked, source, error, unlock, say, push, flush, cancel};
}
