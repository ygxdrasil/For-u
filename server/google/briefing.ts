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
const PATIENCE_MS = 3500;

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
  const saved = await connection().catch(() => null);
  if (!saved || saved.brokenReason) return null;

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

  return [
    'This is live from their Google account, as of now:',
    ...lines,
    '',
    'Use it when it is relevant and say nothing about it when it is not. Do not ' +
      'recite the whole list unless asked for it. You may draft a reply to any of ' +
      'this mail, but you never send it — the draft goes to their drafts folder and ' +
      'they press send.',
  ].join('\n');
}
