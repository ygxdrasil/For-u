/**
 * Talking to the people behind the quotes.
 *
 * The one question no API answers: what would they pay YOU, and would they
 * switch. Everything else in the HUD is about what she found; this is the part
 * where you go and ask.
 *
 * Two rules are visible in the interface rather than only in the code.
 *
 * There is no send button. Every draft has a copy button and a link to the
 * thread, and the sending is done by you, in your own account, having read it.
 * That was set as a hard limit at the start and it is not quietly relaxed
 * because a send button would be convenient here.
 *
 * And a reply never moves the evidence level. The panel says so where the
 * reply is recorded, because that is the moment somebody would expect a number
 * to go up.
 */

import React, { useState } from 'react';
import { api } from './api.js';
import { Pill, Banner, SourceLink } from './components.jsx';

const REACH_LABEL = {
  reply: { text: 'reply in thread', tone: 'ok' },
  profile: { text: 'via profile', tone: 'ok' },
  'named-only': { text: 'named, no route', tone: 'warn' },
  anonymous: { text: 'anonymous', tone: null },
};

const VERDICTS = [
  { id: 'already-paying', label: 'Already pays for something' },
  { id: 'would-pay', label: 'Says they would pay' },
  { id: 'interested-no-price', label: 'Interested, no number' },
  { id: 'not-interested', label: 'Not interested' },
  { id: 'no-reply', label: 'No reply' },
];

function Copy({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          // Clipboard is blocked in some contexts. The text is on screen and
          // selectable either way, so this fails quietly rather than throwing
          // a modal over the thing you were about to copy by hand.
          setDone(false);
        }
      }}
    >
      {done ? 'copied' : 'copy'}
    </button>
  );
}

function RecordReply({ person, findingId, onRecorded }) {
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState('would-pay');
  const [said, setSaid] = useState('');
  const [paysNow, setPaysNow] = useState('');
  const [wouldPay, setWouldPay] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) {
    return (
      <button className="small" onClick={() => setOpen(true)}>
        Record what they said
      </button>
    );
  }

  return (
    <div className="replybox">
      <select value={verdict} onChange={(ev) => setVerdict(ev.target.value)} aria-label="what they said">
        {VERDICTS.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>
      <textarea
        rows={3}
        placeholder="Their words, as close to exact as you can."
        value={said}
        onChange={(ev) => setSaid(ev.target.value)}
        aria-label="what they said, in their words"
      />
      <div className="row" style={{ gap: 6 }}>
        {/* Two boxes, never one. What they pay today is a fact about the
            world; what they say they would pay is a fact about a conversation,
            and merging them is how a hopeful number becomes a real one. */}
        <input
          type="number"
          min="0"
          placeholder="pays now ($/mo)"
          value={paysNow}
          onChange={(ev) => setPaysNow(ev.target.value)}
          aria-label="what they pay now"
        />
        <input
          type="number"
          min="0"
          placeholder="says they'd pay"
          value={wouldPay}
          onChange={(ev) => setWouldPay(ev.target.value)}
          aria-label="what they said they would pay"
        />
      </div>
      <div className="row" style={{ gap: 6 }}>
        <button
          className="primary small"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            const res = await api.findingAction('record-reply', {
              id: findingId,
              reply: {
                personId: person.id,
                handle: person.handle,
                url: person.url,
                verdict,
                said,
                theyPayNowUsd: paysNow === '' ? null : Number(paysNow),
                theySaidTheyWouldPayUsd: wouldPay === '' ? null : Number(wouldPay),
              },
            });
            setSaving(false);
            if (res.ok) {
              setOpen(false);
              onRecorded?.(res.data);
            }
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="small" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      <p className="muted small">
        Recorded beside the evidence, not inside it. What someone says they would pay never moves the level — only what
        someone actually pays does.
      </p>
    </div>
  );
}

export default function Reach({ finding, refresh }) {
  const [sheet, setSheet] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [convos, setConvos] = useState(null);
  const [working, setWorking] = useState(null);
  const [error, setError] = useState(null);

  const load = async (draft) => {
    setWorking(draft ? 'draft' : 'sheet');
    setError(null);
    const res = await api.findingAction('contact-sheet', { id: finding.id, draft });
    setWorking(null);
    if (!res.ok) return setError(res.error);
    setSheet(res.data.sheet);
    setConvos(res.data.conversations);
    if (res.data.drafts) setDrafts(res.data.drafts);
  };

  const draftFor = (personId) => (drafts ?? []).find((d) => d.personId === personId);

  return (
    <div className="card">
      <h3>Talk to them</h3>
      <p className="muted small">
        The ladder proves people pay somebody. It never says what they would pay you. That answer only exists in a
        reply.
      </p>

      {!sheet ? (
        <button className="small" onClick={() => load(false)} disabled={working === 'sheet'}>
          {working === 'sheet' ? 'Looking…' : 'Who can I reach?'}
        </button>
      ) : null}

      {error ? <Banner tone="warn" title="Could not build the sheet">{error}</Banner> : null}

      {sheet ? (
        <>
          <div className="row" style={{ gap: 8, margin: '10px 0' }}>
            <Pill tone={sheet.contactable ? 'ok' : 'warn'}>{sheet.summary}</Pill>
            {convos?.asked ? <Pill mono>{convos.line}</Pill> : null}
          </div>

          {sheet.contactable ? (
            <div className="row" style={{ gap: 6, marginBottom: 10 }}>
              <button className="small" onClick={() => load(true)} disabled={working === 'draft'}>
                {working === 'draft' ? 'Writing…' : drafts ? 'Rewrite the openers' : 'Draft an opener for each'}
              </button>
              <span className="muted small">One model call. She writes them; you send them.</span>
            </div>
          ) : null}

          {sheet.people.map((p) => {
            const label = REACH_LABEL[p.reachability] ?? REACH_LABEL.anonymous;
            const draft = draftFor(p.id);
            return (
              <div className="person" key={p.id}>
                <div className="row" style={{ gap: 8 }}>
                  <strong>{p.handle ?? 'anonymous'}</strong>
                  <Pill tone={label.tone}>{label.text}</Pill>
                  <span className="muted small">{p.platform}</span>
                </div>
                <blockquote className="quote">
                  “{p.quote}”
                  <cite>
                    <SourceLink url={p.url} />
                    {p.profile ? (
                      <>
                        {' · '}
                        <SourceLink url={p.profile} />
                      </>
                    ) : null}
                  </cite>
                </blockquote>
                {p.note ? <p className="muted small">{p.note}</p> : null}

                {draft ? (
                  <div className="draft">
                    <p>{draft.text}</p>
                    <div className="row" style={{ gap: 6 }}>
                      <Copy text={draft.text} />
                      <a href={p.url} target="_blank" rel="noreferrer noopener">
                        <button className="small">open the thread</button>
                      </a>
                      <span className="muted small">{draft.how}</span>
                    </div>
                    {draft.caution ? <p className="muted small">{draft.caution}</p> : null}
                  </div>
                ) : null}

                {p.reachability === 'reply' || p.reachability === 'profile' ? (
                  <RecordReply
                    person={p}
                    findingId={finding.id}
                    onRecorded={(d) => {
                      setConvos(d.conversations);
                      refresh?.();
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
