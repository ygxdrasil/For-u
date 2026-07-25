import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {
  GraceState,
  InputMode,
  Message,
  Profile,
} from '../../shared/types.ts';
import * as api from '../lib/api.ts';
import {useListener} from '../voice/useListener.ts';
import {useSpeech} from '../voice/useSpeech.ts';

export type Mode = 'offline' | 'idle' | 'waiting' | 'listening' | 'thinking' | 'speaking';

export function useGrace() {
  const [state, setState] = useState<GraceState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const speech = useSpeech(voiceOn);

  useEffect(() => {
    api
      .fetchState()
      .then((loaded) => {
        setState(loaded);
        setMessages(loaded.messages);
      })
      .catch((cause: Error) => setError(cause.message));
  }, []);

  const send = useCallback(
    async (text: string, via: InputMode) => {
      const spoken = text.trim();
      if (!spoken || abortRef.current) return;

      setError(null);
      setBusy(true);
      setStreaming('');
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
      const speakIt = via === 'voice' && voiceOn;

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
          } else if (event.type === 'learned') {
            setState((current) =>
              current
                ? {
                    ...current,
                    profile: {
                      ...current.profile,
                      entries: [...current.profile.entries, ...event.entries],
                    },
                  }
                : current,
            );
          } else if (event.type === 'error') {
            setError(event.message);
            setStreaming('');
          }
        }
      } catch (cause) {
        if ((cause as Error).name !== 'AbortError') {
          setError((cause as Error).message);
        }
        setStreaming('');
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [speech, voiceOn],
  );

  const handleRequest = useCallback(
    (text: string) => {
      void send(text, 'voice');
    },
    [send],
  );

  const listener = useListener({
    enabled: micOn,
    // Deaf while she is thinking or talking, so she never answers herself.
    paused: busy || speech.speaking,
    onRequest: handleRequest,
  });

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

  const clear = useCallback(async () => {
    await api.clearConversation();
    setMessages([]);
    setStreaming('');
  }, []);

  const mode: Mode = useMemo(() => {
    if (state && !state.ready) return 'offline';
    if (speech.speaking) return 'speaking';
    if (busy) return 'thinking';
    if (!micOn) return 'idle';
    return listener.awake ? 'listening' : 'waiting';
  }, [state, speech.speaking, busy, micOn, listener.awake]);

  return {
    state,
    messages,
    streaming,
    error,
    mode,
    micOn,
    voiceOn,
    listener,
    speech,
    setMicOn,
    setVoiceOn,
    send,
    stop,
    forget,
    rename,
    clear,
  };
}
