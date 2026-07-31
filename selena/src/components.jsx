/**
 * Shared HUD pieces.
 *
 * All the charting is inline SVG or divs. A charting library for five bars and
 * one sparkline is 60kB of dependency to draw shapes the browser already
 * draws, and it would be another thing that breaks on a version bump.
 */

import React from 'react';
import { money, ago, clock } from './api.js';

export function Stat({ n, label, tone = '', title = null }) {
  return (
    <div className="card stat" title={title ?? undefined}>
      <div className={`n ${tone}`}>{n}</div>
      <div className="l">{label}</div>
    </div>
  );
}

export function Pill({ children, tone = '', mono = false, title = null }) {
  return (
    <span className={`pill ${tone} ${mono ? 'mono' : ''}`} title={title ?? undefined}>
      {children}
    </span>
  );
}

/** Five bars. Reading a level off a shape is faster than reading a number. */
export function StrengthBar({ level = 0, title = null }) {
  return (
    <span className="strengthbar" title={title ?? `evidence strength ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= level ? 'on' : ''} />
      ))}
    </span>
  );
}

export function Ladder({ ladder = [] }) {
  if (!ladder.length) return <p className="muted small">No ladder recorded on this finding.</p>;
  return (
    <div className="ladder">
      {ladder.map((r) => (
        <div key={r.level} className={`rung ${r.met ? 'met' : 'unmet'}`}>
          <span className="lv">{r.level}</span>
          <span>
            <span className="lb">{r.label}</span>
            <br />
            <span className="wy">{r.why}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function Meter({ value, max, tone = null }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  // Tone is derived from headroom, not chosen by the caller: the bar going red
  // must always mean the same thing.
  const auto = pct > 85 ? '' : pct > 60 ? 'warn' : 'ok';
  return (
    <div className={`meter ${tone ?? auto}`}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Bars({ series = [], valueKey = 'usd' }) {
  const values = series.map((s) => Number(s[valueKey]) || 0);
  const max = Math.max(...values, 0.000001);
  return (
    <div className="bars">
      {series.map((s, i) => (
        <i
          key={s.day ?? i}
          className={values[i] >= max && max > 0 ? 'hot' : ''}
          style={{ height: `${Math.max(2, (values[i] / max) * 100)}%` }}
          title={`${s.day}: ${money(values[i])}`}
        />
      ))}
    </div>
  );
}

export function Distribution({ rows = [] }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="dist">
      {rows.map((r) => (
        <div className="row" key={r.level}>
          <span className="muted">level {r.level}</span>
          <span className="track">
            <i style={{ width: `${(r.count / max) * 100}%` }} />
          </span>
          <span className="n">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

export function Feed({ events = [], empty = 'Nothing yet.' }) {
  if (!events.length) return <div className="empty">{empty}</div>;
  return (
    <div className="feed">
      {events.map((e, i) => (
        <div className={`fev ${e.level ?? 'info'}`} key={e.id ?? `${e.at}-${i}`}>
          <time>{clock(e.at)}</time>
          <span className="m">{e.message}</span>
        </div>
      ))}
    </div>
  );
}

export function BuildPill({ verdict, confidence }) {
  if (!verdict) return <Pill>unclassified</Pill>;
  const map = {
    'jason-can-build': ['ok', 'Jason can build'],
    partly: ['warn', 'partly buildable'],
    'jason-cannot-build': ['red', 'not for Jason'],
    unclear: ['', 'unclear'],
  };
  const [tone, label] = map[verdict] ?? ['', verdict];
  return (
    <Pill tone={tone} title={confidence ? `${confidence} confidence` : undefined}>
      {label}
    </Pill>
  );
}

export function LiveDot({ busy, at }) {
  const stale = at && Date.now() - Date.parse(at) > 90_000;
  return (
    <span className={`live ${busy ? 'busy' : stale ? 'stale' : ''}`}>
      <span className="dot" />
      {busy ? 'working' : at ? `updated ${ago(at)}` : 'idle'}
    </span>
  );
}

export function Banner({ tone = '', title, children }) {
  return (
    <div className={`banner ${tone}`}>
      {title ? <strong>{title}</strong> : null}
      {children}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

/** A source link that shows the domain rather than a wall of URL. */
export function SourceLink({ url, title = null }) {
  if (!url) return <span className="muted small">no link</span>;
  let label = url;
  try {
    label = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    // Keep the raw string; a malformed URL is still worth showing.
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="small" title={title ?? url}>
      {label}
    </a>
  );
}
