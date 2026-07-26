import type {AttentionMode, ModeState} from '../shared/types';
import {Document} from './store/index';

/**
 * How much of your attention Grace may take.
 *
 * This is not decoration. It changes how she writes, whether she volunteers
 * anything unprompted, and how much she is willing to interrupt — which is the
 * difference between an assistant and a nuisance.
 */
export const MODES: Record<AttentionMode, {label: string; blurb: string; guidance: string}> = {
  open: {
    label: 'Open',
    blurb: 'Normal. She speaks up when it’s worth it.',
    guidance:
      'No special constraints. Answer as you normally would, and raise anything genuinely worth raising.',
  },
  work: {
    label: 'Work',
    blurb: 'Brisk and on-task. Personal matters wait.',
    guidance:
      'The user is working. Be brisk and concrete — lead with the answer, cut the preamble entirely. Keep replies to a sentence or two unless asked for more. Hold anything personal or non-urgent until they are out of Work mode, and say you are holding it rather than dropping it.',
  },
  focus: {
    label: 'Focus',
    blurb: 'Answers only. Nothing volunteered.',
    guidance:
      'The user is concentrating and every word costs them. Answer exactly what was asked, in as few words as will do — often a fragment rather than a sentence. Volunteer nothing at all: no observations, no suggestions, no follow-up questions. If something is genuinely urgent, say only that it is urgent and what it is, in under ten words.',
  },
  away: {
    label: 'Away',
    blurb: 'She takes messages and holds them.',
    guidance:
      'The user is away from their desk and may be listening rather than reading. Assume everything is being spoken aloud: short sentences, no detail they cannot hold in their head. Take note of anything that arrives and tell them it is waiting rather than working through it now.',
  },
};

const DEFAULT: ModeState = {mode: 'open', since: new Date(0).toISOString()};

const store = new Document<ModeState>('mode', () => DEFAULT);

export function getMode(): Promise<ModeState> {
  return store.read();
}

export function isMode(value: unknown): value is AttentionMode {
  // `in` walks the prototype chain, so "toString" and "constructor"
  // passed and were persisted, after which every prompt ended with
  // "you are in undefined mode. undefined".
  return typeof value === 'string' && Object.hasOwn(MODES, value);
}

export async function setMode(mode: AttentionMode): Promise<ModeState> {
  const current = await store.read();
  // Re-selecting the mode you are already in shouldn't reset the clock; how
  // long you have been heads-down is worth knowing.
  if (current.mode === mode) return current;

  const next: ModeState = {mode, since: new Date().toISOString()};
  await store.write(next);
  return next;
}
