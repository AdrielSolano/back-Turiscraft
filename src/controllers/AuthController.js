import Usuario from "../models/usuario.js";
import TipoUsuario from "../models/tipo_usuario.js";
import bcrypt from "bcryptjs";
import { createdAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, nombre, apellido_paterno, apellido_materno, telefono, edad, id_ubicación, tipo_persona = 'usuario' } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
          return res.status(400).json({ 
      success: false,
      message: "Email is already registered" 
    });
    }

    // Buscar el tipo de usuario correspondiente
    const tipoUsuario = await TipoUsuario.findOne({ tipo_persona });
    if (!tipoUsuario) {
          return res.status(400).json({ 
      success: false,
      message: "Invalid user type" 
    });
    }

    const newUser = new Usuario({
      nombre,
      apellido_paterno,
      apellido_materno,
      email,
      password, // Agregar contraseña
      telefono,
      edad: parseInt(edad) || 0,
      id_ubicación,
      id_tipo: tipoUsuario._id,
    });
    
    const userSaved = await newUser.save();
    
    const token = await createdAccessToken({ 
      id: userSaved._id, 
      tipo_persona: tipoUsuario.tipo_persona 
    });

    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: userSaved._id,
        nombre: userSaved.nombre,
        apellido_paterno: userSaved.apellido_paterno,
        apellido_materno: userSaved.apellido_materno,
        email: userSaved.email,
        tipo_persona: tipoUsuario.tipo_persona,
        createdAt: userSaved.createdAt,
        updatedAt: userSaved.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error registering user",
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate that both fields are provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const userFound = await Usuario.findOne({ email }).populate('id_tipo');
    if (!userFound) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials, try again" 
      });
    }

    // Verify password (now required)
    if (userFound.password !== password) {
      return res.status(400).json({ 
        success: false,
        message: "Incorrect password" 
      });
    }

    const token = await createdAccessToken({ 
      id: userFound._id, 
      tipo_persona: userFound.id_tipo?.tipo_persona || 'usuario',
      isGuia: false
    });

    // Configurar cookie con opciones específicas
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true en producción con HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    console.log('Cookie configurada para usuario regular:', token.substring(0, 20) + '...');

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: userFound._id,
        nombre: userFound.nombre,
        apellido_paterno: userFound.apellido_paterno,
        apellido_materno: userFound.apellido_materno,
        email: userFound.email,
        telefono: userFound.telefono,
        edad: userFound.edad,
        tipo_persona: userFound.id_tipo?.tipo_persona || 'usuario',
        isGuia: false,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Login error",
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

export const profile = async (req, res) => {
  try {
    const userFound = await Usuario.findById(req.user.id).populate('id_tipo').populate('id_ubicación');
    
    if (!userFound) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }

    res.json({
      success: true,
      data: {
        id: userFound._id,
        nombre: userFound.nombre,
        apellido_paterno: userFound.apellido_paterno,
        apellido_materno: userFound.apellido_materno,
        email: userFound.email,
        telefono: userFound.telefono,
        edad: userFound.edad,
        ubicacion: userFound.id_ubicación?.nombre || '',
        tipo_persona: userFound.id_tipo?.tipo_persona || 'usuario',
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error al obtener el perfil",
      error: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, telefono, edad } = req.body;
    
    const userFound = await Usuario.findById(req.user.id);
    
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

    const updatedUser = await Usuario.findByIdAndUpdate(
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
        tipo_persona: updatedUser.id_tipo?.tipo_persona || 'usuario',
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
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

export const debugAuth = async (req, res) => {
  console.log('=== DEBUG AUTH ENDPOINT ===');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('User:', req.user);
  
  res.json({
    success: true,
    message: "Debug de autenticación",
    data: {
      headers: req.headers,
      cookies: req.cookies,
      user: req.user,
      hasToken: !!req.cookies?.token,
      tokenLength: req.cookies?.token?.length || 0
    }
  });
};

export const checkAuthStatus = async (req, res) => {
  console.log('=== CHECK AUTH STATUS ===');
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.cookies);
  console.log('Token presente:', !!req.cookies?.token);
  
  res.json({
    success: true,
    message: "Estado de autenticación verificado",
    data: {
      hasToken: !!req.cookies?.token,
      tokenLength: req.cookies?.token?.length || 0,
      cookies: req.cookies,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        'user-agent': req.headers['user-agent']
      }
    }
  });
};

