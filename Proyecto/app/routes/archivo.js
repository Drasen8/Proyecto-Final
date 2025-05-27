const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/archivoController');

router.get('/:id/archivos',  ctrl.getArchivos);
router.post('/:id/archivos', ctrl.uploadArchivos);


module.exports = router;
