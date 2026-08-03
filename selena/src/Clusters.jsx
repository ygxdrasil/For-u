/**
 * "These three are one demand, and together they are level 4."
 *
 * The sentence the system could not say before. Findings are deduplicated per
 * watch, so the same need surfacing under two watches and a roam became three
 * records, each scoring its ladder over a third of the evidence — which meant
 * the strongest demands, the ones that show up everywhere, were the ones most
 * underrated.
 *
 * Shown here rather than behind a button because it costs nothing: no model
 * call, just a comparison of evidence already on the record.
 *
 * It offers and waits. A wrong merge invents a level 5 out of two unrelated
 * level 2s and it looks exactly like a real one, so the reasoning and the
 * shared sources are on screen next to the button, and the button is never
 * pressed on your behalf.
 */

import React, { useState } from 'react';
import { api } from './api.js';
import { Pill, StrengthBar, Banner, SourceLink } from './components.jsx';

export default function Clusters({ clusters, refresh }) {
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [done, setDone] = useState({});

  const live = (clusters ?? []).filter((c) => !done[c.id]);
  if (!live.length) return null;

  // The ones where the split is actually costing a level come first — that is
  // the only reason to act today rather than whenever.
  const costing = live.filter((c) => c.lift > 0);

  return (
    <div className="card">
      <h3>The same demand, filed more than once</h3>
      <p className="muted small">
        Findings are deduplicated within a watch, not across them. These look like one need seen from several angles —
        matched on sources they both cite, never on wording alone.
        {costing.length ? ` ${costing.length} of them ${costing.length === 1 ? 'is' : 'are'} costing you a level.` : ''}
      </p>

      {error ? <Banner tone="warn" title="Could not merge">{error}</Banner> : null}

      {live.map((c) => (
        <div className="cluster" key={c.id}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <StrengthBar level={c.strength} />
            {c.lift > 0 ? (
              <Pill tone="red">
                level {c.bestAlone} → {c.strength}
              </Pill>
            ) : c.lift < 0 ? (
              <Pill tone="warn">
                would DROP to {c.strength}
              </Pill>
            ) : (
              <Pill>no change to the level</Pill>
            )}
            <Pill mono>{c.members.length} findings</Pill>
          </div>

          <p className="clusterline">{c.line}</p>

          <ul className="members">
            {c.members.map((m) => (
              <li key={m.id}>
                <a href={`#findings/${encodeURIComponent(m.id)}`}>{m.oneLine}</a>{' '}
                <span className="muted small">
                  level {m.strength} · {m.sources} source{m.sources === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>

          <div className="row" style={{ gap: 6 }}>
            <button className="small" onClick={() => setOpen(open === c.id ? null : c.id)}>
              {open === c.id ? 'hide why' : 'why does she think so?'}
            </button>
            <button
              className="primary small"
              disabled={busy === c.id}
              onClick={async () => {
                setBusy(c.id);
                setError(null);
                const res = await api.findingAction('merge', { ids: c.members.map((m) => m.id) });
                setBusy(null);
                if (!res.ok) return setError(res.error);
                setDone({ ...done, [c.id]: true });
                refresh?.();
              }}
            >
              {busy === c.id ? 'Merging…' : 'Merge into one'}
            </button>
            <button className="small" onClick={() => setDone({ ...done, [c.id]: true })}>
              not the same thing
            </button>
          </div>

          {open === c.id ? (
            <div className="why">
              <ul>
                {c.why.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              {c.sharedUrls.length ? (
                <>
                  <p className="muted small">Cited by more than one of them:</p>
                  <ul>
                    {c.sharedUrls.map((u) => (
                      <li key={u}>
                        <SourceLink url={u} />
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {/* Said plainly, because merging two different demands is the one
                  thing this can get badly wrong and the undo is not obvious. */}
              <p className="muted small">
                Merging supersedes the others and points them at the survivor. Nothing is deleted — restore them to
                undo it.
              </p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
