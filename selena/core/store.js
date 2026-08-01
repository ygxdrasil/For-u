/**
 * Persistence, behind a narrow interface so swapping the backend is an
 * afternoon rather than a rebuild.
 *
 *   MemoryStore — no setup. A Vercel function forgets it between cold starts,
 *                 so the HUD says so plainly rather than pretending state is
 *                 durable. Good enough to see Selena work with no keys at all.
 *   NeonStore   — DATABASE_URL set. Durable, free tier, and the only mode in
 *                 which watches and the headless endpoint mean anything.
 *
 * NOTHING HERE EVER DELETES. Not a finding, not a version, not a watch. A
 * finding rejected in March is evidence when the same demand turns up in
 * September, and a store with a delete path grows one by accident. Findings
 * are superseded or archived; every prior version is kept. There is no DELETE
 * statement anywhere in this codebase and tests/no-delete.test.js fails the
 * build if one appears.
 */

import { clampNumber, monthKey, nowIso, randomId, sumFinite } from './util.js';
import { withLock } from './queue.js';

const copyOf = (v) => (v === undefined ? v : structuredClone(v));

/** Compare two findings for "has this actually changed?" reporting. */
export function findingSignature(finding) {
  return JSON.stringify({
    strength: finding?.evidence?.strength ?? 0,
    paying: (finding?.evidence?.paying ?? []).map((p) => `${p.url}:${p.price}${p.currency ?? ''}`).sort(),
    complaints: (finding?.evidence?.complaints ?? []).map((c) => c.url).sort(),
    agreement: finding?.evidence?.agreement?.subject ?? null,
    buildable: finding?.buildability?.verdict ?? null,
    status: finding?.status ?? 'active',
  });
}

export function createMemoryStore({ now = nowIso } = {}) {
  // Everything in and out is copied. Handing a caller the live object means a
  // record they are holding changes under them later, and any code that edits
  // what it was given silently rewrites the store. The Postgres store cannot
  // do that, so neither may this one, or the two behave differently.
  const kv = new Map();
  const spend = [];
  const findings = new Map(); // id -> finding
  const versions = []; // append-only history
  const watches = new Map();
  const seen = new Map(); // `${watchId}:${dedupKey}` -> {signature, firstSeenAt, lastSeenAt, timesSeen}
  const activity = [];
  const runs = [];

  return {
    kind: 'memory',
    durable: false,
    note: 'In memory only. This resets whenever the serverless function cold-starts, so watches cannot remember what they already reported. Set DATABASE_URL for durable storage.',

    async ready() {
      return true;
    },

    async getKv(k) {
      return copyOf(kv.get(k) ?? null);
    },
    async setKv(k, v) {
      kv.set(k, copyOf(v));
      return v;
    },

    // ---- spend ----------------------------------------------------------
    async addSpend(entry) {
      spend.push(copyOf({ ...entry, usd: clampNumber(entry.usd, 0, 1e6, 0) }));
    },
    async getMonthlySpend() {
      const m = monthKey(now());
      return sumFinite(spend.filter((s) => String(s.at).startsWith(m)), 'usd');
    },
    async getSearchCounts() {
      const today = String(now()).slice(0, 10);
      const m = monthKey(now());
      const searchRows = spend.filter((s) => s.kind === 'search');
      return {
        today: sumFinite(searchRows.filter((s) => String(s.at).startsWith(today)), 'searches'),
        month: sumFinite(searchRows.filter((s) => String(s.at).startsWith(m)), 'searches'),
      };
    },
    async recentSpend(limit = 100) {
      return copyOf(spend.slice(-clampNumber(limit, 1, 1000, 100)).reverse());
    },
    async spendByWatch() {
      const totals = new Map();
      for (const s of spend) {
        const key = s.label ?? 'unattributed';
        totals.set(key, (totals.get(key) ?? 0) + clampNumber(s.usd, 0, 1e6, 0));
      }
      return [...totals.entries()].map(([label, usd]) => ({ label, usd })).sort((a, b) => b.usd - a.usd);
    },

    // ---- findings -------------------------------------------------------
    async putFinding(finding) {
      // Serialised per finding id: two watches finishing together both read,
      // both append, and one write is lost with no error anywhere.
      return withLock(`finding:${finding.id}`, async () => {
        const previous = findings.get(finding.id) ?? null;
        const stored = copyOf({
          ...finding,
          // Never un-hand a finding. A re-verification rewrites the record
          // without the handoff stamp, and losing it here would mean the HUD
          // forgot you had already sent something to Jason. The Postgres store
          // does the same thing with COALESCE; the two must not disagree.
          handedToJasonAt: finding.handedToJasonAt ?? previous?.handedToJasonAt ?? null,
          updatedAt: now(),
          version: (previous?.version ?? 0) + 1,
        });
        findings.set(finding.id, stored);
        versions.push(copyOf(stored)); // append-only history; never pruned
        return copyOf(stored);
      });
    },
    async getFinding(id) {
      return copyOf(findings.get(id) ?? null);
    },
    async listFindings({ status = null, watchId = null, minStrength = 0, buildable = null, limit = 200 } = {}) {
      let list = [...findings.values()];
      if (status) list = list.filter((f) => f.status === status);
      if (watchId) list = list.filter((f) => f.watchId === watchId);
      if (buildable) list = list.filter((f) => f.buildability?.verdict === buildable);
      list = list.filter((f) => (f.evidence?.strength ?? 0) >= clampNumber(minStrength, 0, 5, 0));
      list.sort(
        (a, b) =>
          (b.evidence?.strength ?? 0) - (a.evidence?.strength ?? 0) ||
          (b.verdict?.score ?? 0) - (a.verdict?.score ?? 0) ||
          String(b.foundAt).localeCompare(String(a.foundAt)),
      );
      return copyOf(list.slice(0, clampNumber(limit, 1, 1000, 200)));
    },
    async findingVersions(id) {
      return copyOf(versions.filter((v) => v.id === id));
    },
    async countFindings() {
      const all = [...findings.values()];
      const byStrength = {};
      for (let i = 1; i <= 5; i += 1) byStrength[i] = all.filter((f) => f.evidence?.strength === i).length;
      return {
        total: all.length,
        active: all.filter((f) => f.status === 'active').length,
        archived: all.filter((f) => f.status === 'archived').length,
        superseded: all.filter((f) => f.status === 'superseded').length,
        handedToJason: all.filter((f) => f.handedToJasonAt).length,
        byStrength,
      };
    },

    // ---- watches --------------------------------------------------------
    async putWatch(watch) {
      return withLock(`watch:${watch.id}`, async () => {
        const stored = copyOf({ ...watch, updatedAt: now() });
        watches.set(watch.id, stored);
        return copyOf(stored);
      });
    },
    async getWatch(id) {
      return copyOf(watches.get(id) ?? null);
    },
    async listWatches() {
      return copyOf([...watches.values()].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))));
    },

    // ---- watch memory: what has already been reported -------------------
    async getSeen(watchId, dedupKey) {
      return copyOf(seen.get(`${watchId}:${dedupKey}`) ?? null);
    },
    async markSeen(watchId, dedupKey, signature) {
      return withLock(`seen:${watchId}:${dedupKey}`, async () => {
        const key = `${watchId}:${dedupKey}`;
        const existing = seen.get(key);
        const record = existing
          ? { ...existing, signature, lastSeenAt: now(), timesSeen: existing.timesSeen + 1 }
          : { watchId, dedupKey, signature, firstSeenAt: now(), lastSeenAt: now(), timesSeen: 1 };
        seen.set(key, record);
        return copyOf(record);
      });
    },
    async seenCount(watchId) {
      return [...seen.values()].filter((s) => s.watchId === watchId).length;
    },

    // ---- activity feed --------------------------------------------------
    async addActivity(event) {
      activity.push(copyOf({ id: randomId('ev'), at: now(), ...event }));
      // The feed is a rolling window for the HUD, not the archive. Findings
      // and spend are the archive, and neither is touched here.
      if (activity.length > 500) activity.splice(0, activity.length - 500);
    },
    async recentActivity(limit = 60) {
      return copyOf(activity.slice(-clampNumber(limit, 1, 500, 60)).reverse());
    },

    // ---- research runs --------------------------------------------------
    async addRun(run) {
      runs.push(copyOf({ ...run }));
      if (runs.length > 300) runs.splice(0, runs.length - 300);
    },
    async recentRuns(limit = 40) {
      return copyOf(runs.slice(-clampNumber(limit, 1, 300, 40)).reverse());
    },
  };
}

/**
 * The in-memory store is a PROCESS singleton, not a per-call object.
 *
 * Every route calls createStore() on every request. Building a fresh memory
 * store each time meant nothing survived even between two requests of the same
 * warm instance: you could create a watch, and the very next call would say it
 * did not exist. With no DATABASE_URL set — which is how a first deploy runs —
 * the whole thing looked broken rather than merely non-durable.
 *
 * Sharing it across the process fixes that and is honest about what it is: it
 * still dies with the instance, and store.durable is still false, and the HUD
 * still says so in a banner.
 *
 * createMemoryStore() itself stays a plain factory, because every test wants
 * its own isolated store.
 */
let sharedMemoryStore = null;

function memorySingleton(now) {
  if (!sharedMemoryStore) sharedMemoryStore = createMemoryStore({ now });
  return sharedMemoryStore;
}

/** Test seam: forget the shared instance. */
export function resetMemorySingleton() {
  sharedMemoryStore = null;
}

/**
 * Picks the durable store when DATABASE_URL is set, and says why when it
 * cannot. A silent fall back to memory is how you discover in week three that
 * nothing has been saved since the first deploy.
 */
export async function createStore({ databaseUrl = process.env.DATABASE_URL, now = nowIso } = {}) {
  if (!databaseUrl) return memorySingleton(now);
  try {
    const { createNeonStore } = await import('./store.neon.js');
    return await createNeonStore({ databaseUrl, now });
  } catch (err) {
    const fallback = memorySingleton(now);
    fallback.note = `DATABASE_URL is set but the database could not be opened (${err.message}). Running in memory, so nothing is being saved durably. This is not a healthy state.`;
    fallback.degraded = true;
    return fallback;
  }
}
