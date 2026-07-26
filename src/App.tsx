import {Headphones, LayoutDashboard, MessagesSquare, PanelRight} from 'lucide-react';
import {useState} from 'react';
import {Composer} from './components/Composer';
import {Dashboard} from './components/Dashboard';
import {Lock} from './components/Lock';
import {ProfilePanel} from './components/ProfilePanel';
import {Transcript} from './components/Transcript';
import {VoiceCheck} from './components/VoiceCheck';
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
  /** Which half of the app a narrow screen is showing. */
  const [tab, setTab] = useState<'grace' | 'talk'>('grace');

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

  const notice =
    mode === 'offline'
      ? 'No Gemini API key found. Set GEMINI_API_KEY where Grace is running, then restart or redeploy her.'
      : (grace.error ?? grace.listener.error);

  /** One press: she opens the microphone and closes it when you stop talking. */
  const talk = () => {
    if (grace.recorder.state === 'recording') grace.recorder.stop();
    else void grace.recorder.start();
  };

  const dashboard = state && (
    <Dashboard
      state={state}
      messages={grace.messages}
      mode={mode}
      micLevel={grace.recorder.level}
      recording={grace.recorder.state === 'recording'}
      micBusy={
        grace.recorder.state === 'starting' ||
        grace.recorder.state === 'working' ||
        grace.transcribing
      }
      micError={grace.recorder.error}
      voiceSource={grace.speech.source}
      voiceOn={grace.voiceOn}
      google={grace.google}
      onSetAttention={(next) => void grace.setAttention(next)}
      onTalk={talk}
      onOpenSoundCheck={() => setSoundCheckOpen(true)}
    />
  );

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="ambient pointer-events-none absolute inset-0 -z-10" />
      <div className="ambient-deep pointer-events-none absolute inset-0 -z-10" />

      <header className="flex items-center justify-between border-b border-edge/70 px-4 py-3 sm:px-5">
        <h1 className="font-serif text-xl tracking-wide text-slate-100">Grace</h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden items-center gap-2 text-xs text-mist sm:flex">
            <span className={`h-1.5 w-1.5 rounded-full ${MODE_DOT[mode]}`} />
            {MODE_LABEL[mode]}
          </span>
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
            <span className="hidden sm:inline">Sound check</span>
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

      {/* On a narrow screen the dashboard used to be hidden outright, so a phone
          showed an orb and nothing else. It gets equal billing now. */}
      <div className="flex shrink-0 border-b border-edge/70 lg:hidden">
        {(
          [
            ['grace', 'Grace', <LayoutDashboard key="d" size={14} />],
            ['talk', 'Conversation', <MessagesSquare key="t" size={14} />],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs transition ${
              tab === id
                ? 'border-b-2 border-ice text-ice'
                : 'border-b-2 border-transparent text-mist hover:text-slate-200'
            }`}>
            {icon}
            {label}
          </button>
        ))}
      </div>

      <main className="relative flex min-h-0 flex-1">
        <aside className="hidden w-80 shrink-0 border-r border-edge/70 lg:block">
          {dashboard}
        </aside>

        {/* Narrow screens show one or the other. */}
        <div className={`min-h-0 flex-1 lg:hidden ${tab === 'grace' ? '' : 'hidden'}`}>
          {dashboard}
        </div>

        <section
          className={`min-w-0 flex-1 flex-col lg:flex ${
            tab === 'talk' ? 'flex' : 'hidden'
          }`}>
          <div className="min-h-0 flex-1">
            <Transcript
              messages={grace.messages}
              streaming={grace.streaming}
              searched={grace.searched}
              actions={grace.actions}
              heard={grace.micOn ? grace.listener.heard : ''}
              onOpener={(text) => void grace.send(text, 'text')}
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
            Sound check
          </button>
        </p>
      )}

      {grace.recorder.state === 'recording' && (
        <p className="border-t border-ice/20 bg-ice/5 px-5 py-2 text-xs text-ice/90">
          {grace.recorder.heardSomething
            ? 'Hearing you — I’ll stop when you do.'
            : 'Listening, but nothing’s reaching me yet. Start talking.'}
        </p>
      )}

      {grace.speech.blocked && grace.voiceOn && (
        <p className="border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          Your browser is refusing to play my voice. Tap anywhere on the page,
          then send another message — that usually settles it.
        </p>
      )}

      {grace.speech.source === 'browser' && grace.voiceOn && (
        <p className="flex items-center justify-between gap-3 border-t border-ember/20 bg-ember/10 px-5 py-2 text-xs text-ember/90">
          <span>
            I’m speaking through the browser’s voice — my own wouldn’t come
            through{grace.speech.error ? `: ${grace.speech.error}` : '.'}
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

      {soundCheckOpen && (
        <VoiceCheck
          onClose={() => setSoundCheckOpen(false)}
          deviceId={grace.deviceId}
          onPickDevice={grace.setDeviceId}
        />
      )}

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
        onRecordStart={talk}
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
