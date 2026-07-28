import {Anywhere} from './Anywhere';
import {Bridge} from './Bridge';
import {VoicePicker} from './VoicePicker';
import {WorkspaceEditor} from './WorkspaceEditor';
import {Keys} from './Keys';
import {Notifications} from './Notifications';
import {
  Clock,
  Fingerprint,
  Lock,
  Moon,
  Speaker,
  Sun,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import {useEffect, useState, type ReactNode} from 'react';
import type {
  ActionCategory,
  ActionPolicy,
  ConfirmationPolicy,
  MemoryKind,
  Profile,
} from '../../shared/types.ts';
import {updatePolicy} from '../lib/api.ts';

const KIND_LABEL: Record<MemoryKind, string> = {
  fact: 'Facts',
  preference: 'Preferences',
  routine: 'Routines',
  goal: 'Goals',
};

const POLICY_LABEL: Record<ConfirmationPolicy, string> = {
  always: 'Always ask',
  'high-risk': 'Ask when risky',
  never: 'Act freely',
};

const CATEGORY_LABEL: Record<ActionCategory, string> = {
  communication: 'Messages & email',
  purchase: 'Purchases',
  security: 'Locks & security',
  calendar: 'Calendar',
  home: 'Smart home',
  research: 'Web research',
};

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section className="space-y-2">
      <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-mist/60">
        {title}
      </h3>
      {children}
    </section>
  );
}

interface ProfilePanelProps {
  open: boolean;
  profile: Profile;
  policies: ActionPolicy[];
  onClose: () => void;
  onForget: (id: string) => void;
  onSupersede: (text: string) => void;
  onRename: (addressAs: string | null) => void;
  onClear: () => void;
  /** Only present when a password is in use. */
  onSignOut?: () => void;
  /** Something that depends on a key may have just started working. */
  onKeysChanged?: () => void;
  /** Opens the voice-recognition dialog. */
  onOpenVoiceLock?: () => void;
  /** Whether she is currently ignoring voices that are not the owner's. */
  voiceGuarded?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  voiceMode?: 'all' | 'answers' | 'off';
  onVoiceMode?: (mode: 'all' | 'answers' | 'off') => void;
  volume?: number;
  onVolume?: (volume: number) => void;
  /** Speakers this device can send her to — the television among them. */
  outputs?: {id: string; label: string}[];
  output?: string;
  onOutput?: (id: string) => void;
}

export function ProfilePanel({
  open,
  profile,
  policies,
  onClose,
  onForget,
  onSupersede,
  onRename,
  onClear,
  onSignOut,
  onKeysChanged,
  onOpenVoiceLock,
  voiceGuarded,
  theme,
  onToggleTheme,
  voiceMode,
  onVoiceMode,
  volume,
  onVolume,
  outputs,
  output,
  onOutput,
}: ProfilePanelProps) {
  const [address, setAddress] = useState(profile.addressAs ?? '');
  const [current, setCurrent] = useState(policies);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => setAddress(profile.addressAs ?? ''), [profile.addressAs]);
  useEffect(() => setCurrent(policies), [policies]);

  const changePolicy = async (
    category: ActionCategory,
    policy: ConfirmationPolicy,
  ) => {
    setNotice(null);
    const previous = current;
    setCurrent((entries) =>
      entries.map((entry) =>
        entry.category === category ? {...entry, policy} : entry,
      ),
    );

    const result = await updatePolicy(category, policy);
    if (result.error) {
      setCurrent(previous);
      setNotice(result.error);
    }
  };

  return (
    <aside
      aria-hidden={!open}
      // Without this the offscreen panel's inputs stay in the tab order.
      inert={!open}
      className={`absolute inset-y-0 right-0 z-20 w-full max-w-sm border-l border-edge/70 bg-surface/95 backdrop-blur transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="flex items-center justify-between border-b border-edge/70 px-5 py-4">
        <h2 className="font-serif text-lg text-slate-100">What Grace knows</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="text-mist transition hover:text-slate-200">
          <X size={18} />
        </button>
      </div>

      <div className="scroll-thin h-[calc(100%-3.75rem)] space-y-7 overflow-y-auto px-5 py-5">
        <Section title="Address you as">
          <div className="flex gap-2">
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onBlur={() => onRename(address.trim() || null)}
              placeholder="nothing in particular"
              className="min-w-0 flex-1 rounded-lg border border-edge bg-void px-3 py-2 text-sm text-slate-200 placeholder:text-mist/40 focus:border-ice/40 focus:outline-none"
            />
          </div>
          <p className="text-xs leading-relaxed text-mist/50">
            Leave it empty and she will simply say “you”.
          </p>
        </Section>

        {(Object.keys(KIND_LABEL) as MemoryKind[]).map((kind) => {
          const entries = profile.entries.filter(
            (entry) => entry.kind === kind && !entry.supersededAt,
          );
          if (entries.length === 0) return null;

          return (
            <Section key={kind} title={KIND_LABEL[kind]}>
              <ul className="space-y-1.5">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="group flex items-start gap-2 rounded-lg border border-edge/60 bg-void/60 px-3 py-2">
                    <span className="flex-1 text-sm leading-relaxed text-slate-300">
                      {entry.text}
                      {entry.source === 'inferred' && (
                        <span className="ml-1.5 text-[0.68rem] text-mist/50">
                          inferred
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSupersede(entry.text)}
                      aria-label="No longer true"
                      title="No longer true — file it, keep the record"
                      className="mt-0.5 text-mist/40 opacity-0 transition hover:text-ice focus:opacity-100 group-hover:opacity-100">
                      <Clock size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onForget(entry.id)}
                      aria-label="Forget this"
                      title="Delete outright — for a genuine mistake"
                      className="mt-0.5 text-mist/40 opacity-0 transition hover:text-rose-300 focus:opacity-100 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </Section>
          );
        })}

        {(profile.style ?? []).length > 0 && (
          <Section title="How she deals with you">
            <ul className="space-y-1.5">
              {(profile.style ?? []).map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-edge/60 bg-void/60 px-3 py-2 text-sm leading-relaxed text-slate-300">
                  {note.text}
                  {note.timesSeen >= 3 && (
                    <span className="ml-1.5 text-[0.68rem] text-mist/50">consistently</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {profile.entries.some((entry) => entry.supersededAt) && (
          <Section title="No longer true">
            <ul className="space-y-1.5">
              {profile.entries
                .filter((entry) => entry.supersededAt)
                .slice(-8)
                .map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-lg border border-edge/40 bg-void/40 px-3 py-2 text-sm leading-relaxed text-mist/50 line-through">
                    {entry.text}
                  </li>
                ))}
            </ul>
            <p className="text-xs leading-relaxed text-mist/40">
              Kept, not deleted — that something changed is worth knowing too.
            </p>
          </Section>
        )}

        {profile.entries.length === 0 && (
          <p className="text-sm leading-relaxed text-mist/60">
            She hasn’t learned anything about you yet. That builds up as you talk.
          </p>
        )}

        <Section title="Before she acts">
          <ul className="space-y-1.5">
            {current.map((entry) => (
              <li
                key={entry.category}
                className="flex items-center justify-between gap-3 rounded-lg border border-edge/60 bg-void/60 px-3 py-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-300">
                  {entry.locked && <Lock size={12} className="text-ember/70" />}
                  {CATEGORY_LABEL[entry.category]}
                </span>

                {entry.locked ? (
                  <span className="text-xs text-ember/70">Always ask</span>
                ) : (
                  <select
                    value={entry.policy}
                    onChange={(event) =>
                      changePolicy(
                        entry.category,
                        event.target.value as ConfirmationPolicy,
                      )
                    }
                    className="rounded-md border border-edge bg-void px-2 py-1 text-xs text-slate-300 focus:border-ice/40 focus:outline-none">
                    {(Object.keys(POLICY_LABEL) as ConfirmationPolicy[]).map(
                      (policy) => (
                        <option key={policy} value={policy}>
                          {POLICY_LABEL[policy]}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </li>
            ))}
          </ul>
          {notice && <p className="text-xs text-ember/80">{notice}</p>}
          <p className="text-xs leading-relaxed text-mist/50">
            Messages and purchases are locked to “always ask” — the two limits you
            set at the start.
          </p>
        </Section>

        <Section title="Conversation">
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-lg border border-edge px-3 py-2 text-sm text-mist transition hover:border-rose-400/40 hover:text-rose-300">
            Clear conversation history
          </button>
          <p className="text-xs leading-relaxed text-mist/50">
            Clears what was said. What she has learned about you stays.
          </p>
        </Section>

        <Section title="Rooms">
          <WorkspaceEditor />
        </Section>

        <Section title="Hey Siri, Grace">
          <Anywhere />
        </Section>

        <Section title="The laptop bridge">
          <Bridge />
        </Section>

        {onToggleTheme && (
          <Section title="Look">
            <div className="grid grid-cols-2 gap-1.5">
              {(['dark', 'light'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => theme !== option && onToggleTheme()}
                  aria-pressed={theme === option}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs transition ${
                    theme === option
                      ? 'border-ice/40 bg-ice/15 text-ice'
                      : 'border-edge bg-surface/40 text-mist hover:border-ice/30'
                  }`}>
                  {option === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                  {option === 'dark' ? 'Dark' : 'Daylight'}
                </button>
              ))}
            </div>
          </Section>
        )}

        {onVoiceMode && (
          <Section title="How much she says">
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  ['all', 'Everything', 'Answers and confirmations'],
                  ['answers', 'Answers only', 'Does what you asked, silently'],
                  ['off', 'Silent', 'Never speaks on this device'],
                ] as const
              ).map(([id, label, blurb]) => (
                <button
                  key={id}
                  type="button"
                  title={blurb}
                  onClick={() => onVoiceMode(id)}
                  aria-pressed={voiceMode === id}
                  className={`rounded-lg border px-2 py-2 text-xs transition ${
                    voiceMode === id
                      ? 'border-ice/40 bg-ice/15 text-ice'
                      : 'border-edge bg-surface/40 text-mist hover:border-ice/30'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {/* The whole reason the middle setting exists. */}
            <p className="text-[0.65rem] leading-relaxed text-mist/55">
              On a phone, “answers only” means saying “lights red” turns the light
              red and nothing else. Questions are still answered out loud.
            </p>

            {volume !== undefined && onVolume && (
              <label className="mt-1 flex items-center gap-2 text-xs text-mist">
                <Volume2 size={13} className="shrink-0" />
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(event) => onVolume(Number(event.target.value))}
                  className="min-w-0 flex-1 accent-violet-400"
                />
                <span className="figure w-8 shrink-0 text-right text-mist/60">
                  {Math.round(volume * 100)}%
                </span>
              </label>
            )}

            {/* Her voice, and only her voice, sent to one speaker. Whatever
                else this machine is playing stays where it was. */}
            {outputs && outputs.length > 1 && onOutput && (
              <label className="mt-1 flex items-center gap-2 text-xs text-mist">
                <Speaker size={13} className="shrink-0" />
                <select
                  value={output ?? ''}
                  onChange={(event) => onOutput(event.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-edge bg-void px-2 py-1.5 text-xs text-slate-200 focus:border-ice/40 focus:outline-none">
                  <option value="">This device’s usual speaker</option>
                  {outputs
                    .filter((one) => one.id && one.id !== 'default')
                    .map((one) => (
                      <option key={one.id} value={one.id}>
                        {one.label}
                      </option>
                    ))}
                </select>
              </label>
            )}
          </Section>
        )}

        <Section title="Her voice">
          <VoicePicker />
        </Section>

        {/* Reachable without a keyboard. This lived only behind the command
            palette's Ctrl+K, which is invisible on a phone and easy to miss on
            anything — a setting nobody can find is a setting that does not
            exist. */}
        {onOpenVoiceLock && (
          <Section title="Your voice">
            <p className="text-xs leading-relaxed text-mist/70">
              {voiceGuarded
                ? 'She knows your voice and is ignoring everyone else.'
                : 'Teach her your voice and she can ignore everybody else — the television, and whoever else is in the room.'}
            </p>
            <button
              type="button"
              onClick={onOpenVoiceLock}
              className="mt-2 flex items-center gap-1.5 rounded-full border border-ice/40 bg-ice/15 px-3 py-1.5 text-xs text-ice transition hover:bg-ice/25">
              <Fingerprint size={12} />
              {voiceGuarded ? 'Voice settings' : 'Set up voice recognition'}
            </button>
          </Section>
        )}

        <Section title="Reaching you">
          <Notifications />
        </Section>

        <Section title="Keys">
          <Keys onSaved={onKeysChanged} />
        </Section>

        {onSignOut && (
          <Section title="Session">
            <button
              type="button"
              onClick={onSignOut}
              className="w-full rounded-lg border border-edge px-3 py-2 text-sm text-mist transition hover:border-ice/40 hover:text-slate-200">
              Sign out
            </button>
          </Section>
        )}
      </div>
    </aside>
  );
}
