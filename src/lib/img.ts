import sizes from "./image-sizes.json";

const widths = sizes as Record<string, number[]>;

/**
 * Responsive attributes for a site photo (/images/<name>.jpg): WebP copies at several widths
 * (made by scripts/make-image-sizes.mjs). Other images (Instagram, PNG) pass through as-is.
 * `sizes` tells the browser how wide the image is shown; full width by default.
 */
export function responsive(src: string, sizes = "100vw") {
  const m = src.match(/^(.*\/images\/)([\w-]+)\.jpg$/);
  const ws = m && widths[m[2]];
  if (!m || !ws?.length) return { src };
  const [base, name] = [m[1], m[2]];
  return {
    src: `${base}${name}-${ws.includes(1600) ? 1600 : ws[ws.length - 1]}.webp`,
    srcSet: ws.map((w) => `${base}${name}-${w}.webp ${w}w`).join(", "),
    sizes,
  };
}
