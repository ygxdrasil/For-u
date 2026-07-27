import {Timer as TimerIcon} from 'lucide-react';
import {useTimers} from '../hooks/useTimers';

/**
 * Running timers, along the bottom, counting down where you can see them.
 *
 * The ringing lives in the hook; this is only the face of it. Absent entirely
 * when nothing is running, so it costs no space the rest of the time.
 */

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function Timers({enabled}: {enabled: boolean}) {
  const {timers} = useTimers(enabled);
  if (timers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 border-t border-edge/70 bg-surface/30 px-4 py-2">
      {timers.map((timer) => (
        <span
          key={timer.id}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs tabular-nums ${
            timer.secondsLeft <= 10
              ? 'attend border-rose-400/40 text-rose-200'
              : 'border-ice/30 text-ice/90'
          }`}>
          <TimerIcon size={11} />
          {timer.label} · {clock(timer.secondsLeft)}
        </span>
      ))}
    </div>
  );
}
