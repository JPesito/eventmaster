import React, { useState } from 'react';
import API_BASE_URL from '../config';

const ProgramsList = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const response = await fetch(`${API_BASE_URL}/programs/search?query=${value}`);
      const data = await response.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (program) => { 
    setQuery(program.namePrograms);
    setResults([]);
    onSubmit(program.id);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar programa..."
      />
      {results.length > 0 && (
        <ul>
          {results.map(program => ( 
            <li key={program.id} onClick={() => handleSelect(program)}>
              {program.namePrograms}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProgramsList;
