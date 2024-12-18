import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const GroupAttendanceChart = ({ academicPeriodId, programId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/group-attendance`, {
          params: {
            academicPeriodId,
            programId,
          },
        });

        const rooms = response.data.rooms; // Lista de nombres de salas
        const attendances = response.data.attendances; // Lista de asistencias por sala

        setChartData({
          labels: rooms,
          datasets: [
            {
              label: 'Asistencias Grupales',
              data: attendances,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching group attendance data:', err);
        setError('Error al cargar los datos de asistencia grupal');
      } finally {
        setLoading(false);
      }
    };

    if (academicPeriodId && programId) {
      fetchAttendanceData();
    }
  }, [academicPeriodId, programId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!chartData) {
    return null;
  }

  return (
    <Box 
      my={4} 
      mx="auto" 
      p={4} 
      sx={{ 
        backgroundColor: 'white', 
        borderRadius: 2, 
        boxShadow: 3, 
        maxWidth: 800 
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Asistencias Grupales por Sala
      </Typography>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.raw}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Asistencias',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Salas',
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default GroupAttendanceChart;
