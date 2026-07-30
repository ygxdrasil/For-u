import { getBars, type Timeframe } from './data.js';
import { backtest } from './backtest.js';
import { buyAndHold, computeMetrics, formatTable, type Metrics } from './metrics.js';
import { acceptanceGates, monteCarlo, sensitivity, walkForward } from './validate.js';
import { ALL_STRATEGIES } from './strategies/index.js';
import { DEFAULT_CONFIG } from './types.js';

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
}

async function main() {
  const product = arg('product', 'BTC-USD');
  const timeframe = arg('tf', '1d') as Timeframe;
  const days = Number(arg('days', '2500'));
  const maxDdLimit = Number(arg('maxdd', '25'));

  console.log(`\nFetching ${product} ${timeframe}, ${days} days of history...`);
  const bars = await getBars(product, timeframe, days);
  const first = new Date(bars[0].time * 1000).toISOString().slice(0, 10);
  const last = new Date(bars[bars.length - 1].time * 1000).toISOString().slice(0, 10);
  console.log(`${bars.length} bars, ${first} to ${last}\n`);

  // --- 1. Headline comparison, every strategy against both controls.
  const strategies = ALL_STRATEGIES();
  const results = strategies.map((s) => backtest(bars, s));
  const rows: Metrics[] = results.map(computeMetrics);
  rows.push(buyAndHold(bars, DEFAULT_CONFIG.startingEquity));

  console.log('BACKTEST RESULTS');
  console.log(formatTable(rows));
  console.log(
    '\nExpect(R) = average profit per trade in units of risk. It, not win rate,\n' +
    'decides profitability. p = probability the win rate came from a coin flip.\n',
  );

  // --- 2. Full validation, run on the best strategy by expectancy.
  const ranked = rows
    .filter((m) => m.trades > 1 && !m.strategy.startsWith('Random') && m.strategy !== 'Buy & Hold')
    .sort((a, b) => b.expectancy - a.expectancy);

  if (ranked.length === 0) {
    console.log('No strategy produced tradeable results. Nothing to validate.');
    return;
  }

  const bestName = ranked[0].strategy;
  const bestIdx = strategies.findIndex((s) => s.name === bestName);
  const best = strategies[bestIdx];
  console.log(`${'='.repeat(72)}\nVALIDATING TOP STRATEGY: ${bestName}\n${'='.repeat(72)}\n`);

  // Cost stress: 3x fees and slippage, per the research recommendation.
  const stressed = computeMetrics(
    backtest(bars, best, { feeRate: DEFAULT_CONFIG.feeRate * 3, slippage: DEFAULT_CONFIG.slippage * 3 }),
  );
  console.log(`Cost stress (3x fees/slippage): ${stressed.expectancy.toFixed(3)}R, ${stressed.totalReturnPct.toFixed(1)}% return`);

  const walk = walkForward(bars, best);
  console.log(`\nWalk-forward (${walk.windows.length} windows):`);
  for (const w of walk.windows) {
    console.log(`  ${w.fromISO}..${w.toISO}  IS ${w.inSampleCagr.toFixed(1)}%  OOS ${w.outSampleCagr.toFixed(1)}%  (${w.trades} trades)`);
  }
  console.log(`  Efficiency: ${walk.efficiency.toFixed(0)}% of in-sample return survived out-of-sample`);

  const bestResult = results[bestIdx];
  const mc = monteCarlo(
    bestResult.trades.map((t) => t.r),
    DEFAULT_CONFIG.startingEquity,
    DEFAULT_CONFIG.riskPerTrade,
  );
  console.log(`\nMonte Carlo (${mc.iterations} iterations):`);
  console.log(`  -- shuffle (reorder same trades) -> path/drawdown risk`);
  console.log(`  Median max DD   ${mc.medianMaxDdPct.toFixed(1)}%`);
  console.log(`  95th-pct max DD ${mc.p95MaxDdPct.toFixed(1)}%   <- size for THIS, not the historical path`);
  console.log(`  -- bootstrap (resample with replacement) -> outcome uncertainty`);
  console.log(`  Median return   ${mc.medianReturnPct.toFixed(1)}%`);
  console.log(`  95% CI          ${mc.ci95ReturnPct[0].toFixed(1)}% .. ${mc.ci95ReturnPct[1].toFixed(1)}%`);
  console.log(`  P(losing money) ${mc.probLossPct.toFixed(1)}%`);

  // Sweep the VALIDATED strategy's own parameters — sweeping another
  // strategy's knobs would say nothing about this one's robustness.
  const sens = (best.sweeps ?? []).map((s) => sensitivity(bars, s.label, s.values, s.build));
  console.log('\nParameter sensitivity (want a plateau, not a spike):');
  if (sens.length === 0) console.log('  (strategy declares no sweeps)');
  for (const s of sens) {
    const cells = s.values.map((v) => `${v.param}:${v.expectancy >= 0 ? '+' : ''}${v.expectancy.toFixed(2)}`).join('  ');
    console.log(`  ${s.label.padEnd(14)} ${cells}   [${s.robustnessPct.toFixed(0)}% positive]`);
  }

  // --- 3. Gates.
  const randomM = rows.find((m) => m.strategy.startsWith('Random'))!;
  const bhM = rows.find((m) => m.strategy === 'Buy & Hold')!;
  const gates = acceptanceGates({
    strategy: ranked[0],
    buyHold: bhM,
    random: randomM,
    stressed,
    walk,
    mc,
    sensitivities: sens,
    maxDrawdownLimitPct: maxDdLimit,
  });

  console.log(`\n${'='.repeat(72)}\nACCEPTANCE GATES\n${'='.repeat(72)}`);
  for (const g of gates) {
    console.log(`  ${g.passed ? 'PASS' : 'FAIL'}  ${g.name.padEnd(26)} ${g.detail}`);
  }
  const passed = gates.filter((g) => g.passed).length;
  console.log(`\n  ${passed}/${gates.length} gates passed.`);
  console.log(
    passed === gates.length
      ? '  Cleared for paper trading. Not for real money until paper confirms it.\n'
      : '  NOT cleared. Failing any gate means this does not trade real money.\n',
  );
}

main().catch((err) => {
  console.error('\nFailed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
