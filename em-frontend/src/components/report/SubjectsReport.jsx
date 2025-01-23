import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Divider
} from '@mui/material';
import { School } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/';

const SubjectsReport = ({ academicPeriodId, programId }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!academicPeriodId || !programId) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await axios.get(`${API_BASE_URL}/subjects-by-period`, {
          params: { academicPeriodId, programId },
        });
    
        const subjectsData = Array.isArray(response.data) ? response.data[0] || [] : [];
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error al obtener las asignaturas:', err);
        setError('No se pudieron cargar las asignaturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [academicPeriodId, programId]);

  if (!academicPeriodId || !programId) {
    return (
      <Box mt={4}>
        <Alert severity="info">
          Por favor, selecciona un período académico y un programa académico.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Asignaturas Vistas
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Paper elevation={3} sx={{ 
            p: 3, 
            borderRadius: 2,
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.15)',
            },
          }}>
            {subjects.length > 0 ? (
              <List>
                {subjects.map((subject, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider variant="inset" component="li" />}
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <School sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            variant="subtitle1"
                            color="text.primary"
                            sx={{ fontWeight: 'medium' }}
                          >
                            {subject.nameSubject || "Nombre no disponible"}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Código: {subject.codeSubject || "N/A"}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No se encontraron asignaturas para este período y programa académico.
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SubjectsReport;

