const db = require('../models/db');

exports.getExpedienteByParams = (id, dni, matricula, contraseña) => {
  const sql = `
    SELECT 
  e.*, 
  est.nombre_estado, 
  est.fecha_cambio
FROM Expedientes e
LEFT JOIN (
  SELECT 
    ee.id_expediente, 
    es.nombre_estado, 
    ee.fecha_cambio
  FROM Expediente_Estados ee
  JOIN Estados es 
    ON ee.id_estado = es.id_estado
  WHERE (ee.id_expediente, ee.fecha_cambio) IN (
    SELECT 
      id_expediente, 
      MAX(fecha_cambio)
    FROM Expediente_Estados
    GROUP BY id_expediente
  )
) AS est 
  ON est.id_expediente = e.id_expediente
WHERE 
  e.id_expediente = ? 
  AND e.dni_cliente = ? 
  AND e.matricula   = ?
  AND e.contraseña = ?
;

  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id, dni, matricula, contraseña], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};
