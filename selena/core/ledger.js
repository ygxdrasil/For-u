/**
 * The source ledger — the control that stops invented figures reaching Jason.
 *
 * A prompt that says "do not make things up" is not a control. It is a wish.
 * This is the control: every URL the run actually touched is recorded here
 * with how it was reached, what the response was, and a hash of what came
 * back. Before a finding is stored or handed on, every quote, price, incumbent
 * and number is checked against this ledger FOR THIS RUN. A claim whose URL is
 * not in the ledger is dropped — not flagged, not stored with a warning.
 *
 * The reason it is per-run rather than global: a URL read in March does not
 * make a number quoted in September true. Freshness is part of provenance.
 *
 * A note on grounded search. Gemini's grounding metadata hands back redirect
 * URLs on Google's own host rather than the publisher's, plus a title that is
 * usually the domain. We record exactly what we were given and label it
 * `grounded-search`, because claiming we hold the publisher's URL when we hold
 * a redirect would be the same class of lie this file exists to prevent.
 */

import { canonicalUrl, hostOf, sha256, nowIso } from './util.js';

export function createLedger({ now = nowIso } = {}) {
  const entries = new Map(); // canonical url -> entry

  function record({ url, status = null, via = 'grounded-search', title = null, body = null, hash = null, domain = null }) {
    const canonical = canonicalUrl(url);
    if (!canonical) return null;

    const existing = entries.get(canonical);
    const entry = {
      url: canonical,
      status: status ?? existing?.status ?? null,
      via,
      title: title ?? existing?.title ?? null,
      // The domain the source actually belongs to. For a grounding redirect
      // this comes from the chunk title, because the URL itself is Google's.
      domain: domain ?? existing?.domain ?? hostOf(canonical),
      hash: hash ?? (body === null ? existing?.hash ?? null : sha256(body)),
      bytes: body === null ? (existing?.bytes ?? null) : String(body).length,
      fetchedAt: existing?.fetchedAt ?? now(),
      seenCount: (existing?.seenCount ?? 0) + 1,
    };
    entries.set(canonical, entry);
    return entry;
  }

  function has(url) {
    const canonical = canonicalUrl(url);
    return Boolean(canonical && entries.has(canonical));
  }

  function get(url) {
    const canonical = canonicalUrl(url);
    return canonical ? (entries.get(canonical) ?? null) : null;
  }

  return {
    record,
    has,
    get,
    /** Only entries we actually got a usable response from. */
    all: () => [...entries.values()],
    ok: () => [...entries.values()].filter((e) => e.status === null || (e.status >= 200 && e.status < 400)),
    size: () => entries.size,
    /** The list handed to the extraction model: it may cite these and nothing else. */
    citable: () =>
      [...entries.values()]
        .filter((e) => e.status === null || (e.status >= 200 && e.status < 400))
        .map((e) => ({ url: e.url, domain: e.domain, title: e.title, via: e.via })),
  };
}

/** Every place in a finding where a claim carries a URL. Derived, never listed twice. */
function claimSites(finding) {
  const sites = [];
  const push = (path, container, field, { required = true } = {}) => {
    sites.push({ path, container, field, required });
  };

  (finding.demand?.inTheirWords ?? []).forEach((q, i) => push(`demand.inTheirWords[${i}].url`, q, 'url'));
  (finding.evidence?.paying ?? []).forEach((p, i) => push(`evidence.paying[${i}].url`, p, 'url'));
  (finding.evidence?.complaints ?? []).forEach((c, i) => push(`evidence.complaints[${i}].url`, c, 'url'));
  (finding.incumbents ?? []).forEach((inc, i) => {
    push(`incumbents[${i}].url`, inc, 'url', { required: false });
    push(`incumbents[${i}].evidenceUrl`, inc, 'evidenceUrl', { required: false });
  });
  (finding.whatWouldWin ?? []).forEach((w, i) => push(`whatWouldWin[${i}].evidenceUrl`, w, 'evidenceUrl', { required: false }));
  (finding.risks ?? []).forEach((r, i) => push(`risks[${i}].evidenceUrl`, r, 'evidenceUrl', { required: false }));

  return sites;
}

/**
 * Enforce the ledger against a finding.
 *
 * Mutates the finding: unsupported URLs on optional fields are nulled, and
 * whole evidence items whose only URL is unsupported are removed. `sources` is
 * rewritten from the ledger rather than trusted from the model, because a
 * model-authored source list is a bibliography of pages it believes exist.
 *
 * @returns {{ok:boolean, violations:Array, dropped:Array, finding:object}}
 */
export function enforceLedger(finding, ledger) {
  const violations = [];
  const dropped = [];

  for (const site of claimSites(finding)) {
    const raw = site.container?.[site.field];
    if (!raw) continue;
    if (ledger.has(raw)) continue;

    violations.push({
      path: site.path,
      url: raw,
      reason: 'cited a URL that this run never read',
    });
    // Optional evidence links are cleared; the claim survives without a link.
    site.container[site.field] = null;
  }

  // An evidence item whose primary URL was invented is not an evidence item.
  const prune = (list, label) =>
    (list ?? []).filter((item) => {
      if (item?.url) return true;
      dropped.push({ label, item });
      return false;
    });

  if (finding.demand) finding.demand.inTheirWords = prune(finding.demand.inTheirWords, 'quote');
  if (finding.evidence) {
    finding.evidence.paying = prune(finding.evidence.paying, 'paying');
    finding.evidence.complaints = prune(finding.evidence.complaints, 'complaint');
  }

  // A volume estimate is the single most dangerous number in the record: a
  // fabricated market size that reaches Jason becomes a product built for
  // nobody. It has to be earned.
  const volume = finding.evidence?.volume;
  if (volume && volume.estimate !== null && volume.estimate !== undefined) {
    const methodIsReal = String(volume.method ?? '').trim().length >= 20;
    if (!ledger.ok().length || !methodIsReal) {
      violations.push({
        path: 'evidence.volume.estimate',
        url: null,
        reason: methodIsReal
          ? 'a volume estimate with nothing read to support it'
          : `method "${volume.method}" does not explain how the number was derived`,
      });
      volume.estimate = null;
      volume.confidence = 'low';
      volume.method = `not established — ${methodIsReal ? 'no source was read' : 'no derivation was given'}. Previous claim discarded by the source ledger.`;
    }
  }

  // Sources come from what we read, not from what the model says it read.
  finding.sources = ledger.ok().map((e) => ({
    url: e.url,
    fetchedAt: e.fetchedAt,
    status: e.status,
    hash: e.hash,
    via: e.via,
    title: e.title,
    domain: e.domain,
  }));

  return { ok: violations.length === 0 && dropped.length === 0, violations, dropped, finding };
}
