/* Generates the raster icons from the same mark as the inline SVG favicon.

   node tools/make-icons.mjs

   Writes: assets/favicon.ico, assets/apple-touch-icon.png

   The inline SVG in index.html is what a modern tab strip uses. These exist
   because /favicon.ico is the path crawlers, bookmarks and older clients
   request unprompted, and because iOS wants a real PNG for a home screen.

   Written by hand against zlib rather than pulled from an image library: it
   runs once, in CI or by hand, and the alternative is a native canvas
   dependency in a project that otherwise has none. */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";
import { checkNodeVersion } from "./check-node.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Same check as the build: this script calls zlib, so it should not run on a
   Node carrying the Brotli out-of-bounds write, CVE-2026-111497. */
checkNodeVersion();

const GROUND = [0x0b, 0x0e, 0x11]; // the favicon's own ground, matches styles.css
const INK = [0x5f, 0xd3, 0x9a]; // the accent green from styles.css

/* The ">_" glyph, rasterised directly: a rounded rect, a chevron and an
   underscore, drawn as thick segments so they survive being scaled to 16px. */
function renderRGBA(size) {
  const px = Buffer.alloc(size * size * 4, 0);
  const radius = Math.round(size * 0.1875); // rx=6 on a 32 grid

  const inside = (x, y) => {
    const cx = Math.min(Math.max(x, radius), size - 1 - radius);
    const cy = Math.min(Math.max(y, radius), size - 1 - radius);
    const dx = x - cx;
    const dy = y - cy;
    return (
      dx * dx + dy * dy <= radius * radius ||
      (x >= radius && x <= size - 1 - radius) ||
      (y >= radius && y <= size - 1 - radius)
    );
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inside(x + 0.5, y + 0.5)) continue;
      const i = (y * size + x) * 4;
      px[i] = GROUND[0];
      px[i + 1] = GROUND[1];
      px[i + 2] = GROUND[2];
      px[i + 3] = 255;
    }
  }

  const unit = size / 32;
  const stroke = Math.max(1, Math.round(unit * 1.8));

  const seg = (x1, y1, x2, y2) => {
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;
      for (let oy = 0; oy < stroke; oy++) {
        for (let ox = 0; ox < stroke; ox++) {
          const x = Math.round(cx) + ox - Math.floor(stroke / 2);
          const y = Math.round(cy) + oy - Math.floor(stroke / 2);
          if (x < 0 || y < 0 || x >= size || y >= size) continue;
          if (!inside(x + 0.5, y + 0.5)) continue;
          const i = (y * size + x) * 4;
          px[i] = INK[0];
          px[i + 1] = INK[1];
          px[i + 2] = INK[2];
          px[i + 3] = 255;
        }
      }
    }
  };

  // ">" then "_", same layout as the SVG favicon.
  const gx = unit * 9;
  const gy = unit * 13;
  seg(gx, gy - unit * 3, gx + unit * 3.5, gy);
  seg(gx + unit * 3.5, gy, gx, gy + unit * 3);
  seg(gx + unit * 5, gy + unit * 3, gx + unit * 10, gy + unit * 3);

  return px;
}

function png(size, rgba) {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  const crc = (buf) => {
    let c = -1;
    for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, c]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ico(sizes) {
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach(({ size, buf }, i) => {
    const e = 6 + i * 16;
    header[e] = size >= 256 ? 0 : size;
    header[e + 1] = size >= 256 ? 0 : size;
    header[e + 2] = 0;
    header[e + 3] = 0;
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...sizes.map((s) => s.buf)]);
}

writeFileSync(join(ROOT, "assets/apple-touch-icon.png"), png(180, renderRGBA(180)));

const icoSizes = [16, 32, 48];
writeFileSync(
  join(ROOT, "assets/favicon.ico"),
  ico(icoSizes.map((size) => ({ size, buf: png(size, renderRGBA(size)) })))
);

console.log(`  wrote    assets/favicon.ico (${icoSizes.join(", ")}px)`);
console.log(`  wrote    assets/apple-touch-icon.png (180px)`);