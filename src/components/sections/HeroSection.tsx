// src/components/sections/HeroSection.tsx
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/assets/hero-food.jpg";
import bayouLogo from "@/assets/bayou-logo.png";

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Snap tuning
const DUR_DOWN = 900, DUR_UP = 1100;
const SJ_DOWN = 1.0, SJ_UP = 1.0;    // start jump fraction
const EJ_DOWN = 0.08, EJ_UP = 0.06;  // end jump fraction
const DELTA = 0.25, UP_ZONE = 120, COOL = 300;

// Header color blend anchors
const CTA_G = { r: 139, g: 163, b: 140 }; // #8ba38c
const CTA_D = { r: 77,  g: 90,  b: 63  }; // #4d5a3f
const INK_W = { r: 255, g: 255, b: 255 };
const INK_D = { r: 77,  g: 90,  b: 63  }; // Dark Green

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);

  // parallax/progress
  const [p, setP] = useState(0);
  const [edge, setEdge] = useState(0);
  const [parY, setParY] = useState(0);

  // snap state
  const snapping = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const coolUntil = useRef(0);
  const lastDir = useRef<"down" | "up" | null>(null);
  const lockRefs = useRef<{ wheel?: any; touchmove?: any; keydown?: any }>({});

  // Layout helpers
  const headerH = () => (document.querySelector("header") as HTMLElement)?.offsetHeight || 0;
  const aboutTop = () => {
    const about = document.getElementById("about");
    return Math.max(0, (about?.offsetTop ?? 0) - headerH());
  };
  const inHero = () => window.scrollY < aboutTop() - 1;
  const inUpZone = () => {
    const y = window.scrollY, t = aboutTop();
    return y >= t && y <= t + UP_ZONE;
  };

  // Input lock during snap
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

  // Original snapper (no extra fallbacks/booleans)
  const snapTo = (targetY: number, dir: "down" | "up") => {
    if (snapping.current) return;
    snapping.current = true;
    lock();

    const startY = window.scrollY;
    const total = targetY - startY;

    const sj = dir === "down" ? SJ_DOWN : SJ_UP;
    const ej = dir === "down" ? EJ_DOWN : EJ_UP;

    const _sj = Math.max(0, Math.min(1, sj));
    const _ej = Math.max(0, Math.min(1 - _sj, ej));
    const frac = Math.max(0, 1 - _sj - _ej);

    const jumpStart = startY + total * _sj;
    if (_sj > 0) window.scrollTo(0, jumpStart);

    const finish = () => {
      if (_ej > 0) window.scrollTo(0, targetY);
      snapping.current = false;
      unlock();
      lastDir.current = dir;
      coolUntil.current = performance.now() + COOL;
    };

    if (frac <= 0) {
      requestAnimationFrame(finish);
      return;
    }

    const animStartY = jumpStart;
    const dist = total * frac;
    const t0 = performance.now();
    const dur = dir === "down" ? DUR_DOWN : DUR_UP;

    const step = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      window.scrollTo(0, animStartY + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else finish();
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    let ticking = false;

    // Parallax & header color blend
    const update = () => {
      const top = heroRef.current?.offsetTop ?? 0;
      const h = heroRef.current?.offsetHeight ?? window.innerHeight;
      const y = Math.max(0, window.scrollY - top);
      const k = Math.max(0, Math.min(1, y / h));

      setP(k);
      setEdge(Math.max(0, Math.min(1, y / 220)));
      setParY(y * 0.22);

      // Blend header colors/ink based on progress
      const header = document.querySelector("header") as HTMLElement | null;
      if (header) {
        const t = ease(k);
        // CTA background (#8ba38c → #4d5a3f)
        const rC = Math.round(CTA_G.r + (CTA_D.r - CTA_G.r) * t);
        const gC = Math.round(CTA_G.g + (CTA_D.g - CTA_G.g) * t);
        const bC = Math.round(CTA_G.b + (CTA_D.b - CTA_G.b) * t);
        header.style.setProperty("--cta-bg-rgb", `${rC}, ${gC}, ${bC}`);

        // Header ink (white → dark green)
        const rI = Math.round(INK_W.r + (INK_D.r - INK_W.r) * t);
        const gI = Math.round(INK_W.g + (INK_D.g - INK_W.g) * t);
        const bI = Math.round(INK_W.b + (INK_D.b - INK_W.b) * t);
        header.style.setProperty("--header-ink", `rgb(${rI}, ${gI}, ${bI})`);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Wheel snap logic
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

    // Touch snap logic
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll as any);
      document.removeEventListener("wheel", onWheel as any, { capture: true } as any);
      document.removeEventListener("touchstart", onTouchStart as any, { capture: true } as any);
      document.removeEventListener("touchmove", onTouchMove as any, { capture: true } as any);
      unlock();
    };
  }, []);

  // Derived view transforms
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
      style={{
        opacity: heroOpacity,
        pointerEvents: p > 0.98 ? "none" : "auto",
        transition: "opacity 140ms linear",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${heroImage})`, transform: `translateY(${parY}px)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        <div
          className="mb-8 sm:mb-10 will-change-transform"
          style={{ transform: `translateY(${logoY}px) scale(${logoScale})`, transition: "transform 100ms linear" }}
        >
          <img
            src={bayouLogo}
            alt="Bayou Hospitality"
            className="w-64 sm:w-72 md:w-80 lg:w-[28rem] h-auto object-contain"
            style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.55))" }}
            loading="eager"
            decoding="async"
          />
        </div>

        <h1
          className="font-serif text-3xl tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl will-change-transform drop-shadow-lg"
          style={{ transform: `translateY(${titleY}px)`, transition: "transform 100ms linear" }}
        >
          WELCOME TO BAYOU HOSPITALITY
        </h1>
      </div>

      {/* Arrow to snap down (original behavior) */}
      <div
        className="pointer-events-auto absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-150"
        style={{ opacity: Math.max(0, arrowOpacity) }}
      >
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            if (!snapping.current) snapTo(aboutTop(), "down");
          }}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md transition hover:border-white/60 hover:bg-black/40"
          aria-label="Scroll down"
        >
          <span className="relative top-[2px]">
            <ArrowDown size={28} className="text-white opacity-90 animate-bounce" />
          </span>
        </a>
      </div>

      {/* White fade at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none hero-white-fade will-change-opacity"
        style={{ height: "clamp(160px, 24vh, 340px)", opacity: Math.max(edge, p * 0.6), transition: "opacity 140ms linear" }}
      />
    </section>
  );
}
