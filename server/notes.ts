import {randomUUID} from 'node:crypto';
import {Document} from './store/index';

/**
 * A page per project, kept current as you talk.
 *
 * The profile holds durable facts about a person; a note holds the running
 * state of a *thing* — a trip being planned, a flat being renovated, a piece
 * of work in progress. She adds to it as the subject comes up, and the user
 * can read and correct it. It is the difference between an assistant who
 * remembers you take tea black and one who remembers where the Berlin trip
 * got to.
 *
 * Archived, never deleted, like everything she keeps.
 */

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

const store = new Document<Note[]>('notes', () => []);

export function allNotes(): Promise<Note[]> {
  return store.read();
}

/** Live notes, most recently touched first. */
export async function liveNotes(): Promise<Note[]> {
  const all = await store.read();
  return all
    .filter((note) => !note.archivedAt)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

/**
 * Writes merge only when the titles mean the same thing: identical, or
 * identical once filler words are dropped ("the deposit dispute" is "deposit
 * dispute"). There used to be a substring fallback here, and it silently
 * merged strangers — a note called "car" captured everything written to
 * "Oscar plans", because "oscar" contains "car". A wrong merge is invisible
 * in a way a second question is not, so fragments never match.
 */
function match(notes: Note[], title: string): Note | undefined {
  const needle = title.toLowerCase().trim();
  const meaning = essence(title);
  return notes.find(
    (note) =>
      note.title.toLowerCase().trim() === needle ||
      (meaning.length > 0 && essence(note.title) === meaning),
  );
}

/** The words of a title, for matching that never trips on a fragment. */
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
 * Reads may be looser, because a wrong read shows and a wrong write hides.
 *
 * "Berlin" finds the "Berlin trip" note — asking by half a title is how
 * people talk, especially aloud. But looseness stops at whole words: "car"
 * still refuses "Oscar plans", because "car" is not a word of that title,
 * only a fragment of one.
 */
function findForReading(notes: Note[], title: string): Note | undefined {
  const exact = match(notes, title);
  if (exact) return exact;

  const asked = words(title);
  if (asked.length === 0) return undefined;
  return notes.find((note) => {
    const own = new Set(words(note.title));
    return asked.every((word) => own.has(word));
  });
}

/**
 * Write to a note, creating it if it is new.
 *
 * `append` is the common case — she is adding the latest to an ongoing page,
 * not rewriting it. Replacing wholesale is possible but has to be asked for,
 * because an assistant who silently overwrites your notes is worse than none.
 */
export async function writeNote(
  title: string,
  text: string,
  mode: 'append' | 'replace' = 'append',
): Promise<Note> {
  const clean = title.trim().slice(0, 80);
  const body = text.trim();
  if (!clean || !body) throw new Error('a note needs a title and something to say');

  const now = new Date().toISOString();
  let saved: Note | null = null;

  await store.update((notes) => {
    const existing = match(
      notes.filter((note) => !note.archivedAt),
      clean,
    );

    if (existing) {
      saved = {
        ...existing,
        body:
          mode === 'replace' ? body : `${existing.body}\n\n${dateLine(now)} ${body}`,
        updatedAt: now,
      };
      return notes.map((note) => (note.id === existing.id ? (saved as Note) : note));
    }

    saved = {
      id: randomUUID(),
      title: clean,
      body: `${dateLine(now)} ${body}`,
      createdAt: now,
      updatedAt: now,
    };
    return [...notes, saved];
  });

  return saved as Note;
}

/** A short date stamp in front of each addition, so a note reads as a log. */
function dateLine(iso: string): string {
  return `[${new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}]`;
}

export async function readNote(title: string): Promise<Note | null> {
  return findForReading(await liveNotes(), title.trim()) ?? null;
}

/** Direct edit from the interface, so the user can fix what she wrote. */
export async function saveNoteBody(id: string, title: string, body: string): Promise<Note[]> {
  const now = new Date().toISOString();
  await store.update((notes) =>
    notes.map((note) =>
      note.id === id
        ? {...note, title: title.trim().slice(0, 80), body: body.trim(), updatedAt: now}
        : note,
    ),
  );
  return liveNotes();
}

export async function archiveNote(id: string): Promise<Note[]> {
  const now = new Date().toISOString();
  await store.update((notes) =>
    notes.map((note) => (note.id === id ? {...note, archivedAt: now} : note)),
  );
  return liveNotes();
}
