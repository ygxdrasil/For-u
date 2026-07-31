/**
 * POST /api/handoff — hand one finding to Jason, deliberately.
 *
 * Never automatic. You choose what gets built. Selena will refuse a finding
 * she has classified as something Jason cannot build unless you override it on
 * purpose, and she reports what Jason's endpoint actually said rather than
 * treating a 200 as proof it was understood.
 *
 * GET  ?id=   preview the packet without sending or marking anything
 * POST { id, note?, force? }
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { packageForJason, handToJason, NotBuildableError } from '../core/jason.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['GET', 'POST'])) return;

  const ctx = await createContext({ budgetMs: 20_000 });
  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  if (req.method === 'GET') {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const finding = await ctx.store.getFinding(String(url.searchParams.get('id') ?? ''));
    if (!finding) return json(res, 404, { ok: false, error: 'No such finding.' });
    return json(res, 200, {
      ok: true,
      preview: true,
      packet: packageForJason(finding),
      wouldRefuse: finding.buildability?.verdict === 'jason-cannot-build',
      endpointConfigured: Boolean(process.env.JASON_ENDPOINT),
    });
  }

  const body = await readBody(req);
  const finding = await ctx.store.getFinding(String(body.id ?? ''));
  if (!finding) return json(res, 404, { ok: false, error: 'No such finding.' });

  try {
    const outcome = await handToJason(finding, {
      store: ctx.store,
      note: body.note ? String(body.note).slice(0, 2000) : null,
      endpoint: process.env.JASON_ENDPOINT ?? null,
      token: process.env.JASON_TOKEN ?? null,
      fetchImpl: ctx.fetchImpl,
      force: body.force === true,
    });

    json(res, 200, {
      ok: true,
      // Delivery is reported separately from the handoff itself: the finding is
      // marked handed either way, but "sent" and "accepted" are not the same
      // claim and are not collapsed into one boolean.
      handed: true,
      delivery: outcome.delivery,
      packet: outcome.packet,
      context: contextStatus(ctx),
    });
  } catch (err) {
    if (err instanceof NotBuildableError) {
      return json(res, 409, {
        ok: false,
        error: err.message,
        buildability: finding.buildability,
        hint: 'Send { "force": true } if you disagree with the classification.',
      });
    }
    throw err;
  }
});
