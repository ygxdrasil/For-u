import type {ReactNode} from 'react';

export type FacultyHealth = 'live' | 'idle' | 'degraded' | 'absent';

export interface Faculty {
  id: string;
  label: string;
  /** One short line, in plain words, about what this is doing right now. */
  detail: string;
  health: FacultyHealth;
  icon: ReactNode;
}

const TONE: Record<FacultyHealth, {dot: string; text: string; ring: string}> = {
  live: {dot: 'bg-ice', text: 'text-ice', ring: 'border-ice/40'},
  idle: {dot: 'bg-mist/50', text: 'text-mist', ring: 'border-edge'},
  degraded: {dot: 'bg-ember', text: 'text-ember/90', ring: 'border-ember/40'},
  absent: {dot: 'bg-slate-600', text: 'text-mist/50', ring: 'border-edge/60'},
};

/**
 * Her faculties, as a ring of small orbs around the core.
 *
 * Each one is a real subsystem reporting its own state — hearing, voice,
 * memory, the web, and the connections that are not built yet. The point is
 * that a glance tells you what is working, which is what was missing when the
 * only feedback for a broken microphone was that nothing happened.
 */
export function Faculties({
  faculties,
  onSelect,
}: {
  faculties: Faculty[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {faculties.map((faculty) => {
        const tone = TONE[faculty.health];
        return (
          <button
            key={faculty.id}
            type="button"
            onClick={() => onSelect?.(faculty.id)}
            title={faculty.detail}
            className={`satellite group relative flex flex-col items-center gap-1.5 rounded-xl border ${tone.ring} bg-surface/40 px-2 py-3 text-center transition hover:bg-surface/80`}
            style={{animationDelay: `${faculty.id.length * 0.7}s`}}>
            {/* The orb itself. Lit ones breathe; the rest sit still. */}
            <span className="relative grid h-7 w-7 place-items-center">
              <span
                className={`absolute h-7 w-7 rounded-full ${tone.dot} opacity-20 blur-md ${
                  faculty.health === 'live' ? 'satellite-live' : ''
                }`}
              />
              <span className={`relative ${tone.text}`}>{faculty.icon}</span>
            </span>

            {/* Label and colour only. The dot already says live, idle, or
                broken; spelling it out underneath was six lines of text
                answering a question the colour had answered. The words are
                still there on hover, and she can be asked. */}
            <span className={`text-[0.6rem] uppercase tracking-[0.1em] ${tone.text}`}>
              {faculty.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
