import Categoria from '../models/categoria.js';

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({});
        res.status(200).json({
            success: true,
            data: categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            error: error.message
        });
    }
};

// Obtener una categoría por ID
export const getCategoriaById = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            error: error.message
        });
    }
};

// Crear nueva categoría
export const createCategoria = async (req, res) => {
    try {
        const nuevaCategoria = new Categoria(req.body);
        const categoriaGuardada = await nuevaCategoria.save();
        
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: categoriaGuardada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};

// Actualizar categoría
export const updateCategoria = async (req, res) => {
    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!categoriaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: categoriaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar categoría',
            error: error.message
        });
    }
};

// Eliminar categoría
export const deleteCategoria = async (req, res) => {
    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
        
        if (!categoriaEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría',
            error: error.message
        });
    }
}; 