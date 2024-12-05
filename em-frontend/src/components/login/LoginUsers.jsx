import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton,
  InputAdornment, Checkbox, FormControlLabel, Link,
  Paper, ThemeProvider, createTheme, styled
} from '@mui/material';
import { motion } from 'framer-motion'; // Para animaciones
import {
  Visibility, VisibilityOff, Fingerprint, Person, Lock
} from '@mui/icons-material'; // Iconos de Material-UI
import axios from 'axios'; // Cliente HTTP para realizar peticiones a APIs
import { useNavigate } from 'react-router-dom'; // Para navegar entre rutas
import API_BASE_URL from '../../config'; // Dirección base de la API
import { useAuth } from '../context/AuthContext'; // Hook para manejar la autenticación
import NodulesAnimation from '../animations/NodulesAnimation';

// Configuración del tema global de Material-UI
const theme = createTheme({
  palette: {
    primary: { main: '#0052A1' }, // Color principal
    secondary: { main: '#03DAC6' }, // Color secundario
    background: { default: '#121212' }, // Color de fondo
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Fuentes
  },
});

// Componente estilizado para el formulario
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)', // Efecto de desenfoque
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  width: '400px',
}));

// Componente principal de inicio de sesión
const LoginUsers = () => {
  // Estados locales para manejar datos del formulario
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña
  const [username, setUsername] = useState(''); // Nombre de usuario
  const [password, setPassword] = useState(''); // Contraseña
  const [rememberMe, setRememberMe] = useState(false); // Checkbox "Recordarme"
  const [error, setError] = useState(''); // Manejo de errores
  const navigate = useNavigate(); // Función para redirigir a otras páginas
  const { login } = useAuth(); // Función para iniciar sesión desde el contexto

  // Maneja el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita recargar la página

    try {
      // Petición al servidor para iniciar sesión
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

      if (response.status === 200) {
        const { token, role } = response.data; // Obtiene el token y el rol del usuario
        login(token, role); // Guarda el token y el rol en el contexto

        // Redirige al usuario según su rol
        role === 'admin' ? navigate('/admin') : navigate('/home');
      }
    } catch (error) {
      // Manejo de errores comunes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Contraseña incorrecta. Intenta nuevamente.');
            break;
          case 404:
            setError('Usuario no encontrado.');
            break;
          default:
            setError('Error en el servidor. Intenta más tarde.');
        }
      } else {
        setError('Error en la conexión.');
      }
    }
  };

  // Cambia la visibilidad de la contraseña
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Renderiza el formulario de inicio de sesión
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        {/* Left side - Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper >
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  align="center"
                  color="primary"
                >
                  Bienvenido
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Usuario"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Recordarme"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  startIcon={<Fingerprint />}
                >
                  Iniciar Sesión
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link href="/reset-password" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
                </Box>
              </Box>
            </StyledPaper>
          </motion.div>
        </Box>

        {/* Right side - Animation */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
          }}
        >
          <NodulesAnimation />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginUsers;