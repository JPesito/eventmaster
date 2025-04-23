import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { NoDataMessage } from './NoDataMessage';

const AcademicTable = ({ data, loading }) => {
  console.log('Data in AcademicTable:', data);
  console.log('Loading in AcademicTable:', loading);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Cargando datos de la tabla...</Typography>
      </Box>
    );
  }

  if (!Array.isArray(data)) {
    console.error('Data received is not an array:', data);
    return <NoDataMessage message="Error: Formato de datos incorrecto" />;
  }

  if (data.length === 0) {
    return <NoDataMessage message="No hay datos disponibles para mostrar" />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center"><strong>Periodo Academico</strong></TableCell>
            <TableCell align="center"><strong>Asistencias Grupales a Clases</strong></TableCell>
            <TableCell align="center"><strong>Horas en Salas</strong></TableCell>
            <TableCell align="center"><strong>Asistencia de Estudiantes</strong></TableCell>
            <TableCell align="center"><strong>Promedio de Estudiantes por Clase</strong></TableCell>
            <TableCell align="center"><strong>Estudiantes Matriculados</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}> {/* Usando row.id como key si existe */}
              <TableCell align="center">{row.academicPeriod}</TableCell>
              <TableCell align="center">{row.groupClasses}</TableCell>
              <TableCell align="center">{row.hoursUsed}</TableCell>
              <TableCell align="center">{row.students}</TableCell>
              <TableCell align="center">{row.promStudents}</TableCell>
              <TableCell align="center">{row.totalEnrolled}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcademicTable;