import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Typography, Box, Paper } from "@mui/material";
import dayjs from "dayjs";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ColumnsGraphics = ({ data }) => {
  const [graphData, setGraphData] = useState(null);
  const [totalAsistencias, setTotalAsistencias] = useState(0);
  const [totalHoras, setTotalHoras] = useState(0);

  // Crear un mapa de ID de programas a nombres de programas
  const programMap = useMemo(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/programs`);
        return response.data.reduce((acc, program) => {
          acc[program.id] = program.namePrograms;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error al obtener los programas:", error);
        return {};
      }
    };

    return fetchPrograms();
  }, []);

  // Función para calcular los datos del gráfico
  const calculateGraphData = (events, programMap) => {
    const programUsage = {};
    let asistenciasCount = 0;
    let horasCount = 0;

    events.forEach(({ programID, isUsed, startTime, endTime }) => {
      if (isUsed) {
        asistenciasCount++;
        const programName = programMap[programID];
        if (programName) {
          programUsage[programName] = (programUsage[programName] || 0) + 1;
        }
        if (startTime && endTime) {
          const start = dayjs(startTime);
          const end = dayjs(endTime);
          horasCount += end.diff(start, "hour", true);
        }
      }
    });

    return { programUsage, asistenciasCount, horasCount };
  };

  // Efecto para procesar los datos cuando `data` cambia
  useEffect(() => {
    const generateGraphData = async () => {
      if (!data || !Array.isArray(data.events)) {
        console.error("No hay datos válidos para procesar.");
        return;
      }

      try {
        const { programUsage, asistenciasCount, horasCount } = calculateGraphData(
          data.events,
          await programMap
        );

        setTotalAsistencias(asistenciasCount);
        setTotalHoras(horasCount);
        setGraphData({
          labels: Object.keys(programUsage),
          datasets: [
            {
              label: "Uso de salas por programa académico",
              data: Object.values(programUsage),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error al generar datos del gráfico:", error);
      }
    };

    generateGraphData();
  }, [data, programMap]);

  // Opciones para el gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Programas Académicos",
          color: "#333",
          font: {
            family: "Arial",
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          color: "#333",
          font: {
            family: "Arial",
            size: 11,
          },
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            const maxLength = 30;
            if (label.length <= maxLength) return label;
            return label.substring(0, maxLength) + "...";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad de Uso",
          color: "#333",
          font: {
            family: "Arial",
            size: 16,
            weight: "bold",
          },
        },
        ticks: {
          color: "#333",
          font: {
            family: "Arial",
            size: 14,
          },
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, bgcolor: "white", borderRadius: 2, width: "100%", maxWidth: 1200 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: "#333", mb: 1, textAlign: "center" }}
        >
          Total de Asistencias Grupales a Clases: {totalAsistencias}
        </Typography>
        <Typography variant="h6" sx={{ color: "#333", textAlign: "center" }}>
          Total de Horas de Uso en Salas: {totalHoras.toFixed(2)} horas
        </Typography>
      </Box>

      <Box sx={{ height: 400 }}>
        {graphData ? (
          <Bar data={graphData} options={options} />
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "#666", mt: 4 }}
          >
            Cargando datos...
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ColumnsGraphics;
