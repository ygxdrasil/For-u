import React from 'react';

/**
 * The thing that stops a white screen.
 *
 * React unmounts the entire tree when a render throws. Without a boundary that
 * leaves a blank page: no message, no way back, and nothing to tell anyone —
 * which is exactly what happened, twice, and cost an evening of guessing each
 * time.
 *
 * So this does three things, in order of who they serve:
 *   1. shows WHAT broke, in words, with a way to carry on
 *   2. keeps the conversation on screen rather than throwing it away
 *   3. reports the stack to the server, so the next one is diagnosable from
 *      the logs instead of from a description of a white rectangle
 */

/**
 * The same fault, reported once.
 *
 * A render error usually repeats — React retries, an interval fires again, the
 * user presses Try again — and a boundary that reports every occurrence turns
 * one bug into thousands of log lines and a bill. The first one carries the
 * stack; the rest add nothing.
 */
const alreadyReported = new Set();
const REPORT_LIMIT = 12;

const report = (kind, error, extra = {}) => {
  try {
    const fingerprint = `${kind}:${String(error?.message ?? error).slice(0, 200)}`;
    if (alreadyReported.has(fingerprint) || alreadyReported.size >= REPORT_LIMIT) return;
    alreadyReported.add(fingerprint);

    navigator.sendBeacon?.(
      '/api/clientlog',
      new Blob(
        [JSON.stringify({
          kind,
          message: String(error?.message ?? error).slice(0, 500),
          stack: String(error?.stack ?? '').slice(0, 4000),
          at: new Date().toISOString(),
          url: window.location.pathname,
          build: document.documentElement.dataset.build ?? null,
          ...extra,
        })],
        { type: 'application/json' },
      ),
    );
  } catch {
    // Reporting a crash must never cause one.
  }
};

/** Async failures do not blank the screen, but they are worth capturing too. */
export function watchForUncaughtErrors() {
  window.addEventListener('error', (e) => report('uncaught', e.error ?? e.message));
  window.addEventListener('unhandledrejection', (e) => report('unhandled-rejection', e.reason));
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    report('render', error, { componentStack: String(info?.componentStack ?? '').slice(0, 2000) });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const details = [
      this.state.error.message,
      this.state.error.stack,
      this.state.info?.componentStack,
    ]
      .filter(Boolean)
      .join('\n\n');

    return (
      <div className="crash">
        <h1>Something in the interface broke.</h1>
        <p>
          Not your workflows — this screen. Whatever he was doing on your n8n either finished or did not;
          this is the page failing to draw it, and nothing here changed anything in n8n.
        </p>
        <div className="crash-what">{this.state.error.message || 'No message came with the error.'}</div>
        <div className="row">
          <button onClick={() => this.setState({ error: null, info: null })}>Try again</button>
          <button className="ghost" onClick={() => window.location.reload()}>Reload</button>
          <button className="ghost" onClick={() => navigator.clipboard?.writeText(details)}>Copy details</button>
        </div>
        <details>
          <summary>Details</summary>
          <pre>{details}</pre>
        </details>
      </div>
    );
  }
}
