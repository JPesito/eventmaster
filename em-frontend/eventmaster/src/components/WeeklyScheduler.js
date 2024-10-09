import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios'; // Importa Axios
import 'moment/locale/es';
import API_BASE_URL from '../config';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField,
  Box,
  Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const theme = createTheme({
  palette: {
    primary: {
      main: '#3182ce',
    },
  },
});

const WeeklyScheduler = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null });

  // Cargar los eventos desde la base de datos al montar el componente
  useEffect(() => {
    axios.get(`${API_BASE_URL}/events`)
      .then(response => {
        const dbEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start), // Convierte la fecha de la base de datos a un objeto Date
          end: new Date(event.end),
        }));
        setEvents(dbEvents);
      })
      .catch(error => {
        console.error('Error al cargar los eventos:', error);
      });
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: '', start: moment(start), end: moment(end) });
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    const confirmDelete = window.confirm(`¿Deseas eliminar el evento "${event.title}"?`);
    if (confirmDelete) {
      // Aquí puedes implementar la lógica para eliminar el evento
    }
  };

  const handleSaveEvent = () => {
    console.log('Nuevo evento:', newEvent); // Depuración
    if (newEvent.title && newEvent.start && newEvent.end) {
      const eventToSave = {
        ...newEvent,
        start: newEvent.start.format('YYYY-MM-DD HH:mm:ss'), // Formatea la fecha
        end: newEvent.end.format('YYYY-MM-DD HH:mm:ss'),   // Formatea la fecha
      };
      
      axios.post(`${API_BASE_URL}/events`, eventToSave)
        .then(response => {
          const savedEvent = response.data;
          setEvents([...events, { ...savedEvent, start: new Date(savedEvent.start), end: new Date(savedEvent.end) }]);
          setIsModalOpen(false);
          setNewEvent({ title: '', start: null, end: null }); // Reinicia los valores del evento
        })
        .catch(error => {
          console.error('Error al guardar el evento:', error);
        });
    } else {
      console.log('Faltan datos del evento'); // Depuración
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#3182ce',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontWeight: 'bold',
    };
    return { style };
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>
            Planificador Semanal
          </Typography>
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
              views={['week']}
              defaultView="week"
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 7, 0)}
              max={new Date(2024, 0, 1, 22, 0)}
              toolbar={false}
              formats={{
                dayFormat: 'ddd',
              }}
              eventPropGetter={eventStyleGetter}
            />
          </Box>

          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogTitle>Nuevo Evento</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Título del evento"
                type="text"
                fullWidth
                variant="outlined"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <DateTimePicker
                label="Inicio"
                value={newEvent.start}
                onChange={(newValue) => setNewEvent({ ...newEvent, start: moment(newValue) })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <DateTimePicker
                label="Fin"
                value={newEvent.end}
                onChange={(newValue) => setNewEvent({ ...newEvent, end: moment(newValue) })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEvent} variant="contained" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default WeeklyScheduler;
