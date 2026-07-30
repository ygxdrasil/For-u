export interface Bar {
  /** Unix seconds, bar OPEN time */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Side = 'long' | 'short';

/** A decision made on the CLOSE of bar `i`, acted on at the OPEN of bar `i+1`. */
export interface Entry {
  kind: 'entry';
  side: Side;
  /** Absolute stop price. Required — a signal without an invalidation level is not a signal. */
  stop: number;
  /** Absolute take-profit. Omit for stop-only (strategy supplies the exit). */
  target?: number;
  reason: string;
}

export interface Exit {
  kind: 'exit';
  reason: string;
}

export type Decision = Entry | Exit | null;

export interface Position {
  side: Side;
  entryTime: number;
  entryPrice: number;
  stop: number;
  target?: number;
  size: number;
  /** Cash between entry and stop at entry. Denominator for R-multiples. */
  riskCash: number;
  reason: string;
}

export interface Trade {
  side: Side;
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  exitPrice: number;
  size: number;
  /** Net of fees and slippage. */
  pnl: number;
  /** pnl / riskCash — the only unit comparable across trades. */
  r: number;
  feesPaid: number;
  barsHeld: number;
  entryReason: string;
  exitReason: string;
  equityAfter: number;
}

export interface StrategyContext {
  bars: readonly Bar[];
  /** Index of the bar that just CLOSED. Reading beyond this is lookahead. */
  i: number;
  position: Position | null;
  /** Precomputed causal indicator series. */
  ind: Record<string, number[]>;
}

/** A parameter sweep for sensitivity testing — a strategy describes its own. */
export interface Sweep {
  label: string;
  values: number[];
  build: (p: number) => Strategy;
}

export interface Strategy {
  name: string;
  /** Bars required before the strategy may trade. */
  warmup: number;
  indicators?: (bars: Bar[]) => Record<string, number[]>;
  decide(ctx: StrategyContext): Decision;
  /**
   * Parameter sweeps for THIS strategy. Sensitivity testing is meaningless if it
   * sweeps some other strategy's knobs, so each one declares its own.
   */
  sweeps?: Sweep[];
}

export interface BacktestConfig {
  startingEquity: number;
  /** Fee as a fraction of notional, charged per side. 0.001 = 10bps. */
  feeRate: number;
  /** Slippage as a fraction of price, always against you. */
  slippage: number;
  /** Fraction of equity risked per trade (entry-to-stop distance). */
  riskPerTrade: number;
  /** Cap on notional as a multiple of equity, so tight stops can't over-lever. */
  maxLeverage: number;
}

/**
 * Research-backed defaults (see README):
 *  - 1% risk/trade is the professional norm; position size drives risk of ruin
 *    more than edge quality does.
 *  - 0.1% fee is a GENEROUS assumption. Coinbase retail taker is ~0.6%,
 *    Kraken ~0.4%. Raise it in the stress test and watch strategies die.
 */
export const DEFAULT_CONFIG: BacktestConfig = {
  startingEquity: 1_000,
  feeRate: 0.001,
  slippage: 0.0005,
  riskPerTrade: 0.01,
  maxLeverage: 3,
};
