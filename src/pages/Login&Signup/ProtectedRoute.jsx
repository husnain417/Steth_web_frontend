import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * Protected route component that checks if user is authenticated
 * Redirects to login if not authenticated or token is expired
 */
const ProtectedRoute = () => {
  const { checkAuthenticated, loading } = useContext(AuthContext);
  const [isAuth, setIsAuth] = useState(null);
  
  useEffect(() => {
    if (!loading) {
      setIsAuth(checkAuthenticated());
    }
  }, [loading, checkAuthenticated]);

  // Show loading state while we determine authentication
  if (loading || isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;