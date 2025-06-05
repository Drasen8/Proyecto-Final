const express = require('express');
const router = express.Router();
const expedienteCtrl = require('../controllers/expedienteController');

// GET  /mis-expedientes  → listar
router.get('/', expedienteCtrl.getExpedientesUsuario);

// POST /mis-expedientes  → crear nuevo expediente
router.post('/', expedienteCtrl.createExpediente);

router.post('/:id/next',     expedienteCtrl.nextEstado);

router.get('/:id', expedienteCtrl.getExpedienteById);

// ── Nueva ruta para actualizar precio_perito ──
router.post('/:id/precio-perito', expedienteCtrl.setPrecioPerito);


module.exports = router;
