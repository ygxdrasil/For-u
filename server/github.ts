import {githubToken} from './keys';

/**
 * GitHub, read-only, over raw fetch.
 *
 * The official SDK is enormous and this needs four requests. A classic or
 * fine-grained personal access token pasted into her keys is the whole setup;
 * with none she says so instead of guessing.
 *
 * Nothing here writes. She reports failing builds, waiting reviews, open pull
 * requests and assigned issues — acting on them is the user's, in their own
 * browser, which open_pages can take them to.
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

async function call<T>(path: string): Promise<T> {
  const token = githubToken();
  if (!token) {
    throw new GithubError(
      'GitHub is not connected. A personal access token pasted into her keys fixes that.',
      true,
    );
  }

  const response = await fetch(`${API}${path}`, {
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
  if (!response.ok) {
    throw new GithubError(`GitHub answered ${response.status}.`);
  }
  return response.json() as Promise<T>;
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

export function githubConfigured(): boolean {
  return Boolean(githubToken());
}

export {GithubError};
