import {randomUUID} from 'node:crypto';
import {liveWatches, startWatch, stopWatch} from '../watch';
import {Document} from '../store/index';
import type {Tool} from './types';

/**
 * Timers, and the tools for watches.
 *
 * A timer is not a reminder. A reminder is a to-do with a date; a timer is
 * twenty minutes on the pasta — short, one-shot, and it has to *ring*. The
 * ringing happens in the client, which counts down and makes noise; the
 * server keeps the record so a reloaded page still knows the pasta exists.
 */

export interface Timer {
  id: string;
  label: string;
  /** When it goes off, ISO. */
  at: string;
  createdAt: string;
  /** Set once it has rung (or was dismissed), so it never rings twice. */
  firedAt?: string;
}

const store = new Document<Timer[]>('timers', () => []);

export function allTimers(): Promise<Timer[]> {
  return store.read();
}

/** Timers still counting, soonest first. */
export async function runningTimers(): Promise<Timer[]> {
  const now = Date.now();
  return (await store.read())
    .filter((timer) => !timer.firedAt && new Date(timer.at).getTime() > now - 60_000)
    .sort((left, right) => left.at.localeCompare(right.at));
}

export async function markFired(id: string): Promise<void> {
  await store.update((list) =>
    list.map((timer) =>
      timer.id === id ? {...timer, firedAt: new Date().toISOString()} : timer,
    ),
  );
}

/** "20 minutes", "1h30m", "90 seconds", "1 hour" — to milliseconds. */
export function parseDuration(said: string): number | null {
  const text = said.toLowerCase().replace(/\s+/g, ' ').trim();

  let total = 0;
  // Not \b after the unit: in "1h30m" the h is followed by a digit, which is
  // still a word character, so \b never matches and the hour silently drops.
  const pattern = /(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])/g;
  for (const [, amount, unit] of text.matchAll(pattern)) {
    const value = Number(amount);
    if (unit.startsWith('h')) total += value * 3_600_000;
    else if (unit.startsWith('m')) total += value * 60_000;
    else total += value * 1000;
  }

  // A bare number means minutes; nobody sets a 20-second timer by saying "20".
  if (total === 0 && /^\d+$/.test(text)) total = Number(text) * 60_000;

  return total > 0 && total <= 24 * 3_600_000 ? total : null;
}

export const timerTools: Tool[] = [
  {
    name: 'set_timer',
    description:
      'Start a countdown that rings when it ends — "20 minutes for the pasta", ' +
      '"an hour". For short, soon things. Anything tied to a date or a time of ' +
      'day is a reminder instead.',
    category: 'calendar',
    parameters: {
      duration: {
        type: 'string',
        description: 'How long, as said: "20 minutes", "1h30m", "90 seconds".',
      },
      label: {type: 'string', description: 'What it is for, a word or two.'},
    },
    required: ['duration'],
    run: async (args) => {
      const ms = parseDuration(String(args.duration ?? ''));
      if (!ms) return 'I could not make a length of time out of that.';

      const timer: Timer = {
        id: randomUUID(),
        label: String(args.label ?? '').trim() || 'timer',
        at: new Date(Date.now() + ms).toISOString(),
        createdAt: new Date().toISOString(),
      };
      await store.update((list) => [...list, timer]);

      const minutes = Math.round(ms / 60_000);
      return `Timer set: ${timer.label}, ${
        minutes >= 1 ? `${minutes} minute${minutes === 1 ? '' : 's'}` : `${Math.round(ms / 1000)} seconds`
      }.`;
    },
  },
  {
    name: 'list_timers',
    description: 'What timers are running and how long each has left.',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      const running = await runningTimers();
      if (running.length === 0) return 'No timers running.';
      const now = Date.now();
      return running
        .map((timer) => {
          const left = Math.max(0, Math.round((new Date(timer.at).getTime() - now) / 60_000));
          return `- ${timer.label}: about ${left} minute${left === 1 ? '' : 's'} left`;
        })
        .join('\n');
    },
  },
  {
    name: 'start_watch',
    description:
      'Watch a web page and speak up when it changes — a price, availability, ' +
      'a status page, a release. Checked hourly. Far more reliable with a ' +
      'keyword: watching whether "in stock" appears beats watching a whole ' +
      'page, which half the web rewrites on every load. Ask for a keyword if ' +
      'one is not obvious.',
    category: 'research',
    parameters: {
      what: {type: 'string', description: 'What is being watched, in their words.'},
      url: {type: 'string', description: 'The full https address of the page.'},
      keyword: {
        type: 'string',
        description: 'A word or phrase whose appearance or disappearance matters.',
      },
    },
    required: ['what', 'url'],
    run: async (args) => {
      const watch = await startWatch(
        String(args.what),
        String(args.url),
        args.keyword ? String(args.keyword) : undefined,
      );
      return `Watching ${watch.what}, checked every hour${
        watch.keyword ? ` for "${watch.keyword}"` : ''
      }. I will say when it moves.`;
    },
  },
  {
    name: 'list_watches',
    description: 'What is being watched for changes right now.',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      const watches = await liveWatches();
      if (watches.length === 0) return 'Nothing being watched.';
      return watches
        .map(
          (watch) =>
            `- ${watch.what}${watch.keyword ? ` (for "${watch.keyword}")` : ''}${
              watch.lastCheckedAt ? '' : ' — not checked yet'
            }`,
        )
        .join('\n');
    },
  },
  {
    name: 'stop_watch',
    description: 'Stop watching something. It is filed, not deleted.',
    category: 'research',
    parameters: {
      what: {type: 'string', description: 'Which watch to stop, by its wording.'},
    },
    required: ['what'],
    run: async (args) => {
      const stopped = await stopWatch(String(args.what));
      return stopped ? 'Stopped watching it.' : 'Nothing being watched matches that.';
    },
  },
];
