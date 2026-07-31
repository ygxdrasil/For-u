# Paper trading journal

```bash
npx tsx trading/src/paper.ts     # run once per day, after US close
```

## The strategy

The only thing that survived the full sweep (5,670 backtests, 77 markets, 7 asset classes):

```
Signal:   252-day momentum positive (long) or negative (short)
Filter:   price >2 ATR away from its SMA200
Stop:     3 x ATR(14), fixed at entry
Exit:     momentum flips sign — no profit target
Risk:     1% of equity per trade
```

Measured out-of-sample (fitted pre-2020, tested 2020+): **+0.317R per trade, 25.8% win rate.**

## Portfolio limits

| Limit | Value | Why |
|---|---|---|
| Max positions | 8 | portfolio heat |
| Max per asset class | 2 | correlation |
| Max total heat | 8% | Van Tharp guidance |

The first unconstrained run opened 15 positions, **nine of them equity**. Those move
together — one bet sized nine times, not nine bets. That's the same correlation error
the crypto sweep exposed, reproduced live. Hence the limits.

## The one rule

**Signals are written to disk with their timestamp before the outcome is known, and
never edited.** No adjusting an entry after the fact, no quietly dropping a loser, no
"I wouldn't really have taken that one." A journal without pre-registration is a story
told backwards, and it always flatters the teller.

## What this is actually testing

Not whether the strategy works — 5,670 backtests already estimated that.

**Whether you can follow it.** At a 26% win rate, losing streaks of 8 are normal
(90th percentile) and 15 happens (99th). The failure mode isn't the maths, it's
abandoning a positive-expectancy system during a normal losing run. That is what
kills the retail traders in every study from the research phase.

## Reading the scorecard

- **Under 30 trades: read nothing into it.** Variance dominates completely.
- **200+ trades** before the numbers mean anything — several years at this frequency.
- Track your **longest losing run** against the expected distribution (median 3,
  90th pct 8, 99th pct 15). If you overrode the system before hitting those, that is
  the finding, and it matters more than the P&L.

## Honest limits of this harness

- Resolution uses daily bars, so an intrabar stop fills **at the stop price** — real
  slippage and gaps will be worse.
- No fees are modelled here. The backtest showed the edge dies above ~0.25% per side.
- Yahoo/Coinbase data is research-grade, not execution-grade.
