import React, { useState, useEffect, useRef } from 'react';
import API_BASE_URL from '../config';
import { TextField, Fade } from '@mui/material';
import './home.css';

const TeachersList = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fadeIn, setFadeIn] = useState(false); 
  const textFieldRef = useRef(null); // Referencia al campo de texto

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
    textFieldRef.current.blur(); // Desenfocar el campo de texto
    onSubmit(teacher);
  };

  useEffect(() => {
    if (results.length === 1) {
      handleSelect(results[0]);
    } else {
      setFadeIn(false);
      const timeout = setTimeout(() => {
        setFadeIn(true);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [results]);

  return (
    <div>
      <TextField
        id="standard-basic"
        label="Nombres o Apellidos..."
        variant="standard"
        value={query}
        onChange={handleChange}
        inputRef={textFieldRef} // Asigna la referencia al campo de texto
        InputProps={{
          sx: {
            fontSize: '2rem',
            fontFamily: 'Josefin Sans, sans-serif'
          }
        }}
        InputLabelProps={{
          sx: {
            fontSize: '1.8rem',
            fontFamily: 'Josefin Sans, sans-serif' 
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      {/* Lista de resultados con efecto Fade */}
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
