import type {AttentionMode, Message} from '../shared/types';
import {record} from './memory';
import {upcoming} from './google/calendar';
import {recentMail} from './google/gmail';
import {connection} from './google/oauth';
import {noteDeed} from './journal';
import {getProvider} from './llm/index';
import {getMode} from './modes';
import {outstanding} from './tools/reminders';
import {Document} from './store/index';

/**
 * Grace looking around while nobody is talking to her.
 *
 * The difference between an assistant and a chatbot is who starts the
 * conversation. This is the part that lets her start it: every few minutes she
 * looks at the diary, the inbox and the list, works out whether anything
 * genuinely wants the user, and says so once.
 *
 * Three rules shape all of it, and each of them exists because the failure
 * mode they prevent is what makes people switch these things off.
 *
 *  - Nothing is raised twice. Every concern carries a stable id and she keeps
 *    the ones she has already mentioned.
 *  - Nothing costs anything when nothing is happening. The language model is
 *    only called when there is something new to say, so an idle day is free.
 *  - She respects the mode she was put in. Focus means silence unless the roof
 *    is on fire; Away means it waits.
 */

export type Urgency = 'now' | 'soon' | 'whenever';

export interface Concern {
  id: string;
  kind: 'diary' | 'mail' | 'reminder';
  text: string;
  urgency: Urgency;
  at?: string;
}

interface Seen {
  /** Concern id to the time it was first raised. */
  raised: Record<string, string>;
}

const seen = new Document<Seen>('pulse', () => ({raised: {}}));

/** Anything starting inside this window is worth a word. */
const IMMINENT_MINUTES = 45;

/** How long a raised concern stays remembered before it could be raised again. */
const FORGET_AFTER_MS = 36 * 60 * 60 * 1000;

function minutesUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
}

/** The diary, the list, and the inbox — whatever of them is reachable. */
export async function gather(now = new Date()): Promise<Concern[]> {
  const concerns: Concern[] = [];

  const overdue = await outstanding().catch(() => []);
  for (const reminder of overdue) {
    if (!reminder.due) continue;
    const minutes = minutesUntil(reminder.due);
    if (minutes > IMMINENT_MINUTES) continue;
    concerns.push({
      id: `reminder:${reminder.id}`,
      kind: 'reminder',
      text:
        minutes < 0
          ? `${reminder.text} — that was due ${Math.abs(minutes)} minutes ago`
          : `${reminder.text} — due in ${minutes} minutes`,
      urgency: minutes < 15 ? 'now' : 'soon',
      at: reminder.due,
    });
  }

  const google = await connection().catch(() => null);
  if (google && !google.brokenReason) {
    const [events, mail] = await Promise.all([
      upcoming(2, 5).catch(() => []),
      recentMail('in:inbox is:unread category:primary newer_than:1d', 5).catch(() => []),
    ]);

    for (const event of events) {
      if (event.allDay) continue;
      const minutes = minutesUntil(event.start);
      if (minutes < 0 || minutes > IMMINENT_MINUTES) continue;
      concerns.push({
        id: `diary:${event.id}`,
        kind: 'diary',
        text: `${event.summary} starts in ${minutes} minutes${
          event.location ? `, at ${event.location}` : ''
        }`,
        urgency: minutes <= 15 ? 'now' : 'soon',
        at: event.start,
      });
    }

    // Mail is the noisiest of the three, so it is deliberately the quietest:
    // one line about who wrote, never the contents, and never each message
    // separately. Anyone who wants their inbox read to them can ask.
    if (mail.length > 0) {
      const senders = [...new Set(mail.map((message) => message.from.split('<')[0].trim()))];
      concerns.push({
        // Keyed on the newest message, so the same batch is one concern and a
        // genuinely new arrival is a new one.
        id: `mail:${mail[0].id}`,
        kind: 'mail',
        text:
          mail.length === 1
            ? `New mail from ${senders[0]}: ${mail[0].subject}`
            : `${mail.length} new emails, from ${senders.slice(0, 3).join(', ')}`,
        urgency: 'whenever',
      });
    }
  }

  void now;
  return concerns;
}

/** Drops anything already mentioned, and forgets what has gone stale. */
async function unraised(concerns: Concern[]): Promise<Concern[]> {
  const record = await seen.read();
  const cutoff = Date.now() - FORGET_AFTER_MS;

  const kept: Record<string, string> = {};
  for (const [id, at] of Object.entries(record.raised)) {
    if (new Date(at).getTime() > cutoff) kept[id] = at;
  }

  const fresh = concerns.filter((concern) => !kept[concern.id]);
  if (fresh.length === 0) {
    // Still worth writing back when entries expired, so the record can't grow
    // without bound on a busy inbox.
    if (Object.keys(kept).length !== Object.keys(record.raised).length) {
      await seen.write({raised: kept});
    }
    return [];
  }

  const now = new Date().toISOString();
  for (const concern of fresh) kept[concern.id] = now;
  await seen.write({raised: kept});
  return fresh;
}

/**
 * Whether she may interrupt, given the mode she was put in.
 *
 * Focus mode is the one that matters. The user chose it to be left alone, and
 * an assistant who honours that except when she has something interesting is
 * an assistant nobody leaves running.
 */
function mayInterrupt(mode: AttentionMode, urgency: Urgency): boolean {
  if (mode === 'away') return false;
  if (mode === 'focus') return urgency === 'now';
  if (mode === 'work') return urgency !== 'whenever';
  return true;
}

const RANK: Record<Urgency, number> = {now: 0, soon: 1, whenever: 2};

export interface PulseResult {
  /** Everything new, whether or not she is allowed to say it. */
  concerns: Concern[];
  /** The line to speak, or null when she is holding her tongue. */
  say: string | null;
  /** Why she is not speaking, when she isn't. Shown in the interface. */
  held: string | null;
  /**
   * The utterance, recorded in the conversation.
   *
   * It has to go in the log. If she says "your ten o'clock starts in twenty
   * minutes" and the user answers "move it", she needs to know what she just
   * said — an unprompted remark that leaves no trace makes the very next reply
   * incoherent.
   */
  message?: Message;
}

/**
 * One look around.
 *
 * Returns without spending anything at all when nothing is new, which is the
 * common case and the reason this can run every few minutes on a ten dollar
 * budget.
 */
export async function pulse(): Promise<PulseResult> {
  const fresh = await unraised(await gather());
  if (fresh.length === 0) return {concerns: [], say: null, held: null};

  for (const concern of fresh) {
    await noteDeed('noticed', concern.text, true);
  }

  const {mode} = await getMode();
  const sorted = [...fresh].sort((left, right) => RANK[left.urgency] - RANK[right.urgency]);
  const speakable = sorted.filter((concern) => mayInterrupt(mode, concern.urgency));

  if (speakable.length === 0) {
    return {
      concerns: sorted,
      say: null,
      held:
        mode === 'away'
          ? 'Holding this until you are back.'
          : 'Not interrupting while you are heads-down.',
    };
  }

  const say = await compose(speakable).catch(() => fallback(speakable));
  await noteDeed('spoke', say, true);
  return {concerns: sorted, say, held: null, message: await record('grace', say, 'voice')};
}

/** When the model is unavailable, the plain facts still get through. */
function fallback(concerns: Concern[]): string {
  return concerns.map((concern) => concern.text).join('. ') + '.';
}

/**
 * One sentence, in her voice.
 *
 * No tools, no memory, no search — this is a rewrite of facts already in hand,
 * and the cheapest request she makes. Interrupting someone deserves better
 * phrasing than a list read aloud, and not much more than that.
 */
async function compose(concerns: Concern[]): Promise<string> {
  const said = await getProvider().complete({
    system:
      'You are Grace, a composed personal assistant, interrupting the person ' +
      'you work for because something wants their attention. Say it in one ' +
      'short spoken sentence — two at the very most, and only if there are ' +
      'genuinely two things. No preamble, no "just letting you know", no ' +
      'markdown, no lists. Plain speech, understated. Do not add anything you ' +
      'were not given.',
    turns: [
      {
        role: 'user',
        text: concerns.map((concern) => `- ${concern.text}`).join('\n'),
      },
    ],
    temperature: 0.4,
    maxOutputTokens: 120,
    fast: true,
  });

  return said.trim() || fallback(concerns);
}
