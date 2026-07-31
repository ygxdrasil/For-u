import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Jason's HUD.
 *
 * ONE CALLER of the pipeline, not the pipeline. Capability belongs in
 * core/tools.js — never here.
 *
 * Layout: chat is the page and is always mounted, so switching what you are
 * looking at never interrupts a conversation in flight. Everything else lives
 * in a side panel that folds away.
 *
 * Rules held to: no anthropomorphism, no hidden uncertainty ("couldn't confirm"
 * is violet everywhere and is never rounded to a tick or a cross), nothing
 * labelled Delete, and no wall of text where a number does.
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

export default function App() {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    document.documentElement.dataset.state = 'idle';
    post('/api/auth', { action: 'status' }).then(setAuth);
  }, []);

  if (auth === null) return <div className="gate"><p className="sub">Waking…</p></div>;
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
    <div className="gate">
      <Mark />
      <h1>Jason</h1>
      <p className="sub">{mode === 'setup' ? 'Set a password.' : 'Sign in.'}</p>
      {mode === 'login' && auth.reason && auth.reason !== 'no-cookie' && (
        <p className="sub" style={{ color: 'var(--unconfirmed)' }}>
          {auth.reason === 'expired' ? 'Your session ran out.' : "Something changed on the server, so your session didn't carry over."}
        </p>
      )}
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

/* ====================================================================== */

const SECTIONS = [
  { id: 'overview', glyph: '◵', label: 'Overview' },
  { id: 'workflows', glyph: '⣿', label: 'Workflows' },
  { id: 'broke', glyph: '△', label: 'Needs a look' },
  { id: 'memory', glyph: '◈', label: 'Memory' },
  { id: 'settings', glyph: '⚙', label: 'Settings' },
];

function Jason({ onSignOut }) {
  const [section, setSection] = useState('overview');
  const [folded, setFolded] = useState(() => window.innerWidth < 780);
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
    if (busy) return /saving|switching|fetching|testing|putting/.test(live[live.length - 1]?.text ?? '') ? 'acting' : 'thinking';
    if (data && data.vitals.n8n.configured && !data.vitals.n8n.reachable) return 'offline';
    if ([...messages].reverse().find((m) => m.role === 'jason')?.status === 'ok') return 'resolved';
    return 'idle';
  }, [busy, live, approval, data, messages]);

  useEffect(() => {
    const r = document.documentElement;
    const theme = prefs?.theme ?? 'light';
    r.dataset.theme = theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    r.dataset.state = state;
    r.dataset.accent = prefs?.accent ?? 'cyan';
    r.dataset.motion = prefs?.motion === false ? 'off' : 'on';
    r.dataset.busy = busy ? 'yes' : 'no';
  }, [state, busy, prefs?.theme, prefs?.accent, prefs?.motion]);

  const said = {
    idle: 'Idle',
    thinking: live[live.length - 1]?.text ?? 'Thinking',
    acting: live[live.length - 1]?.text ?? 'Working',
    waiting: 'Waiting on you',
    resolved: 'Done',
    offline: "Can't reach your n8n",
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
          if (ev === 'status') events.push({ kind: 'run', text: d.status, key: `s${events.length}` });
          if (ev === 'tool_start') events.push({ kind: 'run', text: d.say ?? d.name, key: d.name });
          if (ev === 'tool_end') {
            const hit = [...events].reverse().find((e) => e.key === d.name && e.kind === 'run');
            if (hit) { hit.kind = d.ok ? 'ok' : 'bad'; hit.text = d.say ?? d.name; hit.error = d.ok ? null : d.error; }
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
  const ready = data?.sections?.settings?.data?.geminiApiKey?.set;

  return (
    <div className="app">
      <header className="top">
        <Mark />
        <span className="name">Jason</span>
        <span className="pill"><b /><span>{said}</span></span>
        <div className="top-right">
          <button className="bare" title="Sign out" onClick={onSignOut}>⏻</button>
          <button className="bare" title={folded ? 'Show panel' : 'Hide panel'} onClick={() => setFolded((f) => !f)}>{folded ? '☰' : '✕'}</button>
        </div>
      </header>

      <div className="body">
        <Chat
          messages={messages}
          live={live}
          busy={busy}
          approval={approval}
          onSend={send}
          onDismiss={() => setApproval(null)}
          ready={ready}
          showStream={prefs?.showToolStream !== false}
        />

        <aside className={`side ${folded ? 'folded' : ''}`}>
          <nav className="side-tabs">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-selected={section === s.id && !folded}
                title={s.label}
                onClick={() => { setSection(s.id); setFolded(false); }}
              >
                <span className="glyph">{s.glyph}</span>
                <span className="label">{s.label}</span>
                {s.id === 'broke' && findings.length ? <span className="badge">{findings.length}</span> : null}
              </button>
            ))}
          </nav>
          <div className="side-content">
            {section === 'overview' && <Overview data={data} />}
            {section === 'workflows' && <Workflows data={data} />}
            {section === 'broke' && <Broke findings={findings} />}
            {section === 'memory' && <Memory />}
            {section === 'settings' && <Settings onSaved={refresh} />}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ==================================================================== chat */

const STARTERS = [
  'What do I have running?',
  'Has anything broken?',
  'Build me a contact form that posts good leads to Slack',
];

function Chat({ messages, live, busy, approval, onSend, onDismiss, ready, showStream }) {
  const [input, setInput] = useState('');
  const bottom = useRef(null);
  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages, live]);

  const submit = () => { onSend(input); setInput(''); };

  return (
    <main className="chat">
      <div className="thread">
        <div className="thread-inner">
          {!ready && <div className="notice warn">No Gemini key yet — Settings, in the panel.</div>}

          {messages.length === 0 && !busy && (
            <div className="empty-chat">
              <h2>What do you want built?</h2>
              <div>Describe the outcome. I'll work out the workflows.</div>
              <div className="suggest">
                {STARTERS.map((s) => <button key={s} className="ghost" onClick={() => onSend(s)} disabled={!ready}>{s}</button>)}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'jason' && showStream && m.steps?.length > 0 && (
                <div className="steps">{m.steps.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
              )}
              <div className="bubble">{m.text}</div>
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
            <div className="msg jason"><div className="steps">{live.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div></div>
          )}

          {approval && (
            <div className="approval">
              <div style={{ marginBottom: 10 }}>{approval.detail}</div>
              <div className="row">
                <button onClick={() => onSend('Yes, go ahead.', [approval.action])}>Approve</button>
                <button className="ghost" onClick={onDismiss}>Not now</button>
              </div>
            </div>
          )}
          <div ref={bottom} />
        </div>
      </div>

      <div className="composer">
        <div className="composer-inner">
          <textarea
            value={input}
            rows={1}
            placeholder="Describe what you want…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          />
          <button className="send" onClick={submit} disabled={busy || !ready || !input.trim()}>{busy ? '…' : 'Send'}</button>
        </div>
      </div>
    </main>
  );
}

/* ================================================================== panel */

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
      {vitals.n8n.configured && !vitals.n8n.reachable && <div className="notice unknown">Can't reach your n8n. State unknown, not broken.</div>}
      {!vitals.n8n.configured && <div className="notice warn">No n8n connected yet — Settings.</div>}

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
            <span className="mono" style={{ color: 'var(--dimmer)' }}>{clock(e.startedAt)}</span>
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

const WorkflowItem = ({ w, ex }) => {
  const last = ex.find((e) => e.workflowId === w.id);
  return (
    <div className="item">
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
    </div>
  );
};

const Workflows = ({ data }) => {
  const wf = data?.sections?.workflows?.data ?? [];
  const ex = data?.sections?.executions?.data ?? [];
  if (!wf.length) return <div className="empty">{data?.sections?.workflows?.error ?? 'Nothing here yet.'}</div>;
  return <>{wf.map((w) => <WorkflowItem key={w.id} w={w} ex={ex} />)}</>;
};

const Broke = ({ findings }) =>
  !findings.length ? (
    <div className="empty">Nothing has failed since the last check. That's what I know — not a promise everything ran.</div>
  ) : (
    <>
      {findings.map((f) => (
        <div className="item" key={f.id}>
          <div className="head">
            <span className="dot bad" />
            <span className="title">{f.workflowName ?? f.workflowId}</span>
            <span className="when">{ago(f.at)}</span>
          </div>
          <div className="meta">{f.failingNode ?? 'unknown step'} — {f.error ?? 'no message'}</div>
        </div>
      ))}
    </>
  );

function Vitals({ vitals }) {
  const [more, setMore] = useState(false);
  return (
    <>
      <div className="kv">
        <div><span className="k">Your n8n</span><span className="v"><span className={`dot ${vitals.n8n.reachable ? 'ok' : vitals.n8n.configured ? 'bad' : 'off'}`} />{vitals.n8n.reachable ? 'connected' : vitals.n8n.configured ? "can't reach" : 'not set up'}</span></div>
        <div><span className="k">Nodes I know</span><span className="v">{vitals.nodeIndex?.nodeCount ?? '—'}</span></div>
        <div><span className="k">Memory</span><span className="v"><span className={`dot ${vitals.store.durable ? 'ok' : 'bad'}`} />{vitals.store.durable ? 'saved' : 'not saved'}</span></div>
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

  const load = () => fetch('/api/settings').then((r) => r.json()).then((r) => setFacts(r.memory ?? []));
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

/* =============================================================== settings */

const MODELS = ['gemini-2.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-pro', 'gemini-3.1-pro-preview'];
const ACCENTS = { cyan: '#0891b2', violet: '#7c3aed', amber: '#b45309', green: '#0f8a5f', magenta: '#be185d' };

const Setting = ({ n, h, children }) => (
  <div className="setting">
    <div><div className="n">{n}</div>{h && <div className="h">{h}</div>}</div>
    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => <button className="toggle" role="switch" aria-checked={on} onClick={() => onChange(!on)}><i /></button>;

function Settings({ onSaved }) {
  const [s, setS] = useState(null);
  const [draft, setDraft] = useState({});
  const [prefs, setPrefs] = useState(null);
  const [note, setNote] = useState(null);
  const [advanced, setAdvanced] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [minted, setMinted] = useState(null);

  const load = () => fetch('/api/settings').then((r) => r.json()).then((r) => {
    setS(r.settings); setPrefs(r.settings?.prefs ?? null);
    setDraft({ n8nBaseUrl: r.settings?.n8nBaseUrl ?? '', monthlyCapUsd: r.settings?.monthlyCapUsd ?? 8 });
  });
  const loadTokens = () => fetch('/api/tokens').then((r) => r.json()).then((r) => setTokens(r.tokens ?? []));

  useEffect(() => { load(); loadTokens(); }, []);
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
        <label>n8n key {s.n8nApiKey.set && <span style={{ color: 'var(--worked)' }}>saved {s.n8nApiKey.hint}</span>}</label>
        <input type="password" placeholder={s.n8nApiKey.set ? 'leave blank to keep' : 'n8n_api_…'} value={draft.n8nApiKey ?? ''} onChange={(e) => setDraft({ ...draft, n8nApiKey: e.target.value.trim() })} />
        <label>Gemini key {s.geminiApiKey.set && <span style={{ color: 'var(--worked)' }}>saved {s.geminiApiKey.hint}</span>}</label>
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

      <div className="card">
        <h3>Other AIs<span className="rule" /></h3>
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
