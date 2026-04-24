import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../utils/store';

/**
 * Protected route component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = useGameStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
