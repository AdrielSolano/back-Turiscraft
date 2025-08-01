import { Router } from 'express';
import { 
    getMonedas, 
    getMonedaById, 
    createMoneda, 
    updateMoneda, 
    deleteMoneda 
} from '../controllers/moneda.controller.js';

const router = Router();

// Rutas de moneda
router.get('/', getMonedas);
router.get('/:id', getMonedaById);
router.post('/', createMoneda);
router.put('/:id', updateMoneda);
router.delete('/:id', deleteMoneda);

export default router; 