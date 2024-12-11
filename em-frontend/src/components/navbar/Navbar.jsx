import React, { useState } from 'react';
import { Box, Drawer, Divider, IconButton } from '@mui/material';
import { ChevronRight as ChevronRightIcon, Home as HomeIcon, AppRegistration as Register, Event as EventIcon, BarChart as BarChartIcon, Science as ScienceIcon } from '@mui/icons-material';
import { DrawerHeader, Overlay, drawerStyles } from './Navbar.styles';
import { MenuButton } from './MenuButton';
import { SidebarMenu } from './SidebarMenu';
import { LoginButton } from './LoginButton';
import loginAnimation from '../../animations/click.lottie';

const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/' },
  { text: 'Registro', icon: <Register />, path: '/register' },
  { text: 'Eventos', icon: <EventIcon />, path: '/events' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/reports' },
  { text: 'Labs', icon: <ScienceIcon />, path: '/labs' },
];

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (newOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(newOpen);
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
        <LoginButton animationSrc={loginAnimation} />
        <Divider />
        <SidebarMenu menuItems={menuItems} />
      </Drawer>
    </Box>
  );
}
