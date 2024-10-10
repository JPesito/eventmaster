import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TeachersList from '../TeachersList';
import ProgramsList from '../ProgramsList';
import SubjectsList from '../SubjectsList';
import moment from 'moment';

const EventDialog = ({
  isModalOpen, 
  setIsModalOpen, 
  newEvent, 
  setNewEvent, 
  selectedTeacher, 
  setSelectedTeacher, 
  selectedProgramId, 
  setSelectedProgramId, 
  selectedSubject, 
  setSelectedSubject, 
  handleSaveEvent 
}) => {
  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <DialogTitle>Nuevo Evento</DialogTitle>
      <DialogContent>
        <TeachersList onSubmit={setSelectedTeacher} />
        <ProgramsList onSubmit={setSelectedProgramId} />
        <SubjectsList programId={selectedProgramId} onSubmit={setSelectedSubject} />
        <DateTimePicker
          label="Inicio"
          value={newEvent.start}
          onChange={(newValue) => setNewEvent({ ...newEvent, start: moment(newValue) })}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        <DateTimePicker
          label="Fin"
          value={newEvent.end}
          onChange={(newValue) => setNewEvent({ ...newEvent, end: moment(newValue) })}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
        <Button onClick={handleSaveEvent} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
