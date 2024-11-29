import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { StyledHero, AnimatedEvent, StyledMaster } from './HomeInit.styles';
import NodulesAnimation from '../animations/NodulesAnimation';
import LogoEM from '../../assets/1.png';

export default function HomeInit() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
      }}
    >
      {/* Fondo animado */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <NodulesAnimation />
      </Box>

      {/* AppBar */}
      <AppBar position="sticky" sx={{ backgroundColor: 'transparent', boxShadow: 'none', backdropFilter: 'none' }}>
        <Toolbar>
          <Box
            component="img"
            src={LogoEM}
            alt="Logo"
            sx={{
              height: 40,
              mr: 2,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Contenedor principal centrado */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Hero Section */}
        <StyledHero>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ textAlign: 'center', display: 'inline-block', lineHeight: 1.05 }}
          >
            <AnimatedEvent>EVENT</AnimatedEvent>
            <StyledMaster>MASTER</StyledMaster>
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            La solución perfecta para registrar y ordenar la información de tus salones de eventos.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              boxShadow: '0 4px 6px rgba(0, 123, 255, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(0, 123, 255, 0.3)',
              },
            }}
            href="#features"
          >
            Comenzar
          </Button>
        </StyledHero>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(0, 31, 63, 0.9)',
          color: '#fff',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Event Master. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
