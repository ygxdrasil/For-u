import {getProfile} from './memory';
import {getProvider} from './llm/index';

/**
 * A weather line, cheaply.
 *
 * She can already search; this asks once and holds the answer for half an
 * hour, so a dashboard glance is free after the first look and the pulse can
 * add "take a coat" without a fetch of its own.
 *
 * The hard part is location. A server has none, so it is pulled from what she
 * already knows about the user — an entry naming where they live. With no such
 * fact there is no honest forecast to give, and the panel simply stays away
 * rather than guessing at a city.
 */

let cached: {line: string | null; place: string | null; until: number} | null = null;
const FRESH_FOR_MS = 30 * 60 * 1000;

const PLACE = /\b(?:lives?|living|based|located|from|home)\b[^.]*?\bin\s+([A-Z][a-zA-Z .'-]{2,40})/;

/** Best guess at where they are, from the profile. Null when unknown. */
async function place(): Promise<string | null> {
  const {entries} = await getProfile();
  for (const entry of entries) {
    if (entry.supersededAt) continue;
    const found = PLACE.exec(entry.text);
    if (found) return found[1].trim();
  }
  return null;
}

export async function weatherLine(): Promise<string | null> {
  if (cached && cached.until > Date.now()) return cached.line;

  const where = await place();
  if (!where) {
    cached = {line: null, place: null, until: Date.now() + FRESH_FOR_MS};
    return null;
  }

  try {
    const line = await getProvider().complete({
      system:
        'Answer in one short spoken sentence: the current weather and today ' +
        'for the place named. Temperature, conditions, and whether rain is ' +
        'likely. No preamble, no lists.',
      turns: [{role: 'user', text: `Weather in ${where} right now and today.`}],
      search: true,
      temperature: 0,
      maxOutputTokens: 120,
    });
    cached = {line: line.trim() || null, place: where, until: Date.now() + FRESH_FOR_MS};
    return cached.line;
  } catch {
    cached = {line: null, place: where, until: Date.now() + FRESH_FOR_MS};
    return null;
  }
}
