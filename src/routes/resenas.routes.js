import { Router } from 'express';
import {
    getResenas,
    getResenaById,
    createResena,
    updateResena,
    deleteResena,
    getResenasByGuia
} from '../controllers/resenas.controller.js';

const router = Router();

// Rutas básicas CRUD
router.get('/', getResenas);
router.get('/:id', getResenaById);
router.post('/', createResena);
router.put('/:id', updateResena);
router.delete('/:id', deleteResena);

// Rutas adicionales
router.get('/guia/:guiaId', getResenasByGuia);

export default router; 