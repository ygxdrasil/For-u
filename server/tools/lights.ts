import {
  applyScene,
  COLOURS,
  LightError,
  lights,
  nameOfColour,
  setBrightness,
  setColour,
  setPower,
  survey,
} from '../lights';
import {
  allScenes,
  findScene,
  kelvinToRgb,
  type Nudge,
  restoreScene,
  SCENE_NAMES,
  tuneScene,
} from '../scenes';
import type {Landed} from '../lights';
import type {Tool} from './types';

const NUDGES: Nudge[] = ['dimmer', 'brighter', 'warmer', 'cooler'];

/**
 * The names in the tool description, so what she is offered and what exists
 * cannot drift apart. Built from the scenes themselves rather than typed out
 * twice — the second copy is always the one that goes stale.
 */
const DEFAULT_NAMES = SCENE_NAMES.join(', ');

async function sceneList(): Promise<string> {
  const scenes = await allScenes();
  return `Settings: ${scenes
    .map((scene) => `${scene.id} (${scene.kelvin}K, ${scene.brightness}%)`)
    .join('; ')}.`;
}

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
 * What actually happened, light by light.
 *
 * Three different things used to come out of here as one flat claim of
 * success, and one of them — an unconfirmed read-back — came out as a flat
 * claim of failure instead. They are not the same and she should not say they
 * are:
 *
 *   it worked                  → say so and stop
 *   it worked, nobody can see it → the light is off; mention it
 *   the light will not confirm  → say that, not "it isn't working"
 *   it could not be delivered   → a real failure, and only this one
 *
 * The middle two are the ones that made her sound broken. A strip that
 * changes colour perfectly and reports its old colour for a few seconds is
 * not a broken strip, and telling someone standing in a room that has visibly
 * just changed that their light is not working teaches them to stop believing
 * her — which is expensive, because she is usually right.
 */
function outcome(landed: Landed[], what: string): string {
  const worked = landed.filter((one) => !one.failed);
  const broken = landed.filter((one) => one.failed);
  const dark = worked.filter((one) => one.state.on === false);
  const unsure = worked.filter((one) => one.unconfirmed.length > 0);

  if (worked.length === 0) {
    return `Could not reach ${said(broken.map((one) => one.name))}: ${broken[0]?.failed}`;
  }

  const parts = [`${said(worked.map((one) => one.name))} ${what}.`];

  if (broken.length > 0) {
    parts.push(
      `${said(broken.map((one) => one.name))} could not be reached (${broken[0]?.failed}) — say which one, rather than calling the whole thing a failure.`,
    );
  }

  if (dark.length > 0) {
    parts.push(
      `${said(dark.map((one) => one.name))} ${dark.length === 1 ? 'is' : 'are'} switched off, so nothing shows yet — mention it and offer to turn ${dark.length === 1 ? 'it' : 'them'} on.`,
    );
  }

  if (unsure.length > 0) {
    parts.push(
      `${said(unsure.map((one) => one.name))} would not confirm its ${unsure[0]!.unconfirmed.join(' and ')} — the instruction was sent twice and accepted both times. Do NOT say it is not working; if they can see it changed, it changed. Only mention this if they ask.`,
    );
  }

  return parts.join(' ');
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
        const landed = await setPower(args.which ? String(args.which) : undefined, on);
        return `${outcome(landed, on ? 'on' : 'off')} Say it in a few words.`;
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
        const landed = await setBrightness(
          args.which ? String(args.which) : undefined,
          percent,
        );
        const level = Math.max(1, Math.min(100, Math.round(percent)));
        return outcome(landed, `at ${level}%`);
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
        const {landed, colour} = await setColour(
          args.which ? String(args.which) : undefined,
          String(args.colour),
        );
        return outcome(landed, `now ${colour}`);
      }),
  },
  {
    name: 'set_scene',
    description:
      'Put the lights into one of the named settings: ' +
      `${DEFAULT_NAMES}. Use it whenever the user names one — "sleep mode", ` +
      '"activate work mode", "put it in evening", "movie time" — and also ' +
      'whenever what they describe plainly is one of them ("I\'m going to ' +
      'bed", "time to focus"). Each one sets a colour and a brightness ' +
      'together, chosen from the research on light and the body clock. ' +
      'Prefer this over setting a colour and a brightness separately.',
    category: 'home',
    parameters: {
      scene: {type: 'string', description: 'The setting they named, as they said it.'},
      which: {type: 'string', description: 'Which light. Leave out for all.'},
    },
    required: ['scene'],
    run: (args) =>
      guarded(async () => {
        const scene = await findScene(String(args.scene));
        if (!scene) return `No setting called "${args.scene}". ${await sceneList()}`;

        const landed = await applyScene(
          args.which ? String(args.which) : undefined,
          kelvinToRgb(scene.kelvin),
          scene.brightness,
        );
        return `${outcome(landed, `in ${scene.id}, ${scene.kelvin}K at ${scene.brightness}%`)} Say it in a few words. If they ask why it is set this way: ${scene.why}`;
      }),
  },
  {
    name: 'adjust_scene',
    description:
      'Change what one of the named settings means, and keep the change. Use ' +
      'it for "make sleep mode a bit dimmer", "work mode is too blue", ' +
      '"warmer evening". It saves the new values and shows them immediately, ' +
      'so the next time they ask for that setting they get the new one. Use ' +
      'nudge for "a bit"/"a lot" changes and the exact numbers only when they ' +
      'give you one.',
    category: 'home',
    parameters: {
      scene: {type: 'string', description: 'Which setting to change.'},
      nudge: {
        type: 'string',
        description: 'One of: dimmer, brighter, warmer, cooler.',
      },
      much: {
        type: 'boolean',
        description: 'True for "a lot"/"much", false or omitted for "a bit".',
      },
      brightness: {type: 'number', description: 'An exact brightness, 1 to 100.'},
      kelvin: {
        type: 'number',
        description:
          'An exact colour temperature, 1000 (deep red) to 6500 (cool daylight).',
      },
    },
    required: ['scene'],
    run: (args) =>
      guarded(async () => {
        const scene = await findScene(String(args.scene));
        if (!scene) return `No setting called "${args.scene}". ${await sceneList()}`;

        const nudge = args.nudge ? String(args.nudge).toLowerCase() : undefined;
        if (nudge && !NUDGES.includes(nudge as Nudge)) {
          return `A nudge is one of: ${NUDGES.join(', ')}.`;
        }

        const tuned = await tuneScene(scene.id, {
          ...(nudge ? {nudge: nudge as Nudge} : {}),
          ...(args.much !== undefined ? {much: Boolean(args.much)} : {}),
          ...(args.brightness !== undefined ? {brightness: Number(args.brightness)} : {}),
          ...(args.kelvin !== undefined ? {kelvin: Number(args.kelvin)} : {}),
        });

        // Shown as well as saved: a change to a light you cannot see is a
        // change you cannot judge, and they will only ask again.
        const landed = await applyScene(undefined, kelvinToRgb(tuned.kelvin), tuned.brightness);
        return `${scene.id} is now ${tuned.kelvin}K at ${tuned.brightness}%, saved for next time. ${outcome(landed, 'showing it')}`;
      }),
  },
  {
    name: 'restore_scene',
    description:
      'Put one of the named settings back to how it started, undoing any ' +
      'adjustments. Use it for "put sleep mode back", "reset work mode".',
    category: 'home',
    parameters: {scene: {type: 'string', description: 'Which setting.'}},
    required: ['scene'],
    run: (args) =>
      guarded(async () => {
        const scene = await findScene(String(args.scene));
        if (!scene) return `No setting called "${args.scene}". ${await sceneList()}`;
        const back = await restoreScene(scene.id);
        return `${back.id} is back to ${back.kelvin}K at ${back.brightness}%.`;
      }),
  },
  {
    name: 'list_scenes',
    description:
      'List the named light settings and what each one is currently set to. ' +
      'Use it when the user asks what settings there are, or names one you ' +
      'do not recognise.',
    category: 'research',
    parameters: {},
    required: [],
    run: () => guarded(sceneList),
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

        // The count comes first on purpose. A Govee account keeps listing a
        // device long after it has been unplugged, and "all the lights" then
        // means one real strip and one ghost that never answers — which reads
        // as her failing at something she did perfectly. If the number here
        // does not match what is plugged in, that is the whole explanation.
        const count = `${found.length} light${found.length === 1 ? '' : 's'} on the account.`;

        return `${count} ${found
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
          .join(' ')}`;
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
          : `${found.length} light${found.length === 1 ? '' : 's'} on the account: ${found
              .map((one) => one.name)
              .join(', ')}. If that is more than they actually have plugged in, the extra ones are stale entries in the Govee app and are worth deleting there.`;
      }),
  },
];
