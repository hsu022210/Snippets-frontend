import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PrivateRouteProps } from '../types/interfaces'

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  // Don't redirect to login if we're already navigating away (like during logout)
  if (!token && location.pathname !== '/') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 