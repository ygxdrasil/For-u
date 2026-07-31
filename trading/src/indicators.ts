import type { Bar } from './types.js';

/**
 * Every function here is CAUSAL: the value at index i uses only bars 0..i.
 * Warmup indices are NaN, never 0 — a zero would be silently tradeable and
 * would fabricate signals before enough data exists.
 */

export function sma(values: number[], period: number): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    if (i >= period - 1) out[i] = sum / period;
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  const k = 2 / (period + 1);
  let prev = NaN;
  for (let i = 0; i < values.length; i++) {
    if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += values[j];
      prev = sum / period;
      out[i] = prev;
    } else if (i >= period) {
      prev = values[i] * k + prev * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

/** Wilder's RSI — the standard smoothing, not an SMA of gains/losses. */
export function rsi(values: number[], period = 14): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      if (i === period) out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
  }
  return out;
}

export function trueRange(bars: Bar[]): number[] {
  return bars.map((b, i) =>
    i === 0
      ? b.high - b.low
      : Math.max(b.high - b.low, Math.abs(b.high - bars[i - 1].close), Math.abs(b.low - bars[i - 1].close)),
  );
}

/** Average True Range (Wilder). Drives volatility-scaled stops. */
export function atr(bars: Bar[], period = 14): number[] {
  const out = new Array<number>(bars.length).fill(NaN);
  const tr = trueRange(bars);
  for (let i = 0; i < bars.length; i++) {
    if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += tr[j];
      out[i] = sum / period;
    } else if (i >= period) {
      out[i] = (out[i - 1] * (period - 1) + tr[i]) / period;
    }
  }
  return out;
}

/**
 * ADX (Wilder). The research consensus was blunt: RSI and Bollinger fades have
 * NO standalone edge — they need a regime filter. ADX is that filter.
 * Low ADX (<20-25) = ranging, mean reversion valid.
 * High ADX (>25)   = trending, mean reversion catches falling knives.
 */
export function adx(bars: Bar[], period = 14): number[] {
  const n = bars.length;
  const out = new Array<number>(n).fill(NaN);
  if (n < period * 2) return out;

  const tr = trueRange(bars);
  const plusDM = new Array<number>(n).fill(0);
  const minusDM = new Array<number>(n).fill(0);

  for (let i = 1; i < n; i++) {
    const up = bars[i].high - bars[i - 1].high;
    const down = bars[i - 1].low - bars[i].low;
    plusDM[i] = up > down && up > 0 ? up : 0;
    minusDM[i] = down > up && down > 0 ? down : 0;
  }

  let smTR = 0;
  let smPlus = 0;
  let smMinus = 0;
  const dx = new Array<number>(n).fill(NaN);

  for (let i = 1; i < n; i++) {
    if (i <= period) {
      smTR += tr[i];
      smPlus += plusDM[i];
      smMinus += minusDM[i];
    } else {
      smTR = smTR - smTR / period + tr[i];
      smPlus = smPlus - smPlus / period + plusDM[i];
      smMinus = smMinus - smMinus / period + minusDM[i];
    }
    if (i >= period && smTR > 0) {
      const pdi = (smPlus / smTR) * 100;
      const mdi = (smMinus / smTR) * 100;
      const sum = pdi + mdi;
      dx[i] = sum > 0 ? (Math.abs(pdi - mdi) / sum) * 100 : 0;
    }
  }

  let acc = 0;
  let count = 0;
  for (let i = period; i < n; i++) {
    if (!Number.isFinite(dx[i])) continue;
    count++;
    if (count <= period) {
      acc += dx[i];
      if (count === period) out[i] = acc / period;
    } else {
      out[i] = (out[i - 1] * (period - 1) + dx[i]) / period;
    }
  }
  return out;
}

/** Rolling max of the PRIOR `period` bars, excluding the current one. */
export function priorHigh(bars: Bar[], period: number): number[] {
  const out = new Array<number>(bars.length).fill(NaN);
  for (let i = period; i < bars.length; i++) {
    let m = -Infinity;
    for (let j = i - period; j < i; j++) m = Math.max(m, bars[j].high);
    out[i] = m;
  }
  return out;
}

export function priorLow(bars: Bar[], period: number): number[] {
  const out = new Array<number>(bars.length).fill(NaN);
  for (let i = period; i < bars.length; i++) {
    let m = Infinity;
    for (let j = i - period; j < i; j++) m = Math.min(m, bars[j].low);
    out[i] = m;
  }
  return out;
}

export function stddev(values: number[], period: number): number[] {
  const out = new Array<number>(values.length).fill(NaN);
  const means = sma(values, period);
  for (let i = period - 1; i < values.length; i++) {
    let acc = 0;
    for (let j = i - period + 1; j <= i; j++) acc += (values[j] - means[i]) ** 2;
    out[i] = Math.sqrt(acc / period);
  }
  return out;
}

/** Rolling mean volume — for the volume-confirmation filter on breakouts. */
export function avgVolume(bars: Bar[], period: number): number[] {
  return sma(bars.map((b) => b.volume), period);
}

export const closes = (bars: Bar[]): number[] => bars.map((b) => b.close);

// ---------------------------------------------------------------------------
// Extended indicator set for the wide sweep
// ---------------------------------------------------------------------------

/** MACD line, signal line, histogram. All causal. */
export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const f = ema(values, fast);
  const s = ema(values, slow);
  const line = values.map((_, i) => (Number.isFinite(f[i]) && Number.isFinite(s[i]) ? f[i] - s[i] : NaN));
  // EMA of the MACD line, skipping its NaN prefix so the signal isn't shifted.
  const firstValid = line.findIndex(Number.isFinite);
  const sig = new Array<number>(values.length).fill(NaN);
  if (firstValid >= 0) {
    const tail = ema(line.slice(firstValid), signal);
    for (let i = 0; i < tail.length; i++) sig[firstValid + i] = tail[i];
  }
  const hist = line.map((v, i) => (Number.isFinite(v) && Number.isFinite(sig[i]) ? v - sig[i] : NaN));
  return { line, signal: sig, hist };
}

/** Keltner channels: EMA mid, ATR-scaled bands. */
export function keltner(bars: Bar[], period = 20, mult = 2, atrPeriod = 14) {
  const mid = ema(closes(bars), period);
  const a = atr(bars, atrPeriod);
  return {
    mid,
    upper: mid.map((m, i) => (Number.isFinite(m) && Number.isFinite(a[i]) ? m + mult * a[i] : NaN)),
    lower: mid.map((m, i) => (Number.isFinite(m) && Number.isFinite(a[i]) ? m - mult * a[i] : NaN)),
  };
}

/** Rolling z-score of price vs its own mean — mean-reversion signal. */
export function zscore(values: number[], period = 20): number[] {
  const m = sma(values, period);
  const sd = stddev(values, period);
  return values.map((v, i) => (Number.isFinite(m[i]) && sd[i] > 0 ? (v - m[i]) / sd[i] : NaN));
}

/** Rate of change over `period` bars, as a fraction. */
export function roc(values: number[], period = 20): number[] {
  return values.map((v, i) => (i >= period && values[i - period] > 0 ? v / values[i - period] - 1 : NaN));
}

/** Chandelier exit levels: highest-high minus k*ATR (and the short mirror). */
export function chandelier(bars: Bar[], period = 22, mult = 3, atrPeriod = 22) {
  const a = atr(bars, atrPeriod);
  const longStop = new Array<number>(bars.length).fill(NaN);
  const shortStop = new Array<number>(bars.length).fill(NaN);
  for (let i = period - 1; i < bars.length; i++) {
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      hh = Math.max(hh, bars[j].high);
      ll = Math.min(ll, bars[j].low);
    }
    if (Number.isFinite(a[i])) {
      longStop[i] = hh - mult * a[i];
      shortStop[i] = ll + mult * a[i];
    }
  }
  return { longStop, shortStop };
}

/** True range as a fraction of close — normalised volatility. */
export function atrPct(bars: Bar[], period = 14): number[] {
  const a = atr(bars, period);
  return a.map((v, i) => (Number.isFinite(v) && bars[i].close > 0 ? v / bars[i].close : NaN));
}
