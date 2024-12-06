import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

const ListaDeTareas = () => {
  // Estado para manejar la tarea que se está escribiendo
  const [tarea, setTarea] = useState('');
  const [tareas, setTareas] = useState([]); // Estado para la lista de tareas

  // Función para agregar tarea a la lista
  const agregarTarea = (evento) => {
    evento.preventDefault(); // Previene el comportamiento por defecto del formulario
    if (tarea.trim()) {
      setTareas([...tareas, tarea]); // Agrega la tarea a la lista
      setTarea(''); // Limpia el campo de entrada
    } else {
      alert('Por favor, ingrese una tarea válida.');
    }
  };

  // Función para eliminar una tarea de la lista
  const eliminarTarea = (index) => {
    setTareas(tareas.filter((_, i) => i !== index)); // Elimina la tarea en el índice dado
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tareas de la Clase
      </Typography>

      {/* Formulario para agregar tareas */}
      <form onSubmit={agregarTarea}>
        <TextField
          label="Nueva Tarea"
          variant="outlined"
          fullWidth
          value={tarea}
          onChange={(e) => setTarea(e.target.value)} // Actualiza el valor de la tarea
        />
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
          Agregar Tarea
        </Button>
      </form>

      {/* Lista de tareas */}
      <Paper sx={{ marginTop: 3, padding: 2 }}>
        <List>
          {tareas.map((tarea, index) => (
            <ListItem key={index} secondaryAction={
              <Button onClick={() => eliminarTarea(index)} color="error" variant="outlined">
                Eliminar
              </Button>
            }>
              <ListItemText primary={tarea} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};


export default ListaDeTareas;
