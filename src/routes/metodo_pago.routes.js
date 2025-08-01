import { Router } from 'express';
import { 
    getMetodosPago, 
    getMetodoPagoById, 
    createMetodoPago, 
    updateMetodoPago, 
    deleteMetodoPago 
} from '../controllers/metodo_pago.controller.js';

const router = Router();

// Rutas de método de pago
router.get('/', getMetodosPago);
router.get('/:id', getMetodoPagoById);
router.post('/', createMetodoPago);
router.put('/:id', updateMetodoPago);
router.delete('/:id', deleteMetodoPago);

export default router; 