"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Info } from "lucide-react"

// Country data for both components
const countries = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
]

// Country codes for phone input
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "CA", flag: "🇨🇦" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+7", country: "RU", flag: "🇷🇺" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
]

// State options by country
const statesByCountry = {
  US: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ],
  CA: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", 
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", 
    "Quebec", "Saskatchewan", "Yukon"
  ],
  GB: [
    "England", "Scotland", "Wales", "Northern Ireland"
  ],
  AU: [
    "New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", 
    "Western Australia", "Australian Capital Territory", "Northern Territory"
  ],
  IN: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ],
  PK: [
   "KPK", "Punjab", "Sindh", "Balochistan", "Islamabad"
  ],
  // Add more countries as needed
}

// Pakistan shipping charges by province
const pakistanShippingCharges = {
  "KPK": 200,
  "Punjab": 200,
  "Sindh": 300,
  "Balochistan": 300,
  "Islamabad": 100
}

// PhoneInput Component
const PhoneInput = ({ value = "", onChange = () => {} }) => {
  // Find default country code from value string or use Pakistan as default
  const defaultCountry = countryCodes.find((c) => c.code === "+92") || countryCodes[1]
  
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  
  // Skip first render flag
  const isFirstRender = useRef(true)

  // Parse incoming value on mount
  useEffect(() => {
    if (value) {
      // Try to extract country code and number
      for (const country of countryCodes) {
        if (value.startsWith(country.code)) {
          setSelectedCountry(country)
          setPhoneNumber(value.substring(country.code.length).trim())
          break
        }
      }
    }
  }, [value])

  // Handle changes in the internal state and notify parent only when values actually change
  useEffect(() => {
    // Skip the first render to avoid unnecessary updates
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    // Construct full phone number with country code
    const fullNumber = `${selectedCountry.code} ${phoneNumber}`.trim()
    
    // Only call onChange when the constructed value is different
    if (fullNumber !== value) {
      onChange(fullNumber)
    }
  }, [selectedCountry, phoneNumber])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const selectCountry = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value
    // Only allow numbers, spaces, dashes, and parentheses
    const sanitizedValue = value.replace(/[^\d\s\-()]/g, '')
    setPhoneNumber(sanitizedValue)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full">
      <div className="flex border-gray-300 rounded overflow-hidden">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={toggleDropdown}
            className="flex items-center h-full px-3 py-3 border-r border-gray-300 bg-gray-50 min-w-[100px] justify-between"
          >
            <div className="flex items-center">
              <span className="mr-1">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.code}</span>
            </div>
            <ChevronDown
              size={16}
              className={`ml-1 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown with fixed positioning to ensure it appears on top */}
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-0 z-50 w-64 mt-1 bg-white border border-gray-300 rounded shadow-lg"
              style={{
                top: "100%", // Position directly below the button
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 9999, // Very high z-index to ensure it's on top
              }}
            >
              <div className="max-h-60 overflow-y-auto">
                {countryCodes.map((country, index) => (
                  <button
                    key={`${country.country}-${country.code}-${index}`}
                    type="button"
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => selectCountry(country)}
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span className="text-sm font-medium">{country.code}</span>
                    <span className="text-xs text-gray-500 ml-2">{country.country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          placeholder="Phone number"
          className="flex-1 px-3 py-3 outline-none bg-white"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />

        {/* Info Icon */}
        <div className="px-3 flex items-center">
          <Info size={18} className="text-gray-500" />
        </div>
      </div>
    </div>
  )
}

// Main DeliveryForm Component
const DeliveryForm = ({ data = {}, onDeliveryInfoChange = () => {} }) => {
  // Extract the relevant parts from the data prop based on your checkoutDetails structure
  const extractDeliveryInfo = () => {
    if (!data || !data.customerInfo || !data.customerInfo.deliveryInfo) {
      return {}
    }
    return data.customerInfo.deliveryInfo
  }
  
  const extractPhoneNumber = () => {
    if (!data || !data.customerInfo || !data.customerInfo.contactInfo) {
      return ""
    }
    return data.customerInfo.contactInfo.phoneNumber || ""
  }
  
  // Initialize form data with defaults
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: null,
    shippingCharges: 0,
    ...extractDeliveryInfo()
  })
  
  const [phoneNumber, setPhoneNumber] = useState(extractPhoneNumber())

  // Validation state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: ""
  })

  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [stateSearchTerm, setStateSearchTerm] = useState("")
  
  const countryDropdownRef = useRef(null)
  const countryButtonRef = useRef(null)
  const stateDropdownRef = useRef(null)
  const stateButtonRef = useRef(null)

  // Update local state when props change
  useEffect(() => {
    const deliveryInfo = extractDeliveryInfo()
    if (Object.keys(deliveryInfo).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...deliveryInfo
      }))
    }
    
    const phone = extractPhoneNumber()
    if (phone) {
      setPhoneNumber(phone)
    }
  }, [data])

  const validateField = (field, value) => {
    let errorMessage = ""
    
    switch (field) {
      case 'firstName':
        if (!value.trim()) errorMessage = "First name is required"
        else if (value.trim().length < 2) errorMessage = "First name must be at least 2 characters"
        break
      case 'lastName':
        if (!value.trim()) errorMessage = "Last name is required"
        else if (value.trim().length < 2) errorMessage = "Last name must be at least 2 characters"
        break
      case 'address':
        if (!value.trim()) errorMessage = "Address is required"
        else if (value.trim().length < 5) errorMessage = "Please enter a complete address"
        break
      case 'city':
        if (!value.trim()) errorMessage = "City is required"
        else if (value.trim().length < 2) errorMessage = "Please enter a valid city name"
        break
      case 'zipCode':
        if (!value.trim()) {
          errorMessage = "ZIP code is required"
        } else {
          // Different validation based on country
          if (formData.country?.code === "US" && !/^\d{5}(-\d{4})?$/.test(value)) {
            errorMessage = "Invalid US ZIP code"
          } else if (formData.country?.code === "GB" && !/^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i.test(value)) {
            errorMessage = "Invalid UK postal code"
          } else if (formData.country?.code === "CA" && !/^[A-Z]\d[A-Z] \d[A-Z]\d$/i.test(value)) {
            errorMessage = "Invalid Canadian postal code"
          } else if (formData.country?.code === "PK" && !/^\d{5}$/.test(value)) {
            errorMessage = "Invalid Pakistan postal code"
          }
        }
        break
      case 'country':
        if (!value) errorMessage = "Country is required"
        break
      case 'state':
        if (!value) errorMessage = "State/Province is required"
        break
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }))
    
    return errorMessage === ""
  }

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'zipCode', 'country', 'state']
    let isValid = true

    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })

    return isValid
  }

  // Function to calculate shipping charges based on Pakistan province
  const calculatePakistanShippingCharges = (province) => {
    if (!province || formData.country?.code !== "PK") {
      return 0
    }
    
    return pakistanShippingCharges[province] || 0
  }

  const updateFormData = (field, value) => {
    let updatedData = { ...formData }

    if (field === 'country') {
      updatedData = {
        ...formData,
        country: value,
        state: "", // Reset state when country changes
        shippingCharges: 0 // Reset shipping charges when country changes
      }
    } else if (field === 'state') {
      updatedData = {
        ...formData,
        [field]: value
      }
      
      // Calculate shipping charges for Pakistan provinces
      if (formData.country?.code === "PK") {
        updatedData.shippingCharges = calculatePakistanShippingCharges(value)
      }
    } else {
      updatedData = {
        ...formData,
        [field]: value
      }
    }

    // Validate the field
    validateField(field, value)

    // Update local state
    setFormData(updatedData)
    
    // Notify parent with properly structured data
    notifyParent(updatedData, phoneNumber)
  }

  const handlePhoneChange = (newPhoneNumber) => {
    setPhoneNumber(newPhoneNumber)
    notifyParent(formData, newPhoneNumber)
  }
  
  // Structure the data in the format expected by the parent component
  const notifyParent = (deliveryData, phone) => {
    const updatedData = {
      customerInfo: {
        deliveryInfo: {
          firstName: deliveryData.firstName,
          lastName: deliveryData.lastName,
          address: deliveryData.address,
          apartment: deliveryData.apartment,
          city: deliveryData.city,
          state: deliveryData.state,
          zipCode: deliveryData.zipCode,
          country: deliveryData.country,
          company: deliveryData.company,
          shippingCharges: deliveryData.shippingCharges
        },
        contactInfo: {
          phoneNumber: phone
        }
      }
    }
    
    onDeliveryInfoChange(updatedData)
  }

  const selectCountry = (country) => {
    updateFormData('country', country)
    setShowCountryDropdown(false)
    setSearchTerm("")
  }

  const selectState = (state) => {
    updateFormData('state', state)
    setShowStateDropdown(false)
  }

  // Get available states for the selected country
  const getAvailableStates = () => {
    if (formData.country && formData.country.code) {
      return statesByCountry[formData.country.code] || []
    }
    return []
  }

  // Filter countries based on search term
  const filteredCountries = searchTerm.length > 0
    ? countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : countries

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close country dropdown when clicking outside
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target) &&
        countryButtonRef.current &&
        !countryButtonRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false)
      }

      // Close state dropdown when clicking outside
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target) &&
        stateButtonRef.current &&
        !stateButtonRef.current.contains(event.target)
      ) {
        setShowStateDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-4">
      {/* Country Dropdown */}
      <div className="relative">
        <button
          ref={countryButtonRef}
          type="button"
          className={`w-full bg-white border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden flex items-center justify-between px-3 py-3`}
          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
        >
          <div className="flex items-center">
            <span className="mr-2">{formData.country?.flag || "🌍"}</span>
            <span className="text-sm md:text-base text-gray-700">
              {formData.country?.name || "Select Country"}
            </span>
          </div>
          <ChevronDown size={18} className="text-gray-500" />
        </button>
        {errors.country && <div className="text-red-500 text-xs mt-1">{errors.country}</div>}

        {showCountryDropdown && (
          <div
            ref={countryDropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div>
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 bg-white text-sm md:text-base cursor-pointer"
                  onClick={() => selectCountry(country)}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <input 
              type="text" 
              placeholder="First name" 
              className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              onBlur={(e) => validateField('firstName', e.target.value)}
            />
          </div>
          {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
        </div>
        <div>
          <div className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <input 
              type="text" 
              placeholder="Last name" 
              className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              onBlur={(e) => validateField('lastName', e.target.value)}
            />
          </div>
          {errors.lastName && <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>}
        </div>
      </div>

      {/* Company */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <input 
          type="text" 
          placeholder="Company (optional)" 
          className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
          value={formData.company}
          onChange={(e) => updateFormData('company', e.target.value)}
        />
      </div>

      {/* Address */}
      <div>
        <div className={`relative border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden flex items-center`}>
          <input 
            type="text" 
            placeholder="Address" 
            className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            onBlur={(e) => validateField('address', e.target.value)}
          />
          <div className="pr-3">
            <Search size={18} className="text-gray-500" />
          </div>
        </div>
        {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
      </div>

      {/* Apartment */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <input 
          type="text" 
          placeholder="Apartment, suite, etc. (optional)" 
          className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
          value={formData.apartment}
          onChange={(e) => updateFormData('apartment', e.target.value)}
        />
      </div>

      {/* City, State, Zip */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <input 
              type="text" 
              placeholder="City" 
              className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              onBlur={(e) => validateField('city', e.target.value)}
            />
          </div>
          {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
        </div>

        {/* State Dropdown */}
        <div className="relative">
          <button
            ref={stateButtonRef}
            type="button"
            className={`w-full bg-white border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden flex items-center justify-between px-3 py-3`}
            onClick={() => formData.country?.code && getAvailableStates().length > 0 && setShowStateDropdown(!showStateDropdown)}
            disabled={!formData.country?.code || getAvailableStates().length === 0}
          >
            <span className="text-sm md:text-base text-gray-700">
              {formData.state || "State/Province"}
            </span>
            <ChevronDown size={18} className="text-gray-500" />
          </button>
          {errors.state && <div className="text-red-500 text-xs mt-1">{errors.state}</div>}

          {showStateDropdown && getAvailableStates().length > 0 && (
            <div
              ref={stateDropdownRef}
              className="absolute z-[9999] w-full mt-1 bg-white !important border border-gray-300 rounded shadow-lg overflow-y-auto"
              style={{ 
                top: '100%',
                backgroundColor: 'white !important',
                maxHeight: 'calc(3 * 2.5rem)', // Height for exactly 3 items (2.5rem = 40px per item)
                minHeight: 'calc(3 * 2.5rem)'
              }}
            >
              <div className="bg-white">
                {getAvailableStates().map((state) => (
                  <div
                    key={state}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 bg-white text-sm md:text-base cursor-pointer h-10"
                    onClick={() => selectState(state)}
                  >
                    {state}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className={`border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <input 
              type="text" 
              placeholder="ZIP code" 
              className="w-full px-3 py-3 outline-none bg-white text-sm md:text-base"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              onBlur={(e) => validateField('zipCode', e.target.value)}
            />
          </div>
          {errors.zipCode && <div className="text-red-500 text-xs mt-1">{errors.zipCode}</div>}
        </div>
      </div>

      {/* Phone Input */}
      <div className="rounded overflow-hidden bg-white">
        <PhoneInput 
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  )
}

export default DeliveryForm