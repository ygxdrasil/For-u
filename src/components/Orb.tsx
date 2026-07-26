import type {Mode} from '../hooks/useGrace.ts';

const CORE_ANIMATION: Record<Mode, string> = {
  offline: '',
  idle: 'orb-idle',
  waiting: 'orb-waiting',
  listening: 'orb-listening',
  thinking: 'orb-waiting',
  speaking: 'orb-speaking',
};

/** How lit the orb is in each state — dim when dormant, bright when engaged. */
const CORE_GLOW: Record<Mode, string> = {
  offline: 'from-slate-700/40 to-slate-900/10',
  idle: 'from-slate-500/40 to-slate-800/10',
  waiting: 'from-ice/40 to-ice/5',
  listening: 'from-ice/80 to-ice/10',
  thinking: 'from-ice/50 to-ice/5',
  speaking: 'from-ice/70 to-ice/10',
};

interface OrbProps {
  mode: Mode;
  /**
   * Live input level, 0 to 1. The orb swells with your voice, which is the
   * quickest possible confirmation that she is actually hearing you — no
   * reading a meter, no interpreting a message.
   */
  level?: number;
  /** Press to talk. Given, the orb becomes the primary control. */
  onPress?: () => void;
  /** The microphone is mid-handshake; a second press would strand the first. */
  busy?: boolean;
}

export function Orb({mode, level = 0, onPress, busy = false}: OrbProps) {
  // Damped, and floored at 1, so the orb never shrinks below its resting size
  // and never lurches on a single loud sample.
  const swell = 1 + Math.min(0.28, level * 0.5);
  const reactive = mode === 'listening' && level > 0;

  const body = (
    <div className="relative grid h-52 w-52 place-items-center">
      {/* Ripples out while she is taking something in. */}
      {mode === 'listening' && (
        <>
          <span className="orb-ring absolute h-36 w-36 rounded-full border border-ice/30" />
          <span
            className="orb-ring absolute h-36 w-36 rounded-full border border-ice/20"
            style={{animationDelay: '1.3s'}}
          />
        </>
      )}

      {/* A single arc turning, for the pause while she thinks. */}
      {mode === 'thinking' && (
        <span className="orb-spin absolute h-44 w-44 rounded-full border border-transparent border-t-ice/70 border-r-ice/20" />
      )}

      <span className="absolute h-40 w-40 rounded-full border border-edge/80" />
      <span className="orbit-sweep absolute h-48 w-48 rounded-full border border-dashed border-edge/40" />

      <span
        className={`absolute h-32 w-32 rounded-full bg-gradient-to-b blur-xl ${CORE_GLOW[mode]} ${
          reactive ? '' : CORE_ANIMATION[mode]
        }`}
        style={reactive ? {transform: `scale(${swell})`} : undefined}
      />
      <span
        className={`absolute h-20 w-20 rounded-full bg-gradient-to-b ${CORE_GLOW[mode]} ${
          reactive ? '' : CORE_ANIMATION[mode]
        }`}
        style={
          reactive
            ? {transform: `scale(${swell})`, transition: 'transform 60ms linear'}
            : undefined
        }
      />
      <span className="absolute h-3 w-3 rounded-full bg-slate-100/90 blur-[2px]" />
    </div>
  );

  if (!onPress) return body;

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={busy}
      aria-label={mode === 'listening' ? 'Listening — speak now' : 'Press to speak'}
      className="group rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-ice/50 disabled:cursor-wait">
      {body}
      <span className="mt-1 block text-center text-[0.65rem] uppercase tracking-[0.18em] text-mist/40 transition group-hover:text-ice/70">
        {busy ? 'One moment' : mode === 'listening' ? 'Listening' : 'Press to speak'}
      </span>
    </button>
  );
}
