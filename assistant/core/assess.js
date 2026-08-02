/**
 * The only place in this codebase allowed to produce a statement about whether
 * something worked.
 *
 * Every function here takes actual evidence as an argument. There is no code
 * path that yields "done" without an execution record, and no code path that
 * yields "it isn't working" when all we really have is a read we could not
 * complete. Those are four different outcomes and collapsing them into
 * pass/fail is how you end up telling someone their workflow is broken while
 * they are watching it run.
 */

/** @typedef {'worked'|'worked_invisible'|'unconfirmed'|'failed'} Verdict */

export const VERDICT = {
  WORKED: 'worked',
  WORKED_INVISIBLE: 'worked_invisible',
  UNCONFIRMED: 'unconfirmed',
  FAILED: 'failed',
};

/**
 * n8n execution statuses, as returned by GET /executions/:id.
 * Anything not listed here is treated as unknown rather than assumed failed.
 */
const TERMINAL_OK = new Set(['success']);
const TERMINAL_BAD = new Set(['error', 'crashed']);
const IN_FLIGHT = new Set(['running', 'waiting', 'new']);

/**
 * Assess a workflow execution.
 *
 * @param {object} input
 * @param {object|null} input.execution  the execution record read back from n8n, or null if we could not read it
 * @param {string|null} [input.readError] why the read-back failed, if it did
 * @param {string[]} [input.disabledWriteNodes] nodes we disabled for a dry run
 * @returns {{verdict: Verdict, headline: string, detail: string, evidence: object|null}}
 */
export function assessExecution({ execution, readError = null, disabledWriteNodes = [] }) {
  // No evidence at all. This is NOT failure — say so in those words.
  if (!execution) {
    return {
      verdict: VERDICT.UNCONFIRMED,
      headline: "I couldn't confirm whether that ran",
      detail: readError
        ? `The workflow was submitted, but reading the execution back failed: ${readError}. That means I don't know the outcome — not that it failed. Check the Executions tab in n8n.`
        : "The workflow was submitted, but no execution record came back, so I don't know the outcome. Check the Executions tab in n8n.",
      evidence: null,
    };
  }

  // Older n8n payloads report `finished: true` without a `status` field.
  const status = execution.status ?? (execution.finished === true ? 'success' : undefined);
  const evidence = {
    executionId: execution.id ?? null,
    workflowId: execution.workflowId ?? null,
    status: status ?? null,
    startedAt: execution.startedAt ?? null,
    stoppedAt: execution.stoppedAt ?? null,
  };

  if (status && IN_FLIGHT.has(status)) {
    return {
      verdict: VERDICT.UNCONFIRMED,
      headline: 'Still running',
      detail: `Execution ${evidence.executionId} is ${status}. I have no outcome to report yet.`,
      evidence,
    };
  }

  if (status && TERMINAL_BAD.has(status)) {
    const failure = describeFailure(execution);
    return {
      verdict: VERDICT.FAILED,
      headline: failure.node ? `Failed at "${failure.node}"` : 'Execution failed',
      detail: failure.message || `Execution ${evidence.executionId} ended with status "${status}".`,
      evidence: { ...evidence, failingNode: failure.node, error: failure.message },
    };
  }

  if (status && TERMINAL_OK.has(status)) {
    // It ran, but if the nodes that would have changed anything were disabled,
    // nothing observable happened out in the world. Saying "done" here would be
    // technically true and practically a lie.
    if (disabledWriteNodes.length) {
      return {
        verdict: VERDICT.WORKED_INVISIBLE,
        headline: 'Ran clean as a dry run — nothing was written',
        detail: `Execution ${evidence.executionId} succeeded with ${disabledWriteNodes.length} write node(s) disabled (${disabledWriteNodes.join(', ')}). The data path is proven; nothing reached a real system.`,
        evidence: { ...evidence, disabledWriteNodes },
      };
    }
    return {
      verdict: VERDICT.WORKED,
      headline: 'Ran successfully',
      detail: `Execution ${evidence.executionId} finished with status success.`,
      evidence,
    };
  }

  // A record exists but its status is not one we recognise. Unknown, not failed.
  return {
    verdict: VERDICT.UNCONFIRMED,
    headline: "Ran, but I can't read the outcome",
    detail: `Execution ${evidence.executionId} came back with status ${JSON.stringify(status)}, which I don't recognise. I'm not going to guess whether that means success.`,
    evidence,
  };
}

/**
 * Pull the failing node and its error message out of an execution.
 * n8n nests this differently depending on version, so try the known shapes and
 * report honestly if none match rather than inventing a cause.
 */
export function describeFailure(execution) {
  const data = execution?.data ?? {};
  const resultData = data.resultData ?? data.executionData?.resultData ?? {};

  if (resultData.error) {
    return {
      node: resultData.lastNodeExecuted ?? resultData.error.node?.name ?? null,
      message: resultData.error.message ?? String(resultData.error),
      stack: resultData.error.stack ?? null,
    };
  }

  const runData = resultData.runData ?? {};
  for (const [nodeName, runs] of Object.entries(runData)) {
    for (const run of runs ?? []) {
      if (run?.error) {
        return {
          node: nodeName,
          message: run.error.message ?? String(run.error),
          stack: run.error.stack ?? null,
        };
      }
    }
  }

  // n8n said it failed and recorded nothing about why. That happens — a
  // crashed worker, a killed container, an execution truncated by pruning. The
  // caller still has to print a sentence, and `null` printed as "undefined"
  // reads like our bug rather than a missing record on their side.
  const node = resultData.lastNodeExecuted ?? null;
  return {
    node,
    message: node
      ? `n8n recorded no error message for this failure. The last node to run was "${node}", so start there — the detail may still be in the execution in n8n.`
      : 'n8n recorded no error message and no last node for this failure, which usually means the execution was cut short (a restart, or pruning) rather than a node throwing.',
    stack: null,
    noDetail: true,
  };
}

/**
 * Assess a set of independent actions. One failure must never sink the report
 * for the others — if three things were attempted and one broke, the answer
 * names which one.
 *
 * @param {{label: string, ok: boolean, verdict?: Verdict, detail?: string}[]} results
 */
export function assessBatch(results) {
  const worked = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (!failed.length) {
    return { verdict: VERDICT.WORKED, headline: `All ${results.length} succeeded`, worked, failed };
  }
  if (!worked.length) {
    return { verdict: VERDICT.FAILED, headline: `All ${results.length} failed`, worked, failed };
  }
  return {
    verdict: VERDICT.WORKED,
    headline: `${worked.length} of ${results.length} succeeded`,
    detail: `Worked: ${worked.map((r) => r.label).join(', ')}. Did not: ${failed.map((r) => r.label).join(', ')}.`,
    worked,
    failed,
  };
}

/**
 * Compare what we asked for against what the service reports back.
 * A 200 is not proof; this is.
 */
export function assessReadBack({ expected, actual, label }) {
  if (actual === undefined || actual === null) {
    return {
      verdict: VERDICT.UNCONFIRMED,
      headline: `Couldn't read ${label} back`,
      detail: `The write was accepted but reading ${label} back returned nothing, so I can't confirm it took effect.`,
    };
  }
  const same = JSON.stringify(expected) === JSON.stringify(actual);
  return same
    ? { verdict: VERDICT.WORKED, headline: `${label} confirmed`, detail: `Read back as ${JSON.stringify(actual)}.` }
    : {
        verdict: VERDICT.FAILED,
        headline: `${label} did not take`,
        detail: `Asked for ${JSON.stringify(expected)} but it reads back as ${JSON.stringify(actual)}.`,
      };
}
