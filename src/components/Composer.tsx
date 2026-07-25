import {AudioLines, Mic, MicOff, Send, Square, Volume2, VolumeX} from 'lucide-react';
import {useState, type ReactNode} from 'react';

interface ComposerProps {
  /** A request is in flight. Sending another would collide with it. */
  busy: boolean;
  /** There is something to interrupt — a request, or Grace mid-sentence. */
  canStop: boolean;
  micOn: boolean;
  voiceOn: boolean;
  micSupported: boolean;
  voiceSupported: boolean;
  /** She is already capturing a request. */
  awake: boolean;
  /** Recording state, and how loud the microphone is hearing you right now. */
  recording: boolean;
  recorderBusy: boolean;
  level: number;
  onRecordStart: () => void;
  onRecordStop: () => void;
  onSend: (text: string) => void;
  onStop: () => void;
  onToggleMic: () => void;
  onToggleVoice: () => void;
  /** Start capturing straight away, without waiting for the wake word. */
  onTalk: () => void;
}

function ToggleButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-10 w-10 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-ice/40 bg-ice/15 text-ice'
          : 'border-edge bg-surface text-mist hover:text-slate-200'
      }`}>
      {children}
    </button>
  );
}

export function Composer({
  busy,
  canStop,
  micOn,
  voiceOn,
  micSupported,
  voiceSupported,
  awake,
  recording,
  recorderBusy,
  level,
  onRecordStart,
  onRecordStop,
  onSend,
  onStop,
  onToggleMic,
  onToggleVoice,
  onTalk,
}: ComposerProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft('');
    onSend(text);
  };

  return (
    <div className="flex items-center gap-2 border-t border-edge/70 bg-surface/60 px-4 py-3 backdrop-blur">
      <ToggleButton
        active={micOn}
        disabled={!micSupported}
        label={
          micSupported
            ? micOn
              ? 'Wake word on'
              : 'Wake word off'
            : 'This browser has no wake-word support'
        }
        onClick={onToggleMic}>
        {micOn ? <Mic size={17} /> : <MicOff size={17} />}
      </ToggleButton>

      <ToggleButton
        active={voiceOn}
        disabled={!voiceSupported}
        label={
          voiceSupported
            ? voiceOn
              ? 'Grace speaks her replies'
              : 'Grace stays silent'
            : 'This browser has no speech synthesis'
        }
        onClick={onToggleVoice}>
        {voiceOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </ToggleButton>

      {/* The dependable way in. Press, speak, press again — the recording is
          transcribed on the server, so it works in browsers that have no
          speech recognition of their own. The bar fills with however loud the
          microphone is hearing you, which is the fastest way to tell a quiet
          room from a dead microphone. */}
      <button
        type="button"
        onClick={recording ? onRecordStop : onRecordStart}
        disabled={recorderBusy}
        aria-label={recording ? 'Stop recording and send' : 'Record what you say'}
        className={`relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border px-3 py-2 text-sm transition disabled:opacity-40 ${
          recording
            ? 'border-ice/60 bg-ice/20 text-ice'
            : 'border-edge bg-surface text-mist hover:text-slate-200'
        }`}>
        {recording && (
          <span
            className="absolute inset-y-0 left-0 bg-ice/25 transition-[width] duration-75"
            style={{width: `${Math.min(100, level * 180)}%`}}
          />
        )}
        <AudioLines size={15} className="relative" />
        <span className="relative hidden sm:inline">
          {recorderBusy ? 'One moment' : recording ? 'Stop' : 'Speak'}
        </span>
      </button>

      {/* Only useful where the browser supports a wake word at all. */}
      {micOn && !recording && (
        <button
          type="button"
          onClick={onTalk}
          aria-label="Listen for a spoken request"
          className={`hidden shrink-0 rounded-full border px-3 py-2 text-sm transition lg:block ${
            awake
              ? 'border-ice/50 bg-ice/20 text-ice'
              : 'border-edge bg-surface text-mist hover:text-slate-200'
          }`}>
          {awake ? 'Listening' : 'Wake'}
        </button>
      )}

      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Say something to Grace"
        className="min-w-0 flex-1 rounded-full border border-edge bg-surface px-4 py-2.5 text-sm text-slate-200 placeholder:text-mist/50 focus:border-ice/40 focus:outline-none"
      />

      {canStop ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop"
          className="grid h-10 w-10 place-items-center rounded-full border border-edge bg-surface text-mist transition hover:text-slate-200">
          <Square size={15} />
        </button>
      ) : (
        <button
          type="button"
          onClick={submit}
          disabled={!draft.trim()}
          aria-label="Send"
          className="grid h-10 w-10 place-items-center rounded-full border border-ice/40 bg-ice/15 text-ice transition hover:bg-ice/25 disabled:opacity-25">
          <Send size={16} />
        </button>
      )}
    </div>
  );
}
