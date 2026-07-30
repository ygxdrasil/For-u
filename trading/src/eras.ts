import { writeFileSync } from 'node:fs';
import { getBars, sliceByDate, type Timeframe } from './data.js';
import { backtest } from './backtest.js';
import { buyAndHold, computeMetrics } from './metrics.js';
import { bootstrapExpectancy } from './validate.js';
import { ALL_STRATEGIES } from './strategies/index.js';
import { DEFAULT_CONFIG, type Bar } from './types.js';

/**
 * ERA SWEEP — same charts, genuinely different times.
 *
 * The previous sweep ran every test on one overlapping 2019-2026 window and
 * called it 54 datasets. Crypto over that period is essentially ONE macro story,
 * so those runs were near-replicates, not independent evidence.
 *
 * This splits history into non-overlapping eras chosen to span opposite regimes,
 * so a strategy has to work in more than the one market it was lucky in.
 */

const PRODUCTS = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD',
  'AVAX-USD', 'LINK-USD', 'DOT-USD', 'LTC-USD', 'BCH-USD',
  'DOGE-USD', 'ATOM-USD', 'UNI-USD', 'AAVE-USD', 'ETC-USD',
  'FIL-USD', 'ALGO-USD', 'XLM-USD',
];

const ERAS = [
  { name: 'A 2019-10..2021-10', from: '2019-10-01', to: '2021-10-01', note: 'COVID crash + bull run' },
  { name: 'B 2021-10..2023-10', from: '2021-10-01', to: '2023-10-01', note: 'bear market' },
  { name: 'C 2023-10..2026-07', from: '2023-10-01', to: '2026-07-31', note: 'recovery + recent' },
];

const TIMEFRAMES: { tf: Timeframe; days: number }[] = [
  { tf: '1d', days: 2500 },
  { tf: '6h', days: 2500 },
];

export interface EraRow {
  product: string;
  timeframe: string;
  era: string;
  bars: number;
  strategy: string;
  trades: number;
  wins: number;
  winRate: number;
  expectancy: number;
  /** Bootstrap CI on expectancy — the CORRECT significance test. */
  expLo: number;
  expHi: number;
  expSignificant: boolean;
  returnPct: number;
  maxDdPct: number;
  sharpe: number;
  feeDragPct: number;
  buyHoldReturnPct: number;
  buyHoldSharpe: number;
  /** All trade R-multiples, so runs can be POOLED across instruments later. */
  rs: number[];
}

async function main() {
  const rows: EraRow[] = [];
  const skipped: string[] = [];

  for (const { tf, days } of TIMEFRAMES) {
    for (const product of PRODUCTS) {
      let full: Bar[];
      try {
        full = await getBars(product, tf, days, { quiet: true });
      } catch (err) {
        skipped.push(`${product} ${tf}: fetch failed`);
        continue;
      }

      for (const era of ERAS) {
        const bars = sliceByDate(full, era.from, era.to);
        // SMA200 needs 200 warmup; demand real room to trade beyond it.
        if (bars.length < 320) {
          skipped.push(`${product} ${tf} ${era.name}: ${bars.length} bars`);
          continue;
        }

        const bh = buyAndHold(bars, DEFAULT_CONFIG.startingEquity);
        for (const s of ALL_STRATEGIES()) {
          const r = backtest(bars, s);
          const m = computeMetrics(r);
          const rs = r.trades.map((t) => t.r);
          const ci = bootstrapExpectancy(rs, { iterations: 4000 });
          rows.push({
            product,
            timeframe: tf,
            era: era.name,
            bars: bars.length,
            strategy: s.name.replace(/\(\d+[^)]*\)/g, '').replace(/\s+/g, ' ').trim(),
            trades: m.trades,
            wins: Math.round(m.winRate * m.trades),
            winRate: m.winRate,
            expectancy: m.expectancy,
            expLo: ci.lo,
            expHi: ci.hi,
            expSignificant: ci.significant,
            returnPct: m.totalReturnPct,
            maxDdPct: m.maxDrawdownPct,
            sharpe: m.sharpe,
            feeDragPct: m.feeDragPct,
            buyHoldReturnPct: bh.totalReturnPct,
            buyHoldSharpe: bh.sharpe,
            rs,
          });
        }
      }
      process.stderr.write(`  ${product} ${tf}\n`);
    }
  }

  writeFileSync('trading/cache/era-results.json', JSON.stringify({ eras: ERAS, rows, skipped }));
  console.log(`\nDONE: ${rows.length} backtests, ${skipped.length} skipped.`);
}

main().catch((e) => {
  console.error('era sweep failed:', e);
  process.exit(1);
});
