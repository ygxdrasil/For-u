import { useEffect, useRef, useState } from 'react';

/**
 * The web interface. It is ONE CALLER of the pipeline, not the pipeline.
 * Everything it can do, /api/agent can do, because both call core/run.js with
 * the same tools. If you want the assistant to gain a capability, it goes in
 * core/tools.js — never here.
 *
 * Keys are pasted here and kept in this browser's localStorage, then sent with
 * each request. That means: no server-side secret store to set up, and
 * rotating a key is deleting a box and typing a new one. It also means the
 * keys are visible to anything that can run script in this page, which for a
 * single-user tool on your own domain is the trade I would make — but it is a
 * real trade and you should know about it.
 */

const KEY_STORE = 'n8n-assistant-config';

const loadConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY_STORE)) ?? {};
  } catch {
    return {};
  }
};

export default function App() {
  const [config, setConfig] = useState(loadConfig);
  const [showSettings, setShowSettings] = useState(!loadConfig().geminiApiKey);
  const [health, setHealth] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState([]);
  const [pendingApproval, setPendingApproval] = useState(null);
  const sessionId = useRef(`s_${Math.random().toString(36).slice(2)}`);
  const bottom = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setHealth({ ok: false, error: e.message }));
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, live]);

  const save = (next) => {
    setConfig(next);
    localStorage.setItem(KEY_STORE, JSON.stringify(next));
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
        body: JSON.stringify({ text, sessionId: sessionId.current, approvals, config }),
      });

      if (!res.ok || !res.body) throw new Error(`Server returned ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Parse the SSE stream by hand — it is a dozen lines and avoids a
      // dependency that would have to be kept current.
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
              {
                role: 'assistant',
                text: data.reply,
                steps: [...events],
                status: data.status,
                spend: data.spend,
                elapsedMs: data.elapsedMs,
                storeDurable: data.storeDurable,
              },
            ]);
          }
          if (event === 'error') {
            setMessages((m) => [...m, { role: 'assistant', text: `Something broke on the server: ${data.error}`, status: 'error' }]);
          }
          setLive([...events]);
        }
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: `I couldn't reach the server: ${err.message}. That is a connection problem, not necessarily a problem with your workflows.`, status: 'error' }]);
    } finally {
      setBusy(false);
      setLive([]);
    }
  }

  const configured = Boolean(config.geminiApiKey);
  const n8nConfigured = Boolean(config.n8nBaseUrl && config.n8nApiKey);

  return (
    <div className="app">
      <header>
        <h1>n8n workflow assistant</h1>
        <span className="build">
          {health?.build?.buildId ? `build ${health.build.buildId}` : 'build unknown'}
          {health?.nodeIndex ? ` · ${health.nodeIndex.nodeCount} nodes` : ''}
        </span>
      </header>

      {health && health.store && !health.store.durable && (
        <div className="notice">
          State is not durable: {health.store.note} Chat history, spend and snapshots reset when the function cold-starts.
        </div>
      )}

      {!configured && (
        <div className="notice">Paste a Gemini API key below to get started. Without it I cannot think at all.</div>
      )}
      {configured && !n8nConfigured && (
        <div className="notice">
          No n8n connection. I can search nodes and design workflows, but I cannot read, save, ground values or test anything until you add your n8n URL and API key.
        </div>
      )}

      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Keys</h2>
          <button className="secondary" onClick={() => setShowSettings((s) => !s)}>
            {showSettings ? 'Hide' : 'Show'}
          </button>
        </div>

        {showSettings && (
          <>
            <div className="grid2">
              <div>
                <label>n8n base URL</label>
                <input
                  value={config.n8nBaseUrl ?? ''}
                  placeholder="https://yourname.app.n8n.cloud"
                  onChange={(e) => save({ ...config, n8nBaseUrl: e.target.value.trim() })}
                />
              </div>
              <div>
                <label>n8n API key</label>
                <input
                  type="password"
                  value={config.n8nApiKey ?? ''}
                  placeholder="n8n_api_…"
                  onChange={(e) => save({ ...config, n8nApiKey: e.target.value.trim() })}
                />
              </div>
              <div>
                <label>Gemini API key</label>
                <input
                  type="password"
                  value={config.geminiApiKey ?? ''}
                  placeholder="AIza…"
                  onChange={(e) => save({ ...config, geminiApiKey: e.target.value.trim() })}
                />
              </div>
              <div>
                <label>Monthly spend cap (USD)</label>
                <input
                  type="number"
                  value={config.monthlyCapUsd ?? 8}
                  onChange={(e) => save({ ...config, monthlyCapUsd: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <button
                className="secondary"
                onClick={() => {
                  // Rotation is one click, built at the same time as the token.
                  save({});
                  setShowSettings(true);
                }}
              >
                Clear all keys
              </button>
              <span className="meta">Kept in this browser only. Never written to the server.</span>
            </div>
          </>
        )}
      </div>

      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.role}`}>
          {m.role === 'assistant' && m.steps?.length > 0 && (
            <div className="timeline">
              {m.steps.map((s, j) => (
                <div key={j} className={s.kind}>{s.text}</div>
              ))}
            </div>
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
          <div className="timeline">
            {live.map((s, j) => (
              <div key={j} className={s.kind}>{s.text}</div>
            ))}
          </div>
        </div>
      )}

      {pendingApproval && (
        <div className="notice">
          <div style={{ marginBottom: 8 }}>{pendingApproval.detail}</div>
          <div className="row">
            <button onClick={() => send('Yes, go ahead.', [pendingApproval.action])}>Approve</button>
            <button className="secondary" onClick={() => setPendingApproval(null)}>
              No
            </button>
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
          <button onClick={() => send(input)} disabled={busy || !configured}>
            {busy ? 'Working…' : 'Send'}
          </button>
          <span className="meta">⌘/Ctrl + Enter</span>
        </div>
      </div>

      <div ref={bottom} />
    </div>
  );
}
