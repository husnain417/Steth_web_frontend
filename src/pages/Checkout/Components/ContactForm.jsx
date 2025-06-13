import React, { useState, useEffect } from 'react'

const ContactForm = ({ data, onChange }) => {
  // Ensure we're working with proper data structure
  const [formData, setFormData] = useState({
    email: data?.email || "",
  })

  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
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
            if (data.user && data.user.email) {
              setFormData(prev => ({
                ...prev,
                email: data.user.email
              }))
              onChange({
                ...formData,
                email: data.user.email
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    onChange({
      ...formData,
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