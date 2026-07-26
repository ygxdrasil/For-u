import {useCallback, useEffect, useState} from 'react';
import type {Workspace} from '../../shared/types';

/**
 * Which rooms exist, which one you are in, and opening pages on her say-so.
 *
 * The opening is the part worth explaining. A server cannot open a browser
 * tab; only the page in front of you can, and browsers refuse even that unless
 * they believe a person asked for it. Speaking to her counts as asking, but the
 * instruction arrives moments later down a stream, by which time the browser
 * has often stopped believing it.
 *
 * So this tries, and when the browser says no it hands back the links instead
 * of pretending. She is told the same thing, and says "they're there if the
 * browser let them through" rather than claiming it definitely worked.
 */

export function useRooms() {
  const [rooms, setRooms] = useState<Workspace[]>([]);
  const [current, setCurrent] = useState('grace');
  /** Links a popup blocker refused, so they can still be tapped. */
  const [blocked, setBlocked] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/workspaces')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: {workspaces?: Workspace[]} | null) => {
        if (body?.workspaces?.length) setRooms(body.workspaces);
      })
      .catch(() => {});
  }, []);

  const open = useCallback((urls: string[]) => {
    if (urls.length === 0) return;

    const refused: string[] = [];
    urls.forEach((url, index) => {
      // The first goes to the foreground, the rest behind it — you asked to be
      // taken to the main one, not to have four tabs fight over you.
      const window_ = window.open(url, '_blank', index === 0 ? '' : 'noopener');
      if (window_) {
        if (index === 0) window_.focus();
      } else {
        refused.push(url);
      }
    });

    setBlocked(refused);
  }, []);

  const enter = useCallback(
    (id: string, alsoOpen = false) => {
      setCurrent(id);
      setBlocked([]);
      if (!alsoOpen) return;
      const room = rooms.find((one) => one.id === id);
      if (room) open(room.opens);
    },
    [open, rooms],
  );

  const room = rooms.find((one) => one.id === current) ?? rooms[0] ?? null;

  return {rooms, room, current, enter, open, blocked, dismissBlocked: () => setBlocked([])};
}
