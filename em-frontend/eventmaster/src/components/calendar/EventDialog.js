import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'; // Importar desde 'pro'
import moment from 'moment';
import TeachersList from '../TeachersList';
import ProgramsList from '../ProgramsList';
import SubjectsList from '../SubjectsList';

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
  const [repeatEvent, setRepeatEvent] = useState(false);  // Controlar si se repite el evento
  const [dateRange, setDateRange] = useState([null, null]);  // Rango de fechas para la repetición

  useEffect(() => {
    if (currentEvent) {
      setSelectedTeacher({ id: currentEvent.teacherID, name: currentEvent.teacherName });
      setSelectedProgramId(currentEvent.programID);
      setSelectedSubject({ id: currentEvent.subjectID, name: currentEvent.nameSubject });
    }
  }, [currentEvent, setSelectedTeacher, setSelectedProgramId, setSelectedSubject]);

  const handleRepeatChange = (event) => {
    setRepeatEvent(event.target.checked); // Cambiar si el evento se repite o no
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);  // Guardar el nuevo rango de fechas seleccionado
  };

  return (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <DialogTitle>{isEditMode ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
      <DialogContent>
        <TeachersList onSubmit={setSelectedTeacher} initialValue={selectedTeacher} />
        <ProgramsList onSubmit={setSelectedProgramId} initialValue={selectedProgramId} />
        <SubjectsList programId={selectedProgramId} onSubmit={setSelectedSubject} initialValue={selectedSubject} />
        
        <DateTimePicker
          label="Inicio"
          value={moment(currentEvent.start)}
          onChange={(newValue) => {
            if (newValue && moment.isMoment(newValue)) {
              setCurrentEvent((prev) => ({ ...prev, start: newValue }));
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
        
        <DateTimePicker
          label="Fin"
          value={moment(currentEvent.end)}
          onChange={(newValue) => {
            if (newValue && moment.isMoment(newValue)) {
              setCurrentEvent((prev) => ({ ...prev, end: newValue }));
            }
          }}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />

        <FormControlLabel
          control={<Checkbox checked={repeatEvent} onChange={handleRepeatChange} />}
          label="¿Repetir este evento semanalmente?"
        />

        {repeatEvent && (
          <DateRangePicker
            startText="Fecha inicio repetición"
            endText="Fecha fin repetición"
            value={dateRange}
            onChange={handleDateRangeChange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} fullWidth margin="normal" />
                <TextField {...endProps} fullWidth margin="normal" />
              </>
            )}
          />
        )}
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
