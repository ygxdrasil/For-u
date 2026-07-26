import './env.ts';
import path from 'node:path';

/**
 * Grace reads her settings from the environment so the same build can run as a
 * local daemon or a hosted service without code changes.
 */
export const config = {
  apiKey: process.env.GEMINI_API_KEY ?? '',

  /**
   * The model she thinks with.
   *
   * Flash, not Flash-Lite. Lite was chosen for speed before she had any
   * tools, and it turned out not to call them — it answered "I am a large
   * language model and cannot access real-time information" while holding a
   * working search tool. Deciding to use a tool is the thing small models are
   * worst at, and a fast wrong answer is not cheaper than a slower right one.
   *
   * Still the 2.5 line: grounding is marked "not available" on the free tier
   * for 3.x, so moving up a generation would cost her the web.
   */
  model: process.env.GRACE_MODEL ?? 'gemini-2.5-flash',

  /**
   * The model that listens. Deliberately not the fast one.
   *
   * Mishearing a name is far more costly than half a second, and this runs
   * once per spoken turn rather than on every token.
   */
  transcribeModel: process.env.GRACE_TRANSCRIBE_MODEL ?? 'gemini-2.5-flash',

  /** The model that gives her a voice. Separate from the one that thinks. */
  speechModel: process.env.GRACE_SPEECH_MODEL ?? 'gemini-2.5-flash-preview-tts',

  /**
   * Which of the prebuilt voices she speaks in. Kore is composed and even,
   * which is the brief: calm, formal, unhurried.
   */
  voice: process.env.GRACE_VOICE ?? 'Kore',

  /** Encrypts memory at rest, and signs login cookies. */
  secret: process.env.GRACE_SECRET,

  /** When set, Grace asks for this before she'll talk to anyone. */
  password: process.env.GRACE_PASSWORD ?? '',

  /** Where memory lives when running on local disk. */
  dataDir: process.env.GRACE_DATA_DIR ?? path.resolve(process.cwd(), '.grace'),

  port: Number(process.env.PORT ?? 3001),

  /** How many recent turns are replayed to the model verbatim. */
  verbatimTurns: 24,

  /** Once the log passes this many turns, older ones fold into a summary. */
  summarizeAfter: 40,

  /** Set GRACE_LEARN=false to stop Grace building a profile of you. */
  learnFromConversation: process.env.GRACE_LEARN !== 'false',

  /** True on Vercel and friends, where an open instance is a public one. */
  deployed: Boolean(process.env.VERCEL ?? process.env.GRACE_DEPLOYED),
} as const;

export function isConfigured(): boolean {
  return config.apiKey.length > 0;
}
