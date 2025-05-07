"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const colorTiles = [
  {
    id: 1,
    name: "BLACK",
    color: "#222222",
  },
  {
    id: 2,
    name: "NAVY",
    color: "#1D3461",
  },
  {
    id: 3,
    name: "MOSS",
    color: "#4A5D23",
  },
  {
    id: 4,
    name: "BURGUNDY",
    color: "#800020",
  },
  {
    id: 5,
    name: "SLATE",
    color: "#708090",
  },
]

const ColorTileCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(colorTiles.length - 1);
  const [isTouching, setIsTouching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const directionRef = useRef('next');

  const nextSlide = () => {
    if (isAnimating) return;
    directionRef.current = 'next';
    setPrevIndex(activeIndex);
    setActiveIndex((prev) => (prev === colorTiles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (isAnimating) return;
    directionRef.current = 'prev';
    setPrevIndex(activeIndex);
    setActiveIndex((prev) => (prev === 0 ? colorTiles.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return;
    
    if ((index > activeIndex && !(activeIndex === 0 && index === colorTiles.length - 1)) || 
        (activeIndex === colorTiles.length - 1 && index === 0)) {
      directionRef.current = 'next';
    } else {
      directionRef.current = 'prev';
    }
    
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsTouching(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      const tiles = carouselRef.current.querySelectorAll('.color-tile');
      const prevTile = tiles[prevIndex];
      const activeTile = tiles[activeIndex];
      
      if (prevTile && activeTile) {
        setIsAnimating(true);
        
        if (directionRef.current === 'next') {
          gsap.set(prevTile, { x: 0, opacity: 1, zIndex: 10 });
          gsap.set(activeTile, { x: '100%', opacity: 1, zIndex: 5 });
          
          const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
          });
          tl.to(prevTile, { x: '-100%', duration: 0.8, ease: "power2.inOut" });
          tl.to(activeTile, { x: 0, duration: 0.8, ease: "power2.inOut" }, '-=0.8');
        } else {
          gsap.set(prevTile, { x: 0, opacity: 1, zIndex: 10 });
          gsap.set(activeTile, { x: '-100%', opacity: 1, zIndex: 5 });
          
          const tl = gsap.timeline({
            onComplete: () => setIsAnimating(false)
          });
          tl.to(prevTile, { x: '100%', duration: 0.8, ease: "power2.inOut" });
          tl.to(activeTile, { x: 0, duration: 0.8, ease: "power2.inOut" }, '-=0.8');
        }
      }
    }
  }, [activeIndex, prevIndex]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isTouching && !isAnimating) nextSlide();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTouching, isAnimating]);

  return (
    <div className="relative w-full bg-white py-8 my-20">
      <div 
        ref={carouselRef}
        className="relative w-full flex flex-col items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl mx-auto">
          <div className="relative w-full h-[40vh] overflow-hidden">
            {colorTiles.map((tile, index) => (
              <div
                key={tile.id}
                className={`color-tile absolute inset-0 mx-4 sm:mx-8 md:mx-12 flex justify-center items-center
                            ${index !== activeIndex && index !== prevIndex ? "opacity-0" : "opacity-100"}`}
                style={{ zIndex: index === activeIndex ? 5 : (index === prevIndex ? 10 : 0) }}
              >
                <div className="w-full aspect-[16/9] relative shadow-md">
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: tile.color }}
                  >
                    <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest">
                      {tile.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 text-black bg-transparent rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl z-20"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 text-black bg-transparent rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl z-20"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="w-full flex justify-center items-center space-x-4 py-2">
          {colorTiles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-black scale-110" 
                  : "bg-gray-300 opacity-50 hover:opacity-70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorTileCarousel;