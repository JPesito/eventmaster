import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { TextField, Fade } from '@mui/material';
import '../styles.css';

const TeachersList = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fadeIn, setFadeIn] = useState(false); // Estado para controlar el efecto Fade

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const response = await fetch(`${API_BASE_URL}/teachers/search?query=${value}`);
      const data = await response.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (teacher) => {
    setQuery(`${teacher.teacherName}`);
    setResults([]);
    onSubmit(teacher);
  };

  useEffect(() => {
    // Cambia el estado de fadeIn para activar el efecto Fade
    setFadeIn(false); // Oculta antes de que cambie
    const timeout = setTimeout(() => {
      setFadeIn(true); // Muestra después de un breve retraso
    }, 50); 

    return () => clearTimeout(timeout); 
  }, [results]);

  return (
    <div>
      <TextField
        id="standard-basic"
        label="Nombres o Apellidos..."
        variant="standard"
        value={query}
        onChange={handleChange}
        InputProps={{
          sx: {
            fontSize: '1.5rem',
            fontFamily: 'Josefin Sans, sans-serif'
          }
        }}
        InputLabelProps={{
          sx: {
            fontSize: '1.2rem',
            fontFamily: 'Josefin Sans, sans-serif' 
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      <Fade in={fadeIn && results.length > 0} timeout={800}>
        <ul className="results-list">
          {results.map(teacher => (
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
