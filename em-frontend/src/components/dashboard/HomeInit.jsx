import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Link
} from '@mui/material';
import NodulesAnimation from '../animations/NodulesAnimation';
import { CalendarToday, Assignment, Search } from '@mui/icons-material';

export default function HomeInit() {
  return (
    <div>
      <NodulesAnimation />
      <Container>
        <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a Event Master
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary" paragraph>
            La solución perfecta para registrar y ordenar la información de tus salones de eventos.
          </Typography>
          <Button variant="contained" color="primary" style={{ marginRight: '1rem' }}>
            Comenzar
          </Button>
        </div>
        <div style={{ backgroundColor: '#f5f5f5', padding: '4rem 0' }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Características principales
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <CalendarToday style={{ fontSize: 50, marginBottom: '1rem' }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Gestión de Eventos
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Registra y organiza todos tus eventos de manera eficiente.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Assignment style={{ fontSize: 50, marginBottom: '1rem' }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Información Detallada
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Mantén un registro detallado de cada salón y sus características.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Search style={{ fontSize: 50, marginBottom: '1rem' }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Búsqueda Avanzada
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Encuentra rápidamente la información que necesitas con nuestra potente herramienta de búsqueda.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Container>
      <footer style={{ borderTop: '1px solid #e0e0e0', padding: '1rem', marginTop: '2rem' }}>
        <Container>
          <Typography variant="body2" color="textSecondary" align="center">
            © 2024 Event Master. Todos los derechos reservados.
          </Typography>
        </Container>
      </footer>
    </div>
  );
}

