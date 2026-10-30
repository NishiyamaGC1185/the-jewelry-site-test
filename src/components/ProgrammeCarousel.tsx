"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import { useEffect, useRef, useState } from "react";
import { responsive } from "@/lib/img";

type Item = { no: string; title: string; en: string; image: string };

const AUTO_MS = 5000;

/**
 * Home programme: one large square photo in the middle with the event name over it, the
 * neighbours shrunk at the sides. Arrows, a click on a side photo, or a swipe move it, and it
 * loops endlessly (three copies of the list; it jumps back to the middle copy unseen).
 * It also moves on by itself every few seconds while on screen, pausing under the pointer
 * or keyboard focus; any manual move restarts the wait.
 */
export function ProgrammeCarousel({ items, prev, next }: { items: Item[]; prev: string; next: string }) {
  const n = items.length;
  const [i, setI] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const startX = useRef<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const loop = [...items, ...items, ...items];
  const current = ((i % n) + n) % n;

  const go = (to: number) => {
    // Without motion there is no transition to wait for, so stay in the middle copy at once.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAnimate(!still);
    setI(still ? (((to % n) + n) % n) + n : to);
  };
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // Re-armed on every move (i changes), so a click or swipe gives the visitor a full wait.
  useEffect(() => {
    if (paused || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setI((v) => v + 1);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [i, paused, visible]);

  // After sliding into the first or last copy, jump to the same photo in the middle copy.
  const settle = () => {
    if (i >= n && i < 2 * n) return;
    setAnimate(false);
    setI(current + n);
  };

  return (
    <div
      ref={box}
      className="pc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      <ol className={`pc-track${animate ? "" : " still"}`} style={{ "--i": i } as React.CSSProperties} onTransitionEnd={(e) => e.target === e.currentTarget && settle()}>
        {loop.map((it, k) => (
          <li key={k} className={`pc-slot${k === i ? " on" : ""}`} aria-hidden={k !== i}>
            <button type="button" className="pc-slide" tabIndex={-1} onClick={() => k !== i && go(k)}>
              <img {...responsive(it.image, "(min-width: 1024px) 62vw, 80vw")} alt="" loading="lazy" draggable={false} />
              <span className="pc-text">
                <span className="caption">{it.no} — {it.en}</span>
                <span className="display pc-title">{it.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="pc-arrow pc-prev" aria-label={prev} onClick={() => go(i - 1)} />
      <button type="button" className="pc-arrow pc-next" aria-label={next} onClick={() => go(i + 1)} />
      <p className="pc-dots" aria-hidden="true">
        {items.map((it, k) => <i key={it.no} className={k === current ? "on" : ""} />)}
      </p>
    </div>
  );
}
