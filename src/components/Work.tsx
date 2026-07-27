import {AlertTriangle, ExternalLink, GitPullRequest, Workflow} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Panel} from './Panels';

/**
 * The Work room's two panels: GitHub and n8n.
 *
 * Both are read-only and both say plainly when their key is absent, rather
 * than showing an empty frame that could mean either "nothing wrong" or "not
 * connected". Acting on anything happens in the user's own browser — every
 * item is a link out.
 */

interface GithubData {
  configured: boolean;
  error?: string;
  login?: string;
  prs?: {title: string; repo: string; url: string}[];
  reviewsWanted?: {title: string; repo: string; url: string}[];
  issues?: {title: string; repo: string; url: string}[];
}

function Item({title, repo, url}: {title: string; repo: string; url: string}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-1.5 text-xs text-slate-300 transition hover:text-slate-100">
      <ExternalLink size={10} className="mt-0.5 shrink-0 text-mist/40 group-hover:accent" />
      <span className="min-w-0 flex-1">
        <span className="block truncate">{title}</span>
        {repo && <span className="text-[0.6rem] text-mist/40">{repo}</span>}
      </span>
    </a>
  );
}

export function GithubPanel() {
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    fetch('/api/github-view')
      .then((response) => (response.ok || response.status === 409 ? response.json() : null))
      .then((body: GithubData | null) => body && setData(body))
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <Panel title="GitHub">
      {!data.configured || data.error ? (
        <p className="text-xs text-mist/55">
          {data.error ?? 'Not connected. A personal access token in her keys turns this on.'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {data.reviewsWanted && data.reviewsWanted.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1 text-[0.6rem] uppercase tracking-wider text-amber-300/80">
                <AlertTriangle size={10} /> Waiting on you
              </p>
              {data.reviewsWanted.map((pr) => (
                <Item key={pr.url} {...pr} />
              ))}
            </div>
          )}
          {data.prs && data.prs.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1 text-[0.6rem] uppercase tracking-wider text-mist/50">
                <GitPullRequest size={10} /> Your PRs
              </p>
              {data.prs.map((pr) => (
                <Item key={pr.url} {...pr} />
              ))}
            </div>
          )}
          {data.issues && data.issues.length > 0 && (
            <div>
              <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-mist/50">
                Assigned
              </p>
              {data.issues.map((issue) => (
                <Item key={issue.url} {...issue} />
              ))}
            </div>
          )}
          {!data.prs?.length && !data.reviewsWanted?.length && !data.issues?.length && (
            <p className="text-xs text-mist/55">Nothing waiting on you. Clear.</p>
          )}
        </div>
      )}
    </Panel>
  );
}

interface N8nData {
  configured: boolean;
  error?: string;
  active?: number;
  inactive?: number;
  failures?: {workflow: string; at: string}[];
  recentTotal?: number;
}

export function WorkflowsPanel() {
  const [data, setData] = useState<N8nData | null>(null);

  useEffect(() => {
    fetch('/api/n8n-view')
      .then((response) => (response.ok || response.status === 409 ? response.json() : null))
      .then((body: N8nData | null) => body && setData(body))
      .catch(() => {});
  }, []);

  if (!data) return null;
  const failing = (data.failures?.length ?? 0) > 0;

  return (
    <Panel title="Workflows" bright={failing}>
      {!data.configured || data.error ? (
        <p className="text-xs text-mist/55">
          {data.error ?? 'Not connected. Paste the n8n address and an API key in her keys.'}
        </p>
      ) : failing ? (
        <div>
          <p className="mb-1 flex items-center gap-1 text-xs text-rose-300">
            <AlertTriangle size={11} /> {data.failures?.length} failing
          </p>
          <ul className="space-y-0.5">
            {data.failures?.slice(0, 5).map((one, index) => (
              <li key={`${one.workflow}-${index}`} className="truncate text-[0.72rem] text-mist/75">
                {one.workflow}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-xs text-slate-300">
          <Workflow size={12} className="accent" />
          {data.active} active, all healthy
          {data.recentTotal ? ` · ${data.recentTotal} recent runs` : ''}
        </p>
      )}
    </Panel>
  );
}
