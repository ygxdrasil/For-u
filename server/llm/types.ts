/**
 * The seam between Grace and whichever model is behind her.
 *
 * Everything above this interface is provider-agnostic, so swapping Gemini for
 * Claude (or routing per task) is a matter of adding one file here.
 */

export interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

export interface GenerateRequest {
  system: string;
  turns: Turn[];
  signal?: AbortSignal;
  /** Lower for extraction work, higher for conversation. */
  temperature?: number;
  maxOutputTokens?: number;
  /** Ask the provider to return JSON matching this shape. */
  json?: object;
  /** Disable model-side deliberation where supported, for latency. */
  fast?: boolean;
}

export interface TranscribeRequest {
  /** Base64 audio. WAV, because every browser can be made to produce it. */
  audio: string;
  mimeType: string;
  signal?: AbortSignal;
}

export interface LlmProvider {
  readonly name: string;
  readonly model: string;
  stream(request: GenerateRequest): AsyncIterable<string>;
  complete(request: GenerateRequest): Promise<string>;
  /**
   * Turn spoken audio into text.
   *
   * Grace's hearing used to rely on the browser's own speech recognition,
   * which does not exist in Firefox or on iOS, routes audio through Google
   * regardless, and fails silently on an unhappy network. Doing it here works
   * anywhere a microphone does.
   */
  transcribe(request: TranscribeRequest): Promise<string>;
}
