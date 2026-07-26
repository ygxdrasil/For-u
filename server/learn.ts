import {Type} from '@google/genai';
import type {ProfileEntry} from '../shared/types';
import {config} from './config';
import {getProvider} from './llm/index';
import {getProfile, noteStyle, remember, supersedeEntry} from './memory';

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    entries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kind: {
            type: Type.STRING,
            enum: ['fact', 'preference', 'routine', 'goal'],
          },
          text: {type: Type.STRING},
          source: {type: Type.STRING, enum: ['stated', 'inferred']},
        },
        required: ['kind', 'text', 'source'],
      },
    },
    outdated: {
      type: Type.ARRAY,
      description: 'Known entries this exchange contradicts, copied verbatim.',
      items: {type: Type.STRING},
    },
    style: {
      type: Type.ARRAY,
      description: 'How to deal with this person, learned from how they behave.',
      items: {type: Type.STRING},
    },
  },
  required: ['entries'],
};

const SYSTEM = `You maintain the long-term profile of one person, on behalf of their assistant Grace.

Read the exchange and pull out only things worth remembering months from now:
- fact: something stable about them or their circumstances
- preference: how they like things done
- routine: something recurring in their life
- goal: something they are working towards

Rules:
- Record nothing that is already known. The current profile is given to you.
- Record nothing transient: passing moods, one-off questions, the weather, what they asked you to do just now.
- Write each entry as a short third-person statement about the user, understandable on its own with no context. "Prefers to be called in the evening", not "said evening is fine".
- Mark it "stated" only if they said it outright. Anything you worked out is "inferred".
- Returning an empty list is the normal outcome. Do not reach.
- If they say something again that is already known, list it again anyway. Repetition is evidence, and being told twice matters.

Also return two other things when they apply, and empty lists when they do not.

"outdated": anything in the known profile this exchange contradicts, copied word for word from the list you were given. If they used to work mornings and have just said they now work nights, the morning entry is outdated. Do not list something merely because it went unmentioned.

"style": how to deal with this person, learned from how they actually behave rather than what they claim. Not facts about their life — habits of dealing with them. "Cuts you off when you give more than two sentences." "Asks follow-up questions rather than accepting the first answer." "Says thanks and moves on; does not want elaboration." "Prefers being given the answer before the reasoning." Only add one when the exchange genuinely showed it. Most exchanges show nothing, and an empty list is the right answer.`;

interface Extraction {
  entries: {
    kind: ProfileEntry['kind'];
    text: string;
    source: ProfileEntry['source'];
  }[];
  outdated?: string[];
  style?: string[];
}

/**
 * Runs after a reply is delivered, never in front of one. A failure here costs
 * a fact Grace would otherwise have picked up, and nothing more.
 */
export async function learnFrom(
  userText: string,
  graceText: string,
): Promise<ProfileEntry[]> {
  if (!config.learnFromConversation) return [];

  const known = (await getProfile()).entries.filter((entry) => !entry.supersededAt);
  const knownList =
    known.length > 0
      ? known.map((entry) => `- ${entry.text}`).join('\n')
      : '(nothing recorded yet)';

  try {
    const raw = await getProvider().complete({
      system: SYSTEM,
      turns: [
        {
          role: 'user',
          text: `Already known:\n${knownList}\n\nExchange:\nUser: ${userText}\nGrace: ${graceText}`,
        },
      ],
      temperature: 0,
      json: SCHEMA,
      maxOutputTokens: 700,
    });

    const parsed = JSON.parse(raw) as Extraction;
    if (!Array.isArray(parsed.entries)) return [];

    // Superseded, never removed: that they used to think otherwise is itself
    // worth keeping, and an assistant insisting on last month's version of
    // someone is worse than one who forgets.
    for (const stale of parsed.outdated ?? []) {
      await supersedeEntry(stale).catch(() => false);
    }

    await noteStyle(parsed.style ?? []).catch(() => {});

    return remember(
      parsed.entries
        .filter((entry) => entry.text?.trim())
        .map((entry) => ({
          kind: entry.kind,
          text: entry.text.trim(),
          source: entry.source === 'stated' ? 'stated' : 'inferred',
        })),
    );
  } catch (error) {
    console.error('[grace] could not update profile:', (error as Error).message);
    return [];
  }
}
