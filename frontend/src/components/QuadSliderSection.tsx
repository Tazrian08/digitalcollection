import React from 'react';
import SmallSlider from './SmallSlider';

/**
 * QuadSliderSection — final mobile arrows fix, desktop intact
 * - Mobile: full-width tiles, no side padding; allow overflow so the safe-area bar can render cleanly.
 * - Desktop: unchanged 2 columns, edge-aligned, uniform height via clamp.
 */

const quadImages: Record<string, string[]> = {
  topLeft: [
    'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&w=1200',
    'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&w=1200',
  ],
  topRight: [
    'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&w=1200',
    'https://images.pexels.com/photos/167832/pexels-photo-167832.jpeg?auto=compress&w=1200',
  ],
  bottomLeft: [
    'https://images.pexels.com/photos/167832/pexels-photo-167832.jpeg?auto=compress&w=1200',
    'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&w=1200',
  ],
  bottomRight: [
    'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&w=1200',
    'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&w=1200',
  ],
};

const tileClampStyle: React.CSSProperties = {
  height: 'clamp(300px, 42vh, 38vw)',
};

// Make the FIRST-LEVEL wrapper produced by SmallSlider full-width at all breakpoints
const WRAPPER_FULLWIDTH_ALL = '[&>div]:!max-w-none [&>div]:!w-full [&>div]:!mx-0';

const Tile: React.FC<{ images: string[] }> = ({ images }) => (
  <div className="w-full">
    {/* Mobile: keep 16:9; allow overflow so the arrow safe-area can breathe */}
    <div
      className={`aspect-[16/9] md:aspect-auto ${WRAPPER_FULLWIDTH_ALL} overflow-visible md:overflow-hidden rounded-none md:rounded-3xl`}
      style={tileClampStyle}
    >
      <SmallSlider images={images} height="h-full" />
    </div>
  </div>
);

const QuadSliderSection: React.FC = () => (
  <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-6">
    <div className="w-screen grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-4 md:gap-y-3 px-0 md:px-0">
      <Tile images={quadImages.topLeft} />
      <Tile images={quadImages.topRight} />
      <Tile images={quadImages.bottomLeft} />
      <Tile images={quadImages.bottomRight} />
    </div>
  </section>
);

export default QuadSliderSection;
