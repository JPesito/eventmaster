"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { TextField, Button, Grid, Box, Typography, FormControlLabel, Checkbox } from "@mui/material"
import { TimePicker, DatePicker } from "@mui/x-date-pickers"
import TeachersList from "../TeachersList"
import ProgramsList from "../ProgramsList"
import SubjectsList from "../SubjectsList"
import moment from "moment"

const EventDialog = ({
  isModalOpen,
  setIsModalOpen,
  currentEvent,
  setCurrentEvent,
  selectedTeacher,
  setSelectedTeacher,
  selectedProgramId,
  setSelectedProgramId,
  selectedSubject,
  setSelectedSubject,
  handleSaveEvent,
  handleDeleteEvent,
  isEditMode,
}) => {
  const [eventStartDate, setEventStartDate] = useState(moment())
  const [eventEndDate, setEventEndDate] = useState(moment())
  const [repeatStartDate, setRepeatStartDate] = useState(moment())
  const [repeatEndDate, setRepeatEndDate] = useState(moment())
  const [autoFillDates, setAutoFillDates] = useState(false)
  const [defaultStartDate, setDefaultStartDate] = useState(moment())
  const [defaultEndDate, setDefaultEndDate] = useState(moment())

  useEffect(() => {
    if (currentEvent) {
      setSelectedTeacher({ id: currentEvent.teacherID, name: currentEvent.teacherName })
      setSelectedProgramId(currentEvent.programID)
      setSelectedSubject({ id: currentEvent.subjectID, name: currentEvent.nameSubject })
      setEventStartDate(moment(currentEvent.start))
      setEventEndDate(moment(currentEvent.end))
      setRepeatStartDate(moment(currentEvent.repeatStartDate) || moment(currentEvent.start))
      setRepeatEndDate(moment(currentEvent.repeatEndDate) || moment(currentEvent.end))
      setDefaultStartDate(moment(currentEvent.repeatStartDate) || moment(currentEvent.start))
      setDefaultEndDate(moment(currentEvent.repeatEndDate) || moment(currentEvent.end))
    }
  }, [currentEvent, setSelectedTeacher, setSelectedProgramId, setSelectedSubject])

  useEffect(() => {
    if (autoFillDates) {
      setRepeatStartDate(moment("2025-02-15"))
      setRepeatEndDate(moment("2025-06-14"))
    } else {
      setRepeatStartDate(defaultStartDate)
      setRepeatEndDate(defaultEndDate)
    }
  }, [autoFillDates, defaultStartDate, defaultEndDate])

  const handleInternalSaveEvent = () => {
    if (!eventStartDate || !eventEndDate || eventStartDate.isAfter(eventEndDate)) {
      alert("Por favor, asegúrate de que el rango de fechas del evento sea válido.")
      return
    }

    if (!repeatStartDate || !repeatEndDate || repeatStartDate.isAfter(repeatEndDate)) {
      alert("Por favor, asegúrate de que el rango de fechas de repetición sea válido.")
      return
    }

    const eventToSave = {
      ...currentEvent,
      start: eventStartDate,
      end: eventEndDate,
      repeatStartDate: repeatStartDate,
      repeatEndDate: repeatEndDate,
    }
    handleSaveEvent(eventToSave)
  }

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>{isEditMode ? "Editar Clase" : "Agregar Clase"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Datos de la Clase */}
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Datos de la Clase
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ fontStyle: "italic", color: "gray" }}>
              Complete los tres campos a continuación (Nombre, Programa y Asignatura) con la información correspondiente
              al docente y la asignatura.
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TeachersList onSubmit={setSelectedTeacher} initialValue={selectedTeacher} />
              </Grid>
              <Grid item xs={12} md={4}>
                <ProgramsList onSubmit={setSelectedProgramId} initialValue={selectedProgramId} />
              </Grid>
              <Grid item xs={12} md={4}>
                <SubjectsList
                  programId={selectedProgramId}
                  onSubmit={setSelectedSubject}
                  initialValue={selectedSubject}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Bloque de Horas */}
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bloque de Horas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de inicio"
                  value={eventStartDate}
                  onChange={(newValue) => setEventStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de fin"
                  value={eventEndDate}
                  onChange={(newValue) => setEventEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Hora de inicio"
                  value={eventStartDate}
                  onChange={(newValue) => setEventStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Hora de fin"
                  value={eventEndDate}
                  onChange={(newValue) => setEventEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Repetir Programación */}
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Repetir Programación
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ fontStyle: "italic", color: "gray" }}>
              Si deseas agregar la clase a todo el periodo académico, selecciona la casilla "Asignar para todo el
              Periodo Académico". En caso contrario, selecciona el rango de fechas de inicio a fin para programar tu
              clase.
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={autoFillDates} onChange={(e) => setAutoFillDates(e.target.checked)} />}
              label="Asignar para todo el Período Académico"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de inicio de repetición"
                  value={repeatStartDate}
                  onChange={(newValue) => {
                    setRepeatStartDate(newValue)
                    setDefaultStartDate(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={autoFillDates}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Fecha de fin de repetición"
                  value={repeatEndDate}
                  onChange={(newValue) => {
                    setRepeatEndDate(newValue)
                    setDefaultEndDate(newValue)
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  disabled={autoFillDates}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        {isEditMode && (
          <Button onClick={handleDeleteEvent} color="error">
            Eliminar
          </Button>
        )}
        <Button onClick={handleInternalSaveEvent} variant="contained" color="primary">
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventDialog

