"use client";

/* eslint-disable @next/next/no-img-element -- locally supplied photographs with responsive sources */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { asset, content, IG_URL, path, type Lang } from "@/content/site";
import { renewal } from "@/content/renewal";
import { responsive } from "@/lib/img";
import "./immersive-home.css";

const SCENES = ["atelier-sunset", "atelier-sail", "atelier-reception"];
type InstagramPost = { id: string; title: string; image: string; permalink: string; date: string };

function Jewel({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2 35 14 20 38 5 14 20 2Z M5 14h30M20 2l-7 12 7 24 7-24-7-12Z" stroke="currentColor" strokeWidth=".8" /></svg>;
}

function Stamp() {
  return <svg className="a-stamp" viewBox="0 0 160 160" aria-hidden="true"><defs><path id="atelier-stamp-path" d="M80 17a63 63 0 1 1-.01 0" /></defs><text><textPath href="#atelier-stamp-path" textLength="395">THE JEWELRY · A PLACE TO REMEMBER · OSAKA BAY · </textPath></text><path d="M80 48 103 68 80 110 57 68 80 48ZM57 68h46M80 48 69 68l11 42 11-42-11-20Z" fill="none" stroke="currentColor" strokeWidth=".8" /></svg>;
}

export function ImmersiveHome({ lang }: { lang: Lang }) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const heroVisible = useRef(true);
  const [scene, setScene] = useState(0);
  const [space, setSpace] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [today, setToday] = useState(0);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const t = renewal[lang];
  const ja = lang === "ja";

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    setToday(Number(new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date()).replaceAll("-", "")));
    const visible = new IntersectionObserver(([entry]) => { heroVisible.current = entry.isIntersecting; });
    if (hero.current) visible.observe(hero.current);
    return () => { media.removeEventListener("change", sync); visible.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => {
      if (heroVisible.current && !document.hidden) setScene(s => (s + 1) % SCENES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [paused, reduced, scene]);

  useEffect(() => {
    let active = true;
    fetch(asset("/instagram/posts.json"), { cache: "no-cache" })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!active || !Array.isArray(data)) return;
        const valid = data.filter((p): p is InstagramPost => {
          if (!p || typeof p.title !== "string" || typeof p.image !== "string" || typeof p.permalink !== "string") return false;
          try { return ["www.instagram.com", "instagram.com"].includes(new URL(p.permalink).hostname); } catch { return false; }
        });
        setPosts(valid.slice(0, 3));
      }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const el = root.current!;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("a-in"); observer.unobserve(entry.target); } });
    }, { threshold: .08 });
    el.querySelectorAll("[data-a-reveal]").forEach(item => observer.observe(item));
    el.classList.add("a-enhanced");
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (reduced) return;
      el.querySelectorAll<HTMLElement>("[data-a-parallax]").forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) return;
        item.style.setProperty("--drift", `${Math.max(-35, Math.min(35, (rect.top + rect.height / 2 - innerHeight / 2) * -.06))}px`);
      });
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener("scroll", queue, { passive: true }); draw();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); };
  }, [reduced]);

  const selected = t.spaces[space];
  const published = content[lang].news.items.filter(n => Number(n.date.replaceAll(".", "")) <= today).slice(0, 2);

  return <div className={`atelier-home${paused ? " a-paused" : ""}`} ref={root}>
    <section className="a-hero" ref={hero}>
      <div className="a-hero-copy">
        <p className="a-eyebrow">{t.eyebrow}</p>
        <p className="a-hero-display" aria-hidden="true">{t.heroLines[0]}<br /><em>{t.heroLines[1]}</em><span className="a-period">.</span></p>
        <h1>{t.heroTitle[0]}<br />{t.heroTitle[1]}</h1>
        <p className="a-hero-body">{t.heroBody}</p>
        <a href="#the-place" className="a-link">{t.explore}<span>↗</span></a>
        <div className="a-hero-smallprint"><span className="a-tiny-diamond" />AN INVITATION TO SOMETHING SPECIAL</div>
      </div>
      <div className="a-hero-art">
        <div className="a-hero-window" aria-label={t.scenes[scene]}>
          {SCENES.map((image, i) => <div key={image} className={`a-hero-shot${i === scene ? " a-active" : ""}`}><img {...responsive(asset(`/images/${image}.jpg`), "(min-width: 800px) 60vw, 100vw")} alt={i === scene ? t.scenes[i] : ""} fetchPriority={i === 0 ? "high" : "auto"} loading={i === 0 ? "eager" : "lazy"} /></div>)}
          <span className="a-photo-coordinate">34°38′N / 135°24′E</span>
        </div>
        <div className="a-floating-portrait" data-a-parallax><img {...responsive(asset("/images/atelier-sail-portrait.jpg"), "(min-width: 800px) 16vw, 26vw")} alt={ja ? "夕日で金色に染まるドームの帆" : "The sail in the dome, illuminated by the setting sun"} /><span>LIGHT, THROUGH THE GLASS.</span></div>
        <Stamp />
        <div className="a-hero-controls"><span className="a-scene-caption">0{scene + 1} <i /> {t.scenes[scene]}</span><div className="a-scene-buttons" role="group" aria-label={ja ? "風景を選ぶ" : "Choose a scene"}>{SCENES.map((_, i) => <button key={i} onClick={() => setScene(i)} aria-label={t.scenes[i]} aria-pressed={scene === i}><span /></button>)}<button className="a-motion-button" onClick={() => setPaused(p => !p)} aria-label={paused ? (ja ? "自動再生を再開" : "Resume automatic motion") : (ja ? "自動再生を停止" : "Pause automatic motion")} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button></div></div>
      </div>
      <a href="#the-place" className="a-scroll-cue"><span>SCROLL TO DISCOVER</span><i>↓</i></a>
    </section>

    <div className="a-invitation-bar"><Jewel /><p>{today < 20261101 ? t.opening : (ja ? "催事・展示のご相談を承っています。" : "We welcome enquiries for events and exhibitions.")}</p><Link href={path(lang, "contact")}>{ja ? "ご利用のご相談" : "GET IN TOUCH"}<span>↗</span></Link></div>

    <section className="a-story" id="the-place">
      <div className="a-story-photo" data-a-parallax><div className="a-portrait-window"><img {...responsive(asset("/images/atelier-detail.jpg"), "(min-width: 800px) 35vw, 70vw")} alt={ja ? "自然光が差し込むガラスのドーム" : "Natural light falling through the glass dome"} loading="lazy" /></div><span className="a-photo-note">01 / THE POETRY OF LIGHT</span></div>
      <div className="a-story-copy" data-a-reveal><p className="a-eyebrow">{t.storyLabel}</p><h2>{t.storyTitle[0]}<br />{t.storyTitle[1]}</h2><p>{t.storyBody}</p><p className="a-story-foot">{t.storyFoot}</p><Link href={path(lang, "about")} className="a-link">{t.storyLink}<span>↗</span></Link></div>
      <span className="a-story-watermark" aria-hidden="true">The Jewelry</span>
    </section>

    <section className="a-occasions" id="occasions">
      <div className="a-section-heading" data-a-reveal><p className="a-eyebrow">FOR YOUR BEAUTIFUL OCCASIONS</p><h2>{t.occasions}</h2><p>{t.occasionsBody}</p></div>
      <div className="a-occasion-grid">{t.occasionCards.map((card, i) => <Link href={path(lang, "events")} key={card.en} className="a-occasion" data-a-reveal><div className="a-occasion-photo"><img {...responsive(asset(`/images/${card.image}.jpg`), "(min-width: 800px) 30vw, 88vw")} alt={card.title} loading="lazy" /><span>0{i + 1}</span><b>↗</b></div><p className="a-occasion-en">{card.en}</p><h3>{card.title}</h3><p>{card.body}</p></Link>)}</div><Link href={path(lang, "events")} className="a-link a-centered-link">{t.occasionLink}<span>↗</span></Link>
    </section>

    <section className="a-spaces" id="the-spaces"><div className="a-spaces-heading" data-a-reveal><p className="a-eyebrow">THREE SETTINGS. YOUR POSSIBILITIES.</p><h2>{t.spacesTitle}</h2><p>{t.spacesBody}</p></div><div className="a-space-selector" role="group" aria-label={ja ? "空間を選ぶ" : "Choose a space"}>{t.spaces.map((item, i) => <button key={item.en} onClick={() => setSpace(i)} aria-pressed={space === i}><span>0{i + 1}</span>{item.en}<small>{ja ? item.name : ""}</small></button>)}</div><div className="a-space-stage"><div className="a-space-photos">{t.spaces.map((item, i) => <img key={item.en} {...responsive(asset(`/images/${item.image}.jpg`), "(min-width: 800px) 70vw, 100vw")} alt={i === space ? item.name : ""} className={i === space ? "a-active" : ""} loading="lazy" />)}</div><div className="a-space-paper" key={selected.en}><p className="a-eyebrow">SPACE / 0{space + 1}</p><h3>{selected.name}</h3><p>{selected.body}</p><Link href={path(lang, "spaces")} className="a-link">{t.spacesLink}<span>↗</span></Link><span className="a-space-pagination">0{space + 1}<i />03</span></div></div></section>

    <section className="a-pause" data-a-parallax><img {...responsive(asset("/images/atelier-evening.jpg"))} alt={ja ? "窓一面に広がる大阪湾の夕景" : "The evening sky over Osaka Bay, framed by the lounge windows"} loading="lazy" /><div className="a-pause-copy" data-a-reveal><p className="a-eyebrow">BEAUTIFUL, TOGETHER.</p><h2>{t.quote[0]}<br /><em>{t.quote[1]}</em></h2></div></section>

    <section className="a-two-invitations"><div className="a-host-invitation" data-a-reveal><p className="a-eyebrow">FOR ORGANISERS</p><h2>{ja ? <>ここで、<br />あなたの世界をひらく。</> : <>Your vision.<br />An extraordinary setting.</>}</h2><p>{ja ? "催事・展示の企画、会場のご利用について。アイデアの段階から、お話しください。" : "Bring us your event or exhibition idea. Let’s imagine what it could become."}</p><Link href={path(lang, "contact")} className="a-button">{t.host}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="a-quiet-link">{t.dm} ↗</a></div><div className="a-visit-invitation" data-a-reveal><p className="a-eyebrow">FOR VISITORS</p><h2>{t.visitTitle[0]}<br />{t.visitTitle[1]}</h2><p>{t.visitBody}</p><span className="a-visit-note">{t.visitNote}</span><div className="a-visit-links"><Link href={path(lang, "visit")} className="a-link">{t.accessLink}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="a-quiet-link">{t.eventInfo} ↗</a></div><span className="a-station">{t.station}</span></div></section>

    <section className="a-journal"><div className="a-journal-head"><div data-a-reveal><p className="a-eyebrow">JOURNAL & INSTAGRAM</p><h2>{t.journalTitle}</h2></div><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="a-link">{t.journalLink}<span>↗</span></a></div>{posts.length > 0 ? <div className="a-instagram-feed">{posts.map(post => <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer"><img src={asset(`/${post.image.replace(/^\//, "")}`)} alt={post.title} loading="lazy" /><span>{post.title}</span><b>↗</b></a>)}</div> : <div className="a-journal-fallback"><span className="a-instagram-symbol" aria-hidden="true">◎</span><p>{t.journalBody}</p><a href={IG_URL} target="_blank" rel="noopener noreferrer">@thejewelry_official <span>↗</span></a></div>}<div className="a-news-row"><p className="a-eyebrow">{t.newsHeading}</p><div>{published.length ? published.map(item => <Link key={item.id} href={`${path(lang, "news")}${item.id}/`}><time>{item.date}</time><span>{item.title}</span><b>↗</b></Link>) : <Link href={path(lang, "contact")}><time>2026.11.01</time><span>{t.upcoming}</span><b>↗</b></Link>}</div></div></section>

    <section className="a-finale"><div className="a-finale-photo"><img {...responsive(asset("/images/atelier-sea.jpg"))} alt={ja ? "大阪湾に広がる金色の夕空" : "A golden evening sky over Osaka Bay"} loading="lazy" /></div><div className="a-finale-copy" data-a-reveal><Jewel /><p className="a-eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle[0]}<br />{t.contactTitle[1]}</h2><p>{t.contactBody}</p><Link href={path(lang, "contact")} className="a-button a-button-paper">{t.contactCta}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="a-finale-dm">{t.dm} ↗</a></div></section>
  </div>;
}
