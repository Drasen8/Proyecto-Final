const db = require('./db.js');

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

exports.nextEstado = (id_expediente) => {
  return new Promise((resolve, reject) => {
    // 1) Obtén el último estado
    const sql0 = `
      SELECT id_estado
        FROM Expediente_Estados
       WHERE id_expediente = ?
       ORDER BY fecha_cambio DESC
       LIMIT 1
    `;
    db.query(sql0, [id_expediente], (err, rows) => {
      if (err) return reject(err);
      // Si no hay ninguno, arranca en estado 1
      const actual = rows[0]?.id_estado ?? 0;
      const siguiente = actual + 1;

      // 2) Inserta el nuevo estado
      const sql1 = `
        INSERT INTO Expediente_Estados (id_expediente, id_estado)
        VALUES (?, ?)
      `;
      db.query(sql1, [id_expediente, siguiente], err2 => {
        if (err2) return reject(err2);
        resolve(siguiente);
      });
    });
  });
};

exports.getExpedienteById = (id_expediente) => {
  const sql = `
    SELECT *
      FROM Expedientes
     WHERE id_expediente = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_expediente], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

exports.updatePrecioPerito = (id_expediente, precio) => {
  const sql = `
    UPDATE Expedientes
       SET precio_perito = ?
     WHERE id_expediente = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [precio, id_expediente], err => {
      if (err) return reject(err);
      resolve();
    });
  });
};