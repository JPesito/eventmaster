import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const EventInfoModal = ({ isOpen, onClose, event, teacher, subject }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="event-dialog-title" aria-describedby="event-dialog-description">
      <DialogTitle id="event-dialog-title">Información del Evento</DialogTitle>
      <DialogContent>
        <DialogContentText id="event-dialog-description">
          {event && (
            <>
              <strong>Docente:</strong> {teacher?.name}<br />
              <strong>Asignatura:</strong> {subject?.name}<br />
              <strong>Inicio:</strong> {event.start.format("DD/MM/YYYY HH:mm")}<br />
              <strong>Fin:</strong> {event.end.format("DD/MM/YYYY HH:mm")}
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventInfoModal;