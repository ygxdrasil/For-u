# Trading backtest harness

A backtester built to **disprove** strategies rather than sell them. Every design
choice below exists to stop a backtest from flattering you.

```bash
npx tsx trading/src/run.ts --product=BTC-USD --tf=1d --days=2500
```

Flags: `--product` (Coinbase pair), `--tf` (`1m 5m 15m 1h 6h 1d`), `--days`,
`--maxdd` (drawdown limit for the acceptance gate, default 25%).

## Data sources — and why two

Measured 2026-07-30, not assumed:

| | Deep history | Live price |
|---|---|---|
| **Coinbase** | Yes — honours arbitrary `start`/`end`, pages back to ~2015 | yes |
| **Kraken** | **No** — ignores `since`, always returns the most recent 720 bars (~2yr daily) | yes |

So: **Coinbase for backtest history, Kraken for live data and execution.**
Re-check if either API changes.

## The three rules that make a backtest mean something

1. **No lookahead.** Decide on the close of bar `i`, fill at the open of bar
   `i+1`. You can never trade at a price you only knew afterwards. This one bug
   is why most homemade backtests show fake profits.
2. **Costs are real.** Fees and slippage on every entry and exit. Default is
   0.1% — *generous*. Coinbase retail taker is ~0.6%, Kraken ~0.4%.
3. **Pessimistic intrabar.** If a bar's range contains both stop and target, the
   stop wins. A bar records no internal ordering, so this is the only assumption
   that cannot flatter you.

Also handled: gap-through stops fill at the open (not the stop), equity is marked
to market every bar so drawdown includes open losses, and any position still open
at the end is closed so results can't hide an unrealised loser.

## Reading the output

**Expectancy (R)** is the number that matters, not win rate. It's average profit
per trade in units of what you risked. A 40%-win/2.5R system beats a
65%-win/0.8R system. Win rate alone is vanity.

**p** is the probability that win rate came from a coin flip. Above 0.05, you
have a lucky streak, not evidence.

## The two controls

- **Random control** — coin-flip direction, identical stop/target geometry and
  trade frequency. A strategy that can't beat this is the same coin flip wearing
  indicators.
- **Buy & hold** — the bar everything must clear. If you can't beat doing
  nothing, do nothing.

`RSI(14) naked` is included as a deliberate **negative control**. Research says it
has no standalone edge. If it ever passes the gates, suspect the harness.

## Validation

- **Walk-forward** — split each window into in-sample/out-of-sample, measure how
  much return survives. *Caveat: there is no parameter optimiser yet, so IS and
  OOS use the same fixed parameters. Today this is a regime-stability test, not
  a true anti-overfit test. It becomes the real thing once an optimiser picks
  parameters per window.*
- **Monte Carlo — two different resamplings, because they answer different
  questions.**
  - *Shuffle* (reorder the same trades): under multiplicative compounding the
    final return is **order-invariant**, so shuffling says nothing about return.
    It varies the *path*, which is what drawdown depends on. Drawdown only.
  - *Bootstrap* (resample with replacement): composition changes, giving a real
    distribution of returns. Reporting a return CI from shuffling alone yields a
    zero-width interval that looks like precision and is an artefact.
- **Parameter sensitivity** — sweep each strategy's *own* parameters and look for
  a **plateau**. If RSI(14) works but RSI(12) and RSI(16) fail, that's a quirk of
  this dataset, not an edge.

## Acceptance gates

Pre-registered so they can't be quietly relaxed to let a favourite through.
All nine must pass before paper trading — and paper must confirm before real money.

| Gate | Threshold |
|---|---|
| Sufficient sample | ≥200 trades |
| Positive expectancy | >0 R |
| Not a coin flip | win-rate p < 0.05 |
| Beats random control | expectancy > random's |
| Beats buy & hold | CAGR > buy & hold |
| Survives cost stress | still >0 R at 3× fees |
| Walk-forward stability | efficiency ≥ 50% |
| Parameter plateau | ≥60% of nearby params positive |
| Monte Carlo drawdown | 95th-pct DD ≤ limit |

## Baseline result (BTC-USD daily, 2019-09 → 2026-07, 2500 bars)

Best strategy scored **6/9 — NOT cleared.** The instructive failures:

- **28 trades.** Nowhere near the 200 needed. Everything else is noise on top.
- **Lost to buy & hold**, 7.7% vs 35.6% CAGR. BTC ran 705% over this window;
  no timing strategy here beat holding.
- **p = 0.185.** The win rate is indistinguishable from chance.

What it did show: max drawdown 16% vs buy & hold's **77%**, at comparable Sharpe
(0.72 vs 0.81). That matches the literature — trend-following is a
drawdown-reduction tool, not an alpha generator. And `RSI naked` lost money with
p=0.012: significant, and significantly *bad*, exactly as predicted.

Default config: $1,000 start, 1% risk/trade, 3× max leverage. 1% risk is the
professional norm — position size drives risk of ruin more than edge quality does.
