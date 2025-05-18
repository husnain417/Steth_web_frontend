import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import ProductDetail from './Components/DetailSection';
import MenBestSellers from '../Menspage/Components/MensBestSeller';
import ProductReviews from './Components/ReviewsSection';
import AwsomeHumansFooter from '../../components/Footer';
import ProductFeatures from './Components/Features';

const ProductDetailPage = ({ children }) => {
  // Make sure we're getting the correct parameter name
  const params = useParams();
  const productId = params.productId; // This should match your route path parameter name
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Product ID from URL params:', productId);
    
    const fetchProductData = async () => {
      try {
        // Make sure the productId is available before making the request
        if (!productId) {
          setError('No product ID provided');
          setLoading(false);
          return;
        }
        
        const apiUrl = `https://steth-backend.onrender.com/api/products/${productId}`;
        console.log('Making API request to:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success) {
          setProduct(data.data);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (err) {
        console.error('Error details:', err);
        setError(`Error fetching product details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]); // Make sure productId is in the dependency array

  // Add font styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-300.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-regular.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-500.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-600.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/poppins-v20-latin-700.woff2') format('woff2');
      }
      
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
      }
      
      .font-poppins {
        font-family: 'Poppins', sans-serif;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="font-poppins min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
        <AwsomeHumansFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <AwsomeHumansFooter />
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-white">
      <Header />
      {product && (
        <>
          <ProductDetail product={product} />
          <ProductFeatures product={product} />
          <main className="flex-grow mb-20">{children}</main>
        </>
      )}
      < AwsomeHumansFooter />
    </div>
  );
};

export default ProductDetailPage;