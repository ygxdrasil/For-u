import { getBars, sliceByDate } from './data.js';
import { backtest } from './backtest.js';
import { computeMetrics } from './metrics.js';
import { bootstrapExpectancy } from './validate.js';
import { atr, closes, ema } from './indicators.js';
import { DEFAULT_CONFIG, type Bar, type Strategy } from './types.js';

/**
 * HEAD-TO-HEAD on identical data.
 *
 * The era sweep ran EMA with a cross-exit (no target). The geometry sweep ran it
 * with fixed ATR targets. Those were different samples, so their numbers were
 * never comparable. This settles which exit rule is actually better.
 *
 * CAVEAT, stated up front: by this point many configurations have been tried.
 * Picking the winner post-hoc is exactly the data-snooping the literature warns
 * about. The era-by-era columns are the guard — a configuration that only wins
 * overall, but not in each era, is a fitting artefact.
 */

const PRODUCTS = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD',
  'LINK-USD', 'DOT-USD', 'LTC-USD', 'BCH-USD', 'DOGE-USD', 'ATOM-USD',
  'UNI-USD', 'AAVE-USD', 'ETC-USD', 'FIL-USD', 'ALGO-USD', 'XLM-USD',
];

const ERAS = [
  { name: 'A bull 19-21', from: '2019-10-01', to: '2021-10-01' },
  { name: 'B bear 21-23', from: '2021-10-01', to: '2023-10-01' },
  { name: 'C rec 23-26', from: '2023-10-01', to: '2026-07-31' },
];

function emaVariant(opts: { targetAtr?: number; stopAtr: number; crossExit: boolean; label: string }): Strategy {
  return {
    name: opts.label,
    warmup: 51,
    indicators: (bars: Bar[]) => ({
      fast: ema(closes(bars), 20),
      slow: ema(closes(bars), 50),
      atr: atr(bars, 14),
    }),
    decide({ bars, i, position, ind }) {
      const [f, s, pf, ps, a] = [ind.fast[i], ind.slow[i], ind.fast[i - 1], ind.slow[i - 1], ind.atr[i]];
      if (![f, s, pf, ps, a].every(Number.isFinite)) return null;
      const up = pf <= ps && f > s;
      const down = pf >= ps && f < s;
      if (position) {
        if (!opts.crossExit) return null;
        if (position.side === 'long' && down) return { kind: 'exit', reason: 'cross down' };
        if (position.side === 'short' && up) return { kind: 'exit', reason: 'cross up' };
        return null;
      }
      const price = bars[i].close;
      const mk = (side: 'long' | 'short') => ({
        kind: 'entry' as const,
        side,
        stop: side === 'long' ? price - opts.stopAtr * a : price + opts.stopAtr * a,
        target: opts.targetAtr
          ? (side === 'long' ? price + opts.targetAtr * a : price - opts.targetAtr * a)
          : undefined,
        reason: `EMA cross ${side === 'long' ? 'up' : 'down'}`,
      });
      if (up) return mk('long');
      if (down) return mk('short');
      return null;
    },
  };
}

const VARIANTS = [
  emaVariant({ stopAtr: 2, crossExit: true, label: 'cross-exit, stop 2xATR (era-sweep version)' }),
  emaVariant({ stopAtr: 3, crossExit: true, label: 'cross-exit, stop 3xATR' }),
  emaVariant({ stopAtr: 2, targetAtr: 6, crossExit: false, label: 'target 6xATR, stop 2xATR (geometry winner)' }),
  emaVariant({ stopAtr: 2, targetAtr: 6, crossExit: true, label: 'target 6xATR, stop 2xATR, + cross-exit' }),
  emaVariant({ stopAtr: 2, targetAtr: 4, crossExit: true, label: 'target 4xATR, stop 2xATR, + cross-exit' }),
  emaVariant({ stopAtr: 3, targetAtr: 9, crossExit: true, label: 'target 9xATR, stop 3xATR, + cross-exit' }),
];

async function main() {
  const data: Bar[][] = [];
  for (const p of PRODUCTS) data.push(await getBars(p, '6h', 2500, { quiet: true }));

  console.log('\nHEAD-TO-HEAD — EMA 20/50 exit rules, 18 crypto markets, 6h bars\n');
  console.log('Variant                                     Trades  Win%   Overall     ' + ERAS.map((e) => e.name.padEnd(13)).join(''));
  console.log('─'.repeat(72 + ERAS.length * 13));

  for (const v of VARIANTS) {
    const all: number[] = [];
    let wins = 0;
    const eraR: number[][] = ERAS.map(() => []);

    for (const bars of data) {
      const r = backtest(bars, v);
      for (const t of r.trades) {
        all.push(t.r);
        if (t.pnl > 0) wins++;
      }
      ERAS.forEach((e, k) => {
        const slice = sliceByDate(bars, e.from, e.to);
        if (slice.length < 320) return;
        for (const t of backtest(slice, v).trades) eraR[k].push(t.r);
      });
    }

    const ci = bootstrapExpectancy(all, { iterations: 6000 });
    const eraCells = eraR.map((rs) => {
      if (rs.length < 30) return '—'.padEnd(13);
      const c = bootstrapExpectancy(rs, { iterations: 4000 });
      const mark = c.lo > 0 ? '*' : c.hi < 0 ? '!' : ' ';
      return `${c.point >= 0 ? '+' : ''}${c.point.toFixed(3)}${mark}`.padEnd(13);
    });

    console.log(
      v.name.padEnd(44) +
      String(all.length).padStart(6) + '  ' +
      `${((wins / all.length) * 100).toFixed(1)}%`.padStart(5) + '  ' +
      `${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}${ci.lo > 0 ? '*' : ' '}`.padEnd(10) + '  ' +
      eraCells.join(''),
    );
  }
  console.log('\n  * = 95% CI excludes zero    ! = reliably loses');

  // --- Full spec on the overall winner, including cost stress.
  console.log('\n\nCOST SENSITIVITY on the era-sweep version (fees are what kill small accounts)\n');
  const winner = VARIANTS[0];
  for (const mult of [1, 2, 3, 6]) {
    const rs: number[] = [];
    for (const bars of data) {
      const r = backtest(bars, winner, {
        feeRate: DEFAULT_CONFIG.feeRate * mult,
        slippage: DEFAULT_CONFIG.slippage * mult,
      });
      for (const t of r.trades) rs.push(t.r);
    }
    const ci = bootstrapExpectancy(rs, { iterations: 4000 });
    const label = mult === 1 ? '0.10% (pro tier)' : mult === 4 ? '0.40% (Kraken retail)' : `${(0.1 * mult).toFixed(2)}%`;
    console.log(`  fees ${label.padEnd(24)} expectancy ${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}R  [${ci.lo >= 0 ? '+' : ''}${ci.lo.toFixed(3)}, ${ci.hi >= 0 ? '+' : ''}${ci.hi.toFixed(3)}]  ${ci.lo > 0 ? 'EDGE' : 'no edge'}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
