import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { atr, closes, roc, sma } from './indicators.js';
import { ALL_MARKETS } from './universe.js';
import type { Bar, Strategy } from './types.js';

/**
 * Two things the first S/R run left unproven:
 *
 *  1. Overlapping confidence intervals do NOT establish a difference. The
 *     correct test bootstraps the DIFFERENCE directly, resampling MARKETS (not
 *     trades) so correlated trades within a market stay together.
 *  2. The claim that removing the pivot delay would flatter the results was
 *     asserted, not measured. Here it is measured — the gap between the honest
 *     and the lookahead version is the size of the illusion.
 */

const K = 5;

function levels(bars: Bar[], delay: number) {
  const n = bars.length;
  const ph: number[] = []; const phi: number[] = [];
  const pl: number[] = []; const pli: number[] = [];
  for (let i = K; i < n - K; i++) {
    let hi = true, lo = true;
    for (let j = i - K; j <= i + K; j++) {
      if (j === i) continue;
      if (bars[j].high >= bars[i].high) hi = false;
      if (bars[j].low <= bars[i].low) lo = false;
    }
    if (hi) { ph.push(bars[i].high); phi.push(i); }
    if (lo) { pl.push(bars[i].low); pli.push(i); }
  }
  const res = new Array<number>(n).fill(NaN);
  const sup = new Array<number>(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    const p = bars[i].close;
    let br = Infinity, bs = -Infinity;
    for (let z = 0; z < phi.length; z++) { if (phi[z] + delay > i) break; if (ph[z] > p && ph[z] < br) br = ph[z]; }
    for (let z = 0; z < pli.length; z++) { if (pli[z] + delay > i) break; if (pl[z] < p && pl[z] > bs) bs = pl[z]; }
    res[i] = Number.isFinite(br) ? br : NaN;
    sup[i] = Number.isFinite(bs) ? bs : NaN;
  }
  return { res, sup };
}

function build(mode: 'baseline' | 'srStop' | 'srBreak', delay: number): Strategy {
  return {
    name: `${mode}-d${delay}`, warmup: 267,
    indicators: (bars) => {
      const c = closes(bars); const lv = levels(bars, delay);
      return { roc: roc(c, 252), trend: sma(c, 200), atr: atr(bars, 14), res: lv.res, sup: lv.sup };
    },
    decide({ bars, i, position, ind }) {
      const [r, t, a] = [ind.roc[i], ind.trend[i], ind.atr[i]];
      if (![r, t, a].every(Number.isFinite) || a <= 0) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && r < 0) return { kind: 'exit', reason: 'flip' };
        if (position.side === 'short' && r > 0) return { kind: 'exit', reason: 'flip' };
        return null;
      }
      const dist = (price - t) / a;
      const long = r > 0 && dist >= 2, short = r < 0 && -dist >= 2;
      if (!long && !short) return null;
      let stop = long ? price - 3 * a : price + 3 * a;
      if (mode === 'srStop') {
        const lvl = long ? ind.sup[i] : ind.res[i];
        if (Number.isFinite(lvl)) {
          const cand = long ? lvl - 0.25 * a : lvl + 0.25 * a;
          if (long ? cand < price - a : cand > price + a) stop = cand;
        }
      } else if (mode === 'srBreak') {
        const prev = bars[i - 1]?.close; if (prev === undefined) return null;
        if (long) { const pr = ind.res[i - 1]; if (!Number.isFinite(pr) || !(prev <= pr && price > pr)) return null; }
        else { const ps = ind.sup[i - 1]; if (!Number.isFinite(ps) || !(prev >= ps && price < ps)) return null; }
      }
      return { kind: 'entry', side: long ? 'long' : 'short', stop, reason: mode };
    },
  };
}

let seed = 90210;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

async function main() {
  const data: Bar[][] = [];
  for (const m of ALL_MARKETS) {
    try {
      const b = m.source === 'coinbase' ? await getBars(m.symbol, '1d', 2500, { quiet: true }) : await getIndexBars(m.symbol, '1d');
      if (b.length > 500) data.push(b);
    } catch {}
  }

  // Per-market R lists for each variant, so markets can be resampled as clusters.
  const perMarket = (s: Strategy) => data.map((bars) =>
    bars.length < s.warmup + 60 ? [] : backtest(bars, s).trades.map((t) => t.r));

  const base = perMarket(build('baseline', K));
  const variants: [string, number[][]][] = [
    ['stop at S/R level', perMarket(build('srStop', K))],
    ['only after S/R break', perMarket(build('srBreak', K))],
  ];

  const meanOf = (sets: number[][], idx: number[]) => {
    let sum = 0, n = 0;
    for (const i of idx) for (const r of sets[i]) { sum += r; n++; }
    return n ? sum / n : NaN;
  };

  console.log('\nPAIRED TEST — difference vs baseline, cluster-bootstrapped over markets');
  console.log('(resampling markets, not trades, so correlated trades stay together)\n');
  console.log('Variant                     mean difference   95% CI              significant?');
  console.log('-'.repeat(78));
  for (const [name, v] of variants) {
    const diffs: number[] = [];
    for (let it = 0; it < 5000; it++) {
      const idx = Array.from({ length: data.length }, () => Math.floor(rnd() * data.length));
      const d = meanOf(v, idx) - meanOf(base, idx);
      if (Number.isFinite(d)) diffs.push(d);
    }
    diffs.sort((a, b) => a - b);
    const lo = diffs[Math.floor(diffs.length * 0.025)], hi = diffs[Math.floor(diffs.length * 0.975)];
    const pt = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    console.log(
      name.padEnd(28) + `${pt >= 0 ? '+' : ''}${pt.toFixed(3)}R`.padStart(13) + '   ' +
      `[${lo >= 0 ? '+' : ''}${lo.toFixed(3)}, ${hi >= 0 ? '+' : ''}${hi.toFixed(3)}]`.padEnd(20) +
      (lo > 0 ? 'YES - real improvement' : hi < 0 ? 'YES - real harm' : 'NO - indistinguishable'));
  }

  // Out-of-sample: fitted pre-2020, tested 2020+. This dataset has been mined
  // heavily by now, so an in-sample improvement is cheap. This is the real check.
  const SPLIT = Date.parse('2020-01-01') / 1000;
  console.log('\n\nOUT-OF-SAMPLE CHECK — pre-2020 vs 2020+\n');
  console.log('Variant                     pre-2020 (trades)      2020+ (trades)');
  console.log('-'.repeat(72));
  for (const mode of ['baseline', 'srStop', 'srBreak'] as const) {
    const st = build(mode, K);
    const isR: number[] = []; const oosR: number[] = [];
    for (const bars of data) {
      if (bars.length < st.warmup + 60) continue;
      for (const t of backtest(bars, st).trades) (t.entryTime < SPLIT ? isR : oosR).push(t.r);
    }
    const m = (a: number[]) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
    console.log(
      (mode === 'baseline' ? 'baseline (no S/R)' : mode === 'srStop' ? 'stop at S/R level' : 'only after S/R break').padEnd(28) +
      `${m(isR) >= 0 ? '+' : ''}${m(isR).toFixed(3)}R (${isR.length})`.padEnd(23) +
      `${m(oosR) >= 0 ? '+' : ''}${m(oosR).toFixed(3)}R (${oosR.length})`);
  }

  // How much does removing the confirmation delay flatter the result?
  console.log('\n\nTHE LOOKAHEAD ILLUSION — same logic, pivots used the moment they form\n');
  console.log('Variant                     honest (delay 5)   with lookahead (delay 0)   inflation');
  console.log('-'.repeat(82));
  for (const mode of ['srStop', 'srBreak'] as const) {
    const honest = perMarket(build(mode, K)).flat();
    const cheat = perMarket(build(mode, 0)).flat();
    const m = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    const h = m(honest), c = m(cheat);
    console.log(
      (mode === 'srStop' ? 'stop at S/R level' : 'only after S/R break').padEnd(28) +
      `${h >= 0 ? '+' : ''}${h.toFixed(3)}R`.padStart(14) + '     ' +
      `${c >= 0 ? '+' : ''}${c.toFixed(3)}R`.padStart(16) + '        ' +
      `${(((c - h) / Math.abs(h)) * 100).toFixed(0)}%`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
