/**
 * Exploring: looking without being told where.
 *
 * A named watch answers "is there anything in bookkeeping for trades?". This
 * answers the question you did not think to ask. It reads the free community
 * sources broadly, clusters what people are actually asking for, and PROPOSES
 * watches.
 *
 * It proposes. It does not file findings on its own authority and it does not
 * stand its own watches — you approve them. That was a deliberate choice: an
 * agent that can both decide what to look for and decide what it found is an
 * agent that can talk itself into anything, and the whole system is arranged
 * around not doing that.
 *
 * The cost is one cheap model call. The reading is free — Hacker News and
 * Stack Exchange need no key — so exploring is something she can do often
 * without it showing up on the bill.
 */

import { nowIso, randomId, normalizePhrase, phraseSimilarity, clampNumber } from './util.js';
import { systemPrompt } from './prompts.js';
import { createWatch } from './watches.js';

export const PROPOSALS_KEY = 'proposals';

/**
 * Broad seeds: the phrasings people use when something is missing. Not
 * industries — those bias her towards what you already thought of. These are
 * the shapes of an unmet need, whatever the trade.
 */
export const SEEDS = [
  'is there a tool that',
  'looking for software that',
  'I need something that can',
  'still doing this manually',
  'spreadsheet to manage',
  'wish there was',
  'nothing does exactly',
  'we ended up building our own',
];

export const PROPOSAL_SCHEMA = {
  type: 'OBJECT',
  properties: {
    proposals: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          topic: { type: 'STRING', description: 'A watchable topic: specific enough to search, broad enough to recur.' },
          whoSeemsToHaveIt: { type: 'STRING', description: 'Which businesses, doing what. Not "small businesses".' },
          why: { type: 'STRING', description: 'What in the material suggested this, in one sentence.' },
          quoteUrls: { type: 'ARRAY', items: { type: 'STRING' }, description: 'The URLs of the asks that suggested it. Only URLs from the list given.' },
          confidence: { type: 'STRING', enum: ['low', 'medium', 'high'] },
        },
        required: ['topic', 'whoSeemsToHaveIt', 'why', 'quoteUrls', 'confidence'],
      },
    },
    nothingFound: { type: 'BOOLEAN', description: 'True if the material does not suggest any recurring need worth watching.' },
  },
  required: ['proposals'],
};

function explorePrompt({ asks, existingTopics }) {
  return `Below are things people posted, in their own words, on public forums. Each has a URL.

Find the RECURRING needs — where more than one person is describing the same missing thing. Ignore one-off questions, product announcements, and anything that is already well served.

Propose at most four topics worth standing a watch on. A good topic is specific enough that searching it returns the same kind of person twice, and broad enough that it will still be there next month. "Invoice chasing for one-to-three person trade firms" is a topic. "Software" is not, and neither is one company's product.

${existingTopics.length ? `Already being watched, so do NOT propose these again:\n${existingTopics.map((t) => `- ${t}`).join('\n')}\n` : ''}
Cite only URLs from this material. If nothing here shows a recurring need, say so — proposing something weak wastes a watch and the money it spends.

MATERIAL
${asks.map((a, i) => `[${i + 1}] ${a.url}\n${a.quote.slice(0, 380)}`).join('\n\n')}`;
}

/**
 * Go looking. Free reading, one cheap model call, and proposals only.
 *
 * @returns {{ok:boolean, proposals:Array, read:number, notes:string[], costUsd:number}}
 */
export async function explore({ seeds = null, limit = 4 } = {}, deps) {
  const now = deps.now ?? nowIso;
  const notes = [];
  let spendBefore = 0;
  try {
    spendBefore = await deps.store.getMonthlySpend();
  } catch {
    // A spend read failure must not stop her looking.
  }

  if (!deps.community) {
    return { ok: false, proposals: [], read: 0, notes: ['no community sources are configured, so there is nowhere to look'], costUsd: 0 };
  }

  // Rotate the seed each time so consecutive explorations do not read the same
  // page and propose the same thing. Deterministic from the clock rather than
  // random, so a run is reproducible from its timestamp.
  const pool = Array.isArray(seeds) && seeds.length ? seeds : SEEDS;
  const offset = Math.floor(Date.parse(now()) / 3_600_000) % pool.length;
  const chosen = [pool[offset], pool[(offset + 3) % pool.length]];

  const asks = [];
  for (const seed of chosen) {
    if (deps.deadline?.tooLateFor(8_000)) {
      notes.push('ran out of time before every seed was read');
      break;
    }
    try {
      const found = await deps.community.gatherAsks({ keywords: seed, hnLimit: 12, seLimit: 6 });
      asks.push(...found.asks);
      if (found.partial) notes.push(`while reading "${seed}": ${found.failures.map((f) => f.source).join(', ')} did not answer`);
    } catch (err) {
      notes.push(`"${seed}" could not be read (${err.message})`);
    }

    // Anything you plugged in yourself, read for the same seed. These are the
    // sources that know about barbers and letting agents; the free community
    // ones mostly know about software. Roaming without them only ever finds
    // one kind of person.
    if (deps.connectors) {
      try {
        const extra = await deps.connectors.gather(seed);
        asks.push(...extra.asks);
        if (extra.failures.length) notes.push(...extra.failures.map((f) => `${f.name} did not answer: ${f.detail}`));
      } catch (err) {
        notes.push(`your connected sources could not be read (${err.message})`);
      }
    }
  }

  if (!asks.length) {
    return { ok: false, proposals: [], read: 0, notes: [...notes, 'nothing readable came back from any source'], costUsd: 0 };
  }

  // De-duplicate: the same post surfacing under two seeds is one post.
  const seen = new Set();
  const unique = asks.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  if (!deps.llm) {
    return {
      ok: false,
      proposals: [],
      read: unique.length,
      notes: [...notes, `read ${unique.length} posts, but no model is configured to find the pattern in them. Nothing is proposed rather than guessed.`],
      costUsd: 0,
    };
  }

  const watches = await deps.store.listWatches().catch(() => []);
  const existingTopics = watches.map((w) => w.topic).filter(Boolean);

  let json = null;
  try {
    const res = await deps.llm.generateJson({
      tier: 'judge',
      systemInstruction: systemPrompt('You are looking for recurring unmet needs in raw forum posts. You propose things to watch; you never conclude that a need is real on this evidence alone, because nothing here proves anyone is paying.'),
      prompt: explorePrompt({ asks: unique.slice(0, 40), existingTopics }),
      responseSchema: PROPOSAL_SCHEMA,
      label: 'explore',
      timeoutMs: 30_000,
    });
    json = res.json;
    if (res.parseError) notes.push(`the model did not return usable JSON: ${res.parseError}`);
  } catch (err) {
    notes.push(`could not look for a pattern (${err.message})`);
  }

  let costUsd = 0;
  try {
    costUsd = Math.max(0, (await deps.store.getMonthlySpend()) - spendBefore);
  } catch {
    // Not worth failing a good exploration over.
  }

  if (!json || json.nothingFound || !Array.isArray(json.proposals) || !json.proposals.length) {
    return {
      ok: true,
      proposals: [],
      read: unique.length,
      notes: [...notes, `read ${unique.length} posts and found no recurring need worth a watch. That is a real answer.`],
      costUsd,
    };
  }

  const byUrl = new Map(unique.map((a) => [a.url, a]));

  const proposals = json.proposals
    .slice(0, clampNumber(limit, 1, 10, 4))
    .map((p) => {
      const topic = String(p.topic ?? '').trim();
      if (!topic) return null;

      // Same rule as everywhere else: a citation we did not read is deleted.
      const quotes = (Array.isArray(p.quoteUrls) ? p.quoteUrls : [])
        .map((u) => byUrl.get(u))
        .filter(Boolean)
        .slice(0, 4)
        .map((a) => ({ quote: a.quote.slice(0, 300), url: a.url }));

      // A proposal with no surviving quote rests on nothing.
      if (!quotes.length) return null;

      return {
        id: randomId('prop'),
        topic,
        whoSeemsToHaveIt: String(p.whoSeemsToHaveIt ?? '').trim(),
        why: String(p.why ?? '').trim(),
        confidence: ['low', 'medium', 'high'].includes(p.confidence) ? p.confidence : 'low',
        quotes,
        proposedAt: now(),
        state: 'proposed',
      };
    })
    .filter(Boolean)
    // Never propose something already being watched, whatever the model said.
    .filter((p) => !existingTopics.some((t) => phraseSimilarity(t, p.topic) >= 0.6));

  const dropped = json.proposals.length - proposals.length;
  if (dropped > 0) notes.push(`${dropped} proposal(s) dropped for citing nothing we read, or for duplicating a watch you already have`);

  return { ok: true, proposals, read: unique.length, notes, costUsd };
}

/** Proposals live in the store until you approve or dismiss them. */
export async function saveProposals(store, proposals) {
  const existing = (await store.getKv(PROPOSALS_KEY)) ?? [];
  const known = new Set(existing.map((p) => normalizePhrase(p.topic)));
  const fresh = proposals.filter((p) => !known.has(normalizePhrase(p.topic)));
  await store.setKv(PROPOSALS_KEY, [...existing, ...fresh]);
  return fresh;
}

export async function listProposals(store) {
  return ((await store.getKv(PROPOSALS_KEY)) ?? []).filter((p) => p.state === 'proposed');
}

/** Approving one is what actually creates the watch. Nothing runs before that. */
export async function approveProposal(store, id, { cadence = 'weekly' } = {}) {
  const all = (await store.getKv(PROPOSALS_KEY)) ?? [];
  const found = all.find((p) => p.id === id);
  if (!found) return { ok: false, error: 'no such proposal' };

  const watch = createWatch({ name: found.topic, topic: found.topic, cadence, roaming: true });
  await store.putWatch(watch);
  await store.setKv(
    PROPOSALS_KEY,
    // Kept, not removed: what she proposed and what you did about it is worth
    // being able to look back at.
    all.map((p) => (p.id === id ? { ...p, state: 'approved', approvedAt: nowIso(), watchId: watch.id } : p)),
  );
  return { ok: true, watch };
}

export async function dismissProposal(store, id) {
  const all = (await store.getKv(PROPOSALS_KEY)) ?? [];
  await store.setKv(
    PROPOSALS_KEY,
    all.map((p) => (p.id === id ? { ...p, state: 'dismissed', dismissedAt: nowIso() } : p)),
  );
  return { ok: true };
}
