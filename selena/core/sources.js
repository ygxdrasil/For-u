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
      'The Graph API has no public search: it reaches pages you administer, after app review, and Meta confirmed in 2026 that there is still no public keyword or hashtag search endpoint. One route to public Facebook and Instagram posts does exist — the Meta Content Library — and it is genuinely what you would want: searchable public posts from Pages, groups and verified accounts. It is restricted to academic and nonprofit researchers and explicitly not available to commercial or independent developers, so it is not open to us. Public posts a search index has already surfaced are fair to cite; nothing else is reachable honestly.',
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
    note: 'Same position as Facebook: the official API is for accounts you own, there is no public hashtag or keyword search, and the Meta Content Library that would cover it is limited to academic and nonprofit researchers. Public posts are citable only where a search index already surfaced them.',
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
    id: 'hackernews',
    name: 'Hacker News',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://hn.algolia.com/api',
    checkedOn: '2026-08-01',
    gives: ['asks', 'complaints'],
    endpoints: ['GET hn.algolia.com/api/v1/search?query=…&tags=(story,comment)'],
    note:
      "Algolia's public search over every Hacker News story and comment. No key, no account, no registration — verified working on the date above. Show HN posts are people describing what they built because nothing existed; the comment threads are people saying what is wrong with what does. Asks only: nothing here proves anyone is paying, so on its own it cannot push a finding past level 2.",
    limits: 'No published quota. Requests are spaced anyway, because a free service deserves not to be hammered.',
    neverFetchHtml: false,
    htmlNote: 'The API is the route in. Quotes link to the permanent news.ycombinator.com item so you can check them.',
  },
  {
    id: 'stackexchange',
    name: 'Stack Exchange (softwarerecs, webapps, workplace, money)',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://api.stackexchange.com/docs',
    checkedOn: '2026-08-01',
    gives: ['asks', 'complaints', 'incumbents'],
    endpoints: ['GET api.stackexchange.com/2.3/search/advanced?q=…&site=softwarerecs&filter=withbody'],
    note:
      'Free without a key at 300 requests a day — verified, and the API reports the remaining quota on every response. softwarerecs is the reason this source is here: every question on it is somebody writing "I need a tool that does X and here is what I have already tried and hated", which is the exact sentence this system exists to find. Asks and complaints, never proof of payment.',
    limits: '300 requests a day without a key. A free key raises it to 10,000, and is not needed yet.',
    neverFetchHtml: false,
    htmlNote: 'The API is the route in; quotes link to the question itself.',
  },
  {
    id: 'discourse',
    name: 'Discourse forums (any public instance)',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://docs.discourse.org/',
    checkedOn: '2026-08-02',
    gives: ['asks', 'complaints', 'incumbents'],
    endpoints: ['GET {forum}/search.json?q=…', 'GET {forum}/t/{slug}/{id}.json — a whole thread'],
    connectable: true,
    note:
      'The quiet winner of the whole search. Discourse powers thousands of trade and niche-business forums, and every public instance exposes the same documented JSON API to anonymous readers — no key, no registration, and no meaningful rate limit on public reads. This is how you reach the barbers, the letting agents and the wedding florists: not one big platform, but a hundred small forums that all speak the same protocol. Add the ones for your trades on the Sources page and she reads them all with one adapter.',
    limits: 'No strict limit on anonymous public reads. Private or login-walled forums return nothing, and are not worked around.',
    neverFetchHtml: false,
    htmlNote: 'The .json endpoints are the documented route in; quotes link back to the human thread.',
  },
  {
    id: 'appstores',
    name: 'App Store and Google Play reviews',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://developer.apple.com/documentation/appstoreconnectapi',
    checkedOn: '2026-08-02',
    gives: ['paying', 'complaints', 'incumbents'],
    endpoints: ['GET itunes.apple.com/{country}/rss/customerreviews/page={n}/sortBy=mostRecent/id={appId}/json'],
    connectable: true,
    note:
      "Apple's customer-reviews feed is public, keyless, and returns roughly 50 reviews a page for up to ten pages per storefront. It is one of the few places where paying and complaining sit in the same record: someone bought the app and is telling you what is wrong with it. That is a level-4 shape straight out of the box. Apple throttles the feed hard per IP, so requests are spaced. Google Play has no equivalent public feed and needs a Play Console account for the reviews API.",
    limits: 'Throttled aggressively per egress IP; about 500 recent reviews per app per storefront.',
    neverFetchHtml: false,
    htmlNote: 'The RSS/JSON feed only. The store pages themselves are not scraped.',
  },
  {
    id: 'procurement',
    name: 'Public procurement: tenders and contract awards',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://api.usaspending.gov/',
    checkedOn: '2026-08-02',
    gives: ['paying', 'incumbents'],
    endpoints: [
      'POST api.usaspending.gov/api/v2/search/spending_by_award — no key at all',
      'GET api.sam.gov/opportunities/v2/search — free key, US federal notices',
      'GET ted.europa.eu/api — EU tender notices',
      'GET www.contractsfinder.service.gov.uk/Published/Notices/OCDS/Search — UK',
    ],
    connectable: true,
    note:
      'Documented, published, itemised proof that an organisation is paying for something — which is the rung of the ladder everything else struggles to reach. USAspending needs no key whatsoever. A repeated tender for the same service, or a framework nobody bids on, is demand with a price attached and a public paper trail. Weaker on complaints: it tells you what was bought, not whether anyone was happy.',
    limits: 'USAspending: unauthenticated, generous. SAM.gov: free key, rate-limited by account tier.',
    neverFetchHtml: false,
    htmlNote: 'All of these are open data programmes that exist to be read programmatically.',
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    access: 'official-api',
    requiresEnv: null,
    docs: 'https://api.producthunt.com/v2/docs',
    checkedOn: '2026-08-02',
    gives: ['incumbents', 'complaints'],
    endpoints: ['POST api.producthunt.com/v2/api/graphql'],
    connectable: true,
    note:
      'A free developer token, issued in about a minute, with a read-only public scope. Useful for the other half of a finding: what already exists, what it charges, and what the comments say it does not do. Read-only public data at 6,250 complexity points per fifteen minutes.',
    limits: '6,250 complexity points per 15 minutes on a free developer token.',
    neverFetchHtml: false,
    htmlNote: 'GraphQL only.',
  },
  {
    id: 'marketplaces-gated',
    name: 'Upwork, Thumbtack, Nextdoor (application-gated)',
    access: 'search-index-only',
    requiresEnv: null,
    docs: 'https://www.upwork.com/developer',
    checkedOn: '2026-08-02',
    connectable: true,
    gives: ['asks', 'paying'],
    note:
      'All three have real APIs and none of them is open. Upwork\'s GraphQL API needs OAuth and an approved app, and job search through it is oriented at clients rather than at market research. Thumbtack\'s is a partner Leads API you have to request access to by hand. Nextdoor\'s developer portal is real but application-gated to advertising partners, publishers and public agencies — there is no general read API. If you get approved for any of them, paste the credentials on the Sources page and she will use them; until then they are search-index-only, like Reddit.',
    limits: 'Not applicable — no API calls are made without credentials you have added.',
    neverFetchHtml: true,
    htmlNote: 'Not fetched. If you are approved, connect the API rather than the website.',
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
  // Real APIs, all three application-gated. The websites stay blocked; if you
  // are approved, you connect the API host, which is not on this list.
  'marketplaces-gated': ['upwork.com', 'thumbtack.com', 'nextdoor.com'],
};

const API_HOSTS = new Set([
  'api.etsy.com',
  'openapi.etsy.com',
  'generativelanguage.googleapis.com',
  'hn.algolia.com',
  'news.ycombinator.com',
  'api.stackexchange.com',
  // Keyless and documented for anonymous reads.
  'itunes.apple.com',
  'api.usaspending.gov',
  'api.sam.gov',
  'ted.europa.eu',
  'www.contractsfinder.service.gov.uk',
  'api.producthunt.com',
  // The gated marketplaces' API hosts, so an approved key works while the
  // storefronts above stay refused.
  'api.upwork.com',
  'api.thumbtack.com',
  'api.nextdoor.com',
]);

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
    // "live" means we can actually use it right now. An official API that
    // needs no key is live the moment it is deployed — reporting Hacker News
    // and Stack Exchange as "dark" because they have no env var to check was
    // an honest-looking lie about two sources that work out of the box.
    live: s.access === 'official-api' ? (s.requiresEnv ? Boolean(env[s.requiresEnv]) : true) : true,
    needsKey: Boolean(s.requiresEnv),
    blockedReason:
      s.access === 'official-api' && s.requiresEnv && !env[s.requiresEnv]
        ? `${s.requiresEnv} is not set, so this source is dark. Everything else keeps working without it.`
        : null,
  }));
}
