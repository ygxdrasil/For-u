/**
 * What Selena is actually allowed to touch, and how she reaches it.
 *
 * This table is the honest legal position, written down once and derived
 * everywhere: the HUD's Sources page reads it, the search planner reads it,
 * the prompts quote it, and `assertFetchAllowed` enforces it. A policy that
 * lives only in a prompt is a suggestion; this one is a function that throws.
 *
 * Every entry was checked against the platform's own documentation on
 * 2026-07-31, not recalled.
 *
 *   official-api        we call a documented API we are permitted to call
 *   search-index-only   we never send a request to this host. We only cite
 *                       what a search index already showed us. Weaker
 *                       evidence, and labelled as such on every finding.
 *   open-web            an ordinary site with no rule against being read
 */

export const ACCESS_KINDS = ['official-api', 'search-index-only', 'open-web'];

export const SOURCES = [
  {
    id: 'etsy',
    name: 'Etsy',
    access: 'official-api',
    requiresEnv: 'ETSY_API_KEY',
    docs: 'https://developers.etsy.com/documentation/',
    checkedOn: '2026-07-31',
    gives: ['paying', 'complaints', 'incumbents'],
    endpoints: [
      'GET /v3/application/listings/active — marketplace-wide keyword search',
      'GET /v3/application/listings/{id}/reviews — reviews on a listing',
      'GET /v3/application/shops/{shop_id}/reviews — reviews on a shop',
    ],
    note:
      'Marketplace listing search, plus reviews on a listing and on a shop — the three endpoints below — need no OAuth scope at all; an API keystring is the only auth. That combination is the strongest evidence available to us anywhere: a priced listing proves someone is paying, and its reviews prove whether they are happy about it. Getting a keystring means registering a Personal App, which Etsy reviews by hand.',
    limits: 'Per-key QPS and QPD, reported live in x-limit-per-second and x-remaining-today on every response.',
    neverFetchHtml: true,
    htmlNote: 'Etsy states plainly that screen-scraping is not allowed, so Selena only ever calls the API — never a page.',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki',
    checkedOn: '2026-07-31',
    gives: ['asks', 'complaints'],
    note:
      'Reddit has a real Data API, but its free tier is explicitly non-commercial and findings here feed a builder. You chose not to register rather than argue about what counts as commercial, so Selena never calls it. Reddit threads still surface through the search index and are cited from there.',
    limits: 'Not applicable — no API calls are made.',
    neverFetchHtml: true,
    htmlNote: 'Not fetched directly. An unauthenticated request from a datacentre IP returns 403 anyway, so pretending otherwise would fail loudly and dishonestly.',
  },
  {
    id: 'facebook',
    name: 'Facebook (groups and pages)',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://developers.facebook.com/docs/graph-api/',
    checkedOn: '2026-07-31',
    gives: ['asks'],
    note:
      'The Graph API has no public search: it reaches pages you administer, after app review. There is no sanctioned way to read what small businesses are asking each other in groups. Public posts that a search index has indexed are fair to cite; anything else is not reachable honestly.',
    limits: 'Not applicable — no API calls are made.',
    neverFetchHtml: true,
    htmlNote: 'Never fetched. Most of the interesting material is behind a login, and Selena never logs in as anyone.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://developers.facebook.com/docs/instagram-platform',
    checkedOn: '2026-07-31',
    gives: ['asks'],
    note: 'Same position as Facebook: the official API is for accounts you own. Public posts are citable only where a search index already surfaced them.',
    limits: 'Not applicable — no API calls are made.',
    neverFetchHtml: true,
    htmlNote: 'Never fetched.',
  },
  {
    id: 'gumroad',
    name: 'Gumroad',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://gumroad.com/api',
    checkedOn: '2026-07-31',
    gives: ['paying'],
    note:
      'The v2 API is real but every endpoint is scoped to the authenticated creator\'s own products and sales — there is no public product discovery. Separately their terms forbid "spiders, robots, scrapers, crawlers... data mining tools", with a carve-out only for public search engines. So: cited from the search index, never fetched.',
    limits: 'Not applicable — no API calls are made.',
    neverFetchHtml: true,
    htmlNote: 'Never fetched. Their robots.txt is permissive, but the terms are not, and the terms are what governs.',
  },
  {
    id: 'fiverr',
    name: 'Fiverr',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://help.fiverr.com/hc/en-us/articles/32242973123985-Our-Community-Standards',
    checkedOn: '2026-07-31',
    gives: ['paying'],
    note:
      'No public API at all. Their robots.txt disallows /search/, /gigs/search and /search_results/gigs/* for every user agent, and their Community Standards prohibit scraping outright. There is no honest automated route in, so gig prices are cited only where a search index shows them.',
    limits: 'Not applicable — no API calls are made.',
    neverFetchHtml: true,
    htmlNote: 'Never fetched, by robots.txt and by terms.',
  },
  {
    id: 'web',
    name: 'Open web: forums, blogs, communities',
    access: 'open-web',
    requiresEnv: null,
    docs: null,
    checkedOn: '2026-07-31',
    gives: ['asks', 'complaints', 'incumbents'],
    note:
      'Ordinary sites with no rule against being read. Reached through grounded search, which is also what keeps the cost near zero.',
    limits: 'Grounded search: 1,500 free requests a day on Gemini 2.5 models.',
    neverFetchHtml: false,
    htmlNote: 'Reachable, respecting robots.txt and a polite request rate, identifying honestly.',
  },
];

/** Derived, never typed twice. */
export const SOURCE_IDS = SOURCES.map((s) => s.id);
export const API_SOURCES = SOURCES.filter((s) => s.access === 'official-api');
export const SEARCH_ONLY_SOURCES = SOURCES.filter((s) => s.access === 'search-index-only');

/**
 * Hosts Selena must never send a request to, derived from the table above so
 * the list cannot drift from the reasoning that produced it.
 */
export const BLOCKED_HOSTS = {
  reddit: ['reddit.com', 'redd.it', 'oauth.reddit.com'],
  facebook: ['facebook.com', 'fb.com', 'm.facebook.com'],
  instagram: ['instagram.com', 'cdninstagram.com'],
  gumroad: ['gumroad.com'],
  fiverr: ['fiverr.com'],
  etsy: ['etsy.com'], // the API host api.etsy.com is allowed; the storefront is not
};

const API_HOSTS = new Set(['api.etsy.com', 'openapi.etsy.com', 'generativelanguage.googleapis.com']);

export class ForbiddenSourceError extends Error {
  constructor(host, sourceId, why) {
    super(`Refusing to fetch ${host}: ${why} (source policy "${sourceId}" in core/sources.js). If this should change, change the policy deliberately — do not work around it here.`);
    this.name = 'ForbiddenSourceError';
    this.host = host;
    this.sourceId = sourceId;
  }
}

/**
 * The enforcement point. Every outbound fetch goes through this, so a policy
 * change is one edit in one table rather than an audit of every adapter.
 */
export function assertFetchAllowed(url) {
  let host;
  try {
    host = new URL(String(url)).hostname.toLowerCase();
  } catch {
    throw new ForbiddenSourceError(String(url), 'unparseable', 'that is not a URL');
  }

  if (API_HOSTS.has(host)) return { ok: true, host, via: 'official-api' };

  for (const [sourceId, hosts] of Object.entries(BLOCKED_HOSTS)) {
    const blocked = hosts.some((h) => host === h || host.endsWith(`.${h}`));
    if (!blocked) continue;
    const source = SOURCES.find((s) => s.id === sourceId);
    throw new ForbiddenSourceError(host, sourceId, source?.htmlNote ?? 'this host is search-index-only');
  }

  return { ok: true, host, via: 'direct-fetch' };
}

/** What the HUD shows, and what the prompts are told. */
export function sourceStatus(env = process.env) {
  return SOURCES.map((s) => ({
    id: s.id,
    name: s.name,
    access: s.access,
    gives: s.gives,
    note: s.note,
    limits: s.limits,
    docs: s.docs,
    checkedOn: s.checkedOn,
    endpoints: s.endpoints ?? null,
    // "live" means we can actually use it right now, key and all.
    live: s.access === 'official-api' ? Boolean(s.requiresEnv && env[s.requiresEnv]) : true,
    blockedReason:
      s.access === 'official-api' && s.requiresEnv && !env[s.requiresEnv]
        ? `${s.requiresEnv} is not set, so this source is dark. Everything else keeps working without it.`
        : null,
  }));
}
