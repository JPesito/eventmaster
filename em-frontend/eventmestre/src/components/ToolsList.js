import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { TextField, Fade, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import '../styles.css'; // Asegúrate de que tu archivo de estilos esté presente

const ToolsList = ({ tools, setTools }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fadeIn, setFadeIn] = useState(false); // Estado para controlar el efecto Fade

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value); // Usar setInputValue en lugar de setQuery

    if (value.length >= 2) {
      const response = await fetch(`${API_BASE_URL}/tools/search?query=${value}`);
      const data = await response.json();
      
      // Filtrar solo las herramientas activas
      const activeTools = data.filter(tool => tool.isActive);

      // Filtrar herramientas que ya han sido seleccionadas
      const filteredSuggestions = activeTools.filter(tool => !tools.includes(tool.nameTool));
      
      setSuggestions(filteredSuggestions); // Actualizar las sugerencias
    } else {
      setSuggestions([]); // Limpiar sugerencias si hay menos de 2 caracteres
    }
  };

  const handleSelect = (tool) => {
    if (!tools.includes(tool.nameTool)) { // Verificar que la herramienta no esté ya en la lista
      setTools([...tools, tool.nameTool]); // Agregar herramienta seleccionada a los tags
    }
    setInputValue(''); // Limpiar el campo de entrada
    setSuggestions([]); // Limpiar las sugerencias
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const selectedTool = suggestions.find(suggestion => suggestion.nameTool.toLowerCase() === inputValue.toLowerCase());
      if (selectedTool && !tools.includes(selectedTool.nameTool)) {
        setTools([...tools, selectedTool.nameTool]); // Agregar solo si está en las sugerencias y no ha sido agregada
      }
      setInputValue(''); // Limpiar el campo de entrada
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setTools(tools.filter((tool) => tool !== toolToRemove));
  };

  useEffect(() => {
    // Cambia el estado de fadeIn para activar el efecto Fade
    setFadeIn(false); // Oculta antes de que cambie
    const timeout = setTimeout(() => {
      setFadeIn(true); // Muestra después de un breve retraso
    }, 50); // Pequeño retraso para permitir la transición

    return () => clearTimeout(timeout); // Limpia el timeout
  }, [suggestions]);

  return (
    <Box>
      <TextField
        fullWidth
        variant="standard"
        label="Tecnologías y/o Herramientas"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe y presiona Enter"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
          marginBottom: '10px',
        }}
      />
      <Fade in={fadeIn && suggestions.length > 0} timeout={800}>
        <List style={{ position: 'absolute', width: '100%', zIndex: 1, backgroundColor: '#fff' }}>
          {suggestions
            .filter((tool) => tool.nameTool.toLowerCase().includes(inputValue.toLowerCase())) // Filtrar usando nameTool
            .map((suggestion, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSelect(suggestion)} // Llamar a handleSelect al hacer clic
              >
                <ListItemText primary={suggestion.nameTool} /> {/* Mostrar el nombre de la herramienta */}
              </ListItem>
            ))}
        </List>
      </Fade>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {tools.map((tool, index) => (
          <Chip
            key={index}
            label={tool}
            onDelete={() => handleRemoveTool(tool)}
            sx={{ margin: '5px' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ToolsList;
