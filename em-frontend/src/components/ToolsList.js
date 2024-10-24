import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { TextField, Fade, List, ListItem, ListItemText, Chip, Box, Typography } from '@mui/material';
import '../styles.css';

const ToolsList = ({ tools, setTools }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length >= 2) {
      try {
        const response = await fetch(`${API_BASE_URL}/tools/search?query=${value}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const activeTools = data.filter(tool => tool.isActive);
        const filteredSuggestions = activeTools.filter(tool => !tools.includes(tool.nameTool));
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error('Error fetching tools:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (tool) => {
    if (!tools.includes(tool.nameTool)) {
      setTools([...tools, tool.nameTool]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const selectedTool = suggestions.find(suggestion => suggestion.nameTool.toLowerCase() === inputValue.toLowerCase());
      if (selectedTool && !tools.includes(selectedTool.nameTool)) {
        setTools([...tools, selectedTool.nameTool]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setTools(tools.filter((tool) => tool !== toolToRemove));
  };

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => {
      setFadeIn(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [suggestions]);

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Tecnologías y/o Herramientas"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe y presiona Enter"
        InputProps={{
          style: {
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '1.2rem',
          },
        }}
        InputLabelProps={{
          style: {
            fontFamily: 'Josefin Sans, sans-serif',
            fontSize: '1.2rem',
          },
        }}
        sx={{
          marginTop: '5px',
          marginBottom: '16px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'var(--primary-color-3)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--primary-color-2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-color)',
            },
          },
        }}
      />
      <Fade in={fadeIn && suggestions.length > 0} timeout={300}>
        <List 
          sx={{ 
            position: 'absolute', 
            width: 'calc(100% - 48px)', 
            zIndex: 1, 
            backgroundColor: '#fff',
            boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {suggestions
            .filter((tool) => tool.nameTool.toLowerCase().includes(inputValue.toLowerCase()))
            .map((suggestion, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSelect(suggestion)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'var(--primary-color-4)',
                  },
                }}
              >
                <ListItemText 
                  primary={suggestion.nameTool} 
                  primaryTypographyProps={{
                    style: {
                      fontFamily: 'Josefin Sans, sans-serif',
                      fontSize: '1rem',
                    }
                  }}
                />
              </ListItem>
            ))}
        </List>
      </Fade>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
        {tools.map((tool, index) => (
          <Chip
            key={index}
            label={tool}
            onDelete={() => handleRemoveTool(tool)}
            sx={{
              backgroundColor: 'var(--primary-color-3)',
              color: '#fff',
              fontFamily: 'Josefin Sans, sans-serif',
              '&:hover': {
                backgroundColor: 'var(--primary-color-2)',
              },
            }}
          />
        ))}
      </Box>
      {tools.length > 0 && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            marginTop: '8px', 
            color: 'var(--text-color)',
            fontFamily: 'Josefin Sans, sans-serif',
          }}
        >
          Herramientas seleccionadas: {tools.length}
        </Typography>
      )}
    </Box>
  );
};

export default ToolsList;