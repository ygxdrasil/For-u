import { writeFileSync } from 'node:fs';
import { getBars, sliceByDate } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { ALL_STRATEGIES } from './strategies/index.js';
import { EXTENDED_STRATEGIES } from './strategies/extended.js';
import { ALL_MARKETS, type Market } from './universe.js';
import type { Bar, Strategy } from './types.js';

/**
 * THE WIDE SWEEP — every strategy against every market we can reach.
 *
 * Design notes:
 *  - Per-run bootstrap is deliberately NOT done here. Confidence intervals are
 *    computed in the report on POOLED trades, which is both faster and more
 *    honest: a CI on 12 trades is noise dressed as statistics.
 *  - Raw trade R-multiples are stored so any pooling can be done afterwards
 *    without re-running the sweep.
 */

const ERAS = [
  { name: 'pre-2010', from: '1990-01-01', to: '2009-12-31' },
  { name: '2010s', from: '2010-01-01', to: '2019-12-31' },
  { name: '2020s', from: '2020-01-01', to: '2026-07-31' },
];

export interface MegaRow {
  market: string;
  cls: string;
  era: string;
  strategy: string;
  bars: number;
  trades: number;
  wins: number;
  rs: number[];
  maxDdPct: number;
  sharpe: number;
  feeDragPct: number;
}

async function loadMarket(m: Market): Promise<Bar[] | null> {
  try {
    return m.source === 'coinbase'
      ? await getBars(m.symbol, '1d', 2500, { quiet: true })
      : await getIndexBars(m.symbol, '1d');
  } catch {
    return null;
  }
}

function runOne(bars: Bar[], s: Strategy) {
  const r = backtest(bars, s);
  let wins = 0;
  let peak = -Infinity;
  let maxDd = 0;
  for (const p of r.equityCurve) {
    peak = Math.max(peak, p.equity);
    if (peak > 0) maxDd = Math.max(maxDd, (peak - p.equity) / peak);
  }
  const rs: number[] = [];
  let fees = 0;
  let grossAbs = 0;
  for (const t of r.trades) {
    rs.push(t.r);
    if (t.pnl > 0) wins++;
    fees += t.feesPaid;
    grossAbs += Math.abs(t.pnl);
  }
  return { rs, wins, maxDd: maxDd * 100, feeDrag: grossAbs > 0 ? (fees / grossAbs) * 100 : 0 };
}

async function main() {
  const strategies = [...ALL_STRATEGIES(), ...EXTENDED_STRATEGIES()];
  const rows: MegaRow[] = [];
  const skipped: string[] = [];
  let loaded = 0;

  console.error(`Universe: ${ALL_MARKETS.length} markets x ${strategies.length} strategies x ${ERAS.length + 1} windows`);

  for (const m of ALL_MARKETS) {
    const full = await loadMarket(m);
    if (!full || full.length < 400) {
      skipped.push(`${m.name}: ${full ? full.length + ' bars' : 'fetch failed'}`);
      continue;
    }
    loaded++;

    const windows: { name: string; bars: Bar[] }[] = [{ name: 'full', bars: full }];
    for (const e of ERAS) {
      const slice = sliceByDate(full, e.from, e.to);
      if (slice.length >= 400) windows.push({ name: e.name, bars: slice });
    }

    for (const wdw of windows) {
      for (const s of strategies) {
        if (wdw.bars.length < s.warmup + 60) continue;
        const { rs, wins, maxDd, feeDrag } = runOne(wdw.bars, s);
        rows.push({
          market: m.name,
          cls: m.cls,
          era: wdw.name,
          strategy: s.name.replace(/\s+/g, ' ').trim(),
          bars: wdw.bars.length,
          trades: rs.length,
          wins,
          rs,
          maxDdPct: maxDd,
          sharpe: 0,
          feeDragPct: feeDrag,
        });
      }
    }
    console.error(`  ${m.name.padEnd(16)} ${m.cls.padEnd(13)} ${full.length} bars`);
    if (m.source === 'yahoo') await new Promise((r) => setTimeout(r, 300));
  }

  writeFileSync('trading/cache/mega-results.json', JSON.stringify({ rows, skipped, markets: loaded }));
  console.log(`\nDONE: ${rows.length} backtests over ${loaded} markets. ${skipped.length} skipped.`);
}

main().catch((e) => { console.error('mega sweep failed:', e); process.exit(1); });
