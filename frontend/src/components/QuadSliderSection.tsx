import React, { useEffect, useState } from 'react';
import SmallSlider from './SmallSlider';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const;

const QuadSliderSection: React.FC = () => {
  const [ads, setAds] = useState<Record<string, string[]>>({
    topLeft: [],
    topRight: [],
    bottomLeft: [],
    bottomRight: [],
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/quad-ads`);
        const data = await res.json();
        const grouped: Record<string, string[]> = {};
        positions.forEach(pos => {
          grouped[pos] = (data.ads?.[pos] || []).map((ad: any) => `${apiBaseUrl}${ad.image}`);
        });
        setAds(grouped);
      } catch {
        // ignore
      }
    };
    fetchAds();
  }, []);

  const Tile: React.FC<{ images: string[] }> = ({ images }) => (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-2xl quad-tile">
        <SmallSlider images={images} height="h-full" />
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden mb-6">
      {/* Full-bleed wrapper (prevents any page container from limiting width) */}
      <div className="quad-bleed">
        {/* On mobile/tablet this behaves like a normal container with padding.
            On lg+ we remove max-width and horizontal padding so tiles touch the edges. */}
        <div className="quad-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tile images={ads.topLeft} />
            <Tile images={ads.topRight} />
            <Tile images={ads.bottomLeft} />
            <Tile images={ads.bottomRight} />
          </div>
        </div>
      </div>

      <style>{`
        /* Keep sizing predictable */
        .quad-bleed, .quad-bleed * { box-sizing: border-box; }

        /* Mobile/tablet: standard heights */
        .quad-tile { height: clamp(180px, 28vh, 340px); }

        /* Let images fill their tile neatly */
        .quad-tile img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* On large screens: make the wrapper full viewport width (true edge-to-edge) */
        @media (min-width: 1024px) {
          .quad-bleed {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
          }
          /* Remove max-width + side padding so there’s no white space */
          .quad-container {
            max-width: none;
            padding-left: 0;
            padding-right: 0;
          }
          /* Slightly taller tiles on desktop */
          .quad-tile { height: clamp(320px, 40vh, 560px); }
        }
      `}</style>
    </section>
  );
};

export default QuadSliderSection;
