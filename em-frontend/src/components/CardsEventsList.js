import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ToolsList from './ToolsList';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimation from '../animations/notFound.lottie';

const formatDate = (datetime) => {
  const parsedDate = Date.parse(datetime);
  if (isNaN(parsedDate)) {
    return 'Fecha inválida';
  }
  const date = new Date(parsedDate);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const commonTypographyStyles = {
  fontFamily: 'Josefin Sans, sans-serif',
  color: '#fff',
};

const boxStyles = {
  border: '1px solid',
  borderRadius: '8px',
  padding: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
};

const CardsEventsList = ({ events = [] }) => {
  const [studentCount, setStudentCount] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tools, setTools] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  if (!events || events.length === 0) {
    return (
      <Grid container>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '100%'}}>
          <DotLottieReact
            src={successAnimation}
            loop={true}
            autoplay
            style={{ height: '200px', width: '200px', filter: 'brightness(0.5) saturate(2) hue-rotate(20deg)' }}
          />
          <Typography variant="h6" sx={{ ...commonTypographyStyles, color: 'black' }}>
            Veo que no hay eventos disponibles para ti en este momento.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                ...commonTypographyStyles,
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#454084',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              No te preocupes. 
            </Typography>
            <Typography
              variant="h5"
              sx={{
                ...commonTypographyStyles,
                color: 'black',
                paddingLeft: '8px'
              }}
            >
             Aún puedes reservar una de nuestras salas. 
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => navigate('/teacher-scheduler')}
            sx={{ marginTop: 2 }}
          >
            Reservar Sala
          </Button>
        </Grid>
      </Grid>
    );
  }

  const handleNavigate = () => {
    navigate('/success');
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setStudentCount('');
    setErrorMessage('');
  };

  const handleSubmitModal = async () => {
    if (!selectedEvent) return;

    if (!studentCount || isNaN(studentCount) || studentCount <= 0) {
      setErrorMessage('Por favor, ingresa una cantidad de alumnos válida.');
      return;
    }

    const updatedEvent = {
      numStudents: studentCount,
      isUsed: true,
      eventId: selectedEvent.id,
      tools: tools.map(tool => tool.id)  // Extrae solo los ids de las herramientas
    };

    try {
      const response = await fetch(`${API_BASE_URL}/check/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        handleNavigate();
        handleCloseModal();
      } else {
        const responseData = await response.json();
        setErrorMessage(responseData.message || 'Error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      setErrorMessage('Error de conexión, por favor intente de nuevo.');
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{marginTop: '3%'}}>
        {events.map((event, index) => (
          <Grid item xs={12} key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
            <Card
              sx={{
                background: "#0052A1",
                borderRadius: '8px',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '90vh',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                display: 'flex',
              }}
            >
              <CardContent
                sx={{
                  flex: '1 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '85%'
                }}
              >
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h5" component="h2" sx={{ ...commonTypographyStyles, fontSize: '2rem' }}>
                      {event.nameSubject}
                    </Typography>
                    <Typography variant="body1" sx={{ ...commonTypographyStyles, fontSize: '1.1rem' }}>
                      {event.namePrograms}
                    </Typography>
                    <Typography variant="body2" sx={{ ...commonTypographyStyles, fontSize: '1.3rem' }}>
                      Reserva: {formatDate(event.startTime)} - {formatDate(event.endTime)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="h6" sx={{ ...commonTypographyStyles, fontSize: '1.5rem', textAlign: 'center' }}>
                      Salón
                    </Typography>
                    <Box sx={{ ...boxStyles, backgroundColor: '#99C9E5', borderColor: '#99C9E5' }}>
                      <Typography sx={{ ...commonTypographyStyles, fontSize: '2rem', color: '#000' }}>
                        {event.roomName}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>

              <Button
                variant="contained"
                onClick={() => handleOpenModal(event)} 
                sx={{
                  backgroundColor: '#3ec9a7',
                  borderColor: '#3ec9a7',
                  '&:hover': {
                    backgroundColor: '#2ea88a',
                  },
                  width: '15%',
                  height: 'auto',
                  borderRadius: '0',
                  fontSize: '1.5rem',
                }}
              >
                <CheckIcon style={{ color: '#000', fontSize: 60 }} />
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={Boolean(selectedEvent)} 
        onClose={handleCloseModal} 
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            height: '500px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ ...commonTypographyStyles, fontSize: '2rem', color: '#000', marginTop: '2%', padding: '16px 24px' }}>
          Detalles de la clase
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 24px 16px' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Cantidad de alumnos"
            type="number"
            fullWidth
            variant="outlined"
            value={studentCount}
            onChange={(e) => setStudentCount(e.target.value)}
            InputProps={{
              style: {
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '1.2rem',
              },
            }}
          />
          <ToolsList selectedTools={tools} setSelectedTools={setTools} />
          {errorMessage && (
            <Typography color="error" variant="body1" sx={{ marginTop: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseModal} sx={{ ...commonTypographyStyles, color: '#000', marginRight: 'auto' }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitModal} sx={{ ...commonTypographyStyles, color: '#000', backgroundColor: '#3ec9a7' }}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardsEventsList;
