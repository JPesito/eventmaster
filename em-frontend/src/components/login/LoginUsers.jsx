import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Fade,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import LoginImage from '../../assets/login/Banner_Login.png';
import LogoUH from '../../assets/Logo_UH_Base.svg'; // Cambia esta ruta por la imagen deseada.
import './LoginUsers.css'; // Importa los estilos
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginUsers({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estados para los campos de texto y el indicador de carga
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState(''); // Para mostrar errores
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga

  // Función para manejar el envío del formulario
  const handleLogin = async () => {
    if (!userName.trim()) {
      setError('El nombre de usuario no puede estar vacío.');
      return;
    }
    if (!userPassword.trim()) {
      setError('La contraseña no puede estar vacía.');
      return;
    }
  
    setIsLoading(true); // Mostrar indicador de carga
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        userName,
        userPassword,
      });
  
      // Obtener los datos de la respuesta, que incluyen token y nombre completo
      const { token, fullName } = response.data;
  
      // Guardar en localStorage
      const user = { fullName, token };
      localStorage.setItem('user', JSON.stringify(user));
  
      // Llamar a la función de login del contexto de autenticación
      login(token); // Guardar el token en el contexto y localStorage
  
      // Redirigir al usuario a /home
      setError('');
      navigate('/home');
    } catch (err) {
      // Manejo de errores del servidor
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al intentar iniciar sesión.');
      }
    } finally {
      setIsLoading(false); // Ocultar indicador de carga
    }
  };
  

  const checkLoginStatus = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      alert('El usuario está logueado: ' + user.fullName); // Muestra el nombre del usuario
    } else {
      alert('No hay usuario logueado');
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Fade in={open}>
        <Box className={`login-modal ${!isMobile ? 'desktop' : ''}`}>
          {/* Parte izquierda: Formulario */}
          <Box className={`login-form-container ${isMobile ? 'mobile' : ''}`}>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Imagen en la parte superior */}
            <img src={LogoUH} alt="Login" />

            {/* Título y campos de texto */}
            <Typography variant="h6" className="login-text">
              Bienvenido, ingresa con tus datos
            </Typography>

            <TextField
              label="Nombre de Usuario"
              variant="outlined"
              className="login-input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={!!error}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              className="login-input"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              error={!!error}
            />

            {/* Mostrar errores */}
            {error && (
              <Typography
                variant="body2"
                color="error"
                className="error-message"
              >
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading} // Deshabilitar mientras carga
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
            <Typography variant="body2" color="text.secondary" className="login-link">
              ¿Olvidaste tu contraseña?{' '}
              <Button size="small" sx={{ textTransform: 'none', padding: 0 }}>
                Recuperar
              </Button>
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              onClick={checkLoginStatus}
              sx={{ marginTop: 2 }}
            >
              Verificar Estado de Sesión
            </Button>
          </Box>

          {/* Parte derecha: Imagen de fondo (solo para pantallas grandes) */}
          {!isMobile && (
            <Box
              className="login-background"
              sx={{
                backgroundImage: `url(${LoginImage})`,
              }}
            />
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
