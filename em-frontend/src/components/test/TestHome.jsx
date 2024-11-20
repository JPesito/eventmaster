import React, { useState, useEffect, useContext, createContext } from 'react';
import { NavLink } from 'react-router-dom';  // Cambié 'Link' por 'NavLink'

// **1. Contexto para compartir tema**
const ThemeContext = createContext();

const TestHome = () => {
  // **2. Estado global para el tema**
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme === 'light' ? 'light-theme' : 'dark-theme'} style={{ padding: '20px' }}>
        {/* Navegación básica */}
        <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
          <NavLink to="/" style={{ marginRight: '10px' }}>Inicio</NavLink> | 
          <NavLink to="/tasks" style={{ marginRight: '10px' }}>Tareas</NavLink> | 
          <NavLink to="/timer" style={{ marginRight: '10px' }}>Temporizador</NavLink>
        </nav>

        {/* Botón para cambiar el tema */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Cambiar a {theme === 'light' ? 'Oscuro' : 'Claro'}
          </button>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

// **3. Página de inicio**
const Home = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Bienvenido a la App de Ejemplo</h1>
      <p>Actualmente estás usando el tema <strong>{theme}</strong>.</p>
    </div>
  );
};

// **4. Componente de lista de tareas**
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Gestor de Tareas</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nueva tarea"
        style={{ margin: '10px' }}
      />
      <button onClick={addTask}>Agregar Tarea</button>
      <ul style={{ marginTop: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

// **5. Componente de temporizador con `useEffect`**
const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval); // Limpieza del intervalo
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Temporizador</h2>
      <p>Tiempo transcurrido: {seconds} segundos</p>
    </div>
  );
};

export default TestHome;
