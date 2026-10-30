import type { Metadata } from "next";
import { asset, COMPANY_URL, content, IG_URL, path, type Lang, type PageKey } from "@/content/site";

/** Search engines may index the site only in a launch build (SITE_INDEX=1, set by build-sakura.mjs --index). */
export const INDEX = process.env.SITE_INDEX === "1";

/** Link-share defaults (LINE, Instagram, X, email): site name and the share image public/og.jpg. */
export function share(lang: Lang) {
  const images = [{ url: asset("/og.jpg"), width: 1200, height: 630, alt: "THE JEWELRY — glass dome glowing on Osaka Bay at night" }];
  return {
    openGraph: { type: "website" as const, siteName: "THE JEWELRY", locale: lang === "ja" ? "ja_JP" : "en_US", images },
    twitter: { card: "summary_large_image" as const, images },
  };
}

export function pageMeta(lang: Lang, page: PageKey): Metadata {
  const m = content[lang].meta[page];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: asset(path(lang, page)), languages: { ja: asset(path("ja", page)), en: asset(path("en", page)) } },
    openGraph: { ...share(lang).openGraph, title: m.title, description: m.description, url: asset(path(lang, page)) },
    twitter: { ...share(lang).twitter, title: m.title, description: m.description },
    robots: { index: INDEX },
  };
}

/** Structured data for search results: the venue, its address and its Instagram. */
export function venueJsonLd(lang: Lang) {
  const site = process.env.SITE_URL ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "THE JEWELRY",
    url: site + asset(path(lang, "home")),
    image: site + asset("/og.jpg"),
    logo: site + asset("/images/logo.svg"),
    description: content[lang].meta.home.description,
    inLanguage: lang,
    address: {
      "@type": "PostalAddress",
      postalCode: "559-0034",
      addressRegion: lang === "ja" ? "大阪府" : "Osaka",
      addressLocality: lang === "ja" ? "大阪市住之江区" : "Suminoe-ku, Osaka",
      streetAddress: lang === "ja" ? "南港北2-5-20" : "2-5-20 Nanko-kita",
      addressCountry: "JP",
    },
    sameAs: [IG_URL],
    parentOrganization: { "@type": "Organization", name: "Symphonic Sourire", url: COMPANY_URL },
  };
}
