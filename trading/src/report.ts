import { readFileSync } from 'node:fs';

interface Row {
  product: string;
  timeframe: string;
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

const data = JSON.parse(readFileSync('trading/cache/sweep-results.json', 'utf8')) as {
  datasets: number;
  rows: Row[];
  failures: string[];
};

const median = (xs: number[]) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const frac = (n: number, d: number) => `${n}/${d} (${d ? ((n / d) * 100).toFixed(1) : '0.0'}%)`;
const pad = (s: string, w: number) => s.padEnd(w);
const padL = (s: string, w: number) => s.padStart(w);

const { rows } = data;
const strategies = [...new Set(rows.map((r) => r.strategy))];

console.log(`\n${'='.repeat(78)}`);
console.log(`AGGREGATE RESULTS — ${rows.length} backtests across ${data.datasets} datasets`);
console.log(`${'='.repeat(78)}\n`);

// ---------------------------------------------------------------- per strategy
console.log('PER-STRATEGY, POOLED ACROSS ALL MARKETS AND TIMEFRAMES\n');
const head = ['Strategy', 'Runs', 'Trades', 'Win rate', 'Expect(R)', 'MedRet', 'MedDD', 'MedSharpe'];
const w = [30, 5, 7, 18, 10, 9, 8, 9];
console.log(head.map((h, i) => pad(h, w[i])).join(' '));
console.log(w.map((x) => '─'.repeat(x)).join(' '));

interface Agg {
  strategy: string;
  runs: number;
  trades: number;
  wins: number;
  winRate: number;
  expectancy: number;
  profitableRuns: number;
  beatBh: number;
  beatRandom: number;
  significant: number;
  medRet: number;
  medDd: number;
  medSharpe: number;
  medPf: number;
  medFeeDrag: number;
}

const aggs: Agg[] = strategies.map((name) => {
  const rs = rows.filter((r) => r.strategy === name);
  const withTrades = rs.filter((r) => r.trades > 0);
  const totalTrades = rs.reduce((a, r) => a + r.trades, 0);
  const totalWins = rs.reduce((a, r) => a + r.wins, 0);
  return {
    strategy: name,
    runs: rs.length,
    trades: totalTrades,
    wins: totalWins,
    winRate: totalTrades ? totalWins / totalTrades : NaN,
    // Trade-weighted: a run with 200 trades should count more than one with 3.
    expectancy: totalTrades
      ? rs.reduce((a, r) => a + r.expectancy * r.trades, 0) / totalTrades
      : NaN,
    profitableRuns: withTrades.filter((r) => r.expectancy > 0).length,
    beatBh: withTrades.filter((r) => r.beatsBuyHold).length,
    beatRandom: withTrades.filter((r) => r.beatsRandom).length,
    significant: withTrades.filter((r) => r.pValue < 0.05).length,
    medRet: median(withTrades.map((r) => r.returnPct)),
    medDd: median(withTrades.map((r) => r.maxDdPct)),
    medSharpe: median(withTrades.map((r) => r.sharpe)),
    medPf: median(withTrades.filter((r) => Number.isFinite(r.profitFactor)).map((r) => r.profitFactor)),
    medFeeDrag: median(withTrades.map((r) => r.feeDragPct)),
  };
});

aggs.sort((a, b) => (b.expectancy || -99) - (a.expectancy || -99));

for (const a of aggs) {
  console.log(
    [
      pad(a.strategy.slice(0, 30), w[0]),
      padL(String(a.runs), w[1]),
      padL(String(a.trades), w[2]),
      pad(`${a.wins}/${a.trades} (${(a.winRate * 100).toFixed(1)}%)`, w[3]),
      padL(a.expectancy.toFixed(3), w[4]),
      padL(`${a.medRet.toFixed(1)}%`, w[5]),
      padL(`${a.medDd.toFixed(1)}%`, w[6]),
      padL(a.medSharpe.toFixed(2), w[7]),
    ].join(' '),
  );
}

// ------------------------------------------------------------------- hit rates
console.log(`\n\nHIT RATES — how often each strategy cleared each bar\n`);
const h2 = ['Strategy', 'Profitable runs', 'Beat buy&hold', 'Beat random', 'Stat. significant'];
const w2 = [30, 18, 18, 18, 18];
console.log(h2.map((x, i) => pad(x, w2[i])).join(' '));
console.log(w2.map((x) => '─'.repeat(x)).join(' '));
for (const a of aggs) {
  const n = rows.filter((r) => r.strategy === a.strategy && r.trades > 0).length;
  console.log(
    [
      pad(a.strategy.slice(0, 30), w2[0]),
      pad(frac(a.profitableRuns, n), w2[1]),
      pad(frac(a.beatBh, n), w2[2]),
      pad(frac(a.beatRandom, n), w2[3]),
      pad(frac(a.significant, n), w2[4]),
    ].join(' '),
  );
}

// ------------------------------------------------------------------ timeframes
console.log(`\n\nBY TIMEFRAME — pooled across all strategies and markets\n`);
const tfs = [...new Set(rows.map((r) => r.timeframe))];
const w3 = [10, 6, 8, 18, 10, 10, 10];
console.log(['TF', 'Runs', 'Trades', 'Win rate', 'Expect(R)', 'MedRet', 'FeeDrag'].map((x, i) => pad(x, w3[i])).join(' '));
console.log(w3.map((x) => '─'.repeat(x)).join(' '));
for (const tf of tfs) {
  const rs = rows.filter((r) => r.timeframe === tf && r.trades > 0);
  const tt = rs.reduce((a, r) => a + r.trades, 0);
  const tw = rs.reduce((a, r) => a + r.wins, 0);
  const exp = tt ? rs.reduce((a, r) => a + r.expectancy * r.trades, 0) / tt : NaN;
  console.log(
    [
      pad(tf, w3[0]),
      padL(String(rs.length), w3[1]),
      padL(String(tt), w3[2]),
      pad(`${tw}/${tt} (${((tw / tt) * 100).toFixed(1)}%)`, w3[3]),
      padL(exp.toFixed(3), w3[4]),
      padL(`${median(rs.map((r) => r.returnPct)).toFixed(1)}%`, w3[5]),
      padL(`${median(rs.map((r) => r.feeDragPct)).toFixed(1)}%`, w3[6]),
    ].join(' '),
  );
}

// --------------------------------------------------------------------- overall
const tradedRows = rows.filter((r) => r.trades > 0);
const realRows = tradedRows.filter((r) => !r.strategy.startsWith('Random'));
const allTrades = realRows.reduce((a, r) => a + r.trades, 0);
const allWins = realRows.reduce((a, r) => a + r.wins, 0);
const randomRows = tradedRows.filter((r) => r.strategy.startsWith('Random'));
const randTrades = randomRows.reduce((a, r) => a + r.trades, 0);
const randWins = randomRows.reduce((a, r) => a + r.wins, 0);

console.log(`\n\n${'='.repeat(78)}\nBOTTOM LINE\n${'='.repeat(78)}\n`);
console.log(`Backtests run                 ${rows.length} (${data.datasets} datasets x ${strategies.length} strategies)`);
console.log(`Total simulated trades        ${rows.reduce((a, r) => a + r.trades, 0)}`);
console.log(`\nReal strategies (excl. random control)`);
console.log(`  Overall win rate            ${frac(allWins, allTrades)}`);
console.log(`  Runs with positive edge     ${frac(realRows.filter((r) => r.expectancy > 0).length, realRows.length)}`);
console.log(`  Runs beating buy & hold     ${frac(realRows.filter((r) => r.beatsBuyHold).length, realRows.length)}`);
console.log(`  Runs statistically sig.     ${frac(realRows.filter((r) => r.pValue < 0.05).length, realRows.length)}`);
console.log(`  Runs with >=200 trades      ${frac(realRows.filter((r) => r.trades >= 200).length, realRows.length)}`);
console.log(`\nRandom control (the coin flip)`);
console.log(`  Overall win rate            ${frac(randWins, randTrades)}`);
console.log(`  Runs with positive edge     ${frac(randomRows.filter((r) => r.expectancy > 0).length, randomRows.length)}`);

// A strategy is only interesting if it clears everything at once.
const allGates = realRows.filter(
  (r) => r.expectancy > 0 && r.beatsBuyHold && r.beatsRandom && r.pValue < 0.05 && r.trades >= 200,
);
console.log(`\nRuns clearing ALL of: positive edge + beat buy&hold + beat random`);
console.log(`+ p<0.05 + >=200 trades`);
console.log(`  ${frac(allGates.length, realRows.length)}`);
if (allGates.length) {
  for (const r of allGates.slice(0, 10)) {
    console.log(`   - ${r.strategy} on ${r.product} ${r.timeframe}: ${r.trades} trades, ${(r.winRate * 100).toFixed(1)}% win, ${r.expectancy.toFixed(3)}R`);
  }
}
if (data.failures.length) console.log(`\nSkipped datasets: ${data.failures.length}`);
console.log('');
