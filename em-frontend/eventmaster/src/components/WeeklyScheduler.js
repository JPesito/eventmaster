import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/es';
import API_BASE_URL from '../config';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventDialog from './calendar/EventDialog';
import EventSnackbar from './calendar/EventSnackbar';


moment.locale('es');
const localizer = momentLocalizer(moment);

const theme = createTheme({
  palette: {
    primary: { main: '#3182ce' },
  },
});

const WeeklyScheduler = ({ selectedRoomId }) => {
  const navigate = useNavigate(); 
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ start: null, end: null });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Cargar los eventos desde la base de datos al seleccionar una sala
  useEffect(() => {
    console.log('selectedRoomId en useEffect:', selectedRoomId);
    if (!selectedRoomId) {

        return; 
    }

    const fetchEvents = async () => {
      console.log('Iniciando la llamada a la API para obtener eventos...');
      try {
        const response = await axios.get(`${API_BASE_URL}/eventsroom?roomID=${selectedRoomId}`);
        console.log('Respuesta de la API:', response.data); // Log de la respuesta de la API
    
        const dbEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.startTime), // Cambiado a startTime
          end: new Date(event.endTime), // Cambiado a endTime
          title: `${event.teacherName} - ${event.nameSubject}`
        }));
    
        setEvents(dbEvents);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };

    fetchEvents();
  }, [selectedRoomId]);


  /* Interaccion con los eventos del menu */

  const handleEventClick = (event) => {
    // Aquí puedes manejar el evento clickeado
    console.log('Evento clickeado:', event);
  };



  const isOverlapping = (start, end) => {
    return events.some(event => 
      (start < event.end && end > event.start) // Verifica si hay superposición
    );
  };


  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ start: moment(start), end: moment(end) });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.start || !newEvent.end || !selectedRoomId || !selectedTeacher || !selectedProgramId || !selectedSubject) {
      setShowErrorMessage(true); // Mostrar error si falta información
      return;
    }
  
    if (isOverlapping(newEvent.start.toDate(), newEvent.end.toDate())) {
      setShowErrorMessage(true);
      return;
    }
  
    const eventToSave = {
      roomID: selectedRoomId,
      teacherID: selectedTeacher.id,
      programID: selectedProgramId,
      subjectID: selectedSubject.id,
      start: newEvent.start.format('YYYY-MM-DD HH:mm:ss'),
      end: newEvent.end.format('YYYY-MM-DD HH:mm:ss'),
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, eventToSave);
      const savedEvent = response.data; // Asegúrate de que `response.data` contiene el evento guardado
  
      // Actualiza el estado directamente
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          ...savedEvent,
          start: new Date(savedEvent.startTime), // Asegúrate de que `startTime` es la propiedad correcta
          end: new Date(savedEvent.endTime), // Asegúrate de que `endTime` es la propiedad correcta
        },
      ]);

  
      setIsModalOpen(false);
      setNewEvent({ start: null, end: null });
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate('/home'); 
      }, 5000); 
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      setShowErrorMessage(true);
    }
  };
  
  

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#3182ce',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        opacity: 0.8,
      },
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>
            Planificador Semanal
          </Typography>
          <Box sx={{ height: 600 }}>
            {console.log('Eventos actuales:', events)}

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
              eventPropGetter={eventStyleGetter}
            />
          </Box>

          <EventDialog 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          newEvent={newEvent} 
          setNewEvent={setNewEvent} 
          selectedTeacher={selectedTeacher} 
          setSelectedTeacher={setSelectedTeacher} 
          selectedProgramId={selectedProgramId} 
          setSelectedProgramId={setSelectedProgramId} 
          selectedSubject={selectedSubject} 
          setSelectedSubject={setSelectedSubject} 
          handleSaveEvent={handleSaveEvent} 
        />

        <EventSnackbar 
          showSuccessMessage={showSuccessMessage} 
          showErrorMessage={showErrorMessage} 
          setShowSuccessMessage={setShowSuccessMessage} 
          setShowErrorMessage={setShowErrorMessage} 
        />

        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default WeeklyScheduler;
