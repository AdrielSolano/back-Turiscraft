import Usuario from "../models/usuario.js";
import Guia from "../models/guia.js";
import TipoUsuario from "../models/tipo_usuario.js";
import { createdAccessToken } from "../libs/jwt.js";
import Login from "../models/login.js";

export const smartRegister = async (req, res) => {
  const { 
    email, 
    password,
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    telefono, 
    edad, 
    id_ubicación, 
    tipo_persona = 'usuario',
    // Campos específicos de guía
    descripción,
    tarifa_hora,
    certificado_id,
    zona_turistica_id
  } = req.body;

  try {
    // Verificar si el email ya existe (tanto en usuarios como en guías)
    const existingUser = await Usuario.findOne({ email });
    const existingGuia = await Guia.findOne({ email });
    
    if (existingUser || existingGuia) {
      return res.status(400).json({ 
        success: false,
        message: "El email ya está registrado" 
      });
    }

    // Buscar el tipo de usuario correspondiente
    let tipoUsuario = await TipoUsuario.findOne({ tipo_persona });
    
    // Si no existe el tipo de usuario, crearlo
    if (!tipoUsuario) {
      if (tipo_persona === 'guia') {
        tipoUsuario = await TipoUsuario.create({
          id_tipo: "GUI001",
          nombre_tipo: "Guía Turístico",
          descripción: "Guía turístico certificado",
          tipo_persona: "guia",
          estatus: true
        });
      } else {
        tipoUsuario = await TipoUsuario.create({
          id_tipo: "USR001",
          nombre_tipo: "Usuario Regular",
          descripción: "Usuario regular de la plataforma",
          tipo_persona: "usuario",
          estatus: true
        });
      }
    }

    let savedRecord;
    let token;

    if (tipo_persona === 'guia') {
      // Registrar como guía
      const newGuia = new Guia({
        id_usuario: `GUI${Date.now()}`, // Generar ID único
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        password,
        telefono,
        edad: parseInt(edad) || 0,
        id_ubicación,
        id_tipo: tipoUsuario._id,
        estatus: true,
        // Campos específicos de guía
        descripción: descripción || "",
        tarifa_hora: tarifa_hora || 0,
        certificado_id,
        zona_turistica_id,
        disponibilidad: true,
        calificación: 0
      });
      
      savedRecord = await newGuia.save();
      
      token = await createdAccessToken({ 
        id: savedRecord._id, 
        tipo_persona: 'guia',
        isGuia: true
      });

    } else {
      // Registrar como usuario normal
      const newUser = new Usuario({
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        telefono,
        edad: parseInt(edad) || 0,
        id_ubicación,
        id_tipo: tipoUsuario._id,
        estatus: true
      });
      
      savedRecord = await newUser.save();
      
      token = await createdAccessToken({ 
        id: savedRecord._id, 
        tipo_persona: 'usuario',
        isGuia: false
      });
    }

    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: `${tipo_persona === 'guia' ? 'Guía' : 'Usuario'} registrado exitosamente`,
      data: {
        id: savedRecord._id,
        nombre: savedRecord.nombre,
        apellido_paterno: savedRecord.apellido_paterno,
        apellido_materno: savedRecord.apellido_materno,
        email: savedRecord.email,
        telefono: savedRecord.telefono,
        edad: savedRecord.edad,
        tipo_persona: tipo_persona,
        isGuia: tipo_persona === 'guia',
        // Campos específicos si es guía
        ...(tipo_persona === 'guia' && {
          descripción: savedRecord.descripción,
          tarifa_hora: savedRecord.tarifa_hora,
          certificado_id: savedRecord.certificado_id,
          zona_turistica_id: savedRecord.zona_turistica_id,
          disponibilidad: savedRecord.disponibilidad,
          calificación: savedRecord.calificación
        }),
        createdAt: savedRecord.createdAt || savedRecord.create_at,
        updatedAt: savedRecord.updatedAt || savedRecord.update_at,
      }
    });
  } catch (error) {
    console.error('Error en smartRegister:', error);
    res.status(500).json({ 
      success: false,
      message: "Error en el registro",
      error: error.message 
    });
  }
};

export const smartLogin = async (req, res) => {
  console.log("Entró a smartLogin", req.body);
  const { email, password } = req.body;

  try {
    let userFound = await Usuario.findOne({ email }).populate('id_tipo');
    let isGuia = false;
    let tipo_persona = 'usuario';

    if (!userFound) {
      userFound = await Guia.findOne({ email }).populate('id_tipo');
      isGuia = true;
      tipo_persona = 'guia';
    }

    // Registrar el intento de login con try/catch
    try {
      await Login.create({
        email,
        tipo_persona: userFound ? tipo_persona : 'desconocido',
        exito: !!userFound
      });
      console.log("Intento de login registrado:", email);
    } catch (err) {
      console.error("Error al registrar login:", err);
    }

    if (!userFound) {
      return res.status(400).json({ 
        success: false,
        message: "Credenciales inválidas, intenta de nuevo" 
      });
    }

    // Verificar contraseña si es guía
    if (isGuia && password && userFound.password !== password) {
      return res.status(400).json({ 
        success: false,
        message: "Contraseña incorrecta" 
      });
    }

    const token = await createdAccessToken({ 
      id: userFound._id, 
      tipo_persona: userFound.id_tipo?.tipo_persona || (isGuia ? 'guia' : 'usuario'),
      isGuia
    });

    // Configurar cookie con opciones específicas
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true en producción con HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    console.log('Cookie configurada:', token.substring(0, 20) + '...');

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        id: userFound._id,
        nombre: userFound.nombre,
        apellido_paterno: userFound.apellido_paterno,
        apellido_materno: userFound.apellido_materno,
        email: userFound.email,
        telefono: userFound.telefono,
        edad: userFound.edad,
        tipo_persona: userFound.id_tipo?.tipo_persona || (isGuia ? 'guia' : 'usuario'),
        isGuia,
        // Campos específicos si es guía
        ...(isGuia && {
          descripción: userFound.descripción,
          tarifa_hora: userFound.tarifa_hora,
          certificado_id: userFound.certificado_id,
          zona_turistica_id: userFound.zona_turistica_id,
          disponibilidad: userFound.disponibilidad,
          calificación: userFound.calificación
        }),
        createdAt: userFound.createdAt || userFound.create_at,
        updatedAt: userFound.updatedAt || userFound.update_at,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error en el login",
      error: error.message 
    });
  }
};

export const smartProfile = async (req, res) => {
  try {
    let userFound;
    let isGuia = false;

    // Buscar en usuarios primero
    userFound = await Usuario.findById(req.user.id).populate('id_tipo');
    
    if (!userFound) {
      // Si no está en usuarios, buscar en guías
      userFound = await Guia.findById(req.user.id).populate('id_tipo');
      isGuia = true;
    }

    if (!userFound) {
      return res.status(400).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    return res.json({
      success: true,
      data: {
        id: userFound._id,
        nombre: userFound.nombre,
        apellido_paterno: userFound.apellido_paterno,
        apellido_materno: userFound.apellido_materno,
        email: userFound.email,
        telefono: userFound.telefono,
        edad: userFound.edad,
        tipo_persona: userFound.id_tipo?.tipo_persona || (isGuia ? 'guia' : 'usuario'),
        isGuia,
        // Campos específicos si es guía
        ...(isGuia && {
          descripción: userFound.descripción,
          tarifa_hora: userFound.tarifa_hora,
          certificado_id: userFound.certificado_id,
          zona_turistica_id: userFound.zona_turistica_id,
          disponibilidad: userFound.disponibilidad,
          calificación: userFound.calificación
        }),
        createdAt: userFound.createdAt || userFound.create_at,
        updatedAt: userFound.updatedAt || userFound.update_at,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al obtener perfil",
      error: error.message 
    });
  }
};

export const updateSmartProfile = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, telefono, edad, descripción, tarifa_hora, disponibilidad } = req.body;
    
    let userFound = await Usuario.findById(req.user.id);
    let isGuia = false;
    
    if (!userFound) {
      userFound = await Guia.findById(req.user.id);
      isGuia = true;
    }
    
    if (!userFound) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    // Actualizar los campos permitidos
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellido_paterno !== undefined) updateData.apellido_paterno = apellido_paterno;
    if (apellido_materno !== undefined) updateData.apellido_materno = apellido_materno;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (edad !== undefined) updateData.edad = parseInt(edad) || 0;

    // Campos específicos de guía
    if (isGuia) {
      if (descripción !== undefined) updateData.descripción = descripción;
      if (tarifa_hora !== undefined) updateData.tarifa_hora = parseFloat(tarifa_hora) || 0;
      if (disponibilidad !== undefined) updateData.disponibilidad = disponibilidad;
    }

    const updatedUser = await (isGuia ? Guia : Usuario).findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('id_tipo').populate('id_ubicación');

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: {
        id: updatedUser._id,
        nombre: updatedUser.nombre,
        apellido_paterno: updatedUser.apellido_paterno,
        apellido_materno: updatedUser.apellido_materno,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        edad: updatedUser.edad,
        ubicacion: updatedUser.id_ubicación?.nombre || '',
        tipo_persona: updatedUser.id_tipo?.tipo_persona || (isGuia ? 'guia' : 'usuario'),
        isGuia,
        // Campos específicos si es guía
        ...(isGuia && {
          descripción: updatedUser.descripción,
          tarifa_hora: updatedUser.tarifa_hora,
          certificado_id: updatedUser.certificado_id,
          zona_turistica_id: updatedUser.zona_turistica_id,
          disponibilidad: updatedUser.disponibilidad,
          calificación: updatedUser.calificación
        }),
        createdAt: updatedUser.createdAt || updatedUser.create_at,
        updatedAt: updatedUser.updatedAt || updatedUser.update_at,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar el perfil",
      error: error.message 
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.json({
    success: true,
    message: "Logout exitoso"
  });
}; 

export const listUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}).select('nombre email tipo_persona');
    const guias = await Guia.find({}).select('nombre email tipo_persona isGuia');
    
    res.json({
      success: true,
      data: {
        usuarios: usuarios.map(u => ({
          id: u._id,
          nombre: u.nombre,
          email: u.email,
          tipo: 'usuario'
        })),
        guias: guias.map(g => ({
          id: g._id,
          nombre: g.nombre,
          email: g.email,
          tipo: 'guia',
          isGuia: true
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al listar usuarios",
      error: error.message 
    });
  }
}; 

export const debugSmartAuth = async (req, res) => {
  console.log('=== DEBUG SMART AUTH ENDPOINT ===');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('User:', req.user);
  
  res.json({
    success: true,
    message: "Debug de smart autenticación",
    data: {
      headers: req.headers,
      cookies: req.cookies,
      user: req.user,
      hasToken: !!req.cookies?.token,
      tokenLength: req.cookies?.token?.length || 0
    }
  });
}; 