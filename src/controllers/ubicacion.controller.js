import Ubicacion from '../models/ubicacion.js';

// Obtener todas las ubicaciones
export const getUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find({});
        res.status(200).json({
            success: true,
            data: ubicaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener ubicaciones',
            error: error.message
        });
    }
};

// Obtener una ubicación por ID
export const getUbicacionById = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.findById(req.params.id);
        if (!ubicacion) {
            return res.status(404).json({
                success: false,
                message: 'Ubicación no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: ubicacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener ubicación',
            error: error.message
        });
    }
};

// Crear nueva ubicación
export const createUbicacion = async (req, res) => {
    try {
        const nuevaUbicacion = new Ubicacion(req.body);
        const ubicacionGuardada = await nuevaUbicacion.save();
        
        res.status(201).json({
            success: true,
            message: 'Ubicación creada exitosamente',
            data: ubicacionGuardada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear ubicación',
            error: error.message
        });
    }
};

// Actualizar ubicación
export const updateUbicacion = async (req, res) => {
    try {
        const ubicacionActualizada = await Ubicacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!ubicacionActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Ubicación no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Ubicación actualizada exitosamente',
            data: ubicacionActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar ubicación',
            error: error.message
        });
    }
};

// Eliminar ubicación
export const deleteUbicacion = async (req, res) => {
    try {
        const ubicacionEliminada = await Ubicacion.findByIdAndDelete(req.params.id);
        
        if (!ubicacionEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Ubicación no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Ubicación eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar ubicación',
            error: error.message
        });
    }
}; 