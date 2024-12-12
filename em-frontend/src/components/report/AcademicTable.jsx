import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { NoDataMessage } from './NoDataMessage';

const AcademicTable = ({ data }) => {
  

  console.log('Data:', data);

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
            <TableRow key={index}>
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