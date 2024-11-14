const db = require('../config/db');
const { format, parseISO, isValid } = require('date-fns');

exports.getEventsByRoom = async (req, res) => {
  const { roomID } = req.query;

  if (!roomID) return res.status(400).json({ error: 'Se requiere el ID de la sala (roomID)' });

  const query = `
    SELECT teachers.teacherName, subjects.nameSubject, events.* 
    FROM events 
    JOIN teachers ON events.teacherid = teachers.id 
    JOIN subjects ON events.subjectid = subjects.id 
    WHERE events.roomID = ?
  `;

  try {
    const [results] = await db.query(query, [roomID]);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los eventos:', err);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
};
