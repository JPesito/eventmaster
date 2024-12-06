import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TextField, Fade, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import './styles.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProgramsListReport = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/programs/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Error al buscar programas');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Error al buscar programas. Por favor, intente de nuevo.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchPrograms = useMemo(
    () => debounce(fetchPrograms, 300),
    [fetchPrograms]
  );

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchPrograms(value);
  }, [debouncedFetchPrograms]);

  const handleSelect = useCallback((program) => {
    setQuery(program.namePrograms);
    setResults([]);
    onSubmit(program.id);
  }, [onSubmit]);

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => {
      setFadeIn(true);
    }, 50);

    return () => {
      clearTimeout(timeout);
      debouncedFetchPrograms.cancel();
    };
  }, [results, debouncedFetchPrograms]);

  const memoizedResults = useMemo(() => (
    <Fade in={fadeIn && results.length > 0} timeout={800}>
      <ul className="results-list" role="listbox">
        {results.map(program => (
          <li 
            key={program.id} 
            onClick={() => handleSelect(program)} 
            className="result-item"
            role="option"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleSelect(program)}
          >
            {program.namePrograms}
          </li>
        ))}
      </ul>
    </Fade>
  ), [fadeIn, results, handleSelect]);

  return (
    <div>
      <TextField
        id="program-search"
        label="Buscar programa..."
        variant="standard"
        value={query}
        onChange={handleChange}
        autoComplete="off"
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          },
          '& .MuiInput-root': {
            color: 'white',
            '&:before': {
              borderBottomColor: 'white',
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottomColor: 'white',
            },
          },
        }}
        InputProps={{
          endAdornment: isLoading && <CircularProgress size={20} sx={{ color: 'white' }} />,
        }}
      />

      {error && <p className="error-message">{error}</p>}

      {memoizedResults}
    </div>
  );
};

export default ProgramsListReport;
