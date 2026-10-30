"use client";

/* eslint-disable @next/next/no-img-element -- local photos, sized by CSS */
import { useEffect, useRef, useState } from "react";
import { responsive } from "@/lib/img";

const AUTO_MS = 3000;

/**
 * Wide photo carousel for one event type: the current photo in the middle, the previous and
 * next ones peeking at the edges, a label and "1 / 3" counter underneath. Endless like the
 * home programme carousel (three copies; it jumps back to the middle copy unseen).
 * It moves on by itself every few seconds while on screen (no pause under the pointer: the
 * photos are so wide the pointer nearly always rests on one); any manual move restarts the wait.
 */
export function PhotoCarousel({ images, label, prev, next }: { images: string[]; label: string; prev: string; next: string }) {
  const n = images.length;
  const [i, setI] = useState(n);
  const [animate, setAnimate] = useState(true);
  const [visible, setVisible] = useState(false);
  const startX = useRef<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const loop = [...images, ...images, ...images];
  const current = ((i % n) + n) % n;

  const go = (to: number) => {
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
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setI((v) => v + 1);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [i, visible]);

  const settle = () => {
    if (i >= n && i < 2 * n) return;
    setAnimate(false);
    setI(current + n);
  };

  return (
    <div
      ref={box}
      className="phc"
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="phc-view">
        <ol className={`phc-track${animate ? "" : " still"}`} style={{ "--i": i } as React.CSSProperties} onTransitionEnd={(e) => e.target === e.currentTarget && settle()}>
          {loop.map((src, k) => (
            <li key={k} className={`phc-slide${k === i ? " on" : ""}`} aria-hidden={k !== i} onClick={() => k !== i && go(k)}>
              <img {...responsive(src, "(min-width: 768px) 78vw, 88vw")} alt="" loading="lazy" draggable={false} />
            </li>
          ))}
        </ol>
      </div>
      <div className="phc-bar">
        <span className="caption">{label}</span>
        <span className="phc-ctrl">
          <button type="button" className="phc-btn phc-prev" aria-label={prev} onClick={() => go(i - 1)} />
          <span className="caption">{current + 1} / {n}</span>
          <button type="button" className="phc-btn phc-next" aria-label={next} onClick={() => go(i + 1)} />
        </span>
      </div>
    </div>
  );
}
