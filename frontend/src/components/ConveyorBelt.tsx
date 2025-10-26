import React, { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type Img = { _id: string; path: string; caption?: string };

const ConveyorBelt: React.FC = () => {
  const [images, setImages] = useState<Img[]>([]);

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

  if (!images.length) return null;

  // duplicate to make seamless loop
  const loopImages = [...images, ...images];

  // compute animation duration (seconds)
  const duration = Math.max(12, Math.round(images.length * 3));

  const makeUrl = (p?: string) => {
    if (!p) return "";
    const fixed = p.replace(/\\/g, "/").replace(/^\/*/, "/");
    return encodeURI(`${apiBaseUrl}${fixed}`);
  };

  return (
    <div className="w-full overflow-hidden py-6 bg-white">
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="conveyor relative w-full overflow-hidden">
          <div
            className="conveyor-track flex items-center"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              whiteSpace: "nowrap",
              animation: `conveyorScroll ${duration}s linear infinite`,
            }}
            aria-hidden={false}
            role="list"
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
                  className="h-24 sm:h-28 md:h-36 lg:h-44 xl:h-48 w-auto object-contain rounded-lg shadow-sm bg-white p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes conveyorScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .conveyor-track { will-change: transform; }
        .conveyor-track:hover { animation-play-state: paused !important; }

        /* make the conveyor visually full-bleed on large screens */
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
