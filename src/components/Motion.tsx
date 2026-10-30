"use client";

import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Page-wide motion: Lenis smooth scrolling, and fade-in of every `.rv` / `.rv-img` element.
 * Elements already on screen show at once, others as they scroll in, and a safety timer
 * reveals everything, so content can never stay hidden (the problem with earlier samples).
 *
 * Scroll-linked effects only set CSS variables / `translate`, whose defaults show the
 * finished state, so a paused frame loop never hides anything:
 *   --hp on [data-hero]    0 → 1 as the hero scrolls away (media grows, text drifts up)
 *   --wp on [data-window]  0 → 1 as the window section opens to full screen
 *   --lp on [data-lights]  0 → 1 as the dome "switches on" (home)
 *   .frame img             slow parallax
 *
 * Also draws the scroll details: a thin progress line at the top and, on wide screens, the
 * current section's number and name (from its `.kicker`) in the bottom-left corner.
 *
 * Page change: the screen frosts over like a glass pane and shows the destination's number
 * and name (read from the menu), the new page loads underneath, then the glass clears.
 */
export function Motion() {
  const pathname = usePathname();
  const router = useRouter();
  const veil = useRef<HTMLDivElement>(null);
  const veiled = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);
  const progress = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLDivElement>(null);
  const sections = useRef<{ el: HTMLElement; name: string }[]>([]);

  // Sections named by their kicker, for the corner index; read again on every page.
  useEffect(() => {
    sections.current = [...document.querySelectorAll<HTMLElement>("main > *")].flatMap((el) => {
      const k = el.querySelector(".kicker");
      if (!k) return [];
      const name = [...k.childNodes].filter((n) => !(n instanceof Element && n.classList.contains("page-index"))).map((n) => n.textContent).join("").trim();
      return name ? [{ el, name }] : [];
    });
  }, [pathname]);

  // Link clicks: the page already open goes back to its top (e.g. Home in the menu while on
  // Home); another page of the site opens through the glass pane.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toTop = (instant: boolean) => {
      if (instant) {
        window.scrollTo({ top: 0, behavior: "instant" });
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      } else if (lenisRef.current) lenisRef.current.scrollTo(0, { force: true });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /\.\w+$/.test(url.pathname)) return;
      if (url.pathname === location.pathname) {
        if (url.hash) return;
        // From the open menu: jump once it has closed (the page scrolls again); otherwise glide up.
        const fromMenu = document.documentElement.classList.contains("menu-open");
        window.setTimeout(() => toTop(fromMenu || reduced), fromMenu ? 80 : 0);
        return;
      }
      const v = veil.current;
      if (reduced || !v) return;
      e.preventDefault();
      // Destination title from the menu (number and name); pages not in the menu show the logo only.
      const item = document.querySelector(`.menu-links a[href="${url.pathname}"]`);
      v.querySelector(".pv-no")!.textContent = item?.querySelector(".menu-no")?.textContent ?? "";
      v.querySelector(".pv-name")!.textContent = item?.querySelector(".menu-name")?.textContent ?? "";
      v.classList.remove("out");
      void v.offsetWidth; // restart from clear glass
      v.classList.add("in");
      veiled.current = true;
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 620);
      // Never leave the page covered if the navigation does not happen.
      window.setTimeout(() => {
        if (veiled.current) {
          veiled.current = false;
          v.classList.replace("in", "out");
        }
      }, 5000);
    };
    // Capture phase: runs before Next's <Link> handler, which then sees defaultPrevented and stands down.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;

    let lastIndex = "";
    const scrollDetails = (vh: number, foot: Element | null) => {
      const max = document.documentElement.scrollHeight - vh;
      progress.current?.style.setProperty("transform", `scaleX(${max > 0 ? clamp01(window.scrollY / max).toFixed(4) : 0})`);
      const list = sections.current;
      let i = -1;
      list.forEach((s, k) => {
        if (s.el.getBoundingClientRect().top < vh * 0.5) i = k;
      });
      // Hidden over the hero and once the footer comes up (it would sit on the footer logo).
      if (foot && foot.getBoundingClientRect().top < vh - 40) i = -1;
      const key = i > 0 ? `${i}` : "";
      if (key === lastIndex || !index.current) return;
      lastIndex = key;
      index.current.classList.toggle("on", i > 0);
      if (i > 0) {
        const pad = (n: number) => String(n).padStart(2, "0");
        index.current.querySelector("b")!.textContent = pad(i + 1);
        index.current.querySelector("em")!.textContent = pad(list.length);
        index.current.querySelector("span")!.textContent = list[i].name;
      }
    };

    // Elements the scroll effects move, found once and again only when the page content
    // changes (new page, Instagram posts arriving), not on every frame.
    let els: {
      hero: HTMLElement[]; win: HTMLElement[]; lights: HTMLElement[];
      words: HTMLElement[]; speed: HTMLElement[]; frames: HTMLImageElement[]; foot: Element | null;
    } | null = null;
    const all = <T extends Element>(q: string) => [...document.querySelectorAll<T>(q)];
    const mo = new MutationObserver(() => (els = null));
    mo.observe(document.body, { childList: true, subtree: true });

    let lastY = -1;
    let lastVh = -1;
    const scrollEffects = () => {
      const vh = window.innerHeight;
      // Nothing moved and nothing changed: skip the frame (most frames while reading).
      if (els && window.scrollY === lastY && vh === lastVh) return;
      lastY = window.scrollY;
      lastVh = vh;
      els ??= {
        hero: all("[data-hero]"), win: all("[data-window]"), lights: all("[data-lights]"),
        words: all(".lw"), speed: all("[data-speed]"), frames: all(".frame img"), foot: document.querySelector(".site-foot"),
      };
      scrollDetails(vh, els.foot);
      els.hero.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--hp", clamp01(-r.top / r.height).toFixed(4));
      });
      els.win.forEach((el) => {
        const r = el.getBoundingClientRect();
        // opens over the first 70% of the travel, then holds while the text reads
        el.style.setProperty("--wp", clamp01(-r.top / ((r.height - vh) * 0.7)).toFixed(4));
      });
      els.lights.forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lp", clamp01(-r.top / ((r.height - vh) * 0.8)).toFixed(4));
      });
      // Statement words light up one by one as they pass 62% of the screen height.
      els.words.forEach((w) => {
        w.classList.toggle("lit", w.getBoundingClientRect().top < vh * 0.62);
      });
      // Floating photos drift at their own speed (data-speed: fraction of the scroll).
      els.speed.forEach((el) => {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        // Small, capped drift so a photo never leaves its own section.
        const shift = Math.max(-90, Math.min(90, (r.top + r.height / 2 - vh / 2) * -Number(el.dataset.speed)));
        el.style.translate = `0 ${shift.toFixed(1)}px`;
      });
      els.frames.forEach((img) => {
        const r = img.parentElement!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 across the screen
        img.style.translate = `0 ${(p * -6).toFixed(2)}%`;
      });
    };

    let id = requestAnimationFrame(function tick(t) {
      // The page behind the full-screen menu must not scroll (Lenis ignores body overflow).
      const menuOpen = document.documentElement.classList.contains("menu-open");
      if (menuOpen !== lenis.isStopped) {
        if (menuOpen) lenis.stop();
        else lenis.start();
      }
      lenis.raf(t);
      scrollEffects();
      id = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(id);
      mo.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".rv, .rv-img")].filter((el) => !el.classList.contains("in"));
    const show = (el: HTMLElement) => el.classList.add("in");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const timers: number[] = [];
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) timers.push(window.setTimeout(() => show(el), 80));
      else io.observe(el);
    });
    timers.push(window.setTimeout(() => els.forEach(show), 4400));
    // After the first-visit logo intro, later page changes reveal without its extra delay.
    timers.push(window.setTimeout(() => document.documentElement.classList.add("intro-seen"), 4300));
    document.querySelector("main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: "cubic-bezier(.2,.7,.1,1)" });
    // Arrived through the glass pane: hold the title a moment, then let the glass clear.
    if (veiled.current) {
      veiled.current = false;
      const v = veil.current;
      timers.push(window.setTimeout(() => v?.classList.replace("in", "out"), 180));
      timers.push(window.setTimeout(() => v?.classList.remove("out"), 1100));
    }
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return (
    <>
      <div ref={progress} className="scroll-progress" aria-hidden="true" />
      <div ref={index} className="scroll-index" aria-hidden="true">
        <b /> / <em /><span />
      </div>
      <div ref={veil} className="page-veil" aria-hidden="true">
        <div className="pv-inner">
          <span className="logo" />
          <span className="pv-no" />
          <span className="pv-name display" />
          <i className="pv-line" />
        </div>
      </div>
    </>
  );
}
