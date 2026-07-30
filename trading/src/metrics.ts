import type { Bar, Trade } from './types.js';
import type { BacktestResult } from './backtest.js';

export interface Metrics {
  strategy: string;
  trades: number;
  winRate: number;
  /** Mean R per trade. THIS decides whether a strategy is alive, not win rate. */
  expectancy: number;
  avgWinR: number;
  avgLossR: number;
  profitFactor: number;
  totalReturnPct: number;
  cagrPct: number;
  maxDrawdownPct: number;
  sharpe: number;
  totalFees: number;
  /** Fees as a share of absolute gross P&L — how much the venue ate. */
  feeDragPct: number;
  finalEquity: number;
  years: number;
  /** Probability this win rate came from a coin flip. >0.05 = indistinguishable from luck. */
  winRatePValue: number;
}

const SECONDS_PER_YEAR = 365.25 * 86400;

/**
 * Two-sided binomial p-value: could `wins` of `n` have come from a fair coin?
 * 30 trades at 60% wins looks great and is statistically noise. This is the
 * guard against betting real money on a lucky streak.
 */
export function winRatePValue(wins: number, n: number): number {
  if (n === 0) return 1;
  const logChoose = (k: number) => {
    let s = 0;
    for (let j = 1; j <= k; j++) s += Math.log(n - j + 1) - Math.log(j);
    return s;
  };
  let tail = 0;
  for (let k = Math.max(wins, n - wins); k <= n; k++) tail += Math.exp(logChoose(k) - n * Math.LN2);
  return Math.min(1, 2 * tail);
}

export function computeMetrics(result: BacktestResult): Metrics {
  const { trades, equityCurve, config } = result;
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);

  const grossProfit = wins.reduce((a, t) => a + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((a, t) => a + t.pnl, 0));
  const totalFees = trades.reduce((a, t) => a + t.feesPaid, 0);

  const finalEquity = equityCurve.length ? equityCurve[equityCurve.length - 1].equity : config.startingEquity;
  const years = (result.to - result.from) / SECONDS_PER_YEAR;

  let peak = -Infinity;
  let maxDd = 0;
  for (const p of equityCurve) {
    peak = Math.max(peak, p.equity);
    if (peak > 0) maxDd = Math.max(maxDd, (peak - p.equity) / peak);
  }

  const rets: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const prev = equityCurve[i - 1].equity;
    if (prev > 0) rets.push(equityCurve[i].equity / prev - 1);
  }
  const mean = rets.reduce((a, v) => a + v, 0) / (rets.length || 1);
  const sd = Math.sqrt(rets.reduce((a, v) => a + (v - mean) ** 2, 0) / (rets.length || 1));
  const barSeconds = equityCurve.length > 1 ? equityCurve[1].time - equityCurve[0].time : 86400;
  const barsPerYear = SECONDS_PER_YEAR / barSeconds;

  const meanR = (list: Trade[]) => (list.length ? list.reduce((a, t) => a + t.r, 0) / list.length : 0);

  return {
    strategy: result.strategy,
    trades: trades.length,
    winRate: trades.length ? wins.length / trades.length : 0,
    expectancy: meanR(trades),
    avgWinR: meanR(wins),
    avgLossR: meanR(losses),
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
    totalReturnPct: (finalEquity / config.startingEquity - 1) * 100,
    cagrPct: years > 0 && finalEquity > 0 ? ((finalEquity / config.startingEquity) ** (1 / years) - 1) * 100 : 0,
    maxDrawdownPct: maxDd * 100,
    sharpe: sd > 0 ? (mean / sd) * Math.sqrt(barsPerYear) : 0,
    totalFees,
    feeDragPct: grossProfit + grossLoss > 0 ? (totalFees / (grossProfit + grossLoss)) * 100 : 0,
    finalEquity,
    years,
    winRatePValue: winRatePValue(wins.length, trades.length),
  };
}

/** Buy first bar, hold to last. The bar every strategy must clear. */
export function buyAndHold(bars: Bar[], startingEquity: number): Metrics {
  const entry = bars[0].close;
  const units = startingEquity / entry;
  const years = (bars[bars.length - 1].time - bars[0].time) / SECONDS_PER_YEAR;

  let peak = -Infinity;
  let maxDd = 0;
  const rets: number[] = [];
  for (let i = 0; i < bars.length; i++) {
    const eq = units * bars[i].close;
    peak = Math.max(peak, eq);
    maxDd = Math.max(maxDd, (peak - eq) / peak);
    if (i > 0) rets.push(bars[i].close / bars[i - 1].close - 1);
  }
  const mean = rets.reduce((a, v) => a + v, 0) / (rets.length || 1);
  const sd = Math.sqrt(rets.reduce((a, v) => a + (v - mean) ** 2, 0) / (rets.length || 1));
  const barsPerYear = SECONDS_PER_YEAR / (bars[1].time - bars[0].time);
  const finalEquity = units * bars[bars.length - 1].close;

  return {
    strategy: 'Buy & Hold',
    trades: 1,
    winRate: NaN,
    expectancy: NaN,
    avgWinR: NaN,
    avgLossR: NaN,
    profitFactor: NaN,
    totalReturnPct: (finalEquity / startingEquity - 1) * 100,
    cagrPct: years > 0 ? ((finalEquity / startingEquity) ** (1 / years) - 1) * 100 : 0,
    maxDrawdownPct: maxDd * 100,
    sharpe: sd > 0 ? (mean / sd) * Math.sqrt(barsPerYear) : 0,
    totalFees: 0,
    feeDragPct: 0,
    finalEquity,
    years,
    winRatePValue: NaN,
  };
}

const pct = (v: number) => (Number.isFinite(v) ? `${v >= 0 ? '' : ''}${v.toFixed(1)}%` : '—');
const num = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : '—');

export function formatTable(rows: Metrics[]): string {
  const head = ['Strategy', 'Trades', 'Win%', 'Expect(R)', 'PF', 'Return', 'CAGR', 'MaxDD', 'Sharpe', 'p'];
  const body = rows.map((m) => [
    m.strategy.slice(0, 34),
    String(m.trades),
    Number.isFinite(m.winRate) ? `${(m.winRate * 100).toFixed(0)}%` : '—',
    num(m.expectancy, 3),
    Number.isFinite(m.profitFactor) ? num(m.profitFactor) : '∞',
    pct(m.totalReturnPct),
    pct(m.cagrPct),
    pct(m.maxDrawdownPct),
    num(m.sharpe),
    Number.isFinite(m.winRatePValue) ? num(m.winRatePValue, 3) : '—',
  ]);
  const widths = head.map((h, i) => Math.max(h.length, ...body.map((r) => r[i].length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  return [line(head), widths.map((w) => '─'.repeat(w)).join('  '), ...body.map(line)].join('\n');
}
