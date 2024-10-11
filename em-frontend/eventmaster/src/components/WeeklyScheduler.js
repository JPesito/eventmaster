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
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!selectedRoomId) return;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/eventsroom?roomID=${selectedRoomId}`);
        const dbEvents = response.data.map(event => ({
          ...event,
          start: moment(event.startTime).toDate(),
          end: moment(event.endTime).toDate(),
          title: `${event.teacherName} - ${event.nameSubject}`
        }));
        setEvents(dbEvents);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };

    fetchEvents();
  }, [selectedRoomId]);

  const handleEventClick = (event) => {
    setCurrentEvent({
      ...event,
      start: moment(event.start),
      end: moment(event.end)
    });
    setSelectedTeacher({ id: event.teacherID, name: event.teacherName });
    setSelectedProgramId(event.programID);
    setSelectedSubject({ id: event.subjectID, name: event.nameSubject });
    setIsEditMode(true);
    setIsModalOpen(true);
};

  const handleDeleteEvent = async () => {
    if (!currentEvent || !currentEvent.id) return;
  
    try {
      await axios.delete(`${API_BASE_URL}/events/${currentEvent.id}`);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== currentEvent.id));
      setIsModalOpen(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      setShowErrorMessage(true);
    }
  };

  const isOverlapping = (start, end, eventId = null) => {
    return events.some(event => 
      event.id !== eventId && (start < event.end && end > event.start)
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    setCurrentEvent({ start: moment(start), end: moment(end) });
    setSelectedTeacher(null);
    setSelectedProgramId(null);
    setSelectedSubject(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!currentEvent || !currentEvent.start || !currentEvent.end || !selectedRoomId || !selectedTeacher || !selectedProgramId || !selectedSubject) {
      setShowErrorMessage(true);
      return;
    }
  
    if (isOverlapping(currentEvent.start.toDate(), currentEvent.end.toDate(), currentEvent.id)) {
      setShowErrorMessage(true);
      return;
    }
  
    const eventToSave = {
      id: currentEvent.id,
      roomID: selectedRoomId,
      teacherID: selectedTeacher.id,
      programID: selectedProgramId,
      subjectID: selectedSubject.id,
      start: currentEvent.start.format('YYYY-MM-DD HH:mm:ss'),
      end: currentEvent.end.format('YYYY-MM-DD HH:mm:ss'),
    };
  
    try {
      let savedEvent;
      if (isEditMode) {
        const response = await axios.put(`${API_BASE_URL}/events/${currentEvent.id}`, eventToSave);
        savedEvent = response.data;
      } else {
        const response = await axios.post(`${API_BASE_URL}/events`, eventToSave);
        savedEvent = response.data;
      }
  
      setEvents((prevEvents) => {
        const updatedEvents = isEditMode
          ? prevEvents.map(event => event.id === savedEvent.id ? savedEvent : event)
          : [...prevEvents, savedEvent];
        
        return updatedEvents.map(event => ({
          ...event,
          start: moment(event.startTime).toDate(),
          end: moment(event.endTime).toDate(),
          title: `${event.teacherName} - ${event.nameSubject}`
        }));
      });
  
      setIsModalOpen(false);
      setCurrentEvent(null);
      setShowSuccessMessage(true);
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

          {currentEvent && (
            <EventDialog 
              isModalOpen={isModalOpen} 
              setIsModalOpen={setIsModalOpen} 
              currentEvent={currentEvent} 
              setCurrentEvent={setCurrentEvent} 
              selectedTeacher={selectedTeacher} 
              setSelectedTeacher={setSelectedTeacher} 
              selectedProgramId={selectedProgramId} 
              setSelectedProgramId={setSelectedProgramId} 
              selectedSubject={selectedSubject} 
              setSelectedSubject={setSelectedSubject} 
              handleSaveEvent={handleSaveEvent} 
              handleDeleteEvent={handleDeleteEvent}
              isEditMode={isEditMode}
            />
          )}

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