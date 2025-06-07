const db = require('./db.js'); // Asegúrate de que la ruta sea correcta

exports.getUserByNombreYContraseña = (nombre, contraseña) => {
  return new Promise((resolve, reject) => {
    const sql =  `SELECT * FROM usuarios WHERE nombre = '${nombre}' AND contraseña = '${contraseña}'`;
    db.query(sql, [nombre, contraseña], (err, results) => {
      if (err) {console.log("Usuario obtenido de la base de datos:", err);
        return reject(err);
      
      }
      
      resolve(results[0]); // Devuelve el usuario si existe
    });
  });
};

exports.getRegistrarUser = (nombre, contraseña, email, tipo, codigo) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) return reject(err);

      const checkSql = `SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ? AND email = ?`;
      db.query(checkSql, [nombre, contraseña, email], (err, results) => {
        if (err) return db.rollback(() => reject(err));

        if (results.length > 0) {
          return db.rollback(() => reject(new Error('El usuario ya existe.')));
        }

        const insertUserSql = `INSERT INTO usuarios (nombre, contraseña, email, tipo_usuario) VALUES (?, ?, ?, ?)`;
        db.query(insertUserSql, [nombre, contraseña, email, tipo], (err, result) => {
          if (err) return db.rollback(() => reject(err));

          const idUsuario = result.insertId;
          let tipoSql = '';
          let values = [];

          switch (tipo) {
            case 'aseguradora':
              tipoSql = `INSERT INTO Aseguradoras (nif, id_usuario) VALUES (?, ?)`;
              values = [codigo, idUsuario];
              break;
            case 'ayuntamiento':
              tipoSql = `INSERT INTO Ayuntamientos (codigo_municipal, id_usuario) VALUES (?, ?)`;
              values = [codigo, idUsuario];
              break;
            case 'perito':
              tipoSql = `INSERT INTO Peritos (numero_colegiado, id_usuario) VALUES (?, ?)`;
              values = [codigo, idUsuario];
              break;
            default:
              return db.rollback(() => reject(new Error("Tipo de usuario no válido")));
          }

          db.query(tipoSql, values, (err, resultExtra) => {
            if (err) return db.rollback(() => reject(err));

            db.commit((err) => {
              if (err) return db.rollback(() => reject(err));

              resolve({ id_usuario: idUsuario, tipo: tipo });
            });
          });
        });
      });
    });
  });
};

exports.getTipoPorId = (id_usuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        CASE
          WHEN EXISTS(SELECT 1 FROM Peritos WHERE id_usuario = ?) THEN 'perito'
          WHEN EXISTS(SELECT 1 FROM Aseguradoras WHERE id_usuario = ?) THEN 'aseguradora'
          ELSE 'desconocido'
        END AS tipo
    `;
    db.query(sql, [id_usuario, id_usuario, id_usuario], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].tipo);
    });
  });
};

