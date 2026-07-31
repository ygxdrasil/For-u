/**
 * POST /api/workflow — read, check and save a workflow by hand.
 *
 * This is the terminal's write path: you edit the JSON yourself and it goes
 * through exactly the same gate Jason's edits do. Same validator, so an
 * invented parameter name is rejected with the real ones suggested. Same
 * snapshot, so the previous version is always recoverable. Same refusal to
 * delete anything.
 *
 * Editing by hand is not a way around the safety net — it is the same net with
 * a different pair of hands on the keyboard.
 */

import { createStore } from '../core/store.js';
import { createN8nClient } from '../core/n8nClient.js';
import { validateWorkflow } from '../core/validate.js';
import { buildPreview } from '../core/preview.js';
import { json, methodGuard, readBody, resolveConfig } from '../core/http.js';
import { requireSession } from './auth.js';

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  const session = await requireSession(req, store, res);
  if (!session.ok) return json(res, 401, { ok: false, error: session.error });

  req.body = await readBody(req);
  const action = req.body.action ?? 'get';

  // Checked before anything else, so an unrecognised action is always named as
  // one. Asked to "delete" a workflow with no instance connected, this route
  // used to answer "no n8n connection" — which reads as "connect one and it
  // will work". There is no delete, connected or not.
  if (!['check', 'get', 'save'].includes(action)) {
    return json(res, 400, { ok: false, error: `Unknown action "${action}". This route reads, checks and saves — nothing else.` });
  }

  const config = await resolveConfig(req, store);

  const n8n =
    config.n8nBaseUrl && config.n8nApiKey ? createN8nClient({ baseUrl: config.n8nBaseUrl, apiKey: config.n8nApiKey }) : null;

  // Checking never needs n8n — it is entirely local, so you can validate an
  // edit even when the instance is unreachable.
  if (action === 'check') {
    const validation = await validateWorkflow(req.body.workflow);
    return json(res, 200, { ok: true, validation, preview: buildPreview(req.body.workflow) });
  }

  if (!n8n) return json(res, 400, { ok: false, error: 'No n8n connection configured.' });

  if (action === 'get') {
    if (!req.body.id) return json(res, 400, { ok: false, error: 'Which workflow?' });
    try {
      const workflow = await n8n.getWorkflow(req.body.id);
      return json(res, 200, { ok: true, workflow, preview: buildPreview(workflow) });
    } catch (err) {
      return json(res, 502, { ok: false, error: err.message });
    }
  }

  if (action === 'save') {
    const workflow = req.body.workflow;
    const validation = await validateWorkflow(workflow);
    if (!validation.valid) {
      return json(res, 200, { ok: false, error: 'That does not validate, so I have not saved it.', validation });
    }

    const payload = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections ?? {},
      settings: workflow.settings ?? {},
    };

    try {
      if (req.body.id) {
        // Snapshot before overwriting. Your hand-edit is as recoverable as his.
        const current = await n8n.getWorkflow(req.body.id);

        // n8n's PUT replaces the whole workflow, so anything you did not paste
        // back would be gone. Pinned test data and stored state are carried
        // over unless your edit changes them — the same rule his own saves
        // follow, because this is the same net with your hands on the keyboard.
        for (const key of ['pinData', 'staticData']) {
          const next = workflow[key] ?? current?.[key];
          if (next !== undefined) payload[key] = next;
        }
        const snap = await store.snapshot({
          workflowId: req.body.id,
          name: current?.name ?? null,
          workflow: current,
          reason: 'edited by hand',
        });
        const result = await n8n.updateWorkflow(req.body.id, payload, { snapshotId: snap.id });
        return json(res, 200, {
          ok: true,
          saved: true,
          id: req.body.id,
          snapshotId: snap.id,
          confirmed: result.confirmed,
          validation,
          note: result.confirmed
            ? `Saved and read back. Previous version kept as ${snap.id}.`
            : `n8n accepted it but reading it back did not confirm — I can't promise it took.`,
        });
      }

      const created = await n8n.createWorkflow(payload);
      return json(res, 200, {
        ok: true,
        saved: true,
        id: created.workflow?.id,
        confirmed: created.confirmed,
        validation,
        note: 'Created, switched off. Turning it on is a separate, explicit step.',
      });
    } catch (err) {
      return json(res, 502, { ok: false, error: err.message });
    }
  }

  return json(res, 400, { ok: false, error: `Unknown action "${action}".` }); // unreachable; kept as a backstop
}
