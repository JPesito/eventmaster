import React from 'react';
import { Button, Typography } from '@mui/material';

const CheckLoginStatusButton = () => {
  const checkLoginStatus = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Recuperar el usuario de localStorage
    if (user) {
      alert(`Estás logueado como ${user.fullName}`);
    } else {
      alert('No estás logueado');
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={checkLoginStatus}>
      Verificar Estado de Sesión
    </Button>
  );
};

export default CheckLoginStatusButton;