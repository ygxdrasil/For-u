import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { bootstrapExpectancy } from './validate.js';
import { timeSeriesMomentum, longOnlyTrend } from './strategies/extended.js';
import { emaCrossover } from './strategies/index.js';
import { ALL_MARKETS } from './universe.js';
import { DEFAULT_CONFIG, type Bar } from './types.js';

/**
 * Fee stress on the survivors. This is the question that decides whether a
 * backtested edge is reachable in practice: retail fee tiers are 0.4-0.6% on
 * crypto, and an edge measured at 0.1% may simply not exist at the rate a small
 * account actually pays.
 */
async function main() {
  const cache: Bar[][] = [];
  for (const m of ALL_MARKETS) {
    try {
      cache.push(m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d'));
    } catch { /* skip unreachable markets */ }
  }

  const survivors = [
    { name: 'Time-series momentum 252', s: timeSeriesMomentum() },
    { name: 'Long-only SMA200', s: longOnlyTrend() },
    { name: 'EMA 20/50 crossover', s: emaCrossover() },
  ];

  console.log(`\nFEE STRESS ON THE SURVIVORS — pooled over ${cache.length} markets, daily bars\n`);
  console.log('Strategy                      0.10%        0.25%        0.50%        1.00%');
  console.log('─'.repeat(78));
  for (const { name, s } of survivors) {
    const cells: string[] = [];
    for (const fee of [0.001, 0.0025, 0.005, 0.01]) {
      const rs: number[] = [];
      for (const bars of cache) {
        if (bars.length < s.warmup + 60) continue;
        for (const t of backtest(bars, s, { feeRate: fee, slippage: DEFAULT_CONFIG.slippage }).trades) rs.push(t.r);
      }
      const ci = bootstrapExpectancy(rs, { iterations: 4000 });
      cells.push(`${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}${ci.lo > 0 ? '*' : ci.hi < 0 ? '!' : ' '}`.padEnd(13));
    }
    console.log(name.padEnd(30) + cells.join(''));
  }
  console.log('\n  * = edge holds (CI excludes 0)   ! = reliably loses   blank = noise');
  console.log('  Kraken retail taker 0.40%.  Coinbase retail 0.60%.  Pro tiers reach 0.10%.');
}

main().catch((e) => { console.error(e); process.exit(1); });
