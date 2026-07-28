import {
  Briefcase,
  FolderOpen,
  Gamepad2,
  House,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import {useState} from 'react';
import type {Workspace} from '../../shared/types';
import type {Chat} from '../lib/api';

/**
 * The left edge: conversations, rooms, and the way in to everything else.
 *
 * Replaces a rail of four icons, and the difference is not decoration. A rail
 * says "this app has four screens". A list of conversations says "this is a
 * thing you work in, and the work accumulates" — which is what she became when
 * she stopped being something you only spoke to.
 *
 * Collapsible, and the state is kept: on a laptop screen a permanent 15rem of
 * sidebar is a real cost when what you actually want is the transcript, and
 * anyone who has closed it once means it.
 */

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  house: House,
  briefcase: Briefcase,
  gamepad: Gamepad2,
};

interface Props {
  chats: Chat[];
  currentChat: string;
  rooms: Workspace[];
  currentRoom: string;
  onNewChat: () => void;
  onOpenChat: (id: string) => void;
  onArchiveChat: (id: string) => void;
  onRoom: (id: string) => void;
  onFiles: () => void;
  onSettings: () => void;
}

function when(iso: string): string {
  const at = new Date(iso).getTime();
  if (!Number.isFinite(at) || at <= 0) return '';
  const days = Math.floor((Date.now() - at) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d`;
  return new Date(at).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
}

export function Sidebar({
  chats,
  currentChat,
  rooms,
  currentRoom,
  onNewChat,
  onOpenChat,
  onArchiveChat,
  onRoom,
  onFiles,
  onSettings,
}: Props) {
  const [open, setOpen] = useState(
    () => localStorage.getItem('grace-sidebar') !== 'closed',
  );
  const [filter, setFilter] = useState('');

  const toggle = () => {
    setOpen((now) => {
      localStorage.setItem('grace-sidebar', now ? 'closed' : 'open');
      return !now;
    });
  };

  const needle = filter.toLowerCase().trim();
  const shown = needle
    ? chats.filter((chat) => chat.title.toLowerCase().includes(needle))
    : chats;

  if (!open) {
    return (
      <div className="hidden shrink-0 flex-col items-center gap-2 border-r border-edge/70 px-2 py-3 lg:flex">
        <button
          type="button"
          onClick={toggle}
          aria-label="Show conversations"
          className="grid h-9 w-9 place-items-center rounded-lg text-mist transition hover:bg-surface/60 hover:text-slate-200">
          <PanelLeftOpen size={17} />
        </button>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New conversation"
          className="grid h-9 w-9 place-items-center rounded-lg border border-ice/30 bg-ice/10 text-ice transition hover:bg-ice/20">
          <MessageSquarePlus size={17} />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-edge/70 lg:flex">
      <div className="flex items-center gap-1 px-3 py-3">
        <span className="flex-1 font-serif text-lg text-slate-100">Grace</span>
        <button
          type="button"
          onClick={toggle}
          aria-label="Hide conversations"
          className="grid h-8 w-8 place-items-center rounded-lg text-mist transition hover:bg-surface/60 hover:text-slate-200">
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-ice/30 bg-ice/10 px-3 py-2 text-xs text-ice transition hover:bg-ice/20">
          <MessageSquarePlus size={14} />
          New conversation
        </button>
      </div>

      {/* Only worth the space once there are enough to lose one in. */}
      {chats.length > 6 && (
        <div className="mt-3 px-3">
          <div className="flex items-center gap-2 rounded-lg border border-edge bg-surface/40 px-2.5 py-1.5">
            <Search size={12} className="shrink-0 text-mist/50" />
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Find a conversation"
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-200 placeholder:text-mist/40 focus:outline-none"
            />
          </div>
        </div>
      )}

      <nav className="scroll-thin mt-4 min-h-0 flex-1 overflow-y-auto px-2">
        <p className="label px-1 pb-1.5">Conversations</p>
        <ul className="space-y-0.5">
          {shown.map((chat) => (
            <li key={chat.id} className="group relative">
              <button
                type="button"
                onClick={() => onOpenChat(chat.id)}
                className={`flex w-full items-baseline gap-2 rounded-lg px-2.5 py-1.5 text-left transition ${
                  chat.id === currentChat
                    ? 'bg-ice/15 text-ice'
                    : 'text-slate-300 hover:bg-surface/60'
                }`}>
                <span className="min-w-0 flex-1 truncate text-xs">{chat.title}</span>
                <span className="shrink-0 text-[0.6rem] text-mist/40 group-hover:opacity-0">
                  {when(chat.lastAt)}
                </span>
              </button>
              {/* Archived, never removed — this is the record of everything
                  either of you said. Hidden until hover so the list stays a
                  list rather than a row of buttons. */}
              {chat.id !== 'main' && (
                <button
                  type="button"
                  onClick={() => onArchiveChat(chat.id)}
                  aria-label={`Put away ${chat.title}`}
                  title="Put away. Nothing is deleted"
                  className="absolute right-1.5 top-1.5 hidden rounded p-1 text-mist/50 transition hover:text-rose-300 group-hover:block">
                  <Trash2 size={11} />
                </button>
              )}
            </li>
          ))}
        </ul>

        <p className="label px-1 pb-1.5 pt-5">Rooms</p>
        <ul className="space-y-0.5">
          {rooms.map((room) => {
            const Icon = ICONS[room.icon] ?? Sparkles;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() => onRoom(room.id)}
                  title={room.blurb}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition ${
                    room.id === currentRoom
                      ? 'bg-ice/15 text-ice'
                      : 'text-slate-300 hover:bg-surface/60'
                  }`}>
                  <Icon size={13} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-xs">{room.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-edge/70 p-2">
        <button
          type="button"
          onClick={onFiles}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-300 transition hover:bg-surface/60">
          <FolderOpen size={13} /> Files &amp; research
        </button>
        <button
          type="button"
          onClick={onSettings}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-300 transition hover:bg-surface/60">
          <Settings2 size={13} /> What Grace knows
        </button>
      </div>
    </aside>
  );
}
