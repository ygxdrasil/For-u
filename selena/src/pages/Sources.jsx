/**
 * Sources — the honest legal position, on screen.
 *
 * This page exists because the answer to "why isn't she reading Fiverr?" needs
 * to be one click away and identical to what the code enforces. It is rendered
 * from the same table the pipeline obeys, so it cannot describe a policy that
 * is not actually in force.
 */

import React from 'react';
import { Pill, Empty } from '../components.jsx';

const ACCESS_LABEL = {
  'official-api': ['ok', 'official API'],
  'search-index-only': ['warn', 'search index only'],
  'open-web': ['', 'open web'],
};

export default function Sources({ data }) {
  const sources = data?.sources ?? [];

  return (
    <>
      <div className="head">
        <div>
          <h2>Sources</h2>
          <p>
            Where she is allowed to look, and how. "Search index only" means she never sends a request to that host — she
            cites what a search result already showed her, and the finding is marked weaker for it.
          </p>
        </div>
      </div>

      {sources.length === 0 ? (
        <Empty>Waiting for the first poll…</Empty>
      ) : (
        sources.map((s) => {
          const [tone, label] = ACCESS_LABEL[s.access] ?? ['', s.access];
          return (
            <div className="card" key={s.id} style={{ marginBottom: 12 }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, textTransform: 'none', fontSize: 15, letterSpacing: 0 }}>{s.name}</h3>
                <span className="r" style={{ display: 'flex', gap: 6 }}>
                  <Pill tone={tone}>{label}</Pill>
                  {s.live ? <Pill tone="ok">live</Pill> : <Pill tone="warn">dark</Pill>}
                </span>
              </div>

              <p style={{ fontSize: 13, marginBottom: 8 }}>{s.note}</p>

              {s.blockedReason ? (
                <p className="small" style={{ color: 'var(--warn)' }}>
                  {s.blockedReason}
                </p>
              ) : null}

              {s.endpoints?.length ? (
                <div className="small mono muted" style={{ marginBottom: 8 }}>
                  {s.endpoints.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              ) : null}

              <div className="row small muted" style={{ gap: 14 }}>
                <span>gives: {s.gives?.join(', ') || '—'}</span>
                <span>limits: {s.limits}</span>
                <span>checked {s.checkedOn}</span>
                {s.docs ? (
                  <a href={s.docs} target="_blank" rel="noopener noreferrer">
                    documentation
                  </a>
                ) : null}
              </div>
            </div>
          );
        })
      )}

      <div className="card">
        <h3>What she will never do</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
          <li>Message, email or post to anyone. She reads.</li>
          <li>Log into any site as you.</li>
          <li>Spend money without the cap allowing it — checked before each request, not after.</li>
          <li>Delete a finding. They are archived or superseded; every version is kept.</li>
          <li>Fetch a host whose terms forbid it, even where robots.txt is silent.</li>
          <li>Store personal data about anyone beyond a public quote and its link.</li>
        </ul>
      </div>
    </>
  );
}
