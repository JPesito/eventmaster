import React, { useState } from 'react';
import axios from 'axios';
import { Button, 
  Box, 
  Typography, 
  CircularProgress
} from '@mui/material';
import { ReactComponent as Logo } from '../assets/Logo_UH.svg';
import TeachersList from './TeachersList'
import ToolsList from './ToolsList';

import ProgramsList from './ProgramsList';
import SubjectsList from './SubjectsList';
import API_BASE_URL from '../config';

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
    <Box sx={{ position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw', backgroundColor: 'var(--cold-color)' }}>
      <div className="animation-container" />

      <Logo 
        className="company-logo" 
        width="100" 
        height="100" 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 2,
        }}
      />

      <Box 
        className="container" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '65%',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 8px 32px 0 rgba(0, 82, 161, 0.37)',
          border: '1px solid rgba(0, 159, 227, 0.18)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
            <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
              Reserva de Sala
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TeachersList />
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
        </Box>
      </Box>

  );
};

export default FormReservation;