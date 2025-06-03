// routes/archivo.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/archivoController');

// Paso 1: foto + pdf principal
router.get('/:id/archivos',         ctrl.getArchivos);
router.post('/:id/archivos',        ctrl.uploadArchivos);

// Paso 2: PDF de aclaración
router.get('/:id/archivos/aclaracion',       ctrl.getArchivosAclaracion);
router.post('/:id/archivos/aclaracion',      ctrl.uploadArchivoPdfAclaracion);

// ——— NUEVO: Paso 3 “Cobertura póliza” ———
router.get('/:id/archivos/cobertura',        ctrl.getArchivosCobertura);
router.post('/:id/archivos/cobertura',       ctrl.uploadArchivoPdfCobertura);

router.get('/:id/archivos/peritaje',        ctrl.getArchivosPeritaje);
router.post('/:id/archivos/peritaje',       ctrl.uploadArchivoPdfPeritaje);

module.exports = router;
