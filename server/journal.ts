import {randomUUID} from 'node:crypto';
import {Document} from './store/index';

/**
 * A record of what Grace has actually done.
 *
 * An assistant that acts on your behalf and leaves no trace is not
 * trustworthy, however good her intentions. Everything she does off her own
 * bat lands here, and the interface shows it, so the answer to "what has she
 * been up to" is a list rather than an assurance.
 *
 * Kept short deliberately: this is a record of recent conduct, not an audit
 * log, and a thousand entries nobody reads is the same as none.
 */

export type Deed = 'acted' | 'noticed' | 'learned' | 'spoke';

export interface JournalEntry {
  id: string;
  at: string;
  kind: Deed;
  text: string;
  /** True when she did it unprompted rather than because she was asked. */
  unprompted?: boolean;
}

const LIMIT = 120;

const store = new Document<JournalEntry[]>('journal', () => []);

export function journal(): Promise<JournalEntry[]> {
  return store.read();
}

/** Most recent first, which is the only order anyone reads this in. */
export async function recentDeeds(limit = 25): Promise<JournalEntry[]> {
  const all = await store.read();
  return all.slice(-limit).reverse();
}

export async function noteDeed(
  kind: Deed,
  text: string,
  unprompted = false,
): Promise<void> {
  const clean = text.trim().slice(0, 300);
  if (!clean) return;

  const entry: JournalEntry = {
    id: randomUUID(),
    at: new Date().toISOString(),
    kind,
    text: clean,
    ...(unprompted ? {unprompted: true} : {}),
  };

  // Trimmed from the front rather than cleared: the oldest entry falling off
  // the end of a rolling window is not the same as destroying a record, and
  // she is not allowed to do the second.
  await store.update((current) => [...current, entry].slice(-LIMIT));
}
