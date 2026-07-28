/**
 * Her icon, as actual PNG files.
 *
 * A manifest with only an SVG is accepted by some browsers and quietly refused
 * by others, and "quietly refused" here means the install prompt never appears
 * and nobody can tell you why. PNGs at the two sizes every platform agrees on
 * removes the entire question.
 *
 * Written by hand rather than with a library, because a PNG is a header, a
 * zlib stream of scanlines and three checksums — about sixty lines — and
 * adding an image toolchain to a project that needs three files once is a poor
 * trade. Run with: npm run icons
 */

import {deflateSync} from 'node:zlib';
import {writeFileSync} from 'node:fs';

const CRC = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return (bytes) => {
    let c = -1;
    for (const byte of bytes) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

function chunk(type, body) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(body.length);
  const tagged = Buffer.concat([Buffer.from(type, 'ascii'), body]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(tagged));
  return Buffer.concat([length, tagged, crc]);
}

/** RGBA pixels to a PNG. */
function png(pixels, size) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bits per channel
  header[9] = 6; // truecolour with alpha
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  // Every scanline is prefixed with its filter type. Zero — "none" — because
  // these are flat shapes and the filters exist to help photographs.
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, {level: 9})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const mix = (a, b, t) => Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));

/**
 * Her, drawn: a dark rounded field, a ring, and a violet core with a bright
 * centre. The same shape as the waveform's resting dot, which is the thing
 * anyone actually recognises her by.
 *
 * `padding` is for the maskable version — Android crops an icon to whatever
 * shape the launcher likes, and anything within a fifth of the edge is fair
 * game to lose.
 */
function draw(size, padding = 0) {
  const pixels = Buffer.alloc(size * size * 4);
  const middle = (size - 1) / 2;
  const usable = size / 2 - padding * size;
  const radius = size * 0.22;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const at = (y * size + x) * 4;
      const dx = x - middle;
      const dy = y - middle;
      const distance = Math.hypot(dx, dy);

      // The rounded square, as a distance field so the corners are smooth.
      const ex = Math.max(Math.abs(dx) - (size / 2 - radius), 0);
      const ey = Math.max(Math.abs(dy) - (size / 2 - radius), 0);
      const outside = Math.hypot(ex, ey) - radius;
      const inField = Math.max(0, Math.min(1, 0.5 - outside));

      let r = 12;
      let g = 8;
      let b = 22;

      // The core: a violet ball fading out, brightest slightly above centre
      // the way a lit sphere is.
      const core = usable * 0.62;
      if (distance < core) {
        const t = distance / core;
        const lift = Math.max(0, 1 - (dy + usable * 0.2) / usable);
        r = mix(150, 60, t * t) + Math.round(lift * 30);
        g = mix(90, 20, t * t);
        b = mix(255, 140, t * t);
      }

      // The ring around it.
      const ring = Math.abs(distance - usable * 0.86);
      if (ring < size * 0.008) {
        r = mix(r, 190, 0.8);
        g = mix(g, 150, 0.8);
        b = mix(b, 255, 0.8);
      }

      // The bright centre.
      const centre = usable * 0.09;
      if (distance < centre) {
        const t = distance / centre;
        r = mix(255, r, t * t);
        g = mix(250, g, t * t);
        b = mix(255, b, t * t);
      }

      pixels[at] = r;
      pixels[at + 1] = g;
      pixels[at + 2] = b;
      pixels[at + 3] = Math.round(255 * inField);
    }
  }

  return png(pixels, size);
}

writeFileSync('public/icon-192.png', draw(192));
writeFileSync('public/icon-512.png', draw(512));
// Maskable: the same drawing, held well inside the safe area, on a full square
// so a launcher cropping it to a circle finds colour rather than transparency.
writeFileSync('public/icon-maskable-512.png', draw(512, 0.14));
console.log('wrote three icons');
