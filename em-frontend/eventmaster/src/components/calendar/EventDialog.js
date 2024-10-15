import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField, Button, Checkbox, FormControlLabel, Grid, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import TeachersList from '../TeachersList';
import ProgramsList from '../ProgramsList';
import SubjectsList from '../SubjectsList';
import moment from 'moment';

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
  isEditMode
}) => {
  const [repeatEvent, setRepeatEvent] = useState(false);
  const [repeatStartDate, setRepeatStartDate] = useState(null);
  const [repeatEndDate, setRepeatEndDate] = useState(null);

  useEffect(() => {
    if (currentEvent) {
      setSelectedTeacher({ id: currentEvent.teacherID, name: currentEvent.teacherName });
      setSelectedProgramId(currentEvent.programID);
      setSelectedSubject({ id: currentEvent.subjectID, name: currentEvent.nameSubject });
      setRepeatEvent(false);
      setRepeatStartDate(null);
      setRepeatEndDate(null);
    }
  }, [currentEvent, setSelectedTeacher, setSelectedProgramId, setSelectedSubject]);

  const handleRepeatChange = (event) => {
    setRepeatEvent(event.target.checked);
    if (!event.target.checked) {
      setRepeatStartDate(null);
      setRepeatEndDate(null);
    }
  };

  const handleInternalSaveEvent = () => {
    if (repeatEvent && (!repeatStartDate || !repeatEndDate || moment(repeatStartDate).isAfter(repeatEndDate))) {
      alert('Por favor, asegúrate de que el rango de fechas sea válido.');
      return;
    }

    const eventToSave = {
      ...currentEvent,
      repeatEvent,
      repeatStartDate: repeatEvent ? moment(repeatStartDate).format('YYYY-MM-DD') : null,
      repeatEndDate: repeatEvent ? moment(repeatEndDate).format('YYYY-MM-DD') : null,
    };
    handleSaveEvent(eventToSave);
  };

  return (
    <Dialog 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{isEditMode ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TeachersList onSubmit={setSelectedTeacher} initialValue={selectedTeacher} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProgramsList onSubmit={setSelectedProgramId} initialValue={selectedProgramId} />
            </Grid>
            <Grid item xs={12} md={4}>
              <SubjectsList programId={selectedProgramId} onSubmit={setSelectedSubject} initialValue={selectedSubject} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Inicio"
                value={currentEvent?.start}
                onChange={(newValue) => {
                  if (newValue && moment.isMoment(newValue)) {
                    setCurrentEvent((prev) => ({ ...prev, start: newValue }));
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Fin"
                value={currentEvent?.end}
                onChange={(newValue) => {
                  if (newValue && moment.isMoment(newValue)) {
                    setCurrentEvent((prev) => ({ ...prev, end: newValue }));
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={repeatEvent} onChange={handleRepeatChange} />}
                label="Repetir Evento"
              />
            </Grid>
            {repeatEvent && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Fecha de Inicio de Repetición"
                    value={repeatStartDate ? moment(repeatStartDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setRepeatStartDate(moment(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Fecha de Fin de Repetición"
                    value={repeatEndDate ? moment(repeatEndDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setRepeatEndDate(moment(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
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
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;