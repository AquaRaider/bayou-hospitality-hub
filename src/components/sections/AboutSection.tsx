// src/components/sections/AboutSection.tsx
import { useEffect, useRef, useState } from "react";
import { Heart, Users, Award } from "lucide-react";
import SmoothImage from "@/components/ui/SmoothImage";

// public/media paths
const voodooImg = "/media/photos/voodoo_chicken/Voodoo_Chicken_Drink03.jpg";
const bluebayouImg = "/media/photos/blue_bayou/Blue_Bayou_Interior03.jpg";

const PILLARS = [
  { icon: Heart, title: "Crafted with Heart", text: "Menus shaped by New Orleans’ traditions, executed with modern technique." },
  { icon: Users, title: "Guests First", text: "We create warm, memorable moments for every guest." },
  { icon: Award, title: "Relentless Quality", text: "Sourcing, prep, and service you can taste every time." },
];

const EARLY = 120;

export default function AboutSection() {
  const ref = useRef<HTMLElement | null>(null);
  const prevY = useRef(0);
  const [shown, setShown] = useState(false);
  const [animate, setAnimate] = useState(false);

  const headerH = () =>
    (document.querySelector("header") as HTMLElement)?.offsetHeight || 0;

  const aboutTop = () => {
    const el = ref.current;
    return Math.max(0, (el?.offsetTop ?? 0) - headerH());
  };

  const heroBottom = () => {
    const hero = document.getElementById("home");
    const top = hero?.offsetTop ?? 0;
    const h = hero?.offsetHeight || window.innerHeight;
    return top + h - headerH();
  };

  const inHero = (y: number) => y <= heroBottom();

  const setHospitalityInk = (value?: string) => {
    const root = document.documentElement;
    if (!root) return;
    if (value) root.style.setProperty("--hospitality-ink", value);
    else root.style.removeProperty("--hospitality-ink");
  };

  useEffect(() => {
    prevY.current = window.scrollY;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) { setShown(true); setAnimate(false); }

    if (!reduce && window.scrollY >= aboutTop() - EARLY) {
      setShown(true);
      setAnimate(false);
    }

    if (inHero(window.scrollY)) setHospitalityInk(undefined);
    else setHospitalityInk("hsl(var(--bayou-light-blue))");

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y0 = prevY.current;
        const y1 = window.scrollY;
        const down = y1 > y0;
        const aTop = aboutTop();

        if (down && y0 < aTop - EARLY && y1 >= aTop - EARLY) { setShown(true); setAnimate(true); }
        if (!down && y0 > aTop && y1 <= aTop) { setShown(true); setAnimate(false); }

        prevY.current = y1;
        ticking = false;
      });
    };

    const onHeroSnapFinished = (e: Event) => {
      const ev = e as CustomEvent<{ dir: "down" | "up" }>;
      if (ev.detail?.dir === "down") setHospitalityInk("hsl(var(--bayou-light-blue))");
      if (ev.detail?.dir === "up") setHospitalityInk(undefined);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll as any, { passive: true });
    window.addEventListener("heroSnapFinished", onHeroSnapFinished as any);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll as any);
      window.removeEventListener("heroSnapFinished", onHeroSnapFinished as any);
      setHospitalityInk(undefined);
    };
  }, []);

  const base = "transition-all will-change-[opacity,transform]";
  const dur = animate ? "duration-700" : "duration-0";
  const vis = shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <section
      ref={ref}
      id="about"
      className="relative bg-white py-24 md:py-32"
      style={{ contentVisibility: "auto", containIntrinsicSize: "900px" }}
    >
      <div className="container mx-auto px-4">
        <div className={["mx-auto max-w-4xl text-center", base, dur, vis].join(" ")}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4d5a3f]">
            ABOUT BAYOU HOSPITALITY
          </h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-3">
            <p className="text-lg leading-relaxed text-[#111827]">
              We’re a New Orleans hospitality group dedicated to warm service,
              vibrant flavors, and unforgettable dining—rooted in the spirit of the city.
            </p>
            <p className="text-lg leading-relaxed text-[#111827]">
              Our family includes <span className="font-semibold text-[#4d5a3f]">Voodoo Chicken</span> and{" "}
              <span className="font-semibold text-[#4d5a3f]">Blue Bayou Oyster Bar & Grill</span>.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {[
            { img: voodooImg, title: "Voodoo Chicken", text: "Bold, soulful chicken and fixings that channel the magic of New Orleans." },
            { img: bluebayouImg, title: "Blue Bayou Oyster Bar & Grill", text: "Fresh Gulf oysters, coastal fare, and easy elegance—classic Louisiana hospitality." },
          ].map((c, i) => (
            <FramedCard key={c.title} {...c} shown={shown} animate={animate} delay={120 + i * 120} />
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={[
                "rounded-2xl border border-black/5 bg-white p-7 text-center shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
                base, vis, animate ? "duration-700" : "duration-0",
              ].join(" ")}
              style={{ transitionDelay: animate ? `${260 + i * 120}ms` : "0ms" }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8ba38c]">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-[#4d5a3f]">{title}</h4>
              <p className="mt-2 text-sm text-[#111827]/80">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FramedCard({
  img, title, text, shown, animate, delay,
}: {
  img: string; title: string; text: string; shown: boolean; animate: boolean; delay: number;
}) {
  const base = "transition-all will-change-[opacity,transform]";
  const d = animate ? "duration-700" : "duration-0";
  const vis = shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";
  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl",
        "shadow-[0_12px_40px_rgba(0,0,0,0.15)] p-4 flex flex-col",
        base, d, vis,
      ].join(" ")}
      style={{ transitionDelay: animate ? `${delay}ms` : "0ms" }}
    >
      <div
        className={["overflow-hidden rounded-xl transition-all", d, shown ? "scale-100 blur-0" : "scale-[0.98] blur-[2px]"].join(" ")}
        style={{ transitionDelay: animate ? `${delay + 40}ms` : "0ms" }}
      >
        <SmoothImage src={img} alt={title} className="h-80 md:h-96 w-full" />
      </div>
      <div
        className={["mt-5 transition-all", d, shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"].join(" ")}
        style={{ transitionDelay: animate ? `${delay + 120}ms` : "0ms" }}
      >
        <h3 className="text-2xl font-semibold text-[#4d5a3f]">{title}</h3>
        <p className="mt-2 text-base text-[#111827]/85">{text}</p>
      </div>
    </article>
  );
}
