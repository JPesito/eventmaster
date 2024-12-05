import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import API_BASE_URL from '../../config';

const theme = createTheme({
  palette: {
    primary: { main: '#0052A1' },
    secondary: { main: '#03DAC6' },
  },
});

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, { email });

      if (response.status === 200) {
        setMessage('Se ha enviado un enlace de restablecimiento a tu correo.');
        setTimeout(() => navigate('/'), 5000); // Redirige al login después de 5 segundos
      }
    } catch (err) {
      setError('Error al enviar el correo. Verifica tu dirección.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              padding: 4,
              borderRadius: '20px',
              maxWidth: 400,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              Restablecer Contraseña
            </Typography>
            {message ? (
              <Typography color="primary">{message}</Typography>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Enviar enlace
                </Button>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default ResetPassword;