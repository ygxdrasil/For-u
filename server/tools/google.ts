import {addAppointment, upcoming} from '../google/calendar';
import {draftReply, readMail, recentMail} from '../google/gmail';
import type {Tool} from './types';

/**
 * Her mail and her diary, as things she can be asked to go and do.
 *
 * The briefing already puts the day in front of her unprompted, which covers
 * "anything I should know". It does not cover "go and check my mail", because
 * that is a request to act, and without a tool she can only say she is unable
 * to — which is what she did.
 *
 * Note what is absent and must stay absent: nothing sends, nothing deletes.
 * A draft goes to the drafts folder and the user presses send.
 */

/**
 * "Sam Fisher <sam@example.com>" becomes "Sam Fisher".
 *
 * The address adds nothing she would ever say out loud, and it is most of the
 * length of the line.
 */
function sender(from: string): string {
  const name = from.split('<')[0].trim().replace(/^"|"$/g, '');
  return name || from.trim();
}

function when(iso: string, allDay: boolean): string {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return iso;
  return allDay
    ? date.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'})
    : date.toLocaleString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      });
}

export const googleTools: Tool[] = [
  {
    name: 'check_mail',
    description:
      'Look at the user’s inbox. Use this whenever they ask you to check their ' +
      'mail, ask whether anything has arrived, or ask about a message from ' +
      'someone. Returns senders and subjects only — never the contents, and ' +
      'never anything to read out.',
    category: 'research',
    parameters: {
      query: {
        type: 'string',
        description:
          'Optional Gmail search, in Gmail’s own syntax — "is:unread", ' +
          '"from:sam", "newer_than:3d". Leave out for the recent inbox.',
      },
    },
    required: [],
    run: async (args) => {
      const query = String(args.query ?? '').trim() || 'in:inbox';
      const messages = await recentMail(query, 8);
      if (messages.length === 0) return `Nothing matching "${query}".`;

      // Senders and subjects, and nothing else. The preview text used to come
      // back with every message, which meant a request to check the mail
      // returned several hundred words of marketing copy — and she read it
      // out. She cannot summarise what she was not given, so she is given less.
      const list = messages
        .map(
          (message) =>
            `- ${message.unread ? '[unread] ' : ''}${sender(message.from)}: ` +
            `${message.subject} (id ${message.id})`,
        )
        .join('\n');

      return (
        `${list}\n\n` +
        `The above is working material for you and must not appear in your ` +
        `reply in any form. Do not repeat it, do not list it, do not quote a ` +
        `subject line verbatim, and never say an id out loud. Group it and ` +
        `describe it: how many there are, and what the two or three that ` +
        `matter are about. Automated post — receipts, delivery notices, ` +
        `newsletters, alerts about something they did themselves — is worth ` +
        `one clause between them all, not a sentence each. Then ask whether ` +
        `they would like any of it read out, and use read_mail if they say yes.`
      );
    },
  },
  {
    name: 'read_mail',
    description:
      'Read one message in full, once check_mail has shown you which. Pass the ' +
      'id from that list.',
    category: 'research',
    parameters: {
      id: {type: 'string', description: 'The message id from check_mail.'},
    },
    required: ['id'],
    run: async (args) => {
      const message = await readMail(String(args.id));
      return [
        `From: ${message.from}`,
        `Subject: ${message.subject}`,
        '',
        message.body.slice(0, 4000),
      ].join('\n');
    },
  },
  {
    name: 'draft_reply',
    description:
      'Write a draft into the user’s drafts folder. It is NOT sent — they read ' +
      'it and press send themselves. Use this when asked to reply to something ' +
      'or write an email. Tell them plainly afterwards that it is waiting in ' +
      'their drafts, unsent.',
    category: 'research',
    parameters: {
      to: {type: 'string', description: 'Recipient email address.'},
      subject: {type: 'string', description: 'Subject line.'},
      body: {
        type: 'string',
        description:
          'The message, in the user’s own register — plain, direct, no flourishes.',
      },
      threadId: {
        type: 'string',
        description: 'The thread to reply within, from check_mail, if replying.',
      },
    },
    required: ['to', 'subject', 'body'],
    run: async (args) => {
      await draftReply({
        to: String(args.to),
        subject: String(args.subject),
        body: String(args.body),
        threadId: args.threadId ? String(args.threadId) : undefined,
      });
      return `Draft saved to their drafts folder, unsent. They send it.`;
    },
  },
  {
    name: 'check_diary',
    description:
      'Look at what is coming up in the user’s calendar. Use this for "what’s ' +
      'on today", "am I free", "when is my next thing".',
    category: 'research',
    parameters: {
      hours: {
        type: 'number',
        description: 'How far ahead to look. 24 for today, 168 for the week.',
      },
    },
    required: [],
    run: async (args) => {
      const hours = Number(args.hours) || 24;
      const events = await upcoming(hours, 20);
      if (events.length === 0) return `Nothing in the next ${hours} hours.`;

      return events
        .map(
          (event) =>
            `- ${when(event.start, event.allDay)}: ${event.summary}` +
            (event.location ? ` (${event.location})` : ''),
        )
        .join('\n');
    },
  },
  {
    name: 'add_to_diary',
    description:
      'Put something in the user’s calendar. Work out real times from what they ' +
      'said and the current date you were given. Nobody else is notified — ' +
      'telling people is the user’s to do.',
    category: 'calendar',
    parameters: {
      summary: {type: 'string', description: 'What it is.'},
      start: {type: 'string', description: 'Start, as ISO 8601.'},
      end: {type: 'string', description: 'End, as ISO 8601.'},
      location: {type: 'string', description: 'Where, if given.'},
    },
    required: ['summary', 'start', 'end'],
    run: async (args) => {
      const event = await addAppointment({
        summary: String(args.summary),
        start: String(args.start),
        end: String(args.end),
        location: args.location ? String(args.location) : undefined,
      });
      return `In the diary: ${event.summary}, ${when(event.start, event.allDay)}.`;
    },
  },
];
