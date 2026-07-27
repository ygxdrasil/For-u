import {randomUUID} from 'node:crypto';
import type {Workspace} from '../shared/types';
import {Document} from './store/index';

/**
 * The rooms of the app.
 *
 * A workspace is data, not code: a name, a colour, the pages it opens, and
 * what it puts on screen. That is the whole point — the user asked to be able
 * to add their own without waiting for me, and anything expressed as a React
 * component cannot be added by anyone but me.
 *
 * Saying "open work" and having a workspace appear is therefore the same
 * operation as tapping it in the rail: both resolve a name to one of these and
 * hand it to the interface.
 */

const DEFAULTS: Workspace[] = [
  {
    id: 'grace',
    name: 'Grace',
    icon: 'sparkles',
    accent: 'ice',
    opens: [],
    panels: ['orb', 'faculties', 'attention', 'connections', 'spend'],
    blurb: 'Her, and what she knows.',
  },
  {
    id: 'day',
    name: 'Home',
    icon: 'house',
    accent: 'ice',
    opens: [],
    panels: ['day', 'needs', 'weather', 'notes', 'situations', 'files', 'deeds'],
    blurb: 'Your day, and what wants you.',
  },
  {
    id: 'work',
    name: 'Work',
    icon: 'briefcase',
    accent: 'amber',
    // Opened in order; the first is the one brought forward.
    opens: ['https://app.n8n.cloud', 'https://mail.google.com'],
    panels: ['needs', 'github', 'workflows', 'notes', 'activity'],
    blurb: 'Mail, workflows, and what is failing.',
    brief: 'Brief me on my workflows and anything in my mail that needs me.',
  },
  {
    id: 'play',
    name: 'Play',
    icon: 'gamepad',
    accent: 'violet',
    opens: [],
    panels: ['day', 'playstation', 'games', 'activity'],
    blurb: 'The console, and what you have been playing.',
  },
];

const store = new Document<Workspace[]>('workspaces', () => DEFAULTS);

export async function workspaces(): Promise<Workspace[]> {
  const saved = await store.read();
  // A workspace added to the defaults after the user first ran her would
  // otherwise never appear, because their stored copy is authoritative.
  const missing = DEFAULTS.filter((one) => !saved.some((other) => other.id === one.id));
  return [...saved, ...missing].filter((one) => !one.hidden);
}

/**
 * Find one by name, however loosely it was said.
 *
 * "open work", "work mode", "workspace work" all have to land on the same
 * thing, and a transcription of speech will not match an id exactly.
 */
export async function findWorkspace(said: string): Promise<Workspace | null> {
  const needle = said.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (!needle) return null;

  const all = await workspaces();
  return (
    all.find((one) => one.id === needle || one.name.toLowerCase() === needle) ??
    all.find((one) => needle.includes(one.name.toLowerCase())) ??
    all.find((one) => one.name.toLowerCase().includes(needle)) ??
    null
  );
}

export async function saveWorkspace(patch: Partial<Workspace>): Promise<Workspace[]> {
  const clean: Workspace = {
    id: patch.id?.trim() || randomUUID().slice(0, 8),
    name: (patch.name ?? 'Untitled').trim().slice(0, 24),
    icon: patch.icon ?? 'sparkles',
    accent: patch.accent ?? 'ice',
    opens: (patch.opens ?? [])
      .map((url) => url.trim())
      .filter((url) => /^https?:\/\//i.test(url))
      .slice(0, 8),
    panels: patch.panels ?? [],
    blurb: patch.blurb?.slice(0, 80),
    brief: patch.brief?.slice(0, 200),
  };

  await store.update((current) => {
    const rest = current.filter((one) => one.id !== clean.id);
    // Keeps the order stable when editing, rather than shuffling to the end.
    const at = current.findIndex((one) => one.id === clean.id);
    if (at < 0) return [...current, clean];
    const next = [...rest];
    next.splice(at, 0, clean);
    return next;
  });

  return workspaces();
}

/**
 * Hidden, never removed.
 *
 * Her standing instruction is that nothing is deleted, and that applies to the
 * user's own arrangement of the app as much as to their mail: an unhidden
 * workspace comes back exactly as it was.
 */
export async function hideWorkspace(id: string): Promise<Workspace[]> {
  await store.update((current) => {
    const known = current.some((one) => one.id === id);
    const base = known ? current : [...current, ...DEFAULTS.filter((one) => one.id === id)];
    return base.map((one) => (one.id === id ? {...one, hidden: true} : one));
  });
  return workspaces();
}
