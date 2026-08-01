/**
 * Connections — the other agents she can reach, and proof that she can.
 *
 * "Connected" is a claim, and it has to be earned by something on the other
 * end answering in the shape it promised. So a test shows what the peer
 * actually said, and a 200 from a login page is reported as reaching a web
 * page rather than as success.
 *
 * Nothing is ever sent without you pressing something.
 */

import React, { useEffect, useState } from 'react';
import { api, ago } from '../api.js';
import { Pill, Empty, Banner } from '../components.jsx';

export default function Connections({ data }) {
  const [state, setState] = useState({ peers: [], kinds: [], envJason: null });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);
  const [results, setResults] = useState({});
  const [form, setForm] = useState({ name: '', kind: 'builder', url: '', token: '' });

  const load = async () => {
    const res = await api.peers();
    if (res.ok) {
      setState(res.data);
      setError(null);
    } else setError(res.error);
  };

  useEffect(() => {
    load();
  }, [data?.at]);

  const add = async (ev) => {
    ev.preventDefault();
    if (!form.url.trim()) return;
    setBusy('add');
    const res = await api.peerAction('add', {
      name: form.name.trim() || form.kind,
      kind: form.kind,
      url: form.url.trim(),
      token: form.token.trim() || null,
    });
    setBusy(null);
    if (res.ok) {
      setForm({ name: '', kind: 'builder', url: '', token: '' });
      await load();
    } else setError(res.error);
  };

  const act = async (action, id) => {
    setBusy(id + action);
    const res = await api.peerAction(action, { id, message: action === 'send' ? 'Selena here. Nothing to report — just saying hello.' : undefined });
    setBusy(null);
    if (res.ok) {
      setResults({ ...results, [id]: res.data.result ?? null });
      await load();
    } else setError(res.error);
  };

  const kindOf = (id) => state.kinds.find((k) => k.id === id);

  return (
    <>
      <div className="head">
        <div>
          <h2>Connections</h2>
          <p>
            Jason builds what she finds. Grace speaks. Both are separate deployments with their own tokens, so connecting
            means storing where they are and proving the line works — never assuming it from a status code.
          </p>
        </div>
      </div>

      {error ? <Banner title="Problem">{error}</Banner> : null}

      {state.envJason?.endpoint ? (
        <Banner tone="info" title="Jason is also wired up through the environment">
          <code className="mono small">JASON_ENDPOINT={state.envJason.endpoint}</code>
          {state.envJason.hasToken ? ' with a token' : ' with no token'}. Handing a finding over uses that, and it carries
          the full evidence packet rather than a message. Adding him below as a peer is for sending him plain text.
        </Banner>
      ) : null}

      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Connect something</h3>
        <form onSubmit={add}>
          <div className="row">
            <div className="field" style={{ maxWidth: 190 }}>
              <label>What is it?</label>
              <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
                {state.kinds.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ maxWidth: 170 }}>
              <label>Name it</label>
              <input type="text" value={form.name} placeholder="Jason" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field" style={{ flex: 2 }}>
              <label>Its URL</label>
              <input type="text" value={form.url} placeholder="https://jason.vercel.app" onChange={(e) => setForm({ ...form, url: e.target.value })} spellCheck="false" />
            </div>
            <div className="field">
              <label>Its token</label>
              <input type="password" value={form.token} placeholder="optional" onChange={(e) => setForm({ ...form, token: e.target.value })} />
            </div>
            <button className="primary" type="submit" disabled={busy === 'add' || !form.url.trim()}>
              {busy === 'add' ? 'Saving…' : 'Connect'}
            </button>
          </div>
        </form>
        {kindOf(form.kind) ? (
          <p className="small muted" style={{ marginBottom: 0 }}>
            {kindOf(form.kind).note}
          </p>
        ) : null}
        <p className="small muted" style={{ marginTop: 6, marginBottom: 0 }}>
          The token is encrypted before it is stored — it is somebody else's credential, and a database dump should not be
          a working key to another system.
        </p>
      </div>

      {state.peers.length === 0 ? (
        <Empty>Nothing connected yet.</Empty>
      ) : (
        state.peers.map((p) => {
          const result = results[p.id] ?? p.lastResult;
          return (
            <div className="peer" key={p.id}>
              <div className="top">
                <span>
                  <span className="name">{p.name}</span>{' '}
                  <Pill>{kindOf(p.kind)?.label ?? p.kind}</Pill>{' '}
                  {p.hasToken ? <Pill tone="ok">token stored</Pill> : <Pill tone="warn">no token</Pill>}
                </span>
                <span className="r" style={{ display: 'flex', gap: 6 }}>
                  <button className="small" onClick={() => act('test', p.id)} disabled={busy === p.id + 'test'}>
                    {busy === p.id + 'test' ? 'Testing…' : 'Test'}
                  </button>
                  <button className="small" onClick={() => act('send', p.id)} disabled={busy === p.id + 'send'}>
                    Say hello
                  </button>
                  <button className="small" onClick={() => act('retire', p.id)}>
                    Retire
                  </button>
                </span>
              </div>
              <div className="url">{p.url}</div>

              {result ? (
                <>
                  <div className="verdict">
                    <Pill tone={result.ok ? 'ok' : result.reachedSomething ? 'warn' : 'red'}>
                      {result.verdict ?? (result.ok ? 'connected' : 'no answer')}
                    </Pill>{' '}
                    {result.status ? <span className="mono small muted">HTTP {result.status}</span> : null}{' '}
                    {p.lastTestedAt ? <span className="small muted">· {ago(p.lastTestedAt)}</span> : null}
                  </div>
                  {result.reply ? (
                    <div className="small" style={{ marginTop: 6 }}>
                      It said: “{String(result.reply).slice(0, 240)}”
                    </div>
                  ) : null}
                  <pre>{String(result.detail ?? '').slice(0, 500) || 'no body'}</pre>
                </>
              ) : (
                <div className="verdict small muted">Never tested. Press test — it sends one harmless line and reports what comes back.</div>
              )}
            </div>
          );
        })
      )}

      <div className="spacer" />

      <div className="card">
        <h3>What she will not do</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
          <li>Send anything to a peer on her own. Every message here is one you pressed.</li>
          <li>Treat a 200 as proof. What came back is shown so you can see you reached the right thing.</li>
          <li>Store a token in the clear. They are sealed with the same secret that signs your sign-in.</li>
        </ul>
      </div>
    </>
  );
}
