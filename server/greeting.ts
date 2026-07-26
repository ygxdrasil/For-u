import type {Message} from '../shared/types';
import {buildBriefing} from './google/briefing';
import {noteDeed} from './journal';
import {record} from './memory';
import {getMode} from './modes';
import {outstanding} from './tools/reminders';
import {Document} from './store/index';

/**
 * What she says when you walk in.
 *
 * Opening an assistant and being met with silence puts the first move back on
 * you every single time. A person who has been watching your day says
 * something — and the something is the point: not "hello", but the one thing
 * you would have wanted to know before you asked.
 *
 * Rationed rather than rate-limited. Greeting on every page load would mean
 * three greetings while you find the right tab, and a conversation log made
 * mostly of hellos.
 */

interface Greeted {
  at: string | null;
}

const store = new Document<Greeted>('greeting', () => ({at: null}));

/** Long enough that reopening her is not an event. */
const EVERY_MS = 4 * 60 * 60 * 1000;

export interface Greeting {
  say: string | null;
  message?: Message;
}

export async function greet(compose: (context: string) => Promise<string>): Promise<Greeting> {
  const {at} = await store.read();
  if (at && Date.now() - new Date(at).getTime() < EVERY_MS) return {say: null};

  const {mode} = await getMode();
  // Focus and Away were chosen to be left alone; walking in does not undo that.
  if (mode === 'focus' || mode === 'away') return {say: null};

  const [briefing, list] = await Promise.all([
    buildBriefing().catch(() => null),
    outstanding().catch(() => []),
  ]);

  const soon = list
    .filter((reminder) => reminder.due)
    .slice(0, 3)
    .map((reminder) => `- ${reminder.text}`)
    .join('\n');

  const context = [
    briefing,
    soon && `Outstanding on their list:\n${soon}`,
    `The time is ${new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })}.`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const said = (await compose(context)).trim();
  if (!said) return {say: null};

  await store.write({at: new Date().toISOString()});
  await noteDeed('spoke', said, true);
  return {say: said, message: await record('grace', said, 'text')};
}
