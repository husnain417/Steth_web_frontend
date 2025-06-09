"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const ColorTileCarousel = () => {
  const [colorTiles, setColorTiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({ width: 2356, height: 1780 }); // Default dimensions
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const directionRef = useRef('next');

  useEffect(() => {
    const fetchColorTiles = async () => {
      try {
        const response = await fetch('https://steth-backend.onrender.com/api/color-tiles/');
        const data = await response.json();
        setColorTiles(data);
        setPrevIndex(data.length - 1);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching color tiles:', error);
        setIsLoading(false);
      }
    };

    fetchColorTiles();
  }, []);

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

  const handleImageLoad = (e) => {
    const img = e.target;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  useEffect(() => {
    if (carouselRef.current && colorTiles.length > 0) {
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
  }, [activeIndex, prevIndex, colorTiles.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isTouching && !isAnimating) nextSlide();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTouching, isAnimating]);

  if (isLoading) {
    return (
      <div className="relative w-full bg-white py-8 my-20">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (colorTiles.length === 0) {
    return (
      <div className="relative w-full bg-white py-8 my-20">
        <div className="flex justify-center items-center h-[40vh]">
          <p className="text-gray-500">No color tiles available</p>
        </div>
      </div>
    );
  }

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
          <div className="relative w-full">
            {colorTiles.map((tile, index) => (
              <div
                key={tile._id}
                className={`color-tile absolute inset-x-0 mx-4 sm:mx-8 md:mx-12 flex justify-center items-center
                            ${index !== activeIndex && index !== prevIndex ? "opacity-0" : "opacity-100"}`}
                style={{ zIndex: index === activeIndex ? 5 : (index === prevIndex ? 10 : 0) }}
              >
                <div className="w-full relative shadow-md">
                  {tile.imageUrl ? (
                    <div className="w-full flex justify-center items-center">
                      <img
                        src={tile.imageUrl}
                        alt={tile.name}
                        className="w-full h-auto"
                        onLoad={handleImageLoad}
                        style={{ 
                          aspectRatio: `${imageDimensions.width}/${imageDimensions.height}`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: tile.color,
                        aspectRatio: `${imageDimensions.width}/${imageDimensions.height}`,
                        maxWidth: '100%'
                      }}
                    >
                      <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest">
                        {tile.name}
                      </h3>
                    </div>
                  )}
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