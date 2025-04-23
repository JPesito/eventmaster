import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, Grid, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material'; // Usamos icono de error

const ToolsReport = ({ programId }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/program/${programId}/tools`);
        
        // Asegúrate de que tools sea siempre un array
        const toolsData = Array.isArray(response.data) ? response.data : [];
        setTools(toolsData);
      } catch (err) {
        console.error('Error al obtener las herramientas:', err);
        setError('Error al cargar las herramientas');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchTools();
    }
  }, [programId]);

  // Función para dividir el listado de herramientas en bloques de 3
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const groupedTools = chunkArray(tools, 3); // Dividir las herramientas en bloques de 3

  return (
    <Box mt={4} display="flex" justifyContent="center">
      {/* Contenedor Paper con sombra para darle un estilo de tarjeta */}
      <Paper elevation={6} sx={{ padding: 3, borderRadius: 2, width: '100%', maxWidth: 800 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          align="center" 
          sx={{
            fontWeight: 'bold'
          }}
        >
          Herramientas utilizadas por el programa
        </Typography>

        {/* Mostrar carga, error o herramientas */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ ml: 2 }}>Cargando...</Typography>
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" color="error.main">
            <ErrorOutline sx={{ mr: 1 }} />
            <Typography variant="body1">{error}</Typography>
          </Box>
        ) : groupedTools.length > 0 ? (
          // Utilizando Grid para mostrar las herramientas en filas de 3
          <Box sx={{ mt: 2 }}>
            {groupedTools.map((group, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                {/* Iteramos sobre las herramientas dentro de cada grupo de 3 */}
                {group.map((tool) => (
                  <Grid item xs={12} sm={4} md={4} key={tool.id}>
                    {/* Cada herramienta se muestra en una "tarjeta" */}
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        padding: 2, 
                        backgroundColor: '#e3f2fd', // Fondo azul suave
                        borderRadius: 2, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        textAlign: 'center' // Asegura que el texto esté centrado
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ fontWeight: 'bold', color: '#1976d2' }} // Texto azul oscuro
                      >
                        {tool.nameTool}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No se encontraron herramientas para este programa.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ToolsReport;
