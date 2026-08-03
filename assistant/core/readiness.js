/**
 * Can this workflow actually run?
 *
 * The gap this closes, from a real build: a workflow was designed correctly,
 * validated, saved, and reported as done — with the Google Sheets document id
 * left as a placeholder and the Places API credential unset. Both were named in
 * the closing summary, honestly. But the workflow itself sat in n8n looking
 * exactly like a finished one, and switching it on would have failed at 07:00
 * with nobody watching.
 *
 * "It saved" and "it can run" are different facts and the second one is the one
 * that matters. Everything here is checked against evidence rather than
 * guessed: the catalog says which credential types a node takes, the instance
 * says which credentials exist, and a placeholder is only called a placeholder
 * when it looks like nothing else.
 */

import { getNode } from './nodeIndex.js';

export const BLOCKER = {
  NO_TRIGGER: 'no_trigger',
  MISSING_CREDENTIAL: 'missing_credential',
  UNKNOWN_CREDENTIAL: 'unknown_credential',
  PLACEHOLDER: 'placeholder',
  DISABLED: 'disabled',
};

/**
 * Text that is plainly standing in for something real.
 *
 * Deliberately narrow. A false positive here tells someone their working
 * workflow is broken, which is the one thing this project may never do — so
 * this matches only the shapes people actually leave behind, not anything that
 * merely looks odd.
 */
const PLACEHOLDER_PATTERNS = [
  /^<[^>]*>$/, // <your sheet id>
  /\byour[_ -]?(id|key|token|sheet|email|url|value)\b/i,
  /\b(paste|replace|fill)[_ -]?(it|this|me|here)?\b/i,
  /^(todo|tbd|xxx+|placeholder|changeme|example)$/i,
  /\bplaceholder\b/i,
  /^(abc123|123456|test123)$/i,
  /example\.com/i,
];

const looksLikePlaceholder = (value) =>
  typeof value === 'string' && value.trim() !== '' && PLACEHOLDER_PATTERNS.some((p) => p.test(value.trim()));

/** Every string in a parameter tree, with the path that leads to it. */
function* eachString(value, path = []) {
  if (typeof value === 'string') {
    yield { path: path.join('.'), value };
    return;
  }
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) yield* eachString(item, [...path, i]);
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) yield* eachString(item, [...path, key]);
  }
}

const isTriggerType = (type) => /trigger$|webhook$|\.cron$|\.interval$/i.test(String(type ?? ''));

/**
 * The credential a node has ASKED for in its own parameters.
 *
 * HTTP Request declares no credential types in the catalog — it chooses one at
 * runtime from `authentication`, plus `genericAuthType` or `nodeCredentialType`.
 * So a node explicitly configured to authenticate, with nothing attached, was
 * invisible to a catalog-only check. That is the node the Halmstad build left
 * unset: the check would have missed the one case it was written for.
 *
 * "authentication: none" is a deliberate statement that no credential is
 * wanted, and is left alone.
 */
function credentialTypeAskedFor(node) {
  const p = node?.parameters;
  if (!p || typeof p !== 'object') return [];
  const auth = p.authentication;
  if (!auth || auth === 'none') return [];
  const named = p.genericAuthType ?? p.nodeCredentialType;
  return typeof named === 'string' && named ? [named] : [];
}

/**
 * @param {object} workflow
 * @param {object} [context]
 * @param {Array<{id:string,name?:string,type?:string}>} [context.credentials] what the instance really has
 * @returns {{ready:boolean, blockers:Array, checkedCredentials:boolean}}
 */
export function assessReadiness(workflow, { credentials = null } = {}) {
  const nodes = Array.isArray(workflow?.nodes)
    ? workflow.nodes.filter((n) => n && typeof n === 'object' && typeof n.name === 'string')
    : [];

  const blockers = [];
  const known = credentials ? new Map(credentials.map((c) => [String(c.id), c])) : null;

  if (!nodes.some((n) => isTriggerType(n.type))) {
    blockers.push({
      kind: BLOCKER.NO_TRIGGER,
      node: null,
      detail: 'Nothing starts this workflow.',
      fix: 'Add a trigger — a Schedule Trigger, a Webhook, or whatever should set it off. Without one it can only ever be run by hand.',
    });
  }

  for (const node of nodes) {
    if (node.disabled === true) {
      blockers.push({
        kind: BLOCKER.DISABLED,
        node: node.name,
        detail: `"${node.name}" is switched off, so it will be skipped on every run.`,
        fix: 'Enable it, or remove it if it is not wanted.',
      });
    }

    // What the catalog says this node type takes. A fact about the node, not a
    // guess about the workflow.
    //
    // The HTTP Request node declares none, because it picks its credential type
    // at runtime from its own parameters — which is exactly the node the
    // Halmstad build left unset. A check that reads only the catalog would have
    // missed the case it was written for, so the node's own declared intent
    // counts too: `authentication` and the type it names are real parameters,
    // read from the schema, not guessed.
    const accepts = [...(getNode(node.type)?.credentials ?? []), ...credentialTypeAskedFor(node)];
    const attached = node.credentials && typeof node.credentials === 'object' ? node.credentials : {};

    if (accepts.length) {
      const usable = Object.entries(attached).filter(([type, cred]) => accepts.includes(type) && cred?.id);
      if (!usable.length) {
        blockers.push({
          kind: BLOCKER.MISSING_CREDENTIAL,
          node: node.name,
          detail: `"${node.name}" has no credential attached. It accepts: ${accepts.join(' or ')}.`,
          fix: `In n8n: open "${node.name}", choose or create a credential of type ${accepts[0]}.`,
          credentialTypes: accepts,
        });
      } else if (known) {
        // Only checkable when the instance's real credential list was supplied.
        for (const [type, cred] of usable) {
          if (!known.has(String(cred.id))) {
            blockers.push({
              kind: BLOCKER.UNKNOWN_CREDENTIAL,
              node: node.name,
              detail: `"${node.name}" points at credential id ${cred.id} (${type}), which does not exist in this n8n.`,
              fix: 'Re-select the credential on that node, or create one with that type.',
            });
          }
        }
      }
    }

    for (const { path, value } of eachString(node.parameters ?? {})) {
      if (looksLikePlaceholder(value)) {
        blockers.push({
          kind: BLOCKER.PLACEHOLDER,
          node: node.name,
          detail: `"${node.name}" still has a placeholder in ${path || 'its parameters'}: ${JSON.stringify(value).slice(0, 80)}`,
          fix: 'Replace it with the real value before this can run.',
          parameter: path,
        });
      }
    }
  }

  return {
    ready: blockers.length === 0,
    blockers,
    // Whether the credential ids were checked against the instance, or only
    // their presence. Saying which is the difference between "no unknown
    // credentials" and "I did not look".
    checkedCredentials: Boolean(known),
  };
}

/** One line for a person, from the same evidence. */
export function summariseReadiness(readiness) {
  if (readiness.ready) return 'Nothing is stopping this from running.';
  const counts = readiness.blockers.reduce((acc, b) => ({ ...acc, [b.kind]: (acc[b.kind] ?? 0) + 1 }), {});
  const parts = [];
  if (counts[BLOCKER.NO_TRIGGER]) parts.push('nothing starts it');
  if (counts[BLOCKER.MISSING_CREDENTIAL]) parts.push(`${counts[BLOCKER.MISSING_CREDENTIAL]} node(s) with no credential`);
  if (counts[BLOCKER.UNKNOWN_CREDENTIAL]) parts.push(`${counts[BLOCKER.UNKNOWN_CREDENTIAL]} credential(s) that do not exist here`);
  if (counts[BLOCKER.PLACEHOLDER]) parts.push(`${counts[BLOCKER.PLACEHOLDER]} placeholder value(s)`);
  if (counts[BLOCKER.DISABLED]) parts.push(`${counts[BLOCKER.DISABLED]} disabled node(s)`);
  return `Not ready to run: ${parts.join(', ')}.`;
}
