/**
 * The sign-in screen — and, on a fresh deployment, the set-a-password screen.
 *
 * Once. That is the whole design goal. Signing in sets an HttpOnly cookie that
 * lasts six months, so the browser proves who you are on every request without
 * you pasting anything ever again, and without the credential being readable
 * by any script on the page.
 */

import React, { useState } from 'react';
import { api } from '../api.js';
import { Banner } from '../components.jsx';

export default function Gate({ status, onSignedIn }) {
  const setup = !status?.hasPassword;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (ev) => {
    ev.preventDefault();
    setError(null);

    if (setup && password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }

    setBusy(true);
    const res = setup
      ? await api.authSetup({ password, token: token.trim() || null })
      : await api.authLogin({ password });
    setBusy(false);

    if (res.ok) {
      setPassword('');
      setConfirm('');
      onSignedIn();
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="brand" style={{ border: 'none', padding: '0 0 18px' }}>
          <h1>
            <span className="mark" />
            Selena
          </h1>
          <p>Finds demand that is real, paid for, and badly served.</p>
        </div>

        <div className="card">
          <h3>{setup ? 'Set a password' : 'Sign in'}</h3>

          {setup ? (
            <p className="small muted" style={{ marginTop: -4 }}>
              Nobody has claimed this deployment yet. Pick a password and it is yours — the API stops answering strangers
              the moment you do, with no redeploy needed.
            </p>
          ) : (
            <p className="small muted" style={{ marginTop: -4 }}>
              You stay signed in for {status?.sessionDays ?? 180} days on this browser.
            </p>
          )}

          {setup && !status?.setupProtectedByToken ? (
            <Banner tone="warn" title="Anyone could claim this first">
              SELENA_TOKEN is not set on the server, so this form is open to whoever reaches it first. Set the password now,
              before you share the URL anywhere.
            </Banner>
          ) : null}

          {setup && !status?.durable ? (
            <Banner tone="warn" title="This password will be forgotten">
              Storage is not durable, so the password disappears when the server sleeps. {status?.storeNote} Set DATABASE_URL
              first if you want it to stick.
            </Banner>
          ) : null}

          <form onSubmit={submit}>
            {setup && status?.setupProtectedByToken ? (
              <div className="field">
                <label>SELENA_TOKEN (from your Vercel environment variables)</label>
                <input type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" />
                <p className="small muted" style={{ marginTop: 4 }}>
                  Required once, to prove the deployment is yours. You will not need it again.
                </p>
              </div>
            ) : null}

            <div className="field">
              <label>{setup ? `Password (at least ${status?.minPasswordLength ?? 8} characters)` : 'Password'}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={setup ? 'new-password' : 'current-password'}
                autoFocus
              />
            </div>

            {setup ? (
              <div className="field">
                <label>Again, to be sure</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
              </div>
            ) : null}

            {error ? <Banner title={setup ? 'Could not set it' : 'Not signed in'}>{error}</Banner> : null}

            <button className="primary" type="submit" disabled={busy || !password} style={{ width: '100%', marginTop: 4 }}>
              {busy ? 'Just a moment…' : setup ? 'Set password and continue' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="small muted" style={{ textAlign: 'center', marginTop: 14 }}>
          The password is never stored, only a slow one-way hash of it. Jason keeps using his token; this is just for you.
        </p>
      </div>
    </div>
  );
}
