import {PanelRight} from 'lucide-react';
import {useState} from 'react';
import {Composer} from './components/Composer';
import {Lock} from './components/Lock';
import {MicCheck} from './components/MicCheck';
import {Orb} from './components/Orb';
import {ProfilePanel} from './components/ProfilePanel';
import {Transcript} from './components/Transcript';
import type {Mode} from './hooks/useGrace';
import {useGrace} from './hooks/useGrace';

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
  const [micCheckOpen, setMicCheckOpen] = useState(false);

  const {session, state, mode} = grace;

  // Nothing of hers renders until the session is settled, so a lapsed cookie
  // can't flash her transcript on screen first. But an unreachable server used
  // to leave this as a blank glow forever, with nothing to explain it.
  if (session === null) {
    return (
      <div className="relative grid h-screen place-items-center overflow-hidden px-6">
        <div className="ambient pointer-events-none absolute inset-0 -z-10" />
        <div className="max-w-sm text-center">
          <h1 className="font-serif text-3xl tracking-wide text-slate-100">Grace</h1>
          {grace.error ? (
            <>
              <p className="mt-4 text-sm leading-relaxed text-mist/80">
                I can’t reach my own server, so I can’t tell you anything useful
                yet.
              </p>
              <p className="mt-3 rounded-lg border border-ember/25 bg-ember/10 px-3 py-2 text-left font-mono text-xs text-ember/90">
                {grace.error}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full border border-edge px-4 py-1.5 text-sm text-mist transition hover:text-slate-200">
                Try again
              </button>
            </>
          ) : (
            <p className="mt-2 text-sm text-mist/60">One moment…</p>
          )}
        </div>
      </div>
    );
  }

  if (session === 'required' || session === 'misconfigured') {
    return <Lock status={session} onSubmit={grace.signIn} />;
  }
  // The microphone failing used to be silent: the listener recorded an error
  // that nothing ever rendered, so a dead mic and a working one looked alike.
  const notice =
    mode === 'offline'
      ? 'No Gemini API key found. Set GEMINI_API_KEY where Grace is running, then restart or redeploy her.'
      : (grace.error ?? grace.listener.error);

  const cannotListen = !grace.listener.supported;

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
          {/* The orb rides along the top on narrow screens. The wrapper is sized
              to the scaled-down orb, since a transform leaves the box behind. */}
          <div className="flex h-28 shrink-0 items-center justify-center overflow-hidden border-b border-edge/70 lg:hidden">
            <div className="scale-50">
              <Orb mode={mode} />
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <Transcript
              messages={grace.messages}
              streaming={grace.streaming}
              // Shown whenever the microphone is on, not only once she has
              // caught her name — otherwise there is no sign she can hear you.
              heard={grace.micOn ? grace.listener.heard : ''}
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
            onSignOut={session === 'ok' ? () => void grace.signOut() : undefined}
          />
        )}
      </main>

      {/* Visible at every screen size. The old copy of this lived in a panel
          that disappeared below laptop width, so on a phone a dead microphone
          came with no explanation at all. */}
      {cannotListen && (
        <p className="border-t border-edge bg-surface/80 px-5 py-2 text-xs text-mist">
          This browser can’t do speech recognition, so the microphone is off.
          Chrome or Edge can. Typing works anywhere.
        </p>
      )}

      {notice && (
        <p className="border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          {notice}
        </p>
      )}

      {/* Everything the microphone has to say for itself, in one place. */}
      {(grace.recorder.error || grace.misheard) && (
        <p className="flex items-center justify-between gap-3 border-t border-rose-400/20 bg-rose-400/10 px-5 py-2 text-xs text-rose-200">
          <span>{grace.recorder.error ?? grace.misheard}</span>
          <button
            type="button"
            onClick={() => setMicCheckOpen(true)}
            className="shrink-0 underline underline-offset-2 hover:text-rose-100">
            Check microphone
          </button>
        </p>
      )}

      {grace.recorder.state === 'recording' && (
        <p className="border-t border-ice/20 bg-ice/5 px-5 py-2 text-xs text-ice/90">
          {grace.recorder.heardSomething
            ? 'Hearing you. Press Stop when you’re done.'
            : 'Recording — but no sound yet. Check the right microphone is selected.'}
        </p>
      )}

      {grace.transcribing && (
        <p className="border-t border-edge/70 bg-surface/50 px-5 py-2 text-xs text-mist/70">
          Working out what you said…
        </p>
      )}

      {micCheckOpen && <MicCheck onClose={() => setMicCheckOpen(false)} />}

      {/* Speaking is interruptible: typing while she talks cuts her off, which
          is the point. Only an in-flight request actually blocks sending. */}
      <Composer
        busy={mode === 'thinking'}
        canStop={mode === 'thinking' || mode === 'speaking'}
        micOn={grace.micOn}
        voiceOn={grace.voiceOn}
        micSupported={grace.listener.supported}
        voiceSupported={grace.speech.supported}
        awake={grace.listener.awake}
        recording={grace.recorder.state === 'recording'}
        recorderBusy={
          grace.recorder.state === 'starting' ||
          grace.recorder.state === 'working' ||
          grace.transcribing
        }
        level={grace.recorder.level}
        onRecordStart={() => void grace.recorder.start()}
        onRecordStop={grace.recorder.stop}
        onSend={(text) => void grace.send(text, 'text')}
        onStop={grace.stop}
        onToggleMic={() => grace.setMicOn(!grace.micOn)}
        onToggleVoice={() => grace.setVoiceOn(!grace.voiceOn)}
        onTalk={grace.listener.wake}
      />
    </div>
  );
}
