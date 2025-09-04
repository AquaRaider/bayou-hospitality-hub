import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(false);
  const [isInHero, setIsInHero] = useState(true);

  // ---------------------------
  // Tuning knobs
  // ---------------------------
  const DOWN_EARLY_PX = 16;   // flip to Light Blue / Dark Green just before fully leaving Hero
  const UP_EARLY_PX   = 120;  // flip back earlier when coming up toward Hero
  const HOLD_UP_MS    = 10;   // delay before turning WHITE (on the way up)

  // Per-text transition lengths
  // HOSPITALITY (Light Blue <-> White)
  const TRANSITION_TO_WHITE_MS_HOSP = 1200; // Light Blue -> White (returning to Hero)
  const TRANSITION_TO_BLUE_MS_HOSP  = 1200; // White -> Light Blue (leaving Hero)

  // NEWSLETTER (Dark Green <-> White)
  const TRANSITION_TO_WHITE_MS_CTA = 1200; // Dark Green -> White (returning to Hero)
  const TRANSITION_TO_DARK_MS_CTA  = 1200; // White -> Dark Green (leaving Hero)

  // ====== NEW: width-matching calibration ======
  // Slightly shrink HOSPITALITY relative to the computed match.
  const WIDTH_MATCH_TWEAK = 0.96; // try 0.98 if still a hair too large, or 1.0 for exact
  const WIDTH_FUDGE_PX    = 0;     // subtract N pixels from BAYOU width before matching (try 1)

  // Internal refs/state
  const prevYRef = useRef(0);
  const heroBottomRef = useRef(0);
  const isInHeroRef = useRef(true);
  const holdUpTimer = useRef<number | null>(null);

  // Active transition durations used by the spans
  const [hospTransitionMs, setHospTransitionMs] = useState<number>(TRANSITION_TO_BLUE_MS_HOSP);
  const [ctaTransitionMs,  setCtaTransitionMs]  = useState<number>(TRANSITION_TO_DARK_MS_CTA);

  // Width-matching
  const bayouRef = useRef<HTMLSpanElement | null>(null);
  const hospRef  = useRef<HTMLSpanElement | null>(null);
  const roRef    = useRef<ResizeObserver | null>(null);
  const [hospScale, setHospScale] = useState<number>(1);

  const measureAndMatchWidths = () => {
    const bay = bayouRef.current;
    const hos = hospRef.current;
    if (!bay || !hos) return;

    // Temporarily remove transform to measure intrinsic width
    const prevTransform = hos.style.transform;
    hos.style.transform = "none";

    const bayW  = bay.getBoundingClientRect().width;
    const hospW = hos.getBoundingClientRect().width;

    // Restore previous transform (React will re-apply anyway)
    hos.style.transform = prevTransform;

    if (bayW > 0 && hospW > 0) {
      const adjustedBayW = Math.max(0, bayW - WIDTH_FUDGE_PX);
      const target = (adjustedBayW / hospW) * WIDTH_MATCH_TWEAK;
      const clamped = Math.max(0.75, Math.min(target, 2.0));
      setHospScale(clamped);
    }
  };

  const headerH = () =>
    (document.querySelector("header") as HTMLElement)?.offsetHeight || 0;

  const computeHeroBottom = () => {
    const hero = document.getElementById("home");
    const top = hero?.offsetTop ?? 0;
    const h = hero?.offsetHeight || window.innerHeight;
    heroBottomRef.current = top + h - headerH();
  };

  // Cancel any pending "turn white" delay
  const cancelWhiteFlip = () => {
    if (holdUpTimer.current) {
      window.clearTimeout(holdUpTimer.current);
      holdUpTimer.current = null;
    }
  };

  // Schedule the delayed flip to WHITE (on the way up), using the correct durations
  const scheduleWhiteFlip = () => {
    cancelWhiteFlip();
    holdUpTimer.current = window.setTimeout(() => {
      // 1) Set the durations for "to WHITE" on both elements
      setHospTransitionMs(TRANSITION_TO_WHITE_MS_HOSP);
      setCtaTransitionMs(TRANSITION_TO_WHITE_MS_CTA);
      // 2) Flip color on next frame so the new durations are applied
      requestAnimationFrame(() => {
        isInHeroRef.current = true;
        setIsInHero(true);
        holdUpTimer.current = null;
      });
    }, HOLD_UP_MS);
  };

  useEffect(() => {
    // Initial measurements
    computeHeroBottom();
    prevYRef.current = window.scrollY;

    // Initial state
    const initialInHero = window.scrollY <= heroBottomRef.current;
    isInHeroRef.current = initialInHero;
    setIsInHero(initialInHero);
    setScrolled(window.scrollY > 4);

    const onScroll = () => {
      const y1 = window.scrollY;
      const down = y1 > prevYRef.current;

      // Direction-adjusted boundary
      const boundary =
        heroBottomRef.current + (down ? -DOWN_EARLY_PX : UP_EARLY_PX);

      const inHeroNow = y1 <= boundary;

      // Only act when the state would flip
      if (inHeroNow !== isInHeroRef.current) {
        if (inHeroNow) {
          // Coming UP into Hero -> delay, then transition to WHITE on both
          scheduleWhiteFlip();
        } else {
          // Leaving Hero -> immediately to colored state on both
          cancelWhiteFlip();
          // 1) Set durations for "to colored"
          setHospTransitionMs(TRANSITION_TO_BLUE_MS_HOSP); // to Light Blue
          setCtaTransitionMs(TRANSITION_TO_DARK_MS_CTA);   // to Dark Green
          // 2) Flip on next frame so new durations apply
          requestAnimationFrame(() => {
            isInHeroRef.current = false;
            setIsInHero(false);
          });
        }
      }

      // Header border/shadow state
      const s = y1 > 4;
      setScrolled((prev) => (prev !== s ? s : prev));

      prevYRef.current = y1;
    };

    const onResize = () => {
      computeHeroBottom();
      measureAndMatchWidths();
      onScroll();
    };

    // Keep in sync with your snap event (arrow, etc.)
    const onHeroSnapFinished = (e: Event) => {
      const ev = e as CustomEvent<{ dir: "down" | "up" }>;
      if (ev.detail?.dir === "down") {
        // Leaving Hero -> colored states now (with their own durations)
        cancelWhiteFlip();
        setHospTransitionMs(TRANSITION_TO_BLUE_MS_HOSP);
        setCtaTransitionMs(TRANSITION_TO_DARK_MS_CTA);
        requestAnimationFrame(() => {
          isInHeroRef.current = false;
          setIsInHero(false);
        });
      } else if (ev.detail?.dir === "up") {
        // Returning to Hero -> delay then WHITE (with their own durations)
        scheduleWhiteFlip();
      }
    };

    // Run width match after fonts are ready (important for local fonts)
    const afterFonts = () => {
      measureAndMatchWidths();
      // Observe changes to either span's size
      if ("ResizeObserver" in window) {
        roRef.current?.disconnect();
        roRef.current = new ResizeObserver(() => measureAndMatchWidths());
        if (bayouRef.current) roRef.current.observe(bayouRef.current);
        if (hospRef.current) roRef.current.observe(hospRef.current);
      }
    };
    if ((document as any).fonts?.ready) {
      (document as any).fonts.ready.then(afterFonts);
    } else {
      // Fallback
      setTimeout(afterFonts, 0);
      window.addEventListener("load", afterFonts, { once: true });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    window.addEventListener("heroSnapFinished", onHeroSnapFinished as any);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize as any);
      window.removeEventListener("orientationchange", onResize as any);
      window.removeEventListener("heroSnapFinished", onHeroSnapFinished as any);
      roRef.current?.disconnect();
      cancelWhiteFlip();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Frosted CTA opacity levels
  const baseAlpha = 0.45;
  const hoverAlpha = 0.65;
  const alpha = hover ? hoverAlpha : baseAlpha;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "h-[88px]",
        "backdrop-blur-xl",
        scrolled
          ? "border-b border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
          : "border-b border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.06)]",
        "transition-[border-color,box-shadow] duration-300",
      ].join(" ")}
      style={{
        backgroundColor: "transparent",
        WebkitBackdropFilter: "blur(24px)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div
        className={[
          "mx-auto flex h-full max-w-7xl items-center justify-between",
          "px-3 sm:px-4",
        ].join(" ")}
        style={{ paddingLeft: "calc(env(safe-area-inset-left, 0px) + 0.75rem)" }}
      >
        {/* Brand (stacked + centered; nudged right on mobile) */}
        <a
          href="#home"
          className={[
            "flex flex-col items-center leading-tight transition-colors duration-300",
            "ml-2 sm:ml-0",
          ].join(" ")}
          style={{ color: "var(--header-ink, #ffffff)" /* BAYOU color */ }}
        >
          <span
            ref={bayouRef}
            className="font-serif text-4xl sm:text-4xl md:text-5xl"
          >
            BAYOU
          </span>

          {/* HOSPITALITY auto-scales to (slightly under) BAYOU width on all breakpoints */}
          <span
            ref={hospRef}
            className={[
              "font-sans uppercase inline-block",
              "relative -top-[2px]",
              "text-[0.9rem] sm:text-[0.98rem]",
              "tracking-[0.055em]",
              "transition-colors ease-in-out will-change-transform",
              isInHero ? "text-white" : "text-[#7ba5a4]" /* Light Blue */,
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

        {/* Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          <HeaderLink href="#home">Home</HeaderLink>
          <HeaderLink href="#about">About</HeaderLink>
          <HeaderLink href="#restaurants">Restaurants</HeaderLink>
          <HeaderLink href="#contact">Contact</HeaderLink>
        </nav>

        {/* CTA — compact on mobile, larger on md+ */}
        <a
          href="#newsletter"
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
            className={[
              "font-serif transition-colors ease-in-out",
              "text-sm md:text-lg",
              isInHero ? "text-white" : "text-[#4d5a3f]" /* Dark Green */,
            ].join(" ")}
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
