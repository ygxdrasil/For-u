import {config} from '../config';
import {geminiKey} from '../keys';
import {GeminiProvider} from './gemini';
import type {LlmProvider} from './types';

let provider: LlmProvider | null = null;
/** The key the current provider was built with, so a change rebuilds it. */
let builtWith: string | null = null;
/** Set by the self-test; a stub must never be replaced by a real provider. */
let overridden = false;

/**
 * Grace runs on Gemini Flash today because it has the most workable free tier.
 * The provider interface exists so that decision stays reversible.
 */
export function getProvider(): LlmProvider {
  if (overridden && provider) return provider;

  const key = geminiKey();
  // Rebuilt when the key changes, so a newly pasted one takes effect on the
  // next request rather than the next cold start.
  if (!provider || builtWith !== key) {
    provider = new GeminiProvider(key, config.model);
    builtWith = key;
  }
  return provider;
}

/**
 * Swap the model out from under Grace. Exists so the whole pipeline — memory,
 * persona, learning, streaming — can be exercised without a network call.
 */
export function setProvider(next: LlmProvider | null): void {
  provider = next;
  overridden = next !== null;
  builtWith = null;
}
