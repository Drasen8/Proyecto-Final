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
    // 1) Crear expediente con el body del formulario
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

// POST /expedientes/:id/next
exports.nextEstado = async (req, res) => {
  const id = req.params.id;
  console.log('nextEstado para expediente:', id);
  try {
    const nuevo = await expedienteModel.nextEstado(id);
    console.log(`exp ${id} pasó a estado ${nuevo}`);
    res.json({ nuevoEstado: nuevo });
  } catch (err) {
    console.error('Error en nextEstado:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getExpedienteById = async (req, res) => {
  const id = req.params.id;
  try {
    const expediente = await expedienteModel.getExpedienteById(id);
    if (!expediente) {
      return res.status(404).json({ error: 'No existe ese expediente.' });
    }
    return res.json(expediente);
  } catch (err) {
    console.error('Error en getExpedienteById:', err);
    return res.status(500).json({ error: 'Error interno al leer expediente.' });
  }
};

exports.setPrecioPerito = async (req, res) => {
  const id = req.params.id;
  const { precio_perito } = req.body;

  // Validación mínima
  if (typeof precio_perito !== 'number' && isNaN(Number(precio_perito))) {
    return res.status(400).json({ error: 'El precio debe ser un número válido.' });
  }

  try {
    await expedienteModel.updatePrecioPerito(id, precio_perito);
    // Devolvemos un OK y el valor actualizado
    return res.json({ id_expediente: id, precio_perito });
  } catch (err) {
    console.error('Error actualizando precio_perito:', err);
    return res.status(500).json({ error: 'Error interno al guardar el precio.' });
  }
};