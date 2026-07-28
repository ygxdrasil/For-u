import {Share, Smartphone} from 'lucide-react';
import {useState} from 'react';
import {useInstall} from '../hooks/useInstall';

/**
 * "Put her on your phone", offered rather than buried.
 *
 * Shown once and dismissible for good. An install nag that reappears on every
 * visit is the single most disliked pattern on the mobile web, and the whole
 * point of her is that she is not that sort of software.
 *
 * It appears only when it can actually do something: either the browser has
 * offered, or this is an iPhone where the steps are the only help possible.
 * Nothing is worse than a button that explains it cannot do the thing it is
 * named after.
 */
export function Install() {
  const {canInstall, showAppleSteps, install} = useInstall();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('grace-install-asked') === 'yes',
  );

  if (dismissed || (!canInstall && !showAppleSteps)) return null;

  const goAway = () => {
    localStorage.setItem('grace-install-asked', 'yes');
    setDismissed(true);
  };

  return (
    <div className="glass edge-run mx-4 mb-2 p-3">
      <div className="flex items-start gap-2.5">
        <Smartphone size={15} className="accent mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-relaxed text-slate-200">
            {canInstall
              ? 'Put me on your home screen and I open like an app — full screen, and I can reach you with notifications.'
              : 'To put me on your home screen: tap Share, then Add to Home Screen. I’ll open full screen after that.'}
          </p>

          {showAppleSteps && !canInstall && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.65rem] text-mist/55">
              <Share size={11} /> the square with the arrow, at the bottom of Safari
            </p>
          )}

          <div className="mt-2 flex gap-2">
            {canInstall && (
              <button
                type="button"
                onClick={() => {
                  void install();
                  goAway();
                }}
                className="rounded-full border border-ice/40 bg-ice/15 px-3 py-1 text-xs text-ice transition hover:bg-ice/25">
                Add to home screen
              </button>
            )}
            <button
              type="button"
              onClick={goAway}
              className="ml-auto rounded-full border border-edge px-3 py-1 text-xs text-mist transition hover:text-slate-200">
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
