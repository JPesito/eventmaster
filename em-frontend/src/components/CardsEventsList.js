import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ToolsList from './ToolsList';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimation from '../animations/notFound.lottie';
import clickAnimation from '../animations/click.lottie';

const formatDate = (datetime) => {
  const parsedDate = Date.parse(datetime);
  if (isNaN(parsedDate)) return 'Fecha inválida';
  return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
  }).format(new Date(parsedDate));
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
  const [teacherId, setteacherId] = useState(null);
  const navigate = useNavigate();

  const handleNavigateToHistory = () => {
    navigate(`/event-history/${teacherId}`);
  };

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
    setTools([]);
  };

  const handleSubmitModal = async () => {
    if (!selectedEvent) return;

    // Check if student count is valid
    if (!studentCount || isNaN(studentCount) || studentCount <= 0) {
      setErrorMessage('Por favor, ingresa una cantidad de alumnos válida.');
      return;
    }

    // Check if at least one tool is selected
    if (tools.length === 0) {
      setErrorMessage('Por favor, selecciona al menos una herramienta.');
      return;
    }

    const updatedEvent = {
      numStudents: studentCount,
      isUsed: true,
      eventId: selectedEvent.id,
      tools: tools.map(tool => tool.id)
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
                width: '85%',
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
                <Grid container spacing={2} sx={{ alignItems: 'center', maxWidth: '100vh' }}>
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
                  width: '200px',
                  height: 'auto',
                  borderRadius: '0',
                  fontSize: '1.5rem',
                  minWidth: '200px'
                }}
              >
                
                
                {/* Cambiar icono de check por algo mas intuitivo para dar click y posterioremente mostrar check*/}
                
                
                <div style={{ width: '180px', height: '140px', overflow: 'hidden', paddingLeft: '5px' }}>
                  <DotLottieReact
                    src={clickAnimation}
                    loop={true}
                    autoplay
                    style={{
                      height: '120px', 
                      width: '120px', // Anchura mayor para permitir el recorte en 150px
                      transform: 'translateX(-20px) translateY(10px)', // Ajusta según la parte de la animación que quieres mostrar
                      filter: 'brightness(0.5) saturate(2) hue-rotate(20deg)',
                    }}
                  />
                </div>



                
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
        <DialogContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0 24px 16px' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Cantidad de alumnos"
          type="number"
          fullWidth
          variant="outlined"
          autoComplete="off"
          value={studentCount}
          onChange={(e) => setStudentCount(e.target.value)}
          InputProps={{
            style: {
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '1.2rem',
            },
          }}
          InputLabelProps={{
            sx: {
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '1.2rem',
              color: 'rgba(0, 0, 0, 0.87)',
            },
          }}
        />
          <Box sx={{ marginTop: 3 }}>
            <ToolsList 
              selectedTools={tools} 
              setSelectedTools={setTools}
              showError={errorMessage.includes('herramienta')}
            />
          </Box>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '8px 24px' }}>
          <Button variant="contained" onClick={handleSubmitModal} sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '1rem', color: 'white' }}>
            Confirmar asistencia
          </Button>
          <Button onClick={handleCloseModal} color="secondary" sx={{ fontFamily: 'Josefin Sans, sans-serif', fontSize: '1rem', color: 'white' }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

    
    </>
  );
};

export default CardsEventsList;
