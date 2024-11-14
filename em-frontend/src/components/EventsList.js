import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import API_BASE_URL from '../config';

const EventsList = () => {
  const { teacherId } = useParams(); 
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  console.log("Teacher ID:", teacherId);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events/teacher/${teacherId}`);
        console.log("URL de solicitud:", `${API_BASE_URL}/events/teacher/${teacherId}`);
        if (!response.ok) {
          console.error("Error en la respuesta:", response.status);
          setError("No se pudieron cargar los eventos.");
          return;
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        setEvents(data);
      } catch (error) {
        console.error("Error al cargar los eventos:", error);
        setError("Ocurrió un error al intentar cargar los eventos.");
      }
    };
    fetchEvents();
  }, [teacherId]);

  return (
    <Grid container spacing={2} sx={{ marginTop: '3%' }}>
      {error && <Typography sx={{ color: 'red', textAlign: 'center', width: '100%' }}>{error}</Typography>}
      {events.map((event, index) => (
        <Grid item xs={12} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Card sx={{
              background: "#0052A1",
              borderRadius: '8px',
              width: '100%',
              maxWidth: '90vh',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              display: 'flex',
            }}>
            <CardContent sx={{
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '85%'
              }}>
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '2rem', color: '#fff' }}>
                    {event.nameSubject}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '1.1rem', color: '#fff' }}>
                    {event.namePrograms}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="h6" sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '1.5rem', textAlign: 'center', color: '#fff' }}>
                    Salón
                  </Typography>
                  <Box sx={{
                    border: '1px solid',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#99C9E5'
                  }}>
                    <Typography sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '2rem', color: '#000' }}>
                      {event.roomName}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventsList;
