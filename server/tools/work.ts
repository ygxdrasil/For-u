import {GithubError, githubView, rerunFailedChecks} from '../github';
import {N8nError, n8nView, setWorkflowActive} from '../n8n';
import type {Tool} from './types';

/**
 * The working half of her tools: code and workflows.
 *
 * She reads both, and acts on both in exactly one way each — re-running a
 * failed build, and pausing or resuming a workflow. Those two share a property
 * worth stating: each is reversible by saying the opposite sentence, and
 * neither speaks to another person in the user's name. Merging a pull request,
 * commenting on an issue, replying to a reviewer — all of those are the user's
 * own voice and stay in the user's own browser, which open_pages reaches.
 *
 * Each degrades to a plain sentence about what is missing when its key is
 * absent, rather than a stack trace or a guess.
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
  {
    name: 'pause_workflow',
    description:
      'Pause or resume one of the user’s n8n workflows by name. Use it when ' +
      'they say to stop, pause, turn off, restart or turn back on a workflow — ' +
      'and offer it yourself when one is failing over and over, since every run ' +
      'of a broken workflow does the damage again. It cannot run a workflow: ' +
      'n8n offers no way to trigger one from outside, so say so if asked.',
    category: 'research',
    parameters: {
      name: {type: 'string', description: 'The workflow’s name, as they said it.'},
      running: {
        type: 'boolean',
        description: 'True to resume it, false to pause it.',
      },
    },
    required: ['name', 'running'],
    run: async (args) => {
      try {
        const wanted = Boolean(args.running);
        const {name, changed} = await setWorkflowActive(String(args.name), wanted);
        if (!changed) {
          return `${name} was already ${wanted ? 'running' : 'paused'}. Nothing to do.`;
        }
        return `${name} is ${wanted ? 'running again' : 'paused'}.`;
      } catch (error) {
        if (error instanceof N8nError) return error.message;
        throw error;
      }
    },
  },
  {
    name: 'rerun_checks',
    description:
      'Set the failed jobs of a repository’s most recent red build running ' +
      'again. Use it when the user asks to re-run CI, the build, the checks, or ' +
      'the tests, or says a failure looks flaky. Only the failed jobs re-run.',
    category: 'research',
    parameters: {
      repo: {
        type: 'string',
        description:
          'The repository, as owner/name if they said it that way, or just the ' +
          'name if it is one you have already seen in their work.',
      },
    },
    required: ['repo'],
    run: async (args) => {
      try {
        const {repo, workflow, branch} = await rerunFailedChecks(String(args.repo));
        return `Re-running the failed jobs of ${workflow} on ${branch} in ${repo}.`;
      } catch (error) {
        if (error instanceof GithubError) return error.message;
        throw error;
      }
    },
  },
];
