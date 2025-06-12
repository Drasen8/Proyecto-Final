const userModel = require('../models/userModel');

exports.loginUser = async (req, res) => {
  const { nombre, contraseña } = req.body;
  
  try {
    const user = await userModel.getUserByNombreYContraseña(nombre, contraseña);

    if (!user) {
        // Si el usuario no existe, redirige a la misma página
        return res.redirect('/login?error=true');
  
    }else{
     // Guardar el usuario en la sesión
     console.log(user.id_usuario);
     req.session.user = {
      id: user.id_usuario,
      nombre: user.nombre
    };
  };
    // Redirigir a la página principal
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
  }
  
};

exports.signUpUser = async (req, res) => {
  const { nombre, contraseña, email, tipo, codigo } = req.body;

  try {
    // Si ocurre un error (ej: violación de clave única), caerá en el catch automáticamente
    await userModel.getRegistrarUser(nombre, contraseña, email, tipo, codigo);
  
    // Si todo va bien, redirige a login
    return res.redirect('/login');
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
  
    // Redirige con el mensaje de error visible para el usuario
    return res.redirect('/singUp?error=true');
  }
};

exports.obtenerTipoUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    const tipo = await userModel.getTipoPorId(id);
    // Devolvemos solo el tipo en JSON
    res.json({ tipo });
  } catch (error) {
    console.error('Error en obtenerTipoUsuario:', error);
    res.status(500).json({ error: 'Error al obtener tipo de usuario' });
  }
};

exports.obtenerActiva = async (req, res) => {
  // Asegúrate de que el usuario esté en sesión:
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  try {
    const activa = await userModel.getActivaPorId(req.session.user.id);
    // Si no es aseguradora, devolvemos null
    res.json({ activa });
  } catch (err) {
    console.error('Error al obtener campo activa:', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
};


exports.misAseguradoras = async (req, res) => {
  try {
    // Opcional: podrías filtrar por usuario en sesión
    // const userId = req.session.user.id;
    // const data = await aseguradoraModel.getAseguradorasByUserId(userId);

    const data = await userModel.getAllAseguradoras();
    res.json(data);
  } catch (err) {
    console.error('Error obteniendo aseguradoras:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.actualizarActiva = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // espera un body JSON { activa: 0|1 }
    const { activa } = req.body;

    if (![0, 1].includes(activa)) {
      return res.status(400).json({ error: 'Valor de activa inválido' });
    }

    const updated = await userModel.updateActiva(id, activa);
    if (updated === 0) {
      return res.status(404).json({ error: 'Aseguradora no encontrada' });
    }

    res.json({ ok: true, id_aseguradora: id, activa });
  } catch (err) {
    console.error('Error al actualizar activa:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


