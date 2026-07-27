import {
  Activity,
  CircleDot,
  Cloud,
  Gamepad2,
  Github,
  Laptop,
  Mail,
  Workflow,
} from 'lucide-react';
import {useEffect, useState, type ReactNode} from 'react';
import type {GraceState, JournalEntry} from '../../shared/types';

/**
 * The control-room panels.
 *
 * Everything here is glass, every reading is real, and each one stands alone
 * so a room can show whichever it wants. Kept in one file because they share a
 * shell and a set of manners: a title in small caps, live data, and no
 * placeholder ever — a readout that isn't true is worse than no readout.
 */

/** Bumped per panel so they arrive in sequence rather than in one frame. */
let order = 0;

export function Panel({
  title,
  bright,
  children,
}: {
  title: string;
  bright?: boolean;
  children: ReactNode;
}) {
  // Worked out once on first render and kept, so a panel that updates does not
  // fade itself back in every time its data changes.
  const [delay] = useState(() => Math.min((order++ % 9) * 45, 400));

  return (
    <div
      style={{'--in': `${delay}ms`} as React.CSSProperties}
      className={`glass bracket cascade px-4 py-3 ${
        bright ? 'glass-bright edge-run attend' : ''
      }`}>
      <h3 className="label mb-2">{title}</h3>
      {children}
    </div>
  );
}

function ago(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`;
}

/**
 * What she has been doing, as it happens.
 *
 * Its own poll rather than piggy-backing on the day view, because the whole
 * point of a live feed is that it is live — a control room where the numbers
 * are a minute stale is a museum.
 */
export function LiveFeed() {
  const [deeds, setDeeds] = useState<JournalEntry[]>([]);

  useEffect(() => {
    // The journal alone — /day aggregates Google and the console, which is
    // far too dear to pull once a minute for seven lines of activity.
    const load = () => {
      if (document.hidden) return;
      fetch('/api/journal')
        .then((response) => (response.ok ? response.json() : null))
        .then((body: {deeds?: JournalEntry[]} | null) => body?.deeds && setDeeds(body.deeds))
        .catch(() => {});
    };
    load();
    const timer = window.setInterval(load, 90_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Panel title="Activity">
      {deeds.length === 0 ? (
        <p className="text-xs text-mist/50">Quiet.</p>
      ) : (
        <ul className="space-y-1.5">
          {deeds.slice(0, 7).map((deed) => (
            <li key={deed.id} className="arrive flex items-start gap-2 text-xs">
              <Activity size={11} className="mt-0.5 shrink-0 accent" />
              <span className="min-w-0 flex-1 text-slate-300">
                <span className="block truncate">{deed.text}</span>
                <span className="text-[0.6rem] text-mist/45">
                  {ago(deed.at)}
                  {deed.unprompted ? ' · on her own' : ''}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

interface Health {
  label: string;
  icon: ReactNode;
  /** 'live' | 'off' | 'broken' */
  state: 'live' | 'off' | 'broken';
  detail: string;
}

/**
 * What is connected and what is broken.
 *
 * One honest dot each. She reaches a lot of systems now, and "why isn't the
 * PlayStation responding" should be answerable at a glance rather than by
 * asking her and hoping.
 */
export function Connections({google}: {google: {connected: boolean; problem: string | null} | null}) {
  const [health, setHealth] = useState<Record<string, {ok: boolean; note: string}>>({});

  useEffect(() => {
    const load = async () => {
      const [ps5, bridge, gh, n8n, push] = await Promise.all([
        fetch('/api/ps5').then((r) => r.json()).catch(() => null),
        fetch('/api/bridge-status').then((r) => r.json()).catch(() => null),
        fetch('/api/github-view').then((r) => r.json()).catch(() => null),
        fetch('/api/n8n-view').then((r) => r.json()).catch(() => null),
        fetch('/api/push-key').then((r) => r.json()).catch(() => null),
      ]);
      setHealth({
        playstation: {
          ok: Boolean(ps5?.configured && !ps5?.error),
          note: ps5?.configured ? (ps5?.error ? 'needs the code again' : 'connected') : 'not set up',
        },
        bridge: {
          ok: Boolean(bridge?.online),
          note: bridge?.online ? 'the laptop is listening' : 'no laptop running it',
        },
        github: {
          ok: Boolean(gh?.configured && !gh?.error),
          note: gh?.configured ? (gh?.error ? 'token expired' : 'connected') : 'no token',
        },
        n8n: {
          ok: Boolean(n8n?.configured && !n8n?.error),
          note: n8n?.configured ? (n8n?.error ? 'key rejected' : 'connected') : 'not connected',
        },
        push: {
          ok: (push?.devices ?? 0) > 0,
          note: push?.devices ? `${push.devices} device${push.devices === 1 ? '' : 's'}` : 'no phone',
        },
      });
    };
    load();
    // Five upstream services sit behind these. Once a minute was sixty
    // fan-outs an hour to keep six dots coloured; five minutes reads the same
    // to a person and costs a twelfth of it. Nothing polls a hidden tab.
    const timer = window.setInterval(() => {
      if (!document.hidden) load();
    }, 5 * 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const rows: Health[] = [
    {
      label: 'Google',
      icon: <Mail size={12} />,
      state: google?.problem ? 'broken' : google?.connected ? 'live' : 'off',
      detail: google?.problem ? 'needs reconnecting' : google?.connected ? 'mail and diary' : 'not connected',
    },
    {
      label: 'PlayStation',
      icon: <Gamepad2 size={12} />,
      state: health.playstation?.ok ? 'live' : 'off',
      detail: health.playstation?.note ?? '—',
    },
    {
      label: 'Laptop bridge',
      icon: <Laptop size={12} />,
      state: health.bridge?.ok ? 'live' : 'off',
      detail: health.bridge?.note ?? '—',
    },
    {
      label: 'GitHub',
      icon: <Github size={12} />,
      state: health.github?.ok ? 'live' : 'off',
      detail: health.github?.note ?? '—',
    },
    {
      label: 'n8n',
      icon: <Workflow size={12} />,
      state: health.n8n?.ok ? 'live' : 'off',
      detail: health.n8n?.note ?? '—',
    },
    {
      label: 'Phone',
      icon: <CircleDot size={12} />,
      state: health.push?.ok ? 'live' : 'off',
      detail: health.push?.note ?? '—',
    },
  ];

  return (
    <Panel title="Connections">
      <ul className="space-y-1.5">
        {rows.map((row) => (
          // The note ("no laptop running it") is the tooltip now — six of them
          // stacked read as a paragraph, and the dot already carries the state.
          <li
            key={row.label}
            title={row.detail}
            className="flex items-center gap-2 text-xs">
            <span className="text-mist/50">{row.icon}</span>
            <span className="flex-1 text-slate-300">{row.label}</span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                row.state === 'live'
                  ? 'bg-ice'
                  : row.state === 'broken'
                    ? 'bg-rose-400'
                    : 'bg-mist/25'
              }`}
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Where the money is going, broken down by what she spent it on. */
const MODEL_LABEL: [RegExp, string][] = [
  [/tts|speech/i, 'Voice'],
  [/flash-lite/i, 'Quick thinking'],
  [/flash/i, 'Thinking & hearing'],
];

export function SpendGauge({spend}: {spend: GraceState['spend']}) {
  const share = Math.min(1, spend.dollars / spend.cap);
  const models = Object.entries(spend.byModel ?? {}).sort(
    (left, right) => right[1] - left[1],
  );

  return (
    <Panel title="This month" bright={share > 0.85}>
      <p className="font-serif text-2xl text-slate-100 tabular-nums">
        ${spend.dollars.toFixed(2)}
        <span className="ml-1 text-xs text-mist/50">of ${spend.cap}</span>
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-edge">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${share * 100}%`,
            background: share > 0.85 ? 'rgb(244 63 94)' : 'rgb(var(--accent))',
          }}
        />
      </div>
      {models.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {models.map(([model, dollars]) => (
            <li key={model} className="flex justify-between text-[0.65rem] text-mist/55">
              <span>{MODEL_LABEL.find(([test]) => test.test(model))?.[1] ?? model}</span>
              <span className="tabular-nums">${dollars.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/**
 * Weather, hers to fetch and cheap to show.
 *
 * She already searches the web; this asks the same route once and caches the
 * answer for the session, so a control-room glance costs nothing after the
 * first look.
 */
export function Weather() {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem('grace-weather');
    if (cached) {
      setLine(cached);
      return;
    }
    fetch('/api/weather')
      .then((response) => (response.ok ? response.json() : null))
      .then((body: {line?: string} | null) => {
        if (body?.line) {
          setLine(body.line);
          sessionStorage.setItem('grace-weather', body.line);
        }
      })
      .catch(() => {});
  }, []);

  if (!line) return null;
  return (
    <Panel title="Weather">
      <p className="flex items-start gap-2 text-xs text-slate-300">
        <Cloud size={12} className="mt-0.5 shrink-0 accent" />
        {line}
      </p>
    </Panel>
  );
}
