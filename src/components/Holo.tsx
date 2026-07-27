import {X} from 'lucide-react';
import {useEffect} from 'react';
import type {Mode} from '../hooks/useGrace';
import {Waveform} from './Waveform';

/**
 * The projection mode, for an acrylic pyramid.
 *
 * Light cannot leave a flat screen — no code changes that. What a Pepper's
 * ghost pyramid does is bend a screen's own light so it appears to float, and
 * for that it needs the image mirrored into four quadrants around a black
 * centre, each facing outward. Lay the phone or tablet flat, stand the pyramid
 * on it, and she hangs in the middle of it.
 *
 * So this is not a gimmick layer over the normal view: it is the specific
 * layout that hardware requires, which is why it earns its own mode.
 */

const LABEL: Record<Mode, string> = {
  offline: 'offline',
  idle: 'ready',
  waiting: 'listening',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
};

function Face({mode, level, now, rotate}: {mode: Mode; level: number; now: Date; rotate: number}) {
  return (
    <div
      className="absolute left-1/2 top-1/2 flex h-40 w-56 -translate-x-1/2 flex-col items-center justify-start"
      style={{transform: `translate(-50%, -50%) rotate(${rotate}deg) translateY(-8rem)`}}>
      <p className="font-serif text-3xl tracking-wide text-slate-100 tabular-nums">
        {now.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
      </p>
      <div className="mt-1 w-48">
        <Waveform mode={mode} level={level} height={70} />
      </div>
      <p className="text-[0.55rem] uppercase tracking-[0.35em] text-mist/60">{LABEL[mode]}</p>
    </div>
  );
}

export function Holo({
  mode,
  level,
  now,
  onClose,
}: {
  mode: Mode;
  level: number;
  now: Date;
  onClose: () => void;
}) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);

  // Four copies, each rotated to face out of one side of the pyramid.
  return (
    <div className="fixed inset-0 z-[70] bg-black">
      <button
        type="button"
        onClick={onClose}
        aria-label="Leave projection"
        className="absolute right-4 top-4 z-10 rounded-full border border-edge/50 p-2 text-mist/40 transition hover:text-slate-200">
        <X size={16} />
      </button>
      <div className="relative h-full w-full">
        {[0, 90, 180, 270].map((angle) => (
          <Face key={angle} mode={mode} level={level} now={now} rotate={angle} />
        ))}
      </div>
    </div>
  );
}
