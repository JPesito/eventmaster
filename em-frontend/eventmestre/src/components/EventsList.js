import React, { useState } from 'react';
import API_BASE_URL from '../config';
import TextField from '@mui/material/TextField';
import '../styles.css';

const EventsList = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const response = await fetch(`${API_BASE_URL}/events/search?query=${value}`);
      const data = await response.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (teacher) => {
    setQuery(`${teacher.teacherName} ${teacher.teacherLastName}`);
    setResults([]);
    onSubmit(teacher);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        id="standard-basic"
        label="Nombres o Apellido..."
        variant="standard"
        value={query}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            fontSize: '2rem',
          },
        }}
      />
      {results.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '8px 0 0 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
          maxHeight: '200px',
          overflowY: 'auto',
          position: 'absolute',
          width: '100%',
          zIndex: 1,
        }}>
          {results.map(teacher => (
            <li 
              key={teacher.id} 
              onClick={() => handleSelect(teacher)} 
              style={{ 
                padding: '8px', 
                cursor: 'pointer', 
                backgroundColor: '#f2e8c4',
                borderBottom: '1px solid #eee'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f2e8c4'}
            >
              {teacher.teacherName} {teacher.teacherLastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;