/**
 * Costs — metered from real usage, not estimated.
 *
 * The per-watch table answers the only question that matters here: which
 * watches earn their keep. A watch that has spent money and reported nothing
 * for weeks should be obvious at a glance and easy to kill.
 */

import React from 'react';
import { money, ago } from '../api.js';
import { Stat, Meter, Bars, Pill, Empty } from '../components.jsx';

export default function Costs({ data }) {
  if (!data) return <Empty>Waiting for the first poll…</Empty>;

  const m = data.money ?? {};
  const runs = data.runs ?? [];

  return (
    <>
      <div className="head">
        <div>
          <h2>Costs</h2>
          <p>
            Metered from actual reported usage, and checked before each request rather than after. Prices were read from
            the provider's own pricing page on {m.pricesCheckedOn ?? '—'}, not recalled.
          </p>
        </div>
      </div>

      <div className="grid g4">
        <Stat n={money(m.monthToDateUsd ?? 0, 3)} label={`spent in ${m.month ?? 'this month'}`} tone="red" />
        <Stat n={money(m.headroomUsd ?? 0, 3)} label="left before the hard stop" />
        <Stat n={m.searchesToday ?? 0} label="grounded searches today (1,500 free)" tone="muted" />
        <Stat n={m.searchesThisMonth ?? 0} label="searches this month" tone="muted" />
      </div>

      <div className="spacer" />

      <div className="grid g2">
        <div className="card">
          <h3>Against the cap</h3>
          <Meter value={m.monthToDateUsd ?? 0} max={m.capUsd ?? 10} />
          <p className="small muted" style={{ marginTop: 8 }}>
            The cap is {money(m.capUsd ?? 10, 2)}. When a run would cross it, it stops mid-dig, keeps everything already
            verified, and files the finding marked "stopped at budget" — partial work is not thrown away.
          </p>
        </div>
        <div className="card">
          <h3>Daily spend</h3>
          <Bars series={m.series ?? []} />
          <p className="small muted" style={{ marginTop: 6 }}>
            Last 14 days. Grounded search is billed per request with a free daily allowance, so most days should read zero
            until the allowance runs out.
          </p>
        </div>
      </div>

      <div className="spacer" />

      <div className="card">
        <h3>Cost per watch</h3>
        {m.byWatch?.length ? (
          <table>
            <thead>
              <tr>
                <th>Watch</th>
                <th className="num">Spent</th>
                <th className="num">Runs</th>
                <th className="num">Reported</th>
                <th className="num">Per report</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {m.byWatch.map((row) => {
                const wasteful = row.usd > 0.05 && !row.reports;
                return (
                  <tr key={row.label}>
                    <td>{row.name}</td>
                    <td className="num">{money(row.usd, 4)}</td>
                    <td className="num">{row.runs ?? '—'}</td>
                    <td className="num">{row.reports ?? '—'}</td>
                    <td className="num">{row.usdPerReport !== null ? money(row.usdPerReport, 4) : '—'}</td>
                    <td>
                      {wasteful ? (
                        <Pill tone="red">spending, reporting nothing</Pill>
                      ) : row.reports ? (
                        <Pill tone="ok">earning its keep</Pill>
                      ) : (
                        <Pill>too early to say</Pill>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty>Nothing has been spent yet.</Empty>
        )}
      </div>

      <div className="spacer" />

      <div className="card">
        <h3>Recent runs</h3>
        {runs.length ? (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Depth, and why</th>
                <th className="num">Sources</th>
                <th className="num">Cost</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td className="small nowrap">{ago(r.at)}</td>
                  <td className="small">{r.topic}</td>
                  <td>
                    <Pill tone={r.status === 'found' ? 'ok' : r.status === 'failed' ? 'red' : 'warn'}>{r.status}</Pill>
                    {r.stoppedEarly ? <Pill tone="warn">stopped early</Pill> : null}
                  </td>
                  <td className="small">
                    <strong>{r.depth}</strong>
                    <div className="muted">{r.depthReasoning}</div>
                  </td>
                  <td className="num">{r.sourcesRead}</td>
                  <td className="num">{money(r.costUsd, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No runs yet.</Empty>
        )}
      </div>
    </>
  );
}
