"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import axios from "axios"
import "moment/locale/es"
import API_BASE_URL from "../../../config"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import EventDialog from "../EventDialog"
import EventSnackbar from "../EventSnackbar"
import { useMediaQuery } from "@mui/material"

moment.locale("es")
const localizer = momentLocalizer(moment)

const theme = createTheme({
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#172439" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

const WeeklyScheduler = ({ selectedRoomId }) => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedProgramId, setSelectedProgramId] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const fetchEvents = useCallback(async () => {
    if (!selectedRoomId) return

    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/eventsroom?roomID=${selectedRoomId}`)
      const dbEvents = response.data.map((event) => ({
        ...event,
        start: moment(event.startTime).toDate(),
        end: moment(event.endTime).toDate(),
        title: `${event.teacherName} - ${event.nameSubject}`,
      }))
      setEvents(dbEvents)
    } catch (error) {
      console.error("Error al cargar los eventos:", error)
      setShowErrorMessage(true)
    } finally {
      setIsLoading(false)
    }
  }, [selectedRoomId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleEventClick = (event) => {
    setCurrentEvent({
      ...event,
      start: moment(event.start),
      end: moment(event.end),
    })
    setSelectedTeacher({ id: event.teacherID, name: event.teacherName })
    setSelectedProgramId(event.programID)
    setSelectedSubject({ id: event.subjectID, name: event.nameSubject })
    setIsEditMode(true)
    setIsAlertOpen(true)
  }

  const handleAlertResponse = (confirm) => {
    setIsAlertOpen(false)
    if (confirm) {
      setIsModalOpen(true)
    } else {
      setCurrentEvent(null)
      setSelectedTeacher(null)
      setSelectedProgramId(null)
      setSelectedSubject(null)
      setIsEditMode(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!currentEvent || !currentEvent.id) return

    try {
      await axios.delete(`${API_BASE_URL}/events/${currentEvent.id}`)
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== currentEvent.id))
      setIsModalOpen(false)
      setShowSuccessMessage(true)
    } catch (error) {
      console.error("Error al eliminar el evento:", error)
      setShowErrorMessage(true)
    }
  }

  const handleSelectSlot = ({ start, end }) => {
    setCurrentEvent({ start: moment(start), end: moment(end) })
    setSelectedTeacher(null)
    setSelectedProgramId(null)
    setSelectedSubject(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const handleSaveEvent = async (eventToSave) => {
    if (
      !eventToSave ||
      !eventToSave.start ||
      !eventToSave.end ||
      !selectedRoomId ||
      !selectedTeacher ||
      !selectedProgramId ||
      !selectedSubject
    ) {
      setShowErrorMessage(true)
      return
    }

    const baseEvent = {
      roomID: selectedRoomId,
      teacherID: selectedTeacher.id,
      programID: selectedProgramId,
      subjectID: selectedSubject.id,
      start: eventToSave.start.format("YYYY-MM-DD HH:mm:ss"),
      end: eventToSave.end.format("YYYY-MM-DD HH:mm:ss"),
    }

    try {
      const savedEvents = []

      if (isEditMode) {
        const response = await axios.put(`${API_BASE_URL}/events/${eventToSave.id}`, baseEvent)
        savedEvents.push(response.data)
      } else {
        const startDate = moment(eventToSave.repeatStartDate)
        const endDate = moment(eventToSave.repeatEndDate)
        const dayOfWeek = eventToSave.start.day()

        while (startDate.isSameOrBefore(endDate)) {
          if (startDate.day() === dayOfWeek) {
            const eventStart = startDate.clone().hour(eventToSave.start.hour()).minute(eventToSave.start.minute())
            const eventEnd = startDate.clone().hour(eventToSave.end.hour()).minute(eventToSave.end.minute())

            const repeatedEvent = {
              ...baseEvent,
              start: eventStart.format("YYYY-MM-DD HH:mm:ss"),
              end: eventEnd.format("YYYY-MM-DD HH:mm:ss"),
            }

            const response = await axios.post(`${API_BASE_URL}/events`, repeatedEvent)
            savedEvents.push(response.data)
          }
          startDate.add(1, "day")
        }
      }

      await fetchEvents()
      setIsModalOpen(false)
      setCurrentEvent(null)
      setShowSuccessMessage(true)
    } catch (error) {
      console.error("Error al guardar el evento:", error)
      setShowErrorMessage(true)
    }
  }

  const colorMap = useMemo(() => {
    const colors = ["#0052A1", "#FFA500", "#008000", "#800080", "#FF4500", "#4B0082", "#008080"]
    const map = new Map()
    let colorIndex = 0

    return (teacherId) => {
      if (!map.has(teacherId)) {
        map.set(teacherId, colors[colorIndex % colors.length])
        colorIndex++
      }
      return map.get(teacherId)
    }
  }, [])

  const eventStyleGetter = (event) => {
    const backgroundColor = colorMap(event.teacherID)
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "14px",
        fontWeight: "bold",
        height: "100%",
        textAlign: "left",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        padding: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    }
  }

  const cellStyleGetter = (date, view) => {
    return {
      style: {
        border: "1px solid #505050",
      },
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Box sx={{ height: "100vh", width: "100%", backgroundColor: "#F0F0F0" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              Cargando eventos...
            </Box>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleEventClick}
              views={isMobile ? ["day"] : ["week"]}
              defaultView={isMobile ? "day" : "week"}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 7, 0)}
              max={new Date(2024, 0, 1, 23, 0)}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={cellStyleGetter}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                month: "Mes",
                week: "Semana",
                day: "Día",
                today: "Hoy",
                noEventsInRange: "No hay eventos en este rango",
              }}
              formats={{
                timeGutterFormat: (date, culture, localizer) => localizer.format(date, "HH:mm", culture),
              }}
              components={{
                timeSlotWrapper: ({ children }) =>
                  React.cloneElement(children, {
                    style: {
                      ...children.props.style,
                      height: "30px",
                    },
                  }),
              }}
            />
          )}

          <Dialog
            open={isAlertOpen}
            onClose={() => handleAlertResponse(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmar modificación"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                ¿Está seguro de que desea modificar este evento?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleAlertResponse(false)} color="primary">
                No
              </Button>
              <Button onClick={() => handleAlertResponse(true)} color="primary" autoFocus>
                Sí
              </Button>
            </DialogActions>
          </Dialog>

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
  )
}

export default WeeklyScheduler

