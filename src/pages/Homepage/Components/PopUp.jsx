import React, { useState, useEffect, useContext } from 'react';
import { X, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Login&Signup/AuthContext';

const RegistrationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show popup if user is not logged in and not loading
    if (!isLoggedIn && !isLoading) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isLoading]);

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match this duration with your CSS transition
  };

  const navigateToRegister = () => {
    closePopup();
    navigate("/signup");
  };

  // Don't render anything if:
  // - Still checking auth status
  // - User is logged in
  // - Popup is closed
  if (isLoading || isLoggedIn || !isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className={`relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Close button */}
        <button 
          onClick={closePopup}
          className="absolute right-4 top-4 bg-white text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        {/* Discount badge */}
        <div className="absolute -top-6 -right-6 bg-gray-800 text-white font-bold rounded-full p-4 shadow-lg flex items-center justify-center w-16 h-16 transform rotate-12">
          <span className="text-lg">10%</span>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-6 pt-2">
          {/* Icon */}
          <div className="bg-gray-100 p-3 rounded-full">
            <Tag size={28} className="text-gray-700" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900">Get 10% Off</h2>

          {/* Decorative element */}
          <div className="w-24 h-1 bg-gray-400 rounded-full"></div>

          {/* Description */}
          <p className="text-gray-700">
            Register today and receive an exclusive <span className="font-semibold text-gray-900">10% discount</span> on your first order!
          </p>

          {/* CTA Button */}
          <button
            onClick={navigateToRegister}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            aria-label="Create account"
          >
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>

          {/* Fine print */}
          <p className="text-xs text-gray-500">
            *Offer valid for new customers only. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPopup;