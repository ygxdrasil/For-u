/**
 * The seam for protocol adapters — anything that exposes Jason's tools to
 * another AI rather than running the conversation itself.
 *
 * It exists so that /api/mcp can hand out tools without constructing its own
 * list. It calls buildToolRegistry and returns exactly what it returns. There
 * is no filtering, no reordering and no extra tool: the day an adapter starts
 * curating its own set is the day two agents have different powers and nobody
 * notices until one does something the other would have refused.
 *
 * tests/guardrails.test.js fingerprints this against the registry directly and
 * fails the build if they ever differ.
 */

import { buildToolRegistry } from './tools.js';

export function toolsForProtocol(ctx) {
  return buildToolRegistry(ctx);
}
