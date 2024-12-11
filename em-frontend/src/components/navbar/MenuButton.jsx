import React from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export const MenuButton = ({ onClick }) => {
  return (
    <IconButton
      color="inherit"
      aria-label="abrir menú"
      edge="start"
      onClick={onClick}
      sx={(theme) => ({
        position: 'fixed',
        right: 16,
        top: 16,
        zIndex: theme.zIndex.drawer + 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: '50%',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      })}
    >
      <MenuIcon />
    </IconButton>
  );
};
