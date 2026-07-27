import {useEffect, useRef} from 'react';
import type {Mode} from '../hooks/useGrace';

/**
 * Her, as a line of light.
 *
 * Flat when nothing is happening, which was asked for and is the better
 * choice anyway: a shape that is always moving stops meaning anything, and
 * the whole value of this is that you can tell across a room whether she is
 * listening, thinking, or talking.
 *
 * Drawn on a canvas rather than built from elements. A hundred animated divs
 * is how you make a laptop's fan audible, and this runs all day on a machine
 * that never sleeps.
 */

interface Props {
  mode: Mode;
  /** Live microphone level, 0 to 1. */
  level: number;
  /** How tall the line is allowed to get. */
  height?: number;
  onPress?: () => void;
}

const COLOUR: Record<Mode, [number, number, number]> = {
  offline: [120, 113, 143],
  idle: [168, 139, 250],
  waiting: [168, 139, 250],
  listening: [192, 132, 252],
  thinking: [244, 114, 182],
  speaking: [216, 130, 250],
};

export function Waveform({mode, level, height = 120, onPress}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Read inside the animation loop rather than closed over, so the loop is
  // started once and never restarted by a changing prop.
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let time = 0;
    /** Eased towards the target so she never snaps between states. */
    let energy = 0;

    const draw = () => {
      const width = canvas.clientWidth;
      const tall = canvas.clientHeight;
      const ratio = window.devicePixelRatio || 1;

      if (canvas.width !== width * ratio || canvas.height !== tall * ratio) {
        canvas.width = width * ratio;
        canvas.height = tall * ratio;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, tall);

      const state = modeRef.current;
      // Flat until she is addressed. Thinking and speaking have a life of
      // their own; listening follows the room.
      const target =
        state === 'listening'
          ? 0.25 + Math.min(1, levelRef.current * 3) * 0.75
          : state === 'speaking'
            ? 0.55
            : state === 'thinking'
              ? 0.3
              : 0;

      energy += (target - energy) * 0.09;
      time += state === 'thinking' ? 0.05 : 0.035;

      const middle = tall / 2;
      const [red, green, blue] = COLOUR[state];

      /** The line's shape at a given point, offset in time and in phase. */
      const trace = (shift: number, lift: number) => {
        context.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const across = x / width;
          // Pinned at both ends, fullest in the middle, so it reads as a
          // single object rather than a strip that has been cut off.
          const envelope = Math.sin(across * Math.PI) ** 1.6;
          const wave =
            Math.sin(across * 11 + time * 1.7 + shift) * 0.55 +
            Math.sin(across * 19 - time * 2.3 + shift) * 0.3 +
            Math.sin(across * 4.5 + time * 0.9 + shift) * 0.15;

          const y = middle + wave * envelope * energy * (tall * 0.42) * lift;
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
      };

      context.lineCap = 'round';

      /**
       * Chromatic split: the same line drawn twice more, a hair out of phase,
       * in the two colours either side of hers, added rather than painted over.
       *
       * This is what a bright emitter does to a lens, and it is most of the
       * difference between a line that is coloured and a line that is glowing.
       * Only while there is something to see — at rest it would be a smear.
       */
      if (energy > 0.05) {
        context.globalCompositeOperation = 'lighter';
        trace(0.35, 0.94);
        context.strokeStyle = `rgba(120, 190, 255, ${0.3 * energy})`;
        context.lineWidth = 2;
        context.stroke();

        trace(-0.35, 1.06);
        context.strokeStyle = `rgba(255, 120, 200, ${0.3 * energy})`;
        context.lineWidth = 2;
        context.stroke();
        context.globalCompositeOperation = 'source-over';
      }

      // Three passes at decreasing opacity make the line look like it is
      // emitting light rather than being drawn in it. The widest pass is also
      // blurred, so the falloff is soft the way real light is rather than a
      // stack of three visible strokes.
      for (let pass = 0; pass < 3; pass += 1) {
        const thickness = [9, 3, 1.4][pass];
        const alpha = [0.09, 0.26, 0.95][pass];
        context.filter = pass === 0 ? 'blur(6px)' : 'none';
        trace(0, 1);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.lineWidth = thickness;
        context.stroke();
      }
      context.filter = 'none';

      // A dot at rest, so she is never simply absent from the screen — with
      // its own small halo, since a bare 2px circle reads as a dead pixel.
      if (energy < 0.04) {
        const breath = 0.75 + Math.sin(time * 0.9) * 0.25;
        context.beginPath();
        context.arc(width / 2, middle, 9, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.1 * breath})`;
        context.fill();

        context.beginPath();
        context.arc(width / 2, middle, 2.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.85 * breath})`;
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label="Talk to Grace"
      className="group relative block w-full"
      style={{height}}>
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* The light it casts on whatever is behind it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-1/2 -z-10 h-16 -translate-y-1/2 rounded-full opacity-60 blur-2xl transition"
        style={{background: `rgb(${COLOUR[mode].join(' ')} / 0.35)`}}
      />
    </button>
  );
}
