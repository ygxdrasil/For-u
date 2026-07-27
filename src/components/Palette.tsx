import {ArrowRight, Search} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

/**
 * Everything, one keystroke away.
 *
 * Ctrl or Cmd-K anywhere. The registry is a flat list the app hands in, so a
 * new room or action shows up here for free rather than being wired in twice.
 * Keyboard-first: type to filter, arrows to move, enter to run, escape to
 * leave. A fuzzy match, because nobody types a command name exactly.
 */

export interface Command {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

/** Loose subsequence match: "opw" finds "open work". */
function score(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 1;
  if (t.includes(q)) return 100 - t.indexOf(q);

  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti += 1) {
    if (t[ti] === q[qi]) qi += 1;
  }
  return qi === q.length ? 1 : 0;
}

export function Palette({commands}: {commands: Command[]}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((was) => !was);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // A frame's wait, or the input is not yet in the DOM to focus.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const matches = useMemo(() => {
    return commands
      .map((command) => ({command, score: score(query, `${command.label} ${command.hint ?? ''}`)}))
      .filter((row) => row.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8)
      .map((row) => row.command);
  }, [commands, query]);

  if (!open) return null;

  const choose = (command: Command) => {
    command.run();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-void/70 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}>
      <div
        className="glass glass-bright w-full max-w-lg overflow-hidden"
        onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-edge/60 px-4 py-3">
          <Search size={15} className="text-mist/50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActive((index) => Math.min(index + 1, matches.length - 1));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              } else if (event.key === 'Enter' && matches[active]) {
                choose(matches[active]);
              }
            }}
            placeholder="Go anywhere, do anything…"
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-mist/40 focus:outline-none"
          />
          <kbd className="rounded border border-edge px-1.5 py-0.5 text-[0.6rem] text-mist/40">
            esc
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {matches.length === 0 ? (
            <li className="px-4 py-3 text-xs text-mist/50">Nothing matches that.</li>
          ) : (
            matches.map((command, index) => (
              <li key={command.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(command)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition ${
                    index === active ? 'bg-ice/10 text-slate-100' : 'text-slate-300'
                  }`}>
                  <span className="flex-1">{command.label}</span>
                  {command.hint && (
                    <span className="text-[0.65rem] text-mist/40">{command.hint}</span>
                  )}
                  <ArrowRight
                    size={13}
                    className={index === active ? 'accent' : 'text-transparent'}
                  />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
