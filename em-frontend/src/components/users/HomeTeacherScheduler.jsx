import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Fade, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MonitorIcon from '@mui/icons-material/Monitor';
import TeacherWeeklyScheduler from '../calendar/TeacherWeeklyScheduler';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './HomeTeacherScheduler.css';

export default function HomeTeacherScheduler() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/rooms`);
        setRooms(response.data);
      } catch (error) {
        console.error('Error al obtener los salones', error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomChange = (event) => {
    const selectedRoomName = event.target.value;
    setSelectedRoom(selectedRoomName);

    const room = rooms.find(room => room.roomName === selectedRoomName);
    if (room) {
      setSelectedRoomId(room.id);
    }
  };

  const handleBackClick = () => {
    setSelectedRoom('');
    setSelectedRoomId(null);
  };

  return (
    <Box>
      <Card className="styled-card" sx={{ maxWidth: '2000px', margin: 'auto', backgroundColor: 'white'/*#454084*/ }}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Agenda tu salón
            </Typography>
          }
        />
        <CardContent>
          <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
            <InputLabel id="select-room-label">Selecciona un salón</InputLabel>
            <Select
              labelId="select-room-label"
              value={selectedRoom}
              onChange={handleRoomChange}
              label="Selecciona un salón"
            >
              {rooms.map(room => (
                <MenuItem key={room.idroom} value={room.roomName}>
                  {room.roomName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <AnimatePresence>
            {selectedRoom && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box position="relative">
                  <IconButton
                    onClick={handleBackClick}
                    className="icon-button"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Box className="backdrop-box">
                    <TeacherWeeklyScheduler selectedRoomId={selectedRoomId} />
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedRoom && (
            <Fade in={!selectedRoom}>
              <Box textAlign="center" color="text.secondary" mt={4} >
                <MonitorIcon className="monitor-icon" />
                <Typography>Selecciona un salón para ver el horario</Typography>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
