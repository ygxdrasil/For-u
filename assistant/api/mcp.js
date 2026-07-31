/**
 * POST /api/mcp — Jason as a tool other AIs can attach.
 *
 * Model Context Protocol over HTTP (JSON-RPC 2.0). Anything that speaks MCP —
 * Claude, Cursor, most agent frameworks — can point at this URL with a bearer
 * token and see his capabilities natively, with no glue code written per AI.
 *
 * It exposes THE SAME registry the browser and /api/agent use. Not a copy, not
 * a subset: the same buildToolRegistry, so a tool cannot exist for one caller
 * and not another. That is the whole reason there is one registry.
 *
 * The limits are identical too. Another AI can search, design, validate, save
 * inactive and dry run — but activating something that sends still needs a
 * human yes, and no AI can approve on your behalf. An agent that asks to
 * activate gets the approval request back as its result, to relay to you.
 */

import { createStore } from '../core/store.js';
import { createN8nClient } from '../core/n8nClient.js';
import { toolsForProtocol } from '../core/protocol.js';
import { authenticate } from '../core/auth.js';
import { json, methodGuard, readBody, resolveConfig } from '../core/http.js';
import { loadPrefs } from '../core/settings.js';

const PROTOCOL_VERSION = '2025-06-18';

const rpc = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

export default async function handler(req, res) {
  if (!methodGuard(req, res, ['POST'])) return;

  const store = await createStore();
  const auth = await authenticate(req, store);
  if (!auth.ok) return json(res, 401, rpcError(null, -32001, auth.error));

  req.body = await readBody(req);
  const { id = null, method, params } = req.body ?? {};

  // Not just missing — the wrong TYPE. A caller sending {"method": 123} used to
  // reach method.startsWith and take the whole route down with a 500.
  if (typeof method !== 'string' || !method) {
    return json(res, 400, rpcError(id, -32600, 'The "method" field must be a string naming a JSON-RPC method.'));
  }

  if (method === 'initialize') {
    return json(res, 200, rpc(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'jason', title: 'Jason — n8n workflow contractor', version: '1.0.0' },
      instructions:
        'Builds, tests and repairs n8n workflows. Always search_nodes then get_node_schema before writing any node parameters — inventing a parameter name will be rejected. Ground picker values with ground_options rather than guessing ids. Validate before saving. New workflows are saved switched off; activating anything that can send requires the owner to approve, and you cannot approve on their behalf.',
    }));
  }

  // Notifications carry no id and expect no result.
  if (method.startsWith('notifications/')) {
    res.statusCode = 202;
    return res.end();
  }

  if (method === 'ping') return json(res, 200, rpc(id, {}));

  const config = await resolveConfig(req, store);
  const prefs = await loadPrefs(store);
  const n8n = config.n8nBaseUrl && config.n8nApiKey ? createN8nClient({ baseUrl: config.n8nBaseUrl, apiKey: config.n8nApiKey }) : null;

  const tools = toolsForProtocol({
    n8n,
    store,
    prefs,
    // An external agent never carries approvals. Sending and spending stay
    // with the human, whoever is asking.
    approvals: [],
  });

  if (method === 'tools/list') {
    return json(res, 200, rpc(id, {
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.parameters,
      })),
    }));
  }

  if (method === 'tools/call') {
    const tool = tools.find((t) => t.name === params?.name);
    if (!tool) return json(res, 200, rpc(id, { isError: true, content: [{ type: 'text', text: `No tool called "${params?.name}".` }] }));

    let out;
    try {
      out = await tool.handler(params?.arguments ?? {});
    } catch (err) {
      out = { ok: false, error: `${params.name} threw: ${err.message}` };
    }

    return json(res, 200, rpc(id, {
      isError: out?.ok === false && !out?.needsApproval,
      content: [{ type: 'text', text: JSON.stringify(out) }],
      structuredContent: out,
    }));
  }

  return json(res, 200, rpcError(id, -32601, `Unknown method "${method}".`));
}
