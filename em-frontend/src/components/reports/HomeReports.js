import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { styled } from '@mui/system';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import ColumnsGraphics from './ColumnsGraphics';
import ProgramsListReport from './ProgramsListReport';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    }
  }
});

const Background = styled(Box)({
  position: 'fixed',
  inset: 0,
  background: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.8), rgba(76, 175, 80, 0.8))',
  overflow: 'hidden',
});

const Particle = styled('div')({
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: '50%',
  opacity: 0.6,
});

const CircuitPattern = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)"/>
        <circle cx="90" cy="90" r="2" fill="rgba(255,255,255,0.2)"/>
        <path d="M10 50 H40 V90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
        <path d="M50 10 V40 H90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)"/>
  </svg>
);

const FadeInSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5, delay }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
};

const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

function ReporteTecnologico() {
  const [particles, setParticles] = useState([]);
  const [periodoAcademico, setPeriodoAcademico] = useState('');
  const [programaAcademico, setProgramaAcademico] = useState('');
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [dataGrafica, setDataGrafica] = useState(null);

  const initializeParticles = useCallback(() => {
    return Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
    }));
  }, []);

  useEffect(() => {
    setParticles(initializeParticles());

    const moveParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
        }))
      );
    };

    const intervalId = setInterval(moveParticles, 50);
    return () => clearInterval(intervalId);
  }, [initializeParticles]);

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        const periodos = response.data;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentSemester = currentMonth <= 6 ? `${currentYear}-1` : `${currentYear}-2`;

        const semestreActual = periodos.find((p) => p.academicSemester === currentSemester);
        setPeriodosAcademicos(periodos);
        setPeriodoAcademico(semestreActual ? semestreActual.id : '');
      } catch (error) {
        console.error('Error al obtener períodos académicos:', error);
      }
    };

    fetchPeriodos();
  }, []);

  const handleProgramSelect = useCallback((programId) => {
    setProgramaAcademico(programId);
  }, []);

  const handleSubmit = async () => {
    if (!programaAcademico || !periodoAcademico) {
      alert('Por favor selecciona un período académico y un programa.');
      return;
    }
  
    console.log('ID del Período Académico:', periodoAcademico); // Verificar que se está enviando el ID correcto
    console.log('ID del Programa Académico:', programaAcademico);
  
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`, {
        params: {
          program: programaAcademico,
          period: periodoAcademico, // Enviar el ID del período académico
        },
      });
  
      console.log('Datos recibidos del servidor:', response.data);
      setDataGrafica(response.data);
    } catch (error) {
      console.error('Error al obtener los datos de las gráficas:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Background>
          {particles.map((particle, index) => (
            <Particle
              key={index}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
          <CircuitPattern />
        </Background>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <FadeInSection>
              <MotionTypography
                variant="h1"
                component="h1"
                sx={{ mb: 4, color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Análisis Tecnológico
              </MotionTypography>
            </FadeInSection>
            
            <FadeInSection delay={0.2}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', width: '100%', maxWidth: 400 }}>
                <FormControl variant="outlined" sx={{ width: '100%' }}>
                  <InputLabel id="periodo-academico-label" sx={{ color: 'white' }}>
                    Período Académico
                  </InputLabel>
                  <Select
                    labelId="periodo-academico-label"
                    id="periodo-academico-select"
                    value={periodoAcademico}
                    onChange={(e) => setPeriodoAcademico(e.target.value)}
                    label="Período Académico"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    {periodosAcademicos.map((periodo) => (
                      <MenuItem key={periodo.id} value={periodo.id}>
                        {periodo.academicSemester}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ width: '100%', position: 'relative' }}>
                  <ProgramsListReport onSubmit={handleProgramSelect} />
                </Box>
                
                <MotionButton
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  Ver Gráficas
                </MotionButton>
              </Box>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              {dataGrafica && <ColumnsGraphics data={dataGrafica} />}
            </FadeInSection>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default ReporteTecnologico;
