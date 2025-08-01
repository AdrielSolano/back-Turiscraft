import Certificacion from '../models/certificaciones.js';

// Obtener todas las certificaciones
export const getCertificaciones = async (req, res) => {
    try {
        const certificaciones = await Certificacion.find({})
            .populate('usuario_id', 'nombre apellido_paterno')
            .sort({ create_at: -1 });
        res.status(200).json({
            success: true,
            data: certificaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener certificaciones',
            error: error.message
        });
    }
};

// Obtener una certificación por ID
export const getCertificacionById = async (req, res) => {
    try {
        const certificacion = await Certificacion.findById(req.params.id)
            .populate('usuario_id', 'nombre apellido_paterno');
        if (!certificacion) {
            return res.status(404).json({
                success: false,
                message: 'Certificación no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: certificacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener certificación',
            error: error.message
        });
    }
};

// Crear nueva certificación
export const createCertificacion = async (req, res) => {
    try {
        const nuevaCertificacion = new Certificacion(req.body);
        const certificacionGuardada = await nuevaCertificacion.save();
        
        const certificacionPopulated = await Certificacion.findById(certificacionGuardada._id)
            .populate('usuario_id', 'nombre apellido_paterno');
        
        res.status(201).json({
            success: true,
            message: 'Certificación creada exitosamente',
            data: certificacionPopulated
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear certificación',
            error: error.message
        });
    }
};

// Actualizar certificación
export const updateCertificacion = async (req, res) => {
    try {
        const certificacionActualizada = await Certificacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('usuario_id', 'nombre apellido_paterno');
        
        if (!certificacionActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Certificación no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Certificación actualizada exitosamente',
            data: certificacionActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar certificación',
            error: error.message
        });
    }
};

// Eliminar certificación
export const deleteCertificacion = async (req, res) => {
    try {
        const certificacionEliminada = await Certificacion.findByIdAndDelete(req.params.id);
        
        if (!certificacionEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Certificación no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Certificación eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar certificación',
            error: error.message
        });
    }
}; 