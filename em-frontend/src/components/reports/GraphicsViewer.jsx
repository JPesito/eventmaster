import React from 'react';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const GraphicsViewer = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [{
      label: 'Datos de Gráficas',
      data: data.map(item => item.value),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Bar data={chartData} />
    </Box>
  );
};

export default GraphicsViewer;
