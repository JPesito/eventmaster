import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const EventSnackbar = ({ showSuccessMessage, showErrorMessage, setShowSuccessMessage, setShowErrorMessage }) => (
  <>
    <Snackbar
      open={showSuccessMessage}
      autoHideDuration={3000}
      onClose={() => setShowSuccessMessage(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '.MuiSnackbarContent-root': {
          backgroundColor: '#4caf50',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        },
      }}
    >
      <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%', justifyContent: 'center' }}>
        El evento se ha registrado con éxito.
      </Alert>
    </Snackbar>

    <Snackbar open={showErrorMessage} autoHideDuration={6000} onClose={() => setShowErrorMessage(false)}>
      <Alert onClose={() => setShowErrorMessage(false)} severity="error" sx={{ width: '100%' }}>
        Error al procesar la solicitud. Verifica los datos.
      </Alert>
    </Snackbar>
  </>
);

export default EventSnackbar;
