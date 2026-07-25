import {PanelRight} from 'lucide-react';
import {useState} from 'react';
import {Composer} from './components/Composer.tsx';
import {Orb} from './components/Orb.tsx';
import {ProfilePanel} from './components/ProfilePanel.tsx';
import {Transcript} from './components/Transcript.tsx';
import type {Mode} from './hooks/useGrace.ts';
import {useGrace} from './hooks/useGrace.ts';

const MODE_LABEL: Record<Mode, string> = {
  offline: 'Not configured',
  idle: 'Microphone off',
  waiting: 'Listening for “Grace”',
  listening: 'Go ahead',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

const MODE_DOT: Record<Mode, string> = {
  offline: 'bg-rose-400/70',
  idle: 'bg-mist/40',
  waiting: 'bg-ice/60',
  listening: 'bg-ice',
  thinking: 'bg-ember/70',
  speaking: 'bg-ice',
};

export default function App() {
  const grace = useGrace();
  const [panelOpen, setPanelOpen] = useState(false);

  const {state, mode} = grace;
  const notice =
    mode === 'offline'
      ? 'No Gemini API key found. Add GEMINI_API_KEY to .env.local and restart.'
      : grace.error;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="ambient pointer-events-none absolute inset-0 -z-10" />

      <header className="flex items-center justify-between border-b border-edge/70 px-5 py-3">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-xl tracking-wide text-slate-100">Grace</h1>
          <span className="hidden text-xs text-mist/50 sm:inline">
            {state?.model ?? '—'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-mist">
            <span className={`h-1.5 w-1.5 rounded-full ${MODE_DOT[mode]}`} />
            {MODE_LABEL[mode]}
          </span>
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            aria-label="What Grace knows"
            className="text-mist transition hover:text-slate-200">
            <PanelRight size={18} />
          </button>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 flex-col items-center justify-center gap-6 border-r border-edge/70 lg:flex">
          <Orb mode={mode} />
          <div className="px-8 text-center">
            <p className="text-sm text-slate-300">{MODE_LABEL[mode]}</p>
            {mode === 'waiting' && (
              <p className="mt-1.5 text-xs leading-relaxed text-mist/50">
                Say her name, then what you need.
              </p>
            )}
            {mode === 'idle' && grace.listener.supported && (
              <p className="mt-1.5 text-xs leading-relaxed text-mist/50">
                Turn on the microphone to talk to her.
              </p>
            )}
            {!grace.listener.supported && (
              <p className="mt-1.5 text-xs leading-relaxed text-mist/50">
                This browser can’t listen. Chrome or Edge can.
              </p>
            )}
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          {/* The orb rides along the top on narrow screens. */}
          <div className="flex justify-center border-b border-edge/70 py-3 lg:hidden">
            <div className="scale-50">
              <Orb mode={mode} />
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <Transcript
              messages={grace.messages}
              streaming={grace.streaming}
              heard={grace.listener.awake ? grace.listener.heard : ''}
            />
          </div>
        </section>

        {state && (
          <ProfilePanel
            open={panelOpen}
            profile={state.profile}
            policies={state.policies}
            onClose={() => setPanelOpen(false)}
            onForget={grace.forget}
            onRename={grace.rename}
            onClear={grace.clear}
          />
        )}
      </main>

      {notice && (
        <p className="border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          {notice}
        </p>
      )}

      <Composer
        busy={mode === 'thinking' || mode === 'speaking'}
        micOn={grace.micOn}
        voiceOn={grace.voiceOn}
        micSupported={grace.listener.supported}
        voiceSupported={grace.speech.supported}
        onSend={(text) => void grace.send(text, 'text')}
        onStop={grace.stop}
        onToggleMic={() => grace.setMicOn(!grace.micOn)}
        onToggleVoice={() => grace.setVoiceOn(!grace.voiceOn)}
      />
    </div>
  );
}
