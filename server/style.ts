import {recentMail, readMail} from './google/gmail';
import {getProvider} from './llm/index';
import {Document} from './store/index';

/**
 * How the user writes, learned from what they have actually sent.
 *
 * A draft in an assistant's voice is worse than no draft: you have to rewrite
 * it before you can send it, and rewriting is the part you wanted help with.
 * A draft in your own voice you read once and send.
 *
 * So she reads the sent folder — nothing else is a record of how someone
 * writes to real people — and keeps a description of it. Not the mail itself:
 * a paragraph about greetings, sign-offs, length, and register, which is the
 * part that transfers to a message she has never seen.
 *
 * It is rebuilt as they write more, so it follows them rather than freezing
 * whatever they sounded like the week it was first built.
 */

interface Style {
  /** Prose description of how they write. Null until enough has been read. */
  description: string | null;
  /** How many sent messages it was built from. */
  samples: number;
  builtAt: string | null;
}

const store = new Document<Style>('style', () => ({
  description: null,
  samples: 0,
  builtAt: null,
}));

/** Rebuilt roughly weekly, so it keeps up without costing anything daily. */
const STALE_MS = 7 * 24 * 60 * 60 * 1000;

/** Enough to see a pattern; few enough to stay one cheap request. */
const SAMPLES = 8;

export async function writingStyle(): Promise<string | null> {
  return (await store.read()).description;
}

function fresh(style: Style): boolean {
  if (!style.description || !style.builtAt) return false;
  return Date.now() - new Date(style.builtAt).getTime() < STALE_MS;
}

/**
 * Read the sent folder and describe how they write.
 *
 * Runs in the background, never in front of a reply. Failure is silence: she
 * simply drafts in a neutral voice, which is what she did before.
 */
export async function learnWritingStyle(force = false): Promise<boolean> {
  const current = await store.read();
  if (!force && fresh(current)) return false;

  const sent = await recentMail('in:sent', SAMPLES).catch(() => []);
  if (sent.length < 3) return false;

  // Bodies, not subject lines: the register lives in how someone opens, how
  // they close, and how long they go on for.
  const bodies = (
    await Promise.all(
      sent.slice(0, SAMPLES).map((message) =>
        readMail(message.id)
          .then((full) => full.body.slice(0, 1200))
          .catch(() => ''),
      ),
    )
  ).filter((body) => body.trim().length > 40);

  if (bodies.length < 3) return false;

  const description = await getProvider()
    .complete({
      system:
        'You are describing how one person writes email, from a sample of ' +
        'messages they sent. Write a short paragraph another writer could ' +
        'follow to sound like them: how they open and close, how formal they ' +
        'are, typical length, whether they use contractions, punctuation ' +
        'habits, anything characteristic. Describe the manner only. Never ' +
        'repeat their content, never name the people they wrote to, and do ' +
        'not quote whole sentences. Under 150 words.',
      turns: [
        {
          role: 'user',
          text: bodies.map((body, index) => `--- message ${index + 1} ---\n${body}`).join('\n\n'),
        },
      ],
      temperature: 0.2,
      maxOutputTokens: 400,
    })
    .catch(() => '');

  if (!description.trim()) return false;

  await store.write({
    description: description.trim(),
    samples: bodies.length,
    builtAt: new Date().toISOString(),
  });
  return true;
}

/** The block dropped into her prompt when she might be asked to write. */
export async function styleNote(): Promise<string | null> {
  const description = await writingStyle();
  if (!description) return null;

  return `How the user writes email, taken from their own sent messages. Any draft you write for them must sound like this and not like you — they should be able to read it once and send it:\n\n${description}`;
}
