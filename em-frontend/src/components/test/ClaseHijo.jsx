import React from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

const ClaseHijo = ({ nombreClase, setNombreClase, fechaClase, setFechaClase }) => {
  // Función para manejar el cambio de nombre de la clase
  const manejarNombreClase = (event) => {
    setNombreClase(event.target.value); // Actualiza el estado del nombre de la clase
  };

  // Función para manejar el cambio de fecha de la clase
  const manejarFechaClase = (event) => {
    setFechaClase(event.target.value); // Actualiza el estado de la fecha de la clase
  };

  return (
    <Paper sx={{ padding: 3, marginBottom: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Detalles de la Clase</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Nombre de la clase"
            variant="outlined"
            fullWidth
            value={nombreClase}
            onChange={manejarNombreClase} // Actualiza el nombre de la clase
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Fecha de la clase"
            variant="outlined"
            type="date"
            fullWidth
            value={fechaClase}
            onChange={manejarFechaClase} // Actualiza la fecha de la clase
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Guardar Clase
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClaseHijo;
