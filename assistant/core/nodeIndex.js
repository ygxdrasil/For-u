/**
 * Node knowledge. Everything the assistant is allowed to believe about n8n
 * nodes comes from here, and everything here came out of n8n's own generated
 * definitions via scripts/build-node-index.mjs.
 *
 * The model cannot see a parameter name until it calls getNodeSchema(). That
 * is deliberate: a model that has never been shown the schema has nothing to
 * pattern-match a plausible-looking parameter name from, and the validator
 * rejects anything not in the catalog anyway.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VENDOR = path.resolve(HERE, '..', 'vendor');
const SCHEMAS_DIR = path.join(VENDOR, 'schemas');

let _catalog = null;

export function loadCatalog() {
  if (_catalog) return _catalog;
  const p = path.join(VENDOR, 'catalog.json');
  if (!fs.existsSync(p)) {
    throw new Error(
      `Node catalog missing at ${p}. Run: node scripts/build-node-index.mjs --src <node_modules containing n8n-nodes-base>`,
    );
  }
  _catalog = JSON.parse(fs.readFileSync(p, 'utf8'));
  _catalog._byType = new Map(_catalog.nodes.map((n) => [n.type, n]));
  return _catalog;
}

export function catalogMeta() {
  const c = loadCatalog();
  return {
    generatedAt: c.generatedAt,
    packages: c.packages,
    nodeCount: c.nodeCount,
    operationCount: c.operationCount,
    schemasPresent: fs.existsSync(SCHEMAS_DIR),
  };
}

export function schemasBaseDir() {
  return SCHEMAS_DIR;
}

/**
 * Whole-word matching, not substring.
 *
 * "day" inside "today" and "monday" is the bug that nearly set the lights to
 * daylight at midnight. A substring search for "form" here would rank every
 * node containing "information", "transform" and "platform" above the actual
 * Form Trigger.
 */
function wordMatches(term, text) {
  if (!text) return false;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

/** Camel/pascal identifiers are split so "googleSheets" matches "sheets". */
function words(text) {
  return String(text || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim();
}

/**
 * Search the catalog. Returns nodes with their resource/operation
 * discriminators, which is what the caller needs before asking for a schema.
 */
export function searchNodes(query, { limit = 12 } = {}) {
  const c = loadCatalog();
  const terms = words(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const scored = [];
  for (const node of c.nodes) {
    const haystackName = words(`${node.name} ${node.displayName}`);
    const haystackDesc = words(node.description || '');
    const haystackOps = words(node.operations.map((o) => `${o.resource || ''} ${o.operation || ''}`).join(' '));

    let score = 0;
    for (const t of terms) {
      if (wordMatches(t, haystackName)) score += 10;
      else if (wordMatches(t, haystackDesc)) score += 4;
      else if (wordMatches(t, haystackOps)) score += 2;
    }
    // Exact type match always wins.
    if (node.type.toLowerCase() === String(query).toLowerCase()) score += 100;
    if (score > 0) scored.push({ node, score });
  }

  scored.sort((a, b) => b.score - a.score || a.node.type.localeCompare(b.node.type));

  return scored.slice(0, limit).map(({ node }) => ({
    type: node.type,
    displayName: node.displayName,
    description: node.description,
    version: node.version,
    credentials: node.credentials,
    // Discriminators are the thing the caller must pick before asking for a
    // schema, so they are the headline, not a footnote.
    discriminators: summariseDiscriminators(node),
  }));
}

function summariseDiscriminators(node) {
  const byResource = new Map();
  for (const op of node.operations) {
    const key = op.resource ?? '(none)';
    if (!byResource.has(key)) byResource.set(key, new Set());
    if (op.operation) byResource.get(key).add(op.operation);
    if (op.mode) byResource.get(key).add(`mode:${op.mode}`);
  }
  return [...byResource.entries()].map(([resource, ops]) => ({
    resource: resource === '(none)' ? null : resource,
    operations: [...ops],
  }));
}

export function getNode(type) {
  return loadCatalog()._byType.get(type) ?? null;
}

/**
 * The exact parameter definitions for one node + resource + operation.
 *
 * Returns the TypeScript definition text n8n generates, which carries the
 * parameter names, their literal enums, their defaults, their displayOptions
 * (which decide whether a field exists at all for this combination) and the
 * @builderHint annotations. This is what gets shown to the model.
 */
export function getNodeSchema({ type, resource = null, operation = null }) {
  const node = getNode(type);
  if (!node) {
    return {
      found: false,
      error: `No node of type "${type}" in the index (${loadCatalog().nodeCount} nodes from n8n-nodes-base ${loadCatalog().packages['n8n-nodes-base']}). Search first — do not guess a type.`,
    };
  }

  const candidates = node.operations.filter(
    (o) => (resource == null || o.resource === resource) && (operation == null || o.operation === operation),
  );

  if (!candidates.length) {
    return {
      found: false,
      error: `Node "${type}" has no resource=${JSON.stringify(resource)} operation=${JSON.stringify(operation)}.`,
      available: summariseDiscriminators(node),
    };
  }

  const results = candidates.map((op) => {
    const file = path.join(SCHEMAS_DIR, 'nodes', node.pkg, node.name, node.versionDir || 'v1', op.file);
    let typeDefinition = null;
    let readError = null;
    try {
      typeDefinition = fs.readFileSync(file, 'utf8');
    } catch (err) {
      readError = err.message;
    }
    return {
      resource: op.resource,
      operation: op.operation,
      mode: op.mode,
      params: op.params,
      // Values that must be grounded against the real account, never invented.
      needsGrounding: op.grounded,
      typeDefinition,
      typeDefinitionError: readError,
    };
  });

  return {
    found: true,
    type: node.type,
    displayName: node.displayName,
    version: node.version,
    credentials: node.credentials,
    operations: results,
  };
}

/**
 * Is this parameter name real for this node/resource/operation?
 * The validator's last line of defence against an invented name.
 */
export function knownParams({ type, resource = null, operation = null }) {
  const node = getNode(type);
  if (!node) return null;
  const ops = node.operations.filter(
    (o) => (resource == null || o.resource === resource) && (operation == null || o.operation === operation),
  );
  if (!ops.length) return null;
  const names = new Set();
  const required = new Set();
  for (const op of ops) {
    for (const p of op.params) {
      const bare = p.endsWith('!') ? p.slice(0, -1) : p;
      names.add(bare);
      if (p.endsWith('!')) required.add(bare);
    }
  }
  return { names, required };
}

/** Which parameters of this node must be grounded rather than guessed. */
export function groundingRequirements({ type, resource = null, operation = null }) {
  const node = getNode(type);
  if (!node) return [];
  return node.operations
    .filter((o) => (resource == null || o.resource === resource) && (operation == null || o.operation === operation))
    .flatMap((o) => o.grounded);
}

/** Nodes whose operation changes something in the outside world. */
const WRITE_VERBS = /^(create|update|upsert|delete|send|post|append|write|add|remove|archive|move|copy|insert|set|assign|invite|share|publish|execute|run|trigger|reply|forward|reserve|charge|refund)/i;

/**
 * Classify an operation as write-capable. Derived from the catalog's own
 * operation names — never a hand-maintained list, because the second copy of a
 * list always goes stale and starts advertising things that don't exist.
 */
export function isWriteOperation({ type, resource = null, operation = null }) {
  if (operation && WRITE_VERBS.test(operation)) return true;

  const node = getNode(type);
  if (!node) return false;

  // Nodes with no operation discriminator: judge by node name.
  if (!operation) {
    return WRITE_VERBS.test(node.name);
  }
  return false;
}
