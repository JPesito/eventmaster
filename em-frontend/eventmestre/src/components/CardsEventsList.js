import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Card, CardContent, Typography, Grid, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ToolsList from './ToolsList';
import { useNavigate } from 'react-router-dom';

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
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ ...commonTypographyStyles, color: 'black' }}>
            No hay eventos disponibles para este profesor.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/form-reservation')} // Cambia la ruta según tu configuración
            sx={{ marginTop: 2 }}
          >
            Reservas Sala
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
      const response = await fetch(`${API_BASE_URL}/events/${selectedEvent.id}`, {
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
      <Grid container spacing={2}>
        {events.map((event, index) => (
          <Grid item xs={12} key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card
              sx={{
                background: "#296878",
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
                    <Box sx={{ ...boxStyles, backgroundColor: '#98d9b6', borderColor: '#98d9b6' }}>
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
                  width: '20%',
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
      <Dialog open={Boolean(selectedEvent)} onClose={handleCloseModal} sx={{
        '& .MuiDialog-paper': {
          width: '600px', 
          height: '500px', 
        },
      }}>
        <DialogTitle sx={{ ...commonTypographyStyles, fontSize: '2rem', color: '#000', marginTop:'2%' }}>Detalles de la clase</DialogTitle>
        <DialogContent>
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
                marginBottom: '8%'
              },
            }}
            InputLabelProps={{
              style: {
                fontFamily: 'Josefin Sans, sans-serif',
                fontSize: '1.2rem',
              },
            }}
          />
          <ToolsList tools={tools} setTools={setTools} /> 
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography> 
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button 
            onClick={handleSubmitModal}
            disabled={!studentCount || isNaN(studentCount) || studentCount <= 0 || tools.length === 0} // Deshabilitar si no hay un número válido
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardsEventsList;
