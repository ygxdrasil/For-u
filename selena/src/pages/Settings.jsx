/**
 * Settings — what is configured, what is missing, and the token.
 *
 * The token lives in this browser only and is never sent anywhere except back
 * to Selena's own API. Rotation is here rather than in a runbook, because a
 * rotate button you have to build later is a rotate button that does not exist.
 */

import React, { useEffect, useState } from 'react';
import { api, getToken, setToken, ago } from '../api.js';
import { Pill, Empty, Banner } from '../components.jsx';

function Flag({ on, label, why }) {
  return (
    <div className="item">
      <span>
        <span className="t">{label}</span>
        {why ? <span className="s">{why}</span> : null}
      </span>
      <Pill tone={on ? 'ok' : 'warn'}>{on ? 'set' : 'not set'}</Pill>
    </div>
  );
}

export default function Settings({ data, auth, refreshAuth }) {
  const [token, setTokenState] = useState(getToken());
  const [health, setHealth] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [minted, setMinted] = useState(null);
  const [error, setError] = useState(null);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState(null);

  const changePassword = async () => {
    setPwBusy(true);
    setPwMessage(null);
    const res = await api.authChange({ currentPassword: current, newPassword: next });
    setPwBusy(false);
    if (res.ok) {
      setCurrent('');
      setNext('');
      setPwMessage({ tone: '', title: 'Changed', body: 'Every other browser has been signed out. This one stays signed in.' });
      refreshAuth?.();
    } else {
      setPwMessage({ tone: 'warn', title: 'Not changed', body: res.error });
    }
  };

  const signOut = async () => {
    await api.authLogout();
    window.location.reload();
  };

  useEffect(() => {
    api.health().then((res) => (res.ok ? setHealth(res.data) : setError(res.error)));
    api.tokens().then((res) => (res.ok ? setTokens(res.data.tokens) : null));
  }, []);

  const save = () => {
    setToken(token.trim());
    window.location.reload();
  };

  const mint = async () => {
    const res = await api.tokenAction('mint', { label: 'jason' });
    if (res.ok) {
      setMinted(res.data);
      const list = await api.tokens();
      if (list.ok) setTokens(list.data.tokens);
    } else setError(res.error);
  };

  const retire = async (id) => {
    await api.tokenAction('retire', { id });
    const list = await api.tokens();
    if (list.ok) setTokens(list.data.tokens);
  };

  const env = health?.serverEnv ?? {};

  return (
    <>
      <div className="head">
        <div>
          <h2>Settings</h2>
          <p>What the server has, what it is missing, and which build is actually live.</p>
        </div>
      </div>

      {error ? <Banner title="Problem">{error}</Banner> : null}

      <div className="grid g2">
        <div className="card">
          <h3>Your sign-in</h3>
          <p className="small muted" style={{ marginTop: -4 }}>
            You are signed in on this browser for {auth?.sessionDays ?? 180} days. Changing the password signs every other
            browser out, which is the only thing that makes changing it worth doing.
          </p>

          <div className="field">
            <label>Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          </div>

          {pwMessage ? <Banner tone={pwMessage.tone} title={pwMessage.title}>{pwMessage.body}</Banner> : null}

          <div className="row">
            <button className="primary" onClick={changePassword} disabled={pwBusy || !current || !next}>
              {pwBusy ? 'Changing…' : 'Change password'}
            </button>
            <button onClick={signOut}>Sign out</button>
          </div>

          <details className="raw">
            <summary>Advanced: a bearer token for this browser</summary>
            <p className="small muted">
              Not needed. The sign-in cookie is what the HUD uses. This exists only if you want this browser to
              authenticate as Jason does — for instance to try an endpoint by hand.
            </p>
            <div className="field">
              <input type="password" value={token} onChange={(ev) => setTokenState(ev.target.value)} placeholder="sel_…" />
            </div>
            <div className="row">
              <button className="small" onClick={save}>
                Save and reload
              </button>
              <button
                className="small"
                onClick={() => {
                  setToken('');
                  setTokenState('');
                  window.location.reload();
                }}
              >
                Clear
              </button>
            </div>
          </details>
        </div>

        <Keys auth={auth} refreshAuth={refreshAuth} />

        <div className="card">
          <h3>Server configuration</h3>
          <div className="list">
            <Flag on={env.hasGeminiKey} label="GEMINI_API_KEY" why="without it she cannot read anything, and will not invent findings instead" />
            <Flag on={env.hasDatabaseUrl} label="DATABASE_URL" why="without it nothing is saved between cold starts" />
            <Flag on={env.hasSelenaToken} label="SELENA_TOKEN" why="without it this API answers anyone who finds the URL" />
            <Flag on={env.hasEtsyKey} label="ETSY_API_KEY" why="the strongest evidence source; optional, and dark without it" />
            <Flag on={env.hasJasonEndpoint} label="JASON_ENDPOINT" why="where handoff packets are POSTed; without it they are prepared but not sent" />
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>
            Monthly cap: ${env.monthlyCapUsd ?? 10}. Change it with MONTHLY_USD_CAP.
          </p>
        </div>
      </div>

      <div className="spacer" />

      <div className="grid g2">
        <div className="card">
          <h3>Build</h3>
          <dl className="kv">
            <dt>Frontend build</dt>
            <dd className="mono small wrapline">{data?.build?.buildId ?? '—'}</dd>
            <dt>Server build</dt>
            <dd className="mono small wrapline">{health?.build?.buildId ?? '—'}</dd>
            <dt>Match</dt>
            <dd>
              {health?.build?.buildId && data?.build?.buildId ? (
                health.build.buildId === data.build.buildId ? (
                  <Pill tone="ok">same deploy</Pill>
                ) : (
                  <Pill tone="red">one half is stale</Pill>
                )
              ) : (
                <Pill tone="warn">unknown</Pill>
              )}
            </dd>
            <dt>Built at</dt>
            <dd className="small">{health?.build?.builtAt ? ago(health.build.builtAt) : '—'}</dd>
            <dt>Commit</dt>
            <dd className="mono small">{health?.build?.commit ?? '—'}</dd>
            <dt>Storage</dt>
            <dd className="small">
              {health?.store?.kind} {health?.store?.durable ? '(durable)' : '(in memory)'}
            </dd>
          </dl>
          <p className="small muted" style={{ marginTop: 8 }}>
            A server-only change leaves the frontend bundle byte-identical, so these two ids are the only way to tell a
            live deploy from a stale one.
          </p>
        </div>

        <div className="card">
          <h3>Tokens for Jason</h3>
          <p className="small muted" style={{ marginTop: -4 }}>
            Two can be live at once, so Jason can be moved across before the old one is retired. Retiring marks a token
            dead; it does not erase the record that it existed.
          </p>
          {minted ? (
            <Banner title="New token — shown once">
              <code className="mono wrapline">{minted.token}</code>
              {minted.warning ? <div className="small" style={{ marginTop: 6 }}>{minted.warning}</div> : null}
            </Banner>
          ) : null}
          {tokens === null ? (
            <Empty>Needs the bootstrap SELENA_TOKEN to list.</Empty>
          ) : tokens.length ? (
            <div className="list">
              {tokens.map((t) => (
                <div className="item" key={t.id}>
                  <span>
                    <span className="t mono small">{t.id}</span>
                    <span className="s">
                      {t.label ?? 'no label'} · created {ago(t.createdAt)}
                    </span>
                  </span>
                  <span className="r">
                    {t.live ? <Pill tone="ok">live</Pill> : <Pill>retired {ago(t.retiredAt)}</Pill>}
                    {t.live ? (
                      <button className="small" onClick={() => retire(t.id)}>
                        Retire
                      </button>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty>None minted yet.</Empty>
          )}
          <div style={{ marginTop: 10 }}>
            <button onClick={mint}>Mint a token</button>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="card">
        <h3>Jason's seam</h3>
        <p className="small">Two endpoints, both token-authed. This is everything he needs.</p>
        <pre style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 8, padding: 11, fontSize: 11.5, overflowX: 'auto' }}>
{`POST /api/research
  { "topic": "...", "depth": "dig" }
  -> { finding: <the full schema>, notes, costUsd, sourcesRead }

POST /api/ask
  { "question": "...", "mode": "auto" }
  -> { answer, confidence, basedOn: [urls], unknowns: [...] }

Authorization: Bearer <token>`}
        </pre>
      </div>
    </>
  );
}

/**
 * Keys you can paste, instead of keys you have to redeploy for.
 *
 * Getting an Etsy keystring approved and then having to open a dashboard, add
 * an environment variable and wait for a rebuild is three steps too many, and
 * none of them happens where you are standing when the key arrives.
 *
 * Three rules, all visible on screen:
 *   - the environment always wins, and says so when it does
 *   - a value goes in and never comes back; only the last four characters do
 *   - Test makes a real call to the real service before you save, because a
 *     403 next Tuesday is a terrible way to find out you pasted half of it
 */
function Keys({ auth, refreshAuth }) {
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});

  const keys = auth?.keys ?? [];
  if (!keys.length) return null;

  const act = async (action, name, extra = {}) => {
    setBusy(name + action);
    setError(null);
    const res = await api.keyAction(action, { name, ...extra });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    if (res.data.result) setResults({ ...results, [name]: res.data.result });
    else {
      setResults({ ...results, [name]: null });
      setValues({ ...values, [name]: '' });
      await refreshAuth?.();
    }
  };

  return (
    <div className="card">
      <h3>Keys</h3>
      <p className="small muted" style={{ marginTop: -4 }}>
        Paste a key here and she uses it on the next run — no redeploy. Anything set in the environment wins over
        anything typed here, and says so. Values are encrypted before they are stored and never sent back to this page.
      </p>

      {error ? <p className="small" style={{ color: 'var(--warn)' }}>{error}</p> : null}

      {keys.map((k) => {
        const fromEnv = k.source === 'environment';
        const result = results[k.name];
        return (
          <div className="peer" key={k.name} style={{ marginTop: 10 }}>
            <div className="top">
              <span>
                <span className="name">{k.label}</span>{' '}
                {k.set ? <Pill tone="ok">set</Pill> : <Pill tone="warn">not set</Pill>}{' '}
                {k.source ? <Pill>{fromEnv ? 'from the environment' : 'pasted here'}</Pill> : null}{' '}
                {k.fingerprint ? <span className="mono small muted">{k.fingerprint}</span> : null}
              </span>
              {k.set && !fromEnv ? (
                <button className="small" onClick={() => act('clear', k.name)} disabled={busy === k.name + 'clear'}>
                  Forget it
                </button>
              ) : null}
            </div>

            <div className="small" style={{ marginTop: 4 }}>{k.why}</div>

            {k.alsoStored ? (
              <div className="small" style={{ color: 'var(--warn)', marginTop: 6 }}>
                There is also one stored here, and it is being ignored — the environment wins. Remove {k.name} there if
                you meant to use the pasted one.
              </div>
            ) : null}

            {fromEnv ? (
              <div className="small muted" style={{ marginTop: 6 }}>
                Set as <code className="mono">{k.name}</code> in the environment. Change it there.
              </div>
            ) : (
              <>
                <div className="row" style={{ marginTop: 8 }}>
                  <div className="field" style={{ flex: 2 }}>
                    <label>{k.format}</label>
                    <input
                      type="password"
                      value={values[k.name] ?? ''}
                      placeholder={k.hint}
                      onChange={(e) => setValues({ ...values, [k.name]: e.target.value })}
                      spellCheck="false"
                      autoComplete="off"
                    />
                  </div>
                  <button onClick={() => act('test', k.name, { value: (values[k.name] ?? '').trim() })} disabled={busy || !(values[k.name] ?? '').trim()}>
                    {busy === k.name + 'test' ? 'Checking…' : 'Test it'}
                  </button>
                  <button className="primary" onClick={() => act('set', k.name, { value: (values[k.name] ?? '').trim() })} disabled={busy || !(values[k.name] ?? '').trim()}>
                    {busy === k.name + 'set' ? 'Saving…' : 'Save'}
                  </button>
                </div>
                {k.where ? (
                  <div className="small muted">
                    Get one at <code className="mono">{k.where}</code>
                  </div>
                ) : null}
              </>
            )}

            {result ? (
              <div className="verdict" style={{ marginTop: 8 }}>
                <Pill tone={result.ok === true ? 'ok' : result.ok === false ? 'warn' : ''}>{result.verdict}</Pill>{' '}
                {result.detail ? <span className="small">{result.detail}</span> : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
