import {useEffect} from 'react';

/**
 * Keeps the machine awake while she is listening.
 *
 * A laptop left in the corner of a room is only always-on if it stays awake,
 * and a screen lock suspends the page — at which point the microphone is
 * released and she is deaf without saying so.
 *
 * The lock is dropped the moment listening stops, so she never holds a machine
 * awake for nothing.
 */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const supported = 'wakeLock' in navigator;
    if (!supported) return;

    let lock: WakeLockSentinel | null = null;
    let dropped = false;

    const take = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
      } catch {
        // Refused when the tab is hidden or the battery is low. Not fatal, and
        // the visibility handler below will try again when we come back.
      }
    };

    // The browser releases the lock whenever the tab is hidden, and does not
    // give it back on its own.
    const reclaim = () => {
      if (!dropped && document.visibilityState === 'visible') void take();
    };

    void take();
    document.addEventListener('visibilitychange', reclaim);

    return () => {
      dropped = true;
      document.removeEventListener('visibilitychange', reclaim);
      void lock?.release().catch(() => {});
    };
  }, [active]);
}
