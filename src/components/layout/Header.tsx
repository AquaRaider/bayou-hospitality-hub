// src/components/layout/Header.tsx
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type HeaderProps = {
  /** Set true on pages without the Hero (e.g., Blog) */
  disableHeroReactivity?: boolean;
  /** Force colors regardless of hero position */
  forceColors?: {
    hospitality?: "lightBlue" | "white" | "darkGreen";
    newsletter?: "darkGreen" | "white";
  };
  /** 'frosted' (main page) or 'solid' (blog) */
  background?: "frosted" | "solid";
};

export default function Header({
  disableHeroReactivity = false,
  forceColors,
  background = "frosted",
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(false);
  const [isInHero, setIsInHero] = useState(true);

  // Mobile-only dropdown for nav
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const arrowTouchStart = useRef<number | null>(null);

  // ---------------------------
  // Tuning knobs
  // ---------------------------
  const DOWN_EARLY_PX = 16;
  const UP_EARLY_PX = 120;
  const HOLD_UP_MS = 10;

  // HOSPITALITY
  const TRANSITION_TO_WHITE_MS_HOSP = 1200;
  const TRANSITION_TO_BLUE_MS_HOSP = 1200;

  // NEWSLETTER
  const TRANSITION_TO_WHITE_MS_CTA = 1200;
  const TRANSITION_TO_DARK_MS_CTA = 1600;

  // Width match
  const WIDTH_MATCH_TWEAK = 0.985;
  const WIDTH_FUDGE_PX = 0;

  // Refs/state
  const prevYRef = useRef(0);
  const heroBottomRef = useRef(0);
  const isInHeroRef = useRef(true);
  const holdUpTimer = useRef<number | null>(null);

  const [hospTransitionMs, setHospTransitionMs] = useState<number>(
    TRANSITION_TO_BLUE_MS_HOSP
  );
  const [ctaTransitionMs, setCtaTransitionMs] = useState<number>(
    TRANSITION_TO_DARK_MS_CTA
  );

  const bayouRef = useRef<HTMLSpanElement | null>(null);
  const hospRef = useRef<HTMLSpanElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [hospScale, setHospScale] = useState<number>(1);

  const headerH = () =>
    (document.querySelector("header") as HTMLElement)?.offsetHeight || 0;

  const computeHeroBottom = () => {
    const hero = document.getElementById("home");
    const top = hero?.offsetTop ?? 0;
    const h = hero?.offsetHeight || window.innerHeight;
    heroBottomRef.current = top + h - headerH();
  };

  // --- Width matching (shared helper) ---
  const measureAndMatchWidths = () => {
    const bay = bayouRef.current;
    const hos = hospRef.current;
    if (!bay || !hos) return;

    const prevTransform = hos.style.transform;
    hos.style.transform = "none";
    const bayW = bay.getBoundingClientRect().width;
    const hospW = hos.getBoundingClientRect().width;
    hos.style.transform = prevTransform;

    if (bayW > 0 && hospW > 0) {
      const adjustedBayW = Math.max(0, bayW - WIDTH_FUDGE_PX);
      const target = (adjustedBayW / hospW) * WIDTH_MATCH_TWEAK;
      const clamped = Math.max(0.75, Math.min(target, 2.0));
      setHospScale(clamped);
    }
  };

  const cancelWhiteFlip = () => {
    if (holdUpTimer.current) {
      window.clearTimeout(holdUpTimer.current);
      holdUpTimer.current = null;
    }
  };

  const scheduleWhiteFlip = () => {
    cancelWhiteFlip();
    holdUpTimer.current = window.setTimeout(() => {
      setHospTransitionMs(TRANSITION_TO_WHITE_MS_HOSP);
      setCtaTransitionMs(TRANSITION_TO_WHITE_MS_CTA);
      requestAnimationFrame(() => {
        isInHeroRef.current = true;
        setIsInHero(true);
        holdUpTimer.current = null;
      });
    }, HOLD_UP_MS);
  };

  // Hero reactivity (skip in static mode like Blog)
  useEffect(() => {
    if (disableHeroReactivity) {
      setIsInHero(false);
      setScrolled(window.scrollY > 4);
      return;
    }

    computeHeroBottom();
    prevYRef.current = window.scrollY;

    const initialInHero = window.scrollY <= heroBottomRef.current;
    isInHeroRef.current = initialInHero;
    setIsInHero(initialInHero);
    setScrolled(window.scrollY > 4);

    const onScroll = () => {
      const y1 = window.scrollY;
      const down = y1 > prevYRef.current;
      const boundary =
        heroBottomRef.current + (down ? -DOWN_EARLY_PX : UP_EARLY_PX);
      const inHeroNow = y1 <= boundary;

      if (inHeroNow !== isInHeroRef.current) {
        if (inHeroNow) {
          scheduleWhiteFlip();
        } else {
          cancelWhiteFlip();
          setHospTransitionMs(TRANSITION_TO_BLUE_MS_HOSP);
          setCtaTransitionMs(TRANSITION_TO_DARK_MS_CTA);
          requestAnimationFrame(() => {
            isInHeroRef.current = false;
            setIsInHero(false);
          });
        }
      }
      const s = y1 > 4;
      setScrolled((prev) => (prev !== s ? s : prev));
      prevYRef.current = y1;
    };

    const onResize = () => {
      computeHeroBottom();
      measureAndMatchWidths();
      onScroll();
    };

    const onHeroSnapFinished = (e: Event) => {
      const ev = e as CustomEvent<{ dir: "down" | "up" }>;
      if (ev.detail?.dir === "down") {
        cancelWhiteFlip();
        setHospTransitionMs(TRANSITION_TO_BLUE_MS_HOSP);
        setCtaTransitionMs(TRANSITION_TO_DARK_MS_CTA);
        requestAnimationFrame(() => {
          isInHeroRef.current = false;
          setIsInHero(false);
        });
      } else if (ev.detail?.dir === "up") {
        scheduleWhiteFlip();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    window.addEventListener("heroSnapFinished", onHeroSnapFinished as any);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize as any);
      window.removeEventListener("orientationchange", onResize as any);
      window.removeEventListener("heroSnapFinished", onHeroSnapFinished as any);
      cancelWhiteFlip();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableHeroReactivity]);

  // Width match (always on)
  useEffect(() => {
    const afterFonts = () => {
      measureAndMatchWidths();
      if ("ResizeObserver" in window) {
        roRef.current?.disconnect();
        roRef.current = new ResizeObserver(() => measureAndMatchWidths());
        if (bayouRef.current) roRef.current.observe(bayouRef.current);
        if (hospRef.current) roRef.current.observe(hospRef.current);
      }
    };
    // @ts-ignore
    if ((document as any).fonts?.ready) {
      // @ts-ignore
      (document as any).fonts.ready.then(afterFonts);
    } else {
      setTimeout(afterFonts, 0);
      window.addEventListener("load", afterFonts, { once: true });
    }
    return () => roRef.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BLOG mobile: nudge blog "Menu" button when header dropdown opens
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return; // mobile only
    const btn = document.querySelector(
      'button[aria-label="Open blog menu"]'
    ) as HTMLElement | null;
    if (btn) {
      btn.style.transition = "transform 300ms ease";
      btn.style.transform = mobileNavOpen ? "translateY(44px)" : "translateY(0)";
    }
  }, [mobileNavOpen]);

  // CTA background (frosted)
  const baseAlpha = 0.45;
  const hoverAlpha = 0.65;
  const alpha = hover ? hoverAlpha : baseAlpha;

  // Color selection (forced > reactive)
  const hospForcedClass =
    forceColors?.hospitality === "lightBlue"
      ? "text-[#7ba5a4]"
      : forceColors?.hospitality === "darkGreen"
      ? "text-[#4d5a3f]"
      : forceColors?.hospitality === "white"
      ? "text-white"
      : null;

  const ctaForcedClass =
    forceColors?.newsletter === "darkGreen"
      ? "text-[#4d5a3f]"
      : forceColors?.newsletter === "white"
      ? "text-white"
      : null;

  const hospClass =
    hospForcedClass ?? (isInHero ? "text-white" : "text-[#7ba5a4]");
  const ctaTextClass =
    ctaForcedClass ?? (isInHero ? "text-white" : "text-[#4d5a3f]");

  const containerClasses = [
    "fixed inset-x-0 top-0 z-50",
    "h-[88px]",
    "transition-[border-color,box-shadow,background-color] duration-300",
    background === "frosted" ? "backdrop-blur-xl" : "bg-white",
    background === "frosted"
      ? scrolled
        ? "border-b border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
        : "border-b border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      : "border-b border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)]",
  ].join(" ");

  // Mobile arrow: tap or swipe down to open
  const onArrowTouchStart = (e: React.TouchEvent) => {
    arrowTouchStart.current = e.touches[0].clientY;
  };
  const onArrowTouchMove = (e: React.TouchEvent) => {
    const s = arrowTouchStart.current;
    if (s == null) return;
    const dy = e.touches[0].clientY - s;
    if (dy > 18 && !mobileNavOpen) {
      setMobileNavOpen(true);
      arrowTouchStart.current = null;
    }
  };

  return (
    <>
      <header
        className={containerClasses}
        style={
          background === "frosted"
            ? {
                backgroundColor: "transparent",
                WebkitBackdropFilter: "blur(24px)",
                backdropFilter: "blur(24px)",
              }
            : undefined
        }
      >
        <div
          className={[
            "mx-auto flex h-full max-w-7xl items-center justify-between",
            "px-3 sm:px-4",
          ].join(" ")}
          style={{
            paddingLeft: "calc(env(safe-area-inset-left, 0px) + 0.75rem)",
          }}
        >
          {/* Brand */}
          <a
            href="/#home"
            className={[
              "flex flex-col items-center leading-tight transition-colors duration-300",
              "ml-2 sm:ml-0",
            ].join(" ")}
            style={{ color: "var(--header-ink, #ffffff)" }}
          >
            <span
              ref={bayouRef}
              className="font-serif text-4xl sm:text-4xl md:text-5xl"
            >
              BAYOU
            </span>

            <span
              ref={hospRef}
              className={[
                "font-sans uppercase inline-block",
                "relative -top-[2px]",
                "text-[0.9rem] sm:text-[0.98rem]",
                "tracking-[0.055em]",
                "transition-colors ease-in-out will-change-transform",
                hospClass,
              ].join(" ")}
              style={{
                transitionProperty: "color",
                transitionDuration: `${hospTransitionMs}ms`,
                transform: `translateZ(0) scaleX(${hospScale})`,
                transformOrigin: "center",
              }}
            >
              HOSPITALITY
            </span>
          </a>

          {/* Center arrow – mobile only */}
          <button
            type="button"
            className={[
              "md:hidden absolute left-1/2 -translate-x-1/2",
              "top-[44px] -translate-y-1/2",
              "rounded-full p-1 transition",
              mobileNavOpen ? "opacity-80 rotate-180" : "opacity-90 rotate-0",
            ].join(" ")}
            aria-label="Toggle navigation"
            onClick={() => setMobileNavOpen((v) => !v)}
            onTouchStart={onArrowTouchStart}
            onTouchMove={onArrowTouchMove}
          >
            <ChevronDown
              size={22}
              className={background === "solid" ? "text-[#4d5a3f]" : "text-white"}
            />
          </button>

          {/* Nav (desktop) */}
          <nav className="hidden items-center gap-10 md:flex">
            <HeaderLink href="/#home">Home</HeaderLink>
            <HeaderLink href="/#about">About</HeaderLink>
            <HeaderLink href="/#restaurants">Restaurants</HeaderLink>
            <HeaderLink href="/blog">Blog</HeaderLink>
            <HeaderLink href="/#contact">Contact</HeaderLink>
          </nav>

          {/* CTA */}
          <a
            href="/#newsletter"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={[
              "rounded-xl",
              "px-3 py-1.5 text-sm",
              "md:px-5 md:py-2.5 md:text-lg",
              "backdrop-blur-md bg-clip-padding",
              "border border-white/30 hover:border-white/40",
              "shadow-sm transition-transform duration-200 hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-white/40",
            ].join(" ")}
            style={{
              backgroundColor: `rgba(var(--cta-bg-rgb, 139, 163, 140), ${alpha})`,
            }}
          >
            <span
              className={["font-serif transition-colors ease-in-out", "text-sm md:text-lg", ctaTextClass].join(
                " "
              )}
              style={{
                transitionProperty: "color",
                transitionDuration: `${ctaTransitionMs}ms`,
              }}
            >
              NEWSLETTER
            </span>
          </a>
        </div>
      </header>

      {/* Mobile dropdown panel (reveals below header). Desktop unaffected. */}
      <div
        className={[
          "md:hidden fixed inset-x-0 z-40",
          "transition-all duration-300",
          mobileNavOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2",
        ].join(" ")}
        style={{
          top: 88, // header height
        }}
      >
        <div
          className={[
            "mx-auto max-w-7xl px-4",
            background === "solid" ? "bg-white" : "backdrop-blur-xl bg-white/5",
            "border-b border-black/10 shadow-sm",
          ].join(" ")}
        >
          <nav className="flex items-center justify-between py-3">
            {/* NOTE: Use absolute URLs so links work even from the Blog page */}
            <a href="/#home" className="font-sans text-[15px] hover:underline underline-offset-8 decoration-2 text-[#4d5a3f]">Home</a>
            <a href="/#about" className="font-sans text-[15px] hover:underline underline-offset-8 decoration-2 text-[#4d5a3f]">About</a>
            <a href="/#restaurants" className="font-sans text-[15px] hover:underline underline-offset-8 decoration-2 text-[#4d5a3f]">Restaurants</a>
            <a href="/blog" className="font-sans text-[15px] hover:underline underline-offset-8 decoration-2 text-[#4d5a3f]">Blog</a>
            <a href="/#contact" className="font-sans text-[15px] hover:underline underline-offset-8 decoration-2 text-[#4d5a3f]">Contact</a>
          </nav>
        </div>
      </div>
    </>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={[
        "font-sans text-lg font-medium",
        "transition-all duration-200 ease-out",
        "hover:underline underline-offset-8 decoration-2",
        "origin-bottom hover:scale-105",
        "hover:opacity-100",
        "focus-visible:underline focus-visible:outline-none",
      ].join(" ")}
      style={{ color: "var(--header-ink, #ffffff)" }}
    >
      {children}
    </a>
  );
}
