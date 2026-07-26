import {upcoming} from './calendar';
import {recentMail} from './gmail';
import {connection} from './oauth';

/**
 * What is going on in the user's day, folded into Grace's briefing.
 *
 * Fetched alongside every reply rather than through a tool call she has to
 * decide to make: "what's on today" and "anything from Sam?" are the two most
 * ordinary things anyone asks an assistant, and neither should depend on her
 * choosing correctly. Failures are swallowed — a Google outage should cost her
 * the diary, not the conversation.
 */

/** Google is not allowed to hold up a reply. */
const PATIENCE_MS = 2500;

/**
 * How long a briefing stays good for.
 *
 * Diaries and inboxes do not change second to second, and paying two Google
 * round trips in front of every single reply is a delay the user feels on
 * every turn for information that was identical a minute ago.
 */
const FRESH_FOR_MS = 90_000;

let cached: {text: string | null; until: number} | null = null;

/** Called when something happens that would make the cached view wrong. */
export function forgetBriefing(): void {
  cached = null;
}

function timeboxed<T>(work: Promise<T>, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    work.catch(() => fallback),
    new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), PATIENCE_MS);
    }),
    // Clearing it matters: two of these run per reply, and a serverless
    // invocation is kept alive by a pending timer.
  ]).finally(() => clearTimeout(timer));
}

export async function buildBriefing(): Promise<string | null> {
  if (cached && cached.until > Date.now()) return cached.text;

  const saved = await connection().catch(() => null);
  if (!saved || saved.brokenReason) {
    cached = {text: null, until: Date.now() + FRESH_FOR_MS};
    return null;
  }

  const [events, mail] = await Promise.all([
    timeboxed(upcoming(24, 8), []),
    timeboxed(recentMail('in:inbox is:unread newer_than:2d', 6), []),
  ]);

  const lines: string[] = [];

  if (events.length > 0) {
    lines.push('In their diary over the next day:');
    for (const event of events) {
      const when = event.allDay
        ? 'all day'
        : new Date(event.start).toLocaleString('en-GB', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });
      lines.push(
        `- ${when}: ${event.summary}${event.location ? ` (${event.location})` : ''}`,
      );
    }
  } else {
    lines.push('Their diary is clear for the next day.');
  }

  if (mail.length > 0) {
    lines.push('', 'Unread mail from the last two days:');
    for (const message of mail) {
      lines.push(`- ${message.from} — ${message.subject}`);
    }
  } else {
    lines.push('', 'No unread mail in the last two days.');
  }

  const text = [
    'This is live from their Google account, as of now:',
    ...lines,
    '',
    'Use it when it is relevant and say nothing about it when it is not. Never ' +
      'read this list out — it is what you know, not what you say. If they ask ' +
      'about their mail, answer in a sentence: how many, who from, what they ' +
      'want. This copy is a minute old and read-only; use check_mail or ' +
      'check_diary to go and look properly, and say plainly that you cannot ' +
      'send or delete rather than claiming to have done either.',
  ].join('\n');

  cached = {text, until: Date.now() + FRESH_FOR_MS};
  return text;
}
