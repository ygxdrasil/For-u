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
  const kv = new Map();

  return {
    kind: 'memory',
    durable: false,
    note: 'In-memory only. This resets whenever the serverless function cold-starts. Set DATABASE_URL for durable storage.',

    // Generic key/value: the password record, the session secret and the
    // encrypted API keys live here. In memory that means a cold start logs you
    // out and forgets your keys — which is exactly why DATABASE_URL matters.
    async getKv(k) {
      return kv.get(k) ?? null;
    },
    async setKv(k, v) {
      kv.set(k, v);
      return v;
    },

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
 * Cached per module instance.
 *
 * Without this, every handler call built a NEW store — so with no database a
 * password set by one request was already gone by the next one, and signing in
 * reported "no password set yet" immediately after setup. Caching also stops
 * the Postgres backend re-running its migration on every invocation.
 *
 * This makes state survive within a warm lambda. It does NOT make it durable:
 * only a database does that, which is why setup refuses without one.
 */
let cached = null;
let cachedFor = null;

export async function createStore({ databaseUrl = process.env.DATABASE_URL } = {}) {
  const key = databaseUrl ?? '(memory)';
  if (cached && cachedFor === key) return cached;

  let store;
  if (!databaseUrl) {
    store = createMemoryStore();
  } else {
    try {
      const { createNeonStore } = await import('./store.neon.js');
      store = await createNeonStore(databaseUrl);
    } catch (err) {
      store = createMemoryStore();
      store.note = `DATABASE_URL is set but the Postgres store could not start (${err.message}). Falling back to memory — state will not persist.`;
      store.degraded = true;
    }
  }

  cached = store;
  cachedFor = key;
  return store;
}

/** Tests only: drop the cached instance so each case starts clean. */
export function resetStoreCache() {
  cached = null;
  cachedFor = null;
}
