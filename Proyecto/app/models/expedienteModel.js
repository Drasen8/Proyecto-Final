const db = require('../models/db.js');

// Obtiene todos los expedientes asociados a un nombre de usuario
exports.getExpedientesPorUsuario = (nombreUsuario) => {
  const sql = `
  SELECT e.*
  FROM Expedientes e
  JOIN usuarios_expedientes eu
    ON e.id_expediente = eu.id_expediente
  JOIN Usuarios u
    ON eu.id_usuario = u.id_usuario
  WHERE u.nombre = ?
  ORDER BY e.fecha_creacion DESC;
`;
  return new Promise((resolve, reject) => {
    db.query(sql, [nombreUsuario], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

