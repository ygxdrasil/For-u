/**
 * Home: a question mark that is also the command bar.
 *
 * She takes orders, not questions. You type an instruction, she says back what
 * she understood, and anything that spends money or changes something waits
 * for a second press of enter. A misreading costs a keystroke.
 *
 * While she works the ? dissolves into orbiting embers and reassembles when
 * she is done. The line underneath is not decorative timing — it is the real
 * trace the pipeline writes as it goes, polled from the activity feed, so a
 * stall is visible rather than hidden behind a spinner that always looks busy.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, money } from '../api.js';
import { StrengthBar, Pill, SourceLink } from '../components.jsx';

/** Forty embers, placed deterministically so the shape is the same every time. */
const PARTICLES = Array.from({ length: 40 }, (_, i) => {
  // A golden-angle spiral spreads them evenly without looking like a clock face.
  const angle = (i * 137.508) % 360;
  const near = 26 + ((i * 7) % 34);
  const far = 58 + ((i * 11) % 46);
  return {
    a: `${angle}deg`,
    r0: `${near}px`,
    r1: `${far}px`,
    dur: `${5.5 + ((i * 13) % 40) / 10}s`,
    delay: `-${((i * 17) % 55) / 10}s`,
  };
});

/** How long an activity event stays "recent" enough to mean she is working. */
const BUSY_WINDOW_MS = 45_000;

export default function Home({ data, refresh }) {
  const [text, setText] = useState('');
  const [working, setWorking] = useState(false);
  const [pending, setPending] = useState(null); // a parse awaiting your confirmation
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(null);
  const inputRef = useRef(null);
  const stagePoll = useRef(null);

  // A scheduled watch running in the background: the newest trace event is
  // recent, and we did not start it. Shown dimmer than a command of yours.
  const backgroundBusy = useMemo(() => {
    if (working) return false;
    const newest = (data?.activity ?? []).find((e) => e.kind === 'trace' || e.kind === 'run');
    if (!newest?.at) return false;
    return Date.now() - Date.parse(newest.at) < BUSY_WINDOW_MS;
  }, [data?.activity, working]);

  /**
   * While a command runs, read the trace the pipeline is writing. This is the
   * real thing she is doing, not a timer pretending to be one.
   */
  const startStagePolling = useCallback(() => {
    stopStagePolling();
    setStage('starting…');
    stagePoll.current = setInterval(async () => {
      const res = await api.dashboard();
      if (!res.ok) return;
      const newest = (res.data.activity ?? []).find((e) => e.kind === 'trace');
      if (newest?.message) setStage(newest.message);
    }, 2500);
  }, []);

  const stopStagePolling = () => {
    if (stagePoll.current) clearInterval(stagePoll.current);
    stagePoll.current = null;
  };

  useEffect(() => stopStagePolling, []);

  const send = async (confirm) => {
    const command = text.trim();
    if (!command) return;

    setWorking(true);
    setResult(null);
    startStagePolling();

    const res = await api.command({ text: command, confirm });

    stopStagePolling();
    setStage(null);
    setWorking(false);

    if (!res.ok && res.error) {
      setPending(null);
      setResult({ kind: 'error', message: res.error });
      return;
    }

    const d = res.data;

    if (d.awaitingConfirmation) {
      // She has understood it but will not act until you say so again.
      setPending(d);
      return;
    }

    setPending(null);

    if (!d.ok) {
      setResult({ kind: 'unrecognised', understood: d.understood, problem: d.problem, suggestions: d.suggestions ?? [] });
      return;
    }

    if (d.navigate) {
      // "show level 5" is navigation, not work.
      const n = d.navigate;
      if (n.id) window.location.hash = `#findings/${encodeURIComponent(n.id)}`;
      else window.location.hash = `#${n.page ?? 'findings'}`;
      setText('');
      return;
    }

    setResult({ kind: 'done', ...d });
    setText('');
    refresh?.();
  };

  const onKeyDown = (ev) => {
    if (ev.key !== 'Enter') {
      // Editing after she has read it back invalidates the reading.
      if (pending && ev.key.length === 1) setPending(null);
      return;
    }
    ev.preventDefault();
    // Second enter confirms exactly what she read back, not what is now typed.
    send(Boolean(pending));
  };

  const suggestions = ['run', 'watch bookkeeping for UK tradespeople daily', 'dig into invoice chasing', 'show level 5'];

  return (
    <div className="home">
      <div className="home-inner">
        <div className={`glyph-wrap ${working ? 'working' : ''} ${!working && backgroundBusy ? 'working background' : ''}`}>
          <span className="glyph-halo" />
          <span className="particles" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <i key={i} style={{ '--a': p.a, '--r0': p.r0, '--r1': p.r1, '--dur': p.dur, '--delay': p.delay }} />
            ))}
          </span>
          <span className="glyph" onClick={() => inputRef.current?.focus()} role="presentation">
            ?
          </span>
        </div>

        <div className="command">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={working ? 'working…' : 'tell her what to do'}
            disabled={working}
            autoFocus
            aria-label="command"
            spellCheck="false"
          />
        </div>

        <div className="stage">
          {working ? (
            <>
              <span className="tick">▸ </span>
              {stage ?? 'working…'}
            </>
          ) : backgroundBusy ? (
            <span className="muted">a scheduled watch is running</span>
          ) : (
            <span className="muted">
              {data?.headline?.realOpenings
                ? `${data.headline.realOpenings} real opening${data.headline.realOpenings === 1 ? '' : 's'} on record`
                : 'nothing on record yet'}
            </span>
          )}
        </div>

        {pending ? (
          <div className="reading">
            <div className="label">I read that as</div>
            <div className="said">{pending.understood}</div>
            {pending.interpreted ? (
              <div className="hint">No rule matched that phrasing, so I had to interpret it. Worth a second look before you confirm.</div>
            ) : null}
            <div className="cost">
              {pending.spends
                ? `about ${money(pending.estimateUsd, 3)} · ${money(pending.headroomUsd, 2)} left this month`
                : 'costs nothing'}
            </div>
            <div className="hint">
              {pending.affordable === false
                ? 'That is more than is left in the budget this month.'
                : 'Press enter again to do it. Type anything to change it.'}
            </div>
          </div>
        ) : null}

        {result?.kind === 'unrecognised' ? (
          <div className="reading">
            <div className="label">Not a command I have</div>
            <div className="said">{result.understood}</div>
            <div className="hint">Nothing has run. Here is what I do understand:</div>
            <div className="suggests" style={{ justifyContent: 'flex-start' }}>
              {result.suggestions.slice(0, 5).map((s) => (
                <button key={s} onClick={() => { setText(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {result?.kind === 'error' ? (
          <div className="reading">
            <div className="label">That did not work</div>
            <div className="said">{result.message}</div>
          </div>
        ) : null}

        {result?.kind === 'done' ? (
          <div className="answer">
            <div className="label" style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-3)', marginBottom: 6 }}>
              {result.understood}
            </div>
            <div style={{ fontSize: 14 }}>{result.message ?? 'Done.'}</div>

            {result.summary ? (
              <div className="row" style={{ gap: 8, marginTop: 10, alignItems: 'center' }}>
                <StrengthBar level={result.summary.strength} />
                {result.summary.hypothesis ? <Pill tone="warn">hypothesis</Pill> : null}
                <Pill mono>{money(result.costUsd ?? 0)}</Pill>
                {result.stoppedEarly ? <Pill tone="warn">stopped early</Pill> : null}
                <a href={`#findings/${encodeURIComponent(result.summary.id)}`}>open it →</a>
              </div>
            ) : null}

            {result.finding?.sources?.length ? (
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className="small muted">read:</span>
                {result.finding.sources.slice(0, 6).map((s, i) => (
                  <SourceLink key={i} url={s.url} title={s.title} />
                ))}
              </div>
            ) : null}

            {result.notes?.length ? (
              <div className="small muted" style={{ marginTop: 10 }}>
                {result.notes.join(' · ')}
              </div>
            ) : null}

            {result.problem ? (
              <div className="small" style={{ marginTop: 8, color: 'var(--warn)' }}>
                {result.problem}
                {result.candidates?.length ? ` — ${result.candidates.join(', ')}` : ''}
              </div>
            ) : null}
          </div>
        ) : null}

        {!pending && !result && !working ? (
          <div className="suggests">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setText(s); inputRef.current?.focus(); }}>
                {s}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="home-foot">
        <a href="#dashboard">dashboard</a>
        <a href="#findings">findings</a>
        <a href="#watches">watches</a>
        <span className="muted">{data?.money ? `${money(data.money.monthToDateUsd ?? 0, 2)} of ${money(data.money.capUsd ?? 10, 2)} this month` : ''}</span>
      </div>
    </div>
  );
}
