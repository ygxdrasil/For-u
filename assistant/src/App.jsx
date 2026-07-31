import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Jason's interface.
 *
 * It is ONE CALLER of the pipeline, not the pipeline. Everything it can do,
 * /api/agent can do, because both call core/run.js with the same tools.
 * Capability belongs in core/tools.js — never here.
 *
 * Three rules this file holds to:
 *   - No anthropomorphism. Jason has state, not moods. Nothing on screen
 *     pretends to be a person or fills silence with chatter.
 *   - No hidden uncertainty. "Couldn't confirm" is violet everywhere, never
 *     rounded up to a tick or down to a cross, including in small badges.
 *   - No destructive-looking controls. Nothing is labelled Delete, because
 *     nothing can delete.
 */

const post = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: `Server returned ${res.status}` }));
};

const setHue = (state) => {
  document.documentElement.dataset.state = state;
};

export default function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setHue('idle');
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

  useEffect(() => setHue(mode === 'setup' ? 'waiting' : 'idle'), [mode]);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (mode === 'setup') {
      if (password.length < 8) return setError('At least 8 characters.');
      if (password !== confirm) return setError('Those do not match.');
    }
    setBusy(true);
    const res = await post('/api/auth', { action: mode === 'setup' ? 'setup' : 'login', password });
    setBusy(false);
    if (!res.ok) return setError(res.error ?? 'That did not work.');
    onDone({ ...auth, passwordSet: true, signedIn: true });
  };

  return (
    <div className="shell gate">
      <Mark />
      <h1>Jason</h1>
      <p className="sub">{mode === 'setup' ? 'Set a password. This is the only door.' : 'Sign in.'}</p>

      <form className="panel" onSubmit={submit}>
        {mode === 'setup' && auth.durable === false && (
          <div className="notice">
            No database yet, so setting a password is refused rather than half-working — it would live in one serverless
            instance's memory and vanish when another served a request. Add <code>DATABASE_URL</code>, redeploy, come back.
          </div>
        )}
        <label>Password</label>
        <input type="password" value={password} autoFocus autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'setup' && (
          <>
            <label>Confirm</label>
            <input type="password" value={confirm} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} />
          </>
        )}
        {error && <div className="notice" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
        <div className="row" style={{ marginTop: 14 }}>
          <button type="submit" disabled={busy || !password}>{busy ? '…' : mode === 'setup' ? 'Set password' : 'Sign in'}</button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function Jason({ onSignOut }) {
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [live, setLive] = useState([]);
  const [busy, setBusy] = useState(false);
  const [approval, setApproval] = useState(null);
  const [activity, setActivity] = useState({ label: 'Idle', detail: 'Nothing in flight.', since: Date.now() });
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2)}`);

  const refresh = useCallback(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => d.ok && setData(d))
      .catch(() => {});
  }, []);

  // Free reads only, paused when the tab is hidden. No model call is ever made
  // on a timer — a schedule that spends money is a bill nobody agreed to.
  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 30000);
    return () => clearInterval(id);
  }, [refresh]);

  // Jason's state: derived from what is actually happening, never decorative.
  const state = useMemo(() => {
    if (approval) return 'waiting';
    if (busy) {
      const last = live[live.length - 1]?.text ?? '';
      return /save|dry_run|ground|active|archive/.test(last) ? 'acting' : 'thinking';
    }
    if (data && !data.vitals.n8n.reachable) return 'offline';
    const lastMsg = [...messages].reverse().find((m) => m.role === 'jason');
    if (lastMsg?.status === 'ok') return 'resolved';
    return 'idle';
  }, [busy, live, approval, data, messages]);

  useEffect(() => setHue(state), [state]);

  useEffect(() => {
    const map = {
      idle: ['Idle', 'Watching. Nothing in flight.'],
      thinking: ['Thinking', live[live.length - 1]?.text ?? 'Working through it.'],
      acting: ['Acting', live[live.length - 1]?.text ?? 'Touching your n8n.'],
      waiting: ['Waiting on you', approval?.detail ?? 'Needs your approval.'],
      resolved: ['Done', 'Last request finished. Evidence in the conversation.'],
      offline: ['No n8n', data?.vitals?.n8n?.error ?? 'Not connected to an instance.'],
    };
    const [label, detail] = map[state] ?? map.idle;
    setActivity({ label, detail, since: Date.now() });
  }, [state, live, approval, data]);

  async function send(text, approvals = []) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setLive([]);
    setApproval(null);
    setMessages((m) => [...m, { role: 'user', text }]);

    const events = [];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sessionId: sessionId.current, approvals }),
      });

      if (res.status === 401) {
        setMessages((m) => [...m, { role: 'jason', text: 'Session expired. Reload and sign in.', status: 'error' }]);
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
          const ev = frame.split('\n').find((l) => l.startsWith('event: '))?.slice(7).trim();
          const dl = frame.split('\n').find((l) => l.startsWith('data: '));
          if (!ev || !dl) continue;
          let d;
          try { d = JSON.parse(dl.slice(6)); } catch { continue; }

          if (ev === 'status') events.push({ kind: 'run', text: d.status });
          if (ev === 'tool_start') events.push({ kind: 'run', text: d.name });
          if (ev === 'tool_end') {
            const hit = [...events].reverse().find((e) => e.text.startsWith(d.name));
            if (hit) {
              hit.kind = d.ok ? 'ok' : 'bad';
              hit.text = d.ok ? d.name : `${d.name} — ${d.error ?? 'failed'}`;
            }
            if (d.needsApproval) setApproval({ action: d.needsApproval, detail: d.error });
          }
          if (ev === 'done') {
            setMessages((m) => [...m, { role: 'jason', text: d.reply, steps: [...events], status: d.status, spend: d.spend, elapsedMs: d.elapsedMs }]);
            refresh();
          }
          if (ev === 'error') setMessages((m) => [...m, { role: 'jason', text: `Server error: ${d.error}`, status: 'error' }]);
          setLive([...events]);
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'jason', text: `Couldn't reach the server: ${err.message}. That is a connection problem, not necessarily a problem with your workflows.`, status: 'error' }]);
    } finally {
      setBusy(false);
      setLive([]);
    }
  }

  const findings = data?.sections?.findings?.data ?? [];
  const workflows = data?.sections?.workflows?.data ?? [];

  return (
    <div className="shell">
      <header className="masthead">
        <Mark />
        <h1 className="wordmark">Jason<small>n8n workflow contractor</small></h1>
        <div className="masthead-right">
          <span className="meta mono">{data?.vitals?.build?.buildId ?? ''}</span>
          <button className="ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <div className={`statestrip ${busy ? 'busy' : ''}`}>
        <span className="dot" />
        <span className="label">{activity.label}</span>
        <span className="detail">{activity.detail}</span>
        <span className="since">{data?.vitals?.store?.durable ? 'postgres' : 'memory'}</span>
      </div>

      <nav className="nav">
        {[
          ['dashboard', 'Dashboard', null],
          ['chat', 'Conversation', null],
          ['workflows', 'Workflows', workflows.length || null],
          ['broke', 'What broke', findings.length || null],
          ['settings', 'Settings', null],
        ].map(([id, label, count]) => (
          <button key={id} aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
            {count ? <span className="count">{count}</span> : null}
          </button>
        ))}
      </nav>

      {tab === 'dashboard' && <Dashboard data={data} onOpen={setTab} />}
      {tab === 'chat' && (
        <Conversation messages={messages} live={live} busy={busy} approval={approval} onSend={send} onDismissApproval={() => setApproval(null)} ready={data?.sections?.settings?.data?.geminiApiKey?.set} />
      )}
      {tab === 'workflows' && <Workflows data={data} />}
      {tab === 'broke' && <Broke findings={findings} data={data} />}
      {tab === 'settings' && <Settings onSaved={refresh} />}
    </div>
  );
}

/* ------------------------------------------------------------- dashboard */

function Dashboard({ data, onOpen }) {
  if (!data) return <div className="panel"><div className="empty">Reading state…</div></div>;

  const { vitals, sections } = data;
  const workflows = sections.workflows.data ?? [];
  const executions = sections.executions.data ?? [];
  const findings = sections.findings.data ?? [];
  const spend = sections.spend.data;

  const active = workflows.filter((w) => w.active && !w.isArchived).length;
  const failed24 = executions.filter((e) => e.status === 'error' && Date.now() - new Date(e.startedAt).getTime() < 864e5).length;
  const pct = spend ? Math.min(100, (spend.monthToDateUsd / Math.max(spend.capUsd, 0.01)) * 100) : 0;

  return (
    <>
      {!vitals.n8n.configured && (
        <div className="notice">No n8n connection. I can search nodes and design workflows, but I cannot read, save, ground a value or test anything. Add your instance in Settings.</div>
      )}
      {vitals.n8n.configured && !vitals.n8n.reachable && (
        <div className="notice violet">
          I couldn't reach your n8n ({vitals.n8n.error}). That means I don't know the state of your workflows — not that they are broken.
        </div>
      )}

      <div className="grid cols-4">
        <Stat k="Workflows" v={workflows.length} sub={`${active} active`} accent />
        <Stat k="Failures 24h" v={failed24} sub={failed24 ? 'needs a look' : 'nothing failing'} />
        <Stat k="Open findings" v={findings.length} sub={findings.length ? 'awaiting your call' : 'inbox clear'} />
        <Stat
          k="Spend this month"
          v={spend ? `$${spend.monthToDateUsd.toFixed(3)}` : '—'}
          sub={spend ? `of $${spend.capUsd} cap` : 'no meter yet'}
          meter={pct}
        />
      </div>

      <div className="panel">
        <h2>Execution activity<span className="rule" /><span className="meta">last 14 days</span></h2>
        <Activity executions={executions} />
      </div>

      <div className="grid cols-2">
        <div className="panel" style={{ margin: 0 }}>
          <h2>Workflows<span className="rule" /><button className="ghost" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => onOpen('workflows')}>All</button></h2>
          {workflows.length === 0 ? <div className="empty">{sections.workflows.ok ? 'No workflows yet.' : sections.workflows.error}</div> : (
            <div className="grid" style={{ gap: 8 }}>
              {workflows.slice(0, 4).map((w) => <WorkflowCard key={w.id} w={w} />)}
            </div>
          )}
        </div>

        <div className="panel" style={{ margin: 0 }}>
          <h2>Vitals<span className="rule" /></h2>
          <Vitals vitals={vitals} />
        </div>
      </div>
    </>
  );
}

const Stat = ({ k, v, sub, accent, meter }) => (
  <div className={`stat ${accent ? 'accent' : ''}`}>
    <div className="k">{k}</div>
    <div className="v">{v}</div>
    <div className="sub">{sub}</div>
    {meter !== undefined && <div className="meter"><i style={{ width: `${meter}%` }} /></div>}
  </div>
);

/** Runs per day, successes above failures. Built from data we already read. */
function Activity({ executions }) {
  const days = 14;
  const buckets = Array.from({ length: days }, () => ({ ok: 0, bad: 0 }));
  const today = new Date().setHours(0, 0, 0, 0);

  for (const e of executions) {
    const d = new Date(e.startedAt).setHours(0, 0, 0, 0);
    const idx = days - 1 - Math.round((today - d) / 864e5);
    if (idx >= 0 && idx < days) buckets[idx][e.status === 'error' ? 'bad' : 'ok']++;
  }

  const max = Math.max(1, ...buckets.map((b) => b.ok + b.bad));
  if (!executions.length) return <div className="empty">No executions to show yet.</div>;

  return (
    <>
      <div className="bars">
        {buckets.map((b, i) => (
          <div className="bar" key={i} title={`${b.ok} ok, ${b.bad} failed`}>
            <span className="ok" style={{ height: `${(b.ok / max) * 60}px` }} />
            <span className="bad" style={{ height: `${(b.bad / max) * 60}px` }} />
          </div>
        ))}
      </div>
      <div className="axis"><span>14d ago</span><span>today</span></div>
    </>
  );
}

const WorkflowCard = ({ w }) => (
  <div className="wf">
    <div className="top">
      <span className="name">{w.name}</span>
      <span className={`live ${w.active ? 'on' : ''}`}>{w.isArchived ? 'archived' : w.active ? '● live' : 'inactive'}</span>
    </div>
    <div className="chain">
      {w.chain.map((n, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="arrow">→</span>}
          <span className="node">{n.short}</span>
        </span>
      ))}
      {w.nodeCount > w.chain.length && <span className="more">+{w.nodeCount - w.chain.length}</span>}
    </div>
  </div>
);

const Vitals = ({ vitals }) => (
  <dl className="evidence" style={{ border: 0, padding: 0, margin: 0 }}>
    <div className="evidence" style={{ borderLeft: 0, border: 0, padding: 0 }}>
      <Row k="Build" v={vitals.build?.buildId ?? 'unstamped'} />
      <Row k="Node index" v={vitals.nodeIndex ? `${vitals.nodeIndex.nodeCount} nodes · n8n-nodes-base ${vitals.nodeIndex.packages['n8n-nodes-base']}` : vitals.nodeIndexError} />
      <Row k="Your instance" v={<span className="verdict unconfirmed">version unconfirmed</span>} />
      <Row k="Store" v={vitals.store.durable ? 'postgres · durable' : 'memory · not durable'} />
      <Row k="Key encryption" v={vitals.encryption?.source === 'env' ? 'MASTER_KEY (outside the database)' : 'database-held key'} />
      <Row k="Models" v={`${vitals.models.chat} · ${vitals.models.design}`} />
    </div>
    <p className="meta" style={{ marginTop: 10, marginBottom: 0 }}>{vitals.instanceVersionNote}</p>
  </dl>
);

const Row = ({ k, v }) => (
  <div className="row" style={{ justifyContent: 'space-between', gap: 12, padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
    <span className="meta">{k}</span>
    <span className="mono" style={{ fontSize: 11.5, textAlign: 'right' }}>{v}</span>
  </div>
);

/* ----------------------------------------------------------- other tabs */

function Workflows({ data }) {
  const workflows = data?.sections?.workflows?.data ?? [];
  if (!workflows.length) return <div className="panel"><div className="empty">{data?.sections?.workflows?.error ?? 'No workflows.'}</div></div>;
  return (
    <div className="panel">
      <h2>All workflows<span className="rule" /><span className="meta">{workflows.length}</span></h2>
      <div className="grid cols-2" style={{ gap: 8 }}>
        {workflows.map((w) => <WorkflowCard key={w.id} w={w} />)}
      </div>
    </div>
  );
}

function Broke({ findings }) {
  return (
    <div className="panel">
      <h2>What broke<span className="rule" /></h2>
      {!findings.length ? (
        <div className="empty">Nothing has failed since the last sweep. That is what I know — not a promise that everything ran.</div>
      ) : (
        findings.map((f) => (
          <div className="wf" key={f.id} style={{ marginBottom: 8 }}>
            <div className="top">
              <span className="name">{f.workflowName ?? f.workflowId}</span>
              <span className="verdict failed" style={{ marginLeft: 'auto' }}>failed</span>
            </div>
            <div className="meta">Node “{f.failingNode ?? 'unknown'}” — {f.error ?? 'no message recorded'}</div>
            <div className="meta mono" style={{ marginTop: 4 }}>execution {f.executionId} · {f.at}</div>
          </div>
        ))
      )}
    </div>
  );
}

function Conversation({ messages, live, busy, approval, onSend, onDismissApproval, ready }) {
  const [input, setInput] = useState('');
  const bottom = useRef(null);
  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth' }), [messages, live]);

  return (
    <>
      {!ready && <div className="notice">No Gemini key saved. Jason cannot think without one — add it in Settings.</div>}

      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.role}`}>
          {m.role === 'jason' && m.steps?.length > 0 && (
            <div className="timeline">{m.steps.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
          )}
          {m.text}
          {m.role === 'jason' && (
            <div className="row" style={{ marginTop: 9, gap: 10 }}>
              {m.status && m.status !== 'ok' && <span className="verdict unconfirmed">{m.status.replace(/_/g, ' ')}</span>}
              {m.spend && <span className="meta mono">${m.spend.monthToDateUsd.toFixed(4)} / ${m.spend.capUsd}</span>}
              {m.elapsedMs ? <span className="meta mono">{(m.elapsedMs / 1000).toFixed(1)}s</span> : null}
            </div>
          )}
        </div>
      ))}

      {live.length > 0 && (
        <div className="msg jason">
          <div className="timeline">{live.map((s, j) => <div key={j} className={s.kind}>{s.text}</div>)}</div>
        </div>
      )}

      {approval && (
        <div className="approval">
          <div className="why">{approval.detail}</div>
          <div className="row">
            <button onClick={() => onSend('Yes, go ahead.', [approval.action])}>Approve</button>
            <button className="ghost" onClick={onDismissApproval}>Not now</button>
          </div>
        </div>
      )}

      <div className="panel">
        <textarea
          value={input}
          placeholder="when someone fills the contact form, qualify them and put the good ones in a Slack channel with a summary"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { onSend(input); setInput(''); }
          }}
        />
        <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <button onClick={() => { onSend(input); setInput(''); }} disabled={busy || !ready}>{busy ? 'Working…' : 'Send'}</button>
          <span className="meta">⌘/Ctrl + Enter</span>
        </div>
      </div>
      <div ref={bottom} />
    </>
  );
}

function Settings({ onSaved }) {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState({});
  const [note, setNote] = useState(null);

  const load = () =>
    fetch('/api/settings').then((r) => r.json()).then((r) => {
      setSettings(r.settings ?? null);
      if (r.settings) setDraft({ n8nBaseUrl: r.settings.n8nBaseUrl ?? '', monthlyCapUsd: r.settings.monthlyCapUsd ?? 8 });
    });

  useEffect(() => { load(); }, []);
  if (!settings) return <div className="panel"><div className="empty">Loading…</div></div>;

  return (
    <>
      <div className="panel">
        <h2>Connection<span className="rule" /></h2>
        <div className="grid cols-2">
          <div>
            <label>n8n base URL</label>
            <input value={draft.n8nBaseUrl ?? ''} placeholder="https://yourname.app.n8n.cloud" onChange={(e) => setDraft({ ...draft, n8nBaseUrl: e.target.value.trim() })} />
          </div>
          <div>
            <label>n8n API key {settings.n8nApiKey.set && <span style={{ color: 'var(--worked)' }}>saved {settings.n8nApiKey.hint}</span>}</label>
            <input type="password" placeholder={settings.n8nApiKey.set ? 'leave blank to keep' : 'n8n_api_…'} value={draft.n8nApiKey ?? ''} onChange={(e) => setDraft({ ...draft, n8nApiKey: e.target.value.trim() })} />
          </div>
          <div>
            <label>Gemini API key {settings.geminiApiKey.set && <span style={{ color: 'var(--worked)' }}>saved {settings.geminiApiKey.hint}</span>}</label>
            <input type="password" placeholder={settings.geminiApiKey.set ? 'leave blank to keep' : 'AIza…'} value={draft.geminiApiKey ?? ''} onChange={(e) => setDraft({ ...draft, geminiApiKey: e.target.value.trim() })} />
          </div>
          <div>
            <label>Monthly cap (USD)</label>
            <input type="number" value={draft.monthlyCapUsd ?? 8} onChange={(e) => setDraft({ ...draft, monthlyCapUsd: Number(e.target.value) })} />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button
            onClick={async () => {
              setNote('Saving…');
              const res = await post('/api/settings', draft);
              setNote(res.ok ? res.warning ?? 'Saved.' : res.error);
              if (res.ok) { setSettings(res.settings); setDraft((d) => ({ ...d, n8nApiKey: '', geminiApiKey: '' })); onSaved?.(); }
            }}
          >
            Save
          </button>
          {note && <span className="meta">{note}</span>}
        </div>
        <p className="meta" style={{ marginTop: 10, marginBottom: 0 }}>{settings.encryption?.note}</p>
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
        <div>
          <label>Current</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <label>New</label>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button
          onClick={async () => {
            const res = await post('/api/auth', { action: 'change-password', currentPassword: current, newPassword: next });
            setNote(res.ok ? 'Changed.' : res.error);
            if (res.ok) { setCurrent(''); setNext(''); }
          }}
          disabled={!current || !next}
        >
          Change password
        </button>
        {note && <span className="meta">{note}</span>}
      </div>
    </div>
  );
}
