import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  AttentionMode,
  GoogleStatus,
  GraceState,
  InputMode,
  Message,
  Profile,
  ProfileEntry,
} from '../../shared/types.ts';
import * as api from '../lib/api.ts';
import {NeedsPassword, type SessionStatus} from '../lib/api.ts';
import {useListener} from '../voice/useListener.ts';
import {useRecorder} from '../voice/useRecorder.ts';
import {useSpeech} from '../voice/useSpeech.ts';
import type {EncodedAudio} from '../voice/wav.ts';

export type Mode = 'offline' | 'idle' | 'waiting' | 'listening' | 'thinking' | 'speaking';

export function useGrace() {
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [state, setState] = useState<GraceState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState('');
  /** She consulted the web for the reply currently arriving. */
  const [searched, setSearched] = useState(false);
  /** What she actually did while answering, so no action is invisible. */
  const [actions, setActions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const handleRecordingRef = useRef<(audio: EncodedAudio) => void>(() => {});
  const speech = useSpeech(voiceOn);

  // Browsers hand out permission to play audio on the first real gesture and
  // not before. Taking it from any click at all means she is never mute merely
  // because the first thing you did was press the wrong button.
  const {unlock} = speech;
  useEffect(() => {
    const take = () => unlock();
    window.addEventListener('pointerdown', take);
    window.addEventListener('keydown', take);
    return () => {
      window.removeEventListener('pointerdown', take);
      window.removeEventListener('keydown', take);
    };
  }, [unlock]);

  const load = useCallback(async () => {
    const loaded = await api.fetchState();
    setState(loaded);
    setMessages(loaded.messages);
  }, []);

  useEffect(() => {
    api
      .fetchSession()
      .then(async (status) => {
        setSession(status);
        if (status === 'ok' || status === 'open') await load();
      })
      .catch((cause: Error) => setError(cause.message));
  }, [load]);

  const signIn = useCallback(
    async (password: string) => {
      await api.login(password);
      setSession('ok');
      setError(null);
      await load();
    },
    [load],
  );

  const signOut = useCallback(async () => {
    await api.logout();
    setSession('required');
    setState(null);
    setMessages([]);
  }, []);

  const addLearned = useCallback((entries: ProfileEntry[]) => {
    if (entries.length === 0) return;
    setState((current) =>
      current
        ? {
            ...current,
            profile: {
              ...current.profile,
              entries: [...current.profile.entries, ...entries],
            },
          }
        : current,
    );
  }, []);

  const send = useCallback(
    async (text: string, via: InputMode) => {
      const spoken = text.trim();
      if (!spoken || abortRef.current) return;

      setError(null);
      setBusy(true);
      setStreaming('');
      setSearched(false);
      setActions([]);
      speech.cancel();

      setMessages((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          speaker: 'user',
          text: spoken,
          at: new Date().toISOString(),
          via,
        },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;
      // She speaks whenever her voice is on. This used to require that the
      // message had been spoken too, which meant that anyone typing to her
      // never heard a word — she looked mute rather than set to silent.
      const speakIt = voiceOn;
      speech.unlock();
      let landed = false;

      try {
        for await (const event of api.streamChat(spoken, via, controller.signal)) {
          if (event.type === 'delta') {
            setStreaming((current) => current + event.text);
            if (speakIt) speech.push(event.text);
          } else if (event.type === 'done') {
            if (speakIt) speech.flush();
            const {message} = event;
            setStreaming('');
            setMessages((current) => [...current, message]);
            landed = true;
          } else if (event.type === 'searched') {
            setSearched(true);
          } else if (event.type === 'acted') {
            setActions((current) => [...current, event.summary]);
          } else if (event.type === 'search-failed') {
            setError(`I couldn’t reach the web for that: ${event.reason}`);
          } else if (event.type === 'learned') {
            addLearned(event.entries);
          } else if (event.type === 'error') {
            setError(event.message);
            setStreaming('');
          }
        }
      } catch (cause) {
        if (cause instanceof NeedsPassword) setSession('required');
        else if ((cause as Error).name !== 'AbortError') {
          setError((cause as Error).message);
        }
        setStreaming('');
      } finally {
        abortRef.current = null;
        setBusy(false);
      }

      // Learning and compaction happen after the reply, as their own request,
      // so neither delays what she says.
      if (landed) {
        api.reflect().then(addLearned).catch(() => {});
      }
    },
    [addLearned, speech, voiceOn],
  );

  const handleRequest = useCallback(
    (text: string) => {
      void send(text, 'voice');
    },
    [send],
  );

  const [transcribing, setTranscribing] = useState(false);
  const [misheard, setMisheard] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const recorder = useRecorder({
    deviceId,
    onCaptured: (audio) => void handleRecordingRef.current(audio),
  });

  const listener = useListener({
    enabled: micOn,
    // Deaf while she is thinking or talking, so she never answers herself —
    // and, critically, whenever the recorder wants the microphone. Speech
    // recognition holds the device for as long as it runs, so leaving it going
    // during a recording is two consumers fighting over one microphone, which
    // the recorder loses silently.
    paused: busy || speech.speaking || recorder.state !== 'idle' || transcribing,
    onRequest: handleRequest,
  });

  /**
   * The reliable route in. The browser records, the server transcribes, and
   * anything that goes wrong along the way says so.
   */
  const handleRecording = useCallback(
    async (audio: EncodedAudio) => {
      setMisheard(null);
      setTranscribing(true);
      try {
        const text = await api.transcribe(audio.base64, audio.mimeType);
        if (!text) {
          setMisheard('I couldn’t make out any words in that.');
          return;
        }
        await send(text, 'voice');
      } catch (cause) {
        if (cause instanceof NeedsPassword) setSession('required');
        else setMisheard((cause as Error).message);
      } finally {
        setTranscribing(false);
      }
    },
    [send],
  );

  // Held in a ref because the recorder is created before this callback exists:
  // the listener has to know the recorder's state, and the recorder has to be
  // able to hand its audio here.
  handleRecordingRef.current = handleRecording;

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    speech.cancel();
    setBusy(false);
    setStreaming('');
  }, [speech]);

  const applyProfile = useCallback((profile: Profile) => {
    setState((current) => (current ? {...current, profile} : current));
  }, []);

  const forget = useCallback(
    async (id: string) => applyProfile(await api.forgetEntry(id)),
    [applyProfile],
  );

  const rename = useCallback(
    async (addressAs: string | null) => applyProfile(await api.setAddressAs(addressAs)),
    [applyProfile],
  );

  const [google, setGoogle] = useState<GoogleStatus | null>(null);

  const refreshGoogle = useCallback(() => {
    api.googleStatus().then(setGoogle).catch(() => {});
  }, []);

  useEffect(() => {
    if (session === 'ok' || session === 'open') refreshGoogle();
  }, [session, refreshGoogle]);

  const setAttention = useCallback(async (next: AttentionMode) => {
    const mode = await api.setAttentionMode(next);
    setState((current) => (current ? {...current, mode} : current));
  }, []);

  const clear = useCallback(async () => {
    await api.clearConversation();
    setMessages([]);
    setStreaming('');
  }, []);

  const mode: Mode = useMemo(() => {
    if (state && !state.ready) return 'offline';
    // Recording wins over everything: it is the one state where what the
    // interface shows has to match what the microphone is doing.
    if (recorder.state === 'recording') return 'listening';
    if (recorder.state === 'working' || transcribing) return 'thinking';
    if (speech.speaking) return 'speaking';
    if (busy) return 'thinking';
    if (!micOn) return 'idle';
    return listener.awake ? 'listening' : 'waiting';
  }, [
    state,
    recorder.state,
    transcribing,
    speech.speaking,
    busy,
    micOn,
    listener.awake,
  ]);

  return {
    session,
    state,
    messages,
    streaming,
    searched,
    actions,
    error,
    mode,
    micOn,
    voiceOn,
    listener,
    recorder,
    transcribing,
    misheard,
    deviceId,
    setDeviceId,
    speech,
    setMicOn,
    setVoiceOn,
    signIn,
    signOut,
    send,
    stop,
    forget,
    rename,
    clear,
    setAttention,
    google,
    refreshGoogle,
    disconnectGoogle: async () => {
      await api.disconnectGoogle();
      refreshGoogle();
    },
  };
}
