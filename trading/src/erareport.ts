import { readFileSync } from 'node:fs';
import { bootstrapExpectancy } from './validate.js';
import type { EraRow } from './eras.js';

const data = JSON.parse(readFileSync('trading/cache/era-results.json', 'utf8')) as {
  eras: { name: string; note: string }[];
  rows: EraRow[];
  skipped: string[];
};

const { rows, eras } = data;
const strategies = [...new Set(rows.map((r) => r.strategy))];
const tfs = [...new Set(rows.map((r) => r.timeframe))];
const pad = (s: string, w: number) => s.padEnd(w);
const padL = (s: string, w: number) => s.padStart(w);
const frac = (n: number, d: number) => `${n}/${d} (${d ? ((n / d) * 100).toFixed(1) : '0.0'}%)`;

console.log(`\n${'='.repeat(80)}`);
console.log(`ERA ANALYSIS — ${rows.length} backtests, same charts, 3 non-overlapping regimes`);
console.log(`${'='.repeat(80)}`);
for (const e of eras) console.log(`  ${e.name}  (${e.note})`);

// ---------------------------------------------------------------------------
// Pooled across instruments: the fix for the unreachable per-run trade gate.
// One strategy in one era across 18 markets IS a portfolio — evaluate it as one.
// ---------------------------------------------------------------------------
console.log(`\n\nPOOLED ACROSS ALL 18 MARKETS — one row = one strategy, one era, one timeframe`);
console.log(`Expectancy CI is bootstrapped on pooled trades. "EDGE" = CI excludes zero on the upside.\n`);

const w = [30, 4, 20, 7, 16, 22, 6];
console.log(['Strategy', 'TF', 'Era', 'Trades', 'Win rate', 'Expectancy 95% CI', 'Verdict'].map((h, i) => pad(h, w[i])).join(' '));
console.log(w.map((x) => '─'.repeat(x)).join(' '));

interface Pooled {
  strategy: string; tf: string; era: string; trades: number; wins: number;
  winRate: number; point: number; lo: number; hi: number; edge: boolean;
}
const pooled: Pooled[] = [];

for (const s of strategies) {
  for (const tf of tfs) {
    for (const e of eras) {
      const rs = rows.filter((r) => r.strategy === s && r.timeframe === tf && r.era === e.name);
      const allRs = rs.flatMap((r) => r.rs);
      if (allRs.length < 30) continue;
      const wins = rs.reduce((a, r) => a + r.wins, 0);
      const ci = bootstrapExpectancy(allRs, { iterations: 6000 });
      pooled.push({
        strategy: s, tf, era: e.name, trades: allRs.length, wins,
        winRate: wins / allRs.length, point: ci.point, lo: ci.lo, hi: ci.hi,
        edge: ci.lo > 0,
      });
    }
  }
}

pooled.sort((a, b) => b.point - a.point);
for (const p of pooled) {
  console.log([
    pad(p.strategy.slice(0, 30), w[0]),
    pad(p.tf, w[1]),
    pad(p.era.slice(0, 20), w[2]),
    padL(String(p.trades), w[3]),
    pad(`${p.wins}/${p.trades} ${(p.winRate * 100).toFixed(1)}%`, w[4]),
    pad(`${p.point >= 0 ? '+' : ''}${p.point.toFixed(3)} [${p.lo >= 0 ? '+' : ''}${p.lo.toFixed(3)},${p.hi >= 0 ? '+' : ''}${p.hi.toFixed(3)}]`, w[5]),
    p.edge ? 'EDGE' : p.hi < 0 ? 'LOSES' : 'noise',
  ].join(' '));
}

// ---------------------------------------------------------------------------
// Consistency: an edge that only exists in one regime is a regime bet.
// ---------------------------------------------------------------------------
console.log(`\n\nCONSISTENCY — does the edge survive ALL THREE eras?\n`);
const w2 = [30, 4, 14, 14, 14, 12];
console.log(['Strategy', 'TF', ...eras.map((e) => e.name.slice(0, 12)), 'Verdict'].map((h, i) => pad(h, w2[i])).join(' '));
console.log(w2.map((x) => '─'.repeat(x)).join(' '));

for (const s of strategies) {
  for (const tf of tfs) {
    const cells = eras.map((e) => pooled.find((p) => p.strategy === s && p.tf === tf && p.era === e.name));
    if (cells.every((c) => !c)) continue;
    const edges = cells.filter((c) => c?.edge).length;
    const loses = cells.filter((c) => c && c.hi < 0).length;
    console.log([
      pad(s.slice(0, 30), w2[0]),
      pad(tf, w2[1]),
      ...cells.map((c, i) => pad(c ? `${c.point >= 0 ? '+' : ''}${c.point.toFixed(3)}${c.edge ? '*' : c.hi < 0 ? '!' : ' '}` : '—', w2[2 + i])),
      edges === 3 ? 'ROBUST' : edges > 0 ? `${edges}/3 only` : loses === 3 ? 'ALWAYS LOSES' : 'no edge',
    ].join(' '));
  }
}
console.log(`\n  * = CI excludes zero (real edge)   ! = CI entirely negative (reliably loses)`);

// ---------------------------------------------------------------------------
// Correlation caveat: 18 crypto pairs are not 18 independent bets.
// ---------------------------------------------------------------------------
console.log(`\n\nINDEPENDENCE CHECK — BTC alone vs all 18 pooled\n`);
for (const s of strategies.slice(0, 3)) {
  for (const tf of ['1d']) {
    const btc = rows.filter((r) => r.strategy === s && r.timeframe === tf && r.product === 'BTC-USD').flatMap((r) => r.rs);
    const all = rows.filter((r) => r.strategy === s && r.timeframe === tf).flatMap((r) => r.rs);
    if (btc.length < 20 || all.length < 30) continue;
    const b = bootstrapExpectancy(btc, { iterations: 4000 });
    const a = bootstrapExpectancy(all, { iterations: 4000 });
    console.log(`  ${pad(s.slice(0, 30), 32)} BTC only: ${b.point >= 0 ? '+' : ''}${b.point.toFixed(3)} (${btc.length} trades)   All 18: ${a.point >= 0 ? '+' : ''}${a.point.toFixed(3)} (${all.length} trades)`);
  }
}
console.log(`\n  Alts are heavily BTC-correlated, so 18 markets is NOT 18 independent bets.`);
console.log(`  Treat the pooled trade counts as inflated confidence, not extra evidence.`);

// ---------------------------------------------------------------------------
// Bottom line
// ---------------------------------------------------------------------------
const robust = strategies.flatMap((s) =>
  tfs.map((tf) => ({ s, tf, n: eras.filter((e) => pooled.find((p) => p.strategy === s && p.tf === tf && p.era === e.name)?.edge).length })),
).filter((x) => x.n === 3);

console.log(`\n\n${'='.repeat(80)}\nBOTTOM LINE\n${'='.repeat(80)}\n`);
console.log(`Backtests                       ${rows.length}`);
console.log(`Total trades                    ${rows.reduce((a, r) => a + r.trades, 0)}`);
console.log(`Pooled strategy-era-tf cells    ${pooled.length}`);
console.log(`  with a real edge (CI>0)       ${frac(pooled.filter((p) => p.edge).length, pooled.length)}`);
console.log(`  reliably losing (CI<0)        ${frac(pooled.filter((p) => p.hi < 0).length, pooled.length)}`);
console.log(`  indistinguishable from noise  ${frac(pooled.filter((p) => !p.edge && p.hi >= 0).length, pooled.length)}`);
console.log(`\nStrategies with an edge in ALL THREE eras: ${robust.length}`);
for (const r of robust) console.log(`   - ${r.s} (${r.tf})`);
if (!robust.length) console.log(`   (none)`);
console.log('');
