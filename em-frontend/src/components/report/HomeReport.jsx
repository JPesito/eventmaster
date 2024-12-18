import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Fade,
  CssBaseline
} from '@mui/material';
import { debounce } from 'lodash';
import AcademicTable from './AcademicTable';
import GroupAttendanceChart from './GroupAttendanceChart';
import SubjectsReport from './SubjectsReport';
import {
  DynamicBackground,
  StyledPaper,
  IconWrapper,
  ReportCard,
  ResultsList,
  ResultItem
} from './styles-report';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const transformReportData = (rawData) => {
  if (!rawData || typeof rawData !== 'object') {
    return [];
  }

  console.log('rawData', rawData);

  return Object.entries(rawData).map(([academicSemester, data]) => ({
    programName: data.programName || 'N/A',
    groupClasses: data.groupClasses,
    academicPeriod: academicSemester,
    hoursUsed: Math.round(data.hours * 100) / 100,
    students: data.studentAttendance,
    promStudents: Math.round((data.studentAttendance / data.groupClasses) * 100) / 100,
    totalEnrolled: data.totalEnrolled
  }));
};

const HomeReport = () => {
  const [reportData, setReportData] = useState([]);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [programResults, setProgramResults] = useState([]);
  const [programLoading, setProgramLoading] = useState(false);
  const [programError, setProgramError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchAcademicPeriods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        setAcademicPeriods([
          { id: 'general', name: 'Reporte General', academicSemester: 'Reporte General' },
          ...response.data
        ]);
      } catch (err) {
        console.error('Error fetching academic periods:', err);
        setError('Error al cargar los períodos académicos');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicPeriods();
  }, []);

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
      setProgramError('Error al buscar programas');
    } finally {
      setProgramLoading(false);
    }
  }, []);

  const debouncedFetchPrograms = useMemo(
    () => debounce(fetchPrograms, 300),
    [fetchPrograms]
  );

  const handleShowReport = async () => {
    if (!selectedPeriod || !selectedProgram) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/general-report`, {
        params: {
          academicPeriodId: selectedPeriod,
          programId: selectedProgram.id
        }
      });
      
      const transformedData = transformReportData(response.data);
      
      if (!Array.isArray(transformedData)) {
        throw new Error('Formato de datos inválido');
      }
      
      setReportData(transformedData);
      setShowReport(true);
    } catch (err) {
      console.error('Error al cargar los datos del reporte:', err);
      setError('Error al cargar los datos del reporte');
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

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
              Monitoreo y análisis del uso de recursos tecnológicos
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">{error}</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2} mb={4}>
                <Box display="flex" gap={2}>
                  <FormControl variant="outlined" style={{ flex: 1 }}>
                    <InputLabel id="academic-period-label" style={{ color: 'white' }}>
                      Período Académico
                    </InputLabel>
                    <Select
                      labelId="academic-period-label"
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
                          '& fieldset': { borderColor: 'white' },
                          '&:hover fieldset': { borderColor: 'white' },
                          '&.Mui-focused fieldset': { borderColor: 'white' }
                        }
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

                <Box display="flex" justifyContent="center" mt={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShowReport}
                    disabled={!selectedPeriod || !selectedProgram}
                  >
                    Ver Reporte
                  </Button>
                </Box>
              </Box>
            )}

            {showReport && !loading && (
              <Fade in={showReport}>
                <div>
                  <AcademicTable data={reportData} />
                  <GroupAttendanceChart
                    academicPeriodId={selectedPeriod}
                    programId={selectedProgram.id}
                  />
                  <Box mt={4}>
                    {selectedPeriod && (
                      <SubjectsReport academicPeriodId={selectedPeriod} />
                    )}
                  </Box>
                </div>
              </Fade>
            )}
          </Box>
        </Container>
      </DynamicBackground>
    </>
  );
};

export default HomeReport;