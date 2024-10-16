import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ element: Element, ...rest }) => {
    const { auth } = useAuth(); // Accede al contexto de autenticación
  
    return (
      <Route
        {...rest}
        element={auth.token && auth.role === 'admin' ? Element : <Navigate to="/login" />}
      />
    );
  };
  
  export default ProtectedAdminRoute;