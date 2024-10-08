import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const SubjectsList = ({ onSubmit, programId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2 && programId) {
      const response = await fetch(`${API_BASE_URL}/subjects/search?query=${value}&programid=${programId}`);
      const data = await response.json();
      setResults(data);
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
    if (programId) {
      setResults([]);
    }
  }, [programId]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar asignatura..."
      />
      {results.length > 0 && (
        <ul>
          {results.map(subject => ( 
            <li key={subject.id} onClick={() => handleSelect(subject)}>
              {subject.nameSubject}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectsList;
