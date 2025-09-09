// src/components/sections/HeroSection.tsx
import { ArrowDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import bayouLogo from "@/assets/bayou-logo.png";

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// --- Tuning ---
const VIDEO_SRC = "/media/video/Lobby_Video_1080p_24fps.mp4";

// Blur geometry (bigger circle halo)
const LOGO_EXTRA_RADIUS = 120; // how far blur extends past logo (px) — increased
const TEXT_PAD_X = 40;         // pill padding X (px)
const TEXT_PAD_Y = 20;         // pill padding Y (px)

// Stronger, steadier glass blur (helps reduce shimmer on video motion)
const LOGO_BLUR = 40;          // px blur at logo center — increased
const TEXT_BLUR = 28;          // px blur at text center
const GLASS_TINT = "rgba(55,55,55,0.05)"; // soft dark glass

// Snap constants
const DUR_DOWN = 900, DUR_UP = 1100;
const SJ_DOWN = 1.0, SJ_UP = 1.0;
const EJ_DOWN = 0.08, EJ_UP = 0.06;
const DELTA = 0.25, UP_ZONE = 120, COOL = 300;

// Header blend
const CTA_G = { r: 139, g: 163, b: 140 };
const CTA_D = { r: 77,  g: 90,  b: 63  };
const INK_W = { r: 255, g: 255, b: 255 };
const INK_D = { r: 77,  g: 90,  b: 63  };

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const [p, setP] = useState(0);
  const [edge, setEdge] = useState(0);
  const [parY, setParY] = useState(0);
  const [snapEnabled, setSnapEnabled] = useState(true);

  // snapping internals
  const snapping = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const coolUntil = useRef(0);
  const lastDir = useRef<"down" | "up" | null>(null);
  const lockRefs = useRef<{ wheel?: any; touchmove?: any; keydown?: any }>({});

  // css var helper
  const setVar = (name: string, value: string | number) => {
    if (heroRef.current) (heroRef.current.style as any).setProperty(name, String(value));
  };

  // Disable snap on mobile
  useEffect(() => {
    const isMobile =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setSnapEnabled(!isMobile);
  }, []);

  // Place masks (logo circle + text pill) using live DOM geometry
  useLayoutEffect(() => {
    const updateMask = () => {
      const hero = heroRef.current;
      const logoEl = logoWrapRef.current;
      const titleEl = titleRef.current;
      if (!hero || !logoEl || !titleEl) return;

      const heroRect = hero.getBoundingClientRect();

      // Logo
      const lr = logoEl.getBoundingClientRect();
      const logoX = lr.left - heroRect.left + lr.width / 2;
      const logoY = lr.top  - heroRect.top  + lr.height / 2;
      const logoR = Math.max(lr.width, lr.height) / 2 + LOGO_EXTRA_RADIUS;
      setVar("--logo-x", `${logoX}px`);
      setVar("--logo-y", `${logoY}px`);
      setVar("--logo-rx", `${logoR}px`);
      setVar("--logo-ry", `${logoR}px`);

      // Text pill
      const tr = titleEl.getBoundingClientRect();
      const textX = tr.left - heroRect.left + tr.width / 2;
      const textY = tr.top  - heroRect.top  + tr.height / 2;
      const rx = tr.width / 2 + TEXT_PAD_X;
      const ry = tr.height / 2 + TEXT_PAD_Y;
      setVar("--text-x", `${textX}px`);
      setVar("--text-y", `${textY}px`);
      setVar("--text-rx", `${rx}px`);
      setVar("--text-ry", `${ry}px`);
    };

    updateMask();
    const ro = new ResizeObserver(updateMask);
    if (heroRef.current) ro.observe(heroRef.current);
    if (logoWrapRef.current) ro.observe(logoWrapRef.current);
    if (titleRef.current) ro.observe(titleRef.current);
    window.addEventListener("scroll", updateMask, { passive: true });
    window.addEventListener("resize", updateMask, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateMask as any);
      window.removeEventListener("resize", updateMask as any);
    };
  }, []);

  // Parallax + header color blend
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const top = heroRef.current?.offsetTop ?? 0;
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      const y = Math.max(0, window.scrollY - top);
      const k = Math.max(0, Math.min(1, y / h));
      setP(k); setEdge(Math.max(0, Math.min(1, y / 220))); setParY(y * 0.22);

      const header = document.querySelector("header") as HTMLElement | null;
      if (header) {
        const t = ease(k);
        const rC = Math.round(CTA_G.r + (CTA_D.r - CTA_G.r) * t);
        const gC = Math.round(CTA_G.g + (CTA_D.g - CTA_G.g) * t);
        const bC = Math.round(CTA_G.b + (CTA_D.b - CTA_G.b) * t);
        header.style.setProperty("--cta-bg-rgb", `${rC}, ${gC}, ${bC}`);
        const rI = Math.round(INK_W.r + (INK_D.r - INK_W.r) * t);
        const gI = Math.round(INK_W.g + (INK_D.g - INK_W.g) * t);
        const bI = Math.round(INK_W.b + (INK_D.b - INK_W.b) * t);
        header.style.setProperty("--header-ink", `rgb(${rI}, ${gI}, ${bI})`);
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll as any);
    };
  }, []);

  // ===== Snap scrolling handlers (animation) =====
  const headerH = () =>
    (document.querySelector("header") as HTMLElement)?.offsetHeight || 0;

  const aboutTop = () => {
    const about = document.getElementById("about");
    return Math.max(0, (about?.offsetTop ?? 0) - headerH());
  };
  const inHero = () => window.scrollY < aboutTop() - 1;
  const inUpZone = () => { const y = window.scrollY, t = aboutTop(); return y >= t && y <= t + UP_ZONE; };

  const lock = () => {
    const wheel = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const touchmove = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const keydown = (e: KeyboardEvent) => {
      if (["ArrowDown","ArrowUp","PageDown","PageUp","Space","Home","End"].includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
      }
    };
    lockRefs.current = { wheel, touchmove, keydown };
    document.addEventListener("wheel", wheel, { passive: false, capture: true });
    document.addEventListener("touchmove", touchmove, { passive: false, capture: true });
    document.addEventListener("keydown", keydown, { passive: false, capture: true });
  };
  const unlock = () => {
    const { wheel, touchmove, keydown } = lockRefs.current;
    if (wheel) document.removeEventListener("wheel", wheel, { capture: true } as any);
    if (touchmove) document.removeEventListener("touchmove", touchmove, { capture: true } as any);
    if (keydown) document.removeEventListener("keydown", keydown, { capture: true } as any);
    lockRefs.current = {};
  };

  const snapTo = (targetY: number, dir: "down" | "up") => {
    if (!snapEnabled || snapping.current) return;
    snapping.current = true; lock();
    const startY = window.scrollY, total = targetY - startY;
    const sj = dir === "down" ? SJ_DOWN : SJ_UP, ej = dir === "down" ? EJ_DOWN : EJ_UP;
    const _sj = Math.max(0, Math.min(1, sj)), _ej = Math.max(0, Math.min(1 - _sj, ej));
    const frac = Math.max(0, 1 - _sj - _ej);
    const jumpStart = startY + total * _sj; if (_sj > 0) window.scrollTo(0, jumpStart);
    const finish = () => {
      if (_ej > 0) window.scrollTo(0, targetY);
      snapping.current = false; unlock();
      window.dispatchEvent(new CustomEvent("heroSnapFinished", { detail: { dir } }));
      lastDir.current = dir;
      coolUntil.current = performance.now() + COOL;
    };
    if (frac <= 0) return requestAnimationFrame(finish);
    const animStartY = jumpStart, dist = total * frac, t0 = performance.now(), dur = dir === "down" ? DUR_DOWN : DUR_UP;
    const step = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      window.scrollTo(0, animStartY + dist * ease(t));
      t < 1 ? requestAnimationFrame(step) : finish();
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!snapEnabled) return;
    const onWheel = (e: WheelEvent) => {
      if (snapping.current) { e.preventDefault(); return; }
      const now = performance.now();
      if (inHero()) {
        e.preventDefault();
        if (now < coolUntil.current || Math.abs(e.deltaY) < DELTA) return;
        snapTo(e.deltaY > 0 ? aboutTop() : 0, e.deltaY > 0 ? "down" : "up");
        return;
      }
      if (inUpZone() && e.deltaY < -DELTA) {
        e.preventDefault();
        if (now < coolUntil.current && lastDir.current === "down") return;
        snapTo(0, "up");
      }
    };
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (snapping.current) { e.preventDefault(); return; }
      const now = performance.now();
      const s = touchStartY.current; if (s == null) return;
      const dy = s - e.touches[0].clientY;
      if (inHero()) {
        e.preventDefault();
        if (now < coolUntil.current || Math.abs(dy) < 1) return;
        snapTo(dy > 0 ? aboutTop() : 0, dy > 0 ? "down" : "up");
        return;
      }
      if (inUpZone() && dy < -1) {
        e.preventDefault();
        if (now < coolUntil.current && lastDir.current === "down") return;
        snapTo(0, "up");
      }
    };

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      document.removeEventListener("wheel", onWheel as any, { capture: true } as any);
      document.removeEventListener("touchstart", onTouchStart as any, { capture: true } as any);
      document.removeEventListener("touchmove", onTouchMove as any, { capture: true } as any);
      unlock();
    };
  }, [snapEnabled]);

  // Hero transforms
  const heroOpacity = 1 - p;
  const logoScale = 1 - 0.28 * p;
  const logoY = 12 + 160 * p;
  const titleY = 18 + 200 * p;
  const arrowOpacity = 1 - p;

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative isolate min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: heroOpacity, pointerEvents: p > 0.98 ? "none" : "auto", transition: "opacity 140ms linear" }}
    >
      {/* Background video w/ parallax */}
      <video
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ transform: `translateY(${parY}px)` }}
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* ===== Full-screen blur layers masked to shapes (glassy & smooth) ===== */}
      {/* Logo circle (bigger radius, stronger blur, faint tint to reduce shimmer) */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          backdropFilter: `blur(${LOGO_BLUR}px)`,
          WebkitBackdropFilter: `blur(${LOGO_BLUR}px)`,
          background: GLASS_TINT,
          WebkitMaskImage: `radial-gradient(
            ellipse var(--logo-rx) var(--logo-ry) at var(--logo-x) var(--logo-y),
            rgba(0,0,0,0.70) 0%,
            rgba(0,0,0,0.68) 58%,
            rgba(0,0,0,0.35) 80%,
            rgba(0,0,0,0.00) 100%
          )`,
          maskImage: `radial-gradient(
            ellipse var(--logo-rx) var(--logo-ry) at var(--logo-x) var(--logo-y),
            rgba(0,0,0,0.70) 0%,
            rgba(0,0,0,0.68) 58%,
            rgba(0,0,0,0.35) 80%,
            rgba(0,0,0,0.00) 100%
          )`,
        } as React.CSSProperties}
      />

      {/* Headline pill (matching glassy feel) */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
  backdropFilter: `blur(${TEXT_BLUR}px) saturate(1.08) contrast(1.04) brightness(0.96)`,
  WebkitBackdropFilter: `blur(${TEXT_BLUR}px) saturate(1.08) contrast(1.04) brightness(0.96)`,
  background: "rgba(0,0,0,0.10)", // a bit lighter than the logo area
  WebkitMaskImage: `radial-gradient(
    ellipse var(--text-rx) var(--text-ry) at var(--text-x) var(--text-y),
    rgba(0,0,0,0.70) 0%,
    rgba(0,0,0,0.68) 58%,
    rgba(0,0,0,0.35) 84%,  /* was 80% */
    rgba(0,0,0,0.00) 100%
  )`,
  maskImage: `radial-gradient(
    ellipse var(--text-rx) var(--text-ry) at var(--text-x) var(--text-y),
    rgba(0,0,0,0.70) 0%,
    rgba(0,0,0,0.68) 58%,
    rgba(0,0,0,0.35) 84%,
    rgba(0,0,0,0.00) 100%
  )`,
} as React.CSSProperties}

      />
      {/* =================================================================== */}

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <div
          ref={logoWrapRef}
          className="mb-8 sm:mb-10 will-change-transform"
          style={{ transform: `translateY(${logoY}px) scale(${logoScale})`, transition: "transform 100ms linear" }}
        >
          <img
            src={bayouLogo}
            alt="Bayou Hospitality"
            className="w-64 sm:w-72 md:w-80 lg:w-[28rem] h-auto object-contain"
            style={{
  filter: [
    "drop-shadow(0 0 0.6px rgba(255, 255, 255, 0.18))", // thin light edge
    "drop-shadow(0 0 1.2px rgba(0,0,0,0.35))",      // soft dark halo
    "drop-shadow(0 8px 16px rgba(0,0,0,0.28))"      // depth
  ].join(" "),
}}

            loading="eager"
            decoding="async"
          />
        </div>

        <h1
          ref={titleRef}
          className="relative z-10 font-serif text-3xl tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg px-6 py-2"
          style={{
  transform: `translateY(${titleY}px)`,
  transition: "transform 100ms linear",
  textShadow: "0 1px 2px rgba(0,0,0,0.45), 0 2px 12px rgba(0,0,0,0.28)"
}}

        >
          WELCOME TO BAYOU HOSPITALITY
        </h1>
      </div>

      {/* Arrow */}
      <div
        className="pointer-events-auto absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-150"
        style={{ opacity: Math.max(0, arrowOpacity) }}
      >
        <a
          href="#about"
          onClick={(e) => { if (snapEnabled) { e.preventDefault(); if (!snapping.current) snapTo(aboutTop(), "down"); } }}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md transition hover:border-white/60 hover:bg-black/40"
          aria-label="Scroll down"
        >
          <span className="relative top-[2px]"><ArrowDown size={28} className="text-white opacity-90 animate-bounce" /></span>
        </a>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none hero-white-fade will-change-opacity"
        style={{ height: "clamp(160px, 24vh, 340px)", opacity: Math.max(edge, p * 0.6), transition: "opacity 140ms linear" }}
      />
    </section>
  );
}
