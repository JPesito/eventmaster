import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Checkbox, FormControlLabel, Link, Paper, ThemeProvider, createTheme, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Fingerprint, Person, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EA',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  width: '400px',
}));

const LoginUsers = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtén la función login del contexto

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

      if (response.status === 200) {
        const { token, role } = response.data;
        
        // Usar el método login del contexto
        login(token, role);

        // Redirigir según el rol del usuario
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Contraseña incorrecta. Intenta nuevamente.');
        } else if (error.response.status === 404) {
          setError('Usuario no encontrado.');
        } else {
          setError('Error en el servidor. Intenta más tarde.');
        }
      } else {
        setError('Error en la conexión.');
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={3}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
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
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
            </Box>
          </StyledPaper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default LoginUsers;
