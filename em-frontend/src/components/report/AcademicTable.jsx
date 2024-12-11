import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AcademicTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center"><strong>Programa Académico</strong></TableCell>
            <TableCell align="center"><strong>Periodo Académico</strong></TableCell>
            <TableCell align="center"><strong>Horas Usadas</strong></TableCell>
            <TableCell align="center"><strong>Estudiantes</strong></TableCell>
            <TableCell align="center"><strong>Porcentaje de Uso</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.programName}</TableCell>
              <TableCell align="center">{row.academicPeriod}</TableCell>
              <TableCell align="center">{row.hoursUsed}</TableCell>
              <TableCell align="center">{row.students}</TableCell>
              <TableCell align="center">{`${row.usagePercentage}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AcademicTable;
