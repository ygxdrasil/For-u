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

export async function lights(): Promise<Light[]> {
  const {data} = await call<{data?: {sku: string; device: string; deviceName: string}[]}>(
    '/user/devices',
  );
  return (data ?? []).map((one) => ({
    sku: one.sku,
    device: one.device,
    name: one.deviceName,
  }));
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

async function control(light: Light, capability: Capability): Promise<void> {
  await call('/device/control', {
    requestId: randomUUID(),
    payload: {sku: light.sku, device: light.device, capability},
  });
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

export async function setBrightness(
  said: string | undefined,
  percent: number,
): Promise<string[]> {
  const level = Math.max(1, Math.min(100, Math.round(percent)));
  const chosen = await pick(said);
  await Promise.all(
    chosen.map((light) =>
      control(light, {
        type: 'devices.capabilities.range',
        instance: 'brightness',
        value: level,
      }),
    ),
  );
  return chosen.map((light) => light.name);
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
): Promise<{lights: string[]; colour: string}> {
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
  await Promise.all(
    chosen.map((light) =>
      control(light, {
        type: 'devices.capabilities.color_setting',
        instance: 'colorRgb',
        value: packed,
      }),
    ),
  );
  return {lights: chosen.map((light) => light.name), colour: wanted};
}

export function lightsConfigured(): boolean {
  return Boolean(goveeKey());
}

export {LightError};
