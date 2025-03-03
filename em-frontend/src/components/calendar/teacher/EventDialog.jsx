import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import TeachersList from "../../TeachersList";
import ProgramsList from "../../ProgramsList";
import SubjectsList from "../../SubjectsList";
import moment from "moment";

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
  isEditMode,
}) => {
  const [eventStartDate, setEventStartDate] = useState(moment());
  const [eventEndDate, setEventEndDate] = useState(moment());

  useEffect(() => {
    if (currentEvent) {
      setSelectedTeacher({ id: currentEvent.teacherID, name: currentEvent.teacherName });
      setSelectedProgramId(currentEvent.programID);
      setSelectedSubject({ id: currentEvent.subjectID, name: currentEvent.nameSubject });
      setEventStartDate(moment(currentEvent.start));
      setEventEndDate(moment(currentEvent.end));
    }
  }, [currentEvent, setSelectedTeacher, setSelectedProgramId, setSelectedSubject]);

  const handleInternalSaveEvent = () => {
    if (!eventStartDate || !eventEndDate || eventStartDate.isAfter(eventEndDate)) {
      alert("Por favor, asegúrate de que el rango de fechas del evento sea válido.");
      return;
    }

    const eventToSave = {
      ...currentEvent,
      start: eventStartDate,
      end: eventEndDate,
    };
    handleSaveEvent(eventToSave);
  };

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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        <Button onClick={handleInternalSaveEvent} variant="contained" color="primary">
          {isEditMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;