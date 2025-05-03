const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController');

// GET /mis-expedientes
router.get('/', expedienteController.getExpedientesUsuario);

module.exports = router;
