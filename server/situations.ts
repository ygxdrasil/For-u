import {randomUUID} from 'node:crypto';
import {Document} from './store/index';

/**
 * Things in progress, with a state.
 *
 * A note is prose you read; a situation is something you track. "The Govee
 * order", "the PS5 bridge", "the deposit dispute" — each has a status and a
 * short history of what has happened, so the answer to "where are we with the
 * landlord" is a state, not a memory hunt.
 *
 * The difference from a reminder is that a reminder is a thing to do by a
 * time; a situation is a thing that is happening, that she watches and updates
 * as it moves. Resolved, never deleted.
 */

export interface Situation {
  id: string;
  title: string;
  status: 'open' | 'resolved';
  updates: {at: string; text: string}[];
  createdAt: string;
  resolvedAt?: string;
}

const store = new Document<Situation[]>('situations', () => []);

export function allSituations(): Promise<Situation[]> {
  return store.read();
}

export async function openSituations(): Promise<Situation[]> {
  const all = await store.read();
  return all
    .filter((one) => one.status === 'open')
    .sort((left, right) => lastMove(right).localeCompare(lastMove(left)));
}

function lastMove(one: Situation): string {
  return one.updates[one.updates.length - 1]?.at ?? one.createdAt;
}

/**
 * Writes merge only when titles mean the same thing once filler words are
 * dropped — substring matching used to file updates about "PS5 bridge" under
 * a situation called "PS5", and a misfiled update is invisible in a way a
 * second question is not.
 */
function find(list: Situation[], title: string): Situation | undefined {
  const needle = title.toLowerCase().trim();
  const meaning = essence(title);
  return list.find(
    (one) =>
      one.title.toLowerCase().trim() === needle ||
      (meaning.length > 0 && essence(one.title) === meaning),
  );
}

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

/** Words that carry no identity — "the deposit dispute" is "deposit dispute". */
const FILLER = new Set(['the', 'a', 'an', 'my', 'our', 'this', 'that', 'of', 'for']);

/** A title reduced to its meaningful words, order ignored. */
function essence(text: string): string {
  return words(text)
    .filter((word) => !FILLER.has(word))
    .sort()
    .join(' ');
}


/**
 * Resolving may be looser: "the govee order" should settle a situation called
 * "Govee order EU641959". Whole words only, so near-miss titles still refuse.
 */
function findForResolving(list: Situation[], title: string): Situation | undefined {
  const exact = find(list, title);
  if (exact) return exact;

  // Filler drops from the asked side too: "the govee order" must settle a
  // situation called "Govee order EU641959", and "the" is not a word anyone
  // stores. The all-filler guard stays, since every() over nothing is true.
  const asked = words(title).filter((word) => !FILLER.has(word));
  if (asked.length === 0) return undefined;
  return list.find((one) => {
    const own = new Set(words(one.title));
    return asked.every((word) => own.has(word));
  });
}

/** Note something new about a situation, opening it if it is unheard of. */
export async function trackSituation(title: string, update: string): Promise<Situation> {
  const clean = title.trim().slice(0, 80);
  const text = update.trim();
  if (!clean || !text) throw new Error('a situation needs a title and an update');

  const now = new Date().toISOString();
  let saved: Situation | null = null;

  await store.update((list) => {
    const existing = find(
      list.filter((one) => one.status === 'open'),
      clean,
    );

    if (existing) {
      saved = {...existing, updates: [...existing.updates, {at: now, text}]};
      return list.map((one) => (one.id === existing.id ? (saved as Situation) : one));
    }

    saved = {
      id: randomUUID(),
      title: clean,
      status: 'open',
      updates: [{at: now, text}],
      createdAt: now,
    };
    return [...list, saved];
  });

  return saved as Situation;
}

export async function resolveSituation(title: string): Promise<Situation | null> {
  const now = new Date().toISOString();
  let resolved: Situation | null = null;

  await store.update((list) => {
    const one = findForResolving(
      list.filter((s) => s.status === 'open'),
      title.trim(),
    );
    if (!one) return list;
    resolved = {...one, status: 'resolved', resolvedAt: now};
    return list.map((s) => (s.id === one.id ? (resolved as Situation) : s));
  });

  return resolved;
}
