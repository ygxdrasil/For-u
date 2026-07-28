import {Check, Copy, RefreshCw} from 'lucide-react';
import {useEffect, useState} from 'react';

/**
 * Reaching her without opening her.
 *
 * The honest version of "make her work like Siri": a web page is never allowed
 * to listen for its own name while it is closed, on any phone, ever. So the
 * listening is borrowed from the thing already permitted to do it — Siri, the
 * Assistant, a watch button — and this panel hands over the address and the
 * token it needs to pass the sentence along.
 *
 * The token is shown in full, like the bridge token and unlike every other key
 * she holds, because it exists to be copied onto another device. It can be
 * replaced in one tap, which is what you do the day a phone goes missing.
 */

interface Key {
  token: string;
  url: string;
  usedAt: string | null;
  turns: number;
}

function ago(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} hours ago` : `${Math.round(hours / 24)} days ago`;
}

function Step({n, children}: {n: number; children: React.ReactNode}) {
  return (
    <li className="flex gap-2">
      <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-edge text-[0.55rem] text-mist/60">
        {n}
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
}

export function Anywhere() {
  const [key, setKey] = useState<Key | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/relay-key')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: Key | null) => body && setKey(body))
      .catch(() => {});
  }, []);

  if (!key) return null;

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard access is refused in plenty of ordinary situations, and the
      // values are on screen anyway.
    }
  };

  const roll = async () => {
    const response = await fetch('/api/relay-roll', {method: 'POST'});
    if (!response.ok) return;
    const body = (await response.json()) as {token: string};
    setKey({...key, token: body.token});
  };

  return (
    <div className="space-y-2.5">
      <p className="text-[0.65rem] leading-relaxed text-mist/60">
        Say <span className="text-slate-300">“Hey Siri, Grace”</span> with the app
        shut and the phone locked. Siri does the listening — a website is not
        allowed to, closed — and hands me what you said. I answer out loud.
      </p>

      {key.turns > 0 && key.usedAt && (
        <p className="flex items-center gap-1.5 text-[0.62rem] text-ice/70">
          <span className="h-1.5 w-1.5 rounded-full bg-ice" />
          Working — {key.turns} {key.turns === 1 ? 'time' : 'times'}, last{' '}
          {ago(key.usedAt)}.
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        className="text-[0.62rem] text-mist/50 transition hover:text-mist">
        {open ? 'Hide the setup' : 'How to set it up on a phone'}
      </button>

      {open && (
        <ol className="space-y-1.5 text-[0.65rem] leading-relaxed text-mist/60">
          <Step n={1}>
            Open <span className="text-slate-300">Shortcuts</span> on the phone and
            make a new one. Name it exactly <span className="text-slate-300">Grace</span>
            {' '}— that name is what you say to Siri.
          </Step>
          <Step n={2}>
            Add <span className="text-slate-300">Dictate Text</span>. This is what
            hears the rest of the sentence.
          </Step>
          <Step n={3}>
            Add <span className="text-slate-300">Get Contents of URL</span>. Paste
            the address below, set the method to{' '}
            <span className="text-slate-300">POST</span>, the body to{' '}
            <span className="text-slate-300">JSON</span>, and give it two fields:{' '}
            <span className="text-slate-300">token</span> with the token below, and{' '}
            <span className="text-slate-300">text</span> set to the Dictated Text.
          </Step>
          <Step n={4}>
            Add <span className="text-slate-300">Get Dictionary Value</span> for the
            key <span className="text-slate-300">spoken</span>, then{' '}
            <span className="text-slate-300">Speak Text</span>.
          </Step>
          <Step n={5}>
            That is all. “Hey Siri, Grace” → beep → say what you want. It works
            locked, in a pocket, and through CarPlay and AirPods.
          </Step>
        </ol>
      )}

      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => void copy('url', key.url)}
          className="flex w-full items-center gap-1.5 rounded-lg border border-edge bg-surface px-2.5 py-1.5 text-left font-mono text-[0.62rem] text-slate-300 transition hover:border-ice/30">
          {copied === 'url' ? (
            <Check size={11} className="shrink-0 text-ice" />
          ) : (
            <Copy size={11} className="shrink-0 text-mist/50" />
          )}
          <span className="truncate">{key.url}</span>
        </button>

        <button
          type="button"
          onClick={() => void copy('token', key.token)}
          className="flex w-full items-center gap-1.5 rounded-lg border border-edge bg-surface px-2.5 py-1.5 text-left font-mono text-[0.62rem] text-slate-300 transition hover:border-ice/30">
          {copied === 'token' ? (
            <Check size={11} className="shrink-0 text-ice" />
          ) : (
            <Copy size={11} className="shrink-0 text-mist/50" />
          )}
          <span className="truncate">{key.token}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => void roll()}
        className="flex items-center gap-1.5 text-[0.6rem] text-mist/40 transition hover:text-rose-300">
        <RefreshCw size={10} />
        Replace the token
      </button>

      <p className="text-[0.6rem] leading-relaxed text-mist/40">
        That token is a way in, so treat it like a key. Replacing it stops every
        shortcut using the old one immediately — which is the thing to do if a
        phone goes missing. The same limits apply either way: I still won’t send
        or spend without asking.
      </p>
    </div>
  );
}
