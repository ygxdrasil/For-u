import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PRICES } from '../core/meter.js';

/**
 * Jason's HUD.
 *
 * ONE CALLER of the pipeline, not the pipeline. Capability belongs in
 * core/tools.js — never here. The terminal's Save button posts to
 * /api/workflow, which runs the same validator and takes the same snapshot as
 * Jason's own edits; editing by hand is the same net with different hands on
 * the keyboard, not a way around it.
 *
 * Layout: the work surface owns the screen — canvas or terminal — and chat is
 * docked along the bottom where you type. The panel folds to a strip that still
 * carries live numbers, because a fold that leaves the screen blank is what
 * made the last version feel dead.
 *
 * Rules held to: no anthropomorphism, no hidden uncertainty ("couldn't confirm"
 * is violet everywhere and is never rounded to a tick or a cross), nothing
 * labelled Delete, and no wall of text where a number does. Every icon is drawn
 * here as SVG — the previous version used Unicode symbols that arrived as empty
 * boxes on the machine this runs on.
 */

const post = async (url, body) => {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
};

/**
 * A read that cannot fail into nothing.
 *
 * A gateway error, a cold start that times out, a proxy sign-in page: any of
 * them return something that is not JSON, and `.then(r => r.json())` with no
 * catch becomes an unhandled rejection and a panel that sits empty with no
 * explanation. The same shape of bug as reading a login page as an empty n8n,
 * one layer up.
 */
const read = async (url) => {
  try {
    const res = await fetch(url);
    return await res.json().catch(() => ({ ok: false, error: `The server answered ${res.status} with something that is not JSON.` }));
  } catch (err) {
    return { ok: false, error: `Could not reach the server: ${err.message}` };
  }
};

const ago = (iso) => {
  if (!iso) return '—';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
};
const clock = (iso) => (iso ? new Date(iso).toTimeString().slice(0, 8) : '--:--:--');
const dur = (a, b) => (a && b ? `${((new Date(b) - new Date(a)) / 1000).toFixed(1)}s` : '—');

/** Status codes never reach the screen; the four outcomes stay distinct. */
const PLAIN = {
  ok: null,
  continuing: 'ran out of time — ask me to carry on',
  not_configured: 'I need a key before I can think',
  misconfigured: 'my settings are wrong — I stopped before spending anything',
  budget_exceeded: 'monthly spend cap reached',
  empty_response: 'the model returned nothing',
  model_error: 'the model call failed',
  error: 'something broke on my side',
};

/* =================================================================== icons */

const Svg = ({ children }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS = {
  gauge: <><path d="M2.5 12a5.8 5.8 0 1 1 11 0" /><path d="M8 12 10.6 7" /></>,
  nodes: <><rect x="1.5" y="5.5" width="4" height="5" rx="1" /><rect x="10.5" y="2.5" width="4" height="4" rx="1" /><rect x="10.5" y="9.5" width="4" height="4" rx="1" /><path d="M5.5 8h2.5v-3.5h2.5M8 8v3.5h2.5" /></>,
  alert: <><path d="M8 2.2 14.4 13.3H1.6z" /><path d="M8 6.4v3.1M8 11.4h.01" /></>,
  chip: <><rect x="4.5" y="4.5" width="7" height="7" rx="1" /><path d="M6.5 2v2.5M9.5 2v2.5M6.5 11.5V14M9.5 11.5V14M2 6.5h2.5M2 9.5h2.5M11.5 6.5H14M11.5 9.5H14" /></>,
  gear: <><circle cx="8" cy="8" r="2.2" /><path d="M8 1.4v1.8M8 12.8v1.8M1.4 8h1.8M12.8 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3" /></>,
  power: <><path d="M8 1.6v5.6" /><path d="M4.4 3.8a5.2 5.2 0 1 0 7.2 0" /></>,
  panel: <><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" /><path d="M10 2.5v11" /></>,
  command: <><path d="M5.5 3.2a1.7 1.7 0 1 0 1.7 1.7v6.2a1.7 1.7 0 1 0 1.7-1.7H3.8a1.7 1.7 0 1 0 1.7 1.7V4.9a1.7 1.7 0 1 0-1.7 1.7h8.4a1.7 1.7 0 1 0-1.7-1.7" /></>,
  external: <><path d="M9 2.5h4.5V7" /><path d="M13.5 2.5 7.5 8.5" /><path d="M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" /></>,
  arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
  sun: <><circle cx="8" cy="8" r="3.1" /><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13" /></>,
  moon: <path d="M13.4 9.6A5.8 5.8 0 0 1 6.4 2.6a5.8 5.8 0 1 0 7 7z" />,
  auto: <><circle cx="8" cy="8" r="5.8" /><path d="M8 2.2v11.6a5.8 5.8 0 0 0 0-11.6z" fill="currentColor" stroke="none" /></>,
};

const Mark = () => (
  <svg className="mark" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ring" cx="12" cy="12" r="8.6" opacity=".22" />
    <g className="spin">
      <path className="ring" d="M12 3.4a8.6 8.6 0 0 1 8.6 8.6" />
    </g>
    <circle className="core" cx="12" cy="12" r="3.3" />
  </svg>
);

/* ==================================================================== gate */

export default function App() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    document.documentElement.dataset.state = 'idle';
    post('/api/auth', { action: 'status' }).then(setAuth);
  }, []);

  if (auth === null) return <div className="gate"><Mark /><p className="sub">Waking…</p></div>;
  if (!auth.passwordSet) return <Gate mode="setup" auth={auth} onDone={setAuth} />;
  if (!auth.signedIn) return <Gate mode="login" auth={auth} onDone={setAuth} />;
  return <Jason onSignOut={() => post('/api/auth', { action: 'logout' }).then(() => setAuth({ ...auth, signedIn: false }))} />;
}

function Gate({ mode, auth, onDone }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (mode === 'setup') {
      if (password.length < 8) return setError('8 characters minimum.');
      if (password !== confirm) return setError('Those do not match.');
    }
    setBusy(true);
    const res = await post('/api/auth', { action: mode === 'setup' ? 'setup' : 'login', password });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    onDone({ ...auth, passwordSet: true, signedIn: true });
  };

  return (
    <div className="gate">
      <Mark />
      <h1>Jason</h1>
      <p className="sub">{mode === 'setup' ? 'Set a password.' : 'Sign in.'}</p>
      {mode === 'login' && auth.reason && auth.reason !== 'no-cookie' && (
        <p className="sub" style={{ color: 'var(--unconfirmed)' }}>
          {auth.reason === 'expired' ? 'Your session ran out.' : "Something changed on the server, so your session didn't carry over."}
        </p>
      )}
      {/* Cookies are per-hostname. This deployment answers on three addresses,
          and signing in on one leaves you signed out on the others — which is
          indistinguishable from "it forgot me" unless the address is on screen. */}
      <p className="sub" style={{ marginTop: -12, marginBottom: 16 }}>
        <span className="mono">{window.location.host}</span>
        {window.location.host !== 'for-u-peach.vercel.app' && (
          <><br /><span style={{ color: 'var(--invisible)' }}>Sessions don't carry between addresses — use for-u-peach.vercel.app</span></>
        )}
      </p>

      <form className="card" onSubmit={submit}>
        {mode === 'setup' && auth.durable === false && <div className="notice warn">No database yet. Add DATABASE_URL, redeploy.</div>}
        <label>Password</label>
        <input type="password" value={password} autoFocus autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'setup' && (<><label>Confirm</label><input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} /></>)}
        {error && <div className="notice warn" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
        <div className="row" style={{ marginTop: 14 }}>
          <button type="submit" disabled={busy || !password}>{busy ? '…' : mode === 'setup' ? 'Set' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  );
}

/* =================================================================== shell */

const SECTIONS = [
  { id: 'overview', icon: 'gauge', label: 'Overview' },
  { id: 'workflows', icon: 'nodes', label: 'Workflows' },
  { id: 'broke', icon: 'alert', label: 'Needs a look' },
  { id: 'memory', icon: 'chip', label: 'Memory' },
  { id: 'settings', icon: 'gear', label: 'Settings' },
];

const BLANK_WORKFLOW = JSON.stringify(
  {
    name: 'Untitled',
    nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} }],
    connections: {},
  },
  null,
  2,
);

function Jason({ onSignOut }) {
  const [section, setSection] = useState('overview');
  const [folded, setFolded] = useState(() => window.innerWidth < 860);
  const [tab, setTab] = useState('canvas');
  const [data, setData] = useState(null);
  const [checkedAt, setCheckedAt] = useState(null);
  const [messages, setMessages] = useState([]);
  const [live, setLive] = useState([]);
  const [busy, setBusy] = useState(false);
  const [approval, setApproval] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [calls, setCalls] = useState([]);
  const [palette, setPalette] = useState(false);

  // The terminal's buffer lives up here so switching tabs never loses an edit.
  const [code, setCode] = useState(BLANK_WORKFLOW);
  const [codeId, setCodeId] = useState('');
  const codeDirty = useRef(false);

  // Held in a ref as well as state: the 'done' frame needs the latest drawing
  // synchronously, and reading state there would capture a stale closure.
  const lastCanvas = useRef(null);
  // Kept across reloads. Regenerated on every page load, a refresh — or a phone
  // evicting the tab — started a brand new conversation, so he lost everything
  // you were in the middle of and the old one was orphaned server-side. It read
  // as him being forgetful; it was the page throwing the thread away.
  const sessionId = useRef(
    (() => {
      try {
        const kept = localStorage.getItem('jason.session');
        if (kept) return kept;
        const fresh = `s_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('jason.session', fresh);
        return fresh;
      } catch {
        return `s_${Math.random().toString(36).slice(2)}`;
      }
    })(),
  );
  const restored = useRef(false);

  const prefs = data?.sections?.settings?.data?.prefs;
  const n8nBaseUrl = data?.sections?.settings?.data?.n8nBaseUrl ?? null;

  const [signedOut, setSignedOut] = useState(false);

  const refresh = useCallback(() => {
    // The conversation is only wanted once, to put the screen back after a
    // reload. Asking for it on every poll would read it out of the database
    // twice a minute forever and throw it away each time.
    const wantConversation = !restored.current;
    fetch(`/api/dashboard${wantConversation ? `?sessionId=${encodeURIComponent(sessionId.current)}` : ''}`)
      .then(async (r) => {
        // A poll that quietly fails leaves the numbers on screen looking
        // current when nobody is reading them any more.
        if (r.status === 401) { setSignedOut(true); return null; }
        setSignedOut(false);
        return r.json();
      })
      .then((d) => {
        if (!d?.ok) return;
        setData(d);
        setCheckedAt(new Date().toISOString());

        // Once, on the first read: put back what was said before the reload, so
        // the screen agrees with what he remembers. Never on later polls, which
        // would trample a conversation in flight.
        if (!restored.current) {
          restored.current = true;
          const prior = d.sections?.conversation?.data;
          if (Array.isArray(prior) && prior.length) {
            setMessages((current) => (current.length ? current : prior.map((m) => ({ ...m, restored: true }))));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Free reads only, paused when hidden. The model is never called on a timer.
  useEffect(() => {
    const secs = prefs?.refreshSeconds ?? 30;
    const id = setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, secs * 1000);
    return () => clearInterval(id);
  }, [refresh, prefs?.refreshSeconds]);

  const state = useMemo(() => {
    if (approval) return 'waiting';
    if (busy) return /saving|switching|fetching|testing|putting/.test(live[live.length - 1]?.text ?? '') ? 'acting' : 'thinking';
    if (data?.vitals?.n8n?.configured && !data.vitals.n8n.reachable) return 'offline';
    if ([...messages].reverse().find((m) => m.role === 'jason')?.status === 'ok') return 'resolved';
    return 'idle';
  }, [busy, live, approval, data, messages]);

  // Held locally as well as saved, so the toggle lands instantly instead of
  // waiting on a round trip to the server and back through the dashboard.
  const [theme, setTheme] = useState(null);
  const chosenTheme = theme ?? prefs?.theme ?? 'light';

  useEffect(() => {
    const r = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const paint = () => {
      r.dataset.theme = chosenTheme === 'auto' ? (media.matches ? 'dark' : 'light') : chosenTheme;
    };
    paint();
    // On "auto", follow the system when it changes — otherwise the setting only
    // takes effect on a reload, which reads as it not working.
    media.addEventListener?.('change', paint);
    return () => media.removeEventListener?.('change', paint);
  }, [chosenTheme]);

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.state = state;
    r.dataset.accent = prefs?.accent ?? 'cyan';
    r.dataset.motion = prefs?.motion === false ? 'off' : 'on';
    r.dataset.busy = busy ? 'yes' : 'no';
  }, [state, busy, prefs?.accent, prefs?.motion]);

  /** Day → night → follow the system, and round again. */
  const cycleTheme = () => {
    const order = ['light', 'dark', 'auto'];
    const next = order[(order.indexOf(chosenTheme) + 1) % order.length];
    setTheme(next);
    post('/api/settings', { prefs: { theme: next } }).then(refresh);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === 'Escape') setPalette(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const said = {
    idle: 'Idle',
    thinking: live[live.length - 1]?.text ?? 'Thinking',
    acting: live[live.length - 1]?.text ?? 'Working',
    waiting: 'Waiting on you',
    resolved: 'Done',
    offline: "Can't reach your n8n",
  }[state];

  /** Pull the workflow he is writing into the terminal, unless you've edited it. */
  const offerCode = (workflow, id) => {
    if (!workflow?.nodes || codeDirty.current) return;
    setCode(JSON.stringify(workflow, null, 2));
    if (id) setCodeId(String(id));
  };

  async function send(text, approvals = []) {
    if (!text.trim() || busy) return;
    setBusy(true); setLive([]); setApproval(null); setCanvas(null); lastCanvas.current = null;
    setMessages((m) => [...m, { role: 'user', text }]);
    const events = [];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sessionId: sessionId.current, approvals }),
      });
      if (res.status === 401) { setMessages((m) => [...m, { role: 'jason', text: 'Session expired — reload.', status: 'error' }]); return; }
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const frames = buf.split('\n\n'); buf = frames.pop() ?? '';
        for (const f of frames) {
          const ev = f.split('\n').find((l) => l.startsWith('event: '))?.slice(7).trim();
          const dl = f.split('\n').find((l) => l.startsWith('data: '));
          if (!ev || !dl) continue;
          let d; try { d = JSON.parse(dl.slice(6)); } catch { continue; }

          if (ev === 'status') events.push({ kind: 'run', text: d.status, key: `s${events.length}` });

          if (ev === 'tool_start') {
            events.push({ kind: 'run', text: d.say ?? d.name, key: d.name });
            // The terminal is the point of this: you see the JSON he wrote,
            // not a description of it.
            offerCode(d.args?.workflow, d.args?.id);
            setCalls((c) => [...c.slice(-199), { at: new Date().toISOString(), name: d.name, say: d.say, args: d.args, kind: 'run' }]);
          }

          if (ev === 'tool_end') {
            const hit = [...events].reverse().find((e) => e.key === d.name && e.kind === 'run');
            if (hit) { hit.kind = d.ok ? 'ok' : 'bad'; hit.text = d.say ?? d.name; hit.error = d.ok ? null : d.error; }
            if (d.preview) { lastCanvas.current = d.preview; setCanvas(d.preview); }
            if (d.needsApproval) setApproval({ action: d.needsApproval, detail: d.error });
            setCalls((c) => {
              const i = c.map((x) => x.name).lastIndexOf(d.name);
              if (i < 0) return c;
              const next = [...c];
              next[i] = { ...next[i], kind: d.ok ? 'ok' : 'bad', error: d.error, detail: d.detail ?? null, endedAt: new Date().toISOString() };
              return next;
            });
          }

          if (ev === 'done') { setMessages((m) => [...m, { role: 'jason', text: d.reply, steps: [...events], status: d.status, spend: d.spend, elapsedMs: d.elapsedMs, canvas: lastCanvas.current }]); refresh(); }
          if (ev === 'error') setMessages((m) => [...m, { role: 'jason', text: d.error, status: 'error' }]);
          setLive([...events]);
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'jason', text: `Couldn't reach the server: ${err.message}. Connection problem, not necessarily your workflows.`, status: 'error' }]);
    } finally { setBusy(false); setLive([]); }
  }

  const wf = data?.sections?.workflows?.data ?? [];
  const ex = data?.sections?.executions?.data ?? [];
  const findings = data?.sections?.findings?.data ?? [];
  const spend = data?.sections?.spend?.data;
  const geminiKey = data?.sections?.settings?.data?.geminiApiKey;
  const ready = geminiKey?.set;
  // Three states, not two. A key that is stored but cannot be decrypted is not
  // a missing key, and "add a Gemini key" is the wrong instruction for it.
  const keyNote = geminiKey?.unreadable
    ? 'A Gemini key is saved but cannot be decrypted — MASTER_KEY changed. Paste it again in Settings.'
    : 'No Gemini key yet — Settings, in the panel.';
  const failed24h = ex.filter((e) => e.status === 'error' && Date.now() - new Date(e.startedAt).getTime() < 864e5).length;

  /** Which nodes actually ran, from the most recent execution he read back. */
  const runState = useMemo(() => {
    const withExec = [...calls].reverse().find((c) => c.detail?.execution?.nodes?.length);
    if (!withExec) return {};
    return Object.fromEntries(withExec.detail.execution.nodes.map((n) => [n.node, n.status]));
  }, [calls]);

  const openInN8n = (id) => {
    if (!n8nBaseUrl || !id) return;
    window.open(`${n8nBaseUrl.replace(/\/$/, '')}/workflow/${id}`, '_blank', 'noopener');
  };

  const loadIntoTerminal = async (id) => {
    setTab('terminal');
    const r = await post('/api/workflow', { action: 'get', id });
    if (r.ok) { setCode(JSON.stringify(r.workflow, null, 2)); setCodeId(String(id)); codeDirty.current = false; }
  };

  const commands = useMemo(() => [
    { label: 'Canvas', hint: 'view', run: () => setTab('canvas') },
    { label: 'Terminal', hint: 'view', run: () => setTab('terminal') },
    ...SECTIONS.map((s) => ({ label: s.label, hint: 'panel', run: () => { setSection(s.id); setFolded(false); } })),
    { label: folded ? 'Show panel' : 'Hide panel', hint: 'panel', run: () => setFolded((f) => !f) },
    ...wf.map((w) => ({ label: `Open ${w.name} in n8n`, hint: 'n8n', run: () => openInN8n(w.id) })),
    ...wf.map((w) => ({ label: `Edit ${w.name} here`, hint: 'terminal', run: () => loadIntoTerminal(w.id) })),
    {
      label: 'Start a new conversation',
      hint: 'chat',
      run: () => {
        const fresh = `s_${Math.random().toString(36).slice(2)}`;
        try { localStorage.setItem('jason.session', fresh); } catch { /* private mode */ }
        sessionId.current = fresh;
        restored.current = true;
        setMessages([]);
        setCanvas(null);
        setCalls([]);
      },
    },
    { label: 'Sign out', hint: '', run: onSignOut },
  ], [wf, folded, n8nBaseUrl]);

  return (
    <div className="app">
      <header className="bar">
        <Mark />
        <span className="brand">Jason</span>
        <div className="state"><i className="led" /><span>{said}</span></div>

        <div className="bar-right">
          <div className="stat-chip" title="Workflows in your n8n"><b>{wf.length}</b>flows</div>
          <div className={`stat-chip ${failed24h ? 'alert' : ''}`} title="Failed runs in the last 24 hours"><b>{failed24h}</b>failed</div>
          <div className="stat-chip" title="This month, against your cap">
            <b>{spend ? `$${spend.monthToDateUsd.toFixed(2)}` : '$—'}</b>/ ${spend?.capUsd ?? '—'}
          </div>
          <button className="icon-btn" title="Commands" onClick={() => setPalette(true)}><Svg>{ICONS.command}</Svg></button>
          <span className="kbd">⌘K</span>
          <button
            className="icon-btn"
            title={{ light: 'Day — click for night', dark: 'Night — click to follow your system', auto: 'Following your system — click for day' }[chosenTheme]}
            aria-label={`Theme: ${chosenTheme}`}
            onClick={cycleTheme}
          >
            <Svg>{ICONS[chosenTheme === 'dark' ? 'moon' : chosenTheme === 'auto' ? 'auto' : 'sun']}</Svg>
          </button>
          <button className="icon-btn" title={folded ? 'Show panel' : 'Hide panel'} onClick={() => setFolded((f) => !f)}><Svg>{ICONS.panel}</Svg></button>
          <button className="icon-btn" title="Sign out" onClick={onSignOut}><Svg>{ICONS.power}</Svg></button>
        </div>
      </header>

      <div className="middle">
        <main className="work">
          <div className="tabs">
            <button aria-selected={tab === 'canvas'} onClick={() => setTab('canvas')}>Canvas</button>
            <button aria-selected={tab === 'terminal'} onClick={() => setTab('terminal')}>Terminal</button>
            <span className="grow" />
            <span className="tag">{tab === 'canvas' ? (canvas?.name ?? 'nothing drawn') : `${calls.length} calls`}</span>
          </div>

          <div className="surface">
            {tab === 'canvas' ? (
              <CanvasView preview={canvas} runState={runState} busy={busy} ready={ready} keyNote={keyNote} onSend={send} />
            ) : (
              <Terminal
                code={code}
                setCode={(v) => { codeDirty.current = true; setCode(v); }}
                id={codeId}
                setId={setCodeId}
                calls={calls}
                onSaved={() => { codeDirty.current = false; refresh(); }}
              />
            )}
          </div>
        </main>

        <aside className={`panel ${folded ? 'folded' : ''}`}>
          <nav className="panel-tabs">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-selected={section === s.id && !folded}
                title={s.label}
                onClick={() => { setSection(s.id); setFolded(false); }}
              >
                <Svg>{ICONS[s.icon]}</Svg>
                <span className="lbl">{s.label}</span>
                {s.id === 'broke' && findings.length ? <span className="n">{findings.length}</span> : null}
                {s.id === 'workflows' && wf.length ? <span className="n">{wf.length}</span> : null}
              </button>
            ))}
          </nav>

          {/* Folded still carries numbers. A fold that empties the screen is
              exactly what made the previous version feel dead. */}
          <div className="strip">
            <div><div className="v">{wf.length}</div><div className="k">flows</div></div>
            <div><div className={`v ${failed24h ? 'bad' : ''}`}>{failed24h}</div><div className="k">failed</div></div>
            <div><div className="v">{ex.length}</div><div className="k">runs</div></div>
            <div><div className="v">{spend ? spend.monthToDateUsd.toFixed(2) : '—'}</div><div className="k">usd</div></div>
          </div>

          <div className="panel-body">
            {section === 'overview' && <Overview data={data} />}
            {section === 'workflows' && <Workflows data={data} onOpen={openInN8n} onEdit={loadIntoTerminal} canOpen={Boolean(n8nBaseUrl)} />}
            {section === 'broke' && <Broke findings={findings} onChanged={refresh} />}
            {section === 'memory' && <Memory />}
            {section === 'settings' && <Settings onSaved={refresh} />}
          </div>
        </aside>
      </div>

      <Dock
        messages={messages}
        live={live}
        busy={busy}
        ready={ready}
        keyNote={keyNote}
        approval={approval}
        onSend={send}
        onDismiss={() => setApproval(null)}
        showStream={prefs?.showToolStream !== false}
      />

      <footer className="status">
        <i className={`heart ${signedOut || (checkedAt && Date.now() - new Date(checkedAt).getTime() > (prefs?.refreshSeconds ?? 30) * 2500) ? 'stale' : ''}`} />
        {signedOut ? (
          <button className="ghost" style={{ padding: '0 8px', fontSize: 10.5, height: 16 }} onClick={() => window.location.reload()}>
            signed out — these numbers are old, click to sign in
          </button>
        ) : (
          <span>checked {ago(checkedAt)} ago</span>
        )}
        <i className="sep" />
        <span>{data?.vitals?.nodeIndex?.nodeCount ?? '—'} nodes known</span>
        <i className="sep" />
        <div className="ticker">
          {ex.slice(0, 8).map((e) => (
            <span className="run" key={e.id}>
              <span>{clock(e.startedAt)}</span>
              <span className={e.status === 'error' ? 'bad' : 'ok'}>{e.status === 'error' ? '✕' : '✓'}</span>
              <span>{e.workflowName ?? e.workflowId}</span>
              <span>{dur(e.startedAt, e.stoppedAt)}</span>
            </span>
          ))}
          {!ex.length && <span className="run"><span>no runs recorded</span></span>}
        </div>
        <i className="sep" />
        <span>{data?.vitals?.build?.buildId ?? 'unstamped'}</span>
      </footer>

      {palette && <Palette commands={commands} onClose={() => setPalette(false)} />}
    </div>
  );
}

/* ================================================================== canvas */

const STARTERS = [
  'What do I have running?',
  'Has anything broken?',
  'Build me a contact form that posts good leads to Slack',
];

/**
 * The workflow, drawn as it is built. Columns are distance from the trigger,
 * which is the only layout that matches how the thing actually runs.
 *
 * A node switched off for a dry run is dashed and faded, so "nothing was sent"
 * is something you can see rather than only be told. A wire animates only when
 * the node feeding it has genuinely run and the one after it has not — it is
 * execution state, not decoration.
 */
function CanvasView({ preview, runState, busy, ready, keyNote, onSend }) {
  if (!preview?.nodes?.length) {
    // Still inside the grid. An empty bench should read as an empty workbench,
    // not as a blank page — that difference is most of what "it feels dead" was.
    return (
      <div className="canvas-wrap">
        <div className="blank">
          <div>
            <h2>Nothing on the bench.</h2>
            <p>Describe the outcome below. Whatever he builds gets drawn here as he builds it.</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              {STARTERS.map((s) => <button key={s} className="ghost" disabled={!ready} onClick={() => onSend(s)}>{s}</button>)}
            </div>
            {!ready && <p style={{ marginTop: 14, color: 'var(--invisible)' }}>{keyNote}</p>}
          </div>
        </div>
      </div>
    );
  }

  const depths = [...new Set(preview.nodes.map((n) => n.depth))].sort((a, b) => a - b);
  const at = (d) => preview.nodes.filter((n) => n.depth === d);
  const ranAt = (d) => at(d).some((n) => runState[n.name]);

  return (
    <div className="canvas-wrap">
      <div className="flow">
        {depths.map((d, i) => (
          <span key={d} style={{ display: 'contents' }}>
            {i > 0 && <span className={`wire ${busy && ranAt(depths[i - 1]) && !ranAt(d) ? 'hot' : ''}`} />}
            <div className="col">
              {at(d).map((n) => (
                <div key={n.name} className={`step ${n.trigger ? 'trigger' : ''} ${n.muted ? 'muted' : ''} ${runState[n.name] === 'ok' ? 'ran' : ''} ${runState[n.name] === 'error' ? 'failed' : ''}`}>
                  <div className="st-head">
                    {runState[n.name] && <span className={`dot ${runState[n.name] === 'error' ? 'bad' : 'ok'}`} />}
                    <span className="st-name" title={n.name}>{n.name}</span>
                  </div>
                  <div className="st-kind">{n.short}</div>
                </div>
              ))}
            </div>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================ terminal */

const TERM_VIEWS = [
  { id: 'json', label: 'workflow.json' },
  { id: 'calls', label: 'calls' },
  { id: 'output', label: 'output' },
];

/**
 * The terminal: what he wrote, what he called, and what came back.
 *
 * The JSON here is editable and Save posts it to /api/workflow, which runs the
 * same three-layer validator and takes the same snapshot before overwriting.
 * Check is entirely local, so you can validate an edit with n8n unreachable.
 */
function Terminal({ code, setCode, id, setId, calls, onSaved }) {
  const [view, setView] = useState('json');
  const [note, setNote] = useState(null);
  const [problems, setProblems] = useState(null);
  const [busy, setBusy] = useState(false);

  const parse = () => {
    try {
      return { ok: true, workflow: JSON.parse(code) };
    } catch (err) {
      return { ok: false, error: `That isn't valid JSON: ${err.message}` };
    }
  };

  const act = async (action) => {
    const p = parse();
    if (!p.ok) { setProblems(null); return setNote({ tone: 'bad', text: p.error }); }
    setBusy(true);
    const r = await post('/api/workflow', { action, workflow: p.workflow, id: id || undefined });
    setBusy(false);
    setProblems(r.validation ?? null);

    if (action === 'check') {
      const errs = r.validation?.errors?.length ?? 0;
      const warns = r.validation?.warnings?.length ?? 0;
      return setNote(
        errs
          ? { tone: 'bad', text: `${errs} thing${errs > 1 ? 's' : ''} would fail. Listed below.` }
          : { tone: warns ? 'warn' : 'ok', text: warns ? `Valid, with ${warns} to look at.` : 'Valid.' },
      );
    }
    if (!r.ok) return setNote({ tone: 'bad', text: r.error });
    if (r.id) setId(String(r.id));
    setNote({ tone: r.confirmed ? 'ok' : 'unknown', text: r.note });
    onSaved?.();
  };

  const load = async () => {
    if (!id) return setNote({ tone: 'warn', text: 'Which workflow? Put its id in the box.' });
    setBusy(true);
    const r = await post('/api/workflow', { action: 'get', id });
    setBusy(false);
    if (!r.ok) return setNote({ tone: 'bad', text: r.error });
    setCode(JSON.stringify(r.workflow, null, 2));
    setNote({ tone: 'ok', text: `Loaded ${r.workflow?.name ?? id}.` });
  };

  return (
    <div className="term">
      <div className="term-tabs">
        {TERM_VIEWS.map((v) => (
          <button key={v.id} aria-selected={view === v.id} onClick={() => setView(v.id)}>{v.label}</button>
        ))}
        {view === 'json' && (
          <div className="actions">
            <input value={id} placeholder="workflow id" style={{ width: 104 }} onChange={(e) => setId(e.target.value.trim())} />
            <button className="ghost" disabled={busy} onClick={load}>Load</button>
            <button className="ghost" disabled={busy} onClick={() => act('check')}>Check</button>
            <button disabled={busy} onClick={() => act('save')}>{id ? 'Save' : 'Create'}</button>
          </div>
        )}
      </div>

      <div className="term-body">
        {view === 'json' && (
          <>
            {note && <div className={`notice ${note.tone === 'bad' ? 'bad' : note.tone === 'unknown' ? 'unknown' : note.tone === 'warn' ? 'warn' : ''}`} style={{ margin: 8 }}>{note.text}</div>}
            {problems?.errors?.map((e, i) => (
              <div className="notice bad" key={`e${i}`} style={{ margin: '0 8px 6px' }}>
                <span className="mono">{e.node ? `${e.node} · ` : ''}{e.code}</span><br />{e.message}
              </div>
            ))}
            {problems?.warnings?.map((w, i) => (
              <div className="notice warn" key={`w${i}`} style={{ margin: '0 8px 6px' }}>
                <span className="mono">{w.node ? `${w.node} · ` : ''}{w.code}</span><br />{w.message}
              </div>
            ))}
            <textarea className="code" spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} />
          </>
        )}

        {view === 'calls' && (
          <div className="log">
            {!calls.length && <div className="empty">Nothing called yet. Every tool he uses shows up here with its arguments.</div>}
            {calls.map((c, i) => (
              <div key={i}>
                <div className={`line ${c.kind === 'bad' ? 'bad' : ''}`}>
                  <span className="t">{clock(c.at)}</span>
                  <span className="n">{c.name}</span>
                  <span className="d">{c.error ?? c.say ?? ''}</span>
                </div>
                {c.args && Object.keys(c.args).length > 0 && (
                  <details className="result">
                    <summary>arguments</summary>
                    <pre>{JSON.stringify(c.args, null, 2)}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {view === 'output' && <Output calls={calls} />}
      </div>
    </div>
  );
}

/** What each node actually produced, per run he read back. */
function Output({ calls }) {
  const runs = calls.filter((c) => c.detail?.execution?.nodes?.length);
  if (!runs.length) return <div className="empty">Nothing has run yet. Once he tests something, each step's output lands here.</div>;

  return (
    <div className="log">
      {runs.map((c, i) => (
        <div key={i}>
          <div className="line">
            <span className="t">{clock(c.endedAt ?? c.at)}</span>
            <span className="n">{c.name}</span>
            <span className="d">
              execution {c.detail.execution.id ?? '—'} · {c.detail.execution.status ?? 'unknown'}
              {c.detail.disabledWriteNodes ? ` · switched off: ${c.detail.disabledWriteNodes.join(', ')}` : ''}
            </span>
          </div>
          {c.detail.execution.nodes.map((n, j) => (
            <div key={j}>
              <div className={`line ${n.status === 'error' ? 'bad' : ''}`}>
                <span className="t">{n.status === 'error' ? '✕' : '✓'}</span>
                <span className="n">{n.node}</span>
                <span className="d">{n.error ?? `${n.itemCount ?? 0} item${n.itemCount === 1 ? '' : 's'}`}</span>
              </div>
              {n.firstItem && (
                <details className="result">
                  <summary>first item out of {n.node}</summary>
                  <pre>{n.firstItem}</pre>
                </details>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ==================================================================== dock */

function Dock({ messages, live, busy, ready, keyNote, approval, onSend, onDismiss, showStream }) {
  const [input, setInput] = useState('');
  const bottom = useRef(null);
  // Block body, deliberately. An arrow with an implicit return hands whatever
  // scrollIntoView returns back to React as this effect's CLEANUP function.
  // Chromium returns undefined so it looked fine everywhere I tested; browsers
  // and smooth-scroll polyfills that return a Promise made React call it on the
  // next render — "g is not a function" — which unmounted the whole tree and
  // left a white screen the moment a reply arrived.
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, live]);

  const submit = () => { onSend(input); setInput(''); };
  const hasThread = messages.length > 0 || live.length > 0 || approval;

  return (
    <div className="dock">
      {hasThread && (
        <div className="dock-thread">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="who">{m.role === 'user' ? 'you' : 'jason'}</div>
              {m.role === 'jason' && showStream && m.steps?.length > 0 && (
                <div className="steps">{m.steps.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
              )}
              <div className="body">{m.text}</div>
              {m.role === 'jason' && (
                <div className="after">
                  {m.status && PLAIN[m.status] && <span className="verdict unconfirmed">{PLAIN[m.status]}</span>}
                  {m.spend && <span>${m.spend.monthToDateUsd.toFixed(4)}</span>}
                  {m.elapsedMs ? <span>{(m.elapsedMs / 1000).toFixed(1)}s</span> : null}
                </div>
              )}
            </div>
          ))}

          {live.length > 0 && showStream && (
            <div className="msg jason">
              <div className="who">jason</div>
              <div className="steps">{live.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
            </div>
          )}

          {approval && (
            <div className="approval">
              <div style={{ marginBottom: 10 }}>{approval.detail}</div>
              <div className="row">
                {/* Disabled while the turn is still streaming. Left enabled,
                    the click was silently dropped — you pressed Approve, nothing
                    happened, and nothing said why. */}
                <button disabled={busy} onClick={() => onSend('Yes, go ahead.', [approval.action])}>
                  {busy ? 'finishing…' : 'Approve'}
                </button>
                <button className="ghost" disabled={busy} onClick={onDismiss}>Not now</button>
              </div>
            </div>
          )}
          <div ref={bottom} />
        </div>
      )}

      <div className="dock-line">
        <span className="caret">›</span>
        <textarea
          value={input}
          rows={1}
          placeholder={ready ? 'Describe what you want built…' : keyNote}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
        />
        <button onClick={submit} disabled={busy || !ready || !input.trim()}>{busy ? '…' : 'Send'}</button>
      </div>
    </div>
  );
}

/* ================================================================= palette */

function Palette({ commands, onClose }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const hits = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())).slice(0, 40);
  const pick = (c) => { c?.run(); onClose(); };

  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette">
        <input
          autoFocus
          value={q}
          placeholder="Jump to, or open a workflow in n8n…"
          onChange={(e) => { setQ(e.target.value); setI(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, hits.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); pick(hits[i]); }
          }}
        />
        <ul>
          {hits.map((c, n) => (
            <li key={c.label} aria-selected={n === i} onMouseEnter={() => setI(n)} onMouseDown={() => pick(c)}>
              {c.label}
              {c.hint && <span className="hint">{c.hint}</span>}
            </li>
          ))}
          {!hits.length && <li>Nothing matches.</li>}
        </ul>
      </div>
    </div>
  );
}

/* =================================================================== panel */

function Overview({ data }) {
  if (!data) return <div className="empty">Reading…</div>;
  const { vitals, sections } = data;
  const wf = sections.workflows.data ?? [];
  const ex = sections.executions.data ?? [];
  const spend = sections.spend.data;

  const recent = ex.filter((e) => Date.now() - new Date(e.startedAt).getTime() < 864e5);
  const failed = recent.filter((e) => e.status === 'error').length;
  const okRate = recent.length ? Math.round(((recent.length - failed) / recent.length) * 100) : null;
  const pct = spend ? Math.min(100, (spend.monthToDateUsd / Math.max(spend.capUsd, 0.01)) * 100) : 0;
  const noticed = observations({ workflows: wf, executions: ex, findings: sections.findings.data ?? [], spend });

  return (
    <>
      {vitals.store?.degraded && (
        <div className="notice bad">
          Your database is set up but will not open, so nothing is being saved — keys, memory and sign-in are all living in memory
          until the next cold start. This is not fixed by adding DATABASE_URL; it is already there. {vitals.store.note}
        </div>
      )}
      {vitals.n8n?.configured && !vitals.n8n?.reachable && <div className="notice unknown">Can't reach your n8n. State unknown, not broken.</div>}
      {!vitals.n8n?.configured && <div className="notice warn">No n8n connected yet — Settings.</div>}

      <div className="card">
        <div className="tiles">
          <Tile k="Workflows" v={wf.length} s={`${wf.filter((w) => w.active).length} live`} />
          <Tile k="Runs 24h" v={recent.length} s={okRate === null ? 'no data' : `${okRate}% ok`} />
          <Tile k="Failed" v={failed} s={failed ? 'see panel' : 'clear'} />
          <Tile k="Spend" v={spend ? `$${spend.monthToDateUsd.toFixed(2)}` : '—'} s={spend ? `of $${spend.capUsd}` : '—'} meter={pct} />
        </div>
      </div>

      {noticed.length > 0 && (
        <div className="card">
          <h3>Noticed<span className="rule" /></h3>
          {noticed.map((o, i) => (
            <div key={i} className="row" style={{ gap: 7, padding: '2px 0' }}>
              <span className={`dot ${o.tone}`} /><span style={{ fontSize: 12.5 }}>{o.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Activity<span className="rule" /><span className="meta">14d</span></h3>
        <Activity executions={ex} />
      </div>

      <div className="card">
        <h3>Recent runs<span className="rule" /></h3>
        {ex.slice(0, 12).map((e) => (
          <div key={e.id} className="row" style={{ gap: 8, padding: '2px 0', fontSize: 12, flexWrap: 'nowrap' }}>
            <span className="mono" style={{ color: 'var(--dimmer)' }}>{clock(e.startedAt).slice(0, 5)}</span>
            <span className={`dot ${e.status === 'error' ? 'bad' : e.status === 'success' ? 'ok' : 'unk'}`} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--dim)' }}>{e.workflowName ?? e.workflowId}</span>
            <span className="mono" style={{ color: 'var(--dimmer)' }}>{dur(e.startedAt, e.stoppedAt)}</span>
          </div>
        ))}
        {!ex.length && <div className="empty">Nothing has run.</div>}
      </div>

      <div className="card">
        <h3>Jason<span className="rule" /></h3>
        <Vitals vitals={vitals} />
      </div>
    </>
  );
}

const Tile = ({ k, v, s, meter }) => (
  <div className="tile">
    <div className="k">{k}</div>
    <div className="v">{v}</div>
    <div className="s">{s}</div>
    {meter !== undefined && <div className="meter"><i style={{ width: `${meter}%` }} /></div>}
  </div>
);

/**
 * Plain observations from data already fetched. No model call, no cost — he is
 * not thinking about you in the background, he is reading the same numbers you
 * are and saying the obvious thing out loud.
 */
function observations({ workflows, executions, findings, spend }) {
  const out = [];
  for (const w of workflows) {
    const mine = executions.filter((e) => e.workflowId === w.id);
    const failed = mine.filter((e) => e.status === 'error');
    if (failed.length >= 3) out.push({ tone: 'bad', text: `${w.name} has failed ${failed.length} times recently.` });
    else if (w.active && mine.length === 0) out.push({ tone: 'unk', text: `${w.name} is on but hasn't run.` });
  }
  const last = executions[0];
  if (last && Date.now() - new Date(last.startedAt).getTime() > 7 * 864e5) out.push({ tone: 'unk', text: 'Nothing has run anywhere in over a week.' });
  if (spend && spend.monthToDateUsd > spend.capUsd * 0.8) out.push({ tone: 'bad', text: `You're at ${Math.round((spend.monthToDateUsd / spend.capUsd) * 100)}% of your cap.` });
  if (findings.length) out.push({ tone: 'bad', text: `${findings.length} thing${findings.length > 1 ? 's' : ''} waiting for you.` });
  return out.slice(0, 4);
}

function Activity({ executions }) {
  const days = 14;
  const buckets = Array.from({ length: days }, () => ({ ok: 0, bad: 0 }));
  const today = new Date().setHours(0, 0, 0, 0);
  for (const e of executions) {
    const idx = days - 1 - Math.round((today - new Date(e.startedAt).setHours(0, 0, 0, 0)) / 864e5);
    if (idx >= 0 && idx < days) buckets[idx][e.status === 'error' ? 'bad' : 'ok']++;
  }
  const max = Math.max(1, ...buckets.map((b) => b.ok + b.bad));
  if (!executions.length) return <div className="empty">No runs yet.</div>;
  return (
    <div className="bars">
      {buckets.map((b, i) => (
        <div className="b" key={i} title={`${b.ok} ok · ${b.bad} failed`}>
          <span className="ok" style={{ height: `${(b.ok / max) * 36}px` }} />
          <span className="bad" style={{ height: `${(b.bad / max) * 36}px` }} />
        </div>
      ))}
    </div>
  );
}

const Workflows = ({ data, onOpen, onEdit, canOpen }) => {
  const wf = data?.sections?.workflows?.data ?? [];
  const ex = data?.sections?.executions?.data ?? [];
  if (!wf.length) return <div className="empty">{data?.sections?.workflows?.error ?? 'Nothing here yet.'}</div>;

  return (
    <>
      {wf.map((w) => {
        const last = ex.find((e) => e.workflowId === w.id);
        return (
          <div className="item" key={w.id}>
            <div className="head">
              <span className={`dot ${w.isArchived ? 'off' : w.active ? 'ok' : 'unk'}`} />
              <span className="title">{w.name}</span>
              <span className="when">{last ? ago(last.startedAt) : 'never'}</span>
            </div>
            <div className="chain">
              {w.chain.map((n, i) => (
                <span key={i} style={{ display: 'contents' }}>{i > 0 && <span className="a">→</span>}<span className="n">{n.short}</span></span>
              ))}
              {w.nodeCount > w.chain.length && <span className="a">+{w.nodeCount - w.chain.length}</span>}
            </div>
            {/* Saved and runnable are two facts. A workflow with a placeholder
                in it sits here looking exactly like a finished one, and finds
                out at 7am with nobody watching. */}
            {w.readiness && !w.readiness.ready && (
              <div className="meta" style={{ color: 'var(--invisible)' }}>{w.readiness.summary}</div>
            )}
            <div className="row" style={{ marginTop: 6 }}>
              <button className="ghost" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => onEdit(w.id)}>Edit here</button>
              <button className="ghost" style={{ padding: '2px 8px', fontSize: 11 }} disabled={!canOpen} onClick={() => onOpen(w.id)}>Open in n8n</button>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Broke = ({ findings, onChanged }) => {
  const [busy, setBusy] = useState(null);

  const resolve = async (id) => {
    setBusy(id);
    const r = await post('/api/findings', { action: 'resolve', id });
    setBusy(null);
    if (r.ok) onChanged?.();
  };

  if (!findings.length) {
    return <div className="empty">Nothing has failed since the last check. That's what I know — not a promise everything ran.</div>;
  }

  return (
    <>
      {findings.map((f) => (
        <div className="item" key={f.id}>
          <div className="head">
            <span className="dot bad" />
            <span className="title">{f.workflowName ?? f.workflowId}</span>
            <span className="when">{ago(f.lastSeenAt ?? f.at)}</span>
          </div>
          <div className="meta">{f.failingNode ?? 'unknown step'} — {f.error ?? 'no message'}</div>
          {/* "It broke" and "it has broken forty times since Tuesday" are
              different sentences with different urgency, and the second one is
              only sayable because repeats update the finding instead of
              stacking up next to it. */}
          {(f.seenCount ?? 1) > 1 && (
            <div className="meta" style={{ color: 'var(--failed)' }}>
              {f.seenCount} times, first {ago(f.at)}
            </div>
          )}
          <div className="row" style={{ marginTop: 6 }}>
            {/* Without this the count only ever went up: you could fix the
                workflow, watch it run clean, and still be told it needed a
                look. Marking it dealt with keeps the record — it is a status,
                not an erasure. */}
            <button className="ghost" style={{ padding: '2px 8px', fontSize: 11 }} disabled={busy === f.id} onClick={() => resolve(f.id)}>
              {busy === f.id ? '…' : 'Dealt with'}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

function Vitals({ vitals }) {
  const [more, setMore] = useState(false);
  return (
    <>
      <div className="kv">
        <div><span className="k">Your n8n</span><span className="v"><span className={`dot ${vitals.n8n?.reachable ? 'ok' : vitals.n8n?.configured ? 'bad' : 'off'}`} />{vitals.n8n?.reachable ? 'connected' : vitals.n8n?.configured ? "can't reach" : 'not set up'}</span></div>
        <div><span className="k">Nodes I know</span><span className="v">{vitals.nodeIndex?.nodeCount ?? '—'}</span></div>
        <div>
          <span className="k">Memory</span>
          <span className="v" title={vitals.store?.note ?? ''}>
            <span className={`dot ${vitals.store?.durable ? 'ok' : 'bad'}`} />
            {vitals.store?.durable ? 'saved' : vitals.store?.degraded ? "database won't open" : 'not saved'}
          </span>
        </div>
        <div><span className="k">Your keys</span><span className="v"><span className={`dot ${vitals.encryption?.source === 'env' ? 'ok' : 'unk'}`} />{vitals.encryption?.source === 'env' ? 'locked away' : 'encrypted'}</span></div>
      </div>
      <button className="ghost" style={{ marginTop: 9, padding: '3px 9px', fontSize: 11 }} onClick={() => setMore((m) => !m)}>{more ? 'Less' : 'Details'}</button>
      {more && (
        <div className="kv" style={{ marginTop: 8 }}>
          <div><span className="k">Build</span><span className="v">{vitals.build?.buildId ?? 'unstamped'}</span></div>
          <div><span className="k">Operations</span><span className="v">{vitals.nodeIndex?.operationCount ?? '—'}</span></div>
          <div><span className="k">Schemas here</span><span className="v">{vitals.nodeIndex?.schemasBundledHere ? 'yes' : 'no'}</span></div>
          <div><span className="k">n8n-nodes-base</span><span className="v">{vitals.nodeIndex?.packages?.['n8n-nodes-base'] ?? '—'}</span></div>
          <div><span className="k">Instance version</span><span className="v"><span className="dot unk" />unconfirmed</span></div>
          <div><span className="k">Models</span><span className="v">{vitals.models?.chat} / {vitals.models?.design}</span></div>
        </div>
      )}
    </>
  );
}

/** What he knows about you. Correcting supersedes; nothing is destroyed. */
function Memory() {
  const [facts, setFacts] = useState([]);
  const [text, setText] = useState('');

  const load = () => read('/api/settings').then((r) => setFacts(r.memory ?? []));
  useEffect(() => { load(); }, []);

  const act = async (memory) => {
    const r = await post('/api/settings', { memory });
    if (r.ok) setFacts(r.memory ?? []);
  };

  return (
    <div className="card">
      <h3>What he knows about you<span className="rule" /><span className="meta">{facts.length}</span></h3>
      {!facts.length && <div className="empty">Nothing yet. He picks things up as you work, or tell him here.</div>}
      {facts.map((f) => (
        <div className="setting" key={f.id}>
          <div><div className="n">{f.text}</div><div className="h">{f.source === 'told' ? 'you told him' : 'he worked it out'}</div></div>
          <button className="ghost" style={{ padding: '3px 8px', fontSize: 11 }} onClick={() => act({ action: 'retire', id: f.id })}>Forget</button>
        </div>
      ))}
      <div className="row" style={{ marginTop: 10, flexWrap: 'nowrap' }}>
        <input value={text} placeholder="the real Slack channel is #leads" style={{ flex: 1 }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { act({ action: 'add', text }); setText(''); } }} />
        <button disabled={!text.trim()} onClick={() => { act({ action: 'add', text }); setText(''); }}>Add</button>
      </div>
    </div>
  );
}

/* ================================================================ settings */

// Derived from the price table, not typed out again. A model listed here but
// unpriced would be saved happily and then refused on the next request.
const MODELS = Object.entries(PRICES)
  .map(([id, p]) => ({ id, perMillion: p.input + p.output }))
  .sort((a, b) => a.perMillion - b.perMillion)
  .map((m) => m.id);
const ACCENTS = { cyan: '#0891b2', violet: '#7c3aed', amber: '#b45309', green: '#0f8a5f', magenta: '#be185d' };

const Setting = ({ n, h, children }) => (
  <div className="setting">
    <div><div className="n">{n}</div>{h && <div className="h">{h}</div>}</div>
    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => <button className="toggle" role="switch" aria-checked={on} onClick={() => onChange(!on)}><i /></button>;

/**
 * Saved, missing, or there-but-unreadable.
 *
 * The third one is the one worth having a component for: a key encrypted under
 * a MASTER_KEY that has since changed is still sitting in the database, and
 * calling that "not set" sends you hunting for a key you never lost.
 */
const KeyState = ({ state }) => {
  if (state?.set) return <span style={{ color: 'var(--worked)' }}>saved {state.hint}</span>;
  if (state?.unreadable) return <span style={{ color: 'var(--failed)' }} title={state.note}>stored, but unreadable — paste it again</span>;
  return null;
};

function Settings({ onSaved }) {
  const [s, setS] = useState(null);
  const [draft, setDraft] = useState({});
  const [prefs, setPrefs] = useState(null);
  const [note, setNote] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [advanced, setAdvanced] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [minted, setMinted] = useState(null);

  const load = () => read('/api/settings').then((r) => {
    if (!r.ok && r.error) return setLoadError(r.error);
    setLoadError(null);
    setS(r.settings); setPrefs(r.settings?.prefs ?? null);
    setDraft({ n8nBaseUrl: r.settings?.n8nBaseUrl ?? '', monthlyCapUsd: r.settings?.monthlyCapUsd ?? 8 });
  });
  const loadTokens = () => read('/api/tokens').then((r) => setTokens(r.tokens ?? []));

  useEffect(() => { load(); loadTokens(); }, []);
  // A settings page that cannot load says why. Sitting on "Loading…" forever
  // is the same as saying nothing, and it is what happened to every read here
  // when the server answered with anything but JSON.
  if (loadError) return <div className="empty">Settings could not be read. {loadError}</div>;
  if (!s || !prefs) return <div className="empty">Loading…</div>;

  const savePref = async (patch) => {
    setPrefs({ ...prefs, ...patch });
    const r = await post('/api/settings', { prefs: patch });
    if (r.ok) { setPrefs(r.settings.prefs); onSaved?.(); }
  };

  return (
    <>
      <div className="card">
        <h3>Connection<span className="rule" /></h3>
        <label>n8n address</label>
        <input value={draft.n8nBaseUrl ?? ''} placeholder="https://you.app.n8n.cloud" onChange={(e) => setDraft({ ...draft, n8nBaseUrl: e.target.value.trim() })} />
        <label>n8n key <KeyState state={s.n8nApiKey} /></label>
        <input type="password" placeholder={s.n8nApiKey.set ? 'leave blank to keep' : 'n8n_api_…'} value={draft.n8nApiKey ?? ''} onChange={(e) => setDraft({ ...draft, n8nApiKey: e.target.value.trim() })} />
        <label>Gemini key <KeyState state={s.geminiApiKey} /></label>
        <input type="password" placeholder={s.geminiApiKey.set ? 'leave blank to keep' : 'AIza…'} value={draft.geminiApiKey ?? ''} onChange={(e) => setDraft({ ...draft, geminiApiKey: e.target.value.trim() })} />
        <label>Monthly cap (USD)</label>
        <input type="number" value={draft.monthlyCapUsd ?? 8} onChange={(e) => setDraft({ ...draft, monthlyCapUsd: Number(e.target.value) })} />
        <div className="row" style={{ marginTop: 11 }}>
          <button onClick={async () => {
            const r = await post('/api/settings', draft);
            setNote(r.ok ? 'Saved' : r.error);
            if (r.ok) { setS(r.settings); setDraft((d) => ({ ...d, n8nApiKey: '', geminiApiKey: '' })); onSaved?.(); }
          }}>Save</button>
          {note && <span className="meta">{note}</span>}
        </div>
      </div>

      <div className="card">
        <h3>Look<span className="rule" /></h3>
        <Setting n="Theme">
          <div className="seg">
            {['light', 'dark', 'auto'].map((t) => <button key={t} aria-pressed={prefs.theme === t} onClick={() => savePref({ theme: t })}>{t}</button>)}
          </div>
        </Setting>
        <Setting n="Accent" h="idle colour; state still wins">
          <div className="swatches">
            {Object.entries(ACCENTS).map(([k, c]) => <button key={k} className="swatch" style={{ background: c }} aria-pressed={prefs.accent === k} onClick={() => savePref({ accent: k })} title={k} />)}
          </div>
        </Setting>
        <Setting n="Show his working" h="every step, live"><Toggle on={prefs.showToolStream} onChange={(v) => savePref({ showToolStream: v })} /></Setting>
        <Setting n="Motion"><Toggle on={prefs.motion} onChange={(v) => savePref({ motion: v })} /></Setting>
      </div>

      <div className="card">
        <h3>How he works<span className="rule" /></h3>
        <Setting n="Everyday model" h="quick answers">
          <select value={prefs.chatModel} onChange={(e) => savePref({ chatModel: e.target.value })}>{MODELS.map((m) => <option key={m}>{m}</option>)}</select>
        </Setting>
        <Setting n="Building model" h="designing and repairing">
          <select value={prefs.designModel} onChange={(e) => savePref({ designModel: e.target.value })}>{MODELS.map((m) => <option key={m}>{m}</option>)}</select>
        </Setting>
        <Setting n="Check real values" h="off means he asks you instead"><Toggle on={prefs.allowProbes} onChange={(v) => savePref({ allowProbes: v })} /></Setting>
        <Setting n="Tests never send" h="keep this on"><Toggle on={prefs.dryRunDisablesWrites} onChange={(v) => savePref({ dryRunDisablesWrites: v })} /></Setting>
      </div>

      <Peers />

      <div className="card">
        <h3>Let other AIs use him<span className="rule" /></h3>
        <div className="meta" style={{ marginBottom: 8 }}>Point them at <span className="mono">/api/mcp</span> with a token. Same tools as you get, and they still can't switch anything on.</div>
        {minted && <div className="notice warn">Copy this now — it isn't shown again:<br /><span className="mono">{minted}</span></div>}
        {tokens.map((t) => (
          <div className="setting" key={t.id}>
            <div><div className="n">{t.label}</div><div className="h">{t.retiredAt ? 'retired' : 'active'}</div></div>
            {!t.retiredAt && <button className="ghost" style={{ padding: '3px 8px', fontSize: 11 }} onClick={async () => { await post('/api/tokens', { action: 'retire', id: t.id }); loadTokens(); }}>Retire</button>}
          </div>
        ))}
        <button style={{ marginTop: 10 }} onClick={async () => { const r = await post('/api/tokens', { action: 'mint', label: 'agent' }); if (r.ok) { setMinted(r.token); loadTokens(); } }}>New token</button>
      </div>

      <button className="ghost" style={{ width: '100%' }} onClick={() => setAdvanced((a) => !a)}>{advanced ? 'Hide advanced' : 'Advanced'}</button>

      {advanced && (
        <div className="card" style={{ marginTop: 10 }}>
          <h3>Advanced<span className="rule" /></h3>
          <Setting n="Thinking budget" h="kept below the ceiling"><input type="number" step="512" value={prefs.thinkingBudget} onChange={(e) => savePref({ thinkingBudget: Number(e.target.value) })} /></Setting>
          <Setting n="Output ceiling"><input type="number" step="1024" value={prefs.maxOutputTokens} onChange={(e) => savePref({ maxOutputTokens: Number(e.target.value) })} /></Setting>
          <Setting n="Time limit" h="ms"><input type="number" step="1000" value={prefs.deadlineMs} onChange={(e) => savePref({ deadlineMs: Number(e.target.value) })} /></Setting>
          <Setting n="Max steps"><input type="number" value={prefs.maxSteps} onChange={(e) => savePref({ maxSteps: Number(e.target.value) })} /></Setting>
          <Setting n="Refresh" h="seconds"><input type="number" value={prefs.refreshSeconds} onChange={(e) => savePref({ refreshSeconds: Number(e.target.value) })} /></Setting>
          <Setting n="Tag prefix"><input value={prefs.testTagPrefix} onChange={(e) => savePref({ testTagPrefix: e.target.value })} /></Setting>
          <ChangePassword />
        </div>
      )}
    </>
  );
}

/**
 * The AIs Jason can ask. He builds; he does not decide. When a specification
 * is thin he asks one of these — and if none is configured, he asks you and
 * stops rather than filling the gap himself.
 */
function Peers() {
  const [peers, setPeers] = useState([]);
  const [draft, setDraft] = useState({ name: '', url: '', protocol: 'json', token: '' });
  const [note, setNote] = useState(null);
  const [tests, setTests] = useState({});
  const [testing, setTesting] = useState(null);

  const load = () => read('/api/settings').then((r) => setPeers(r.peers ?? []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    const r = await post('/api/settings', { peer: draft });
    if (!r.ok) return setNote(r.error);
    setPeers(r.peers); setDraft({ name: '', url: '', protocol: 'json', token: '' }); setNote('Added');
  };

  /**
   * Ask the peer a real question through the same call Jason makes mid-build.
   * The answer is shown verbatim rather than reduced to a tick, because a
   * reachable endpoint that returns something useless is not a working peer —
   * and only reading what came back tells you which you have.
   */
  const test = async (name) => {
    setTesting(name);
    const r = await post('/api/settings', { peer: { action: 'test', name } });
    setTesting(null);
    setTests((t) => ({ ...t, [name]: r.test ?? { reached: false, error: r.error ?? 'No answer from the server.' } }));
  };

  return (
    <div className="card">
      <h3>Who he can ask<span className="rule" /></h3>
      <div className="meta" style={{ marginBottom: 8 }}>
        He builds, he doesn't decide. When something is unclear he asks one of these instead of guessing.
        {!peers.length && ' With none set up, he asks you and waits.'}
      </div>

      {peers.map((p) => (
        <div key={p.name}>
          <div className="setting">
            <div>
              <div className="n">{p.name}</div>
              <div className="h">{p.protocol} · {p.hasToken ? 'has a token' : 'no token'}</div>
            </div>
            <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
              <button className="ghost" style={{ padding: '3px 8px', fontSize: 11 }} disabled={testing === p.name} onClick={() => test(p.name)}>
                {testing === p.name ? 'asking…' : 'Test'}
              </button>
              <button className="ghost" style={{ padding: '3px 8px', fontSize: 11 }}
                onClick={async () => { const r = await post('/api/settings', { peer: { action: 'remove', name: p.name } }); if (r.ok) { setPeers(r.peers); setTests((t) => ({ ...t, [p.name]: undefined })); } }}>
                Remove
              </button>
            </div>
          </div>

          {tests[p.name] && (
            <div className={`notice ${tests[p.name].reached ? '' : 'unknown'}`} style={{ marginTop: -2 }}>
              {tests[p.name].reached ? (
                <>
                  <span style={{ color: 'var(--worked)' }}>Answered in {tests[p.name].ms}ms.</span>
                  {' '}Read it and decide whether that is a peer worth asking:
                  <div className="mono" style={{ marginTop: 6, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                    {tests[p.name].answer?.trim() || '(it replied, but with nothing in it)'}
                  </div>
                </>
              ) : (
                <>Could not get an answer — so he would ask you instead of guessing. {tests[p.name].error}</>
              )}
            </div>
          )}
        </div>
      ))}

      <label>Name</label>
      <input value={draft.name} placeholder="research" onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      <label>Address</label>
      <input value={draft.url} placeholder="https://…" onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
      <label>Speaks</label>
      <div className="seg">
        {['json', 'mcp'].map((x) => <button key={x} aria-pressed={draft.protocol === x} onClick={() => setDraft({ ...draft, protocol: x })}>{x}</button>)}
      </div>
      <label>Token</label>
      <input type="password" value={draft.token} placeholder="optional" onChange={(e) => setDraft({ ...draft, token: e.target.value })} />
      <div className="row" style={{ marginTop: 10 }}>
        <button disabled={!draft.name || !draft.url} onClick={save}>Add</button>
        {note && <span className="meta">{note}</span>}
      </div>
    </div>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [note, setNote] = useState(null);
  return (
    <>
      <label>Current password</label>
      <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      <label>New password</label>
      <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        <button disabled={!current || !next} onClick={async () => {
          const r = await post('/api/auth', { action: 'change-password', currentPassword: current, newPassword: next });
          setNote(r.ok ? 'Changed' : r.error);
          if (r.ok) { setCurrent(''); setNext(''); }
        }}>Change password</button>
        {note && <span className="meta">{note}</span>}
      </div>
    </>
  );
}
