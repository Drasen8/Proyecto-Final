const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('inicio', { usuario: req.session.user });
});

module.exports = router;