import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Event as EventIcon,
  BarChart as BarChartIcon,
  ChevronRight as ChevronRightIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loginAnimation from '../../animations/click.lottie'

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Overlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: theme.zIndex.drawer - 1,
  transition: 'opacity 0.3s ease-in-out',
}));

export default function ModernMaterialSidebar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(newOpen);
  };

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Eventos', icon: <EventIcon />, path: '/events' },
    { text: 'Reportes', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Labs', icon: <ScienceIcon />, path: '/labs' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        color="inherit"
        aria-label="abrir menú"
        edge="start"
        onClick={toggleDrawer(!open)}
        sx={{
          position: 'fixed',
          right: 16,
          top: 16,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: '50%',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      {open && <Overlay onClick={toggleDrawer(false)} />}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'background.paper',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer(false)} aria-label="cerrar menú">
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/login">
              <ListItemIcon>
              <DotLottieReact
                src={loginAnimation}
                loop={true}
                autoplay
                style={{
                  height: '100px', 
                  width: '100px'
                }}
              />
              </ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component="a" href={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}