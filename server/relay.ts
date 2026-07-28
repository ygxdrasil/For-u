import {randomBytes, timingSafeEqual} from 'node:crypto';
import {Document} from './store/index';

/**
 * The way in from everything that isn't her own page.
 *
 * A browser tab is not allowed to listen for its name while it is closed, and
 * no amount of code changes that — every phone operating system stops it on
 * purpose, because a website that could hear you after you left it would be an
 * appalling thing to be able to build. So the wake word has to come from
 * something the phone already trusts to listen: Siri, or the Assistant, or a
 * button on a watch. Those can all reach a URL. None of them can hold a
 * session cookie or type a password.
 *
 * Hence a token. It stands in for signing in, it is the only thing guarding
 * this door, and so it is long, compared in constant time, and can be replaced
 * in one tap if a phone with a shortcut on it is ever lost.
 *
 * Held separately from the laptop bridge's token on purpose. Two doors, two
 * keys: rolling the one on your phone must not silently stop the console
 * answering, and the two are set up months apart by different means.
 */

interface RelayDoc {
  token: string | null;
  /** When something last came through, so the panel can say if it is working. */
  usedAt: string | null;
  /** How many turns have arrived this way, purely so it is visibly alive. */
  turns: number;
}

const store = new Document<RelayDoc>('relay', () => ({
  token: null,
  usedAt: null,
  turns: 0,
}));

export async function relayToken(): Promise<string> {
  const current = await store.read();
  if (current.token) return current.token;

  const token = randomBytes(24).toString('base64url');
  await store.write({...current, token});
  return token;
}

/** Replaces the token, which immediately stops every shortcut using the old one. */
export async function rollRelayToken(): Promise<string> {
  const token = randomBytes(24).toString('base64url');
  await store.update((current) => ({...current, token}));
  return token;
}

export async function relayStatus(): Promise<{usedAt: string | null; turns: number}> {
  const {usedAt, turns} = await store.read();
  return {usedAt, turns};
}

/**
 * Constant-time, because this is the only thing standing in front of her.
 *
 * A length check leaks length, which is fine — the token is a fixed size and
 * everyone knows it. Comparing contents byte by byte with an early exit would
 * leak how much of a guess was right, which is not.
 */
export async function relayAllows(offered: string): Promise<boolean> {
  if (!offered) return false;

  const real = await relayToken();
  const left = Buffer.from(offered);
  const right = Buffer.from(real);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** Noted after a turn actually goes through, so the panel can show a heartbeat. */
export async function noteRelayUse(): Promise<void> {
  await store.update((current) => ({
    ...current,
    usedAt: new Date().toISOString(),
    turns: current.turns + 1,
  }));
}

/**
 * The address to put in a phone, built to survive the header it comes from.
 *
 * `x-forwarded-host` is not one value. A request through two proxies carries
 * both hostnames, comma-separated, and node hands the header back as an array
 * when it appears twice. Stringifying either of those produces
 * "one.example.com,two.example.com", and an address with a comma in it is not
 * an address — it is a string a phone rejects outright as an unsupported URL,
 * which is a strange and unhelpful thing to be told when the only thing you
 * did was tap Copy.
 *
 * So: first value only, and it has to look like a hostname before it is
 * trusted. A relative path is the fallback, because a wrong absolute address
 * that looks plausible is worse than an obviously incomplete one — the second
 * can be spotted and asked about, the first is debugged for an hour.
 */
export function relayUrl(
  forwarded: string | string[] | undefined,
  direct: string | undefined,
  secure = true,
): string {
  const first = (value: string | string[] | undefined): string =>
    (Array.isArray(value) ? value[0] : (value ?? '')).split(',')[0]!.trim();

  const host = first(forwarded) || first(direct);
  // Hostname, optionally with a port. Anything else is a header worth ignoring.
  if (!/^[a-z0-9.-]+(:\d+)?$/i.test(host)) return '/api/relay';

  // Plain http for a machine on your desk, which has no certificate and never
  // will; https for anything that reached here through the internet.
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/i.test(host);
  return `${secure && !local ? 'https' : 'http'}://${host}/api/relay`;
}

/**
 * Her reply, cut down to something worth hearing read aloud.
 *
 * Whatever calls this is going to speak the answer through a phone speaker,
 * often while the phone is in a pocket. Markdown becomes noise there —
 * asterisks are pronounced by some voices and swallowed by others, and a
 * bulleted list read aloud is a wall. Links are worse: nobody has ever wanted
 * to hear a URL spoken. None of this touches what she said or what is stored;
 * it is only the shape it leaves in.
 */
export function forSpeaking(reply: string): string {
  return (
    reply
      // Links keep their words and lose their address.
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, 'the link on screen')
      // Emphasis and headings are punctuation for the eye only.
      .replace(/[*_`#]+/g, '')
      // A list item becomes a sentence, since "dash buy milk" is not a sentence.
      .replace(/^\s*[-•]\s+/gm, '')
      .replace(/\n{2,}/g, '\n')
      .trim()
  );
}
