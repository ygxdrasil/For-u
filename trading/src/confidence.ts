import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { bootstrapExpectancy } from './validate.js';
import { timeSeriesMomentum } from './strategies/extended.js';
import { adx, atr, atrPct, closes, roc, rsi, sma } from './indicators.js';
import { ALL_MARKETS } from './universe.js';
import type { Bar } from './types.js';

/**
 * CAN TRADE OUTCOMES BE PREDICTED BEFORE ENTRY?
 *
 * "Only take the trades you're 75% sure about" assumes a confidence score exists.
 * The strategy has no such thing — it fires or it doesn't. But the claim IS
 * testable: capture features at the moment of entry, then check whether any of
 * them separate future winners from future losers.
 *
 * If some feature did, filtering on it would raise the win rate. If none does,
 * the request is not merely unimplemented — it's unavailable, and the honest
 * answer is that trade quality is unknowable at entry.
 *
 * Every feature below is computed from bars up to and including the SIGNAL bar,
 * never the entry bar or later. Using anything from the trade's own future
 * would manufacture exactly the predictive power we're testing for.
 */

interface Sample {
  r: number;
  won: boolean;
  adx: number;
  atrPct: number;
  momentum: number;
  distFromTrend: number;
  rsi: number;
  volRatio: number;
  cls: string;
}

async function load(): Promise<{ bars: Bar[]; cls: string }[]> {
  const out: { bars: Bar[]; cls: string }[] = [];
  for (const m of ALL_MARKETS) {
    try {
      const bars = m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d');
      if (bars.length > 400) out.push({ bars, cls: m.cls });
    } catch { /* skip */ }
  }
  return out;
}

function decile(samples: Sample[], key: keyof Sample, label: string) {
  const valid = samples.filter((s) => Number.isFinite(s[key] as number));
  if (valid.length < 200) return;
  const sorted = [...valid].sort((a, b) => (a[key] as number) - (b[key] as number));
  const n = Math.floor(sorted.length / 5);
  const buckets = [0, 1, 2, 3, 4].map((k) => sorted.slice(k * n, k === 4 ? sorted.length : (k + 1) * n));
  const cells = buckets.map((b) => {
    const wr = (b.filter((x) => x.won).length / b.length) * 100;
    const exp = b.reduce((a, x) => a + x.r, 0) / b.length;
    return `${wr.toFixed(0)}% / ${exp >= 0 ? '+' : ''}${exp.toFixed(2)}R`.padEnd(15);
  });
  console.log(`  ${label.padEnd(22)} ${cells.join('')}`);
}

async function main() {
  const markets = await load();
  const strategy = timeSeriesMomentum();
  const samples: Sample[] = [];

  for (const { bars, cls } of markets) {
    if (bars.length < strategy.warmup + 60) continue;
    const c = closes(bars);
    const ind = {
      adx: adx(bars, 14),
      ap: atrPct(bars, 14),
      mom: roc(c, 252),
      trend: sma(c, 200),
      rsi: rsi(c, 14),
      atr: atr(bars, 14),
    };
    const apMean = sma(ind.ap.map((v) => (Number.isFinite(v) ? v : 0)), 100);
    const byTime = new Map(bars.map((b, i) => [b.time, i]));

    for (const t of backtest(bars, strategy).trades) {
      // Entry fills at the open of the bar AFTER the signal, so the signal bar
      // is entryIdx-1. Read features there — never from the entry bar itself.
      const entryIdx = byTime.get(t.entryTime);
      if (entryIdx === undefined || entryIdx < 1) continue;
      const i = entryIdx - 1;
      if (!Number.isFinite(ind.trend[i]) || !Number.isFinite(ind.atr[i]) || ind.atr[i] <= 0) continue;
      samples.push({
        r: t.r,
        won: t.pnl > 0,
        adx: ind.adx[i],
        atrPct: ind.ap[i],
        momentum: Math.abs(ind.mom[i]),
        distFromTrend: (bars[i].close - ind.trend[i]) / ind.atr[i],
        rsi: ind.rsi[i],
        volRatio: apMean[i] > 0 ? ind.ap[i] / apMean[i] : NaN,
        cls,
      });
    }
  }

  const wr = (samples.filter((s) => s.won).length / samples.length) * 100;
  const base = bootstrapExpectancy(samples.map((s) => s.r), { iterations: 6000 });
  console.log(`\nCAN WE PREDICT WHICH TRADES WIN?  Time-series momentum, ${markets.length} markets`);
  console.log(`Baseline: ${samples.length} trades, ${wr.toFixed(1)}% win rate, ${base.point >= 0 ? '+' : ''}${base.point.toFixed(3)}R\n`);
  console.log('Each row sorts trades into 5 buckets by a feature known BEFORE entry.');
  console.log('If a feature predicted outcomes, win rate would climb across the row.\n');
  console.log('  Feature                lowest 20%     2nd            3rd            4th            highest 20%');
  console.log('  ' + '─'.repeat(94));
  decile(samples, 'adx', 'ADX (trend strength)');
  decile(samples, 'atrPct', 'Volatility (ATR%)');
  decile(samples, 'momentum', 'Momentum magnitude');
  decile(samples, 'distFromTrend', 'Distance from SMA200');
  decile(samples, 'rsi', 'RSI(14)');
  decile(samples, 'volRatio', 'Vol vs its average');

  // Best case: cherry-pick the single best bucket of the best feature IN SAMPLE,
  // which is the most generous possible reading of "only take good trades".
  let bestWr = 0;
  let bestLabel = '';
  for (const key of ['adx', 'atrPct', 'momentum', 'distFromTrend', 'rsi', 'volRatio'] as (keyof Sample)[]) {
    const valid = samples.filter((s) => Number.isFinite(s[key] as number));
    const sorted = [...valid].sort((a, b) => (a[key] as number) - (b[key] as number));
    const n = Math.floor(sorted.length / 5);
    for (let k = 0; k < 5; k++) {
      const b = sorted.slice(k * n, k === 4 ? sorted.length : (k + 1) * n);
      const w = (b.filter((x) => x.won).length / b.length) * 100;
      if (w > bestWr) { bestWr = w; bestLabel = `${key} bucket ${k + 1}`; }
    }
  }
  console.log(`\n  Best single bucket found anywhere (cherry-picked in-sample): ${bestWr.toFixed(1)}% win rate (${bestLabel})`);
  console.log(`  Target requested: 75%`);
}

main().catch((e) => { console.error(e); process.exit(1); });
