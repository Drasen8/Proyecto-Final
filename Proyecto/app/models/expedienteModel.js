const db = require('../models/db.js');

// Obtiene todos los expedientes asociados a un nombre de usuario
exports.getExpedientesPorUsuario = (nombreUsuario) => {
  const sql = `
    SELECT e.id_expediente, e.descripcion, e.fecha_creacion
    FROM Expedientes e
    JOIN Usuarios_Expedientes ue ON e.id_expediente = ue.id_expediente
    JOIN Usuarios u ON u.id_usuario = ue.id_usuario
    WHERE u.nombre = ?
    ORDER BY e.fecha_creacion DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [nombreUsuario], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};