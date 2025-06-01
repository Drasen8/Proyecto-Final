// controllers/archivoController.js
const path            = require('path');
const expedienteModel = require('../models/expedienteModel');
const {
  getByExpediente,
  saveForExpediente,
  savePdfAclaracion,
  savePdfCobertura    // ← Importa la nueva función
} = require('../models/archivoModel');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../public/descargas')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // guardamos como: {id}-{campo}.{extensión}
    cb(null, `${req.params.id}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// ——— Paso 1 (ya tenías) ———
// GET  /archivos/:id/archivos
exports.getArchivos = async (req, res) => {
  try {
    const archivos = await getByExpediente(req.params.id);
    res.json(archivos);
  } catch (err) {
    console.error('Error en getArchivos:', err);
    res.sendStatus(500);
  }
};

// POST /archivos/:id/archivos
exports.uploadArchivos = [
  upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
  async (req, res) => {
    try {
      const foto = req.files['foto']?.[0]?.filename || null;
      const pdf  = req.files['pdf']?.[0]?.filename  || null;
      await saveForExpediente(req.params.id, foto, pdf);
      res.sendStatus(201);
    } catch (err) {
      console.error('Error en uploadArchivos:', err);
      res.sendStatus(500);
    }
  }
];

// ——— Paso 2 (ya tenías) ———
// POST /archivos/:id/archivos/aclaracion
exports.uploadArchivoPdfAclaracion = [
  upload.single('pdf'), // solo el campo “pdf”
  async (req, res) => {
    try {
      const pdf = req.file?.filename || null;
      if (!pdf) {
        return res.status(400).json({ error: 'No se ha enviado ningún archivo PDF.' });
      }
      // Orden correcto: (id_expediente, nombreArchivo)
      await savePdfAclaracion(req.params.id, pdf);
      res.sendStatus(201);
    } catch (err) {
      console.error('Error en uploadArchivoPdfAclaracion:', err);
      res.sendStatus(500);
    }
  }
];

// GET /archivos/:id/archivos/aclaracion
exports.getArchivosAclaracion = async (req, res) => {
  try {
    const { pdf_aclar } = await getByExpediente(req.params.id);
    res.json({ pdf_aclaracion: pdf_aclar });
  } catch (err) {
    console.error('Error en getArchivosAclaracion:', err);
    res.sendStatus(500);
  }
};

// ——— NUEVO: Paso 3 — Subir PDF de “Cobertura póliza” ———
// POST /archivos/:id/archivos/cobertura
exports.uploadArchivoPdfCobertura = [
  upload.single('pdf'), // solo permite el campo “pdf”
  async (req, res) => {
    try {
      const pdf = req.file?.filename || null;
      if (!pdf) {
        return res.status(400).json({ error: 'No se ha enviado ningún archivo PDF.' });
      }
      await savePdfCobertura(req.params.id, pdf);
      res.sendStatus(201);
    } catch (err) {
      console.error('Error en uploadArchivoPdfCobertura:', err);
      res.sendStatus(500);
    }
  }
];

// GET /archivos/:id/archivos/cobertura
exports.getArchivosCobertura = async (req, res) => {
  try {
    const { pdf_cobertura } = await getByExpediente(req.params.id);
    res.json({ pdf_cobertura });
  } catch (err) {
    console.error('Error en getArchivosCobertura:', err);
    res.sendStatus(500);
  }
};
