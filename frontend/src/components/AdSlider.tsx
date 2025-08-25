import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Circle, CircleDot } from 'lucide-react';

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

const AdSlider: React.FC<AdSliderProps> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? ads.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % ads.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 15000);

    return () => clearInterval(interval);
  }, [currentIndex, ads.length]);

  if (!ads || ads.length === 0) {
    return (
      <section className="w-full">
        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600">No ads available</p>
        </div>
      </section>
    );
  }

  const currentAd = ads[currentIndex];
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <section className="w-full relative">
      <div className="w-full overflow-hidden">
        {currentAd.link ? (
          <a href={currentAd.link}>
            <img
              src={`${apiBaseUrl}${currentAd.image}`}
              alt={currentAd.title}
              className="w-full h-auto object-cover"
            />
          </a>
        ) : (
          <img
            src={`${apiBaseUrl}${currentAd.image}`}
            alt={currentAd.title}
            className="w-full h-auto object-cover"
          />
        )}
      </div>
      
      {/* Navigation arrows */}
      {ads.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all duration-300"
            aria-label="Previous ad"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-all duration-300"
            aria-label="Next ad"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
                  <Circle className="h-5 w-5 text-white/50 hover:text-white" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default AdSlider;