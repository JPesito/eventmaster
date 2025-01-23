import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import LoginUsers from '../login/LoginUsers';  // Asegúrate de importar el componente del modal

export const LoginButton = ({ animationSrc }) => {
  const [open, setOpen] = useState(false);  // Estado para controlar si el modal está abierto o cerrado

  const handleOpen = () => setOpen(true);   // Función para abrir el modal
  const handleClose = () => setOpen(false); // Función para cerrar el modal

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleOpen}>
            <ListItemIcon>
              <DotLottieReact
                src={animationSrc}
                loop
                autoplay
                style={{
                  height: '80px', // Ajusta según sea necesario
                  width: '80px',
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Iniciar Sesión" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* El Modal de Login */}
      <LoginUsers open={open} onClose={handleClose} />
    </>
  );
};
