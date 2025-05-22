import React, { useState } from 'react'

const ContactForm = ({ data, onChange }) => {
  // Ensure we're working with proper data structure
  const formData = {
    email: data?.email || "",
  }

  const [error, setError] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    setError("")
    return true
  }

  const handleChange = (field, value) => {
    validateEmail(value)
    onChange({
      ...formData,  // Preserve existing data
      [field]: value
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div></div>
        <a href="/login" className="text-sm text-gray-700 underline">
          Log in
        </a>
      </div>

      <div className="mb-4">
        <div className={`border ${error ? 'border-red-500' : 'border-gray-300'} overflow-hidden focus-within:border-gray-500`}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-3 outline-none bg-white"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        ) : (
        <p className="text-xs text-gray-500 mt-1">Enter a valid email</p>
        )}
      </div>

      {/* You could add marketing consent checkbox here */}
    </div>
  )
}

export default ContactForm