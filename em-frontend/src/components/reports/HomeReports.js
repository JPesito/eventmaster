import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import GraphicsViewer from './GraphicsViewer';
import ErrorMessage from './ErrorMessage';
import ProgramsListReport from './ProgramsListReport';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ReporteTecnologico = () => {
  const [periodoAcademico, setPeriodoAcademico] = useState('');
  const [programaAcademico, setProgramaAcademico] = useState('');
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [dataGrafica, setDataGrafica] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPeriodos = async () => {
      setLoadingPeriodos(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        console.log('Respuesta completa de períodos académicos:', response);
        if (Array.isArray(response.data)) {
          console.log('Períodos académicos recibidos:', response.data);
          setPeriodosAcademicos(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
          setError('Error en el formato de los datos de períodos académicos.');
        }
      } catch (err) {
        console.error('Error al obtener períodos académicos:', err);
        setError('Error al obtener los períodos académicos.');
      } finally {
        setLoadingPeriodos(false);
      }
    };
    fetchPeriodos();
  }, []);

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
    setProgramaAcademico(programId);
  };

  return (
    <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, paddingTop: 5 }}>
        <Typography variant="h1" sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
          Análisis Tecnológico
        </Typography>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Período Académico
          </Typography>
          {loadingPeriodos ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            <Select
              value={periodoAcademico}
              onChange={(e) => setPeriodoAcademico(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            >
              <MenuItem value="" disabled>
                Selecciona un período académico
              </MenuItem>
              {periodosAcademicos.map((periodo) => (
                <MenuItem key={periodo.id} value={periodo.id}>
                  {periodo.namePeriod}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        <Box sx={{ marginTop: 3 }}>
          <ProgramsListReport onSubmit={handleProgramSelect} />
        </Box>

        <motion.div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3, display: 'block', margin: '0 auto' }}
          >
            Ver Gráficas
          </Button>
        </motion.div>

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

