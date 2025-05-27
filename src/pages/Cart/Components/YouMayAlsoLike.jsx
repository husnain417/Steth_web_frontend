import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const YouMayAlsoLike = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/cob')
        const data = await response.json()
        if (data.success) {
          // Get cart items from localStorage
          const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
          
          // Filter out products that are already in cart
          const filteredProducts = data.data.filter(product => 
            !cartItems.some(item => item.id === product._id)
          )
          
          setRecommendedProducts(filteredProducts)
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [])

  const handleViewProduct = (product) => {
    const defaultColor = product.colors[0]
    navigate(`/product/${product._id}?color=${defaultColor.name}`)
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-6 text-black">You May Also Like</h3>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="border border-gray-200 rounded p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-20 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Don't show the section if there are no recommended products
  if (recommendedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium mb-6 text-black">You May Also Like</h3>
      <div className="grid grid-cols-1 gap-4">
        {recommendedProducts.map((product) => (
          <div key={product._id} className="border border-gray-200 rounded p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                <img 
                  src={product.defaultImages[0].url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-black">{product.name}</h4>
                <p className="text-xs text-gray-600">Category: {product.category}</p>
                <p className="text-sm font-medium mt-1 text-black">Rs. {product.price.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={() => handleViewProduct(product)}
              className="w-full border border-black bg-black text-white hover:bg-gray-800 transition-colors rounded-none py-2 mt-4 text-sm font-medium"
            >
              SEE PRODUCT
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YouMayAlsoLike 