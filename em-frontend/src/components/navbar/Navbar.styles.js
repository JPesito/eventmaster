import { styled } from '@mui/material/styles';

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export const Overlay = styled('div')(({ theme, isOpen }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: theme.zIndex.drawer - 1,
  opacity: isOpen ? 1 : 0, // Asegura que no interfiera cuando el Drawer está cerrado
  pointerEvents: isOpen ? 'auto' : 'none',
  transition: 'opacity 0.3s ease-in-out',
}));

export const menuButtonStyles = (theme) => ({
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
});

export const drawerStyles = {
  '& .MuiDrawer-paper': {
    width: 240,
    bgcolor: 'background.paper',
  },
};
