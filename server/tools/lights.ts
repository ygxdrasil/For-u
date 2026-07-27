import {COLOURS, LightError, lights, setBrightness, setColour, setPower} from '../lights';
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
        const names = await setBrightness(
          args.which ? String(args.which) : undefined,
          percent,
        );
        return `${said(names)} at ${Math.max(1, Math.min(100, Math.round(percent)))}%.`;
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
        const {lights: names, colour} = await setColour(
          args.which ? String(args.which) : undefined,
          String(args.colour),
        );
        return `${said(names)} now ${colour}.`;
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
