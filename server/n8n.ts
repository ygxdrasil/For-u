import {n8nAccess} from './keys';

/**
 * n8n, read-only: are the workflows healthy, and what failed.
 *
 * Two pasted values make it work — the instance address (cloud accounts each
 * have their own) and an API key from Settings → n8n API. With neither she
 * says what is missing rather than guessing at workflow health, which would
 * be worse than silence.
 */

class N8nError extends Error {
  constructor(
    message: string,
    readonly needsKey = false,
  ) {
    super(message);
  }
}

async function call<T>(path: string): Promise<T> {
  const {key, url} = n8nAccess();
  if (!key || !url) {
    throw new N8nError(
      'n8n is not connected. It needs two things pasted into her keys: the ' +
        'instance address, and an API key from Settings, n8n API.',
      true,
    );
  }

  const response = await fetch(`${url}/api/v1${path}`, {
    headers: {'X-N8N-API-KEY': key},
    signal: AbortSignal.timeout(8000),
  });

  if (response.status === 401) {
    throw new N8nError('n8n rejected the key. It may have been revoked.', true);
  }
  if (!response.ok) throw new N8nError(`n8n answered ${response.status}.`);
  return response.json() as Promise<T>;
}

export interface N8nView {
  active: number;
  inactive: number;
  /** Recent failed executions, newest first. */
  failures: {workflow: string; at: string}[];
  /** Recent executions overall, for a success feel. */
  recentTotal: number;
}

export async function n8nView(): Promise<N8nView> {
  const [workflows, failed, recent] = await Promise.all([
    call<{data: {name: string; active: boolean}[]}>('/workflows?limit=100'),
    call<{data: {workflowData?: {name?: string}; startedAt: string}[]}>(
      '/executions?status=error&limit=10',
    ),
    call<{data: unknown[]}>('/executions?limit=50'),
  ]);

  return {
    active: workflows.data.filter((one) => one.active).length,
    inactive: workflows.data.filter((one) => !one.active).length,
    failures: failed.data.map((one) => ({
      workflow: one.workflowData?.name ?? 'unnamed workflow',
      at: one.startedAt,
    })),
    recentTotal: recent.data.length,
  };
}

export function n8nConfigured(): boolean {
  const {key, url} = n8nAccess();
  return Boolean(key && url);
}

export {N8nError};
