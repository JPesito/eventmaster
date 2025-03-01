// WeeklySchedulerTeacher.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../../../config";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useMediaQuery } from "@mui/material";
import EventInfoModal from "./EventInfoModal";
import EventCalendar from "./EventCalendar";
import EventSnackbar from "../EventSnackbar";
import { theme } from "./EventStyles";

const WeeklySchedulerTeacher = ({ selectedRoomId }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchEvents = useCallback(async () => {
    if (!selectedRoomId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/eventsroom?roomID=${selectedRoomId}`);
      const dbEvents = response.data.map((event) => ({
        ...event,
        start: moment(event.startTime).toDate(),
        end: moment(event.endTime).toDate(),
        title: `${event.teacherName} - ${event.nameSubject}`,
        backgroundColor: "#0052A1", // Color por defecto
      }));
      setEvents(dbEvents);
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (event) => {
    setCurrentEvent({
      ...event,
      start: moment(event.start),
      end: moment(event.end),
    });
    setSelectedTeacher({ id: event.teacherID, name: event.teacherName });
    setSelectedProgramId(event.programID);
    setSelectedSubject({ id: event.subjectID, name: event.nameSubject });
    setIsModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    setCurrentEvent({ start: moment(start), end: moment(end) });
    setSelectedTeacher(null);
    setSelectedProgramId(null);
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ height: "100vh", width: "100%", backgroundColor: "#F0F0F0" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              Cargando eventos...
            </Box>
          ) : (
            <EventCalendar
              events={events}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
              isMobile={isMobile}
            />
          )}

          <EventInfoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            event={currentEvent}
            teacher={selectedTeacher}
            subject={selectedSubject}
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

export default WeeklySchedulerTeacher;