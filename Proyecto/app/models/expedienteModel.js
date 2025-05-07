const db = require('../models/db.js');

exports.getExpedientesPorUsuario = (nombreUsuario) => {
  const sql = `
    SELECT e.*
      FROM Expedientes e
      JOIN Usuarios_Expedientes eu ON e.id_expediente = eu.id_expediente
      JOIN Usuarios u ON eu.id_usuario = u.id_usuario
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

exports.createExpediente = ({ descripcion, matricula, dni_cliente }) => {
  return new Promise((resolve, reject) => {
    // 1) Insertamos con los valores que vienen del formulario
    const sqlInsert = `
      INSERT INTO Expedientes (descripcion, matricula, dni_cliente)
      VALUES (?, ?, ?)
    `;
    db.query(sqlInsert, [descripcion, matricula, dni_cliente], (err, result) => {
      if (err) return reject(err);
      const newId = result.insertId;

      // 2) Recuperamos el registro completo (incluye fecha_creacion automática)
      const sqlSelect = `
        SELECT *
          FROM Expedientes
         WHERE id_expediente = ?
      `;
      db.query(sqlSelect, [newId], (err2, rows) => {
        if (err2) return reject(err2);
        resolve(rows[0]);
      });
    });
  });
};
exports.associateUsuarioExpediente = (id_usuario, id_expediente) => {
  const sql = `
    INSERT INTO Usuarios_Expedientes (id_usuario, id_expediente)
    VALUES (?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_usuario, id_expediente], err => {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.insertEstadoInicial = (id_expediente, id_estado = 1) => {
  const sql = `
    INSERT INTO Expediente_Estados (id_expediente, id_estado)
    VALUES (?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_expediente, id_estado], err => {
      if (err) return reject(err);
      resolve();
    });
  });
};
