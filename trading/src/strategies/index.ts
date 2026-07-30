import type { Bar, Strategy } from '../types.js';
import { adx, atr, avgVolume, closes, ema, priorHigh, priorLow, rsi, sma, stddev } from '../indicators.js';

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * THE CONTROL. Random direction, identical stop/target geometry and trade
 * frequency to the real strategies. A strategy that can't beat this is the same
 * coin flip wearing indicators. Most published retail strategies fail here.
 */
export function randomBenchmark(everyNBars = 20, atrPeriod = 14, seed = 42): Strategy {
  const rand = mulberry32(seed);
  return {
    name: `Random control (every ${everyNBars} bars)`,
    warmup: atrPeriod + 1,
    indicators: (bars) => ({ atr: atr(bars, atrPeriod) }),
    decide({ bars, i, position, ind }) {
      if (position || i % everyNBars !== 0) return null;
      const a = ind.atr[i];
      if (!Number.isFinite(a)) return null;
      const price = bars[i].close;
      const long = rand() < 0.5;
      return {
        kind: 'entry',
        side: long ? 'long' : 'short',
        stop: long ? price - 2 * a : price + 2 * a,
        target: long ? price + 3 * a : price - 3 * a,
        reason: 'coin flip',
      };
    },
    sweeps: [{ label: 'every N bars', values: [10, 15, 20, 30, 40], build: (p) => randomBenchmark(p, atrPeriod, seed) }],
  };
}

/**
 * Naked RSI. Included specifically as a NEGATIVE control — the research was
 * unambiguous that this has no standalone edge and catches falling knives in
 * trends. If this one passes the gates, suspect the harness, not the strategy.
 */
export function rsiNaked(period = 14, lower = 30, upper = 70, atrPeriod = 14): Strategy {
  return {
    name: `RSI(${period}) naked ${lower}/${upper}`,
    warmup: Math.max(period, atrPeriod) + 1,
    indicators: (bars) => ({ rsi: rsi(closes(bars), period), atr: atr(bars, atrPeriod) }),
    decide({ bars, i, position, ind }) {
      const r = ind.rsi[i];
      const a = ind.atr[i];
      if (!Number.isFinite(r) || !Number.isFinite(a)) return null;
      if (position) {
        if (position.side === 'long' && r > 50) return { kind: 'exit', reason: 'RSI back to 50' };
        if (position.side === 'short' && r < 50) return { kind: 'exit', reason: 'RSI back to 50' };
        return null;
      }
      const price = bars[i].close;
      if (r < lower) return { kind: 'entry', side: 'long', stop: price - 2 * a, target: price + 3 * a, reason: `RSI ${r.toFixed(0)}` };
      if (r > upper) return { kind: 'entry', side: 'short', stop: price + 2 * a, target: price - 3 * a, reason: `RSI ${r.toFixed(0)}` };
      return null;
    },
    sweeps: [
      { label: 'RSI period', values: [7, 10, 14, 20, 25], build: (p) => rsiNaked(p, lower, upper, atrPeriod) },
      { label: 'oversold', values: [20, 25, 30, 35, 40], build: (p) => rsiNaked(period, p, 100 - p, atrPeriod) },
    ],
  };
}

/**
 * RSI gated by ADX — the documented fix. ADX<25 means ranging, where mean
 * reversion is valid; above that the market is trending and oversold readings
 * persist all the way down.
 */
export function rsiWithAdxFilter(period = 14, lower = 30, upper = 70, adxMax = 25, atrPeriod = 14): Strategy {
  return {
    name: `RSI(${period}) + ADX<${adxMax} filter`,
    warmup: Math.max(period, atrPeriod, 28) + 1,
    indicators: (bars) => ({
      rsi: rsi(closes(bars), period),
      adx: adx(bars, 14),
      atr: atr(bars, atrPeriod),
    }),
    decide({ bars, i, position, ind }) {
      const r = ind.rsi[i];
      const ax = ind.adx[i];
      const a = ind.atr[i];
      if (![r, ax, a].every(Number.isFinite)) return null;
      if (position) {
        if (position.side === 'long' && r > 50) return { kind: 'exit', reason: 'reverted to 50' };
        if (position.side === 'short' && r < 50) return { kind: 'exit', reason: 'reverted to 50' };
        return null;
      }
      if (ax >= adxMax) return null; // trending — stand aside
      const price = bars[i].close;
      if (r < lower) return { kind: 'entry', side: 'long', stop: price - 2 * a, target: price + 3 * a, reason: `RSI ${r.toFixed(0)}, ADX ${ax.toFixed(0)}` };
      if (r > upper) return { kind: 'entry', side: 'short', stop: price + 2 * a, target: price - 3 * a, reason: `RSI ${r.toFixed(0)}, ADX ${ax.toFixed(0)}` };
      return null;
    },
    sweeps: [
      { label: 'RSI period', values: [7, 10, 14, 20, 25], build: (p) => rsiWithAdxFilter(p, lower, upper, adxMax, atrPeriod) },
      { label: 'ADX max', values: [15, 20, 25, 30, 35], build: (p) => rsiWithAdxFilter(period, lower, upper, p, atrPeriod) },
    ],
  };
}

/** Trend following: EMA crossover, exit on the opposite cross. */
export function emaCrossover(fast = 20, slow = 50, atrPeriod = 14): Strategy {
  return {
    name: `EMA ${fast}/${slow} crossover`,
    warmup: slow + 1,
    indicators: (bars) => ({
      fast: ema(closes(bars), fast),
      slow: ema(closes(bars), slow),
      atr: atr(bars, atrPeriod),
    }),
    decide({ bars, i, position, ind }) {
      const [f, s, pf, ps, a] = [ind.fast[i], ind.slow[i], ind.fast[i - 1], ind.slow[i - 1], ind.atr[i]];
      if (![f, s, pf, ps, a].every(Number.isFinite)) return null;
      const up = pf <= ps && f > s;
      const down = pf >= ps && f < s;
      if (position) {
        if (position.side === 'long' && down) return { kind: 'exit', reason: 'cross down' };
        if (position.side === 'short' && up) return { kind: 'exit', reason: 'cross up' };
        return null;
      }
      const price = bars[i].close;
      if (up) return { kind: 'entry', side: 'long', stop: price - 2 * a, reason: 'EMA cross up' };
      if (down) return { kind: 'entry', side: 'short', stop: price + 2 * a, reason: 'EMA cross down' };
      return null;
    },
    sweeps: [
      { label: 'fast EMA', values: [10, 15, 20, 25, 30], build: (p) => emaCrossover(p, slow, atrPeriod) },
      { label: 'slow EMA', values: [40, 50, 60, 75, 100], build: (p) => emaCrossover(fast, p, atrPeriod) },
    ],
  };
}

/**
 * Multi-timeframe trend filter + entry — the shape that showed the biggest
 * documented improvement (Quantpedia's BTC study: Sharpe 0.33 -> 0.80 from
 * adding a higher-timeframe filter). The filter works by REMOVING losing
 * trades, not by finding new winners.
 */
export function trendFilteredPullback(trendPeriod = 200, entryPeriod = 14, entryLevel = 40, atrPeriod = 14): Strategy {
  return {
    name: `SMA${trendPeriod} trend + RSI<${entryLevel} pullback`,
    warmup: trendPeriod + 1,
    indicators: (bars) => ({
      trend: sma(closes(bars), trendPeriod),
      rsi: rsi(closes(bars), entryPeriod),
      atr: atr(bars, atrPeriod),
    }),
    decide({ bars, i, position, ind }) {
      const [t, r, a] = [ind.trend[i], ind.rsi[i], ind.atr[i]];
      if (![t, r, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (r > 70) return { kind: 'exit', reason: 'RSI overbought' };
        if (price < t) return { kind: 'exit', reason: 'lost trend' };
        return null;
      }
      // Long-only: trade pullbacks inside an established uptrend.
      if (price > t && r < entryLevel) {
        return { kind: 'entry', side: 'long', stop: price - 2 * a, target: price + 4 * a, reason: `pullback in uptrend (RSI ${r.toFixed(0)})` };
      }
      return null;
    },
    sweeps: [
      { label: 'trend period', values: [100, 150, 200, 250, 300], build: (p) => trendFilteredPullback(p, entryPeriod, entryLevel, atrPeriod) },
      { label: 'entry level', values: [30, 35, 40, 45, 50], build: (p) => trendFilteredPullback(trendPeriod, entryPeriod, p, atrPeriod) },
    ],
  };
}

/** Donchian breakout with trend and volume confirmation. */
export function volumeBreakout(lookback = 20, trendPeriod = 100, volMult = 1.5, atrPeriod = 14): Strategy {
  return {
    name: `${lookback}-bar breakout + vol>${volMult}x`,
    warmup: Math.max(lookback, trendPeriod) + 1,
    indicators: (bars) => ({
      hi: priorHigh(bars, lookback),
      lo: priorLow(bars, lookback),
      trend: sma(closes(bars), trendPeriod),
      vol: avgVolume(bars, 20),
      atr: atr(bars, atrPeriod),
    }),
    decide({ bars, i, position, ind }) {
      const { hi, lo, trend, vol, atr: a } = ind;
      if (![hi[i], lo[i], trend[i], vol[i], a[i]].every(Number.isFinite)) return null;
      const bar = bars[i];
      const price = bar.close;

      if (position) {
        if (position.side === 'long' && price < lo[i]) return { kind: 'exit', reason: 'broke prior low' };
        if (position.side === 'short' && price > hi[i]) return { kind: 'exit', reason: 'broke prior high' };
        return null;
      }
      // Volume confirmation: unconfirmed breakouts are the classic fakeout.
      if (bar.volume < vol[i] * volMult) return null;
      if (price > hi[i] && price > trend[i]) {
        return { kind: 'entry', side: 'long', stop: price - 2 * a[i], reason: `breakout on ${(bar.volume / vol[i]).toFixed(1)}x vol` };
      }
      if (price < lo[i] && price < trend[i]) {
        return { kind: 'entry', side: 'short', stop: price + 2 * a[i], reason: `breakdown on ${(bar.volume / vol[i]).toFixed(1)}x vol` };
      }
      return null;
    },
    sweeps: [
      { label: 'lookback', values: [10, 15, 20, 30, 40], build: (p) => volumeBreakout(p, trendPeriod, volMult, atrPeriod) },
      { label: 'vol multiple', values: [1.0, 1.25, 1.5, 2.0, 2.5], build: (p) => volumeBreakout(lookback, trendPeriod, p, atrPeriod) },
    ],
  };
}

/** Bollinger fade, gated by ADX so it only trades genuinely ranging markets. */
export function bollingerFade(period = 20, mult = 2, adxMax = 25, atrPeriod = 14): Strategy {
  return {
    name: `Bollinger(${period},${mult}) fade + ADX<${adxMax}`,
    warmup: Math.max(period, atrPeriod, 28) + 1,
    indicators: (bars) => {
      const c = closes(bars);
      return { mid: sma(c, period), sd: stddev(c, period), adx: adx(bars, 14), atr: atr(bars, atrPeriod) };
    },
    decide({ bars, i, position, ind }) {
      const [mid, sd, ax, a] = [ind.mid[i], ind.sd[i], ind.adx[i], ind.atr[i]];
      if (![mid, sd, ax, a].every(Number.isFinite)) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && price >= mid) return { kind: 'exit', reason: 'reverted to mean' };
        if (position.side === 'short' && price <= mid) return { kind: 'exit', reason: 'reverted to mean' };
        return null;
      }
      if (ax >= adxMax) return null;
      if (price < mid - mult * sd) return { kind: 'entry', side: 'long', stop: price - 2 * a, target: mid, reason: 'below lower band' };
      if (price > mid + mult * sd) return { kind: 'entry', side: 'short', stop: price + 2 * a, target: mid, reason: 'above upper band' };
      return null;
    },
    sweeps: [
      { label: 'BB period', values: [10, 15, 20, 25, 30], build: (p) => bollingerFade(p, mult, adxMax, atrPeriod) },
      { label: 'BB stddev', values: [1.5, 1.75, 2.0, 2.5, 3.0], build: (p) => bollingerFade(period, p, adxMax, atrPeriod) },
    ],
  };
}

export const ALL_STRATEGIES = (): Strategy[] => [
  trendFilteredPullback(),
  emaCrossover(),
  volumeBreakout(),
  rsiWithAdxFilter(),
  bollingerFade(),
  rsiNaked(),
  randomBenchmark(),
];
