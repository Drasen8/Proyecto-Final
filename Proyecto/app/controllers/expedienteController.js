const expedienteModel = require('../models/expedienteModel');

exports.getExpedientesUsuario = async (req, res) => {
  const nombreUsuario = req.session.user?.nombre;
  if (!nombreUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  try {
    const expedientes = await expedienteModel.getExpedientesPorUsuario(nombreUsuario);
    res.json(expedientes);
  } catch (err) {
    console.error('Error al leer expedientes:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createExpediente = async (req, res) => {
  const idUsuario = req.session.user?.id;
  if (!idUsuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  try {
    // 1) Crear expediente "vacío"
    const nuevo = await expedienteModel.createExpediente(req.body);
    // 2) Asociar al usuario
    await expedienteModel.associateUsuarioExpediente(idUsuario, nuevo.id_expediente);
    // 3) Estado inicial = 1
    await expedienteModel.insertEstadoInicial(nuevo.id_expediente, 1);
    // 4) Devolver el objeto con id
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('Error al crear expediente:', err);
    res.status(500).json({ error: 'No se pudo crear expediente' });
  }
};
