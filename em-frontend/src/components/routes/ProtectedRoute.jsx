import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginUsers from '../login/LoginUsers'; // Ajusta la ruta según tu estructura

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isAuthenticated) {
    // Si no está autenticado, abrir el modal de inicio de sesión
    if (!showLoginModal) {
      setShowLoginModal(true);
    }

    // Mostrar el modal de inicio de sesión
    return (
      <>
        <LoginUsers
          open={showLoginModal}
          onClose={() => {
            setShowLoginModal(false); // Cerrar el modal
            if (!isAuthenticated) {
              // Si no se autenticó, redirigir al usuario a "/"
              return <Navigate to="/" />;
            }
          }}
        />
      </>
    );
  }

  // Si está autenticado, renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
