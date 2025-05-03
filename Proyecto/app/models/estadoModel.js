const db = require('../models/db.js');

exports.getEstadoActualByExpediente = (id_expediente) => {
  // Tomamos el último registro de Expediente_Estados por fecha_cambio
  const sql = `
    SELECT es.id_estado, e.nombre_estado
      FROM Expediente_Estados es
      JOIN Estados e USING (id_estado)
     WHERE es.id_expediente = ?
     ORDER BY es.fecha_cambio DESC
     LIMIT 1
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_expediente], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};