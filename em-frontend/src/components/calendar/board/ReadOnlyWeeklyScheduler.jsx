import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import axios from "axios"
import "moment/locale/es"
import API_BASE_URL from "../../../config"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, Dialog, DialogContent, DialogTitle, Button, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import "react-big-calendar/lib/css/react-big-calendar.css"
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

const ReadOnlyWeeklyScheduler = ({ selectedRoomId }) => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
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
    } finally {
      setIsLoading(false)
    }
  }, [selectedRoomId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleEventClick = (event) => {
    setCurrentEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentEvent(null)
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

          <Dialog open={isModalOpen} onClose={handleCloseModal} aria-labelledby="event-dialog-title">
            <DialogTitle id="event-dialog-title">Detalles del Evento</DialogTitle>
            <DialogContent>
              {currentEvent && (
                <Box>
                  <Typography variant="h6">{currentEvent.title}</Typography>
                  <Typography>Profesor: {currentEvent.teacherName}</Typography>
                  <Typography>Asignatura: {currentEvent.nameSubject}</Typography>
                  <Typography>Inicio: {moment(currentEvent.start).format("LLLL")}</Typography>
                  <Typography>Fin: {moment(currentEvent.end).format("LLLL")}</Typography>
                  <Typography>Sala: {currentEvent.roomName}</Typography>
                </Box>
              )}
            </DialogContent>
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <Button onClick={handleCloseModal} color="primary">
                Cerrar
              </Button>
            </Box>
          </Dialog>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default ReadOnlyWeeklyScheduler