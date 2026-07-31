import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { bootstrapExpectancy } from './validate.js';
import { atr, closes, roc, sma } from './indicators.js';
import { ALL_MARKETS } from './universe.js';
import { DEFAULT_CONFIG, type Bar, type Strategy } from './types.js';

/**
 * The three requested constraints, tested:
 *   1. a confidence filter  -> approximated by the ONLY feature that showed a
 *      real gradient (distance from SMA200), threshold fitted pre-2020 and
 *      tested 2020+ so the cherry-pick doesn't flatter it
 *   2. minimum 1:2 reward-to-risk
 *   3. $20 for 3 months
 */

function tsmFiltered(opts: { minDistAtr?: number; targetMult?: number }): Strategy {
  const { minDistAtr = -Infinity, targetMult } = opts;
  return {
    name: `TSM${minDistAtr > -Infinity ? ` dist>${minDistAtr}ATR` : ''}${targetMult ? ` 1:${targetMult}` : ' no target'}`,
    warmup: 267,
    indicators: (bars: Bar[]) => {
      const c = closes(bars);
      return { roc: roc(c, 252), trend: sma(c, 200), atr: atr(bars, 14) };
    },
    decide({ bars, i, position, ind }) {
      const [r, t, a] = [ind.roc[i], ind.trend[i], ind.atr[i]];
      if (![r, t, a].every(Number.isFinite) || a <= 0) return null;
      const price = bars[i].close;
      if (position) {
        if (position.side === 'long' && r < 0) return { kind: 'exit', reason: 'momentum gone' };
        if (position.side === 'short' && r > 0) return { kind: 'exit', reason: 'momentum gone' };
        return null;
      }
      const dist = (price - t) / a;
      const stopDist = 3 * a;
      if (r > 0) {
        if (dist < minDistAtr) return null;
        return {
          kind: 'entry', side: 'long', stop: price - stopDist,
          target: targetMult ? price + targetMult * stopDist : undefined,
          reason: `momentum +, ${dist.toFixed(1)} ATR above trend`,
        };
      }
      if (r < 0) {
        if (-dist < minDistAtr) return null;
        return {
          kind: 'entry', side: 'short', stop: price + stopDist,
          target: targetMult ? price - targetMult * stopDist : undefined,
          reason: `momentum -, ${(-dist).toFixed(1)} ATR below trend`,
        };
      }
      return null;
    },
  };
}

const SPLIT = Date.parse('2020-01-01') / 1000;

async function main() {
  const markets: Bar[][] = [];
  for (const m of ALL_MARKETS) {
    try {
      const b = m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d');
      if (b.length > 400) markets.push(b);
    } catch { /* skip */ }
  }

  const variants = [
    tsmFiltered({}),
    tsmFiltered({ minDistAtr: 1 }),
    tsmFiltered({ minDistAtr: 2 }),
    tsmFiltered({ targetMult: 2 }),
    tsmFiltered({ minDistAtr: 1, targetMult: 2 }),
    tsmFiltered({ minDistAtr: 2, targetMult: 2 }),
    tsmFiltered({ minDistAtr: 1, targetMult: 3 }),
  ];

  console.log('\nFILTER + 1:2 RULE, fitted pre-2020 / tested 2020+ (out-of-sample)\n');
  console.log('Variant                        IN-SAMPLE (pre-2020)          OUT-OF-SAMPLE (2020+)');
  console.log('                               trades  win%   exp            trades  win%   exp');
  console.log('─'.repeat(92));

  const results: { name: string; oosR: number[]; oosTrades: number; oosWr: number; oosExp: number }[] = [];

  for (const v of variants) {
    const isR: number[] = [];
    const oosR: number[] = [];
    let isW = 0;
    let oosW = 0;
    for (const bars of markets) {
      if (bars.length < v.warmup + 60) continue;
      for (const t of backtest(bars, v).trades) {
        if (t.entryTime < SPLIT) { isR.push(t.r); if (t.pnl > 0) isW++; }
        else { oosR.push(t.r); if (t.pnl > 0) oosW++; }
      }
    }
    const isCi = bootstrapExpectancy(isR, { iterations: 3000 });
    const oosCi = bootstrapExpectancy(oosR, { iterations: 3000 });
    const fmt = (n: number, w: number, ci: { point: number; lo: number; hi: number }) =>
      `${String(n).padStart(6)}  ${((w / n) * 100).toFixed(1).padStart(5)}%  ` +
      `${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}${ci.lo > 0 ? '*' : ci.hi < 0 ? '!' : ' '}`.padEnd(11);
    console.log(v.name.padEnd(31) + fmt(isR.length, isW, isCi) + '   ' + fmt(oosR.length, oosW, oosCi));
    results.push({ name: v.name, oosR, oosTrades: oosR.length, oosWr: oosW / oosR.length, oosExp: oosCi.point });
  }
  console.log('\n  * = CI excludes zero    ! = reliably loses');

  // ---- $20 over 3 months, using the OUT-OF-SAMPLE trade distribution.
  console.log(`\n\n${'='.repeat(80)}\n$20 FOR 3 MONTHS\n${'='.repeat(80)}\n`);

  // Trades per market per quarter, measured on the 2020+ window (~6.6 years).
  const YEARS_OOS = 6.58;
  let seed = 20260731;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (const r of results) {
    if (r.oosTrades < 50) continue;
    const perMarketPerQuarter = r.oosTrades / markets.length / (YEARS_OOS * 4);
    // Realistically tradeable at $20: Kraken minimums force one or two markets.
    const nTrades = Math.max(1, Math.round(perMarketPerQuarter * 2));
    const outs: number[] = [];
    for (let it = 0; it < 20000; it++) {
      let eq = 20;
      for (let k = 0; k < nTrades; k++) {
        eq += eq * DEFAULT_CONFIG.riskPerTrade * r.oosR[Math.floor(rand() * r.oosR.length)];
        if (eq <= 0) { eq = 0; break; }
      }
      outs.push(eq);
    }
    outs.sort((a, b) => a - b);
    const q = (p: number) => outs[Math.floor(outs.length * p)];
    console.log(
      `${r.name.padEnd(31)} ~${String(nTrades).padStart(2)} trades/qtr  ` +
      `median $${q(0.5).toFixed(2)}  ` +
      `5-95%: $${q(0.05).toFixed(2)}-$${q(0.95).toFixed(2)}  ` +
      `P(loss) ${((outs.filter((x) => x < 20).length / outs.length) * 100).toFixed(0)}%`,
    );
  }
  console.log('\n  Risk is 1% of equity per trade = $0.20 on a $20 account.');
  console.log('  Kraken minimum order: BTC $3.24, ETH $2.60, SOL $9.00.');
}

main().catch((e) => { console.error(e); process.exit(1); });
