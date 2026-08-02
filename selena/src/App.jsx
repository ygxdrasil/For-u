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

import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Findings from './pages/Findings.jsx';
import Watches from './pages/Watches.jsx';
import Ask from './pages/Ask.jsx';
import Jason from './pages/Jason.jsx';
import Sources from './pages/Sources.jsx';
import Costs from './pages/Costs.jsx';
import Settings from './pages/Settings.jsx';
import Connections from './pages/Connections.jsx';
import Connect from './pages/Connect.jsx';
import AutonomyRail from './AutonomyRail.jsx';
import { Icon } from './icons.jsx';

const PAGES = [
  { id: 'home', label: 'Home', icon: 'home', component: Home, bare: true },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', component: Dashboard },
  { id: 'findings', label: 'Findings', icon: 'findings', component: Findings, count: (d) => d?.headline?.activeFindings },
  { id: 'watches', label: 'Watches', icon: 'watches', component: Watches, count: (d) => d?.headline?.watchesActive },
  { id: 'jason', label: 'For Jason', icon: 'jason', component: Jason, count: (d) => d?.headline?.buildable },
  { id: 'ask', label: 'Ask', icon: 'ask', component: Ask },
  { id: 'costs', label: 'Costs', icon: 'costs', component: Costs },
  { id: 'sources', label: 'Sources', icon: 'sources', component: Sources },
  { id: 'connect', label: 'Connect', icon: 'plug', component: Connect },
  { id: 'connections', label: 'Connections', icon: 'connections', component: Connections },
  { id: 'settings', label: 'Settings', icon: 'settings', component: Settings },
];

/** Collapsed or not, remembered per browser. */
const RAIL_KEY = 'selena.rail';

/** Poll cadence. Slow enough to be free, fast enough to feel live. */
const POLL_MS = 12_000;

function useHashRoute() {
  const read = () => {
    const raw = (window.location.hash || '#home').slice(1);
    const [id, param] = raw.split('/');
    return { id: PAGES.some((p) => p.id === id) ? id : 'home', param: param ? decodeURIComponent(param) : null };
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
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(RAIL_KEY) === 'collapsed';
    } catch {
      return false;
    }
  });
  const toggleRail = useCallback(() => {
    setCollapsed((was) => {
      const next = !was;
      try {
        localStorage.setItem(RAIL_KEY, next ? 'collapsed' : 'open');
      } catch {
        // Locked-down storage must not stop the sidebar working, only stop it
        // being remembered.
      }
      return next;
    });
  }, []);

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

  const current = useMemo(() => PAGES.find((p) => p.id === route.id) ?? PAGES[0], [route.id]);
  const Page = current.component;

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

  // The home screen is the atmosphere: no sidebar, no banners, nothing but
  // her and the command bar. Everything else is an instrument and keeps the
  // chrome.
  if (current.bare) return <Page data={data} refresh={refresh} param={route.param} busy={busy} auth={auth} refreshAuth={refreshAuth} />;

  return (
    <div className="shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
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
              <a key={p.id} href={`#${p.id}`} className={route.id === p.id ? 'on' : ''} title={collapsed ? p.label : undefined}>
                <span>
                  <span className="ico">
                    <Icon name={p.icon} />
                  </span>
                  <span className="label">{p.label}</span>
                </span>
                {Number.isFinite(count) && count > 0 ? <span className="count">{count}</span> : null}
              </a>
            );
          })}

          <button className="railtoggle" onClick={toggleRail} title={collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'}>
            <Icon name={collapsed ? 'expand' : 'collapse'} />
            {collapsed ? null : <span>collapse</span>}
          </button>
        </nav>

        <AutonomyRail data={data} collapsed={collapsed} refresh={refresh} />

        <div className="sidefoot">
          <LiveDot busy={busy} at={collapsed ? null : data?.at} />
          <div className="detail" style={{ marginTop: 6 }}>
            build <code>{data?.build?.buildId ?? '—'}</code>
          </div>
          <div className="detail muted" style={{ marginTop: 4 }}>
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

        {/* Armed but with nowhere to send anything is the combination that
            wastes a week: she finds a level 5, marks it handed, and it goes
            nowhere. Only shown when she is actually armed — before that,
            handing over is something you do by hand and by choice. */}
        {data?.autonomy?.armed && data?.jason && !data.jason.connected ? (
          <Banner tone="warn" title="She is armed, but Jason is not connected">
            Findings that reach level {data.autonomy.handoffFloor} will be packaged, recorded and sent nowhere. Set
            JASON_ENDPOINT, or add him as a builder on <a href="#connections">Connections</a>.
          </Banner>
        ) : null}

        {data?.jason?.tokenUnreadable ? (
          <Banner tone="warn" title="Jason's token cannot be read">
            SESSION_SECRET has changed since it was saved, so handoffs will go out unauthenticated and probably be refused.
            Add the token again on <a href="#connections">Connections</a>.
          </Banner>
        ) : null}

        <Page data={data} refresh={refresh} param={route.param} busy={busy} auth={auth} refreshAuth={refreshAuth} />
      </main>
    </div>
  );
}
