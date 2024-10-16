import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../../config';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Typography } from '@mui/material'; // Importar Typography de Material UI
import dayjs from 'dayjs'; // Importar dayjs para el manejo de tiempos

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ColumnsGraphics = ({periodAcademic}) => {
  const [events, setEvents] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [totalAsistencias, setTotalAsistencias] = useState(0); // Estado para el total de asistencias
  const [totalHoras, setTotalHoras] = useState(0); // Estado para el total de horas

  useEffect(() => {
    // Obtener eventos
    axios.get(`${API_BASE_URL}/events`).then((response) => {
      setEvents(response.data);
    });
  }, []);

  const generateGraphData = async () => {
    const programUsage = {};
    let asistenciasCount = 0; // Variable para contar asistencias grupales
    let horasCount = 0; // Variable para contar horas de uso

    // Obtener nombres de programas
    const programsResponse = await axios.get(`${API_BASE_URL}/programs`);
    const programs = programsResponse.data;

    // Mapeo de programID a namePrograms
    const programMap = programs.reduce((acc, program) => {
      acc[program.id] = program.namePrograms; // Usar namePrograms
      return acc;
    }, {});

    // Contar el uso de cada programa
    events.forEach((event) => {
      const { programID, isUsed, startTime, endTime } = event;
      if (isUsed) {
        asistenciasCount++; // Sumar al contador de asistencias grupales

        const programName = programMap[programID]; // Obtener nombre del programa
        if (programName) {
          programUsage[programName] = (programUsage[programName] || 0) + 1; // Sumar uso
        }

        // Calcular la diferencia de horas entre startTime y endTime
        const start = dayjs(startTime); // Convertir a objeto dayjs
        const end = dayjs(endTime); // Convertir a objeto dayjs
        const diffInHours = end.diff(start, 'hour', true); // Calcular la diferencia en horas, puede incluir decimales
        horasCount += diffInHours; // Sumar la diferencia al total de horas
      }
    });

    // Actualizar los estados
    setTotalAsistencias(asistenciasCount);
    setTotalHoras(horasCount);

    return {
      labels: Object.keys(programUsage), // Usar los nombres de los programas como etiquetas
      datasets: [
        {
          label: 'Uso de salas por programa académico',
          data: Object.values(programUsage), // Valores de uso
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      const data = await generateGraphData();
      setGraphData(data);
    };
    fetchGraphData();
  }, [events]);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Programas Académicos',
          color: '#333',
          font: {
            family: 'Arial',
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333',
          font: {
            family: 'Arial',
            size: 11,
          },
          autoSkip: false, // No saltar etiquetas
          maxRotation: 0, // Sin rotación
          minRotation: 0, // Sin rotación
          callback: function (value, index, values) {
            const label = this.getLabelForValue(value); // Obtener el nombre del programa
            const maxLength = 15; // Longitud máxima por línea
            
            // Si el texto es más corto que el límite, solo retornar el texto
            if (label.length <= maxLength) {
              return label;
            }
        
            // Dividir el texto en palabras
            const words = label.split(' ');
            let lines = [];
            let currentLine = '';
        
            // Agrupar palabras hasta que la longitud exceda el límite
            words.forEach((word) => {
              if ((currentLine + word).length > maxLength) {
                lines.push(currentLine.trim()); // Agregar la línea completa
                currentLine = ''; // Empezar una nueva línea
              }
              currentLine += word + ' '; 
            });
        
            // Añadir la última línea si contiene algo
            if (currentLine) {
              lines.push(currentLine.trim());
            }
        
            return lines; // Retornar las líneas divididas
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Uso',
          color: '#333',
          font: {
            family: 'Arial',
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333',
          font: {
            family: 'Arial',
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div>
      {/* Mostrar el total de asistencias y horas en la parte superior */}
      <Typography variant="h6" style={{ marginBottom: '10px', color: '#333', textAlign: 'center' }}>
        Total de Asistencias Grupales a Clases: {totalAsistencias}
      </Typography>
      <Typography variant="h6" style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>
        Total de Horas de Uso en Salas: {totalHoras.toFixed(2)} horas
      </Typography>

      {/* Renderizar la gráfica */}
      {graphData.labels && <Bar data={graphData} options={options} />}
    </div>
  );
};

export default ColumnsGraphics;
