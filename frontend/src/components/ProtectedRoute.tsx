import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  children?: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children || <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;