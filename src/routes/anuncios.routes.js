import { Router } from 'express';
import {
    getAnuncios,
    getAnuncioById,
    createAnuncio,
    updateAnuncio,
    deleteAnuncio
} from '../controllers/anuncios.controller.js';

const router = Router();

// Rutas básicas CRUD
router.get('/', getAnuncios);
router.get('/:id', getAnuncioById);
router.post('/', createAnuncio);
router.put('/:id', updateAnuncio);
router.delete('/:id', deleteAnuncio);

export default router; 