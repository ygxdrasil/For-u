/**
 * Ask — the same endpoint Jason calls, with a box in front of it.
 *
 * The mode selector is honest about cost: answering from the record is free,
 * researching is not, and the page says which one it did rather than leaving
 * you to guess from the bill at the end of the month.
 */

import React, { useState } from 'react';
import { api, money } from '../api.js';
import { Pill, Empty, Banner, SourceLink, StrengthBar } from '../components.jsx';

export default function Ask({ refresh }) {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState('auto');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);

  const submit = async (ev) => {
    ev.preventDefault();
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true);
    const res = await api.ask({ question: q, mode, askedBy: 'operator' });
    setBusy(false);
    setQuestion('');
    setHistory([{ q, at: new Date().toISOString(), ...(res.ok ? res.data : { error: res.error }) }, ...history]);
    refresh?.();
  };

  return (
    <>
      <div className="head">
        <div>
          <h2>Ask</h2>
          <p>
            The same seam Jason plugs into: <code className="mono small">POST /api/ask</code>. She answers from the record
            for nothing, and only goes and reads when the record cannot answer.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <form onSubmit={submit}>
          <div className="field">
            <label>Question</label>
            <textarea
              rows={3}
              value={question}
              placeholder="e.g. what do wedding stationers currently pay for seating-chart tools, and what do they complain about?"
              onChange={(ev) => setQuestion(ev.target.value)}
            />
          </div>
          <div className="row">
            <div className="field" style={{ maxWidth: 220 }}>
              <label>How should she answer?</label>
              <select value={mode} onChange={(ev) => setMode(ev.target.value)}>
                <option value="auto">auto — record first, read if needed</option>
                <option value="stored">record only (free)</option>
                <option value="research">go and read (costs money)</option>
              </select>
            </div>
            <button className="primary" type="submit" disabled={busy || !question.trim()}>
              {busy ? 'Thinking…' : 'Ask'}
            </button>
          </div>
        </form>
      </div>

      {history.length === 0 ? (
        <Empty>Nothing asked yet.</Empty>
      ) : (
        history.map((h, i) => (
          <div className="card" key={i} style={{ marginBottom: 12 }}>
            <h3>{h.q}</h3>
            {h.error ? (
              <Banner title="That failed">{h.error}</Banner>
            ) : (
              <>
                <div className="row" style={{ gap: 6, marginBottom: 8 }}>
                  <Pill tone={h.route === 'research' ? 'red' : 'ok'}>{h.route === 'research' ? 'went and read' : 'from the record'}</Pill>
                  <Pill tone={h.confidence === 'high' ? 'ok' : h.confidence === 'medium' ? 'warn' : ''}>{h.confidence} confidence</Pill>
                  <Pill mono>{money(h.costUsd ?? 0)}</Pill>
                  {h.finding ? <StrengthBar level={h.finding.evidence.strength} /> : null}
                </div>

                <p style={{ whiteSpace: 'pre-wrap', fontSize: 13.5 }}>{h.answer}</p>

                {h.unknowns?.length ? (
                  <div className="small" style={{ marginTop: 8 }}>
                    <strong>Could not establish:</strong>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                      {h.unknowns.map((u, j) => (
                        <li key={j} className="muted">
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {h.rejectedCitations?.length ? (
                  <p className="small" style={{ color: 'var(--red)' }}>
                    {h.rejectedCitations.length} citation(s) were deleted for pointing at sources this session never read.
                  </p>
                ) : null}

                {h.basedOn?.length ? (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="small muted">based on:</span>
                    {h.basedOn.map((u, j) => (
                      <SourceLink key={j} url={u} />
                    ))}
                  </div>
                ) : null}

                {h.finding ? (
                  <p className="small" style={{ marginTop: 8 }}>
                    <a href={`#findings/${encodeURIComponent(h.finding.id)}`}>Open the finding this produced →</a>
                  </p>
                ) : null}
              </>
            )}
          </div>
        ))
      )}
    </>
  );
}
