import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Fade, Chip, Box, Typography } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

const ToolsList = ({ selectedTools, setSelectedTools, eventId }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [customToolInput, setCustomToolInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length < 2) {
      setSuggestions([]);
      setFadeIn(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/tools/searchi?query=${value}`);
      setSuggestions(response.data);
      setFadeIn(true);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleSelect = (tool) => {
    if (tool.nameTool === 'Otros' || tool.nameTool === 'Página Web') {
      setShowCustomInput(true);
      setCustomToolInput('');
    } else if (!selectedTools.some(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleRemoveTool = (toolToRemove) => {
    setSelectedTools(selectedTools.filter(tool => tool.id !== toolToRemove.id));
  };

  const handleCustomToolSubmit = () => {
    if (customToolInput.trim() !== '') {
      const customTool = {
        id: `custom-${Date.now()}`,
        nameTool: customToolInput,
        isCustom: true
      };
      setSelectedTools([...selectedTools, customTool]);
      setCustomToolInput('');
      setShowCustomInput(false);
    }
  };

  useEffect(() => {
    const saveToolsForEvent = async () => {
      if (!eventId) return;
  
      try {
        const toolsToSave = selectedTools.map(tool => ({
          eventId: eventId,
          toolId: tool.id,
          customToolName: tool.isCustom ? tool.nameTool : null
        }));
  
        // Enviar toolsToSave envuelto en un objeto con la clave `tools`
        await axios.post(`${API_BASE_URL}/events/${eventId}/tools`, { tools: toolsToSave });
      } catch (error) {
        console.error('Error saving tools:', error);
      }
    };
  
    saveToolsForEvent();
  }, [selectedTools, eventId]);

  return (
    <Box>
      <TextField
        value={inputValue}
        onChange={handleChange}
        label="Buscar herramientas"
        autoComplete="off"
        fullWidth
        margin="normal"
        InputProps={{
          style: {
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '1.2rem',
          },
        }}
        InputLabelProps={{
          sx: {
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '1.2rem',
            color: 'rgba(0, 0, 0, 0.87)',
          },
        }}
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
      {showCustomInput && (
        <TextField
          value={customToolInput}
          onChange={(e) => setCustomToolInput(e.target.value)}
          label="Especificar herramienta"
          fullWidth
          margin="normal"
          autoComplete="off"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleCustomToolSubmit();
            }
          }}
          autoFocus
          required
          error={customToolInput.trim() === ''}
          helperText={customToolInput.trim() === '' ? 'Este campo es requerido' : ''}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'primary.main',
            },
          }}
        />
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {selectedTools.map((tool, index) => (
          <Chip
            key={index}
            label={tool.nameTool}
            onDelete={() => handleRemoveTool(tool)}
          />
        ))}
      </Box>
      {selectedTools.length > 0 && (
        <Typography sx={{ mt: 2 }}>
          Herramientas seleccionadas: {selectedTools.length}
        </Typography>
      )}
    </Box>
  );
};

export default ToolsList;