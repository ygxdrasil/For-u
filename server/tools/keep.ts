import {searchFiles} from '../files';
import {liveNotes, readNote, writeNote} from '../notes';
import {openSituations, resolveSituation, trackSituation} from '../situations';
import type {Tool} from './types';

/**
 * The tools for the two things she keeps beyond bare facts: project notes and
 * live situations. Grouped in one file because they are the same shape of
 * work — write, read, and mark done — and because tool descriptions are input
 * tokens on every turn, so they are kept as short as they can be while still
 * telling her when to reach for each.
 */

export const keepTools: Tool[] = [
  {
    name: 'write_note',
    description:
      'Add to a project note — an ongoing topic like a trip, a piece of work, ' +
      'a plan. Use it when the user tells you where something has got to, or ' +
      'asks you to jot something down about a subject. Match an existing note ' +
      'by title, or a new one is started. It appends by default.',
    category: 'research',
    parameters: {
      title: {type: 'string', description: 'The project or topic, short.'},
      text: {type: 'string', description: 'What to add, in a sentence or two.'},
    },
    required: ['title', 'text'],
    run: async (args) => {
      const note = await writeNote(String(args.title), String(args.text));
      return `Noted under "${note.title}".`;
    },
  },
  {
    name: 'read_note',
    description:
      'Read back a project note in full. Use it when the user asks where ' +
      'something stands, or what you have on a topic.',
    category: 'research',
    parameters: {
      title: {type: 'string', description: 'The note to read.'},
    },
    required: ['title'],
    run: async (args) => {
      const note = await readNote(String(args.title));
      if (!note) {
        const have = (await liveNotes()).map((one) => one.title).join(', ');
        return have
          ? `No note called that. You have: ${have}.`
          : 'No notes yet.';
      }
      return `${note.title}:\n${note.body}`;
    },
  },
  {
    name: 'track_situation',
    description:
      'Record a development in something ongoing that has a state — an order, ' +
      'a dispute, a setup in progress. Use it when something moves: a parcel ' +
      'ships, a reply arrives, a step is done. Distinct from a note (prose) ' +
      'and a reminder (a dated to-do): a situation is a thing you are watching.',
    category: 'research',
    parameters: {
      title: {type: 'string', description: 'What the situation is, short.'},
      update: {type: 'string', description: 'What just happened.'},
    },
    required: ['title', 'update'],
    run: async (args) => {
      const one = await trackSituation(String(args.title), String(args.update));
      return `Logged against "${one.title}" (${one.updates.length} update${
        one.updates.length === 1 ? '' : 's'
      }).`;
    },
  },
  {
    name: 'list_situations',
    description:
      'List what is currently open — the things in progress you are tracking. ' +
      'Use it for "what is going on", "where are we with things", "any updates".',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      const open = await openSituations();
      if (open.length === 0) return 'Nothing open right now.';
      return open
        .map((one) => {
          const last = one.updates[one.updates.length - 1];
          return `- ${one.title}: ${last?.text ?? 'no updates yet'}`;
        })
        .join('\n');
    },
  },
  {
    name: 'resolve_situation',
    description:
      'Mark a situation settled once it is done — the order arrived, the ' +
      'dispute closed. It is filed, not deleted.',
    category: 'research',
    parameters: {
      title: {type: 'string', description: 'Which situation is finished.'},
    },
    required: ['title'],
    run: async (args) => {
      const one = await resolveSituation(String(args.title));
      return one ? `Marked "${one.title}" resolved.` : 'Nothing open by that name.';
    },
  },
  {
    name: 'search_files',
    description:
      'Search the documents the user has given you to keep. Use it when they ' +
      'ask about something that might be in a document they uploaded — a ' +
      'contract, notes, a spec. Returns the relevant passages.',
    category: 'research',
    parameters: {
      about: {type: 'string', description: 'What to look for.'},
    },
    required: ['about'],
    run: async (args) => {
      const hits = await searchFiles(String(args.about));
      if (hits.length === 0) return 'Nothing in their documents mentions that.';
      return hits.map((hit) => `From ${hit.name}:\n"${hit.excerpt}"`).join('\n\n');
    },
  },
];
