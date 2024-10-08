const bcrypt = require('bcrypt');

const password = 'password123'; // Esta es la contraseña original

// Genera un nuevo hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Nuevo hash generado:', hash);

    // Comparar el nuevo hash
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        console.error('Error en la comparación:', err);
      } else {
        console.log('Resultado de la comparación con el nuevo hash:', result); // Esto debería ser true
      }
    });
  }
});
