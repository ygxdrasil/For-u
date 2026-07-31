/**
 * The dashboard. Everything that is live, in one screen.
 *
 * Ordered by what you would want to know first if you had been away: is
 * anything new, is it costing more than it should, and is anything broken.
 */

import React, { useState } from 'react';
import { api, money, ago } from '../api.js';
import { Stat, Pill, StrengthBar, Meter, Bars, Distribution, Feed, BuildPill, Empty, Banner } from '../components.jsx';

export default function Dashboard({ data, refresh, busy }) {
  const [running, setRunning] = useState(false);
  const [sweep, setSweep] = useState(null);

  if (!data) return <Empty>Waiting for the first poll…</Empty>;

  const h = data.headline ?? {};
  const m = data.money ?? {};

  const runSweep = async () => {
    setRunning(true);
    setSweep(null);
    const res = await api.cronRun({ limit: 2 });
    setRunning(false);
    setSweep(res.ok ? res.data : { error: res.error });
    refresh();
  };

  return (
    <>
      <div className="head">
        <div>
          <h2>Dashboard</h2>
          <p>
            {h.realOpenings > 0
              ? `${h.realOpenings} finding${h.realOpenings === 1 ? '' : 's'} where money is moving and buyers are unhappy. That is the shape worth building into.`
              : 'No level-4 openings yet. Everything below is either a hypothesis or still being established.'}
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button onClick={refresh} disabled={busy} className="small">
            Refresh
          </button>
          <button onClick={runSweep} disabled={running} className="primary small">
            {running ? 'Running…' : `Run due watches (${h.watchesDue ?? 0})`}
          </button>
        </div>
      </div>

      {sweep?.error ? <Banner title="Sweep failed">{sweep.error}</Banner> : null}
      {sweep && !sweep.error ? (
        <Banner tone={sweep.reported?.length ? '' : 'info'} title={sweep.reported?.length ? `${sweep.reported.length} new or changed` : 'Nothing new'}>
          {sweep.reported?.length
            ? sweep.reported.map((r) => `${r.watch}: ${r.oneLine} (level ${r.strength}, ${r.kind})`).join(' · ')
            : `Ran ${sweep.ran?.length ?? 0} watch(es) and none had anything new to say. That is the system working — a watch that repeats itself gets muted.`}
        </Banner>
      ) : null}

      <div className="grid g4">
        <Stat n={h.realOpenings ?? 0} label="real openings (level 4+)" tone="red" title="Paying and complaining, or better." />
        <Stat n={h.activeFindings ?? 0} label="active findings" />
        <Stat n={h.buildable ?? 0} label="Jason can build" tone={h.buildable ? '' : 'muted'} />
        <Stat n={money(m.monthToDateUsd ?? 0, 2)} label={`spent of ${money(m.capUsd ?? 10, 2)} this month`} tone="muted" />
      </div>

      <div className="spacer" />

      <div className="grid g21">
        <div className="card">
          <h3>Live activity</h3>
          <Feed events={data.activity} empty="Nothing has happened yet. Create a watch and run it." />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <h3>Budget</h3>
            <Meter value={m.monthToDateUsd ?? 0} max={m.capUsd ?? 10} />
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
              <span className="small muted">{money(m.headroomUsd ?? 0)} left</span>
              <span className="small mono muted">
                {m.searchesToday ?? 0}/1500 free searches today
              </span>
            </div>
            <div style={{ marginTop: 12 }}>
              <Bars series={m.series ?? []} />
              <div className="small muted" style={{ marginTop: 4 }}>
                last 14 days
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Evidence strength</h3>
            <Distribution rows={data.strengthDistribution ?? []} />
            <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
              {h.hypotheses ?? 0} below level 3 — nothing is being paid for in those, so they are hypotheses.
            </p>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="grid g2">
        <div className="card">
          <h3>Strongest findings</h3>
          {data.topFindings?.length ? (
            <div className="list">
              {data.topFindings.slice(0, 7).map((f) => (
                <a className="item rowbtn" key={f.id} href={`#findings/${encodeURIComponent(f.id)}`} style={{ color: 'inherit' }}>
                  <span>
                    <span className="t">{f.oneLine}</span>
                    <span className="s">{f.whoHasIt}</span>
                  </span>
                  <span className="r">
                    <BuildPill verdict={f.buildable} />
                    <StrengthBar level={f.strength} />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <Empty>No findings yet.</Empty>
          )}
        </div>

        <div className="card">
          <h3>Watches</h3>
          {data.watches?.length ? (
            <div className="list">
              {data.watches.slice(0, 7).map((w) => (
                <div className="item" key={w.id}>
                  <span>
                    <span className="t">{w.name}</span>
                    <span className="s">
                      {w.cadenceLabel} · {w.runCount} run{w.runCount === 1 ? '' : 's'} · {w.reportedCount} reported ·{' '}
                      {w.lastRunAt ? ago(w.lastRunAt) : 'never run'}
                    </span>
                  </span>
                  <span className="r">
                    {w.due ? <Pill tone="red">due</Pill> : null}
                    <Pill mono>{money(w.costUsd)}</Pill>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              No watches yet. <a href="#watches">Create one</a> — standing watches are her main job.
            </Empty>
          )}
        </div>
      </div>

      {data.stale?.length ? (
        <>
          <div className="spacer" />
          <div className="card">
            <h3>Needs re-checking</h3>
            <p className="small muted" style={{ marginTop: -4 }}>
              Older than {data.reverifyAfterDays} days. Demand decays — something true in March may be crowded by June, and a
              stale finding handed to Jason is worse than none.
            </p>
            <div className="list">
              {data.stale.map((f) => (
                <a className="item rowbtn" key={f.id} href={`#findings/${encodeURIComponent(f.id)}`} style={{ color: 'inherit' }}>
                  <span>
                    <span className="t">{f.oneLine}</span>
                    <span className="s">last verified {ago(f.lastVerifiedAt)}</span>
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
