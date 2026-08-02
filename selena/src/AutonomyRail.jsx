/**
 * The arming panel that lives in the sidebar, on every page.
 *
 * It is in the rail rather than on a settings page because of what it does:
 * she spends money and hands work to Jason while you are asleep. Whether that
 * is currently switched on should never be more than a glance away, and
 * switching it off should never be more than one press away from wherever you
 * happen to be.
 *
 * Four things, in the order you would want them:
 *   1. armed or not, and one press to change it
 *   2. what she is doing this second
 *   3. what is left of the money that is hers to spend
 *   4. stop everything
 *
 * Collapsed, it degrades to a single dot you can still press. The state has to
 * survive the rail being narrow; an arming switch that hides itself is worse
 * than no switch.
 */

import React, { useState } from 'react';
import { api, ago } from './api.js';
import { Icon } from './icons.jsx';

/**
 * What she is doing this second, if anything. Activity older than a couple of
 * minutes is history, not activity, and showing it as live is how a stalled
 * system looks busy.
 */
function liveLine(data) {
  const newest = data?.activity?.[0];
  if (!newest?.at) return null;
  const ageMs = Date.now() - Date.parse(newest.at);
  if (!Number.isFinite(ageMs) || ageMs > 120_000) return null;
  if (newest.kind === 'quiet' || newest.level === 'debug') return null;
  return newest.message;
}

export default function AutonomyRail({ data, collapsed, refresh }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [confirmStop, setConfirmStop] = useState(false);

  const a = data?.autonomy;
  const armed = Boolean(a?.armed);
  const doing = liveLine(data);

  const act = async (action, payload = {}) => {
    setBusy(action);
    setError(null);
    const res = await api.watchAction(action, payload);
    setBusy(null);
    if (!res.ok) setError(res.error);
    else {
      setConfirmStop(false);
      await refresh();
    }
  };

  // Collapsed: the switch survives as a dot. Pressing it still arms and
  // disarms, and the title carries the whole sentence.
  if (collapsed) {
    return (
      <div className="railauto collapsed">
        <button
          className={`armdot ${armed ? 'on' : ''}`}
          onClick={() => act(armed ? 'disarm' : 'arm')}
          disabled={busy !== null}
          title={a?.says ?? (armed ? 'Armed' : 'Not armed')}
          aria-label={armed ? 'Disarm her' : 'Arm her'}
        >
          <Icon name="power" />
        </button>
      </div>
    );
  }

  const left = Number(a?.allowanceLeftUsd);
  const hers = Math.max(0, Number(a?.capUsd ?? 0) - Number(a?.reserveUsd ?? 0));
  const pct = hers > 0 && Number.isFinite(left) ? Math.max(0, Math.min(100, (left / hers) * 100)) : 0;

  return (
    <div className="railauto">
      <button className={`armswitch ${armed ? 'on' : ''}`} onClick={() => act(armed ? 'disarm' : 'arm')} disabled={busy !== null}>
        <span className="track">
          <span className="knob" />
        </span>
        <span className="what">
          <span className="t">{armed ? 'Working on her own' : 'Waiting for you'}</span>
          <span className="s">{busy === 'arm' || busy === 'disarm' ? 'one moment…' : armed ? 'tap to stand her down' : 'tap to set her going'}</span>
        </span>
      </button>

      {error ? <div className="armerror">{error}</div> : null}

      {/* What she is doing this second, if she is doing anything. */}
      {doing ? (
        <div className="doingnow">
          <span className="pulse" />
          <span>{doing}</span>
        </div>
      ) : armed ? (
        <div className="doingnow idle">
          <span>{a?.lastRunAt ? `last looked ${ago(a.lastRunAt)}` : 'armed; waiting for the next scheduled pass'}</span>
        </div>
      ) : null}

      {/* Her allowance, which is not the same as the account's. */}
      <div className="allowance" title={`$${Number(a?.reserveUsd ?? 0).toFixed(2)} of the $${Number(a?.capUsd ?? 0).toFixed(2)} cap is held back for you`}>
        <div className="bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="figs">
          <span>${Number.isFinite(left) ? left.toFixed(2) : '—'} hers</span>
          <span className="muted">${Number(a?.reserveUsd ?? 0).toFixed(2)} yours</span>
        </div>
      </div>

      {armed && Number.isFinite(a?.handoffsThisWeek) ? (
        <div className="railnote">
          {a.handoffsThisWeek}/{a.handoffsPerWeek} to Jason this week · level {a.handoffFloor} only
        </div>
      ) : null}

      {a && !armed && a.disarmedBy === 'herself' ? <div className="railnote warn">She stopped herself: {a.disarmReason}</div> : null}
      {armed && a?.backedOff ? <div className="railnote warn">Roaming less often — nothing new for a while.</div> : null}

      {confirmStop ? (
        <div className="stopconfirm">
          <p>Disarm her and pause every watch?</p>
          <div>
            <button className="danger small" onClick={() => act('stop-everything')} disabled={busy !== null}>
              {busy === 'stop-everything' ? 'Stopping…' : 'Yes, stop'}
            </button>
            <button className="small" onClick={() => setConfirmStop(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="stopall" onClick={() => setConfirmStop(true)} disabled={busy !== null}>
          <Icon name="stop" />
          <span>stop everything</span>
        </button>
      )}
    </div>
  );
}
