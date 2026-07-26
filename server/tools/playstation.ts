import {PsnError, playstation, presence, recentlyPlayed} from '../ps5';
import type {Tool} from './types';

/**
 * The PlayStation, as something she can be asked about.
 *
 * Read-only on purpose, and not only because of the user's limits: there is no
 * write to be had. Sony's app API shows; it does not switch anything on. She
 * says so plainly rather than implying a power she does not have.
 */

function when(iso: string | null): string {
  if (!iso) return 'at some point';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'at some point';

  const minutes = Math.round((Date.now() - then) / 60_000);
  if (minutes < 2) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export const playstationTools: Tool[] = [
  {
    name: 'check_playstation',
    description:
      'Look at the PlayStation: whether it is on, whether the user is signed ' +
      'in, and what game is running right now. Use this for anything about ' +
      'the console, the PS5, or what they are playing. It only looks — there ' +
      'is no way to turn the console on or start a game from here.',
    category: 'home',
    parameters: {},
    required: [],
    run: async () => {
      try {
        const {presence: now, player, trophies} = await playstation();

        const who = player ? `Signed in as ${player.onlineId}` : 'Signed in';
        const state = now.playing
          ? `${who}, playing ${now.playing}${now.platform ? ` on ${now.platform}` : ''} right now.`
          : now.online
            ? `${who} and online, but no game is running.`
            : `${who}. The console is off or signed out — last seen online ${when(now.lastOnline)}.`;

        const cabinet = trophies
          ? ` Trophy level ${trophies.level}, with ${trophies.platinum} platinums.`
          : '';

        return state + cabinet;
      } catch (error) {
        if (error instanceof PsnError) return error.message;
        throw error;
      }
    },
  },
  {
    name: 'recent_games',
    description:
      'What the user has been playing lately on PlayStation, most recent ' +
      'first. Use it when they ask what they have been playing, when they ' +
      'last played something, or how a game fits into their week.',
    category: 'home',
    parameters: {},
    required: [],
    run: async () => {
      try {
        const games = await recentlyPlayed(8);
        if (games.length === 0) return 'Nothing has been played recently.';

        return games
          .map((game) => `${game.name} — last played ${when(game.lastPlayed)}`)
          .join('\n');
      } catch (error) {
        if (error instanceof PsnError) return error.message;
        throw error;
      }
    },
  },
];

/** Exported for the pulse, which wants presence without the trophy round-trip. */
export {presence};
