import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Container,
  ThemeProvider,
  createTheme,
  styled,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import TeachersList from './TeachersList'
import RoomsList from './RoomsList';
import ProgramsList from './ProgramsList';
import SubjectsList from './SubjectsList';
import API_BASE_URL from '../config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
});

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: 'linear-gradient(45deg, #3f51b5 30%, #f50057 90%)',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const FormReservation = () => {
  const [formData, setFormData] = useState({
    nombreProfesor: '',
    sala: '',
    nombrePrograma: '',
    tecnologias: '',
  });

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoomSelection = (roomId) => {
    setFormData((prevData) => ({ ...prevData, sala: roomId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/reservas`, {
        ...formData,
        program_id: selectedProgram, 
        subject_id: selectedSubject?.id, 
      });
      console.log('Reserva guardada:', response.data);
      // Restablecer el formulario
      setFormData({
        nombreProfesor: '',
        sala: '',
        nombrePrograma: '',
        tecnologias: '',
      });
      setSelectedProgram(null);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error guardando la reserva:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AnimatedBackground />
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={3}>
            <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
              Reserva de Sala
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TeachersList />
              <TextField
                fullWidth
                label="Tecnologías"
                name="tecnologias"
                value={formData.tecnologias}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
              />
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Programa
                </Typography>
                <ProgramsList onSubmit={setSelectedProgram} />
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Asignatura
                </Typography>
                <SubjectsList onSubmit={setSelectedSubject} programId={selectedProgram} />
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Salas disponibles
                </Typography>
                <RoomsList onSelectRoom={handleRoomSelection} />
              </Box>
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                fullWidth 
                sx={{ mt: 2, py: 1.5 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
              </Button>
            </Box>
          </StyledPaper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
};

export default FormReservation;