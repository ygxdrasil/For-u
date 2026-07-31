/**
 * Workflow validation, before anything is written to n8n.
 *
 * Two layers, because neither is sufficient alone. This is not belt-and-braces
 * for its own sake — each gap below was measured against the real SDK, not
 * assumed:
 *
 *   Layer 1, n8n's own Zod schemas (@n8n/workflow-sdk validateNodeConfig)
 *     CATCHES: wrong enum values, wrong types, bad discriminator combinations.
 *              `operation: 'explode'` is correctly rejected.
 *     MISSES:  invented parameter names. Zod object schemas STRIP unknown keys
 *              rather than erroring, so `{ channel: '#general' }` on a Slack
 *              node validates clean — and that is precisely the failure mode
 *              that saves fine, looks plausible, and dies at 3am.
 *     MISSES:  unknown node types. A type that does not exist returns valid,
 *              because a missing schema is treated as "nothing to check".
 *
 *   Layer 2, the catalog (built from n8n's generated definitions)
 *     CATCHES: node types that do not exist, parameter names that do not exist
 *              for the chosen resource/operation, missing required parameters,
 *              picker values that were guessed instead of grounded.
 *
 *   Layer 3, the graph
 *     CATCHES: no trigger, unreachable nodes, connections to nodes that aren't
 *              there, cycles. validateWorkflow does not reject a trigger-less
 *              workflow even in strictMode, so this is ours too.
 */

import path from 'node:path';
import { getNode, knownParams, groundingRequirements, schemasBaseDir, loadCatalog } from './nodeIndex.js';

let sdk = null;
let sdkError = null;

async function getSdk() {
  if (sdk || sdkError) return sdk;
  try {
    sdk = await import('@n8n/workflow-sdk');
    sdk.setSchemaBaseDirs([schemasBaseDir()]);
  } catch (err) {
    sdkError = err;
    sdk = null;
  }
  return sdk;
}

const err = (code, message, extra = {}) => ({ level: 'error', code, message, ...extra });
const warn = (code, message, extra = {}) => ({ level: 'warning', code, message, ...extra });

/**
 * @param {object} workflow  n8n workflow JSON: { name, nodes, connections }
 * @returns {Promise<{valid:boolean, errors:object[], warnings:object[], layers:object}>}
 */
export async function validateWorkflow(workflow) {
  const errors = [];
  const warnings = [];
  const layers = { catalog: true, schema: false, graph: true };

  if (!workflow || typeof workflow !== 'object') {
    return { valid: false, errors: [err('NO_WORKFLOW', 'No workflow object supplied.')], warnings, layers };
  }

  const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
  if (!nodes.length) {
    return { valid: false, errors: [err('NO_NODES', 'The workflow has no nodes.')], warnings, layers };
  }

  // ---------------------------------------------------------------- layer 2
  const seenNames = new Set();

  for (const node of nodes) {
    const where = { node: node.name ?? '(unnamed)' };

    if (!node.name) errors.push(err('NODE_NO_NAME', 'A node has no name; connections are keyed by name.', where));
    else if (seenNames.has(node.name)) errors.push(err('DUPLICATE_NODE_NAME', `Two nodes are both called "${node.name}".`, where));
    else seenNames.add(node.name);

    const catalogNode = getNode(node.type);
    if (!catalogNode) {
      errors.push(
        err(
          'UNKNOWN_NODE_TYPE',
          `Node type "${node.type}" is not in the index (${loadCatalog().nodeCount} nodes from n8n-nodes-base ${loadCatalog().packages['n8n-nodes-base']}). Either it does not exist or it is a community node this instance may not have.`,
          where,
        ),
      );
      continue;
    }

    const params = node.parameters ?? {};
    const resource = typeof params.resource === 'string' ? params.resource : null;
    const operation = typeof params.operation === 'string' ? params.operation : null;

    const known = knownParams({ type: node.type, resource, operation });
    if (!known) {
      errors.push(
        err(
          'UNKNOWN_DISCRIMINATOR',
          `Node "${node.name}" (${node.type}) has no resource=${JSON.stringify(resource)} / operation=${JSON.stringify(operation)} combination.`,
          where,
        ),
      );
      continue;
    }

    // The check n8n's own validator cannot do.
    for (const key of Object.keys(params)) {
      if (!known.names.has(key)) {
        const nearest = nearestNames(key, known.names);
        errors.push(
          err(
            'INVENTED_PARAMETER',
            `Node "${node.name}" (${node.type}) has no parameter "${key}"${nearest.length ? `. Did you mean: ${nearest.join(', ')}?` : '.'}`,
            { ...where, parameter: key, validNames: [...known.names].slice(0, 40) },
          ),
        );
      }
    }

    for (const required of known.required) {
      if (params[required] === undefined) {
        errors.push(err('MISSING_REQUIRED_PARAMETER', `Node "${node.name}" is missing required parameter "${required}".`, { ...where, parameter: required }));
      }
    }

    // Picker values must be grounded, never guessed.
    for (const g of groundingRequirements({ type: node.type, resource, operation })) {
      const value = params[g.param];
      if (value === undefined) continue;
      const problem = ungroundedPickerProblem(g, value);
      if (problem) {
        warnings.push(
          warn('UNGROUNDED_PICKER', `Node "${node.name}": ${problem} Ground it with ground_options against the real credential rather than guessing.`, {
            ...where,
            parameter: g.param,
          }),
        );
      }
    }

    if (node.credentials && Object.keys(node.credentials).length) {
      for (const [credType, credValue] of Object.entries(node.credentials)) {
        if (!catalogNode.credentials.includes(credType)) {
          warnings.push(warn('UNEXPECTED_CREDENTIAL_TYPE', `Node "${node.name}" references credential type "${credType}" but ${node.type} expects one of: ${catalogNode.credentials.join(', ') || '(none)'}.`, where));
        }
        const id = typeof credValue === 'object' ? credValue?.id : credValue;
        if (typeof id === 'string' && /^(mock|test|fake|your|placeholder|xxx)/i.test(id)) {
          errors.push(err('SYNTHETIC_CREDENTIAL', `Node "${node.name}" has a made-up credential id "${id}". Use a real credential id from list_credentials.`, where));
        }
      }
    }
  }

  // ---------------------------------------------------------------- layer 3
  const connections = workflow.connections ?? {};
  const nodeNames = new Set(nodes.map((n) => n.name).filter(Boolean));
  const targeted = new Set();

  for (const [from, outputs] of Object.entries(connections)) {
    if (!nodeNames.has(from)) {
      errors.push(err('CONNECTION_FROM_MISSING_NODE', `connections has an entry for "${from}", which is not a node in this workflow.`));
      continue;
    }
    for (const branchList of Object.values(outputs ?? {})) {
      for (const branch of branchList ?? []) {
        for (const link of branch ?? []) {
          if (!nodeNames.has(link?.node)) {
            errors.push(err('CONNECTION_TO_MISSING_NODE', `"${from}" connects to "${link?.node}", which is not a node in this workflow.`));
          } else {
            targeted.add(link.node);
          }
        }
      }
    }
  }

  const triggers = nodes.filter((n) => isTriggerType(n.type));
  if (!triggers.length) {
    errors.push(
      err('MISSING_TRIGGER', 'The workflow has no trigger node, so nothing can ever start it. Add a trigger (manual, schedule, webhook, form, …).'),
    );
  }

  for (const node of nodes) {
    if (!node.name || isTriggerType(node.type)) continue;
    if (!targeted.has(node.name)) {
      warnings.push(warn('DISCONNECTED_NODE', `Node "${node.name}" has nothing connected into it, so it will never run.`, { node: node.name }));
    }
  }

  const cycle = findCycle(nodeNames, connections);
  if (cycle) {
    warnings.push(warn('CYCLE', `These nodes form a loop: ${cycle.join(' → ')}. That is valid for batch loops but wrong everywhere else — check it is deliberate.`));
  }

  // ---------------------------------------------------------------- layer 1
  const loaded = await getSdk();
  if (loaded) {
    layers.schema = true;
    for (const node of nodes) {
      const catalogNode = getNode(node.type);
      if (!catalogNode) continue;
      try {
        const result = loaded.validateNodeConfig(node.type, node.typeVersion ?? catalogNode.version, {
          parameters: node.parameters ?? {},
        });
        if (!result.valid) {
          for (const e of result.errors ?? []) {
            errors.push(err('SCHEMA_VIOLATION', `Node "${node.name}": ${e.message}`, { node: node.name, path: e.path }));
          }
        }
      } catch (e) {
        warnings.push(warn('SCHEMA_CHECK_FAILED', `Could not run n8n's schema check on "${node.name}": ${e.message}. The catalog checks still ran.`, { node: node.name }));
      }
    }

    try {
      const structural = loaded.validateWorkflow(workflow, { validateSchema: true });
      for (const e of structural.errors ?? []) {
        errors.push(err(e.code ?? 'SDK_ERROR', `${e.nodeName ? `Node "${e.nodeName}": ` : ''}${e.message}`, { node: e.nodeName }));
      }
      for (const w of structural.warnings ?? []) {
        warnings.push(warn(w.code ?? 'SDK_WARNING', `${w.nodeName ? `Node "${w.nodeName}": ` : ''}${w.message}`, { node: w.nodeName }));
      }
    } catch (e) {
      warnings.push(warn('SDK_STRUCTURAL_CHECK_FAILED', `n8n's structural check could not run: ${e.message}. The graph checks still ran.`));
    }
  } else {
    warnings.push(
      warn(
        'SCHEMA_LAYER_UNAVAILABLE',
        `@n8n/workflow-sdk could not be loaded (${sdkError?.message ?? 'unknown'}), so enum and type checking did not run. Parameter-name and graph checks did run. Treat this as partially validated, not validated.`,
      ),
    );
  }

  return { valid: errors.length === 0, errors, warnings, layers };
}

/** Trigger detection from the node type, which is how n8n names them. */
function isTriggerType(type) {
  if (typeof type !== 'string') return false;
  return (
    /trigger$/i.test(type) ||
    type.endsWith('.webhook') ||
    type.endsWith('.manualTrigger') ||
    type.endsWith('.executeWorkflowTrigger') ||
    type.endsWith('.formTrigger') ||
    type.endsWith('.chatTrigger')
  );
}

/**
 * A picker value counts as grounded if it came from a real lookup. A resource
 * locator in `list` mode with no cachedResultName, or an obviously invented id,
 * is a guess wearing a costume.
 */
function ungroundedPickerProblem(requirement, value) {
  if (requirement.methodType === 'resourceLocator') {
    if (typeof value !== 'object' || value === null) {
      return `"${requirement.param}" should be a resource locator object ({ __rl: true, mode, value }), not a bare value.`;
    }
    if (!value.value) return `"${requirement.param}" has an empty value.`;
    if (typeof value.value === 'string' && /^(your|my|the|example|test|channel-?id|sheet-?id|xxx|todo|replace)/i.test(value.value.trim())) {
      return `"${requirement.param}" looks like a placeholder ("${value.value}") rather than a real id.`;
    }
    return null;
  }
  if (typeof value === 'string' && /^(your|example|test|xxx|todo|replace)/i.test(value.trim())) {
    return `"${requirement.param}" looks like a placeholder ("${value}") rather than a real value from ${requirement.method}.`;
  }
  return null;
}

/** Cheap edit-distance suggestion so an error tells you what to write instead. */
function nearestNames(key, names, limit = 3) {
  const lower = key.toLowerCase();
  return [...names]
    .map((n) => ({ n, d: distance(lower, n.toLowerCase()) }))
    .filter((x) => x.d <= Math.max(2, Math.floor(key.length / 3)))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.n);
}

function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

function findCycle(nodeNames, connections) {
  const adj = new Map();
  for (const [from, outputs] of Object.entries(connections ?? {})) {
    const targets = [];
    for (const branchList of Object.values(outputs ?? {})) {
      for (const branch of branchList ?? []) {
        for (const link of branch ?? []) if (link?.node) targets.push(link.node);
      }
    }
    adj.set(from, targets);
  }

  const state = new Map();
  const stack = [];

  const visit = (n) => {
    if (state.get(n) === 'done') return null;
    if (state.get(n) === 'open') return [...stack.slice(stack.indexOf(n)), n];
    state.set(n, 'open');
    stack.push(n);
    for (const next of adj.get(n) ?? []) {
      const found = visit(next);
      if (found) return found;
    }
    stack.pop();
    state.set(n, 'done');
    return null;
  };

  for (const n of nodeNames) {
    const found = visit(n);
    if (found) return found;
  }
  return null;
}
