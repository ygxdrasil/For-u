/**
 * For Jason — the handoff queue.
 *
 * Split in three on purpose: what he can build, what is only partly his, and
 * what is not his at all. The third list is not hidden, because knowing what
 * was found and rejected is worth something — and because a classifier you
 * cannot see is a classifier you cannot correct.
 *
 * Nothing here fires automatically. You press the button.
 */

import React, { useEffect, useState } from 'react';
import { api, money, ago } from '../api.js';
import { Pill, StrengthBar, BuildPill, Empty, Banner } from '../components.jsx';

function Group({ title, note, rows, onSelect, selected }) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <h3>
        {title} ({rows.length})
      </h3>
      {note ? (
        <p className="small muted" style={{ marginTop: -4 }}>
          {note}
        </p>
      ) : null}
      {rows.length ? (
        <div className="list">
          {rows.map((f) => (
            <div className={`item rowbtn ${selected === f.id ? 'on' : ''}`} key={f.id} onClick={() => onSelect(f.id)}>
              <span>
                <span className="t">{f.oneLine}</span>
                <span className="s">
                  {f.whoHasIt} · verified {ago(f.lastVerifiedAt)}
                </span>
              </span>
              <span className="r">
                {f.handedToJasonAt ? <Pill tone="ok">sent {ago(f.handedToJasonAt)}</Pill> : null}
                <BuildPill verdict={f.buildable} />
                <StrengthBar level={f.strength} />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <Empty>Nothing here.</Empty>
      )}
    </div>
  );
}

export default function Jason({ data, refresh, param }) {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(param ?? null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.findings({ status: 'active', limit: 200 }).then((res) => {
      if (res.ok) setRows(res.data.findings);
      else setError(res.error);
    });
  }, [data?.at]);

  useEffect(() => {
    if (!selected) return setPreview(null);
    api.handoffPreview(selected).then((res) => {
      if (res.ok) setPreview(res.data);
      else setError(res.error);
    });
  }, [selected]);

  const send = async (force = false) => {
    setBusy(true);
    setResult(null);
    const res = await api.handoff({ id: selected, note: note.trim() || null, force });
    setBusy(false);
    setResult(res.ok ? res.data : { error: res.error, data: res.data });
    refresh?.();
  };

  const can = rows.filter((f) => f.buildable === 'jason-can-build');
  const partly = rows.filter((f) => f.buildable === 'partly');
  const cannot = rows.filter((f) => f.buildable === 'jason-cannot-build');
  const unclear = rows.filter((f) => !f.buildable || f.buildable === 'unclear');

  return (
    <>
      <div className="head">
        <div>
          <h2>For Jason</h2>
          <p>
            Selena finds and understands; Jason builds. Nothing is sent automatically — you choose what gets built. The
            packet carries the evidence and the risks together, so he sees why and why-not at the same moment.
          </p>
        </div>
      </div>

      {error ? <Banner title="Problem">{error}</Banner> : null}

      {!data?.context ? null : (
        <Banner tone="info" title="Delivery">
          {preview?.endpointConfigured
            ? 'JASON_ENDPOINT is configured, so pressing send POSTs the packet to him and reports what he actually said back.'
            : 'No JASON_ENDPOINT is set, so a packet is prepared and recorded but not sent anywhere. Set it when Jason is ready to receive.'}
        </Banner>
      )}

      <div className="grid g21">
        <div>
          <Group
            title="Jason can build these"
            rows={can}
            onSelect={setSelected}
            selected={selected}
            note="Rules matched a capability and found no blocker."
          />
          <Group
            title="Partly his"
            rows={partly}
            onSelect={setSelected}
            selected={selected}
            note="A buildable slice sits inside something that also needs a person, a licence or a physical object."
          />
          <Group
            title="Unclear"
            rows={unclear}
            onSelect={setSelected}
            selected={selected}
            note="Nothing matched either way — these need reading before they go anywhere."
          />
          <Group
            title="Not for Jason"
            rows={cannot}
            onSelect={setSelected}
            selected={selected}
            note="Kept visible on purpose. A rejected finding is still evidence, and a classifier you cannot see is one you cannot correct."
          />
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <h3>Handoff</h3>
            {!selected ? (
              <Empty>Pick a finding on the left.</Empty>
            ) : !preview ? (
              <Empty>Loading…</Empty>
            ) : (
              <>
                <p style={{ fontWeight: 600, fontSize: 13.5, marginTop: 0 }}>{preview.packet.build.what}</p>
                <p className="small muted">{preview.packet.build.forWhom}</p>

                {preview.packet.build.shapeLabel ? (
                  <p className="small">
                    <strong>Shape:</strong> {preview.packet.build.shapeLabel}
                  </p>
                ) : null}

                {preview.packet.build.mustDo?.length ? (
                  <>
                    <p className="small" style={{ marginBottom: 2 }}>
                      <strong>Must do:</strong>
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                      {preview.packet.build.mustDo.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {preview.packet.build.priceAnchors?.length ? (
                  <p className="small" style={{ marginTop: 8 }}>
                    <strong>They pay today:</strong>{' '}
                    {preview.packet.build.priceAnchors.map((p) => `${p.price} ${p.currency}`).join(', ')}
                  </p>
                ) : null}

                {preview.packet.why.complaintsAgreeOn ? (
                  <p className="small">
                    <strong>They agree the problem is:</strong> {preview.packet.why.complaintsAgreeOn}
                  </p>
                ) : null}

                <div style={{ marginTop: 10 }}>
                  <Pill tone="red">
                    {preview.packet.risks.length} risk{preview.packet.risks.length === 1 ? '' : 's'} travel with it
                  </Pill>
                </div>

                {preview.wouldRefuse ? (
                  <Banner tone="warn" title="She would refuse this one">
                    Classified as something Jason cannot build. You can override it, but the reason is worth reading first:{' '}
                    {preview.packet.buildability?.reasoning}
                  </Banner>
                ) : null}

                <div className="field" style={{ marginTop: 10 }}>
                  <label>Note for Jason (optional)</label>
                  <textarea rows={2} value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="e.g. start with the Xero connector only" />
                </div>

                <button className="primary" onClick={() => send(preview.wouldRefuse)} disabled={busy} style={{ width: '100%' }}>
                  {busy ? 'Sending…' : preview.wouldRefuse ? 'Send anyway (override)' : 'Send to Jason'}
                </button>

                {result?.error ? (
                  <Banner title="Not sent">
                    {result.error}
                    {result.data?.hint ? <div className="small">{result.data.hint}</div> : null}
                  </Banner>
                ) : null}
                {result && !result.error ? (
                  <Banner tone={result.delivery?.attempted && !result.delivery?.ok ? 'warn' : ''} title="Handed over">
                    {result.delivery?.attempted
                      ? result.delivery.ok
                        ? `Jason's endpoint returned ${result.delivery.status}. What he said: ${String(result.delivery.detail).slice(0, 200)}`
                        : `Marked as handed, but delivery failed: ${result.delivery.detail}`
                      : result.delivery?.detail}
                  </Banner>
                ) : null}

                <details className="raw">
                  <summary>The exact packet</summary>
                  <pre>{JSON.stringify(preview.packet, null, 2)}</pre>
                </details>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
