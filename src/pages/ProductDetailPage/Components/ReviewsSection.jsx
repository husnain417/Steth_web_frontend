"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"

// Sample review data
const initialReviewsData = {
  averageRating: 4.5,
  totalReviews: 5768,
  reviews: [
    {
      id: 1,
      rating: 5,
      date: "February 1, 2025",
      title: "fits perfect and arrived on",
      content: "fits perfect and arrived on time",
      isExpanded: false,
    },
    {
      id: 2,
      rating: 5,
      date: "January 26, 2025",
      title: "Mens Navy Chisec Three Pocket Scrubs top",
      content:
        "Amazing Quality. As well the perfect scrubs for all ER nurses Needing always an extra pocket Super well suites Cruise ship Nurses as they are required to wear only Navy Blue Will. Definitely recommend to Nurses at Sea as the svrubs it self are super comfortable and the material is very soft and breathable. The pockets are deep enough to hold all necessary items and the fit is true to size. I've been wearing these for 12 hour shifts and they still look great at the end of the day.",
      isExpanded: false,
    },
    {
      id: 3,
      rating: 4,
      date: "January 15, 2025",
      title: "Great quality, slightly large",
      content:
        "The quality of these scrubs is excellent. The material feels durable yet comfortable. My only issue is that they run slightly large. I would recommend sizing down if you're between sizes.",
      isExpanded: false,
    },
    {
      id: 4,
      rating: 5,
      date: "December 28, 2024",
      title: "Best scrubs I've ever owned",
      content:
        "After trying multiple brands, these are by far the best scrubs I've ever owned. The fit is perfect and the material is so comfortable for long shifts. Will definitely be ordering more colors.",
      isExpanded: false,
    },
  ],
  // Additional reviews that will be loaded when clicking "Load More"
  additionalReviews: [
    {
      id: 5,
      rating: 5,
      date: "December 15, 2024",
      title: "Excellent product, highly recommend",
      content:
        "I've been using these for about a month now and they've held up really well through multiple washes. The color hasn't faded at all and they're still as comfortable as day one.",
      isExpanded: false,
    },
    {
      id: 6,
      rating: 4,
      date: "November 30, 2024",
      title: "Good value for money",
      content:
        "These are definitely worth the price. They're comfortable, durable, and look professional. The only reason I'm giving 4 stars instead of 5 is that I wish they had more color options.",
      isExpanded: false,
    },
    {
      id: 7,
      rating: 5,
      date: "November 22, 2024",
      title: "Perfect fit and great quality",
      content:
        "I was hesitant to order online without trying them on first, but these fit perfectly according to the size chart. The quality is excellent and they're very comfortable for long shifts.",
      isExpanded: false,
    },
    {
      id: 8,
      rating: 5,
      date: "November 10, 2024",
      title: "Exactly what I needed",
      content:
        "These are exactly what I was looking for. The material is lightweight but durable, and the pockets are perfectly placed. Will definitely be ordering more.",
      isExpanded: false,
    },
  ],
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState(initialReviewsData.reviews)
  const [hasMoreReviews, setHasMoreReviews] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Refs for GSAP animations
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const summaryRef = useRef(null)
  const reviewRefs = useRef([])
  const loadMoreRef = useRef(null)

  useEffect(() => {
    // Make sure all elements are visible first in case animation fails
    gsap.set([headerRef.current, summaryRef.current, ...reviewRefs.current, loadMoreRef.current], {
      opacity: 1,
      visibility: "visible",
    })

    // Then apply animations with a slight delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Simple fade-in animations that won't interfere with visibility
        gsap.from(headerRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => {
            // Ensure element is visible after animation
            gsap.set(headerRef.current, { opacity: 1, visibility: "visible" })
          },
        })

        gsap.from(summaryRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          delay: 0.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(summaryRef.current, { opacity: 1, visibility: "visible" })
          },
        })

        // Animate reviews with stagger
        reviewRefs.current.forEach((ref, index) => {
          if (ref) {
            gsap.from(ref, {
              y: 20,
              opacity: 0,
              duration: 0.5,
              delay: 0.3 + index * 0.1,
              ease: "power2.out",
              onComplete: () => {
                gsap.set(ref, { opacity: 1, visibility: "visible" })
              },
            })
          }
        })

        if (loadMoreRef.current) {
          gsap.from(loadMoreRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 0.5 + reviewRefs.current.length * 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(loadMoreRef.current, { opacity: 1, visibility: "visible" })
              setAnimationComplete(true)
            },
          })
        }
      } catch (error) {
        console.error("Animation error:", error)
        // If animation fails, make sure everything is visible
        gsap.set([headerRef.current, summaryRef.current, ...reviewRefs.current, loadMoreRef.current], {
          opacity: 1,
          visibility: "visible",
        })
        setAnimationComplete(true)
      }
    }, 100)

    return () => {
      // Cleanup animations on unmount
      gsap.killTweensOf([headerRef.current, summaryRef.current, ...reviewRefs.current, loadMoreRef.current])
    }
  }, [])

  // Update refs when reviews change
  useEffect(() => {
    // Reset refs array to match current reviews length
    reviewRefs.current = reviewRefs.current.slice(0, reviews.length)

    // If we've loaded new reviews, animate them
    if (reviews.length > initialReviewsData.reviews.length && animationComplete) {
      const newReviewElements = reviewRefs.current.slice(initialReviewsData.reviews.length)

      // Make sure new elements are visible first
      gsap.set(newReviewElements, { opacity: 1, visibility: "visible" })

      // Then animate them
      newReviewElements.forEach((ref, index) => {
        if (ref) {
          gsap.from(ref, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(ref, { opacity: 1, visibility: "visible" })
            },
          })
        }
      })
    }
  }, [reviews, animationComplete])

  const toggleReadMore = (id) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === id) {
          return { ...review, isExpanded: !review.isExpanded }
        }
        return review
      }),
    )
  }

  const loadMoreReviews = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setReviews([...reviews, ...initialReviewsData.additionalReviews])
      setHasMoreReviews(false) // No more reviews to load after this
      setIsLoading(false)
    }, 800)
  }

  // Function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 md:w-5 md:h-5 ${star <= rating ? "text-black" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-100" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 text-black">
        {/* Header - Made responsive for mobile */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 sm:gap-0"
          style={{ opacity: 1 }} // Ensure visibility even before animations
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">The Reviews Are In</h2>
          <button className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 border-2 border-black text-black bg-white rounded-none font-medium hover:bg-black hover:text-white transition-colors text-sm md:text-base">
            SEE ALL REVIEWS
          </button>
        </div>

        {/* Rating Summary */}
        <div
          ref={summaryRef}
          className="bg-white border border-gray-100 p-6 md:p-8 mb-6 text-center"
          style={{ opacity: 1 }} // Ensure visibility even before animations
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">4.5/5</div>
          <div className="flex justify-center mb-2">{renderStars(4.5)}</div>
          <p className="text-sm md:text-base text-gray-600">
            Based On {initialReviewsData.totalReviews.toLocaleString()} Reviews
          </p>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4 md:space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white border border-gray-100 p-4 md:p-6"
              ref={(el) => (reviewRefs.current[index] = el)}
              style={{ opacity: 1 }} // Ensure visibility even before animations
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-gray-600 text-xs md:text-sm">{review.date}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{review.title}</h3>
              <div className="text-gray-700 text-sm md:text-base">
                {review.content.length > 150 && !review.isExpanded ? (
                  <>
                    <p>{review.content.substring(0, 150)}...</p>
                    <button
                      onClick={() => toggleReadMore(review.id)}
                      className="bg-black rounded-none font-medium mt-2 hover:underline text-white px-3 py-1 text-xs md:text-sm"
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  <>
                    <p>{review.content}</p>
                    {review.content.length > 150 && (
                      <button
                        onClick={() => toggleReadMore(review.id)}
                        className="text-black font-medium mt-2 hover:underline text-xs md:text-sm"
                      >
                        Read Less
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreReviews && (
          <div
            className="mt-6 md:mt-8 text-center"
            ref={loadMoreRef}
            style={{ opacity: 1 }} // Ensure visibility even before animations
          >
            <button
              onClick={loadMoreReviews}
              disabled={isLoading}
              className="px-6 md:px-8 py-2 md:py-3 border-2 bg-black text-white rounded-none border-black font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isLoading ? "Loading..." : "LOAD MORE"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
