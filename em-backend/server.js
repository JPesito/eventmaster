const express = require('express');
const mysql = require('mysql2/promise'); // Cambiado para usar promesas
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(express.json());

let db; // Declarar la variable de conexión

// Función asíncrona para inicializar la conexión
const initializeDbConnection = async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'FUH2024**',
      database: 'eventmestre'
    });
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Salir si no se puede conectar
  }
};

// Inicializar la conexión
initializeDbConnection();


/********  Login ********/

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Consulta SQL para verificar si el usuario existe
    const sql = 'SELECT * FROM users WHERE userName = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al buscar el usuario' });
      }

      if (results.length > 0) {
        const user = results[0];

        // Comparar las contraseñas usando bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ message: 'Error al comparar contraseñas' });
          }

          if (isMatch) {
            // Generar un token JWT
            const token = jwt.sign(
              { id: user.id, username: user.userName }, // Usa userName en vez de username si así está en la tabla
              'secret_key',
              { expiresIn: '1h' }
            );
            res.json({ token });
          } else {
            // Si la contraseña es incorrecta
            return res.status(401).json({ message: 'Contraseña incorrecta' });
          }
        });
      } else {
        // Si el usuario no existe
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    });
  } catch (error) {
    // Manejo de cualquier error inesperado
    res.status(500).json({ message: 'Error en el servidor' });
  }
});




/********  Peticiones GET ********/

// Tecnologias y/o Herramientas

app.get('/tools/search', async (req, res) => {
  const { query } = req.query;

  if (query.length < 2) {
    return res.json([]);
  }

  try {
    const [results] = await db.query('SELECT * FROM tools WHERE nameTool LIKE ? ', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching teachers:', err);
    res.status(500).json({ message: 'Error searching teachers' });
  }
});


// Obtener programas

app.get('/programs', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, namePrograms FROM programs');
    res.json(results);
  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({ error: 'Error al obtener programas' });
  }
});


//Obtener periodos academicos

app.get('/academicperiod', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, academicSemester FROM academicperiod'); 
    res.json(results);
  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({ error: 'Error al obtener programas' });
  }
});


// Ruta para obtener eventos
app.get('/events', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM events');
    res.json(results);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Registrar uso de sala
app.put('/events/:id', async (req, res) => {
  const { id } = req.params; 
  const { numStudents, isUsed } = req.body;

  try {
    const query = 'UPDATE events SET numStudents = ?, isUsed = ? WHERE id = ?';
    await db.query(query, [numStudents, isUsed, id]);
    res.status(200).json({ message: 'Evento actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando el evento:', error);
    res.status(500).json({ message: 'Error actualizando el evento' });
  }
});

// Listado de clases activas
app.get('/events/:teacherId', async (req, res) => {
  const teacherId = req.params.teacherId;
  const sql = `
    SELECT 
        subjects.nameSubject, 
        rooms.roomName, 
        programs.namePrograms,
        events.id,
        events.startTime,
        events.endTime
    FROM events
    JOIN subjects ON events.subjectid = subjects.id
    JOIN rooms ON events.roomid = rooms.id
    JOIN programs ON subjects.programid = programs.id
    WHERE events.teacherid = ? 
      AND NOW() BETWEEN DATE_SUB(events.startTime, INTERVAL 3 HOUR) 
      AND DATE_ADD(events.endTime, INTERVAL 3 HOUR);
  `;

  try {
    const [result] = await db.query(sql, [teacherId]);
    const eventsWithFormattedDates = result.map(event => ({
      ...event,
      startTime: new Date(event.startTime).toISOString(),
      endTime: new Date(event.endTime).toISOString(),
    }));
    res.json(eventsWithFormattedDates);
  } catch (err) {
    console.error('Error fetching active classes:', err);
    res.status(500).json({ message: 'Error fetching active classes' });
  }
});

// Obtener salas
app.get('/rooms', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM rooms');
    res.json(results);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Crear eventos
app.post('/events', async (req, res) => {
  const { title, start, end, room } = req.body;

  const startDateMySQL = moment(start).format('YYYY-MM-DD HH:mm:ss');
  const endDateMySQL = moment(end).format('YYYY-MM-DD HH:mm:ss');

  const query = 'INSERT INTO events (title, start, end, room) VALUES (?, ?, ?, ?)';
  try {
    const [results] = await db.query(query, [title, startDateMySQL, endDateMySQL, room]);
    res.json({ id: results.insertId });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Búsqueda de Programas
app.get('/programs/search', async (req, res) => {
  const { query } = req.query;

  if (query.length < 2) {
    return res.json([]);
  }
  
  try {
    const [results] = await db.query('SELECT * FROM programs WHERE namePrograms LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching programs:', err);
    res.status(500).json({ message: 'Error searching programs' });
  }
});

// Búsqueda de Asignaturas
app.get('/subjects/search', async (req, res) => {
  const { query, programid } = req.query;

  if (!programid) {
    return res.status(400).json({ message: 'El ID del programa es requerido.' });
  }

  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const [results] = await db.query(
      'SELECT * FROM subjects WHERE nameSubject LIKE ? AND programid = ?',
      [`%${query}%`, programid]
    );
    res.json(results);
  } catch (err) {
    console.error('Error searching subjects:', err);
    res.status(500).json({ message: 'Error searching subjects' });
  }
});

// Búsqueda de Profesores
app.get('/teachers/search', async (req, res) => {
  const { query } = req.query;

  if (query.length < 2) {
    return res.json([]);
  }

  try {
    const [results] = await db.query('SELECT * FROM teachers WHERE teacherName LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching teachers:', err);
    res.status(500).json({ message: 'Error searching teachers' });
  }
});

// Disponibilidad de Salas
app.get('/rooms/availability', async (req, res) => {
  const sql = `
    SELECT rooms.id, rooms.roomName, 
    (SELECT COUNT(*) FROM events WHERE events.roomID = rooms.id AND 
    (start < NOW() AND end > NOW())) AS isBooked
    FROM rooms
  `;
  
  try {
    const [results] = await db.query(sql);
    const availableRooms = results.map(room => ({
      ...room,
      isAvailable: room.isBooked === 0,
    }));
    res.json(availableRooms);
  } catch (err) {
    console.error('Error fetching room availability:', err);
    res.status(500).json({ message: 'Error fetching room availability' });
  }
});

// Puerto
const PORT = 5000;

app.listen(PORT, () => console.log('Server running on port', PORT));
