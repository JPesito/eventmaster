import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Fade, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import WeeklyScheduler from '../WeeklyScheduler'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './HomeUser.css';

const HomeUser = () => {
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
        <Box className="container animated-background">
            <Typography variant="h4" component="h1" gutterBottom className="title">
                Bienvenido, Docente
            </Typography>

            <FormControl className="formControl">
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

            {selectedRoom && (
                <Fade in={!!selectedRoom} timeout={500}>
                    <Box className="fullWidthBox">
                        <IconButton onClick={handleBackClick} className="backButton">
                            <ArrowBackIcon />
                        </IconButton>

                        <WeeklyScheduler selectedRoomId={selectedRoomId} />
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default HomeUser;