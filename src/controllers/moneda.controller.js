import Moneda from '../models/moneda.js';

// Obtener todas las monedas
export const getMonedas = async (req, res) => {
    try {
        const monedas = await Moneda.find({});
        res.status(200).json({
            success: true,
            data: monedas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener monedas',
            error: error.message
        });
    }
};

// Obtener una moneda por ID
export const getMonedaById = async (req, res) => {
    try {
        const moneda = await Moneda.findById(req.params.id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: moneda
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener moneda',
            error: error.message
        });
    }
};

// Crear nueva moneda
export const createMoneda = async (req, res) => {
    try {
        const nuevaMoneda = new Moneda(req.body);
        const monedaGuardada = await nuevaMoneda.save();
        
        res.status(201).json({
            success: true,
            message: 'Moneda creada exitosamente',
            data: monedaGuardada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear moneda',
            error: error.message
        });
    }
};

// Actualizar moneda
export const updateMoneda = async (req, res) => {
    try {
        const monedaActualizada = await Moneda.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!monedaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Moneda actualizada exitosamente',
            data: monedaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar moneda',
            error: error.message
        });
    }
};

// Eliminar moneda
export const deleteMoneda = async (req, res) => {
    try {
        const monedaEliminada = await Moneda.findByIdAndDelete(req.params.id);
        
        if (!monedaEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Moneda eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar moneda',
            error: error.message
        });
    }
}; 