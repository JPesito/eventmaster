const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Para usar promesas
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
const { format, isValid, parseISO } = require('date-fns'); // Usaremos date-fns para el formato de fechas
require('dotenv').config();
const app = express();

const allowedOrigins = [ process.env.REACT_APP_API_BASE_URL, 'http://10.0.0.163:3002', 'http://10.0.0.163:3000', 'http://localhost:3002' ]

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin 'origin' como las de herramientas como Postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy does not allow access from this origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

let db; // Declarar la variable de conexión

// Función asíncrona para inicializar la conexión
const initializeDbConnection = async () => {
  try {

    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Salir si no se puede conectar
  }
};

// Inicializar la conexión
initializeDbConnection();



// Nuevo endpoint para probar la conexión
app.get('/api/test-connection', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});



/********  Login ********/
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = 'SELECT * FROM users WHERE userName = ?';
    const [results] = await db.query(sql, [username]);

    if (results.length > 0) {
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.userPassword);

      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, username: user.userName, isAdmin: user.isAdmin }, 
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
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

/********  Middleware para verificar token y si es admin ********/
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Acceso no autorizado' });
      }
      req.user = decoded; // Almacenar la información del usuario
      next();
    });
  } else {
    res.status(401).json({ message: 'Token no proporcionado' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Solo los administradores pueden acceder a esta ruta' });
  }
};

/********  Ruta protegida solo para admins ********/
app.get('/admin-only', authenticateJWT, isAdmin, (req, res) => {
  res.json({ message: 'Bienvenido, Admin' });
});

// Rutas normales protegidas por JWT
app.get('/secure-route', authenticateJWT, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.username}` });
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


//Obtener Listado de Eventos por ID de profesor

app.get('/events/teacher/:teacherId', async (req, res) => {
  const teacherId = req.params.teacherId;

  const query = `
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
    WHERE events.teacherid = ?;
  `;

  await db.query(query, [teacherId], (error, results) => {
    if (error) {
      console.error('Error al obtener eventos:', error);
      return res.status(500).json({ message: 'Error al obtener eventos' });
    }
    console.log('Resultados de eventos:', results); // Agrega este log
    res.status(200).json(results);
  });
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


app.post('events/:eventId/tools', async (req, res) => {
  const { eventId } = req.params;
  const { tools } = req.body; // Lista de toolIds
  try {
    // Inserta cada toolId con el eventId en la tabla eventstools
    const values = tools.map(toolId => [eventId, toolId]);
    const query = 'INSERT INTO eventstools (eventId, toolId) VALUES ?';

    await db.query(query, [values]);

    res.status(200).json({ message: 'Tools added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving tools', error });
  }
});



//Eliminar eventos

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
});

//Modificar evento

app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { roomID, teacherID, programID, subjectID, start, end } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE events SET roomID = ?, teacherID = ?, programID = ?, subjectID = ?, startTime = ?, endTime = ? WHERE id = ?',
      [roomID, teacherID, programID, subjectID, start, end, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json({ message: 'Evento modificado correctamente' });
  } catch (error) {
    console.error('Error al modificar el evento:', error);
    res.status(500).json({ message: 'Error al modificar el evento' });
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


{/* POST - Tools for each Event */}

app.post('/events/:eventId/tools', async (req, res) => {
  const { eventId } = req.params;
  const { tools } = req.body;

  // Verificar si tools es un array
  if (!Array.isArray(tools)) {
    return res.status(400).json({ message: 'Invalid tools format; it should be an array' });
  }

  try {
    // Start a transaction
    await db.query('START TRANSACTION');

    // Delete existing tools for this event
    await db.query('DELETE FROM eventstools WHERE eventId = ?', [eventId]);

    // Insert new tools
    for (const tool of tools) {
      if (tool.customToolName) {
        // Insert custom tool into tools table if needed
        const [insertToolResult] = await db.query(
          'INSERT INTO tools (nameTool, createdTeacher) VALUES (?, 1) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
          [tool.customToolName]
        );
        const toolId = insertToolResult.insertId;

        // Insert the association into eventsTools
        await db.query(
          'INSERT INTO eventsTools (eventId, toolId) VALUES (?, ?)',
          [eventId, toolId]
        );
      } else {
        // Insert association for regular tool
        await db.query(
          'INSERT INTO eventsTools (eventId, toolId) VALUES (?, ?)',
          [eventId, tool.toolId]
        );
      }
    }

    // Commit the transaction
    await db.query('COMMIT');

    res.status(200).json({ message: 'Tools saved successfully' });
  } catch (error) {
    // Rollback the transaction if there's an error
    await db.query('ROLLBACK');
    console.error('Error saving tools:', error);
    res.status(500).json({ message: 'Error saving tools', error: error.message });
  }
});



{/* POST - Events UnReserved */}

app.post('/events-unreserved', async (req, res) => {
  const { roomID, teacherID, programID, subjectID, start, end } = req.body;


  const startDateMySQL = format(new Date(start), 'yyyy-MM-dd HH:mm:ss');
  const endDateMySQL = format(new Date(end), 'yyyy-MM-dd HH:mm:ss');

  const startDate = parseISO(start);
  const endDate = parseISO(end);
  if (!isValid(startDate) || !isValid(endDate)) {
    return res.status(400).json({ error: 'Fechas no válidas' });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO events (roomID, teacherID, programID, subjectID, startTime, endTime, academicPeriodID, numStudents, isUsed, isUnreserved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [roomID, teacherID, programID, subjectID, startDateMySQL, endDateMySQL, 1, 0, true, true]
    );
    res.json({ id: results.insertId });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Error creating event' });
  }
});



// Registrar uso de sala
app.put('/check/:id', async (req, res) => {
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

  if (!programid) {
      return res.status(400).json({ error: 'El ID del programa es requerido' });
  }

  if (query && query.length < 2) {
      return res.status(400).json({ error: 'El término de búsqueda debe tener al menos 2 caracteres' });
  }

  // Construir la consulta SQL
  let sql = `SELECT * FROM subjects WHERE programid = ?`;
  const params = [programid];

  if (query) {
      sql += ` AND nameSubject LIKE ?`;
      params.push(`%${query}%`);
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



// Middleware para servir archivos estáticos de la carpeta build del frontend
app.use(express.static(path.join(__dirname, '../em-frontend/build')));

// Enviar todos los requests a index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../em-frontend/build', 'index.html'));
});

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});