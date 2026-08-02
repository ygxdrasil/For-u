/**
 * The brakes.
 *
 * She can now spend money and hand work to Jason with nobody watching. Every
 * limit on that is a number in core/autonomy.js, and every test here is a way
 * that number could fail to hold. These are not tests of a feature; they are
 * tests of the reasons the feature is safe to have.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createMemoryStore, resetMemorySingleton } from '../core/store.js';
import {
  normalizeAutonomy,
  readAutonomy,
  updateAutonomy,
  arm,
  disarm,
  recordRun,
  recordHandoff,
  mayHandOff,
  shouldRoam,
  unattendedCeiling,
  unattendedHeadroom,
  handoffsInWindow,
  describeAutonomy,
  DEFAULTS,
} from '../core/autonomy.js';

function freshStore() {
  resetMemorySingleton();
  return createMemoryStore();
}

const finding = (over = {}) => ({
  id: 'f1',
  status: 'active',
  demand: { oneLine: 'invoice chasing for trades', whoHasIt: 'one-to-three person plumbing firms' },
  evidence: { strength: 5, hypothesis: false },
  buildability: { verdict: 'jason-can-build' },
  ...over,
});

test('she starts disarmed, and an empty store does not read as armed', async () => {
  // The failure this prevents is the worst one available: a fresh deployment
  // that begins spending on its own before anyone has told it to.
  const store = freshStore();
  const state = await readAutonomy(store);
  assert.equal(state.armed, false);
  assert.equal(state.reserveUsd, DEFAULTS.reserveUsd);
  assert.equal(state.handoffFloor, 5);

  // Garbage in the record must not become "armed" either.
  for (const junk of [null, undefined, 'armed', 42, [], { armed: 'no' }]) {
    const s = normalizeAutonomy(junk);
    assert.equal(typeof s.armed, 'boolean', `${JSON.stringify(junk)} produced a non-boolean armed`);
  }
  // Only a real `true` arms her. "no" and "false" are truthy strings, and a
  // mangled record must fall to off rather than to spending money.
  for (const nearly of ['no', 'false', 'true', 1, 0, {}, [], 'yes']) {
    assert.equal(normalizeAutonomy({ armed: nearly }).armed, false, `${JSON.stringify(nearly)} must not arm her`);
  }
  assert.equal(normalizeAutonomy({ armed: true }).armed, true);
});

test('the reserve is money she cannot touch, whatever the numbers do', () => {
  const s = normalizeAutonomy({ reserveUsd: 2 });
  assert.equal(unattendedCeiling(s, 10), 8);
  assert.equal(unattendedHeadroom(s, { capUsd: 10, spentUsd: 3 }), 5);
  // Spent past her ceiling: zero, never negative, so a bar cannot render
  // backwards and a comparison cannot come out the wrong way.
  assert.equal(unattendedHeadroom(s, { capUsd: 10, spentUsd: 9 }), 0);
  assert.equal(unattendedHeadroom(s, { capUsd: 10, spentUsd: 100 }), 0);
  // A reserve bigger than the cap means she has nothing, not minus something.
  assert.equal(unattendedCeiling(normalizeAutonomy({ reserveUsd: 20 }), 10), 0);
  // NaN and null must not silently become zero-reserve, which would hand her
  // the whole cap. clampNumber treats them as absent and the default applies.
  assert.equal(normalizeAutonomy({ reserveUsd: null }).reserveUsd, DEFAULTS.reserveUsd);
  assert.equal(normalizeAutonomy({ reserveUsd: 'lots' }).reserveUsd, DEFAULTS.reserveUsd);
});

test('unattended handoff needs level 5 and nothing else will do', () => {
  const armed = normalizeAutonomy({ armed: true });

  assert.equal(mayHandOff(armed, finding()).ok, true);

  for (const strength of [1, 2, 3, 4]) {
    const verdict = mayHandOff(armed, finding({ evidence: { strength, hypothesis: strength < 3 } }));
    assert.equal(verdict.ok, false, `level ${strength} must not go unattended`);
    assert.match(verdict.reason, /level 5|hypothesis/);
  }

  // A level-5 flag on something still marked hypothesis is contradictory; the
  // stricter reading wins.
  assert.equal(mayHandOff(armed, finding({ evidence: { strength: 5, hypothesis: true } })).ok, false);

  // Missing evidence entirely reads as zero, not as pass.
  assert.equal(mayHandOff(armed, finding({ evidence: undefined })).ok, false);
  assert.equal(mayHandOff(armed, {}).ok, false);

  // Things she must never re-send or send at all.
  assert.equal(mayHandOff(armed, finding({ handedToJasonAt: '2026-08-01T00:00:00.000Z' })).ok, false);
  assert.equal(mayHandOff(armed, finding({ status: 'archived' })).ok, false);
  assert.equal(mayHandOff(armed, finding({ buildability: { verdict: 'jason-cannot-build', reasoning: 'needs a bank licence' } })).ok, false);

  // Disarmed, nothing goes anywhere however good it is.
  assert.equal(mayHandOff(normalizeAutonomy({ armed: false }), finding()).ok, false);
});

test('the weekly handoff ceiling holds, and only counts the last seven days', async () => {
  const store = freshStore();
  await updateAutonomy(store, { armed: true, handoffsPerWeek: 3 });

  const at = '2026-08-10T12:00:00.000Z';
  for (let i = 0; i < 3; i += 1) {
    await recordHandoff(store, { findingId: `f${i}`, at: '2026-08-09T12:00:00.000Z' });
  }

  let state = await readAutonomy(store);
  assert.equal(handoffsInWindow(state, at).length, 3);
  const blocked = mayHandOff(state, finding(), { at });
  assert.equal(blocked.ok, false);
  assert.match(blocked.reason, /ceiling is 3/);

  // Eight days later the window has rolled and she may send again.
  const later = '2026-08-18T12:00:00.000Z';
  assert.equal(handoffsInWindow(state, later).length, 0);
  assert.equal(mayHandOff(state, finding(), { at: later }).ok, true);

  // A ceiling of zero means never, not unlimited.
  await updateAutonomy(store, { handoffsPerWeek: 0 });
  state = await readAutonomy(store);
  assert.equal(mayHandOff(state, finding(), { at: later }).ok, false);
});

test('quiet runs slow her down; a find puts her straight back', async () => {
  const store = freshStore();
  await arm(store, {});

  let state = await recordRun(store, { reported: 0 });
  assert.equal(state.backedOff, false, 'one quiet run is not a pattern');
  state = await recordRun(store, { reported: 0 });
  assert.equal(state.backedOff, false);
  state = await recordRun(store, { reported: 0 });
  assert.equal(state.backedOff, true, 'three quiet runs should slow her down');
  assert.equal(state.armed, true, 'quiet is not broken — she must not disarm for it');

  // Backed off she skips alternate passes rather than stopping.
  const skipped = shouldRoam({ ...state, runCount: 1 });
  const runs = shouldRoam({ ...state, runCount: 2 });
  assert.equal(skipped.roam, false);
  assert.equal(runs.roam, true);

  // Anything found at all resets it immediately.
  state = await recordRun(store, { reported: 1 });
  assert.equal(state.backedOff, false);
  assert.equal(state.quietRuns, 0);
});

test('consecutive failures stop her, and she says it was her own doing', async () => {
  const store = freshStore();
  await arm(store, {});

  let state = await recordRun(store, { failed: true });
  assert.equal(state.armed, true);
  state = await recordRun(store, { failed: true });
  assert.equal(state.armed, true);
  state = await recordRun(store, { failed: true });

  assert.equal(state.armed, false, 'three failures in a row must stop her');
  assert.equal(state.disarmedBy, 'herself');
  assert.match(state.disarmReason, /failed/);
  assert.match(describeAutonomy(state), /Stopped herself/);

  // A success between failures clears the count: intermittent is not broken.
  await arm(store, {});
  await recordRun(store, { failed: true });
  await recordRun(store, { failed: true });
  const recovered = await recordRun(store, { failed: false, reported: 0 });
  assert.equal(recovered.errorRuns, 0);
  assert.equal(recovered.armed, true);
});

test('arming clears whatever stopped her, so she does not stop again immediately', async () => {
  const store = freshStore();
  await arm(store, {});
  await recordRun(store, { failed: true });
  await recordRun(store, { failed: true });
  await recordRun(store, { failed: true });
  assert.equal((await readAutonomy(store)).armed, false);

  const rearmed = await arm(store, {});
  assert.equal(rearmed.armed, true);
  assert.equal(rearmed.errorRuns, 0, 'she would otherwise stop on the very next failure');
  assert.equal(rearmed.quietRuns, 0);
  assert.equal(rearmed.backedOff, false);
  assert.equal(rearmed.disarmReason, null);
});

test('two passes writing at once cannot lose a counter increment', async () => {
  // The concurrency failure this system has already had once: read, modify,
  // write, with two callers interleaved, silently losing one write. For an
  // error counter, losing an increment means the brake never trips.
  const store = freshStore();
  await arm(store, {});

  await Promise.all(Array.from({ length: 12 }, () => recordRun(store, { reported: 0 })));

  const state = await readAutonomy(store);
  assert.equal(state.runCount, 12, 'every concurrent run must be counted');
  assert.equal(state.quietRuns, 12);
});

test('a caller cannot overwrite her counters by sending them as settings', async () => {
  const store = freshStore();
  await arm(store, {});
  await recordRun(store, { failed: true });
  await recordRun(store, { failed: true });

  // Simulating what api/watches.js is allowed to pass through: settings only.
  await updateAutonomy(store, { handoffsPerWeek: 5, reserveUsd: 3 });
  const state = await readAutonomy(store);
  assert.equal(state.errorRuns, 2, 'a settings change must not reset the brake counters');
  assert.equal(state.handoffsPerWeek, 5);
  assert.equal(state.reserveUsd, 3);
});

test('what she says about herself matches what she is', async () => {
  const store = freshStore();
  assert.match(describeAutonomy(await readAutonomy(store)), /Not armed/);

  await arm(store, {});
  const armed = await readAutonomy(store);
  const said = describeAutonomy(armed, { capUsd: 10, spentUsd: 1 });
  assert.match(said, /Armed/);
  assert.match(said, /\$7\.00/, 'her allowance is the cap minus the reserve minus what is spent');
  assert.match(said, /0\/3 handed to Jason/);

  await disarm(store, { by: 'you' });
  assert.match(describeAutonomy(await readAutonomy(store)), /Not armed/);
});

test('settings are clamped, so a bad number cannot widen a brake', () => {
  const s = normalizeAutonomy({
    handoffFloor: 99,
    handoffsPerWeek: 1e9,
    errorRunsBeforeStop: 0,
    maxSelfWatches: -4,
    quietRuns: -1,
  });
  assert.equal(s.handoffFloor, 5, 'the ladder only goes to 5');
  assert.equal(s.handoffsPerWeek, 50);
  assert.equal(s.errorRunsBeforeStop, 1, 'zero would mean never stopping');
  assert.equal(s.maxSelfWatches, 1);
  assert.equal(s.quietRuns, 0);
});

test('unattended handoff needs a positive buildability verdict, not just no blocker', () => {
  // Found by stress: a finding with no buildability at all sailed through,
  // because the only check was for the NEGATIVE verdict. Unattended is exactly
  // when nobody is there to notice that it was never classified.
  const armed = normalizeAutonomy({ armed: true });
  const base = { evidence: { strength: 5, hypothesis: false }, status: 'active', demand: { oneLine: 'x' } };

  assert.equal(mayHandOff(armed, { ...base, buildability: { verdict: 'jason-can-build' } }).ok, true);

  for (const verdict of ['partly', 'unclear', 'jason-cannot-build']) {
    const v = mayHandOff(armed, { ...base, buildability: { verdict } });
    assert.equal(v.ok, false, `"${verdict}" must not go unattended`);
  }
  for (const buildability of [undefined, null, {}, { verdict: null }, { verdict: 'something-new' }]) {
    const v = mayHandOff(armed, { ...base, buildability });
    assert.equal(v.ok, false, `${JSON.stringify(buildability)} must not go unattended`);
    assert.match(v.reason, /buildability/);
  }
});
