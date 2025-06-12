// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Página de login
router.get('/iniciasesion', (req, res) => {
  res.render('iniciasesion'); // Renderiza el formulario
});

router.get('/registro', (req, res) => {
  res.render('registro'); // Renderiza el formulario
});

// Procesar login
router.post('/login', authController.loginUser);

router.post('/singUp', authController.signUpUser);

// Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir sesión:', err);
      return res.status(500).json({ error: 'No se pudo cerrar sesión' });
    }
    // Opcional: limpia la cookie de sesión
    res.clearCookie('connect.sid', { path: '/' });
    res.sendStatus(200);
  });
});

router.get('/api/usuario/:id/tipo', authController.obtenerTipoUsuario);

router.get('/api/aseguradora/activa', authController.obtenerActiva);

router.get('/mis-aseguradoras', authController.misAseguradoras);

router.post('/aseguradoras/:id/activa',authController.actualizarActiva);


module.exports = router;
