import test from 'node:test';
import assert from 'node:assert/strict';

import { createNeonStore, SCHEMA_STATEMENTS } from '../core/store.neon.js';

/**
 * A driver double that behaves like @neondatabase/serverless, including the
 * parts that REFUSE things.
 *
 * This exists because the Postgres store shipped calling `sql(statement)` for
 * its schema. The real driver rejects that outright — "This function can now
 * be called only as a tagged-template function" — so the very first request
 * against a real database fell back to memory and reported storage as not
 * durable. It got that far because the original test double accepted a plain
 * call as well as a tagged template. A double more permissive than the real
 * thing does not test the real thing; it tests the double.
 *
 * These run in the normal suite with no database and no extra dependency, so
 * the mistake cannot come back unnoticed. scripts/dbtest.mjs goes further and
 * runs every statement against a real Postgres.
 */
function strictNeonDouble({ withQuery = true } = {}) {
  const calls = { tagged: [], query: [] };

  const sql = async function sql(strings, ...values) {
    if (typeof strings === 'string') {
      throw new Error(
        'This function can now be called only as a tagged-template function: sql`SELECT ${value}`, not sql("SELECT $1", [value], options). For a conventional function call with value placeholders ($1, $2, etc.), use sql.query("SELECT $1", [value], options).',
      );
    }
    calls.tagged.push({ text: strings.join('?'), values });
    return [];
  };

  if (withQuery) {
    sql.query = async (text, params = []) => {
      calls.query.push({ text, params });
      return [];
    };
  }

  return { sql, calls };
}

test('the schema is applied through sql.query, not a plain call', async () => {
  const { sql, calls } = strictNeonDouble();
  const store = await createNeonStore({ databaseUrl: 'postgres://fake', sqlFactory: () => sql });

  assert.equal(store.kind, 'neon');
  assert.equal(store.durable, true);
  assert.equal(
    calls.query.length,
    SCHEMA_STATEMENTS.length,
    'every schema statement must go through sql.query() — a plain sql(text) call is refused by the real driver',
  );
  assert.equal(calls.tagged.length, 0, 'schema statements carry no values, so none of them is a tagged template');
  assert.ok(calls.query.some((c) => /CREATE TABLE IF NOT EXISTS selena_findings/.test(c.text)));
});

test('a driver with no .query is rejected loudly at startup', async () => {
  // Better to fail on the first request with a sentence that names the problem
  // than to fall back to memory and quietly stop saving anything.
  const { sql } = strictNeonDouble({ withQuery: false });
  await assert.rejects(
    () => createNeonStore({ databaseUrl: 'postgres://fake', sqlFactory: () => sql }),
    /no \.query\(\) method/,
  );
});

test('every value-carrying statement is a tagged template, so values are parameterised', async () => {
  const { sql, calls } = strictNeonDouble();
  const store = await createNeonStore({ databaseUrl: 'postgres://fake', sqlFactory: () => sql });

  await store.getKv('some-key');
  await store.getWatch('w1');
  await store.getSeen('w1', 'd1');

  assert.equal(calls.tagged.length, 3, 'reads with values must go through the tagged template');
  // Values travel separately from the SQL text. If any of these had been
  // concatenated into the statement, the injection surface would be real.
  assert.deepEqual(calls.tagged[0].values, ['some-key']);
  assert.deepEqual(calls.tagged[2].values, ['w1', 'd1']);
  for (const call of calls.tagged) {
    assert.ok(!call.text.includes('some-key'), 'a value must never appear inside the SQL text');
  }
});

test('the schema statements are all idempotent, because every cold start reruns them', () => {
  for (const statement of SCHEMA_STATEMENTS) {
    assert.match(
      statement,
      /IF NOT EXISTS/,
      `every schema statement must be safe to run again on a warm database:\n${statement.slice(0, 80)}`,
    );
  }
});
