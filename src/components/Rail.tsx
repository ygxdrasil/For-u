import {
  Briefcase,
  Gamepad2,
  House,
  Circle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type {Workspace} from '../../shared/types';

/**
 * The rooms of the app, down the left edge.
 *
 * A rail rather than a row across the top: it leaves the full height for
 * content, it reads as an application rather than a website, and on a phone it
 * folds flat along the bottom where a thumb already is.
 *
 * Which rooms exist is data from the server, so this renders whatever is
 * there — including rooms the user made themselves, which is the entire point
 * of the arrangement.
 */

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  house: House,
  briefcase: Briefcase,
  gamepad: Gamepad2,
};

/** Kept here rather than built from a string, so Tailwind keeps the classes. */
export const ACCENT: Record<
  Workspace['accent'],
  {text: string; ring: string; glow: string; soft: string}
> = {
  ice: {
    text: 'text-ice',
    ring: 'ring-ice/40',
    glow: 'bg-ice/15',
    soft: 'border-ice/40',
  },
  amber: {
    text: 'text-amber-300',
    ring: 'ring-amber-300/40',
    glow: 'bg-amber-300/15',
    soft: 'border-amber-300/40',
  },
  violet: {
    text: 'text-violet-300',
    ring: 'ring-violet-300/40',
    glow: 'bg-violet-300/15',
    soft: 'border-violet-300/40',
  },
  rose: {
    text: 'text-rose-300',
    ring: 'ring-rose-300/40',
    glow: 'bg-rose-300/15',
    soft: 'border-rose-300/40',
  },
};

export function Rail({
  rooms,
  current,
  onPick,
}: {
  rooms: Workspace[];
  current: string;
  onPick: (id: string) => void;
}) {
  return (
    <nav
      // Phones only now. On a wide screen the sidebar carries the rooms, and two
      // lists of the same four things is one list too many.
      className="flex shrink-0 gap-1 border-edge/70 bg-surface/30 p-1.5 max-lg:order-last max-lg:border-t lg:hidden"
      aria-label="Workspaces">
      {rooms.map((room) => {
        const Icon = ICONS[room.icon] ?? Circle;
        const accent = ACCENT[room.accent] ?? ACCENT.ice;
        const here = room.id === current;

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onPick(room.id)}
            aria-current={here ? 'page' : undefined}
            title={room.blurb ?? room.name}
            className={`group flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition lg:flex-none ${
              here
                ? `${accent.glow} ${accent.text}`
                : 'text-mist/60 hover:bg-surface/60 hover:text-slate-200'
            }`}>
            <Icon size={18} strokeWidth={here ? 2 : 1.6} />
            <span className="text-[0.58rem] tracking-wide">{room.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
