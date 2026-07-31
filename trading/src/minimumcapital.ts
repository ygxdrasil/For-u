import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { atrPct } from './indicators.js';
import { ALL_MARKETS, type AssetClass } from './universe.js';
import type { Bar } from './types.js';

/**
 * WHAT ACCOUNT SIZE DOES THIS STRATEGY ACTUALLY REQUIRE?
 *
 * Three constraints bind, in this order:
 *
 *   1. FEE CEILING. The edge dies above ~0.25% per side (measured). Brokers
 *      charge max(minimum, rate x notional), so a MINIMUM COMMISSION sets a
 *      floor on position size: notional >= minCommission / 0.0025.
 *   2. POSITION SIZING. With 1% risk and a 3xATR stop, notional is
 *      equity x 0.01 / (3 x ATR%). Low-volatility markets need LESS equity per
 *      position because the stop is tighter and the position larger.
 *   3. DIVERSIFICATION. The edge is a breadth effect — it needs many positions
 *      at once. Van Tharp's portfolio-heat guidance caps total risk near 6-10%,
 *      so ~8 concurrent positions at 1% each.
 */

const RISK_PER_TRADE = 0.01;
const STOP_ATR_MULT = 3;
const FEE_CEILING = 0.0025; // above this the measured edge is gone
const CONCURRENT_POSITIONS = 8;

const BROKERS = [
  { name: 'Commission-free ETF broker', min: 0, rate: 0.0005, note: 'spread only' },
  { name: 'Nordnet/Avanza Sweden (small)', min: 0.9, rate: 0.0025, note: '~9 SEK min' },
  { name: 'IBKR tiered', min: 0.35, rate: 0.0005, note: '$0.35 min' },
  { name: 'IBKR fixed', min: 1.0, rate: 0.0005, note: '$1.00 min' },
  { name: 'Kraken crypto retail', min: 0, rate: 0.004, note: '0.40% — above ceiling' },
];

async function main() {
  const byClass = new Map<AssetClass, number[]>();
  for (const m of ALL_MARKETS) {
    let bars: Bar[];
    try {
      bars = m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d');
    } catch { continue; }
    const ap = atrPct(bars, 14).filter(Number.isFinite).slice(-500);
    if (!ap.length) continue;
    const med = [...ap].sort((a, b) => a - b)[Math.floor(ap.length / 2)];
    if (!byClass.has(m.cls)) byClass.set(m.cls, []);
    byClass.get(m.cls)!.push(med);
  }

  console.log('\nSTEP 1 — how big is one position, as a fraction of the account?\n');
  console.log('  Asset class     median ATR%   stop (3xATR)   position = equity x');
  console.log('  ' + '─'.repeat(70));
  const posFrac = new Map<AssetClass, number>();
  for (const [cls, arr] of byClass) {
    const med = [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)];
    const stop = STOP_ATR_MULT * med;
    const frac = RISK_PER_TRADE / stop;
    posFrac.set(cls, frac);
    console.log(`  ${cls.padEnd(15)} ${(med * 100).toFixed(2).padStart(8)}%   ${(stop * 100).toFixed(1).padStart(9)}%   ${frac.toFixed(3).padStart(14)}`);
  }
  console.log('\n  Lower volatility -> tighter stop -> BIGGER position for the same 1% risk.');

  console.log('\n\nSTEP 2 — minimum position size so commission stays under the 0.25% ceiling\n');
  console.log('  Broker                          min fee   required position notional');
  console.log('  ' + '─'.repeat(70));
  for (const b of BROKERS) {
    if (b.rate > FEE_CEILING) {
      console.log(`  ${b.name.padEnd(31)} ${('$' + b.min.toFixed(2)).padStart(7)}   IMPOSSIBLE — ${(b.rate * 100).toFixed(2)}% rate exceeds the ceiling`);
      continue;
    }
    const need = b.min > 0 ? b.min / FEE_CEILING : 0;
    console.log(`  ${b.name.padEnd(31)} ${('$' + b.min.toFixed(2)).padStart(7)}   ${need > 0 ? '$' + need.toFixed(0) : 'no minimum'}  (${b.note})`);
  }

  console.log(`\n\nSTEP 3 — account size needed, ${CONCURRENT_POSITIONS} concurrent positions\n`);
  console.log('  Broker                        equity-index   sector ETF     stock        commodity');
  console.log('  ' + '─'.repeat(78));
  const shown: AssetClass[] = ['equity-index', 'sector', 'stock', 'commodity'];
  for (const b of BROKERS) {
    if (b.rate > FEE_CEILING) continue;
    const cells = shown.map((cls) => {
      const frac = posFrac.get(cls);
      if (!frac) return 'n/a'.padStart(13);
      const needNotional = b.min > 0 ? b.min / FEE_CEILING : 50; // $50 floor as a practical minimum ticket
      const perPosition = needNotional / frac;
      return ('$' + Math.round(perPosition).toLocaleString()).padStart(13);
    });
    console.log(`  ${b.name.padEnd(29)}${cells.join('')}`);
  }
  console.log(`\n  Each cell = account size for ONE position of that type at 1% risk.`);
  console.log(`  Diversification does NOT multiply this: with 1% risk each, ${CONCURRENT_POSITIONS} positions`);
  console.log(`  fit inside the same account. The number above is the floor per position type.`);

  console.log(`\n\n${'='.repeat(78)}\nBOTTOM LINE\n${'='.repeat(78)}\n`);
  const idxFrac = posFrac.get('equity-index') ?? 0.2;
  for (const b of BROKERS.filter((x) => x.rate <= FEE_CEILING)) {
    const needNotional = b.min > 0 ? b.min / FEE_CEILING : 50;
    console.log(`  ${b.name.padEnd(31)} minimum viable account: $${Math.round(needNotional / idxFrac).toLocaleString()}`);
  }
  console.log(`\n  Crypto at retail fees (0.40-0.60%) cannot host this strategy at ANY account`);
  console.log(`  size — the fee rate alone exceeds the ceiling, regardless of position size.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
