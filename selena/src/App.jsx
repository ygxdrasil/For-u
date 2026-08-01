/**
 * The shell: sidebar, routing, and the one poll everything shares.
 *
 * Routing is on window.location.hash in about thirty lines. Eight pages do not
 * justify a router dependency, and the hash means the whole thing is a static
 * bundle with no server rewrites to get wrong.
 *
 * There is exactly ONE poll, in here, passed down. Eight pages each polling
 * their own endpoint would be eight times the function invocations for the
 * same picture, which on a free plan is the difference between free and not.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, getToken } from './api.js';
import { LiveDot, Banner, Empty } from './components.jsx';
import Gate from './pages/Gate.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Findings from './pages/Findings.jsx';
import Watches from './pages/Watches.jsx';
import Ask from './pages/Ask.jsx';
import Jason from './pages/Jason.jsx';
import Sources from './pages/Sources.jsx';
import Costs from './pages/Costs.jsx';
import Settings from './pages/Settings.jsx';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', component: Dashboard },
  { id: 'findings', label: 'Findings', component: Findings, count: (d) => d?.headline?.activeFindings },
  { id: 'watches', label: 'Watches', component: Watches, count: (d) => d?.headline?.watchesActive },
  { id: 'jason', label: 'For Jason', component: Jason, count: (d) => d?.headline?.buildable },
  { id: 'ask', label: 'Ask', component: Ask },
  { id: 'costs', label: 'Costs', component: Costs },
  { id: 'sources', label: 'Sources', component: Sources },
  { id: 'settings', label: 'Settings', component: Settings },
];

/** Poll cadence. Slow enough to be free, fast enough to feel live. */
const POLL_MS = 12_000;

function useHashRoute() {
  const read = () => {
    const raw = (window.location.hash || '#dashboard').slice(1);
    const [id, param] = raw.split('/');
    return { id: PAGES.some((p) => p.id === id) ? id : 'dashboard', param: param ? decodeURIComponent(param) : null };
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(null);

  // Who are you? Asked once on load, and again only when something changes it.
  // Nothing else renders until this is known, so the HUD never flashes a
  // half-loaded dashboard at someone who is not signed in.
  const [auth, setAuth] = useState(null);
  const refreshAuth = useCallback(async () => {
    const res = await api.authStatus();
    setAuth(res.ok ? res.data : { hasPassword: false, signedIn: false, unreachable: res.error });
    return res.ok ? res.data : null;
  }, []);

  const refresh = useCallback(async () => {
    // Never stack polls. A slow response used to mean three requests racing
    // and the oldest one winning, which shows stale data that looks fresh.
    if (inFlight.current) inFlight.current.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    setBusy(true);
    const res = await api.dashboard(controller.signal);
    if (controller.signal.aborted) return;
    inFlight.current = null;
    setBusy(false);
    if (res.ok) {
      setData(res.data);
      setError(null);
    } else if (!res.aborted) {
      setError(res.error);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const locked = auth && !auth.unreachable && (!auth.hasPassword || !auth.signedIn);

  useEffect(() => {
    // Do not poll behind the sign-in screen: every request would 401, and the
    // activity feed would fill with rejections instead of research.
    if (auth === null || locked) return undefined;
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    // Polling a background tab is spending money to render nothing.
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh, auth, locked]);

  const Page = useMemo(() => PAGES.find((p) => p.id === route.id)?.component ?? Dashboard, [route.id]);

  if (auth === null) return <Empty>…</Empty>;

  if (locked) {
    return (
      <Gate
        status={auth}
        onSignedIn={async () => {
          await refreshAuth();
          refresh();
        }}
      />
    );
  }

  const needsToken = error && /401|token/i.test(String(error)) && !getToken();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>
            <span className="mark" />
            Selena
          </h1>
          <p>Finds demand that is real, paid for, and badly served.</p>
        </div>

        <nav className="nav">
          {PAGES.map((p) => {
            const count = p.count?.(data);
            return (
              <a key={p.id} href={`#${p.id}`} className={route.id === p.id ? 'on' : ''}>
                <span>{p.label}</span>
                {Number.isFinite(count) && count > 0 ? <span className="count">{count}</span> : null}
              </a>
            );
          })}
        </nav>

        <div className="sidefoot">
          <LiveDot busy={busy} at={data?.at} />
          <div style={{ marginTop: 6 }}>
            build <code>{data?.build?.buildId ?? '—'}</code>
          </div>
          <div className="muted" style={{ marginTop: 4 }}>
            {data?.context?.store?.durable ? 'storage: durable' : 'storage: in memory'}
          </div>
        </div>
      </aside>

      <main className="main">
        {needsToken ? (
          <Banner title="This API needs a token">
            Open <a href="#settings">Settings</a> and paste the value of SELENA_TOKEN. It is kept in this browser only.
          </Banner>
        ) : null}

        {error && !needsToken ? (
          <Banner title="Cannot reach Selena">
            {error} — the last good data is still shown below, so nothing here is newer than{' '}
            {data?.at ? new Date(data.at).toLocaleTimeString() : 'the last successful poll'}.
          </Banner>
        ) : null}

        {data?.openApi ? <Banner tone="warn" title="This API is open">{data.openApi}</Banner> : null}

        {data?.context?.store && !data.context.store.durable ? (
          <Banner tone="warn" title="Storage is not durable">
            {data.context.store.note}
          </Banner>
        ) : null}

        {data?.context?.model && !data.context.model.configured ? (
          <Banner tone="warn" title="No model key">
            {data.context.model.error}
          </Banner>
        ) : null}

        <Page data={data} refresh={refresh} param={route.param} busy={busy} auth={auth} refreshAuth={refreshAuth} />
      </main>
    </div>
  );
}
