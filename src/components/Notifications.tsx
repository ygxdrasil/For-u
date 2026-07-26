import {BellRing} from 'lucide-react';
import {useEffect, useState} from 'react';

/**
 * Getting hold of you when you are not looking at the page.
 *
 * The laptop in the room is what keeps her looking around, but the person is
 * not always in the room. Subscribing a phone here means that when she notices
 * something that actually wants them, it arrives in a pocket rather than being
 * said to an empty chair.
 *
 * Two things are worth knowing about how browsers handle this, because both
 * have to be explained rather than worked around. Permission is only granted
 * from a real tap, so this is a button and not something done on load. And on
 * an iPhone it only works once Grace has been added to the home screen — Apple
 * refuses push to a page in a tab, and there is no way around that from here.
 */

/** Push keys travel as base64url and have to reach the browser as bytes. */
function toBytes(base64url: string): Uint8Array {
  const padded = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

type State = 'unsupported' | 'off' | 'asking' | 'on' | 'refused' | 'failed';

export function Notifications() {
  const [state, setState] = useState<State>('off');
  const [devices, setDevices] = useState(0);
  const [problem, setProblem] = useState<string | null>(null);

  const supported =
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    typeof window !== 'undefined' &&
    'PushManager' in window;

  useEffect(() => {
    if (!supported) {
      setState('unsupported');
      return;
    }
    if (Notification.permission === 'denied') setState('refused');

    fetch('/api/push-key')
      .then((response) => response.json())
      .then((body: {devices?: number}) => {
        setDevices(body.devices ?? 0);
        if ((body.devices ?? 0) > 0 && Notification.permission === 'granted') {
          setState('on');
        }
      })
      .catch(() => {});
  }, [supported]);

  const turnOn = async () => {
    setState('asking');
    setProblem(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('refused');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const {key} = (await (await fetch('/api/push-key')).json()) as {key: string};
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          // Non-negotiable in every browser that supports this: a push that
          // shows nothing is not allowed.
          userVisibleOnly: true,
          applicationServerKey: toBytes(key),
        }));

      const response = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({subscription: subscription.toJSON()}),
      });

      const body = (await response.json()) as {devices?: number; error?: string};
      if (!response.ok) throw new Error(body.error ?? 'the server would not take it');

      setDevices(body.devices ?? 1);
      setState('on');
    } catch (cause) {
      setProblem((cause as Error).message);
      setState('failed');
    }
  };

  const test = async () => {
    setProblem(null);
    const response = await fetch('/api/push-test', {method: 'POST'});
    const body = (await response.json()) as {sent?: number};
    if (!body.sent) setProblem('Nothing went out. No device is subscribed.');
  };

  if (state === 'unsupported') {
    return (
      <p className="text-xs leading-relaxed text-mist/60">
        This browser has no push notifications. On an iPhone, add Grace to your
        home screen first — Safari only allows them once she is installed.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-mist/70">
        {state === 'on'
          ? `She can reach ${devices === 1 ? 'this device' : `${devices} devices`} when something needs you.`
          : 'Let her reach your phone when something needs you and you are not here.'}
      </p>

      {state === 'refused' ? (
        <p className="text-xs leading-relaxed text-ember/90">
          Notifications are blocked for this site. Allow them in your browser’s
          settings for Grace, then come back.
        </p>
      ) : (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => void turnOn()}
            disabled={state === 'asking'}
            className="flex items-center gap-1.5 rounded-lg border border-ice/40 bg-ice/15 px-3 py-1.5 text-xs text-ice transition hover:bg-ice/25 disabled:opacity-40">
            <BellRing size={12} />
            {state === 'on' ? 'Add this device' : 'Turn on'}
          </button>
          {state === 'on' && (
            <button
              type="button"
              onClick={() => void test()}
              className="rounded-lg border border-edge px-3 py-1.5 text-xs text-mist transition hover:text-slate-200">
              Send a test
            </button>
          )}
        </div>
      )}

      {problem && <p className="text-xs text-rose-300">{problem}</p>}

      <p className="text-[0.6rem] leading-relaxed text-mist/40">
        Only for things that actually want you — an overdue reminder or
        something starting soon. Never mail on its own.
      </p>
    </div>
  );
}
