import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Checkbox, 
  FormControlLabel, Grid, Box, Typography, IconButton, Fade, Slide
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import RepeatIcon from '@mui/icons-material/Repeat';
import SaveIcon from '@mui/icons-material/Save';
import TeachersList from '../TeachersList';
import ProgramsList from '../ProgramsList';
import SubjectsList from '../SubjectsList';
import moment from 'moment';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  padding: theme.spacing(1, 3),
}));

const TeacherEventDialog = ({
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
    <StyledDialog 
      open={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      fullWidth
      maxWidth="md"
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <StyledDialogTitle>
        <Box display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Asignación de Salón
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={() => setIsModalOpen(false)} 
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Fade in={isModalOpen}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
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
                  control={
                    <Checkbox 
                      checked={repeatEvent} 
                      onChange={handleRepeatChange}
                      icon={<RepeatIcon />}
                      checkedIcon={<RepeatIcon />}
                    />
                  }
                  label="Repetir Evento"
                />
              </Grid>
              {repeatEvent && (
                <Fade in={repeatEvent}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="date"
                        label="Fecha de Inicio de Repetición"
                        value={repeatStartDate ? moment(repeatStartDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => setRepeatStartDate(moment(e.target.value))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="date"
                        label="Fecha de Fin de Repetición"
                        value={repeatEndDate ? moment(repeatEndDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => setRepeatEndDate(moment(e.target.value))}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Fade>
              )}
            </Grid>
          </Box>
        </Fade>
      </StyledDialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <StyledButton onClick={() => setIsModalOpen(false)} color="inherit">
          Cancelar
        </StyledButton>
        <StyledButton onClick={handleInternalSaveEvent} variant="contained" color="primary" startIcon={<SaveIcon />}>
          Registrar
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default TeacherEventDialog;