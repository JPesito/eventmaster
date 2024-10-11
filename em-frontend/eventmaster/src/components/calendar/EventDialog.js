import React, { useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
  // Asegúrate de que el modal tenga la información del evento seleccionado
  useEffect(() => {
    if (currentEvent) {
      setSelectedTeacher({ id: currentEvent.teacherID, name: currentEvent.teacherName });
      setSelectedProgramId(currentEvent.programID);
      setSelectedSubject({ id: currentEvent.subjectID, name: currentEvent.nameSubject });
    }
  }, [currentEvent, setSelectedTeacher, setSelectedProgramId, setSelectedSubject]);

  if (!currentEvent) return null;

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <DialogTitle>{isEditMode ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
      <DialogContent>
        <TeachersList onSubmit={setSelectedTeacher} initialValue={selectedTeacher} />
        <ProgramsList onSubmit={setSelectedProgramId} initialValue={selectedProgramId} />
        <SubjectsList programId={selectedProgramId} onSubmit={setSelectedSubject} initialValue={selectedSubject} />
        
        <DateTimePicker
          label="Inicio"
          value={moment(currentEvent.start)}  // Asegúrate de usar moment
          onChange={(newValue) => {
            if (newValue && moment.isMoment(newValue)) {
              setCurrentEvent((prev) => ({ ...prev, start: newValue }));
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        
        <DateTimePicker
          label="Fin"
          value={moment(currentEvent.end)}  // Asegúrate de usar moment
          onChange={(newValue) => {
            if (newValue && moment.isMoment(newValue)) {
              setCurrentEvent((prev) => ({ ...prev, end: newValue }));
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        {isEditMode && (
          <Button onClick={handleDeleteEvent} color="error">
            Eliminar
          </Button>
        )}
        <Button onClick={handleSaveEvent} variant="contained" color="primary">
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
