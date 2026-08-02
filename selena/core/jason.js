/**
 * The handoff to Jason.
 *
 * Deliberate, never automatic. You choose what gets built; Selena does not
 * decide for you and does not fire anything off on a schedule. This module
 * only packages a finding into the shape Jason's endpoint accepts and records
 * that it was handed over.
 *
 * Nothing here contacts anyone. There is no email, no message, no post. If a
 * JASON_ENDPOINT is configured the packet is POSTed to it — that is Jason's
 * own API, called with your token, which is the one outbound call in the
 * system and it only happens when you press the button.
 */

import { nowIso } from './util.js';
import { assertFetchAllowed } from './sources.js';

/**
 * Where does Jason actually live?
 *
 * There were two answers and only one of them worked, which is the worst
 * number of answers to have. JASON_ENDPOINT in the environment fed every
 * handoff; a builder connected on the Connections page fed nothing but the
 * "say hello" button. Connecting him the obvious way — through the page built
 * for connecting him — left findings going nowhere, and the only sign was a
 * line saying the packet had been "prepared and recorded".
 *
 * Now: the environment wins when it is set, because an explicit deploy-time
 * setting should beat something clicked in a UI. Otherwise the first live
 * builder peer is used. `via` says which, so the HUD can show you which line
 * a finding actually went down.
 */
export async function resolveJasonTarget({ env = process.env, store = null, secret = null, withToken = true } = {}) {
  if (env?.JASON_ENDPOINT) {
    return {
      endpoint: env.JASON_ENDPOINT,
      token: withToken ? env.JASON_TOKEN ?? null : null,
      hasToken: Boolean(env.JASON_TOKEN),
      via: 'environment',
      name: 'JASON_ENDPOINT',
    };
  }
  if (!store || !secret) return { endpoint: null, token: null, via: null, name: null };

  try {
    const { listPeers, PEER_KINDS } = await import('./peers.js');
    const { decryptToken } = await import('./peers.js');
    const peers = await listPeers(store);
    const builder = peers.find((p) => p.kind === 'builder');
    if (!builder) return { endpoint: null, token: null, via: null, name: null };

    // listPeers never carries tokens to the browser, so the sealed one is read
    // back off the record here. Callers that only want to know WHETHER he is
    // connected pass withToken: false and skip the decryption entirely.
    const stored = ((await store.getKv('peers')) ?? []).find((p) => p.id === builder.id);
    const token = withToken && stored?.token ? decryptToken(stored.token, secret) : null;
    // Whether a token EXISTS is answerable without decrypting it, and is what
    // the status callers actually want. Whether it can be READ is only known
    // when we tried, so it is reported as unknown rather than as fine.
    const hasToken = Boolean(stored?.token);

    // A peer URL is a base; the handoff goes to the same path the probe uses,
    // so "it answered when I pressed test" and "the finding arrived" are the
    // same line rather than two hopefully-identical ones.
    const path = PEER_KINDS.builder.defaultPath;
    const endpoint = builder.url.replace(/\/+$/, '').endsWith(path) ? builder.url : `${builder.url.replace(/\/+$/, '')}${path}`;
    return {
      endpoint,
      token,
      hasToken,
      via: 'connections',
      name: builder.name,
      tokenUnreadable: withToken && hasToken && !token,
    };
  } catch {
    // Never let a lookup failure become a failed handoff: fall back to "not
    // configured", which is already handled honestly everywhere.
    return { endpoint: null, token: null, via: null, name: null };
  }
}

export class NotBuildableError extends Error {
  constructor(finding) {
    super(
      `"${finding.demand.oneLine}" is classified ${finding.buildability?.verdict}: ${finding.buildability?.reasoning} Handing Jason something he cannot build costs him the time to work out why and teaches him to distrust the queue. Override deliberately if you disagree.`,
    );
    this.name = 'NotBuildableError';
  }
}

/**
 * Everything Jason needs to start, and nothing he does not.
 *
 * The evidence travels with it on purpose: he should be able to see WHY this
 * is worth building without asking, and he should be able to see the risks
 * before he has written anything.
 */
/**
 * The same packet, said out loud.
 *
 * Agent endpoints overwhelmingly take { "text": "…" } — Jason's own probe
 * contract does, and so does every other one in this repo. A packet with no
 * `text` field posted at one of those gets a 400 telling you to send text,
 * which is a working connection failing on a technicality.
 *
 * So the packet now carries both: `text` for anything that reads a sentence,
 * and the structured fields beside it for anything built to use them. Neither
 * is a summary of the other — the sentence names the same numbers.
 */
export function briefFor(finding) {
  const price = finding.evidence?.paying?.find((p) => p.price);
  const incumbent = finding.incumbents?.[0];
  const lines = [
    `Build this: ${finding.demand.oneLine}`,
    `Who has it: ${finding.demand.whoHasIt}`,
    `Evidence: level ${finding.evidence?.strength ?? '?'} of 5${finding.evidence?.hypothesis ? ' (still a hypothesis)' : ''}.`,
  ];
  if (price) lines.push(`They already pay: ${price.price} ${price.currency ?? ''} for ${price.what} — ${price.url}`);
  if (incumbent) lines.push(`Competing with: ${incumbent.name}${incumbent.price ? ` at ${incumbent.price} ${incumbent.currency ?? ''}` : ''} — what it gets wrong: ${incumbent.whatTheyGetWrong}`);
  if (finding.evidence?.agreement?.subject) lines.push(`The complaints agree on: ${finding.evidence.agreement.subject}`);
  if (finding.whatWouldWin?.length) lines.push(`It has to: ${finding.whatWouldWin.map((w) => w.requirement).join('; ')}`);
  if (finding.buildability?.shapeLabel) lines.push(`Shape: ${finding.buildability.shapeLabel}`);
  // Never trimmed away. The reasons not to build it travel with the reasons to.
  if (finding.risks?.length) lines.push(`What would make this a bad idea: ${finding.risks.map((r) => r.risk ?? r).join('; ')}`);
  lines.push(`Full evidence packet is in this same message. Finding id ${finding.id}.`);
  return lines.join('\n');
}

export function packageForJason(finding, { note = null, now = nowIso } = {}) {
  return {
    handoffVersion: 1,
    handedAt: now(),
    findingId: finding.id,
    note,

    // First, so an endpoint that only reads `text` gets the whole brief.
    text: briefFor(finding),

    build: {
      what: finding.demand.oneLine,
      forWhom: finding.demand.whoHasIt,
      shape: finding.buildability?.shape ?? null,
      shapeLabel: finding.buildability?.shapeLabel ?? null,
      mustDo: finding.whatWouldWin.map((w) => w.requirement),
      // What it has to beat, with what those cost today.
      competingWith: finding.incumbents.map((i) => ({ name: i.name, price: i.price, currency: i.currency, weakness: i.whatTheyGetWrong, url: i.url })),
      priceAnchors: finding.evidence.paying.map((p) => ({ what: p.what, price: p.price, currency: p.currency, url: p.url })),
    },

    why: {
      evidenceStrength: finding.evidence.strength,
      isHypothesis: finding.evidence.hypothesis,
      ladder: finding.evidence.ladder,
      complaintsAgreeOn: finding.evidence.agreement?.subject ?? null,
      inTheirWords: finding.demand.inTheirWords,
      complaints: finding.evidence.complaints,
      howMany: finding.evidence.volume,
    },

    // Handed over unfiltered. He needs the reasons not to build this at the
    // same moment he gets the reasons to.
    risks: finding.risks,
    buildability: finding.buildability,
    verdict: finding.verdict,

    provenance: {
      foundAt: finding.foundAt,
      lastVerifiedAt: finding.lastVerifiedAt,
      sources: finding.sources,
      // Stated plainly so he can weigh it: snippets are not the same as reads.
      readQuality: finding.evidence.readQuality ?? null,
      cost: finding.depth,
    },
  };
}

/**
 * Mark a finding as handed over and, if Jason's endpoint is configured, send
 * it. Returns what actually happened rather than assuming the POST worked —
 * a 200 is not proof, so the response body is reported back.
 */
export async function handToJason(finding, { store, note = null, endpoint = null, token = null, fetchImpl = globalThis.fetch, force = false, now = nowIso }) {
  if (!force && finding.buildability?.verdict === 'jason-cannot-build') {
    throw new NotBuildableError(finding);
  }

  const packet = packageForJason(finding, { note, now });

  let delivery = { attempted: false, ok: null, status: null, detail: 'no JASON_ENDPOINT configured, so the packet was prepared and stored but not sent' };

  if (endpoint) {
    assertFetchAllowed(endpoint);
    delivery.attempted = true;
    try {
      const res = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(packet),
      });
      const body = await res.text();
      delivery = {
        attempted: true,
        ok: res.ok,
        status: res.status,
        // A 200 is not proof it was understood. Keep what came back.
        detail: body.slice(0, 500),
      };
    } catch (err) {
      delivery = { attempted: true, ok: false, status: null, detail: err.message };
    }
  }

  const updated = { ...finding, handedToJasonAt: now(), handoff: { note, delivery, at: now() } };
  await store.putFinding(updated);
  await store.addActivity({
    kind: 'handoff',
    level: 'report',
    message: `handed to Jason: ${finding.demand.oneLine.slice(0, 80)}${delivery.attempted ? ` (${delivery.ok ? 'delivered' : 'delivery failed'})` : ' (prepared, not sent)'}`,
    findingId: finding.id,
  });

  return { packet, delivery, finding: updated };
}
