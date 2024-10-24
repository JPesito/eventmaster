import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ToolsList from './ToolsList';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimation from '../animations/notFound.lottie';

{/* Formateador de Fechas */}
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
          <Typography variant="h5" sx={{
            ...commonTypographyStyles,
            fontWeight: 'bold', // Negrita
            fontSize: '1.5rem', // Tamaño aumentado
            color: '#454084', // Color resaltado
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)', // Sombra de texto
          }}>
            No te preocupes,
          </Typography>
          <Typography variant="h6" sx={{ ...commonTypographyStyles, color: 'black' }}>
            .
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/form-reservation')} // Cambia la ruta según tu configuración
            sx={{ marginTop: 2 }}
          >
            Reservar Sala
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Resultado Exitoso
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
        handleCloseModal(); // Cerrar el modal solo si la actualización fue exitosa
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

      {/* Modal para detalles de la clase */}
      <Dialog 
        open={Boolean(selectedEvent)} 
        onClose={handleCloseModal} 
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            height: '500px',
            overflow: 'hidden', // Esto evita el scroll
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ 
          ...commonTypographyStyles, 
          fontSize: '2rem', 
          color: '#000', 
          marginTop: '2%',
          padding: '16px 24px', // Ajusta el padding para dar más espacio al contenido
        }}>
          Detalles de la clase
        </DialogTitle>
        <DialogContent sx={{ 
          flex: 1, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0 24px 16px', // Ajusta el padding para dar más espacio al contenido
        }}>
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
            InputLabelProps={{
              style: {
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '1.2rem',
              },
            }}
            sx={{ marginBottom: '24px' }} // Ajusta el margen inferior
          />
          <Box sx={{ flex: 1, overflow: 'auto' }}> {/* Permite scroll solo en la lista de herramientas si es necesario */}
            <ToolsList tools={tools} setTools={setTools} />
          </Box>
          {errorMessage && (
            <Typography color="error" sx={{ marginTop: '16px' }}>{errorMessage}</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}> {/* Ajusta el padding de las acciones */}
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button 
            onClick={handleSubmitModal}
            disabled={!studentCount || isNaN(studentCount) || studentCount <= 0 || tools.length === 0}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardsEventsList;
