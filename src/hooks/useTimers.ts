import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * The client half of timers: the countdown, and the ringing.
 *
 * The server keeps the record — a reloaded page still knows the pasta exists —
 * but a serverless function cannot ring a bell in your kitchen. So the page
 * polls the list, counts the seconds itself, and when one runs out it rings:
 * sound, a notification if the tab is hidden, and the timer marked fired on
 * the server so it never rings twice, even with two tabs open (the server
 * mark is the arbiter; whichever tab reports first wins).
 */

export interface RunningTimer {
  id: string;
  label: string;
  at: string;
}

/** Three rising notes, louder than her ordinary chimes. It is an alarm. */
function ring(): void {
  try {
    const Ctor =
      window.AudioContext ??
      (window as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return;
    const audio = new Ctor();

    [523, 659, 784, 659, 784, 1047].forEach((hz, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = hz;
      oscillator.type = 'sine';
      const at = audio.currentTime + index * 0.22;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.12, at + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.22);
    });
  } catch {
    // A machine that cannot beep still gets the notification.
  }
}

export function useTimers(enabled: boolean) {
  const [timers, setTimers] = useState<RunningTimer[]>([]);
  /** Ticks every second so countdowns move; the value itself is the clock. */
  const [now, setNow] = useState(() => Date.now());
  const firedRef = useRef(new Set<string>());

  const load = useCallback(() => {
    fetch('/api/timers')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: {timers?: RunningTimer[]} | null) => {
        if (body?.timers) setTimers(body.timers);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!enabled) return;
    load();
    // The poll is cheap and the countdown is local; thirty seconds keeps a
    // timer set by voice on another device appearing before it matters.
    const poll = window.setInterval(load, 30_000);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, [enabled, load]);

  useEffect(() => {
    for (const timer of timers) {
      const due = new Date(timer.at).getTime();
      if (due > now || firedRef.current.has(timer.id)) continue;
      firedRef.current.add(timer.id);

      ring();
      // The tab may be buried; a notification reaches the desktop anyway.
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Grace', {body: `Time: ${timer.label}`, tag: `timer-${timer.id}`});
      }
      fetch('/api/timer-fired', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: timer.id}),
      }).catch(() => {});
      setTimers((current) => current.filter((one) => one.id !== timer.id));
    }
  }, [now, timers]);

  return {
    timers: timers
      .map((timer) => ({
        ...timer,
        secondsLeft: Math.max(0, Math.round((new Date(timer.at).getTime() - now) / 1000)),
      }))
      .sort((left, right) => left.secondsLeft - right.secondsLeft),
    refresh: load,
  };
}
