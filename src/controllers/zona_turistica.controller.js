import ZonaTuristica from '../models/zona_turistica.js';

// Obtener todas las zonas turísticas con información completa
export const getZonasTuristicas = async (req, res) => {
    try {
        const { categoria, ubicacion, precio_min, precio_max, activo } = req.query;
        
        let filtro = {};
        
        // Filtros opcionales
        if (categoria) filtro.categoria = categoria;
        if (ubicacion) filtro.ubicacion = ubicacion;
        if (activo !== undefined) filtro.activo = activo === 'true';
        if (precio_min || precio_max) {
            filtro.precio = {};
            if (precio_min) filtro.precio.$gte = parseFloat(precio_min);
            if (precio_max) filtro.precio.$lte = parseFloat(precio_max);
        }
        
        const zonasTuristicas = await ZonaTuristica.find(filtro)
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            data: zonasTuristicas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener zonas turísticas',
            error: error.message
        });
    }
};

// Obtener una zona turística por ID con información completa
export const getZonaTuristicaById = async (req, res) => {
    try {
        const zonaTuristica = await ZonaTuristica.findById(req.params.id);
            
        if (!zonaTuristica) {
            return res.status(404).json({
                success: false,
                message: 'Zona turística no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            data: zonaTuristica
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener zona turística',
            error: error.message
        });
    }
};

// Crear nueva zona turística
export const createZonaTuristica = async (req, res) => {
    try {

        
        const nuevaZonaTuristica = new ZonaTuristica(req.body);
        const zonaTuristicaGuardada = await nuevaZonaTuristica.save();
        
        // Obtener la zona turística creada
        const zonaTuristicaCompleta = await ZonaTuristica.findById(zonaTuristicaGuardada._id);
        
        res.status(201).json({
            success: true,
            message: 'Zona turística creada exitosamente',
            data: zonaTuristicaCompleta
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear zona turística',
            error: error.message
        });
    }
};

// Actualizar zona turística
export const updateZonaTuristica = async (req, res) => {
    try {
        // Verificar que la zona turística existe
        const zonaExistente = await ZonaTuristica.findById(req.params.id);
        if (!zonaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Zona turística no encontrada'
            });
        }
        

        
        const zonaTuristicaActualizada = await ZonaTuristica.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Zona turística actualizada exitosamente',
            data: zonaTuristicaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar zona turística',
            error: error.message
        });
    }
};

// Eliminar zona turística (soft delete)
export const deleteZonaTuristica = async (req, res) => {
    try {
        const zonaTuristicaEliminada = await ZonaTuristica.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        );
        
        if (!zonaTuristicaEliminada) {
            return res.status(404).json({
                success: false,
                message: 'Zona turística no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Zona turística desactivada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar zona turística',
            error: error.message
        });
    }
};

// Calificar zona turística
export const calificarZonaTuristica = async (req, res) => {
    try {
        const { calificacion } = req.body;
        
        if (!calificacion || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({
                success: false,
                message: 'La calificación debe estar entre 1 y 5'
            });
        }
        
        const zonaTuristica = await ZonaTuristica.findById(req.params.id);
        if (!zonaTuristica) {
            return res.status(404).json({
                success: false,
                message: 'Zona turística no encontrada'
            });
        }
        
        // Calcular nueva calificación promedio
        const nuevaCalificacion = ((zonaTuristica.calificacion * zonaTuristica.numCalificaciones) + calificacion) / 
                                 (zonaTuristica.numCalificaciones + 1);
        
        zonaTuristica.calificacion = nuevaCalificacion;
        zonaTuristica.numCalificaciones += 1;
        
        await zonaTuristica.save();
        
        res.status(200).json({
            success: true,
            message: 'Calificación agregada exitosamente',
            data: {
                calificacion: zonaTuristica.calificacion,
                numCalificaciones: zonaTuristica.numCalificaciones
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al calificar zona turística',
            error: error.message
        });
    }
};
