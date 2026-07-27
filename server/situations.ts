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

function find(list: Situation[], title: string): Situation | undefined {
  const needle = title.toLowerCase().trim();
  return (
    list.find((one) => one.title.toLowerCase() === needle) ??
    list.find((one) => one.title.toLowerCase().includes(needle)) ??
    list.find((one) => needle.includes(one.title.toLowerCase()))
  );
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
    const one = find(
      list.filter((s) => s.status === 'open'),
      title.trim(),
    );
    if (!one) return list;
    resolved = {...one, status: 'resolved', resolvedAt: now};
    return list.map((s) => (s.id === one.id ? (resolved as Situation) : s));
  });

  return resolved;
}
