import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useBrand } from '../contexts/BrandContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { brand } = useBrand();

  if (!brand) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;