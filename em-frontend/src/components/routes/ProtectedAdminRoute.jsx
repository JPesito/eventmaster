import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de ajustar esta ruta según tu estructura

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && localStorage.getItem('userRole') === 'admin'; // Ajusta según cómo manejes roles

  return isAdmin ? children : <Navigate to="/login" />;
};

export default ProtectedAdminRoute;
