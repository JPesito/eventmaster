import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Fade, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const ToolsList = ({ selectedTools, setSelectedTools, eventId, onSave }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length < 2) {
      setSuggestions([]);
      setFadeIn(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/tools/search?query=${value}`);
      setSuggestions(response.data);
      setFadeIn(true);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleSelect = (tool) => {
    if (!selectedTools.some(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]); // Guarda el objeto de la herramienta
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleRemoveTool = (toolToRemove) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolToRemove.id)); // Filtra por ID
  };

  const saveToolsForEvent = async () => {
    try {
      const toolIds = selectedTools.map(tool => tool.id); // Extrae solo los IDs
      const response = await axios.post(`${API_BASE_URL}/events/${eventId}/tools`, {
        tools: toolIds, // Envía solo los IDs
      });
      console.log('Tools saved successfully:', response.data);
      if (onSave) onSave(); // Llama a la función de callback
    } catch (error) {
      console.error('Error saving tools:', error);
    }
  };

  return (
    <Box>
      <TextField
        value={inputValue}
        onChange={handleChange}
        label="Buscar herramientas"
        fullWidth
      />
      <Fade in={fadeIn && suggestions.length > 0} timeout={300}>
        <List>
          {suggestions.map((suggestion, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleSelect(suggestion)}
            >
              <ListItemText primary={suggestion.nameTool} />
            </ListItem>
          ))}
        </List>
      </Fade>
      <Box>
        {selectedTools.map((tool, index) => (
          <Chip
            key={index}
            label={tool.nameTool}
            onDelete={() => handleRemoveTool(tool)}
          />
        ))}
      </Box>
      {selectedTools.length > 0 && (
        <Typography>
          Herramientas seleccionadas: {selectedTools.length}
        </Typography>
      )}
    </Box>
  );
};

export default ToolsList;
