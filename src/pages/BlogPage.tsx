// src/pages/BlogPage.tsx
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { Menu, X } from "lucide-react";
import bayouLogo from "@/assets/bayou-logo.png";
import SmoothImage from "@/components/ui/SmoothImage";

/* TUNING */
const SIDEBAR_W = 300;
const GAP_W = 32;
const LOGO_HEIGHT_PX = 180;
const LOGO_SCALE = 1.0;
const LOGO_SHIFT_X = 35;
const LOGO_SHIFT_Y = 0;
const BLURB_INDENT_PX = 6;
const NAV_INDENT_PX = 6;
const DARK_GREEN = "#4d5a3f";
const GREEN = "#8ba38c";
const DRAWER_MS = 280;

type Brand = "Voodoo Chicken" | "Blue Bayou";
type CategoryId = "latest" | "upcoming" | "past" | "voodoo" | "bluebayou";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  publishedISO: string;
  eventDateISO?: string;
  brand: Brand;
  image: string;
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function dOnly(iso: string) {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/* POSTS — handcrafted examples */
const posts: Post[] = [
  {
    id: "vc-daiquiri-night",
    title: "Daiquiri Night at Voodoo",
    excerpt: "A packed evening of frozen cocktails and live DJs at our Canal St. location.",
    publishedISO: "2025-08-20",
    eventDateISO: "2025-08-22",
    brand: "Voodoo Chicken",
    image: "/media/photos/voodoo_chicken/Voodoo_Chicken_Drink03.jpg",
  },
  {
    id: "vc-game-day-2025",
    title: "Game Day Kickoff Specials",
    excerpt: "Catch every touchdown with $5 wings and specialty daiquiris. Every Sunday this season!",
    publishedISO: "2025-09-05",
    eventDateISO: "2025-09-15",
    brand: "Voodoo Chicken",
    image: "/media/photos/voodoo_chicken/Voodoo_Chicken_Interior01.jpg",
  },
  {
    id: "vc-new-signature",
    title: "New Signature Chicken Basket",
    excerpt: "Our chefs unveiled a revamped basket with bold seasoning and house-made sauces.",
    publishedISO: "2025-09-02",
    brand: "Voodoo Chicken",
    image: "/media/photos/voodoo_chicken/Voodoo_Chicken_Exterior01.jpg",
  },
  {
    id: "bb-oyster-fest",
    title: "Blue Bayou Oyster Festival",
    excerpt: "Celebrating Gulf seafood with $1 oysters, champagne pairings, and live jazz.",
    publishedISO: "2025-08-25",
    eventDateISO: "2025-09-12",
    brand: "Blue Bayou",
    image: "/media/photos/blue_bayou/Blue_Bayou_Interior06.jpg",
  },
  {
    id: "bb-mixology-class",
    title: "Cocktail Mixology Class",
    excerpt: "Guests learned to shake, stir, and garnish cocktails with our lead mixologist.",
    publishedISO: "2025-08-05",
    eventDateISO: "2025-08-08",
    brand: "Blue Bayou",
    image: "/media/photos/blue_bayou/Blue_Bayou_Drink02.jpg",
  },
  {
    id: "bb-farm-to-table",
    title: "Farm-to-Table Spotlight",
    excerpt: "Chef’s menu highlight featuring seasonal produce and freshly shucked oysters.",
    publishedISO: "2025-09-03",
    brand: "Blue Bayou",
    image: "/media/photos/blue_bayou/Blue_Bayou_Food01.jpg",
  },
  {
    id: "bb-jazz-brunch",
    title: "Sunday Jazz Brunch",
    excerpt: "Mimosas, oysters, and live brass every Sunday morning at Blue Bayou.",
    publishedISO: "2025-09-07",
    eventDateISO: "2025-09-14",
    brand: "Blue Bayou",
    image: "/media/photos/blue_bayou/Blue_Bayou_Interior03.jpg",
  },
];

export default function BlogPage() {
  const [headerH, setHeaderH] = useState(96);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [active, setActive] = useState<CategoryId>("latest");

  // Preload the first likely hero image (improves LCP on blog route)
  useEffect(() => {
    const first = posts[0]?.image;
    if (!first) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = first;
    // @ts-ignore
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

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

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("heroSnapFinished", { detail: { dir: "down" } }));
    const header = document.querySelector("header") as HTMLElement | null;
    if (header) header.style.setProperty("--header-ink", DARK_GREEN);
  }, []);

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
  }, [active]);

  const openDrawer = () => {
    setDrawerMounted(true);
    requestAnimationFrame(() => setMobileNavOpen(true));
  };
  const closeDrawer = () => {
    setMobileNavOpen(false);
    window.setTimeout(() => setDrawerMounted(false), DRAWER_MS);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ contentVisibility: "auto", containIntrinsicSize: "1400px" }}
    >
      <Header
        disableHeroReactivity
        background="solid"
        forceColors={{ hospitality: "lightBlue", newsletter: "darkGreen" }}
      />

      {/* Mobile open button */}
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

      {/* Mobile drawer + overlay */}
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
            style={{
              top: headerH,
              height: `calc(100vh - ${headerH}px)`,
              width: Math.min(320, Math.floor(window.innerWidth * 0.84)),
            }}
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

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block fixed left-0 border-r border-black/10"
        style={{ top: headerH, width: SIDEBAR_W, height: `calc(100vh - ${headerH}px)` }}
      >
        <div className="h-full overflow-y-auto px-6 py-6" style={{ color: DARK_GREEN }}>
          <SidebarContent active={active} onChange={setActive} />
        </div>
      </aside>

      {/* Feed */}
      <main
        className="pb-24"
        style={{
          paddingTop: headerH,
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 768
              ? SIDEBAR_W + GAP_W
              : 0,
        }}
      >
        <div className="container-custom">
          <section className="grid gap-10 lg:grid-cols-2" style={{ color: DARK_GREEN }}>
            {filtered.map((p) => (
              <article key={p.id} className="group">
                <a className="block overflow-hidden rounded-xl border border-black/10">
                  <SmoothImage
                    src={p.image}
                    alt={p.title}
                    className="h-56 w-full transition-transform duration-500 group-hover:scale-[1.03]"
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

/* ---------- Sidebar ---------- */
function SidebarContent({
  active,
  onChange,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}) {
  return (
    <div style={{ color: DARK_GREEN }}>
      <div className="flex items-center gap-3">
        <img
          src={bayouLogo}
          alt="Bayou Hospitality"
          width={600}
          height={180}
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

      <p
        className="mt-4 font-sans text-[15px] leading-relaxed"
        style={{ paddingLeft: BLURB_INDENT_PX }}
      >
        Thoughts from our team, plus updates, promotions, and events from{" "}
        <span className="font-semibold" style={{ color: GREEN }}>
          Voodoo Chicken
        </span>{" "}
        and{" "}
        <span className="font-semibold" style={{ color: GREEN }}>
          Blue Bayou
        </span>
        .
      </p>

      <div className="mt-6 mb-3 h-px" style={{ backgroundColor: `${DARK_GREEN}4D` }} />

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
