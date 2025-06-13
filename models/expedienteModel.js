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

exports.createExpediente = ({ descripcion, matricula, dni_cliente ,contrasena }) => {
  return new Promise((resolve, reject) => {
    const sqlInsert = `
      INSERT INTO Expedientes (descripcion, matricula, dni_cliente, contraseña)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sqlInsert, [descripcion, matricula, dni_cliente, contrasena], (err, result) => {
      if (err) return reject(err);
      const newId = result.insertId;

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

// Asociar expediente con usuario
exports.associateUsuarioExpediente = (id_usuario, id_expediente) => {
  const sql = `
    INSERT INTO Usuarios_Expedientes (id_usuario, id_expediente)
    VALUES (?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_usuario, id_expediente], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Obtener id_usuario a partir de id_perito
exports.getUsuarioIdByIdPerito = (id_perito) => {
  const sql = `
    SELECT id_usuario
      FROM Peritos
     WHERE id_perito = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id_perito], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0].id_usuario);
    });
  });
};



// Crear expediente y asociar con usuario actual y perito
exports.crearExpedienteConPerito = async ({ descripcion, matricula, dni_cliente, id_perito }, idUsuarioActual) => {
  try {
//Generamos contraseña aleatoria
    const generarContrasena = () => {
  return Math.random().toString(36).slice(-8); // 8 caracteres aleatorios
};

const contrasenaAleatoria = generarContrasena();
    // 1) Crear expediente
    const expediente = await exports.createExpediente({ descripcion, matricula, dni_cliente, contrasena: contrasenaAleatoria });

    // 2) Asociar expediente con usuario actual
    await exports.associateUsuarioExpediente(idUsuarioActual, expediente.id_expediente);

    // 3) Obtener id_usuario del perito
    console.log('idUsuarioPerito:', id_perito);
    const idUsuarioPerito = await exports.getUsuarioIdByIdPerito(id_perito);
    console.log('idUsuarioPerito:', idUsuarioPerito);
    if (!idUsuarioPerito) throw new Error('Perito no encontrado');

    // 4) Asociar expediente con perito
    await exports.associateUsuarioExpediente(idUsuarioPerito, expediente.id_expediente);

    return expediente;
  } catch (error) {
    throw error;
  }
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
    const sql0 = `
      SELECT id_estado
        FROM Expediente_Estados
       WHERE id_expediente = ?
       ORDER BY fecha_cambio DESC
       LIMIT 1
    `;
    db.query(sql0, [id_expediente], (err, rows) => {
      if (err) return reject(err);
      const actual = rows[0]?.id_estado ?? 0;
      const siguiente = actual + 1;

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
