"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import logo from "../assets/logo.png"

const Header = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Women")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const headerRef = useRef(null)
  const logoRef = useRef(null)
  const navItemsRef = useRef([])
  const searchRef = useRef(null)
  const iconsRef = useRef(null)
  const sliderRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isSearchOverlayActive, setIsSearchOverlayActive] = useState(false)

  // Check if user is logged in on component mount and when token changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken")
      setIsLoggedIn(!!token)
    }

    // Check initial login status
    checkLoginStatus()

    // Listen for storage changes to update login status
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  // Add effect to track cart items count
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
      // Count unique items instead of total quantities
      const uniqueItems = new Set(cartItems.map((item) => `${item.id}-${item.colorName}-${item.size}`))
      setCartCount(uniqueItems.size)
    }

    // Initial count
    updateCartCount()

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount)

    // Also listen for custom event when cart is updated
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden"
  }

  // Clean up effect
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])
  
  useEffect(() => {
    // Text Slider Animation
    const slider = sliderRef.current
    if (!slider) return

    const sliderContent = slider.querySelector(".slider-content")
    if (!sliderContent) return

    // Create multiple copies for smoother transition
    const items = sliderContent.querySelectorAll(".slider-item")
    if (!items.length) return

    // Clear existing content and create a proper loop
    sliderContent.innerHTML = ""

    // Add multiple copies for a smoother infinite loop
    for (let i = 0; i < 4; i++) {
      items.forEach((item) => {
        sliderContent.appendChild(item.cloneNode(true))
      })
    }

    // Set initial position
    gsap.set(sliderContent, { x: 0 })

    // Create the infinite scroll animation
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "linear" },
    })

    // Calculate the width of a single set of items
    const singleSetWidth = sliderContent.scrollWidth / 4

    tl.to(sliderContent, {
      x: -singleSetWidth,
      duration: 50, // Increased duration to reduce speed (was 8)
      ease: "linear", // Use linear for smooth constant speed
      onComplete: () => {
        // Reset position without animation for seamless loop
        gsap.set(sliderContent, { x: 0 })
      },
    })

    // Cleanup
    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    // GSAP animations on mount for header elements
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
    )

    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.7)",
      },
    )

    // Animate nav items one by one
    navItemsRef.current.forEach((item, index) => {
      gsap.fromTo(
        item,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: 0.4 + index * 0.1,
          ease: "power2.out",
        },
      )
    })

    gsap.fromTo(
      searchRef.current,
      { width: "0%", opacity: 0 },
      {
        width: "100%",
        opacity: 1,
        duration: 0.8,
        delay: 0.7,
        ease: "power2.inOut",
      },
    )

    gsap.fromTo(
      iconsRef.current,
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.9,
        ease: "power2.out",
      },
    )
  }, [])

  // Animation for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        ".mobile-menu-container",
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
      )
    }
  }, [isMenuOpen])

  // Debounced search function
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300) // 300ms delay for debouncing

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const performSearch = async (query) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("https://steth-backend.onrender.com/api/products")
      const data = await response.json()

      if (data.success && data.data) {
        const filteredResults = data.data.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.gender.toLowerCase().includes(query.toLowerCase()),
        )

        setSearchResults(filteredResults.slice(0, 5)) // Limit to 5 results
        setShowResults(true)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleResultClick = (productId) => {
    // Navigate to product page or handle result click
    window.location.href = `/product/${productId}`
    setShowResults(false)
    setSearchQuery("")
  }

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true)
    }
  }

  const handleSearchBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <>
      <style jsx>{`
/* Custom responsive styles */
@media (min-width: 768px) and (max-width: 1023px) {
  .search-container {
    width: 160px !important;
  }
  .nav-spacing {
    gap: 1rem !important;
  }
  .logo-text {
    font-size: 1.25rem !important;
  }
}

/* Specific fix for 770px-880px range */
@media (min-width: 770px) and (max-width: 880px) {
  .search-container {
    width: 140px !important;
    margin-right: 1rem !important;
  }
  .icons-container {
    margin-left: auto !important;
  }
  .logo-container {
    margin-right: auto !important;
  }
}

/* NEW: Fix for 1025px-1110px overlap issue */
@media (min-width: 1000px) and (max-width: 1110px) {
  .search-container {
    max-width: 130px !important;
  }
  .nav-spacing {
    gap: 0.6rem !important; /* Reduced from default spacing */
  }
  .logo-text {
    font-size: 1rem !important;
  }
  /* Reduce navigation font size to save space */
  .nav-spacing a {
    font-size: 0.875rem !important; /* 14px */
  }
  /* Tighten header padding */
  .header-padding {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
  /* Reduce logo spacing */
  .logo-container {
    margin-left: 0 !important;
  }
  .icons-container {
    margin-right: 0 !important;
  }
}

/* Updated: Unified styles for 1024px-1284px range */
@media (min-width: 1024px) and (max-width: 1284px) {
  .search-container {
    width: 180px !important;
  }
  .nav-spacing {
    gap: 1.5rem !important;
  }
  .logo-text {
    font-size: 1.5rem !important;
  }
  .nav-spacing a {
    font-size: 0.9rem !important;
  }
  .header-padding {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
  .logo-container {
    margin-left: 0 !important;
  }
  .icons-container {
    margin-right: 0 !important;
  }
}

/* Updated: Unified styles for 1285px-1400px range */
@media (min-width: 1285px) and (max-width: 1400px) {
  .search-container {
    width: 180px !important;
    max-width: 180px !important;
  }
  .nav-spacing {
    gap: 1.5rem !important;
  }
  .nav-spacing a {
    font-size: 0.9rem !important;
  }
  .logo-text {
    font-size: 1.5rem !important;
  }
  .header-padding {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
  .logo-container {
    margin-left: 0 !important;
  }
  .icons-container {
    margin-right: 0 !important;
  }
}

@media (min-width: 1279px) and (max-width: 1535px) {
  .search-container {
    width: 210px !important;
  }
  .nav-spacing {
    gap: 1rem !important;
  }
}

@media (min-width: 1536px) {
  .search-container {
    width: 256px !important;
  }
}

/* Compact header for small laptops */
@media (min-width: 768px) and (max-width: 1279px) {
  .header-padding {
    padding-left: 1.5rem !important;
    padding-right: 1.5rem !important;
  }
  .logo-container {
    margin-left: 0 !important;
  }
  .icons-container {
    margin-right: 0 !important;
  }
}
      `}</style>
      
      <header ref={headerRef} className={`w-full z-50 sticky top-0 ${className}`}>
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-3 lg:py-4 border-b bg-white shadow-md header-padding px-4 lg:px-10">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <a href="/" className="flex items-center logo-container ml-0 lg:ml-10" ref={logoRef}>
              <img src={logo || "/placeholder.svg"} alt="STETH Logo" className="h-14 lg:h-20 w-auto" />
              <h1 className="text-xl lg:text-3xl logo-text text-black">STETH</h1>
            </a>
          </div>

          {/* Center Navigation - More responsive */}
          <nav className="hidden lg:flex justify-center nav-spacing space-x-4 lg:space-x-6 xl:space-x-10 absolute left-1/2 transform -translate-x-1/2 z-10">
            {["Women", "Men", "Students", "About STETH"].map((item, index) => (
              <a
                key={item}
                href={item === "About STETH" ? "/aboutus" : `/${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-700 hover:text-gray-900 transition-colors text-xs md:text-sm lg:text-base font-medium whitespace-nowrap"
                ref={(el) => (navItemsRef.current[index] = el)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-2 lg:space-x-4 icons-container mr-0 lg:mr-10">
            {/* Hamburger Menu for 770px-880px */}
            <button 
              onClick={toggleMenu} 
              className="lg:hidden text-black bg-white p-2 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Search - Responsive sizing */}
            {!isSearchOverlayActive ? (
              <div className="relative search-container w-40 md:w-48 lg:w-64" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    setIsSearchOverlayActive(true)
                    handleSearchFocus()
                  }}
                  className="w-full px-3 lg:px-4 py-1.5 lg:py-2 pl-10 lg:pl-12 text-sm lg:text-base rounded-3xl bg-gray-200 border-gray-200 focus:border-navy-blue focus:outline-none transition-colors text-gray-700"
                />
                <svg
                  className="absolute left-3 lg:left-4 top-2 lg:top-2.5 h-4 lg:h-5 w-4 lg:w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            ) : null}

            {/* Full Screen Search Overlay */}
            {isSearchOverlayActive && (
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[9999]">
                <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search products, category, gender ..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={handleSearchFocus}
                        onBlur={(e) => {
                          if (!e.relatedTarget?.closest(".search-overlay-content")) {
                            setTimeout(() => {
                              setShowResults(false)
                            }, 200)
                          }
                        }}
                        className="w-full px-4 lg:px-6 py-2.5 lg:py-3 pl-12 lg:pl-14 pr-4 lg:pr-6 text-sm lg:text-base rounded-2xl bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
                        autoFocus
                      />
                      <svg
                        className="absolute left-4 lg:left-5 top-3 lg:top-4 h-4 lg:h-5 w-4 lg:w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>

                    <button
                      onClick={() => {
                        setIsSearchOverlayActive(false)
                        setSearchQuery("")
                        setSearchResults([])
                        setShowResults(false)
                      }}
                      className="p-2 rounded-full transition-colors bg-gray-100 hover:bg-gray-200"
                      title="Close search"
                    >
                      <svg className="h-4 lg:h-5 w-4 lg:w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Search Results in Overlay */}
                  {showResults && (
                    <div className="search-overlay-content mt-3 lg:mt-4 bg-white rounded-xl border border-gray-200 shadow-lg max-h-72 lg:max-h-80 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 lg:p-6 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-5 lg:h-6 w-5 lg:w-6 border-b-2 border-gray-900 mx-auto"></div>
                          <span className="mt-2 lg:mt-3 block text-xs lg:text-sm">Searching...</span>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2 lg:p-3">
                          <h3 className="text-xs lg:text-sm font-semibold text-gray-900 mb-2 lg:mb-3 px-1">Search Results</h3>
                          <div className="space-y-1 lg:space-y-2">
                            {searchResults.map((product) => (
                              <div
                                key={product._id}
                                onClick={() => {
                                  handleResultClick(product._id)
                                  setIsSearchOverlayActive(false)
                                }}
                                className="flex items-center p-2 lg:p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100 transition-colors"
                              >
                                <img
                                  src={product.defaultImages[0]?.url || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  className="w-8 lg:w-10 h-8 lg:h-10 object-cover rounded-md mr-2 lg:mr-3 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {product.category} • {product.gender} • PKR {product.price.toLocaleString()}
                                  </p>
                                </div>
                                <svg
                                  className="h-3 lg:h-4 w-3 lg:w-4 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : searchQuery.trim() ? (
                        <div className="p-4 lg:p-6 text-center text-gray-500">
                          <svg
                            className="h-6 lg:h-8 w-6 lg:w-8 text-gray-300 mx-auto mb-2 lg:mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <p className="text-xs lg:text-sm">No products found for "{searchQuery}"</p>
                          <p className="text-xs mt-1">Try searching with different keywords</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 lg:space-x-4" ref={iconsRef}>
              {isLoggedIn ? (
                <a href="/profile" className="hover:text-gray-900 transition-colors" title="Profile">
                  <svg className="h-5 lg:h-6 w-5 lg:w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </a>
              ) : (
                <a
                  href="/login"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-xs lg:text-sm font-medium"
                  title="Login"
                >
                  Login
                </a>
              )}
              <a href="/cart" className="hover:text-gray-900 transition-colors relative" title="Cart">
                <svg className="h-5 lg:h-6 w-5 lg:w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 lg:h-5 w-4 lg:w-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white">
          <button onClick={toggleMenu} className="text-black bg-white p-2 hover:text-gray-600 transition-colors z-50">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="/" className="flex items-center">
            <img src={logo || "/placeholder.svg"} alt="STETH Logo" className="h-10 sm:h-12" />
            <h1 className="text-lg sm:text-xl text-black ml-1">STETH</h1>
          </a>

          <div className="flex items-center px-3">
            <a href="/cart" className="relative">
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* Mobile Menu Overlay - Simplified */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-[9999]">
            {/* Top Navigation */}
            <div className="border-b">
              <div className="px-4 py-3 flex items-center justify-between">
                <button onClick={toggleMenu} className="p-2 bg-white">
                  <svg className="h-6 w-6 bg-white text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Keep the logo in the mobile menu header */}
                <a href="/" className="flex items-center">
                  <img src={logo || "/placeholder.svg"} alt="STETH Logo" className="h-10" />
                  <h1 className="text-lg text-black ml-1">STETH</h1>
                </a>
                <div className="w-6"></div> {/* Spacer for alignment */}
              </div>
            </div>

            {/* Simplified Mobile Menu */}
            <div className="h-[calc(100vh-120px)] overflow-y-auto px-4 py-4 bg-white">
              <nav className="space-y-4 sm:space-y-6">
                <a
                  href="/women"
                  className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2"
                >
                  WOMENS
                </a>
                <a
                  href="/men"
                  className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2"
                >
                  MENS
                </a>
                
                <a href="/students" className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2">
                  STUDENTS
                </a>
                
                <a href="/aboutus" className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2">
                  ABOUT US
                </a>

                <div className="pt-4 border-t border-gray-200">
                  {!isLoggedIn ? (
                    <a
                      href="/login"
                      className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2"
                    >
                      LOGIN
                    </a>
                  ) : (
                    <a
                      href="/profile"
                      className="flex items-center text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      PROFILE
                    </a>
                  )}
                  <a
                    href="/cart"
                    className="block text-base sm:text-lg font-medium py-2 text-black hover:bg-gray-100 transition-colors rounded px-2"
                  >
                    CART
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Mobile Search */}
        <div className="md:hidden px-4 py-2 border-b bg-white">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full px-4 py-2 pl-12 text-sm sm:text-base rounded-3xl bg-gray-200 text-black border-gray-200 focus:border-gray-400 focus:outline-none transition-colors"
            />
            <svg 
              className="absolute left-4 top-3 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>


            {/* Mobile Search Results */}
            {showResults && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    <span className="mt-2 block text-sm">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            handleResultClick(product._id)
                          }}
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100 transition-colors"
                        >
                          <img
                            src={product.defaultImages[0]?.url || "/placeholder.svg?height=60&width=60"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {product.category} • {product.gender} • PKR {product.price.toLocaleString()}
                            </p>
                          </div>
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-gray-500">
                    <svg
                      className="h-8 w-8 text-gray-300 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm">No products found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching with different keywords</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Text Slider - Positioned at the top */}
      <div ref={sliderRef} className="w-full bg-white text-white overflow-hidden h-8">
        <div className="slider-content flex whitespace-nowrap">
          <div className="slider-item text-black flex-shrink-0 ml-10 mr-10  text-xs sm:text-sm font-medium py-2">
            Free delivery on orders over PKR 5000
          </div>
          <div className="slider-item text-white flex-shrink-0 ml-10 mr-10  text-xs sm:text-sm font-medium py-2">
            Free delivery on orders over PKR 5000
          </div>

          <div className="slider-item text-black flex-shrink-0 mr-10 ml-10 text-xs sm:text-sm font-medium py-2">
            Free delivery on orders over PKR 5000
          </div>
          <div className="slider-item text-white flex-shrink-0 ml-10 mr-10  text-xs sm:text-sm font-medium py-2">
            Free delivery on orders over PKR 5000
          </div>
        </div>
      </div>
    </>
  )
}

export default Header