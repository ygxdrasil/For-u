import { readFileSync } from 'node:fs';
import { bootstrapExpectancy } from './validate.js';
import type { MegaRow } from './mega.js';

const data = JSON.parse(readFileSync('trading/cache/mega-results.json', 'utf8')) as {
  rows: MegaRow[]; skipped: string[]; markets: number;
};

const rows = data.rows;
const strategies = [...new Set(rows.map((r) => r.strategy))];
const classes = [...new Set(rows.map((r) => r.cls))];
const eras = ['pre-2010', '2010s', '2020s'];
const pad = (s: string, w: number) => s.padEnd(w);
const padL = (s: string, w: number) => s.padStart(w);

const MIN_TRADES = 100;

function pool(filter: (r: MegaRow) => boolean) {
  const rs = rows.filter(filter);
  const all = rs.flatMap((r) => r.rs);
  const wins = rs.reduce((a, r) => a + r.wins, 0);
  return { all, wins, n: all.length };
}

console.log(`\n${'='.repeat(96)}`);
console.log(`WIDE SWEEP — ${rows.length} backtests, ${data.markets} markets, ${strategies.length} strategies, 7 asset classes`);
console.log(`${'='.repeat(96)}\n`);

// ---------------------------------------------------------------- headline
console.log('PER-STRATEGY, FULL HISTORY, ALL MARKETS POOLED\n');
const w = [40, 8, 9, 24, 8];
console.log(['Strategy', 'Trades', 'Win rate', 'Expectancy 95% CI', 'Verdict'].map((h, i) => pad(h, w[i])).join(' '));
console.log(w.map((x) => '─'.repeat(x)).join(' '));

interface Agg { s: string; n: number; wr: number; pt: number; lo: number; hi: number; edge: boolean }
const aggs: Agg[] = [];
for (const s of strategies) {
  const { all, wins, n } = pool((r) => r.strategy === s && r.era === 'full');
  if (n < MIN_TRADES) continue;
  const ci = bootstrapExpectancy(all, { iterations: 8000 });
  aggs.push({ s, n, wr: wins / n, pt: ci.point, lo: ci.lo, hi: ci.hi, edge: ci.lo > 0 });
}
aggs.sort((a, b) => b.pt - a.pt);
for (const a of aggs) {
  console.log([
    pad(a.s.slice(0, 40), w[0]),
    padL(String(a.n), w[1]),
    padL(`${(a.wr * 100).toFixed(1)}%`, w[2]),
    pad(`${a.pt >= 0 ? '+' : ''}${a.pt.toFixed(3)} [${a.lo >= 0 ? '+' : ''}${a.lo.toFixed(3)}, ${a.hi >= 0 ? '+' : ''}${a.hi.toFixed(3)}]`, w[3]),
    a.edge ? 'EDGE' : a.hi < 0 ? 'LOSES' : 'noise',
  ].join(' '));
}

// ------------------------------------------------------- by asset class
console.log(`\n\nBY ASSET CLASS — the real independence test.`);
console.log(`Crypto alts move together; commodities, FX and bonds do not. An edge that`);
console.log(`survives across classes is evidence in a way that 18 correlated alts never were.\n`);

const cw = [40, ...classes.map(() => 10), 9];
console.log([pad('Strategy', cw[0]), ...classes.map((c, i) => pad(c.slice(0, 9), cw[1 + i])), 'Classes'].join(' '));
console.log(cw.map((x) => '─'.repeat(x)).join(' '));

const classEdges = new Map<string, number>();
for (const a of aggs) {
  const cells: string[] = [];
  let edges = 0;
  let covered = 0;
  for (const c of classes) {
    const { all, n } = pool((r) => r.strategy === a.s && r.era === 'full' && r.cls === c);
    if (n < 40) { cells.push(pad('—', 10)); continue; }
    covered++;
    const ci = bootstrapExpectancy(all, { iterations: 3000 });
    if (ci.lo > 0) edges++;
    cells.push(pad(`${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(2)}${ci.lo > 0 ? '*' : ci.hi < 0 ? '!' : ' '}`, 10));
  }
  classEdges.set(a.s, edges);
  console.log([pad(a.s.slice(0, 40), cw[0]), ...cells, `${edges}/${covered}`].join(' '));
}

// ------------------------------------------------------------- by era
console.log(`\n\nBY ERA — pooled across all markets\n`);
const ew = [40, ...eras.map(() => 12), 8];
console.log([pad('Strategy', ew[0]), ...eras.map((e, i) => pad(e, ew[1 + i])), 'Eras'].join(' '));
console.log(ew.map((x) => '─'.repeat(x)).join(' '));

const eraEdges = new Map<string, number>();
for (const a of aggs) {
  const cells: string[] = [];
  let edges = 0;
  let covered = 0;
  for (const e of eras) {
    const { all, n } = pool((r) => r.strategy === a.s && r.era === e);
    if (n < 40) { cells.push(pad('—', 12)); continue; }
    covered++;
    const ci = bootstrapExpectancy(all, { iterations: 3000 });
    if (ci.lo > 0) edges++;
    cells.push(pad(`${ci.point >= 0 ? '+' : ''}${ci.point.toFixed(3)}${ci.lo > 0 ? '*' : ci.hi < 0 ? '!' : ' '}`, 12));
  }
  eraEdges.set(a.s, edges);
  console.log([pad(a.s.slice(0, 40), ew[0]), ...cells, `${edges}/${covered}`].join(' '));
}
console.log(`\n  * = CI excludes zero (edge)   ! = CI entirely negative (reliably loses)`);

// -------------------------------------------------------- the hard filter
console.log(`\n\n${'='.repeat(96)}\nTHE HARD FILTER\n${'='.repeat(96)}\n`);
console.log(`With ${strategies.length} strategies tested, ~1 false positive at p<0.05 is EXPECTED by chance.`);
console.log(`A single significant result proves nothing. Demanding an edge in multiple`);
console.log(`independent asset classes AND multiple eras is what separates signal from luck.\n`);

const survivors = aggs.filter((a) => a.edge && (classEdges.get(a.s) ?? 0) >= 2 && (eraEdges.get(a.s) ?? 0) >= 2);
console.log(`Strategies with a pooled edge:                        ${aggs.filter((a) => a.edge).length}/${aggs.length}`);
console.log(`  ...AND an edge in >=2 asset classes:               ${aggs.filter((a) => a.edge && (classEdges.get(a.s) ?? 0) >= 2).length}/${aggs.length}`);
console.log(`  ...AND an edge in >=2 eras:                        ${survivors.length}/${aggs.length}`);
console.log(`\nReliably losing overall:                             ${aggs.filter((a) => a.hi < 0).length}/${aggs.length}`);
console.log(`Indistinguishable from noise:                        ${aggs.filter((a) => !a.edge && a.hi >= 0).length}/${aggs.length}`);

console.log(`\nSURVIVORS:`);
if (!survivors.length) console.log('   (none)');
for (const s of survivors) {
  console.log(`   ${s.s}`);
  console.log(`      ${s.n} trades, ${(s.wr * 100).toFixed(1)}% win rate, ${s.pt >= 0 ? '+' : ''}${s.pt.toFixed(3)}R [${s.lo.toFixed(3)}, ${s.hi.toFixed(3)}]`);
  console.log(`      edge in ${classEdges.get(s.s)} asset classes, ${eraEdges.get(s.s)} eras`);
}
console.log('');
