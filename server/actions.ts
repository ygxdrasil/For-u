import path from 'node:path';
import type {ActionCategory, ActionPolicy, ConfirmationPolicy} from '../shared/types.ts';
import {config} from './config.ts';
import {JsonStore} from './store.ts';

/**
 * The user's two hard limits are enforced here rather than only in the prompt.
 * A model can be talked out of an instruction; this layer cannot.
 */
const DEFAULT_POLICIES: ActionPolicy[] = [
  {category: 'communication', policy: 'always', locked: true},
  {category: 'purchase', policy: 'always', locked: true},
  {category: 'security', policy: 'always'},
  {category: 'calendar', policy: 'high-risk'},
  {category: 'home', policy: 'high-risk'},
  {category: 'research', policy: 'never'},
];

const store = new JsonStore<ActionPolicy[]>(
  path.join(config.dataDir, 'policies.json'),
  () => DEFAULT_POLICIES,
);

export function getPolicies(): ActionPolicy[] {
  return store.read();
}

export function policyFor(category: ActionCategory): ConfirmationPolicy {
  return (
    store.read().find((entry) => entry.category === category)?.policy ?? 'always'
  );
}

/**
 * Locked categories reject changes outright — including changes Grace herself
 * proposes, which is the point.
 */
export function setPolicy(
  category: ActionCategory,
  policy: ConfirmationPolicy,
): {ok: boolean; reason?: string} {
  const current = store.read();
  const existing = current.find((entry) => entry.category === category);

  if (!existing) {
    return {ok: false, reason: `unknown action category "${category}"`};
  }

  if (existing.locked) {
    return {
      ok: false,
      reason: `"${category}" is a hard limit you set and cannot be relaxed here`,
    };
  }

  store.write(
    current.map((entry) =>
      entry.category === category ? {...entry, policy} : entry,
    ),
  );

  return {ok: true};
}

/**
 * Every real-world action in later phases routes through this before running.
 * Returns whether the action may proceed unattended.
 */
export function requiresConfirmation(
  category: ActionCategory,
  highRisk = false,
): boolean {
  const policy = policyFor(category);
  if (policy === 'always') return true;
  if (policy === 'never') return false;
  return highRisk;
}
