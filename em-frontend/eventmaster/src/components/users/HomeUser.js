import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Fade } from '@mui/material';
import WeeklyScheduler from '../WeeklyScheduler'; // Asegúrate de que esta ruta sea correcta
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importa el icono de retroceso

const HomeUser = () => {
    const [showNewEventComponent, setShowNewEventComponent] = useState(false);

    const handleNewReservationClick = () => {
        setShowNewEventComponent(true);
    };

    const handleBackClick = () => {
        setShowNewEventComponent(false);
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

                    {/* Componente WeeklyScheduler ocupando todo el ancho */}
                    <Box sx={{ width: '100%' }}>
                        <WeeklyScheduler />
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

export default HomeUser;
