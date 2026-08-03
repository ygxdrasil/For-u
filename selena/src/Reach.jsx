/**
 * Talking to the people behind the quotes.
 *
 * The one question no API answers: what would they pay YOU, and would they
 * switch. Everything else in the HUD is about what she found; this is the part
 * where you go and ask.
 *
 * Two rules are visible in the interface rather than only in the code.
 *
 * SENDING IS TWO PRESSES. She started drafts-only; sending was added later, in
 * words, for email and the forums with a real write API. What did not change is
 * that nothing leaves without you reading the exact text first: the preview
 * returns the bytes that would go out, from which account, and touches no
 * network. Where no credential exists for a channel there is no send button at
 * all, which is clearer than one that explains itself away when pressed. Copy
 * and the thread link stay for everywhere she cannot post — Hacker News above
 * all, where posting would mean being you.
 *
 * A REPLY NEVER MOVES THE EVIDENCE LEVEL. The panel says so where the reply is
 * recorded, because that is the moment somebody would expect a number to go up.
 */

import React, { useState } from 'react';
import { api } from './api.js';
import { Pill, Banner, SourceLink } from './components.jsx';

const REACH_LABEL = {
  email: { text: 'email', tone: 'ok' },
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

/**
 * Preview, then send. Two presses, never one.
 *
 * The preview is not a courtesy — it is the only honest way to check something
 * irreversible. It returns the exact bytes that would go out, from which
 * account, to which post, and touches no network. Sending is a second,
 * deliberate press against text you have already read.
 */
function SendControl({ person, findingId, text, onSent }) {
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState(null);
  const [sent, setSent] = useState(null);

  if (sent) {
    return (
      <p className="muted small">
        Sent as {sent.channel}
        {sent.postedUrl ? (
          <>
            {' — '}
            <a href={sent.postedUrl} target="_blank" rel="noreferrer noopener">read it</a>
          </>
        ) : null}
        . {sent.left} left before she stops.
      </p>
    );
  }

  return (
    <div className="sendbox">
      {!preview ? (
        <button
          className="small"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setProblem(null);
            const res = await api.findingAction('send-preview', { id: findingId, personId: person.id, text });
            setBusy(false);
            if (!res.ok) return setProblem(res.error ?? res.data?.reason ?? 'could not preview');
            if (!res.data.ok) return setProblem(res.data.reason);
            setPreview(res.data);
          }}
        >
          {busy ? 'Checking…' : 'Send this…'}
        </button>
      ) : (
        <>
          <p className="muted small">
            Would post as <strong>{preview.as}</strong> via {preview.channel}
            {preview.subject ? ` — subject "${preview.subject}"` : ''}. This cannot be undone.
          </p>
          <div className="row" style={{ gap: 6 }}>
            <button
              className="primary small"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const res = await api.findingAction('send', { id: findingId, personId: person.id, text: preview.text, subject: preview.subject });
                setBusy(false);
                if (!res.ok || !res.data.ok) return setProblem(res.data?.reason ?? res.error ?? 'it did not send');
                setSent(res.data);
                onSent?.(res.data);
              }}
            >
              {busy ? 'Sending…' : 'Yes, send it'}
            </button>
            <button className="small" onClick={() => setPreview(null)}>
              Cancel
            </button>
          </div>
        </>
      )}
      {problem ? <p className="muted small">{problem}</p> : null}
    </div>
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
  const [outbox, setOutbox] = useState(null);
  const [senders, setSenders] = useState([]);
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
    setOutbox(res.data.outbox);
    setSenders(res.data.senders ?? []);
    if (res.data.drafts) setDrafts(res.data.drafts);
  };

  const draftFor = (personId) => (drafts ?? []).find((d) => d.personId === personId);
  // Matched on the HOST, not as a substring of the whole URL. The first
  // version accepted anything containing the sender's host anywhere — so
  // "https://elsewhere.example/?ref=community.n8n.io" grew a send button that
  // the server then refused, which is exactly the button-that-explains-
  // itself-away this panel is supposed not to have.
  const hostOf = (u) => {
    try {
      return new URL(String(u)).hostname.toLowerCase();
    } catch {
      return null;
    }
  };
  const canSendTo = (p) => {
    if (p.email) return senders.some((s) => s.channel === 'email');
    const host = hostOf(p.url);
    return Boolean(host) && senders.some((s) => s.host && (host === s.host || host.endsWith(`.${s.host}`)));
  };

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
            {outbox?.sent || outbox?.failed || outbox?.unconfirmed ? <Pill mono>{outbox.line}</Pill> : null}
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
            const canSend = canSendTo(p);
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
                    {/* Only where a credential exists for that channel. No
                        button at all is clearer than a button that explains
                        itself away when pressed. */}
                    {canSend ? <SendControl person={p} findingId={finding.id} text={draft.text} onSent={() => refresh?.()} /> : null}
                  </div>
                ) : null}

                {['email', 'reply', 'profile'].includes(p.reachability) ? (
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
