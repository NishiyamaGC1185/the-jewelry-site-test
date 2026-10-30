"use client";
/* eslint-disable @next/next/no-img-element -- authentic local venue photographs */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset, IG_URL } from "@/content/site";
import { responsive } from "@/lib/img";
import "./studio.css";

export type Variant = "type" | "cinema" | "editorial";
const STUDIES = [
  { id: "type" as const, no: "01", title: "INSIDE THE LETTERS", label: "TYPOGRAPHIC IMPACT", description: "文字が、風景への入口になる。", detail: "巨大な文字の中にだけ見える大阪湾。スクロールすると文字の境界が画面の外へ消え、光のドームが全景へ変わる。", image: "hero-night", motion: "文字のマスク → 空間を満たす風景" },
  { id: "cinema" as const, no: "02", title: "UN / BUILT", label: "CINEMATIC ARCHITECTURE", description: "断片から、ひとつの空間へ。", detail: "空中にずれた建築の断片が、スクロールでひとつの写真に組み上がる。細い額縁がほどけ、ドームの内側へ視界が広がる。", image: "atelier-sail", motion: "断片の集合 → 再構築 → フルスクリーン" },
  { id: "editorial" as const, no: "03", title: "MAKE A SCENE", label: "EXPERIMENTAL FASHION EDITORIAL", description: "誌面がほどけ、体験に変わる。", detail: "大きな斜体、傾いた写真、余白の非対称コラージュ。文字が左右へ走り、海辺の写真が回転しながら全画面へ変わる。", image: "atelier-reception", motion: "非対称コラージュ → 誌面の分解 → 水辺の全景" },
];
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const range = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const smooth = (n: number) => n * n * (3 - 2 * n);

function StudioHeader({ variant }: { variant?: Variant }) {
  return <header className="xs-header"><Link className="xs-brand" href="/preview/" target="_self"><span className="logo" aria-hidden="true" /><span>THE JEWELRY<small>CREATIVE STUDIES / OSAKA BAY</small></span></Link><nav aria-label="プロトタイプの切り替え">{STUDIES.map(study => <Link key={study.id} href={`/preview/${study.id}/`} target="_self" aria-current={variant === study.id ? "page" : undefined}><span>{study.no}</span>{study.id === "type" ? "TYPE" : study.id === "cinema" ? "CINEMA" : "EDITORIAL"}</Link>)}</nav><Link className="xs-overview" href="/preview/" target="_self">比較一覧 ↗</Link></header>;
}

export function StudioIndex() {
  return <div className="experimental-studio xs-index"><StudioHeader /><main><div className="xs-index-intro"><p className="xs-micro">THE JEWELRY / EXPERIMENTAL DIGITAL STUDIES</p><h1>Break the frame.<br /><em>Enter the experience.</em></h1><p>構図が変わる。文字が空間になる。<br />3つの動くプロトタイプを、実際にスクロールして比較してください。</p></div><div className="xs-index-studies">{STUDIES.map(study => <Link href={`/preview/${study.id}/`} target="_self" key={study.id} className={`xs-study-card study-${study.id}`}><div className="xs-study-image"><img {...responsive(asset(`/images/${study.image}.jpg`), "(min-width: 900px) 33vw, 100vw")} alt={study.description} /><span>{study.id === "type" ? "JEWELRY" : study.id === "cinema" ? <>UN<span>/</span>BUILT</> : <>Make<br /><em>a scene.</em></>}</span><b>↗</b></div><div className="xs-study-caption"><p>{study.no} / {study.label}</p><h2>{study.description}</h2><span>{study.detail}</span><small>{study.motion}</small></div></Link>)}</div><p className="xs-index-note">支給された実写真・正式ロゴを使用。既存のTOPを上書きしない、独立したデザイン検証用ページです。</p></main></div>;
}

export function ExperimentalStudio({ variant }: { variant: Variant }) {
  const root = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const progressText = useRef<HTMLOutputElement>(null);
  const autoFrame = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const study = STUDIES.find(item => item.id === variant)!;

  const stop = useCallback(() => { cancelAnimationFrame(autoFrame.current); autoFrame.current = 0; setPlaying(false); }, []);
  const seek = useCallback((progress: number) => {
    const el = sequence.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + Math.max(0, el.offsetHeight - window.innerHeight) * progress, behavior: "instant" });
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { setSystemReduced(media.matches); setReduced(media.matches); };
    change(); media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const el = sequence.current!;
    const container = root.current!;
    let scrollFrame = 0;
    let previous = -1;
    const draw = () => {
      scrollFrame = 0;
      const rect = el.getBoundingClientRect();
      const p = reduced ? 1 : clamp(-rect.top / Math.max(1, el.offsetHeight - window.innerHeight));
      const open = smooth(range(p, .06, .84));
      el.style.setProperty("--p", p.toFixed(5));
      el.style.setProperty("--open", open.toFixed(5));
      el.style.setProperty("--scale", (1 + open * 15).toFixed(5));
      el.style.setProperty("--wash", smooth(range(p, .62, .86)).toFixed(5));
      el.style.setProperty("--leave", (1 - smooth(range(p, .05, .32))).toFixed(5));
      el.style.setProperty("--arrive", smooth(range(p, .77, .96)).toFixed(5));
      el.style.setProperty("--scatter", (1 - smooth(range(p, .015, .48))).toFixed(5));
      el.style.setProperty("--expand", smooth(range(p, .45, .89)).toFixed(5));
      const percentage = Math.round(p * 100);
      if (percentage !== previous) {
        previous = percentage;
        if (slider.current) slider.current.value = String(percentage);
        if (progressText.current) progressText.current.value = `${String(percentage).padStart(2, "0")}%`;
      }
    };
    const queue = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(draw); };
    const key = (event: KeyboardEvent) => {
      if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) stop();
    };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("xs-in"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    container.querySelectorAll("[data-xs-reveal]").forEach(item => observer.observe(item));
    container.classList.add("xs-enhanced");
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", key);
    draw();
    return () => {
      cancelAnimationFrame(scrollFrame); observer.disconnect(); cancelAnimationFrame(autoFrame.current);
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue);
      window.removeEventListener("wheel", stop); window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", key);
    };
  }, [variant, reduced, stop]);

  const play = () => {
    if (playing) { stop(); return; }
    if (reduced) return;
    seek(0);
    setPlaying(true);
    let started = 0;
    const tick = (time: number) => {
      if (!started) started = time;
      const p = clamp((time - started) / 10000);
      seek(p);
      if (p < 1) autoFrame.current = requestAnimationFrame(tick);
      else { autoFrame.current = 0; setPlaying(false); }
    };
    autoFrame.current = requestAnimationFrame(tick);
  };
  const restart = () => { stop(); seek(0); };

  return <div ref={root} className={`experimental-studio xs-${variant}${reduced ? " xs-reduced" : ""}`}>
    <StudioHeader variant={variant} />
    <main>
      <section ref={sequence} className="xs-sequence" aria-label={`${study.label}：スクロールで構図が変化します`}>
        <div className="xs-stage">
          {variant === "type" ? <TypeScene /> : variant === "cinema" ? <CinemaScene /> : <EditorialScene />}
          <div className="xs-scene-index" aria-hidden="true"><span>{study.no} / {study.label}</span><span>THE JEWELRY — OSAKA BAY</span></div>
          <div className="xs-stage-hint" aria-hidden="true"><i /><span>SCROLL TO TRANSFORM</span></div>
        </div>
      </section>
      <section className="xs-after" id="experience">
        <div className="xs-after-intro" data-xs-reveal><p className="xs-micro">A PLACE FOR WHAT COMES NEXT.</p><h2>建築の内側に、<br /><em>あなたの次の物語を。</em></h2><p>大阪湾に佇む、イベント会場＆ミュージアム。<br />作品を届ける。ブランドの世界をひらく。人と出会う。<br />この場所の可能性は、あなたのアイデアから広がります。</p></div>
        <div className="xs-event-spread" data-xs-reveal><figure><img {...responsive(asset("/images/atelier-reception.jpg"), "(min-width: 800px) 62vw, 100vw")} alt="夕日の大阪湾を望むレセプション空間" loading="lazy" /><figcaption>THE GATHERING / 夕日と海に包まれる、レセプションの舞台。</figcaption></figure><div><span>EXHIBITION<br />BRAND EXPERIENCE<br />RECEPTION</span><Link href="/events/" target="_self">催事・展示のご利用について ↗</Link></div></div>
        <div className="xs-business-links"><div><p className="xs-micro">FOR ORGANISERS</p><h3>この場所で、ひらく。</h3><p>催事・展示のご相談は、共通フォームまたはInstagram DMへ。</p><Link href="/contact/" target="_self">イベント・展示のご相談 <span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer">Instagramで相談する ↗</a></div><div><p className="xs-micro">FOR VISITORS</p><h3>この景色に、会いに。</h3><p>催事・展示の開催時に開館します。開催日・時間をご確認のうえ、お越しください。</p><Link href="/visit/" target="_self">ご来館・アクセス <span>↗</span></Link><a href={IG_URL} target="_blank" rel="noopener noreferrer">公式Instagram・開催情報 ↗</a></div></div>
        <nav className="xs-next-studies" aria-label="ほかのプロトタイプを比較"><span>ANOTHER PERSPECTIVE</span>{STUDIES.filter(item => item.id !== variant).map(item => <Link target="_self" href={`/preview/${item.id}/`} key={item.id}>{item.no} / {item.title} <b>↗</b></Link>)}</nav>
        <footer className="xs-footer"><span>THE JEWELRY / CREATIVE STUDY {study.no}</span><Link href="/" target="_self">既存のTOPへ ↗</Link></footer>
      </section>
    </main>
    <div className="xs-motion-dock" aria-label="動きの確認パネル"><div className="xs-dock-label"><span>{study.no} / MOTION STUDY</span><output ref={progressText} aria-live="off">00%</output></div><label className="xs-progress-label"><span className="xs-sr">演出の進行位置</span><input ref={slider} type="range" min="0" max="100" defaultValue="0" disabled={reduced} onChange={event => { stop(); seek(Number(event.target.value) / 100); }} /></label><div className="xs-dock-actions"><button type="button" onClick={play} disabled={reduced} aria-pressed={playing}>{playing ? "Ⅱ 停止" : "▶ 自動で見る"}</button><button type="button" onClick={restart}>↺ 先頭へ</button><button type="button" onClick={() => { stop(); seek(0); setReduced(value => !value); }} aria-pressed={reduced} disabled={systemReduced}>動きを抑える</button></div></div>
  </div>;
}

function TypeScene() {
  const portal = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = portal.current!;
    const size = () => {
      const rect = svg.getBoundingClientRect();
      const height = 1440 * rect.height / Math.max(1, rect.width);
      svg.setAttribute("viewBox", `0 0 1440 ${height}`);
      svg.querySelector("mask")?.setAttribute("height", String(height));
      svg.querySelectorAll("rect, image").forEach(el => el.setAttribute("height", String(height)));
      const word = svg.querySelector("text");
      word?.setAttribute("y", String(height * .61));
      word?.setAttribute("font-size", String(Math.max(320, height * .33)));
      svg.style.setProperty("--portal-cy", `${height / 2}px`);
    };
    const observer = new ResizeObserver(size);
    observer.observe(svg); size();
    return () => observer.disconnect();
  }, []);
  return <>
    <svg ref={portal} className="xs-type-portal" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><mask id="xs-letter-window" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900"><rect width="1440" height="900" fill="black" /><g className="xs-type-mask"><text x="720" y="565" textAnchor="middle" textLength="1540" lengthAdjust="spacingAndGlyphs" fill="white" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="300">JEWELRY</text></g><rect className="xs-type-wash" width="1440" height="900" fill="white" /></mask></defs><image href={asset("/images/hero-night-1600.webp")} width="1440" height="900" preserveAspectRatio="xMidYMid slice" mask="url(#xs-letter-window)" /></svg>
    <div className="xs-type-start"><p className="xs-micro">NOT A WORD. A WAY IN.</p><h1 className="xs-sr">JEWELRY — 文字の内側から、大阪湾へ。</h1><p className="xs-type-sub">光は、内側にある。</p><span>SCROLL INTO THE LETTERS</span></div>
    <div className="xs-type-end"><p className="xs-micro">YOU ARE INSIDE THE JEWELRY.</p><h2>その向こうに、<br /><em>まだ見ぬ一日。</em></h2></div>
  </>;
}

function CinemaScene() {
  const offsets = [[-150, -8, -22], [95, 5, 12], [-220, -3, 0], [160, 8, -14], [-95, -6, 25]];
  return <>
    <div className="xs-cinema-title"><p className="xs-micro">AN ARCHITECTURE, REIMAGINED.</p><h1>UN<span>/</span><br />BUILT<span className="xs-period">.</span></h1><p>建築を、ほどく。<br />可能性を、組み上げる。</p></div>
    <div className="xs-cinema-frame" aria-hidden="true">{offsets.map(([y, angle, x], i) => <div className="xs-cinema-fragment" key={i} style={{ "--i": i, "--fy": `${y}px`, "--fr": `${angle}deg`, "--fx": `${x}px` } as React.CSSProperties}><img {...responsive(asset("/images/atelier-sail.jpg"))} alt="" fetchPriority={i === 0 ? "high" : "auto"} /></div>)}</div>
    <div className="xs-cinema-end"><p className="xs-micro">THE WHOLE IS MORE THAN THE PARTS.</p><h2>建築が、<br /><em>体験に変わる。</em></h2></div>
    <div className="xs-cinema-chapters" aria-hidden="true"><span>01 / FRAGMENTS</span><span>02 / ALIGNMENT</span><span>03 / A NEW SPACE</span></div>
  </>;
}

function EditorialScene() {
  return <>
    <div className="xs-editorial-paper" />
    <div className="xs-editorial-kicker"><p className="xs-micro">THE WATERFRONT EDITION</p><span>EXPRESSION / ENCOUNTER / OSAKA BAY</span></div>
    <div className="xs-editorial-secondary"><img {...responsive(asset("/images/atelier-sail-portrait.jpg"), "35vw")} alt="夕日の光に染まる帆とガラス建築" /><span>02 / A STUDY IN LIGHT</span></div>
    <div className="xs-editorial-primary"><img {...responsive(asset("/images/atelier-reception.jpg"))} alt="大阪湾に沈む夕日を望むレセプション空間" fetchPriority="high" /><span>01 / THE ART OF GATHERING</span></div>
    <h1 className="xs-editorial-title"><span>Make</span><span>a <em>scene.</em></span></h1>
    <div className="xs-editorial-start"><p>その一日を、<br />忘れられない余韻へ。</p><span>NOT JUST A PLACE.<br />A DIFFERENT POINT OF VIEW.</span></div>
    <span className="xs-editorial-side" aria-hidden="true">THE JEWELRY / EDITION 2026</span>
    <div className="xs-editorial-end"><p className="xs-micro">THE EVERYDAY, LEFT BEHIND.</p><h2>The bay.<br /><em>All yours.</em></h2><p>ここから、あなたの世界をひらく。</p></div>
  </>;
}

