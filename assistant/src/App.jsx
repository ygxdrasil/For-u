import { useEffect, useRef, useState } from 'react';

/**
 * The web interface. It is ONE CALLER of the pipeline, not the pipeline.
 * Everything it can do, /api/agent can do, because both call core/run.js with
 * the same tools. Capability belongs in core/tools.js — never here.
 *
 * Keys are no longer held in this browser. They are saved server-side,
 * encrypted, behind the password — which is what makes them survive a new
 * browser, and what lets the scheduled sweep and the headless endpoint work
 * with nobody's tab open.
 */

const post = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: `Server returned ${res.status}` }));
};

export default function App() {
  const [auth, setAuth] = useState(null); // null = still checking
  const [health, setHealth] = useState(null);

  useEffect(() => {
    post('/api/auth', { action: 'status' }).then(setAuth);
    fetch('/api/health').then((r) => r.json()).then(setHealth).catch(() => {});
  }, []);

  if (auth === null) {
    return <div className="app"><p className="meta">Checking…</p></div>;
  }

  if (!auth.passwordSet) return <Gate mode="setup" auth={auth} onDone={setAuth} health={health} />;
  if (!auth.signedIn) return <Gate mode="login" auth={auth} onDone={setAuth} health={health} />;

  return <Assistant health={health} onSignOut={() => post('/api/auth', { action: 'logout' }).then(() => setAuth({ ...auth, signedIn: false }))} />;
}

/** First screen: set a password, or enter it. Nothing else is reachable. */
function Gate({ mode, auth, onDone, health }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);

    if (mode === 'setup') {
      if (password.length < 8) return setError('Use at least 8 characters.');
      if (password !== confirm) return setError('The two passwords do not match.');
    }

    setBusy(true);
    const res = await post('/api/auth', { action: mode === 'setup' ? 'setup' : 'login', password });
    setBusy(false);

    if (!res.ok) return setError(res.error ?? 'That did not work.');
    onDone({ ...auth, passwordSet: true, signedIn: true });
  };

  return (
    <div className="app" style={{ maxWidth: 400, paddingTop: 80 }}>
      <h1 style={{ marginBottom: 4 }}>n8n workflow assistant</h1>
      <p className="meta" style={{ marginTop: 0, marginBottom: 20 }}>
        {mode === 'setup' ? 'Choose a password. This is the only door.' : 'Enter your password.'}
      </p>

      <form className="panel" onSubmit={submit}>
        {mode === 'setup' && auth.durable === false && (
          <div className="notice" style={{ marginBottom: 12 }}>
            No database is configured. Setting a password now is refused rather than half-working: it would live in one
            serverless instance's memory and vanish when another served a request, locking you out at random. Add{' '}
            <code>DATABASE_URL</code> in Vercel, redeploy, then come back.
          </div>
        )}

        <label>Password</label>
        <input type="password" value={password} autoFocus autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} onChange={(e) => setPassword(e.target.value)} />

        {mode === 'setup' && (
          <>
            <label>Confirm password</label>
            <input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} />
          </>
        )}

        {error && <div className="notice" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}

        <div className="row" style={{ marginTop: 14 }}>
          <button type="submit" disabled={busy || !password}>
            {busy ? 'Working…' : mode === 'setup' ? 'Set password' : 'Sign in'}
          </button>
        </div>
      </form>

      <p className="meta" style={{ textAlign: 'center' }}>
        {health?.build?.buildId ? `build ${health.build.buildId}` : ''}
      </p>
    </div>
  );
}

function Assistant({ health, onSignOut }) {
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState({});
  const [saveNote, setSaveNote] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState([]);
  const [pendingApproval, setPendingApproval] = useState(null);
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2)}`);
  const bottom = useRef(null);

  const loadSettings = () =>
    fetch('/api/settings')
      .then((r) => r.json())
      .then((r) => {
        setSettings(r.settings ?? null);
        if (r.settings) setDraft({ n8nBaseUrl: r.settings.n8nBaseUrl ?? '', monthlyCapUsd: r.settings.monthlyCapUsd ?? 8 });
        if (r.settings && !r.settings.geminiApiKey.set) setShowSettings(true);
      })
      .catch(() => {});

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, live]);

  const saveSettings = async () => {
    setSaveNote('Saving…');
    const res = await post('/api/settings', draft);
    if (!res.ok) return setSaveNote(res.error ?? 'Could not save.');
    setSettings(res.settings);
    // Clear the secret boxes: the values are stored now and never come back.
    setDraft((d) => ({ ...d, n8nApiKey: undefined, geminiApiKey: undefined }));
    setSaveNote(res.warning ?? 'Saved.');
  };

  async function send(text, approvals = []) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setLive([]);
    setPendingApproval(null);
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');

    const events = [];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sessionId: sessionId.current, approvals }),
      });

      if (res.status === 401) {
        setMessages((m) => [...m, { role: 'assistant', text: 'Your session expired. Reload the page and sign in again.', status: 'error' }]);
        return;
      }
      if (!res.ok || !res.body) throw new Error(`Server returned ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';

        for (const frame of frames) {
          const evLine = frame.split('\n').find((l) => l.startsWith('event: '));
          const dataLine = frame.split('\n').find((l) => l.startsWith('data: '));
          if (!evLine || !dataLine) continue;
          const event = evLine.slice(7).trim();
          let data;
          try {
            data = JSON.parse(dataLine.slice(6));
          } catch {
            continue;
          }

          if (event === 'status') events.push({ kind: 'run', text: data.status });
          if (event === 'tool_start') events.push({ kind: 'run', text: `${data.name}…` });
          if (event === 'tool_end') {
            const last = [...events].reverse().find((e) => e.text.startsWith(data.name));
            if (last) {
              last.kind = data.ok ? 'ok' : 'bad';
              last.text = data.ok ? data.name : `${data.name} — ${data.error ?? 'failed'}`;
            }
            if (data.needsApproval) setPendingApproval({ action: data.needsApproval, detail: data.error });
          }
          if (event === 'done') {
            setMessages((m) => [
              ...m,
              { role: 'assistant', text: data.reply, steps: [...events], status: data.status, spend: data.spend, elapsedMs: data.elapsedMs },
            ]);
          }
          if (event === 'error') {
            setMessages((m) => [...m, { role: 'assistant', text: `Something broke on the server: ${data.error}`, status: 'error' }]);
          }
          setLive([...events]);
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: `I couldn't reach the server: ${err.message}. That is a connection problem, not necessarily a problem with your workflows.`, status: 'error' },
      ]);
    } finally {
      setBusy(false);
      setLive([]);
    }
  }

  const ready = settings?.geminiApiKey?.set;
  const n8nReady = settings?.n8nApiKey?.set && settings?.n8nBaseUrl;

  return (
    <div className="app">
      <header>
        <h1>n8n workflow assistant</h1>
        <span className="build">
          {health?.build?.buildId ? `build ${health.build.buildId}` : ''}
          {health?.nodeIndex ? ` · ${health.nodeIndex.nodeCount} nodes` : ''}{' '}
          <button className="secondary" style={{ padding: '2px 8px', fontSize: 12 }} onClick={onSignOut}>
            Sign out
          </button>
        </span>
      </header>

      {health?.store && !health.store.durable && (
        <div className="notice">
          No database: {health.store.note} Your keys, this conversation and the spend meter reset on cold start.
        </div>
      )}
      {settings && !ready && <div className="notice">Add a Gemini API key below — without it I cannot think at all.</div>}
      {settings && ready && !n8nReady && (
        <div className="notice">
          No n8n connection yet. I can search nodes and design workflows, but I cannot read, save, ground values or test anything.
        </div>
      )}

      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Keys</h2>
          <button className="secondary" onClick={() => setShowSettings((s) => !s)}>{showSettings ? 'Hide' : 'Show'}</button>
        </div>

        {showSettings && settings && (
          <>
            <div className="grid2">
              <div>
                <label>n8n base URL</label>
                <input value={draft.n8nBaseUrl ?? ''} placeholder="https://yourname.app.n8n.cloud" onChange={(e) => setDraft({ ...draft, n8nBaseUrl: e.target.value.trim() })} />
              </div>
              <div>
                <label>n8n API key {settings.n8nApiKey.set && <span style={{ color: 'var(--ok)' }}>saved {settings.n8nApiKey.hint}</span>}</label>
                <input type="password" value={draft.n8nApiKey ?? ''} placeholder={settings.n8nApiKey.set ? 'leave blank to keep' : 'n8n_api_…'} onChange={(e) => setDraft({ ...draft, n8nApiKey: e.target.value.trim() })} />
              </div>
              <div>
                <label>Gemini API key {settings.geminiApiKey.set && <span style={{ color: 'var(--ok)' }}>saved {settings.geminiApiKey.hint}</span>}</label>
                <input type="password" value={draft.geminiApiKey ?? ''} placeholder={settings.geminiApiKey.set ? 'leave blank to keep' : 'AIza…'} onChange={(e) => setDraft({ ...draft, geminiApiKey: e.target.value.trim() })} />
              </div>
              <div>
                <label>Monthly spend cap (USD)</label>
                <input type="number" value={draft.monthlyCapUsd ?? 8} onChange={(e) => setDraft({ ...draft, monthlyCapUsd: Number(e.target.value) })} />
              </div>
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <button onClick={saveSettings}>Save keys</button>
              <ChangePassword />
              {saveNote && <span className="meta">{saveNote}</span>}
            </div>
            <p className="meta" style={{ marginTop: 10, marginBottom: 0 }}>{settings.encryption?.note}</p>
          </>
        )}
      </div>

      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.role}`}>
          {m.role === 'assistant' && m.steps?.length > 0 && (
            <div className="timeline">{m.steps.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
          )}
          {m.text}
          {m.role === 'assistant' && (
            <div className="meta" style={{ marginTop: 8 }}>
              {m.status && m.status !== 'ok' && <span className="verdict unconfirmed">{m.status}</span>}{' '}
              {m.spend ? `$${m.spend.monthToDateUsd.toFixed(4)} of $${m.spend.capUsd} this month` : ''}
              {m.elapsedMs ? ` · ${(m.elapsedMs / 1000).toFixed(1)}s` : ''}
            </div>
          )}
        </div>
      ))}

      {live.length > 0 && (
        <div className="msg assistant">
          <div className="timeline">{live.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
        </div>
      )}

      {pendingApproval && (
        <div className="notice">
          <div style={{ marginBottom: 8 }}>{pendingApproval.detail}</div>
          <div className="row">
            <button onClick={() => send('Yes, go ahead.', [pendingApproval.action])}>Approve</button>
            <button className="secondary" onClick={() => setPendingApproval(null)}>No</button>
          </div>
        </div>
      )}

      <div className="panel">
        <textarea
          value={input}
          placeholder="when someone fills the contact form, qualify them and put the good ones in a Slack channel with a summary"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(input);
          }}
        />
        <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <button onClick={() => send(input)} disabled={busy || !ready}>{busy ? 'Working…' : 'Send'}</button>
          <span className="meta">⌘/Ctrl + Enter</span>
        </div>
      </div>

      <div ref={bottom} />
    </div>
  );
}

function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [note, setNote] = useState(null);

  if (!open) return <button className="secondary" onClick={() => setOpen(true)}>Change password</button>;

  return (
    <div className="panel" style={{ marginTop: 10, width: '100%' }}>
      <label>Current password</label>
      <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      <label>New password</label>
      <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        <button
          onClick={async () => {
            const res = await post('/api/auth', { action: 'change-password', currentPassword: current, newPassword: next });
            setNote(res.ok ? 'Password changed.' : res.error);
            if (res.ok) {
              setCurrent('');
              setNext('');
            }
          }}
        >
          Change it
        </button>
        <button className="secondary" onClick={() => setOpen(false)}>Cancel</button>
        {note && <span className="meta">{note}</span>}
      </div>
    </div>
  );
}
