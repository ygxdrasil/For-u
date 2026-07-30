import { getBars } from './data.js';
import { backtest } from './backtest.js';
import { computeMetrics } from './metrics.js';
import { atr, closes, ema } from './indicators.js';
import type { Bar, Strategy } from './types.js';

/**
 * THE WIN-RATE / PAYOFF TRADE-OFF, measured.
 *
 * You can dial a strategy's win rate to almost any number you like by moving
 * the target closer and the stop further away. Nothing about the edge changes —
 * you are just relabelling the same price action.
 *
 * Breakeven condition at win rate W: avgWin/avgLoss > (1-W)/W.
 * At W=0.80 that's 0.25 — the winner only needs to be a quarter of the loser.
 * Sounds easy. The catch is that REACHING 80% forces the target so close to
 * entry that the payoff ratio falls below the line, and fees finish the job.
 *
 * Run this before believing any win-rate claim, including your own.
 */

function emaGeometry(targetAtr: number, stopAtr: number): Strategy {
  return {
    name: `EMA 20/50, target ${targetAtr}xATR / stop ${stopAtr}xATR`,
    warmup: 51,
    indicators: (bars: Bar[]) => ({
      fast: ema(closes(bars), 20),
      slow: ema(closes(bars), 50),
      atr: atr(bars, 14),
    }),
    decide({ bars, i, position, ind }) {
      const [f, s, pf, ps, a] = [ind.fast[i], ind.slow[i], ind.fast[i - 1], ind.slow[i - 1], ind.atr[i]];
      if (![f, s, pf, ps, a].every(Number.isFinite)) return null;
      if (position) return null; // let stop/target resolve it — geometry is the whole point
      const price = bars[i].close;
      const up = pf <= ps && f > s;
      const down = pf >= ps && f < s;
      if (up) return { kind: 'entry', side: 'long', stop: price - stopAtr * a, target: price + targetAtr * a, reason: 'cross up' };
      if (down) return { kind: 'entry', side: 'short', stop: price + stopAtr * a, target: price - targetAtr * a, reason: 'cross down' };
      return null;
    },
  };
}

const GEOMETRIES: [number, number][] = [
  [0.1, 8], [0.25, 6], [0.5, 5], [0.75, 4],
  [1, 3], [1.5, 2.5], [2, 2], [3, 2], [4, 2], [6, 2],
];

const PRODUCTS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'LINK-USD', 'LTC-USD', 'DOGE-USD'];

async function main() {
  const datasets: Bar[][] = [];
  for (const p of PRODUCTS) datasets.push(await getBars(p, '6h', 2500, { quiet: true }));

  console.log('\nWIN RATE vs PROFITABILITY — same signal, only the exit geometry changes');
  console.log(`Pooled across ${PRODUCTS.length} crypto markets, 6h bars\n`);
  console.log('Target/Stop     Win rate      Avg win   Avg loss   Payoff   Breakeven   Expectancy   Verdict');
  console.log('─'.repeat(96));

  for (const [t, s] of GEOMETRIES) {
    let trades = 0, wins = 0, sumWinR = 0, sumLossR = 0, sumR = 0;
    for (const bars of datasets) {
      const r = backtest(bars, emaGeometry(t, s));
      const m = computeMetrics(r);
      trades += m.trades;
      wins += Math.round(m.winRate * m.trades);
      for (const tr of r.trades) {
        sumR += tr.r;
        if (tr.pnl > 0) sumWinR += tr.r; else sumLossR += Math.abs(tr.r);
      }
    }
    if (trades === 0) continue;
    const wr = wins / trades;
    const avgWin = wins ? sumWinR / wins : 0;
    const avgLoss = trades - wins ? sumLossR / (trades - wins) : 0;
    const payoff = avgLoss ? avgWin / avgLoss : Infinity;
    const breakeven = (1 - wr) / wr; // required payoff to break even at this win rate
    const exp = sumR / trades;
    console.log(
      `${String(t).padStart(4)}/${String(s).padEnd(4)}  ` +
      `${(wr * 100).toFixed(1).padStart(9)}%  ` +
      `${avgWin.toFixed(2).padStart(9)}R  ` +
      `${avgLoss.toFixed(2).padStart(8)}R  ` +
      `${payoff.toFixed(2).padStart(7)}  ` +
      `${breakeven.toFixed(2).padStart(10)}  ` +
      `${(exp >= 0 ? '+' : '') + exp.toFixed(3)}`.padStart(13) +
      `   ${exp > 0 ? 'profits' : 'LOSES'}`,
    );
  }
  console.log('\nPayoff must EXCEED breakeven for the strategy to make money.');
  console.log('Raising the win rate lowers the payoff by exactly enough to cancel it out.');
}

main().catch((e) => { console.error(e); process.exit(1); });
