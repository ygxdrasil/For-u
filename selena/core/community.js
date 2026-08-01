/**
 * Where people say what they need, on platforms that permit being read.
 *
 * Two APIs, both verified working with no key and no account on 2026-08-01:
 *
 *   Hacker News, through Algolia's public search API. No auth, no key, no
 *   registration. "Show HN" posts and their comment threads are people
 *   describing what they built because nothing existed, and what they wish
 *   existed — which is the raw material for level 1 and 2 evidence.
 *
 *   Stack Exchange, 300 requests a day without a key. The site that matters
 *   most is softwarerecs: it is literally a queue of people writing "I need a
 *   tool that does X and everything I have tried is wrong". That is the
 *   sentence this whole system exists to find.
 *
 * What they give and what they do not: both are ASKS. Neither proves anyone is
 * paying, so on their own they cannot push a finding past level 2. They earn
 * their place by being free, permitted, and full of people stating a need in
 * their own words with a permanent link — which is exactly what the schema
 * demands and what a search snippet cannot give you.
 */

import { assertFetchAllowed } from './sources.js';
import { clampNumber, spacedSettled } from './util.js';

const UA = 'Selena/1.0 (unmet-demand research; contact via repository owner)';

/**
 * Both APIs return HTML-escaped text. Left alone, a quote reads
 * "I&#x27;m looking for" — which is not what anybody said, and a quote that is
 * not verbatim is not evidence. Only the handful of entities that actually
 * appear are decoded; a full HTML parser for five characters would be weight
 * with no payoff.
 */
const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  '&nbsp;': ' ', '&hellip;': '…', '&mdash;': '—', '&ndash;': '–', '&#39;': "'", '&#x27;': "'",
};

export function decodeEntities(text) {
  return String(text ?? '')
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp|hellip|mdash|ndash|#39|#x27);/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    // Anything numeric that is left, decoded generically.
    .replace(/&#(\d{1,6});/g, (_, code) => {
      const n = Number(code);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '';
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, hex) => {
      const n = Number.parseInt(hex, 16);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '';
    });
}

/** Tags out, entities decoded, whitespace collapsed — in that order. */
function plainText(raw) {
  return decodeEntities(String(raw ?? '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/**
 * Stack Exchange sites worth asking, most useful first.
 *
 * softwarerecs is first for a reason: every question on it is a person
 * describing an unmet need and what disappointed them.
 */
export const SE_SITES = [
  { site: 'softwarerecs', why: 'people asking for a tool that does X, and saying what they have already tried' },
  { site: 'webapps', why: 'people struggling with the SaaS they already pay for' },
  { site: 'workplace', why: 'process pain in small businesses, described by the person living it' },
  { site: 'money', why: 'bookkeeping, invoicing and getting paid' },
];

export class CommunityError extends Error {
  constructor(source, status, detail) {
    super(`${source} returned ${status}: ${String(detail).slice(0, 160)}`);
    this.name = 'CommunityError';
    this.source = source;
    this.status = status;
  }
}

async function getJson(url, fetchImpl, source) {
  assertFetchAllowed(url);
  const res = await fetchImpl(url, { headers: { accept: 'application/json', 'user-agent': UA } });
  const text = await res.text();
  if (!res.ok) throw new CommunityError(source, res.status, text);
  try {
    return JSON.parse(text);
  } catch {
    throw new CommunityError(source, res.status, `response was not JSON: ${text.slice(0, 120)}`);
  }
}

/**
 * Hacker News via Algolia. Stories AND comments — the comments are where
 * people say what is actually wrong with something.
 */
export async function searchHackerNews({ keywords, limit = 8, fetchImpl = globalThis.fetch }) {
  const n = clampNumber(limit, 1, 50, 8);
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keywords)}&tags=(story,comment)&hitsPerPage=${n}`;
  const body = await getJson(url, fetchImpl, 'Hacker News');

  const hits = Array.isArray(body?.hits) ? body.hits.filter((h) => h && typeof h === 'object') : [];
  return hits
    .map((h) => {
      const text = plainText(h.comment_text ?? h.story_text ?? h.title);
      if (!text || text.length < 25) return null;
      const id = h.objectID;
      if (!id) return null;
      return {
        quote: text.slice(0, 900),
        // The permanent HN item, never the Algolia URL. That is the page a
        // human would open to check the quote.
        url: `https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`,
        date: h.created_at ?? null,
        platform: 'web',
        via: 'direct-fetch',
        weight: clampNumber(h.points ?? h.num_comments ?? 0, 0, 1e6, 0),
        title: plainText(h.story_title ?? h.title).slice(0, 200),
      };
    })
    .filter(Boolean);
}

/** One Stack Exchange site. `filter=withbody` is what returns the question text. */
export async function searchStackExchange({ keywords, site = 'softwarerecs', limit = 6, fetchImpl = globalThis.fetch }) {
  const n = clampNumber(limit, 1, 30, 6);
  const url =
    `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(keywords)}` +
    `&site=${encodeURIComponent(site)}&pagesize=${n}&filter=withbody`;
  const body = await getJson(url, fetchImpl, `Stack Exchange (${site})`);

  const items = Array.isArray(body?.items) ? body.items.filter((i) => i && typeof i === 'object') : [];
  return {
    // The API tells you how much of the daily allowance is left. Reading it is
    // how the HUD can show real headroom rather than a number we assumed.
    quotaRemaining: Number.isFinite(Number(body?.quota_remaining)) ? Number(body.quota_remaining) : null,
    quotaMax: Number.isFinite(Number(body?.quota_max)) ? Number(body.quota_max) : null,
    asks: items
      .map((i) => {
        const text = plainText(i.body ?? i.title);
        if (!text || !i.link) return null;
        return {
          quote: text.slice(0, 900),
          url: String(i.link),
          date: i.creation_date ? new Date(i.creation_date * 1000).toISOString() : null,
          platform: 'forum',
          via: 'direct-fetch',
          weight: clampNumber(i.score ?? 0, -1000, 1e6, 0) + clampNumber(i.answer_count ?? 0, 0, 1e6, 0),
          title: plainText(i.title).slice(0, 200),
        };
      })
      .filter(Boolean),
  };
}

/**
 * Ask every free community source and return what they said, in the schema's
 * shape. Partial results are a caveat, never a failure — one dead API must not
 * cost the run everything the others found.
 */
export function createCommunity({ fetchImpl = globalThis.fetch, deadline = null, gapMs = 350, seSites = SE_SITES } = {}) {
  return {
    available: true,
    async gatherAsks({ keywords, hnLimit = 8, seLimit = 5, sites = seSites.slice(0, 2) }) {
      const asks = [];
      const failures = [];
      let quota = null;

      const hn = await spacedSettled(
        [null],
        () => searchHackerNews({ keywords, limit: hnLimit, fetchImpl }),
        { gapMs: 0, deadline },
      );
      if (hn[0]?.ok) asks.push(...hn[0].value);
      else if (hn[0] && !hn[0].skipped) failures.push({ source: 'Hacker News', error: hn[0].error });

      const seResults = await spacedSettled(
        sites,
        (s) => searchStackExchange({ keywords, site: s.site ?? s, limit: seLimit, fetchImpl }),
        { gapMs, deadline },
      );
      seResults.forEach((r, i) => {
        if (r.ok) {
          asks.push(...r.value.asks);
          if (r.value.quotaRemaining !== null) quota = { remaining: r.value.quotaRemaining, max: r.value.quotaMax };
        } else if (!r.skipped) {
          failures.push({ source: `Stack Exchange (${sites[i]?.site ?? sites[i]})`, error: r.error });
        }
      });

      // Strongest signal first: an ask with many upvotes is many people saying
      // "me too" without typing it.
      asks.sort((a, b) => b.weight - a.weight);

      return {
        asks,
        failures,
        partial: failures.length > 0,
        quota,
        attempted: 1 + sites.length,
        read: 1 + sites.length - failures.length,
      };
    },
  };
}
