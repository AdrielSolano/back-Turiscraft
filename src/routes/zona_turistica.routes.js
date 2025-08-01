import express from 'express';
import { 
    getZonasTuristicas, 
    getZonaTuristicaById, 
    createZonaTuristica, 
    updateZonaTuristica, 
    deleteZonaTuristica,
    calificarZonaTuristica
} from '../controllers/zona_turistica.controller.js';
import { validateToken } from '../middlewares/validateToken.js';

const router = express.Router();

// Rutas públicas
router.get('/', getZonasTuristicas);
router.get('/:id', getZonaTuristicaById);

// Rutas protegidas (requieren autenticación)
router.post('/', validateToken, createZonaTuristica);
router.post('/:id/calificar', validateToken, calificarZonaTuristica);
router.put('/:id', validateToken, updateZonaTuristica);
router.delete('/:id', validateToken, deleteZonaTuristica);

export default router;