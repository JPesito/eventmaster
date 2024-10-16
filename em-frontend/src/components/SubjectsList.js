import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const SubjectsList = ({ onSubmit, programId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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
        console.error('Error fetching subjects:', error); // Muestra el error en consola
        setResults([]);
      }
    } else {
      setResults([]); // Limpia los resultados si no se cumplen las condiciones
    }
  };

  const handleSelect = (subject) => { 
    setQuery(subject.nameSubject); // Mostrar la asignatura seleccionada en el input
    setResults([]); // Ocultar resultados después de la selección
    onSubmit(subject); // Pasar la asignatura seleccionada al componente padre
  };

  // Limpiar la búsqueda si cambia el programId
  useEffect(() => {
    setQuery(''); // Limpiar el campo de búsqueda cuando cambia el programa
    setResults([]); // Limpiar los resultados
  }, [programId]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar asignatura..."
        disabled={!programId} 
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
