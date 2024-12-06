import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Filters from './Filters';  // Puedes mantener este para el Período Académico
import GraphicsViewer from './GraphicsViewer';  // Nuevo componente para mostrar gráficos
import ErrorMessage from './ErrorMessage';  // Nuevo componente para mostrar errores
import ProgramsListReport from './ProgramsListReport'; // Importa tu componente Autocomplete

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ReporteTecnologico = () => {
  const [periodoAcademico, setPeriodoAcademico] = useState('');
  const [programaAcademico, setProgramaAcademico] = useState('');
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [dataGrafica, setDataGrafica] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Consultar los períodos académicos disponibles
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        console.log(response.data);  // Verifica que se están recibiendo los datos correctamente
        setPeriodosAcademicos(response.data);
      } catch (err) {
        console.error('Error al obtener períodos académicos:', err);
        setError('Error al obtener los períodos académicos.');
      }
    };
    fetchPeriodos();
  }, []);

  // Función para manejar la consulta de gráficos
  const handleSubmit = async () => {
    if (!programaAcademico || !periodoAcademico) {
      setError('Por favor selecciona un período académico y un programa.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`, {
        params: {
          program: programaAcademico,
          period: periodoAcademico,
        },
      });
      setDataGrafica(response.data);
    } catch (err) {
      console.error('Error al obtener los datos de las gráficas:', err);
      setError('Error al obtener los datos de las gráficas.');
    }
    setLoading(false);
  };

  const handleProgramSelect = (programId) => {
    setProgramaAcademico(programId); // Guardamos el ID del programa seleccionado
  };

  return (
    <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, paddingTop: 5 }}>
        <Typography variant="h1" sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          Análisis Tecnológico
        </Typography>
        
        {/* Filtro de Período Académico */}
        <Filters
          periodosAcademicos={periodosAcademicos}
          periodoAcademico={periodoAcademico}  // Pasar el estado 'periodoAcademico'
          setPeriodoAcademico={setPeriodoAcademico}
        />


        {/* Autocomplete para Programas Académicos */}
        <Box sx={{ marginTop: 3 }}>
          <ProgramsListReport onSubmit={handleProgramSelect} />
        </Box>

        {/* Botón para enviar y cargar gráficos */}
        <motion.div>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3, display: 'block', margin: '0 auto' }}>
            Ver Gráficas
          </Button>
        </motion.div>

        {/* Mostrar mensaje de error o gráficos */}
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          dataGrafica && <GraphicsViewer data={dataGrafica} />
        )}
      </Container>
    </Box>
  );
};

export default ReporteTecnologico;
