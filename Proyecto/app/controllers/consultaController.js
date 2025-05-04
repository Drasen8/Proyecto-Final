const consultaModel = require('../models/consultaModel');

exports.buscarExpediente = async (req, res) => {
  const { numExpediente, dni, matricula } = req.body;

  try {
    const expediente = await consultaModel.getExpedienteByParams(
      numExpediente, dni, matricula
    );

    if (!expediente) {
      // Devuelve un 404 con mensaje de error en JSON
      return res.status(404).json({
        error: 'No se encontró ningún expediente con esos datos.'
      });
    }

    // Devuelve el expediente en JSON
    res.json(expediente);
  } catch (err) {
    console.error('Error al consultar expediente:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
