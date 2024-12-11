import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const LoginButton = ({ animationSrc }) => (
  <List>
    <ListItem disablePadding>
      <ListItemButton component="a" href="/login">
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
);
