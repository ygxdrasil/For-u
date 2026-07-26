import {
  Brain,
  CalendarDays,
  Database,
  Ear,
  Globe,
  Mail,
  ShieldCheck,
  Volume2,
  Wallet,
} from 'lucide-react';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import type {
  AttentionMode,
  Concern,
  GoogleStatus,
  GraceState,
  Message,
  Workspace,
} from '../../shared/types';
import type {Mode} from '../hooks/useGrace';
import {Day} from './Day';
import {Faculties, type Faculty} from './Faculties';
import {Orb} from './Orb';

/** Kept in step with server/modes.ts, which is where the behaviour lives. */
const MODES: {id: AttentionMode; label: string; blurb: string}[] = [
  {id: 'open', label: 'Open', blurb: 'Speaks up when it’s worth it'},
  {id: 'work', label: 'Work', blurb: 'Brisk. Personal matters wait'},
  {id: 'focus', label: 'Focus', blurb: 'Answers only, nothing offered'},
  {id: 'away', label: 'Away', blurb: 'Takes messages and holds them'},
];

const MODE_LABEL: Record<Mode, string> = {
  offline: 'Not configured',
  idle: 'Ready',
  waiting: 'Listening for “Grace”',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

function sinceLabel(iso: string): string {
  const started = new Date(iso).getTime();
  if (!Number.isFinite(started) || started <= 0) return '';
  const minutes = Math.floor((Date.now() - started) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}

function Readout({
  icon,
  label,
  value,
  tone = 'normal',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: 'normal' | 'good' | 'bad';
}) {
  const colour =
    tone === 'good' ? 'text-ice' : tone === 'bad' ? 'text-rose-300' : 'text-slate-200';
  return (
    <div className="rounded-lg border border-edge/70 bg-surface/40 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-mist/50">
        {icon}
        {label}
      </div>
      <div className={`mt-1 truncate text-sm ${colour}`} title={value}>
        {value}
      </div>
    </div>
  );
}

interface DashboardProps {
  state: GraceState;
  /** The live transcript, not the snapshot inside `state`. */
  messages: Message[];
  mode: Mode;
  micLevel: number;
  recording: boolean;
  micBusy: boolean;
  micError: string | null;
  voiceSource: 'grace' | 'browser';
  voiceOn: boolean;
  google: GoogleStatus | null;
  /** What she has noticed on her own, and why she may be holding it back. */
  concerns: Concern[];
  held: string | null;
  lastLookedAt: number | null;
  /** Which room you are in. Decides what this panel shows. */
  room: Workspace | null;
  onSetAttention: (mode: AttentionMode) => void;
  onTalk: () => void;
  onOpenSoundCheck: () => void;
}

/**
 * The panel that makes her feel present rather than parked.
 *
 * Everything here is real: her actual state, the time she is working from, the
 * count of what she remembers, where that memory lives, and what the
 * microphone is picking up this instant. Nothing is a placeholder — a readout
 * that isn't true is worse than no readout.
 */
export function Dashboard({
  state,
  messages,
  mode,
  micLevel,
  recording,
  micBusy,
  micError,
  voiceSource,
  voiceOn,
  google,
  concerns,
  held,
  lastLookedAt,
  room,
  onSetAttention,
  onTalk,
  onOpenSoundCheck,
}: DashboardProps) {
  const now = useClock();
  // A room lists the panels it wants. An unknown or empty room shows
  // everything, which is what the single-screen version always did.
  const wants = (name: string) =>
    !room || room.panels.length === 0 || room.panels.includes(name);
  const attention = state.mode.mode;
  const heldFor = sinceLabel(state.mode.since);

  const spokenTurns = messages.filter((message) => message.via === 'voice').length;
  const latest = [...state.profile.entries].slice(-3).reverse();

  const faculties = useMemo<Faculty[]>(
    () => [
      {
        id: 'hearing',
        label: 'Hearing',
        detail: micError
          ? 'Needs a look'
          : recording
            ? 'Listening now'
            : 'Ready',
        health: micError ? 'degraded' : recording ? 'live' : 'idle',
        icon: <Ear size={14} />,
      },
      {
        id: 'voice',
        label: 'Voice',
        detail: !voiceOn
          ? 'Muted'
          : voiceSource === 'grace'
            ? 'Her own'
            : 'Browser’s',
        health: !voiceOn ? 'idle' : voiceSource === 'grace' ? 'live' : 'degraded',
        icon: <Volume2 size={14} />,
      },
      {
        id: 'memory',
        label: 'Memory',
        detail: `${state.profile.entries.length} held`,
        health: 'live',
        icon: <Brain size={14} />,
      },
      {
        id: 'web',
        label: 'Web',
        detail: 'Searches when needed',
        health: 'live',
        icon: <Globe size={14} />,
      },
      {
        id: 'mail',
        label: 'Mail',
        detail: google?.problem
          ? 'Needs reconnecting'
          : google?.connected
            ? 'Reading only'
            : 'Not connected',
        health: google?.problem ? 'degraded' : google?.connected ? 'live' : 'absent',
        icon: <Mail size={14} />,
      },
      {
        id: 'diary',
        label: 'Diary',
        detail: google?.problem
          ? 'Needs reconnecting'
          : google?.connected
            ? 'Reading your day'
            : 'Not connected',
        health: google?.problem ? 'degraded' : google?.connected ? 'live' : 'absent',
        icon: <CalendarDays size={14} />,
      },
    ],
    [google, micError, recording, state.profile.entries.length, voiceOn, voiceSource],
  );

  return (
    <div
      className={`scroll-thin flex h-full flex-col gap-5 overflow-y-auto px-5 py-5 ${
        mode === 'thinking' ? 'sheen' : ''
      }`}>
      <div className="flex flex-col items-center">
        {/* The orb is the control now, not an ornament. Pressing it is the one
            way in that cannot be got wrong. */}
        <Orb mode={mode} level={micLevel} onPress={onTalk} busy={micBusy} />
        <p className="mt-2 text-sm text-slate-200">{MODE_LABEL[mode]}</p>
      </div>

      <div className="text-center">
        <p className="font-serif text-4xl tracking-wide text-slate-100 tabular-nums">
          {/* Keyed on the minute, so the new figure settles in rather than
              swapping. It is the one thing on screen that is always true. */}
          <span key={now.getMinutes()} className="settle inline-block">
            {now.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
          </span>
        </p>
        {/* The minute filling up. Slow enough to be atmosphere, not a timer. */}
        <div className="mx-auto mt-1.5 h-px w-24 overflow-hidden bg-edge">
          <div className="sweep h-full w-full bg-ice/50" />
        </div>
        <p className="mt-1.5 text-xs text-mist/60">
          {now.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {(wants('day') || wants('needs') || wants('deeds')) && (
        <Day refreshKey={lastLookedAt} concerns={concerns} held={held} />
      )}

      {wants('faculties') && (
      <div>
        <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
          Faculties
        </h3>
        <Faculties
          faculties={faculties}
          onSelect={(id) => {
            if (id === 'hearing' || id === 'voice') onOpenSoundCheck();
            if ((id === 'mail' || id === 'diary') && google?.configured) {
              // A full page visit rather than a fetch: Google's consent screen
              // will not load inside anything.
              window.location.href = '/api/google-start';
            }
          }}
        />

        {google && !google.connected && (
          <div className="mt-2 rounded-lg border border-edge/70 bg-surface/40 px-3 py-2.5">
            {google.configured ? (
              <>
                <p className="text-xs leading-relaxed text-mist/80">
                  Connect Gmail and Calendar and she can read your day.
                </p>
                <a
                  href="/api/google-start"
                  className="mt-2 inline-block rounded-full border border-ice/40 bg-ice/15 px-3 py-1 text-xs text-ice transition hover:bg-ice/25">
                  Connect Google
                </a>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-mist/70">
                Mail and diary need Google keys. See{' '}
                <span className="font-mono text-mist/90">GOOGLE-SETUP.md</span> — it’s
                two values pasted into Vercel.
              </p>
            )}
          </div>
        )}

        {google?.problem && (
          <p className="mt-2 rounded-lg border border-ember/25 bg-ember/10 px-3 py-2 text-xs leading-relaxed text-ember/90">
            {google.problem}{' '}
            <a href="/api/google-start" className="underline underline-offset-2">
              Reconnect
            </a>
          </p>
        )}
      </div>
      )}

      {wants('attention') && (
      <div>
        <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
          Attention {heldFor && <span className="text-mist/35">· {heldFor}</span>}
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSetAttention(option.id)}
              title={option.blurb}
              aria-pressed={attention === option.id}
              className={`rounded-lg border px-2 py-2 text-left transition ${
                attention === option.id
                  ? 'border-ice/40 bg-ice/15 text-ice'
                  : 'border-edge bg-surface/40 text-mist hover:border-ice/30 hover:text-slate-200'
              }`}>
              <span className="block text-xs font-medium">{option.label}</span>
              <span className="mt-0.5 block text-[0.6rem] leading-tight text-mist/50">
                {option.blurb}
              </span>
            </button>
          ))}
        </div>
      </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        <Readout
          icon={<Brain size={11} />}
          label="Remembers"
          value={`${state.profile.entries.length} ${
            state.profile.entries.length === 1 ? 'thing' : 'things'
          }`}
        />
        <Readout
          icon={<Ear size={11} />}
          label="Exchanges"
          value={`${Math.floor(messages.length / 2)}${
            spokenTurns > 0 ? ` · ${spokenTurns} spoken` : ''
          }`}
        />
        <Readout
          icon={<Database size={11} />}
          label="Memory"
          value={state.storage.backend}
        />
        <Readout
          icon={<ShieldCheck size={11} />}
          label="At rest"
          value={state.storage.encrypted ? 'Encrypted' : 'Plain'}
          tone={state.storage.encrypted ? 'good' : 'bad'}
        />
        <Readout
          icon={<Wallet size={11} />}
          label="This month"
          value={`$${state.spend.dollars.toFixed(2)} of $${state.spend.cap}`}
          tone={state.spend.dollars >= state.spend.cap ? 'bad' : 'normal'}
        />
      </div>

      {wants('learned') && latest.length > 0 && (
        <div>
          <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
            Lately learned
          </h3>
          <ul className="space-y-1.5">
            {latest.map((entry) => (
              <li
                key={entry.id}
                className="rise rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs leading-relaxed text-slate-300">
                {entry.text}
                <span className="ml-1.5 text-[0.6rem] uppercase tracking-wider text-mist/40">
                  {entry.source}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.summary && (
        <div>
          <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
            Where you left off
          </h3>
          <p className="rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs leading-relaxed text-mist/80">
            {state.summary}
          </p>
        </div>
      )}

      <p className="pb-2 text-center text-[0.6rem] text-mist/30">{state.model}</p>
    </div>
  );
}
