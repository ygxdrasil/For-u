import {randomUUID} from 'node:crypto';
import {goveeKey} from './keys';

/**
 * The lights, over Govee's open API.
 *
 * Written against v1 of their router API, which is the one an ordinary
 * developer key opens and the only one with a documented rate limit. Ten
 * thousand calls a day, which is more than a person can ask for by speaking.
 *
 * Deliberately narrow: on, off, brightness, colour. A light has a dozen other
 * capabilities — scenes, music modes, diy effects — and every one of them
 * needs a device-specific identifier fetched at runtime, which turns "turn the
 * lights blue" into a two-request negotiation that fails differently on every
 * model. The four things above are on every bulb and strip Govee sells.
 */

class LightError extends Error {
  constructor(
    message: string,
    readonly needsKey = false,
  ) {
    super(message);
  }
}

const BASE = 'https://openapi.api.govee.com/router/api/v1';

async function call<T>(path: string, body?: unknown): Promise<T> {
  const key = goveeKey();
  if (!key) {
    throw new LightError(
      'The lights are not connected. Govee gives out an API key from the ' +
        'app, under Settings, About Us, Apply for API Key — it arrives by ' +
        'email. Pasting it into her keys is the whole setup.',
      true,
    );
  }

  const response = await fetch(`${BASE}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {'Govee-API-Key': key, 'Content-Type': 'application/json'},
    ...(body ? {body: JSON.stringify(body)} : {}),
    signal: AbortSignal.timeout(8000),
  });

  if (response.status === 401 || response.status === 403) {
    throw new LightError('Govee rejected the key. It may have been revoked.', true);
  }
  if (response.status === 429) {
    throw new LightError('Govee is rate-limiting; try again in a minute.');
  }
  if (!response.ok) throw new LightError(`Govee answered ${response.status}.`);

  const parsed = (await response.json()) as {code?: number; message?: string} & T;
  // Govee answers 200 with a failure code in the body more often than it
  // answers a failing status, so the body is where the truth is.
  if (parsed.code !== undefined && parsed.code !== 200 && parsed.code !== 0) {
    throw new LightError(parsed.message || `Govee refused that (${parsed.code}).`);
  }
  return parsed;
}

export interface Light {
  sku: string;
  device: string;
  name: string;
}

/**
 * The device list, briefly remembered.
 *
 * It is fetched before every single command, and it changes about twice a
 * year. Holding it for a minute takes a whole round trip out of "lights off"
 * and leaves plenty of room to notice a light that was added or renamed.
 */
let known: {at: number; lights: Light[]} | null = null;
const KNOWN_FOR_MS = 60_000;

export function forgetLights(): void {
  known = null;
}

export async function lights(): Promise<Light[]> {
  if (known && Date.now() - known.at < KNOWN_FOR_MS) return known.lights;

  const {data} = await call<{data?: {sku: string; device: string; deviceName: string}[]}>(
    '/user/devices',
  );
  const found = (data ?? []).map((one) => ({
    sku: one.sku,
    device: one.device,
    name: one.deviceName,
  }));

  known = {at: Date.now(), lights: found};
  return found;
}

/**
 * Which lights a spoken name means.
 *
 * No name at all means all of them, because "turn the lights off" is what
 * people say and enumerating rooms back at them is not an answer. A name that
 * matches nothing is reported rather than silently applied to everything —
 * turning on every light in the house because a word was misheard is exactly
 * the kind of thing that makes people stop trusting a voice assistant.
 */
export async function pick(said?: string): Promise<Light[]> {
  const all = await lights();
  if (all.length === 0) {
    throw new LightError('Govee has no devices on this account.');
  }

  const needle = (said ?? '').toLowerCase().trim();
  if (!needle || /^(all|the )?(lights?|everything)$/.test(needle)) return all;

  const found = all.filter((light) => light.name.toLowerCase().includes(needle));
  if (found.length === 0) {
    throw new LightError(
      `No light called "${said}". They are: ${all.map((one) => one.name).join(', ')}.`,
    );
  }
  return found;
}

type Capability =
  | {type: 'devices.capabilities.on_off'; instance: 'powerSwitch'; value: 0 | 1}
  | {type: 'devices.capabilities.range'; instance: 'brightness'; value: number}
  | {type: 'devices.capabilities.color_setting'; instance: 'colorRgb'; value: number};

export interface LightState {
  /** null wherever the device did not report — never guessed at. */
  on: boolean | null;
  brightness: number | null;
  /** Packed rgb, the same integer the control call takes. */
  colour: number | null;
  online: boolean | null;
}

const UNKNOWN: LightState = {on: null, brightness: null, colour: null, online: null};

/** What the light says about itself, which is the only account worth having. */
export async function stateOf(light: Light): Promise<LightState> {
  interface Reported {
    payload?: {capabilities?: {instance?: string; state?: {value?: unknown}}[]};
  }

  const reported = await call<Reported>('/device/state', {
    requestId: randomUUID(),
    payload: {sku: light.sku, device: light.device},
  });

  const found = new Map<string, unknown>();
  for (const one of reported.payload?.capabilities ?? []) {
    if (one.instance) found.set(one.instance, one.state?.value);
  }

  const number = (name: string): number | null => {
    const raw = found.get(name);
    return typeof raw === 'number' && Number.isFinite(raw) ? raw : null;
  };

  const power = number('powerSwitch');
  const online = found.get('online');

  return {
    on: power === null ? null : power === 1,
    brightness: number('brightness'),
    colour: number('colorRgb'),
    online: typeof online === 'boolean' ? online : null,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Govee accepts a second command to the same device instantly, and drops it.
 *
 * This is the whole of "she said she turned it red and nothing happened, and
 * then it worked the second time". Ask for something that is two changes —
 * dimmer *and* warmer — and she calls two tools, which run back to back a few
 * milliseconds apart. Govee answers 200 to both. One of them never reaches the
 * bulb. Nothing anywhere is an error, so she reports both as done, entirely
 * sincerely, and the room does not change.
 *
 * Roughly a second between commands to the same device is what it wants. The
 * gap is per-device, so two different lights still change together.
 */
const SETTLE_MS = 900;
const commandedAt = new Map<string, number>();

async function pace(device: string): Promise<void> {
  const since = Date.now() - (commandedAt.get(device) ?? 0);
  if (since < SETTLE_MS) await sleep(SETTLE_MS - since);
  commandedAt.set(device, Date.now());
}

/** Long enough for the cloud to have heard back from the bulb. */
const CONFIRM_AFTER_MS = 500;

/** A bulb rounds; a colour is not wrong because a channel is off by four. */
function close(a: number, b: number, by: number): boolean {
  return Math.abs(a - b) <= by;
}

function took(state: LightState, capability: Capability): boolean | null {
  switch (capability.instance) {
    case 'powerSwitch':
      return state.on === null ? null : state.on === (capability.value === 1);
    case 'brightness':
      return state.brightness === null
        ? null
        : close(state.brightness, capability.value, 3);
    case 'colorRgb': {
      if (state.colour === null) return null;
      const channels = (packed: number) => [
        (packed >> 16) & 255,
        (packed >> 8) & 255,
        packed & 255,
      ];
      const got = channels(state.colour);
      const wanted = channels(capability.value);
      return got.every((value, at) => close(value, wanted[at]!, 8));
    }
  }
}

/**
 * Tell one light to do one thing, and then look to see whether it did.
 *
 * The verification is the point. Every failure mode here — the dropped second
 * command, a bulb that has fallen off the wifi, a strip mid-firmware-update —
 * looks identical from the sending side: a 200 and a cheerful body. Without
 * reading the state back there is no difference between "done" and "accepted
 * and discarded", and she was reporting the second as the first.
 *
 * A state read that does not mention the thing we changed is *unknown*, not
 * failed. Some models do not report every capability, and turning "I could not
 * check" into "it did not work" would be its own kind of lying.
 */
async function control(light: Light, capability: Capability): Promise<LightState> {
  const send = async () => {
    await pace(light.device);
    await call('/device/control', {
      requestId: randomUUID(),
      payload: {sku: light.sku, device: light.device, capability},
    });
  };

  await send();
  await sleep(CONFIRM_AFTER_MS);

  let state = await stateOf(light).catch(() => UNKNOWN);
  if (took(state, capability) !== false) return state;

  // It was accepted and discarded. Now that we know, say it again — this time
  // with the pacing gap in front of it, which is what it wanted all along.
  await send();
  await sleep(CONFIRM_AFTER_MS);

  state = await stateOf(light).catch(() => UNKNOWN);
  if (took(state, capability) === false) {
    throw new LightError(
      `${light.name} took the instruction and did not act on it, twice. ` +
        (state.online === false
          ? 'It is showing as offline.'
          : 'It may be off the network or mid-update.'),
    );
  }

  return state;
}

export async function setPower(said: string | undefined, on: boolean): Promise<string[]> {
  const chosen = await pick(said);
  await Promise.all(
    chosen.map((light) =>
      control(light, {
        type: 'devices.capabilities.on_off',
        instance: 'powerSwitch',
        value: on ? 1 : 0,
      }),
    ),
  );
  return chosen.map((light) => light.name);
}

/**
 * A change that landed, and the lights it will not be visible on.
 *
 * Setting a colour on a light that is switched off succeeds completely and
 * changes nothing anybody can see. Reporting that as done is true and useless.
 * She is told which ones are dark so she can say so — and not told to switch
 * them on, because "make it red" and "sleep mode" want opposite things from a
 * light that is currently off, and guessing between them is how an assistant
 * ends up putting the lights on at bedtime.
 */
export interface Applied {
  lights: string[];
  dark: string[];
}

export async function setBrightness(
  said: string | undefined,
  percent: number,
): Promise<Applied> {
  const level = Math.max(1, Math.min(100, Math.round(percent)));
  const chosen = await pick(said);
  const states = await Promise.all(
    chosen.map((light) =>
      control(light, {
        type: 'devices.capabilities.range',
        instance: 'brightness',
        value: level,
      }),
    ),
  );
  return {
    lights: chosen.map((light) => light.name),
    dark: chosen.filter((_, at) => states[at]?.on === false).map((light) => light.name),
  };
}

/**
 * Colours by the names people actually say.
 *
 * Not a full colour dictionary — a spoken interface needs the twenty words
 * anyone uses out loud, and "turn the lights periwinkle" can be answered with
 * the list rather than guessed at. Warm and cool are here because they are how
 * people talk about lamps, and neither is a hue anyone would name.
 */
export const COLOURS: Record<string, [number, number, number]> = {
  red: [255, 0, 0],
  orange: [255, 110, 0],
  amber: [255, 170, 40],
  yellow: [255, 230, 0],
  lime: [160, 255, 0],
  green: [0, 255, 60],
  teal: [0, 220, 190],
  cyan: [0, 220, 255],
  blue: [0, 90, 255],
  indigo: [75, 0, 220],
  violet: [150, 60, 255],
  purple: [180, 0, 255],
  magenta: [255, 0, 200],
  pink: [255, 105, 180],
  white: [255, 255, 255],
  warm: [255, 180, 110],
  cool: [200, 225, 255],
  gold: [255, 200, 70],
};

export async function setColour(
  said: string | undefined,
  colour: string,
): Promise<Applied & {colour: string}> {
  const wanted = colour.toLowerCase().trim();
  const rgb = COLOURS[wanted];
  if (!rgb) {
    throw new LightError(
      `I don't have a "${colour}". I know: ${Object.keys(COLOURS).join(', ')}.`,
    );
  }

  const chosen = await pick(said);
  // Govee wants the three channels packed into one integer, which is what a
  // hex colour has always been.
  const packed = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  const states = await Promise.all(
    chosen.map((light) =>
      control(light, {
        type: 'devices.capabilities.color_setting',
        instance: 'colorRgb',
        value: packed,
      }),
    ),
  );
  return {
    lights: chosen.map((light) => light.name),
    dark: chosen.filter((_, at) => states[at]?.on === false).map((light) => light.name),
    colour: wanted,
  };
}

/** The nearest colour she has a word for, so state can be said rather than shown. */
export function nameOfColour(packed: number): string {
  const channels = [(packed >> 16) & 255, (packed >> 8) & 255, packed & 255];
  let nearest = 'something';
  let best = Infinity;

  for (const [name, rgb] of Object.entries(COLOURS)) {
    const distance = rgb.reduce(
      (total, value, at) => total + (value - channels[at]!) ** 2,
      0,
    );
    if (distance < best) {
      best = distance;
      nearest = name;
    }
  }
  return nearest;
}

/** Everything she can currently say about the lights, read from the lights. */
export async function survey(said?: string): Promise<
  {name: string; state: LightState}[]
> {
  const chosen = await pick(said);
  return Promise.all(
    chosen.map(async (light) => ({
      name: light.name,
      state: await stateOf(light).catch(() => UNKNOWN),
    })),
  );
}

export function lightsConfigured(): boolean {
  return Boolean(goveeKey());
}

export {LightError};
