"use client";
/* eslint-disable @next/next/no-img-element -- authentic, supplied venue photography */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { asset, content, IG_URL, path, type Lang } from "@/content/site";
import { renewal } from "@/content/renewal";
import { responsive } from "@/lib/img";
import { CinemaHero } from "./CinemaHero";
import "./cinema-home.css";

type Post = { id: string; title: string; image: string; permalink: string; date: string };

export function CinemaHome({ lang }: { lang: Lang }) {
  const root = useRef<HTMLDivElement>(null);
  const [programme, setProgramme] = useState(0);
  const [space, setSpace] = useState(0);
  const [today, setToday] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const ja = lang === "ja";
  const t = content[lang];
  const copy = renewal[lang];
  const selectedEvent = t.events.types[programme];
  const selectedSpace = copy.spaces[space];

  useEffect(() => {
    setToday(Number(new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date()).replaceAll("-", "")));
    let active = true;
    fetch(asset("/instagram/posts.json"), { cache: "no-cache" }).then(response => response.ok ? response.json() : []).then(data => {
      if (!active || !Array.isArray(data)) return;
      const valid = data.filter((post): post is Post => {
        if (!post || typeof post.title !== "string" || typeof post.image !== "string" || typeof post.permalink !== "string" || typeof post.id !== "string") return false;
        try { const url = new URL(post.permalink); return url.protocol === "https:" && ["www.instagram.com", "instagram.com"].includes(url.hostname); } catch { return false; }
      });
      setPosts(valid.slice(0, 3));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const el = root.current!;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("ch-in"); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    el.querySelectorAll("[data-ch-reveal]").forEach(item => observer.observe(item));
    el.classList.add("ch-enhanced");
    return () => observer.disconnect();
  }, []);

  const news = t.news.items.filter(item => Number(item.date.replaceAll(".", "")) <= today).slice(0, 2);

  return <div className="cinema-home" ref={root}>
    <CinemaHero lang={lang} />
    <section className="ch-bay" id="the-bay">
      <div className="ch-bay-copy" data-ch-reveal><p className="ch-micro">01 / THE WATERFRONT EDITION</p><h2>The bay.<br /><em>Your next scene.</em></h2><h3>{ja ? <>大阪湾から、忘れられない一日を。</> : <>Your event, on Osaka Bay.</>}</h3><p>{ja ? <>THE JEWELRYは、大阪湾に面したイベント施設です。<br />展示会、ブランドイベント、レセプションなど、<br />人が集い、心が動くひとときを。<br />開催したい企画に合わせて、会場利用をご相談ください。</> : <>THE JEWELRY is an event venue on Osaka Bay.<br />For exhibitions, brand events and receptions:<br />bring people together for moments that stay with them.<br />Talk to us about the event you have in mind.</>}</p><Link href={path(lang, "about")} target="_self" className="ch-line-link">{ja ? "THE JEWELRYについて" : "About THE JEWELRY"}<span>↗</span></Link></div>
      <figure className="ch-bay-visual" data-ch-reveal><img {...responsive(asset("/images/lounge-night.jpg"), "(min-width: 900px) 62vw, 100vw")} alt={ja ? "夜景を望むラウンジのイメージ" : "A lounge overlooking an illuminated waterfront — illustrative image"} loading="lazy" /><figcaption><span>THE ART OF GATHERING</span><span>34°38′N / 135°24′E</span></figcaption></figure>
    </section>

    <section className="ch-programme" id="occasions"><div className="ch-section-heading" data-ch-reveal><p className="ch-micro">02 / YOUR IDEAS, IN THIS SPACE</p><h2>{ja ? <>思い描く一日を、<em>この場所で。</em></> : <>Your event.<em>Your way.</em></>}</h2><p>{ja ? "作品の魅力を届ける。ブランドの想いを伝える。大切な人を迎える。" : "Share your art. Bring a brand to life. Bring people together."}</p></div><div className="ch-event-layout"><div className="ch-event-choices" role="group" aria-label={ja ? "ご利用シーンを選ぶ" : "Explore ways to use the venue"}>{t.events.types.map((event, i) => <button key={event.no} aria-pressed={programme === i} onClick={() => setProgramme(i)} onMouseEnter={() => setProgramme(i)} onFocus={() => setProgramme(i)}><span>0{i + 1}</span><span><small>{event.en}</small>{event.title}</span><b>↗</b></button>)}<Link href={path(lang, "events")} target="_self" className="ch-line-link">{ja ? "イベントの開催について" : "Explore events & exhibitions"}<span>↗</span></Link></div><div className="ch-event-presentation"><div className="ch-event-photo">{t.events.types.map((event, i) => <img key={event.no} {...responsive(event.card, "(min-width: 900px) 50vw, 100vw")} alt={programme === i ? event.title : ""} className={programme === i ? "ch-selected" : ""} loading="lazy" />)}<span>0{programme + 1} / {selectedEvent.en}</span></div><p className="ch-event-description">{selectedEvent.body}</p></div></div></section>

    <section className="ch-spaces" id="spaces"><div className="ch-spaces-top" data-ch-reveal><div><p className="ch-micro">03 / FIND YOUR STAGE</p><h2>{copy.spacesTitle}</h2></div><p>{copy.spacesBody}</p></div><div className="ch-space-choices" role="group" aria-label={ja ? "会場を選ぶ" : "Choose a space"}>{copy.spaces.map((item, i) => <button key={item.en} aria-pressed={space === i} onClick={() => setSpace(i)}><span>0{i + 1}</span>{item.en}<small>{ja ? item.name : ""}</small></button>)}</div><div className="ch-space-layout"><div className="ch-space-photo">{copy.spaces.map((item, i) => <img key={item.en} {...responsive(asset(`/images/${item.image}.jpg`), "(min-width: 900px) 70vw, 100vw")} alt={space === i ? item.name : ""} className={space === i ? "ch-selected" : ""} loading="lazy" />)}</div><div className="ch-space-text" key={selectedSpace.en}><span className="ch-space-number">0{space + 1}</span><p className="ch-micro">{selectedSpace.en}</p><h3>{selectedSpace.name}</h3><p>{selectedSpace.body}</p><Link href={path(lang, "spaces")} target="_self" className="ch-line-link">{copy.spacesLink}<span>↗</span></Link></div></div></section>

    <section className="ch-night"><img {...responsive(asset("/images/atelier-light.jpg"))} alt={ja ? "光がガラスの骨組みを彩るドームの内部" : "Light tracing the glass structure inside the dome"} loading="lazy" /><div className="ch-night-copy" data-ch-reveal><p className="ch-micro">A PLACE TO FEEL SOMETHING.</p><h2>{ja ? <>人が集まると、<br /><em>景色は、もっと美しくなる。</em></> : <>Beautiful places.<br /><em>Even better, together.</em></>}</h2><span>EVENTS / EXHIBITIONS / RECEPTIONS</span></div></section>

    <section className="ch-invitations"><div data-ch-reveal><p className="ch-micro">FOR ORGANISERS</p><h2>{ja ? <>この場所で、<br />イベントを開催する。</> : <>Host your event.<br />Make it memorable.</>}</h2><p>{ja ? "展示会や発表会、レセプションなど、開催したい企画をお聞かせください。日程や内容が未定でも、会場見学からご相談いただけます。" : "From your first idea to finding the right space. Get in touch, even if your dates or details are not yet fixed."}</p><Link className="ch-solid-link" href={path(lang, "contact")} target="_self">{copy.host}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ch-quiet-link">{copy.dm} ↗</a></div><div data-ch-reveal><p className="ch-micro">FOR VISITORS</p><h2>{ja ? <>心ひかれるひとときを、<br />見つけに。</> : <>Find an event.<br />Plan your visit.</>}</h2><p>{copy.visitBody}</p><span className="ch-operation-note">{copy.visitNote}</span><Link className="ch-line-link" href={path(lang, "visit")} target="_self">{copy.accessLink}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ch-quiet-link">{copy.eventInfo} ↗</a><span className="ch-station">{copy.station}</span></div></section>

    <section className="ch-journal"><div className="ch-journal-heading"><div><p className="ch-micro">JOURNAL / INSTAGRAM</p><h2>{copy.journalTitle}</h2></div><a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ch-line-link">{copy.journalLink}<span>↗</span></a></div>{posts.length > 0 ? <div className="ch-instagram-feed">{posts.map(post => <a href={post.permalink} key={post.id} target="_blank" rel="noopener noreferrer"><img src={asset(`/${post.image.replace(/^\//, "")}`)} alt={post.title} loading="lazy" /><span>{post.title}</span><b>↗</b></a>)}</div> : <div className="ch-instagram-fallback"><span aria-hidden="true">◎</span><p>{copy.journalBody}</p><a href={IG_URL} target="_blank" rel="noopener noreferrer">@thejewelry_official ↗</a></div>}<div className="ch-news"><span className="ch-micro">{copy.newsHeading}</span><div>{news.length ? news.map(item => <Link href={`${path(lang, "news")}${item.id}/`} target="_self" key={item.id}><time>{item.date}</time><span>{item.title}</span><b>↗</b></Link>) : <Link href={path(lang, "contact")} target="_self"><time>2026.11.01</time><span>{copy.upcoming}</span><b>↗</b></Link>}</div></div></section>

    <section className="ch-finale"><img {...responsive(asset("/images/atelier-sea.jpg"))} alt={ja ? "夕暮れの大阪湾" : "Osaka Bay at dusk"} loading="lazy" /><div data-ch-reveal><p className="ch-micro">THE NEXT SCENE IS YOURS.</p><h2>{ja ? <>次のイベントを、<br /><em>ここから。</em></> : <>Your next event.<br /><em>Starts here.</em></>}</h2><p>{copy.contactBody}</p><Link href={path(lang, "contact")} target="_self" className="ch-solid-link">{copy.contactCta}<span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer">{copy.dm} ↗</a></div></section>
  </div>;
}
