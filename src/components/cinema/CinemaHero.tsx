"use client";
/* eslint-disable @next/next/no-img-element -- responsive, user-supplied event imagery */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asset, path, type Lang } from "@/content/site";
import { responsive } from "@/lib/img";

const FRAGMENTS = [[-150, -8, -22], [95, 5, 12], [-220, -3, 0], [160, 8, -14], [-95, -6, 25]];
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const between = (progress: number, start: number, end: number) => smooth(clamp((progress - start) / (end - start)));

export function CinemaHero({ lang }: { lang: Lang }) {
  const sequence = useRef<HTMLElement>(null);
  const startActions = useRef<HTMLDivElement>(null);
  const endActions = useRef<HTMLDivElement>(null);
  const autoFrame = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const ja = lang === "ja";
  const stop = useCallback(() => { cancelAnimationFrame(autoFrame.current); autoFrame.current = 0; setPlaying(false); }, []);

  const seek = useCallback((progress: number) => {
    const element = sequence.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + Math.max(0, element.offsetHeight - window.innerHeight) * progress, behavior: "instant" });
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setSystemReduced(media.matches); setReduced(media.matches); };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = sequence.current!;
    const home = element.closest(".cinema-home");
    home?.classList.toggle("ch-motion-reduced", reduced);
    let frame = 0;
    const draw = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = reduced ? 1 : clamp(-rect.top / Math.max(1, element.offsetHeight - window.innerHeight));
      element.style.setProperty("--scatter", (1 - between(progress, .015, .48)).toFixed(5));
      element.style.setProperty("--expand", between(progress, .45, .89).toFixed(5));
      element.style.setProperty("--leave", (1 - between(progress, .05, .32)).toFixed(5));
      element.style.setProperty("--arrive", between(progress, .77, .96).toFixed(5));
      element.style.setProperty("--progress", progress.toFixed(5));
      if (startActions.current) startActions.current.inert = progress > .32;
      if (endActions.current) endActions.current.inert = progress < .9;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const key = (event: KeyboardEvent) => {
      if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) stop();
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", key);
    draw();
    return () => {
      home?.classList.remove("ch-motion-reduced");
      cancelAnimationFrame(frame); cancelAnimationFrame(autoFrame.current);
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue);
      window.removeEventListener("wheel", stop); window.removeEventListener("touchstart", stop); window.removeEventListener("keydown", key);
    };
  }, [reduced, stop]);

  const play = () => {
    if (playing) { stop(); return; }
    if (reduced) return;
    seek(0); setPlaying(true);
    let started = 0;
    const tick = (time: number) => {
      if (document.hidden || document.documentElement.classList.contains("menu-open")) { stop(); return; }
      if (!started) started = time;
      const progress = clamp((time - started) / 8500);
      seek(progress);
      if (progress < 1) autoFrame.current = requestAnimationFrame(tick);
      else { autoFrame.current = 0; setPlaying(false); }
    };
    autoFrame.current = requestAnimationFrame(tick);
  };

  return <section ref={sequence} className={`ch-hero${reduced ? " ch-reduced" : ""}`} aria-label={ja ? "大阪湾のイベント施設、THE JEWELRYのオープニング" : "THE JEWELRY, an event venue on Osaka Bay"}>
    <h1 className="ch-sr">{ja ? "THE JEWELRY — 大阪湾で、心が動くイベントを。" : "THE JEWELRY — Unforgettable events on Osaka Bay."}</h1>
    <div className="ch-hero-stage">
      <div className="ch-hero-index"><span>THE JEWELRY / OSAKA BAY</span><span>EVENT VENUE / OSAKA BAY</span></div>
      <div className="ch-hero-intro">
        <p className="ch-micro">UNFORGETTABLE EVENTS. OSAKA BAY.</p>
        <p className="ch-hero-wordmark" aria-hidden="true">LIVE<span>/</span><br />HERE<span className="ch-period">.</span></p>
        <p>{ja ? <>大阪湾を舞台に。<br />心が動く、その瞬間を。</> : <>Bring people together.<br />Make moments unforgettable.</>}</p>
        <div ref={startActions} className="ch-opening-action"><button onClick={play} disabled={reduced} aria-pressed={playing}>{playing ? (ja ? "Ⅱ 演出を停止" : "Ⅱ Pause") : (ja ? "イベントの世界へ" : "Experience the venue")}<span>↓</span></button><a href="#the-bay">{ja ? "THE JEWELRYについて" : "Discover the venue"} ↗</a></div>
      </div>
      <div className="ch-architecture" aria-hidden="true">{FRAGMENTS.map(([y, rotation, x], i) => <div key={i} className="ch-fragment" style={{ "--i": i, "--fy": `${y}px`, "--fr": `${rotation}deg`, "--fx": `${x}px` } as React.CSSProperties}><img {...responsive(asset("/images/event-concert.jpg"))} alt="" fetchPriority={i === 0 ? "high" : "auto"} /></div>)}</div>
      <div className="ch-hero-arrival"><p className="ch-micro">YOUR EVENT. AN UNFORGETTABLE MOMENT.</p><h2>{ja ? <>大阪湾で、<br /><em>心が動くイベントを。</em></> : <>Osaka Bay.<br /><em>Unforgettable events.</em></>}</h2><div ref={endActions} className="ch-arrival-actions"><a href="#the-bay" className="ch-image-link">{ja ? "会場の魅力を見る" : "Discover the venue"}<span>↓</span></a><Link href={path(lang, "contact")} target="_self">{ja ? "会場利用のご相談" : "Host an event"} ↗</Link></div></div>
      <div className="ch-hero-chapters" aria-hidden="true"><span>01 / FRAGMENTS</span><span>02 / ALIGNMENT</span><span>03 / YOUR EVENT</span></div>
      <div className="ch-hero-bottom"><span>{ja ? "スクロールで、イベントの世界へ。" : "SCROLL TO EXPERIENCE"}<i>↓</i></span><button disabled={systemReduced} onClick={() => { stop(); seek(0); setReduced(value => !value); }} aria-pressed={reduced}>{ja ? (reduced ? "動きを再開" : "動きを抑える") : (reduced ? "Enable motion" : "Reduce motion")}</button></div>
      <div className="ch-hero-progress" aria-hidden="true"><i /></div>
    </div>
  </section>;
}
