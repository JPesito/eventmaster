import React, { useState } from 'react';

import { Container, Typography } from '@mui/material'; //Biblioteca de Material-UI para manejar estilos

//Importaciones de otros componentes 

import ClaseHijo from './ClaseHijo'; // Importamos ClaseHijo
import ListaDeTareas from './ListaDeTareas'; // Importamos ListaDeTareas



const ClasePadre = () => {
  
  // Estado para manejar la clase y fecha
  const [nombreClase, setNombreClase] = useState(''); // Estado para nombre de clase
  const [fechaClase, setFechaClase] = useState(''); // Estado para fecha de clase

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Laboratorio React JS
      </Typography>

      {/* Componente ClaseHijo que recibe nombreClase y fechaClase */}
      <ClaseHijo 
        nombreClase={nombreClase} 
        setNombreClase={setNombreClase} 
        fechaClase={fechaClase} 
        setFechaClase={setFechaClase}
      />

      {/* Componente ListaDeTareas */}
      <ListaDeTareas />
    </Container>
  );
};

export default ClasePadre;
