import React, { useEffect, useState } from "react";

interface SmallSliderProps {
  images: string[];
  height?: string;
}

const SmallSlider: React.FC<SmallSliderProps> = ({ images, height = "h-[20vh] md:h-[28vh] lg:h-[34vh]" }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  const handlePrev = () => setCurrent((current - 1 + images.length) % images.length);
  const handleNext = () => setCurrent((current + 1) % images.length);

  if (!images.length) return <div className={`bg-gray-200 ${height} flex items-center justify-center rounded-2xl`}>No images</div>;

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden`}>
      <img
        src={images[current]}
        alt={`slide-${current}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
      />
      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-sky-100 transition z-10"
            aria-label="Previous"
          >
            <svg width="20" height="20" fill="none"><path d="M13 16l-5-6 5-6" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-sky-100 transition z-10"
            aria-label="Next"
          >
            <svg width="20" height="20" fill="none"><path d="M7 4l5 6-5 6" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </>
      )}
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === current ? "bg-sky-500" : "bg-white/60"} border border-sky-200`}
          />
        ))}
      </div>
    </div>
  );
};

export default SmallSlider;