import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import './home.css';
import { ReactComponent as Logo } from '../assets/Logo_UH.svg';
import TeachersList from './TeachersListHome';
import CardsEventsList from './CardsEventsList';
import { Fade, Button, Grid, Box } from '@mui/material';

export default function Component() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showNewEvent, setShowEvents] = useState(false);
  const [events, setEvents] = useState([]);

  const handleSearchClick = () => {
    if (selectedTeacher) {
      fetchEvents(selectedTeacher.id); 
      setShowEvents(true);
    }
  };

  const fetchEvents = async (teacherId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${teacherId}`);
      const data = await response.json();
      console.log('Datos de eventos recibidos:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
      const size = Math.random() * 15 + 5; // Random size between 5px and 20px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = [
        'var(--primary-color)',
        'var(--primary-color-2)',
        'var(--primary-color-3)',
        'var(--primary-color-4)',
        'var(--secondary-color)'
      ][Math.floor(Math.random() * 5)];
      document.querySelector('.animation-container').appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    const intervalId = setInterval(createParticle, 100); // Increased frequency of particle creation

    return () => clearInterval(intervalId);
  }, []);

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
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '30%' : '50%',
              transition: 'all 1s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',

            }}
          >
            <h1 style={{ color: 'var(--primary-color)', marginBottom: 30, fontSize: 70 }}>Bienvenido Docente</h1>
            <h2 style={{ color: 'var(--primary-color-2)', margin: '10px 0 0 0', fontSize: 40 }}>Registra tu asistencia!</h2>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '10%' : '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              transition: 'all 1s ease'
            }}
          >
            <TeachersList onSubmit={setSelectedTeacher} />
            <Button
              variant="contained"
              onClick={handleSearchClick}
              sx={{
                marginTop: '10px',
                width: '100px',
                height: '50px',
                marginLeft: '30px',
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: 17,
                backgroundColor: 'var(--secondary-color)',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'var(--primary-color)',
                },
              }}
            >
              Buscar
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '100%' : '0%',
              transition: 'all 1s ease',
              overflow: 'hidden',
            }}
          >
            <Fade in={showNewEvent} timeout={500}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
                {showNewEvent && selectedTeacher && (
                  <CardsEventsList teacherId={selectedTeacher.id} events={events} />
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}