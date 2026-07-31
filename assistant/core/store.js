/**
 * Persistence, behind a narrow interface so swapping the backend is an
 * afternoon rather than a rebuild.
 *
 * Two implementations:
 *   MemoryStore — no setup, but a Vercel function forgets it between cold
 *                 starts. Fine for trying the thing out; the UI says so
 *                 plainly rather than pretending state is durable.
 *   NeonStore   — DATABASE_URL set. Durable, free tier, and the only mode in
 *                 which the sweep and the headless endpoint work without a
 *                 browser holding the keys.
 *
 * Nothing here ever deletes a workflow snapshot. Snapshots are the safety net
 * under every update, so the only operation is append.
 */

const MONTH = () => new Date().toISOString().slice(0, 7); // YYYY-MM

export function createMemoryStore() {
  const spend = [];
  const snapshots = [];
  const findings = [];
  const jobs = new Map();
  const sessions = new Map();
  const tokens = [];

  return {
    kind: 'memory',
    durable: false,
    note: 'In-memory only. This resets whenever the serverless function cold-starts. Set DATABASE_URL for durable storage.',

    async getMonthlySpend() {
      const m = MONTH();
      return spend.filter((s) => s.at.startsWith(m)).reduce((t, s) => t + s.usd, 0);
    },
    async addSpend(entry) {
      spend.push(entry);
    },
    async recentSpend(limit = 50) {
      return spend.slice(-limit).reverse();
    },

    /** Append-only. A snapshot is what makes an update reversible. */
    async snapshot({ workflowId, name, workflow, reason }) {
      const entry = {
        id: `snap_${snapshots.length + 1}_${Date.now()}`,
        workflowId,
        name,
        workflow,
        reason,
        at: new Date().toISOString(),
      };
      snapshots.push(entry);
      return entry;
    },
    async listSnapshots(workflowId) {
      return snapshots.filter((s) => !workflowId || s.workflowId === workflowId).reverse();
    },
    async getSnapshot(id) {
      return snapshots.find((s) => s.id === id) ?? null;
    },

    async addFinding(f) {
      const entry = { id: `find_${findings.length + 1}`, at: new Date().toISOString(), status: 'open', ...f };
      findings.push(entry);
      return entry;
    },
    async listFindings({ status = null } = {}) {
      return findings.filter((f) => !status || f.status === status).reverse();
    },
    async updateFinding(id, patch) {
      const f = findings.find((x) => x.id === id);
      if (f) Object.assign(f, patch);
      return f ?? null;
    },

    async saveJob(job) {
      jobs.set(job.id, job);
      return job;
    },
    async getJob(id) {
      return jobs.get(id) ?? null;
    },

    async getSession(id) {
      return sessions.get(id) ?? { id, messages: [] };
    },
    async saveSession(session) {
      sessions.set(session.id, session);
      return session;
    },

    async listTokens() {
      return tokens.map(({ hash, ...rest }) => rest);
    },
    async addToken(t) {
      tokens.push(t);
      return t;
    },
    async findTokenByHash(hash) {
      return tokens.find((t) => t.hash === hash && !t.retiredAt) ?? null;
    },
    async retireToken(id) {
      const t = tokens.find((x) => x.id === id);
      if (t) t.retiredAt = new Date().toISOString();
      return t ?? null;
    },

    async getCursor(name) {
      return sessions.get(`cursor:${name}`) ?? null;
    },
    async setCursor(name, value) {
      sessions.set(`cursor:${name}`, value);
      return value;
    },
  };
}

/**
 * Select a backend. Deliberately synchronous about which one it picked so the
 * UI can say "state is not durable" instead of quietly losing things.
 */
export async function createStore({ databaseUrl = process.env.DATABASE_URL } = {}) {
  if (!databaseUrl) return createMemoryStore();
  try {
    const { createNeonStore } = await import('./store.neon.js');
    return await createNeonStore(databaseUrl);
  } catch (err) {
    const store = createMemoryStore();
    store.note = `DATABASE_URL is set but the Postgres store could not start (${err.message}). Falling back to memory — state will not persist.`;
    store.degraded = true;
    return store;
  }
}
