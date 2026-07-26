import {randomUUID} from 'node:crypto';
import {Document} from '../store/index';
import type {Tool} from './types';

export interface Reminder {
  id: string;
  text: string;
  /** ISO timestamp of when it is wanted. Null means "no particular time". */
  due: string | null;
  createdAt: string;
  doneAt: string | null;
}

const store = new Document<Reminder[]>('reminders', () => []);

export function allReminders(): Promise<Reminder[]> {
  return store.read();
}

/** Everything outstanding, soonest first, undated last. */
export async function outstanding(): Promise<Reminder[]> {
  const all = await store.read();
  return all
    .filter((reminder) => !reminder.doneAt)
    .sort((left, right) => {
      if (!left.due) return 1;
      if (!right.due) return -1;
      return left.due.localeCompare(right.due);
    });
}

export async function due(now = new Date()): Promise<Reminder[]> {
  const all = await outstanding();
  return all.filter((reminder) => reminder.due && new Date(reminder.due) <= now);
}

function describe(reminder: Reminder): string {
  if (!reminder.due) return reminder.text;
  return `${reminder.text} (${new Date(reminder.due).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })})`;
}

export const reminderTools: Tool[] = [
  {
    name: 'add_reminder',
    description:
      'Add something to the user’s list of things to remember or do. Use this ' +
      'whenever they ask to be reminded of something, or mention something they ' +
      'need to do later.',
    category: 'calendar',
    parameters: {
      text: {
        type: 'string',
        description: 'What to remember, in the user’s own words where possible.',
      },
      due: {
        type: 'string',
        description:
          'When it is wanted, as a full ISO 8601 timestamp. Omit entirely if no ' +
          'particular time was given. Work out real dates from phrases like ' +
          '"tomorrow morning" using the current date you were given.',
      },
    },
    required: ['text'],
    run: async (args) => {
      const text = String(args.text ?? '').trim();
      if (!text) return 'Nothing was given to remember.';

      const raw = args.due ? String(args.due) : '';
      const parsed = raw ? new Date(raw) : null;
      const valid = parsed && Number.isFinite(parsed.getTime()) ? parsed : null;

      const reminder: Reminder = {
        id: randomUUID(),
        text,
        due: valid ? valid.toISOString() : null,
        createdAt: new Date().toISOString(),
        doneAt: null,
      };

      await store.update((current) => [...current, reminder]);
      return `Noted: ${describe(reminder)}`;
    },
  },
  {
    name: 'list_reminders',
    description:
      'List what the user still has outstanding. Use it when they ask what is on ' +
      'their list, what is outstanding, or what they have forgotten.',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      const open = await outstanding();
      if (open.length === 0) return 'Their list is empty.';
      return `Outstanding:\n${open.map((item) => `- ${describe(item)}`).join('\n')}`;
    },
  },
  {
    name: 'complete_reminder',
    description:
      'Mark something on the list as done. Match on the wording the user used; ' +
      'if more than one thing could be meant, ask which rather than guessing.',
    category: 'calendar',
    parameters: {
      text: {
        type: 'string',
        description: 'Enough of the reminder’s wording to identify it.',
      },
    },
    required: ['text'],
    run: async (args) => {
      const needle = String(args.text ?? '')
        .trim()
        .toLowerCase();
      if (!needle) return 'Which one?';

      const open = await outstanding();
      const matches = open.filter((item) => item.text.toLowerCase().includes(needle));

      if (matches.length === 0) return `Nothing on the list matches "${needle}".`;
      if (matches.length > 1) {
        return `More than one matches: ${matches
          .map((item) => item.text)
          .join('; ')}. Ask which one they mean.`;
      }

      // Marked, never removed. The user's standing instruction is that nothing
      // is deleted, and a completed reminder is still a record of their day.
      await store.update((current) =>
        current.map((item) =>
          item.id === matches[0].id ? {...item, doneAt: new Date().toISOString()} : item,
        ),
      );
      return `Marked done: ${matches[0].text}`;
    },
  },
];
