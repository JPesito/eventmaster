const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors');
const { format, isValid, parseISO } = require('date-fns'); // Usaremos date-fns para el formato de fechas
require('dotenv').config();
const app = express();

const allowedOrigins = [
  process.env.REACT_APP_API_BASE_URL,
  'http://10.0.0.163:3002',
  'http://10.0.0.163:3000',
  'http://localhost:3002',
  'http://10.0.0.235:3002'
];

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



// Ruta de login
app.post('/auth/login', async (req, res) => {
  const { userName, userPassword } = req.body;

  console.log('Contraseña proporcionada:', userPassword);
  

  if (!userName || !userPassword) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  try {
    // Buscar al usuario en la base de datos
    const [rows] = await db.query('SELECT * FROM users WHERE userName = ?', [userName]);

    console.log('Resultado de la consulta:', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const user = rows[0];

    // Verificar la contraseña
    try {
      console.log('Password del usuario en la base de datos:', user.userPassword);
      const isPasswordValid = await bcrypt.compare(userPassword, String(user.userPassword));
      console.log('Es válida la contraseña:', isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
      }
    } catch (err) {
      console.error('Error al comparar contraseñas:', err);
      return res.status(500).json({ error: 'Error en la comparación de contraseñas.' });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id, userName: user.UserName }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});



/********  Peticiones GET ********/


// Consultorio Juridico

app.get('/expedientes/search', async (req, res) => {
  const { query } = req.query;

  try {
    const [results] = await db.query('SELECT nameEXPEDIENTE FROM expedientes WHERE codigo LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching tools:', err);
    res.status(500).json({ message: 'Error searching tools' });
  }
});



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
    const sql = 'SELECT * FROM teachers WHERE teacherName LIKE ? ';
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
    WHERE events.teacherid = ? AND events.IsUsed = 0;
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
  const { tools } = req.body; 
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
  const { teacherID, roomID, subjectID, start, end, programID} = req.body;

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
      'INSERT INTO events (teacherID, roomID, subjectID,  startTime, endTime, numStudents, isUsed, programID, academicPeriodID, isUnreserved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [teacherID, roomID, subjectID, startDateMySQL, endDateMySQL, 0, 0, programID, 8, 0]
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
  const { roomID, teacherID, programID, subjectID, start, end, periodID } = req.body;


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
      [roomID, teacherID, programID, subjectID, startDateMySQL, endDateMySQL, periodID, 0, true, true]
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

  try {
    const [results] = await db.query('SELECT * FROM programs WHERE namePrograms LIKE ?', [`%${query}%`]);
    res.json(results);
  } catch (err) {
    console.error('Error searching programs:', err);
    res.status(500).json({ message: 'Error searching programs' });
  }
});


app.get('/reports', async (req, res) => {
  const { program, period } = req.query;

  // Verificar que los parámetros requeridos estén presentes.
  if (!program || !period) {
    return res.status(400).json({ error: 'Faltan parámetros: program y/o period.' });
  }

  try {
    // Consulta SQL adaptada a tu tabla.
    const query = `
      SELECT 
        subjects.nameSubject, 
        rooms.roomName, 
        academicperiod.academicSemester,
        events.id,
        events.startTime,
        events.endTime,
        events.programid,
        events.numStudents
      FROM events
      JOIN subjects ON events.subjectid = subjects.id
      JOIN rooms ON events.roomid = rooms.id
      JOIN academicperiod ON events.academicperiodid = academicperiod.id
      WHERE events.programid = ? AND academicperiod.id = ?;
    `;

    // Ejecutar la consulta con los parámetros program y period.
    const [rows] = await db.query(query, [program, period]);

    // Devolver los resultados al cliente.
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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





{/* EndPoints de Reportes*/}

app.get('/general-report', async (req, res) => {
  const programId = req.query.programId;
  const academicPeriodId = req.query.academicPeriodId;
  try {
    const [results] = await db.query(`
      WITH EventMetrics AS (
        SELECT 
          academicperiod.academicSemester,
          events.startTime,
          events.endTime,
          events.programid,
          events.numStudents
        FROM events
        JOIN academicperiod ON events.academicperiodid = academicperiod.id
        WHERE events.programid = ? AND academicperiod.id = ?
      ),
      EnrollmentInfo AS (
        SELECT 
          academicperiod.academicSemester,
          academicperiodprograms.totalEnrolled
        FROM academicperiodprograms
        JOIN academicperiod ON academicperiodprograms.academicperiodID = academicperiod.id
        WHERE academicperiodprograms.programID = ? AND academicperiod.id = ?
        GROUP BY academicperiod.academicSemester, academicperiodprograms.totalEnrolled
      )
      SELECT 
        em.*,
        ei.totalEnrolled
      FROM EventMetrics em
      LEFT JOIN EnrollmentInfo ei ON em.academicSemester = ei.academicSemester
    `, [programId, academicPeriodId, programId, academicPeriodId]);

    const processedData = processEventData(results);
    res.json(processedData);
  } catch (error) {
    console.error('Error in general-report:', error);
    res.status(500).send("Error fetching data");
  }
});

function processEventData(data) {
  return data.reduce((acc, event) => {
    const { academicSemester, numStudents, startTime, endTime, totalEnrolled } = event;
    const duration = (new Date(endTime) - new Date(startTime)) / 3600000;

    if (!acc[academicSemester]) {
      acc[academicSemester] = {
        groupClasses: 0,
        hours: 0,
        studentAttendance: 0,
        totalEnrolled: totalEnrolled || 0,
      };
    }

    acc[academicSemester].groupClasses++;
    acc[academicSemester].hours += duration;
    acc[academicSemester].studentAttendance += numStudents;

    return acc;
  }, {});
}

app.get('/group-attendance', async (req, res) => {
  const { academicPeriodId, programId } = req.query;

  try {
    const [rooms] = await db.query('SELECT id, roomName FROM rooms ORDER BY id');
    const roomNames = rooms.map((room) => room.roomName);

    const [attendance] = await db.query(
      `SELECT roomID, COUNT(*) AS attendance
       FROM events
       WHERE academicPeriodId = ? AND programId = ?
       GROUP BY roomID`,
      [academicPeriodId, programId]
    );

    const attendances = rooms.map(
      (room) => attendance.find((a) => a.roomID === room.id)?.attendance || 0
    );

    res.json({ rooms: roomNames, attendances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los datos de asistencia grupal' });
  }
});


app.get('/subjects-by-period', async (req, res) => {
  const { academicPeriodId, programId } = req.query;

  if (!academicPeriodId || !programId) {
    return res.status(400).json({ error: 'Se requieren academicPeriodId y academicProgramId' });
  }

  try {
    const result = await db.query(
      `WITH SubjectCounts AS (
        SELECT 
          s.id,
          s.nameSubject,
          COUNT(*) as subject_count,
          (SELECT COUNT(*) 
           FROM events e2 
           WHERE e2.academicperiodid = ? AND e2.programid = ?) as total_events
        FROM events e
        INNER JOIN subjects s ON e.subjectID = s.id
        WHERE e.academicperiodid = ? AND e.programid = ?
        GROUP BY s.id, s.nameSubject
      )
      SELECT 
        nameSubject,
        subject_count as repeticiones,
        ROUND((subject_count * 100.0 / total_events), 2) as porcentaje
      FROM SubjectCounts
      ORDER BY porcentaje DESC, nameSubject`,
      [academicPeriodId, programId, academicPeriodId, programId]
    );

    res.json(result);
  } catch (error) {
    console.error('Error al obtener asignaturas:', error);
    res.status(500).json({ error: 'Error al obtener las asignaturas' });
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