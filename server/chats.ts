import {randomUUID} from 'node:crypto';
import {Document} from './store/index';

/**
 * More than one conversation.
 *
 * She had exactly one, which was right while she was a thing you spoke to and
 * wrong the moment she became a thing you work with — a week of unrelated
 * threads in a single scroll is a transcript, not a set of conversations, and
 * the only way to start something fresh was to throw the last one away.
 *
 * What is *not* split is what she knows about you. Facts, preferences, notes,
 * situations, documents and her own manner are all yours rather than any one
 * thread's, and an assistant who forgot your name because you opened a new tab
 * would be a worse thing than the one that came before. Only the messages and
 * the running summary belong to a conversation.
 */

export interface Chat {
  id: string;
  title: string;
  at: string;
  /** When something was last said in it. Drives the order of the list. */
  lastAt: string;
  /** Put away rather than removed, like everything else here. */
  archivedAt?: string;
}

interface Chats {
  list: Chat[];
  current: string;
}

/**
 * The first conversation keeps the keys the single one always used.
 *
 * There is no migration step and no moment where a running install has to be
 * upgraded: an existing log is simply the first chat, under the name it was
 * already stored as. Everything after gets its own suffix.
 */
export const FIRST = 'main';

export function logKey(id: string): string {
  return id === FIRST ? 'conversation' : `conversation-${id}`;
}

export function metaKey(id: string): string {
  return id === FIRST ? 'meta' : `meta-${id}`;
}

const store = new Document<Chats>('chats', () => ({
  list: [
    {
      id: FIRST,
      title: 'First conversation',
      at: new Date(0).toISOString(),
      lastAt: new Date(0).toISOString(),
    },
  ],
  current: FIRST,
}));

export async function allChats(): Promise<Chat[]> {
  const {list} = await store.read();
  return list
    .filter((chat) => !chat.archivedAt)
    .sort((left, right) => right.lastAt.localeCompare(left.lastAt));
}

export async function currentChat(): Promise<string> {
  const {list, current} = await store.read();
  // A current pointer at something archived or gone would leave her writing
  // into a conversation nobody can open.
  const live = list.find((chat) => chat.id === current && !chat.archivedAt);
  return live ? live.id : FIRST;
}

export async function openChat(id: string): Promise<string> {
  const now = await store.read();
  if (!now.list.some((chat) => chat.id === id && !chat.archivedAt)) return now.current;
  await store.write({...now, current: id});
  return id;
}

export async function newChat(): Promise<Chat> {
  const now = await store.read();
  const chat: Chat = {
    id: randomUUID().slice(0, 8),
    title: 'New conversation',
    at: new Date().toISOString(),
    lastAt: new Date().toISOString(),
  };
  await store.write({list: [...now.list, chat], current: chat.id});
  return chat;
}

/**
 * Name a conversation after the first thing said in it.
 *
 * Done from the words themselves rather than by asking a model. A title is
 * worth a few characters of truncation and worth nothing at all if it costs a
 * round trip and a fraction of a penny on every new thread — and the first
 * thing someone types is, almost always, exactly what the conversation is
 * about.
 */
export async function titleFrom(id: string, firstWords: string): Promise<void> {
  const now = await store.read();
  const chat = now.list.find((one) => one.id === id);
  if (!chat || chat.title !== 'New conversation') return;

  const title = firstWords
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(grace[,\s]+)/i, '')
    .slice(0, 48);

  await store.write({
    ...now,
    list: now.list.map((one) =>
      one.id === id ? {...one, title: title || one.title} : one,
    ),
  });
}

export async function rename(id: string, title: string): Promise<Chat[]> {
  const now = await store.read();
  const clean = title.trim().slice(0, 60);
  if (clean) {
    await store.write({
      ...now,
      list: now.list.map((one) => (one.id === id ? {...one, title: clean} : one)),
    });
  }
  return allChats();
}

/** Marks the moment, so the list stays in the order you last used it. */
export async function touch(id: string): Promise<void> {
  const now = await store.read();
  const chat = now.list.find((one) => one.id === id);
  if (!chat) return;
  await store.write({
    ...now,
    list: now.list.map((one) =>
      one.id === id ? {...one, lastAt: new Date().toISOString()} : one,
    ),
  });
}

/**
 * Put a conversation away.
 *
 * Archived, not removed, and its messages are left exactly where they are —
 * the standing instruction against deleting applies here more than anywhere,
 * since this is the record of everything either of you said. The first
 * conversation cannot be archived, because something has to be current.
 */
export async function archiveChat(id: string): Promise<Chat[]> {
  const now = await store.read();
  if (id === FIRST) return allChats();

  const list = now.list.map((one) =>
    one.id === id ? {...one, archivedAt: new Date().toISOString()} : one,
  );
  const current = now.current === id ? FIRST : now.current;
  await store.write({list, current});
  return allChats();
}
