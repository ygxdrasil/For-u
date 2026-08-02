/**
 * The sources that are worth having, already worked out.
 *
 * Every entry here was probed against the live API on the date below: the
 * exact URL, the exact field map, the exact link template. Nothing in this
 * file is written from memory or from documentation — the counts in the notes
 * are what actually came back.
 *
 * That matters because the failure mode of a hand-filled connector is silence.
 * It answers 200, the map points at the wrong key, nothing is read, and a month
 * later you wonder why she never finds anything. Every one of these was checked
 * for the thing that actually matters: did text AND a citable link come back.
 *
 * Two kinds, doing two different jobs:
 *
 *   forums   people saying what they need, in their own words. Asks and
 *            complaints. Never proof that anyone is paying.
 *   reviews  people who have ALREADY PAID saying what is wrong with what they
 *            bought. This is the rare one — paying and complaining in the same
 *            sentence is the shape of a level-4 finding, and app reviews are
 *            the only free source that reliably has it.
 */

export const STARTERS_CHECKED_ON = '2026-08-02';

/**
 * On MCP, plainly: five public servers with no authentication were probed and
 * all five answered — DeepWiki, Context7, GitMCP, Hugging Face and grep.app.
 * None of them is in this list, because none of them carries demand. They are
 * developer tooling: repository docs, library lookups, literal code-pattern
 * search. grep.app refuses a natural-language query outright and says so.
 *
 * The MCP client works and is tested; there is simply nothing public worth
 * pointing it at yet. An authenticated one — a market-data or CRM server you
 * have a token for — is a different matter, and the Connect page takes those.
 */

/**
 * A review feed is a standing corpus, not a search: the URL names one app and
 * always returns its most recent reviews. `searchable: false` says so, so no
 * search term is bolted onto the URL and the HUD can explain what it does
 * rather than implying it looks for your topic.
 *
 * One honest limitation of them, checked rather than assumed: all fifty
 * reviews in a feed share ONE link, because Apple publishes no per-review
 * permalink. A citation therefore points at the app's review page and the
 * quote is what you search that page for. That is a weaker citation than a
 * forum thread, and the ladder already handles it correctly — level 5 needs
 * two distinct paying URLs, so one app's reviews can never reach it alone,
 * however many complaints agree. Connect more than one and they can.
 */
export const STARTERS = [
  // ---- forums: people describing what is missing ------------------------
  {
    id: 'shopify-community',
    group: 'forum',
    name: 'Shopify Community',
    why: 'Merchants, not developers. Real small businesses describing what they need and cannot find — the probe turned up a thread literally titled "Merchants — what\'s the most annoying manual task you still do every week".',
    verified: '50 of 50 posts citable',
    kind: 'rest',
    url: 'https://community.shopify.com/search.json?q={query}',
    itemsPath: 'topics[]',
    textPath: 'title|excerpt|blurb',
    urlTemplate: 'https://community.shopify.com/t/{slug}/{id}',
    titlePath: 'title',
    gives: ['asks', 'complaints'],
    searchable: true,
  },
  {
    id: 'n8n-community',
    group: 'forum',
    name: 'n8n Community',
    why: 'People automating business processes, which means people describing the gap they are automating around. Doubly useful here because it is what Jason builds in.',
    verified: '50 of 50 posts citable',
    kind: 'rest',
    url: 'https://community.n8n.io/search.json?q={query}',
    itemsPath: 'topics[]',
    textPath: 'title|excerpt|blurb',
    urlTemplate: 'https://community.n8n.io/t/{slug}/{id}',
    titlePath: 'title',
    gives: ['asks', 'complaints'],
    searchable: true,
  },
  {
    id: 'make-community',
    group: 'forum',
    name: 'Make.com Community',
    why: 'The same shape as n8n from a different crowd — small firms wiring tools together because no single tool does the job.',
    verified: '50 of 50 posts citable',
    kind: 'rest',
    url: 'https://community.make.com/search.json?q={query}',
    itemsPath: 'topics[]',
    textPath: 'title|excerpt|blurb',
    urlTemplate: 'https://community.make.com/t/{slug}/{id}',
    titlePath: 'title',
    gives: ['asks', 'complaints'],
    searchable: true,
  },

  {
    id: 'lemmy-world',
    testQuery: 'small business',
    group: 'forum',
    name: 'Lemmy (lemmy.world and the federation)',
    why: 'A federated network of niche communities with a public API and no key. Search reaches across instances, so one connection covers a long tail of small groups no single forum would.',
    verified: '10 of 10 posts citable',
    kind: 'rest',
    url: 'https://lemmy.world/api/v3/search?q={query}&type_=Posts&limit=20&sort=New',
    itemsPath: 'posts[]',
    textPath: 'post.body|post.name',
    urlPath: 'post.ap_id',
    titlePath: 'post.name',
    gives: ['asks', 'complaints'],
    searchable: true,
  },

  // ---- complaints and paid demand from public records --------------------
  {
    id: 'cfpb',
    testQuery: 'billing',
    group: 'records',
    name: 'CFPB consumer complaints',
    why: 'The best free source of the rung that matters. Every record is somebody who bought a financial product and is describing, in their own words, what went wrong with it — 283,000 of them mention billing alone. The narrative field is the complaint verbatim, and each one has a public detail page to cite.',
    verified: '10 of 10 complaints citable, detail pages resolve',
    kind: 'rest',
    // `format=json` is what breaks this endpoint — it answers 400. Omitting it
    // is the whole difference between working and not, which is the kind of
    // thing you only learn by asking the server.
    url: 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/?search_term={query}&field=all&size=20&no_aggs=true',
    itemsPath: 'hits.hits[]',
    textPath: '_source.complaint_what_happened|_source.issue',
    urlTemplate: 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/detail/{_source.complaint_id}',
    titlePath: '_source.issue|_source.product',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: true,
  },
  {
    id: 'usaspending',
    testQuery: 'plumbing',
    group: 'records',
    name: 'US public contract awards',
    why: 'Itemised, published proof that an organisation is paying for something, with the amount and the supplier. A repeated award for the same service is demand with a price on it. No key of any kind.',
    verified: '10 of 10 awards citable — a real HVAC replacement contract with a public link',
    kind: 'rest',
    // POST only: this endpoint answers 405 to a GET, and the filter goes in
    // the body. Verified against the live API rather than read from docs.
    method: 'POST',
    url: 'https://api.usaspending.gov/api/v2/search/spending_by_award/',
    bodyTemplate: JSON.stringify({
      filters: {
        keywords: ['{query}'],
        award_type_codes: ['A', 'B', 'C', 'D'],
        time_period: [{ start_date: '2024-01-01', end_date: '2026-12-31' }],
      },
      fields: ['Award ID', 'Recipient Name', 'Description', 'Award Amount', 'Awarding Agency'],
      limit: 20,
      page: 1,
    }),
    itemsPath: 'results[]',
    textPath: 'Description|Recipient Name',
    urlTemplate: 'https://www.usaspending.gov/award/{generated_internal_id}',
    titlePath: 'Award ID',
    gives: ['paying', 'incumbents'],
    searchable: true,
  },
  {
    id: 'federal-register',
    testQuery: 'small business reporting',
    group: 'records',
    name: 'Federal Register',
    why: 'New rules are where compliance work comes from: a reporting requirement published today is a thing thousands of small firms will need help with next year. Keyless, and every document has a permanent link.',
    verified: '10 of 10 documents citable',
    kind: 'rest',
    url: 'https://www.federalregister.gov/api/v1/documents.json?conditions%5Bterm%5D={query}&per_page=20&order=newest',
    itemsPath: 'results[]',
    textPath: 'abstract|title',
    urlPath: 'html_url',
    titlePath: 'title',
    gives: ['asks'],
    searchable: true,
  },

  {
    id: 'github-issues',
    testQuery: 'invoicing',
    // Grouped with the asks, not with supply: an open issue is somebody
    // telling a product what it does not do, which is a request, not a
    // listing of what exists. A test caught this being the wrong way round.
    group: 'forum',
    name: 'GitHub issue search',
    why: 'Open issues are feature requests: people telling a product, in public and with a permanent link, exactly what it does not do. The probe returned "[Feature Request] Disable automatic invoicing" on the first try.',
    verified: '6 of 6 issues citable',
    kind: 'rest',
    // Unauthenticated search is limited to about ten requests a minute, which
    // is far more than her cadence needs. A token would raise it if it ever
    // mattered.
    url: 'https://api.github.com/search/issues?q={query}+in:title+state:open&per_page=20&sort=created',
    itemsPath: 'items[]',
    textPath: 'title|body',
    urlPath: 'html_url',
    titlePath: 'title',
    gives: ['asks', 'complaints'],
    searchable: true,
  },
  // ---- what already exists ----------------------------------------------
  {
    id: 'npm-search',
    testQuery: 'invoice',
    group: 'incumbents',
    name: 'npm registry search',
    why: 'The other half of a finding: what already exists, so she can say what the incumbents are rather than guessing. Nothing here is evidence of demand — it is evidence of supply, and the ladder treats it that way.',
    verified: '10 of 10 packages citable',
    kind: 'rest',
    url: 'https://registry.npmjs.org/-/v1/search?text={query}&size=20',
    itemsPath: 'objects[]',
    textPath: 'package.description|package.name',
    urlPath: 'package.links.npm',
    titlePath: 'package.name',
    gives: ['incumbents'],
    searchable: true,
  },

  // ---- reviews: people who are already paying ---------------------------
  // Deliberately the BUSINESS-side apps. Booksy and Fresha both have a
  // customer app with far more ratings, and its reviews are people rating
  // their haircut — worthless here. These are the ones the shop pays for.
  {
    id: 'booksy-biz',
    group: 'reviews',
    name: 'Booksy Biz reviews (barbers, salons)',
    why: 'Barbers and salon owners who pay monthly for booking software, saying what it gets wrong. Of the 50 most recent, 8 were three stars or below — that is paying and complaining in one record.',
    verified: '50 of 50 reviews citable, 8 at 3 stars or below',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=725335996/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: false,
  },
  {
    id: 'fresha-business',
    group: 'reviews',
    name: 'Fresha for business reviews',
    why: 'The same trade, a rival product. 20 of the 50 most recent were three stars or below, several about being charged for things they did not expect.',
    verified: '50 of 50 reviews citable, 20 at 3 stars or below',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=1455346253/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: false,
  },
  {
    id: 'tradify',
    group: 'reviews',
    name: 'Tradify reviews (plumbers, sparkies, builders)',
    why: 'Trade firms paying for quoting and invoicing software. 14 of the 50 most recent were three stars or below, and they are specific about what breaks.',
    verified: '50 of 50 reviews citable, 14 at 3 stars or below',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=984378901/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: false,
  },
  {
    id: 'servicem8',
    group: 'reviews',
    name: 'ServiceM8 reviews (field service)',
    why: 'Job management for firms that send people to sites. 15 of the 50 most recent were three stars or below.',
    verified: '50 of 50 reviews citable, 15 at 3 stars or below',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=378062736/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: false,
  },
  {
    id: 'square-pos',
    group: 'reviews',
    name: 'Square Point of Sale reviews',
    why: 'The broadest of the set: any small business taking payments. 30 of the 50 most recent were three stars or below.',
    verified: '50 of 50 reviews citable, 30 at 3 stars or below',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=335393788/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
    searchable: false,
  },
];

/**
 * Which ones to switch on when you press the button.
 *
 * Not all of them. Every connected source is a request on every run, and a
 * dozen of them makes a run slow and its findings noisy without making them
 * better. This is a spread: two places people ask, two records of people
 * paying, one of what already exists, and the review feeds that carry paying
 * and complaining together. The rest are one tick away.
 */
export const DEFAULT_SET = [
  'shopify-community',
  'n8n-community',
  'cfpb',
  'usaspending',
  'github-issues',
  'booksy-biz',
  'tradify',
  'servicem8',
  'square-pos',
];

/** The order the HUD groups them in, and what each group is for. */
export const GROUPS = [
  { id: 'forum', label: 'FORUMS', note: 'People saying what they need. Asks and complaints; never proof anyone is paying.' },
  { id: 'reviews', label: 'REVIEWS', note: 'People who have already paid, saying what is wrong with it. The rare source that can reach level 4 on its own.' },
  { id: 'records', label: 'PUBLIC RECORDS', note: 'Complaints and contracts on the record. Slow-moving, hard to argue with, and the only place a price comes with a document.' },
  { id: 'incumbents', label: 'WHAT ALREADY EXISTS', note: 'Evidence of supply, not demand. It tells her what a finding has to beat — the ladder never counts it as anyone wanting anything.' },
];

export function starterById(id) {
  return STARTERS.find((s) => s.id === id) ?? null;
}

/** The shape addConnector wants, from the shape a human wants to read. */
export function connectorInputFor(starter) {
  return {
    kind: starter.kind,
    name: starter.name,
    url: starter.url,
    method: starter.method ?? 'GET',
    bodyTemplate: starter.bodyTemplate ?? null,
    itemsPath: starter.itemsPath ?? null,
    textPath: starter.textPath ?? null,
    urlPath: starter.urlPath ?? null,
    urlTemplate: starter.urlTemplate ?? null,
    titlePath: starter.titlePath ?? null,
    gives: starter.gives,
    searchable: starter.searchable !== false,
    // A term this source is known to have results for. Pressing test should
    // prove the CONNECTION, not accidentally prove that a procurement
    // database has no contracts matching "is there a tool that" — which is a
    // true answer that reads exactly like a broken source.
    testQuery: starter.testQuery ?? null,
    starterId: starter.id,
  };
}
