// models/archivoModel.js
const db = require('../models/db.js');

module.exports = {
  // Leer rutas de archivos asociados
  getByExpediente: (id_expediente) => {
    const sql = `
      SELECT foto_path, pdf_path
      FROM Expedientes
      WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id_expediente], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || { foto_path: null, pdf_path: null });
      });
    });
  },

  // Guardar (o sobrescribir) rutas de archivos
  saveForExpediente: (id_expediente, foto_path, pdf_path) => {
    const sql = `
      UPDATE Expedientes
         SET foto_path = ?, pdf_path = ?
       WHERE id_expediente = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [foto_path, pdf_path, id_expediente], err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};
