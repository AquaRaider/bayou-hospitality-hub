// src/components/sections/NewsletterSection.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const backgroundImage = "/media/photos/blue_bayou/Blue_Bayou_Drink02.jpg";

const BG_SCALE = 1.25;
const BG_BLUR = 0;               // 👈 adjust blur here
const PARALLAX_SPEED = 0.1;
const PARALLAX_EASE = 0.04;
const BUBBLE_BLACK_ALPHA = 0.18;

const HEADING_BACKDROP_OFFSET_PX = 0.75;
const HEADING_WHITE_ALPHA = 0.6;
const HEADING_BLACK_SHADOW = "0 6px 18px rgba(0,0,0,0.65)";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const currYRef = useRef(0);
  const targetYRef = useRef(0);
  const [parY, setParY] = useState(0);
  const inViewRef = useRef(false);

  // Smooth parallax loop, but only while in view
  useEffect(() => {
    const animate = () => {
      if (!inViewRef.current) return; // pause when offscreen
      const next = currYRef.current + (targetYRef.current - currYRef.current) * PARALLAX_EASE;
      currYRef.current = next;
      setParY(next);
      rafRef.current = requestAnimationFrame(animate);
    };

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        inViewRef.current = on;
        if (on) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(animate);
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update target based on scroll/resize
  useEffect(() => {
    let ticking = false;

    const updateTarget = () => {
      const el = sectionRef.current;
      const top = el?.offsetTop ?? 0;
      const h = el?.offsetHeight ?? 1;
      const y = window.scrollY + window.innerHeight / 2 - (top + h / 2);

      const maxOffset = h * 0.18;
      const target = Math.max(-maxOffset, Math.min(maxOffset, y * PARALLAX_SPEED));
      targetYRef.current = target;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateTarget);
      }
    };

    updateTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll as any);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitted(true);
    toast({
      title: "Welcome to our newsletter!",
      description: "You'll receive updates about our restaurants and special events.",
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  const BODY_TEXT_SHADOW = "0 2px 10px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.45)";

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="relative isolate py-28 overflow-hidden"
      style={{ contentVisibility: "auto", containIntrinsicSize: "900px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: `translateY(${parY}px) scale(${BG_SCALE})`,
            filter: `blur(${BG_BLUR}px)`,
          }}
        />
      </div>

      <div className="relative container-custom">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* BLOG bubble */}
          <div
            id="blog"
            className={[
              "rounded-2xl border",
              "bg-black/0 backdrop-blur-xl backdrop-saturate-[0.85]",
              "shadow-[0_20px_50px_rgba(0,0,0,0.18)]",
              "p-8 sm:p-10 text-center",
            ].join(" ")}
            style={{
              backgroundColor: `rgba(0,0,0,${BUBBLE_BLACK_ALPHA})`,
              borderColor: "rgba(255,255,255,0.22)",
            }}
          >
            <h2
              className="text-3xl lg:text-4xl font-serif font-bold mb-4 text-bayou-light-blue uppercase"
              style={{
                textShadow: [
                  HEADING_BLACK_SHADOW,
                  `-${HEADING_BACKDROP_OFFSET_PX}px 0 0 rgba(255,255,255,${HEADING_WHITE_ALPHA})`,
                ].join(", "),
              }}
            >
              BLOG
            </h2>
            <p className="mb-8 text-lg font-sans text-white/95" style={{ textShadow: BODY_TEXT_SHADOW }}>
              We post updates on promotions, menu changes, new experiences, and
              behind-the-scenes stories across our restaurants. Follow along to
              stay in the loop.
            </p>
            <Button
              type="button"
              onClick={() => { window.location.href = "/blog"; }}
              className="btn-newsletter sm:w-auto"
              aria-label="Go to the Bayou Hospitality blog"
            >
              <span className="font-sans font-semibold">Visit the Blog</span>
            </Button>
          </div>

          {/* NEWSLETTER bubble */}
          <div
            className={[
              "rounded-2xl border",
              "bg-black/0 backdrop-blur-xl backdrop-saturate-[0.85]",
              "shadow-[0_20px_50px_rgba(0,0,0,0.18)]",
              "p-8 sm:p-10 text-center",
            ].join(" ")}
            style={{
              backgroundColor: `rgba(0,0,0,${BUBBLE_BLACK_ALPHA})`,
              borderColor: "rgba(255,255,255,0.22)",
            }}
          >
            <Mail className="w-10 h-10 mx-auto mb-4 text-white opacity-95" />
            <h2
              className="text-3xl lg:text-4xl font-serif font-bold mb-4 text-bayou-light-blue uppercase"
              style={{
                textShadow: [
                  HEADING_BLACK_SHADOW,
                  `-${HEADING_BACKDROP_OFFSET_PX}px 0 0 rgba(255,255,255,${HEADING_WHITE_ALPHA})`,
                ].join(", "),
              }}
            >
              STAY CONNECTED
            </h2>
            <p className="mb-8 text-lg font-sans text-white/95" style={{ textShadow: BODY_TEXT_SHADOW }}>
              Be the first to know about new menu items, special events, and
              exclusive offers from both our restaurants.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/40 text-white placeholder:text-white/70 focus:bg-white/15 font-sans"
                  required
                  style={{ textShadow: BODY_TEXT_SHADOW }}
                />
                <Button type="submit" className="btn-newsletter sm:w-auto">
                  <span className="font-sans font-semibold">Subscribe</span>
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center space-x-3 text-white">
                <Check className="w-6 h-6" />
                <span className="text-lg font-sans font-semibold" style={{ textShadow: BODY_TEXT_SHADOW }}>
                  Thank you for subscribing!
                </span>
              </div>
            )}

            <p className="text-sm mt-4 text-white/85 font-sans" style={{ textShadow: BODY_TEXT_SHADOW }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
