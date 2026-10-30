/**
 * THE JEWELRY Instagram integration — FETCH (runs in GitHub Actions before each build)
 * ------------------------------------------------------------------------------------
 * Same idea as the LOBMEYR fetch.php: pull the newest posts of the official account,
 * keep only posts whose caption contains one of the keywords below, download each image
 * locally (Instagram CDN urls expire) and write public/instagram/posts.json, which the
 * site reads at build time.
 *
 * Env (GitHub secrets): IG_ACCESS_TOKEN (long-lived Instagram-login token), IG_USER_ID.
 * Without a token it leaves the existing posts.json alone, so the build still works.
 */
import { mkdir, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Caption keyword -> where the post appears. The keyword is removed from the shown text.
const TAGS = { "#thejewelry_news": "news", "#thejewelry_event": "event" };
const LIMIT = 30; // newest posts to scan
const KEEP = 24; // matching posts to keep on the site
const HOST = "https://graph.instagram.com";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "instagram");
const imgDir = path.join(dir, "images");
const jsonPath = path.join(dir, "posts.json");

const token = process.env.IG_ACCESS_TOKEN ?? "";
const userId = process.env.IG_USER_ID ?? "";

await mkdir(imgDir, { recursive: true });
if (!existsSync(jsonPath)) await writeFile(jsonPath, "[]\n");

if (!token || !userId) {
  console.log("Instagram: IG_ACCESS_TOKEN / IG_USER_ID not set, keeping existing posts.json.");
  process.exit(0);
}

const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const url = `${HOST}/${encodeURIComponent(userId)}/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`;
const res = await fetch(url);
if (!res.ok) {
  // Keep the last good posts.json; a failed fetch must not break the site.
  console.log(`Instagram: media fetch failed (http ${res.status}) ${(await res.text()).slice(0, 300)}`);
  process.exit(0);
}
const { data } = await res.json();
if (!Array.isArray(data)) {
  console.log("Instagram: unexpected response, keeping existing posts.json.");
  process.exit(0);
}

// Dates shown in Japan time.
const jst = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" });

const posts = [];
const kept = new Set();
for (const m of data) {
  const remote = m.media_type === "VIDEO" ? m.thumbnail_url ?? m.media_url : m.media_url;
  let caption = String(m.caption ?? "").trim();
  const tag = Object.keys(TAGS).find((t) => caption.toLowerCase().includes(t.toLowerCase()));
  if (!remote || !tag) continue;
  for (const t of Object.keys(TAGS)) caption = caption.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
  caption = caption.replace(/[ \t]+\n/g, "\n").trim();

  const igId = String(m.id).replace(/[^A-Za-z0-9_]/g, "");
  const file = `${igId}.jpg`;
  if (!existsSync(path.join(imgDir, file))) {
    const img = await fetch(remote);
    if (!img.ok) {
      console.log(`Instagram: image download failed for ${igId} (http ${img.status})`);
      continue;
    }
    await writeFile(path.join(imgDir, file), Buffer.from(await img.arrayBuffer()));
  }
  kept.add(file);

  // Title = first caption line; the text below it becomes the body (full caption if the title was cut).
  const firstLine = caption.split("\n")[0] || "Instagram";
  const rest = caption.split("\n").slice(1).join("\n").trim();
  const ts = m.timestamp ? Date.parse(m.timestamp) : Date.now();
  posts.push({
    id: `ig-${igId}`,
    kind: TAGS[tag],
    date: jst.format(ts).replaceAll("-", "."),
    ts,
    title: firstLine.length > 40 ? `${firstLine.slice(0, 40)}…` : firstLine,
    desc: firstLine.length > 40 ? caption : rest || caption,
    image: `instagram/images/${file}`, // relative to the site root (works under a sub-path too)
    permalink: m.permalink ?? "",
  });
  if (posts.length >= KEEP) break;
}

posts.sort((a, b) => b.ts - a.ts);
await writeFile(`${jsonPath}.tmp`, JSON.stringify(posts, null, 2) + "\n");
await rename(`${jsonPath}.tmp`, jsonPath);

for (const f of await readdir(imgDir)) if (f.endsWith(".jpg") && !kept.has(f)) await unlink(path.join(imgDir, f));
console.log(`Instagram: wrote ${posts.length} posts.`);
