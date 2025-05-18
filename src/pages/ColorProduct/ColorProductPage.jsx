"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Filter, ArrowRight } from 'lucide-react'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link, useParams } from "react-router-dom"
import Header from "../../components/Header"
import AwsomeHumansFooter from "../../components/Footer"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ColorProductsPage() {
  // Get color parameter from URL
  const { colorName } = useParams()
  const decodedColorName = colorName ? decodeURIComponent(colorName) : null

  // State for products
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        // Fetch all products without gender filter
        const response = await fetch("https://steth-backend.onrender.com/api/products")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const responseData = await response.json()

        if (!responseData.success) {
          throw new Error("API returned unsuccessful response")
        }

        // Transform products to separate by color
        const transformedProducts = []

        responseData.data.forEach((product) => {
          // Process each color variant as a separate product entry
          product.colorImages.forEach((colorVariant) => {
            // Create separate product entry for each color
            transformedProducts.push({
              id: `${product._id}-${colorVariant.color.replace(/\s+/g, "-").toLowerCase()}`,
              _id: product._id,
              name: product.name,
              price: product.price,
              color: colorVariant.color,
              colorCount: product.colorImages.length,
              // Use the first image of this color variant as primary image
              primaryImage: colorVariant.images[0]?.url || "",
              // Keep all images for this color variant
              images: colorVariant.images,
              // Keep reference to color for product detail page
              colorSlug: colorVariant.color.replace(/\s+/g, "-").toLowerCase(),
            })
          })
        })

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
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Always filter by color from URL parameter
    if (decodedColorName && decodedColorName !== "All") {
      result = result.filter((product) => product.color.toLowerCase() === decodedColorName.toLowerCase())
    }

    // Additional filters if needed
    if (sizeFilter !== "All") {
      // In a real application, you would filter by size
      // This is just a placeholder for demonstration
    }

    if (styleFilter !== "All") {
      // In a real application, you would filter by style
      // This is just a placeholder for demonstration
    }

    setFilteredProducts(result)
  }, [decodedColorName, sizeFilter, styleFilter, products])

  // GSAP animations
  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
    }

    // Filter section animation
    if (filterSectionRef.current) {
      gsap.fromTo(
        filterSectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.3 }
      )
    }

    // Product animations
    const validRefs = productRefs.current.filter((ref) => ref !== null && ref !== undefined)
    
    if (productsRef.current && validRefs.length > 0 && !loading) {
      // Ensure GSAP is registered
      if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger)
      }
      
      // Wait a tiny bit to ensure DOM is ready
      setTimeout(() => {
        gsap.fromTo(
          validRefs,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
        )
      }, 100)
    }
  }, [filteredProducts, loading])

  // Format price to display properly
  const formatPrice = (price) => {
    return `Rs.${price}`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <AwsomeHumansFooter />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>
        <AwsomeHumansFooter />
      </>
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
