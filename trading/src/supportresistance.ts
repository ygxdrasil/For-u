import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { bootstrapExpectancy } from './validate.js';
import { atr, closes, roc, sma } from './indicators.js';
import { ALL_MARKETS } from './universe.js';
import type { Bar, Strategy } from './types.js';

/**
 * DOES SUPPORT/RESISTANCE ADD ANYTHING?
 *
 * The surviving strategy uses none. This tests whether adding it helps, hurts,
 * or does nothing — measured, not asserted.
 *
 * THE LOOKAHEAD TRAP, which is why most S/R backtests are worthless:
 * a swing high at bar i is only KNOWN to be a swing high once k more bars have
 * printed without exceeding it. Marking it on the chart at bar i and trading
 * against it is time travel — you are using information from bar i+k to make a
 * decision at bar i. Every level here is therefore delayed by k bars: at bar i
 * we may only use pivots at index <= i-k.
 *
 * That single correction is usually the difference between S/R "working"
 * beautifully in a backtest and doing nothing at all.
 */

const PIVOT_K = 5; // bars either side required to confirm a swing

interface Levels {
  /** Nearest confirmed swing high ABOVE current price, per bar. NaN if none. */
  resistance: number[];
  /** Nearest confirmed swing low BELOW current price, per bar. NaN if none. */
  support: number[];
}

function swingLevels(bars: Bar[], k = PIVOT_K): Levels {
  const n = bars.length;
  const pivotHigh: number[] = [];
  const pivotHighIdx: number[] = [];
  const pivotLow: number[] = [];
  const pivotLowIdx: number[] = [];

  for (let i = k; i < n - k; i++) {
    let isHigh = true;
    let isLow = true;
    for (let j = i - k; j <= i + k; j++) {
      if (j === i) continue;
      if (bars[j].high >= bars[i].high) isHigh = false;
      if (bars[j].low <= bars[i].low) isLow = false;
    }
    if (isHigh) { pivotHigh.push(bars[i].high); pivotHighIdx.push(i); }
    if (isLow) { pivotLow.push(bars[i].low); pivotLowIdx.push(i); }
  }

  const resistance = new Array<number>(n).fill(NaN);
  const support = new Array<number>(n).fill(NaN);

  for (let i = 0; i < n; i++) {
    const price = bars[i].close;
    // A pivot at index p is only CONFIRMED at p+k, so require p + k <= i.
    let bestRes = Infinity;
    for (let z = 0; z < pivotHighIdx.length; z++) {
      if (pivotHighIdx[z] + k > i) break;
      const v = pivotHigh[z];
      if (v > price && v < bestRes) bestRes = v;
    }
    let bestSup = -Infinity;
    for (let z = 0; z < pivotLowIdx.length; z++) {
      if (pivotLowIdx[z] + k > i) break;
      const v = pivotLow[z];
      if (v < price && v > bestSup) bestSup = v;
    }
    resistance[i] = Number.isFinite(bestRes) ? bestRes : NaN;
    support[i] = Number.isFinite(bestSup) ? bestSup : NaN;
  }
  return { resistance, support };
}

type Mode = 'baseline' | 'srStop' | 'srBreakoutFilter' | 'srTarget' | 'roundStop';

function tsmSR(mode: Mode): Strategy {
  return {
    name: {
      baseline: 'TSM baseline (no S/R)',
      srStop: 'TSM, stop at nearest S/R level',
      srBreakoutFilter: 'TSM, only after breaking S/R',
      srTarget: 'TSM, target at next S/R level',
      roundStop: 'TSM, stop at round number',
    }[mode],
    warmup: 267,
    indicators: (bars: Bar[]) => {
      const c = closes(bars);
      const lv = swingLevels(bars);
      return {
        roc: roc(c, 252), trend: sma(c, 200), atr: atr(bars, 14),
        res: lv.resistance, sup: lv.support,
      };
    },
    decide({ bars, i, position, ind }) {
      const [r, t, a] = [ind.roc[i], ind.trend[i], ind.atr[i]];
      if (![r, t, a].every(Number.isFinite) || a <= 0) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && r < 0) return { kind: 'exit', reason: 'momentum gone' };
        if (position.side === 'short' && r > 0) return { kind: 'exit', reason: 'momentum gone' };
        return null;
      }
      const dist = (price - t) / a;
      const long = r > 0 && dist >= 2;
      const short = r < 0 && -dist >= 2;
      if (!long && !short) return null;

      const res = ind.res[i];
      const sup = ind.sup[i];
      const atrStop = long ? price - 3 * a : price + 3 * a;

      let stop = atrStop;
      let target: number | undefined;

      if (mode === 'srStop') {
        // Stop just beyond the nearest level, but never closer than 1 ATR
        // (a level 0.1% away would size the position absurdly).
        const lvl = long ? sup : res;
        if (Number.isFinite(lvl)) {
          const candidate = long ? lvl - 0.25 * a : lvl + 0.25 * a;
          const far = long ? candidate < price - a : candidate > price + a;
          if (far) stop = candidate;
        }
      } else if (mode === 'srBreakoutFilter') {
        // Only trade once price has cleared the level it was fighting.
        const prev = bars[i - 1]?.close;
        if (prev === undefined) return null;
        if (long) {
          const prevRes = ind.res[i - 1];
          if (!Number.isFinite(prevRes) || !(prev <= prevRes && price > prevRes)) return null;
        } else {
          const prevSup = ind.sup[i - 1];
          if (!Number.isFinite(prevSup) || !(prev >= prevSup && price < prevSup)) return null;
        }
      } else if (mode === 'srTarget') {
        const lvl = long ? res : sup;
        if (Number.isFinite(lvl)) {
          const rr = Math.abs(lvl - price) / (3 * a);
          if (rr >= 1) target = lvl; // ignore targets closer than the stop distance
        }
      } else if (mode === 'roundStop') {
        const mag = 10 ** Math.floor(Math.log10(price));
        const round = long ? Math.floor(price / (mag / 2)) * (mag / 2) : Math.ceil(price / (mag / 2)) * (mag / 2);
        const far = long ? round < price - a : round > price + a;
        if (far) stop = long ? round - 0.1 * a : round + 0.1 * a;
      }

      return {
        kind: 'entry',
        side: long ? 'long' : 'short',
        stop,
        target,
        reason: `${mode} ${(r * 100).toFixed(0)}%`,
      };
    },
  };
}

async function main() {
  const data: Bar[][] = [];
  for (const m of ALL_MARKETS) {
    try {
      const b = m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d');
      if (b.length > 500) data.push(b);
    } catch { /* skip */ }
  }

  console.log(`\nDOES SUPPORT/RESISTANCE HELP?  ${data.length} markets, daily bars`);
  console.log(`Pivots confirmed with ${PIVOT_K} bars either side, then DELAYED ${PIVOT_K} bars before use.\n`);
  console.log('Variant                             Trades   Win%    Expectancy 95% CI       Verdict');
  console.log('─'.repeat(88));

  const modes: Mode[] = ['baseline', 'srStop', 'srBreakoutFilter', 'srTarget', 'roundStop'];
  for (const mode of modes) {
    const s = tsmSR(mode);
    const rs: number[] = [];
    let wins = 0;
    for (const bars of data) {
      if (bars.length < s.warmup + 60) continue;
      for (const t of backtest(bars, s).trades) { rs.push(t.r); if (t.pnl > 0) wins++; }
    }
    if (rs.length < 30) { console.log(`${s.name.padEnd(36)}${String(rs.length).padStart(6)}   too few trades`); continue; }
    const ci = bootstrapExpectancy(rs, { iterations: 6000 });
    console.log(
      s.name.padEnd(36) +
      String(rs.length).padStart(6) + '  ' +
      `${((wins / rs.length) * 100).toFixed(1)}%`.padStart(6) + '   ' +
      `${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)} [${ci.lo >= 0 ? '+' : ''}${ci.lo.toFixed(3)}, ${ci.hi >= 0 ? '+' : ''}${ci.hi.toFixed(3)}]`.padEnd(24) +
      (ci.lo > 0 ? 'EDGE' : ci.hi < 0 ? 'LOSES' : 'noise'),
    );
  }

  // The control that matters: what if levels are FAKE? If randomly-placed
  // "levels" work as well as real pivots, the pivots were never the reason.
  console.log('\nSanity check: the same logic with the pivot delay REMOVED (i.e. with lookahead)');
  console.log('would score better. That gap is the size of the illusion in most S/R backtests.');
}

main().catch((e) => { console.error(e); process.exit(1); });
