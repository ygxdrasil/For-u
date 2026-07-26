import {Headphones, PanelRight} from 'lucide-react';
import {useState} from 'react';
import {Composer} from './components/Composer';
import {Dashboard} from './components/Dashboard';
import {Lock} from './components/Lock';
import {VoiceCheck} from './components/VoiceCheck';
import {Orb} from './components/Orb';
import {ProfilePanel} from './components/ProfilePanel';
import {Transcript} from './components/Transcript';
import type {Mode} from './hooks/useGrace';
import {useGrace} from './hooks/useGrace';

const MODE_LABEL: Record<Mode, string> = {
  offline: 'Not configured',
  idle: 'Ready',
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
  const [soundCheckOpen, setSoundCheckOpen] = useState(false);

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
          {/* This used to be the word "Mic" in dim ten-pixel text, which is a
              fine way to hide the one control people go looking for when she
              seems deaf. */}
          <button
            type="button"
            onClick={() => setSoundCheckOpen((open) => !open)}
            aria-pressed={soundCheckOpen}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
              soundCheckOpen
                ? 'border-ice/40 bg-ice/15 text-ice'
                : 'border-edge bg-surface text-mist hover:border-ice/40 hover:text-ice'
            }`}>
            <Headphones size={14} />
            Sound check
          </button>
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
        {/* This used to be the orb alone on an empty column, which is a lot of
            screen saying nothing. */}
        {state && (
          <aside className="hidden w-80 shrink-0 border-r border-edge/70 lg:block">
            <Dashboard
              state={state}
              mode={mode}
              micLevel={grace.recorder.level}
              recording={grace.recorder.state === 'recording'}
              voiceSource={grace.speech.source}
              onSetAttention={(next) => void grace.setAttention(next)}
            />
          </aside>
        )}

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

      {/* Only the wake word depends on the browser. Recording works regardless,
          so this no longer claims she cannot hear you at all. */}
      {cannotListen && (
        <p className="border-t border-edge bg-surface/80 px-5 py-2 text-xs text-mist">
          This browser has no wake word, so saying “Grace” won’t rouse her. Press
          Speak instead — that works everywhere.
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
            onClick={() => setSoundCheckOpen(true)}
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

      {grace.speech.blocked && grace.voiceOn && (
        <p className="border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          Your browser is refusing to play my voice. Tap anywhere on the page,
          then send another message — that usually settles it.
        </p>
      )}

      {/* Her own voice failed and the browser's took over. Worth saying: the
          difference is audible, and the reason is usually fixable. */}
      {grace.speech.source === 'browser' && grace.voiceOn && (
        <p className="flex items-center justify-between gap-3 border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          <span>
            I’m speaking through the browser’s voice. Mine needs Gemini’s speech
            model, which isn’t on the free tier
            {grace.speech.error ? ` — ${grace.speech.error}` : '.'}
          </span>
          <button
            type="button"
            onClick={() => setSoundCheckOpen(true)}
            className="shrink-0 underline underline-offset-2 hover:text-ember">
            Sound check
          </button>
        </p>
      )}

      {grace.transcribing && (
        <p className="border-t border-edge/70 bg-surface/50 px-5 py-2 text-xs text-mist/70">
          Working out what you said…
        </p>
      )}

      {soundCheckOpen && <VoiceCheck onClose={() => setSoundCheckOpen(false)} />}

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
