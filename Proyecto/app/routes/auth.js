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

module.exports = router;
