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
 * A review feed is a standing corpus, not a search: the URL names one app and
 * always returns its most recent reviews. `searchable: false` says so, so no
 * search term is bolted onto the URL and the HUD can explain what it does
 * rather than implying it looks for your topic.
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

/** Which ones to switch on when you press "connect the lot". */
export const DEFAULT_SET = ['shopify-community', 'n8n-community', 'booksy-biz', 'tradify', 'servicem8', 'square-pos'];

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
    starterId: starter.id,
  };
}
