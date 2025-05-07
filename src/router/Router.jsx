// src/routes/AppRouter.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components
import Homepage from '../pages/Homepage/Homepage';
import MensPage from '../pages/Menspage/MensPage';
import WomenPage from '../pages/Womenpage/WomenPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login&Signup/Login';
import Signup from '../pages/Login&Signup/SignUp';
import OTP from '../pages/Login&Signup/OTP';
import PasswordRecovery from '../pages/Login&Signup/Password-Recovery'
import AboutUs from '../pages/AboutUs/AboutUs';
import Profile from '../pages/Profile/Profile';
import StudentVerification from '../pages/Student/Student';
import CartPage from '../pages/Cart/Cart';
import ProductDetail from '../pages/ProductDetailPage/ProductDetail';
import ColorProductsPage from '../pages/ColorProduct/ColorProductPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Homepage as root path */}
      <Route path="/" element={<Homepage />} />
      
      {/* Men's page route */}
      <Route path="/men" element={<MensPage />} />



        {/* Women's page route */}
        <Route path="/women" element={<WomenPage />} />



        
         {/* Women's page route */}
         <Route path="/checkout" element={<CheckoutPage />} />
         <Route path="/color-products/:colorName" element={<ColorProductsPage />} />


    
      
      {/* Product detail routes */}
      <Route path="/product/:productId" element={<ProductDetail/>} />
      <Route path="/profile"  element={<Profile/>} />
      



      <Route path="/login"  element={<Login/>} />
      <Route path="/signup"  element={<Signup/>} />
      <Route path="/otp"  element={<OTP/>} />
      <Route path="/password-recovery"  element={<PasswordRecovery/>} />

      <Route path="/aboutus"  element={<AboutUs/>} />


      <Route path="/students"  element={<StudentVerification/>} />


      <Route path="/cart"  element={<Cart/>} />






      {/* Add additional routes as needed */}
      {/* <Route path="/womens" element={<WomensPage />} /> */}
      {/* <Route path="/about" element={<AboutPage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} /> */}
      {/* <Route path="/cart" element={<CartPage />} /> */}
      {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      
      {/* 404 route - must be last */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export default AppRouter;