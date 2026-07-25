import {config} from '../config.ts';
import {GeminiProvider} from './gemini.ts';
import type {LlmProvider} from './types.ts';

let provider: LlmProvider | null = null;

/**
 * Grace runs on Gemini Flash today because it has the most workable free tier.
 * The provider interface exists so that decision stays reversible.
 */
export function getProvider(): LlmProvider {
  if (!provider) {
    provider = new GeminiProvider(config.apiKey, config.model);
  }
  return provider;
}
