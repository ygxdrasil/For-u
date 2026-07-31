import {awaitResult, bridgeStatus, enqueue} from '../bridge';
import type {BridgeAction} from '../bridge';
import type {Tool} from './types';

/**
 * The room itself, through the laptop sitting in it.
 *
 * Two things: put a page on that screen, and lock it. Both are what you would
 * ask a person in the room to do while your hands are full, which is exactly
 * the gap an assistant in a data centre otherwise cannot cross.
 *
 * Neither destroys anything. A locked laptop unlocks with a password and has
 * lost nothing in between.
 */

const NO_LAPTOP =
  'The laptop bridge is not running, so I have no way into the room at all. ' +
  'Tell the user plainly: the laptop can only be reached from a program ' +
  'running in the same house, and it is not answering. Do not imply anything ' +
  'happened.';

async function send(action: BridgeAction, verb: string, arg?: string): Promise<string> {
  const {online, state} = await bridgeStatus();
  if (!online) return NO_LAPTOP;

  const finished = await awaitResult(await enqueue(action, arg));

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

  const done: Record<string, string> = {
    open: `Done — it is up on the laptop screen${finished.detail ? ` (${finished.detail})` : ''}.`,
    lock: 'Done — the laptop is locked.',
  };
  return done[action] ?? 'Done.';
}

export const consoleTools: Tool[] = [
/*
 * Waking and sleeping the console used to live here, and do not any more.
 *
 * They worked through playactor, whose last release was February 2022. Both
 * directions now fail silently against current PS5 firmware: the request is
 * sent, the console is entirely unmoved, and the process exits zero. There is
 * no maintained alternative — the most recently published PlayStation
 * integration on npm still depends on that same version.
 *
 * A tool that can never succeed is worse than an absent one. It costs its
 * description in every prompt, she reaches for it in good faith, and the user
 * waits ten seconds to be told it did not work. Removing it means she says
 * plainly that she cannot do it, immediately, which is the honest version of
 * the same answer.
 *
 * The bridge still carries the code for both, and the laptop half of it —
 * opening a page, locking the screen — is untouched and works. If playactor
 * is ever revived, this is two tool definitions and a line in NEEDS.
 */
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
