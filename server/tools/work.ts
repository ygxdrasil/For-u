import {GithubError, githubView} from '../github';
import {N8nError, n8nView} from '../n8n';
import type {Tool} from './types';

/**
 * The working half of her tools: code and workflows.
 *
 * Both read-only, both degrade to a plain sentence about what is missing when
 * their key is absent. Acting on any of it happens in the user's own browser,
 * which open_pages can take them to.
 */

function ago(iso: string): string {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return 'within the hour';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export const workTools: Tool[] = [
  {
    name: 'check_github',
    description:
      'Look at the user’s GitHub: their open pull requests, reviews waiting ' +
      'on them, and issues assigned to them. Use it when they ask about their ' +
      'code, PRs, reviews, or what is waiting on them there.',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      try {
        const view = await githubView();
        const lines: string[] = [];

        if (view.reviewsWanted.length > 0) {
          lines.push(
            `Reviews waiting on them: ${view.reviewsWanted
              .map((pr) => `${pr.title} (${pr.repo})`)
              .join('; ')}`,
          );
        }
        if (view.prs.length > 0) {
          lines.push(
            `Their open PRs: ${view.prs.map((pr) => `${pr.title} (${pr.repo})`).join('; ')}`,
          );
        }
        if (view.issues.length > 0) {
          lines.push(
            `Assigned issues: ${view.issues.map((issue) => issue.title).join('; ')}`,
          );
        }

        return lines.length > 0
          ? `Signed in as ${view.login}.\n${lines.join('\n')}\n\nReport this in a sentence or two, not as a list.`
          : `Signed in as ${view.login}. Nothing is waiting on them anywhere.`;
      } catch (error) {
        if (error instanceof GithubError) return error.message;
        throw error;
      }
    },
  },
  {
    name: 'check_workflows',
    description:
      'Look at the user’s n8n: whether the workflows are healthy and what has ' +
      'failed lately. Use it when they ask about n8n, their workflows, or ' +
      'automation, and as part of a Work briefing.',
    category: 'research',
    parameters: {},
    required: [],
    run: async () => {
      try {
        const view = await n8nView();

        if (view.failures.length === 0) {
          return (
            `All healthy: ${view.active} active workflow${view.active === 1 ? '' : 's'}` +
            `${view.inactive > 0 ? ` (${view.inactive} paused)` : ''}, ` +
            `${view.recentTotal} recent runs, no failures.`
          );
        }

        const failed = view.failures
          .slice(0, 5)
          .map((one) => `${one.workflow} (${ago(one.at)})`)
          .join('; ');
        return (
          `${view.failures.length} failed execution${view.failures.length === 1 ? '' : 's'}: ` +
          `${failed}. ${view.active} workflows active. Report the failures in a ` +
          `sentence; they can open n8n to dig in.`
        );
      } catch (error) {
        if (error instanceof N8nError) return error.message;
        throw error;
      }
    },
  },
];
