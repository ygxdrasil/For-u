#!/usr/bin/env node
/**
 * Draws Jason's mark and writes the icons needed to install him on a phone or
 * a desktop.
 *
 * Pure Node — pixels are computed by hand and encoded with zlib. No image
 * library, no npx, nothing to install, and the output is deterministic so the
 * committed PNGs only change when this file does.
 *
 * The mark is not a face. It is the same thing the interface shows: a ring
 * holding a lit core — a system with state, not a character.
 *
 *   node scripts/make-icons.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

// ---------------------------------------------------------------- png encoder

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** @param {Uint8Array} rgba  width*height*4 */
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  // 10..12 = compression, filter, interlace — all zero

  // Each scanline is prefixed with a filter byte; 0 means "none", which keeps
  // this encoder honest and small at the cost of a slightly larger file.
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.subarray(y * width * 4, (y + 1) * width * 4).forEach((v, i) => {
      raw[y * (width * 4 + 1) + 1 + i] = v;
    });
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------ drawing

const clamp01 = (v) => Math.min(1, Math.max(0, v));
/** Antialiasing: coverage falls off across roughly one pixel. */
const edge = (d, w) => clamp01(0.5 - d / w);
const mix = (a, b, t) => a + (b - a) * t;

const CYAN = [34, 211, 238];
const DEEP = [5, 7, 13];
const PANEL = [16, 24, 40];

/**
 * @param {number} size
 * @param {boolean} maskable  keep the art inside the safe area, because
 *   Android crops maskable icons to a circle and clips anything near the edge.
 */
function drawMark(size, { maskable = false, rounded = true } = {}) {
  const px = new Uint8Array(size * size * 4);
  const c = size / 2;
  const aa = size / 220 + 0.6;

  // Maskable icons get a smaller mark so the crop never cuts the ring.
  const scale = maskable ? 0.62 : 0.8;
  const rRing = size * 0.30 * scale;
  const ringW = size * 0.055 * scale;
  const rCore = size * 0.095 * scale;
  const rGlow = size * 0.26 * scale;
  const corner = size * 0.22;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x + 0.5 - c;
      const dy = y + 0.5 - c;
      const dist = Math.hypot(dx, dy);

      // background: deep space, lifted slightly toward the centre
      const lift = clamp01(1 - dist / (size * 0.75));
      let r = mix(DEEP[0], PANEL[0], lift * 0.9);
      let g = mix(DEEP[1], PANEL[1], lift * 0.9);
      let b = mix(DEEP[2], PANEL[2], lift * 0.9);

      // a cyan wash so the dark has colour in it rather than being flat black
      const wash = clamp01(1 - dist / (size * 0.55)) * 0.16;
      r = mix(r, CYAN[0], wash * 0.5);
      g = mix(g, CYAN[1], wash * 0.5);
      b = mix(b, CYAN[2], wash * 0.5);

      // glow around the core
      const glow = Math.pow(clamp01(1 - dist / rGlow), 2.2) * 0.75;
      r = mix(r, CYAN[0], glow);
      g = mix(g, CYAN[1], glow);
      b = mix(b, CYAN[2], glow);

      // the ring, with a gap at the lower right so it reads as drawn rather
      // than as a plain circle
      const ringD = Math.abs(dist - rRing) - ringW / 2;
      let ring = edge(ringD, aa);
      const angle = Math.atan2(dy, dx);
      const gapCentre = Math.PI * 0.25;
      let gap = Math.abs(angle - gapCentre);
      if (gap > Math.PI) gap = Math.PI * 2 - gap;
      ring *= clamp01((gap - 0.34) / 0.16);

      r = mix(r, 255, ring * 0.10) + (CYAN[0] - r) * ring * 0.9;
      g = mix(g, 255, ring * 0.10) + (CYAN[1] - g) * ring * 0.9;
      b = mix(b, 255, ring * 0.10) + (CYAN[2] - b) * ring * 0.9;

      // the core
      const core = edge(dist - rCore, aa);
      r = mix(r, 226, core);
      g = mix(g, 252, core);
      b = mix(b, 255, core);

      // rounded square silhouette
      let alpha = 255;
      if (rounded && !maskable) {
        const qx = Math.abs(dx) - (size / 2 - corner);
        const qy = Math.abs(dy) - (size / 2 - corner);
        const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - corner;
        alpha = Math.round(255 * clamp01(0.5 - outside / aa));
      }

      px[i] = Math.round(clamp01(r / 255) * 255);
      px[i + 1] = Math.round(clamp01(g / 255) * 255);
      px[i + 2] = Math.round(clamp01(b / 255) * 255);
      px[i + 3] = alpha;
    }
  }
  return px;
}

/** The same mark as SVG, for the favicon — crisp at any size, ~1KB. */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#101828"/>
      <stop offset="100%" stop-color="#05070d"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity=".75"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <circle cx="32" cy="32" r="17" fill="url(#glow)"/>
  <circle cx="32" cy="32" r="15.5" fill="none" stroke="#22d3ee" stroke-width="3.4"
          stroke-linecap="round" stroke-dasharray="76 22" transform="rotate(30 32 32)"/>
  <circle cx="32" cy="32" r="5.2" fill="#e2fcff"/>
</svg>
`;

// --------------------------------------------------------------------- main

fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32.png', size: 32 },
];

for (const t of targets) {
  const png = encodePng(t.size, t.size, drawMark(t.size, { maskable: t.maskable }));
  fs.writeFileSync(path.join(OUT, t.file), png);
  console.log(`${t.file.padEnd(24)} ${t.size}x${t.size}  ${(png.length / 1024).toFixed(1)}KB`);
}

fs.writeFileSync(path.join(OUT, 'icon.svg'), svg);

fs.writeFileSync(
  path.join(OUT, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'Jason — n8n workflow contractor',
      short_name: 'Jason',
      description: 'Designs, builds, tests and repairs n8n workflows.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#f7f8fa',
      theme_color: '#ffffff',
      orientation: 'any',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ),
);

console.log('icon.svg, manifest.webmanifest');
