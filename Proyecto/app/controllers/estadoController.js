const estadoModel = require('../models/estadoModel');

exports.verEstadoExpediente = async (req, res) => {
  // 1) Recupera el id_expediente de la cookie
  const idExp = req.cookies.id_expediente;
  if (!idExp) {
    return res.status(400).json({ error: 'No se especificó expediente' });
  }

  try {
    // 2) Llama al modelo para obtener el estado actual
    const estado = await estadoModel.getEstadoActualByExpediente(idExp);
    if (!estado) {
      return res.status(404).json({ error: 'Expediente o estado no encontrado' });
    }
    // 3) Devuelve JSON con el estado
    res.json(estado);
  } catch (err) {
    console.error('Error al cargar estado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
