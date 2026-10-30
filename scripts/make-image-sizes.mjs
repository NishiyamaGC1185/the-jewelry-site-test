/**
 * Makes WebP copies of every JPG in public/images at 800 / 1600 / 2400 px wide (only sizes
 * not larger than the original, plus the original width for smaller photos) and records them in src/lib/image-sizes.json, which
 * src/lib/img.ts turns into srcset so phones download small files.
 * Full-screen home hero photos (hero-*.jpg) get more steps up to 3200 px and a higher quality,
 * since they fill the whole screen and slowly zoom.
 * Run after adding or replacing photos:  node scripts/make-image-sizes.mjs
 */
import { readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [800, 1600, 2400];
const HERO_WIDTHS = [800, 1200, 1600, 2000, 2400, 3200];
const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "images");

const manifest = {};
for (const file of (await readdir(dir)).filter((f) => f.endsWith(".jpg")).sort()) {
  const name = file.slice(0, -4);
  const hero = name.startsWith("hero-");
  const steps = hero ? HERO_WIDTHS : WIDTHS;
  const { width } = await sharp(path.join(dir, file)).metadata();
  // Standard sizes up to the original, plus the original width when it falls between them (e.g. 1024 px).
  const widths = steps.filter((w) => w <= width);
  if (width < steps[steps.length - 1] && !widths.includes(width)) widths.push(width);
  for (const w of widths) {
    const out = path.join(dir, `${name}-${w}.webp`);
    if (!existsSync(out)) await sharp(path.join(dir, file)).resize({ width: w }).webp({ quality: hero ? 90 : 78, smartSubsample: hero }).toFile(out);
  }
  manifest[name] = widths;
}
await writeFile(path.join(root, "src", "lib", "image-sizes.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`WebP sizes for ${Object.keys(manifest).length} photos.`);
