import React, { useState, useRef } from 'react';
import API_BASE_URL from '../config';
import { TextField, Fade, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './home.css';

const TeachersList = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const textFieldRef = useRef(null);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      try {
        const response = await fetch(`${API_BASE_URL}/teachers/search?query=${value}`);
        const data = await response.json();
        setResults(data);
        setFadeIn(true);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setResults([]);
      }
    } else {
      setResults([]);
      setFadeIn(false);
    }
  };

  const handleSelect = (teacher) => {
    setQuery(teacher.teacherName);
    setResults([]);
    textFieldRef.current.blur();
    onSubmit(teacher);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setFadeIn(false);
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '400px' }}> {/* Ancho fijo para el contenedor */}
        <TextField
          id="teacher-search"
          label="Nombres o Apellidos..."
          variant="standard"
          value={query}
          onChange={handleChange}
          inputRef={textFieldRef}
          autoComplete="off"
          fullWidth // Ocupa todo el ancho del contenedor
          InputProps={{
            sx: {
              fontSize: '2rem',
              fontFamily: 'Josefin Sans, sans-serif',
              paddingRight: '40px', // Espacio reservado para el ícono
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: '1.8rem',
              fontFamily: 'Josefin Sans, sans-serif',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        {query && (
          <IconButton
            onClick={handleClear}
            size="small"
            sx={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              visibility: query ? 'visible' : 'hidden',
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </div>

      <Fade in={fadeIn && results.length > 0} timeout={300}>
        <ul className="results-list">
          {results.map((teacher) => (
            <li
              key={teacher.id}
              onClick={() => handleSelect(teacher)}
              className="result-item"
            >
              {teacher.teacherName}
            </li>
          ))}
        </ul>
      </Fade>
    </div>
  );
};

export default TeachersList;