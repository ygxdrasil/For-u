import type { Bar, BacktestConfig, Position, Strategy, Trade } from './types.js';
import { DEFAULT_CONFIG } from './types.js';

export interface BacktestResult {
  strategy: string;
  trades: Trade[];
  /** Equity at every bar, marked to market — drawdown includes open losses. */
  equityCurve: { time: number; equity: number }[];
  config: BacktestConfig;
  bars: number;
  from: number;
  to: number;
}

/**
 * Event-driven backtest. Three rules decide whether a backtest means anything:
 *
 *   1. NO LOOKAHEAD. Decide on the close of bar i, fill at the open of bar i+1.
 *      You can never trade at a price you only knew afterwards. This single bug
 *      is why most homemade backtests show fake profits.
 *   2. COSTS ARE REAL. Fees and slippage on every entry and every exit.
 *   3. PESSIMISTIC INTRABAR. If a bar's range contains both stop and target,
 *      the stop wins. A bar records no internal ordering, so this is the only
 *      assumption that cannot flatter you.
 */
export function backtest(bars: Bar[], strategy: Strategy, cfgIn: Partial<BacktestConfig> = {}): BacktestResult {
  const config = { ...DEFAULT_CONFIG, ...cfgIn };
  const ind = strategy.indicators ? strategy.indicators(bars) : {};

  let equity = config.startingEquity;
  let position: Position | null = null;
  let entryBarIndex = 0;

  const trades: Trade[] = [];
  const equityCurve: { time: number; equity: number }[] = [];

  const closeOut = (rawExit: number, exitTime: number, i: number, reason: string) => {
    if (!position) return;
    const exitPrice = position.side === 'long'
      ? rawExit * (1 - config.slippage)
      : rawExit * (1 + config.slippage);

    const gross = position.side === 'long'
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;

    const entryFee = position.entryPrice * position.size * config.feeRate;
    const exitFee = exitPrice * position.size * config.feeRate;
    const pnl = gross - entryFee - exitFee;

    equity += pnl;
    trades.push({
      side: position.side,
      entryTime: position.entryTime,
      exitTime,
      entryPrice: position.entryPrice,
      exitPrice,
      size: position.size,
      pnl,
      r: pnl / position.riskCash,
      feesPaid: entryFee + exitFee,
      barsHeld: i - entryBarIndex,
      entryReason: position.reason,
      exitReason: reason,
      equityAfter: equity,
    });
    position = null;
  };

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];

    // 1. Resolve any open position against THIS bar, before deciding anything new.
    if (position) {
      const hitStop = position.side === 'long' ? bar.low <= position.stop : bar.high >= position.stop;
      const hitTarget = position.target !== undefined
        && (position.side === 'long' ? bar.high >= position.target : bar.low <= position.target);

      if (hitStop) {
        // Gap-through: if the bar opened past the stop you fill at the open, not the stop.
        const gapped = position.side === 'long' ? bar.open < position.stop : bar.open > position.stop;
        closeOut(gapped ? bar.open : position.stop, bar.time, i, gapped ? 'stop (gap)' : 'stop');
      } else if (hitTarget) {
        closeOut(position.target!, bar.time, i, 'target');
      }
    }

    // 2. Mark to market so drawdown reflects unrealised losses too.
    let marked = equity;
    if (position) {
      marked += position.side === 'long'
        ? (bar.close - position.entryPrice) * position.size
        : (position.entryPrice - bar.close) * position.size;
    }
    equityCurve.push({ time: bar.time, equity: marked });

    // 3. Decide on this close; act on the next open.
    if (i < strategy.warmup || i + 1 >= bars.length) continue;

    const decision = strategy.decide({ bars, i, position, ind });
    if (!decision) continue;

    const next = bars[i + 1];

    if (decision.kind === 'exit') {
      if (position) closeOut(next.open, next.time, i + 1, decision.reason);
      continue;
    }

    if (position) continue; // one position at a time, no pyramiding

    const fill = decision.side === 'long'
      ? next.open * (1 + config.slippage)
      : next.open * (1 - config.slippage);

    // Reject a stop already on the wrong side of the fill.
    if (decision.side === 'long' && decision.stop >= fill) continue;
    if (decision.side === 'short' && decision.stop <= fill) continue;

    const stopDistance = Math.abs(fill - decision.stop);
    if (!Number.isFinite(stopDistance) || stopDistance <= 0) continue;

    let size = (equity * config.riskPerTrade) / stopDistance;
    size = Math.min(size, (equity * config.maxLeverage) / fill); // cap leverage
    if (!Number.isFinite(size) || size <= 0) continue;

    position = {
      side: decision.side,
      entryTime: next.time,
      entryPrice: fill,
      stop: decision.stop,
      target: decision.target,
      size,
      riskCash: size * stopDistance,
      reason: decision.reason,
    };
    entryBarIndex = i + 1;
  }

  // Close anything still open, so results aren't hiding an unrealised loser.
  if (position) {
    const last = bars[bars.length - 1];
    closeOut(last.close, last.time, bars.length - 1, 'end of data');
  }

  return {
    strategy: strategy.name,
    trades,
    equityCurve,
    config,
    bars: bars.length,
    from: bars[0].time,
    to: bars[bars.length - 1].time,
  };
}
