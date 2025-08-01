import Reserva from '../models/reservas.js';
import ZonaTuristica from '../models/zona_turistica.js';
import Usuario from '../models/usuario.js';

// Obtener todas las reservas con información completa
export const getReservas = async (req, res) => {
    try {
        const { usuario, zona_turistica, estado, fecha_desde, fecha_hasta } = req.query;
        
        let filtro = {};
        
        // Filtros opcionales
        if (usuario) filtro.id_usuario = usuario;
        if (zona_turistica) filtro.id_ubicación = zona_turistica;
        if (estado) filtro.estado = estado;
        if (fecha_desde || fecha_hasta) {
            filtro.fecha_inicio = {};
            if (fecha_desde) filtro.fecha_inicio.$gte = new Date(fecha_desde);
            if (fecha_hasta) filtro.fecha_inicio.$lte = new Date(fecha_hasta);
        }
        
        const reservas = await Reserva.find(filtro)
            .populate('id_usuario', 'nombre apellido_paterno apellido_materno email')
            .populate({
                path: 'id_ubicación',
                select: 'nombre descripción imagen_principal',
                populate: [
                    { path: 'id_ubicación', select: 'país ciudad' },
                    { path: 'id_categoria', select: 'nombre descripción' }
                ]
            })
            .sort({ create_at: -1 });
            
        res.status(200).json({
            success: true,
            data: reservas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener reservas',
            error: error.message
        });
    }
};

// Obtener reservas de un usuario específico
export const getReservasByUser = async (req, res) => {
    try {
        const reservas = await Reserva.find({ id_usuario: req.params.userId })
            .populate('id_ubicación', 'nombre descripción imagen_principal')
            .populate({
                path: 'id_ubicación',
                populate: [
                    { path: 'id_ubicación', select: 'país ciudad' },
                    { path: 'id_categoria', select: 'nombre descripción' }
                ]
            })
            .sort({ create_at: -1 });
            
        res.status(200).json({
            success: true,
            data: reservas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener reservas del usuario',
            error: error.message
        });
    }
};

// Obtener una reserva por ID
export const getReservaById = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id)
            .populate('id_usuario', 'nombre apellido_paterno apellido_materno email')
            .populate({
                path: 'id_ubicación',
                select: 'nombre descripción imagen_principal',
                populate: [
                    { path: 'id_ubicación', select: 'país ciudad código_postal' },
                    { path: 'id_categoria', select: 'nombre descripción' }
                ]
            });
            
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            data: reserva
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener reserva',
            error: error.message
        });
    }
};

// Crear nueva reserva
export const createReserva = async (req, res) => {
    try {
        // Verificar que el usuario existe
        const usuario = await Usuario.findById(req.body.id_usuario);
        if (!usuario) {
            return res.status(400).json({
                success: false,
                message: 'El usuario especificado no existe'
            });
        }
        
        // Verificar que la zona turística existe y está activa
        const zonaTuristica = await ZonaTuristica.findById(req.body.id_ubicación);
        if (!zonaTuristica) {
            return res.status(400).json({
                success: false,
                message: 'La zona turística especificada no existe'
            });
        }
        
        if (!zonaTuristica.estatus) {
            return res.status(400).json({
                success: false,
                message: 'La zona turística no está disponible'
            });
        }
        
        // Verificar que la fecha no sea en el pasado
        const fechaInicio = new Date(req.body.fecha_inicio);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaInicio < hoy) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de inicio no puede ser en el pasado'
            });
        }
        
        // Crear la reserva
        const nuevaReserva = new Reserva(req.body);
        
        const reservaGuardada = await nuevaReserva.save();
        
        // Poblar la información antes de devolver
        const reservaCompleta = await Reserva.findById(reservaGuardada._id)
            .populate('id_usuario', 'nombre apellido_paterno apellido_materno email')
            .populate({
                path: 'id_ubicación',
                select: 'nombre descripción imagen_principal',
                populate: [
                    { path: 'id_ubicación', select: 'país ciudad' },
                    { path: 'id_categoria', select: 'nombre descripción' }
                ]
            });
        
        res.status(201).json({
            success: true,
            message: 'Reserva creada exitosamente',
            data: reservaCompleta
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear reserva',
            error: error.message
        });
    }
};

// Actualizar reserva
export const updateReserva = async (req, res) => {
    try {
        const reservaExistente = await Reserva.findById(req.params.id);
        if (!reservaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        // No permitir actualizar reservas canceladas o completadas
        if (reservaExistente.estado === 'cancelada' || reservaExistente.estado === 'completada') {
            return res.status(400).json({
                success: false,
                message: 'No se puede actualizar una reserva cancelada o completada'
            });
        }
        
        // Si se está actualizando la zona turística, verificar que existe y está activa
        if (req.body.id_zona_turistica) {
            const zonaTuristica = await ZonaTuristica.findById(req.body.id_zona_turistica);
            if (!zonaTuristica || !zonaTuristica.activo) {
                return res.status(400).json({
                    success: false,
                    message: 'La zona turística especificada no existe o no está disponible'
                });
            }
        }
        
        // Si se está actualizando el número de personas, recalcular precio
        if (req.body.numero_personas) {
            const zonaTuristica = await ZonaTuristica.findById(
                req.body.id_zona_turistica || reservaExistente.id_zona_turistica
            );
            req.body.precio_total = zonaTuristica.precio * req.body.numero_personas;
        }
        
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('id_usuario', 'username email')
         .populate({
             path: 'id_zona_turistica',
             select: 'nombre descripcion precio duracion',
             populate: [
                 { path: 'id_ubicacion', select: 'nombre direccion ciudad estado' },
                 { path: 'id_categoria', select: 'nombre descripcion' }
             ]
         });
        
        res.status(200).json({
            success: true,
            message: 'Reserva actualizada exitosamente',
            data: reservaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar reserva',
            error: error.message
        });
    }
};

// Cancelar reserva
export const cancelarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        if (reserva.estado === 'cancelada') {
            return res.status(400).json({
                success: false,
                message: 'La reserva ya está cancelada'
            });
        }
        
        if (reserva.estado === 'completada') {
            return res.status(400).json({
                success: false,
                message: 'No se puede cancelar una reserva completada'
            });
        }
        
        reserva.estado = 'cancelada';
        await reserva.save();
        
        res.status(200).json({
            success: true,
            message: 'Reserva cancelada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cancelar reserva',
            error: error.message
        });
    }
};

// Calificar reserva
export const calificarReserva = async (req, res) => {
    try {
        const { calificacion, comentario } = req.body;
        
        if (!calificacion || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({
                success: false,
                message: 'La calificación debe estar entre 1 y 5'
            });
        }
        
        const reserva = await Reserva.findById(req.params.id);
        if (!reserva) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        
        if (reserva.estado !== 'completada') {
            return res.status(400).json({
                success: false,
                message: 'Solo se pueden calificar reservas completadas'
            });
        }
        
        if (reserva.calificacion) {
            return res.status(400).json({
                success: false,
                message: 'Esta reserva ya ha sido calificada'
            });
        }
        
        reserva.calificacion = calificacion;
        reserva.comentario = comentario;
        reserva.fecha_calificacion = new Date();
        
        await reserva.save();
        
        // Actualizar calificación de la zona turística
        const zonaTuristica = await ZonaTuristica.findById(reserva.id_zona_turistica);
        const nuevaCalificacion = ((zonaTuristica.calificacion * zonaTuristica.numCalificaciones) + calificacion) / 
                                 (zonaTuristica.numCalificaciones + 1);
        
        zonaTuristica.calificacion = nuevaCalificacion;
        zonaTuristica.numCalificaciones += 1;
        await zonaTuristica.save();
        
        res.status(200).json({
            success: true,
            message: 'Calificación agregada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al calificar reserva',
            error: error.message
        });
    }
};
