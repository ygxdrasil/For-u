/**
 * Connect — the spot where you paste an API or an MCP server.
 *
 * core/sources.js is the fixed policy. This is the other half: the places she
 * cannot reach on her own because they need a key you have, or because they
 * are one of a thousand small forums nobody could enumerate in advance.
 *
 * Three things this page refuses to do:
 *   - call a connection "working" because it returned 200. A test shows the
 *     posts it actually got back, with their links, or says what was missing.
 *   - hide the field map. Where the text and the link live is the entire
 *     difference between a source that works and one that silently reads
 *     nothing, so it is on screen and editable.
 *   - keep an item with no URL. An ask that cannot be cited is not evidence.
 */

import React, { useEffect, useState } from 'react';
import { api, ago } from '../api.js';
import { Pill, Empty, Banner } from '../components.jsx';

/**
 * Ready-made settings for the sources worth having. The point is that you
 * paste a key and press connect, rather than working out a field map from
 * somebody's API docs at eleven at night.
 */
const RECIPES = [
  {
    id: 'discourse',
    label: 'A Discourse forum',
    blurb:
      'Thousands of trade and niche-business forums run Discourse, and every public one answers the same JSON API with no key at all. This is how you reach barbers, letting agents and florists — a hundred small forums, one adapter. Put in the forum address and nothing else.',
    kind: 'rest',
    url: 'https://FORUM-ADDRESS/search.json?q={query}',
    itemsPath: 'topics[]',
    textPath: 'title|excerpt|blurb',
    urlPath: '',
    urlTemplate: 'https://FORUM-ADDRESS/t/{slug}/{id}',
    titlePath: 'title',
    gives: ['asks', 'complaints'],
    warn:
      'Change FORUM-ADDRESS in both boxes to the forum you want. Discourse hands back a slug and an id rather than a link, which is why the link box builds one — verified against a live forum.',
  },
  {
    id: 'appstore',
    label: 'App Store reviews',
    blurb:
      'Public, keyless, about 500 recent reviews an app. One of the only places where paying and complaining sit in the same sentence — someone bought it and is telling you what is wrong with it. Replace the id with the app you care about.',
    kind: 'rest',
    url: 'https://itunes.apple.com/gb/rss/customerreviews/page=1/sortBy=mostRecent/id=APP_ID/json',
    itemsPath: 'feed.entry[]',
    textPath: 'content.label',
    urlPath: 'link.attributes.href',
    titlePath: 'title.label',
    gives: ['paying', 'complaints', 'incumbents'],
  },
  {
    id: 'usaspending',
    label: 'Public contract awards (USAspending)',
    blurb:
      'Itemised, published proof that an organisation is paying for something — the rung of the ladder everything else struggles to reach. No key whatsoever. A repeated tender for the same service is demand with a price on it.',
    kind: 'rest',
    method: 'POST',
    url: 'https://api.usaspending.gov/api/v2/search/spending_by_award/',
    bodyTemplate: JSON.stringify(
      {
        filters: {
          keywords: ['{query}'],
          award_type_codes: ['A', 'B', 'C', 'D'],
          time_period: [{ start_date: '2025-01-01', end_date: '2026-12-31' }],
        },
        fields: ['Award ID', 'Recipient Name', 'Description', 'Award Amount', 'Awarding Agency'],
        limit: 20,
        page: 1,
      },
      null,
      0,
    ),
    itemsPath: 'results[]',
    textPath: 'Description|Recipient Name',
    urlPath: '',
    urlTemplate: 'https://www.usaspending.gov/award/{generated_internal_id}',
    gives: ['paying', 'incumbents'],
  },
  {
    id: 'mcp',
    label: 'An MCP server',
    blurb:
      'Any Model Context Protocol endpoint. She lists its tools, you pick the one that searches, and she calls it from then on. Both the current spec and the older handshake are handled — she works out which the server speaks and remembers.',
    kind: 'mcp',
    url: 'https://mcp.example.com/mcp',
    gives: ['asks', 'complaints'],
  },
  {
    id: 'blank',
    label: 'Something else',
    blurb: 'Any API that answers JSON. Put {query} where the search term goes, then tell her which fields hold the text and the link.',
    kind: 'rest',
    url: 'https://api.example.com/search?q={query}',
    gives: ['asks'],
  },
];

const EMPTY_FORM = {
  kind: 'rest',
  name: '',
  url: '',
  token: '',
  authStyle: 'bearer',
  authName: '',
  tool: '',
  queryArg: 'query',
  method: 'GET',
  bodyTemplate: '',
  itemsPath: '',
  textPath: '',
  urlPath: '',
  urlTemplate: '',
  titlePath: '',
  gives: ['asks'],
};

export default function Connect({ data }) {
  const [state, setState] = useState({ connectors: [], connectorKinds: [], catalogue: [] });
  const [form, setForm] = useState(EMPTY_FORM);
  const [recipe, setRecipe] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [tools, setTools] = useState(null);
  const [results, setResults] = useState({});

  const load = async () => {
    const res = await api.peers();
    if (res.ok) setState(res.data);
    else setError(res.error);
  };

  useEffect(() => {
    load();
  }, [data?.at]);

  const useRecipe = (r) => {
    setRecipe(r);
    setTools(null);
    setForm({
      ...EMPTY_FORM,
      kind: r.kind,
      name: r.id === 'blank' ? '' : r.label,
      url: r.url ?? '',
      method: r.method ?? 'GET',
      bodyTemplate: r.bodyTemplate ?? '',
      itemsPath: r.itemsPath ?? '',
      textPath: r.textPath ?? '',
      urlPath: r.urlPath ?? '',
      urlTemplate: r.urlTemplate ?? '',
      titlePath: r.titlePath ?? '',
      gives: r.gives ?? ['asks'],
    });
  };

  const set = (key) => (ev) => setForm({ ...form, [key]: ev.target.value });

  const listTools = async () => {
    setBusy('tools');
    setError(null);
    const res = await api.peerAction('mcp-tools', { url: form.url.trim(), token: form.token.trim() || null });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    setTools(res.data);
    if (!res.data.ok) setError(res.data.error);
  };

  const add = async (ev) => {
    ev.preventDefault();
    setBusy('add');
    setError(null);
    const res = await api.peerAction('add-source', { ...form, token: form.token.trim() || null });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    setForm(EMPTY_FORM);
    setRecipe(null);
    setTools(null);
    await load();
  };

  const act = async (action, id, extra = {}) => {
    setBusy(id + action);
    const res = await api.peerAction(action, { id, ...extra });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    if (res.data.result) setResults({ ...results, [id]: res.data.result });
    await load();
  };

  const connectors = state.connectors ?? [];

  return (
    <>
      <div className="head">
        <div>
          <h2>Connect a source</h2>
          <p>
            The places she cannot reach on her own — because they need a key you hold, or because they are one of a
            thousand small forums nobody could list in advance. Paste one here and she reads it on every run, through the
            same ledger as everything else: a claim citing a link she did not actually read is still deleted.
          </p>
        </div>
      </div>

      {error ? <Banner title="Problem">{error}</Banner> : null}

      {/* ---- the verified set, one press ---- */}
      {(state.starters ?? []).length ? <StarterSet state={state} onDone={load} busy={busy} setBusy={setBusy} setError={setError} /> : null}

      {/* ---- what is already connected ---- */}
      {connectors.length === 0 ? (
        <Empty>Nothing connected yet. Pick something below.</Empty>
      ) : (
        connectors.map((c) => {
          const result = results[c.id] ?? c.lastResult;
          return (
            <div className="peer" key={c.id}>
              <div className="top">
                <span>
                  <span className="name">{c.name}</span> <Pill>{c.kind === 'mcp' ? 'MCP' : 'API'}</Pill>{' '}
                  {c.hasToken ? <Pill tone="ok">key stored</Pill> : <Pill>no key</Pill>}{' '}
                  {c.enabled === false ? <Pill tone="warn">paused</Pill> : null}{' '}
                  {(c.gives ?? []).map((g) => (
                    <Pill key={g} tone={g === 'paying' ? 'ok' : ''}>
                      {g}
                    </Pill>
                  ))}
                </span>
                <span className="r" style={{ display: 'flex', gap: 6 }}>
                  <button className="small" onClick={() => act('test-source', c.id)} disabled={busy === c.id + 'test-source'}>
                    {busy === c.id + 'test-source' ? 'Reading…' : 'Test'}
                  </button>
                  <button className="small" onClick={() => act('toggle-source', c.id, { enabled: c.enabled === false })}>
                    {c.enabled === false ? 'Resume' : 'Pause'}
                  </button>
                  <button className="small" onClick={() => act('retire-source', c.id)}>
                    Retire
                  </button>
                </span>
              </div>
              <div className="url">{c.url}</div>
              {c.tool ? <div className="small muted">tool: <code className="mono">{c.tool}</code>{c.dialect ? ` · speaks the ${c.dialect === 'stateless' ? 'current' : 'older'} MCP spec` : ''}</div> : null}

              {result ? (
                <>
                  <div className="verdict">
                    <Pill tone={result.ok ? 'ok' : 'warn'}>{result.verdict}</Pill>{' '}
                    {c.lastTestedAt ? <span className="small muted">· {ago(c.lastTestedAt)}</span> : null}
                  </div>
                  <div className="small" style={{ marginTop: 6 }}>{result.detail}</div>
                  {/* The proof: what actually came back, with the links. */}
                  {result.sample?.length ? (
                    <div style={{ marginTop: 8 }}>
                      {result.sample.map((s, i) => (
                        <blockquote className="quote" key={i}>
                          “{s.quote}”
                          <cite>
                            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                              {s.url.slice(0, 70)}
                            </a>
                          </cite>
                        </blockquote>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="verdict small muted">Never tested. Press test — she runs one real search and shows you the posts.</div>
              )}
            </div>
          );
        })
      )}

      <div className="spacer" />

      {/* ---- add one ---- */}
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Add one</h3>
        <div className="recipes">
          {RECIPES.map((r) => (
            <button key={r.id} className={`recipe ${recipe?.id === r.id ? 'on' : ''}`} onClick={() => useRecipe(r)}>
              {r.label}
            </button>
          ))}
        </div>

        {recipe ? (
          <>
            <p className="small" style={{ marginTop: 10 }}>{recipe.blurb}</p>
            {recipe.warn ? <p className="small" style={{ color: 'var(--warn)' }}>{recipe.warn}</p> : null}

            <form onSubmit={add} style={{ marginTop: 6 }}>
              <div className="row">
                <div className="field" style={{ maxWidth: 200 }}>
                  <label>Call it</label>
                  <input type="text" value={form.name} placeholder="Barber forum" onChange={set('name')} />
                </div>
                <div className="field" style={{ flex: 2 }}>
                  <label>{form.kind === 'mcp' ? 'MCP server URL' : 'URL, with {query} where the search term goes'}</label>
                  <input type="text" value={form.url} onChange={set('url')} spellCheck="false" />
                </div>
                <div className="field" style={{ maxWidth: 180 }}>
                  <label>Key, if it needs one</label>
                  <input type="password" value={form.token} placeholder="optional" onChange={set('token')} />
                </div>
              </div>

              {form.kind === 'mcp' ? (
                <>
                  <div className="row">
                    <button type="button" onClick={listTools} disabled={busy === 'tools' || !form.url.trim()}>
                      {busy === 'tools' ? 'Asking…' : 'Ask it what it can do'}
                    </button>
                    {tools?.serverInfo ? <span className="small muted">{tools.serverInfo.name} {tools.serverInfo.version}</span> : null}
                    {tools?.dialect ? <Pill tone="ok">{tools.dialect === 'stateless' ? 'current spec' : 'older handshake'}</Pill> : null}
                  </div>
                  {tools?.tools?.length ? (
                    <div className="row">
                      <div className="field" style={{ flex: 2 }}>
                        <label>Which tool searches?</label>
                        <select value={form.tool} onChange={set('tool')}>
                          <option value="">choose one</option>
                          {tools.tools.map((t) => (
                            <option key={t.name} value={t.name}>
                              {t.name} — {t.description.slice(0, 70)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field" style={{ maxWidth: 200 }}>
                        <label>Which argument is the search term?</label>
                        <select value={form.queryArg} onChange={set('queryArg')}>
                          {(tools.tools.find((t) => t.name === form.tool)?.args ?? ['query']).map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="row">
                  <div className="field">
                    <label>How the key is sent</label>
                    <select value={form.authStyle} onChange={set('authStyle')}>
                      <option value="none">it needs no key</option>
                      <option value="bearer">Authorization: Bearer</option>
                      <option value="header">a custom header</option>
                      <option value="query">a query parameter</option>
                    </select>
                  </div>
                  {form.authStyle === 'header' || form.authStyle === 'query' ? (
                    <div className="field">
                      <label>Called what?</label>
                      <input type="text" value={form.authName} placeholder={form.authStyle === 'header' ? 'x-api-key' : 'api_key'} onChange={set('authName')} />
                    </div>
                  ) : null}
                </div>
              )}

              {/* The field map. On screen because getting it wrong is the
                  difference between a source that works and one that silently
                  reads nothing at all. */}
              <div className="row">
                <div className="field">
                  <label>Where the list is</label>
                  <input type="text" value={form.itemsPath} placeholder="results[]" onChange={set('itemsPath')} spellCheck="false" />
                </div>
                <div className="field">
                  <label>Where the words are</label>
                  <input type="text" value={form.textPath} placeholder="body|text|description" onChange={set('textPath')} spellCheck="false" />
                </div>
                <div className="field">
                  <label>Where the link is</label>
                  <input type="text" value={form.urlPath} placeholder="url|permalink" onChange={set('urlPath')} spellCheck="false" />
                </div>
                <div className="field">
                  <label>…or build one</label>
                  <input type="text" value={form.urlTemplate} placeholder="https://forum/t/{slug}/{id}" onChange={set('urlTemplate')} spellCheck="false" />
                </div>
                <button className="primary" type="submit" disabled={busy === 'add' || !form.url.trim()}>
                  {busy === 'add' ? 'Saving…' : 'Connect'}
                </button>
              </div>

              {/* Most APIs GET. The ones with real search behind them tend to
                  POST a filter body, and USAspending answers 405 to a GET. */}
              {form.kind === 'rest' ? (
                <div className="row">
                  <div className="field" style={{ maxWidth: 120 }}>
                    <label>Method</label>
                    <select value={form.method} onChange={set('method')}>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  {form.method === 'POST' ? (
                    <div className="field" style={{ flex: 3 }}>
                      <label>The body it wants, with {'{query}'} in it</label>
                      <input type="text" value={form.bodyTemplate} placeholder='{"filters":{"keywords":["{query}"]}}' onChange={set('bodyTemplate')} spellCheck="false" />
                    </div>
                  ) : null}
                </div>
              ) : null}

              <p className="small muted" style={{ margin: 0 }}>
                Dots for keys, <code className="mono">[]</code> for a list, <code className="mono">|</code> between alternatives
                — <code className="mono">data.items[].title</code> is the whole language. Anything with words but no link is
                dropped: a quote she cannot cite is not evidence.
              </p>
              <p className="small muted" style={{ marginTop: 4, marginBottom: 0 }}>
                The key is encrypted before it is stored, with the same secret that signs your sign-in.
              </p>
            </form>
          </>
        ) : (
          <p className="small muted" style={{ marginBottom: 0 }}>Pick one above to fill in the settings for you.</p>
        )}
      </div>

      {/* ---- the catalogue ---- */}
      <div className="card">
        <h3>Worth connecting</h3>
        <p className="small muted" style={{ marginTop: -4 }}>
          What the research turned up, with the access position on each. Checked against each platform's own documentation,
          not recalled.
        </p>
        {(state.catalogue ?? []).map((s) => (
          <div className="proposal" key={s.id}>
            <div className="topic">
              {s.name}{' '}
              <Pill tone={s.access === 'official-api' ? 'ok' : 'warn'}>{s.access === 'official-api' ? 'reachable' : 'gated'}</Pill>{' '}
              {(s.gives ?? []).map((g) => (
                <Pill key={g} tone={g === 'paying' ? 'ok' : ''}>
                  {g}
                </Pill>
              ))}
            </div>
            <div className="why">{s.note}</div>
            {s.endpoints?.length ? (
              <pre style={{ marginTop: 8 }}>{s.endpoints.join('\n')}</pre>
            ) : null}
            {s.docs ? (
              <div className="small" style={{ marginTop: 6 }}>
                <a href={s.docs} target="_blank" rel="noopener noreferrer">
                  documentation
                </a>{' '}
                <span className="muted">· checked {s.checkedOn}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * The verified set.
 *
 * Every one of these was probed against the live API — URL, field map and link
 * template — and the counts shown are what actually came back on the day. The
 * point is to remove the step where you fill in six forms from somebody's API
 * docs and get one path wrong, which produces a source that answers 200 and
 * reads nothing.
 *
 * The two groups are doing different jobs and are labelled as such: forums are
 * people saying what they need, reviews are people who have ALREADY PAID
 * saying what is wrong with what they bought. Only the second kind can carry a
 * finding past level 3 on its own.
 */
function StarterSet({ state, onDone, busy, setBusy, setError }) {
  const [picked, setPicked] = useState(null);
  const [result, setResult] = useState(null);

  const starters = state.starters ?? [];
  const already = new Set((state.connectors ?? []).map((c) => c.starterId).filter(Boolean));
  const chosen = picked ?? new Set(state.defaultSet ?? []);

  const toggle = (id) => {
    const next = new Set(chosen);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  const connect = async () => {
    setBusy('starters');
    setError(null);
    const res = await api.peerAction('add-starters', { ids: [...chosen].filter((id) => !already.has(id)) });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    setResult(res.data);
    await onDone();
  };

  const toAdd = [...chosen].filter((id) => !already.has(id)).length;
  const group = (g) => starters.filter((s) => s.group === g);

  return (
    <div className="card accent" style={{ marginBottom: 14 }}>
      <h3>Ready to connect</h3>
      <p className="small" style={{ marginTop: -4 }}>
        Each of these was checked against the live API — the URL, which fields hold the words, and how to build the link.
        The numbers are what actually came back when it was checked, on {state.startersCheckedOn}. Nothing here needs a key.
      </p>

      {['forum', 'reviews'].map((g) => (
        <div key={g} style={{ marginTop: 10 }}>
          <div className="detail" style={{ marginBottom: 6 }}>
            {g === 'forum'
              ? 'FORUMS — people saying what they need. Asks and complaints; never proof anyone is paying.'
              : 'REVIEWS — people who have already paid, saying what is wrong with it. The rare source that can reach level 4 on its own.'}
          </div>
          {group(g).map((s) => {
            const on = chosen.has(s.id);
            const have = already.has(s.id);
            return (
              <label key={s.id} className={`starter ${on ? 'on' : ''} ${have ? 'have' : ''}`}>
                <input type="checkbox" checked={have || on} disabled={have} onChange={() => toggle(s.id)} />
                <span>
                  <span className="n">
                    {s.name} {have ? <Pill tone="ok">connected</Pill> : null}{' '}
                    {(s.gives ?? []).map((x) => (
                      <Pill key={x} tone={x === 'paying' ? 'ok' : ''}>
                        {x}
                      </Pill>
                    ))}
                  </span>
                  <span className="w">{s.why}</span>
                  <span className="v">
                    checked: {s.verified}
                    {s.searchable === false ? ' · reads the latest reviews every run rather than searching for your topic' : ''}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      ))}

      <div className="row" style={{ marginTop: 12, alignItems: 'center' }}>
        <button className="primary" onClick={connect} disabled={busy === 'starters' || toAdd === 0}>
          {busy === 'starters' ? 'Connecting…' : toAdd ? `Connect ${toAdd} source${toAdd === 1 ? '' : 's'}` : 'All connected'}
        </button>
        <span className="small muted">Nothing is read until you press test, or until her next run.</span>
      </div>

      {result ? (
        <p className="small" style={{ marginBottom: 0, marginTop: 8 }}>
          {result.note}
          {result.skipped?.length ? ` Skipped: ${result.skipped.map((s) => `${s.name ?? s.id} (${s.why})`).join(', ')}.` : ''}
        </p>
      ) : null}
    </div>
  );
}
