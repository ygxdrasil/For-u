import {MODES, isMode, setMode} from '../modes';
import {remember, supersedeEntry} from '../memory';
import {notify} from '../push';
import {saveWorkspace, workspaces} from '../workspaces';
import type {MemoryKind, Workspace} from '../../shared/types';
import type {Tool} from './types';

/**
 * The tools she points at herself.
 *
 * Everything else in this folder reaches out — mail, a console, a repository.
 * These reach in. She can commit something to memory on purpose rather than
 * hoping the reflection pass catches it, correct a belief she has been carrying
 * that turned out to be wrong, change how much of the user's attention she is
 * taking, build a new room in her own interface, and reach the user's phone
 * when they are not looking at her.
 *
 * This is the part of "full control" that matters most and is easiest to miss.
 * An assistant who can rearrange your calendar but not her own understanding of
 * you is a remote control, not an assistant — and every one of these was
 * something the user previously had to open a panel and do by hand.
 *
 * The same limits hold here as everywhere. Nothing forgets: correcting a belief
 * marks it as overtaken and keeps it, because that it used to be true is itself
 * a fact about the user. Nothing hides a room: retiring one is the interface's
 * to do, and even there it is hidden rather than removed.
 */

export const selfTools: Tool[] = [
  {
    name: 'remember_this',
    description:
      'Commit something about the user to memory on purpose. Use it when they ' +
      'tell you something worth keeping — a preference, how they like things ' +
      'done, a fact about their life or work — and especially when they say ' +
      '"remember that". Do not use it for passing detail, for anything about ' +
      'the current conversation, or for anything they have told you not to keep.',
    category: 'research',
    parameters: {
      fact: {
        type: 'string',
        description:
          'One fact, written about the user in the third person, as a full ' +
          'sentence: "The user takes their coffee black". Not a note to self.',
      },
      kind: {
        type: 'string',
        description: 'What sort of thing it is.',
        values: ['preference', 'fact', 'routine', 'goal'],
      },
    },
    required: ['fact'],
    run: async (args) => {
      const text = String(args.fact).trim();
      if (text.length < 4) return 'That is too thin to be worth keeping.';

      const kind = String(args.kind ?? 'fact');
      const added = await remember([
        {
          // Said out loud, so it is a stated fact rather than something she
          // inferred — which is a real distinction the profile keeps.
          kind: (['preference', 'fact', 'routine', 'goal'].includes(kind)
            ? kind
            : 'fact') as MemoryKind,
          text,
          source: 'stated',
        },
      ]);

      return added.length > 0
        ? 'Kept. Say so in three or four words, not a sentence about memory.'
        : 'Already known — she has had that for a while. Do not announce it.';
    },
  },
  {
    name: 'correct_memory',
    description:
      'Mark something she has been believing as no longer true. Use it when the ' +
      'user corrects you, or says something has changed. Give the old belief ' +
      'roughly as she has been holding it. Nothing is thrown away — it is ' +
      'marked as overtaken, because that it used to be true still matters. If ' +
      'there is a new version of the fact, also call remember_this.',
    category: 'research',
    parameters: {
      old: {
        type: 'string',
        description: 'The belief that is no longer true, as she has been holding it.',
      },
    },
    required: ['old'],
    run: async (args) => {
      const found = await supersedeEntry(String(args.old));
      return found
        ? 'Corrected. Acknowledge briefly and move on; do not dwell on it.'
        : 'Nothing on file matched that closely enough to correct. Do not claim you changed anything — say what you do believe and let them put you right.';
    },
  },
  {
    name: 'set_attention',
    description:
      'Change how much of the user’s attention you may take. Open is normal, ' +
      'Work is brisk with personal things held back, Focus is answers only and ' +
      'nothing volunteered, Away means they are not at the desk and you take ' +
      'messages. Use it when they say to leave them alone, that they are ' +
      'heads-down, that they are back, or that they are going out.',
    category: 'research',
    parameters: {
      mode: {
        type: 'string',
        description: 'Which one to move to.',
        values: ['open', 'work', 'focus', 'away'],
      },
    },
    required: ['mode'],
    run: async (args) => {
      const mode = String(args.mode).toLowerCase();
      if (!isMode(mode)) {
        return `There is no "${mode}" mode. They are: open, work, focus, away.`;
      }
      await setMode(mode);
      return (
        `Now in ${MODES[mode].label}. ${MODES[mode].guidance} ` +
        'Confirm in a few words and start behaving that way in this very reply.'
      );
    },
  },
  {
    name: 'make_room',
    description:
      'Build a new room in her interface, or change one that exists. A room is ' +
      'a name, a colour, the panels it shows and the pages it opens when the ' +
      'user goes there. Use it when they describe a mode or a space they want — ' +
      '"make me a room for the gym", "add the news to my morning". Saying the ' +
      'name of an existing room changes that one rather than making a second.',
    category: 'research',
    parameters: {
      name: {type: 'string', description: 'What the room is called, one or two words.'},
      panels: {
        type: 'string',
        description:
          'Comma-separated, from: day, needs, weather, notes, situations, ' +
          'files, activity, connections, spend, github, workflows, deeds, ' +
          'faculties, attention, playstation, games.',
      },
      opens: {
        type: 'string',
        description: 'Comma-separated web addresses to open on arrival. Optional.',
      },
      accent: {
        type: 'string',
        description: 'The colour of the room.',
        values: ['ice', 'amber', 'violet', 'rose'],
      },
      brief: {
        type: 'string',
        description:
          'What she should say or check on arrival, in the user’s words. Optional.',
      },
    },
    required: ['name'],
    run: async (args) => {
      const name = String(args.name).trim().slice(0, 24);
      if (!name) return 'A room needs a name.';

      const split = (value: unknown) =>
        String(value ?? '')
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean);

      // Matching an existing room by name means "add weather to my work room"
      // edits it rather than quietly creating a second room called Work.
      const existing = (await workspaces()).find(
        (room) => room.name.toLowerCase() === name.toLowerCase(),
      );

      const panels = split(args.panels);
      const opens = split(args.opens);

      const patch: Partial<Workspace> = {
        ...(existing ?? {}),
        ...(existing ? {id: existing.id} : {}),
        name,
        // An empty list from the model means "leave it alone" on an edit, and
        // "show everything" on a new room — never "show nothing at all".
        panels: panels.length > 0 ? panels : (existing?.panels ?? []),
        opens: opens.length > 0 ? opens : (existing?.opens ?? []),
        accent: (args.accent as Workspace['accent']) ?? existing?.accent ?? 'ice',
        ...(args.brief ? {brief: String(args.brief)} : {}),
      };

      await saveWorkspace(patch);
      return existing
        ? `${name} updated. It is in the rail already, so say so in a few words.`
        : `${name} is now a room in the rail. Tell them it is there and what is on it.`;
    },
  },
  {
    name: 'notify_phone',
    description:
      'Push a short notice to the user’s phone. Use it only when something ' +
      'genuinely wants them and they are not in front of you — a build that ' +
      'failed, a timer that finished, something arriving that they asked to be ' +
      'told about. Never for a reply to something they just said, and never ' +
      'for anything that can wait until they next look.',
    category: 'research',
    parameters: {
      text: {
        type: 'string',
        description: 'The notice, under about fifteen words. It appears on a lock screen.',
      },
    },
    required: ['text'],
    run: async (args) => {
      const text = String(args.text).trim().slice(0, 200);
      if (!text) return 'There was nothing to send.';

      // Notifying the user is her speaking to them, not sending a message on
      // their behalf to somebody else — which is the limit that matters, and
      // is why there is no recipient parameter here and never will be.
      const sent = await notify('Grace', text);
      return sent > 0
        ? `Sent to ${sent} device${sent === 1 ? '' : 's'}.`
        : 'No phone is set up to receive notices yet, so nothing went anywhere. Tell them plainly.';
    },
  },
];
