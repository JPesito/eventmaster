import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { StyledHero, AnimatedEvent, StyledMaster } from './HomeInit.styles';
import NodulesAnimation from '../animations/NodulesAnimation';
import LoginUsers from '../login/LoginUsers';
import LogoEM from '../../assets/Logo_UH.svg';
import IconReserva from '../../assets/HomeInit_CheckList.svg';
import IconAgregar from '../../assets/HomeInit_Add.svg';

<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap" rel="stylesheet"></link>;

export default function HomeInit() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate(); // Hook de navegación

  // Estado para el modal de login
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleOpenLoginModal = () => setOpenLoginModal(true);
  const handleCloseLoginModal = () => setOpenLoginModal(false);

  const handleNavigateToRegister = () => navigate('/register'); // Redirección a /register

  const renderCard = (onClick, backgroundColor, iconSrc, title, description) => (
    <Card
      sx={{
        maxWidth: isMobile ? 280 : 300,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        },
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box
          sx={{
            backgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
          }}
        >
          <CardMedia
            component="img"
            src={iconSrc}
            alt={title}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              padding: 2,
            }}
          />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "'Josefin Sans', sans-serif",
              textAlign: 'center',
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

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
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'none',
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src={LogoEM}
            alt="Logo"
            sx={{ height: 80, mr: 2, marginTop: 1 }}
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
          textAlign: 'center',
          paddingBottom: 3,
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
          <Typography
            variant="body1"
            component="p"
            paragraph
            sx={{ paddingTop: '25px', fontFamily: "'Josefin Sans', sans-serif", fontSize: '25px' }}
          >
            La solución ideal para registrar y ordenar la información de tus espacios institucionales.
          </Typography>
        </StyledHero>

        {/* Tarjetas */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {renderCard(
            handleNavigateToRegister, // Redirección a /register
            '#FAC5C5',
            IconReserva,
            'Registrar Asistencia',
            'Registra tus asistencias a las salas para poder ayudarte.'
          )}
          {renderCard(
            handleOpenLoginModal, // Abre el modal al hacer clic
            '#9fc7fc',
            IconAgregar,
            'Agregar Reserva',
            'Crea y administra nuevas reservas de salas de forma rápida y sencilla.'
          )}
        </Box>
      </Container>

      {/* Modal de Login */}
      <LoginUsers open={openLoginModal} onClose={handleCloseLoginModal} />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(0, 31, 63, 0.9)',
          color: '#fff',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" align="center" fontFamily="'Josefin Sans', sans-serif">
            © {new Date().getFullYear()} Event Master
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
