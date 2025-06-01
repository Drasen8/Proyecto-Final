const express = require('express');
const router = express.Router();
const estadoCtrl = require('../controllers/estadoController');

// GET /estado-expediente   devuelve el estado actual del expediente en la cookie
router.get('/', estadoCtrl.verEstadoExpediente);

module.exports = router;
