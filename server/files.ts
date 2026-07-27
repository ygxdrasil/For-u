import {randomUUID} from 'node:crypto';
import {Document} from './store/index';

/**
 * Documents she can refer back to.
 *
 * The text is extracted in the browser and only the text is sent — never the
 * raw file. That keeps a PDF's ten megabytes out of a store meant for small
 * encrypted documents, and keeps PDF-parsing (which is heavy and fussy in a
 * serverless function) off the server entirely: whatever the browser could
 * read as text is what she keeps.
 *
 * Capped hard. This is a place to keep a few reference documents she can
 * search, not a filing cabinet, and an unbounded blob store on Redis is a
 * bill waiting to happen.
 */

export interface StoredFile {
  id: string;
  name: string;
  text: string;
  chars: number;
  addedAt: string;
  archivedAt?: string;
}

/** Per file, and overall, so neither one document nor the pile runs away. */
const MAX_CHARS = 40_000;
const MAX_FILES = 40;

const store = new Document<StoredFile[]>('files', () => []);

export function allFiles(): Promise<StoredFile[]> {
  return store.read();
}

export async function liveFiles(): Promise<StoredFile[]> {
  return (await store.read())
    .filter((file) => !file.archivedAt)
    .sort((left, right) => right.addedAt.localeCompare(left.addedAt));
}

/**
 * One document by name, however loosely it was said.
 *
 * Exact first, so "Notes" cannot be captured by "Notes (old)". Spoken names
 * arrive approximate, and reading back the wrong document is worse than
 * failing to find one.
 */
export async function findFile(said: string): Promise<StoredFile | undefined> {
  const needle = said.toLowerCase().trim();
  if (!needle) return undefined;

  const live = await liveFiles();
  return (
    live.find((file) => file.name.toLowerCase().trim() === needle) ??
    live.find((file) => file.name.toLowerCase().includes(needle))
  );
}

export async function addFile(name: string, text: string): Promise<StoredFile> {
  const clean = name.trim().slice(0, 120) || 'untitled';
  const body = text.trim().slice(0, MAX_CHARS);
  if (!body) throw new Error('there was no readable text in that file');

  const file: StoredFile = {
    id: randomUUID(),
    name: clean,
    text: body,
    chars: body.length,
    addedAt: new Date().toISOString(),
  };

  await store.update((files) => {
    // A re-upload of the same name replaces, so correcting a document does not
    // leave two. Oldest fall off the end past the cap — archived first so the
    // record survives even that.
    const others = files.filter((one) => one.name !== clean || one.archivedAt);
    const kept = [file, ...others];
    const live = kept.filter((one) => !one.archivedAt);
    if (live.length > MAX_FILES) {
      const cut = live.slice(MAX_FILES).map((one) => one.id);
      return kept.map((one) =>
        cut.includes(one.id) ? {...one, archivedAt: new Date().toISOString()} : one,
      );
    }
    return kept;
  });

  return file;
}

export async function archiveFile(id: string): Promise<StoredFile[]> {
  await store.update((files) =>
    files.map((file) =>
      file.id === id ? {...file, archivedAt: new Date().toISOString()} : file,
    ),
  );
  return liveFiles();
}

const NOISE = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is',
  'was', 'what', 'does', 'say', 'about', 'my', 'the', 'that', 'this', 'it',
]);

/** The same plain word-overlap search her memory uses; no model, no cost. */
export async function searchFiles(query: string): Promise<{name: string; excerpt: string}[]> {
  const needles = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !NOISE.has(word));
  if (needles.length === 0) return [];

  const files = await liveFiles();
  return files
    .map((file) => {
      const lower = file.text.toLowerCase();
      const hits = needles.filter((needle) => lower.includes(needle));
      if (hits.length === 0) return null;
      // A window around the first hit, so she quotes the relevant part rather
      // than the top of the document.
      const at = lower.indexOf(hits[0]);
      const excerpt = file.text.slice(Math.max(0, at - 120), at + 400).trim();
      return {name: file.name, excerpt, score: hits.length};
    })
    .filter((row): row is {name: string; excerpt: string; score: number} => Boolean(row))
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(({name, excerpt}) => ({name, excerpt}));
}
