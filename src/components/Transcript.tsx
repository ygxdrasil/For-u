import {Check} from 'lucide-react';
import {useEffect, useRef} from 'react';
import type {Choice, Message} from '../../shared/types.ts';

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Bubble({message}: {message: Message}) {
  const fromGrace = message.speaker === 'grace';

  return (
    <div className={`rise flex ${fromGrace ? 'justify-start' : 'justify-end'}`}>
      <div className="max-w-[85%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed ${
            fromGrace
              ? 'bg-raised/80 text-slate-200'
              : 'bg-ice/10 text-slate-100 ring-1 ring-ice/20'
          }`}>
          {message.text}
        </div>
        <div
          className={`mt-1 flex items-center gap-1.5 px-1 text-[0.68rem] text-mist/60 ${
            fromGrace ? '' : 'justify-end'
          }`}>
          {fromGrace && <span className="font-serif italic text-mist/80">Grace</span>}
          <span>{timeOf(message.at)}</span>
          {message.via === 'voice' && <span aria-label="spoken">·  spoken</span>}
        </div>
      </div>
    </div>
  );
}

/**
 * Openers, grouped so the first screen shows what she is actually for.
 *
 * An empty panel that says "nothing said yet" teaches nobody anything. These
 * are all things she can genuinely do right now — nothing here depends on a
 * connection that isn't built.
 */
const OPENERS: {group: string; items: string[]}[] = [
  {
    group: 'Try the web',
    items: ['What’s the weather doing today?', 'What’s in the news this morning?'],
  },
  {
    group: 'Tell her about you',
    items: ['I take my coffee black, no sugar.', 'I work best early in the morning.'],
  },
  {
    group: 'Ask her anything',
    items: ['What can you actually do?', 'What do you know about me so far?'],
  },
];

interface TranscriptProps {
  messages: Message[];
  streaming: string;
  /**
   * She went to the web for this reply.
   *
   * Deliberately not shown any more. Searching is how she answers a question
   * about today's weather, not an event in its own right, and announcing it
   * every time made the conversation read like a status log. It is still
   * reported to the client, so the Faculties panel can tell a working
   * connection from a broken one without it being in your face.
   */
  searched: boolean;
  /** Things she actually did while answering. */
  actions: string[];
  /** A question she asked, with the answers laid out as buttons. */
  asked: {question: string; choices: Choice[]} | null;
  onAnswer?: (label: string) => void;
  heard: string;
  onOpener?: (text: string) => void;
}

export function Transcript({
  messages,
  streaming,
  searched,
  actions,
  asked,
  heard,
  onAnswer,
  onOpener,
}: TranscriptProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
  }, [messages.length, streaming, heard, asked]);

  if (messages.length === 0 && !streaming && !heard) {
    return (
      <div className="scroll-thin flex h-full flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-8">
        <div className="text-center">
          <p className="font-serif text-2xl tracking-wide text-slate-100">
            Good to see you.
          </p>
          <p className="mt-1.5 text-sm text-mist/70">
            Press the orb to talk, or start with one of these.
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
          {OPENERS.map((section, index) => (
            <div
              key={section.group}
              className="rise"
              style={{animationDelay: `${index * 0.08}s`}}>
              <h3 className="mb-2 text-[0.6rem] uppercase tracking-[0.14em] text-mist/40">
                {section.group}
              </h3>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onOpener?.(item)}
                    className="w-full rounded-xl border border-edge/70 bg-surface/40 px-3 py-2.5 text-left text-xs leading-relaxed text-slate-300 transition hover:border-ice/40 hover:bg-surface/80 hover:text-slate-100">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-thin h-full space-y-4 overflow-y-auto px-6 py-6">
      {messages.map((message) => (
        <Bubble key={message.id} message={message} />
      ))}

      {/* What the microphone is picking up, before it is submitted. */}
      {heard && (
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl border border-dashed border-ice/20 px-4 py-2.5 text-[0.95rem] italic text-mist/70">
            {heard}
          </div>
        </div>
      )}

      {/* An action she took is never left invisible. */}
      {actions.map((action, index) => (
        <div key={`${action}-${index}`} className="flex justify-start">
          <span className="rise inline-flex items-center gap-1.5 rounded-full border border-ice/25 bg-ice/10 px-2.5 py-1 text-[0.65rem] text-ice/90">
            <Check size={11} />
            {action}
          </span>
        </div>
      ))}

      {/* Something she needs from you, with the answers already laid out.
          Asking in prose puts the work back on the person being asked. */}
      {asked && (
        <div className="rise flex justify-start">
          <div className="max-w-[85%] rounded-2xl border border-ice/25 bg-ice/5 px-4 py-3">
            <p className="text-[0.95rem] leading-relaxed text-slate-200">
              {asked.question}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {asked.choices.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => onAnswer?.(choice.label)}
                  title={choice.detail}
                  className="rounded-xl border border-ice/40 bg-ice/10 px-3 py-2 text-left transition hover:bg-ice/25">
                  <span className="block text-xs text-ice">{choice.label}</span>
                  {choice.detail && (
                    <span className="mt-0.5 block max-w-[16rem] text-[0.6rem] leading-tight text-mist/60">
                      {choice.detail}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {streaming && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl bg-raised/80 px-4 py-2.5 text-[0.95rem] leading-relaxed text-slate-200">
            {streaming}
            <span className="caret ml-0.5 text-ice">▍</span>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
