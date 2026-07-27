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

function match(notes: Note[], title: string): Note | undefined {
  const needle = title.toLowerCase().trim();
  return (
    notes.find((note) => note.title.toLowerCase() === needle) ??
    notes.find((note) => note.title.toLowerCase().includes(needle)) ??
    notes.find((note) => needle.includes(note.title.toLowerCase()))
  );
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
  return match(await liveNotes(), title.trim()) ?? null;
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
