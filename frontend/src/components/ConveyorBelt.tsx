
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Apple‑style Conveyor Belt (continuous marquee)
 *
 * - Smooth, continuous leftward motion (no visible jumps)
 * - Always filled edge‑to‑edge
 * - Seamless wrap using modulo math
 * - Responsive, resilient to resize and image load timing
 *
 * Usage:
 *   <ConveyorBelt />
 */

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
type Img = { _id: string; path: string; caption?: string };

const SPEED_PX_PER_SEC = 120; // tune this to taste

const ConveyorBelt: React.FC = () => {
  const [images, setImages] = useState<Img[]>([]);
  const [ready, setReady] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // animation refs
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const singleWidthRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  // fetch images once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/conveyor`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          const arr: Img[] = Array.isArray(data?.images) ? data.images : [];
          setImages(arr);
        }
      } catch (e) {
        console.warn("Failed to load conveyor images", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Repeat the image list 3 times for a continuous, filled belt.
  const loopImages = useMemo(() => {
    if (!images.length) return [];
    return [...images, ...images, ...images];
  }, [images]);

  const makeUrl = (p?: string) => {
    if (!p) return "";
    const fixed = p.replace(/\\/g, "/").replace(/^\/*/, "/");
    return encodeURI(`${apiBaseUrl}${fixed}`);
  };

  // Wait for all <img> to load (or best‑effort timeout) before measuring
  const waitForImgs = async (root: HTMLElement) => {
    const imgs = Array.from(root.querySelectorAll("img")) as HTMLImageElement[];
    await Promise.allSettled(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 2500);
        });
      })
    );
  };

  const measure = async () => {
    const track = trackRef.current;
    if (!track) return;

    await waitForImgs(track);

    // width of ONE original sequence (not all 3 copies)
    // Since we rendered 3x, we can infer the single width by dividing by 3.
    const total = track.scrollWidth;
    const singleWidth = Math.max(1, Math.round(total / 3));
    singleWidthRef.current = singleWidth;

    // Start with the middle copy aligned to the viewport so it's already filled both sides.
    // That means an initial negative offset of exactly one singleWidth.
    // We'll store the absolute "positive" offset value and apply translateX(-offset).
    offsetRef.current = singleWidth;

    // apply transform & reveal
    track.style.transform = `translateX(${-offsetRef.current}px) translateZ(0)`;
    setReady(true);
  };

  // measure on mount/changes and on resize/font reflow
  useEffect(() => {
    if (!loopImages.length) {
      setReady(false);
      return;
    }
    let cancelled = false;

    const doMeasure = async () => {
      if (cancelled) return;
      await measure();
    };

    const fontReady = (document as any).fonts?.ready ?? Promise.resolve();
    fontReady.then(() => requestAnimationFrame(doMeasure));

    const containerEl = containerRef.current;
    let ro: ResizeObserver | null = null;
    if (containerEl && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => requestAnimationFrame(doMeasure));
      ro.observe(containerEl);
    } else {
      const handler = () => doMeasure();
      window.addEventListener("resize", handler);
      (doMeasure as any)._fallback = handler;
    }

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if ((doMeasure as any)._fallback) {
        window.removeEventListener("resize", (doMeasure as any)._fallback);
      }
    };
  }, [loopImages.length]);

  // rAF loop: continuous modulo wrap
  useEffect(() => {
    if (!loopImages.length) return;
    const track = trackRef.current;
    if (!track) return;

    const step = (now: number) => {
      if (!startTsRef.current) startTsRef.current = now;
      const dt = Math.min((now - startTsRef.current) / 1000, 1 / 30); // cap initial frame
      startTsRef.current = now;

      if (!pausedRef.current) {
        const singleWidth = singleWidthRef.current;
        if (singleWidth > 0) {
          // advance
          offsetRef.current += SPEED_PX_PER_SEC * dt;

          // wrap seamlessly across exactly one single sequence width
          offsetRef.current = offsetRef.current % singleWidth;

          // base position keeps the middle copy onscreen; add offset to slide left
          const x = singleWidth + offsetRef.current;
          track.style.transform = `translateX(${-x}px) translateZ(0)`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTsRef.current = 0;
    };
  }, [loopImages.length]);

  if (!images.length) return null;

  return (
    <div className="w-screen overflow-hidden bg-white">
      {/* Full‑bleed wrapper so the belt reaches the true edges like Apple */}
      <div ref={containerRef} className="relative w-full">
        <div className="relative w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center select-none"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              whiteSpace: "nowrap",
              willChange: "transform",
              opacity: ready ? 1 : 0,
              visibility: ready ? "visible" : "hidden",
              transform: "translateX(0px) translateZ(0)",
              transition: "opacity 150ms ease",
            }}
            role="list"
            aria-label="Product brand belt"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            onTouchStart={() => (pausedRef.current = true)}
            onTouchEnd={() => (pausedRef.current = false)}
          >
            {loopImages.map((img, idx) => (
              <div key={`${img._id}-${idx}`} className="flex-shrink-0" role="listitem">
                <img
                  src={makeUrl(img.path)}
                  alt={img.caption || `conveyor-${idx}`}
                  className="h-28 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto object-contain rounded-xl shadow-sm bg-white p-2"
                  draggable={false}
                  decoding="async"
                  loading="eager"
                  fetchPriority={idx < images.length ? "high" : "auto" as any}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional edge‑to‑edge helper if your page has padded centered content
          Apply 'conveyor-fullbleed' to the parent of this component if needed */}
      <style>{`
        @media (min-width: 1024px) {
          .conveyor-fullbleed {
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
