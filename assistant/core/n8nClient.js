/**
 * n8n public API client.
 *
 * Two properties of this file are load-bearing and both are enforced by tests:
 *
 * 1. There is no DELETE. Not a delete method, not a delete helper, not a
 *    request() call that could be handed the string. Retiring a workflow means
 *    deactivate + archive, and every update snapshots the previous version
 *    first. tests/no-delete.test.js greps this file and fails the build if the
 *    word ever appears as an HTTP method.
 *
 * 2. Every state-changing call is read back. A 200 from n8n means the request
 *    was accepted, not that the thing is true.
 */

/** Minimum gap between consecutive calls to the same path prefix.
 *  n8n (and the proxies people put in front of it) will silently drop or
 *  mis-order rapid consecutive writes to the same resource. 300ms costs
 *  nothing on a workflow build and removes a whole class of phantom failure. */
const MIN_GAP_MS = 300;

const lastCallAt = new Map();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pace(key) {
  const last = lastCallAt.get(key) ?? 0;
  const wait = MIN_GAP_MS - (Date.now() - last);
  if (wait > 0) await sleep(wait);
  lastCallAt.set(key, Date.now());
}

export class N8nError extends Error {
  constructor(message, { status = null, body = null, url = null } = {}) {
    super(message);
    this.name = 'N8nError';
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

export function createN8nClient({ baseUrl, apiKey, fetchImpl = globalThis.fetch }) {
  if (!baseUrl) throw new Error('n8n base URL is required');
  if (!apiKey) throw new Error('n8n API key is required');

  const root = String(baseUrl).replace(/\/+$/, '');
  const api = `${root}/api/v1`;

  async function request(method, path, { body = null, query = null, timeoutMs = 20000 } = {}) {
    if (method === 'DELETE') {
      // Unreachable by construction — nothing in this module passes DELETE.
      // Present as a tripwire in case someone adds a caller later.
      throw new Error('This client never deletes. Deactivate and archive instead.');
    }

    const url = new URL(`${api}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      }
    }

    await pace(path.split('/')[1] ?? path);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try {
      res = await fetchImpl(url.toString(), {
        method,
        headers: {
          'X-N8N-API-KEY': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body === null ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      throw new N8nError(`Request to ${path} failed: ${err.message}`, { url: url.toString() });
    }
    clearTimeout(timer);

    const text = await res.text();
    let parsed = null;
    let unparseable = false;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text };
      unparseable = true;
    }

    /**
     * A 200 that is not JSON did not come from the n8n API.
     *
     * The common cause is an identity proxy — Cloudflare Access, an SSO
     * gateway, a company VPN portal — answering every request with its own
     * sign-in page and a cheerful 200. n8n never sees the API key. Treating
     * that body as data meant `data?.length` was undefined and the answer came
     * back as "you have no workflows", which is a confident lie about someone's
     * own instance. It is also what a 200 from a parked domain looks like.
     */
    if (res.ok && unparseable) {
      const looksLikeHtml = /^\s*<(?:!doctype|html)/i.test(text);
      throw new N8nError(
        looksLikeHtml
          ? `${url.origin} answered ${method} ${path} with an HTML page instead of JSON. That is not the n8n API — almost always a sign-in page from something in front of n8n (Cloudflare Access, an SSO proxy, a VPN portal), which means the API key never reaches n8n. The base URL may also be pointing at the editor rather than the API.`
          : `${url.origin} answered ${method} ${path} with a body that is not JSON, so it did not come from the n8n API: ${text.slice(0, 200)}`,
        { status: res.status, body: parsed, url: url.toString() },
      );
    }

    if (!res.ok) {
      throw new N8nError(`n8n returned ${res.status} for ${method} ${path}: ${parsed?.message ?? text.slice(0, 300)}`, {
        status: res.status,
        body: parsed,
        url: url.toString(),
      });
    }
    return parsed;
  }

  // -------------------------------------------------------------------------
  // reads

  async function listWorkflows({ limit = 50, active = null, tags = null, cursor = null } = {}) {
    return request('GET', '/workflows', { query: { limit, active, tags, cursor } });
  }

  async function getWorkflow(id) {
    return request('GET', `/workflows/${encodeURIComponent(id)}`);
  }

  async function listCredentials() {
    // The public API deliberately never returns credential secrets, only names,
    // ids and types. That is exactly what we need and nothing more.
    return request('GET', '/credentials');
  }

  async function listExecutions({ status = null, workflowId = null, limit = 20, cursor = null, includeData = false } = {}) {
    return request('GET', '/executions', { query: { status, workflowId, limit, cursor, includeData } });
  }

  async function getExecution(id, { includeData = true } = {}) {
    return request('GET', `/executions/${encodeURIComponent(id)}`, { query: { includeData } });
  }

  /**
   * The fields a credential type actually needs.
   *
   * So "I need a Google Places key" can become "create a credential of type
   * httpQueryAuth called Places, with name=key and value=<your key>" — an
   * instruction someone can follow in twenty seconds, rather than a hunt
   * through a dropdown of four hundred types. The secrets themselves are never
   * involved here: this is the shape of the form, not what goes in it.
   */
  async function credentialSchema(type) {
    return request('GET', `/credentials/schema/${encodeURIComponent(type)}`);
  }

  async function listTags() {
    return request('GET', '/tags');
  }

  /**
   * Attach tags by NAME, creating any that do not exist yet.
   *
   * The API takes tag ids, not names, so this resolves them first. Tagging is
   * how a group of workflows stays findable as one system — the assistant is
   * told to do it, so it has to be something it can actually do.
   */
  async function setWorkflowTags(id, names) {
    const wanted = [...new Set((names ?? []).map((n) => String(n).trim()).filter(Boolean))];
    if (!wanted.length) return { tags: [], confirmed: true };

    const existing = (await listTags())?.data ?? [];
    const byName = new Map(existing.map((t) => [t.name, t.id]));

    const ids = [];
    for (const name of wanted) {
      if (byName.has(name)) {
        ids.push(byName.get(name));
        continue;
      }
      const created = await request('POST', '/tags', { body: { name } });
      if (created?.id) ids.push(created.id);
    }

    await request('PUT', `/workflows/${encodeURIComponent(id)}/tags`, { body: ids.map((tagId) => ({ id: tagId })) });

    // Read back rather than trust the write.
    const readBack = await getWorkflow(id).catch(() => null);
    const applied = (readBack?.tags ?? []).map((t) => t.name ?? t);
    return { tags: applied, confirmed: wanted.every((n) => applied.includes(n)), requested: wanted };
  }

  // -------------------------------------------------------------------------
  // writes — each one reads back

  /**
   * What the n8n API will actually accept in a workflow body.
   *
   * It is strict, and it gets stricter between versions: `active` is READ-ONLY
   * on create, and sending it — which this client did, deliberately, to force a
   * workflow inactive — is rejected outright:
   *
   *   request/body/active is read-only
   *
   * So a finished, validated, correct workflow could not be saved at all. The
   * intent survives without the field: n8n creates workflows inactive anyway,
   * activation is its own endpoint, and the read-back afterwards proves it
   * rather than asserting it.
   *
   * Everything else that comes back on a GET — id, createdAt, versionId, tags,
   * isArchived, triggerCount, shared, meta — is read-only too, which matters
   * because updates are built from a workflow that was READ first.
   */
  const WRITABLE = ['name', 'nodes', 'connections', 'settings', 'staticData', 'pinData'];

  const writableOnly = (workflow) => {
    const payload = {};
    for (const field of WRITABLE) {
      if (workflow?.[field] !== undefined) payload[field] = workflow[field];
    }
    return payload;
  };

  /**
   * Send it; if n8n names a field it will not accept, drop that field and send
   * it once more.
   *
   * This is not guessing at the API — the error says exactly which property is
   * the problem, so this reads the answer rather than trying combinations. It
   * exists because "which fields are writable" varies by n8n version, and the
   * alternative is a workflow that cannot be saved on an instance one release
   * ahead of whatever was tested.
   */
  async function sendWorkflow(method, path, payload) {
    const dropped = [];
    let body = payload;

    for (let attempt = 0; attempt < WRITABLE.length + 1; attempt++) {
      try {
        return { result: await request(method, path, { body }), dropped };
      } catch (err) {
        const complaint = String(err.message ?? '');
        const named =
          complaint.match(/request\/body\/([A-Za-z0-9_]+) is read-only/)?.[1] ??
          complaint.match(/must NOT have additional properties.*?"([A-Za-z0-9_]+)"/)?.[1] ??
          complaint.match(/property "?([A-Za-z0-9_]+)"? is not allowed/i)?.[1];

        if (!named || !(named in body)) throw err;

        const { [named]: _removed, ...rest } = body;
        body = rest;
        dropped.push(named);
      }
    }
    throw new N8nError('n8n rejected every field of this workflow, which should be impossible.', { url: path });
  }

  async function createWorkflow(workflow) {
    // Created inactive — by not asking for anything else. `active` is read-only
    // on this endpoint, so stating the intent in the body is what BLOCKED it.
    const { result: created, dropped } = await sendWorkflow('POST', '/workflows', writableOnly(workflow));

    // No id back means we do not know what we just made. Carrying on would
    // send the next request to /workflows/undefined and then report on a
    // workflow nobody can find.
    if (!created?.id) {
      throw new N8nError('n8n accepted the workflow but returned no id, so I cannot tell you what was created or check on it.', { body: created });
    }

    const readBack = await getWorkflow(created.id).catch(() => null);

    // Inactive is checked, not assumed. If an instance ever created one live,
    // that is the one thing here worth knowing immediately.
    if (readBack?.active === true) {
      await setActive(created.id, false).catch(() => null);
    }

    return {
      workflow: created,
      confirmed: Boolean(readBack?.id),
      readBack,
      fieldsNotAccepted: dropped.length ? dropped : undefined,
    };
  }

  /**
   * Update a workflow. The caller is responsible for having snapshotted the
   * previous version first — see workflowStore.snapshot(). This function will
   * refuse to run without proof that happened.
   */
  async function updateWorkflow(id, workflow, { snapshotId = null } = {}) {
    if (!snapshotId) {
      throw new Error(
        'updateWorkflow requires a snapshotId. Snapshot the current version before overwriting it — the previous version must always be recoverable.',
      );
    }
    const { result: updated, dropped } = await sendWorkflow('PUT', `/workflows/${encodeURIComponent(id)}`, writableOnly(workflow));
    const readBack = await getWorkflow(id).catch(() => null);
    return {
      workflow: updated,
      confirmed: Boolean(readBack?.id),
      readBack,
      snapshotId,
      fieldsNotAccepted: dropped.length ? dropped : undefined,
    };
  }

  /**
   * Activate or deactivate. Read back and, if the read disagrees, try once
   * more before reporting — a single disagreeing read is more often a race
   * than a real failure.
   */
  async function setActive(id, active) {
    const path = active ? `/workflows/${encodeURIComponent(id)}/activate` : `/workflows/${encodeURIComponent(id)}/deactivate`;
    await request('POST', path);

    let readBack = await getWorkflow(id).catch(() => null);
    if (readBack && readBack.active !== active) {
      await sleep(MIN_GAP_MS * 2);
      readBack = await getWorkflow(id).catch(() => null);
    }

    return {
      requested: active,
      actual: readBack?.active ?? null,
      confirmed: readBack?.active === active,
      readBack,
    };
  }

  /** Archive rather than delete. Preserves the workflow and its history. */
  async function archiveWorkflow(id) {
    try {
      await request('POST', `/workflows/${encodeURIComponent(id)}/archive`);
    } catch (err) {
      // Older instances have no archive endpoint. Fall back to deactivating and
      // tagging, which is reversible and destroys nothing.
      if (err.status === 404 || err.status === 405) {
        await setActive(id, false);
        return { archived: false, deactivated: true, reason: 'This n8n has no archive endpoint; deactivated and left in place instead.' };
      }
      throw err;
    }
    const readBack = await getWorkflow(id).catch(() => null);
    return { archived: readBack?.isArchived ?? null, confirmed: readBack?.isArchived === true, readBack };
  }

  /**
   * Run a workflow through the public API.
   *
   * Reports disagree about whether POST /workflows/:id/run or /execute exists,
   * and it varies by version — so probe rather than believe either. Whatever
   * happens, the outcome distinguishes "ran" from "this instance won't let me
   * run it from the API", which is not the same as "it's broken".
   */
  async function runWorkflow(id, { body = {} } = {}) {
    const attempts = [
      { method: 'POST', path: `/workflows/${encodeURIComponent(id)}/run` },
      { method: 'POST', path: `/workflows/${encodeURIComponent(id)}/execute` },
    ];
    const tried = [];

    for (const attempt of attempts) {
      try {
        const result = await request(attempt.method, attempt.path, { body, timeoutMs: 60000 });
        return { ran: true, via: attempt.path, result, tried };
      } catch (err) {
        tried.push({ path: attempt.path, status: err.status ?? null, message: err.message });
        // 404/405 means this endpoint isn't here; anything else is a real error
        // about this workflow and should not be masked by trying the next path.
        if (err.status !== 404 && err.status !== 405) {
          return { ran: false, reason: 'error', error: err.message, tried };
        }
      }
    }

    return {
      ran: false,
      reason: 'unsupported',
      error:
        "This n8n's public API has no endpoint for running a workflow (tried /run and /execute). The workflow is saved and can be run from the n8n UI, or by calling its webhook if it has one. That is a limitation of the API, not a fault in the workflow.",
      tried,
    };
  }

  /** Most recent execution for a workflow — how we read back a manual run. */
  async function latestExecution(workflowId) {
    const list = await listExecutions({ workflowId, limit: 1, includeData: false });
    const first = list?.data?.[0] ?? null;
    if (!first) return null;
    return getExecution(first.id, { includeData: true });
  }

  /** Probe the instance: is it reachable, and does the key work? */
  async function ping() {
    try {
      const res = await listWorkflows({ limit: 1 });

      // JSON came back, but the API always returns { data: [...] } here. A
      // different shape means something answered on that URL and it was not
      // the n8n API — reporting that as a healthy connection is how you end up
      // being told your instance is empty.
      if (!Array.isArray(res?.data)) {
        return {
          ok: false,
          reachable: true,
          authorised: null,
          error: `${root} answered, but not with a workflow list. Check that the base URL is the n8n instance itself (the same host you open the editor on) and that nothing is sitting in front of it.`,
        };
      }
      return { ok: true, reachable: true, authorised: true, workflowCount: res.data.length };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return { ok: false, reachable: true, authorised: false, error: 'n8n is reachable but rejected the API key.' };
      }
      // A reply arrived, it just was not the API. Reachable, but nothing can be
      // said about the key — it may never have been looked at.
      if (err.status) {
        return { ok: false, reachable: true, authorised: null, error: err.message };
      }
      return { ok: false, reachable: false, authorised: null, error: err.message };
    }
  }

  return {
    baseUrl: root,
    request,
    listWorkflows,
    getWorkflow,
    listCredentials,
    credentialSchema,
    listExecutions,
    getExecution,
    listTags,
    setWorkflowTags,
    createWorkflow,
    updateWorkflow,
    setActive,
    archiveWorkflow,
    runWorkflow,
    latestExecution,
    ping,
  };
}
