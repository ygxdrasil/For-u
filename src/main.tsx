import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/**
 * Register the worker on load, not when notifications are switched on.
 *
 * It used to be registered only by the notifications panel, which meant that
 * until you had gone looking for that setting, no browser would offer to
 * install her — a site with no registered worker is simply not installable,
 * and it is refused silently. The one thing this worker does still needs the
 * permission; existing at all does not.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // A browser that will not have one is a browser that cannot install her
      // or receive a notification, and neither is worth an error on screen.
    });
  });
}
