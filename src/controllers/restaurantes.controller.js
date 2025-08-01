import Restaurante from '../models/restaurantes.js';

// Obtener todos los restaurantes
export const getRestaurantes = async (req, res) => {
    try {
        const restaurantes = await Restaurante.find({});
        res.status(200).json({
            success: true,
            data: restaurantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener restaurantes',
            error: error.message
        });
    }
};

// Obtener un restaurante por ID
export const getRestauranteById = async (req, res) => {
    try {
        const restaurante = await Restaurante.findById(req.params.id);
        if (!restaurante) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: restaurante
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener restaurante',
            error: error.message
        });
    }
};

// Crear nuevo restaurante
export const createRestaurante = async (req, res) => {
    try {
        const nuevoRestaurante = new Restaurante(req.body);
        const restauranteGuardado = await nuevoRestaurante.save();
        
        res.status(201).json({
            success: true,
            message: 'Restaurante creado exitosamente',
            data: restauranteGuardado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear restaurante',
            error: error.message
        });
    }
};

// Actualizar restaurante
export const updateRestaurante = async (req, res) => {
    try {
        const restauranteActualizado = await Restaurante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!restauranteActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Restaurante actualizado exitosamente',
            data: restauranteActualizado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar restaurante',
            error: error.message
        });
    }
};

// Eliminar restaurante
export const deleteRestaurante = async (req, res) => {
    try {
        const restauranteEliminado = await Restaurante.findByIdAndDelete(req.params.id);
        
        if (!restauranteEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Restaurante eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar restaurante',
            error: error.message
        });
    }
}; 