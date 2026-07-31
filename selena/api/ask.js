/**
 * POST /api/ask — Jason asks Selena something.
 *
 * The cheap route by default: if she already knows, she answers from the
 * record for nothing. Research only happens when the record cannot answer, or
 * when the caller asks for it explicitly, because a watching agent that
 * researches every passing question is how a $10 month becomes a $60 one.
 *
 * Body: { question, mode?: 'auto'|'stored'|'research', depth?, askedBy? }
 */

import { json, methodGuard, readBody, guard } from '../core/http.js';
import { createContext, contextStatus } from '../core/context.js';
import { gateRequest } from '../core/auth.js';
import { answerQuestion, ASK_MODES } from '../core/ask.js';

export default guard(async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const ctx = await createContext({ budgetMs: 45_000 });

  const gate = await gateRequest(req, ctx.store);
  if (!gate.ok) return json(res, 401, { ok: false, error: gate.error });

  const body = await readBody(req);
  const question = String(body.question ?? body.q ?? '').trim();
  if (!question) return json(res, 400, { ok: false, error: 'Send { "question": "..." }.' });

  const mode = ASK_MODES.includes(body.mode) ? body.mode : 'auto';

  const answer = await answerQuestion(
    { question, mode, askedBy: String(body.askedBy ?? 'jason').slice(0, 40), requestedDepth: body.depth ?? null },
    ctx,
  );

  json(res, answer.ok ? 200 : 422, {
    ...answer,
    context: contextStatus(ctx),
    openApi: gate.open ? gate.warning : undefined,
  });
});
