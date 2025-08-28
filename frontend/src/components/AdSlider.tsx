import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";

interface Ad {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface AdSliderProps {
  ads: Ad[];
}

const FADE_MS = 1000; // transition length

const AdSlider: React.FC<AdSliderProps> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false); // toggled just after mount of next img

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Heights (like a hero banner)
  const bannerHeights = "h-[42vh] md:h-[58vh] lg:h-[72vh] xl:h-[78vh]";
  const sectionBleed =
    "relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden";

  // Preload the next image for smoother switch
  useEffect(() => {
    if (ads.length > 1) {
      const next = (currentIndex + 1) % ads.length;
      const img = new Image();
      img.src = `${apiBaseUrl}${ads[next].image}`;
    }
  }, [ads, currentIndex, apiBaseUrl]);

  const startCrossfade = (to: number) => {
    if (to === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(to);
    setIsCrossfading(true);
    setShowCurrent(false);
    // kick off fade on next frame so CSS transitions apply
    requestAnimationFrame(() => setShowCurrent(true));
    // end animation after FADE_MS
    const t = setTimeout(() => {
      setIsCrossfading(false);
      setPrevIndex(null);
    }, FADE_MS);
    return () => clearTimeout(t);
  };

  const goToPrevious = () => {
    const to = currentIndex === 0 ? ads.length - 1 : currentIndex - 1;
    startCrossfade(to);
  };

  const goToNext = () => {
    const to = (currentIndex + 1) % ads.length;
    startCrossfade(to);
  };

  const goToSlide = (index: number) => startCrossfade(index);

  // Auto-play
  useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(goToNext, 7000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [currentIndex, ads.length]);

  if (!ads || ads.length === 0) {
    return (
      <section className={sectionBleed}>
        <div className={`w-screen ${bannerHeights} bg-gray-200 flex items-center justify-center`}>
          <p className="text-gray-600">No ads available</p>
        </div>
      </section>
    );
  }

  const currentAd = ads[currentIndex];
  const prevAd = prevIndex != null ? ads[prevIndex] : null;

  // Shared class for the images
  const imgBase =
    "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-opacity";

  return (
    <section className={sectionBleed}>
      <div className={`relative w-screen ${bannerHeights}`}>
        {/* Previous image (fades out) */}
        {isCrossfading && prevAd && (
          <img
            src={`${apiBaseUrl}${prevAd.image}`}
            alt={prevAd.title}
            className={`${imgBase} opacity-${showCurrent ? "0" : "100"}`}
          />
        )}

        {/* Current image (fades in) */}
        {currentAd.link ? (
          <a href={currentAd.link} className="block w-full h-full">
            <img
              src={`${apiBaseUrl}${currentAd.image}`}
              alt={currentAd.title}
              className={`${imgBase} ${isCrossfading ? (showCurrent ? "opacity-100" : "opacity-0") : "opacity-100"}`}
            />
          </a>
        ) : (
          <img
            src={`${apiBaseUrl}${currentAd.image}`}
            alt={currentAd.title}
            className={`${imgBase} ${isCrossfading ? (showCurrent ? "opacity-100" : "opacity-0") : "opacity-100"}`}
          />
        )}

        {/* Subtle gradient overlay (helps UI pop, DJI-like) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 pointer-events-none" />

        {/* Navigation */}
        {ads.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all duration-300"
              aria-label="Previous ad"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all duration-300"
              aria-label="Next ad"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="transition-all duration-300"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex ? (
                    <CircleDot className="h-5 w-5 text-white" fill="white" />
                  ) : (
                    <Circle className="h-5 w-5 text-white/60 hover:text-white" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdSlider;
