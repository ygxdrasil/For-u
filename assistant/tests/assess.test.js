/**
 * The four outcomes. Every one of these reproduces a specific way the last
 * project lied to its owner.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessExecution, assessBatch, assessReadBack, VERDICT } from '../core/assess.js';

test('a 200 with no execution record is UNCONFIRMED, never failed', () => {
  // The exact bug: the request succeeded, so the code said "done"; or the read
  // failed, so the code said "broken". Both were wrong.
  const r = assessExecution({ execution: null });
  assert.equal(r.verdict, VERDICT.UNCONFIRMED);
  assert.match(r.headline, /couldn't confirm/i);
  assert.doesNotMatch(`${r.headline} ${r.detail}`, /\b(failed|broken|isn't working)\b/i);
});

test('a failed read-back is UNCONFIRMED and says so in those words', () => {
  const r = assessExecution({ execution: null, readError: 'socket hang up' });
  assert.equal(r.verdict, VERDICT.UNCONFIRMED);
  assert.match(r.detail, /don't know the outcome/i);
  assert.match(r.detail, /not that it failed/i);
});

test('a successful execution is WORKED and carries evidence', () => {
  const r = assessExecution({ execution: { id: 'e1', status: 'success', workflowId: 'w1' } });
  assert.equal(r.verdict, VERDICT.WORKED);
  assert.equal(r.evidence.executionId, 'e1');
});

test('a successful dry run is WORKED_INVISIBLE, not WORKED', () => {
  // Reporting "done" when every write node was disabled is technically true
  // and practically a lie.
  const r = assessExecution({
    execution: { id: 'e2', status: 'success' },
    disabledWriteNodes: ['Post to Slack'],
  });
  assert.equal(r.verdict, VERDICT.WORKED_INVISIBLE);
  assert.match(r.detail, /nothing reached a real system/i);
});

test('a real failure names the failing node', () => {
  const r = assessExecution({
    execution: {
      id: 'e3',
      status: 'error',
      data: { resultData: { lastNodeExecuted: 'Post to Slack', runData: { 'Post to Slack': [{ error: { message: 'channel_not_found' } }] } } },
    },
  });
  assert.equal(r.verdict, VERDICT.FAILED);
  assert.match(r.headline, /Post to Slack/);
  assert.match(r.detail, /channel_not_found/);
});

test('an unrecognised status is UNCONFIRMED rather than guessed', () => {
  const r = assessExecution({ execution: { id: 'e4', status: 'something_new' } });
  assert.equal(r.verdict, VERDICT.UNCONFIRMED);
  assert.match(r.detail, /not going to guess/i);
});

test('older payloads using finished:true are read as success', () => {
  const r = assessExecution({ execution: { id: 'e5', finished: true } });
  assert.equal(r.verdict, VERDICT.WORKED);
});

test('partial success names what worked and what did not', () => {
  const r = assessBatch([
    { label: 'created workflow', ok: true },
    { label: 'grounded channel', ok: true },
    { label: 'dry run', ok: false },
  ]);
  assert.equal(r.verdict, VERDICT.WORKED);
  assert.match(r.headline, /2 of 3/);
  assert.match(r.detail, /dry run/);
});

test('a read-back that disagrees is a failure, and a missing read-back is not', () => {
  assert.equal(assessReadBack({ expected: true, actual: false, label: 'active' }).verdict, VERDICT.FAILED);
  assert.equal(assessReadBack({ expected: true, actual: null, label: 'active' }).verdict, VERDICT.UNCONFIRMED);
  assert.equal(assessReadBack({ expected: true, actual: true, label: 'active' }).verdict, VERDICT.WORKED);
});
