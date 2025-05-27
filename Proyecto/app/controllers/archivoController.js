const path            = require('path');
// Importa ambos modelos según corresponda
const expedienteModel = require('../models/expedienteModel');
const { getByExpediente, saveForExpediente } = require('../models/archivoModel');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../public/descargas')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// GET /expedientes/:id/archivos
exports.getArchivos = async (req, res) => {
  try {
    const archivos = await getByExpediente(req.params.id);
    res.json(archivos);
  } catch (err) {
    console.error('Error en getArchivos:', err);
    res.sendStatus(500);
  }
};

// POST /expedientes/:id/archivos
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


