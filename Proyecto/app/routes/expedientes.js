const express = require('express');
const router = express.Router();
const expedienteCtrl = require('../controllers/expedienteController');

// GET  /mis-expedientes  → listar
router.get('/', expedienteCtrl.getExpedientesUsuario);

// POST /mis-expedientes  → crear nuevo expediente
router.post('/', expedienteCtrl.createExpediente);

router.post('/:id/next',     expedienteCtrl.nextEstado);

module.exports = router;
