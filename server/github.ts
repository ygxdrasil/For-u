import {githubToken} from './keys';

/**
 * GitHub, read-only, over raw fetch.
 *
 * The official SDK is enormous and this needs four requests. A classic or
 * fine-grained personal access token pasted into her keys is the whole setup;
 * with none she says so instead of guessing.
 *
 * She reads failing builds, waiting reviews, open pull requests and assigned
 * issues, and she can set a failed build running again. That is the extent of
 * the writing, and the line is deliberate: re-running a build repeats work the
 * user already asked for, whereas commenting, merging, and closing all speak to
 * other people in the user's name. Those stay theirs, in their own browser,
 * which open_pages can take them to.
 */

const API = 'https://api.github.com';

class GithubError extends Error {
  constructor(
    message: string,
    readonly needsToken = false,
  ) {
    super(message);
  }
}

async function call<T>(path: string, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const token = githubToken();
  if (!token) {
    throw new GithubError(
      'GitHub is not connected. A personal access token pasted into her keys fixes that.',
      true,
    );
  }

  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(8000),
  });

  if (response.status === 401) {
    throw new GithubError('GitHub rejected the token. It may have expired.', true);
  }
  if (response.status === 403) {
    throw new GithubError(
      'GitHub refused: the token has no permission for that. Re-running checks ' +
        'needs a token with Actions write on the repository.',
      true,
    );
  }
  if (!response.ok) {
    throw new GithubError(`GitHub answered ${response.status}.`);
  }

  // A rerun answers 201 with an empty body; asking that for JSON throws on
  // success, which would report a working action as a failure.
  const body = await response.text();
  return (body ? JSON.parse(body) : {}) as T;
}

export interface GithubView {
  login: string;
  /** Pull requests the user opened that are still open. */
  prs: {title: string; repo: string; url: string}[];
  /** Reviews someone is waiting on from the user. */
  reviewsWanted: {title: string; repo: string; url: string}[];
  /** Issues assigned to the user. */
  issues: {title: string; repo: string; url: string}[];
}

interface SearchItem {
  title: string;
  html_url: string;
  repository_url: string;
}

function shape(items: SearchItem[]): {title: string; repo: string; url: string}[] {
  return items.slice(0, 8).map((item) => ({
    title: item.title,
    repo: item.repository_url.split('/repos/')[1] ?? '',
    url: item.html_url,
  }));
}

export async function githubView(): Promise<GithubView> {
  const me = await call<{login: string}>('/user');
  const login = me.login;

  // Three searches, in parallel; each is one request against the search API.
  const [prs, reviews, issues] = await Promise.all([
    call<{items: SearchItem[]}>(
      `/search/issues?q=${encodeURIComponent(`is:pr is:open author:${login}`)}&per_page=8`,
    ),
    call<{items: SearchItem[]}>(
      `/search/issues?q=${encodeURIComponent(`is:pr is:open review-requested:${login}`)}&per_page=8`,
    ),
    call<{items: SearchItem[]}>(
      `/search/issues?q=${encodeURIComponent(`is:issue is:open assignee:${login}`)}&per_page=8`,
    ),
  ]);

  return {
    login,
    prs: shape(prs.items),
    reviewsWanted: shape(reviews.items),
    issues: shape(issues.items),
  };
}

/**
 * Set the failing half of a build going again.
 *
 * The most common thing anyone does about a red build is run it again, because
 * a good share of failures are a flaky test or a registry that timed out. Doing
 * it from a phone means finding the run in GitHub's mobile site, which nobody
 * enjoys; saying "run it again" is the whole of what this is for.
 *
 * Only the failed jobs are re-run, not the whole workflow — cheaper, faster,
 * and it leaves the successful jobs' results intact rather than replacing them
 * with fresh ones that might differ.
 */
export async function rerunFailedChecks(
  repoSaid: string,
): Promise<{repo: string; workflow: string; branch: string}> {
  const said = repoSaid.trim().replace(/^https?:\/\/github\.com\//, '');

  // "owner/name" is unambiguous; a bare name is matched against the
  // repositories she can already see the user working in, since that is the
  // only place a spoken half-name can mean anything.
  let repo = said;
  if (!said.includes('/')) {
    const view = await githubView();
    const known = [...view.prs, ...view.reviewsWanted, ...view.issues].map(
      (item) => item.repo,
    );
    const hit = known.find((full) =>
      full.toLowerCase().endsWith(`/${said.toLowerCase()}`),
    );
    if (!hit) {
      throw new GithubError(
        `Not sure which repository "${said}" is. Ask them for the owner and ` +
          'name, as owner/name.',
      );
    }
    repo = hit;
  }

  const runs = await call<{
    workflow_runs?: {id: number; name?: string; head_branch?: string}[];
  }>(`/repos/${repo}/actions/runs?status=failure&per_page=1`);

  const run = runs.workflow_runs?.[0];
  if (!run) {
    throw new GithubError(`Nothing has failed recently in ${repo}.`);
  }

  await call(`/repos/${repo}/actions/runs/${run.id}/rerun-failed-jobs`, 'POST');
  return {
    repo,
    workflow: run.name ?? 'the workflow',
    branch: run.head_branch ?? 'its branch',
  };
}

export function githubConfigured(): boolean {
  return Boolean(githubToken());
}

export {GithubError};
