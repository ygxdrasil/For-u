import {findWorkspace, workspaces} from '../workspaces';
import type {Tool} from './types';

/**
 * Opening things.
 *
 * Two tools with one mechanism behind them: she names pages, and the browser
 * she is being viewed in opens them. It has to work that way round — a server
 * cannot reach into a browser and open a tab, so what travels is an
 * instruction and the page acts on it.
 *
 * That also sets the honest limit. She can only open something while you are
 * looking at her. Asked to open a page and then left alone, nothing happens,
 * and she is told to say so rather than claim otherwise.
 */

let deliver: ((urls: string[], workspace?: string) => void) | null = null;

export function onOpen(handler: typeof deliver): void {
  deliver = handler;
}

/** "youtube" and "n8n.cloud" both have to end up as something openable. */
function toUrl(raw: string): string | null {
  const said = raw.trim().replace(/\s+/g, '');
  if (!said) return null;
  if (/^https?:\/\//i.test(said)) return said;

  // A bare word is a domain guess; a dotted name is taken as written. Both are
  // better than refusing, since the user can see what opened.
  const host = said.includes('.') ? said : `${said}.com`;
  return /^[a-z0-9.-]+(\/.*)?$/i.test(host) ? `https://${host}` : null;
}

export const openTools: Tool[] = [
  {
    name: 'open_pages',
    description:
      'Open one or more web pages in the user’s browser. Use it whenever they ' +
      'ask you to open, pull up, or bring up a site — "open YouTube", "open my ' +
      'GitHub". It only works while they are looking at you, since the browser ' +
      'showing you is the thing that opens them.',
    category: 'research',
    parameters: {
      urls: {
        type: 'string',
        description:
          'One or more addresses, separated by spaces or commas. A bare name ' +
          'like "youtube" is fine; a full https address is better when you ' +
          'know it.',
      },
    },
    required: ['urls'],
    run: async (args) => {
      const urls = String(args.urls ?? '')
        .split(/[\s,]+/)
        .map(toUrl)
        .filter((url): url is string => Boolean(url))
        .slice(0, 8);

      if (urls.length === 0) return 'That did not look like an address I could open.';

      deliver?.(urls);
      return (
        `Opening ${urls.length === 1 ? urls[0] : `${urls.length} pages`}. Say so in ` +
        `a few words. If their browser blocks it they will see the links to tap, ` +
        `so do not promise it definitely opened.`
      );
    },
  },
  {
    name: 'open_workspace',
    description:
      'Switch the user to one of their workspaces — Work, Home, Play, Grace, or ' +
      'any they have made. Use it for "open work", "go to play", "switch to ' +
      'home". It changes what is on their screen and opens whichever pages that ' +
      'workspace is set to open.',
    category: 'research',
    parameters: {
      name: {type: 'string', description: 'Which workspace, as they said it.'},
    },
    required: ['name'],
    run: async (args) => {
      const workspace = await findWorkspace(String(args.name ?? ''));
      if (!workspace) {
        const names = (await workspaces()).map((one) => one.name).join(', ');
        return `There is no workspace by that name. They have: ${names}.`;
      }

      deliver?.(workspace.opens, workspace.id);

      return (
        `Switched them to ${workspace.name}` +
        (workspace.opens.length > 0
          ? `, opening ${workspace.opens.length} page${workspace.opens.length === 1 ? '' : 's'}`
          : '') +
        `. Say which one you have moved them to, briefly.` +
        (workspace.brief
          ? ` Then do this without being asked, and report it in a sentence or two: ${workspace.brief}`
          : '')
      );
    },
  },
];
