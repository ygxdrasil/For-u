/**
 * Commands, typed with a slash.
 *
 * A different thing from talking to her, and worth keeping different. Speech is
 * for asking; a command is for telling the machinery what to do — go and
 * research this properly, fold the conversation up, be quiet. They are typed
 * rather than spoken on purpose: "slash compact" is not a sentence anyone says,
 * and every one of these either costs real money or changes state you would
 * want to have meant.
 *
 * Shared between the browser and the server so the list, the help text and the
 * validation are one thing. A command the interface offers and the server has
 * never heard of is the sort of mismatch that only shows up in front of the
 * person using it.
 */

export interface Command {
  name: string;
  /** What to show after the name in the menu, when it takes something. */
  takes?: string;
  blurb: string;
  /** Warned about up front, because a surprise on a ten-dollar cap is not on. */
  costs?: string;
}

export const COMMANDS: Command[] = [
  {
    name: 'research',
    takes: 'topic',
    blurb: 'Go away and look properly, then write it up',
    costs: 'several searches and a long answer — a penny or two',
  },
  {
    name: 'compact',
    blurb: 'Fold this conversation into her summary now',
    costs: 'one small call, and makes everything after it cheaper',
  },
  {name: 'sleep', blurb: 'Stop listening until you say her name'},
  {name: 'clear', blurb: 'Start the conversation again. She keeps what she knows'},
  {name: 'help', blurb: 'What you can type here'},
];

export interface Parsed {
  name: string;
  rest: string;
}

/**
 * Read a typed line as a command, or not at all.
 *
 * Only a leading slash counts, and only when a real name follows it. Someone
 * typing a path, a fraction or a date is not issuing an instruction, and
 * treating "/usr/local" as a failed command rather than a message is the sort
 * of cleverness that makes an input box feel hostile.
 */
export function parseCommand(text: string): Parsed | null {
  const match = /^\/([a-z-]+)\b\s*([\s\S]*)$/i.exec(text.trim());
  if (!match) return null;

  const name = match[1].toLowerCase();
  if (!COMMANDS.some((command) => command.name === name)) return null;
  return {name, rest: match[2].trim()};
}

/** The commands worth offering for what has been typed so far. */
export function suggest(text: string): Command[] {
  const match = /^\/([a-z-]*)$/i.exec(text.trim());
  if (!match) return [];
  const partial = match[1].toLowerCase();
  return COMMANDS.filter((command) => command.name.startsWith(partial));
}
