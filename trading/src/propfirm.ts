import { getBars } from './data.js';
import { getIndexBars } from './indexdata.js';
import { backtest } from './backtest.js';
import { timeSeriesMomentum } from './strategies/extended.js';
import { ALL_MARKETS } from './universe.js';
import type { Bar } from './types.js';

/**
 * CAN THIS STRATEGY PASS A FUNDED-ACCOUNT CHALLENGE?
 *
 * Prop firms impose a hard max drawdown (typically 10%) and a profit target
 * (8-10%). Our strategy wins ~26% of trades and makes its money in a fat tail,
 * which means long losing streaks are NORMAL, not exceptional.
 *
 * A challenge is therefore a race between the drawdown limit and the target,
 * and the strategy's own shape decides the odds. This simulates it directly
 * from the measured trade distribution rather than guessing.
 */

const RULES = [
  { name: 'FTMO-style 2-step', target: 0.10, maxDd: 0.10, dailyDd: 0.05 },
  { name: 'Typical 1-step', target: 0.08, maxDd: 0.06, dailyDd: 0.04 },
  { name: 'Lenient (10% target, 12% DD)', target: 0.10, maxDd: 0.12, dailyDd: 0.06 },
];

let seed = 424242;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

async function main() {
  // Collect the real out-of-sample R distribution for the best strategy.
  const strategy = timeSeriesMomentum();
  const Rs: number[] = [];
  for (const m of ALL_MARKETS) {
    let bars: Bar[];
    try {
      bars = m.source === 'coinbase'
        ? await getBars(m.symbol, '1d', 2500, { quiet: true })
        : await getIndexBars(m.symbol, '1d');
    } catch { continue; }
    if (bars.length < strategy.warmup + 60) continue;
    for (const t of backtest(bars, strategy).trades) Rs.push(t.r);
  }

  const wr = (Rs.filter((r) => r > 0).length / Rs.length) * 100;
  const exp = Rs.reduce((a, b) => a + b, 0) / Rs.length;
  console.log(`\nStrategy distribution: ${Rs.length} trades, ${wr.toFixed(1)}% win rate, ${exp >= 0 ? '+' : ''}${exp.toFixed(3)}R\n`);

  // How long are the losing streaks this distribution naturally produces?
  const streaks: number[] = [];
  let cur = 0;
  for (let i = 0; i < 200000; i++) {
    const r = Rs[Math.floor(rand() * Rs.length)];
    if (r <= 0) cur++;
    else { if (cur) streaks.push(cur); cur = 0; }
  }
  streaks.sort((a, b) => a - b);
  const q = (p: number) => streaks[Math.floor(streaks.length * p)];
  console.log('LOSING STREAKS this strategy produces naturally:');
  console.log(`  median ${q(0.5)}   90th pct ${q(0.9)}   99th pct ${q(0.99)}   worst seen ${streaks[streaks.length - 1]}`);
  console.log(`  At 1% risk, a ${q(0.99)}-trade losing streak costs about ${q(0.99)}% of the account.\n`);

  console.log('CHALLENGE PASS RATES — 50,000 simulations each\n');
  console.log('Rules                          risk/trade   PASS      FAIL(DD)   still running');
  console.log('─'.repeat(80));

  for (const rule of RULES) {
    for (const risk of [0.005, 0.01, 0.02, 0.03]) {
      let pass = 0;
      let fail = 0;
      let running = 0;
      const SIMS = 50000;
      const MAX_TRADES = 200; // generous — most challenges are time-limited

      for (let s = 0; s < SIMS; s++) {
        let eq = 1;
        let peak = 1;
        let done = false;
        for (let k = 0; k < MAX_TRADES; k++) {
          eq += eq * risk * Rs[Math.floor(rand() * Rs.length)];
          peak = Math.max(peak, eq);
          // Prop drawdown is measured from the high-water mark, not the start.
          if (eq <= peak * (1 - rule.maxDd) || eq <= 1 - rule.maxDd) { fail++; done = true; break; }
          if (eq >= 1 + rule.target) { pass++; done = true; break; }
        }
        if (!done) running++;
      }
      console.log(
        `${rule.name.padEnd(31)}${(risk * 100).toFixed(1).padStart(6)}%      ` +
        `${((pass / SIMS) * 100).toFixed(1).padStart(5)}%    ` +
        `${((fail / SIMS) * 100).toFixed(1).padStart(6)}%     ` +
        `${((running / SIMS) * 100).toFixed(1).padStart(6)}%`,
      );
    }
    console.log('');
  }

  // What a challenge costs in expectation.
  console.log('='.repeat(80));
  console.log('EXPECTED COST — FTMO-style, 1% risk\n');
  const passRate = 0.35; // filled in from the table above for illustration
  for (const fee of [100, 250, 500]) {
    console.log(`  $${fee} challenge fee: expected attempts to pass = 1/p, expected spend = $${fee}/p`);
  }
  console.log('\n  Use the PASS column above for p. Note that passing the challenge is not');
  console.log('  the same as getting paid: funded accounts carry the SAME drawdown rules,');
  console.log('  so the strategy must then survive them indefinitely, not just once.');
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * SECOND QUESTION, the one that actually decides it: passing the challenge is
 * a one-off event, but a FUNDED account carries the same drawdown rule forever.
 * Survival, not the sprint to the target, is what determines whether you're
 * ever paid.
 */
