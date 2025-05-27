"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { gsap } from "gsap"
import { Eye, EyeOff, ArrowRight, Mail, Lock, X, Upload, CheckCircle, User, BookOpen } from "lucide-react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"
import { AuthContext } from '../Login&Signup/AuthContext';

const StudentVerification = () => {
  const { isLoggedIn, isLoading: authLoading } = useContext(AuthContext);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  return (
    <div className="bg-white w-screen">
      <Header />
      <Hero isLoggedIn={isLoggedIn} />
      {isLoggedIn && !verificationSubmitted && (
        <VerificationForm 
          verificationSubmitted={verificationSubmitted} 
          setVerificationSubmitted={setVerificationSubmitted} 
        />
      )}
      {verificationSubmitted && <SuccessMessage />}
      <CTA isLoggedIn={isLoggedIn} verificationSubmitted={verificationSubmitted} />
      <Footer />
    </div>
  )
}

const Hero = ({ isLoggedIn }) => {
  const heroRef = useRef(null)
  const benefitsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    })

    if (heroRef.current) {
      tl.fromTo(heroRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8 })
    }

    const benefitItems = document.querySelectorAll(".benefit-item")
    if (benefitItems.length > 0) {
      tl.fromTo(
        benefitItems,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      )
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative bg-gradient-to-br from-gray-800 to-black text-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            STUDENT EXCLUSIVE: 5% OFF ALL ORDERS
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Verify your student status and enjoy exclusive discounts on premium medical wear. Designed for future
            healthcare professionals like you.
          </p>
        </div>

        <div ref={benefitsRef} className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="benefit-item bg-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold mb-2">5% OFF</div>
            <p className="text-gray-300">
              Permanent discount on all subsequent orders after verification
            </p>
          </div>
          <div className="benefit-item bg-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold mb-2">QUALITY GEAR</div>
            <p className="text-gray-300">
              Professional-grade medical wear at student-friendly prices
            </p>
          </div>
          <div className="benefit-item bg-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold mb-2">EASY VERIFICATION</div>
            <p className="text-gray-300">
              Simple one-time verification process with your student ID
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Login to Verify
              <ArrowRight size={16} className="ml-2" />
            </Link>
          ) : (
            <a
              href="#verify"
              className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Verify Now
              <ArrowRight size={16} className="ml-2" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

const VerificationForm = ({ verificationSubmitted, setVerificationSubmitted }) => {
  const [fullName, setFullName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [universityEmail, setUniversityEmail] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [studentCard, setStudentCard] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    fullName: "",
    rollNumber: "",
    universityEmail: "",
    institutionName: "",
    studentCard: "",
  })

  const verificationFormRef = useRef(null)
  const errorRef = useRef(null)

  useEffect(() => {
    if (!verificationFormRef.current || verificationSubmitted) return

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    })

    tl.fromTo(verificationFormRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })

    return () => {
      tl.kill()
    }
  }, [verificationSubmitted])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setStudentCard(file)
      setErrors({ ...errors, studentCard: "" })

      // Clean up any previous object URLs to prevent memory leaks
      if (studentCard && typeof studentCard === "object" && "preview" in studentCard) {
        URL.revokeObjectURL(studentCard.preview)
      }
    }
  }

  const validateVerificationForm = () => {
    let isValid = true
    const newErrors = {
      fullName: "",
      rollNumber: "",
      universityEmail: "",
      institutionName: "",
      studentCard: "",
    }

    // Name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
      isValid = false
    }

    // Roll number validation
    if (!rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required"
      isValid = false
    }

    // Institution name validation
    if (!institutionName.trim()) {
      newErrors.institutionName = "Institution name is required"
      isValid = false
    }

    // University email validation
    if (!universityEmail.trim()) {
      newErrors.universityEmail = "University email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(universityEmail)) {
      newErrors.universityEmail = "Email is invalid"
      isValid = false
    } else if (!universityEmail.includes(".edu") && !universityEmail.includes(".ac")) {
      newErrors.universityEmail = "Must be a valid educational email"
      isValid = false
    }

    // Student card validation
    if (!studentCard) {
      newErrors.studentCard = "Student card is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateVerificationForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("Please login to submit verification");
        setIsLoading(false);
        return;
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('studentId', rollNumber);
      formData.append('institutionName', institutionName);
      formData.append('name', fullName);
      formData.append('studentIdImage', studentCard);

      const response = await fetch('http://localhost:5000/api/student-verification/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit verification');
      }

      // If successful, show success message
      setVerificationSubmitted(true);

      // Scroll to success message
      setTimeout(() => {
        const successSection = document.getElementById("success");
        if (successSection) {
          successSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (err) {
      setError(err.message || 'Error submitting verification');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (studentCard && typeof studentCard === "object") {
        URL.revokeObjectURL(studentCard)
      }
    }
  }, [])

  return (
    <section id="verify" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black">Verify as a Student</h2>
          <p className="text-gray-600 mt-2">
            Complete the form below to verify your student status and unlock your 5% discount
          </p>
        </div>

        {error && (
          <div
            ref={errorRef}
            className="mx-auto max-w-md mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center justify-between"
          >
            <span className="text-sm md:text-base">{error}</span>
            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        <div
          ref={verificationFormRef}
          className="w-full max-w-md md:max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-800 to-black text-white">
            <h2 className="text-2xl md:text-3xl font-bold">Student Verification</h2>
            <p className="mt-2 text-gray-300 text-sm md:text-base">
              Provide your student details to get verified
            </p>
          </div>

          <form onSubmit={handleVerificationSubmit} className="p-6 sm:p-8 space-y-4 md:space-y-6">
            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-sm md:text-base font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, fullName: "" })
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-2 md:py-3 text-black text-sm md:text-base border bg-white rounded-md shadow-sm focus:ring-black focus:border-black ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Roll Number Field */}
            <div className="space-y-1">
              <label htmlFor="rollNumber" className="block text-sm md:text-base font-medium text-gray-700">
                Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen size={18} className="text-gray-400" />
                </div>
                <input
                  id="rollNumber"
                  type="text"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, rollNumber: "" })
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-2 text-black md:py-3 text-sm md:text-base border bg-white rounded-md shadow-sm focus:ring-black focus:border-black ${
                    errors.rollNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="MED2023001"
                />
              </div>
              {errors.rollNumber && <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
            </div>

            {/* Institution Name Field */}
            <div className="space-y-1">
              <label htmlFor="institutionName" className="block text-sm md:text-base font-medium text-gray-700">
                Institution Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen size={18} className="text-gray-400" />
                </div>
                <input
                  id="institutionName"
                  type="text"
                  value={institutionName}
                  onChange={(e) => {
                    setInstitutionName(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, institutionName: "" })
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-2 text-black md:py-3 text-sm md:text-base border bg-white rounded-md shadow-sm focus:ring-black focus:border-black ${
                    errors.institutionName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your University/College Name"
                />
              </div>
              {errors.institutionName && <p className="mt-1 text-sm text-red-600">{errors.institutionName}</p>}
            </div>

            {/* University Email Field */}
            <div className="space-y-1">
              <label htmlFor="universityEmail" className="block text-sm md:text-base font-medium text-gray-700">
                University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="universityEmail"
                  type="email"
                  value={universityEmail}
                  onChange={(e) => {
                    setUniversityEmail(e.target.value)
                    if (/\S+@\S+\.\S+/.test(e.target.value)) {
                      setErrors({ ...errors, universityEmail: "" })
                    }
                  }}
                  className={`block w-full pl-10 text-black pr-3 py-2 md:py-3 text-sm md:text-base border bg-white rounded-md shadow-sm focus:ring-black focus:border-black ${
                    errors.universityEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john.doe@university.edu"
                />
              </div>
              {errors.universityEmail && <p className="mt-1 text-sm text-red-600">{errors.universityEmail}</p>}
            </div>

            {/* Student Card Upload */}
            <div className="space-y-1">
              <label htmlFor="studentCard" className="block text-sm md:text-base font-medium text-gray-700">
                Upload Student Card
              </label>
              <div className="relative">
                <label
                  htmlFor="studentCard"
                  className={`flex items-center justify-center w-full p-4 md:p-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${
                    errors.studentCard ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {studentCard ? (
                      <div className="flex flex-col items-center">
                        {studentCard.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(studentCard) || "/placeholder.svg"}
                            alt="Student Card Preview"
                            className="h-24 object-contain mb-2 rounded-md max-w-full"
                          />
                        ) : (
                          <div className="bg-gray-100 p-3 rounded-md mb-2">
                            <Upload size={24} className="text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm md:text-base text-gray-700 font-medium">{studentCard.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm md:text-base text-gray-500">
                          Click to upload your student card
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    id="studentCard"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.studentCard && <p className="mt-1 text-sm text-red-600">{errors.studentCard}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 md:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Verify Student Status
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

const SuccessMessage = () => {
  const successRef = useRef(null)

  useEffect(() => {
    if (!successRef.current) return

    gsap.fromTo(
      successRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
    )
  }, [])

  return (
    <section id="success" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={successRef}
          className="max-w-2xl mx-auto text-center p-8 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black">Verification Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your student verification is pending review. You will receive an email once your student status has
            been confirmed. This typically takes 1-2 business days.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
            <p className="text-blue-800 font-medium">
              Important: Keep checking your email for approval status
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Please regularly check both your inbox and spam folders for our verification response. If you don't see it within 2 business days, please contact our support team.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="font-medium">What happens next?</p>
            <ol className="text-left list-decimal pl-6 space-y-2">
              <li>Our team will verify your student ID</li>
              <li>You'll receive a confirmation email</li>
              <li>Your account will be activated with student benefits</li>
              <li>Enjoy 5% off on all your orders!</li>
            </ol>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const CTA = ({ isLoggedIn, verificationSubmitted }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-black text-white shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  Ready to Save on Premium Medical Wear?
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl">
                  Join thousands of medical students who are already enjoying exclusive discounts and benefits.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex lg:justify-end">
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Login Now
                    </Link>
                  ) : !verificationSubmitted ? (
                    <a
                      href="#verify"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Verify Now
                    </a>
                  ) : (
                    <a
                      href="/"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Shop Now
                    </a>
                  )}
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
                  >
                    Browse Collection
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentVerification
