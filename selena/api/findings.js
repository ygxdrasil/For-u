/**
 * /api/findings — the archive.
 *
 * GET  ?status=&watchId=&minStrength=&buildable=&id=
 * POST { action: 'archive' | 'restore' | 'supersede' | 'reverify', id }
 * POST { action: 'contact-sheet', id, draft? }   who could you talk to
 * POST { action: 'record-reply', id, reply }     what they said back
 *
 * The last two are here rather than in an api/reach.js because Vercel Hobby
 * allows twelve functions and eleven are in use. A twelfth would deploy today
 * and block the one after it permanently.
 *
 * There is no delete action and there never will be. A finding rejected in
 * March is evidence when the same demand turns up in September, so records are
 * archived or superseded and every prior version stays in the history.
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { summarizeFinding, FINDING_STATUS } from '../core/schema.js';
import { reverifyFinding, staleFindings } from '../core/watches.js';
import { contactSheet, draftOpeners, recordConversation, conversationSummary } from '../core/reach.js';
import { nowIso } from '../core/util.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const ctx = await createContext({ budgetMs: 50_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  if (req.method === 'GET') {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const id = url.searchParams.get('id');

    if (id) {
      const finding = await ctx.store.getFinding(id);
      if (!finding) return json(res, 404, { ok: false, error: `No finding with id ${id}.` });
      const versions = await ctx.store.findingVersions(id).catch(() => []);
      return json(res, 200, { ok: true, finding, versions: versions.map((v) => ({ version: v.version, at: v.at ?? v.updatedAt, strength: v.evidence?.strength, status: v.status })) });
    }

    const findings = await ctx.store.listFindings({
      status: FINDING_STATUS.includes(url.searchParams.get('status')) ? url.searchParams.get('status') : 'active',
      watchId: url.searchParams.get('watchId') || null,
      buildable: url.searchParams.get('buildable') || null,
      minStrength: Number(url.searchParams.get('minStrength') ?? 0),
      limit: Number(url.searchParams.get('limit') ?? 200),
    });

    return json(res, 200, {
      ok: true,
      findings: url.searchParams.get('full') === '1' ? findings : findings.map(summarizeFinding),
      counts: await ctx.store.countFindings(),
      stale: staleFindings(findings).map((f) => f.id),
      context: contextStatus(ctx),
      openApi: gate.open ? gate.warning : undefined,
    });
  }

  const body = await readBody(req);
  const action = String(body.action ?? '').toLowerCase();
  const id = String(body.id ?? '').trim();
  if (!id) return json(res, 400, { ok: false, error: 'Which finding? Send { "id": "..." }.' });

  const finding = await ctx.store.getFinding(id);
  if (!finding) return json(res, 404, { ok: false, error: `No finding with id ${id}.` });

  if (action === 'archive' || action === 'restore') {
    const updated = { ...finding, status: action === 'archive' ? 'archived' : 'active', lastVerifiedAt: finding.lastVerifiedAt };
    await ctx.store.putFinding(updated);
    await ctx.store.addActivity({ kind: 'finding', level: 'info', message: `${action}d: ${finding.demand.oneLine.slice(0, 70)}`, findingId: id });
    return json(res, 200, { ok: true, finding: updated, note: 'Archived, not deleted. Every version is still on record.' });
  }

  if (action === 'supersede') {
    const byId = String(body.by ?? '').trim();
    if (!byId) return json(res, 400, { ok: false, error: 'Superseded by which finding? Send { "by": "..." }.' });
    const updated = { ...finding, status: 'superseded', supersededBy: byId };
    await ctx.store.putFinding(updated);
    return json(res, 200, { ok: true, finding: updated });
  }

  if (action === 'reverify') {
    const outcome = await reverifyFinding(finding, ctx);
    return json(res, 200, {
      ok: true,
      finding: outcome.finding,
      change: outcome.change,
      changed: Boolean(outcome.change),
      status: outcome.result.status,
      notes: outcome.result.notes,
      costUsd: outcome.result.costUsd,
      checkedAt: nowIso(),
    });
  }

  // ---- who could you actually talk to about this ------------------------
  // Folded into this route rather than given its own, because Vercel Hobby
  // allows twelve functions and eleven are in use. A twelfth would work today
  // and block the next one forever.
  if (action === 'contact-sheet') {
    const sheet = contactSheet(finding, { limit: Number(body.limit) || 25 });
    // Drafting costs a model call, so it only happens when asked for.
    const drafts = body.draft === true ? await draftOpeners(finding, sheet.people.filter((p) => p.reachability === 'reply' || p.reachability === 'profile'), ctx) : null;
    return json(res, 200, { ok: true, sheet, drafts, conversations: conversationSummary(finding), context: contextStatus(ctx) });
  }

  // ---- what they said back ----------------------------------------------
  if (action === 'record-reply') {
    const updated = recordConversation(finding, body.reply ?? body);
    await ctx.store.putFinding(updated);
    await ctx.store.addActivity({
      kind: 'finding',
      level: 'report',
      message: `reply recorded on "${finding.demand.oneLine.slice(0, 60)}": ${String(body.reply?.verdict ?? body.verdict ?? 'no-reply')}`,
      findingId: id,
    });
    // The level is returned so the HUD can show that it did NOT move. A reply
    // saying "I would pay" is the best sentence in this system and it is still
    // not somebody paying.
    return json(res, 200, {
      ok: true,
      conversations: conversationSummary(updated),
      strength: updated.evidence?.strength ?? null,
      note: 'Recorded beside the evidence, not inside it. What someone says they would pay never moves the ladder — only what someone actually pays does.',
    });
  }

  return json(res, 400, {
    ok: false,
    error: `Unknown action "${action}". Use archive, restore, supersede, reverify, contact-sheet or record-reply. There is no delete.`,
  });
});
