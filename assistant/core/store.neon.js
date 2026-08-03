/**
 * Postgres-backed store (Neon over HTTP, which is what works in a serverless
 * function — no connection pool to leak between invocations).
 *
 * Implements exactly the same interface as the memory store, so nothing above
 * this layer knows or cares which one it got. Tables are created on first use;
 * there is no separate migration step to forget to run.
 *
 * Nothing here deletes. Snapshots and findings are append-only, tokens are
 * marked retired rather than removed.
 */

import { neon } from '@neondatabase/serverless';

const MONTH = () => new Date().toISOString().slice(0, 7);

// Per-connection rather than per-process: a module-level boolean meant a test
// (or a second database) could skip the migration entirely and then fail on a
// missing table.
const migratedFor = new WeakSet();

async function migrate(sql) {
  if (migratedFor.has(sql)) return;
  await sql`create table if not exists app_kv (
    k text primary key,
    v jsonb not null,
    updated_at timestamptz not null default now()
  )`;
  await sql`create table if not exists spend (
    id bigserial primary key,
    at timestamptz not null default now(),
    model text,
    label text,
    usd double precision not null default 0,
    input_tokens integer default 0,
    cached_tokens integer default 0,
    output_tokens integer default 0,
    thinking_tokens integer default 0
  )`;
  await sql`create table if not exists snapshots (
    id text primary key,
    workflow_id text,
    name text,
    workflow jsonb,
    reason text,
    at timestamptz not null default now()
  )`;
  await sql`create table if not exists findings (
    id text primary key,
    at timestamptz not null default now(),
    status text not null default 'open',
    data jsonb not null
  )`;
  await sql`create table if not exists api_tokens (
    id text primary key,
    hash text not null unique,
    label text,
    created_at timestamptz not null default now(),
    retired_at timestamptz
  )`;
  await sql`create table if not exists chat_sessions (
    id text primary key,
    messages jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default now()
  )`;
  await sql`create table if not exists jobs (
    id text primary key,
    data jsonb not null,
    created_at timestamptz not null default now()
  )`;
  await sql`create index if not exists spend_at_idx on spend (at)`;

  // Insertion order, because two snapshots taken in the same millisecond have
  // the same timestamp and "order by at desc" then returns them in whatever
  // order the planner likes. For a rollback, "the previous version" has to be
  // the newest one every single time.
  await sql`alter table snapshots add column if not exists seq bigserial`;
  await sql`alter table findings add column if not exists seq bigserial`;
  migratedFor.add(sql);
}

/**
 * @param {string} databaseUrl
 * @param {object} [opts]
 * @param {Function} [opts.sqlImpl] a tagged-template SQL function, for driving
 *   this exact code against a real Postgres in tests. Production storage is
 *   what everything above this layer depends on, and testing only the memory
 *   store proves nothing about it.
 */
export async function createNeonStore(databaseUrl, { sqlImpl = null } = {}) {
  const sql = sqlImpl ?? neon(databaseUrl);
  await migrate(sql);

  const kvGet = async (k) => {
    const rows = await sql`select v from app_kv where k = ${k}`;
    return rows[0]?.v ?? null;
  };
  const kvSet = async (k, v) => {
    await sql`insert into app_kv (k, v, updated_at) values (${k}, ${JSON.stringify(v)}::jsonb, now())
              on conflict (k) do update set v = excluded.v, updated_at = now()`;
    return v;
  };

  return {
    kind: 'postgres',
    durable: true,
    note: null,

    // ---- generic key/value (auth record, session secret, encrypted settings)
    getKv: kvGet,
    setKv: kvSet,

    // ---- spend
    async getMonthlySpend() {
      const rows = await sql`select coalesce(sum(usd), 0) as total from spend
                             where to_char(at, 'YYYY-MM') = ${MONTH()}`;
      return Number(rows[0]?.total ?? 0);
    },
    async addSpend(entry) {
      await sql`insert into spend (at, model, label, usd, input_tokens, cached_tokens, output_tokens, thinking_tokens)
                values (${entry.at ?? new Date().toISOString()}, ${entry.model}, ${entry.label},
                        ${entry.usd}, ${entry.inputTokens ?? 0}, ${entry.cachedTokens ?? 0},
                        ${entry.outputTokens ?? 0}, ${entry.thinkingTokens ?? 0})`;
    },
    async recentSpend(limit = 50) {
      return sql`select * from spend order by at desc limit ${limit}`;
    },

    // ---- snapshots (append only — this is the undo for every update)
    /**
     * Append-only, and never pruned — the snapshot is the safety net under
     * every overwrite, and "never delete anything" does not lapse because a
     * table got big.
     *
     * It does decline to store the same bytes twice. A save that changed
     * nothing has nothing to recover, and repeated identical saves were the
     * whole growth problem: 200 updates of a 60-node workflow came to 1.4MB
     * against a free tier of half a gigabyte.
     */
    async snapshot({ workflowId, name, workflow, reason }) {
      const previous = await sql`select id, name, workflow, reason, at from snapshots
                                 where workflow_id = ${workflowId} order by at desc, seq desc limit 1`;
      const before = previous[0];
      if (before && JSON.stringify(before.workflow) === JSON.stringify(workflow)) {
        return { id: before.id, workflowId, name: before.name, workflow, reason: before.reason, at: before.at, reused: true };
      }

      const id = `snap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const at = new Date().toISOString();
      await sql`insert into snapshots (id, workflow_id, name, workflow, reason, at)
                values (${id}, ${workflowId}, ${name}, ${JSON.stringify(workflow)}::jsonb, ${reason}, ${at})`;
      return { id, workflowId, name, workflow, reason, at };
    },

    /** What the history is costing, so it is seen rather than discovered. */
    async storageReport() {
      const rows = await sql`select
          (select count(*) from snapshots) as snapshots,
          (select coalesce(sum(pg_column_size(workflow)), 0) from snapshots) as snapshot_bytes,
          (select count(*) from chat_sessions) as sessions,
          (select count(*) from findings) as findings`;
      const r = rows[0] ?? {};
      return {
        snapshots: Number(r.snapshots ?? 0),
        approxBytes: Number(r.snapshot_bytes ?? 0),
        sessions: Number(r.sessions ?? 0),
        findings: Number(r.findings ?? 0),
      };
    },
    async listSnapshots(workflowId) {
      const rows = workflowId
        ? await sql`select id, workflow_id, name, reason, at from snapshots where workflow_id = ${workflowId} order by at desc, seq desc limit 100`
        : await sql`select id, workflow_id, name, reason, at from snapshots order by at desc, seq desc limit 100`;
      return rows.map((r) => ({ id: r.id, workflowId: r.workflow_id, name: r.name, reason: r.reason, at: r.at }));
    },
    async getSnapshot(id) {
      const rows = await sql`select * from snapshots where id = ${id}`;
      const r = rows[0];
      return r ? { id: r.id, workflowId: r.workflow_id, name: r.name, workflow: r.workflow, reason: r.reason, at: r.at } : null;
    },

    // ---- findings
    async addFinding(f) {
      const id = `find_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const at = new Date().toISOString();
      await sql`insert into findings (id, at, status, data) values (${id}, ${at}, 'open', ${JSON.stringify(f)}::jsonb)`;
      return { id, at, status: 'open', ...f };
    },
    async listFindings({ status = null } = {}) {
      const rows = status
        ? await sql`select * from findings where status = ${status} order by at desc, seq desc limit 100`
        : await sql`select * from findings order by at desc, seq desc limit 100`;
      return rows.map((r) => ({ id: r.id, at: r.at, status: r.status, ...r.data }));
    },
    async updateFinding(id, patch) {
      if (patch.status) await sql`update findings set status = ${patch.status} where id = ${id}`;
      const rows = await sql`select * from findings where id = ${id}`;
      const r = rows[0];
      return r ? { id: r.id, at: r.at, status: r.status, ...r.data } : null;
    },

    // ---- jobs
    async saveJob(job) {
      await sql`insert into jobs (id, data) values (${job.id}, ${JSON.stringify(job)}::jsonb)
                on conflict (id) do update set data = excluded.data`;
      return job;
    },
    async getJob(id) {
      const rows = await sql`select data from jobs where id = ${id}`;
      return rows[0]?.data ?? null;
    },

    // ---- chat sessions
    async getSession(id) {
      const rows = await sql`select messages from chat_sessions where id = ${id}`;
      return { id, messages: rows[0]?.messages ?? [] };
    },
    async saveSession(session) {
      await sql`insert into chat_sessions (id, messages, updated_at)
                values (${session.id}, ${JSON.stringify(session.messages ?? [])}::jsonb, now())
                on conflict (id) do update set messages = excluded.messages, updated_at = now()`;
      return session;
    },

    /**
     * Append in one statement, so two turns arriving together both survive.
     *
     * The concatenation, the trim to the last `limit` and the write are a
     * single UPDATE: Postgres takes a row lock for it, so the second turn's
     * append sees the first turn's rows rather than the history it read a
     * second ago. Doing this as select-then-write in JavaScript is what lost a
     * message every time two were sent at once.
     */
    async appendSession(id, added, { limit = 40 } = {}) {
      const rows = await sql`
        insert into chat_sessions (id, messages, updated_at)
        values (${id}, ${JSON.stringify(added ?? [])}::jsonb, now())
        on conflict (id) do update set
          messages = (
            with joined as (
              select value, row_number() over () as rn
              from jsonb_array_elements(chat_sessions.messages || excluded.messages)
            )
            select coalesce(jsonb_agg(value order by rn), '[]'::jsonb)
            from joined
            where rn > (select count(*) from joined) - ${limit}
          ),
          updated_at = now()
        returning messages`;
      return { id, messages: rows[0]?.messages ?? [] };
    },

    // ---- tokens (retired, never deleted)
    async listTokens() {
      const rows = await sql`select id, label, created_at, retired_at from api_tokens order by created_at desc`;
      return rows.map((r) => ({ id: r.id, label: r.label, createdAt: r.created_at, retiredAt: r.retired_at }));
    },
    async addToken(t) {
      await sql`insert into api_tokens (id, hash, label, created_at) values (${t.id}, ${t.hash}, ${t.label}, now())`;
      return t;
    },
    async findTokenByHash(hash) {
      const rows = await sql`select id, label from api_tokens where hash = ${hash} and retired_at is null`;
      return rows[0] ?? null;
    },
    async retireToken(id) {
      const rows = await sql`update api_tokens set retired_at = now() where id = ${id} returning id, label, retired_at`;
      return rows[0] ?? null;
    },

    // ---- cursors
    async getCursor(name) {
      return kvGet(`cursor:${name}`);
    },
    async setCursor(name, value) {
      return kvSet(`cursor:${name}`, value);
    },
  };
}
