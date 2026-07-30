import {
  COLOURS,
  LightError,
  lights,
  nameOfColour,
  setBrightness,
  setColour,
  setPower,
  survey,
} from '../lights';
import type {Tool} from './types';

/**
 * The lights, as things she can be told to do.
 *
 * Category 'home', which the user has set to act without asking — correctly,
 * since a light is the most undoable thing in the house. Getting it wrong
 * costs one sentence to put right, and asking "shall I turn the lights off?"
 * every time is precisely the behaviour that makes people stop talking to an
 * assistant at all.
 *
 * A name is optional everywhere. "Turn the lights off" means all of them,
 * because that is what people say; "turn the kitchen off" means the ones whose
 * names contain that word. A name matching nothing is reported rather than
 * quietly applied to everything, which is how a misheard word ends up
 * lighting the whole house at two in the morning.
 */

function said(names: string[]): string {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `all ${names.length} of them`;
}

/**
 * The change landed and nobody can see it.
 *
 * A colour set on a light that is switched off is a complete success and a
 * visible nothing, which is indistinguishable from the failure this whole
 * change exists to stop. She is told, and left to decide — offering to switch
 * them on is right for "make it red" and quite wrong for "sleep mode".
 */
function unlit(dark: string[]): string {
  if (dark.length === 0) return '';
  return ` ${said(dark)} ${dark.length === 1 ? 'is' : 'are'} switched off, so nothing shows yet — mention it, and offer to turn ${dark.length === 1 ? 'it' : 'them'} on.`;
}

async function guarded(work: () => Promise<string>): Promise<string> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof LightError) return error.message;
    throw error;
  }
}

export const lightTools: Tool[] = [
  {
    name: 'set_lights',
    description:
      'Turn the lights on or off. Use it whenever the user asks for lights on, ' +
      'off, out, or killed, and when they say they are going to bed or leaving ' +
      'the room. Leave the name out to mean all of them.',
    category: 'home',
    parameters: {
      on: {type: 'boolean', description: 'True for on, false for off.'},
      which: {
        type: 'string',
        description:
          'Which light or group, as they said it — "kitchen", "desk". Leave ' +
          'out for all of them.',
      },
    },
    required: ['on'],
    run: (args) =>
      guarded(async () => {
        const on = Boolean(args.on);
        const names = await setPower(
          args.which ? String(args.which) : undefined,
          on,
        );
        return `${said(names)} ${on ? 'on' : 'off'}. Say so in a few words.`;
      }),
  },
  {
    name: 'dim_lights',
    description:
      'Set how bright the lights are, from 1 to 100. Use it for "dim the ' +
      'lights", "brighter", "all the way up", and work out a sensible number ' +
      'from what they said rather than asking for one.',
    category: 'home',
    parameters: {
      percent: {type: 'number', description: 'Brightness, 1 to 100.'},
      which: {type: 'string', description: 'Which light. Leave out for all.'},
    },
    required: ['percent'],
    run: (args) =>
      guarded(async () => {
        const percent = Number(args.percent);
        if (!Number.isFinite(percent)) return 'That was not a brightness.';
        const {lights: names, dark} = await setBrightness(
          args.which ? String(args.which) : undefined,
          percent,
        );
        const level = Math.max(1, Math.min(100, Math.round(percent)));
        return `${said(names)} at ${level}%.${unlit(dark)}`;
      }),
  },
  {
    name: 'colour_lights',
    description:
      `Set the colour of the lights. Known colours: ${Object.keys(COLOURS).join(', ')}. ` +
      'Map what they said to the nearest of those — "make it cosy" is warm, ' +
      '"party" is magenta — rather than refusing an unlisted word.',
    category: 'home',
    parameters: {
      colour: {type: 'string', description: 'One of the known colours.'},
      which: {type: 'string', description: 'Which light. Leave out for all.'},
    },
    required: ['colour'],
    run: (args) =>
      guarded(async () => {
        const {lights: names, colour, dark} = await setColour(
          args.which ? String(args.which) : undefined,
          String(args.colour),
        );
        return `${said(names)} now ${colour}.${unlit(dark)}`;
      }),
  },
  {
    name: 'check_lights',
    description:
      'Read what the lights are actually doing right now — on or off, how ' +
      'bright, what colour, whether they are reachable. Use it whenever the ' +
      'user asks about the state of the lights, when they say something did ' +
      'not happen, and before answering any question about the room that you ' +
      'would otherwise be guessing at. Never assume a light is as you last ' +
      'left it; people use switches and apps too.',
    category: 'research',
    parameters: {
      which: {type: 'string', description: 'Which light. Leave out for all.'},
    },
    required: [],
    run: (args) =>
      guarded(async () => {
        const found = await survey(args.which ? String(args.which) : undefined);
        if (found.length === 0) return 'No lights on the account.';

        return found
          .map(({name, state}) => {
            if (state.online === false) return `${name}: offline, not reachable.`;
            if (state.on === null) return `${name}: not reporting its state.`;
            if (!state.on) return `${name}: off.`;

            const parts = [
              state.brightness === null ? null : `${state.brightness}%`,
              state.colour === null ? null : nameOfColour(state.colour),
            ].filter(Boolean);
            return `${name}: on${parts.length ? `, ${parts.join(', ')}` : ''}.`;
          })
          .join(' ');
      }),
  },
  {
    name: 'list_lights',
    description:
      'Find out what lights exist and what they are called. Use it when the ' +
      'user asks what you can control, or when a name they used did not match.',
    category: 'research',
    parameters: {},
    required: [],
    run: () =>
      guarded(async () => {
        const found = await lights();
        return found.length === 0
          ? 'No lights on the account.'
          : `Lights: ${found.map((one) => one.name).join(', ')}.`;
      }),
  },
];
