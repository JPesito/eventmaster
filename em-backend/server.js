const express = require('express');
const mysql = require('mysql2/promise'); // Para usar promesas
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado
const jwt = require('jsonwebtoken'); // Asegúrate de tener jsonwebtoken instalado
const cors = require('cors');
const { format, isValid, parseISO } = require('date-fns'); // Usaremos date-fns para el formato de fechas
const app = express();

// Middlewares
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
      database: 'eventmaster',
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
    const sql = 'SELECT * FROM users WHERE userName = ?';
    const [results] = await db.query(sql, [username]);

    if (results.length > 0) {
      const user = results[0]; // Usar el primer resultado

      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.userPassword);

      if (isMatch) {
        // Contraseña correcta
        const token = jwt.sign(
          { id: user.id, username: user.userName },
          'secret_key',
          { expiresIn: '1h' }
        );
        return res.json({ token });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta. Intenta nuevamente.' });
      }
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en el servidor:', error); // Log de error más detallado
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
    const [results] = await db.query('SELECT * FROM tools WHERE nameTool LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching tools:', err);
    res.status(500).json({ message: 'Error searching tools' });
  }
});

//Obtener profesores

app.get('/teachers/search', async (req, res) => {
  const { query } = req.query;

  try {
    const sql = 'SELECT * FROM teachers WHERE teacherName LIKE ?';
    const [results] = await db.query(sql, [`%${query}%`]);

    res.json(results);
  } catch (error) {
    console.error('Error en la búsqueda de profesores:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


//Obtener salones

app.get('/rooms', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, roomName FROM rooms');
    res.json(results);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
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

// Obtener periodos académicos
app.get('/academicperiod', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, academicSemester FROM academicperiod');
    res.json(results);
  } catch (error) {
    console.error('Error al obtener periodos académicos:', error);
    res.status(500).json({ error: 'Error al obtener periodos académicos' });
  }
});

// Ruta para obtener eventos

app.get('/eventsroom', async (req, res) => {

  const { roomID } = req.query;

  if (!roomID) {
    return res.status(400).json({ error: 'Se requiere el ID de la sala (roomID)' });
  }

  const query = 'SELECT teachers.teacherName, subjects.nameSubject, events.* FROM events JOIN teachers ON events.teacherid = teachers.id JOIN subjects ON events.subjectid = subjects.id WHERE events.roomID = ?';

  try {
    const [results] = await db.query(query, [roomID]);

    res.json(results);
  } catch (err) {
    console.error('Error al obtener los eventos:', err);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});





// Crear eventos

app.post('/events', async (req, res) => {
  const { roomID, teacherID, programID, subjectID, start, end } = req.body;

  // Cambiar esto
  const startDateMySQL = format(new Date(start), 'yyyy-MM-dd HH:mm:ss');
  const endDateMySQL = format(new Date(end), 'yyyy-MM-dd HH:mm:ss');

  // Validación de fechas
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  if (!isValid(startDate) || !isValid(endDate)) {
    return res.status(400).json({ error: 'Fechas no válidas' });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO events (roomID, teacherID, programID, subjectID, startTime, endTime, academicPeriodID, numStudents, isUsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [roomID, teacherID, programID, subjectID, startDateMySQL, endDateMySQL, 1, 0, false]
    );
    res.json({ id: results.insertId });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Error creating event' });
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
  const { teacherId } = req.params;
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
    const [results] = await db.query(sql, [teacherId]);
    const eventsWithFormattedDates = results.map(event => ({
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


// Búsqueda de programas

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


//Busqueda de asignaturas

app.get('/subjects/search', async (req, res) => {
  const { query, programid } = req.query;

  // Asegúrate de que `programid` esté presente
  if (!programid) {
      return res.status(400).json({ error: 'El ID del programa es requerido' });
  }

  // Validar que el query tenga al menos dos caracteres
  if (query && query.length < 2) {
      return res.status(400).json({ error: 'El término de búsqueda debe tener al menos 2 caracteres' });
  }

  // Construir la consulta SQL
  let sql = `SELECT * FROM subjects WHERE programid = ?`;
  const params = [programid];

  // Si hay un término de búsqueda (`query`), añadirlo a la consulta
  if (query) {
      sql += ` AND nameSubject LIKE ?`;
      params.push(`%${query}%`); // Agrega comodines para la búsqueda parcial
  }

  try {
    const [results] = await db.query(sql, params);
    if (results.length === 0) {
      console.log('No results found'); // Log si no hay resultados
    }
    res.json(results); // Enviar los resultados al frontend
  } catch (err) {
    console.error('Error ejecutando la consulta:', err); // Log de errores
    res.status(500).json({ error: err.message });
  }
});



// Puerto
const PORT = 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
