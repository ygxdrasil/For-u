import {awaitResult, bridgeStatus, enqueue} from '../bridge';
import type {BridgeAction} from '../bridge';
import type {Tool} from './types';

/**
 * Actually operating the PlayStation, through the laptop in the room.
 *
 * Two things and no more: switch it on, and put it back to sleep. That is not
 * a decision about what she should be trusted with — it is the whole of what
 * the console will accept from outside a Remote Play session. Starting a
 * specific game means driving the interface over a video stream, which is a
 * different piece of software altogether, and she says so rather than trying.
 *
 * Neither of these destroys anything: a console that has been put to sleep is
 * a console you can switch on again with the same sentence.
 */

const NO_LAPTOP =
  'The laptop bridge is not running, so I have no way onto your home network. ' +
  'Tell the user plainly: the console can only be reached from something in ' +
  'the same house, and that program is not answering.';

async function send(action: BridgeAction, verb: string): Promise<string> {
  const {online, state} = await bridgeStatus();
  if (!online) return NO_LAPTOP;

  // Saying "it is already on" beats sending a wake packet and reporting
  // success about something that had not changed.
  if (action === 'wake' && state?.status === 'AWAKE') {
    return 'The console is already on.';
  }
  if (action === 'sleep' && state?.status === 'STANDBY') {
    return 'The console is already asleep.';
  }

  const finished = await awaitResult(await enqueue(action));

  if (!finished) {
    return (
      `The laptop took the instruction to ${verb} the console but has not ` +
      `reported back yet. Say that it is on its way rather than that it is done.`
    );
  }

  return finished.ok
    ? `Done — the console is ${action === 'wake' ? 'coming on' : 'going to sleep'}.` +
        (finished.detail ? ` ${finished.detail}` : '')
    : `That did not work: ${finished.detail || 'the laptop gave no reason'}.`;
}

export const consoleTools: Tool[] = [
  {
    name: 'wake_playstation',
    description:
      'Switch the PlayStation on. Use it whenever the user asks you to turn ' +
      'on the console, the PS5, or the PlayStation, or to get it ready. It ' +
      'takes a few seconds to come up.',
    category: 'home',
    parameters: {},
    required: [],
    run: () => send('wake', 'wake'),
  },
  {
    name: 'sleep_playstation',
    description:
      'Put the PlayStation into rest mode. Use it when the user asks you to ' +
      'turn it off, switch it off, or put it to sleep. It is rest mode rather ' +
      'than a full shutdown, so you can switch it back on again afterwards.',
    category: 'home',
    parameters: {},
    required: [],
    run: () => send('sleep', 'sleep'),
  },
];
