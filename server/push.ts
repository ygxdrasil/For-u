import webpush from 'web-push';
import {Document} from './store/index';

/**
 * Getting hold of the user when they are not looking at the page.
 *
 * The laptop in the room is the heartbeat: it is open all day, so it is what
 * asks her to look around. But the person is not always in the room, and an
 * assistant who only speaks to an empty chair is not much use. So when she
 * notices something that genuinely wants them, it goes to their phone as well.
 *
 * Web Push, not a service that would need an account or a monthly fee. The
 * keys are generated here on first use and stored with everything else she
 * keeps, so there is nothing to sign up for and nothing to paste.
 */

interface Keys {
  publicKey: string;
  privateKey: string;
}

interface Subscription {
  /** The push service's own URL, which doubles as the identity of a device. */
  endpoint: string;
  keys: {p256dh: string; auth: string};
  addedAt: string;
  /** Set when the push service says this device is gone for good. */
  goneAt?: string;
}

const keyStore = new Document<Keys | null>('push-keys', () => null);
const subscriptions = new Document<Subscription[]>('push-subs', () => []);

/**
 * A mailto: is required by the spec — push services want a way to reach
 * whoever is sending, if something goes wrong. Nothing is sent to it.
 */
const CONTACT = 'mailto:grace@localhost';

async function keys(): Promise<Keys> {
  const saved = await keyStore.read();
  if (saved) return saved;

  const fresh = webpush.generateVAPIDKeys();
  await keyStore.write(fresh);
  return fresh;
}

/** The half of the key pair the browser needs in order to subscribe. */
export async function publicKey(): Promise<string> {
  return (await keys()).publicKey;
}

export async function subscribe(raw: unknown): Promise<{ok: boolean; error?: string}> {
  const candidate = raw as Partial<Subscription> | null;
  const endpoint = candidate?.endpoint;
  const p256dh = candidate?.keys?.p256dh;
  const auth = candidate?.keys?.auth;

  if (typeof endpoint !== 'string' || !p256dh || !auth) {
    return {ok: false, error: 'that is not a usable subscription'};
  }

  await subscriptions.update((current) => {
    // Re-subscribing is normal — browsers rotate endpoints. Replace rather
    // than accumulate, or one phone becomes six notifications.
    const others = current.filter((entry) => entry.endpoint !== endpoint);
    return [
      ...others,
      {endpoint, keys: {p256dh, auth}, addedAt: new Date().toISOString()},
    ];
  });

  return {ok: true};
}

export async function devices(): Promise<number> {
  return (await subscriptions.read()).filter((entry) => !entry.goneAt).length;
}

/**
 * Send one notification to every device that has asked for them.
 *
 * A device that the push service reports as gone is marked, not removed —
 * her standing instruction is that nothing is deleted, and a phone that was
 * once subscribed is a fact about the user's week.
 */
export async function notify(title: string, body: string): Promise<number> {
  const all = await subscriptions.read();
  const live = all.filter((entry) => !entry.goneAt);
  if (live.length === 0) return 0;

  const {publicKey: pub, privateKey} = await keys();
  webpush.setVapidDetails(CONTACT, pub, privateKey);

  const payload = JSON.stringify({title, body});
  const gone: string[] = [];
  let sent = 0;

  await Promise.all(
    live.map(async (entry) => {
      try {
        await webpush.sendNotification(
          {endpoint: entry.endpoint, keys: entry.keys},
          payload,
          {TTL: 900},
        );
        sent += 1;
      } catch (error) {
        const status = (error as {statusCode?: number}).statusCode;
        // 404 and 410 are the push service saying this endpoint is dead. Any
        // other failure is transient and worth keeping the device for.
        if (status === 404 || status === 410) gone.push(entry.endpoint);
        else console.error('[grace] push failed:', (error as Error).message);
      }
    }),
  );

  if (gone.length > 0) {
    const at = new Date().toISOString();
    await subscriptions.update((current) =>
      current.map((entry) =>
        gone.includes(entry.endpoint) ? {...entry, goneAt: at} : entry,
      ),
    );
  }

  return sent;
}
