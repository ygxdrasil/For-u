import type { Bar, BacktestConfig, Strategy } from './types.js';
import { backtest } from './backtest.js';
import { computeMetrics, type Metrics } from './metrics.js';

/** Deterministic PRNG — reproducible Monte Carlo across runs. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Walk-forward
// ---------------------------------------------------------------------------

export interface WalkForwardResult {
  windows: { fromISO: string; toISO: string; inSampleCagr: number; outSampleCagr: number; trades: number }[];
  /** OOS return / IS return. Research bar: >=50% acceptable, >=60% good. */
  efficiency: number;
  totalOosTrades: number;
}

/**
 * Rolling walk-forward. Optimising and testing on the same data is how a
 * backtest lies; this measures how much of the in-sample edge survives on data
 * the parameters never saw.
 *
 * NOTE: this harness has no parameter optimiser yet, so IS and OOS use the same
 * fixed parameters. That makes this a REGIME-STABILITY test — does the edge hold
 * in later periods? — not a true anti-overfit test. It becomes the real thing
 * once an optimiser picks parameters per IS window.
 */
export function walkForward(
  bars: Bar[],
  strategy: Strategy,
  opts: { isFraction?: number; windows?: number; config?: Partial<BacktestConfig> } = {},
): WalkForwardResult {
  const isFraction = opts.isFraction ?? 0.75; // 3:1 IS:OOS, the common ratio
  const windowCount = opts.windows ?? 4;

  const windowSize = Math.floor(bars.length / windowCount);
  const results: WalkForwardResult['windows'] = [];
  let isSum = 0;
  let oosSum = 0;
  let totalOosTrades = 0;

  for (let w = 0; w < windowCount; w++) {
    const start = w * windowSize;
    const end = w === windowCount - 1 ? bars.length : start + windowSize;
    const slice = bars.slice(start, end);
    if (slice.length < strategy.warmup + 30) continue;

    const split = Math.floor(slice.length * isFraction);
    const isBars = slice.slice(0, split);
    const oosBars = slice.slice(split);
    if (oosBars.length < strategy.warmup + 10) continue;

    const isM = computeMetrics(backtest(isBars, strategy, opts.config));
    const oosM = computeMetrics(backtest(oosBars, strategy, opts.config));

    results.push({
      fromISO: new Date(slice[0].time * 1000).toISOString().slice(0, 10),
      toISO: new Date(slice[slice.length - 1].time * 1000).toISOString().slice(0, 10),
      inSampleCagr: isM.cagrPct,
      outSampleCagr: oosM.cagrPct,
      trades: oosM.trades,
    });
    isSum += isM.cagrPct;
    oosSum += oosM.cagrPct;
    totalOosTrades += oosM.trades;
  }

  return {
    windows: results,
    efficiency: isSum > 0 ? (oosSum / isSum) * 100 : oosSum > 0 ? 100 : 0,
    totalOosTrades,
  };
}

// ---------------------------------------------------------------------------
// Monte Carlo
// ---------------------------------------------------------------------------

export interface MonteCarloResult {
  iterations: number;
  /** From SHUFFLE: same trades, different order. Tests path dependency. */
  medianMaxDdPct: number;
  /** 95th-percentile drawdown — the number to size against. */
  p95MaxDdPct: number;
  /** From BOOTSTRAP: resampled with replacement. Tests sampling uncertainty. */
  medianReturnPct: number;
  ci95ReturnPct: [number, number];
  probLossPct: number;
}

const quantile = (sorted: number[], q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];

/** Replay a sequence of R-multiples through compounding, return [finalEquity, maxDD]. */
function replay(order: number[], startingEquity: number, riskPerTrade: number): [number, number] {
  let equity = startingEquity;
  let peak = equity;
  let maxDd = 0;
  for (const r of order) {
    equity += equity * riskPerTrade * r;
    if (equity <= 0) return [0, 1];
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, (peak - equity) / peak);
  }
  return [equity, maxDd];
}

/**
 * Two DIFFERENT resamplings, because they answer different questions.
 *
 *   SHUFFLE (no replacement) — same trades, reordered. Under multiplicative
 *     compounding the final return is order-INVARIANT (multiplication commutes),
 *     so this tells you nothing about return. What it does vary is the PATH,
 *     which is exactly what drawdown depends on. Use it for drawdown only.
 *
 *   BOOTSTRAP (with replacement) — draws a new sample of the same length from
 *     the observed trades. Composition changes, so this gives a genuine
 *     distribution of returns: "if my edge is real but luck redealt the cards,
 *     what range of outcomes should I expect?"
 *
 * Reporting a return CI from shuffling alone is a classic error — it produces a
 * zero-width interval that looks like precision and is an artefact.
 */
export function monteCarlo(
  tradeRs: number[],
  startingEquity: number,
  riskPerTrade: number,
  opts: { iterations?: number; seed?: number } = {},
): MonteCarloResult {
  const iterations = opts.iterations ?? 5000;
  const rand = mulberry32(opts.seed ?? 1337);
  if (tradeRs.length === 0) {
    return { iterations: 0, medianReturnPct: 0, ci95ReturnPct: [0, 0], medianMaxDdPct: 0, p95MaxDdPct: 0, probLossPct: 0 };
  }

  const drawdowns: number[] = [];
  const returns: number[] = [];
  let losses = 0;

  for (let iter = 0; iter < iterations; iter++) {
    // --- Shuffle, for the drawdown distribution.
    const shuffled = [...tradeRs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    drawdowns.push(replay(shuffled, startingEquity, riskPerTrade)[1] * 100);

    // --- Bootstrap, for the return distribution.
    const resampled = Array.from({ length: tradeRs.length }, () => tradeRs[Math.floor(rand() * tradeRs.length)]);
    const [equity] = replay(resampled, startingEquity, riskPerTrade);
    returns.push((equity / startingEquity - 1) * 100);
    if (equity < startingEquity) losses++;
  }

  returns.sort((a, b) => a - b);
  drawdowns.sort((a, b) => a - b);

  return {
    iterations,
    medianMaxDdPct: quantile(drawdowns, 0.5),
    p95MaxDdPct: quantile(drawdowns, 0.95),
    medianReturnPct: quantile(returns, 0.5),
    ci95ReturnPct: [quantile(returns, 0.025), quantile(returns, 0.975)],
    probLossPct: (losses / iterations) * 100,
  };
}

// ---------------------------------------------------------------------------
// Parameter sensitivity
// ---------------------------------------------------------------------------

export interface SensitivityResult {
  label: string;
  values: { param: number; expectancy: number; trades: number; cagrPct: number }[];
  /** Share of nearby parameter values that also produce positive expectancy. */
  robustnessPct: number;
}

/**
 * Sweep one parameter and check for a PLATEAU rather than a spike.
 *
 * If RSI(14) works but RSI(12) and RSI(16) both fail, that's overfitting — the
 * strategy found a quirk of this particular dataset. A real edge degrades
 * gracefully as you nudge parameters.
 */
export function sensitivity(
  bars: Bar[],
  label: string,
  params: number[],
  build: (p: number) => Strategy,
  config?: Partial<BacktestConfig>,
): SensitivityResult {
  const values = params.map((param) => {
    const m = computeMetrics(backtest(bars, build(param), config));
    return { param, expectancy: m.expectancy, trades: m.trades, cagrPct: m.cagrPct };
  });
  const positive = values.filter((v) => v.expectancy > 0 && v.trades > 0).length;
  return { label, values, robustnessPct: (positive / values.length) * 100 };
}

// ---------------------------------------------------------------------------
// Acceptance gates
// ---------------------------------------------------------------------------

export interface Gate {
  name: string;
  passed: boolean;
  detail: string;
}

/**
 * The pre-registered checklist a strategy must clear before it is allowed near
 * real money. Pre-registered matters: the gates are fixed in advance so they
 * can't be quietly relaxed to let a favourite strategy through.
 */
export function acceptanceGates(args: {
  strategy: Metrics;
  buyHold: Metrics;
  random: Metrics;
  stressed: Metrics;
  walk: WalkForwardResult;
  mc: MonteCarloResult;
  sensitivities: SensitivityResult[];
  maxDrawdownLimitPct: number;
}): Gate[] {
  const { strategy, buyHold, random, stressed, walk, mc, sensitivities, maxDrawdownLimitPct } = args;
  const minRobust = sensitivities.length ? Math.min(...sensitivities.map((s) => s.robustnessPct)) : 0;

  return [
    {
      name: 'Sufficient sample',
      passed: strategy.trades >= 200,
      detail: `${strategy.trades} trades (need ≥200; <100 is variance, not evidence)`,
    },
    {
      name: 'Positive expectancy',
      passed: strategy.expectancy > 0,
      detail: `${strategy.expectancy.toFixed(3)}R per trade`,
    },
    {
      name: 'Not a coin flip',
      passed: Number.isFinite(strategy.winRatePValue) && strategy.winRatePValue < 0.05,
      detail: `win-rate p=${strategy.winRatePValue.toFixed(3)} (need <0.05)`,
    },
    {
      name: 'Beats random control',
      passed: strategy.expectancy > random.expectancy,
      detail: `${strategy.expectancy.toFixed(3)}R vs coin-flip ${random.expectancy.toFixed(3)}R`,
    },
    {
      name: 'Beats buy & hold',
      passed: strategy.cagrPct > buyHold.cagrPct,
      detail: `${strategy.cagrPct.toFixed(1)}% vs ${buyHold.cagrPct.toFixed(1)}% CAGR`,
    },
    {
      name: 'Survives cost stress',
      passed: stressed.expectancy > 0,
      detail: `${stressed.expectancy.toFixed(3)}R at 3x fees/slippage`,
    },
    {
      name: 'Walk-forward stability',
      passed: walk.efficiency >= 50,
      detail: `efficiency ${walk.efficiency.toFixed(0)}% (need ≥50%)`,
    },
    {
      name: 'Parameter plateau',
      passed: minRobust >= 60,
      detail: `${minRobust.toFixed(0)}% of nearby params positive (need ≥60%)`,
    },
    {
      name: 'Monte Carlo drawdown',
      passed: mc.p95MaxDdPct <= maxDrawdownLimitPct,
      detail: `95th-pct DD ${mc.p95MaxDdPct.toFixed(1)}% (limit ${maxDrawdownLimitPct}%)`,
    },
  ];
}
