/**
 * Findings: the list, and the detail that has to answer every question without
 * another round of research.
 *
 * The detail view is deliberately dense. If it cannot tell you who has the
 * problem, what they pay, what the incumbents get wrong and what would make
 * this a bad idea, the research was not finished — so the page shows the gaps
 * as gaps rather than hiding them.
 */

import React, { useEffect, useState } from 'react';
import { api, money, ago } from '../api.js';
import { Pill, StrengthBar, Ladder, BuildPill, Empty, Banner, SourceLink } from '../components.jsx';
import Reach from '../Reach.jsx';

function Detail({ id, onBack, refresh }) {
  const [finding, setFinding] = useState(null);
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);
  const [working, setWorking] = useState(null);

  const load = async () => {
    const res = await api.finding(id);
    if (res.ok) {
      setFinding(res.data.finding);
      setVersions(res.data.versions ?? []);
      setError(null);
    } else setError(res.error);
  };

  useEffect(() => {
    load();
  }, [id]);

  const act = async (action, payload = {}) => {
    setWorking(action);
    const res = await api.findingAction(action, { id, ...payload });
    setWorking(null);
    if (!res.ok) setError(res.error);
    else {
      await load();
      refresh?.();
    }
  };

  if (error) return <Banner title="Could not load that finding">{error}</Banner>;
  if (!finding) return <Empty>Loading…</Empty>;

  const e = finding.evidence;

  return (
    <>
      <div className="head">
        <div>
          <button className="small" onClick={onBack}>
            ← All findings
          </button>
          <h2 style={{ marginTop: 10 }}>{finding.demand.oneLine}</h2>
          <p>{finding.demand.whoHasIt}</p>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="small" onClick={() => act('reverify')} disabled={working === 'reverify'}>
            {working === 'reverify' ? 'Checking…' : 'Re-verify'}
          </button>
          {finding.status === 'active' ? (
            <button className="small" onClick={() => act('archive')} disabled={working === 'archive'}>
              Archive
            </button>
          ) : (
            <button className="small" onClick={() => act('restore')}>
              Restore
            </button>
          )}
          <a href={`#jason/${encodeURIComponent(finding.id)}`}>
            <button className="primary small">Send to Jason</button>
          </a>
        </div>
      </div>

      <div className="row" style={{ gap: 8, marginBottom: 14 }}>
        <StrengthBar level={e.strength} />
        <Pill tone={e.hypothesis ? 'warn' : 'red'}>
          {e.hypothesis ? 'hypothesis — nothing paid for yet' : `level ${e.strength}`}
        </Pill>
        <BuildPill verdict={finding.buildability?.verdict} confidence={finding.buildability?.confidence} />
        <Pill mono>score {finding.verdict.score}</Pill>
        <Pill mono>{money(finding.depth?.costUsd ?? 0)}</Pill>
        <Pill mono>{finding.depth?.level ?? '—'}</Pill>
        {finding.status !== 'active' ? <Pill tone="warn">{finding.status}</Pill> : null}
        {finding.handedToJasonAt ? <Pill tone="ok">handed to Jason {ago(finding.handedToJasonAt)}</Pill> : null}
      </div>

      {finding.depth?.stoppedEarly ? (
        <Banner tone="warn" title="This run stopped early">
          {finding.depth.stoppedReason} Everything below was verified before it stopped; nothing was filled in afterwards.
        </Banner>
      ) : null}

      {e.readQuality?.thinRead ? (
        <Banner tone="warn" title="Nothing here was read directly">
          Every source is a search snippet rather than a page or an API response. That holds this finding at level 4 at
          most, however well the complaints agree.
        </Banner>
      ) : null}

      <div className="grid g21">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <h3>In their words</h3>
            {e.inTheirWords?.length || finding.demand.inTheirWords?.length ? (
              (finding.demand.inTheirWords ?? []).map((q, i) => (
                <blockquote className="quote" key={i}>
                  “{q.quote}”
                  <cite>
                    <SourceLink url={q.url} /> · {q.platform} {q.date ? `· ${q.date}` : ''}
                  </cite>
                </blockquote>
              ))
            ) : (
              <p className="muted small">Nobody was quoted directly. That is a gap, not a style choice.</p>
            )}
          </div>

          {/* Directly under the quotes, because the people in it ARE the
              quotes — and above the paying table, because "what would they pay
              you" is the question the paying table cannot answer. */}
          <Reach finding={finding} refresh={refresh} />

          <div className="card">
            <h3>What they are already paying</h3>
            {e.paying?.length ? (
              <table>
                <thead>
                  <tr>
                    <th>What</th>
                    <th className="num">Price</th>
                    <th>Does it sell?</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {e.paying.map((p, i) => (
                    <tr key={i}>
                      <td>{p.what}</td>
                      <td className="num">
                        {p.price} {p.currency}
                      </td>
                      <td className="small">
                        {p.salesSignal ? (
                          <>
                            {p.salesSignal}
                            <br />
                            <span className="muted">{p.signalMethod}</span>
                          </>
                        ) : (
                          <span className="muted">not established</span>
                        )}
                      </td>
                      <td>
                        <SourceLink url={p.url} />
                        {p.via === 'etsy-api' ? (
                          <>
                            {' '}
                            <Pill tone="ok">API</Pill>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted small">No priced listing found, so nobody is demonstrably paying for this yet.</p>
            )}
          </div>

          <div className="card">
            <h3>What the existing options get wrong</h3>
            {e.agreement?.subject ? (
              <Banner tone="" title={`${e.agreement.count} complaints agree`}>
                They agree on: <strong>{e.agreement.subject}</strong>. That agreement is what separates an opening from a
                list of unrelated grumbles.
              </Banner>
            ) : null}
            {e.complaints?.length ? (
              e.complaints.map((c, i) => (
                <blockquote className="quote" key={i}>
                  “{c.quote}”
                  <cite>
                    about <strong>{c.aboutWhat}</strong> · <SourceLink url={c.url} /> {c.date ? `· ${c.date}` : ''}
                  </cite>
                </blockquote>
              ))
            ) : (
              <p className="muted small">No complaints found. Money may be moving, but nobody quoted is unhappy.</p>
            )}
          </div>

          {finding.incumbents?.length ? (
            <div className="card">
              <h3>Incumbents</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="num">Price</th>
                    <th>What they get wrong</th>
                  </tr>
                </thead>
                <tbody>
                  {finding.incumbents.map((inc, i) => (
                    <tr key={i}>
                      <td>
                        {inc.name}
                        <br />
                        <SourceLink url={inc.url} />
                      </td>
                      <td className="num">{inc.price ?? '—'}</td>
                      <td className="small">{inc.whatTheyGetWrong}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <h3>Evidence ladder</h3>
            <Ladder ladder={e.ladder} />
          </div>

          <div className="card accent">
            <h3>Risks</h3>
            {finding.risks?.length ? (
              finding.risks.map((r, i) => (
                <div key={i} style={{ marginBottom: 9 }}>
                  <Pill tone={r.severity === 'high' ? 'red' : r.severity === 'medium' ? 'warn' : ''}>{r.severity}</Pill>{' '}
                  <span style={{ fontSize: 13 }}>{r.risk}</span>
                  {r.reasoning ? <div className="small muted">{r.reasoning}</div> : null}
                </div>
              ))
            ) : (
              <p className="muted small">None recorded — which should not be possible; the schema requires them.</p>
            )}
          </div>

          <div className="card">
            <h3>What would win</h3>
            {finding.whatWouldWin?.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                {finding.whatWouldWin.map((w, i) => (
                  <li key={i} style={{ marginBottom: 5 }}>
                    {w.requirement}
                    {w.whyItMatters ? <div className="small muted">{w.whyItMatters}</div> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Not established.</p>
            )}
          </div>

          <div className="card">
            <h3>How many of them</h3>
            <p style={{ fontSize: 13, margin: 0 }}>
              {e.volume?.estimate ?? <span className="muted">not established</span>}{' '}
              <Pill tone={e.volume?.confidence === 'high' ? 'ok' : e.volume?.confidence === 'medium' ? 'warn' : ''}>
                {e.volume?.confidence ?? 'low'} confidence
              </Pill>
            </p>
            <p className="small muted" style={{ marginTop: 6, marginBottom: 0 }}>
              {e.volume?.method}
            </p>
          </div>

          <div className="card">
            <h3>Buildability</h3>
            <BuildPill verdict={finding.buildability?.verdict} confidence={finding.buildability?.confidence} />
            <p className="small" style={{ marginTop: 8 }}>{finding.buildability?.reasoning}</p>
            {finding.buildability?.shapeLabel ? (
              <p className="small muted">Shape: {finding.buildability.shapeLabel}</p>
            ) : null}
            <p className="small muted">Decided by: {finding.buildability?.decidedBy ?? 'rules'}</p>
          </div>

          <div className="card">
            <h3>Verdict</h3>
            <p style={{ fontSize: 13, marginTop: 0 }}>{finding.verdict.reasoning}</p>
            {finding.verdict.blockedBy ? (
              <p className="small">
                <strong>Blocked by:</strong> {finding.verdict.blockedBy}
              </p>
            ) : null}
          </div>

          <div className="card">
            <h3>Provenance</h3>
            <dl className="kv">
              <dt>Found</dt>
              <dd>{ago(finding.foundAt)}</dd>
              <dt>Last verified</dt>
              <dd>{ago(finding.lastVerifiedAt)}</dd>
              <dt>Sources read</dt>
              <dd>{finding.sources?.length ?? 0}</dd>
              <dt>Read directly</dt>
              <dd>
                {e.readQuality?.read ?? 0} of {e.readQuality?.total ?? 0}
              </dd>
              <dt>Depth</dt>
              <dd>{finding.depth?.level}</dd>
              <dt>Versions</dt>
              <dd>{versions.length}</dd>
            </dl>
            <p className="small muted" style={{ marginTop: 8 }}>{finding.depth?.reasoning}</p>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {(finding.sources ?? []).map((s, i) => (
                <SourceLink key={i} url={s.url} title={s.title} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <details className="raw">
        <summary>Raw record — exactly what Jason receives</summary>
        <pre>{JSON.stringify(finding, null, 2)}</pre>
      </details>
    </>
  );
}

export default function Findings({ data, refresh, param }) {
  const [filter, setFilter] = useState({ status: 'active', minStrength: 0, buildable: '' });
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (param) return;
    let cancelled = false;
    api.findings(filter).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setRows(res.data.findings);
        setError(null);
      } else setError(res.error);
    });
    return () => {
      cancelled = true;
    };
  }, [filter.status, filter.minStrength, filter.buildable, param, data?.at]);

  if (param) return <Detail id={param} onBack={() => (window.location.hash = '#findings')} refresh={refresh} />;

  return (
    <>
      <div className="head">
        <div>
          <h2>Findings</h2>
          <p>Ranked by evidence, not by how interesting they sound. Level 4 and above is where money is moving and buyers are unhappy.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row">
          <div className="field">
            <label>Status</label>
            <select value={filter.status} onChange={(ev) => setFilter({ ...filter, status: ev.target.value })}>
              <option value="active">active</option>
              <option value="archived">archived</option>
              <option value="superseded">superseded</option>
            </select>
          </div>
          <div className="field">
            <label>Minimum strength</label>
            <select value={filter.minStrength} onChange={(ev) => setFilter({ ...filter, minStrength: Number(ev.target.value) })}>
              <option value={0}>any</option>
              <option value={3}>3 — someone is paying</option>
              <option value={4}>4 — paying and complaining</option>
              <option value={5}>5 — and the complaints agree</option>
            </select>
          </div>
          <div className="field">
            <label>Buildable</label>
            <select value={filter.buildable} onChange={(ev) => setFilter({ ...filter, buildable: ev.target.value })}>
              <option value="">any</option>
              <option value="jason-can-build">Jason can build</option>
              <option value="partly">partly</option>
              <option value="jason-cannot-build">not for Jason</option>
              <option value="unclear">unclear</option>
            </select>
          </div>
        </div>
      </div>

      {error ? <Banner title="Could not load findings">{error}</Banner> : null}

      <div className="card">
        {rows === null ? (
          <Empty>Loading…</Empty>
        ) : rows.length ? (
          <div className="list">
            {rows.map((f) => (
              <a className="item rowbtn" key={f.id} href={`#findings/${encodeURIComponent(f.id)}`} style={{ color: 'inherit' }}>
                <span>
                  <span className="t">{f.oneLine}</span>
                  <span className="s">
                    {f.whoHasIt} · {f.payingCount} priced · {f.complaintCount} complaints · verified {ago(f.lastVerifiedAt)}
                  </span>
                </span>
                <span className="r">
                  {f.hypothesis ? <Pill tone="warn">hypothesis</Pill> : null}
                  <BuildPill verdict={f.buildable} />
                  <Pill mono>{money(f.costUsd)}</Pill>
                  <StrengthBar level={f.strength} />
                </span>
              </a>
            ))}
          </div>
        ) : (
          <Empty>Nothing matches that filter.</Empty>
        )}
      </div>
    </>
  );
}
