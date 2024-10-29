import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/es';
import API_BASE_URL from '../../config';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventDialog from './EventDialog';
import EventSnackbar from './EventSnackbar';

moment.locale('es');
const localizer = momentLocalizer(moment);

const theme = createTheme({
  palette: {
    primary: { main: '#3182ce' },
  },
});

const TeacherScheduler = ({ selectedRoomId }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

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

  const handleSelectSlot = ({ start, end }) => {
    const isSlotAvailable = !events.some(event =>
      (start < event.end && end > event.start)
    );

    if (isSlotAvailable) {
      setCurrentEvent({ start: moment(start), end: moment(end) });
      setSelectedTeacher(null);
      setSelectedProgramId(null);
      setSelectedSubject(null);
      setIsModalOpen(true);
    } else {
      setShowErrorMessage(true);
    }
  };

  const handleSaveEvent = async (eventToSave) => {
    if (!eventToSave || !eventToSave.start || !eventToSave.end || !selectedRoomId || !selectedTeacher || !selectedProgramId || !selectedSubject) {
      setShowErrorMessage(true);
      return;
    }

    const baseEvent = {
      roomID: selectedRoomId,
      teacherID: selectedTeacher.id,
      programID: selectedProgramId,
      subjectID: selectedSubject.id,
      start: eventToSave.start.format('YYYY-MM-DD HH:mm:ss'),
      end: eventToSave.end.format('YYYY-MM-DD HH:mm:ss'),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/events`, baseEvent);
      setEvents((prevEvents) => [...prevEvents, response.data]);
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
            Agregar Solo Planificación
          </Typography>
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
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
              isEditMode={false}
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

export default TeacherScheduler;
