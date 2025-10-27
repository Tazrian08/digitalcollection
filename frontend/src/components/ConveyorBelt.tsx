import React, { useEffect, useRef, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
type Img = { _id: string; path: string; caption?: string };

const ConveyorBelt: React.FC = () => {
  const [images, setImages] = useState<Img[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const singleWidthRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/conveyor`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setImages(data.images || []);
      } catch (err) {
        console.warn("Failed to load conveyor images", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // duplicated images for seamless loop
  const loopImages = images.length ? [...images, ...images] : [];

  const makeUrl = (p?: string) => {
    if (!p) return "";
    const fixed = p.replace(/\\/g, "/").replace(/^\/*/, "/");
    return encodeURI(`${apiBaseUrl}${fixed}`);
  };

  // measure widths AFTER images load, set initial offset so visible window starts aligned to right edge
  useEffect(() => {
    if (!loopImages.length) return;
    let cancelled = false;

    const measure = async () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const imgs = Array.from(track.querySelectorAll("img"));
      await Promise.allSettled(
        imgs.map((imgEl) => {
          const img = imgEl as HTMLImageElement;
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
            // safety timeout
            setTimeout(() => resolve(), 2000);
          });
        })
      );
      if (cancelled) return;

      const trackScrollWidth = track.scrollWidth || 0;
      const singleWidth = trackScrollWidth / 2 || 0;
      singleWidthRef.current = singleWidth;

      const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        container.clientWidth;
      // compute startOffset so that the right edge of the first sequence lines up with the right edge of the viewport
      let startOffset = Math.max(0, Math.round(singleWidth - viewportWidth));
      if (singleWidth > 0) startOffset = startOffset % singleWidth;

      offsetRef.current = startOffset;
      track.style.transform = `translateX(${-offsetRef.current}px)`;
    };

    const t = window.setTimeout(measure, 40);
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [loopImages.length]);

  // continuous smooth animation with wrapping (no jump)
  useEffect(() => {
    if (!loopImages.length) return;
    const track = trackRef.current;
    if (!track) return;

    const speedPxPerSec = 120; // tune speed
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.max(0, now - last) / 1000;
      last = now;

      if (!pausedRef.current) {
        const singleWidth = singleWidthRef.current || 0;
        if (singleWidth > 0) {
          offsetRef.current += speedPxPerSec * dt;
          if (offsetRef.current >= singleWidth) {
            // wrap without visual jump
            offsetRef.current = offsetRef.current % singleWidth;
          }
          track.style.transform = `translateX(${-offsetRef.current}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loopImages.length]);

  if (!images.length) return null;

  return (
    <div className="w-full overflow-hidden py-6 bg-white">
      <div
        ref={containerRef}
        className="relative w-full px-4 sm:px-6 lg:px-8"
        aria-hidden={false}
      >
        <div
          className="conveyor relative w-full overflow-hidden"
          style={{ marginLeft: 0, marginRight: 0 }}
        >
          <div
            ref={trackRef}
            className="conveyor-track flex items-center"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
            role="list"
            aria-label="Conveyor belt"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            onTouchStart={() => (pausedRef.current = true)}
            onTouchEnd={() => (pausedRef.current = false)}
          >
            {loopImages.map((img, idx) => (
              <div
                key={`${img._id}-${idx}`}
                className="flex-shrink-0 px-2"
                role="listitem"
              >
                <img
                  src={makeUrl(img.path)}
                  alt={img.caption || `conveyor-${idx}`}
                  className="h-28 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain rounded-lg shadow-sm bg-white p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* pause on hover handled via events; keep simple fallback */
        @media (min-width: 1024px) {
          .conveyor {
            margin-left: calc((100vw - 100%) / -2);
            margin-right: calc((100vw - 100%) / -2);
            padding-left: calc((100vw - 100%) / 2);
            padding-right: calc((100vw - 100%) / 2);
          }
        }
      `}</style>
    </div>
  );
};

export default ConveyorBelt;
