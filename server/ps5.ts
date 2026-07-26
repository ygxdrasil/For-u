import {psnToken} from './keys';
import {Document} from './store/index';

/**
 * The PlayStation, as far as it can honestly be reached.
 *
 * Sony publishes no API. What exists is the one the PlayStation mobile app
 * talks to, and it is reachable with the same credential the app holds: an
 * NPSSO cookie, taken from a browser already signed in to PSN. That gets us
 * everything the app shows — who is online, what is being played right now,
 * which console it is on, what was played recently, the trophy count.
 *
 * What it cannot do is switch the console on or start a game. Those go over
 * the local network to the console itself, and Grace runs in a data centre.
 * She can see the PlayStation; she cannot press its buttons. Saying otherwise
 * would be the kind of lie that is only found out at the moment it matters.
 *
 * Everything here reads. There is nothing that posts, buys, or removes.
 */

const AUTH = 'https://ca.account.sony.com/api/authz/v3/oauth';
const PROFILE = 'https://m.np.playstation.com/api/userProfile/v1/internal/users';
const TROPHY = 'https://m.np.playstation.com/api/trophy/v1/users';
const GRAPH = 'https://web.np.playstation.com/api/graphql/v1/op';

/** The mobile app's own client, which is the only one Sony accepts. */
const CLIENT_AUTH =
  'Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A=';
const CLIENT_ID = '09515159-7237-4370-9b40-3806e67c0891';
const REDIRECT = 'com.scee.psxandroid.scecompcall://redirect';
const SCOPE = 'psn:mobile.v2.core psn:clientapp';

interface Session {
  accessToken: string;
  /** Epoch ms. Access tokens last about an hour. */
  expiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
}

const session = new Document<Session | null>('psn', () => null);

/** Thrown with a sentence the user can act on rather than a status code. */
export class PsnError extends Error {
  constructor(
    message: string,
    /** True when the NPSSO needs pasting again — it is the usual failure. */
    readonly needsToken = false,
  ) {
    super(message);
  }
}

export function psnConfigured(): boolean {
  return Boolean(psnToken());
}

async function tokensFromNpsso(npsso: string): Promise<Session> {
  const query = new URLSearchParams({
    access_type: 'offline',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: SCOPE,
  });

  // Sony answers with a redirect whose location carries the code. Following it
  // would lose it: the target is a mobile app's custom scheme, not a URL.
  const handshake = await fetch(`${AUTH}/authorize?${query}`, {
    headers: {Cookie: `npsso=${npsso}`},
    redirect: 'manual',
  });

  const location = handshake.headers.get('location') ?? '';
  if (!location.includes('?code=')) {
    throw new PsnError(
      'PlayStation would not accept that sign-in code. They expire after a ' +
        'couple of months — fetch a fresh one and paste it in again.',
      true,
    );
  }

  const code = new URLSearchParams(location.split('redirect/')[1] ?? '').get('code');
  if (!code) throw new PsnError('PlayStation sent back no sign-in code.', true);

  return exchange({
    code,
    redirect_uri: REDIRECT,
    grant_type: 'authorization_code',
    token_format: 'jwt',
  });
}

async function exchange(body: Record<string, string>): Promise<Session> {
  const response = await fetch(`${AUTH}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: CLIENT_AUTH,
    },
    body: new URLSearchParams(body).toString(),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const accessToken = typeof data.access_token === 'string' ? data.access_token : '';
  if (!accessToken) {
    throw new PsnError(
      `PlayStation refused the sign-in (${String(data.error_description ?? response.status)}).`,
      true,
    );
  }

  const now = Date.now();
  return {
    accessToken,
    // A minute of margin, so a token never expires mid-request.
    expiresAt: now + (Number(data.expires_in) || 3600) * 1000 - 60_000,
    refreshToken: String(data.refresh_token ?? ''),
    refreshExpiresAt: now + (Number(data.refresh_token_expires_in) || 0) * 1000,
  };
}

/**
 * A usable access token, by whichever route is cheapest.
 *
 * Refreshing beats re-exchanging the NPSSO: the NPSSO is the long-lived
 * credential and every use of it is a chance for Sony to decide it looks like
 * a login from somewhere new.
 */
async function token(): Promise<string> {
  const npsso = psnToken();
  if (!npsso) {
    throw new PsnError(
      'The PlayStation is not connected. Paste an NPSSO code into her keys.',
      true,
    );
  }

  const saved = await session.read();
  const now = Date.now();

  if (saved && saved.expiresAt > now) return saved.accessToken;

  if (saved?.refreshToken && saved.refreshExpiresAt > now) {
    try {
      const refreshed = await exchange({
        refresh_token: saved.refreshToken,
        grant_type: 'refresh_token',
        token_format: 'jwt',
        scope: SCOPE,
      });
      await session.write(refreshed);
      return refreshed.accessToken;
    } catch {
      // Fall through to the NPSSO. A refresh token can be revoked on its own.
    }
  }

  const fresh = await tokensFromNpsso(npsso);
  await session.write(fresh);
  return fresh.accessToken;
}

async function read<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    throw new PsnError(
      'PlayStation stopped accepting the connection. The code needs pasting again.',
      true,
    );
  }

  const data = (await response.json().catch(() => null)) as T | null;
  if (!data) throw new PsnError('PlayStation sent back nothing readable.');
  return data;
}

export interface Presence {
  online: boolean;
  /** "playing", "online", "offline" — what the app itself would show. */
  status: string;
  /** The game, when one is running. */
  playing: string | null;
  /** "PS5", "PS4", "mobile" — where they are. */
  platform: string | null;
  lastOnline: string | null;
}

/**
 * What the console is doing right now.
 *
 * "me" resolves to the signed-in account, so nothing has to be stored about
 * who the user is.
 */
export async function presence(): Promise<Presence> {
  const data = await read<{
    basicPresence?: {
      availability?: string;
      primaryPlatformInfo?: {onlineStatus?: string; platform?: string; lastOnlineDate?: string};
      gameTitleInfoList?: {titleName?: string; format?: string}[];
    };
  }>(`${PROFILE}/me/basicPresences?type=primary`);

  const basic = data.basicPresence ?? {};
  const platformInfo = basic.primaryPlatformInfo ?? {};
  const game = basic.gameTitleInfoList?.[0];
  const online = platformInfo.onlineStatus === 'online';

  return {
    online,
    status: game?.titleName ? 'playing' : online ? 'online' : 'offline',
    playing: game?.titleName ?? null,
    platform: game?.format ?? platformInfo.platform ?? null,
    lastOnline: platformInfo.lastOnlineDate ?? null,
  };
}

export interface Player {
  onlineId: string;
  /** Trophy level, which is the number people actually quote. */
  level: number | null;
  plus: boolean;
}

export async function player(): Promise<Player> {
  const data = await read<{
    onlineId?: string;
    isPsPlus?: boolean;
    trophySummary?: {level?: number};
  }>(`${PROFILE}/me/profiles`);

  return {
    onlineId: data.onlineId ?? 'unknown',
    level: data.trophySummary?.level ?? null,
    plus: Boolean(data.isPsPlus),
  };
}

export interface Trophies {
  level: number;
  progress: number;
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
}

export async function trophies(): Promise<Trophies> {
  const data = await read<{
    trophyLevel?: string | number;
    progress?: number;
    earnedTrophies?: {platinum?: number; gold?: number; silver?: number; bronze?: number};
  }>(`${TROPHY}/me/trophySummary`);

  const earned = data.earnedTrophies ?? {};
  return {
    level: Number(data.trophyLevel ?? 0),
    progress: Number(data.progress ?? 0),
    platinum: earned.platinum ?? 0,
    gold: earned.gold ?? 0,
    silver: earned.silver ?? 0,
    bronze: earned.bronze ?? 0,
  };
}

export interface PlayedGame {
  name: string;
  platform: string | null;
  lastPlayed: string | null;
}

/**
 * What has been played lately.
 *
 * This one is a persisted GraphQL query rather than a REST route — the same
 * one the PlayStation app itself sends, hash and all.
 */
export async function recentlyPlayed(limit = 10): Promise<PlayedGame[]> {
  const url = new URL(GRAPH);
  url.searchParams.set('operationName', 'getUserGameList');
  url.searchParams.set(
    'variables',
    JSON.stringify({limit, categories: 'ps4_game,ps5_native_game'}),
  );
  url.searchParams.set(
    'extensions',
    JSON.stringify({
      persistedQuery: {
        version: 1,
        sha256Hash: 'e780a6d8b921ef0c59ec01ea5c5255671272ca0d819edb61320914cf7a78b3ae',
      },
    }),
  );

  const data = await read<{
    data?: {gameLibraryTitlesRetrieve?: {games?: {name?: string; platform?: string; lastPlayedDateTime?: string}[]}};
  }>(url.toString());

  const games = data.data?.gameLibraryTitlesRetrieve?.games ?? [];
  return games.map((game) => ({
    name: game.name ?? 'an unnamed game',
    platform: game.platform ?? null,
    lastPlayed: game.lastPlayedDateTime ?? null,
  }));
}

/** Everything at once, for the dashboard and the status route. */
export async function playstation() {
  const [now, who, cabinet] = await Promise.all([
    presence(),
    player().catch(() => null),
    trophies().catch(() => null),
  ]);
  return {presence: now, player: who, trophies: cabinet};
}

/** Test seam: forget the cached tokens without touching the NPSSO. */
export async function forgetPsnSession(): Promise<void> {
  await session.write(null);
}
