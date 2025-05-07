"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { Link } from "react-router-dom"

export default function ProductPage() {
  // State for products
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [colorFilter, setColorFilter] = useState("All")
  const [sizeFilter, setSizeFilter] = useState("All")
  const [styleFilter, setStyleFilter] = useState("All")

  // Dropdown states
  const [colorOpen, setColorOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)

  // Filtered products
  const [filteredProducts, setFilteredProducts] = useState([])

  // All colors from products for filter
  const [availableColors, setAvailableColors] = useState(["All"])

  // Refs for GSAP animations
  const productsRef = useRef(null)
  const productRefs = useRef([])

  // Size options
  const sizeOptions = ["All", "Extra Small", "Small", "Medium", "Large", "Extra Large"]
  const styleOptions = ["All", "Classic"]

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Replace with your actual endpoint
        const response = await fetch('https://steth-backend.onrender.com/api/products?gender=Women')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const responseData = await response.json()
        
        if (!responseData.success) {
          throw new Error('API returned unsuccessful response')
        }

        // Transform products to separate by color
        const transformedProducts = []
        const allColors = new Set(["All"])

        responseData.data.forEach(product => {
          // Process each color variant as a separate product entry
          product.colorImages.forEach(colorVariant => {
            // Add color to available colors for filter
            allColors.add(colorVariant.color)
            
            // Create separate product entry for each color
            transformedProducts.push({
              id: `${product._id}-${colorVariant.color.replace(/\s+/g, '-').toLowerCase()}`,
              _id: product._id,
              name: product.name,
              price: product.price,
              color: colorVariant.color,
              colorCount: product.colorImages.length,
              // Use the first image of this color variant as primary image
              primaryImage: colorVariant.images[0]?.url || '',
              // Keep all images for this color variant
              images: colorVariant.images,
              // Keep reference to color for product detail page
              colorSlug: colorVariant.color.replace(/\s+/g, '-').toLowerCase()
            })
          })
        })

        setProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
        setAvailableColors(Array.from(allColors))
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

    if (colorFilter !== "All") {
      result = result.filter((product) => product.color === colorFilter)
    }

    // In a real app, you would filter by size and style as well
    // This is just a placeholder for demonstration

    setFilteredProducts(result)
  }, [colorFilter, sizeFilter, styleFilter, products])

  // GSAP animations
  useEffect(() => {
    if (productsRef.current && productRefs.current.length > 0 && !loading) {
      gsap.fromTo(
        productRefs.current,
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
    }
  }, [filteredProducts, loading])

  // Format price to display properly
  const formatPrice = (price) => {
    return `Rs.${price}`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>
  }

  return (
    <div className="mx-auto px-4 lg:px-20 py-8 w-full">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-black px-4">Accessories</h1>

      {/* Filter section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
        <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
          {/* Color filter */}
          <div className="relative">
            <button
              className="flex items-center gap-2 font-medium bg-white text-black text-sm md:text-base lg:text-lg"
              onClick={() => {
                setColorOpen(!colorOpen)
                setSizeOpen(false)
                setStyleOpen(false)
              }}
            >
              COLOR <ChevronDown className={`h-4 w-4 transition-transform ${colorOpen ? "rotate-180" : ""}`} />
            </button>
            {colorOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md py-1 border">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`block px-4 py-2 text-xs md:text-sm w-full bg-white text-black rounded-none text-left hover:bg-gray-100 ${colorFilter === color ? "font-bold" : ""}`}
                    onClick={() => {
                      setColorFilter(color)
                      setColorOpen(false)
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size filter */}
          <div className="relative">
            <button
              className="flex items-center gap-2 font-medium bg-white text-black text-sm md:text-base lg:text-lg"
              onClick={() => {
                setSizeOpen(!sizeOpen)
                setColorOpen(false)
                setStyleOpen(false)
              }}
            >
              SIZE <ChevronDown className={`h-4 w-4 transition-transform ${sizeOpen ? "rotate-180" : ""}`} />
            </button>
            {sizeOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md py-1 border">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`block px-4 py-2 text-xs md:text-sm w-full bg-white text-black rounded-none text-left hover:bg-gray-100 ${sizeFilter === size ? "font-bold" : ""}`}
                    onClick={() => {
                      setSizeFilter(size)
                      setSizeOpen(false)
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Style filter */}
          <div className="relative">
            <button
              className="flex items-center gap-2 font-medium bg-white text-black text-sm md:text-base lg:text-lg"
              onClick={() => {
                setStyleOpen(!styleOpen)
                setColorOpen(false)
                setSizeOpen(false)
              }}
            >
              STYLE <ChevronDown className={`h-4 w-4 transition-transform ${styleOpen ? "rotate-180" : ""}`} />
            </button>
            {styleOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md py-1 border">
                {styleOptions.map((style) => (
                  <button
                    key={style}
                    className={`block px-4 py-2 text-xs md:text-sm w-full bg-white text-black rounded-none text-left hover:bg-gray-100 ${styleFilter === style ? "font-bold" : ""}`}
                    onClick={() => {
                      setStyleFilter(style)
                      setStyleOpen(false)
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total count */}
        <div className="text-black px-4 font-medium text-sm md:text-base lg:text-lg">
          {filteredProducts.length} Total
        </div>
      </div>

      {/* Products grid */}
      <div ref={productsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <Link 
            to={`/product/${product._id}?color=${product.color}`}
            key={product.id}
            state={{ selectedColor: product.color }}
          >
            <div
              ref={(el) => (productRefs.current[index] = el)}
              className="flex flex-col transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              {/* Product image */}
              <div className="bg-gray-100 overflow-hidden mb-3 aspect-square">
                <img
                  src={product.primaryImage || "/placeholder.svg"}
                  alt={`${product.name} - ${product.color}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product details */}
              <div className="flex flex-col p-2">
                {/* Product name */}
                <h3 className="text-gray-900 font-medium text-base md:text-lg lg:text-xl mb-1">
                  {product.name}
                </h3>

                {/* Color and color count */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-700 text-xs md:text-sm lg:text-base">{product.color}</span>
                  <span className="text-gray-500 text-xs md:text-sm lg:text-base">{product.colorCount} Colors</span>
                </div>

                {/* Price */}
                <div className="text-gray-900 font-medium text-sm md:text-base lg:text-lg">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}