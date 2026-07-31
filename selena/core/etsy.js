/**
 * Etsy adapter — the only source Selena calls directly, and the only one that
 * gives both halves of a level-4 finding from one authorised place: a priced
 * listing proves somebody is paying, and its reviews prove whether they are
 * happy about it.
 *
 * Three endpoints, none of which needs an OAuth scope. An `x-api-key` header
 * of `keystring:shared_secret` is the whole auth story:
 *
 *   GET /v3/application/listings/active                 keyword search
 *   GET /v3/application/listings/{listing_id}/reviews   reviews on a listing
 *   GET /v3/application/shops/{shop_id}/reviews         reviews on a shop
 *
 * Without a key this adapter reports itself unavailable and the pipeline
 * carries on without it. It does not invent a fallback, and it does not read
 * etsy.com pages instead — Etsy states plainly that screen-scraping is not
 * allowed, and a rule you route around is a rule you have broken.
 */

import { assertFetchAllowed } from './sources.js';
import { clampNumber, spacedSettled } from './util.js';

const BASE = 'https://api.etsy.com/v3/application';

/** Etsy money is {amount, divisor, currency_code}; 1250/100 = 12.50. */
export function etsyMoney(money) {
  const amount = Number(money?.amount);
  const divisor = Number(money?.divisor);
  if (!Number.isFinite(amount) || !Number.isFinite(divisor) || divisor === 0) return { price: null, currency: null };
  return { price: amount / divisor, currency: String(money?.currency_code ?? '').toUpperCase() || null };
}

/** A review is a complaint when the buyer was not happy. */
export const COMPLAINT_RATING_MAX = 3;

/**
 * What a review is actually complaining ABOUT.
 *
 * This must come from the reviewer's words, not from the product name. Using
 * the listing title looked reasonable and was quietly wrong: every complaint
 * on a listing then shared one subject, so complaints clustered by which
 * product someone bought rather than by what was wrong with it. Agreement
 * between complaints is the entire level-5 test, and that made it untestable
 * on the one source that gives us real reviews.
 *
 * The first clause of a review is nearly always the complaint itself — "It
 * never syncs with my accounting software, otherwise fine" — so that is what
 * is kept, capped short so one rambling review cannot dominate a cluster.
 */
export function complaintSubject(reviewText) {
  const text = String(reviewText ?? '').trim();
  if (!text) return '';
  // Split on the first sentence break or strong clause break.
  const firstClause = text.split(/(?<=[.!?])\s|,\s+(?:but|although|though|otherwise|however)\b|\s+[-—]\s+/i)[0] ?? text;
  return firstClause.replace(/\s+/g, ' ').trim().slice(0, 90);
}

export class EtsyError extends Error {
  constructor(status, body, url) {
    super(`Etsy API returned ${status} for ${url}: ${String(body).slice(0, 200)}`);
    this.name = 'EtsyError';
    this.status = status;
    this.url = url;
  }
}

export function createEtsy({ apiKey, ledger, fetchImpl = globalThis.fetch, deadline = null, gapMs = 350 }) {
  const available = Boolean(apiKey);

  // Etsy publishes the remaining quota on every response. Reading it is how
  // the HUD can show the real headroom rather than a number we assumed.
  let limits = { perSecond: null, remainingThisSecond: null, perDay: null, remainingToday: null, readAt: null };

  async function call(path, params = {}) {
    if (!available) throw new EtsyError(0, 'no API key configured', path);

    const url = new URL(`${BASE}${path}`);
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
    assertFetchAllowed(url.toString());

    const res = await fetchImpl(url.toString(), {
      headers: {
        'x-api-key': apiKey,
        accept: 'application/json',
        // Identify honestly. Never pretend to be a browser or a logged-in human.
        'user-agent': 'Selena/1.0 (unmet-demand research; contact via repository owner)',
      },
    });

    limits = {
      perSecond: Number(res.headers?.get?.('x-limit-per-second')) || limits.perSecond,
      remainingThisSecond: Number(res.headers?.get?.('x-remaining-this-secon')) || limits.remainingThisSecond,
      perDay: Number(res.headers?.get?.('x-limit-per-day')) || limits.perDay,
      remainingToday: Number(res.headers?.get?.('x-remaining-today')) || limits.remainingToday,
      readAt: new Date().toISOString(),
    };

    const text = await res.text();
    if (!res.ok) throw new EtsyError(res.status, text, url.toString());

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      throw new EtsyError(res.status, `response was not JSON: ${text.slice(0, 200)}`, url.toString());
    }
    return body;
  }

  /**
   * Marketplace-wide keyword search. `sort_on: 'score'` only works alongside a
   * search parameter, which is why keywords is required rather than optional.
   */
  async function searchListings({ keywords, limit = 12, minPrice = null, maxPrice = null }) {
    const body = await call('/listings/active', {
      keywords,
      limit: clampNumber(limit, 1, 100, 12),
      sort_on: 'score',
      min_price: minPrice,
      max_price: maxPrice,
    });

    // A null or a bare string inside results is not a listing. Etsy has not
    // done this, but an API that changes shape without telling you is the
    // normal case, and a TypeError here would sink an otherwise good run.
    const results = (Array.isArray(body?.results) ? body.results : []).filter((l) => l && typeof l === 'object');
    return results.map((l) => {
      const { price, currency } = etsyMoney(l.price);
      // The listing URL is what a claim cites, so it goes in the ledger — we
      // did read this listing's data, through the API, just now.
      if (l.url) ledger?.record({ url: l.url, status: 200, via: 'etsy-api', title: l.title ?? null, domain: 'etsy.com' });
      return {
        listingId: l.listing_id,
        shopId: l.shop_id,
        title: String(l.title ?? ''),
        description: String(l.description ?? '').slice(0, 2000),
        url: l.url ?? null,
        price,
        currency,
        quantity: clampNumber(l.quantity, 0, 1e9, 0),
        favourers: clampNumber(l.num_favorers, 0, 1e9, 0),
        tags: Array.isArray(l.tags) ? l.tags : [],
        createdAt: l.original_creation_timestamp ? new Date(l.original_creation_timestamp * 1000).toISOString() : null,
      };
    });
  }

  async function listingReviews(listingId, { limit = 20 } = {}) {
    const body = await call(`/listings/${encodeURIComponent(listingId)}/reviews`, { limit: clampNumber(limit, 1, 100, 20) });
    const results = (Array.isArray(body?.results) ? body.results : []).filter((r) => r && typeof r === 'object');
    return results.map((r) => ({
      listingId: r.listing_id ?? listingId,
      shopId: r.shop_id ?? null,
      rating: clampNumber(r.rating, 0, 5, 0),
      text: String(r.review ?? '').trim(),
      at: r.created_timestamp ? new Date(r.created_timestamp * 1000).toISOString() : null,
    }));
  }

  /**
   * Turn a topic into evidence.
   *
   * Deliberately partial-tolerant: five listings read out of eight is a finding
   * with a caveat, not an error. One failed review fetch must never sink the
   * batch, so this walks results one at a time with a gap between them —
   * external services silently drop rapid requests — and reports what it got.
   */
  async function gatherEvidence({ keywords, listingLimit = 8, reviewLimit = 20 }) {
    if (!available) {
      return {
        available: false,
        reason: 'ETSY_API_KEY is not set, so the strongest evidence source is dark. Nothing here is guessed in its place.',
        paying: [],
        complaints: [],
        incumbents: [],
        attempted: 0,
        read: 0,
      };
    }

    const listings = await searchListings({ keywords, limit: listingLimit });

    const reviewResults = await spacedSettled(
      listings,
      async (l) => ({ listing: l, reviews: await listingReviews(l.listingId, { limit: reviewLimit }) }),
      { gapMs, deadline },
    );

    const paying = [];
    const complaints = [];
    const incumbents = [];
    let read = 0;

    for (let i = 0; i < listings.length; i += 1) {
      const l = listings[i];
      if (!l.url || l.price === null) continue;

      const outcome = reviewResults[i];
      const reviews = outcome?.ok ? outcome.value.reviews : [];
      if (outcome?.ok) read += 1;

      // What we can honestly say about sales. Etsy exposes favourites and
      // stock, never units sold — so the signal is named for what it is and
      // the method travels with it. A number with no method is a fabrication
      // waiting to be quoted back at us.
      const salesSignal = reviews.length
        ? `${reviews.length} review${reviews.length === 1 ? '' : 's'} on this listing`
        : l.favourers
          ? `${l.favourers} favourites`
          : null;
      const signalMethod = reviews.length
        ? 'counted from the listing reviews endpoint; each review implies at least one purchase, so this is a floor on sales, not a total'
        : l.favourers
          ? 'num_favorers from the listing record; interest, not purchases'
          : null;

      paying.push({
        what: l.title,
        price: l.price,
        currency: l.currency,
        platform: 'etsy',
        url: l.url,
        salesSignal,
        signalMethod,
        via: 'etsy-api',
      });

      const unhappy = reviews.filter((r) => r.rating > 0 && r.rating <= COMPLAINT_RATING_MAX && r.text);
      for (const r of unhappy) {
        complaints.push({
          quote: r.text.slice(0, 1000),
          url: l.url,
          aboutWhat: complaintSubject(r.text),
          // Which product it was bought from, kept separately so it is
          // available without polluting the agreement test.
          product: l.title,
          date: r.at,
          platform: 'etsy',
          via: 'etsy-api',
        });
      }

      if (unhappy.length) {
        incumbents.push({
          name: l.title,
          url: l.url,
          price: l.price,
          currency: l.currency,
          whatTheyGetWrong: unhappy
            .slice(0, 3)
            .map((r) => r.text.slice(0, 160))
            .join(' | '),
          evidenceUrl: l.url,
        });
      }
    }

    const failures = reviewResults.filter((r) => !r.ok);

    return {
      available: true,
      reason: null,
      paying,
      complaints,
      incumbents,
      attempted: listings.length,
      read,
      // Partial success is not total failure — but it is not silent either.
      partial: failures.length > 0,
      failures: failures.map((f, i) => ({ listing: listings[i]?.url ?? null, error: f.error, skipped: f.skipped })),
      limits,
    };
  }

  return { available, searchListings, listingReviews, gatherEvidence, limits: () => limits };
}
