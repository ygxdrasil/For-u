import {Document} from './store/index';

/**
 * Light by the clock, and by what the evidence actually supports.
 *
 * The short version of a large literature: what matters most is how *bright*
 * a light is and *when* it reaches your eyes. Colour matters second. The paper
 * that settled the point put it plainly — "intensity is first order
 * information and spectrum is second order information" — and the same authors
 * are blunt that correlated colour temperature is not a usable proxy for a
 * light's biological effect at all. Warm-white is not automatically kind and
 * cool-white is not automatically harmful; a dim cool light at midnight is far
 * gentler than a blazing warm one.
 *
 * Which is why every scene here carries a brightness as well as a colour, and
 * why the evening ones are dim first and amber second. Selling somebody an
 * amber bulb at full power as a sleep aid is the commonest mistake in this
 * whole field.
 *
 * The consensus targets these are aimed at (Brown et al., PLOS Biology 2022):
 *
 *   daytime   at least 250 melanopic EDI lux at the eye
 *   evening   at most 10, from three hours before bed
 *   night     at most 1 in the room you sleep in
 *
 * An honest caveat, stated here rather than buried: one light strip cannot
 * deliver the daytime figure. Nothing short of a window or a dedicated therapy
 * lamp can — 250 melanopic lux at the eye is a lot of light. The daytime scenes
 * are pleasant and mildly alerting and are not a substitute for going outside.
 * The evening and night scenes are the ones that genuinely do the work, because
 * *staying under* a low ceiling is entirely achievable with a dimmed strip, and
 * it is the half that most affects how you sleep.
 *
 * Colour is expressed in kelvin because that is the language the research uses
 * and because it gives "warmer" and "cooler" an obvious meaning to slide along.
 * Below about 1500K the conversion produces a red with essentially no blue in
 * it, which is the point: wavelengths past roughly 560nm have very little
 * power to suppress melatonin, and red is as far from melanopsin's peak
 * sensitivity (~480nm) as visible light gets.
 */

export interface Scene {
  id: string;
  /** What she should recognise it as when spoken. */
  say: string[];
  kelvin: number;
  brightness: number;
  /** One line on why it is set this way, so she can answer "why". */
  why: string;
}

export const KELVIN_RANGE = {low: 1000, high: 6500} as const;

const DEFAULTS: Scene[] = [
  {
    id: 'morning',
    say: ['morning', 'wake up', 'wake', 'good morning'],
    kelvin: 5000,
    brightness: 100,
    why: 'Bright and blue-rich on waking anchors the body clock to the day. Real daylight does this far better — treat this as a stand-in until you get to a window.',
  },
  {
    id: 'day',
    say: ['day', 'midday', 'daytime', 'afternoon'],
    kelvin: 5500,
    brightness: 100,
    why: 'Daytime wants as much light as you can comfortably take. Brightness is doing the work here; the colour is a distant second.',
  },
  {
    id: 'work',
    say: ['work', 'working', 'focus', 'concentrate', 'study'],
    kelvin: 6000,
    brightness: 100,
    why: 'Blue-enriched white around 6000K measurably speeds up sustained attention and cuts sleepiness. It does little for deeper reasoning — it keeps you awake, it does not make you cleverer.',
  },
  {
    id: 'energise',
    say: ['energise', 'energize', 'boost', 'wake me up', 'slump'],
    kelvin: 6500,
    brightness: 100,
    why: 'The coolest and brightest setting, for the afternoon dip. Fine before about four in the afternoon and a bad idea after it.',
  },
  {
    id: 'reading',
    say: ['reading', 'read'],
    kelvin: 3200,
    brightness: 70,
    why: 'Enough light to read comfortably without the short wavelengths of a work setting. Eye strain comes from too little light far more often than from the wrong colour.',
  },
  {
    id: 'evening',
    say: ['evening', 'sunset', 'dinner'],
    kelvin: 2200,
    brightness: 35,
    why: 'From about three hours before bed the target is under 10 melanopic lux at the eye. Dim is what gets you there; amber helps.',
  },
  {
    id: 'relax',
    say: ['relax', 'relaxing', 'chill', 'unwind', 'calm'],
    kelvin: 2400,
    brightness: 30,
    why: 'Low and warm. Nothing about a particular hue is relaxing in itself — it is the dimness the body reads as evening.',
  },
  {
    id: 'wind down',
    say: ['wind down', 'winding down', 'bedtime', 'bed time', 'getting ready for bed'],
    kelvin: 1800,
    brightness: 15,
    why: 'The last hour. Deep amber with almost no blue, dim enough to leave melatonin alone.',
  },
  {
    id: 'film',
    say: ['film', 'movie', 'movies', 'cinema', 'tv'],
    kelvin: 2000,
    brightness: 12,
    why: 'Dim warm bias light behind the screen. Easier on the eyes than a bright screen in a dark room, and late enough at night that it should not be blue.',
  },
  {
    id: 'sleep',
    say: ['sleep', 'sleeping', 'night', 'goodnight', 'good night', 'lights down'],
    kelvin: 1200,
    brightness: 1,
    why: 'As close to darkness as a light gets, and red, which has the least power of any visible colour to suppress melatonin. The bedroom target is under 1 melanopic lux.',
  },
  {
    id: 'night light',
    say: ['night light', 'nightlight', 'getting up', 'bathroom'],
    kelvin: 1200,
    brightness: 3,
    why: 'Enough red light to cross a room at three in the morning without waking your body clock up. White light at this hour undoes hours of sleep pressure.',
  },
];

/**
 * Every scene's name, in order, for the tool description she reads.
 *
 * Derived rather than typed out a second time. A hand-written list of what
 * exists is the copy that goes stale — she would go on being offered a scene
 * that had been renamed, and reach for it, and be told it does not exist.
 */
export const SCENE_NAMES = DEFAULTS.map((scene) => scene.id);

/** Only what the user has changed. Defaults stay in code, where they are read. */
interface Tuned {
  changes: Record<string, {kelvin?: number; brightness?: number}>;
}

const store = new Document<Tuned>('scenes', () => ({changes: {}}));

const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, Math.round(value)));

export async function allScenes(): Promise<Scene[]> {
  const {changes} = await store.read();
  return DEFAULTS.map((scene) => {
    const change = changes[scene.id];
    if (!change) return scene;
    return {
      ...scene,
      kelvin: change.kelvin ?? scene.kelvin,
      brightness: change.brightness ?? scene.brightness,
    };
  });
}

/**
 * Which scene a spoken phrase means.
 *
 * People say "put it in sleep mode", "activate sleep mode", "sleep mode
 * please" and simply "sleep". The word "mode" carries no information and is
 * stripped; after that the longest matching alias wins, so "night light" is
 * not swallowed by "night".
 */
export async function findScene(said: string): Promise<Scene | null> {
  const needle = said
    .toLowerCase()
    // "light" is deliberately not in this list. Stripping it turns "night
    // light" into "night", which is the sleep setting — so asking for a dim
    // red glow to cross the room by would have put the bedroom to bed instead.
    .replace(/\b(mode|scene|setting|lighting|please|activate|set|to|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!needle) return null;

  const scenes = await allScenes();
  let best: {scene: Scene; length: number} | null = null;

  for (const scene of scenes) {
    for (const alias of scene.say) {
      if (needle === alias || needle.includes(alias)) {
        if (!best || alias.length > best.length) best = {scene, length: alias.length};
      }
    }
  }

  return best?.scene ?? null;
}

export type Nudge = 'dimmer' | 'brighter' | 'warmer' | 'cooler';

/** "A bit" and "a lot", as numbers. Two sizes is all anybody says out loud. */
const STEP = {
  little: {brightness: 8, kelvin: 250},
  lot: {brightness: 20, kelvin: 700},
} as const;

export interface Change {
  nudge?: Nudge;
  much?: boolean;
  brightness?: number;
  kelvin?: number;
}

/**
 * Change a scene and keep the change.
 *
 * "Make sleep mode a bit dimmer" has to survive until tomorrow night or it was
 * not worth saying. Only the difference from the default is stored, so the
 * research-backed starting points stay visible in the code and a scene that
 * has never been touched has nothing written down about it at all.
 */
export async function tuneScene(id: string, change: Change): Promise<Scene> {
  const before = (await allScenes()).find((scene) => scene.id === id);
  if (!before) throw new Error(`no scene called ${id}`);

  const step = change.much ? STEP.lot : STEP.little;
  let {kelvin, brightness} = before;

  if (change.nudge === 'dimmer') brightness -= step.brightness;
  if (change.nudge === 'brighter') brightness += step.brightness;
  if (change.nudge === 'warmer') kelvin -= step.kelvin;
  if (change.nudge === 'cooler') kelvin += step.kelvin;

  if (change.brightness !== undefined) brightness = change.brightness;
  if (change.kelvin !== undefined) kelvin = change.kelvin;

  const tuned = {
    kelvin: clamp(kelvin, KELVIN_RANGE.low, KELVIN_RANGE.high),
    brightness: clamp(brightness, 1, 100),
  };

  await store.update((current) => ({
    changes: {...current.changes, [id]: tuned},
  }));

  return {...before, ...tuned};
}

/** Back to the researched starting point. Nothing is lost that cannot be re-said. */
export async function restoreScene(id: string): Promise<Scene> {
  await store.update((current) => {
    const changes = {...current.changes};
    delete changes[id];
    return {changes};
  });

  const scene = DEFAULTS.find((one) => one.id === id);
  if (!scene) throw new Error(`no scene called ${id}`);
  return scene;
}

export async function tunedScenes(): Promise<string[]> {
  return Object.keys((await store.read()).changes);
}

/**
 * A colour temperature as red, green and blue.
 *
 * Tanner Helland's approximation of the black-body curve, which is the one
 * everybody uses because it is accurate to within a couple of percent across
 * the range anybody lights a room in and fits in a dozen lines.
 *
 * The important behaviour is at the bottom: below roughly 1900K the blue
 * channel is zero and the green is small, so "1200 kelvin" comes out as a deep
 * red-orange with no short wavelengths in it whatsoever. That is not an
 * artefact to be corrected — it is precisely what a bedroom at midnight wants.
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = clamp(kelvin, 1000, 40_000) / 100;
  const bound = (value: number) => clamp(value, 0, 255);

  const red = temp <= 66 ? 255 : bound(329.698727446 * (temp - 60) ** -0.1332047592);

  const green =
    temp <= 66
      ? bound(99.4708025861 * Math.log(temp) - 161.1195681661)
      : bound(288.1221695283 * (temp - 60) ** -0.0755148492);

  const blue =
    temp >= 66
      ? 255
      : temp <= 19
        ? 0
        : bound(138.5177312231 * Math.log(temp - 10) - 305.0447927307);

  return [red, green, blue];
}
