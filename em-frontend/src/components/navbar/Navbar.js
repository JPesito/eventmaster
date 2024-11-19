import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationuser from '../../animations/loginUser.lottie';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const menuItems = [
    { text: 'Inicio', path: '/' },
    { text: 'Eventos', path: '/events' },
    { text: 'Reportes', path: '/reports' }
  ];

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        onClick={toggleDrawer(true)}
        aria-label="menu"
        style={{ position: 'absolute', top: 16, right: 16 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
            <DotLottieReact
              src={successAnimationuser}
              loop={false}
              autoplay
              style={{ height: '50px', width: '50px' }}
            />
            <ListItemText primary="Iniciar Sesión" />
          </ListItem>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path} onClick={toggleDrawer(false)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          
        </List>
      </Drawer>
    </div>
  );
};

export default Navbar;
