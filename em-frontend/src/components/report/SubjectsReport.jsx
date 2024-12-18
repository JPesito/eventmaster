import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/';

const SubjectsReport = ({ academicPeriodId }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!academicPeriodId) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/subjects-by-period', {
          params: { academicPeriodId },
        });
        setSubjects(response.data);
      } catch (err) {
        console.error('Error al obtener las asignaturas:', err);
        setError('No se pudieron cargar las asignaturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [academicPeriodId]);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Asignaturas Vistas
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" mt={2}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <List>
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <ListItem key={index}>
                <ListItemText primary={subject.nameSubject} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No se encontraron asignaturas para este período.
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default SubjectsReport;
