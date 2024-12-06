import React from 'react';
import { Typography, Select, MenuItem, Box } from '@mui/material';

const Filters = ({ periodosAcademicos, periodoAcademico, setPeriodoAcademico }) => {
    return (
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Período Académico
        </Typography>
        <Select
          value={periodoAcademico}  // Asegúrate de que esté recibiendo el valor correcto
          onChange={(e) => setPeriodoAcademico(e.target.value)}  // Actualiza el estado con el valor seleccionado
          displayEmpty
          fullWidth
          sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
        >
          {periodosAcademicos.length > 0 ? (
            periodosAcademicos.map((periodo) => (
              <MenuItem key={periodo.id} value={periodo.id}>
                {periodo.namePeriod}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay períodos académicos disponibles</MenuItem>
          )}
        </Select>
      </Box>
    );
  };

export default Filters;
