/**
 * A compact drawing of a workflow, for the canvas in the chat.
 *
 * Derived from the workflow JSON that is already in flight — no extra call, no
 * extra cost. Nodes are placed by how far they are from a trigger, which is the
 * only layout that matches how the thing actually runs.
 */

const isTrigger = (type) =>
  typeof type === 'string' &&
  (/trigger$/i.test(type) || type.endsWith('.webhook') || type.endsWith('.manualTrigger') || type.endsWith('.chatTrigger'));

/** "n8n-nodes-base.googleSheets" -> "Google Sheets" */
export function shortType(type) {
  return String(type ?? '')
    .split('.')
    .pop()
    .replace(/Trigger$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}

export function buildPreview(workflow, { disabledNodes = [] } = {}) {
  const nodes = workflow?.nodes;
  if (!Array.isArray(nodes) || !nodes.length) return null;

  const connections = workflow.connections ?? {};
  const edges = [];
  const targets = new Map();

  for (const [from, outputs] of Object.entries(connections)) {
    for (const branchList of Object.values(outputs ?? {})) {
      for (const branch of branchList ?? []) {
        for (const link of branch ?? []) {
          if (!link?.node) continue;
          edges.push([from, link.node]);
          targets.set(link.node, (targets.get(link.node) ?? 0) + 1);
        }
      }
    }
  }

  // Depth from the nearest trigger. Breadth-first so a node that can be reached
  // by two paths sits at the shorter one, which is where the eye expects it.
  const depth = new Map();
  const queue = [];
  for (const n of nodes) {
    if (isTrigger(n.type) || !targets.has(n.name)) {
      depth.set(n.name, 0);
      queue.push(n.name);
    }
  }
  while (queue.length) {
    const current = queue.shift();
    for (const [from, to] of edges) {
      if (from !== current) continue;
      const next = depth.get(current) + 1;
      if (depth.get(to) === undefined || next < depth.get(to)) {
        depth.set(to, next);
        queue.push(to);
      }
    }
  }

  return {
    name: workflow.name ?? null,
    nodes: nodes.map((n) => ({
      name: n.name,
      short: shortType(n.type),
      trigger: isTrigger(n.type),
      // Write nodes switched off for a dry run are drawn differently, so
      // "nothing was sent" is visible rather than only stated.
      muted: Boolean(n.disabled) || disabledNodes.includes(n.name),
      depth: depth.get(n.name) ?? 0,
    })),
    edges,
  };
}

/** Pulls a workflow out of whatever a tool was given or returned. */
export function previewFrom(args, result) {
  const workflow = args?.workflow ?? result?.workflow ?? result?.readBack ?? null;
  if (workflow?.nodes) return buildPreview(workflow, { disabledNodes: result?.disabledWriteNodes ?? [] });
  return null;
}
