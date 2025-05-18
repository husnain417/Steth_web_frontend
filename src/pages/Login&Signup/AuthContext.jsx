import { createContext, useState, useEffect } from 'react';

// Helper function to decode JWT (without verification)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.exp && decoded.exp * 1000 < Date.now();
};

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        if (isTokenExpired(token)) {
          // Token is expired, remove it and update state
          localStorage.removeItem('accessToken');
          setIsLoggedIn(false);
          setUser(null);
        } else {
          // Token is valid
          const decoded = decodeJWT(token);
          setIsLoggedIn(true);
          setUser(decoded); // Set user data from decoded token
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
    
    // Set up periodic token validation (every minute)
    const intervalId = setInterval(() => {
      checkAuth();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Login function
  const login = (token) => {
    if (isTokenExpired(token)) {
      throw new Error('Token is expired');
    }
    
    localStorage.setItem('accessToken', token);
    const decoded = decodeJWT(token);
    setIsLoggedIn(true);
    setUser(decoded);
  };

  // Check if user is authenticated (for protected routes)
  const checkAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    if (isTokenExpired(token)) {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      setUser(null);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        setIsLoggedIn, 
        user, 
        loading, 
        logout,
        login,
        checkAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;