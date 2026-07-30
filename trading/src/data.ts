import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Bar } from './types.js';

const CACHE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'cache');

/**
 * WHY TWO SOURCES — measured, not assumed:
 *
 *   Kraken  ignores `since` for deep history. A request for 2018 data returns
 *           the most recent 720 bars regardless. Hard ceiling ~2 years daily.
 *   Coinbase honours arbitrary start/end and pages back to ~2015.
 *
 * So: Coinbase for backtest history, Kraken for live prices and execution.
 * Verified 2026-07-30 — re-check if either API changes.
 */

export const GRANULARITY = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1h': 3600,
  '6h': 21600,
  '1d': 86400,
} as const;

export type Timeframe = keyof typeof GRANULARITY;

const MAX_CANDLES_PER_REQUEST = 300;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Coinbase returns [time, low, high, open, close, volume] — NOT the conventional
 * OHLC order. Getting this wrong produces a backtest that looks fine and means
 * nothing, because open/close would be silently swapped with low/high.
 */
function parseCoinbaseCandle(row: number[]): Bar {
  const [time, low, high, open, close, volume] = row;
  return { time, open, high, low, close, volume };
}

async function fetchChunk(product: string, granularity: number, start: number, end: number): Promise<Bar[]> {
  const url =
    `https://api.exchange.coinbase.com/products/${product}/candles` +
    `?granularity=${granularity}` +
    `&start=${new Date(start * 1000).toISOString()}` +
    `&end=${new Date(end * 1000).toISOString()}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'backtest-harness/1.0' } });
    if (res.ok) {
      const rows = (await res.json()) as number[][];
      if (!Array.isArray(rows)) throw new Error(`Unexpected payload for ${product}`);
      return rows.map(parseCoinbaseCandle);
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    throw new Error(`Coinbase ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  throw new Error(`Coinbase failed after retries: ${product} ${start}-${end}`);
}

/**
 * Historical bars for backtesting, paged backwards from now.
 * Cached on disk — re-running a backtest must not re-hit the API.
 */
export async function getBars(
  product: string,
  timeframe: Timeframe,
  days: number,
  opts: { refresh?: boolean; quiet?: boolean } = {},
): Promise<Bar[]> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = join(CACHE_DIR, `${product}_${timeframe}_${days}d.json`);

  if (!opts.refresh && existsSync(cacheFile)) {
    const cached = JSON.parse(readFileSync(cacheFile, 'utf8')) as { fetchedAt: number; bars: Bar[] };
    if (Date.now() / 1000 - cached.fetchedAt < Math.max(GRANULARITY[timeframe], 3600)) {
      return cached.bars.map((b) => ({ ...b }));
    }
  }

  const g = GRANULARITY[timeframe];
  const now = Math.floor(Date.now() / 1000);
  const earliest = now - days * 86400;
  const span = g * MAX_CANDLES_PER_REQUEST;

  const seen = new Map<number, Bar>();
  let cursor = now;
  let requests = 0;

  while (cursor > earliest) {
    const chunkStart = Math.max(earliest, cursor - span);
    const chunk = await fetchChunk(product, g, chunkStart, cursor);
    requests++;
    // An empty chunk means we've paged past the listing date — stop, don't spin.
    if (chunk.length === 0) break;
    for (const bar of chunk) if (bar.time >= earliest) seen.set(bar.time, bar);
    cursor = chunkStart;
    if (!opts.quiet && requests % 20 === 0) {
      process.stderr.write(`  fetched ${seen.size} bars (${requests} requests)...\n`);
    }
    await sleep(250); // Coinbase public limit is ~10 req/s; stay well clear.
  }

  const bars = [...seen.values()].sort((a, b) => a.time - b.time);
  if (bars.length === 0) throw new Error(`No bars for ${product} ${timeframe}`);

  writeFileSync(cacheFile, JSON.stringify({ fetchedAt: Math.floor(Date.now() / 1000), bars }));
  return bars;
}

/** Live spot price from Kraken — the venue we'd actually execute on. */
export async function getKrakenSpot(pair: string): Promise<number> {
  const res = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${pair}`);
  if (!res.ok) throw new Error(`Kraken ticker ${res.status}`);
  const body = (await res.json()) as { error: string[]; result: Record<string, { c: string[] }> };
  if (body.error?.length) throw new Error(`Kraken: ${body.error.join(', ')}`);
  const first = Object.values(body.result)[0];
  return Number(first.c[0]);
}

/** Live spot from Coinbase, for cross-checking Kraken. */
export async function getCoinbaseSpot(product: string): Promise<number> {
  const res = await fetch(`https://api.exchange.coinbase.com/products/${product}/ticker`);
  if (!res.ok) throw new Error(`Coinbase ticker ${res.status}`);
  return Number(((await res.json()) as { price: string }).price);
}

/** Contiguous slice of bars by date, for walk-forward windows. */
export function sliceByDate(bars: Bar[], fromISO: string, toISO: string): Bar[] {
  const from = Date.parse(fromISO) / 1000;
  const to = Date.parse(toISO) / 1000;
  return bars.filter((b) => b.time >= from && b.time <= to);
}
