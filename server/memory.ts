import {randomUUID} from 'node:crypto';
import path from 'node:path';
import type {
  InputMode,
  Message,
  Profile,
  ProfileEntry,
  Speaker,
} from '../shared/types.ts';
import {config} from './config.ts';
import {getProvider} from './llm/index.ts';
import type {Turn} from './llm/types.ts';
import {JsonStore} from './store.ts';

interface Meta {
  /** Prose recap of everything folded out of the verbatim window. */
  summary: string | null;
  /** How many messages from the start of the log the summary already covers. */
  summarizedThrough: number;
}

const messages = new JsonStore<Message[]>(
  path.join(config.dataDir, 'conversation.json'),
  () => [],
);

const profile = new JsonStore<Profile>(
  path.join(config.dataDir, 'profile.json'),
  () => ({addressAs: null, entries: [], updatedAt: new Date().toISOString()}),
);

const meta = new JsonStore<Meta>(path.join(config.dataDir, 'meta.json'), () => ({
  summary: null,
  summarizedThrough: 0,
}));

export function getMessages(): Message[] {
  return messages.read();
}

export function getProfile(): Profile {
  return profile.read();
}

export function getSummary(): string | null {
  return meta.read().summary;
}

export function record(speaker: Speaker, text: string, via: InputMode): Message {
  const message: Message = {
    id: randomUUID(),
    speaker,
    text,
    at: new Date().toISOString(),
    via,
  };
  messages.update((log) => [...log, message]);
  return message;
}

/**
 * The window replayed to the model verbatim. Everything older lives in the
 * summary, and the raw log on disk keeps all of it either way.
 */
export function recentTurns(): Turn[] {
  return messages
    .read()
    .slice(-config.verbatimTurns)
    .map((message) => ({
      role: message.speaker === 'grace' ? ('assistant' as const) : ('user' as const),
      text: message.text,
    }));
}

export function setAddressAs(addressAs: string | null): Profile {
  return profile.update((current) => ({
    ...current,
    addressAs,
    updatedAt: new Date().toISOString(),
  }));
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

export function remember(entries: Omit<ProfileEntry, 'id' | 'learnedAt'>[]): ProfileEntry[] {
  if (entries.length === 0) return [];

  const existing = new Set(profile.read().entries.map((e) => normalise(e.text)));
  const added: ProfileEntry[] = [];

  for (const entry of entries) {
    const key = normalise(entry.text);
    if (!key || existing.has(key)) continue;
    existing.add(key);
    added.push({...entry, id: randomUUID(), learnedAt: new Date().toISOString()});
  }

  if (added.length > 0) {
    profile.update((current) => ({
      ...current,
      entries: [...current.entries, ...added],
      updatedAt: new Date().toISOString(),
    }));
  }

  return added;
}

export function forget(id: string): Profile {
  return profile.update((current) => ({
    ...current,
    entries: current.entries.filter((entry) => entry.id !== id),
    updatedAt: new Date().toISOString(),
  }));
}

export function clearConversation(): void {
  messages.write([]);
  meta.write({summary: null, summarizedThrough: 0});
}

/**
 * Folds older turns into the rolling summary once the log outgrows the verbatim
 * window. Called after a reply is delivered so it never delays one.
 */
export async function compactIfNeeded(): Promise<void> {
  const log = messages.read();
  const current = meta.read();
  const unsummarised = log.length - current.summarizedThrough;

  if (unsummarised <= config.summarizeAfter) return;

  const foldUpTo = log.length - config.verbatimTurns;
  const pending = log.slice(current.summarizedThrough, foldUpTo);
  if (pending.length === 0) return;

  const transcript = pending
    .map((message) => `${message.speaker === 'grace' ? 'Grace' : 'User'}: ${message.text}`)
    .join('\n');

  const system = `You maintain the long-term memory of a personal assistant called Grace.

Rewrite the running summary so it also covers the new exchanges. Keep anything that is still true or still matters: decisions, commitments, ongoing situations, people, plans, and how the user likes things done. Drop small talk and anything already superseded.

Write plain prose, past tense, no more than 300 words. Return only the summary.`;

  const prompt = current.summary
    ? `Running summary so far:\n${current.summary}\n\nNew exchanges:\n${transcript}`
    : `New exchanges:\n${transcript}`;

  try {
    const summary = await getProvider().complete({
      system,
      turns: [{role: 'user', text: prompt}],
      temperature: 0.3,
      maxOutputTokens: 700,
    });

    if (summary.trim()) {
      meta.write({summary: summary.trim(), summarizedThrough: foldUpTo});
    }
  } catch (error) {
    // Summarising is a background nicety; failing it must not break the chat.
    console.error('[grace] could not compact memory:', (error as Error).message);
  }
}
