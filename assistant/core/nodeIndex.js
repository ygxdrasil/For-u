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
let _typedefs = null;

/**
 * The type definitions, packed into one file rather than ~4,700 loose ones.
 * Loaded lazily and cached: only the pipeline functions ever ask for them, and
 * only when a node is actually being configured — so a request that never
 * builds anything never pays for the parse.
 */
function loadTypedefs() {
  if (_typedefs) return _typedefs;
  const p = path.join(VENDOR, 'typedefs.json');
  _typedefs = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  return _typedefs;
}

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
    // Whether the schema files are bundled into THIS serverless function.
    // They are only shipped to the functions that validate workflows, because
    // copying 9,600 files into every function turned a 1.4s build into a
    // three-minute deploy. A function without them can still search and
    // describe nodes from the catalog.
    schemasBundledHere: fs.existsSync(SCHEMAS_DIR) && fs.existsSync(path.join(VENDOR, 'typedefs.json')),
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
 * The run-together forms, as whole tokens.
 *
 * Splitting "openAi" into "open ai" is right for matching "ai", and wrong for
 * matching what people actually type: "openai" found NOTHING, in an index that
 * contains five OpenAI nodes. Same for "googlesheets" and "langchain".
 *
 * These are compared by exact token equality, never as substrings, so the
 * whole-word guarantee is untouched — "day" still does not match "today".
 */
function squashedTokens(...texts) {
  const out = new Set();
  for (const text of texts) {
    for (const chunk of String(text || '').split(/[^A-Za-z0-9]+/)) {
      if (chunk) out.add(chunk.toLowerCase());
    }
  }
  return out;
}

/**
 * Search the catalog. Returns nodes with their resource/operation
 * discriminators, which is what the caller needs before asking for a schema.
 */
export function searchNodes(query, { limit = 12 } = {}) {
  const c = loadCatalog();
  const terms = words(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  // "open ai", "openAi" and "openai" are the same search as far as the person
  // typing is concerned.
  const squashedQuery = String(query).replace(/[^A-Za-z0-9]+/g, '').toLowerCase();

  const scored = [];
  for (const node of c.nodes) {
    const haystackName = words(`${node.name} ${node.displayName}`);
    const haystackDesc = words(node.description || '');
    const haystackOps = words(node.operations.map((o) => `${o.resource || ''} ${o.operation || ''}`).join(' '));
    const squashed = squashedTokens(node.name, node.displayName, node.type);

    let score = 0;
    if (squashedQuery && squashed.has(squashedQuery)) score += 10;
    for (const t of terms) {
      if (wordMatches(t, haystackName)) score += 10;
      else if (squashed.has(t.toLowerCase())) score += 8;
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

  const defs = loadTypedefs()[node.key] ?? {};
  const results = candidates.map((op) => {
    const typeDefinition = defs[op.file] ?? null;
    const readError = typeDefinition ? null : `No packed definition for ${node.key}/${op.file}`;
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

/**
 * Verbs that mean something changes out in the world.
 *
 * The bias here is deliberate and one-directional: disabling a node that turns
 * out to be harmless costs a slightly emptier dry run. MISSING one sends a real
 * message to a real person. So when in doubt, this says write.
 */
const WRITE_VERB_LIST = [
  'create', 'update', 'upsert', 'delete', 'send', 'post', 'append', 'write', 'add', 'remove', 'archive',
  'move', 'copy', 'insert', 'set', 'assign', 'invite', 'share', 'publish', 'execute', 'run', 'trigger',
  'reply', 'forward', 'reserve', 'charge', 'refund', 'upload', 'put', 'patch', 'push', 'deploy', 'submit',
  'respond', 'dispatch', 'notify', 'mail', 'pay', 'transfer', 'order', 'book', 'approve', 'revoke', 'grant',
  'import', 'rename', 'replace', 'restore', 'comment', 'subscribe', 'unsubscribe', 'clear', 'truncate', 'sync',
  'emit', 'sms', 'call', 'tweet', 'toot', 'like', 'follow',
];

/** Operations are camelCase verbs: sendMessage, appendOrUpdate, deleteChannel. */
const WRITE_VERB_PREFIX = new RegExp(`^(${WRITE_VERB_LIST.join('|')})`, 'i');
/** Node names are matched word by word, so "emailSend" is caught, not just "sendEmail". */
const WRITE_VERB_EXACT = new RegExp(`^(${WRITE_VERB_LIST.join('|')})$`, 'i');

/** Anything but these changes state at the other end. */
const READ_ONLY_METHOD = /^(get|head|options)$/i;

/**
 * Nodes that can reach anything, whose intent cannot be read off a parameter.
 * These are NOT auto-disabled — disabling every Code node would leave a dry run
 * proving nothing — but they are named in the report, because "I disabled
 * everything that sends" is only true for things that can be identified.
 */
const OPAQUE_TYPES = new Set([
  'n8n-nodes-base.code',
  'n8n-nodes-base.function',
  'n8n-nodes-base.functionItem',
  'n8n-nodes-base.executeCommand',
  'n8n-nodes-base.ssh',
  'n8n-nodes-base.httpRequest',
  'n8n-nodes-base.graphql',
  'n8n-nodes-base.n8n',
  '@n8n/n8n-nodes-langchain.toolHttpRequest',
  '@n8n/n8n-nodes-langchain.toolCode',
]);

export function isOpaqueNode(type) {
  return OPAQUE_TYPES.has(type);
}

/**
 * Classify a node as write-capable.
 *
 * Three signals, in order of how much they can be trusted:
 *   1. an explicit HTTP method that is not a read — an HTTP Request node doing
 *      POST is a send, whatever the node happens to be called
 *   2. the operation verb, from the catalog's own operation names
 *   3. failing both, the words in the node's name
 *
 * Signal 3 matches word by word rather than only at the start. Anchoring it to
 * the start meant "emailSend" — the literal Send Email node — was classified as
 * a read and stayed switched on through every dry run.
 */
export function isWriteOperation({ type, resource = null, operation = null, parameters = null }) {
  const method = parameters?.method ?? parameters?.requestMethod ?? parameters?.httpMethod;
  if (typeof method === 'string' && method && !READ_ONLY_METHOD.test(method)) return true;

  if (operation) return WRITE_VERB_PREFIX.test(operation);

  const node = getNode(type);
  if (!node) return false;

  // A trigger starts a workflow, it does not send anything — and "trigger" is
  // itself a write verb, so without this every manualTrigger and
  // scheduleTrigger got switched off and the dry run had nothing to run at all.
  if (/trigger$/i.test(type) || type.endsWith('.webhook')) return false;

  return String(node.name)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .some((word) => WRITE_VERB_EXACT.test(word));
}
