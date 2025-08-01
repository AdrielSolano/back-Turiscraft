import { Router } from 'express';
import { 
    getCategorias, 
    getCategoriaById, 
    createCategoria, 
    updateCategoria, 
    deleteCategoria 
} from '../controllers/categoria.controller.js';

const router = Router();

// Rutas de categoría
router.get('/', getCategorias);
router.get('/:id', getCategoriaById);
router.post('/', createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);

export default router; 