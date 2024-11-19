import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Fade, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './home.css';
import { ReactComponent as Logo } from '../assets/Logo_UH.svg';
import ParticlesAnimation from './animations/ParticlesAnimation';
import TeachersList from './TeachersListHome';
import CardsEventsList from './CardsEventsList';
import Navbar from './navbar/Navbar';

// Implementación de lazy loading
const SuccessMessage = lazy(() => import('./SuccessMessage'));
const EventsList = lazy(() => import('./EventsList'));

// Constantes para valores repetidos
const TRANSITION_DURATION = '1s';
const PRIMARY_COLOR = 'var(--primary-color)';
const SECONDARY_COLOR = 'var(--secondary-color)';

// Estilos comunes para los botones
const buttonStyle = {
  marginTop: '10px',
  height: '50px',
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: 17,
  backgroundColor: SECONDARY_COLOR,
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: PRIMARY_COLOR,
  },
};

// Hook personalizado para manejar la obtención de eventos
function useEventsFetcher() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (teacherId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${teacherId}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      console.log('Datos de eventos recibidos:', data);
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      setEvents([]);
      setError('No se pudieron cargar los eventos. Por favor, intente de nuevo más tarde.');
    }
  }, []);

  return { events, fetchEvents, error };
}

function Component() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEvents, setShowEvents] = useState(false);
  const [showOtherComponent, setShowOtherComponent] = useState(false);
  const { events, fetchEvents, error } = useEventsFetcher();
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSearchClick = useCallback(() => {
    if (selectedTeacher) {
      fetchEvents(selectedTeacher.id);
      setShowEvents(true);
    }
  }, [selectedTeacher, fetchEvents]);

  const handleOtherComponentClick = useCallback(() => {
    if (selectedTeacher && selectedTeacher.id) {
      // Redirigir con el ID del profesor
      navigate(`/events/teacher/${selectedTeacher.id}`);
    } else {
      console.error("No se encontró el ID del profesor.");
    }
  }, [navigate, selectedTeacher]);

  const handleBackClick = useCallback(() => {
    setShowOtherComponent(false);
    setShowEvents(false);
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw', backgroundColor: 'var(--cold-color)' }}>
      
      {/* Navbar */}

      <Navbar />

      {/* Animación de particulas */}
      
      <ParticlesAnimation />

      <Logo 
        className="company-logo" 
        width="100" 
        height="100" 
        style={{
          position: 'absolute',
          top: '20px',
          left: '50px',
          zIndex: 2,
        }}
        aria-label="Logo de la Universidad"
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
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Vista principal de bienvenida y búsqueda */}
          {!showOtherComponent && (
            <>
              <Grid
                item
                xs={12}
                sx={{
                  height: showEvents ? '30%' : '50%',
                  transition: `all ${TRANSITION_DURATION} ease`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h1 role="heading" aria-level="1" style={{ color: PRIMARY_COLOR, marginBottom: 30, fontSize: 70 }}>
                  Bienvenido Docente
                </h1>
                <h2 role="heading" aria-level="2" style={{ color: 'var(--primary-color-2)', margin: '10px 0 0 0', fontSize: 40 }}>
                  Registra tu asistencia!
                </h2>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  height: showEvents ? '10%' : '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  transition: `all ${TRANSITION_DURATION} ease`
                }}
              >
                <TeachersList onSubmit={setSelectedTeacher} />
                <Button
                  variant="contained"
                  onClick={handleSearchClick}
                  sx={{
                    ...buttonStyle,
                    width: '100px',
                    marginLeft: '30px',
                  }}
                  aria-label="Buscar eventos del docente seleccionado"
                >
                  Buscar
                </Button>
              </Grid>
            </>
          )}

          {/* Componente CardsEventsList */}
          <Grid
            item
            xs={12}
            sx={{
              height: showEvents ? '100%' : '0%',
              transition: `all ${TRANSITION_DURATION} ease`,
              overflow: 'hidden',
            }}
          >
            <Fade in={showEvents} timeout={500}>
              <Box sx={{ height: '46%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'center' }}>
                {showEvents && selectedTeacher && (
                  <>
                    <CardsEventsList teacherId={selectedTeacher.id} events={events} />
                    {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '58px' }}>
                  <Button
                    variant="contained"
                    onClick={handleOtherComponentClick}
                    sx={{
                      ...buttonStyle,
                      width: '200px',
                    }}
                    aria-label="Ver otro componente"
                  >
                    Ver Historial
                  </Button>
                </div>
              </Box>
            </Fade>
          </Grid>

          {/* Otro componente con lazy loading */}
          {showOtherComponent && (
            <Fade in={showOtherComponent} timeout={500}>
              <Grid item xs={12} sx={{ height: '100%' }}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <EventsList />
                  </Suspense>
                  <Button
                    variant="contained"
                    onClick={handleBackClick}
                    sx={{
                      ...buttonStyle,
                      position: 'absolute',
                      top: 20,
                      right: 20,
                    }}
                    aria-label="Volver a la vista principal"
                  >
                    Volver
                  </Button>
                </Box>
              </Grid>
            </Fade>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Component;
