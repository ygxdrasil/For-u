import {Brain, Clock, Database, Radio, ShieldCheck} from 'lucide-react';
import {useEffect, useState, type ReactNode} from 'react';
import type {AttentionMode, GraceState} from '../../shared/types';
import type {Mode} from '../hooks/useGrace';
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
    // Tick on the second boundary rather than every second from mount, so the
    // display doesn't sit a fraction behind the real minute.
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
  mode: Mode;
  micLevel: number;
  recording: boolean;
  voiceSource: 'grace' | 'browser';
  onSetAttention: (mode: AttentionMode) => void;
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
  mode,
  micLevel,
  recording,
  voiceSource,
  onSetAttention,
}: DashboardProps) {
  const now = useClock();
  const attention = state.mode.mode;
  const held = sinceLabel(state.mode.since);

  const spokenTurns = state.messages.filter((message) => message.via === 'voice').length;
  const latest = [...state.profile.entries].slice(-3).reverse();

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-5 py-5">
      <div className="flex flex-col items-center">
        <Orb mode={mode} />
        <p className="mt-3 text-sm text-slate-200">{MODE_LABEL[mode]}</p>

        {/* What the microphone is hearing, right now. The single most useful
            thing on screen when the complaint is that she can't hear you. */}
        <div className="mt-3 h-1 w-40 overflow-hidden rounded-full bg-edge">
          <div
            className={`h-full rounded-full transition-[width] duration-75 ${
              recording ? 'bg-ice' : 'bg-mist/30'
            }`}
            style={{width: `${Math.min(100, micLevel * 180)}%`}}
          />
        </div>
        <p className="mt-1.5 text-[0.65rem] text-mist/40">
          {recording ? 'Microphone live' : 'Microphone idle'}
        </p>
      </div>

      <div className="text-center">
        <p className="font-serif text-4xl tracking-wide text-slate-100 tabular-nums">
          {now.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
        </p>
        <p className="mt-0.5 text-xs text-mist/60">
          {now.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
          Attention {held && <span className="text-mist/35">· {held}</span>}
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

      <div className="grid grid-cols-2 gap-1.5">
        <Readout
          icon={<Brain size={11} />}
          label="Remembers"
          value={`${state.profile.entries.length} ${
            state.profile.entries.length === 1 ? 'thing' : 'things'
          }`}
        />
        <Readout
          icon={<Clock size={11} />}
          label="Exchanges"
          value={`${Math.floor(state.messages.length / 2)}${
            spokenTurns > 0 ? ` · ${spokenTurns} spoken` : ''
          }`}
        />
        <Readout
          icon={<Radio size={11} />}
          label="Voice"
          value={voiceSource === 'grace' ? 'Hers' : 'Browser'}
          tone={voiceSource === 'grace' ? 'good' : 'normal'}
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
        <Readout icon={<Brain size={11} />} label="Model" value={state.model} />
      </div>

      {latest.length > 0 && (
        <div>
          <h3 className="mb-2 text-[0.62rem] uppercase tracking-[0.14em] text-mist/50">
            Lately learned
          </h3>
          <ul className="space-y-1.5">
            {latest.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-edge/60 bg-surface/30 px-3 py-2 text-xs leading-relaxed text-slate-300">
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
    </div>
  );
}
