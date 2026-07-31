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
export function packageForJason(finding, { note = null, now = nowIso } = {}) {
  return {
    handoffVersion: 1,
    handedAt: now(),
    findingId: finding.id,
    note,

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
