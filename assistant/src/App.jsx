import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Jason's HUD.
 *
 * ONE CALLER of the pipeline, not the pipeline. Capability belongs in
 * core/tools.js — never here.
 *
 * Rules this file holds to: no anthropomorphism, no hidden uncertainty
 * ("couldn't confirm" is violet everywhere and never rounded to a tick or a
 * cross), nothing labelled Delete, and no wall of text where a number does.
 */

const post = async (url, body) => {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json().catch(() => ({ ok: false, error: `HTTP ${res.status}` }));
};

const ago = (iso) => {
  if (!iso) return '—';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
};
const clock = (iso) => (iso ? new Date(iso).toTimeString().slice(0, 5) : '--:--');
const dur = (a, b) => (a && b ? `${((new Date(b) - new Date(a)) / 1000).toFixed(1)}s` : '—');

export default function App() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    document.documentElement.dataset.state = 'idle';
    post('/api/auth', { action: 'status' }).then(setAuth);
  }, []);

  if (auth === null) return <div className="shell"><p className="meta">Waking…</p></div>;
  if (!auth.passwordSet) return <Gate mode="setup" auth={auth} onDone={setAuth} />;
  if (!auth.signedIn) return <Gate mode="login" auth={auth} onDone={setAuth} />;
  return <Jason onSignOut={() => post('/api/auth', { action: 'logout' }).then(() => setAuth({ ...auth, signedIn: false }))} />;
}

const Mark = () => <div className="mark"><i /></div>;

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
    <div className="shell gate">
      <Mark />
      <h1>Jason</h1>
      <p className="sub">{mode === 'setup' ? 'Set a password.' : 'Sign in.'}</p>
      <form className="panel" onSubmit={submit}>
        {mode === 'setup' && auth.durable === false && <div className="notice">No database. Add <code>DATABASE_URL</code>, redeploy.</div>}
        <label>Password</label>
        <input type="password" value={password} autoFocus autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'setup' && (<><label>Confirm</label><input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} /></>)}
        {error && <div className="notice" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
        <div className="row" style={{ marginTop: 14 }}><button type="submit" disabled={busy || !password}>{busy ? '…' : mode === 'setup' ? 'Set' : 'Sign in'}</button></div>
      </form>
    </div>
  );
}

/* ====================================================================== */

function Jason({ onSignOut }) {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [live, setLive] = useState([]);
  const [busy, setBusy] = useState(false);
  const [approval, setApproval] = useState(null);
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2)}`);

  const prefs = data?.sections?.settings?.data?.prefs;

  const refresh = useCallback(() => {
    fetch('/api/dashboard').then((r) => r.json()).then((d) => d.ok && setData(d)).catch(() => {});
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
    if (busy) return /save|dry_run|ground|active|archive/.test(live[live.length - 1]?.text ?? '') ? 'acting' : 'thinking';
    if (data && data.vitals.n8n.configured && !data.vitals.n8n.reachable) return 'offline';
    if ([...messages].reverse().find((m) => m.role === 'jason')?.status === 'ok') return 'resolved';
    return 'idle';
  }, [busy, live, approval, data, messages]);

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.state = state;
    r.dataset.accent = prefs?.accent ?? 'cyan';
    r.dataset.density = prefs?.density ?? 'compact';
    r.dataset.motion = prefs?.motion === false ? 'off' : 'on';
  }, [state, prefs?.accent, prefs?.density, prefs?.motion]);

  const stateLine = {
    idle: ['Idle', 'watching'],
    thinking: ['Thinking', live[live.length - 1]?.text ?? ''],
    acting: ['Acting', live[live.length - 1]?.text ?? ''],
    waiting: ['Approval', 'needs your call'],
    resolved: ['Done', 'evidence in conversation'],
    offline: ['No n8n', data?.vitals?.n8n?.error ?? ''],
  }[state];

  async function send(text, approvals = []) {
    if (!text.trim() || busy) return;
    setBusy(true); setLive([]); setApproval(null);
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
          if (ev === 'status') events.push({ kind: 'run', text: d.status });
          if (ev === 'tool_start') events.push({ kind: 'run', text: d.name });
          if (ev === 'tool_end') {
            const hit = [...events].reverse().find((e) => e.text.startsWith(d.name));
            if (hit) { hit.kind = d.ok ? 'ok' : 'bad'; hit.text = d.ok ? d.name : `${d.name} — ${d.error ?? 'failed'}`; }
            if (d.needsApproval) setApproval({ action: d.needsApproval, detail: d.error });
          }
          if (ev === 'done') { setMessages((m) => [...m, { role: 'jason', text: d.reply, steps: [...events], status: d.status, spend: d.spend, elapsedMs: d.elapsedMs }]); refresh(); }
          if (ev === 'error') setMessages((m) => [...m, { role: 'jason', text: d.error, status: 'error' }]);
          setLive([...events]);
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'jason', text: `Couldn't reach the server: ${err.message}. Connection problem, not necessarily your workflows.`, status: 'error' }]);
    } finally { setBusy(false); setLive([]); }
  }

  const findings = data?.sections?.findings?.data ?? [];
  const workflows = data?.sections?.workflows?.data ?? [];

  return (
    <div className="shell">
      <header className="masthead">
        <Mark />
        <h1 className="wordmark">Jason<small>n8n contractor</small></h1>
        <div className="masthead-right">
          <span className="meta mono">{data?.vitals?.build?.buildId?.slice(0, 12) ?? ''}</span>
          <button className="ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <div className={`statestrip ${busy ? 'busy' : ''}`}>
        <span className="dot" />
        <span className="label">{stateLine[0]}</span>
        <span className="detail">{stateLine[1]}</span>
        <span className="since">{data?.vitals?.store?.durable ? 'pg' : 'mem'} · {workflows.length}wf · {findings.length}open</span>
      </div>

      <nav className="nav">
        {[['dashboard', 'Dashboard'], ['chat', 'Talk'], ['workflows', `Workflows`, workflows.length], ['broke', 'Broke', findings.length], ['settings', 'Settings']].map(([id, label, n]) => (
          <button key={id} aria-selected={tab === id} onClick={() => setTab(id)}>{label}{n ? <span className="count">{n}</span> : null}</button>
        ))}
      </nav>

      {tab === 'dashboard' && <Dashboard data={data} />}
      {tab === 'chat' && <Talk messages={messages} live={live} busy={busy} approval={approval} onSend={send} onDismiss={() => setApproval(null)} ready={data?.sections?.settings?.data?.geminiApiKey?.set} showStream={prefs?.showToolStream !== false} />}
      {tab === 'workflows' && <WorkflowList data={data} />}
      {tab === 'broke' && <Broke findings={findings} />}
      {tab === 'settings' && <Settings onSaved={refresh} />}
    </div>
  );
}

/* ---------------------------------------------------------- dashboard */

function Dashboard({ data }) {
  if (!data) return <div className="panel"><div className="empty">Reading…</div></div>;
  const { vitals, sections } = data;
  const wf = sections.workflows.data ?? [];
  const ex = sections.executions.data ?? [];
  const spend = sections.spend.data;

  const day = 864e5;
  const recent = ex.filter((e) => Date.now() - new Date(e.startedAt).getTime() < day);
  const failed = recent.filter((e) => e.status === 'error').length;
  const okRate = recent.length ? Math.round(((recent.length - failed) / recent.length) * 100) : null;
  const pct = spend ? Math.min(100, (spend.monthToDateUsd / Math.max(spend.capUsd, 0.01)) * 100) : 0;
  const spark = Array.from({ length: 24 }, (_, h) => ex.filter((e) => Math.floor((Date.now() - new Date(e.startedAt).getTime()) / 36e5) === 23 - h).length);
  const maxSpark = Math.max(1, ...spark);

  return (
    <>
      {vitals.n8n.configured && !vitals.n8n.reachable && (
        <div className="notice violet">n8n unreachable — {vitals.n8n.error}. State unknown, not broken.</div>
      )}
      {!vitals.n8n.configured && <div className="notice">No n8n connected. Settings → Connection.</div>}

      <div className="grid cols-4">
        <Stat k="Workflows" v={wf.length} sub={`${wf.filter((w) => w.active).length} live`} accent />
        <Stat k="Runs 24h" v={recent.length} sub={okRate === null ? 'no data' : `${okRate}% ok`}>
          <div className="spark">{spark.map((n, i) => <span key={i} style={{ height: `${(n / maxSpark) * 20}px` }} />)}</div>
        </Stat>
        <Stat k="Failed 24h" v={failed} sub={failed ? 'see Broke' : 'clear'} />
        <Stat k="Spend" v={spend ? `$${spend.monthToDateUsd.toFixed(3)}` : '—'} sub={spend ? `cap $${spend.capUsd}` : '—'} meter={pct} />
      </div>

      <div className="grid cols-2">
        <div className="panel" style={{ margin: 0 }}>
          <h2>Activity<span className="rule" /><span className="meta">14d</span></h2>
          <Activity executions={ex} />
        </div>
        <div className="panel" style={{ margin: 0 }}>
          <h2>Stream<span className="rule" /><span className="meta">{ex.length}</span></h2>
          <div className="stream">
            {ex.slice(0, 40).map((e) => (
              <div className="ex" key={e.id}>
                <span className="t">{clock(e.startedAt)}</span>
                <span className="n">{e.workflowName ?? e.workflowId}</span>
                <span className={`dot-s ${e.status === 'error' ? 'bad' : e.status === 'success' ? 'ok' : 'unk'}`} />
                <span className="d">{dur(e.startedAt, e.stoppedAt)}</span>
              </div>
            ))}
            {!ex.length && <div className="empty">No executions.</div>}
          </div>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="panel" style={{ margin: 0 }}>
          <h2>Workflows<span className="rule" /></h2>
          {wf.length ? <div className="grid" style={{ gap: 8 }}>{wf.slice(0, 5).map((w) => <WorkflowCard key={w.id} w={w} ex={ex} />)}</div> : <div className="empty">{sections.workflows.error ?? 'None.'}</div>}
        </div>
        <div className="panel" style={{ margin: 0 }}>
          <h2>Vitals<span className="rule" /></h2>
          <Vitals vitals={vitals} />
        </div>
      </div>
    </>
  );
}

const Stat = ({ k, v, sub, accent, meter, children }) => (
  <div className={`stat ${accent ? 'accent' : ''}`}>
    <div className="k">{k}</div>
    <div className="v">{v}</div>
    <div className="sub">{sub}</div>
    {meter !== undefined && <div className="meter"><i style={{ width: `${meter}%` }} /></div>}
    {children}
  </div>
);

function Activity({ executions }) {
  const days = 14;
  const buckets = Array.from({ length: days }, () => ({ ok: 0, bad: 0 }));
  const today = new Date().setHours(0, 0, 0, 0);
  for (const e of executions) {
    const idx = days - 1 - Math.round((today - new Date(e.startedAt).setHours(0, 0, 0, 0)) / 864e5);
    if (idx >= 0 && idx < days) buckets[idx][e.status === 'error' ? 'bad' : 'ok']++;
  }
  const max = Math.max(1, ...buckets.map((b) => b.ok + b.bad));
  if (!executions.length) return <div className="empty">No executions.</div>;
  return (
    <>
      <div className="bars">
        {buckets.map((b, i) => (
          <div className="bar" key={i} title={`${b.ok} ok · ${b.bad} failed`}>
            <span className="ok" style={{ height: `${(b.ok / max) * 58}px` }} />
            <span className="bad" style={{ height: `${(b.bad / max) * 58}px` }} />
          </div>
        ))}
      </div>
      <div className="axis"><span>-14d</span><span>now</span></div>
    </>
  );
}

function WorkflowCard({ w, ex = [] }) {
  const mine = ex.filter((e) => e.workflowId === w.id);
  const bad = mine.filter((e) => e.status === 'error').length;
  const good = mine.length - bad;
  const last = mine[0];
  return (
    <div className="wf">
      <div className="top">
        <span className={`dot-s ${w.isArchived ? 'off' : w.active ? 'ok' : 'unk'}`} />
        <span className="name">{w.name}</span>
        <span className="live">{last ? ago(last.startedAt) : 'never'} · {w.nodeCount}n</span>
      </div>
      <div className="chain">
        {w.chain.map((n, i) => (
          <span key={i} style={{ display: 'contents' }}>{i > 0 && <span className="arrow">→</span>}<span className="node">{n.short}</span></span>
        ))}
        {w.nodeCount > w.chain.length && <span className="more">+{w.nodeCount - w.chain.length}</span>}
      </div>
      {mine.length > 0 && (
        <div className="ratio">
          <i className="good" style={{ width: `${(good / mine.length) * 100}%` }} />
          <i className="bad" style={{ width: `${(bad / mine.length) * 100}%` }} />
        </div>
      )}
    </div>
  );
}

const Vitals = ({ vitals }) => (
  <div className="kv">
    <div><span className="k">Build</span><span className="v">{vitals.build?.buildId ?? 'unstamped'}</span></div>
    <div><span className="k">Nodes indexed</span><span className="v">{vitals.nodeIndex?.nodeCount ?? '—'} · {vitals.nodeIndex?.operationCount ?? '—'} ops</span></div>
    <div><span className="k">Schemas</span><span className="v"><span className={`dot-s ${vitals.nodeIndex?.schemasBundledHere ? 'ok' : 'bad'}`} />{vitals.nodeIndex?.schemasBundledHere ? 'bundled' : 'missing'}</span></div>
    <div><span className="k">n8n-nodes-base</span><span className="v">{vitals.nodeIndex?.packages?.['n8n-nodes-base'] ?? '—'}</span></div>
    <div><span className="k">Your instance</span><span className="v"><span className="dot-s unk" />unconfirmed</span></div>
    <div><span className="k">Store</span><span className="v"><span className={`dot-s ${vitals.store.durable ? 'ok' : 'bad'}`} />{vitals.store.kind}</span></div>
    <div><span className="k">Key encryption</span><span className="v"><span className={`dot-s ${vitals.encryption?.source === 'env' ? 'ok' : 'unk'}`} />{vitals.encryption?.source ?? '—'}</span></div>
    <div><span className="k">n8n</span><span className="v"><span className={`dot-s ${vitals.n8n.reachable ? 'ok' : vitals.n8n.configured ? 'bad' : 'off'}`} />{vitals.n8n.reachable ? 'reachable' : vitals.n8n.configured ? 'unreachable' : 'not set'}</span></div>
    <div><span className="k">Chat model</span><span className="v">{vitals.models.chat}</span></div>
    <div><span className="k">Design model</span><span className="v">{vitals.models.design}</span></div>
  </div>
);

/* ------------------------------------------------------------- tabs */

const WorkflowList = ({ data }) => {
  const wf = data?.sections?.workflows?.data ?? [];
  const ex = data?.sections?.executions?.data ?? [];
  return (
    <div className="panel">
      <h2>Workflows<span className="rule" /><span className="meta">{wf.length}</span></h2>
      {wf.length ? <div className="grid cols-2" style={{ gap: 8 }}>{wf.map((w) => <WorkflowCard key={w.id} w={w} ex={ex} />)}</div> : <div className="empty">{data?.sections?.workflows?.error ?? 'None.'}</div>}
    </div>
  );
};

const Broke = ({ findings }) => (
  <div className="panel">
    <h2>Broke<span className="rule" /><span className="meta">{findings.length}</span></h2>
    {!findings.length ? <div className="empty">Nothing failed since the last sweep. That is what I know, not a promise everything ran.</div> : findings.map((f) => (
      <div className="wf" key={f.id} style={{ marginBottom: 8 }}>
        <div className="top">
          <span className="dot-s bad" />
          <span className="name">{f.workflowName ?? f.workflowId}</span>
          <span className="live">{ago(f.at)}</span>
        </div>
        <div className="meta">{f.failingNode ?? 'unknown node'} — {f.error ?? 'no message'}</div>
        <div className="meta mono">exec {f.executionId}</div>
      </div>
    ))}
  </div>
);

function Talk({ messages, live, busy, approval, onSend, onDismiss, ready, showStream }) {
  const [input, setInput] = useState('');
  const bottom = useRef(null);
  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages, live]);

  return (
    <>
      {!ready && <div className="notice">No Gemini key. Settings → Connection.</div>}
      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.role}`}>
          {m.role === 'jason' && showStream && m.steps?.length > 0 && (
            <div className="timeline">{m.steps.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
          )}
          {m.text}
          {m.role === 'jason' && (
            <div className="row" style={{ marginTop: 8, gap: 10 }}>
              {m.status && m.status !== 'ok' && <span className="verdict unconfirmed">{m.status.replace(/_/g, ' ')}</span>}
              {m.spend && <span className="meta mono">${m.spend.monthToDateUsd.toFixed(4)}</span>}
              {m.elapsedMs ? <span className="meta mono">{(m.elapsedMs / 1000).toFixed(1)}s</span> : null}
            </div>
          )}
        </div>
      ))}
      {live.length > 0 && showStream && <div className="msg jason"><div className="timeline">{live.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div></div>}

      {approval && (
        <div className="approval">
          <div className="why">{approval.detail}</div>
          <div className="row"><button onClick={() => onSend('Yes, go ahead.', [approval.action])}>Approve</button><button className="ghost" onClick={onDismiss}>Not now</button></div>
        </div>
      )}

      <div className="panel">
        <textarea value={input} placeholder="when someone fills the contact form, qualify them and put the good ones in a Slack channel" onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { onSend(input); setInput(''); } }} />
        <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <button onClick={() => { onSend(input); setInput(''); }} disabled={busy || !ready}>{busy ? 'Working…' : 'Send'}</button>
          <span className="meta">⌘/Ctrl ↵</span>
        </div>
      </div>
      <div ref={bottom} />
    </>
  );
}

/* --------------------------------------------------------- settings */

const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-3.1-pro-preview'];
const ACCENTS = { cyan: '#22d3ee', violet: '#a78bfa', amber: '#fbbf24', green: '#34d399', magenta: '#f472b6' };

const Setting = ({ name, hint, children }) => (
  <div className="setting">
    <div><div className="name">{name}</div>{hint && <div className="hint">{hint}</div>}</div>
    <div className="ctl">{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button className="toggle" role="switch" aria-checked={on} onClick={() => onChange(!on)}><i /></button>
);

function Settings({ onSaved }) {
  const [s, setS] = useState(null);
  const [draft, setDraft] = useState({});
  const [prefs, setPrefs] = useState(null);
  const [note, setNote] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [minted, setMinted] = useState(null);

  const load = () => fetch('/api/settings').then((r) => r.json()).then((r) => {
    setS(r.settings); setPrefs(r.settings?.prefs ?? null);
    setDraft({ n8nBaseUrl: r.settings?.n8nBaseUrl ?? '', monthlyCapUsd: r.settings?.monthlyCapUsd ?? 8 });
  });
  const loadTokens = () => fetch('/api/tokens').then((r) => r.json()).then((r) => setTokens(r.tokens ?? []));

  useEffect(() => { load(); loadTokens(); }, []);
  if (!s || !prefs) return <div className="panel"><div className="empty">Loading…</div></div>;

  const savePrefs = async (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    const r = await post('/api/settings', { prefs: patch });
    if (r.ok) { setPrefs(r.settings.prefs); onSaved?.(); }
  };

  return (
    <>
      <div className="panel">
        <h2>Connection<span className="rule" /></h2>
        <div className="grid cols-2">
          <div><label>n8n base URL</label><input value={draft.n8nBaseUrl ?? ''} placeholder="https://you.app.n8n.cloud" onChange={(e) => setDraft({ ...draft, n8nBaseUrl: e.target.value.trim() })} /></div>
          <div><label>n8n API key {s.n8nApiKey.set && <span style={{ color: 'var(--worked)' }}>{s.n8nApiKey.hint}</span>}</label><input type="password" placeholder={s.n8nApiKey.set ? 'keep' : 'n8n_api_…'} value={draft.n8nApiKey ?? ''} onChange={(e) => setDraft({ ...draft, n8nApiKey: e.target.value.trim() })} /></div>
          <div><label>Gemini API key {s.geminiApiKey.set && <span style={{ color: 'var(--worked)' }}>{s.geminiApiKey.hint}</span>}</label><input type="password" placeholder={s.geminiApiKey.set ? 'keep' : 'AIza…'} value={draft.geminiApiKey ?? ''} onChange={(e) => setDraft({ ...draft, geminiApiKey: e.target.value.trim() })} /></div>
          <div><label>Monthly cap USD</label><input type="number" value={draft.monthlyCapUsd ?? 8} onChange={(e) => setDraft({ ...draft, monthlyCapUsd: Number(e.target.value) })} /></div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button onClick={async () => {
            const r = await post('/api/settings', draft);
            setNote(r.ok ? 'Saved' : r.error);
            if (r.ok) { setS(r.settings); setDraft((d) => ({ ...d, n8nApiKey: '', geminiApiKey: '' })); onSaved?.(); }
          }}>Save</button>
          {note && <span className="meta">{note}</span>}
          <span className="meta" style={{ marginLeft: 'auto' }}>{s.encryption?.source === 'env' ? 'MASTER_KEY' : 'db-held key'}</span>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="panel" style={{ margin: 0 }}>
          <h2>Model<span className="rule" /></h2>
          <Setting name="Chat model" hint="short turns">
            <select value={prefs.chatModel} onChange={(e) => savePrefs({ chatModel: e.target.value })}>{MODELS.map((m) => <option key={m}>{m}</option>)}</select>
          </Setting>
          <Setting name="Design model" hint="building & repair">
            <select value={prefs.designModel} onChange={(e) => savePrefs({ designModel: e.target.value })}>{MODELS.map((m) => <option key={m}>{m}</option>)}</select>
          </Setting>
          <Setting name="Thinking budget" hint="billed as output; clamped below ceiling">
            <input type="number" step="512" value={prefs.thinkingBudget} onChange={(e) => savePrefs({ thinkingBudget: Number(e.target.value) })} />
          </Setting>
          <Setting name="Max output" hint="tokens">
            <input type="number" step="1024" value={prefs.maxOutputTokens} onChange={(e) => savePrefs({ maxOutputTokens: Number(e.target.value) })} />
          </Setting>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h2>Pipeline<span className="rule" /></h2>
          <Setting name="Deadline" hint="ms; under the 60s function limit">
            <input type="number" step="1000" value={prefs.deadlineMs} onChange={(e) => savePrefs({ deadlineMs: Number(e.target.value) })} />
          </Setting>
          <Setting name="Max steps" hint="tool calls per turn">
            <input type="number" value={prefs.maxSteps} onChange={(e) => savePrefs({ maxSteps: Number(e.target.value) })} />
          </Setting>
          <Setting name="Sweep size" hint="failures per check">
            <input type="number" value={prefs.sweepLimit} onChange={(e) => savePrefs({ sweepLimit: Number(e.target.value) })} />
          </Setting>
          <Setting name="Tag prefix" hint="on test & probe workflows">
            <input type="text" value={prefs.testTagPrefix} onChange={(e) => savePrefs({ testTagPrefix: e.target.value })} />
          </Setting>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h2>Behaviour<span className="rule" /></h2>
          <Setting name="Probe workflows" hint="read real picker values; off = ask you">
            <Toggle on={prefs.allowProbes} onChange={(v) => savePrefs({ allowProbes: v })} />
          </Setting>
          <Setting name="Dry runs disable writes" hint="off lets tests reach real systems">
            <Toggle on={prefs.dryRunDisablesWrites} onChange={(v) => savePrefs({ dryRunDisablesWrites: v })} />
          </Setting>
          <Setting name="Auto-apply safe fixes" hint="retries, timeouts; still versioned">
            <Toggle on={prefs.autoApplySafeFixes} onChange={(v) => savePrefs({ autoApplySafeFixes: v })} />
          </Setting>
          <Setting name="Show tool stream" hint="every step, live">
            <Toggle on={prefs.showToolStream} onChange={(v) => savePrefs({ showToolStream: v })} />
          </Setting>
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h2>Interface<span className="rule" /></h2>
          <Setting name="Accent" hint="idle hue; state still overrides">
            <div className="swatches">
              {Object.entries(ACCENTS).map(([k, c]) => (
                <button key={k} className="swatch" style={{ background: c }} aria-pressed={prefs.accent === k} onClick={() => savePrefs({ accent: k })} title={k} />
              ))}
            </div>
          </Setting>
          <Setting name="Density">
            <div className="seg">
              {['compact', 'roomy'].map((d) => <button key={d} aria-pressed={prefs.density === d} onClick={() => savePrefs({ density: d })}>{d}</button>)}
            </div>
          </Setting>
          <Setting name="Motion" hint="ambient animation">
            <Toggle on={prefs.motion} onChange={(v) => savePrefs({ motion: v })} />
          </Setting>
          <Setting name="Refresh" hint="seconds; free reads only">
            <input type="number" value={prefs.refreshSeconds} onChange={(e) => savePrefs({ refreshSeconds: Number(e.target.value) })} />
          </Setting>
        </div>
      </div>

      <div className="panel">
        <h2>Access<span className="rule" /><span className="meta">tokens for /api/agent</span></h2>
        {minted && <div className="notice">Shown once: <span className="mono">{minted}</span></div>}
        <div className="kv" style={{ marginBottom: 10 }}>
          {tokens.length ? tokens.map((t) => (
            <div key={t.id}>
              <span className="k">{t.label} · {t.id}</span>
              <span className="v">{t.retiredAt ? 'retired' : <button className="ghost" style={{ padding: '1px 8px', fontSize: 11 }} onClick={async () => { await post('/api/tokens', { action: 'retire', id: t.id }); loadTokens(); }}>Retire</button>}</span>
            </div>
          )) : <div><span className="k">none yet</span><span className="v">—</span></div>}
        </div>
        <button onClick={async () => { const r = await post('/api/tokens', { action: 'mint', label: 'voice' }); if (r.ok) { setMinted(r.token); loadTokens(); } }}>Mint token</button>
      </div>

      <ChangePassword />
    </>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [note, setNote] = useState(null);
  return (
    <div className="panel">
      <h2>Password<span className="rule" /></h2>
      <div className="grid cols-2">
        <div><label>Current</label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
        <div><label>New</label><input type="password" value={next} onChange={(e) => setNext(e.target.value)} /></div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button disabled={!current || !next} onClick={async () => {
          const r = await post('/api/auth', { action: 'change-password', currentPassword: current, newPassword: next });
          setNote(r.ok ? 'Changed' : r.error);
          if (r.ok) { setCurrent(''); setNext(''); }
        }}>Change</button>
        {note && <span className="meta">{note}</span>}
      </div>
    </div>
  );
}
