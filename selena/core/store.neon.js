/**
 * The durable store: Neon Postgres over HTTP, which works from a serverless
 * function without a connection pool.
 *
 * Two things this file does differently from the memory store, both because
 * serverless runs many processes at once:
 *
 *   - Every mutation is a SINGLE statement. Read-then-write across two
 *     statements loses data when two invocations overlap, and loses it
 *     silently: no error, no conflict, just one update gone. `withLock` in
 *     core/queue.js only serialises within one process, so it cannot help here.
 *   - Version numbers are incremented by the database (`version + 1` inside
 *     the upsert) rather than computed in JS from a value we read earlier.
 *
 * There is no DELETE in this file, and there never will be. Findings are
 * superseded or archived; every version is appended to selena_finding_versions
 * and kept.
 */

import { clampNumber, monthKey, nowIso, sumFinite } from './util.js';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS selena_kv (
     k text PRIMARY KEY,
     v jsonb NOT NULL,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS selena_spend (
     seq bigserial PRIMARY KEY,
     kind text NOT NULL,
     model text,
     label text,
     input_tokens bigint NOT NULL DEFAULT 0,
     output_tokens bigint NOT NULL DEFAULT 0,
     thinking_tokens bigint NOT NULL DEFAULT 0,
     cached_tokens bigint NOT NULL DEFAULT 0,
     searches integer NOT NULL DEFAULT 0,
     usd numeric(12,6) NOT NULL DEFAULT 0,
     at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS selena_spend_at ON selena_spend (at DESC)`,
  `CREATE TABLE IF NOT EXISTS selena_findings (
     id text PRIMARY KEY,
     watch_id text,
     status text NOT NULL DEFAULT 'active',
     strength smallint NOT NULL DEFAULT 1,
     score smallint NOT NULL DEFAULT 0,
     buildable text,
     dedup_key text,
     found_at timestamptz NOT NULL DEFAULT now(),
     last_verified_at timestamptz NOT NULL DEFAULT now(),
     handed_to_jason_at timestamptz,
     version integer NOT NULL DEFAULT 1,
     doc jsonb NOT NULL,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS selena_findings_rank ON selena_findings (status, strength DESC, score DESC)`,
  `CREATE TABLE IF NOT EXISTS selena_finding_versions (
     seq bigserial PRIMARY KEY,
     id text NOT NULL,
     version integer NOT NULL,
     doc jsonb NOT NULL,
     at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS selena_finding_versions_id ON selena_finding_versions (id, version DESC)`,
  `CREATE TABLE IF NOT EXISTS selena_watches (
     id text PRIMARY KEY,
     doc jsonb NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS selena_seen (
     watch_id text NOT NULL,
     dedup_key text NOT NULL,
     signature text NOT NULL,
     first_seen_at timestamptz NOT NULL DEFAULT now(),
     last_seen_at timestamptz NOT NULL DEFAULT now(),
     times_seen integer NOT NULL DEFAULT 1,
     PRIMARY KEY (watch_id, dedup_key)
   )`,
  `CREATE TABLE IF NOT EXISTS selena_activity (
     seq bigserial PRIMARY KEY,
     at timestamptz NOT NULL DEFAULT now(),
     doc jsonb NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS selena_activity_at ON selena_activity (seq DESC)`,
  `CREATE TABLE IF NOT EXISTS selena_runs (
     seq bigserial PRIMARY KEY,
     at timestamptz NOT NULL DEFAULT now(),
     doc jsonb NOT NULL
   )`,
];

export async function createNeonStore({ databaseUrl, now = nowIso, sqlFactory = null }) {
  let sql;
  if (sqlFactory) {
    sql = sqlFactory(databaseUrl);
  } else {
    const { neon } = await import('@neondatabase/serverless');
    sql = neon(databaseUrl);
  }

  for (const statement of SCHEMA) {
    await sql(statement);
  }

  const iso = (v) => (v instanceof Date ? v.toISOString() : v ?? null);

  return {
    kind: 'neon',
    durable: true,
    note: null,

    async ready() {
      const [row] = await sql`SELECT 1 AS ok`;
      return row?.ok === 1;
    },

    async getKv(k) {
      const rows = await sql`SELECT v FROM selena_kv WHERE k = ${k}`;
      return rows[0]?.v ?? null;
    },
    async setKv(k, v) {
      await sql`
        INSERT INTO selena_kv (k, v, updated_at) VALUES (${k}, ${JSON.stringify(v)}::jsonb, now())
        ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v, updated_at = now()`;
      return v;
    },

    // ---- spend ----------------------------------------------------------
    async addSpend(entry) {
      await sql`
        INSERT INTO selena_spend (kind, model, label, input_tokens, output_tokens, thinking_tokens, cached_tokens, searches, usd, at)
        VALUES (
          ${entry.kind ?? 'model'}, ${entry.model ?? null}, ${entry.label ?? null},
          ${clampNumber(entry.inputTokens, 0, 1e12, 0)}, ${clampNumber(entry.outputTokens, 0, 1e12, 0)},
          ${clampNumber(entry.thinkingTokens, 0, 1e12, 0)}, ${clampNumber(entry.cachedTokens, 0, 1e12, 0)},
          ${clampNumber(entry.searches, 0, 1e6, 0)}, ${clampNumber(entry.usd, 0, 1e6, 0)},
          ${entry.at ?? now()}
        )`;
    },
    async getMonthlySpend() {
      const m = `${monthKey(now())}-01`;
      const rows = await sql`
        SELECT COALESCE(SUM(usd), 0) AS total FROM selena_spend
        WHERE at >= ${m}::timestamptz AND at < (${m}::timestamptz + interval '1 month')`;
      return clampNumber(rows[0]?.total, 0, 1e9, 0);
    },
    async getSearchCounts() {
      const rows = await sql`
        SELECT
          COALESCE(SUM(searches) FILTER (WHERE at >= date_trunc('day', now())), 0) AS today,
          COALESCE(SUM(searches) FILTER (WHERE at >= date_trunc('month', now())), 0) AS month
        FROM selena_spend WHERE kind = 'search'`;
      return { today: clampNumber(rows[0]?.today, 0, 1e9, 0), month: clampNumber(rows[0]?.month, 0, 1e9, 0) };
    },
    async recentSpend(limit = 100) {
      const rows = await sql`SELECT * FROM selena_spend ORDER BY seq DESC LIMIT ${clampNumber(limit, 1, 1000, 100)}`;
      return rows.map((r) => ({
        kind: r.kind,
        model: r.model,
        label: r.label,
        inputTokens: Number(r.input_tokens),
        outputTokens: Number(r.output_tokens),
        thinkingTokens: Number(r.thinking_tokens),
        cachedTokens: Number(r.cached_tokens),
        searches: Number(r.searches),
        usd: Number(r.usd),
        at: iso(r.at),
      }));
    },
    async spendByWatch() {
      const rows = await sql`
        SELECT COALESCE(label, 'unattributed') AS label, COALESCE(SUM(usd), 0) AS usd
        FROM selena_spend GROUP BY 1 ORDER BY 2 DESC LIMIT 100`;
      return rows.map((r) => ({ label: r.label, usd: Number(r.usd) }));
    },

    // ---- findings -------------------------------------------------------
    async putFinding(finding) {
      // One statement. The version is computed by Postgres, so two concurrent
      // invocations produce 1 and 2 rather than both producing 1.
      const rows = await sql`
        INSERT INTO selena_findings (id, watch_id, status, strength, score, buildable, dedup_key, found_at, last_verified_at, handed_to_jason_at, version, doc, updated_at)
        VALUES (
          ${finding.id}, ${finding.watchId ?? null}, ${finding.status ?? 'active'},
          ${clampNumber(finding.evidence?.strength, 1, 5, 1)}, ${clampNumber(finding.verdict?.score, 0, 100, 0)},
          ${finding.buildability?.verdict ?? null}, ${finding.dedupKey ?? null},
          ${finding.foundAt ?? now()}, ${finding.lastVerifiedAt ?? now()}, ${finding.handedToJasonAt ?? null},
          1, ${JSON.stringify(finding)}::jsonb, now()
        )
        ON CONFLICT (id) DO UPDATE SET
          watch_id = EXCLUDED.watch_id,
          status = EXCLUDED.status,
          strength = EXCLUDED.strength,
          score = EXCLUDED.score,
          buildable = EXCLUDED.buildable,
          dedup_key = EXCLUDED.dedup_key,
          last_verified_at = EXCLUDED.last_verified_at,
          handed_to_jason_at = COALESCE(EXCLUDED.handed_to_jason_at, selena_findings.handed_to_jason_at),
          version = selena_findings.version + 1,
          doc = EXCLUDED.doc,
          updated_at = now()
        RETURNING version, handed_to_jason_at`;

      const version = Number(rows[0]?.version ?? 1);
      // The COALESCE above deliberately keeps a handoff stamp that a later
      // write does not carry — a re-verification rewrites the finding and must
      // not erase the fact that it was sent to Jason. But that made the COLUMN
      // and the stored DOCUMENT disagree, and different callers read different
      // ones, so countFindings() said "1 handed over" while getFinding() said
      // null. The column is authoritative; every read overlays it.
      const stored = { ...finding, handedToJasonAt: iso(rows[0]?.handed_to_jason_at) ?? null, version, updatedAt: now() };
      // History is appended after the fact and never pruned.
      await sql`INSERT INTO selena_finding_versions (id, version, doc, at) VALUES (${finding.id}, ${version}, ${JSON.stringify(stored)}::jsonb, now())`;
      return stored;
    },
    async getFinding(id) {
      const rows = await sql`SELECT doc, version, handed_to_jason_at FROM selena_findings WHERE id = ${id}`;
      // handed_to_jason_at is read from the column, not the document — see the
      // note in putFinding. The column survives a rewrite that omits it.
      return rows[0]
        ? { ...rows[0].doc, handedToJasonAt: iso(rows[0].handed_to_jason_at) ?? null, version: Number(rows[0].version) }
        : null;
    },
    async listFindings({ status = null, watchId = null, minStrength = 0, buildable = null, limit = 200 } = {}) {
      const rows = await sql`
        SELECT doc, version, handed_to_jason_at FROM selena_findings
        WHERE (${status}::text IS NULL OR status = ${status})
          AND (${watchId}::text IS NULL OR watch_id = ${watchId})
          AND (${buildable}::text IS NULL OR buildable = ${buildable})
          AND strength >= ${clampNumber(minStrength, 0, 5, 0)}
        ORDER BY strength DESC, score DESC, found_at DESC
        LIMIT ${clampNumber(limit, 1, 1000, 200)}`;
      return rows.map((r) => ({ ...r.doc, handedToJasonAt: iso(r.handed_to_jason_at) ?? null, version: Number(r.version) }));
    },
    async findingVersions(id) {
      const rows = await sql`SELECT doc, version, at FROM selena_finding_versions WHERE id = ${id} ORDER BY version ASC`;
      return rows.map((r) => ({ ...r.doc, version: Number(r.version), at: iso(r.at) }));
    },
    async countFindings() {
      const rows = await sql`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'active') AS active,
          COUNT(*) FILTER (WHERE status = 'archived') AS archived,
          COUNT(*) FILTER (WHERE status = 'superseded') AS superseded,
          COUNT(*) FILTER (WHERE handed_to_jason_at IS NOT NULL) AS handed,
          COUNT(*) FILTER (WHERE strength = 1) AS s1,
          COUNT(*) FILTER (WHERE strength = 2) AS s2,
          COUNT(*) FILTER (WHERE strength = 3) AS s3,
          COUNT(*) FILTER (WHERE strength = 4) AS s4,
          COUNT(*) FILTER (WHERE strength = 5) AS s5
        FROM selena_findings`;
      const r = rows[0] ?? {};
      return {
        total: Number(r.total ?? 0),
        active: Number(r.active ?? 0),
        archived: Number(r.archived ?? 0),
        superseded: Number(r.superseded ?? 0),
        handedToJason: Number(r.handed ?? 0),
        byStrength: { 1: Number(r.s1 ?? 0), 2: Number(r.s2 ?? 0), 3: Number(r.s3 ?? 0), 4: Number(r.s4 ?? 0), 5: Number(r.s5 ?? 0) },
      };
    },

    // ---- watches --------------------------------------------------------
    async putWatch(watch) {
      await sql`
        INSERT INTO selena_watches (id, doc, created_at, updated_at)
        VALUES (${watch.id}, ${JSON.stringify(watch)}::jsonb, ${watch.createdAt ?? now()}, now())
        ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc, updated_at = now()`;
      return watch;
    },
    async getWatch(id) {
      const rows = await sql`SELECT doc FROM selena_watches WHERE id = ${id}`;
      return rows[0]?.doc ?? null;
    },
    async listWatches() {
      const rows = await sql`SELECT doc FROM selena_watches ORDER BY created_at ASC`;
      return rows.map((r) => r.doc);
    },

    // ---- watch memory ---------------------------------------------------
    async getSeen(watchId, dedupKey) {
      const rows = await sql`SELECT * FROM selena_seen WHERE watch_id = ${watchId} AND dedup_key = ${dedupKey}`;
      const r = rows[0];
      return r
        ? { watchId: r.watch_id, dedupKey: r.dedup_key, signature: r.signature, firstSeenAt: iso(r.first_seen_at), lastSeenAt: iso(r.last_seen_at), timesSeen: Number(r.times_seen) }
        : null;
    },
    async markSeen(watchId, dedupKey, signature) {
      const rows = await sql`
        INSERT INTO selena_seen (watch_id, dedup_key, signature, first_seen_at, last_seen_at, times_seen)
        VALUES (${watchId}, ${dedupKey}, ${signature}, now(), now(), 1)
        ON CONFLICT (watch_id, dedup_key) DO UPDATE SET
          signature = EXCLUDED.signature,
          last_seen_at = now(),
          times_seen = selena_seen.times_seen + 1
        RETURNING *`;
      const r = rows[0];
      return { watchId: r.watch_id, dedupKey: r.dedup_key, signature: r.signature, firstSeenAt: iso(r.first_seen_at), lastSeenAt: iso(r.last_seen_at), timesSeen: Number(r.times_seen) };
    },
    async seenCount(watchId) {
      const rows = await sql`SELECT COUNT(*) AS n FROM selena_seen WHERE watch_id = ${watchId}`;
      return Number(rows[0]?.n ?? 0);
    },

    // ---- activity and runs ----------------------------------------------
    async addActivity(event) {
      await sql`INSERT INTO selena_activity (at, doc) VALUES (${event.at ?? now()}, ${JSON.stringify(event)}::jsonb)`;
    },
    async recentActivity(limit = 60) {
      const rows = await sql`SELECT at, doc FROM selena_activity ORDER BY seq DESC LIMIT ${clampNumber(limit, 1, 500, 60)}`;
      return rows.map((r) => ({ at: iso(r.at), ...r.doc }));
    },
    async addRun(run) {
      await sql`INSERT INTO selena_runs (at, doc) VALUES (${run.at ?? now()}, ${JSON.stringify(run)}::jsonb)`;
    },
    async recentRuns(limit = 40) {
      const rows = await sql`SELECT at, doc FROM selena_runs ORDER BY seq DESC LIMIT ${clampNumber(limit, 1, 300, 40)}`;
      return rows.map((r) => ({ at: iso(r.at), ...r.doc }));
    },
  };
}

/** Exported for the schema test: proves the shape without needing a database. */
export const SCHEMA_STATEMENTS = SCHEMA;
export const TOTAL_SPEND = (rows) => sumFinite(rows, 'usd');
