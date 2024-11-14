const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
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
};
