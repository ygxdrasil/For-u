import {Document} from './store/index';

/**
 * What she has spent this month, and a hard stop when it runs out.
 *
 * Counted from the token usage the provider actually reports, not estimated
 * from message lengths. The cap is enforced before the request goes out rather
 * than after, because a limit that only tells you afterwards is not a limit.
 */

/** Dollars per million tokens, for the models she uses. */
const RATES: Record<string, {in: number; out: number}> = {
  'gemini-2.5-flash': {in: 0.3, out: 2.5},
  'gemini-2.5-flash-lite': {in: 0.1, out: 0.4},
  'gemini-2.5-flash-preview-tts': {in: 0.5, out: 10},
};

/** Anything unrecognised is charged at the dearest known rate, not ignored. */
const FALLBACK = {in: 1, out: 20};

export interface Spend {
  /** Calendar month this covers, as YYYY-MM. */
  month: string;
  dollars: number;
  requests: number;
  /** Where the money actually went, by model. Guessing at this cost a week. */
  byModel?: Record<string, number>;
  /** Set when the cap has been hit, so the reason survives a restart. */
  stoppedAt: string | null;
}

const store = new Document<Spend>('spend', () => ({
  month: currentMonth(),
  dollars: 0,
  requests: 0,
  stoppedAt: null,
}));

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function monthlyCap(): number {
  const set = Number(process.env.GRACE_MONTHLY_CAP);
  return Number.isFinite(set) && set > 0 ? set : 10;
}

/** Cached so the check in front of every request costs nothing. */
let cached: Spend | null = null;

export async function spend(): Promise<Spend> {
  if (!cached) cached = await store.read();

  // A new month starts clean, including clearing any stop.
  if (cached.month !== currentMonth()) {
    cached = {month: currentMonth(), dollars: 0, requests: 0, stoppedAt: null};
    await store.write(cached);
  }
  return cached;
}

export class OverBudget extends Error {
  constructor(readonly dollars: number) {
    super(
      `I have spent about $${dollars.toFixed(2)} this month, which is the limit ` +
        `you set. I will start again next month, or you can raise the cap.`,
    );
    this.name = 'OverBudget';
  }
}

/** Throws rather than returning, so a caller cannot forget to check. */
export async function requireBudget(): Promise<void> {
  const current = await spend();
  if (current.dollars >= monthlyCap()) throw new OverBudget(current.dollars);
}

export async function record(
  model: string,
  inputTokens: number,
  outputTokens: number,
  /** The slice of input served from Gemini's implicit cache, billed at 25%. */
  cachedTokens = 0,
): Promise<void> {
  const rate = RATES[model] ?? FALLBACK;
  const fresh = Math.max(0, inputTokens - cachedTokens);
  const cost =
    (fresh * rate.in + cachedTokens * rate.in * 0.25 + outputTokens * rate.out) /
    1_000_000;

  const current = await spend();
  const next: Spend = {
    ...current,
    dollars: current.dollars + cost,
    requests: current.requests + 1,
    byModel: {
      ...current.byModel,
      [model]: (current.byModel?.[model] ?? 0) + cost,
    },
    stoppedAt:
      current.dollars + cost >= monthlyCap()
        ? (current.stoppedAt ?? new Date().toISOString())
        : current.stoppedAt,
  };

  cached = next;
  await store.write(next);
}
