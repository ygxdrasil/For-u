import {useEffect, useState} from 'react';

/**
 * Putting her on a phone's home screen.
 *
 * Two completely different worlds, and pretending otherwise is why most sites
 * make a mess of this.
 *
 * On Android and desktop Chrome the browser decides she is installable and
 * fires an event; the event must be kept, because the prompt can only be shown
 * from it and only once. So it is captured on load and offered as a button —
 * the browser's own banner is easy to miss and easier to dismiss for ever.
 *
 * On iOS there is no event and no prompt. Safari offers Add to Home Screen in
 * the share sheet and nothing on the page can trigger it, so the only honest
 * thing is to say where it is. Detecting iOS specifically, rather than
 * detecting "no event fired", because the second is also true on a browser
 * that has already installed her.
 */

interface Prompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

export function useInstall() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      // Safari's own flag, which is how a home-screen launch is known there.
      (window.navigator as {standalone?: boolean}).standalone === true,
  );

  useEffect(() => {
    const catchIt = (event: Event) => {
      // Without this the browser shows its own banner instead, at a moment of
      // its choosing, and the event is gone.
      event.preventDefault();
      setPrompt(event as Prompt);
    };
    const done = () => {
      setInstalled(true);
      setPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', catchIt);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('beforeinstallprompt', catchIt);
      window.removeEventListener('appinstalled', done);
    };
  }, []);

  const apple =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPads report themselves as desktop Safari, and touch is what gives them
    // away.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    // One use only, whatever was chosen.
    setPrompt(null);
  };

  return {
    installed,
    /** The browser will do it for you. */
    canInstall: Boolean(prompt),
    /** It cannot, and the person has to be told where the button is. */
    showAppleSteps: apple && !installed,
    install,
  };
}
