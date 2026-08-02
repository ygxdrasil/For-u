/**
 * Nine icons, hand-drawn as inline SVG.
 *
 * An icon library would be tens of kilobytes and a dependency, for nine shapes
 * that are each one or two paths. These also inherit currentColor, so the
 * ember accent on the active item costs nothing extra.
 */

import React from 'react';

const S = ({ children, ...rest }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const ICONS = {
  // Her: the question mark itself.
  home: () => (
    <S>
      <path d="M5.6 5.6a2.4 2.4 0 1 1 3.2 2.26c-.5.18-.8.66-.8 1.19v.45" />
      <circle cx="8" cy="12.4" r="0.75" fill="currentColor" stroke="none" />
    </S>
  ),
  dashboard: () => (
    <S>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </S>
  ),
  // The evidence ladder, in miniature.
  findings: () => (
    <S>
      <path d="M2.5 12.5h2M2.5 12.5v-2" />
      <path d="M6.5 12.5v-4M10.5 12.5v-6M14.5 12.5v-9" />
    </S>
  ),
  watches: () => (
    <S>
      <path d="M1.6 8s2.4-4.2 6.4-4.2S14.4 8 14.4 8s-2.4 4.2-6.4 4.2S1.6 8 1.6 8Z" />
      <circle cx="8" cy="8" r="1.7" />
    </S>
  ),
  // Handing something over.
  jason: () => (
    <S>
      <path d="M2.5 8h8" />
      <path d="M7.8 5.2 10.6 8l-2.8 2.8" />
      <path d="M11.5 3h2v10h-2" />
    </S>
  ),
  ask: () => (
    <S>
      <path d="M13.5 10.2a1.3 1.3 0 0 1-1.3 1.3H5.4L2.5 14V4.3A1.3 1.3 0 0 1 3.8 3h8.4a1.3 1.3 0 0 1 1.3 1.3Z" />
    </S>
  ),
  costs: () => (
    <S>
      <path d="M8 1.6v12.8" />
      <path d="M11 4.2H6.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H5" />
    </S>
  ),
  sources: () => (
    <S>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M1.8 8h12.4" />
      <path d="M8 1.8c1.6 1.8 2.5 4 2.5 6.2S9.6 12.4 8 14.2C6.4 12.4 5.5 10.2 5.5 8S6.4 3.6 8 1.8Z" />
    </S>
  ),
  // A link between two things.
  connections: () => (
    <S>
      <path d="M6.6 9.4a2.6 2.6 0 0 0 3.9.28l1.9-1.9a2.6 2.6 0 0 0-3.7-3.7l-1.1 1.1" />
      <path d="M9.4 6.6a2.6 2.6 0 0 0-3.9-.28l-1.9 1.9a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1" />
    </S>
  ),
  settings: () => (
    <S>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
      <circle cx="5.5" cy="4.5" r="1.4" fill="var(--panel)" />
      <circle cx="10.5" cy="8" r="1.4" fill="var(--panel)" />
      <circle cx="6.5" cy="11.5" r="1.4" fill="var(--panel)" />
    </S>
  ),
  collapse: () => (
    <S>
      <path d="M9.5 4 5.5 8l4 4" />
      <path d="M13 3v10" />
    </S>
  ),
  expand: () => (
    <S>
      <path d="M6.5 4l4 4-4 4" />
      <path d="M3 3v10" />
    </S>
  ),
  // Arming her: the universal power mark.
  power: () => (
    <S>
      <path d="M8 2v6" />
      <path d="M4.4 4.6a5 5 0 1 0 7.2 0" />
    </S>
  ),
  stop: () => (
    <S>
      <rect x="3.4" y="3.4" width="9.2" height="9.2" rx="1.6" />
    </S>
  ),
  // Plugging something in.
  plug: () => (
    <S>
      <path d="M6 1.8v3.4M10 1.8v3.4" />
      <path d="M3.8 5.2h8.4v2.4a4.2 4.2 0 0 1-8.4 0Z" />
      <path d="M8 11.8v2.4" />
    </S>
  ),
};

export function Icon({ name }) {
  const Component = ICONS[name];
  return Component ? <Component /> : null;
}
