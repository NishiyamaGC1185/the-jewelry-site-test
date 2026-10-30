"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import { useEffect, useState } from "react";
import { asset } from "@/content/site";
import { responsive } from "@/lib/img";

/**
 * Further hero shots that dissolve in over the living still, one after another, each with a
 * slow camera move, so the hero plays like one continuous film rather than a slideshow.
 * CSS only (.hero-film): every shot shares one 28s cycle, started 7s apart.
 * The first shot appears 7s after mounting, so the photos are only added once the page has
 * loaded; they then do not compete with the first view for the phone's bandwidth.
 */
const HERO_SHOTS = ["hero-13", "hero-12", "hero-tunnel"];

export function HeroFilm() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t = 0;
    const start = () => (t = window.setTimeout(() => setReady(true), 1500));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", start);
    };
  }, []);
  if (!ready) return null;
  return (
    <div className="hero-film" aria-hidden="true">
      {HERO_SHOTS.map((n, k) => (
        <div key={n} className="hero-shot" style={{ "--k": k + 1 } as React.CSSProperties}>
          <img {...responsive(asset(`/images/${n}.jpg`))} alt="" decoding="async" />
        </div>
      ))}
    </div>
  );
}
