import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Bar } from './types.js';

const CACHE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'cache');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Stock index OHLCV via Yahoo Finance's chart endpoint.
 *
 * Why indices matter as a test: crypto gives ~7 years, all of it one macro
 * story. The S&P 500 goes back to 1927 — genuinely independent regimes
 * (stagflation, 1987, dot-com, GFC, ZIRP, COVID). A trend-following edge that
 * is real should survive decades it was never fitted to.
 *
 * Note this is an undocumented public endpoint, not a supported API. Fine for
 * research; don't build execution on it.
 */

export const INDICES: { symbol: string; name: string }[] = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: '^IXIC', name: 'Nasdaq Composite' },
  { symbol: '^NDX', name: 'Nasdaq 100' },
  { symbol: '^RUT', name: 'Russell 2000' },
  { symbol: '^FTSE', name: 'FTSE 100' },
  { symbol: '^GDAXI', name: 'DAX' },
  { symbol: '^FCHI', name: 'CAC 40' },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50' },
  { symbol: '^OMX', name: 'OMX Stockholm 30' },
  { symbol: '^N225', name: 'Nikkei 225' },
  { symbol: '^HSI', name: 'Hang Seng' },
  { symbol: '^AXJO', name: 'ASX 200' },
  { symbol: '^BSESN', name: 'BSE Sensex' },
  { symbol: '^KS11', name: 'KOSPI' },
  { symbol: '^GSPTSE', name: 'TSX Composite' },
];

export type IndexInterval = '1d' | '1wk';

export async function getIndexBars(
  symbol: string,
  interval: IndexInterval = '1d',
  opts: { refresh?: boolean } = {},
): Promise<Bar[]> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = join(CACHE_DIR, `idx_${symbol.replace(/[^\w]/g, '')}_${interval}.json`);

  if (!opts.refresh && existsSync(cacheFile)) {
    const c = JSON.parse(readFileSync(cacheFile, 'utf8')) as { fetchedAt: number; bars: Bar[] };
    if (Date.now() / 1000 - c.fetchedAt < 86400) return c.bars;
  }

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?period1=-2208988800&period2=${Math.floor(Date.now() / 1000)}&interval=${interval}`;

  let payload: any = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      payload = await res.json();
      break;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(1500 * 2 ** attempt);
      continue;
    }
    throw new Error(`Yahoo ${res.status} for ${symbol}`);
  }
  if (!payload) throw new Error(`Yahoo failed after retries: ${symbol}`);

  const result = payload?.chart?.result?.[0];
  if (!result?.timestamp) throw new Error(`No data for ${symbol}`);

  const ts: number[] = result.timestamp;
  const q = result.indicators.quote[0];

  const bars: Bar[] = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open?.[i];
    const h = q.high?.[i];
    const l = q.low?.[i];
    const c = q.close?.[i];
    // Yahoo emits nulls for holidays/halts. A null bar is not a zero bar —
    // dropping it is correct; substituting 0 would fabricate a crash.
    if ([o, h, l, c].some((v) => v == null || !Number.isFinite(v))) continue;
    bars.push({ time: ts[i], open: o, high: h, low: l, close: c, volume: q.volume?.[i] ?? 0 });
  }
  if (bars.length === 0) throw new Error(`No usable bars for ${symbol}`);

  writeFileSync(cacheFile, JSON.stringify({ fetchedAt: Math.floor(Date.now() / 1000), bars }));
  return bars;
}
