/**
 * "It saved" and "it will run at 7am" are different facts.
 *
 * From a real build: a workflow designed correctly, validated, saved, and
 * reported as done — with a placeholder document id and an unset credential.
 * Both were named honestly in the summary, and the workflow still sat in n8n
 * looking exactly like a finished one.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { assessReadiness, summariseReadiness, BLOCKER } from '../core/readiness.js';

const trigger = { id: 't', name: 'Every morning', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0], parameters: {} };
const sheets = (extra = {}) => ({
  id: 's', name: 'Append row', type: 'n8n-nodes-base.googleSheets', typeVersion: 4.5, position: [200, 0],
  parameters: { operation: 'append', documentId: '1AbCdEfReal' }, ...extra,
});

test('a workflow with everything in place is ready', () => {
  const r = assessReadiness(
    { name: 'X', nodes: [trigger, sheets({ credentials: { googleApi: { id: '7', name: 'Google' } } })], connections: {} },
    { credentials: [{ id: '7', name: 'Google', type: 'googleApi' }] },
  );
  assert.equal(r.ready, true, JSON.stringify(r.blockers));
  assert.equal(r.checkedCredentials, true);
  assert.match(summariseReadiness(r), /Nothing is stopping/);
});

test('a node with no credential is named, with the type it needs', () => {
  const r = assessReadiness({ name: 'X', nodes: [trigger, sheets()], connections: {} }, { credentials: [] });
  assert.equal(r.ready, false);
  const blocker = r.blockers.find((b) => b.kind === BLOCKER.MISSING_CREDENTIAL);
  assert.ok(blocker, 'a node with no credential was called ready');
  assert.equal(blocker.node, 'Append row');
  assert.match(blocker.detail, /googleApi/);
  assert.match(blocker.fix, /open "Append row"/);
});

test('a credential pointing at an id that does not exist is caught', () => {
  const r = assessReadiness(
    { name: 'X', nodes: [trigger, sheets({ credentials: { googleApi: { id: '99', name: 'Deleted' } } })], connections: {} },
    { credentials: [{ id: '7', type: 'googleApi' }] },
  );
  assert.equal(r.blockers.some((b) => b.kind === BLOCKER.UNKNOWN_CREDENTIAL), true);
});

test('without the real credential list it says it did not look', () => {
  const r = assessReadiness({ name: 'X', nodes: [trigger, sheets({ credentials: { googleApi: { id: '99' } } })], connections: {} });
  assert.equal(r.checkedCredentials, false, 'it implied it had checked the ids against the instance');
  assert.equal(r.blockers.some((b) => b.kind === BLOCKER.UNKNOWN_CREDENTIAL), false);
});

test('placeholders left behind are found, and real values are not', () => {
  const withPlaceholders = {
    name: 'X',
    nodes: [
      trigger,
      { ...sheets(), parameters: { documentId: '<your sheet id>', sheetName: 'Sheet1' }, credentials: { googleApi: { id: '7' } } },
      { id: 'h', name: 'Call API', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [400, 0], parameters: { url: 'https://api.example.com/PASTE_HERE' } },
    ],
    connections: {},
  };
  const found = assessReadiness(withPlaceholders, { credentials: [{ id: '7', type: 'googleApi' }] }).blockers.filter((b) => b.kind === BLOCKER.PLACEHOLDER);
  assert.equal(found.length, 2, `expected two placeholders, found ${found.length}`);
  assert.match(found[0].detail, /your sheet id/);

  // The important half: a false positive tells someone their working workflow
  // is broken, which is the one thing this project may never do.
  const real = {
    name: 'X',
    nodes: [
      trigger,
      { ...sheets(), parameters: { documentId: '1BxiMVs0XRA5nFMdKvBd', sheetName: 'Leads', formula: '={{ $json.name }}' }, credentials: { googleApi: { id: '7' } } },
      { id: 'h', name: 'Call API', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [400, 0], parameters: { url: 'https://places.googleapis.com/v1/places:searchText', text: 'businesses in 30246 Halmstad' } },
    ],
    connections: {},
  };
  const falsePositives = assessReadiness(real, { credentials: [{ id: '7', type: 'googleApi' }] }).blockers.filter((b) => b.kind === BLOCKER.PLACEHOLDER);
  assert.deepEqual(falsePositives.map((b) => b.detail), [], 'a real value was called a placeholder');
});

test('a workflow nothing starts, and a node switched off, are both blockers', () => {
  const noTrigger = assessReadiness({ name: 'X', nodes: [sheets({ credentials: { googleApi: { id: '7' } } })], connections: {} }, { credentials: [{ id: '7', type: 'googleApi' }] });
  assert.equal(noTrigger.blockers.some((b) => b.kind === BLOCKER.NO_TRIGGER), true);

  const disabled = assessReadiness(
    { name: 'X', nodes: [trigger, sheets({ disabled: true, credentials: { googleApi: { id: '7' } } })], connections: {} },
    { credentials: [{ id: '7', type: 'googleApi' }] },
  );
  assert.equal(disabled.blockers.some((b) => b.kind === BLOCKER.DISABLED), true);
});

test('junk does not make the check throw', () => {
  for (const wf of [null, {}, { nodes: null }, { nodes: [null, 7, 'x'] }, { nodes: [{ name: 'A' }] }]) {
    assert.doesNotThrow(() => assessReadiness(wf), `threw on ${JSON.stringify(wf)}`);
  }
});

test('an HTTP Request node set to authenticate with nothing attached is caught', () => {
  // The node the Halmstad build left unset. HTTP Request declares no credential
  // types in the catalog — it picks one at runtime from its own parameters — so
  // a catalog-only check would have missed the exact case it was written for.
  const places = {
    id: 'p', name: 'Google Places Search', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [200, 0],
    parameters: {
      url: 'https://places.googleapis.com/v1/places:searchText',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
    },
  };
  const r = assessReadiness({ name: 'X', nodes: [trigger, places], connections: {} }, { credentials: [] });
  const blocker = r.blockers.find((b) => b.kind === BLOCKER.MISSING_CREDENTIAL);
  assert.ok(blocker, 'a node asking for httpHeaderAuth with nothing attached was called ready');
  assert.equal(blocker.node, 'Google Places Search');
  assert.match(blocker.detail, /httpHeaderAuth/);

  // Attached and real: clean.
  const done = assessReadiness(
    { name: 'X', nodes: [trigger, { ...places, credentials: { httpHeaderAuth: { id: '3', name: 'Places key' } } }], connections: {} },
    { credentials: [{ id: '3', type: 'httpHeaderAuth' }] },
  );
  assert.equal(done.ready, true, JSON.stringify(done.blockers));
});

test('a node that deliberately needs no auth is left alone', () => {
  // The false positive that would matter most: most HTTP Request nodes call
  // open APIs and want no credential at all.
  const open = {
    id: 'h', name: 'Public API', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [200, 0],
    parameters: { url: 'https://api.usaspending.gov/api/v2/', authentication: 'none' },
  };
  const bare = { ...open, id: 'h2', name: 'No auth mentioned', parameters: { url: 'https://example.org/feed.json' } };
  const r = assessReadiness({ name: 'X', nodes: [trigger, open, bare], connections: {} }, { credentials: [] });
  assert.deepEqual(r.blockers.filter((b) => b.kind === BLOCKER.MISSING_CREDENTIAL), [], 'a node that wants no credential was told it needs one');
});
