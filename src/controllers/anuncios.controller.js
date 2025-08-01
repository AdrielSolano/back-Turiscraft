import Anuncio from '../models/anuncios.js';

// Obtener todos los anuncios
export const getAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.find({})
            .sort({ create_at: -1 });

        res.json({
            success: true,
            data: anuncios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener anuncios",
            error: error.message
        });
    }
};

// Obtener un anuncio por ID
export const getAnuncioById = async (req, res) => {
    try {
        const anuncio = await Anuncio.findById(req.params.id);

        if (!anuncio) {
            return res.status(404).json({
                success: false,
                message: "Anuncio no encontrado"
            });
        }

        res.json({
            success: true,
            data: anuncio
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener anuncio",
            error: error.message
        });
    }
};

// Crear un nuevo anuncio
export const createAnuncio = async (req, res) => {
    try {
        const newAnuncio = new Anuncio(req.body);
        const anuncioSaved = await newAnuncio.save();

        res.status(201).json({
            success: true,
            message: "Anuncio creado exitosamente",
            data: anuncioSaved
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear anuncio",
            error: error.message
        });
    }
};

// Actualizar un anuncio
export const updateAnuncio = async (req, res) => {
    try {
        const anuncioUpdated = await Anuncio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!anuncioUpdated) {
            return res.status(404).json({
                success: false,
                message: "Anuncio no encontrado"
            });
        }

        res.json({
            success: true,
            message: "Anuncio actualizado exitosamente",
            data: anuncioUpdated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar anuncio",
            error: error.message
        });
    }
};

// Eliminar un anuncio
export const deleteAnuncio = async (req, res) => {
    try {
        const anuncioDeleted = await Anuncio.findByIdAndDelete(req.params.id);

        if (!anuncioDeleted) {
            return res.status(404).json({
                success: false,
                message: "Anuncio no encontrado"
            });
        }

        res.json({
            success: true,
            message: "Anuncio eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar anuncio",
            error: error.message
        });
    }
};

 