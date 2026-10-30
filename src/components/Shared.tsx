/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { responsive } from "@/lib/img";
import { asset, COMPANY_URL, content, IG_URL, path, PAGES, PRIVACY_URL, type Lang, type PageKey } from "@/content/site";
import { Header } from "./Header";

/** Every page: header, content, footer. */
export function Shell({ lang, page, children }: { lang: Lang; page: PageKey; children: ReactNode }) {
  return (
    <>
      <Header lang={lang} page={page} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}

/**
 * Opening, once per visit (CSS): the logo fades in and a soft silver light passes over it,
 * a hairline draws out beneath it with the place name, then the black parts left and right.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mark">
        <span className="intro-logo"><span className="logo" /><span className="logo shine" /></span>
        <span className="intro-line" />
        <span className="intro-cap">Event Venue · Osaka Bay</span>
      </div>
    </div>
  );
}

/**
 * Text split into letters that rise in one after another (CSS `.letters`).
 * Words stay unbroken; `start` offsets the letter count so several lines run on in sequence.
 */
export function SplitText({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  // Japanese has no spaces: each kana/kanji counts as its own "word" so long titles can wrap.
  const words = text.split(/(\s+)/).flatMap((w) => w.split(/(?<=[　-ヿ㐀-鿿＀-￯])|(?=[　-ヿ㐀-鿿＀-￯])/).filter(Boolean));
  return (
    <>
      {words.map((word, w) =>
        /^\s+$/.test(word) ? (
          " "
        ) : (
          <span key={w} className="word">
            {[...word].map((ch, c) => (
              <span key={c} className="ch" style={{ "--i": i++ } as React.CSSProperties}>{ch}</span>
            ))}
          </span>
        ),
      )}
    </>
  );
}

/** Large photo (or film, when `video` is given) header used by every page except the home page. */
export function PageHero({ hero, video, index }: { hero: { kicker: string; title: string; lead: string; image: string }; video?: string; index?: string }) {
  return (
    <section className="page-hero" data-hero>
      <div className="hero-img">
        {video ? <video src={video} poster={hero.image} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" /> : <img {...responsive(hero.image)} alt="" fetchPriority="high" />}
      </div>
      <div className="hero-veil" />
      <div className="page-hero-inner hero-drift">
        <p className="kicker rv">{index && <span className="page-index">{index}</span>}{hero.kicker}</p>
        <h1 className="display rv letters" aria-label={hero.title}>
          <span aria-hidden="true"><SplitText text={hero.title} /></span>
        </h1>
        <p className="lead rv" style={{ "--d": ".24s" } as React.CSSProperties}>{hero.lead}</p>
      </div>
      <p className="hero-meta" aria-hidden="true">34°38′N&nbsp;&nbsp;135°24′E<br />Osaka Bay</p>
    </section>
  );
}

/** Slow band of large outlined words drifting across the screen. */
export function Marquee({ words }: { words: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {words.map((w) => (
              <Fragment key={w}>{w} <i /> </Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Film (or photo) that opens from a framed window to full screen while scrolling, then shows the text. */
export function WindowFilm({ kicker, title, body, video, image }: { kicker: string; title: string; body?: string; video?: string; image: string }) {
  return (
    <section className="window" data-window>
      <div className="window-stick">
        <div className="window-media">
          {video ? <video src={video} poster={image} autoPlay muted loop playsInline preload="none" aria-hidden="true" /> : <img {...responsive(image)} alt="" loading="lazy" />}
        </div>
        <div className="window-text">
          <p className="kicker">{kicker}</p>
          <h2 className="display sec-title mt-5">{title}</h2>
          {body && <p className="mx-auto mt-6 max-w-xl text-white/85">{body}</p>}
        </div>
      </div>
    </section>
  );
}

/** Gold hairline with a small diamond, used between blocks. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <i />
    </div>
  );
}

/** Full-screen invitation to enquire; ends most pages. */
export function ContactBand({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <section className="contact-band">
      <img {...responsive(asset("/images/band-dusk.jpg"))} alt="" className="contact-band-bg" loading="lazy" />
      <p className="kicker rv">Contact</p>
      <h2 className="display contact-band-title rv mt-8" style={{ "--d": ".1s" } as React.CSSProperties}>
        {t.home.contactTitle}
      </h2>
      <p className="rv mx-auto mt-8 max-w-xl text-white/85" style={{ "--d": ".2s" } as React.CSSProperties}>{t.home.contactBody}</p>
      <div className="rv mt-12 flex flex-wrap justify-center gap-4" style={{ "--d": ".3s" } as React.CSSProperties}>
        <Link href={path(lang, "contact")} className="btn btn-accent">{t.nav.cta}</Link>
        <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line">Instagram DM</a>
      </div>
    </section>
  );
}

/** Footer: details and links, closed by the name set across the full width. */
function Footer({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <footer className="site-foot">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="kicker">THE JEWELRY</p>
          <p className="mt-6 text-sm text-white/85">{t.footer.address}</p>
          <p className="caption mt-1">{t.footer.tagline}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-white/85" aria-label="Footer">
          {PAGES.map((p) => (
            <Link key={p} href={path(lang, p)} className="transition hover:text-white">{t.nav.labels[p]}</Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-[13px] text-white/85">
          <a href={IG_URL} target="_blank" rel="noopener" className="hover:text-white">Instagram ↗</a>
          <a href={COMPANY_URL} target="_blank" rel="noopener" className="hover:text-white">{t.footer.company} ↗</a>
          <a href={PRIVACY_URL} target="_blank" rel="noopener" className="hover:text-white">{t.footer.privacy} ↗</a>
          <span className="head-lang mt-3 text-[11px] tracking-[.2em]">
            <Link href={path("ja", "home")} aria-current={lang === "ja" ? "true" : undefined}>JP</Link>
            <Link href={path("en", "home")} aria-current={lang === "en" ? "true" : undefined}>EN</Link>
          </span>
        </div>
      </div>
      <p className="foot-word display" aria-hidden="true">THE JEWELRY</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="logo w-12" />
        <p className="caption">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
