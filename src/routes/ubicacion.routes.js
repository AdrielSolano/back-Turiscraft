import { Router } from 'express';
import { 
    getUbicaciones, 
    getUbicacionById, 
    createUbicacion, 
    updateUbicacion, 
    deleteUbicacion 
} from '../controllers/ubicacion.controller.js';

const router = Router();

// Rutas de ubicación
router.get('/', getUbicaciones);
router.get('/:id', getUbicacionById);
router.post('/', createUbicacion);
router.put('/:id', updateUbicacion);
router.delete('/:id', deleteUbicacion);

export default router; 