/**
 * Builds the browser-tab icons and the link-share image from the logo and the hero photo.
 * Run again after changing either:  node scripts/make-brand-assets.mjs
 *
 *   src/app/favicon.ico        16/32/48 px tab icon
 *   src/app/icon.svg           sharp vector tab icon (modern browsers)
 *   src/app/apple-icon.png     180 px home-screen icon (iPhone / iPad)
 *   public/og.jpg              1200×630 preview for LINE, Instagram, X, email …
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const app = path.join(root, "src", "app");
const BLACK = "#05070d";

// Logo paths from the site logo, drawn in white (the file itself uses currentColor).
const logoSvg = await readFile(path.join(root, "public", "images", "logo.svg"), "utf8");
const logoInner = `<g fill="#ffffff">${logoSvg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</g>`;
const [lw, lh] = [701.78, 613.1];

/** Square icon: black tile with the white logo filling `share` of its width. */
function iconSvg(size, share = 0.72, radius = 0.18) {
  const w = size * share;
  const h = (w * lh) / lw;
  const s = w / lw;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * radius}" fill="${BLACK}"/>
  <g transform="translate(${(size - w) / 2} ${(size - h) / 2}) scale(${s})">${logoInner}</g>
</svg>`;
}

// Vector tab icon.
await writeFile(path.join(app, "icon.svg"), iconSvg(64));

// Apple home-screen icon (iOS rounds the corners itself, so a full square tile).
await sharp(Buffer.from(iconSvg(180, 0.7, 0))).png().toFile(path.join(app, "apple-icon.png"));

// favicon.ico holding PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(iconSvg(s * 4, 0.78))).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile(path.join(app, "favicon.ico"), Buffer.concat([header, ...pngs]));

// Share image: the hero photo, darkened on the left, with the logo and a quiet line of text.
const [W, H] = [1200, 630];
const photo = await sharp(path.join(root, "public", "images", "ai-front.jpg")).resize(W, H, { fit: "cover", position: "centre" }).toBuffer();
const lwOg = 230;
const lhOg = (lwOg * lh) / lw;
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${BLACK}" stop-opacity=".9"/>
      <stop offset=".45" stop-color="${BLACK}" stop-opacity=".55"/>
      <stop offset=".75" stop-color="${BLACK}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g transform="translate(110 ${H / 2 - lhOg / 2 - 40}) scale(${lwOg / lw})">${logoInner}</g>
  <line x1="110" x2="170" y1="${H / 2 + lhOg / 2 - 2}" y2="${H / 2 + lhOg / 2 - 2}" stroke="#b8c7dc" stroke-width="2"/>
  <text x="110" y="${H / 2 + lhOg / 2 + 34}" fill="#e6edf7" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="5">MUSEUM &amp; EVENT SPACE · OSAKA BAY</text>
</svg>`;
await sharp(photo).composite([{ input: Buffer.from(overlay) }]).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, "public", "og.jpg"));

console.log("Brand assets written to src/app and public/og.jpg.");
