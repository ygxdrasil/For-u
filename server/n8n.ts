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

async function call<T>(path: string, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const {key, url} = n8nAccess();
  if (!key || !url) {
    throw new N8nError(
      'n8n is not connected. It needs two things pasted into her keys: the ' +
        'instance address, and an API key from Settings, n8n API.',
      true,
    );
  }

  const response = await fetch(`${url}/api/v1${path}`, {
    method,
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

/**
 * Turn a workflow on or off by name.
 *
 * Pausing is the one genuinely useful lever the public API offers: a workflow
 * that has failed nine times in an hour is doing damage every time it runs, and
 * "I've paused it, look when you can" is worth far more than a notification.
 *
 * Names are matched loosely because the user says them out loud, and an exact
 * match wins over a partial one so "Invoices" cannot be captured by "Invoices
 * (old)". Ambiguity is reported rather than guessed at — pausing the wrong
 * workflow is a silent outage.
 *
 * Note what is not here: running one. n8n's public API exposes no trigger
 * endpoint, so she would have to invent a webhook that may not exist. She says
 * so instead of pretending.
 */
export async function setWorkflowActive(
  said: string,
  active: boolean,
): Promise<{name: string; changed: boolean}> {
  const needle = said.toLowerCase().trim();
  const {data} = await call<{data: {id: string; name: string; active: boolean}[]}>(
    '/workflows?limit=200',
  );

  const exact = data.filter((one) => one.name.toLowerCase().trim() === needle);
  const partial = data.filter((one) => one.name.toLowerCase().includes(needle));
  const candidates = exact.length > 0 ? exact : partial;

  if (candidates.length === 0) {
    throw new N8nError(
      `No workflow called "${said}". They are: ${
        data.map((one) => one.name).join(', ') || 'none at all'
      }.`,
    );
  }
  if (candidates.length > 1) {
    throw new N8nError(
      `"${said}" matches more than one: ${candidates
        .map((one) => one.name)
        .join(', ')}. Ask which they mean.`,
    );
  }

  const target = candidates[0];
  if (target.active === active) return {name: target.name, changed: false};

  await call(`/workflows/${target.id}/${active ? 'activate' : 'deactivate'}`, 'POST');
  return {name: target.name, changed: true};
}

export function n8nConfigured(): boolean {
  const {key, url} = n8nAccess();
  return Boolean(key && url);
}

export {N8nError};
