import React from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import LoginImage from '../../assets/login/Banner_Login.png';
import LogoUH from '../../assets/Logo_UH_Base.svg' // Cambia esta ruta por la imagen deseada.

export default function LoginUsers({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Fade in={open}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '90%' : '60%',
            height: isMobile ? 'auto' : '70%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'hidden',
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Parte izquierda: Formulario */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: isMobile ? 2 : 4,
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Imagen en la parte superior */}
            <Box
              component="img"
              src={LogoUH}
              alt="Login"
              sx={{
                width: isMobile ? 120 : 150,
                height: 'auto',
                marginBottom: 4,
                currentColor: '#0052A1',
              }}
            />

            {/* Contenedor con sombra */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 350,
                padding: 3,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: 2,
                backgroundColor: '#DEE3E3',
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ marginBottom: 2, textAlign: 'center' }}
              >
                Bienvenido
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: 4, textAlign: 'center' }}
              >
                Inicia sesión para continuar
              </Typography>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Iniciar Sesión
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                ¿Olvidaste tu contraseña?{' '}
                <Button size="small" sx={{ textTransform: 'none', padding: 0 }}>
                  Recuperar
                </Button>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', marginTop: 1 }}
              >
                ¿No tienes una cuenta?{' '}
                <Button size="small" sx={{ textTransform: 'none', padding: 0 }}>
                  Regístrate
                </Button>
              </Typography>
            </Box>
          </Box>

          {/* Parte derecha: Imagen de fondo (solo para pantallas grandes) */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                backgroundImage: `url(${LoginImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
