const bcrypt = require('bcrypt');

// Contraseña proporcionada por el usuario
const userPassword = 'JP3811+';  // La contraseña proporcionada

// Número de rondas para el hash
const saltRounds = 10;

// Paso 1: Generar el hash
bcrypt.hash(userPassword, saltRounds)
  .then((hash) => {
    console.log('Nuevo Hash generado:', hash);

    // Comparar el hash generado con la contraseña
    bcrypt.compare(userPassword, hash)
      .then((result) => {
        console.log('¿Es válida la contraseña?', result);  // Debería ser true
      })
      .catch((err) => {
        console.error('Error al comparar contraseñas:', err);
      });
  })
  .catch((err) => {
    console.error('Error al generar el hash:', err);
  });
