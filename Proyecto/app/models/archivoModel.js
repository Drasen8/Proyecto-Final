// models/archivoModel.js
const db = require('../models/db.js');

module.exports = {
  // Leer rutas de archivos asociados (ya existe)
  getByExpediente: (id_expediente) => {
    const sql = `
      SELECT foto_path,
             pdf_path,
             pdf_aclar,
             pdf_cobertura   -- añade esta columna a la consulta
        FROM Expedientes
       WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id_expediente], (err, rows) => {
        if (err) return reject(err);
        // Si no hay fila, devolvemos un objeto con nulls para todas las claves
        resolve(rows[0] || {
          foto_path: null,
          pdf_path: null,
          pdf_aclar: null,
          pdf_cobertura: null
        });
      });
    });
  },

  // Guardar (o sobrescribir) rutas de archivos principales (ya existe)
  saveForExpediente: (id_expediente, foto_path, pdf_path) => {
    const sql = `
      UPDATE Expedientes
         SET foto_path   = ?,
             pdf_path    = ?
       WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [foto_path, pdf_path, id_expediente], err => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  // Guardar el archivo PDF de aclaración (ya existe)
  savePdfAclaracion: (id_expediente, pdf_aclar) => {
    const sql = `
      UPDATE Expedientes
         SET pdf_aclar = ?
       WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [pdf_aclar, id_expediente], err => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  // ——— NUEVO: Guardar el archivo PDF de cobertura de póliza ———
  savePdfCobertura: (id_expediente, pdf_cobertura) => {
    const sql = `
      UPDATE Expedientes
         SET pdf_cobertura = ?
       WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [pdf_cobertura, id_expediente], err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};
