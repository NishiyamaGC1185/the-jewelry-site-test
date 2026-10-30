/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import Link from "next/link";
import { content, path, type Lang } from "@/content/site";
import { responsive } from "@/lib/img";

/**
 * Home "Spaces" as tall photo cards in a row. On desktop the card under the pointer (or with
 * keyboard focus) widens while the others narrow, and its description and link slide in.
 * Tablets show all cards open at equal width; phones swipe through them sideways.
 */
export function SpacesCards({ lang }: { lang: Lang }) {
  const t = content[lang];
  return (
    <ul className="space-cards rv">
      {t.spaces.spaces.map((s) => (
        <li key={s.no} className="space-card">
          <img {...responsive(s.image, "(min-width: 1024px) 70vw, 85vw")} alt="" loading="lazy" />
          <div className="space-card-body">
            <p className="caption">{s.no}</p>
            <h3 className="display space-card-title">{s.name}</h3>
            <div className="space-card-more">
              <div>
                <p className="space-card-cap">{s.capacity}<small>{t.common.guests}</small></p>
                <p className="space-card-text">{s.body}</p>
                <Link href={path(lang, "spaces")} className="space-card-cta">{t.common.more}</Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
