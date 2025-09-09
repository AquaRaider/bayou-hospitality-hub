// src/components/ui/SmoothImage.tsx
import { useEffect, useRef, useState } from "react";

type Props = { src: string; alt: string; className?: string };

// Cache downscaled blob URLs by unique (src|WxH)
type CacheKey = `${string}|${number}x${number}`;
const blobCache = new Map<CacheKey, string>();

export default function SmoothImage({ src, alt, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [outSrc, setOutSrc] = useState<string | null>(null);
  const [inView, setInView] = useState(false);

  // Only process when near/in viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Resample at rendered size; reuse cached blobs
  useEffect(() => {
    if (!inView) return;
    const el = wrapRef.current;
    if (!el) return;

    let revoke: string | null = null;
    let cancelled = false;

    const draw = async () => {
      const rect = el.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
      const key: CacheKey = `${src}|${W}x${H}`;

      // Cache hit
      const cached = blobCache.get(key);
      if (cached) { setOutSrc(cached); return; }

      // Load original
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
      try { await img.decode(); } catch { /* ignore */ }
      if (cancelled) return;

      // Canvas resample with cover-fit
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      // @ts-ignore
      ctx.imageSmoothingQuality = "high";

      // cover-fit crop (like object-fit: cover)
      const rImg = img.width / img.height;
      const rBox = W / H;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (rImg > rBox) {
        const newW = img.height * rBox;
        sx = (img.width - newW) / 2; sw = newW;
      } else {
        const newH = img.width / rBox;
        sy = (img.height - newH) / 2; sh = newH;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

      c.toBlob((blob) => {
        if (!blob || cancelled) return;
        const url = URL.createObjectURL(blob);
        revoke && URL.revokeObjectURL(revoke);
        revoke = url;
        blobCache.set(key, url);
        setOutSrc(url);
      }, "image/jpeg", 0.9);
    };

    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [src, inView]);

  return (
    <div ref={wrapRef} className={className}>
      <img
        src={outSrc ?? src}
        alt={alt}
        className="w-full h-full object-cover rounded-xl shadow-md"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
