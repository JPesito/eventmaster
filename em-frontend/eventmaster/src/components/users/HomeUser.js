import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Fade, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import WeeklyScheduler from '../WeeklyScheduler'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import API_BASE_URL from '../../config';

const HomeUser = () => {
    const [showNewEventComponent, setShowNewEventComponent] = useState(false);
    const [rooms, setRooms] = useState([]); // Estado para almacenar los salones
    const [selectedRoom, setSelectedRoom] = useState(''); // Estado para el salón seleccionado
    const [selectedRoomId, setSelectedRoomId] = useState(null); // Estado para guardar el idroom del salón

    // Obtener la lista de salones al montar el componente
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

    // Manejar la selección del salón
    const handleRoomChange = (event) => {
        const selectedRoomName = event.target.value;
        setSelectedRoom(selectedRoomName);

        // Buscar el idroom correspondiente al salón seleccionado
        const room = rooms.find(room => room.roomName === selectedRoomName);
        if (room) {
            setSelectedRoomId(room.id); // Guardar el idroom del salón
            console.log('ID de la sala seleccionada:', room.id); // Debugging
        }
    };

    const handleNewReservationClick = () => {
        setShowNewEventComponent(true);
    };

    const handleBackClick = () => {
        setShowNewEventComponent(false);
        setSelectedRoom(''); // Reiniciar la selección del salón al regresar
        setSelectedRoomId(null); // Reiniciar el ID de la sala
    };

    return (
        <Box 
            sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Bienvenido, Docente
            </Typography>

            {/* Efecto Fade para las tarjetas */}
            <Fade in={!showNewEventComponent} timeout={500}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Tarjeta para realizar una nueva reserva */}
                    <Card sx={{ width: 300, cursor: 'pointer' }} onClick={handleNewReservationClick}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Realizar Reserva Nueva
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Haz clic aquí para crear una nueva reserva de sala.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Tarjeta para modificar reservas existentes */}
                    <Card sx={{ width: 300, cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Modificar Reservas Existentes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Haz clic aquí para modificar reservas ya realizadas.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>

            {/* Efecto Fade para el componente de nuevo evento */}
            <Fade in={showNewEventComponent} timeout={500}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Botón de retroceso */}
                    <IconButton onClick={handleBackClick} sx={{ marginBottom: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>

                    {/* Selector de salón */}
                    <FormControl sx={{ minWidth: 300, marginBottom: 2 }}>
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

                    {/* Componente WeeklyScheduler ocupando todo el ancho */}
                    <Box sx={{ width: '100%' }}>
                        <WeeklyScheduler selectedRoomId={selectedRoomId} />
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default HomeUser;
