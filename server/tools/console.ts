import {awaitResult, bridgeStatus, enqueue} from '../bridge';
import type {BridgeAction} from '../bridge';
import type {Tool} from './types';

/**
 * The room itself, through the laptop sitting in it.
 *
 * The console accepts two things and no more from outside a Remote Play
 * session: switch on, and go to sleep. That is not a judgement about what she
 * should be trusted with — starting a specific game means driving the
 * interface over a video stream, which is a different piece of software
 * altogether, and she says so rather than trying.
 *
 * The laptop itself takes two more: put a page on its screen, and lock it. Both
 * are things you would ask a person in the room to do while your hands are
 * full, which is exactly the gap a voice assistant in a data centre otherwise
 * cannot cross.
 *
 * None of the four destroys anything. A console put to sleep switches on again
 * with the same sentence; a locked laptop unlocks with a password and has lost
 * nothing in between.
 */

const NO_LAPTOP =
  'The laptop bridge is not running, so I have no way into the room at all. ' +
  'Tell the user plainly: the console and the laptop can only be reached from ' +
  'a program running in the same house, and it is not answering. Do not imply ' +
  'anything happened.';

async function send(action: BridgeAction, verb: string, arg?: string): Promise<string> {
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

  /*
   * How long to wait for the laptop to say what happened.
   *
   * Waking and sleeping are no longer fire-and-forget: the laptop now watches
   * the console until it has actually changed state, and re-sends the
   * instruction if it has not, because a PS5 with more than one account
   * swallows the first standby often enough that "send it twice" is the
   * documented remedy. That verification is worth several seconds and is the
   * whole difference between her reporting what happened and reporting what
   * she asked for. Opening a page and locking a screen are instant by
   * comparison and keep the short wait.
   */
  const patience = action === 'wake' || action === 'sleep' ? 25_000 : 12_000;
  const finished = await awaitResult(await enqueue(action, arg), patience);

  if (!finished) {
    return (
      `The laptop took the instruction to ${verb} but has not reported back ` +
      `yet. Say that it is on its way rather than that it is done.`
    );
  }

  if (!finished.ok) {
    return (
      `That did not work: ${finished.detail || 'the laptop gave no reason'}. ` +
      `Say so plainly and do not offer to try again — it has already been ` +
      `tried twice and checked against the console both times.`
    );
  }

  // Past tense now, and it is earned: the laptop watched the console change
  // before saying so. It used to say "is coming on" off the back of an exit
  // code, which was a guess dressed as a report.
  const done: Record<string, string> = {
    wake: `The console is on${finished.detail ? ` — ${finished.detail}` : ''}.`,
    sleep: `The console is asleep${finished.detail ? ` — ${finished.detail}` : ''}.`,
    open: `Done — it is up on the laptop screen${finished.detail ? ` (${finished.detail})` : ''}.`,
    lock: 'Done — the laptop is locked.',
  };
  return done[action] ?? 'Done.';
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
  {
    name: 'open_on_laptop',
    description:
      'Put a web page up on the laptop in the room, on its own screen. Use it ' +
      'when the user is not holding a phone and says "pull that up", "put it on ' +
      'the laptop", or "show me". Different from open_pages, which opens a tab ' +
      'in whatever they are looking at now — this one reaches the machine in ' +
      'the room. Web addresses only.',
    category: 'home',
    parameters: {
      url: {
        type: 'string',
        description: 'The full address, including https://.',
      },
    },
    required: ['url'],
    run: (args) => send('open', 'open that page', String(args.url ?? '')),
  },
  {
    name: 'lock_laptop',
    description:
      'Lock the laptop’s screen. Use it when the user says they are leaving, ' +
      'going out, or asks you to lock up. Nothing closes and nothing is lost — ' +
      'it is the lock screen, not a shutdown.',
    category: 'home',
    parameters: {},
    required: [],
    run: () => send('lock', 'lock the laptop'),
  },
];
