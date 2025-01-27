const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { userName, userPassword } = req.body;

    if (!userName || !userPassword) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verifica si el usuario existe
    const query = 'SELECT * FROM users WHERE userName = ?';
    db.query(query, [userName], (err, results) => {
      if (err) {
        console.error('Error en la consulta SQL:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = results[0];

      // Verifica la contraseña
      const isPasswordValid = bcrypt.compareSync(userPassword, user.userPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Genera el token JWT
      const token = jwt.sign(
        { id: user.id, userName: user.userName },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ token, message: 'Inicio de sesión exitoso' });
    });
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
