"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useNavigate } from "react-router-dom"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Updated color tile data with the requested colors
const colorTiles = [
  {
    id: 1,
    name: "BLACK",
    color: "#000000",
  },
  {
    id: 2,
    name: "EMERALD",
    color: "#50C878",
  },
  {
    id: 3,
    name: "NAVY BLUE",
    color: "#000080",
  },
  {
    id: 4,
    name: "MAROON",
    color: "#800000",
  },
  {
    id: 5,
    name: "CEIL BLUE",
    color: "#92A1CF",
  },
]

const ColorTileCarousel = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(colorTiles.length - 1)
  const [isTouching, setIsTouching] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const directionRef = useRef("next")

  // Function to handle color tile click - UPDATED to navigate to color products page
  const handleColorTileClick = (colorName) => {
    // Navigate to the color products page with the color name
    navigate(`/color-products/${encodeURIComponent(colorName.toLowerCase())}`)
  }

  // Function to move to the next slide
  const nextSlide = () => {
    if (isAnimating) return

    directionRef.current = "next"
    setPrevIndex(activeIndex)
    setActiveIndex((prev) => (prev === colorTiles.length - 1 ? 0 : prev + 1))
  }

  // Function to move to the previous slide
  const prevSlide = () => {
    if (isAnimating) return

    directionRef.current = "prev"
    setPrevIndex(activeIndex)
    setActiveIndex((prev) => (prev === 0 ? colorTiles.length - 1 : prev - 1))
  }

  // Function to handle dot navigation
  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return

    // Determine direction based on index
    if (
      (index > activeIndex && !(activeIndex === 0 && index === colorTiles.length - 1)) ||
      (activeIndex === colorTiles.length - 1 && index === 0)
    ) {
      directionRef.current = "next"
    } else {
      directionRef.current = "prev"
    }

    setPrevIndex(activeIndex)
    setActiveIndex(index)
  }

  // Touch handlers for manual sliding
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setIsTouching(true)
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsTouching(false)
    const diff = touchStartX.current - touchEndX.current
    // If swipe distance is significant
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - move to next
        nextSlide()
      } else {
        // Swipe right - move to previous
        prevSlide()
      }
    }
  }

  // Setup animations
  useEffect(() => {
    // Animation for sliding tiles
    if (carouselRef.current) {
      const tiles = carouselRef.current.querySelectorAll(".color-tile")
      const prevTile = tiles[prevIndex]
      const activeTile = tiles[activeIndex]

      if (prevTile && activeTile) {
        setIsAnimating(true)

        if (directionRef.current === "next") {
          // Next slide animation (prev exits left, new enters from right)
          gsap.set(prevTile, {
            x: 0,
            opacity: 1,
            zIndex: 10,
          })
          gsap.set(activeTile, {
            x: "100%",
            opacity: 1,
            zIndex: 5,
          })

          const tl = gsap.timeline({
            onComplete: () => {
              setIsAnimating(false)
            },
          })

          tl.to(prevTile, {
            x: "-100%",
            duration: 0.8,
            ease: "power2.inOut",
          })

          tl.to(
            activeTile,
            {
              x: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "-=0.8",
          )
        } else {
          // Previous slide animation (prev exits right, new enters from left)
          gsap.set(prevTile, {
            x: 0,
            opacity: 1,
            zIndex: 10,
          })
          gsap.set(activeTile, {
            x: "-100%",
            opacity: 1,
            zIndex: 5,
          })

          const tl = gsap.timeline({
            onComplete: () => {
              setIsAnimating(false)
            },
          })

          tl.to(prevTile, {
            x: "100%",
            duration: 0.8,
            ease: "power2.inOut",
          })

          tl.to(
            activeTile,
            {
              x: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "-=0.8",
          )
        }
      }
    }
  }, [activeIndex, prevIndex])

  // Auto-slide effect
  useEffect(() => {
    // Auto-slide functionality
    intervalRef.current = setInterval(() => {
      if (!isTouching && !isAnimating) {
        nextSlide()
      }
    }, 5000) // Longer interval for better viewing of each slide

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTouching, isAnimating])

  return (
    <div className="relative w-full bg-white py-8 my-20">
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="relative w-full flex flex-col items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Color tiles */}
        <div className="relative w-full h-[40vh] overflow-hidden">
          {colorTiles.map((tile, index) => (
            <div
              key={tile.id}
              className={`color-tile absolute inset-0 mx-4 sm:mx-8 md:mx-12 flex justify-center items-center
                          ${index !== activeIndex && index !== prevIndex ? "opacity-0" : "opacity-100"}`}
              style={{ zIndex: index === activeIndex ? 5 : index === prevIndex ? 10 : 0 }}
              onClick={() => handleColorTileClick(tile.name)}
            >
              {/* Image/Color rectangular container */}
              <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-5xl aspect-[16/9] relative shadow-md cursor-pointer">
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: tile.color }}>
                  {/* Color name centered */}
                  <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-widest">
                    {tile.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots outside and below the color tiles */}
        <div className="w-full flex justify-center items-center mt-4 space-x-4 py-2">
          {colorTiles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full`}
              style={{
                width: index === activeIndex ? "12px" : "10px",
                height: index === activeIndex ? "12px" : "10px",
                backgroundColor: index === activeIndex ? "#000000" : "#d1d5db",
                opacity: index === activeIndex ? 1 : 0.5,
              }}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Navigation arrows - positioned in the middle of the color tile */}
        <button
          onClick={prevSlide}
          className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-black bg-transparent rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl z-20"
          style={{ top: "20vh" }} // Position exactly in the middle of the color tile (40vh/2)
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 border-none text-black bg-transparent rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl z-20"
          style={{ top: "20vh" }} // Position exactly in the middle of the color tile (40vh/2)
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default ColorTileCarousel
