const expedienteModel = require('../models/expedienteModel');

exports.getExpedientesUsuario = async (req, res) => {
  const nombreUsuario = req.session?.user?.nombre;
  if (!nombreUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const expedientes = await expedienteModel.getExpedientesPorUsuario(nombreUsuario);
    // Aquí puedes:
    //  • Devolver JSON: res.json(expedientes);
    //  • O renderizar una vista EJS pasándole expedientes
    res.json(expedientes);
  } catch (err) {
    console.error('Error al cargar expedientes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
