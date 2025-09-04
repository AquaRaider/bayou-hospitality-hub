import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Alpha levels for CTA background
  const baseAlpha = 0.70;
  const hoverAlpha = 0.90;
  const alpha = hover ? hoverAlpha : baseAlpha;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 h-[72px]",
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
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <a
          href="#home"
          className="text-lg font-semibold tracking-wide transition-colors duration-300"
          style={{ color: "var(--header-ink, #ffffff)" }}
        >
          Bayou Hospitality
        </a>

        {/* Nav */}
        <nav className="hidden gap-8 md:flex">
          <HeaderLink href="#home">Home</HeaderLink>
          <HeaderLink href="#about">About</HeaderLink>
          <HeaderLink href="#restaurants">Restaurants</HeaderLink>
          <HeaderLink href="#contact">Contact</HeaderLink>
        </nav>

        {/* CTA — fades Green→Dark Green based on --cta-bg-rgb; more opaque on hover */}
        <a
          href="#newsletter"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold",
            "text-white",
            "border border-white/20 hover:border-white/30",
            "shadow-sm transition-all duration-200 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-white/40",
          ].join(" ")}
          style={{
            backgroundColor: `rgba(var(--cta-bg-rgb, 139, 163, 140), ${alpha})`,
          }}
        >
          Newsletter
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
      className="text-sm font-medium transition-colors duration-300 hover:opacity-85"
      style={{ color: "var(--header-ink, #ffffff)" }}
    >
      {children}
    </a>
  );
}
