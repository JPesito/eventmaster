import React, { useState, useEffect } from 'react';
import { Box, Drawer, Divider, IconButton, Typography } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon, AppRegistration as Register, Event as EventIcon, BarChart as BarChartIcon, Science as ScienceIcon } from '@mui/icons-material';
import { DrawerHeader, Overlay, drawerStyles } from './Navbar.styles';
import { MenuButton } from './MenuButton';
import { SidebarMenu } from './SidebarMenu';
import { LoginButton } from './LoginButton';
import loginAnimation from '../../animations/click.lottie';

const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/' },
  { text: 'Registro', icon: <Register />, path: '/register' },
  { text: 'Eventos', icon: <EventIcon />, path: '/home' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/reports' },
  { text: 'Labs', icon: <ScienceIcon />, path: '/labs' },
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Verifica si hay un usuario logueado en el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Usuario desde localStorage:', storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const toggleDrawer = (newOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(newOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Elimina al usuario del localStorage
    setUser(null); // Actualiza el estado a null para que el nombre desaparezca
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MenuButton onClick={toggleDrawer(!isDrawerOpen)} />
      {isDrawerOpen && <Overlay isOpen={isDrawerOpen} onClick={toggleDrawer(false)} />}
      <Drawer
        variant="temporary"
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Mejora el rendimiento en dispositivos móviles
        }}
        sx={drawerStyles}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer(false)} aria-label="cerrar menú">
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* Mostrar login o nombre de usuario */}
        {!user ? (
          <LoginButton animationSrc={loginAnimation} />
        ) : (
          <>
            <Typography variant="body1">Hola, {user.fullName}</Typography>
            <Divider />
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
        <Divider />
        <SidebarMenu menuItems={menuItems} />
      </Drawer>
    </Box>
  );
}
