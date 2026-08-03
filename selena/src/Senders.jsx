/**
 * Who she may send as.
 *
 * Kept apart from the read keys on purpose. An Etsy key buys reach: the worst
 * it can do is cost money or stop working. One of these speaks to a stranger,
 * under your name, and cannot be taken back — so it is its own block, with the
 * consequence written next to the box rather than in a README nobody opens.
 *
 * Every credential here is one YOU issued and can revoke at the source in one
 * click. Nothing asks for a password and nothing logs in as you. Hacker News is
 * absent for exactly that reason and says so, rather than being quietly missing.
 */

import React, { useEffect, useState } from 'react';
import { api } from './api.js';
import { Pill, Banner } from './components.jsx';

const FIELDS = {
  email: [
    { name: 'token', label: 'Resend API key', placeholder: 're_…', why: 'Hers, not a login to your inbox.' },
    { name: 'fromEmail', label: 'From address', placeholder: 'you@yourdomain.com', why: 'On a domain you have verified, or it lands in spam and you will think nobody cared.' },
    { name: 'fromName', label: 'From name', placeholder: 'Your name', why: 'Goes in the footer with the line telling them how to make it stop.' },
  ],
  discourse: [
    { name: 'host', label: 'Forum', placeholder: 'community.n8n.io', why: 'One key per forum — they do not share accounts.' },
    { name: 'username', label: 'Your username there', placeholder: 'yourname', why: 'Posts appear under this name.' },
    { name: 'token', label: 'User API Key', placeholder: '', why: 'Preferences → Security → API Keys on that forum. Revocable there, instantly.' },
  ],
  lemmy: [
    { name: 'host', label: 'Instance', placeholder: 'lemmy.world', why: 'Community rules still apply, and several ban solicitation outright.' },
    { name: 'token', label: 'JWT', placeholder: '', why: 'From the login API for your own account.' },
  ],
};

export default function Senders() {
  const [senders, setSenders] = useState([]);
  const [channel, setChannel] = useState('email');
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    const res = await api.senders();
    if (res.ok) setSenders(res.data.senders ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="card">
      <h3>Who she may send as</h3>
      <p className="muted small">
        Only for the channels with a real write API, and only with a credential you issued and can revoke. She stops
        after five messages per finding and never sends anything on a schedule — sending is always something you press.
      </p>

      {senders.length ? (
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>As</th>
              <th>Where</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {senders.map((s) => (
              <tr key={s.id}>
                <td>{s.channel}</td>
                <td>{s.username ?? s.fromEmail ?? '—'}</td>
                <td className="muted small">{s.host ?? 'email'}</td>
                <td>
                  <button
                    className="small"
                    onClick={async () => {
                      await api.senderAction('remove', { id: s.id });
                      load();
                    }}
                  >
                    remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="muted small">Nothing added, so she cannot send anything. Drafts still work everywhere.</p>
      )}

      {error ? <Banner tone="warn" title="Not added">{error}</Banner> : null}

      <div className="sender-add">
        <div className="row" style={{ gap: 6 }}>
          {Object.keys(FIELDS).map((c) => (
            <button key={c} className={`small ${channel === c ? 'primary' : ''}`} onClick={() => { setChannel(c); setForm({}); setError(null); }}>
              {c}
            </button>
          ))}
        </div>

        {FIELDS[channel].map((f) => (
          <label key={f.name} className="field">
            <span>{f.label}</span>
            <input
              type={f.name === 'token' ? 'password' : 'text'}
              placeholder={f.placeholder}
              value={form[f.name] ?? ''}
              onChange={(ev) => setForm({ ...form, [f.name]: ev.target.value })}
              aria-label={f.label}
              spellCheck="false"
            />
            <span className="muted small">{f.why}</span>
          </label>
        ))}

        <button
          className="primary small"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            const res = await api.senderAction('add', { sender: { channel, ...form } });
            setBusy(false);
            if (!res.ok) return setError(res.error);
            setForm({});
            load();
          }}
        >
          {busy ? 'Adding…' : 'Add'}
        </button>
      </div>

      {/* Said out loud rather than left as an absence. Someone will look for
          Hacker News here, and "it is missing" and "it is refused, for this
          reason" are very different things to find. */}
      <p className="muted small">
        <Pill tone="warn">not offered</Pill> Hacker News has no write API at all, so posting there would mean driving
        the website with your session cookie — logging in as you. That is refused. Stack Exchange has one, but comments
        there are for improving the question and a research request gets flagged and deleted, so she will not post it
        for you either. Both still get a draft and a copy button.
      </p>
    </div>
  );
}
