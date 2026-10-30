"use client";
/* eslint-disable @next/next/no-img-element -- local architectural photographs */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { asset, content, path, PAGES, type Lang, type PageKey } from "@/content/site";
import { responsive } from "@/lib/img";

const MENU_IMAGES: Record<PageKey, string> = { home: "atelier-sunset", about: "atelier-detail", spaces: "atelier-dome", events: "atelier-reception", visit: "atelier-colonnade", news: "atelier-sea", contact: "atelier-evening" };

export function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const t = content[lang];
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<PageKey>(page);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const ja = lang === "ja";

  useEffect(() => {
    const scroll = () => setSolid(window.scrollY > 30);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const links = menu.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        if (event.shiftKey && (document.activeElement === links[0] || document.activeElement === toggle.current)) { event.preventDefault(); links[links.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); toggle.current?.focus(); }
      }
    };
    window.addEventListener("keydown", keys);
    return () => { window.removeEventListener("keydown", keys); document.documentElement.classList.remove("menu-open"); document.body.style.overflow = ""; };
  }, [open]);

  return <>
    <header className={`site-head maison-head${solid || open ? " solid" : ""}`}>
      <div className="head-row">
        <Link href={path(lang, "home")} className="maison-brand" aria-label={ja ? "THE JEWELRY トップ" : "THE JEWELRY home"} onClick={() => setOpen(false)}><span className="logo" aria-hidden="true" /><span>THE JEWELRY<small>EVENT VENUE, OSAKA BAY</small></span></Link>
        <nav className="maison-navigation" aria-label={ja ? "メインナビゲーション" : "Main navigation"}>{(["about", "spaces", "events", "visit"] as const).map(p => <Link key={p} href={path(lang, p)} aria-current={page === p ? "page" : undefined}>{p === "about" ? "About" : p === "spaces" ? "Spaces" : p === "events" ? "Events" : "Visit"}</Link>)}</nav>
        <div className="head-right"><span className="head-lang"><Link href={path("ja", page)} aria-current={ja ? "true" : undefined}>JP</Link><Link href={path("en", page)} aria-current={!ja ? "true" : undefined}>EN</Link></span><Link href={path(lang, "contact")} className="maison-head-cta"><span>{ja ? "ご利用のご相談" : "Enquire"}</span> ↗</Link><button ref={toggle} type="button" className="menu-btn" aria-label={open ? t.nav.close : t.nav.menu} aria-expanded={open} aria-controls="maison-menu" onClick={() => setOpen(v => !v)}><span className="menu-lines" aria-hidden="true"><i /><i /></span></button></div>
      </div>
    </header>
    <div className="menu-panel maison-menu" id="maison-menu" ref={menu} inert={!open}>
      <div className="menu-media" aria-hidden="true">{PAGES.map(p => <img key={p} {...responsive(asset(`/images/${MENU_IMAGES[p]}.jpg`), "40vw")} alt="" className={preview === p ? "on" : ""} loading="lazy" />)}</div>
      <nav className="menu-links" aria-label={ja ? "すべてのページ" : "All pages"}><p className="maison-menu-label">AN INVITATION TO THE JEWELRY</p><ol>{PAGES.map((p, i) => <li key={p} style={{ "--i": i } as React.CSSProperties}><Link href={path(lang, p)} aria-current={page === p ? "page" : undefined} onMouseEnter={() => setPreview(p)} onFocus={() => setPreview(p)} onClick={() => setOpen(false)}><span className="menu-no">0{i + 1}</span><span className="display menu-name">{t.nav.labels[p]}</span></Link></li>)}</ol><div className="menu-foot"><span className="caption">OSAKA BAY, JAPAN</span><span className="head-lang"><Link href={path("ja", page)} onClick={() => setOpen(false)}>JP</Link><Link href={path("en", page)} onClick={() => setOpen(false)}>EN</Link></span></div></nav>
    </div>
  </>;
}
