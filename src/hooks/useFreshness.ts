import {useEffect, useState} from 'react';

/**
 * Whether the page you are looking at is the one that was deployed.
 *
 * A browser holding an old copy of a single-page app is indistinguishable, from
 * the inside, from a change that did not work — which is exactly how two rounds
 * of "nothing changed" happened when the change was live all along.
 *
 * So the build is stamped into the bundle and written beside it as a file. When
 * they disagree, the page says so and offers to reload. It costs one small
 * request every few minutes and removes a whole category of confusion.
 */

declare const __BUILD__: string;

export function useFreshness(): {stale: boolean; build: string} {
  const build = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';
  const [stale, setStale] = useState(false);

  useEffect(() => {
    if (build === 'dev') return;

    const look = () => {
      // Cache-busted deliberately: asking the cache whether the cache is stale
      // gets the answer you would expect.
      fetch(`/build.json?at=${Date.now()}`, {cache: 'no-store'})
        .then((response) => (response.ok ? response.json() : null))
        .then((body: {build?: string} | null) => {
          if (body?.build && body.build !== build) setStale(true);
        })
        .catch(() => {});
    };

    look();
    const timer = window.setInterval(look, 5 * 60 * 1000);
    // Coming back to a tab left open overnight is the commonest way to be
    // looking at yesterday's app.
    const onShow = () => document.visibilityState === 'visible' && look();
    document.addEventListener('visibilitychange', onShow);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onShow);
    };
  }, [build]);

  return {stale, build};
}
