import { writeFileSync } from 'node:fs';
import { getBars, type Timeframe } from './data.js';
import { backtest } from './backtest.js';
import { buyAndHold, computeMetrics, type Metrics } from './metrics.js';
import { monteCarlo } from './validate.js';
import { ALL_STRATEGIES } from './strategies/index.js';
import { DEFAULT_CONFIG } from './types.js';
import type { Bar } from './types.js';

/**
 * Batch sweep: every strategy against every (instrument, timeframe) dataset.
 *
 * The point is NOT to find the best number. It's to see whether any edge holds
 * ACROSS markets. A strategy that only works on one chart found a quirk of that
 * chart. Aggregate hit-rates across many independent datasets are the closest
 * thing to honest evidence a backtest can give you.
 */

const PRODUCTS = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD',
  'AVAX-USD', 'LINK-USD', 'DOT-USD', 'LTC-USD', 'BCH-USD',
  'DOGE-USD', 'ATOM-USD', 'UNI-USD', 'AAVE-USD', 'ETC-USD',
  'FIL-USD', 'ALGO-USD', 'XLM-USD',
];

/** Day counts scaled so each timeframe yields a comparable bar count. */
const TIMEFRAMES: { tf: Timeframe; days: number }[] = [
  { tf: '1d', days: 2500 },
  { tf: '6h', days: 800 },
  { tf: '1h', days: 200 },
];

interface Row {
  product: string;
  timeframe: string;
  bars: number;
  strategy: string;
  trades: number;
  wins: number;
  winRate: number;
  expectancy: number;
  profitFactor: number;
  returnPct: number;
  cagrPct: number;
  maxDdPct: number;
  sharpe: number;
  pValue: number;
  feeDragPct: number;
  beatsBuyHold: boolean;
  beatsRandom: boolean;
  buyHoldReturnPct: number;
  p95MonteCarloDdPct: number;
}

async function main() {
  const rows: Row[] = [];
  const failures: string[] = [];
  let datasets = 0;

  for (const { tf, days } of TIMEFRAMES) {
    for (const product of PRODUCTS) {
      let bars: Bar[];
      try {
        bars = await getBars(product, tf, days, { quiet: true });
      } catch (err) {
        failures.push(`${product} ${tf}: ${err instanceof Error ? err.message : err}`);
        continue;
      }
      // Need enough bars for the slowest warmup (SMA200) plus room to trade.
      if (bars.length < 300) {
        failures.push(`${product} ${tf}: only ${bars.length} bars, skipped`);
        continue;
      }
      datasets++;

      const strategies = ALL_STRATEGIES();
      const metrics = strategies.map((s) => ({ s, r: backtest(bars, s) }));
      const bh = buyAndHold(bars, DEFAULT_CONFIG.startingEquity);
      const randomM = metrics.find((m) => m.s.name.startsWith('Random'));
      const randomExpectancy = randomM ? computeMetrics(randomM.r).expectancy : 0;

      for (const { s, r } of metrics) {
        const m: Metrics = computeMetrics(r);
        const mc = monteCarlo(
          r.trades.map((t) => t.r),
          DEFAULT_CONFIG.startingEquity,
          DEFAULT_CONFIG.riskPerTrade,
          { iterations: 1000 },
        );
        rows.push({
          product,
          timeframe: tf,
          bars: bars.length,
          strategy: s.name.replace(/\(\d+[^)]*\)/g, '').replace(/\s+/g, ' ').trim(),
          trades: m.trades,
          wins: Math.round(m.winRate * m.trades),
          winRate: m.winRate,
          expectancy: m.expectancy,
          profitFactor: m.profitFactor,
          returnPct: m.totalReturnPct,
          cagrPct: m.cagrPct,
          maxDdPct: m.maxDrawdownPct,
          sharpe: m.sharpe,
          pValue: m.winRatePValue,
          feeDragPct: m.feeDragPct,
          beatsBuyHold: m.cagrPct > bh.cagrPct,
          beatsRandom: m.expectancy > randomExpectancy,
          buyHoldReturnPct: bh.totalReturnPct,
          p95MonteCarloDdPct: mc.p95MaxDdPct,
        });
      }
      process.stderr.write(`  ${product} ${tf}: ${bars.length} bars, ${strategies.length} strategies\n`);
    }
  }

  writeFileSync(
    'trading/cache/sweep-results.json',
    JSON.stringify({ generatedAt: new Date().toISOString(), datasets, rows, failures }, null, 2),
  );
  console.log(`\nDONE: ${rows.length} backtests across ${datasets} datasets.`);
  if (failures.length) console.log(`${failures.length} datasets skipped.`);
}

main().catch((e) => {
  console.error('sweep failed:', e);
  process.exit(1);
});
