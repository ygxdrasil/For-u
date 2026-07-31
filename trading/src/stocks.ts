import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { bootstrapExpectancy } from './validate.js';
import { atr, closes, roc, sma } from './indicators.js';
import { timeSeriesMomentum } from './strategies/extended.js';
import type { Bar } from './types.js';

const NAMES: [string, string][] = [
  ['NVDA', 'Nvidia'], ['TSLA', 'Tesla'], ['AAPL', 'Apple'], ['MSFT', 'Microsoft'],
  ['AMZN', 'Amazon'], ['GOOGL', 'Alphabet'], ['META', 'Meta'], ['AMD', 'AMD'],
  ['AVGO', 'Broadcom'], ['PLTR', 'Palantir'], ['JPM', 'JPMorgan'], ['XOM', 'Exxon'],
];

async function main() {
  console.log('\nCURRENT STRATEGY STATE — what the system actually says right now\n');
  console.log('Stock        Price      252d mom   ATR from SMA200   Signal');
  console.log('-'.repeat(72));
  const store: Record<string, Bar[]> = {};
  for (const [sym, name] of NAMES) {
    let bars: Bar[];
    try { bars = await getIndexBars(sym, '1d'); } catch { console.log(`${name.padEnd(12)} fetch failed`); continue; }
    store[sym] = bars;
    const c = closes(bars);
    const m = roc(c, 252), t = sma(c, 200), a = atr(bars, 14);
    const i = bars.length - 1;
    if (![m[i], t[i], a[i]].every(Number.isFinite)) { console.log(`${name.padEnd(12)} insufficient history`); continue; }
    const dist = (bars[i].close - t[i]) / a[i];
    const sig = m[i] > 0 && dist >= 2 ? 'LONG' : m[i] < 0 && -dist >= 2 ? 'SHORT' : '-';
    console.log(
      `${name.padEnd(12)} ${bars[i].close.toFixed(2).padStart(9)}  ${((m[i] * 100).toFixed(0) + '%').padStart(8)}   ${dist.toFixed(1).padStart(11)}      ${sig}`);
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log('\n\nHISTORICAL: how the validated strategy performed on each, full history\n');
  console.log('Stock        Bars   Trades  Win%    Expectancy 95% CI');
  console.log('-'.repeat(68));
  const s = timeSeriesMomentum();
  for (const [sym, name] of NAMES) {
    const bars = store[sym];
    if (!bars || bars.length < s.warmup + 60) { console.log(`${name.padEnd(12)} too little history`); continue; }
    const tr = backtest(bars, s).trades;
    if (tr.length < 10) { console.log(`${name.padEnd(12)} ${String(bars.length).padStart(5)}   ${String(tr.length).padStart(5)} trades - too few`); continue; }
    const rs = tr.map((t) => t.r);
    const wins = tr.filter((t) => t.pnl > 0).length;
    const ci = bootstrapExpectancy(rs, { iterations: 5000 });
    console.log(
      `${name.padEnd(12)} ${String(bars.length).padStart(5)}   ${String(tr.length).padStart(5)}  ${((wins / tr.length) * 100).toFixed(0).padStart(4)}%   ` +
      `${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)} [${ci.lo >= 0 ? '+' : ''}${ci.lo.toFixed(2)}, ${ci.hi >= 0 ? '+' : ''}${ci.hi.toFixed(2)}]  ` +
      (ci.lo > 0 ? 'EDGE' : ci.hi < 0 ? 'LOSES' : 'noise'));
  }

  console.log('\n\nBASE RATE: 5-year forward returns, all 12, every historical start date\n');
  console.log('Stock        5y windows   median 5y return   worst      best      P(loss over 5y)');
  console.log('-'.repeat(84));
  for (const [sym, name] of NAMES) {
    const bars = store[sym];
    if (!bars || bars.length < 1300) { console.log(`${name.padEnd(12)} insufficient history`); continue; }
    const H = 252 * 5;
    const rets: number[] = [];
    for (let i = 0; i + H < bars.length; i++) rets.push(bars[i + H].close / bars[i].close - 1);
    rets.sort((a, b) => a - b);
    const q = (p: number) => rets[Math.floor(rets.length * p)];
    console.log(
      `${name.padEnd(12)} ${String(rets.length).padStart(9)}   ${((q(0.5) * 100).toFixed(0) + '%').padStart(14)}   ` +
      `${((rets[0] * 100).toFixed(0) + '%').padStart(7)}   ${((rets[rets.length - 1] * 100).toFixed(0) + '%').padStart(8)}   ` +
      `${((rets.filter((x) => x < 0).length / rets.length * 100).toFixed(0) + '%').padStart(8)}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
