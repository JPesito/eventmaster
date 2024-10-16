import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { styled } from '@mui/system';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ColumnsGraphics from './ColumnsGraphics';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontWeight: 700,
    },
  },
});

const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const Background = styled(Box)({
  position: 'fixed',
  inset: 0,
  background: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.8), rgba(76, 175, 80, 0.8))',
  overflow: 'hidden',
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

const Particle = styled('div')(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: '50%',
  opacity: 0.6,
}));

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

const ReporteSalones = ({ periodoAcademico }) => (
  <FadeInSection>
    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Reporte de Salones - {periodoAcademico}</Typography>
    <Typography sx={{ color: 'white' }}>Aquí se mostraría el análisis detallado de los salones para el período {periodoAcademico}.</Typography>
  </FadeInSection>
);

const ReporteProgramas = ({ periodoAcademico }) => (
  <FadeInSection>
    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Reporte de Programas - {periodoAcademico}</Typography>
    <Typography sx={{ color: 'white' }}>Aquí se mostraría el análisis de los diferentes programas para el período {periodoAcademico}.</Typography>
  </FadeInSection>
);

const ReporteGeneral = ({ periodoAcademico }) => (
  <FadeInSection>
    <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Reporte General - {periodoAcademico}</Typography>
    <ColumnsGraphics periodAcademic={periodoAcademico}/>
  </FadeInSection>
);

export default function ReporteTecnologico() {
  const [particles, setParticles] = useState([]);
  const [reporteActivo, setReporteActivo] = useState(null);
  const [periodoAcademico, setPeriodoAcademico] = useState('');
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);

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
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          return {
            ...particle,
            x: (particle.x + particle.speedX + 100) % 100,
            y: (particle.y + particle.speedY + 100) % 100,
          };
        })
      );
    };

    const intervalId = setInterval(moveParticles, 50);
    return () => clearInterval(intervalId);
  }, [initializeParticles]);

  useEffect(() => {
    const fetchPeriodosAcademicos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/academicperiod`);
        setPeriodosAcademicos(response.data);
      } catch (error) {
        console.error('Error al obtener los períodos académicos:', error);
      }
    };

    fetchPeriodosAcademicos();
  }, []);

  const renderReporte = () => {
    if (!periodoAcademico) {
      return (
        <FadeInSection>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Por favor, seleccione un período académico para ver los reportes.
          </Typography>
        </FadeInSection>
      );
    }

    switch (reporteActivo) {
      case 'salones':
        return <ReporteSalones periodoAcademico={periodoAcademico} />;
      case 'programas':
        return <ReporteProgramas periodoAcademico={periodoAcademico} />;
      case 'general':
        return <ReporteGeneral periodoAcademico={periodoAcademico} />;
      default:
        return (
          <FadeInSection>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Seleccione un tipo de reporte para visualizar.
            </Typography>
          </FadeInSection>
        );
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
              <MotionTypography
                variant="h4"
                component="p"
                sx={{ mb: 4, color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                Visualiza el futuro de tus datos
              </MotionTypography>
            </FadeInSection>
            <FadeInSection delay={0.4}>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, mb: 4 }}>
                <InputLabel id="periodo-academico-label" sx={{ color: 'white' }}>Período Académico</InputLabel>
                <Select
                  labelId="periodo-academico-label"
                  id="periodo-academico-select"
                  value={periodoAcademico}
                  onChange={(e) => setPeriodoAcademico(e.target.value)}
                  label="Período Académico"
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  {periodosAcademicos.map((periodo) => (
                    <MenuItem key={periodo.id} value={periodo.academicSemester}>
                      {periodo.academicSemester}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FadeInSection>
            <FadeInSection delay={0.6}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setReporteActivo('salones')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{ backgroundColor: 'white', color: '#1976d2' }}
                    disabled={!periodoAcademico}
                  >
                    Reporte Salones
                  </MotionButton>
                </Grid>
                <Grid item>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setReporteActivo('programas')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{ backgroundColor: 'white', color: '#1976d2' }}
                    disabled={!periodoAcademico}
                  >
                    Reporte Programas
                  </MotionButton>
                </Grid>
                <Grid item>
                  <MotionButton
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setReporteActivo('general')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    sx={{ backgroundColor: 'white', color: '#1976d2' }}
                    disabled={!periodoAcademico}
                  >
                    Reporte General
                  </MotionButton>
                </Grid>
              </Grid>
            </FadeInSection>
          </Box>

          <Box sx={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            {renderReporte()}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}