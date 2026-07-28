import {useCallback, useEffect, useState} from 'react';
import * as api from '../lib/api';
import {MANY_CONVERSATIONS} from '../lib/features';

/**
 * Which conversations exist, and which one you are in.
 *
 * Switching is a server-side fact rather than a client one: she writes into
 * whichever conversation is current, and the pulse, the greeting and the
 * background reflection all reach the same store from outside this browser
 * tab. Keeping "which one" in a page would mean two devices quietly writing
 * into different threads while both showed the same title.
 */
export function useChats(onSwitched: () => void) {
  const [chats, setChats] = useState<api.Chat[]>([]);
  const [current, setCurrent] = useState('main');

  const load = useCallback(async () => {
    // Switched off: nothing can create a second conversation, so the list is
    // always one item and fetching it is a request per load for nothing.
    if (!MANY_CONVERSATIONS) return;
    const got = await api.fetchChats().catch(() => null);
    if (!got) return;
    setChats(got.chats);
    setCurrent(got.current);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const start = useCallback(async () => {
    const got = await api.newChat();
    setChats(got.chats);
    setCurrent(got.current);
    // The transcript has to be reloaded, not merely emptied: the new
    // conversation is empty on the server and the old one must not linger on
    // screen looking like it is still the one being written to.
    onSwitched();
  }, [onSwitched]);

  const open = useCallback(
    async (id: string) => {
      if (id === current) return;
      const got = await api.openChat(id);
      setChats(got.chats);
      setCurrent(got.current);
      onSwitched();
    },
    [current, onSwitched],
  );

  const archive = useCallback(
    async (id: string) => {
      const got = await api.archiveChat(id);
      setChats(got.chats);
      // Putting away the one you are in moves you somewhere real.
      if (got.current !== current) {
        setCurrent(got.current);
        onSwitched();
      }
    },
    [current, onSwitched],
  );

  return {chats, current, start, open, archive, refresh: load};
}
