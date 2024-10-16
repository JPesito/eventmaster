import React, { useState } from 'react';
import API_BASE_URL from '../config';
import '../styles.css';
import TeachersList from './TeachersListHome';
import CardsEventsList from './CardsEventsList';
import { Fade, Button, Grid, Box } from '@mui/material';

const Home = () => {
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

  return (
    <Box className='animated-background' sx={{ padding: '0 15%', background: '#664f74', minHeight: '100vh' }}>
      <Box className="container" sx={{ background: '#f1e9cb', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100vh' }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '0vh' : '10vh',
              transition: 'all 1s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <h1>Bienvenido</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '20vh' : '40vh',
              transition: 'all 1s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <h1>Registra tu asistencia!</h1>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              height: showNewEvent ? '20vh' : '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              transition: 'all 1s ease',
            }}
          >
            <TeachersList onSubmit={setSelectedTeacher} />
            <Button
              variant="outlined"
              onClick={handleSearchClick}
              sx={{
                marginTop: '18px',
                marginLeft: '30px',
                fontFamily: 'Josefin Sans, sans-serif',
                color: '#2b879e',
                borderColor: '#2b879e',
                '&:hover': {
                  backgroundColor: '#2b879e',
                  color: '#FFFFFF',
                },
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: '100%',
            minHeight: showNewEvent ? '60vh' : '0vh',
            transition: 'all 1s ease'
          }}
        >
          <Fade in={showNewEvent} timeout={500}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center'}}>
              {showNewEvent && selectedTeacher && (
                <CardsEventsList teacherId={selectedTeacher.id} events={events} />
              )}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;