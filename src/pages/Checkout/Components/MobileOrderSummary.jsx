import { useState, useEffect, useRef } from "react"
import { X, Info } from "lucide-react"

export default function MobileOrderSummary({ onDiscountCodeChange, onRemoveProduct, onDiscountUpdate, deliveryInfo }) {
  const [discountCode, setDiscountCode] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [discounts, setDiscounts] = useState({ amount: 0, reasons: [] })
  const [pointsAvailable, setPointsAvailable] = useState(0)
  const [pointsToUse, setPointsToUse] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Add refs to track previous values and prevent infinite loops
  const prevDiscountsRef = useRef(null);
  const prevPointsToUseRef = useRef(pointsToUse);
  const prevTotalPriceRef = useRef(totalPrice);

  // SHIPPING RATES - Exact same as desktop version
  const shippingRates = {
    'Pakistan': 200,
    'India': 500,
    'UAE': 800,
    'Saudi Arabia': 800,
    'United States': 1500,
    'United Kingdom': 1200,
    'Canada': 1300,
    'Australia': 1600,
    'Germany': 1000,
    'France': 1000,
    'Italy': 1000,
    'Spain': 1000,
    'Netherlands': 1000,
    'Belgium': 1000,
    'Sweden': 1200,
    'Norway': 1200,
    'Denmark': 1200,
    'Finland': 1200,
    'Switzerland': 1300,
    'Austria': 1100,
    'Japan': 1400,
    'South Korea': 1400,
    'Singapore': 900,
    'Malaysia': 700,
    'Thailand': 700,
    'Indonesia': 800,
    'Philippines': 800,
    'Vietnam': 700,
    'Bangladesh': 300,
    'Sri Lanka': 400,
    'Nepal': 350,
    'Afghanistan': 400,
    'Iran': 600,
    'Turkey': 900,
    'Egypt': 800,
    'South Africa': 1100,
    'Nigeria': 1000,
    'Kenya': 900,
    'Morocco': 900,
    'Brazil': 1800,
    'Argentina': 1900,
    'Chile': 2000,
    'Mexico': 1400,
    'Colombia': 1700,
    'Peru': 1800,
    'Venezuela': 1900,
    'China': 1200,
    'Russia': 1500,
    'Ukraine': 1200,
    'Poland': 1000,
    'Czech Republic': 1100,
    'Hungary': 1100,
    'Romania': 1200,
    'Bulgaria': 1200,
    'Croatia': 1100,
    'Serbia': 1200,
    'Greece': 1100,
    'Portugal': 1000,
    'Ireland': 1200,
    'Iceland': 1400,
    'New Zealand': 1700,
    'Israel': 1000,
    'Lebanon': 800,
    'Jordan': 700,
    'Kuwait': 700,
    'Qatar': 700,
    'Bahrain': 700,
    'Oman': 700,
    'Yemen': 800,
    'Iraq': 800,
    'Syria': 900,
    'Cyprus': 900,
    'Malta': 1000,
    'Luxembourg': 1000,
    'Monaco': 1000,
    'Andorra': 1100,
    'San Marino': 1100,
    'Vatican City': 1100,
    'Liechtenstein': 1300,
    'Estonia': 1200,
    'Latvia': 1200,
    'Lithuania': 1200,
    'Slovenia': 1100,
    'Slovakia': 1100,
    'Bosnia and Herzegovina': 1200,
    'Montenegro': 1200,
    'Albania': 1200,
    'North Macedonia': 1200,
    'Moldova': 1300,
    'Belarus': 1400,
    'Georgia': 1200,
    'Armenia': 1200,
    'Azerbaijan': 1200,
    'Kazakhstan': 1400,
    'Uzbekistan': 1300,
    'Turkmenistan': 1400,
    'Kyrgyzstan': 1400,
    'Tajikistan': 1500,
    'Mongolia': 1500,
    'Myanmar': 800,
    'Laos': 800,
    'Cambodia': 800,
    'Brunei': 900,
    'Maldives': 800,
    'Bhutan': 500,
    'East Timor': 1000,
    'Papua New Guinea': 1800,
    'Fiji': 1900,
    'Solomon Islands': 2000,
    'Vanuatu': 2000,
    'Samoa': 2100,
    'Tonga': 2100,
    'Palau': 2000,
    'Micronesia': 2000,
    'Marshall Islands': 2100,
    'Kiribati': 2200,
    'Tuvalu': 2200,
    'Nauru': 2200
  };

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      try {
        const storedCart = localStorage.getItem('cartItems')
        if (storedCart) {
          const items = JSON.parse(storedCart)
          setCartItems(items)
          // Calculate total price
          const total = items.reduce((sum, item) => sum + item.totalPrice, 0)
          setTotalPrice(total)
        }
      } catch (error) {
        console.error("Error loading cart items:", error)
      }
    }

    // Initial load
    loadCartItems()

    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCartItems)

    return () => {
      window.removeEventListener('cartUpdated', loadCartItems)
    }
  }, [])

  // Load user points - separated from discount calculation
  useEffect(() => {
    const loadUserPoints = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          const response = await fetch('https://steth-backend.onrender.com/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setPointsAvailable(data.user.rewardPoints || 0)
          }
        }
      } catch (error) {
        console.error("Error loading user points:", error)
      }
    }
    
    loadUserPoints()
  }, [])

  // Separate useEffect for discount calculations to avoid infinite loops
  useEffect(() => {
    const calculateDiscounts = async () => {
      if (cartItems.length === 0) {
        setDiscounts({ amount: 0, reasons: [], pointsDiscount: 0 });
        return;
      }
      
      // Check if we need to recalculate by comparing with previous values
      if (
        prevTotalPriceRef.current === totalPrice && 
        prevPointsToUseRef.current === pointsToUse &&
        prevDiscountsRef.current !== null
      ) {
        return; // Skip calculation if nothing has changed
      }
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setDiscounts({ amount: 0, reasons: [], pointsDiscount: 0 });
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('https://steth-backend.onrender.com/api/orders/calculate-discount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            subtotal: totalPrice,
            pointsToUse: pointsToUse
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setDiscounts({
            amount: data.discountAmount || 0,
            reasons: data.discountReason ? data.discountReason.split(' + ') : [],
            pointsDiscount: data.pointsDiscount || 0
          });
        } else {
          setDiscounts({ amount: 0, reasons: [], pointsDiscount: 0, error: data.message });
        }
        
        // Update refs with current values
        prevTotalPriceRef.current = totalPrice;
        prevPointsToUseRef.current = pointsToUse;
        
      } catch (error) {
        console.error("Error calculating discounts:", error);
        setDiscounts({ amount: 0, reasons: [], pointsDiscount: 0, error: error.message });
      } finally {
        setIsLoading(false);
      }
    }
    
    calculateDiscounts();
  }, [cartItems.length, totalPrice, pointsToUse]);

  // FIXED: Calculate shipping charges based on country and total - Same as desktop
  const calculateShipping = () => {
    // If no delivery info or country, return default shipping
    if (!deliveryInfo || !deliveryInfo.country) {
      return totalPrice >= 5000 ? 0 : 200; // Default shipping rate
    }
    
    // Free shipping for orders >= 5000
    if (totalPrice >= 5000) {
      return 0;
    }
    
    // Get country name
    const countryName = deliveryInfo.country.name || deliveryInfo.country;
    
    // Return shipping rate for the country, or default rate if not found
    return shippingRates[countryName] || 500;
  };

  // Calculate final total
  const calculateTotal = () => {
    const subtotal = totalPrice;
    const totalDiscounts = (discounts.amount || 0) + (pointsToUse || 0);
    const shipping = calculateShipping();
    return subtotal - totalDiscounts + shipping;
  };

  // Send complete discount information back to parent component - with memoization
  useEffect(() => {
    // Store current discount state to compare for changes
    const currentDiscounts = JSON.stringify(discounts);
    
    if (prevDiscountsRef.current === currentDiscounts) {
      return; // Skip update if discounts haven't changed
    }
    
    prevDiscountsRef.current = currentDiscounts;
    
    const finalTotal = calculateTotal();
    const totalDiscountAmount = (discounts.amount || 0) + (pointsToUse || 0);
    const shippingAmount = calculateShipping();
    
    if (onDiscountUpdate) {
      onDiscountUpdate({
        subtotal: totalPrice,
        finalTotal,
        discountAmount: totalDiscountAmount,
        discountReasons: [...(discounts.reasons || []), 
                         pointsToUse > 0 ? `Points Discount (-Rs. ${pointsToUse.toFixed(2)})` : []].flat(),
        pointsUsed: pointsToUse,
        shippingCharges: shippingAmount // This will now have the correct value
      });
    }
  }, [discounts, pointsToUse, totalPrice, deliveryInfo, onDiscountUpdate]);

  const handleDiscountCodeSubmit = (e) => {
    e.preventDefault()
    if (onDiscountCodeChange) {
      onDiscountCodeChange(discountCode)
    }
  }

  const handleRemoveProduct = (id, colorName, size) => {
    try {
      const updatedItems = cartItems.filter(
        item => !(item.id === id && item.colorName === colorName && item.size === size)
      )
      localStorage.setItem('cartItems', JSON.stringify(updatedItems))
      window.dispatchEvent(new Event('cartUpdated'))
      if (onRemoveProduct) {
        onRemoveProduct(id, colorName, size)
      }
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const handlePointsChange = (e) => {
    const value = e.target.value
    // Remove leading zeros and convert to number
    const numericValue = parseInt(value.replace(/^0+/, '')) || 0
    // Ensure the value is not negative and doesn't exceed available points
    const validValue = Math.min(Math.max(0, numericValue), pointsAvailable)
    setPointsToUse(validValue)
  }

  // Get shipping display text - Same as desktop
  const getShippingDisplayText = () => {
    const shippingAmount = calculateShipping();
    if (shippingAmount === 0) {
      return 'Free';
    }
    return `Rs. ${shippingAmount.toFixed(2)}`;
  }

  // Get country display name for shipping info - Same as desktop
  const getCountryDisplayName = () => {
    if (!deliveryInfo || !deliveryInfo.country) {
      return 'No country selected';
    }
    return deliveryInfo.country.name || deliveryInfo.country;
  }

  return (
    <div className="bg-white p-4 border-b border-gray-300">
      {/* Products List */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.colorName}-${item.size}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">
                  Color: {item.colorName} | Size: {item.size}
                </p>
                <p className="text-gray-500 text-sm">
                  Quantity: {item.quantity}
                </p>
                <p className="text-gray-500">Rs. {item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveProduct(item.id, item.colorName, item.size)}
              className="text-black bg-white hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Total and Discounts */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>Rs. {totalPrice.toFixed(2)}</span>
        </div>

        {/* Discounts section */}
        {discounts && (discounts.amount > 0 || discounts.reasons.length > 0) && (
          <div className="mt-4 mb-2">
            <div className="flex items-center">
              <span className="text-[#333333] font-medium">DISCOUNTS</span>
              <div className="relative group ml-2">
                <Info size={16} className="text-gray-500" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-md text-sm w-48 z-10">
                  <p className="mb-1 font-medium">Available Discounts:</p>
                  <ul className="list-disc list-inside">
                    {discounts.reasons.map((reason, index) => (
                      <li key={index} className="text-xs">{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {discounts.amount > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-green-600">
                  {discounts.reasons.length > 0 
                    ? discounts.reasons[0] 
                    : "Discount"}
                </span>
                <span className="text-green-600">-Rs. {discounts.amount.toFixed(2)}</span>
              </div>
            )}
            
            {discounts.reasons.slice(1).map((reason, index) => (
              <div key={index} className="flex justify-between text-sm mt-1">
                <span className="text-green-600">{reason}</span>
                <span className="text-green-600"></span>
              </div>
            ))}
          </div>
        )}

        {/* Points section */}
        {pointsAvailable > 0 && (
          <div className="mt-4 mb-2">
            <div className="flex items-center">
              <span className="text-[#333333] font-medium">REWARD POINTS</span>
              <div className="relative group ml-2">
                <Info size={16} className="text-gray-500" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-md text-sm w-48 z-10">
                  <p className="mb-1">You have {pointsAvailable} points available</p>
                  <p className="text-xs">1 point = Rs. 1 discount</p>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="number"
                min="0"
                max={pointsAvailable}
                value={pointsToUse}
                onChange={handlePointsChange}
                className="w-20 p-1 border border-gray-300 rounded text-sm bg-white text-black"
                placeholder="0"
              />
              <span className="ml-2 text-sm text-gray-600">/ {pointsAvailable} available</span>
            </div>
            {pointsToUse > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-green-600">Points Discount</span>
                <span className="text-green-600">-Rs. {pointsToUse.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Shipping section with enhanced info - Same as desktop */}
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <span>Shipping</span>
            <div className="relative group ml-2">
              <Info size={16} className="text-gray-500" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-md text-sm w-64 z-10">
                <p className="mb-1 font-medium">Shipping Information:</p>
                <p className="text-xs mb-1">Country: {getCountryDisplayName()}</p>
                <p className="text-xs mb-1">Free shipping on orders ≥ Rs. 5,000</p>
                {totalPrice < 5000 && (
                  <p className="text-xs text-blue-600">
                    Add Rs. {(5000 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
          <span className={totalPrice >= 5000 ? 'text-green-600 font-medium' : ''}>
            {getShippingDisplayText()}
          </span>
        </div>

        {/* Free shipping progress indicator - Same as desktop */}
        {totalPrice < 5000 && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalPrice / 5000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">
              Rs. {(5000 - totalPrice).toFixed(2)} away from free shipping!
            </p>
          </div>
        )}

        <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200">
          <span>Total</span>
          <span>Rs. {calculateTotal().toFixed(2)}</span>
        </div>

        {/* Show points to be earned */}
        {cartItems.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            You'll earn {Math.floor(calculateTotal() / 100)} reward points from this purchase
          </div>
        )}
      </div>
    </div>
  )
}