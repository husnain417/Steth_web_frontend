"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { X, ChevronLeft, ChevronRight, Check, Plus, Minus, Maximize2, Minimize2 } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function ProductDetail({ product }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Get color from URL and set it as initial selected color
  const colorFromUrl = searchParams.get('color')
  const [selectedColor, setSelectedColor] = useState(colorFromUrl || (product?.colors?.length > 0 ? product.colors[0].name : ""))
  const [selectedSize, setSelectedSize] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [validationError, setValidationError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [isColorSelected, setIsColorSelected] = useState(!!colorFromUrl)
  
  // Track available sizes for the selected color
  const [availableSizes, setAvailableSizes] = useState({})
  const [sizeInventory, setSizeInventory] = useState({})
  
  // Organize images for rendering - using API data structure
  const [displayImages, setDisplayImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  const productRef = useRef(null)
  const lightboxRef = useRef(null)
  const successMessageRef = useRef(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [mouseStart, setMouseStart] = useState(null)
  const [mouseEnd, setMouseEnd] = useState(null)
  const mainImageRef = useRef(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Set up initial available sizes and inventory based on product data
  useEffect(() => {
    if (product && product.inventory) {
      // Initialize available sizes map for each color
      const sizeAvailability = {}
      const inventoryBySize = {}
      
      // Process inventory data to determine which sizes are available for each color
      product.inventory.forEach(item => {
        if (!sizeAvailability[item.color]) {
          sizeAvailability[item.color] = {}
        }
        
        if (!inventoryBySize[item.color]) {
          inventoryBySize[item.color] = {}
        }
        
        // A size is available for a color if it has stock
        sizeAvailability[item.color][item.size] = item.stock > 0
        inventoryBySize[item.color][item.size] = item.stock
      })
      
      setAvailableSizes(sizeAvailability)
      setSizeInventory(inventoryBySize)
      
      // If we already have a selected color, reset selected size if it's not available
      if (selectedColor && selectedSize) {
        const isCurrentSizeAvailable = sizeAvailability[selectedColor] && 
                                      sizeAvailability[selectedColor][selectedSize]
        
        if (!isCurrentSizeAvailable) {
          setSelectedSize(null)
        }
      }
    }
  }, [product])

  // Set up images based on API data
  useEffect(() => {
    if (product) {
      setIsLoadingImages(true)
      
      // If color is selected (either from URL or user selection), show color-specific images
      if (isColorSelected) {
      // Find images for the selected color
      const colorImagesObj = product.colorImages?.find(ci => ci.color === selectedColor)
      const colorImages = colorImagesObj?.images || []
      
        // If we have color-specific images, use them, otherwise fall back to default images
      if (colorImages.length > 0) {
        setDisplayImages(colorImages)
        } else {
          setDisplayImages(product.defaultImages || [])
        }
      } else {
        // If no color is selected, show default images
        setDisplayImages(product.defaultImages || [])
      }
      
      // Reset current image index when images change
      setCurrentImageIndex(0)

      // Simulate loading time for images
      const loadingTimer = setTimeout(() => {
        setIsLoadingImages(false)
      }, 500)

      return () => clearTimeout(loadingTimer)
    }
  }, [product, selectedColor, isColorSelected])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // GSAP animations
    gsap.from(productRef.current, {
      // Animation properties can be added here
    })

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)

    // GSAP animation for lightbox
    gsap.fromTo(lightboxRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
  }

  const closeLightbox = () => {
    gsap.to(lightboxRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setLightboxOpen(false),
    })
  }

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onMouseDown = (e) => {
    setMouseEnd(null)
    setMouseStart(e.clientX)
  }

  const onMouseMove = (e) => {
    if (mouseStart) {
      setMouseEnd(e.clientX)
    }
  }

  const onMouseUp = () => {
    if (!mouseStart || !mouseEnd) return
    const distance = mouseStart - mouseEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleSlide('next')
    }
    if (isRightSwipe) {
      handleSlide('prev')
    }
    
    // Reset mouse positions
    setMouseStart(null)
    setMouseEnd(null)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleSlide('next')
    }
    if (isRightSwipe) {
      handleSlide('prev')
    }
  }

  // Unified slide animation for both mobile and desktop
  const handleSlide = (direction) => {
    if (direction === 'next') {
      gsap.to(mainImageRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
          gsap.fromTo(mainImageRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
          )
        }
      })
    } else {
      gsap.to(mainImageRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
          gsap.fromTo(mainImageRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3 }
          )
        }
      })
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Helper function for validation
  const validateInputs = () => {
    // Reset validation error
    setValidationError("")
    
    // Validation checks
    if (!selectedColor) {
      setValidationError("Please select a color")
      return false
    }
    if (!selectedSize) {
      setValidationError("Please select a size")
      return false
    }
    if (quantity <= 0) {
      setValidationError("Quantity must be greater than 0")
      return false
    }
    
    // Check if the selected size is available for the selected color
    if (!availableSizes[selectedColor] || !availableSizes[selectedColor][selectedSize]) {
      setValidationError("Selected size is not available for this color")
      return false
    }
    
    // Check if there's sufficient stock
    const stock = sizeInventory[selectedColor]?.[selectedSize] || 0
    if (stock < quantity) {
      setValidationError(`Only ${stock} items available in this size and color`)
      return false
    }
    
    return true
  }

  const validateAndAddToBag = () => {
    // Reset success message
    setSuccessMessage("")
    
    // Validate inputs
    if (!validateInputs()) {
      return
    }

    // Get selected color object for complete information
    const selectedColorObj = product.colors.find(color => color.name === selectedColor)
    
    // Find an appropriate image to use (use first image or default)
    const productImage = displayImages.length > 0 ? displayImages[0].url : ""
    
    // Create item object with ALL required information
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      colorName: selectedColor,
      colorHex: selectedColorObj.code,
      size: selectedSize,
      quantity: quantity,
      image: productImage,
      timestamp: new Date().toISOString(),
      totalPrice: product.price * quantity,
      material: product.material,
      category: product.category,
      description: product.description,
      availableSizes: availableSizes[selectedColor],
      sizeInventory: sizeInventory[selectedColor]
    }

    try {
      // Read existing cart items
      const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]')
    
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(
        cartItem => cartItem.id === item.id && 
                    cartItem.colorName === item.colorName && 
                    cartItem.size === item.size
      )

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += item.quantity
        existingCart[existingItemIndex].totalPrice = existingCart[existingItemIndex].price * existingCart[existingItemIndex].quantity
      } else {
        // Add new item if it doesn't exist
        existingCart.push(item)
      }

      // Save updated cart
      localStorage.setItem('cartItems', JSON.stringify(existingCart))
      
      // Dispatch cart updated event
      window.dispatchEvent(new Event('cartUpdated'))
      
      // Clear error if any
      setValidationError("")
    } catch (error) {
      console.error("Error adding to cart:", error)
      setValidationError("Failed to add item to cart")
    }

    // Show success message with animation
    setSuccessMessage("Item added to bag successfully!")
    if (successMessageRef.current) {
      gsap.fromTo(
        successMessageRef.current, 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        gsap.to(successMessageRef.current, { 
          opacity: 0, 
          y: -20, 
          duration: 0.5, 
          ease: "power2.in",
          onComplete: () => setSuccessMessage("")
        })
      }, 3000)
    }
  }

  const proceedToCheckout = () => {
    // First validate cart has items
    if (!cartItems.length) {
      setValidationError("Your bag is empty. Please add items first.")
      return
    }
    
    // Then validate current selections in case user wants to add the current item
    if (validateInputs()) {
      // Ask user if they want to add current item to cart before proceeding
      const addCurrentItem = window.confirm("Do you want to add the current item to your bag before checkout?")
      
      if (addCurrentItem) {
        validateAndAddToBag()
      }
      
      // Navigate to checkout page with cart data
      console.log("Proceeding to checkout with items:", cartItems)
      
      // Use React Router's navigate to go to checkout page
      navigate('/checkout')
    }
  }

  // Check if a size is available for the selected color
  const isSizeAvailable = (sizeName) => {
    // If no color is selected, use the general availability from the size object
    if (!selectedColor) {
      const sizeObj = product.sizes.find(size => size.name === sizeName)
      return sizeObj?.isAvailable || false
    }
    
    // If a color is selected, check if the size is available for that color
    return availableSizes[selectedColor]?.[sizeName] || false
  }
  
  // Check if a size has stock
  const getSizeStock = (sizeName) => {
    if (!selectedColor) return 0
    return sizeInventory[selectedColor]?.[sizeName] || 0
  }

  // Handle color selection
  const handleColorSelect = (colorName) => {
    setIsColorSelected(true)
    setSelectedColor(colorName)
    
    // Reset size selection if the current size isn't available for the new color
    if (selectedSize && (!availableSizes[colorName] || !availableSizes[colorName][selectedSize])) {
      setSelectedSize(null)
    }
  }

  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [isSizeChartMinimized, setIsSizeChartMinimized] = useState(false)
  const [currentSizeChartIndex, setCurrentSizeChartIndex] = useState(0)
  const sizeChartRef = useRef(null)

  const sizeChartImages = [
    "/src/assets/sizes/Size chart -images-0.jpg",
    "/src/assets/sizes/Size chart -images-1.jpg",
    "/src/assets/sizes/Care Instructions.jpg"
  ]

  const handleSizeChartNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentSizeChartIndex((prev) => (prev + 1) % sizeChartImages.length)
    } else {
      setCurrentSizeChartIndex((prev) => (prev - 1 + sizeChartImages.length) % sizeChartImages.length)
    }
  }

  // Add size chart modal component
  const SizeChartModal = () => {
    if (!isSizeChartOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          ref={sizeChartRef}
          className={`bg-white transition-all duration-300 ${
            isSizeChartMinimized ? 'w-64 h-48' : 'w-[90%] max-w-3xl h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-white">
            <h3 className="text-lg font-semibold">Size Chart</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-1 bg-white hover:bg-gray-50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 h-[calc(100%-4rem)] overflow-auto bg-white relative">
            {/* Navigation Arrows */}
            <button
              onClick={() => handleSizeChartNavigation('prev')}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={() => handleSizeChartNavigation('next')}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image */}
            <img
              src={sizeChartImages[currentSizeChartIndex]}
              alt={`Size Chart ${currentSizeChartIndex + 1}`}
              className="w-full h-full object-contain"
            />

           {/* Dots Indicator */}
           <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3">
              {sizeChartImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSizeChartIndex(index)}
                  className={`w-3 h-3 rounded-full border-0 p-0 flex-shrink-0 transition-all duration-300 ${
                    index === currentSizeChartIndex 
                      ? "bg-black" 
                      : "bg-black/40 hover:bg-black/60"
                  }`}
                  style={{ 
                    minWidth: '12px', 
                    minHeight: '12px',
                    borderRadius: '50%'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle case where product data isn't loaded yet
  if (!product) {
    return <div>Loading product details...</div>
  }

  // Format price for display
  const formattedPrice = product.price
  
  // Calculate discount if applicable
  const discountPercentage = product.discount?.percentage || 0
  const hasDiscount = discountPercentage > 0
  
  // Determine if product has a badge
  const productBadge = product.category || ""

  return (
    <div className="bg-white min-h-screen w-full text-black" ref={productRef}>
      {/* Mobile View */}
      {isMobile ? (
        <div className="px-4 pt-4 pb-8">
          <div className="mb-4 relative">
            {isLoadingImages ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              displayImages.length > 0 && (
                <>
                  <div 
                    className="w-full h-[400px] relative overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      ref={mainImageRef}
                      src={displayImages[currentImageIndex]?.url || "/placeholder.svg"}
                      alt={displayImages[currentImageIndex]?.alt || product.name}
                      className="w-full h-full object-cover absolute top-0 left-0"
                    />
                  </div>
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    {displayImages.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? "bg-black scale-110" 
                            : "bg-black/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )
            )}
          </div>

          <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
          {product.material && (
            <div className="mb-2 text-sm">{product.material}</div>
          )}

          <p className="text-2xl font-bold mb-4">Rs.{formattedPrice}</p>

          {productBadge && (
            <div className="inline-block px-3 py-1 bg-white text-sm font-medium mb-4 border border-gray-200 rounded-md">
              {productBadge}
            </div>
          )}

          <div className="mb-4">
            <p className="font-medium mb-2">
              COLOR {isColorSelected && <span className="ml-2 font-normal">{selectedColor}</span>}
            </p>
            <div className="flex gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color._id}
                  className={`w-6 h-6 rounded-full p-0 flex items-center justify-center ${selectedColor === color.name ? "ring-1 ring-black" : ""}`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => handleColorSelect(color.name)}
                  disabled={!color.isAvailable}
                >
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 ">
              <p className="font-medium">SIZE</p>
              <button 
                onClick={() => setIsSizeChartOpen(true)}
                className="text-gray-600 bg-white  underline"
              >
                Size Chart
              </button>
            </div>
            <div className="flex gap-4">
              {product.sizes.map((size) => {
                const sizeAvailable = isSizeAvailable(size.name);
                const sizeStock = getSizeStock(size.name);
                
                return (
                <button
                  key={size._id}
                    className={`w-10 h-10 flex items-center justify-center border ${
                      selectedSize === size.name 
                        ? "border-black" 
                        : "border-gray-300"
                    } ${
                      isColorSelected && (!sizeAvailable || sizeStock === 0)
                        ? "opacity-60 cursor-not-allowed" 
                        : "bg-white text-black"
                    } text-center relative rounded-md`}
                    onClick={() => sizeAvailable && sizeStock > 0 && setSelectedSize(size.name)}
                    disabled={isColorSelected && (!sizeAvailable || sizeStock === 0)}
                >
                  {size.name}
                    {isColorSelected && sizeAvailable && sizeStock === 0 && <span className="block text-xs">Out of stock</span>}
                </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <p className="font-medium mb-2">QUANTITY</p>
            <div className="flex items-center border border-gray-300 inline-flex rounded-md">
              <button 
                onClick={decrementQuantity} 
                className="px-3 py-2 bg-white"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity} 
                className="px-3 py-2 bg-white"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="mb-4 text-red-500 text-sm">{validationError}</div>
          )}
          
          {/* Success Message */}
          {successMessage && (
            <div 
              className="mb-4 bg-green-100 text-green-800 p-2 border border-green-200"
              ref={successMessageRef}
            >
              {successMessage}
            </div>
          )}

          <button 
            className="w-full py-4 bg-black text-white font-medium mb-4 rounded-none"
            onClick={validateAndAddToBag}
          >
            ADD TO BAG
          </button>

          <p className="text-center text-gray-600 text-sm mb-4">{product.material || ""}</p>

          <p className="text-center font-medium">FREE SHIPPING FOR Rs.5000+ ORDERS AND FREE RETURNS</p>

          {/* Product Description */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-6">Product Description</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.description || "No description available."}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop View */
        <div className="mx-10 px-20 py-8 flex">
          {/* Thumbnail Gallery - Custom size */}
          <div className="w-45 mr-6">
            {isLoadingImages ? (
              <div className="w-40 h-40 mb-4 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : (
              displayImages.slice(0, 7).map((image, index) => (
              <div
                key={index}
                className={`w-40 h-40 mb-4 border ${currentImageIndex === index ? "border-gray-300" : "border-gray-200"} cursor-pointer`}
                onClick={() => handleSlide('next')}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt || `Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              ))
            )}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 relative mr-20 ml-10">
            {isLoadingImages ? (
              <div className="w-[95%] h-[80%] flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
              </div>
            ) : (
              displayImages.length > 0 && (
                <div 
                  className="relative w-[95%] h-[80%] cursor-grab active:cursor-grabbing"
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                >
                  <img
                    ref={mainImageRef}
                    src={displayImages[currentImageIndex]?.url || "/placeholder.svg"}
                    alt={displayImages[currentImageIndex]?.alt || product.name}
                    className="w-full h-full object-cover select-none"
                    onClick={() => openLightbox(currentImageIndex)}
                  />
                </div>
              )
            )}
          </div>

          {/* Product Details */}
          <div className="w-1/3 pl-12">
            <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
            {product.material && (
              <div className="mb-2 text-sm">{product.material}</div>
            )}

            <p className="text-2xl font-bold mb-8">Rs.{formattedPrice}</p>

            {productBadge && (
              <div className="inline-block px-4 py-1 bg-white text-sm font-medium mb-8 border border-gray-200 rounded-md">
                {productBadge}
              </div>
            )}

            <div className="mb-8">
              <p className="font-medium mb-2">
                COLOR {isColorSelected && <span className="ml-2 font-normal">{selectedColor}</span>}
              </p>
              <div className="flex gap-1.5">
                {product.colors.map((color) => (
                  <button
                    key={color._id}
                    className={`w-6 h-6 rounded-full p-0 flex items-center justify-center ${selectedColor === color.name ? "ring-1 ring-black" : ""}`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => handleColorSelect(color.name)}
                    disabled={!color.isAvailable}
                  >
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium">SIZE</p>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-gray-600 underline bg-white"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex gap-4">
                {product.sizes.map((size) => {
                  const sizeAvailable = isSizeAvailable(size.name);
                  const sizeStock = getSizeStock(size.name);
                  
                  return (
                  <button
                    key={size._id}
                      className={`w-10 h-10 flex items-center justify-center border ${
                        selectedSize === size.name 
                          ? "border-black" 
                          : "border-gray-300"
                      } ${
                        isColorSelected && (!sizeAvailable || sizeStock === 0)
                          ? "opacity-60 cursor-not-allowed" 
                          : "bg-white text-black"
                      } text-center relative rounded-md`}
                      onClick={() => sizeAvailable && sizeStock > 0 && setSelectedSize(size.name)}
                      disabled={isColorSelected && (!sizeAvailable || sizeStock === 0)}
                  >
                    {size.name}
                      {isColorSelected && sizeAvailable && sizeStock === 0 && <span className="block text-xs">Out of stock</span>}
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="font-medium mb-3">QUANTITY</p>
              <div className="flex items-center border border-gray-300 inline-flex rounded-md">
                <button 
                  onClick={decrementQuantity} 
                  className="px-3 py-2 bg-white"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity} 
                  className="px-3 py-2 bg-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="mb-6 text-red-500 text-sm">{validationError}</div>
            )}
            
            {/* Success Message */}
            {successMessage && (
              <div 
                className="mb-6 bg-green-100 text-green-800 p-2 border border-green-200"
                ref={successMessageRef}
              >
                {successMessage}
              </div>
            )}

            <button 
              className="w-full py-4 bg-black text-white rounded-none font-medium text-sm mb-4"
              onClick={validateAndAddToBag}
            >
              ADD TO BAG
            </button>

            <p className="text-center text-gray-600 text-sm mb-6">{product.material || ""}</p>

            <p className="text-center text-sm font-medium">FREE SHIPPING FOR Rs.5000+ ORDERS AND FREE RETURNS</p>

            {/* Product Description */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold mb-6">Product Description</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {product.description || "No description available."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex bg-white items-center justify-center" ref={lightboxRef}>
          <button className="absolute top-4 right-4 p-2 bg-white text-black rounded-full" onClick={closeLightbox}>
            <X size={50} />
          </button>

          <button
            className="absolute bg-white text-black left-4 rounded-full top-1/2 transform -translate-y-1/2 p-2"
            onClick={() => handleSlide('prev')}
          >
            <ChevronLeft size={50} />
          </button>

          {displayImages.length > 0 && (
            <img
              src={displayImages[currentImageIndex]?.url || "/placeholder.svg"}
              alt={displayImages[currentImageIndex]?.alt || product.name}
              className="lightbox-image max-h-[80vh] max-w-[80vw]"
            />
          )}

          <button
            className="absolute right-4 bg-white text-black rounded-full top-1/2 transform -translate-y-1/2 p-2"
            onClick={() => handleSlide('next')}
          >
            <ChevronRight size={50} />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-black scale-110" 
                    : "bg-black/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}
      <SizeChartModal />
    </div>
  )
}