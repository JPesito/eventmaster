import React, { useState, useEffect } from 'react';
import { TextField, Fade } from '@mui/material';
import API_BASE_URL from '../config';
import '../styles.css';

const SubjectsList = ({ onSubmit, programId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2 && programId) {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects/search?query=${value}&programid=${programId}`);
        if (!response.ok) {
          throw new Error('Error fetching subjects');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (subject) => {
    setQuery(subject.nameSubject);
    setResults([]);
    onSubmit(subject);
  };

  useEffect(() => {
    setQuery('');
    setResults([]);
  }, [programId]);

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => {
      setFadeIn(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, [results]);

  return (
    <div>
      <TextField
        id="subject-search"
        label="Buscar asignatura..."
        variant="standard"
        value={query}
        onChange={handleChange}
        disabled={!programId}
        fullWidth
        margin="normal"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        }}
      />

      <Fade in={fadeIn && results.length > 0} timeout={800}>
        <ul className="results-list" role="listbox">
          {results.map(subject => (
            <li 
              key={subject.id} 
              onClick={() => handleSelect(subject)} 
              className="result-item"
              role="option"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleSelect(subject)}
            >
              {subject.nameSubject}
            </li>
          ))}
        </ul>
      </Fade>
    </div>
  );
};

export default SubjectsList;