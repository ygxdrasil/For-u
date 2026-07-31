import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getBars, getKrakenSpot } from './data.js';
import { getIndexBars } from './indexdata.js';
import { atr, closes, roc, sma } from './indicators.js';
import { bootstrapExpectancy } from './validate.js';
import type { Bar } from './types.js';

/**
 * PAPER TRADING — pre-registered signal journal.
 *
 * The one rule that makes this worth anything: every signal is written to disk
 * WITH ITS TIMESTAMP BEFORE THE OUTCOME IS KNOWN. Entry, stop and reasoning are
 * fixed at signal time and never edited afterwards. Without that, a journal is
 * just a story told backwards, and every trader who has ever kept one badly can
 * tell you how flattering that story becomes.
 *
 * The strategy is the one thing that survived the full sweep:
 *   Time-series momentum (252-day) + >2 ATR from SMA200, 3xATR stop, no target.
 *   Measured out-of-sample: +0.317R per trade, 25.8% win rate.
 *
 * A 26% win rate means SEVEN OR EIGHT LOSSES IN A ROW IS NORMAL (90th percentile
 * streak = 8, 99th = 15). The point of paper trading is not to find out whether
 * the strategy works — 5,670 backtests already estimated that. It is to find out
 * whether you can follow it through those streaks without overriding it.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JOURNAL = join(ROOT, 'paper', 'journal.json');

const LOOKBACK = 252;
const TREND = 200;
const STOP_ATR = 3;
const MIN_DIST_ATR = 2;
const RISK_PER_TRADE = 0.01;
const STARTING_EQUITY = 1000; // notional paper account; R-multiples are what matter

interface Signal {
  id: string;
  /** ISO timestamp written when the signal was generated. Never edited. */
  openedAt: string;
  market: string;
  symbol: string;
  source: 'coinbase' | 'yahoo';
  cls: string;
  side: 'long' | 'short';
  entry: number;
  stop: number;
  /** Distance from entry to stop, in price. Denominator for R. */
  riskPerUnit: number;
  reason: string;
  status: 'open' | 'closed';
  closedAt?: string;
  exit?: number;
  exitReason?: string;
  r?: number;
}

interface Journal {
  createdAt: string;
  strategy: string;
  signals: Signal[];
  /** Every run appends here, so the record shows when it was NOT run too. */
  runs: { at: string; opened: number; closed: number }[];
}

/**
 * PORTFOLIO LIMITS — added after the first run exposed the problem.
 *
 * The unconstrained version opened 15 positions, nine of them equity indices or
 * equity sectors. Those move together: it is one bet sized nine times, not nine
 * bets. Total notional reached ~260% of equity. This is precisely the
 * correlation error identified in the crypto sweep, reproduced live.
 *
 * Van Tharp's portfolio-heat guidance caps total open risk near 6-10%.
 */
const MAX_POSITIONS = 8;
const MAX_PER_CLASS = 2;
const MAX_PORTFOLIO_HEAT = 0.08; // 8% of equity at risk across all open trades

type Cls = 'crypto' | 'equity' | 'commodity';

const WATCHLIST: { symbol: string; name: string; source: 'coinbase' | 'yahoo'; cls: Cls }[] = [
  // Crypto — Kraken/Coinbase tradeable, and where the crypto leg validated.
  { symbol: 'BTC-USD', cls: 'crypto', name: 'Bitcoin', source: 'coinbase' },
  { symbol: 'ETH-USD', cls: 'crypto', name: 'Ethereum', source: 'coinbase' },
  { symbol: 'SOL-USD', cls: 'crypto', name: 'Solana', source: 'coinbase' },
  { symbol: 'LINK-USD', cls: 'crypto', name: 'Chainlink', source: 'coinbase' },
  // Equity indices — Capital.com CFD tradeable.
  { symbol: '^GSPC', cls: 'equity', name: 'S&P 500', source: 'yahoo' },
  { symbol: '^NDX', cls: 'equity', name: 'Nasdaq 100', source: 'yahoo' },
  { symbol: '^GDAXI', cls: 'equity', name: 'DAX', source: 'yahoo' },
  { symbol: '^OMX', cls: 'equity', name: 'OMX Sthlm 30', source: 'yahoo' },
  { symbol: '^FTSE', cls: 'equity', name: 'FTSE 100', source: 'yahoo' },
  { symbol: '^N225', cls: 'equity', name: 'Nikkei 225', source: 'yahoo' },
  // Sector ETFs — the low-fee venue where the edge is actually reachable.
  { symbol: 'XLE', cls: 'equity', name: 'Energy ETF', source: 'yahoo' },
  { symbol: 'XLK', cls: 'equity', name: 'Technology ETF', source: 'yahoo' },
  { symbol: 'XLF', cls: 'equity', name: 'Financials ETF', source: 'yahoo' },
  { symbol: 'XLV', cls: 'equity', name: 'Healthcare ETF', source: 'yahoo' },
  // Commodities.
  { symbol: 'GC=F', cls: 'commodity', name: 'Gold', source: 'yahoo' },
  { symbol: 'CL=F', cls: 'commodity', name: 'Crude Oil', source: 'yahoo' },
  { symbol: 'HG=F', cls: 'commodity', name: 'Copper', source: 'yahoo' },
];

function loadJournal(): Journal {
  if (existsSync(JOURNAL)) return JSON.parse(readFileSync(JOURNAL, 'utf8')) as Journal;
  return {
    createdAt: new Date().toISOString(),
    strategy: 'TSM(252) + >2ATR from SMA200, 3xATR stop, exit on momentum flip',
    signals: [],
    runs: [],
  };
}

function saveJournal(j: Journal) {
  mkdirSync(dirname(JOURNAL), { recursive: true });
  writeFileSync(JOURNAL, JSON.stringify(j, null, 2));
}

async function loadBars(w: (typeof WATCHLIST)[number]): Promise<Bar[] | null> {
  try {
    return w.source === 'coinbase'
      ? await getBars(w.symbol, '1d', 2000, { quiet: true })
      : await getIndexBars(w.symbol, '1d');
  } catch {
    return null;
  }
}

/** Current state of the strategy for one market, evaluated on the LAST CLOSED bar. */
function evaluate(bars: Bar[]) {
  const c = closes(bars);
  const mom = roc(c, LOOKBACK);
  const trend = sma(c, TREND);
  const a = atr(bars, 14);
  const i = bars.length - 1;
  if (![mom[i], trend[i], a[i]].every(Number.isFinite) || a[i] <= 0) return null;
  const price = bars[i].close;
  const dist = (price - trend[i]) / a[i];
  return { price, mom: mom[i], dist, atr: a[i], barTime: bars[i].time };
}

async function main() {
  const j = loadJournal();
  const now = new Date().toISOString();
  let opened = 0;
  let closed = 0;

  console.log(`\nPAPER TRADING — ${j.strategy}`);
  console.log(`Journal: ${j.signals.length} signals so far (${j.signals.filter((s) => s.status === 'open').length} open)\n`);

  const barsCache = new Map<string, Bar[]>();
  for (const w of WATCHLIST) {
    const b = await loadBars(w);
    if (b && b.length > TREND + LOOKBACK) barsCache.set(w.symbol, b);
    if (w.source === 'yahoo') await new Promise((r) => setTimeout(r, 250));
  }

  // ---- 1. RESOLVE open positions first, before generating anything new.
  //         Doing this in the other order would let a fresh signal influence
  //         how an existing one is judged.
  for (const s of j.signals.filter((x) => x.status === 'open')) {
    const bars = barsCache.get(s.symbol);
    if (!bars) continue;
    const ev = evaluate(bars);
    if (!ev) continue;

    // Only consider bars that CLOSED after the signal was written.
    const openedTs = Date.parse(s.openedAt) / 1000;
    const since = bars.filter((b) => b.time > openedTs);

    let hit: { price: number; reason: string; time: number } | null = null;
    for (const b of since) {
      const stopped = s.side === 'long' ? b.low <= s.stop : b.high >= s.stop;
      if (stopped) { hit = { price: s.stop, reason: 'stop', time: b.time }; break; }
    }
    if (!hit) {
      const flipped = s.side === 'long' ? ev.mom < 0 : ev.mom > 0;
      if (flipped) hit = { price: ev.price, reason: 'momentum flipped', time: ev.barTime };
    }
    if (!hit) continue;

    const gross = s.side === 'long' ? hit.price - s.entry : s.entry - hit.price;
    s.status = 'closed';
    s.closedAt = new Date(hit.time * 1000).toISOString();
    s.exit = hit.price;
    s.exitReason = hit.reason;
    s.r = gross / s.riskPerUnit;
    closed++;
    console.log(`  CLOSED  ${s.market.padEnd(15)} ${s.side.padEnd(5)} ${s.exitReason.padEnd(18)} ${s.r >= 0 ? '+' : ''}${s.r.toFixed(2)}R`);
  }

  // ---- 2. Generate NEW signals for markets with no open position.
  const openNow = () => j.signals.filter((s) => s.status === 'open');
  const openSymbols = new Set(openNow().map((s) => s.symbol));
  const skippedForLimits: string[] = [];

  for (const w of WATCHLIST) {
    if (openSymbols.has(w.symbol)) continue;

    // Portfolio limits, checked live as positions accumulate this run.
    const current = openNow();
    if (current.length >= MAX_POSITIONS) { skippedForLimits.push(`${w.name} (max ${MAX_POSITIONS} positions)`); continue; }
    if (current.filter((s) => s.cls === w.cls).length >= MAX_PER_CLASS) {
      skippedForLimits.push(`${w.name} (max ${MAX_PER_CLASS} per ${w.cls})`);
      continue;
    }
    if ((current.length + 1) * RISK_PER_TRADE > MAX_PORTFOLIO_HEAT) {
      skippedForLimits.push(`${w.name} (portfolio heat cap ${MAX_PORTFOLIO_HEAT * 100}%)`);
      continue;
    }
    const bars = barsCache.get(w.symbol);
    if (!bars) continue;
    const ev = evaluate(bars);
    if (!ev) continue;

    const longOk = ev.mom > 0 && ev.dist >= MIN_DIST_ATR;
    const shortOk = ev.mom < 0 && -ev.dist >= MIN_DIST_ATR;
    if (!longOk && !shortOk) continue;

    const side: 'long' | 'short' = longOk ? 'long' : 'short';
    const stop = side === 'long' ? ev.price - STOP_ATR * ev.atr : ev.price + STOP_ATR * ev.atr;
    const sig: Signal = {
      id: `${w.symbol}-${ev.barTime}`,
      openedAt: now,
      market: w.name,
      symbol: w.symbol,
      source: w.source,
      cls: w.cls,
      side,
      entry: ev.price,
      stop,
      riskPerUnit: Math.abs(ev.price - stop),
      reason: `${LOOKBACK}d momentum ${(ev.mom * 100).toFixed(0)}%, ${ev.dist.toFixed(1)} ATR from SMA${TREND}`,
      status: 'open',
    };
    if (j.signals.some((x) => x.id === sig.id)) continue; // idempotent per bar
    j.signals.push(sig);
    opened++;
    const sizePct = (RISK_PER_TRADE / (sig.riskPerUnit / sig.entry)) * 100;
    console.log(`  OPEN    ${w.name.padEnd(15)} ${side.padEnd(5)} entry ${ev.price.toFixed(2)}  stop ${stop.toFixed(2)}  (${sizePct.toFixed(0)}% of equity)`);
    console.log(`          ${sig.reason}`);
  }

  if (skippedForLimits.length) {
    console.log(`\n  Skipped by portfolio limits (correlation control):`);
    for (const x of skippedForLimits) console.log(`    - ${x}`);
  }
  if (opened === 0 && closed === 0) console.log('  No action. Standing aside is a position.');

  j.runs.push({ at: now, opened, closed });
  saveJournal(j);

  // ---- 3. Scorecard. Honest, including "not yet meaningful".
  const done = j.signals.filter((s) => s.status === 'closed' && Number.isFinite(s.r));
  console.log(`\n${'='.repeat(70)}\nSCORECARD\n${'='.repeat(70)}`);
  const openList = j.signals.filter((s) => s.status === 'open');
  console.log(`  Open positions      ${openList.length}/${MAX_POSITIONS}   (heat ${(openList.length * RISK_PER_TRADE * 100).toFixed(1)}% of max ${MAX_PORTFOLIO_HEAT * 100}%)`);
  for (const c of [...new Set(openList.map((s) => s.cls))]) {
    console.log(`    ${c.padEnd(10)} ${openList.filter((s) => s.cls === c).length}/${MAX_PER_CLASS}`);
  }
  console.log(`  Closed trades       ${done.length}`);

  if (done.length === 0) {
    console.log(`\n  No closed trades yet. Nothing to judge.`);
  } else {
    const rs = done.map((s) => s.r!);
    const wins = rs.filter((r) => r > 0).length;
    const ci = bootstrapExpectancy(rs, { iterations: 5000 });
    const totalR = rs.reduce((a, b) => a + b, 0);
    console.log(`  Win rate            ${wins}/${done.length} (${((wins / done.length) * 100).toFixed(1)}%)   [backtest: 25.8%]`);
    console.log(`  Expectancy          ${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}R           [backtest: +0.317R]`);
    console.log(`  95% CI              [${ci.lo >= 0 ? '+' : ''}${ci.lo.toFixed(3)}, ${ci.hi >= 0 ? '+' : ''}${ci.hi.toFixed(3)}]`);
    console.log(`  Total              ${totalR >= 0 ? '+' : ''}${totalR.toFixed(2)}R  =  ${((totalR * RISK_PER_TRADE) * 100).toFixed(2)}% on a ${RISK_PER_TRADE * 100}%-risk account`);
    console.log(`  Paper equity        $${(STARTING_EQUITY * (1 + totalR * RISK_PER_TRADE)).toFixed(2)} from $${STARTING_EQUITY}`);

    let streak = 0;
    let worst = 0;
    for (const r of rs) { if (r <= 0) { streak++; worst = Math.max(worst, streak); } else streak = 0; }
    console.log(`  Longest losing run  ${worst}   [expected: median 3, 90th pct 8, 99th pct 15]`);

    if (done.length < 30) {
      console.log(`\n  ${done.length} trades is NOT enough to judge anything. Needs 200+.`);
      console.log(`  At this frequency that is several years. Read nothing into these numbers yet.`);
    }
  }
  console.log(`\n  Runs logged: ${j.runs.length}. Journal: trading/paper/journal.json`);
  console.log(`  Run once per day after market close. Signals are pre-registered and never edited.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
