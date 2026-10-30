"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { asset, content, IG_URL, path, type Lang } from "@/content/site";
import type { FeedItem, FeedKind } from "@/lib/feed";
import { responsive } from "@/lib/img";
import { Ornament, PageHero } from "./Shared";

/**
 * News & Events from Instagram, read in the browser like LOBMEYR's Event pages:
 * /instagram/posts.json is written by the server's fetch.php (or the GitHub demo's
 * fetch job), so new tagged posts appear without rebuilding the site.
 */
type IgPost = { id: string; kind: FeedKind; date: string; title: string; desc: string; image: string; permalink: string };

let postsRequest: Promise<IgPost[]> | null = null;
function loadPosts() {
  postsRequest ??= fetch(asset("/instagram/posts.json"), { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : []))
    .then((p) => (Array.isArray(p) ? p : []))
    .catch(() => []);
  return postsRequest;
}

const toItem = (p: IgPost): FeedItem => ({ id: p.id, kind: p.kind, date: p.date, title: p.title, desc: p.desc, image: asset(`/${p.image.replace(/^\//, "")}`), permalink: p.permalink });
const dateKey = (d: string) => Number(d.replace(/\D/g, "")) || 0;
const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/** Items added after the page-wide reveal pass would stay hidden; show them once rendered. */
function useRevealNew(ref: React.RefObject<HTMLElement | null>, key: unknown) {
  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.querySelectorAll(".rv, .rv-img").forEach((el) => el.classList.add("in")), 60);
    return () => clearTimeout(t);
  }, [ref, key]);
}

/** Manual news has its own page; Instagram posts share one page that reads ?id=. */
const itemHref = (lang: Lang, item: FeedItem) => (item.permalink ? `${path(lang, "news")}post/?id=${item.id}` : `${path(lang, "news")}${item.id}/`);

/** One News / Event card: image, label, date, title, two lines of text. Opens the full post on this site. */
function FeedCard({ lang, item, index }: { lang: Lang; item: FeedItem; index: number }) {
  const n = content[lang].news;
  return (
    <Link href={itemHref(lang, item)} className="feed-card group rv block" style={d(`${index * 0.08}s`)}>
      <div className="frame relative aspect-[4/3]">
        <img {...responsive(item.image, "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")} alt="" loading="lazy" />
        <span className="feed-label">{n.labels[item.kind]}</span>
      </div>
      <div className="pt-5">
        <time className="text-[11px] tracking-[.2em] text-white/85">{item.date}</time>
        <h3 className="display mt-2 line-clamp-3 text-[22px] leading-snug transition-colors duration-500 group-hover:text-accent-hi">{item.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm text-white/85">{item.desc}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[.2em] text-accent/0 transition-colors duration-500 group-hover:text-accent">
          {n.readMore} <span>→</span>
        </span>
      </div>
    </Link>
  );
}

/**
 * News & Events grid: manual news (from the page) plus tagged Instagram posts. Home shows the
 * latest few, the News page all, the Events page only event posts ("coming soon" if none).
 */
export function FeedSection({ lang, manual, kind, limit, all, className = "" }: { lang: Lang; manual: FeedItem[]; kind?: FeedKind; limit?: number; all?: boolean; className?: string }) {
  const n = content[lang].news;
  const [ig, setIg] = useState<FeedItem[]>([]);
  const [today, setToday] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    setToday(Number(new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date()).replaceAll("-", "")));
    let active = true;
    loadPosts().then((posts) => active && setIg(posts.map(toItem).filter((i) => !kind || i.kind === kind)));
    return () => {
      active = false;
    };
  }, [kind]);
  useRevealNew(ref, ig);

  const items = [...manual, ...ig].filter(item => dateKey(item.date) <= today).sort((a, b) => dateKey(b.date) - dateKey(a.date));
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <section ref={ref} className={`sec aura ${className}`}>
      {!all && (
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker rv">{kind === "event" ? "Events" : "News"}</p>
            <h2 className="display sec-title rv mt-4" style={d(".1s")}>{kind === "event" ? n.eventsTitle : n.feedTitle}</h2>
          </div>
          {limit && items.length > limit && (
            <Link href={path(lang, "news")} className="link-arrow rv" style={d(".2s")}>{n.viewAll} <span>→</span></Link>
          )}
        </div>
      )}
      {shown.length === 0 ? (
        <p className="display rv py-10 text-center text-3xl text-white/85">{n.comingSoon}</p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item, i) => (
            <FeedCard key={item.id} lang={lang} item={item} index={i} />
          ))}
        </div>
      )}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-accent/20 pt-8">
        <p className="caption">{n.igNote}</p>
        <a href={IG_URL} target="_blank" rel="noopener" className="link-arrow">{n.follow} <span>↗</span></a>
      </div>
    </section>
  );
}

/** Body of a full post: whole text, Instagram button for posts, back link. */
export function FeedBody({ lang, item }: { lang: Lang; item: FeedItem }) {
  const n = content[lang].news;
  return (
    <section className="sec">
      <div className="mx-auto max-w-3xl">
        <p className="rv whitespace-pre-line text-[17px] leading-[2.2] text-white/85">{item.desc}</p>
        <Ornament className="rv my-14 max-w-xs" />
        {item.permalink && (
          <a href={item.permalink} target="_blank" rel="noopener" className="btn btn-line rv">{n.viewOnIg} ↗</a>
        )}
        <div className="mt-16 border-t border-white/10 pt-8">
          <Link href={path(lang, "news")} className="link-arrow">← {n.back}</Link>
        </div>
      </div>
    </section>
  );
}

/** Full Instagram post page: finds ?id= in posts.json (like LOBMEYR's InstagramDetail). */
export function IgPostDetail({ lang }: { lang: Lang }) {
  const n = content[lang].news;
  const [state, setState] = useState<FeedItem | "loading" | "missing">("loading");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    loadPosts().then((posts) => {
      const post = posts.find((p) => p.id === id);
      setState(post ? toItem(post) : "missing");
    });
  }, []);
  useEffect(() => {
    if (typeof state === "object") document.title = `${state.title}${lang === "ja" ? "｜" : " | "}THE JEWELRY`;
  }, [state, lang]);
  useRevealNew(ref, state);

  if (state === "loading") return <section className="min-h-[70vh]" aria-busy="true" />;
  if (state === "missing") {
    return (
      <section className="sec min-h-[70vh] pt-48 text-center">
        <p className="display text-3xl text-white/85">{n.comingSoon}</p>
        <Link href={path(lang, "news")} className="link-arrow mt-10">← {n.back}</Link>
      </section>
    );
  }
  return (
    <div ref={ref}>
      <PageHero hero={{ kicker: n.labels[state.kind], title: state.title, lead: state.date, image: state.image }} />
      <FeedBody lang={lang} item={state} />
    </div>
  );
}
