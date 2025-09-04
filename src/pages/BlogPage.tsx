// src/pages/BlogPage.tsx
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { Menu, X } from "lucide-react";
import bayouLogo from "@/assets/bayou-logo.png";
import voodooImg from "@/assets/voodoo-chicken.jpg";
import bluebayouImg from "@/assets/blue-bayou.jpg";
import heroImg from "@/assets/hero-food.jpg";

/* ============================================================
   TUNING — dial in the sidebar/logo precisely
   ============================================================ */
const SIDEBAR_W = 300;     // desktop sidebar width
const GAP_W = 32;          // gap between sidebar and feed

// Logo controls
const LOGO_HEIGHT_PX = 180;
const LOGO_SCALE = 1.0;
const LOGO_SHIFT_X = 35;
const LOGO_SHIFT_Y = 0;

// Keep blurb & categories aligned with logo (optional offsets)
const BLURB_INDENT_PX = 6;
const NAV_INDENT_PX = 6;

// Colors
const DARK_GREEN = "#4d5a3f";
const GREEN = "#8ba38c";

// Anim durations
const DRAWER_MS = 280;
/* ============================================================ */

type Brand = "Voodoo Chicken" | "Blue Bayou";
type CategoryId = "latest" | "upcoming" | "past" | "voodoo" | "bluebayou";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  publishedISO: string;
  eventDateISO?: string;
  brand: Brand;
  image?: string;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function dOnly(iso: string) {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function BlogPage() {
  const [headerH, setHeaderH] = useState(96);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false); // keep mounted during exit animation
  const [active, setActive] = useState<CategoryId>("latest");

  useEffect(() => {
    const measure = () => {
      const h = (document.querySelector("header") as HTMLElement)?.offsetHeight || 88;
      setHeaderH(h + 16);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure as any);
      window.removeEventListener("orientationchange", measure as any);
    };
  }, []);

  // Ensure header ink reads well on solid white header
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("heroSnapFinished", { detail: { dir: "down" } }));
    const header = document.querySelector("header") as HTMLElement | null;
    if (header) header.style.setProperty("--header-ink", DARK_GREEN);
  }, []);

  // Demo posts
  const posts: Post[] = [
    {
      id: "vc-spice",
      title: "New Spice Blend at Voodoo",
      excerpt: "We tuned our secret spice blend for extra snap. Crispy, juicy, and bold.",
      publishedISO: "2025-09-01",
      brand: "Voodoo Chicken",
      image: voodooImg,
    },
    {
      id: "bb-hh",
      title: "Oyster Happy Hour",
      excerpt: "Fresh Gulf oysters and bubbles—special pricing every weekday from 4–6 PM.",
      publishedISO: "2025-08-28",
      eventDateISO: "2025-09-10",
      brand: "Blue Bayou",
      image: bluebayouImg,
    },
    {
      id: "vc-gameday",
      title: "Game Day Specials",
      excerpt: "Touchdown deals on wings & daiquiris every game day—lineup launches soon.",
      publishedISO: "2025-08-18",
      eventDateISO: "2025-09-15",
      brand: "Voodoo Chicken",
      image: voodooImg,
    },
    {
      id: "bb-live",
      title: "Live Music Nights Return",
      excerpt: "Evenings at Blue Bayou get moodier—weekly sets with local favorites.",
      publishedISO: "2025-08-10",
      eventDateISO: "2025-09-22",
      brand: "Blue Bayou",
      image: bluebayouImg,
    },
    {
      id: "chef-notes",
      title: "Chef’s Notes: Sourcing Louisiana Produce",
      excerpt: "A look at our favorite local farms and why seasonal ingredients matter.",
      publishedISO: "2025-07-30",
      brand: "Blue Bayou",
      image: heroImg,
    },
  ];

  const filtered = useMemo(() => {
    const today = dOnly(new Date().toISOString());

    if (active === "latest") {
      return [...posts].sort((a, b) => +dOnly(b.publishedISO) - +dOnly(a.publishedISO));
    }
    if (active === "upcoming") {
      return posts
        .filter((p) => p.eventDateISO && dOnly(p.eventDateISO) >= today)
        .sort((a, b) => +dOnly(a.eventDateISO!) - +dOnly(b.eventDateISO!));
    }
    if (active === "past") {
      return posts
        .filter((p) => p.eventDateISO && dOnly(p.eventDateISO) < today)
        .sort((a, b) => +dOnly(b.eventDateISO!) - +dOnly(a.eventDateISO!));
    }
    if (active === "voodoo") {
      return posts
        .filter((p) => p.brand === "Voodoo Chicken")
        .sort((a, b) => +dOnly(b.publishedISO) - +dOnly(a.publishedISO));
    }
    if (active === "bluebayou") {
      return posts
        .filter((p) => p.brand === "Blue Bayou")
        .sort((a, b) => +dOnly(b.publishedISO) - +dOnly(a.publishedISO));
    }
    return posts;
  }, [active, posts]);

  // Drawer mount/unmount timing for smooth exit
  const openDrawer = () => {
    setDrawerMounted(true);
    requestAnimationFrame(() => setMobileNavOpen(true));
  };
  const closeDrawer = () => {
    setMobileNavOpen(false);
    window.setTimeout(() => setDrawerMounted(false), DRAWER_MS);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        disableHeroReactivity
        background="solid"
        forceColors={{ hospitality: "lightBlue", newsletter: "darkGreen" }}
      />

      {/* Mobile open button (animated hide when open) */}
      <button
        type="button"
        aria-label="Open blog menu"
        className={[
          "md:hidden fixed z-50 left-3 rounded-lg border border-black/10 bg-white shadow-md",
          "px-3 py-2 transition-all duration-300",
          mobileNavOpen ? "opacity-0 -translate-x-2 scale-95 pointer-events-none" : "opacity-100 translate-x-0 scale-100",
        ].join(" ")}
        style={{ top: headerH + 8, color: DARK_GREEN }}
        onClick={openDrawer}
      >
        <span className="inline-flex items-center gap-2">
          <Menu size={18} />
          <span className="font-sans text-sm">Menu</span>
        </span>
      </button>

      {/* Mobile drawer + overlay (kept mounted during exit animation) */}
      {drawerMounted && (
        <>
          <div
            className={[
              "fixed inset-0 z-40 md:hidden transition-opacity duration-300",
              mobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
              "bg-black/40",
            ].join(" ")}
            onClick={closeDrawer}
          />
          <div
            className={[
              "fixed z-50 left-0 md:hidden bg-white shadow-2xl border-r border-black/10",
              "transition-transform duration-300 will-change-transform",
              mobileNavOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            style={{ top: headerH, height: `calc(100vh - ${headerH}px)`, width: Math.min(320, Math.floor(window.innerWidth * 0.84)) }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10" style={{ color: DARK_GREEN }}>
              <span className="font-sans text-sm">Blog Menu</span>
              <button
                type="button"
                aria-label="Close"
                className="p-2 rounded hover:bg-black/5 active:scale-95 transition"
                onClick={closeDrawer}
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(100%-49px)] overflow-y-auto">
              <SidebarContent
                active={active}
                onChange={(id) => {
                  setActive(id);
                  closeDrawer();
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Desktop fixed left sidebar (unchanged) */}
      <aside
        className="hidden md:block fixed left-0 border-r border-black/10"
        style={{ top: headerH, width: SIDEBAR_W, height: `calc(100vh - ${headerH}px)` }}
      >
        <div className="h-full overflow-y-auto px-6 py-6" style={{ color: DARK_GREEN }}>
          <SidebarContent active={active} onChange={setActive} />
        </div>
      </aside>

      {/* RIGHT FEED */}
      <main
        className="pb-24"
        style={{
          paddingTop: headerH,
          marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? SIDEBAR_W + GAP_W : 0,
        }}
      >
        <div className="container-custom">
          <section className="grid gap-10 lg:grid-cols-2" style={{ color: DARK_GREEN }}>
            {filtered.map((p) => (
              <article key={p.id} className="group">
                <a className="block overflow-hidden rounded-xl border border-black/10">
                  <img
                    src={p.image || heroImg}
                    alt={p.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </a>

                <div className="mt-3 text-sm font-sans">
                  {p.brand}
                  {p.eventDateISO ? ` • ${fmtDate(p.eventDateISO)}` : ""}
                </div>

                <h3 className="mt-1 font-serif text-2xl">{p.title}</h3>
                <p className="mt-2 font-sans text-[15px] leading-relaxed">{p.excerpt}</p>
                <p className="mt-3 text-xs font-sans">Published {fmtDate(p.publishedISO)}</p>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-black/10 p-8 text-center" style={{ color: DARK_GREEN }}>
                <p className="font-sans">Nothing to show here yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------- Sidebar content (shared by desktop + mobile) ---------- */

function SidebarContent({
  active,
  onChange,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}) {
  return (
    <div style={{ color: DARK_GREEN }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={bayouLogo}
          alt="Bayou Hospitality"
          className="object-contain will-change-transform"
          style={{
            height: LOGO_HEIGHT_PX,
            width: "auto",
            transform: `translate(${LOGO_SHIFT_X}px, ${LOGO_SHIFT_Y}px) scale(${LOGO_SCALE})`,
            transformOrigin: "top left",
          }}
          loading="lazy"
        />
      </div>

      {/* Blurb */}
      <p
        className="mt-4 font-sans text-[15px] leading-relaxed"
        style={{ paddingLeft: BLURB_INDENT_PX }}
      >
        Thoughts from our team, plus updates, promotions, and events from{" "}
        <span className="font-semibold" style={{ color: GREEN }}>Voodoo Chicken</span> and{" "}
        <span className="font-semibold" style={{ color: GREEN }}>Blue Bayou</span>.
      </p>

      {/* Divider */}
      <div className="mt-6 mb-3 h-px" style={{ backgroundColor: `${DARK_GREEN}4D` }} />

      {/* Category menu */}
      <nav
        className="mt-2 space-y-1"
        style={{ paddingLeft: NAV_INDENT_PX, color: DARK_GREEN }}
      >
        <SideLink label="Latest" active={active === "latest"} onClick={() => onChange("latest")} />
        <SideLink label="All upcoming events" active={active === "upcoming"} onClick={() => onChange("upcoming")} />
        <SideLink label="All past events" active={active === "past"} onClick={() => onChange("past")} />
        <SideLink label="Voodoo Chicken" active={active === "voodoo"} onClick={() => onChange("voodoo")} />
        <SideLink label="Blue Bayou" active={active === "bluebayou"} onClick={() => onChange("bluebayou")} />
      </nav>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function SideLink({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-lg px-3 py-2 font-sans",
        "transition-all duration-200 ease-out",
        "hover:underline underline-offset-8 decoration-2",
        "origin-left hover:scale-105 hover:opacity-100",
        active ? "bg-black/5 font-semibold" : "hover:bg-black/5",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
      style={{ color: DARK_GREEN }}
    >
      {label}
    </button>
  );
}
