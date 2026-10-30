/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { Fragment } from "react";
import { asset, content, IG_URL, MAP_EMBED, PARKING_URL, path, type Content, type Lang } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { feed, type FeedItem } from "@/lib/feed";
import { responsive } from "@/lib/img";
import { FeedBody, FeedSection, IgPostDetail } from "./Feed";
import { PhotoCarousel } from "./PhotoCarousel";
import { CinemaHome } from "./cinema/CinemaHome";
import { ContactBand, Marquee, PageHero, Shell, WindowFilm } from "./Shared";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

/* ======================= HOME ======================= */

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <Shell lang={lang} page="home">
      <CinemaHome lang={lang} />
    </Shell>
  );
}

/* ======================= ABOUT ======================= */
export function AboutPage({ lang }: { lang: Lang }) {
  const a = content[lang].about;
  return (
    <Shell lang={lang} page="about">
      <PageHero hero={a.hero} index="02" />
      <Marquee words={["Events", "Exhibitions", "Receptions", "Osaka Bay"]} />
      {a.chapters.map((c) => (
        <article key={c.no} className="chapter">
          <div className="chapter-band frame rv-img">
            <img {...responsive(c.image)} alt="" loading="lazy" />
            <span className="chapter-no display" aria-hidden="true">{c.no}</span>
          </div>
          <div className="chapter-text">
            <h2 className="display rv text-[clamp(30px,3.6vw,56px)] leading-tight">{c.title}</h2>
            <p className="rv text-white/85" style={d(".12s")}>{c.body}</p>
          </div>
        </article>
      ))}
      <WindowFilm kicker="Vision" title={a.quote} image={asset("/images/about-vision.jpg")} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= SPACES ======================= */
export function SpacesPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const s = t.spaces;
  return (
    <Shell lang={lang} page="spaces">
      <PageHero hero={s.hero} index="03" />
      <Marquee words={content.en.spaces.spaces.map((x) => x.name)} />
      {s.spaces.map((sp) => (
        <section key={sp.no} className="plate">
          <div className="plate-photo frame rv-img">
            <img {...responsive(sp.image)} alt={sp.name} loading="lazy" />
            <div className="plate-title">
              <p className="caption">{sp.no} · {sp.en}</p>
              <h2 className="display">{sp.name}</h2>
            </div>
            {sp.capacity && <p className="plate-cap display" aria-hidden="true">{sp.capacity}</p>}
          </div>
          <dl className="plate-specs">
            <div className="rv">
              <dt className="kicker">{s.capacityLabel}</dt>
              <dd className="display mt-3 text-[clamp(30px,3vw,44px)]">{sp.capacity ? <>{sp.capacity}<small className="ml-2 text-sm text-white/85">{t.common.guests}</small></> : <span className="text-base leading-relaxed">{lang === "ja" ? "催事の内容・レイアウトにより異なります。ご希望人数をお知らせください。" : "Guest numbers depend on the event and layout. Please share your requirements."}</span>}</dd>
            </div>
            <div className="rv" style={d(".1s")}>
              <dt className="kicker">{s.usesLabel}</dt>
              <dd className="mt-4 flex flex-wrap gap-2">
                {sp.uses.map((u) => <span key={u} className="chip">{u}</span>)}
              </dd>
            </div>
            <div className="rv" style={d(".2s")}>
              <dt className="sr-only">{sp.name}</dt>
              <dd className="text-white/85">{sp.body}</dd>
            </div>
          </dl>
        </section>
      ))}
      <WindowFilm kicker="Combination" title={s.combineTitle} body={s.combineBody} image={asset("/images/spaces-combine.jpg")} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= EVENTS ======================= */
export function EventsPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const e = t.events;
  const arrows = { prev: lang === "ja" ? "前へ" : "Previous", next: lang === "ja" ? "次へ" : "Next" };
  return (
    <Shell lang={lang} page="events">
      <PageHero hero={e.hero} index="04" />

      {/* intro and enquiry */}
      <section className="sec ev-intro">
        <h2 className="display ev-intro-title rv">{e.intro.title}</h2>
        <div className="rv" style={d(".1s")}>
          <p className="text-white/85">{e.intro.body}</p>
          <Link href={path(lang, "contact")} className="btn btn-line mt-8">{e.intro.cta} →</Link>
        </div>
      </section>

      {/* one block per event type: photo carousel, text, facts that fold open */}
      <section className="ev-types">
        <h2 className="display sec-title rv px-[var(--pad)]">{e.typesTitle}</h2>
        {e.types.map((ty) => (
          <article key={ty.no} className="ev-type">
            <div className="rv"><PhotoCarousel images={ty.images} label={`${ty.no} — ${ty.en}`} {...arrows} /></div>
            <div className="ev-type-body">
              <div className="rv">
                <p className="caption">{ty.no} — {ty.en}</p>
                <h3 className="display ev-type-title">{ty.title}</h3>
                <p className="mt-6 leading-[2.1] text-white/85">{ty.body}</p>
                <p className="mt-4 leading-[2.1] text-white/85">{ty.more}</p>
              </div>
              <div className="ev-facts rv" style={d(".1s")}>
                {ty.facts.map((f, k) => (
                  <details key={f.label} open={k === 0}>
                    <summary>{f.label}</summary>
                    <p>{f.value}</p>
                  </details>
                ))}
                <p className="mt-6 text-xs text-white/85">{t.common.pending}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* spaces: photo cards with a caption underneath */}
      <section className="sec ev-spaces">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display sec-title rv">{e.spacesTitle}</h2>
          <Link href={path(lang, "spaces")} className="link-arrow rv">{t.common.more} <span>→</span></Link>
        </div>
        <ul className="ev-space-grid">
          {t.spaces.spaces.map((sp, i) => (
            <li key={sp.no} className="rv" style={d(`${i * 0.08}s`)}>
              <Link href={path(lang, "spaces")} className="ev-space group">
                <span className="frame block aspect-[3/4]"><img {...responsive(sp.image, "(min-width: 768px) 33vw, 100vw")} alt="" loading="lazy" /></span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="display text-2xl transition-colors group-hover:text-accent-hi">{sp.name}</span>
                  <span className="caption">{sp.capacity ? `${sp.capacity}${t.common.guests}` : (lang === "ja" ? "人数・レイアウトはご相談ください" : "Enquire about guest numbers")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FeedSection lang={lang} manual={feed(lang, "event")} kind="event" />
      <section className="sec flow aura">
        <div className="flow-head">
          <p className="kicker rv">Flow</p>
          <h2 className="display sec-title rv mt-4" style={d(".1s")}>{e.flowTitle}</h2>
        </div>
        <ol className="flow-steps">
          {e.flow.map((f, i) => (
            <li key={f.no} className="rv" style={d(`${i * 0.1}s`)}>
              <span className="flow-no display">{f.no}</span>
              <div>
                <h3 className="display text-[clamp(22px,2vw,30px)]">{f.title}</h3>
                <p className="mt-3 text-sm leading-[2] text-white/85">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= VISIT ======================= */
export function VisitPage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const v = t.visit;
  return (
    <Shell lang={lang} page="visit">
      <PageHero hero={v.hero} index="05" />
      <Marquee words={["Nanko", "Osaka Bay", "Cosmosquare", "Access"]} />
      <section className="sec info-grid aura">
        <div className="rv">
          <h2 className="kicker">{v.hoursTitle}</h2>
          <p className="display info-value">{v.hours}</p>
          <p className="mt-4 text-sm text-white/85">{v.hoursNote}</p>
          
        </div>
        <div className="rv" style={d(".1s")}>
          <h2 className="kicker">{v.addressTitle}</h2>
          <p className="display info-value">{v.address[0]}<br />{v.address[1]}</p>
          <ul className="mt-6 text-sm text-white/85">{v.trains.map((x) => <li key={x} className="border-t border-white/10 py-3">{x}</li>)}</ul>
        </div>
        <div className="rv" style={d(".2s")}>
          <h2 className="kicker">{v.timesTitle}</h2>
          <ul className="times">
            {v.times.map((x) => (
              <li key={x.from}><span>{x.from}</span><i aria-hidden="true" /><b>{x.time}</b></li>
            ))}
          </ul>
        </div>
      </section>
      <WindowFilm kicker="Osaka Bay" title={v.window.title} body={v.window.body} image={asset("/images/visit-bay.jpg")} />
      <section className="grid md:grid-cols-2">
        <div className="map-frame">
          <iframe title="Map" src={MAP_EMBED} loading="lazy" className="h-full min-h-[460px] w-full border-0" />
        </div>
        <div className="sec bg-coal">
          <p className="kicker rv">{v.parkingTitle}</p>
          <p className="rv mt-6 max-w-md text-white/85" style={d(".1s")}>{v.parking}</p>
          <a href={PARKING_URL} target="_blank" rel="noopener" className="btn btn-line rv mt-8" style={d(".2s")}>{v.parkingLink} ↗</a>
          <figure className="rv mt-10" style={d(".3s")}>
            <img src={asset("/images/parking-atc.png")} alt={v.parkingAtc} loading="lazy" className="w-full" />
            <figcaption className="caption mt-3">{v.parkingAtc}</figcaption>
          </figure>
        </div>
      </section>
      <section className="sec">
        <p className="kicker rv">{v.routesTitle}</p>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          {v.routes.map((r, i) => (
            <RouteChart key={r.caption} route={r} end={v.routeEnd} delay={i * 0.12} />
          ))}
        </div>
        <p className="caption rv mt-8">{v.routeEnd.note}</p>
      </section>
      <ContactBand lang={lang} />
    </Shell>
  );
}

/** Train route chart drawn in HTML: each path's lines and stations, joined at Cosmosquare, then the walk. */
function RouteChart({ route, end, delay }: { route: Content["visit"]["routes"][number]; end: Content["visit"]["routeEnd"]; delay: number }) {
  return (
    <figure className="route rv" style={d(`${delay}s`)}>
      <figcaption className="display text-2xl">{route.caption}</figcaption>
      <div className="route-paths" style={{ gridTemplateColumns: `repeat(${route.paths.length}, 1fr)` }}>
        {route.paths.map((path, i) => (
          <div key={i} className="route-path">
            <span className="route-stop route-start">{path.from}</span>
            {path.legs.map((leg) => (
              <Fragment key={leg.line + leg.min}>
                <span className="route-leg" style={{ "--c": leg.color } as React.CSSProperties}>
                  <span>{leg.line}<b>{leg.min}</b></span>
                </span>
                {leg.to && <span className="route-stop">{leg.to}</span>}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      <span className="route-stop route-cosmo">{end.station}</span>
      <span className="route-walk">{end.walk}</span>
      <span className="route-stop route-goal">THE JEWELRY</span>
    </figure>
  );
}

/** Full page for a manual news item (static, one per item). */
export function FeedDetailPage({ lang, item }: { lang: Lang; item: FeedItem }) {
  const n = content[lang].news;
  return (
    <Shell lang={lang} page="news">
      <PageHero hero={{ kicker: n.labels[item.kind], title: item.title, lead: item.date, image: item.image }} />
      <FeedBody lang={lang} item={item} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/** Full page for an Instagram post (/news/post/?id=…), filled in the browser from posts.json. */
export function IgPostPage({ lang }: { lang: Lang }) {
  return (
    <Shell lang={lang} page="news">
      <IgPostDetail lang={lang} />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= NEWS ======================= */
export function NewsPage({ lang }: { lang: Lang }) {
  const n = content[lang].news;
  return (
    <Shell lang={lang} page="news">
      <PageHero hero={n.hero} index="06" />
      <Marquee words={["News", "Instagram", "@thejewelry_official"]} />
      <FeedSection lang={lang} manual={feed(lang)} all />
      <ContactBand lang={lang} />
    </Shell>
  );
}

/* ======================= CONTACT ======================= */
export function ContactPage({ lang }: { lang: Lang }) {
  const c = content[lang].contact;
  return (
    <Shell lang={lang} page="contact">
      <PageHero hero={c.hero} index="07" />
      <Marquee words={["Let's talk", "Exhibitions", "Events", "Receptions"]} />
      <section className="sec contact-layout aura">
        <aside className="contact-aside">
          <p className="display rv text-[clamp(24px,2.4vw,34px)] leading-snug">{c.intro}</p>
          <div className="dm-card rv" style={d(".1s")}>
            <h2 className="display text-2xl">{c.dmTitle}</h2>
            <p className="mt-3 text-sm text-white/85">{c.dmBody}</p>
            <a href={IG_URL} target="_blank" rel="noopener" className="btn btn-line mt-6">Instagram DM ↗</a>
          </div>
        </aside>
        <ContactForm lang={lang} />
      </section>
    </Shell>
  );
}




