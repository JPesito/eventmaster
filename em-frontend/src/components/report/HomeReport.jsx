import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  CssBaseline,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  TextField,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Computer, 
  Group, 
  AccessTime, 
  School 
} from '@mui/icons-material';
import { debounce } from 'lodash';
import AcademicTable from './AcademicTable';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Estilos personalizados (mantenidos y extendidos)
const DynamicBackground = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  height: 'auto',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  backgroundSize: '400% 400%',
  animation: '$gradient 15s ease infinite',
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
  overflowY: 'auto',
  padding: theme.spacing(4, 0),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

const ReportCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const ResultsList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  position: 'absolute',
  zIndex: 1,
  width: '100%',
  maxHeight: '200px',
  overflowY: 'auto',
}));

const ResultItem = styled('li')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HomeReport = () => {
  const [reportData, setReportData] = useState([]);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el buscador de programas
  const [query, setQuery] = useState('');
  const [programResults, setProgramResults] = useState([]);
  const [programLoading, setProgramLoading] = useState(false);
  const [programError, setProgramError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Nuevo estado para controlar la visibilidad del reporte
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchAcademicPeriods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        const periodsFromAPI = response.data;
        // Añadir la opción de Reporte General al principio del array
        setAcademicPeriods([
          { id: 'general', name: 'Reporte General', academicSemester: 'Reporte General' },
          ...periodsFromAPI
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching academic periods:', err);
        setError('Error al cargar los períodos académicos. Por favor, intente de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchAcademicPeriods();
  }, []);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const fetchPrograms = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setProgramResults([]);
      return;
    }

    setProgramLoading(true);
    setProgramError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/programs/search?query=${searchQuery}`);
      setProgramResults(response.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setProgramError('Error al buscar programas. Por favor, intente de nuevo.');
      setProgramResults([]);
    } finally {
      setProgramLoading(false);
    }
  }, []);

  const debouncedFetchPrograms = useMemo(
    () => debounce(fetchPrograms, 300),
    [fetchPrograms]
  );

  const handleProgramChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchPrograms(value);
  }, [debouncedFetchPrograms]);

  const handleProgramSelect = useCallback((program) => {
    setQuery(program.namePrograms);
    setSelectedProgram(program);
    setProgramResults([]);
  }, []);

  // Nueva función para manejar el clic en el botón "Ver Reporte"
  const handleShowReport = async () => {
    if (selectedPeriod && selectedProgram) {
      try {
        const response = await axios.get(`${API_BASE_URL}/general-report`, {
          params: { period: selectedPeriod, program: selectedProgram.id },
        });
        setReportData(response.data); // Guardar los datos del reporte
        setShowReport(true); // Mostrar el componente
      } catch (err) {
        console.error('Error al cargar los datos del reporte:', err);
      }
    }
  };

  const reports = [
    { title: 'Uso de Laboratorios', icon: <Computer />, description: 'Análisis detallado del uso de los laboratorios de tecnología.' },
    { title: 'Asistencia de Estudiantes', icon: <Group />, description: 'Estadísticas de asistencia a las salas de tecnología por grupo y curso.' },
    { title: 'Horarios Pico', icon: <AccessTime />, description: 'Identificación de las horas de mayor demanda en las salas.' },
    { title: 'Rendimiento Académico', icon: <School />, description: 'Correlación entre el uso de salas y el rendimiento académico.' },
  ];

  return (
    <>
      <CssBaseline />
      <DynamicBackground>
        <Container maxWidth="lg">
          <Box my={4}>
            <Typography variant="h2" component="h1" gutterBottom align="center" style={{ color: 'white' }}>
              Panel de Reportes de Salas Tecnológicas
            </Typography>
            <Typography variant="h5" align="center" style={{ color: 'white' }} paragraph>
              Monitoreo y análisis del uso de recursos tecnológicos en nuestra institución
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2} mb={4}>
                {/* Selectores */}
                <Box display="flex" gap={2}>
                  <FormControl variant="outlined" style={{ flex: 1 }}>
                    <InputLabel id="academic-period-label" style={{ color: 'white' }}>Período Académico</InputLabel>
                    <Select
                      labelId="academic-period-label"
                      id="academic-period-select"
                      value={selectedPeriod}
                      onChange={handlePeriodChange}
                      label="Período Académico"
                      style={{ color: 'white', borderColor: 'white' }}
                    >
                      {academicPeriods.map((period) => (
                        <MenuItem key={period.id} value={period.id}>
                          {period.academicSemester}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box position="relative" style={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      id="program-search"
                      label="Buscar programa académico"
                      variant="outlined"
                      value={query}
                      onChange={handleProgramChange}
                      autoComplete="off"
                      InputProps={{
                        endAdornment: programLoading && <CircularProgress size={20} />,
                        style: { color: 'white' }
                      }}
                      InputLabelProps={{
                        style: { color: 'white' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        },
                      }}
                    />
                    {programError && <Typography color="error">{programError}</Typography>}
                    <Fade in={programResults.length > 0} timeout={300}>
                      <ResultsList>
                        {programResults.map(program => (
                          <ResultItem
                            key={program.id}
                            onClick={() => handleProgramSelect(program)}
                          >
                            {program.namePrograms}
                          </ResultItem>
                        ))}
                      </ResultsList>
                    </Fade>
                  </Box>
                </Box>
  
                {/* Botón para mostrar reporte */}
                <Box display="flex" justifyContent="center" mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShowReport}
                    disabled={!selectedPeriod || !selectedProgram}
                  >
                    Ver Reportes
                  </Button>
                </Box>
              </Box>
            )}
  
            {/* Renderizado condicional del componente AcademicTable */}
            {showReport ? (
              <AcademicTable data={reportData} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowReport}
                disabled={!selectedPeriod || !selectedProgram}
              >
                Ver Reportes
              </Button>
            )}
          </Box>
        </Container>
      </DynamicBackground>
    </>
  );
};

export default HomeReport;

