const express = require('express');
const router = express.Router();
const consultaCtrl = require('../controllers/consultaController');

// Mostrar formulario de consulta (opcional si ya está en HTML estático)
router.get('/', (req, res) => {
  res.render('consulta'); // views/consulta.ejs
});

// Procesar el formulario
router.post('/', consultaCtrl.buscarExpediente);

module.exports = router;