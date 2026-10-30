import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static copy for https://anamul009.github.io/<repo>/ (PAGES_BASE_PATH = "/<repo>").
// Static export cannot run with Cache Components, so it is switched off for that build.
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "/the-jewelry-site") : "";

const nextConfig: NextConfig = {
  cacheComponents: !pages,
  partialPrefetching: !pages,
  trailingSlash: true,
  // Styles arrive inside the HTML, so the first paint does not wait for a stylesheet request.
  experimental: { inlineCss: true },
  ...(pages && { output: "export", basePath, images: { unoptimized: true } }),
  // Absolute origin for link-share tags; set SITE_URL for the production domain.
  env: { NEXT_PUBLIC_BASE_PATH: basePath, SITE_URL: process.env.SITE_URL ?? (pages ? "https://anamul009.github.io" : "http://localhost:3001") },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
