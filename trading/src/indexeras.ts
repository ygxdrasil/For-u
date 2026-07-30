import { writeFileSync } from 'node:fs';
import { getIndexBars, INDICES, type IndexInterval } from './indexdata.js';
import { sliceByDate } from './data.js';
import { backtest } from './backtest.js';
import { buyAndHold, computeMetrics } from './metrics.js';
import { bootstrapExpectancy } from './validate.js';
import { ALL_STRATEGIES } from './strategies/index.js';
import { DEFAULT_CONFIG, type Bar } from './types.js';
import type { EraRow } from './eras.js';

/**
 * OUT-OF-SAMPLE TEST ON A DIFFERENT ASSET CLASS.
 *
 * EMA 20/50 held across three crypto eras. That could be a real trend-following
 * edge, or an artefact of crypto 2019-2026. Indices settle it: six decades the
 * strategy was never fitted to, spanning regimes crypto has never seen
 * (stagflation, 1987, dot-com, GFC, ZIRP).
 *
 * Caveat carried into the read: indices don't trade 24/7, so the exact 6h bar
 * has no equivalent. This tests the trend-following FAMILY on daily/weekly, not
 * that specific configuration.
 */

const ERAS = [
  { name: '1970s', from: '1970-01-01', to: '1979-12-31', note: 'stagflation, bear' },
  { name: '1980s', from: '1980-01-01', to: '1989-12-31', note: 'bull + 1987 crash' },
  { name: '1990s', from: '1990-01-01', to: '1999-12-31', note: 'bull, dot-com run' },
  { name: '2000s', from: '2000-01-01', to: '2009-12-31', note: 'dot-com bust + GFC' },
  { name: '2010s', from: '2010-01-01', to: '2019-12-31', note: 'long ZIRP bull' },
  { name: '2020s', from: '2020-01-01', to: '2026-07-31', note: 'COVID + inflation' },
];

const INTERVALS: IndexInterval[] = ['1d', '1wk'];

async function main() {
  const rows: EraRow[] = [];
  const skipped: string[] = [];

  for (const interval of INTERVALS) {
    for (const { symbol, name } of INDICES) {
      let full: Bar[];
      try {
        full = await getIndexBars(symbol, interval);
      } catch (err) {
        skipped.push(`${symbol} ${interval}: ${err instanceof Error ? err.message : err}`);
        continue;
      }
      process.stderr.write(`  ${name} ${interval}: ${full.length} bars\n`);

      for (const era of ERAS) {
        const bars = sliceByDate(full, era.from, era.to);
        // SMA200 warmup + room to trade. Weekly decades are ~520 bars, so the
        // 200-bar warmup eats a lot — require real headroom or skip.
        if (bars.length < 320) {
          skipped.push(`${symbol} ${interval} ${era.name}: ${bars.length} bars`);
          continue;
        }
        const bh = buyAndHold(bars, DEFAULT_CONFIG.startingEquity);
        for (const s of ALL_STRATEGIES()) {
          const r = backtest(bars, s);
          const m = computeMetrics(r);
          const rs = r.trades.map((t) => t.r);
          const ci = bootstrapExpectancy(rs, { iterations: 4000 });
          rows.push({
            product: name,
            timeframe: interval,
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
      await new Promise((r) => setTimeout(r, 400)); // be polite to Yahoo
    }
  }

  writeFileSync('trading/cache/index-era-results.json', JSON.stringify({ eras: ERAS, rows, skipped }));
  console.log(`\nDONE: ${rows.length} backtests, ${skipped.length} skipped.`);
}

main().catch((e) => {
  console.error('index sweep failed:', e);
  process.exit(1);
});
