import { Router } from 'express';
import { 
    getRestaurantes, 
    getRestauranteById, 
    createRestaurante, 
    updateRestaurante, 
    deleteRestaurante 
} from '../controllers/restaurantes.controller.js';

const router = Router();

// Rutas de restaurantes
router.get('/', getRestaurantes);
router.get('/:id', getRestauranteById);
router.post('/', createRestaurante);
router.put('/:id', updateRestaurante);
router.delete('/:id', deleteRestaurante);

export default router; 