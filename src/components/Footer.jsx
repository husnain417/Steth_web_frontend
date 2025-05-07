import React from 'react';

const AwesomeHumansFooter = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-20 my-20">
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0">
          <div className="w-full md:w-1/4 pr-8">
            <h1 className="text-4xl font-bold mb-4">#STETHSET</h1>
            <p className="text-gray-400 mb-6">#WEARSTETH</p>

            <div className="flex space-x-4 mb-8">
             
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
            </div>
          </div>

          <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">GET HELP</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Returns & Exchanges</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sign up for Texts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li className="text-gray-400">424-500-8209</li>
                <li className="text-gray-400">1-888-462-1901</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">OUR COMPANY</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Our Story</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">MORE INFO</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Gift Cards</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Care Instructions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Student Discount</a></li>
              
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">STETH Terms & Conditions</a></li>
                 </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 STETH, INC. ALL RIGHTS RESERVED</p>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Use</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">PAKISTAN | ENGLISH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AwesomeHumansFooter;

