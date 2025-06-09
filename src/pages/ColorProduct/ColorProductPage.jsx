"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Filter, ArrowRight } from 'lucide-react'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link, useParams } from "react-router-dom"
import Header from "../../components/Header"
import AwsomeHumansFooter from "../../components/Footer"

export default function ColorProductsPage() {
  // Get color parameter from URL
  const { colorName } = useParams()
  const decodedColorName = colorName ? decodeURIComponent(colorName) : null

  // State for products
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)

  // Filter states - size and style still available for additional filtering
  const [sizeFilter, setSizeFilter] = useState("All")
  const [styleFilter, setStyleFilter] = useState("All")

  // Dropdown states
  const [sizeOpen, setSizeOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)

  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState([])

  // Refs for GSAP animations
  const heroRef = useRef(null)
  const productsRef = useRef(null)
  const productRefs = useRef([])
  const filterSectionRef = useRef(null)
  
  // Animation control flags
  const animationsInitialized = useRef(false)
  const isFirstLoad = useRef(true)

  // Client-side check
  useEffect(() => {
    setIsClient(true)
    // Register GSAP plugins only on client side
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)
    }
  }, [])

  // Reset productRefs when filteredProducts changes
  useEffect(() => {
    // Reset the refs array to the correct length
    productRefs.current = Array(filteredProducts.length).fill(null)
  }, [filteredProducts.length])

  // Size options
  const sizeOptions = ["All", "Extra Small", "Small", "Medium", "Large", "Extra Large"]
  const styleOptions = ["All", "Classic"]

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Reset animation flag when fetching new data
        animationsInitialized.current = false
        
        const response = await fetch("https://steth-backend.onrender.com/api/products")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const responseData = await response.json()

        if (!responseData.success) {
          throw new Error("API returned unsuccessful response")
        }

        // Transform and filter products in a single step
        const transformedProducts = responseData.data.reduce((acc, product) => {
          // Get unique colors from inventory
          const uniqueColors = [...new Set(product.inventory.map(item => item.color))];
          
          // Process each color as a separate product entry
          const colorVariants = uniqueColors.map((color) => ({
            id: `${product._id}-${color.replace(/\s+/g, "-").toLowerCase()}`,
            _id: product._id,
            name: product.name,
            price: product.price,
            color: color,
            colorCount: uniqueColors.length,
            primaryImage: product.defaultImages[0]?.url || "",
            images: product.defaultImages,
            colorSlug: color.replace(/\s+/g, "-").toLowerCase(),
          }))

          // If we have a color filter, only include matching variants
          if (decodedColorName && decodedColorName !== "All") {
            const filteredVariants = colorVariants.filter(
              variant => variant.color.toLowerCase() === decodedColorName.toLowerCase()
            )
            return [...acc, ...filteredVariants]
          }

          return [...acc, ...colorVariants]
        }, [])

        setProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [decodedColorName])

  // Enhanced GSAP animations with fallback
  useEffect(() => {
    // Only run animations if we're on client side, not loading, and haven't initialized yet
    if (!isClient || loading || animationsInitialized.current) return

    const runAnimations = () => {
      // Fallback: Make elements visible immediately if GSAP fails
      const makeVisible = () => {
        if (heroRef.current) heroRef.current.style.opacity = '1'
        if (filterSectionRef.current) filterSectionRef.current.style.opacity = '1'
        productRefs.current.forEach(ref => {
          if (ref) ref.style.opacity = '1'
        })
      }

      try {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
          makeVisible()
          return
        }

        // Set initial states to prevent flash
        if (heroRef.current) {
          gsap.set(heroRef.current, { opacity: 0, y: -30 })
        }
        if (filterSectionRef.current) {
          gsap.set(filterSectionRef.current, { opacity: 0, y: 20 })
        }

        const validRefs = productRefs.current.filter((ref) => ref !== null && ref !== undefined)
        if (validRefs.length > 0) {
          gsap.set(validRefs, { y: 50, opacity: 0 })
        }

        // Create master timeline with fallback
        const masterTL = gsap.timeline({
          onComplete: () => {
            animationsInitialized.current = true
          },
          onReverseComplete: makeVisible // Fallback if animation fails
        })

        // Hero section animation
        if (heroRef.current) {
          masterTL.to(
            heroRef.current,
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              ease: "power2.out",
              onComplete: () => {
                if (heroRef.current) heroRef.current.style.opacity = '1'
              }
            },
            0
          )
        }

        // Filter section animation
        if (filterSectionRef.current) {
          masterTL.to(
            filterSectionRef.current,
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.6, 
              ease: "power2.out",
              onComplete: () => {
                if (filterSectionRef.current) filterSectionRef.current.style.opacity = '1'
              }
            },
            0.3
          )
        }

        // Product animations
        if (validRefs.length > 0) {
          masterTL.to(
            validRefs,
            {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out",
              onComplete: () => {
                validRefs.forEach(ref => {
                  if (ref) ref.style.opacity = '1'
                })
              }
            },
            0.5
          )
        }

        // Fallback timeout - if animations don't complete in 3 seconds, make visible
        setTimeout(() => {
          if (!animationsInitialized.current) {
            makeVisible()
            animationsInitialized.current = true
          }
        }, 3000)

      } catch (error) {
        console.warn('GSAP animation failed, falling back to CSS:', error)
        makeVisible()
        animationsInitialized.current = true
      }
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const animationFrame = requestAnimationFrame(() => {
      // Additional delay to ensure everything is mounted
      setTimeout(runAnimations, 150)
    })
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isClient, loading, filteredProducts])

  // Cleanup function for page unmount
  useEffect(() => {
    return () => {
      // Kill all GSAP animations and ScrollTriggers on unmount
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf("*")
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
      }
    }
  }, [])

  // Format price to display properly
  const formatPrice = (price) => {
    return `Rs.${price}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <AwsomeHumansFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>
        <AwsomeHumansFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white w-screen overflow-x-hidden">
      <div className="w-screen overflow-x-hidden">
        <Header />
        
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="w-full py-16 bg-gradient-to-br from-gray-800 to-black text-white relative overflow-hidden"
          style={{ 
            opacity: 1, // Show immediately if not client-side
            transform: isClient ? 'translateY(-30px)' : 'none' 
          }}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-6xl overflow-hidden">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 break-words max-w-full">
                {decodedColorName ? `${decodedColorName.toUpperCase()} COLLECTION` : "COLOR COLLECTION"}
              </h1>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold break-words max-w-full">
                {decodedColorName ? `${decodedColorName} Products` : "Color Products"}
              </h2>
              <p className="text-gray-600 mt-2 break-words max-w-full">
                {filteredProducts.length} products available in {decodedColorName ? decodedColorName : "various colors"}
              </p>
            </div>

            {/* Filter section */}
            <div 
              ref={filterSectionRef}
              className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-12"
              style={{ 
                opacity: isClient ? 0 : 1, // Show immediately if not client-side
                transform: isClient ? 'translateY(20px)' : 'none' 
              }}
            >
              <div className="p-6 sm:p-8 flex flex-wrap gap-6 items-center">
                {/* Color indicator */}
                <div className="flex items-center gap-2 font-medium text-black">
                  <span className="text-gray-600">COLOR:</span>
                  <span className="font-bold">{decodedColorName ? decodedColorName.toUpperCase() : "ALL"}</span>
                </div>

                {/* Total count */}
                <div className="ml-auto text-black font-medium">
                  {filteredProducts.length} Total
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div ref={productsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <Link
                  to={`/product/${product._id}?color=${product.color}`}
                  key={product.id}
                  state={{ selectedColor: product.color }}
                >
                  <div
                    ref={(el) => (productRefs.current[index] = el)}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                    style={{ 
                      opacity: isClient ? 0 : 1, // Show immediately if not client-side
                      transform: isClient ? 'translateY(50px)' : 'none' 
                    }}
                  >
                    {/* Product image */}
                    <div className="bg-gray-100 overflow-hidden aspect-square">
                      <img
                        src={product.primaryImage || "/placeholder.svg"}
                        alt={`${product.name} - ${product.color}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex flex-col p-4">
                      {/* Product name */}
                      <h3 className="text-gray-900 font-medium text-base md:text-lg lg:text-xl mb-2">{product.name}</h3>

                      {/* Color and color count */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-700 text-xs md:text-sm">{product.color}</span>
                        <span className="text-gray-500 text-xs md:text-sm">{product.colorCount} Colors</span>
                      </div>

                      {/* Price */}
                      <div className="text-gray-900 font-bold text-sm md:text-base lg:text-lg">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-800 to-black text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 break-words max-w-full">
              Find Your Perfect Style
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 break-words max-w-full">
              Explore our complete collection and discover more colors and styles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                Shop All Products
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Browse All Colors
              </Link>
            </div>
          </div>
        </section>

        <AwsomeHumansFooter />
      </div>
    </div>
  )
}