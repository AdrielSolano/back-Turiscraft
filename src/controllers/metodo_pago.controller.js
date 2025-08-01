import MetodoPago from '../models/metodo_pago.js';

// Obtener todos los métodos de pago
export const getMetodosPago = async (req, res) => {
    try {
        const metodosPago = await MetodoPago.find({});
        res.status(200).json({
            success: true,
            data: metodosPago
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener métodos de pago',
            error: error.message
        });
    }
};

// Obtener un método de pago por ID
export const getMetodoPagoById = async (req, res) => {
    try {
        const metodoPago = await MetodoPago.findById(req.params.id);
        if (!metodoPago) {
            return res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: metodoPago
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener método de pago',
            error: error.message
        });
    }
};

// Crear nuevo método de pago
export const createMetodoPago = async (req, res) => {
    try {
        const nuevoMetodoPago = new MetodoPago(req.body);
        const metodoPagoGuardado = await nuevoMetodoPago.save();
        
        res.status(201).json({
            success: true,
            message: 'Método de pago creado exitosamente',
            data: metodoPagoGuardado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear método de pago',
            error: error.message
        });
    }
};

// Actualizar método de pago
export const updateMetodoPago = async (req, res) => {
    try {
        const metodoPagoActualizado = await MetodoPago.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!metodoPagoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Método de pago actualizado exitosamente',
            data: metodoPagoActualizado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar método de pago',
            error: error.message
        });
    }
};

// Eliminar método de pago
export const deleteMetodoPago = async (req, res) => {
    try {
        const metodoPagoEliminado = await MetodoPago.findByIdAndDelete(req.params.id);
        
        if (!metodoPagoEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Método de pago eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar método de pago',
            error: error.message
        });
    }
}; 