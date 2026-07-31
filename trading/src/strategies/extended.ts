import type { Bar, Strategy } from '../types.js';
import {
  adx, atr, atrPct, avgVolume, chandelier, closes, ema, keltner, macd,
  priorHigh, priorLow, roc, rsi, sma, zscore,
} from '../indicators.js';

/**
 * Extended strategy library for the wide sweep.
 *
 * NOTE ON TRAILING STOPS: the engine holds a fixed stop set at entry, so
 * trailing is expressed as a decide()-driven exit — evaluated on the bar close
 * and filled at the next open. That's slightly worse than a true intrabar
 * trailing stop, and deliberately so: it's the honest direction to err.
 */

// --------------------------------------------------------------- trend / momentum

/** The original Turtle system: enter on a 20-bar extreme, exit on a 10-bar one. */
export function donchianTurtle(entryN = 20, exitN = 10, stopAtr = 2): Strategy {
  return {
    name: `Donchian Turtle ${entryN}/${exitN}`,
    warmup: Math.max(entryN, exitN) + 15,
    indicators: (bars: Bar[]) => ({
      hiEntry: priorHigh(bars, entryN), loEntry: priorLow(bars, entryN),
      hiExit: priorHigh(bars, exitN), loExit: priorLow(bars, exitN),
      atr: atr(bars, 14),
    }),
    decide({ bars, i, position, ind }) {
      const { hiEntry, loEntry, hiExit, loExit, atr: a } = ind;
      if (![hiEntry[i], loEntry[i], hiExit[i], loExit[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price < loExit[i]) return { kind: 'exit', reason: `${exitN}-bar low` };
        if (position.side === 'short' && price > hiExit[i]) return { kind: 'exit', reason: `${exitN}-bar high` };
        return null;
      }
      if (price > hiEntry[i]) return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], reason: `${entryN}-bar high` };
      if (price < loEntry[i]) return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], reason: `${entryN}-bar low` };
      return null;
    },
    sweeps: [
      { label: 'entry N', values: [10, 15, 20, 30, 55], build: (p) => donchianTurtle(p, exitN, stopAtr) },
      { label: 'exit N', values: [5, 10, 15, 20, 25], build: (p) => donchianTurtle(entryN, p, stopAtr) },
    ],
  };
}

/**
 * Time-series momentum — the single most replicated result in the academic
 * literature (Moskowitz/Ooi/Pedersen: 58 futures markets, Sharpe ~1.0).
 * If anything here has a real edge, theory says it should be this.
 */
export function timeSeriesMomentum(lookback = 252, stopAtr = 3): Strategy {
  return {
    name: `Time-series momentum ${lookback}`,
    warmup: lookback + 15,
    indicators: (bars: Bar[]) => ({ roc: roc(closes(bars), lookback), atr: atr(bars, 14) }),
    decide({ bars, i, position, ind }) {
      const [r, a] = [ind.roc[i], ind.atr[i]];
      if (![r, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && r < 0) return { kind: 'exit', reason: 'momentum turned negative' };
        if (position.side === 'short' && r > 0) return { kind: 'exit', reason: 'momentum turned positive' };
        return null;
      }
      if (r > 0) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: `${lookback}-bar return ${(r * 100).toFixed(0)}%` };
      if (r < 0) return { kind: 'entry', side: 'short', stop: price + stopAtr * a, reason: `${lookback}-bar return ${(r * 100).toFixed(0)}%` };
      return null;
    },
    sweeps: [{ label: 'lookback', values: [60, 120, 180, 252, 300], build: (p) => timeSeriesMomentum(p, stopAtr) }],
  };
}

export function macdCross(fast = 12, slow = 26, signal = 9, stopAtr = 2): Strategy {
  return {
    name: `MACD ${fast}/${slow}/${signal}`,
    warmup: slow + signal + 5,
    indicators: (bars: Bar[]) => {
      const m = macd(closes(bars), fast, slow, signal);
      return { line: m.line, sig: m.signal, atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const [l, s, pl, ps, a] = [ind.line[i], ind.sig[i], ind.line[i - 1], ind.sig[i - 1], ind.atr[i]];
      if (![l, s, pl, ps, a].every(Number.isFinite)) return null;
      const up = pl <= ps && l > s;
      const down = pl >= ps && l < s;
      if (position) {
        if (position.side === 'long' && down) return { kind: 'exit', reason: 'MACD cross down' };
        if (position.side === 'short' && up) return { kind: 'exit', reason: 'MACD cross up' };
        return null;
      }
      const price = bars[i].close;
      if (up) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: 'MACD cross up' };
      if (down) return { kind: 'entry', side: 'short', stop: price + stopAtr * a, reason: 'MACD cross down' };
      return null;
    },
    sweeps: [{ label: 'slow', values: [20, 26, 35, 50, 60], build: (p) => macdCross(fast, p, signal, stopAtr) }],
  };
}

/** Trend entry with a Chandelier trailing exit — the documented ratcheting stop. */
export function chandelierTrend(trendPeriod = 100, chPeriod = 22, chMult = 3): Strategy {
  return {
    name: `Chandelier trend (SMA${trendPeriod}, ${chMult}xATR)`,
    warmup: Math.max(trendPeriod, chPeriod) + 15,
    indicators: (bars: Bar[]) => {
      const ch = chandelier(bars, chPeriod, chMult, chPeriod);
      return { trend: sma(closes(bars), trendPeriod), longStop: ch.longStop, shortStop: ch.shortStop, atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const { trend, longStop, shortStop, atr: a } = ind;
      if (![trend[i], longStop[i], shortStop[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price < longStop[i]) return { kind: 'exit', reason: 'chandelier' };
        if (position.side === 'short' && price > shortStop[i]) return { kind: 'exit', reason: 'chandelier' };
        return null;
      }
      if (price > trend[i] && price > longStop[i]) {
        return { kind: 'entry', side: 'long', stop: longStop[i], reason: 'uptrend, above chandelier' };
      }
      if (price < trend[i] && price < shortStop[i]) {
        return { kind: 'entry', side: 'short', stop: shortStop[i], reason: 'downtrend, below chandelier' };
      }
      return null;
    },
    sweeps: [{ label: 'ATR mult', values: [2, 2.5, 3, 3.5, 4], build: (p) => chandelierTrend(trendPeriod, chPeriod, p) }],
  };
}

/** Triple EMA stack — trade only when short/medium/long agree. */
export function tripleEma(a1 = 8, a2 = 21, a3 = 55, stopAtr = 2): Strategy {
  return {
    name: `Triple EMA ${a1}/${a2}/${a3}`,
    warmup: a3 + 15,
    indicators: (bars: Bar[]) => {
      const c = closes(bars);
      return { e1: ema(c, a1), e2: ema(c, a2), e3: ema(c, a3), atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const [x, y, z, a] = [ind.e1[i], ind.e2[i], ind.e3[i], ind.atr[i]];
      if (![x, y, z, a].every(Number.isFinite)) return null;
      const bull = x > y && y > z;
      const bear = x < y && y < z;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && !bull) return { kind: 'exit', reason: 'stack broke' };
        if (position.side === 'short' && !bear) return { kind: 'exit', reason: 'stack broke' };
        return null;
      }
      if (bull) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: 'EMAs stacked bullish' };
      if (bear) return { kind: 'entry', side: 'short', stop: price + stopAtr * a, reason: 'EMAs stacked bearish' };
      return null;
    },
    sweeps: [{ label: 'slowest', values: [34, 45, 55, 89, 100], build: (p) => tripleEma(a1, a2, p, stopAtr) }],
  };
}

/** Long-only trend filter: hold above the long SMA, flat below. */
export function longOnlyTrend(trendPeriod = 200, stopAtr = 4): Strategy {
  return {
    name: `Long-only SMA${trendPeriod}`,
    warmup: trendPeriod + 5,
    indicators: (bars: Bar[]) => ({ trend: sma(closes(bars), trendPeriod), atr: atr(bars, 14) }),
    decide({ bars, i, position, ind }) {
      const [t, a] = [ind.trend[i], ind.atr[i]];
      if (![t, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) return price < t ? { kind: 'exit', reason: 'below trend' } : null;
      if (price > t) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: 'above trend' };
      return null;
    },
    sweeps: [{ label: 'trend period', values: [50, 100, 150, 200, 250], build: (p) => longOnlyTrend(p, stopAtr) }],
  };
}

// --------------------------------------------------------------- breakout / volatility

/** Keltner channel breakout, ATR-scaled rather than stddev-scaled. */
export function keltnerBreakout(period = 20, mult = 2, stopAtr = 2): Strategy {
  return {
    name: `Keltner breakout ${period}/${mult}`,
    warmup: period + 20,
    indicators: (bars: Bar[]) => {
      const k = keltner(bars, period, mult);
      return { upper: k.upper, lower: k.lower, mid: k.mid, atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const { upper, lower, mid, atr: a } = ind;
      if (![upper[i], lower[i], mid[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price < mid[i]) return { kind: 'exit', reason: 'back to mid' };
        if (position.side === 'short' && price > mid[i]) return { kind: 'exit', reason: 'back to mid' };
        return null;
      }
      if (price > upper[i]) return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], reason: 'above upper Keltner' };
      if (price < lower[i]) return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], reason: 'below lower Keltner' };
      return null;
    },
    sweeps: [{ label: 'mult', values: [1.5, 2, 2.5, 3, 3.5], build: (p) => keltnerBreakout(period, p, stopAtr) }],
  };
}

/** Volatility breakout: today's open plus k x yesterday's range. */
export function volatilityBreakout(k = 0.5, stopAtr = 2): Strategy {
  return {
    name: `Volatility breakout ${k}x range`,
    warmup: 20,
    indicators: (bars: Bar[]) => ({ atr: atr(bars, 14) }),
    decide({ bars, i, position, ind }) {
      const a = ind.atr[i];
      if (!Number.isFinite(a) || i < 1) return null;
      if (position) return { kind: 'exit', reason: 'end of bar' }; // intraday-style: no carry
      const prev = bars[i - 1];
      const range = prev.high - prev.low;
      const bar = bars[i];
      if (range <= 0) return null;
      if (bar.close > bar.open + k * range) {
        return { kind: 'entry', side: 'long', stop: bar.close - stopAtr * a, reason: 'upside vol breakout' };
      }
      if (bar.close < bar.open - k * range) {
        return { kind: 'entry', side: 'short', stop: bar.close + stopAtr * a, reason: 'downside vol breakout' };
      }
      return null;
    },
    sweeps: [{ label: 'k', values: [0.25, 0.5, 0.75, 1.0, 1.5], build: (p) => volatilityBreakout(p, stopAtr) }],
  };
}

/**
 * Volatility contraction then expansion — trade breakouts only when the
 * preceding range was unusually tight. "Coiled spring" in retail language;
 * the testable version is ATR below its own recent average.
 */
export function volatilityContraction(squeezeLookback = 50, breakoutN = 20, stopAtr = 2): Strategy {
  return {
    name: `Vol contraction -> ${breakoutN}-bar breakout`,
    warmup: Math.max(squeezeLookback, breakoutN) + 20,
    indicators: (bars: Bar[]) => ({
      ap: atrPct(bars, 14),
      apMean: sma(atrPct(bars, 14).map((v) => (Number.isFinite(v) ? v : 0)), squeezeLookback),
      hi: priorHigh(bars, breakoutN),
      lo: priorLow(bars, breakoutN),
      atr: atr(bars, 14),
    }),
    decide({ bars, i, position, ind }) {
      const { ap, apMean, hi, lo, atr: a } = ind;
      if (![ap[i], apMean[i], hi[i], lo[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price < lo[i]) return { kind: 'exit', reason: 'lost breakout' };
        if (position.side === 'short' && price > hi[i]) return { kind: 'exit', reason: 'lost breakout' };
        return null;
      }
      if (ap[i] > apMean[i] * 0.8) return null; // not contracted enough
      if (price > hi[i]) return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], reason: 'squeeze breakout up' };
      if (price < lo[i]) return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], reason: 'squeeze breakout down' };
      return null;
    },
    sweeps: [{ label: 'breakout N', values: [10, 15, 20, 30, 40], build: (p) => volatilityContraction(squeezeLookback, p, stopAtr) }],
  };
}

// --------------------------------------------------------------- mean reversion

/** Z-score reversion, gated by a trend filter so it isn't a falling-knife catcher. */
export function zscoreReversion(period = 20, entryZ = 2, trendPeriod = 200, stopAtr = 2): Strategy {
  return {
    name: `Z-score ${entryZ} reversion (SMA${trendPeriod} filter)`,
    warmup: Math.max(period, trendPeriod) + 15,
    indicators: (bars: Bar[]) => {
      const c = closes(bars);
      return { z: zscore(c, period), mid: sma(c, period), trend: sma(c, trendPeriod), atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const { z, mid, trend, atr: a } = ind;
      if (![z[i], mid[i], trend[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price >= mid[i]) return { kind: 'exit', reason: 'reverted' };
        if (position.side === 'short' && price <= mid[i]) return { kind: 'exit', reason: 'reverted' };
        return null;
      }
      // Only buy dips inside an uptrend, only sell rips inside a downtrend.
      if (z[i] < -entryZ && price > trend[i]) {
        return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], target: mid[i], reason: `z=${z[i].toFixed(1)} in uptrend` };
      }
      if (z[i] > entryZ && price < trend[i]) {
        return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], target: mid[i], reason: `z=${z[i].toFixed(1)} in downtrend` };
      }
      return null;
    },
    sweeps: [{ label: 'entry Z', values: [1.5, 2, 2.5, 3, 3.5], build: (p) => zscoreReversion(period, p, trendPeriod, stopAtr) }],
  };
}

/** RSI(2) — the classic short-term reversion rule, with a long trend filter. */
export function rsi2Reversion(trendPeriod = 200, entry = 10, exit = 60, stopAtr = 3): Strategy {
  return {
    name: `RSI(2)<${entry} in SMA${trendPeriod} uptrend`,
    warmup: trendPeriod + 10,
    indicators: (bars: Bar[]) => {
      const c = closes(bars);
      return { r: rsi(c, 2), trend: sma(c, trendPeriod), atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const [r, t, a] = [ind.r[i], ind.trend[i], ind.atr[i]];
      if (![r, t, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) return r > exit ? { kind: 'exit', reason: `RSI(2)>${exit}` } : null;
      if (price > t && r < entry) {
        return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: `RSI(2)=${r.toFixed(0)} in uptrend` };
      }
      return null;
    },
    sweeps: [{ label: 'entry level', values: [5, 10, 15, 20, 25], build: (p) => rsi2Reversion(trendPeriod, p, exit, stopAtr) }],
  };
}

// --------------------------------------------------------------- combined filters

/** Momentum entry that stands aside when volatility is extreme. */
export function momentumVolFiltered(lookback = 100, volPeriod = 100, stopAtr = 3): Strategy {
  return {
    name: `Momentum ${lookback} + vol filter`,
    warmup: Math.max(lookback, volPeriod) + 20,
    indicators: (bars: Bar[]) => {
      const ap = atrPct(bars, 14);
      return {
        roc: roc(closes(bars), lookback),
        ap,
        apMean: sma(ap.map((v) => (Number.isFinite(v) ? v : 0)), volPeriod),
        atr: atr(bars, 14),
      };
    },
    decide({ bars, i, position, ind }) {
      const { roc: r, ap, apMean, atr: a } = ind;
      if (![r[i], ap[i], apMean[i], a[i]].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && r[i] < 0) return { kind: 'exit', reason: 'momentum gone' };
        if (position.side === 'short' && r[i] > 0) return { kind: 'exit', reason: 'momentum gone' };
        return null;
      }
      if (ap[i] > apMean[i] * 1.5) return null; // volatility spike — stand aside
      if (r[i] > 0) return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], reason: 'positive momentum, calm vol' };
      if (r[i] < 0) return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], reason: 'negative momentum, calm vol' };
      return null;
    },
    sweeps: [{ label: 'lookback', values: [50, 75, 100, 150, 200], build: (p) => momentumVolFiltered(p, volPeriod, stopAtr) }],
  };
}

/** Trend + ADX strength: only take trends the market is actually committing to. */
export function adxTrend(trendPeriod = 100, adxMin = 25, stopAtr = 2): Strategy {
  return {
    name: `SMA${trendPeriod} trend + ADX>${adxMin}`,
    warmup: Math.max(trendPeriod, 30) + 15,
    indicators: (bars: Bar[]) => ({ trend: sma(closes(bars), trendPeriod), adx: adx(bars, 14), atr: atr(bars, 14) }),
    decide({ bars, i, position, ind }) {
      const [t, ax, a] = [ind.trend[i], ind.adx[i], ind.atr[i]];
      if (![t, ax, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price < t) return { kind: 'exit', reason: 'lost trend' };
        if (position.side === 'short' && price > t) return { kind: 'exit', reason: 'lost trend' };
        return null;
      }
      if (ax < adxMin) return null; // no committed trend
      if (price > t) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, reason: `uptrend ADX ${ax.toFixed(0)}` };
      if (price < t) return { kind: 'entry', side: 'short', stop: price + stopAtr * a, reason: `downtrend ADX ${ax.toFixed(0)}` };
      return null;
    },
    sweeps: [{ label: 'ADX min', values: [15, 20, 25, 30, 35], build: (p) => adxTrend(trendPeriod, p, stopAtr) }],
  };
}

/** Breakout requiring BOTH volume confirmation and a trend filter. */
export function strictBreakout(lookback = 20, trendPeriod = 200, volMult = 2, stopAtr = 2): Strategy {
  return {
    name: `Strict breakout ${lookback} (vol>${volMult}x, SMA${trendPeriod})`,
    warmup: Math.max(lookback, trendPeriod) + 20,
    indicators: (bars: Bar[]) => ({
      hi: priorHigh(bars, lookback), lo: priorLow(bars, lookback),
      trend: sma(closes(bars), trendPeriod), vol: avgVolume(bars, 20), atr: atr(bars, 14),
    }),
    decide({ bars, i, position, ind }) {
      const { hi, lo, trend, vol, atr: a } = ind;
      if (![hi[i], lo[i], trend[i], a[i]].every(Number.isFinite)) return null;
      const bar = bars[i];
      const price = bar.close;
      if (position) {
        if (position.side === 'long' && price < lo[i]) return { kind: 'exit', reason: 'lost breakout' };
        if (position.side === 'short' && price > hi[i]) return { kind: 'exit', reason: 'lost breakout' };
        return null;
      }
      // Volume filter only applies where volume data exists (FX/indices often lack it).
      const hasVolume = Number.isFinite(vol[i]) && vol[i] > 0;
      if (hasVolume && bar.volume < vol[i] * volMult) return null;
      if (price > hi[i] && price > trend[i]) return { kind: 'entry', side: 'long', stop: price - stopAtr * a[i], reason: 'confirmed breakout' };
      if (price < lo[i] && price < trend[i]) return { kind: 'entry', side: 'short', stop: price + stopAtr * a[i], reason: 'confirmed breakdown' };
      return null;
    },
    sweeps: [{ label: 'vol mult', values: [1, 1.5, 2, 2.5, 3], build: (p) => strictBreakout(lookback, trendPeriod, p, stopAtr) }],
  };
}

export const EXTENDED_STRATEGIES = (): Strategy[] => [
  donchianTurtle(),
  timeSeriesMomentum(),
  macdCross(),
  chandelierTrend(),
  tripleEma(),
  longOnlyTrend(),
  keltnerBreakout(),
  volatilityBreakout(),
  volatilityContraction(),
  zscoreReversion(),
  rsi2Reversion(),
  momentumVolFiltered(),
  adxTrend(),
  strictBreakout(),
];
