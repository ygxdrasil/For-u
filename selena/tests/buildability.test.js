import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyBuildability, mergeModelOpinion, CAPABILITY_RULES } from '../core/buildability.js';

const from = (oneLine, extra = {}) => ({
  demand: { oneLine, whoHasIt: 'someone specific', inTheirWords: [] },
  evidence: { paying: [], complaints: [] },
  incumbents: [],
  whatWouldWin: [],
  risks: [],
  ...extra,
});

test('repeated manual work between two tools is his', () => {
  const r = classifyBuildability(from('They re-key every order into their accounting software by hand each week'));
  assert.equal(r.verdict, 'jason-can-build');
  assert.equal(r.shape, 'workflow');
  assert.ok(r.can.length >= 1);
});

test('physical goods are not his, at any confidence', () => {
  const r = classifyBuildability(from('Sellers need better packaging for handmade ceramic mugs they ship'));
  assert.equal(r.verdict, 'jason-cannot-build');
  assert.ok(r.blockers.some((b) => b.id === 'physical'));
});

test('regulated advice is not his', () => {
  const r = classifyBuildability(from('Small firms want a lawyer to review their contracts and give legal advice'));
  assert.equal(r.verdict, 'jason-cannot-build');
});

test('a buildable slice inside an unbuildable whole is reported as partly', () => {
  const r = classifyBuildability(
    from('Stationers manually chase clients for details, then hand-draw the final illustration and ship it'),
  );
  assert.equal(r.verdict, 'partly');
  assert.ok(r.can.length && r.cannot.length);
  assert.match(r.reasoning, /buildable slice/i);
});

test('nothing recognisable is unclear and asks for a second opinion', () => {
  const r = classifyBuildability(from('People want a nicer experience overall'));
  assert.equal(r.verdict, 'unclear');
  assert.equal(r.needsModel, true);
});

test('a hard blocker cannot be argued away by the model', () => {
  const rules = classifyBuildability(from('They need handmade wooden signs printed and shipped to customers'));
  const merged = mergeModelOpinion(rules, { verdict: 'jason-can-build', confidence: 'high', reasoning: 'seems fine to me' });

  assert.equal(merged.verdict, 'jason-cannot-build', 'a physical-goods blocker is not negotiable');
  assert.equal(merged.modelOpinion.overridden, true);
});

test('the model only decides when the rules could not', () => {
  const unclear = classifyBuildability(from('Something vague about a nicer experience'));
  const merged = mergeModelOpinion(unclear, { verdict: 'jason-can-build', confidence: 'high', shape: 'service', reasoning: 'form in, workflow behind' });

  assert.equal(merged.verdict, 'jason-can-build');
  assert.equal(merged.decidedBy, 'rules+model');
  assert.equal(merged.confidence, 'medium', "the model's high confidence is downgraded — it is a second opinion, not an oracle");
});

test('a confident rule verdict is not overwritten by the model', () => {
  const confident = classifyBuildability(from('They re-key every invoice into Xero by hand, every week, and need it to sync automatically'));
  assert.equal(confident.needsModel, false);
  const merged = mergeModelOpinion(confident, { verdict: 'jason-cannot-build', confidence: 'high', reasoning: 'no' });
  assert.equal(merged.verdict, 'jason-can-build');
});

test('rubbish input does not throw', () => {
  for (const junk of [{}, null, undefined, { demand: null }]) {
    const r = classifyBuildability(junk);
    assert.ok(['unclear', 'jason-can-build', 'jason-cannot-build', 'partly'].includes(r.verdict));
  }
});

test('every rule is well formed, so the derived prompt text cannot go stale', () => {
  for (const rule of CAPABILITY_RULES) {
    assert.ok(rule.id && rule.label && rule.why, `rule ${rule.id} is missing prose`);
    assert.ok(['can', 'cannot'].includes(rule.kind));
    assert.ok(Array.isArray(rule.patterns) && rule.patterns.length);
    assert.ok(Number.isFinite(rule.weight));
  }
});
