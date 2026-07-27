import {useCallback, useEffect, useState} from 'react';

/**
 * Dark or daylight.
 *
 * Set on the root element rather than passed through the tree, for the same
 * reason the room's colour is: the theme is a property of the whole surface,
 * and a hundred components each deciding what colour they are is a hundred
 * places for one of them to be wrong.
 *
 * Applied before first paint by a small script in the page head, so a reload
 * in daylight does not flash black first. This hook only keeps React in step
 * with what is already on the element.
 */

export type Theme = 'dark' | 'light';

const KEY = 'grace-theme';

function current(): Theme {
  const saved = localStorage.getItem(KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // No preference recorded: follow the machine, which is usually right and is
  // certainly a better guess than always being the darkest thing on screen.
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'dark' : ((document.documentElement.dataset.theme as Theme) ?? current()),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
  }, [theme]);

  // Following the machine only holds until a choice is made here; after that
  // the choice is the answer, on this device, until it is changed.
  useEffect(() => {
    if (localStorage.getItem(KEY)) return;
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => setTheme(query.matches ? 'light' : 'dark');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(
    () => setTheme((now) => (now === 'dark' ? 'light' : 'dark')),
    [],
  );

  return {theme, setTheme, toggle};
}
