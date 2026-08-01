/**
 * Watches — the standing jobs. Creating one, running one, and seeing what each
 * costs against what it has actually reported.
 *
 * The cost-per-report column is the point of this page: it is how you find the
 * watch that runs every morning, spends money, and has told you nothing since
 * March.
 */

import React, { useEffect, useState } from 'react';
import { api, money, ago } from '../api.js';
import { Pill, Empty, Banner, StrengthBar } from '../components.jsx';

export default function Watches({ data, refresh }) {
  const [state, setState] = useState({ watches: [], cadences: [], depths: [], proposals: [] });
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ topic: '', name: '', cadence: 'daily', depth: '' });
  const [busyId, setBusyId] = useState(null);
  const [outcome, setOutcome] = useState(null);

  const load = async () => {
    const res = await api.watches();
    if (res.ok) {
      setState(res.data);
      setError(null);
    } else setError(res.error);
  };

  useEffect(() => {
    load();
  }, [data?.at]);

  const create = async (ev) => {
    ev.preventDefault();
    if (!form.topic.trim()) return;
    const res = await api.watchAction('create', {
      topic: form.topic.trim(),
      name: form.name.trim() || form.topic.trim(),
      cadence: form.cadence,
      depth: form.depth || null,
    });
    if (res.ok) {
      setForm({ topic: '', name: '', cadence: 'daily', depth: '' });
      await load();
      refresh?.();
    } else setError(res.error);
  };

  const run = async (id) => {
    setBusyId(id);
    setOutcome(null);
    const res = await api.watchAction('run', { id });
    setBusyId(null);
    setOutcome(res.ok ? res.data : { error: res.error });
    await load();
    refresh?.();
  };

  const exploreNow = async () => {
    setBusyId('explore');
    setOutcome(null);
    const res = await api.command({ text: 'explore', confirm: true });
    setBusyId(null);
    setOutcome(res.ok ? { ...res.data, exploring: true } : { error: res.error });
    await load();
    refresh?.();
  };

  const decide = async (action, id) => {
    setBusyId(id);
    await api.watchAction(action, { id });
    setBusyId(null);
    await load();
    refresh?.();
  };

  const toggle = async (w) => {
    await api.watchAction(w.state === 'active' ? 'pause' : 'resume', { id: w.id });
    await load();
    refresh?.();
  };

  return (
    <>
      <div className="head">
        <div>
          <h2>Watches</h2>
          <p>
            Standing watches are the main job; one-off questions are the exception. A watch only speaks when something is
            new or has changed — silence means it looked and nothing moved.
          </p>
        </div>
      </div>

      {error ? <Banner title="Problem">{error}</Banner> : null}

      {outcome?.error ? <Banner title="Run failed">{outcome.error}</Banner> : null}
      {outcome && !outcome.error ? (
        <Banner tone={outcome.reported ? '' : 'info'} title={outcome.reported ? 'Something to report' : 'Nothing new'}>
          {outcome.reason}
          {outcome.finding ? (
            <>
              {' — '}
              <a href={`#findings/${encodeURIComponent(outcome.finding.id)}`}>{outcome.finding.demand.oneLine}</a>
            </>
          ) : null}
          {outcome.notes?.length ? <div className="small" style={{ marginTop: 6 }}>{outcome.notes.join(' · ')}</div> : null}
          {outcome.depth ? (
            <div className="small muted" style={{ marginTop: 4 }}>
              depth {outcome.depth.level}: {outcome.depth.reasoning} — {money(outcome.costUsd ?? 0)}
            </div>
          ) : null}
        </Banner>
      ) : null}

      {state.proposals?.length ? (
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>She found these on her own ({state.proposals.length})</h3>
          <p className="small muted" style={{ marginTop: -4 }}>
            Proposed, not watched. Nothing here is running or costing anything until you approve it — she looks on her own,
            but she does not decide what is worth your money.
          </p>
          {state.proposals.map((p) => (
            <div className="proposal" key={p.id}>
              <div className="topic">{p.topic}</div>
              <div className="who">{p.whoSeemsToHaveIt}</div>
              <div className="why">{p.why}</div>
              {p.quotes?.length ? (
                <div style={{ marginTop: 8 }}>
                  {p.quotes.slice(0, 2).map((q, i) => (
                    <blockquote className="quote" key={i}>
                      “{q.quote.slice(0, 220)}”
                      <cite>
                        <a href={q.url} target="_blank" rel="noopener noreferrer nofollow">
                          the post that suggested it
                        </a>
                      </cite>
                    </blockquote>
                  ))}
                </div>
              ) : null}
              <div className="row" style={{ marginTop: 10, gap: 6 }}>
                <Pill tone={p.confidence === 'high' ? 'ok' : p.confidence === 'medium' ? 'warn' : ''}>{p.confidence} confidence</Pill>
                <button className="primary small" onClick={() => decide('approve-proposal', p.id)} disabled={busyId === p.id}>
                  Watch this weekly
                </button>
                <button className="small" onClick={() => decide('dismiss-proposal', p.id)} disabled={busyId === p.id}>
                  Not interested
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="card" style={{ marginBottom: 14 }}>
        <h3>New watch</h3>
        <form onSubmit={create}>
          <div className="row">
            <div className="field" style={{ flex: 2 }}>
              <label>What should she watch?</label>
              <input
                type="text"
                value={form.topic}
                placeholder="e.g. bookkeeping tools for UK tradespeople"
                onChange={(ev) => setForm({ ...form, topic: ev.target.value })}
              />
            </div>
            <div className="field">
              <label>Cadence</label>
              <select value={form.cadence} onChange={(ev) => setForm({ ...form, cadence: ev.target.value })}>
                {(state.cadences ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Depth</label>
              <select value={form.depth} onChange={(ev) => setForm({ ...form, depth: ev.target.value })}>
                <option value="">she decides</option>
                {(state.depths ?? []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <button className="primary" type="submit">
              Create
            </button>
          </div>
        </form>
        <div className="row" style={{ marginTop: 10, alignItems: 'center', gap: 10 }}>
          <button onClick={exploreNow} disabled={busyId === 'explore'}>
            {busyId === 'explore' ? 'Looking…' : 'Or let her go looking'}
          </button>
          <span className="small muted">
            She reads the free community sources for recurring needs and proposes what to watch. Reading costs nothing; the
            one judgement call is a fraction of a penny.
          </span>
        </div>
        <p className="small muted" style={{ marginBottom: 0, marginTop: 10 }}>
          Leave depth on "she decides" unless you have a reason. She starts cheap and escalates when the signals earn it —
          and writes down why.
        </p>
      </div>

      <div className="card">
        <h3>Standing watches</h3>
        {state.watches?.length ? (
          <table>
            <thead>
              <tr>
                <th>Watch</th>
                <th>Cadence</th>
                <th>Last run</th>
                <th className="num">Runs</th>
                <th className="num">Reported</th>
                <th className="num">Cost</th>
                <th className="num">Per report</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.watches.map((w) => (
                <tr key={w.id}>
                  <td>
                    <strong>{w.name}</strong>
                    <div className="small muted">{w.topic}</div>
                    <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                      {w.state !== 'active' ? <Pill tone="warn">{w.state}</Pill> : null}
                      {w.due ? <Pill tone="red">due</Pill> : null}
                      {w.lastStatus ? <Pill>{w.lastStatus}</Pill> : null}
                      {w.roaming ? <Pill>roaming</Pill> : null}
                    </div>
                  </td>
                  <td className="small">{w.cadenceLabel}</td>
                  <td className="small">{w.lastRunAt ? ago(w.lastRunAt) : 'never'}</td>
                  <td className="num">{w.runCount}</td>
                  <td className="num">{w.reportedCount}</td>
                  <td className="num">{money(w.costUsd, 3)}</td>
                  <td className="num">{w.reportedCount ? money(w.costUsd / w.reportedCount, 3) : '—'}</td>
                  <td className="right nowrap">
                    <button className="small" onClick={() => run(w.id)} disabled={busyId === w.id}>
                      {busyId === w.id ? 'Running…' : 'Run'}
                    </button>{' '}
                    <button className="small" onClick={() => toggle(w)}>
                      {w.state === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No watches yet. Create one above.</Empty>
        )}
      </div>

      {data?.topFindings?.length ? (
        <>
          <div className="spacer" />
          <div className="card">
            <h3>What the watches have turned up</h3>
            <div className="list">
              {data.topFindings.slice(0, 6).map((f) => (
                <a className="item rowbtn" key={f.id} href={`#findings/${encodeURIComponent(f.id)}`} style={{ color: 'inherit' }}>
                  <span>
                    <span className="t">{f.oneLine}</span>
                    <span className="s">verified {ago(f.lastVerifiedAt)}</span>
                  </span>
                  <StrengthBar level={f.strength} />
                </a>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
