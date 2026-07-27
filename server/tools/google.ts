import {addAppointment, changeAppointment, upcoming} from '../google/calendar';
import {
  draftReply,
  fileMail,
  labelMail,
  markRead,
  markUnread,
  readMail,
  recentMail,
  star,
} from '../google/gmail';
import type {Tool} from './types';

/**
 * Her mail and her diary, as things she can be asked to go and do.
 *
 * The briefing already puts the day in front of her unprompted, which covers
 * "anything I should know". It does not cover "go and check my mail", because
 * that is a request to act, and without a tool she can only say she is unable
 * to — which is what she did.
 *
 * She now tidies as well as reads: filing a message out of the inbox, labelling
 * it, starring it, marking it read or unread, and moving something already in
 * the diary. Every one of those is a gesture the user can undo in a second from
 * their own client, which is the test for whether it belongs here at all.
 *
 * Note what is absent and must stay absent: nothing sends, and nothing
 * destroys. A draft goes to the drafts folder and the user presses send;
 * filing takes a message out of the inbox and leaves every word of it in All
 * Mail; there is no tool that removes a message or a diary entry, because
 * "never delete anything, ever" is the user's standing instruction and the
 * cheapest way to keep it is to build no way to break it.
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
      // Fetched wide, shown narrow: the bulk ones still have to be counted.
      const all = await recentMail(query, 20);
      if (all.length === 0) return `Nothing matching "${query}".`;

      const messages = all.filter((message) => !message.bulk).slice(0, 8);
      const junked = all.length - messages.length;

      if (messages.length === 0) {
        return (
          `Nothing but ${junked} newsletters and automatic notices. Tell them ` +
          `there is nothing that wants them, in a few words. Do not describe ` +
          `the junk, do not count it out loud, and do not offer to read any ` +
          `of it.`
        );
      }

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
        `Newsletters and marketing have already been taken out${
          junked > 0 ? ` — ${junked} of them, which you should not mention` : ''
        }. What is left is from people and from companies actually corresponding ` +
        `with them.\n\n` +
        `The list above is working material and must not appear in your reply ` +
        `in any form: do not repeat it, do not list it, do not quote a subject ` +
        `verbatim, never say an id. One or two sentences, no more. Say how many ` +
        `and what they are about, in your own words. Then ask whether they want ` +
        `any of it read out, and use read_mail if they say yes.`
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
  {
    name: 'file_mail',
    description:
      'Take a message out of the inbox — Gmail’s archive. It keeps every word ' +
      'and stays searchable in All Mail; it simply stops sitting in the inbox. ' +
      'Use it when the user says they are done with something, have dealt with ' +
      'it, or asks you to clear or tidy the inbox. Pass the id from check_mail.',
    category: 'research',
    parameters: {
      id: {type: 'string', description: 'The message id from check_mail.'},
    },
    required: ['id'],
    run: async (args) => {
      await fileMail(String(args.id));
      return 'Filed out of the inbox. Still in All Mail, still searchable.';
    },
  },
  {
    name: 'label_mail',
    description:
      'Put a label on a message, making the label if it does not exist yet. Use ' +
      'it when the user wants something filed under a heading — "put that under ' +
      'taxes". Labelling does not take it out of the inbox; file_mail does that.',
    category: 'research',
    parameters: {
      id: {type: 'string', description: 'The message id from check_mail.'},
      label: {type: 'string', description: 'The label name, as they said it.'},
    },
    required: ['id', 'label'],
    run: async (args) => {
      const applied = await labelMail(String(args.id), String(args.label));
      return `Labelled ${applied}.`;
    },
  },
  {
    name: 'mark_mail',
    description:
      'Change how a message sits in the inbox: mark it read once you have told ' +
      'the user what it says, unread to bring it back for them later, or star ' +
      'it to flag it. Pass the id from check_mail.',
    category: 'research',
    parameters: {
      id: {type: 'string', description: 'The message id from check_mail.'},
      how: {
        type: 'string',
        description: 'What to do with it.',
        values: ['read', 'unread', 'starred'],
      },
    },
    required: ['id', 'how'],
    run: async (args) => {
      const id = String(args.id);
      const how = String(args.how);
      if (how === 'read') {
        await markRead(id);
        return 'Marked read.';
      }
      if (how === 'unread') {
        await markUnread(id);
        return 'Back in the inbox, unread.';
      }
      if (how === 'starred') {
        await star(id);
        return 'Starred.';
      }
      return `I do not know what "${how}" means for a message.`;
    },
  },
  {
    name: 'change_diary',
    description:
      'Move or amend something already in the user’s calendar — a new time, a ' +
      'new place, a new name. Say which entry by its title, as they said it. ' +
      'Nobody else is notified, so if other people are on it, tell the user ' +
      'they still have to say so. This cannot remove an entry; nothing can.',
    category: 'calendar',
    parameters: {
      which: {
        type: 'string',
        description: 'The title of the entry, or enough of it to find it.',
      },
      start: {type: 'string', description: 'New start, as ISO 8601.'},
      end: {type: 'string', description: 'New end, as ISO 8601.'},
      location: {type: 'string', description: 'New place.'},
      title: {type: 'string', description: 'New title.'},
    },
    required: ['which'],
    run: async (args) => {
      const said = String(args.which).toLowerCase().trim();
      // A month ahead: far enough for "move the dentist", short enough that
      // matching stays unambiguous.
      const events = await upcoming(24 * 30, 100);

      const exact = events.filter((one) => one.summary.toLowerCase().trim() === said);
      const partial = events.filter((one) => one.summary.toLowerCase().includes(said));
      const found = exact.length > 0 ? exact : partial;

      if (found.length === 0) {
        return `Nothing called "${args.which}" in the next month. Ask them which entry they mean.`;
      }
      if (found.length > 1) {
        return (
          `"${args.which}" matches ${found.length} entries: ${found
            .map((one) => `${one.summary} on ${when(one.start, one.allDay)}`)
            .join('; ')}. Ask which one before changing anything.`
        );
      }

      const updated = await changeAppointment(found[0].id, {
        summary: args.title ? String(args.title) : undefined,
        start: args.start ? String(args.start) : undefined,
        end: args.end ? String(args.end) : undefined,
        location: args.location ? String(args.location) : undefined,
      });

      return (
        `Moved: ${updated.summary} is now ${when(updated.start, updated.allDay)}` +
        `${updated.location ? ` at ${updated.location}` : ''}.` +
        `${updated.attendees.length > 0 ? ' Other people are on this one and have not been told.' : ''}`
      );
    },
  },
];
