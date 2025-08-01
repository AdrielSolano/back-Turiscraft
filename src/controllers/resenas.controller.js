import Resena from '../models/resenas.js';

// Obtener todas las reseñas
export const getResenas = async (req, res) => {
    try {
        const resenas = await Resena.find({})
            .populate('usuario_id', 'nombre apellido_paterno')
            .populate('guia_id', 'nombre apellido_paterno')
            .sort({ create_at: -1 });

        res.json({
            success: true,
            data: resenas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener reseñas",
            error: error.message
        });
    }
};

// Obtener una reseña por ID
export const getResenaById = async (req, res) => {
    try {
        const resena = await Resena.findById(req.params.id)
            .populate('usuario_id', 'nombre apellido_paterno')
            .populate('guia_id', 'nombre apellido_paterno');

        if (!resena) {
            return res.status(404).json({
                success: false,
                message: "Reseña no encontrada"
            });
        }

        res.json({
            success: true,
            data: resena
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener reseña",
            error: error.message
        });
    }
};

// Crear una nueva reseña
export const createResena = async (req, res) => {
    try {
        const newResena = new Resena(req.body);
        const resenaSaved = await newResena.save();

        const resenaPopulated = await Resena.findById(resenaSaved._id)
            .populate('usuario_id', 'nombre apellido_paterno')
            .populate('guia_id', 'nombre apellido_paterno');

        res.status(201).json({
            success: true,
            message: "Reseña creada exitosamente",
            data: resenaPopulated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear reseña",
            error: error.message
        });
    }
};

// Actualizar una reseña
export const updateResena = async (req, res) => {
    try {
        const resenaUpdated = await Resena.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('usuario_id', 'nombre apellido_paterno')
         .populate('guia_id', 'nombre apellido_paterno');

        if (!resenaUpdated) {
            return res.status(404).json({
                success: false,
                message: "Reseña no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Reseña actualizada exitosamente",
            data: resenaUpdated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar reseña",
            error: error.message
        });
    }
};

// Eliminar una reseña
export const deleteResena = async (req, res) => {
    try {
        const resenaDeleted = await Resena.findByIdAndDelete(req.params.id);

        if (!resenaDeleted) {
            return res.status(404).json({
                success: false,
                message: "Reseña no encontrada"
            });
        }

        res.json({
            success: true,
            message: "Reseña eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar reseña",
            error: error.message
        });
    }
};

// Obtener reseñas por guía
export const getResenasByGuia = async (req, res) => {
    try {
        const resenas = await Resena.find({
            guia_id: req.params.guiaId
        })
        .populate('usuario_id', 'nombre apellido_paterno')
        .populate('guia_id', 'nombre apellido_paterno')
        .sort({ create_at: -1 });

        res.json({
            success: true,
            data: resenas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener reseñas por guía",
            error: error.message
        });
    }
}; 