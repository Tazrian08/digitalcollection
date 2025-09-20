import React, { useEffect, useState } from 'react';
import SmallSlider from './SmallSlider';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const positions = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

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
        // Map to image URLs
        const grouped: Record<string, string[]> = {};
        positions.forEach(pos => {
          grouped[pos] = (data.ads[pos] || []).map((ad: any) => `${apiBaseUrl}${ad.image}`);
        });
        setAds(grouped);
      } catch {
        // fallback: empty
      }
    };
    fetchAds();
  }, []);

  const tileClampStyle: React.CSSProperties = {
    height: 'clamp(300px, 42vh, 38vw)',
  };

  const WRAPPER_FULLWIDTH_ALL = '[&>div]:!max-w-none [&>div]:!w-full [&>div]:!mx-0';

  const Tile: React.FC<{ images: string[] }> = ({ images }) => (
    <div className="w-full">
      <div
        className={`aspect-[16/9] md:aspect-auto ${WRAPPER_FULLWIDTH_ALL} overflow-visible md:overflow-hidden rounded-none md:rounded-3xl`}
        style={tileClampStyle}
      >
        <SmallSlider images={images} height="h-full" />
      </div>
    </div>
  );

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-6">
      <div className="w-screen grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-4 md:gap-y-3 px-0 md:px-0">
        <Tile images={ads.topLeft} />
        <Tile images={ads.topRight} />
        <Tile images={ads.bottomLeft} />
        <Tile images={ads.bottomRight} />
      </div>
    </section>
  );
};

export default QuadSliderSection;
